import { getEnv } from '@utils/envHelper'
import mongoose from 'mongoose'
import cache from 'ts-cache-mongoose'
import { redisConnectionOptions } from './reduisConnection';

export const Cache = cache.init(mongoose, {
  defaultTTL: '60 seconds',
  engine: 'redis',
  engineOptions: redisConnectionOptions(),
  debug: getEnv('NODE_ENV') === 'DEVELOPMENT' ? true : false
});



