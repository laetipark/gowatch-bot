import Sequelize from "sequelize";

export default class StatusVoice extends Sequelize.Model {
    static init = sequelize => super.init({
        channel: {
            type: Sequelize.STRING(20),
            allowNull: true,
        },
        begin_time: {
            type: Sequelize.DATE,
            allowNull: false,
        },
    }, {
        sequelize,
        timestamps: false,
        underscore: false,
        modelName: 'StatusVoice',
        tableName: 'status_voice',
        paranoid: false,
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci',
    });

    static associate(db) {
    }
}