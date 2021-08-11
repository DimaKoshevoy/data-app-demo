import findWorkspaceRoot from 'find-yarn-workspace-root';
import dotenv from 'dotenv';
import path from 'path';

const workspaceRoot = findWorkspaceRoot();
if (!workspaceRoot) {
  throw new Error('No workspace Root');
}
dotenv.config({
  path: path.join(workspaceRoot, '.env'),
});

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import helmet from 'helmet';
import contentSecurityPolicy from 'helmet-csp';
import { randomUUID } from 'crypto';
import { logger } from './logger';
import DataService from './services/data-service/DataService';

const DEFAULT_PORT = 8000;
const DEFAULT_ORIGIN = '*';
const PORT = process.env.PORT || DEFAULT_PORT;
const ORIGIN = process.env.ORIGIN || DEFAULT_ORIGIN;

const app = express();
app.use(helmet());
app.use(
  contentSecurityPolicy({
    useDefaults: true,
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'sha256-KbPGqvsMKon/cJBuFN6o7mMo+6J91JeuAswXbrhPh+A='",
      ],
    },
    reportOnly: false,
  })
);

app.use(express.static(path.join(__dirname, '../../client/build')));

app.use(
  cors({
    origin: ORIGIN,
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.listen(PORT, () => {
  logger.info(`Data Server listening on port ${PORT}`);
  DataService.init(250);
});

app.get('/api/subscribe', (request, response) => {
  const headers = {
    'Content-Type': 'text/event-stream',
    Connection: 'keep-alive',
    'Cache-Control': 'no-cache',
  };
  response.writeHead(200, headers);

  const clientId = randomUUID();
  logger.info(`${clientId} Connection established`);
  DataService.addClient(clientId, response);

  request.on('close', () => {
    logger.info(`${clientId} Connection closed`);
    DataService.removeClient(clientId);
  });
});

app.get('/api/chart/:address', async (request, response) => {
  const tokenAddress = request.params.address;

  const chartData = await DataService.getChart(tokenAddress);

  response.send(chartData);
});
