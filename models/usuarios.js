const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Usuarios = sequelize.define("usuarios",{
    nombre:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    apellido:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    perfil:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    correo:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    
    contrasena:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    esAdmin:{
        field: "esAdmin",
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
    }},{
        tableName:"usuarios",
        underscored: true,
    }
)

module.exports = Usuarios;