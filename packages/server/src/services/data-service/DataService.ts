import { MongoClient } from 'mongodb';
import { Response } from 'express';
import { logger } from '../../logger';
import { client } from './bitqueryGraphQLClient';
import {
  BROKEN_ADDRESS,
  BROKEN_NAME,
  DEFAULT_TIMESTAMP,
  TIME_INTERVALS_DATA,
  EXCHANGE,
  QUOTE_CURRENCY,
} from './constants';
import {
  GET_VOLUME,
  GET_TIME_LAUNCHED,
  getIntervalsQuery,
  CHART_DATA_QUERY,
} from './queries';
import { getTokenPoolLiquidity } from './getChainData';
import { getTableData } from './getTableData';
import { getChartData } from './getChartData';
import { ethers } from 'ethers';

type Client = {
  id: string;
  response: any;
};

const ONE_MINUTE = 1000 * 60;
const ONE_HOUR = ONE_MINUTE * 60;
const ONE_DAY = ONE_HOUR * 24;
const VOLUME_TIME_PERIOD = ONE_MINUTE * 60;
const UPDATE_INTERVAL = ONE_MINUTE * 2;

const DB_URL = process.env.MONGODB_URI || '';
const DB_NAME = process.env.MONGODB_NAME || '';

class DataService {
  mongoClient = new MongoClient(DB_URL);
  updateTimeout: NodeJS.Timeout | undefined;
  clients: Client[] = [];
  dataLimit: number = 100;
  data: any; //TODO type data

  init = async (dataLimit: number) => {
    this.dataLimit = dataLimit;

    await this.mongoClient.connect();
    logger.info(`Connected to MongoDB at ${DB_URL}`);

    this.getData();
  };

  addClient(id: string, response: Response) {
    const newClient = { id, response };
    if (this.data) {
      response.write(`data: ${this.data}\n\n`);
    }

    this.clients.push(newClient);
  }

  removeClient(id: string) {
    this.clients = this.clients.filter((client) => client.id !== id);
  }

  sendData = () => {
    logger.info(`Sending data to ${this.clients.length} clients`);
    this.clients.forEach((client) => {
      client.response.write(`data: ${this.data}\n\n`);
    });
  };

  handleError = (message: string, error: any) => {
    logger.error(message, error);
    this.updateTimeout = setTimeout(this.getData, UPDATE_INTERVAL);
  };

  // TODO refactor monolith
  getData = async () => {
    const db = this.mongoClient.db(DB_NAME);
    const tokensCollection = db.collection('tokens');

    const limit = this.dataLimit;
    const date = new Date(Date.now() - VOLUME_TIME_PERIOD).toISOString();

    logger.info('fetching volume data');
    let volumeData;
    try {
      volumeData = await client.query({
        query: GET_VOLUME,
        fetchPolicy: 'network-only',
        variables: { limit, date, exchange: EXCHANGE, quote: QUOTE_CURRENCY },
      });
    } catch (e) {
      this.handleError('Error fetching Volume Data', e);
      return;
    }

    const tokenAddresses = volumeData.data.ethereum.dexTrades.flatMap(
      (volumeData: any) => {
        const tokenAddress = volumeData.baseCurrency.address;
        if (tokenAddress === BROKEN_ADDRESS) {
          // Data includes broken address '-'
          return [];
        }
        return [tokenAddress];
      }
    );

    logger.info('fetching tokens from database');
    let tokensFromDatabase;
    try {
      tokensFromDatabase = await tokensCollection
        .find({ _id: { $in: tokenAddresses } })
        .toArray();
    } catch (e) {
      this.handleError('Error reading from database', e);
      return;
    }

    const tokenLaunchData = tokensFromDatabase.reduce(
      (acc: any, tokenData: any) => {
        const {
          pairAddress,
          timestamp,
          liquidityCreator,
          liquidityTransaction,
        } = tokenData;
        acc[pairAddress] = {
          timestamp,
          liquidityCreator,
          liquidityTransaction,
        };
        return acc;
      },
      {}
    );

    const mappedData = volumeData.data.ethereum.dexTrades.flatMap(
      (volumeData: any) => {
        const tokenAddress = volumeData.baseCurrency.address;
        const tokenName = volumeData.baseCurrency.name;

        if (tokenAddress === BROKEN_ADDRESS || tokenName === BROKEN_NAME) {
          // Data includes broken address '-'
          return [];
        }

        const { name, symbol, decimals } = volumeData.baseCurrency;
        const pairAddress = volumeData.smartContract.address.address;
        const { timestamp, liquidityCreator, liquidityTransaction } =
          tokenLaunchData[pairAddress] || {};

        return [
          {
            ...volumeData,
            tokenAddress,
            name,
            symbol,
            decimals,
            pairAddress,
            timestamp,
            liquidityCreator,
            liquidityTransaction,
          },
        ];
      }
    );
    const dataWithTimes = mappedData.filter(
      ({ timestamp }: any) => !!timestamp
    );

    const missingLaunchInfo = mappedData.filter(
      ({ timestamp }: any) => !timestamp
    );

    logger.info('fetching info for new tokens');
    let launchInfo;
    let fetchedTokenLaunchInfo = {};
    let dataWithFetchedTimes = [];
    try {
      if (missingLaunchInfo.length) {
        launchInfo = await client.query({
          query: GET_TIME_LAUNCHED,
          variables: {
            pairs: missingLaunchInfo.map(({ pairAddress }: any) => pairAddress),
          },
        });
        fetchedTokenLaunchInfo = launchInfo.data.ethereum.transfers.reduce(
          (
            acc: any,
            {
              block: {
                timestamp: { unixtime },
              },
              currency: { address },
              transaction: { hash, txFrom },
            }: any
          ) => {
            acc[address] = {
              timestamp: unixtime,
              liquidityTransaction: hash,
              liquidityCreator: txFrom.address,
            };
            return acc;
          },
          {}
        );
        dataWithFetchedTimes = missingLaunchInfo.flatMap(
          (dataFragment: any) => {
            // @ts-ignore
            const launchInfo = fetchedTokenLaunchInfo[dataFragment.pairAddress];
            if (!launchInfo) {
              return [];
            }

            const timestamp = launchInfo.timestamp || DEFAULT_TIMESTAMP;
            const liquidityCreator = launchInfo.liquidityCreator;
            const liquidityTransaction = launchInfo.liquidityTransaction;

            return [
              {
                ...dataFragment,
                timestamp,
                liquidityCreator,
                liquidityTransaction,
                fresh: true,
              },
            ]; //TODO refactor
          }
        );
      }
    } catch (e) {
      this.handleError('Error fetching info for new tokens', e);
      return;
    }

    const newData = [...dataWithTimes, ...dataWithFetchedTimes];

    logger.info('fetching intervals data');
    let intervalsData: any;
    try {
      intervalsData = await client.query({
        query: getIntervalsQuery(),
        fetchPolicy: 'network-only',
        variables: {
          tokens: newData.map(({ tokenAddress }) => tokenAddress),
          exchange: EXCHANGE,
          quote: QUOTE_CURRENCY,
        },
      });
    } catch (e) {
      this.handleError('Error fetching intervals Data', e);
      return;
    }

    const intervalDataByToken = Object.values(TIME_INTERVALS_DATA).reduce(
      (acc: any, { id: intervalId }) => {
        const intervalData = intervalsData.data[intervalId].dexTrades;

        intervalData.forEach((intervalDataItem: any) => {
          const {
            baseCurrency: { address },
          } = intervalDataItem;
          acc[address] = {
            ...(acc[address] || {}),
            [intervalId]: intervalDataItem,
          };
        });

        return acc;
      },
      {}
    );

    logger.info('fetching onchain data');
    let chainData: any;
    try {
      chainData = await getTokenPoolLiquidity(
        newData.map(({ tokenAddress, pairAddress, liquidityCreator }) => ({
          tokenAddress,
          pairAddress,
          liquidityCreator,
        }))
      );
    } catch (e) {
      this.handleError('Error fetching onchain data', e);
      return;
    }

    const newDataWithAdditionalData = newData.map((dataFragment) => {
      return {
        ...dataFragment,
        ...chainData[dataFragment.tokenAddress],
        ...intervalDataByToken[dataFragment.tokenAddress],
      };
    });
    const tableData = getTableData(newDataWithAdditionalData);

    this.data = JSON.stringify(tableData);
    this.sendData();

    if (dataWithFetchedTimes.length) {
      logger.info('writing new data to db');
      const dataToInsert = dataWithFetchedTimes.flatMap((dataItem: any) => {
        const {
          tokenAddress,
          name,
          symbol,
          decimals,
          pairAddress,
          timestamp,
          liquidityCreator,
          liquidityTransaction,
        } = dataItem;
        return timestamp === DEFAULT_TIMESTAMP
          ? []
          : [
              {
                _id: tokenAddress,
                tokenAddress,
                name,
                symbol,
                decimals,
                pairAddress,
                timestamp,
                liquidityCreator,
                liquidityTransaction,
              },
            ];
      });

      try {
        tokensCollection.insertMany(dataToInsert, { ordered: false });
      } catch (e) {
        this.handleError('Error writing to database', e);
        return;
      }
    }

    this.updateTimeout = setTimeout(this.getData, UPDATE_INTERVAL);
  };

  getChart = async (tokenAddress: string) => {
    logger.info(`fetching chart data for ${tokenAddress}`);
    if (!ethers.utils.isAddress(tokenAddress)) {
      return null; //TODO handle error
    }
    const db = this.mongoClient.db(DB_NAME);
    const tokensCollection = db.collection('tokens');
    const tokenInfoFromDB = await tokensCollection.findOne({
      _id: tokenAddress,
    });

    const now = Date.now();
    let date = new Date(now - ONE_DAY * 30).toISOString();
    let hour = 4;
    if (tokenInfoFromDB?.timestamp) {
      const offset = now - tokenInfoFromDB.timestamp * 1000;
      if (offset < ONE_DAY * 30) {
        date = new Date(tokenInfoFromDB?.timestamp).toISOString();
      }
      if (offset < ONE_DAY * 7) {
        hour = 1;
      }
    }

    let queryData;
    try {
      queryData = await client.query({
        query: CHART_DATA_QUERY,
        fetchPolicy: 'network-only',
        variables: {
          date,
          exchange: EXCHANGE,
          quote: QUOTE_CURRENCY,
          base: tokenAddress,
          hour,
        },
      });

      return getChartData(queryData);
    } catch (e) {
      logger.error(`Error fetching chart for ${tokenAddress}`);
      return null;
    }
  };
}

export default new DataService();
