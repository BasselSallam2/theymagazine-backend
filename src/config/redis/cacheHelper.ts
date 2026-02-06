import type { Model } from "mongoose";
import { redisConnectionOptions } from "./reduisConnection";
import { Redis } from "ioredis";
import SHA256 from "crypto-js/sha256.js";
import encHex from "crypto-js/enc-hex.js";

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

function hashString(str) {
  return SHA256(str).toString(encHex);
}

const redis = new Redis(redisConnectionOptions());
export async function clearByPattern(pattern: string) {
    let cursor = "0";
    do {
        const [nextCursor, keys] = await redis.scan(cursor, "MATCH", pattern, "COUNT", 100);
        cursor = nextCursor;
        if (keys.length > 0) {
            await redis.del(keys);
            console.log(`Deleted ${keys.length} keys matching ${pattern}`);
        }
    } while (cursor !== "0");
}

export const getPattern = (MongooseModel: Model<any> , MongooseQuery:any , id?:string) => {
      const cryptedQuery = hashString(MongooseQuery);
      return `${MongooseModel.modelName}:${cryptedQuery}`
}

export const clearPattern = (MongooseModel: Model<any>) => {
    clearByPattern(`*:${MongooseModel.modelName}:*`);
}