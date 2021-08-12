import { gql } from '@apollo/client/core';
import { TIME_INTERVALS, TIME_INTERVALS_DATA, DAI } from './constants';

const getTimeBefore = (now: number, interval: number) => {
  return new Date(now - interval).toISOString();
};

export const getIntervalsQuery = () => {
  const timestamp = Date.now();
  return gql`
      query ($tokens: [String!], $exchange: String!, $quote: String!){
          WEEK_1: ethereum(network: ethereum) {
              dexTrades(
                  options: {desc: "tradeAmount"}
                  exchangeAddress: {is: $exchange}
                  time: {since: "${getTimeBefore(
                    timestamp,
                    TIME_INTERVALS_DATA[TIME_INTERVALS.WEEK_1].value
                  )}"}
                  quoteCurrency: {is: $quote}
                  baseCurrency: {in: $tokens}
              ) {
                  baseCurrency {
                      address
                      name
                      symbol,
                      decimals
                  }
                  smartContract {
                      address {
                          address
                      }
                  }
                  buyAmount(in: USD)
                  sellAmount(in: USD)
                  tradeAmount(in: USD)
                  trades: count
                  open_price: minimum(of: time, get: quote_price)
                  high_price: quotePrice(calculate: maximum)
                  low_price: quotePrice(calculate: minimum)
                  close_price: maximum(of: time, get: quote_price)
                  first_trade_time: minimum(of: time)
                  last_trade_time: maximum(of: time)
                  takers: count(uniq: takers)
                  senders: count(uniq: senders)
                  high_price_time: maximum(of: quote_price, get: time)
                  low_price_time: minimum(of: quote_price, get: time)
              }
          },
          DAY_1: ethereum(network: ethereum) {
              dexTrades(
                  options: {desc: "tradeAmount"}
                  exchangeAddress: {is: $exchange}
                  time: {since: "${getTimeBefore(
                    timestamp,
                    TIME_INTERVALS_DATA[TIME_INTERVALS.DAY_1].value
                  )}"}
                  quoteCurrency: {is: $quote}
                  baseCurrency: {in: $tokens}
              ) {
                  baseCurrency {
                      address
                      name
                      symbol,
                      decimals
                  }
                  smartContract {
                      address {
                          address
                      }
                  }
                  buyAmount(in: USD)
                  sellAmount(in: USD)
                  tradeAmount(in: USD)
                  trades: count
                  open_price: minimum(of: time, get: quote_price)
                  high_price: quotePrice(calculate: maximum)
                  low_price: quotePrice(calculate: minimum)
                  close_price: maximum(of: time, get: quote_price)
                  first_trade_time: minimum(of: time)
                  last_trade_time: maximum(of: time)
                  takers: count(uniq: takers)
                  senders: count(uniq: senders)
                  high_price_time: maximum(of: quote_price, get: time)
                  low_price_time: minimum(of: quote_price, get: time)
              }
          },
          HOUR_4: ethereum(network: ethereum) {
              dexTrades(
                  options: {desc: "tradeAmount"}
                  exchangeAddress: {is: $exchange}
                  time: {since: "${getTimeBefore(
                    timestamp,
                    TIME_INTERVALS_DATA[TIME_INTERVALS.HOUR_4].value
                  )}"}
                  quoteCurrency: {is: $quote}
                  baseCurrency: {in: $tokens}
              ) {
                  baseCurrency {
                      address
                      name
                      symbol,
                      decimals
                  }
                  smartContract {
                      address {
                          address
                      }
                  }
                  buyAmount(in: USD)
                  sellAmount(in: USD)
                  tradeAmount(in: USD)
                  trades: count
                  open_price: minimum(of: time, get: quote_price)
                  high_price: quotePrice(calculate: maximum)
                  low_price: quotePrice(calculate: minimum)
                  close_price: maximum(of: time, get: quote_price)
                  first_trade_time: minimum(of: time)
                  last_trade_time: maximum(of: time)
                  takers: count(uniq: takers)
                  senders: count(uniq: senders)
                  high_price_time: maximum(of: quote_price, get: time)
                  low_price_time: minimum(of: quote_price, get: time)
              }
          },
          HOUR_1: ethereum(network: ethereum) {
              dexTrades(
                  options: {desc: "tradeAmount"}
                  exchangeAddress: {is: $exchange}
                  time: {since: "${getTimeBefore(
                    timestamp,
                    TIME_INTERVALS_DATA[TIME_INTERVALS.HOUR_1].value
                  )}"}
                  quoteCurrency: {is: $quote}
                  baseCurrency: {in: $tokens}
              ) {
                  baseCurrency {
                      address
                      name
                      symbol,
                      decimals
                  }
                  smartContract {
                      address {
                          address
                      }
                  }
                  buyAmount(in: USD)
                  sellAmount(in: USD)
                  tradeAmount(in: USD)
                  trades: count
                  open_price: minimum(of: time, get: quote_price)
                  high_price: quotePrice(calculate: maximum)
                  low_price: quotePrice(calculate: minimum)
                  close_price: maximum(of: time, get: quote_price)
                  first_trade_time: minimum(of: time)
                  last_trade_time: maximum(of: time)
                  takers: count(uniq: takers)
                  senders: count(uniq: senders)
                  high_price_time: maximum(of: quote_price, get: time)
                  low_price_time: minimum(of: quote_price, get: time)
              }
          },
          MINUTE_15: ethereum(network: ethereum) {
              dexTrades(
                  options: {desc: "tradeAmount"}
                  exchangeAddress: {is: $exchange}
                  time: {since: "${getTimeBefore(
                    timestamp,
                    TIME_INTERVALS_DATA[TIME_INTERVALS.MINUTE_15].value
                  )}"}
                  quoteCurrency: {is: $quote}
                  baseCurrency: {in: $tokens}
              ) {
                  baseCurrency {
                      address
                      name
                      symbol,
                      decimals
                  }
                  smartContract {
                      address {
                          address
                      }
                  }
                  buyAmount(in: USD)
                  sellAmount(in: USD)
                  tradeAmount(in: USD)
                  trades: count
                  open_price: minimum(of: time, get: quote_price)
                  high_price: quotePrice(calculate: maximum)
                  low_price: quotePrice(calculate: minimum)
                  close_price: maximum(of: time, get: quote_price)
                  first_trade_time: minimum(of: time)
                  last_trade_time: maximum(of: time)
                  takers: count(uniq: takers)
                  senders: count(uniq: senders)
                  high_price_time: maximum(of: quote_price, get: time)
                  low_price_time: minimum(of: quote_price, get: time)
              }
          }
      }

  `;
};

export const GET_VOLUME = gql`
  query (
    $date: ISO8601DateTime
    $limit: Int
    $exchange: String!
    $quote: String!
  ) {
    ethereum(network: ethereum) {
      dexTrades(
        options: { desc: "tradeAmount", limit: $limit }
        exchangeAddress: { is: $exchange }
        time: { since: $date }
        quoteCurrency: { is: $quote }
      ) {
        baseCurrency {
          address
          name
          symbol
          decimals
        }
        smartContract {
          address {
            address
          }
        }
        buyAmount(in: USD)
        sellAmount(in: USD)
        tradeAmount(in: USD)
        trades: count
        open_price: minimum(of: time, get: quote_price)
        high_price: quotePrice(calculate: maximum)
        low_price: quotePrice(calculate: minimum)
        close_price: maximum(of: time, get: quote_price)
        first_trade_time: minimum(of: time)
        last_trade_time: maximum(of: time)
        takers: count(uniq: takers)
        senders: count(uniq: senders)
        high_price_time: maximum(of: quote_price, get: time)
        low_price_time: minimum(of: quote_price, get: time)
      }
    }
  }
`;

export const CHART_DATA_QUERY = gql`
    query ($date: ISO8601DateTime, $exchange: String!, $quote: String!, $base: String!, $hour: Int!) {
        CHART_DATA: ethereum(network: ethereum) {
            dexTrades(
                exchangeAddress: {is: $exchange}
                time: {since: $date}
                quoteCurrency: {is: $quote}
                baseCurrency: {is: $base}
            ) {
                baseCurrency {
                    address
                    name
                    symbol
                    decimals
                }
                smartContract {
                    address {
                        address
                    }
                }
                buyAmount(in: USD)
                sellAmount(in: USD)
                tradeAmount(in: USD)
                trades: count
                open: minimum(of: time, get: quote_price)
                high: quotePrice(calculate: maximum)
                low: quotePrice(calculate: minimum)
                close: maximum(of: time, get: quote_price)
                timeInterval {
                    hour(count: $hour, format: "%Y-%m-%dT%H:%M:%SZ")
                }
            }
        }
        USD_DATA: ethereum(network: ethereum) {
            dexTrades(
                exchangeAddress: {is: $exchange}
                time: {since: $date}
                quoteCurrency: {is: $quote}
                baseCurrency: {is: "${DAI}"}
            ) {
                baseCurrency {
                    address
                    name
                    symbol
                    decimals
                }
                smartContract {
                    address {
                        address
                    }
                }
                buyAmount(in: USD)
                sellAmount(in: USD)
                tradeAmount(in: USD)
                trades: count
                open: minimum(of: time, get: quote_price)
                high: quotePrice(calculate: maximum)
                low: quotePrice(calculate: minimum)
                close: maximum(of: time, get: quote_price)
                timeInterval {
                    hour(count: 4, format: "%Y-%m-%dT%H:%M:%SZ")
                }
            }
        }
    }

`;

export const GET_TIME_LAUNCHED = gql`
  query ($pairs: [String!]) {
    ethereum(network: ethereum) {
      transfers(
        currency: { in: $pairs }
        options: {
          asc: "block.height"
          limitBy: { each: "currency.address", limit: 1 }
        }
      ) {
        transaction {
          hash
          txFrom {
            address
          }
        }
        block {
          height
          timestamp {
            unixtime
          }
        }
        currency {
          address
        }
      }
    }
  }
`;
