# Data Warehouse

A tool that allows a marketing company to manage all its clients’ contacts for their campaigns. In it, a user can be created with access to their own database, where they will be able to manage their contacts, companies, and respective locations. All stored data can be saved, modified, edited, and deleted.

---

## Prerequisites
---
To set up the project, it will be necessary to configure the database and start the server locally, so the following software will be required:

* Node JS  
* Git Bash  
* Xampp  
* MySQL Workbench (version 8.0.26)  
* Visual Studio Code (with the "Live Server" extension)  

---

## Installation
---

To establish the connection to our database, start **Xampp** and turn on the MySQL module.  
Then, start **MySQL Workbench**, create a new connection, and set the following parameters:

```
Connection Name: XAMPP MYSQL
Connection Method: Standard (TCP/IP)
Hostname: 127.0.0.1
Port: 3306
Username: root
```

Once confirmed, press **OK** and enter the configured connection.  
After this, execute in a script the statements written in the *sqlScript.txt* file, located in the *back* folder.

The *data-warehouse* schema will be created (you will need to refresh the schema list to view it).

To start the server locally, open the *back* folder in the Git Bash terminal. Then, run:

```
npm install
```
to install the dependencies. Finally, run:

```
npm run dev
```
to start the server and connect it to the database.

If the steps were carried out correctly, the following message will appear in the console:

```
Servidor se ha iniciado en puerto 3000
Executing (default): SELECT 1+1 AS result
Conexion exitosa con la db
```

Finally, open the *front* folder in Visual Studio Code and launch the project with Live Server.

---

## Notes
---

* An administrator user and some contacts, companies, and regions were created to allow testing of the tool without issues. Below are the email and password for the default user, for the first login:

```
email: default@admin.com
password: admin
```

* If you wish to run the server in a remote environment or in one different from the one locally defined in this project, the *.env* file inside the *back* folder defines the environment variables, which can be modified without problems. Keep in mind that you will also need to establish the corresponding connection in MySQL Workbench.
