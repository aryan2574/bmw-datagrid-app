import { Sequelize, Dialect } from "sequelize";
import config from "../config/config.json";

const env = process.env.NODE_ENV || "development";
const dbConfig = config[env as keyof typeof config];

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect as Dialect,
    logging: false,
  }
);

export default sequelize;
