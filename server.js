//LIBRARIES
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const {preferencias} = require("./models/contactosHasCanales");
const {intereses} = require("./models/contactosHasCanales");

//MODELS
const {
    Usuarios,
    Contactos,
    Regiones,
    Paises,
    Ciudades,
    Companias,
    Canales,
    ContactosHasCanales,
} = require("./models/index");

////CONSTANTS
const PORT = process.env.SERVER_PORT;
const JWT_SECRET = process.env.JWT_SECRET;

//INSTANCES
const server = express();

////MIDDLEWARES DEFINITIONS
const logger = (req, res, next) => {
    const path = req.path;
    const method = req.method;
    const body = req.body;
    const params = req.params;
    console.log(req);
    console.log(` 
    ${method} -
    ${path} -
    ${JSON.stringify(body)} -
    ${JSON.stringify(params)}`); 
    next();
}; 

const signInValidation = async (req, res, next) => {
    const posibleUsuario = {
        nombre,
        apellido,
        correo,
        perfil,
        contrasena,
    } = req.body;
    
    const userInDb = await Usuarios.findOne({
        attributes: ["correo"],
        $or: [{correo: posibleUsuario.correo}]
    })
    if(userInDb){
        if(userInDb.correo == posibleUsuario.correo){
            res.status(401);
            res.json({error: "El correo electronico ingresado no se encuentra disponible"})
        }else{
            next()
        }
    }else{
        next()
    }
    
}

const regionValidation = async (req, res, next) => {
    const posibleRegion = {
        nombre
    } = req.body;
    
    const regionInDb = await Regiones.findOne({
        attributes: ["nombre"],
        $or: [{nombre: posibleRegion.nombre}]
    })
    if(regionInDb){
        if(regionInDb.nombre == posibleRegion.nombre){
            res.status(401);
            res.json({error: "El nombre de la región ingresada no se encuentra disponible"})
        }else{
            next()
        }
    }else{
        next()
    }
}

const paisValidation = async (req, res, next) => {
    const posiblePais = {
        nombre,
        regiones_id
    } = req.body;
    
    const paisInDb = await Paises.findOne({
        attributes: ["nombre"],
        $or: [{nombre: posiblePais.nombre}]
    })

    const regionInDb = await Regiones.findOne({
        where: {id: posiblePais.regiones_id}
    })

    if(paisInDb || regionInDb == null){
        if(paisInDb.nombre == posiblePais.nombre){
            res.status(401);
            res.json({error: "El nombre del pais ingresado no se encuentra disponible"})
        }else if(regionInDb == null){
            res.status(401);
            res.json({error: "No existe la región especificada"})
        }
        else{
            next()
        }
    }else{
        next()
    }
}

const ciudadValidation = async (req, res, next) => {
    const posibleCiudad = {
        nombre,
        paises_id
    } = req.body;
    
    const ciudadInDb = await Ciudades.findOne({
        where:{nombre: posibleCiudad.nombre}
    })

    const paisInDb = await Paises.findOne({
        where: {id: posibleCiudad.paises_id}
    })

    if(ciudadInDb){
        if(ciudadInDb.nombre == posibleCiudad.nombre){
            res.status(401);
            res.json({error: "El nombre de la ciudad ya existe"})
        }else{
            next()
        }
    }else if(!paisInDb){
        res.status(401);
        res.json({error: "No existe el pais especificado"})
    }else{
        next()
    }
}

const contactoValidation = async (req, res, next) => {
    const posibleContacto = {
        correo,
        ciudades_id
    } = req.body;
    
    const contactoInDb = await Contactos.findOne({
        where:{correo: correo}
    })

    const ciudadInDb = await Ciudades.findOne({
        where: {id: posibleContacto.ciudades_id}
    })

    if(contactoInDb){
        if(contactoInDb.correo == posibleContacto.correo){
            res.status(401);
            res.json({error: "El correo ingresado no se encuentra disponible"})
        }
        else{
            next()
        }
    }else if(!ciudadInDb){
        res.status(401);
            res.json({error: "Debe especificar la ciudad para continuar"})
    }else{
        next()
    }
}

const adminValidation = async (req, res, next)=>{
    try {
        const comprobation = await Usuarios.findOne({
            where: {id: req.user.id, esAdmin: true}
        });
    
        if(comprobation){
            next();
        }else{
            res.status(401);
            res.json({error: "Acceso denegado"});
        }
        
    } catch (error) {
        res.status(500).json({error: "Error, intentelo de nuevo más tarde"});
    }
}

const limiter = rateLimit({
    windowMs: 120 * 1000, //60 segundos
    max: 5,
    message: "Excediste el numero de peticiones, intenta mas tarde",
});

////GlOBAL MIDDLEWARES
server.use(express.json());
/* server.use(logger);  */
server.use(cors());
server.use(helmet());
server.use(compression());

server.use(
    expressJwt({
        secret: JWT_SECRET,
        algorithms: ["HS256"],
    }).unless({
        path: ["/logIn"],
    })
);  

////ENDPOINTS

//SIGN IN
server.post("/signIn",signInValidation, adminValidation, async (req, res)=>{
    const newUser = {nombre, apellido, correo, perfil, contrasena, esAdmin} = req.body;
    Usuarios.create(newUser)
    .then(()=>{
        res.status(200);
        res.json("Usuario creado con éxito")
    })
    .catch((error=>{
        res.status(400);
            res.json(error.message);
    }));
});

//LOGIN
server.post("/logIn",limiter, async(req, res) =>{
    const {posibleCorreo, posibleContrasena} = req.body;

    const posibleUsuario = await Usuarios.findOne({
        where: {correo: posibleCorreo, contrasena: posibleContrasena}
    });

    if(posibleUsuario){
        const token = jwt.sign(
            {id: posibleUsuario.id},
            JWT_SECRET,
            {expiresIn: "24h"}
        );
        res.status(200).json(token);
    }else{
        res.status(401).json("Correo o contraseña invalidos. Intente nuevamente")
    }
    
})

//OBTENER TODOS LOS USUARIOS
server.get("/usuarios",adminValidation, async (req, res) => {
    const usersArray = await Usuarios.findAll()

    const usuarios = await usersArray.map((user)=>{
        return{
            usuario: {
                id: user.id,
                nombre: user.nombre,
                apellido: user.apellido,
                correo: user.correo,
                perfil: user.perfil
            }
        }
    })
    res.json(usuarios);
    res.status(200);
});

//MODIFICAR USUARIO
server.put("/usuarios/:id", adminValidation, async(req,res)=>{
    idUsuario = req.params.id;
    const {nombre,apellido, correo, perfil,contrasena} = req.body;
    try {
        await Usuarios.update({nombre,apellido, correo, perfil,contrasena}, {where:{id: idUsuario}});
        const usuario = await Usuarios.findOne({where: {id: idUsuario}});

        if(usuario !== null){
            res.status(200).json(usuario)
        }else{
            throw new Error(`No existe un usuario con id ${idUsuario}`)
        }

    }catch (error) {
        res.status(400).json({error: error.message})
    }
})

//ELIMINAR USUARIO
server.delete("/usuarios/:id",adminValidation, async (req,res) =>{
    const idUsuario = req.params.id;
    
    const posibleUsuario = await Usuarios.findOne({
        where: {
            id:idUsuario,
        }
    })

    if(!posibleUsuario){
        res.status(404).json({
            error: `No existe usuario con id ${idUsuario}`
        });
    }else{  
        await Usuarios.destroy({
            where: {
                id: idUsuario,
            }
        });
    } 

    res.status(200).json("El usuario fue eliminado");
});

//OBTENER REGIONES
server.get("/regiones", async(req,res)=>{
    try {
        const regiones = await Regiones.findAll();
        res.status(200).json(regiones)
    } catch (error) {
        res.status(400).json(error.message)
    }
});

//NUEVA REGION
server.post("/regiones", adminValidation, regionValidation, async(req,res)=>{
    try {
        const {nombre} = req.body;
        const nuevoElemento = await Regiones.create({
            nombre
        });
        res.status(201).json(nuevoElemento);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
})

//MODIFICAR REGION
server.put("/regiones/:id", adminValidation, async(req,res)=>{
    idRegion = req.params.id;
    const {nombre} = req.body;
    try {
        const region = await Regiones.findOne({where: {id: idRegion}});

        if(region !== null){
            await Regiones.update({nombre}, {where:{id: idRegion}});
            res.status(200).json(region)
        }else{
            throw new Error(`No existe una region con id ${idRegion}`)
        }

    }catch (error) {
        res.status(400).json({error: error.message})
    }
})

//ELIMINAR REGION
server.delete("/regiones/:id",adminValidation, async (req,res) =>{
    const idRegion = req.params.id;
    
    try {
        const posibleRegion = await Regiones.findOne({
            where: {
                id:idRegion,
            }
        })
    
        if(!posibleRegion){
            res.status(404).json({
                error: `No existe region con id ${idRegion}`
            });
        }else{  
            const paisesDeLaRegion = await Paises.findAll({
                where: {
                    regiones_id: idRegion
                }
            })
            const paisesId = paisesDeLaRegion.map(pais =>{
                return pais.id
            })
    
            const ciudadesPais = await Ciudades.findAll({
                where:{paises_id: paisesId}
            })
            const idCiudadesPais = ciudadesPais.map(ciudad =>{
                return ciudad.id
            })
        
            const contactosCiudad = await Contactos.findAll({
                where:{ciudades_id: idCiudadesPais}
            })
    
            const contactosId = contactosCiudad.map(contacto =>{
                return contacto.id
            })
    
            await ContactosHasCanales.destroy({
                where: {contacto_id: contactosId}
            })
    
            await Contactos.destroy({
                where: {ciudades_id: idCiudadesPais}
            })
    
            await Companias.destroy({
                where: {ciudades_id: idCiudadesPais}
            })
            
            await Ciudades.destroy({
                where: {
                    paises_id: paisesId,
                }
            }); 
    
            await Paises.destroy({
                where: {
                    regiones_id: idRegion,
                }
            }); 
    
            await Regiones.destroy({
                where: {
                    id: idRegion,
                }
            });
        } 
    
        res.status(200).json("La region fue eliminada");
    } catch (error) {
        res.status(400).json(error.message)
    }
});

//NUEVO PAIS
server.post("/paises", adminValidation, paisValidation, async (req, res) => {
    try {
        const {nombre, regiones_id} = req.body;

        const nuevoPais = await Paises.create({
            nombre,
            regiones_id,
        });
        res.status(201).json(nuevoPais);   
    } catch (error) {
        res.status(400).json(error.message)
    }
});

//MODIFICAR PAIS
server.put("/paises/:id", adminValidation, async(req,res)=>{
    idPais = req.params.id;
    const {nombre, regiones_id} = req.body;
    try {
        await Paises.update({nombre, regiones_id}, {where:{id: idPais}});
        const pais = await Paises.findOne({where: {id: idPais}});
        res.status(200).json(pais)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
})

//ELIMINAR PAIS
server.delete("/paises/:id",adminValidation, async (req,res) =>{
    const idPais = req.params.id;
    
    const posiblePais = await Paises.findOne({
        where: {
            id:idPais,
        }
    })

    if(!posiblePais){
        res.status(404).json({
            error: `No existe pais con id ${idPais}`
        });
    }else{ 
        
        const ciudadesPais = await Ciudades.findAll({
            where:{paises_id: idPais}
        })
        const idCiudadesPais = ciudadesPais.map(ciudad =>{
            return ciudad.id
        })
    
        const contactosCiudad = await Contactos.findAll({
            where:{ciudades_id: idCiudadesPais}
        })

        const contactosId = contactosCiudad.map(contacto =>{
            return contacto.id
        })

        await ContactosHasCanales.destroy({
            where: {contacto_id: contactosId}
        })

        await Contactos.destroy({
            where: {ciudades_id: idCiudadesPais}
        })

        await Companias.destroy({
            where: {ciudades_id: idCiudadesPais}
        })
        
        await Ciudades.destroy({
            where: {
                paises_id: idPais,
            }
        }); 

        await Paises.destroy({
            where: {
                id: idPais,
            }
        });
    } 

    res.status(200).json("El pais fue eliminado");
});

//OBTENER PAISES POR REGION ID
server.get("/paises/:idRegion", async(req,res)=>{
    const idRegion = req.params.idRegion
    try {
        const paises = await Paises.findAll({where:{regiones_id: idRegion}});
        res.status(200).json(paises)
    } catch (error) {
        res.status(400).json(error.message)
    }
});

//NUEVA CIUDAD
server.post("/ciudades", adminValidation, ciudadValidation, async (req, res) => {
    try {
        const {nombre, paises_id} = req.body;
        const nuevaCiudad = await Ciudades.create({
            nombre,
            paises_id,
        });
        res.status(201).json(nuevaCiudad);   
    } catch (error) {
        res.status(400).json(error.message)
    }
});

//MODIFICAR CIUDAD
server.put("/ciudades/:id", adminValidation, async(req,res)=>{
    idCiudad = req.params.id;
    const {nombre, paises_id} = req.body;
    try {
        await Ciudades.update({nombre, paises_id}, {where:{id: idCiudad}});
        const ciudad = await Ciudades.findOne({where: {id: idCiudad}});
        res.status(200).json(ciudad)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
})

//ELIMINAR CIUDAD
server.delete("/ciudades/:id",adminValidation, async (req,res) =>{
    const idCiudad = req.params.id;
    
    try {
        const posibleCiudad= await Ciudades.findOne({
            where: {
                id:idCiudad,
            }
        })
    
        if(!posibleCiudad){
            res.status(404).json({
                error: `No existe ciudad con id ${idCiudad}`
            });
        }else{  
            const contactosCiudad = await Contactos.findAll({
                where:{ciudades_id: idCiudad}
            })
        

            const contactosId = contactosCiudad.map(contacto =>{
                return contacto.id
            })

            await ContactosHasCanales.destroy({
                where: {contacto_id: contactosId}
            })

            await Contactos.destroy({
                where: {ciudades_id: idCiudad}
            })

            await Companias.destroy({
                where: {ciudades_id: idCiudad}
            })
            
            await Ciudades.destroy({
                where: {
                    id:idCiudad,
                }
            }); 
        } 
    
        res.status(200).json("La Ciudad fue eliminada");
    } catch (error) {
        res.status(400).json(error.message)
    }

});

//OBTENER CIUDADES POR PAIS ID
server.get("/ciudades/:idPais", async(req,res)=>{
    const idPais = req.params.idPais
    try {
        const ciudades = await Ciudades.findAll({where:{paises_id: idPais}});
        res.status(200).json(ciudades)
    } catch (error) {
        res.status(400).json(error.message)
    }
});

//BUSCADOR
server.get("/buscar/:input", async (req, res)=>{
    const input = req.params.input

    let correo= await Contactos.findAll({
    where: {correo: input},
    include: [
        { model: Canales, attributes: ["id", "nombre"] },
        { model: Ciudades, attributes: ["nombre"] },
        { model: Companias, attributes: ["nombre"] },
    ],
    })
    let nombre= await Contactos.findAll({
    where: {nombre: input},
    include: [
        { model: Canales, attributes: ["id", "nombre"] },
        { model: Ciudades, attributes: ["nombre"] },
        { model: Companias, attributes: ["nombre"] },
    ],
    })
    let apellido=await  Contactos.findAll({
    where: {apellido: input},
    include: [
        { model: Canales, attributes: ["id", "nombre"] },
        { model: Ciudades, attributes: ["nombre"] },
        { model: Companias, attributes: ["nombre"] },
    ],
    })
    let cargo= await  Contactos.findAll({
    where: {cargo: input},
    include: [
        { model: Canales, attributes: ["id", "nombre"] },
        { model: Ciudades, attributes: ["nombre"] },
        { model: Companias, attributes: ["nombre"] },
    ],
    })
    
    await Promise.all([correo, apellido, cargo, nombre]).then(
    res.status(200).json([correo, apellido, cargo, nombre])
    )
})

//BUSCADOR PAIS
server.get("/buscadorPorPaises/:input", async(req,res)=>{
const input = req.params.input
try{
    const pais= await Paises.findOne({
        where: {nombre: input}}
    );

    if(pais){
        const content  = pais.id

        const ciudades = await Ciudades.findAll({
            where: {paises_id: content}}
        );
        const ciudadesId  = ciudades.map(ciudad=>{
            return ciudad.id
        })

        const contactos = await Contactos.findAll({
            where:{ciudades_id :ciudadesId},
            include: [
                { model: Canales, attributes: ["id", "nombre"] },
                { model: Ciudades, attributes: ["nombre"] },
                { model: Companias, attributes: ["nombre"] },  
            ],
        })

        await Promise.all([pais, ciudades, ciudadesId]).then(
            res.status(200).json(contactos)
        );
    }else{
        res.status(200).json([])
    }
    

  }catch(error){
    res.status(400).json(error.message)
  }
});

//BUSCADOR CANALES
server.get("/buscadorPorCanales/:input", async(req,res)=>{
    const input = req.params.input
    try{
      const canal= await Canales.findOne({
        where: {nombre: input}}
       );

       if(canal){
        const idCanal  = canal.id
  
        const elementos = await ContactosHasCanales.findAll({
          where: {canale_id: idCanal}}
         );
  
         const elementosId  = elementos.map(elem=>{
              return elem.contacto_id
         })
    
         const contactos = await Contactos.findAll({
             where:{id:elementosId},
             include: [
                 { model: Canales, attributes: ["id", "nombre"] },
                 { model: Ciudades, attributes: ["nombre"] },
              { model: Companias, attributes: ["nombre"] },
             ],
           })
    
         await Promise.all([canal, elementos, contactos]).then(
          res.status(200).json(contactos)
         );
       }else{
            res.status(200).json([])
       }
      
    }catch(error){
      res.status(400).json(error.message)
    }
  });


//BUSCADOR POR CIUDAD
server.get("/buscadorPorCiudades/:input", async(req,res)=>{
    const input = req.params.input
    try{
      const ciudad= await Ciudades.findOne({
        where: {nombre: input}},
       );

       if(ciudad){
        const content  = ciudad.id
  
       const contactos = await Contactos.findAll({
           where:{ciudades_id :content},
           include: [
            { model: Canales, attributes: ["id", "nombre"] },
            { model: Ciudades, attributes: ["nombre"] },
            { model: Companias, attributes: ["nombre"] },
        ],
         })
  
  
       await Promise.all([ciudad, content]).then(
        res.status(200).json(contactos)
       );
       }else{
            res.status(200).json([])

       }
    }catch(error){
      res.status(400).json(error.message)
    }
  });

//BUSCADOR POR REGION
server.get("/buscadorPorRegion/:input", async(req,res)=>{
    const input = req.params.input
    try{
      const region= await Regiones.findOne({
        where: {nombre: input}},
       );

       if(region){
        const content  = region.id
  
       const contactos = await Contactos.findAll({
           where:{regiones_id :content},
           include: [
            { model: Canales, attributes: ["id", "nombre"] },
            { model: Ciudades, attributes: ["nombre"] },
            { model: Companias, attributes: ["nombre"] },
        ],
         })
  
  
       await Promise.all([region, content]).then(
        res.status(200).json(contactos)
       );
       }else{
        res.status(200).json([])

       }
      
  
  
    }catch(error){
      res.status(400).json(error.message)
    }
  });

  
//BUSCADOR COMPAÑIA
server.get("/buscadorPorCompania/:input", async(req,res)=>{
    const input = req.params.input
    try{
        const compania= await Companias.findOne({
            where: {nombre: input}}
        );
    
        if(compania){
            const content  = compania.id
    
            const contactos = await Contactos.findAll({
                where:{companias_id :content},
                include: [
                    { model: Canales, attributes: ["id", "nombre"] },
                    { model: Ciudades, attributes: ["nombre"] },
                    { model: Companias, attributes: ["nombre"] },  
                ],
            })
    
            await Promise.all([compania, contactos]).then(
                res.status(200).json(contactos)
            );
        }else{
            res.status(200).json([])
        }
        
    
      }catch(error){
        res.status(400).json(error.message)
      }
    });

//NUEVO CONTACTO
server.post("/contactos/", contactoValidation, async (req, res)=>{
    const {nombre, apellido, correo, cargo, imagen, direccion, ciudades_id, companias_id} = req.body;
    const canales = req.body.canales
    const usuarios_id = req.user.id
    
    try {
        const ciudad = await Ciudades.findOne({where:{id: ciudades_id }})
        const pais = await Paises.findOne({where:{id: ciudad.paises_id }})
        const region = await Regiones.findOne({where:{id: pais.regiones_id }})
        const nuevoContacto = await Contactos.create({
            nombre,
            apellido,
            correo,
            cargo,
            imagen,
            ciudades_id,
            direccion,
            paises_id: pais.id,
            regiones_id: region.id,
            companias_id,
            usuarios_id
        })
        await Promise.all(canales.map(async (canal)=>{
    
            await ContactosHasCanales.create({
                contacto_id: nuevoContacto.id,
                canale_id: canal.canale_id,
                cuenta: canal.cuenta,
                preferencias: canal.preferencias,
                interes: canal.interes
            },{
                fields: ["contacto_id","canale_id","cuenta", "preferencias","interes"]
            });
        }));

        res.status(200).json("Contacto creado con éxito")
    } catch (error) {
        res.status(400).json({error: error.message/* "Deben estar todos los campos completados para continuar" */})
    }
});

//BORRAR CONTACTO
server.delete("/contactos/:id", async (req,res) =>{
    const idContacto = req.params.id;
    
    try {

        const posibleContacto= await Contactos.findOne({
            where: {
                id:idContacto,
            }
        })
    
        if(!posibleContacto){
            res.status(404).json({
                error: `No existe contacto con id ${idContacto}`
            });
        }else{  
            
            await ContactosHasCanales.destroy({
                where: {contacto_id: idContacto}
            })
            await Contactos.destroy({
                where: {id: idContacto}
            })

        } 
    
        res.status(200).json(`Se ha eliminado a ${posibleContacto.nombre} ${posibleContacto.apellido} con éxito`);
    } catch (error) {
        res.status(400).json(error.message)
    }
});

//BORRAR COMPANIA
server.delete("/companias/:id", async (req,res) =>{
    const idCompania = req.params.id;
    
    try {

        const posibleCompania= await Companias.findOne({
            where: {
                id:idCompania,
            }
        })
    
        if(!posibleCompania){
            res.status(404).json({
                error: `No existe compania con id ${idCompania}`
            });
        }else{  
            const contactosCompania = await Contactos.findAll({
                where:{companias_id: idCompania}
            })

            const contactosId = contactosCompania.map(contacto =>{
                return contacto.id
            })

            await ContactosHasCanales.destroy({
                where: {contacto_id: contactosId}
            })

            await Contactos.destroy({
                where: {companias_id: idCompania}
            })
            
            await Companias.destroy({
                where: {
                    id:idCompania,
                }
            }); 
        } 
    
        res.status(200).json("La Compania fue eliminada");
    } catch (error) {
        res.status(400).json(error.message)
    }
});

//AGREGAR COMPANIA
server.post("/companias", adminValidation,async (req,res) =>{
    try{const {nombre,direccion, correo, telefono, ciudades_id, paises_id, regiones_id} = req.body;
    const nuevaCompania = await Companias.create({
        nombre,
        direccion,
        correo,
        telefono,
        ciudades_id,
        paises_id,
        regiones_id
    });
  
    res.status(201).json(nuevaCompania);}
    catch(error){
     res.status(400).json({error:error.message});
    }
  });

//MODIFICAR COMPANIA
server.put("/companias/:id", adminValidation, async(req,res)=>{
    const idCompania = req.params.id;
    const {nombre,direccion, correo, telefono, ciudades_id, paises_id, regiones_id} = req.body;
    try {
        await Companias.update({nombre,direccion, correo, telefono, ciudades_id, paises_id, regiones_id}, {where:{id: idCompania}});
        const compania= await Companias.findOne({where: {id: idCompania}});
        res.status(200).json(compania)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
})

//TRAER COMPANIAS
server.get("/companias", adminValidation, async(req,res)=>{
    try{
        const arrayCompanias = await Companias.findAll({
            include:[
                {model: Ciudades, attributes: ["nombre"]},
                {model: Paises, attributes: ["nombre"]},
                {model: Regiones, attributes: ["nombre"]}
            ]
        })
      res.status(200).json(arrayCompanias)
    } catch(error){
      res.status(400).json(error.message)
    }
  })

//MODIFICAR CONTACTO
server.put("/contactos/:id", async(req,res)=>{
    idContacto = req.params.id;
    const {
        nombre,
        apellido,
        cargo,
        correo,
        imagen,
        direccion,
        ciudades_id,
        companias_id,
    } = req.body;

    try {
        
        
    await Contactos.update({
        nombre,
        apellido,
        cargo,
        correo,
        imagen,
        direccion,
        ciudades_id,
        companias_id,
        },
        {where:{id: idContacto}});

        if(ciudades_id){
            const ciudad = await Ciudades.findOne({where:{id: ciudades_id }})
            const pais = await Paises.findOne({where:{id: ciudad.paises_id }})
            const region = await Regiones.findOne({where:{id: pais.regiones_id }})

            await Contactos.update({
            regiones_id: region.id,
            paises_id: pais.id
            },
            {where:{id: idContacto}});
        }
        const contacto = await Contactos.findOne({
            where: {id: idContacto},
            include:{model:Canales}
        });

        if(contacto){
            res.status(200).json(contacto)
        }else{
            throw new Error("No existe contacto con ese id")
        }

    } catch (error) {
        res.status(400).json({error: error.message})
    }
  })

  //MODIFICAR CONTACTOS HAS CANALES (INTERES, CANALES, PREFERENCIAS)
    server.put("/contactosHasCanales/:idContacto", async(req,res)=>{
        const idContacto = req.params.idContacto
        const canales = req.body.canales
      try {
          await ContactosHasCanales.destroy({
            where:{contacto_id: idContacto}
            })

            await Promise.all(canales.map(async (canal)=>{
    
                await ContactosHasCanales.create({
                    contacto_id: idContacto,
                    canale_id: canal.canale_id,
                    cuenta: canal.cuenta,
                    preferencias: canal.preferencias,
                    interes: canal.interes
                },{
                    fields: ["contacto_id","canale_id","cuenta", "preferencias","interes"]
                });
            }));

            const contacto = await Contactos.findOne({
                    where:{id: idContacto},
                    include:{model:Canales}
            })
        
        res.status(200).json(contacto)

      } catch (error) {
        res.status(400).json(error.message)
      }
})



//OBTENER TODOS LOS CONTACTOS
server.get("/contactos", adminValidation, async(req,res)=>{
    try{
        const arrayContactos = await Contactos.findAll({
        where:{usuarios_id: req.user.id},
        include:[
            {model: Canales},
            {model: Ciudades, attributes: ["nombre"]},
            {model: Paises, attributes: ["nombre"]},
            {model: Regiones, attributes: ["nombre"]},
            {model: Companias, attributes: ["nombre"]},
        ]
    })

        res.status(200).json(arrayContactos)
    } catch(error){
        res.status(400).json(error.message)
    }
})

//OBTENER CONTACTO POR ID
server.get("/contactos/:id", adminValidation, async(req,res)=>{
    const id = req.params.id
    try{
        const arrayContactos = await Contactos.findAll({
        where:{
            usuarios_id: req.user.id,
            id
        },
        include:[
            {model: Canales},
            {model: Ciudades},
            {model: Paises},
            {model: Regiones},
            {model: Companias},
        ]
    })

        res.status(200).json(arrayContactos)
    } catch(error){
        res.status(400).json(error.message)
    }
})

// OBTENER TODOS LOS CANALES
server.get("/canales", async(req,res)=>{
    const canales = await Canales.findAll();
    res.status(200).json(canales)
});

  // MODIFICAR UN CANAL
  server.put("/canales/:id", adminValidation, async(req,res)=>{
    const idCanal = req.params.id;
    const {nombre} = req.body;
    try {
        await Canales.update({nombre}, {where:{id: idCanal}});
        const canal= await Canales.findOne({where: {id: idCanal}});
        res.status(200).json(canal)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
    })

  //AGREGAR CANAL 
    server.post("/canales", adminValidation, async (req,res) =>{
    try{const {nombre} = req.body;
    const nuevoCanal = await Canales.create({
        nombre
    });

    res.status(201).json(nuevoCanal);}
    catch(error){
        res.status(400).json({error:error.message});
    }
});

//ELIMINAR CANAL
server.delete("/canales/:id", async (req,res) =>{
    const idCanal = req.params.id;
    
    try {
        const posibleCanal= await Canales.findOne({
            where: {
                id:idCanal,
            }
        })
        
        if(!posibleCanal){
            res.status(404).json({
                error: `No existe canal con id ${idCanal}`
            });
        }else{  

            await ContactosHasCanales.destroy({
                where: {canale_id: idCanal}
            })

            await Canales.destroy({
                where: {id: idCanal}
            })
            
        } 

        res.status(200).json("El canal fue eliminado");
    } catch (error) {
        res.status(400).json(error.message)
    }
});

//SERVER PORT LISTENER
server.listen(PORT, () => {
    console.log(`Servidor se ha iniciado en puerto ${PORT}`);
});