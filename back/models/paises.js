const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Paises = sequelize.define("paises",{
    nombre:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    },
    {
        tableName:"paises",
        underscored: true,
    }
)

module.exports = Paises;