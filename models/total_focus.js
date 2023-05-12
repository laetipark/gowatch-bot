import Sequelize from "sequelize";

export default class TotalFocus extends Sequelize.Model {
    static init = sequelize => super.init({
        total_time: {
            type: Sequelize.INTEGER,
            allowNull: true,
        }
    }, {
        sequelize,
        timestamps: false,
        underscore: false,
        modelName: 'TotalFocus',
        tableName: 'total_focus',
        paranoid: false,
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci',
    });

    static associate(db) {
    }
}