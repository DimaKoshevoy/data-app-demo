import {createLogger, format, transports} from 'winston';

export const logger = createLogger({
  transports: [
    new transports.Console({
      level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
      format: format.combine(
        format.colorize(),
        format.timestamp({
          format: 'YYYY-MM-DD HH:mm:ss',
        }),
        format.printf(
          info => {
            return `${info.timestamp} ${info.level}: ${info.message}`
          }
        )
      ),
    })
  ],
});
