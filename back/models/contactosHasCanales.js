const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Contactos = require ("./contactos.js");
const Canales = require ("./canales.js");

const intereses = [
    "0",
    "25",
    "50",
    "75",
    "100"];

const preferencias = [
    "NO MOLESTAR",
    "ACTIVO",
    "EN EL TRABAJO",
    "AUSENTE"
];

const ContactosHasCanales = sequelize.define("contactos_has_canales", {
    contacto_id : {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "contacto_id",
        references:{
            model: Contactos,
            key: "id",
        },
    },
    canale_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "canale_id",
        references: {
            model: Canales,
            key: "id",
        },
    },
    interes: {
    type: DataTypes.ENUM(...intereses),
    defaultValue: "0",
    allowNull: false,
    },
    preferencias: {
    type: DataTypes.ENUM(...preferencias),
    defaultValue: "ACTIVO",
    allowNull: false,
    },
    cuenta:{
        type: DataTypes.STRING,
        allowNull: false
    }
    
},
{
    tableName: "contactos_has_canales",
    underscored: true,
    timestamps: false,
}
);




module.exports = ContactosHasCanales;