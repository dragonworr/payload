import falsey from 'falsey';
import pino from 'pino';
import memoize from 'micro-memoize';
import { PayloadLogger } from '../types';

export default memoize((name = 'payload') => pino({
  name,
  enabled: falsey(process.env.DISABLE_LOGGING),
  prettyPrint: {
    ignore: 'pid,hostname',
    translateTime: 'HH:MM:ss',
  },
}) as PayloadLogger);
