import dotenv from 'dotenv';
const NODE_ENV = process.env.NODE_ENV || 'development';
NODE_ENV === 'development' && dotenv.config();

import http from 'http';
import { HttpError } from 'http-errors';
import app from './app';
import { redis } from './libs/redis';
import log from './libs/log';

const normalizePort = (val: string): string | number | boolean => {
  const portOrPipe = parseInt(val, 10);

  if (isNaN(portOrPipe)) {
    // named pipe
    return val;
  }

  if (portOrPipe >= 0) {
    // port number
    return portOrPipe;
  }

  return false;
};
// Get port from environment and store in Express.
const port = normalizePort(process.env.PORT || '4000');
app.set('port', port);

// Create HTTP server.
const httpServer = http.createServer(app);

const main = async () => {
  await redis.connect();
  // HTTP Server
  httpServer.listen(port);
  httpServer.on('listening', () => {
    const addr = httpServer.address();
    const bind =
      typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr?.port;
    log.info(`🚀 APIs is listening on ${bind}`);
  });
  httpServer.on('error', (error: HttpError) => {
    if (error.syscall !== 'listen') {
      throw error;
    }
    const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;
    if (error.code === 'EACCES') {
      log.error(`${bind} requires elevated privileges`);
    }
    if (error.code === 'EADDRINUSE') {
      log.error(`${bind} is already in use`);
    }
    process.exit(1);
  });
};

main().catch((error: Error) => log.error('Error', error));

process.on('unhandledRejection', (reason: string) => {
  // I just caught an unhandled promise rejection,
  // since we already have fallback handler for unhandled errors (see below),
  // let throw and let him handle that
  throw reason;
});

process.on('uncaughtException', (error: Error) => {
  // I just received an error that was never handled, time to handle it and then decide whether a restart is needed
  log.error('Error', error);
  process.exit(1);
});
