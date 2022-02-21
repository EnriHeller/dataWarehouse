const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Regiones = sequelize.define("regiones",{
    nombre:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    },
    {
        tableName:"regiones",
        underscored: true,
    }
)

module.exports = Regiones;