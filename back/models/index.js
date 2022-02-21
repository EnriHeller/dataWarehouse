const Usuarios= require("./usuarios");
const Contactos= require("./contactos");
const Canales= require("./canales");
const Regiones= require("./regiones");
const Paises= require("./paises");
const Companias= require("./companias");
const Ciudades= require("./ciudades");
const ContactosHasCanales = require("./contactosHasCanales");

Usuarios.hasMany(Contactos, {
    foreignKey: "usuarios_id",
});

Ciudades.belongsTo(Paises, {
    foreignKey: "paises_id",
});

Paises.belongsTo(Regiones, {
    foreignKey: "regiones_id",
});

Companias.belongsTo(Ciudades, {
    foreignKey: "ciudades_id",
});
Companias.belongsTo(Regiones, {
    foreignKey: "regiones_id",
});
Companias.belongsTo(Paises, {
    foreignKey: "paises_id",
});

Contactos.belongsTo(Ciudades, {
    foreignKey: "ciudades_id",
});
Contactos.belongsTo(Paises, {
    foreignKey: "paises_id",
});
Contactos.belongsTo(Regiones, {
    foreignKey: "regiones_id",
});

Contactos.belongsTo(Companias, {
    foreignKey: "companias_id",
});

Contactos.belongsToMany(Canales, {
    through: ContactosHasCanales,
});

module.exports = {
    Usuarios,
    Contactos,
    Regiones,
    Paises,
    Ciudades,
    Companias,
    Canales,
    ContactosHasCanales,
};