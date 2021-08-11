import {ApolloClient, createHttpLink, InMemoryCache} from '@apollo/client/core';
import fetch from 'cross-fetch';
import {setContext} from '@apollo/client/link/context';

const ENDPOINT = 'https://graphql.bitquery.io';
const API_KEY = process.env.BITQUERY_API_KEY;

const httpLink = createHttpLink({
  uri: ENDPOINT,
  fetch
});
const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      'X-API-KEY': API_KEY,
    }
  }
});
export const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});
