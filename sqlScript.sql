-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema data-warehouse
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema data-warehouse
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `data-warehouse` DEFAULT CHARACTER SET utf8 ;
-- -----------------------------------------------------
-- Schema data-warehouse
-- -----------------------------------------------------
USE `data-warehouse` ;

-- -----------------------------------------------------
-- Table `data-warehouse`.`usuarios`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `data-warehouse`.`usuarios` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(300) NOT NULL,
  `apellido` VARCHAR(100) NOT NULL,
  `correo` VARCHAR(150) NOT NULL,
  `perfil` VARCHAR(45) NOT NULL,
  `contrasena` VARCHAR(450) NOT NULL,
  `esAdmin` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `data-warehouse`.`regiones`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `data-warehouse`.`regiones` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(400) NOT NULL,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `data-warehouse`.`paises`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `data-warehouse`.`paises` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(450) NOT NULL,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  `regiones_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_paises_regiones_idx` (`regiones_id` ASC),
  CONSTRAINT `fk_paises_regiones`
    FOREIGN KEY (`regiones_id`)
    REFERENCES `data-warehouse`.`regiones` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `data-warehouse`.`ciudades`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `data-warehouse`.`ciudades` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(450) NOT NULL,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  `paises_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_ciudades_paises1_idx` (`paises_id` ASC),
  CONSTRAINT `fk_ciudades_paises1`
    FOREIGN KEY (`paises_id`)
    REFERENCES `data-warehouse`.`paises` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `data-warehouse`.`companias`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `data-warehouse`.`companias` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(450) NOT NULL,
  `direccion` VARCHAR(450) NOT NULL,
  `correo` VARCHAR(450) NOT NULL,
  `telefono` VARCHAR(45) NOT NULL,
`ciudades_id` INT NOT NULL,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_contactos_ciudades1_idx` (`ciudades_id` ASC))
  ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `data-warehouse`.`contactos`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `data-warehouse`.`contactos` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(450) NOT NULL,
  `apellido` VARCHAR(450) NOT NULL,
  `cargo` VARCHAR(450) NOT NULL,
  `correo` VARCHAR(450) NOT NULL,
  `imagen` VARCHAR(2000) NULL DEFAULT NULL,
  `updated_at` DATETIME NOT NULL,
  `created_at` DATETIME NOT NULL,
  `ciudades_id` INT NOT NULL,
  `companias_id` INT NOT NULL,
  `usuarios_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_contactos_ciudades1_idx` (`ciudades_id` ASC),
  INDEX `fk_contactos_companias1_idx` (`companias_id` ASC),
  INDEX `fk_contactos_usuarios1_idx` (`usuarios_id` ASC),
  CONSTRAINT `fk_contactos_ciudades1`
    FOREIGN KEY (`ciudades_id`)
    REFERENCES `data-warehouse`.`ciudades` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_contactos_companias1`
    FOREIGN KEY (`companias_id`)
    REFERENCES `data-warehouse`.`companias` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_contactos_usuarios1`
    FOREIGN KEY (`usuarios_id`)
    REFERENCES `data-warehouse`.`usuarios` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `data-warehouse`.`canales`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `data-warehouse`.`canales` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(450) NOT NULL,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `data-warehouse`.`contactos_has_canales`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `data-warehouse`.`contactos_has_canales` (
  `contacto_id` INT NOT NULL,
  `canale_id` INT NOT NULL,
  `interes` ENUM("0", "25", "50", "75", "100") NOT NULL DEFAULT '0',
  `cuenta` VARCHAR(450) NOT NULL,
  `created_at` DATETIME NOT NULL,
  `updated_at` DATETIME NOT NULL,
  `preferencias` ENUM("NO MOLESTAR", "ACTIVO", "EN EL TRABAJO", "AUSENTE") NOT NULL DEFAULT 'ACTIVO',
  PRIMARY KEY (`contacto_id`, `canale_id`),
  INDEX `fk_contactos_has_canales_canales1_idx` (`canale_id` ASC),
  INDEX `fk_contactos_has_canales_contactos1_idx` (`contacto_id` ASC),
  CONSTRAINT `fk_contactos_has_canales_contactos1`
    FOREIGN KEY (`contacto_id`)
    REFERENCES `data-warehouse`.`contactos` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_contactos_has_canales_canales1`
    FOREIGN KEY (`canale_id`)
    REFERENCES `data-warehouse`.`canales` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;



INSERT INTO `data-warehouse`.`usuarios` (`nombre`, `apellido`, `correo`, `perfil`, `contrasena`, `esAdmin`) VALUES ('admin', 'admin', 'admin', 'admin', 'admin123', '1');

INSERT INTO regiones(nombre, created_at, updated_at)
VALUES("Norteamerica", NOW(),NOW());
INSERT INTO regiones(nombre, created_at, updated_at)
VALUES("Sudamerica", NOW(),NOW());
INSERT INTO regiones(nombre, created_at, updated_at)
VALUES("Europa", NOW(),NOW());
INSERT INTO regiones(nombre, created_at, updated_at)
VALUES("Asia", NOW(),NOW());
INSERT INTO regiones(nombre, created_at, updated_at)
VALUES("Africa", NOW(),NOW());


INSERT INTO paises(nombre, created_at, updated_at,regiones_id)
VALUES("Canada", NOW(),NOW(),1);
INSERT INTO paises(nombre, created_at, updated_at,regiones_id)
VALUES("Estados Unidos", NOW(),NOW(),1);
INSERT INTO paises(nombre, created_at, updated_at,regiones_id)
VALUES("Alaska", NOW(),NOW(),1);
INSERT INTO paises(nombre, created_at, updated_at,regiones_id)
VALUES("Colombia", NOW(),NOW(),2);
INSERT INTO paises(nombre, created_at, updated_at,regiones_id)
VALUES("Venezuela", NOW(),NOW(),2);
INSERT INTO paises(nombre, created_at, updated_at,regiones_id)
VALUES("Brasil", NOW(),NOW(),2);
INSERT INTO paises(nombre, created_at, updated_at,regiones_id)
VALUES("Chile", NOW(),NOW(),2);
INSERT INTO paises(nombre, created_at, updated_at,regiones_id)
VALUES("Argentina", NOW(),NOW(),2);
INSERT INTO paises(nombre, created_at, updated_at,regiones_id)
VALUES("Bolivia", NOW(),NOW(),2);
INSERT INTO paises(nombre, created_at, updated_at,regiones_id)
VALUES("Paraguay", NOW(),NOW(),2);
INSERT INTO paises(nombre, created_at, updated_at,regiones_id)
VALUES("España", NOW(),NOW(),3);
INSERT INTO paises(nombre, created_at, updated_at,regiones_id)
VALUES("Inglaterra", NOW(),NOW(),3);
INSERT INTO paises(nombre, created_at, updated_at,regiones_id)
VALUES("Alemania", NOW(),NOW(),3);
INSERT INTO paises(nombre, created_at, updated_at,regiones_id)
VALUES("Francia", NOW(),NOW(),3);
INSERT INTO paises(nombre, created_at, updated_at,regiones_id)
VALUES("Italia", NOW(),NOW(),3);
INSERT INTO paises(nombre, created_at, updated_at,regiones_id)
VALUES("Portugal", NOW(),NOW(),3);
INSERT INTO paises(nombre, created_at, updated_at,regiones_id)
VALUES("China", NOW(),NOW(),4);
INSERT INTO paises(nombre, created_at, updated_at,regiones_id)
VALUES("Japon", NOW(),NOW(),4);
INSERT INTO paises(nombre, created_at, updated_at,regiones_id)
VALUES("Mongolia", NOW(),NOW(),4);
INSERT INTO paises(nombre, created_at, updated_at,regiones_id)
VALUES("Tilandia", NOW(),NOW(),4);
INSERT INTO paises(nombre, created_at, updated_at,regiones_id)
VALUES("India", NOW(),NOW(),4);
INSERT INTO paises(nombre, created_at, updated_at,regiones_id)
VALUES("Egipto", NOW(),NOW(),5);
INSERT INTO paises(nombre, created_at, updated_at,regiones_id)
VALUES("Marruecos", NOW(),NOW(),5);
INSERT INTO paises(nombre, created_at, updated_at,regiones_id)
VALUES("Sudafrica", NOW(),NOW(),5);
INSERT INTO paises(nombre, created_at, updated_at,regiones_id)
VALUES("Kenia", NOW(),NOW(),5);




INSERT INTO ciudades(nombre, created_at, updated_at,paises_id)
VALUES("Vancouver", NOW(),NOW(),1);
INSERT INTO ciudades(nombre, created_at, updated_at,paises_id)
VALUES("Toronto", NOW(),NOW(),1);
INSERT INTO ciudades(nombre, created_at, updated_at,paises_id)
VALUES("Ottawa", NOW(),NOW(),1);
INSERT INTO ciudades(nombre, created_at, updated_at,paises_id)
VALUES("Nueva York", NOW(),NOW(),2);
INSERT INTO ciudades(nombre, created_at, updated_at,paises_id)
VALUES("Boston", NOW(),NOW(),2);
INSERT INTO ciudades(nombre, created_at, updated_at,paises_id)
VALUES("Washington DC", NOW(),NOW(),2);
INSERT INTO ciudades(nombre, created_at, updated_at,paises_id)
VALUES("Seattle", NOW(),NOW(),2);
INSERT INTO ciudades(nombre, created_at, updated_at,paises_id)
VALUES("Chicago", NOW(),NOW(),2);
INSERT INTO ciudades(nombre, created_at, updated_at,paises_id)
VALUES("Bogotá", NOW(),NOW(),4);
INSERT INTO ciudades(nombre, created_at, updated_at,paises_id)
VALUES("Bogotá", NOW(),NOW(),4);
INSERT INTO ciudades(nombre, created_at, updated_at,paises_id)
VALUES("Barranquilla", NOW(),NOW(),4);
INSERT INTO ciudades(nombre, created_at, updated_at,paises_id)
VALUES("Cartagena", NOW(),NOW(),4);
INSERT INTO ciudades(nombre, created_at, updated_at,paises_id)
VALUES("Caracas", NOW(),NOW(),5);
INSERT INTO ciudades(nombre, created_at, updated_at,paises_id)
VALUES("Morrocoy", NOW(),NOW(),5);
INSERT INTO ciudades(nombre, created_at, updated_at,paises_id)
VALUES("Rio chico", NOW(),NOW(),5);
INSERT INTO ciudades(nombre, created_at, updated_at,paises_id)
VALUES("Sao Paulo", NOW(),NOW(),6);
INSERT INTO ciudades(nombre, created_at, updated_at,paises_id)
VALUES("Rio de Janeiro", NOW(),NOW(),6);
INSERT INTO ciudades(nombre, created_at, updated_at,paises_id)
VALUES("Brasilia", NOW(),NOW(),6);
INSERT INTO ciudades(nombre, created_at, updated_at,paises_id)
VALUES("Santiago de Chile", NOW(),NOW(),7);
INSERT INTO ciudades(nombre, created_at, updated_at,paises_id)
VALUES("Rencagua", NOW(),NOW(),7);
INSERT INTO ciudades(nombre, created_at, updated_at,paises_id)
VALUES("Viña del Mar", NOW(),NOW(),7);
INSERT INTO ciudades(nombre, created_at, updated_at,paises_id)
VALUES("Buenos Aires", NOW(),NOW(),8);
INSERT INTO ciudades(nombre, created_at, updated_at,paises_id)
VALUES("Cordoba", NOW(),NOW(),8);
INSERT INTO ciudades(nombre, created_at, updated_at,paises_id)
VALUES("Mendoza", NOW(),NOW(),8);
INSERT INTO ciudades(nombre, created_at, updated_at,paises_id)
VALUES("Rosario", NOW(),NOW(),8);
INSERT INTO ciudades(nombre, created_at, updated_at,paises_id)
VALUES("Mar del plata", NOW(),NOW(),8);
INSERT INTO ciudades(nombre, created_at, updated_at,paises_id)
VALUES("La Paz", NOW(),NOW(),9);
INSERT INTO ciudades(nombre, created_at, updated_at,paises_id)
VALUES("Santa cruz de la sierra", NOW(),NOW(),9);
INSERT INTO ciudades(nombre, created_at, updated_at,paises_id)
VALUES("Cochabamba", NOW(),NOW(),9);
INSERT INTO ciudades(nombre, created_at, updated_at,paises_id)
VALUES("Asuncion", NOW(),NOW(),10);
INSERT INTO ciudades(nombre, created_at, updated_at,paises_id)
VALUES("Ciudad del Este", NOW(),NOW(),10);
INSERT INTO ciudades(nombre, created_at, updated_at,paises_id)
VALUES("Luque", NOW(),NOW(),10);
INSERT INTO ciudades(nombre, created_at, updated_at,paises_id)
VALUES("Madrid", NOW(),NOW(),11);
INSERT INTO ciudades(nombre, created_at, updated_at,paises_id)
VALUES("Barcelona", NOW(),NOW(),11);
INSERT INTO ciudades(nombre, created_at, updated_at,paises_id)
VALUES("Sevilla", NOW(),NOW(),11);
INSERT INTO ciudades(nombre, created_at, updated_at,paises_id)
VALUES("Bilbao", NOW(),NOW(),11);
INSERT INTO ciudades(nombre, created_at, updated_at,paises_id)
VALUES("Londres", NOW(),NOW(),12);
INSERT INTO ciudades(nombre, created_at, updated_at,paises_id)
VALUES("Manchester", NOW(),NOW(),12);
INSERT INTO ciudades(nombre, created_at, updated_at,paises_id)
VALUES("Liverpool", NOW(),NOW(),12);
INSERT INTO ciudades(nombre, created_at, updated_at,paises_id)
VALUES("York", NOW(),NOW(),12);
INSERT INTO ciudades(nombre, created_at, updated_at,paises_id)
VALUES("Berlin", NOW(),NOW(),13);
INSERT INTO ciudades(nombre, created_at, updated_at,paises_id)
VALUES("Nuremberg", NOW(),NOW(),13);
INSERT INTO ciudades(nombre, created_at, updated_at,paises_id)
VALUES("Augsburgo", NOW(),NOW(),13);
INSERT INTO ciudades(nombre, created_at, updated_at,paises_id)
VALUES("Paris", NOW(),NOW(),14);
INSERT INTO ciudades(nombre, created_at, updated_at,paises_id)
VALUES("Avigñon", NOW(),NOW(),14);
INSERT INTO ciudades(nombre, created_at, updated_at,paises_id)
VALUES("Lourdes", NOW(),NOW(),14);
INSERT INTO ciudades(nombre, created_at, updated_at,paises_id)
VALUES("Roma", NOW(),NOW(),15);
INSERT INTO ciudades(nombre, created_at, updated_at,paises_id)
VALUES("Florencia", NOW(),NOW(),15);
INSERT INTO ciudades(nombre, created_at, updated_at,paises_id)
VALUES("Venecia", NOW(),NOW(),15);
INSERT INTO ciudades(nombre, created_at, updated_at,paises_id)
VALUES("Napoles", NOW(),NOW(),15);
INSERT INTO ciudades(nombre, created_at, updated_at,paises_id)
VALUES("Lisboa", NOW(),NOW(),16);
INSERT INTO ciudades(nombre, created_at, updated_at,paises_id)
VALUES("Sintra", NOW(),NOW(),16);
INSERT INTO ciudades(nombre, created_at, updated_at,paises_id)
VALUES("Oporto", NOW(),NOW(),16);
INSERT INTO ciudades(nombre, created_at, updated_at,paises_id)
VALUES("Shanghai", NOW(),NOW(),17);
INSERT INTO ciudades(nombre, created_at, updated_at,paises_id)
VALUES("Pekin", NOW(),NOW(),17);
INSERT INTO ciudades(nombre, created_at, updated_at,paises_id)
VALUES("Caton", NOW(),NOW(),17);
INSERT INTO ciudades(nombre, created_at, updated_at,paises_id)
VALUES("Tokio", NOW(),NOW(),18);
INSERT INTO ciudades(nombre, created_at, updated_at,paises_id)
VALUES("Osaka", NOW(),NOW(),18);
INSERT INTO ciudades(nombre, created_at, updated_at,paises_id)
VALUES("Kioto", NOW(),NOW(),18);
INSERT INTO ciudades(nombre, created_at, updated_at,paises_id)
VALUES("Hovd", NOW(),NOW(),19);
INSERT INTO ciudades(nombre, created_at, updated_at,paises_id)
VALUES("Darjan", NOW(),NOW(),19);
INSERT INTO ciudades(nombre, created_at, updated_at,paises_id)
VALUES("Ulaangom", NOW(),NOW(),19);
INSERT INTO ciudades(nombre, created_at, updated_at,paises_id)
VALUES("Krabi", NOW(),NOW(),20);
INSERT INTO ciudades(nombre, created_at, updated_at,paises_id)
VALUES("Chiang Mai", NOW(),NOW(),20);
INSERT INTO ciudades(nombre, created_at, updated_at,paises_id)
VALUES("Pataya", NOW(),NOW(),20);
INSERT INTO ciudades(nombre, created_at, updated_at,paises_id)
VALUES("Bombay", NOW(),NOW(),21);
INSERT INTO ciudades(nombre, created_at, updated_at,paises_id)
VALUES("Calcuta", NOW(),NOW(),21);
INSERT INTO ciudades(nombre, created_at, updated_at,paises_id)
VALUES("Jaipur", NOW(),NOW(),21);
INSERT INTO ciudades(nombre, created_at, updated_at,paises_id)
VALUES("El Cairo", NOW(),NOW(),22);
INSERT INTO ciudades(nombre, created_at, updated_at,paises_id)
VALUES("Luxor", NOW(),NOW(),22);
INSERT INTO ciudades(nombre, created_at, updated_at,paises_id)
VALUES("Alejandria", NOW(),NOW(),22);
INSERT INTO ciudades(nombre, created_at, updated_at,paises_id)
VALUES("Tanger", NOW(),NOW(),23);
INSERT INTO ciudades(nombre, created_at, updated_at,paises_id)
VALUES("Casablanca", NOW(),NOW(),23);
INSERT INTO ciudades(nombre, created_at, updated_at,paises_id)
VALUES("Agadir", NOW(),NOW(),23);
INSERT INTO ciudades(nombre, created_at, updated_at,paises_id)
VALUES("Ciudad del Cabo", NOW(),NOW(),24);
INSERT INTO ciudades(nombre, created_at, updated_at,paises_id)
VALUES("Johannesburgo", NOW(),NOW(),24);
INSERT INTO ciudades(nombre, created_at, updated_at,paises_id)
VALUES("Pretoria", NOW(),NOW(),24);
INSERT INTO ciudades(nombre, created_at, updated_at,paises_id)
VALUES("Nairobi", NOW(),NOW(),25);
INSERT INTO ciudades(nombre, created_at, updated_at,paises_id)
VALUES("Mombasa", NOW(),NOW(),25);
INSERT INTO ciudades(nombre, created_at, updated_at,paises_id)
VALUES("Nakuru", NOW(),NOW(),25);
INSERT INTO ciudades(nombre, created_at, updated_at,paises_id)
VALUES("Thika", NOW(),NOW(),25);

INSERT INTO companias(nombre, direccion, correo, telefono, created_at, updated_at, ciudades_id)
VALUES("Asus","Calle123", "asus@asus","123456789", NOW(),NOW(),1);
INSERT INTO companias(nombre, direccion, correo, telefono, created_at, updated_at, ciudades_id)
VALUES("Apple","Calle123", "apple@apple","123456789", NOW(),NOW(),5);
INSERT INTO companias(nombre, direccion, correo, telefono, created_at, updated_at, ciudades_id)
VALUES("Tesla","Calle123", "tesla@tesla","123456789", NOW(),NOW(),5);
INSERT INTO canales(nombre, created_at, updated_at)
VALUES("Facebook", NOW(),NOW());
INSERT INTO canales(nombre, created_at, updated_at)
VALUES("Instagram", NOW(),NOW());
INSERT INTO canales(nombre, created_at, updated_at)
VALUES("Messenger", NOW(),NOW());
INSERT INTO canales(nombre, created_at, updated_at)
VALUES("whatsapp", NOW(),NOW());
INSERT INTO canales(nombre, created_at, updated_at)
VALUES("Slack", NOW(),NOW());

select * from usuarios;
select * from paises;
select * from canales;
select * from contactos;