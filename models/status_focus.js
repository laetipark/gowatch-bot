import Sequelize from "sequelize";

export default class StatusFocus extends Sequelize.Model {
    static init = sequelize => super.init({
        name: {
            type: Sequelize.STRING(20),
            allowNull: false,
        },
        begin_time: {
            type: Sequelize.DATE,
            allowNull: false,
        },
        timer: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        pause: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
        },
        pause_time: {
            type: Sequelize.DATE,
            allowNull: true,
        },
    }, {
        sequelize,
        timestamps: false,
        underscore: false,
        modelName: 'StatusFocus',
        tableName: 'status_focus',
        paranoid: false,
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci',
    });

    static associate(db) {
    }
}