import { getEnv } from "@utils/envHelper";

export const redisConnectionOptions = () => {
	return {
		host: getEnv("REDISHOST"),
		port: getEnv("REDISPORT"),
		password: getEnv("REDISPASSWORD"),
	};
};
