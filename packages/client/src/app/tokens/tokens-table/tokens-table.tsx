import React, { useCallback, useMemo } from 'react';
import { writeStorage, useLocalStorage } from '@rehooks/local-storage';
import { FixedSizeList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { isNumber } from 'lodash';
import { useTable, useSortBy, useFilters, useBlockLayout } from 'react-table';
import {
  SortAscendingIcon,
  SortDescendingIcon,
  EyeIcon,
  EyeOffIcon,
} from '@heroicons/react/outline';
import classnames from 'classnames';
import { TIME_INTERVALS, TIME_INTERVALS_DATA } from './constants';
import './tokens-table.css';
import { TokenNameFilter } from './components/token-name-filter';
import { formatPrice, getChangePercentage } from '../../utils';
import { HeaderPinned } from './components/header-pinned';
import { TokenCell } from './components/token-cell';
import { LaunchedCell } from './components/launched-cell';
import { LinksCell } from './components/links-cell';
import { TokenData, TokensData } from '../reducer';

type Props = {
  data: TokensData;
};

const TABLE_HEADER_HEIGHT = 36;

const getPercentageTableValue = ({ value }: { value: number }) => (
  <div
    className={`ml-auto truncate overflow-clip ${
      isNumber(value) ? (value > 0 ? 'text-green-500' : 'text-red-500') : ''
    }`}
  >
    {isNumber(value) ? `${Math.abs(value).toFixed()}%` : '-'}
  </div>
);
const getWrappedHeader = (caption: string) => <div>{caption}</div>;

export const TokensTable = React.memo(({ data }: Props) => {
  const [pinned] = useLocalStorage<String[]>('pinned', []);

  const onPinClick = useCallback(
    (address: string) => {
      writeStorage('pinned', [...pinned, address]);
    },
    [pinned]
  );

  const onUnpinClick = useCallback(
    (address: string) => {
      writeStorage(
        'pinned',
        pinned.filter((pinnedAddress) => pinnedAddress !== address)
      );
    },
    [pinned]
  );

  const filterTypes = React.useMemo(
    () => ({
      tokenName: (rows: any, id: any, filterValue: any) => {
        return rows.filter((row: any) => {
          const { name } = row.values[id];
          return name !== undefined
            ? String(name)
                .toLowerCase()
                .includes(String(filterValue).toLowerCase())
            : true;
        });
      },
    }),
    []
  );

  const columns = useMemo(
    () => [
      {
        Header: HeaderPinned,
        accessor: 'pinned',
        disableSortBy: true,
        width: 36,
        Cell: ({
          value,
          row: {
            values: { tokenAddress },
          },
        }: any) => {
          return value ? (
            <EyeOffIcon
              onClick={() => onUnpinClick(tokenAddress)}
              className="m-auto h-4 w-4 clickable"
            />
          ) : (
            <EyeIcon
              onClick={() => onPinClick(tokenAddress)}
              className="m-auto h-4 w-4 clickable"
            />
          );
        },
      },
      {
        Header: 'Address',
        accessor: 'tokenAddress',
      },
      {
        Header: '',
        accessor: 'token',
        width: 420,
        disableSortBy: true,
        Cell: TokenCell,
        Filter: TokenNameFilter,
        filter: 'tokenName',
      },
      {
        Header: <div>Price($)</div>,
        accessor: 'price',
        width: 100,
        sortDescFirst: true,
        sortType: 'basic',
        Cell: ({ value }: any) => (
          <div className="ml-auto">{formatPrice(value)}</div>
        ),
      },
      {
        Header: getWrappedHeader('Liquidity(Ξ)'),
        accessor: 'liquidity',
        sortDescFirst: true,
        width: 140,
        Cell: ({ value }: any) => (
          <div className="ml-auto">{value.toLocaleString('en-GB')}</div>
        ),
      },
      {
        Header: getWrappedHeader('1h Volume($)'),
        accessor: 'volume',
        width: 140,
        sortDescFirst: true,
        Cell: ({ value }: any) => (
          <div className="ml-auto">
            {Math.floor(value).toLocaleString('en-GB')}
          </div>
        ),
      },
      {
        Header: getWrappedHeader('~5m'),
        accessor: 'currentChange',
        sortDescFirst: true,
        width: 80,
        Cell: getPercentageTableValue,
      },
      {
        Header: getWrappedHeader(
          TIME_INTERVALS_DATA[TIME_INTERVALS.MINUTE_15].caption
        ),
        accessor: 'minute15',
        sortDescFirst: true,
        width: 80,
        Cell: getPercentageTableValue,
      },
      {
        Header: getWrappedHeader(
          TIME_INTERVALS_DATA[TIME_INTERVALS.HOUR_1].caption
        ),
        accessor: 'hour1',
        sortDescFirst: true,
        width: 80,
        Cell: getPercentageTableValue,
      },
      {
        Header: getWrappedHeader(
          TIME_INTERVALS_DATA[TIME_INTERVALS.HOUR_4].caption
        ),
        accessor: 'hour4',
        sortDescFirst: true,
        width: 80,
        Cell: getPercentageTableValue,
      },
      {
        Header: getWrappedHeader(
          TIME_INTERVALS_DATA[TIME_INTERVALS.DAY_1].caption
        ),
        accessor: 'day1',
        sortDescFirst: true,
        width: 80,
        Cell: getPercentageTableValue,
      },
      {
        Header: getWrappedHeader(
          TIME_INTERVALS_DATA[TIME_INTERVALS.WEEK_1].caption
        ),
        accessor: 'week1',
        sortDescFirst: true,
        width: 80,
        Cell: getPercentageTableValue,
      },
      {
        Header: 'Launched',
        accessor: 'launch',
        sortDescFirst: true,
        width: 140,
        Cell: LaunchedCell,
      },
      {
        Header: '',
        accessor: 'links',
        width: 80,
        disableSortBy: true,
        Cell: LinksCell,
      },
    ],
    [onPinClick, onUnpinClick]
  );

  const tableData = useMemo(() => {
    const formattedData = data.flatMap((tokenData: TokenData) => {
      const {
        tokenAddress,
        tokenName,
        tokenSymbol,
        // decimals,
        launch,
        liquidity,
        volume,
        close,
        minute15,
        hour1,
        hour4,
        day1,
        week1,
        price,
        creatorLiquidity,
      } = tokenData;
      const currentPrice = price;

      const unlockedLP =
        creatorLiquidity && creatorLiquidity > 1 ? (
          <span className="text-yellow-500">
            {creatorLiquidity.toFixed(1)}% LP owner
          </span>
        ) : null;

      return [
        {
          pinned: pinned.includes(tokenAddress),
          tokenAddress,
          token: {
            address: tokenAddress,
            name: tokenName,
            symbol: tokenSymbol,
            unlockedLP,
          },
          launch,
          liquidity,
          week1: getChangePercentage(week1, currentPrice),
          day1: getChangePercentage(day1, currentPrice),
          hour4: getChangePercentage(hour4, currentPrice),
          hour1: getChangePercentage(hour1, currentPrice),
          minute15: getChangePercentage(minute15, currentPrice),
          currentChange: getChangePercentage(close, currentPrice),
          volume,
          price: currentPrice,
          // ratio: {takers, senders},
          // pulse: {points, high, low, currentPrice}
        },
      ];
    });

    return formattedData;
  }, [data, pinned]);

  const defaultColumn = React.useMemo(
    () => ({
      width: 150,
      Filter: () => null,
    }),
    []
  );

  const { getTableProps, headerGroups, rows, prepareRow, totalColumnsWidth } =
    useTable(
      {
        //@ts-ignore
        columns,
        data: tableData,
        autoResetSortBy: false,
        defaultColumn,
        filterTypes,
        autoResetFilters: false,
        initialState: {
          sortBy: [
            {
              id: 'volume',
              desc: true,
            },
          ],
          hiddenColumns: ['tokenAddress'],
        },
      },
      useFilters,
      useSortBy,
      useBlockLayout
    );

  const rowsWithPinned = useMemo(() => {
    const pinnedRows = rows.filter(({ values: { pinned } }) => !!pinned);
    const regularRows = rows.filter(({ values: { pinned } }) => !pinned);

    return [...pinnedRows, ...regularRows];
  }, [prepareRow, rows]);

  const renderRow = useCallback(
    ({ index, style }) => {
      const row = rowsWithPinned[index];
      prepareRow(row);
      const rowClassName = classnames('row', {
        'row-pinned': row.values?.pinned,
        'row-fresh': row.values?.fresh,
      });

      return (
        <div
          className={rowClassName}
          {...row.getRowProps({
            style: {
              ...row.getRowProps().style,
              ...style,
            },
          })}
        >
          {row.cells.map((cell) => {
            return (
              <div {...cell.getCellProps()} className="p-1 truncate">
                <div className="flex items-center h-full">
                  {cell.render('Cell')}
                </div>
              </div>
            );
          })}
        </div>
      );
    },
    [rowsWithPinned, prepareRow, rows]
  );

  return (
    <div style={{ width: totalColumnsWidth }} className="trade-volume-table">
      <div
        style={{ ...getTableProps().style, height: TABLE_HEADER_HEIGHT }}
        className="flex"
      >
        {headerGroups.map((headerGroup) =>
          headerGroup.headers.map((column) => {
            const headerClasses = classnames('header', {
              'header-sortable': !column.disableSortBy,
              'header-sorted': column.isSorted,
            });
            return (
              <div
                className={headerClasses}
                {...column.getHeaderProps(column.getSortByToggleProps())}
              >
                <div className="h-full flex items-center justify-end">
                  {column.isSorted ? (
                    <div className="ml-1">
                      {column.isSortedDesc ? (
                        <SortDescendingIcon className="h-5 w-5 sort-icon" />
                      ) : (
                        <SortAscendingIcon className="h-5 w-5 sort-icon" />
                      )}
                    </div>
                  ) : (
                    ''
                  )}
                  {column.render('Header')}
                  {column.canFilter ? column.render('Filter') : null}
                </div>
              </div>
            );
          })
        )}
      </div>
      <AutoSizer disableWidth>
        {({ height }) => (
          <FixedSizeList
            height={height - TABLE_HEADER_HEIGHT}
            itemCount={rows.length}
            itemSize={56}
            width={totalColumnsWidth}
            overscanCount={4}
          >
            {renderRow}
          </FixedSizeList>
        )}
      </AutoSizer>
    </div>
  );
});
