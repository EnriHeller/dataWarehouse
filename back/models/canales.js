const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Canales = sequelize.define("canales",{
    nombre:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    },
    {
        tableName:"canales",
        underscored: true,
    }
)

module.exports = Canales;