import Sequelize from "sequelize";
import Record from "./record.js";

import configFile from "../config/config.js";

const config = configFile.development;
const db = {}

const sequelize =
    new Sequelize(config.database, config.username, config.password, config);
db.sequelize = sequelize;

db.Record = Record;
Record.init(sequelize);
Record.associate(db);

export {db, sequelize}