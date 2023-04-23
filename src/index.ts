import { RedisConnection } from "./main/database/redis.connection";
import { TypeormConnection } from "./main/database/typeorm.connection";
import { Server } from "./main/server/express.server";

// TypeormConnection.init()
//   .then(RedisConnection.connect())
//   .then(Server.run);

Promise.all([
  TypeormConnection.init(),
  RedisConnection.connect(),
]).then(Server.run);
