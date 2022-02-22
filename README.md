# Data Warehouse

Data warehouse es una herramienta que permite a una compania de marketing administrar todos los contactos de sus clientes, para sus campañas. En ella, se puede crear un usuario que tenga acceso a una base de datos propia, en la que pueda administrar sus contactos, compañias y respectivas locaciones. Se podrán guardar, modificar, editar y eliminar todos los datos alojados.

---
## Prerequisitos
---
Para el montaje del proyecto será necesario establecer la base de datos y levantar el servidor a nivel local, por lo que se deberá contar con los siguientes softwares:

* Node JS
* Git Bash
* Xampp
* MySQL Workbench (versión 8.0.26)
* Visual Studio Code (con extensión "Live Server")

---
## Instalación
---

Para establecer la conexión a nuestra base de datos, inicializar **Xampp** y encender el módulo de MySQL.
Luego, inicializar **MySQL Workbench**, establecer una 
nueva conexión y disponer los siguientes parámetros:

```
Connection Name: XAMPP MYSQL
Connextion Method: Standard (TCP/IP)
Hostname: 127.0.0.1
Port: 3306
Username: root 
```
Habiendolos confirmado, presionar **OK** e ingresar a la conexión dispuesta.
Una vez echo esto, ejecutar en un script las sentencias escritas en el archivo *sqlScript.txt*. 

Se creará el schema 
*data-warehouse* (será necesaria la actualización de la lista de schemas para su visualización). 

Para levantar el servidor a nivel de local, será necesario abrir la carpeta
*back* en la terminal de Git Bash. Luego, ejecutar `npm install` 
para instalar las dependencias. Finalmente ejecutar `npm run dev`,
para levantar el servidor y conectarlo a la base de datos.

Si los pasos se realizaron correctamente,
se visualizará el siguiente mensaje por consola:

```
Servidor se ha iniciado en puerto 3000
Executing (default): SELECT 1+1 AS result
Conexion exitosa con la db
```

Finalmente, abrir la carpeta *front* en Visual Studio Code y levantar el proyecto con Live Server.

---
## Observaciones
---

* En el caso que se desee correr el servidor en un entorno remoto o
distinto al definido localmente en este proyecto, en el archivo *.env* dentro de la carpeta *back* se definen las variables de entorno, las cuales se pueden modificar
sin inconvenientes. Tener en cuenta que también se deberá establecer la conexión pertinente en MySQL Workbench.

* Se creó un usuario administrador y algunos contactos, compañias y regiones que permitirán probar la herramienta sin inconvenientes. A continuación, se detalla el correo y la contraseña para el usuario por defecto, para hacer un primer ingreso:

```
UPDATE `proyecto-delilah-resto`.`usuarios` SET `esAdmin` = '1' WHERE (`id` = '<id_del_usuario>');

-- ---------------------------------------------------------------------

```

* Se incluye el archivo *delilah-resto.postman_collection* para
ser abierto mediante el software **Postman** y ejecutar las
peticiones HTPP sin necesidad de tener un entorno desarrollado para ello.

* Para visualizar los endpoints de *spec.yaml* y *spec.json* desde Swagger Editor, es necesario 
 haber levantado el servidor con el comando `npm run dev`