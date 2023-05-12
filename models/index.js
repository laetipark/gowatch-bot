import Sequelize from "sequelize";
import StatusFocus from "./status_focus.js";
import StatusVoice from "./status_voice.js";
import TotalFocus from "./total_focus.js";
import TotalVoice from "./total_voice.js";

import configFile from "../config/config.js";

const config = configFile.development;
const db = {}

const sequelize =
    new Sequelize(config.database, config.username, config.password, config);
db.sequelize = sequelize;

db.StatusFocus = StatusFocus;
db.StatusVoice = StatusVoice;
db.TotalFocus = TotalFocus;
db.TotalVoice = TotalVoice;

StatusFocus.init(sequelize);
StatusVoice.init(sequelize);
TotalFocus.init(sequelize);
TotalVoice.init(sequelize);

StatusFocus.associate(db);
StatusVoice.associate(db);
TotalFocus.associate(db);
TotalVoice.associate(db);

export {db, sequelize}