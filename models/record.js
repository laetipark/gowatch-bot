import Sequelize from "sequelize";

export default class Record extends Sequelize.Model {
    static init = sequelize => super.init({
        start: {
            type: Sequelize.DATE,
            allowNull: false,
        },
        content: {
            type: Sequelize.STRING(20),
            allowNull: true,
        }
    }, {
        sequelize,
        timestamps: false,
        underscore: false,
        modelName: 'Record',
        tableName: 'record',
        paranoid: false,
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci',
    });

    static associate(db) {
    }
}