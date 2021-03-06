## Demo Data App

This app is leveraging Bitquery GraphQL API and onchain data via JSON-RPC to provide up to date DEX trading data from Uniswap v2 protocol on Ethereum Mainnet.

![Demo Tokens List](/docs/demo-token-list.png)

Price chart is using Lightweigh TradinView charting library

![Demo Tokens Chart](/docs/demo-token-chart.png)

## Installation

This repo is structured using yarn workspaces, with packages for both `server` and `client` code

In order to run this app localy, you need to run following commands and provide `.env` file with
`MONGODB_URI`
`MONGODB_NAME`
`BITQUERY_API_KEY`
`RPC_URL`
in root folder.

```bash
yarn install
```
```bash
yarn run start
```

Running this commands will start app on port `8000`

Alternatively demo is available at [https://demo-data-app.herokuapp.com/](https://demo-data-app.herokuapp.com/)

Be aware of strict API Limits for Bitquery free account.
