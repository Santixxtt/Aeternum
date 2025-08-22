-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 21-08-2025 a las 19:48:06
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `aeternum`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `autores`
--

CREATE TABLE `autores` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(150) DEFAULT NULL,
  `nacionalidad` varchar(150) NOT NULL,
  `fec_nacimiento` date DEFAULT NULL,
  `fec_fallecimiento` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `autores`
--

INSERT INTO `autores` (`id`, `nombre`, `apellido`, `nacionalidad`, `fec_nacimiento`, `fec_fallecimiento`) VALUES
(1, 'Carlos Jiménez', NULL, '', NULL, NULL),
(2, 'María López', NULL, '', NULL, NULL),
(3, 'Antonio García', NULL, '', NULL, NULL),
(4, 'Lucía Rodríguez', NULL, '', NULL, NULL),
(5, 'David Fernández', NULL, '', NULL, NULL),
(6, 'Laura Martínez', NULL, '', NULL, NULL),
(7, 'Jorge Sánchez', NULL, '', NULL, NULL),
(8, 'Cristina Torres', NULL, '', NULL, NULL),
(9, 'Pedro Díaz', NULL, '', NULL, NULL),
(10, 'Isabel Romero', NULL, '', NULL, NULL),
(11, 'Όμηρος', '', '', NULL, NULL),
(12, 'Pablo Picasso, Jean-Louis Andral, Pierre', 'Daix', '', NULL, NULL),
(13, 'Nathaniel', 'Hawthorne', '', NULL, NULL),
(14, 'Gabriel García', 'Márquez', '', NULL, NULL),
(15, 'Edith', 'Nesbit', '', NULL, NULL),
(16, 'Rudyard', 'Kipling', '', NULL, NULL),
(17, 'Charles Fort, Charles', 'Fort', '', NULL, NULL),
(18, 'Euclid', '', '', NULL, NULL),
(19, 'Arthur Conan', 'Doyle', '', NULL, NULL),
(20, 'Edgar Rice', 'Burroughs', '', NULL, NULL),
(21, 'Julia', 'Donaldson', '', NULL, NULL),
(22, 'Felix Salten, Walt Disney, Benjamin Lacombe, Nicolas Waquet, Christine Palluy, Carine Hinder, Jack Z', 'Seisdedos', '', NULL, NULL),
(23, 'George', 'Eliot', '', NULL, NULL),
(24, 'Titus', 'Livius', '', NULL, NULL),
(25, 'Margaret Wise', 'Brown', '', NULL, NULL),
(26, 'Aristotle', '', '', NULL, NULL),
(27, 'Beatrix Potter, Blackwell North America., Jean Little, David Hately, J. K. Jomkhwan, Lisa', 'McCue', '', NULL, NULL),
(28, 'Markus', 'Zusak', '', NULL, NULL),
(29, 'John', 'Milton', '', NULL, NULL),
(30, 'Miyamoto Musashi, William Scott Wilson, Kenji Tokitsu, Brian Nishii, jose manquel, Karlo', 'Toreles', '', NULL, NULL),
(31, 'Edmund', 'Spenser', '', NULL, NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `bibliotecarios`
--

CREATE TABLE `bibliotecarios` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(150) NOT NULL,
  `correo` varchar(100) NOT NULL,
  `clave` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Disparadores `bibliotecarios`
--
DELIMITER $$
CREATE TRIGGER `crear_usuario_bibliotecario` AFTER INSERT ON `bibliotecarios` FOR EACH ROW BEGIN
  INSERT INTO usuarios (nombre, apellido, correo, clave, rol)
  VALUES (NEW.nombre, NEW.apellido, NEW.correo, NEW.clave, 'bibliotecario');
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `comentarios`
--

CREATE TABLE `comentarios` (
  `id` int(11) NOT NULL,
  `libro_key` varchar(100) DEFAULT NULL,
  `id_usuario` int(11) DEFAULT NULL,
  `comentario` text DEFAULT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `editoriales`
--

CREATE TABLE `editoriales` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `editoriales`
--

INSERT INTO `editoriales` (`id`, `nombre`) VALUES
(1, 'Ediciones Sol'),
(2, 'Luna Editorial'),
(3, 'Papel y Letras'),
(4, 'Ideas Gráficas'),
(5, 'Tinta Viva'),
(6, 'Editorial Horizonte'),
(7, 'Lectura Futura'),
(8, 'Palabras S.A.'),
(9, 'Narrativa XXI'),
(10, 'InkHouse');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `generos`
--

CREATE TABLE `generos` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `generos`
--

INSERT INTO `generos` (`id`, `nombre`) VALUES
(1, 'Fantasía'),
(2, 'Ciencia ficción'),
(3, 'Romance'),
(4, 'Terror'),
(5, 'Misterio'),
(6, 'Drama'),
(7, 'Aventura'),
(8, 'Biografía'),
(9, 'Historia'),
(10, 'Infantil');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `libros`
--

CREATE TABLE `libros` (
  `id` int(11) NOT NULL,
  `titulo` varchar(200) DEFAULT NULL,
  `autor_id` int(11) DEFAULT NULL,
  `editorial_id` int(11) DEFAULT NULL,
  `genero_id` int(11) DEFAULT NULL,
  `año_publicacion` year(4) DEFAULT NULL,
  `cantidad_disponible` int(11) DEFAULT 1,
  `openlibrary_key` varchar(100) DEFAULT NULL,
  `cover_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `libros`
--

INSERT INTO `libros` (`id`, `titulo`, `autor_id`, `editorial_id`, `genero_id`, `año_publicacion`, `cantidad_disponible`, `openlibrary_key`, `cover_id`) VALUES
(1, 'El portal escondido', 1, 3, 1, '2010', 3, NULL, 0),
(2, 'Sombras del futuro', 2, 1, 2, '2018', 2, NULL, 0),
(3, 'Pasión en otoño', 3, 2, 3, '2015', 1, NULL, 0),
(4, 'Ecos del más allá', 4, 4, 4, '2020', 4, NULL, 0),
(5, 'Crimen en el tren', 5, 5, 5, '2012', 2, NULL, 0),
(6, 'Lágrimas de papel', 6, 6, 6, '2019', 5, NULL, 0),
(7, 'El viajero perdido', 7, 7, 7, '2016', 1, NULL, 0),
(8, 'Mi vida con Picasso', 8, 8, 8, '2008', 2, NULL, 0),
(9, 'Guerras antiguas', 9, 9, 9, '2021', 3, NULL, 0),
(10, 'El dragón y el niño', 10, 10, 10, '2022', 2, NULL, 0),
(11, 'Ὀδύσσεια', 11, NULL, NULL, NULL, 1, '/works/OL61982W', 9045853),
(12, 'Picasso', 12, NULL, NULL, NULL, 1, '/works/OL145191W', 2238306),
(13, 'A Wonder Book for Girls and Boys', 13, NULL, NULL, NULL, 1, '/works/OL455667W', 10223576),
(14, 'Cien años de soledad', 14, NULL, NULL, NULL, 1, '/works/OL274505W', 12627383),
(15, 'The Book of Dragons', 15, NULL, NULL, NULL, 1, '/works/OL99529W', 4342323),
(16, 'The Jungle Book', 16, NULL, NULL, NULL, 1, '/works/OL19870W', 3344204),
(17, 'The book of the damned', 17, NULL, NULL, NULL, 1, '/works/OL66059W', 825884),
(18, 'The Railway Children', 15, NULL, NULL, NULL, 1, '/works/OL99509W', 13241123),
(19, 'Elements', 18, NULL, NULL, NULL, 1, '/works/OL912133W', 1736063),
(20, 'The Case-Book of Sherlock Holmes', 19, NULL, NULL, NULL, 1, '/works/OL262426W', 8350410),
(21, 'A Princess of Mars', 20, NULL, NULL, NULL, 1, '/works/OL1418187W', 207226),
(22, 'The Gruffalo', 21, NULL, NULL, NULL, 1, '/works/OL1938178W', 8561698),
(23, 'Bambi (First Colouring Tall)', 22, NULL, NULL, NULL, 1, '/works/OL4459213W', 7153939),
(24, 'Middlemarch', 23, NULL, NULL, NULL, 1, '/works/OL20867W', 252882),
(25, 'Ab urbe condita', 24, NULL, NULL, NULL, 1, '/works/OL1261147W', 6657951),
(26, 'Goodnight Moon', 25, NULL, NULL, NULL, 1, '/works/OL151798W', 35556),
(27, 'Πολιτικά (Politiká)', 26, NULL, NULL, NULL, 1, '/works/OL16247898W', 1277085),
(28, 'The Tale of Peter Rabbit', 27, NULL, NULL, NULL, 1, '/works/OL26460746W', 2557658),
(29, 'The Book Thief', 28, NULL, NULL, NULL, 1, '/works/OL5819456W', 8153054),
(30, 'Paradise Lost', 29, NULL, NULL, NULL, 1, '/works/OL810991W', 5992814),
(31, 'Gorin no sho', 30, NULL, NULL, NULL, 1, '/works/OL3946622W', 6621293),
(32, 'Faerie queene', 31, NULL, NULL, NULL, 1, '/works/OL1146502W', 5804540);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `lista_deseos`
--

CREATE TABLE `lista_deseos` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) DEFAULT NULL,
  `libro_id` int(11) DEFAULT NULL,
  `fecha_agregado` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `lista_deseos`
--

INSERT INTO `lista_deseos` (`id`, `usuario_id`, `libro_id`, `fecha_agregado`) VALUES
(37, 15, 11, '2025-07-31 22:53:27'),
(38, 15, 29, '2025-07-31 23:38:31'),
(40, 15, 31, '2025-08-01 07:21:09');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `notificaciones_pendientes`
--

CREATE TABLE `notificaciones_pendientes` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `libro_id` int(11) NOT NULL,
  `fecha_solicitud` datetime DEFAULT current_timestamp(),
  `notificado` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `prestamos`
--

CREATE TABLE `prestamos` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) DEFAULT NULL,
  `libro_id` int(11) DEFAULT NULL,
  `fecha_prestamo` date DEFAULT NULL,
  `fecha_devolucion` date DEFAULT NULL,
  `devuelto` tinyint(1) DEFAULT 0,
  `dias_limite` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Disparadores `prestamos`
--
DELIMITER $$
CREATE TRIGGER `evitar_prestamo_duplicado` BEFORE INSERT ON `prestamos` FOR EACH ROW BEGIN
    IF EXISTS (
        SELECT 1 FROM prestamos 
        WHERE usuario_id = NEW.usuario_id 
        AND libro_id = NEW.libro_id 
        AND devuelto = FALSE
    ) THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'El usuario ya tiene este libro prestado y no lo ha devuelto.';
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `reseñas`
--

CREATE TABLE `reseñas` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) DEFAULT NULL,
  `libro_id` int(11) DEFAULT NULL,
  `calificacion` int(11) DEFAULT NULL CHECK (`calificacion` between 1 and 5),
  `comentario` text DEFAULT NULL,
  `fecha` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `solicitudes_recuperacion_contrasena`
--

CREATE TABLE `solicitudes_recuperacion_contrasena` (
  `id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `token` varchar(255) NOT NULL,
  `fecha` timestamp NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `solicitudes_recuperacion_contrasena`
--

INSERT INTO `solicitudes_recuperacion_contrasena` (`id`, `usuario_id`, `token`, `fecha`) VALUES
(1, 15, '9e54b74ab950378daa1df0b891691ceb', '2025-07-24 01:42:48'),
(2, 15, '0a5d07d07ec7beb156d58faed9afc490', '2025-07-24 01:43:04'),
(4, 15, '5eb9609d0911d07a845ee19aee718eed', '2025-07-24 01:49:00'),
(5, 15, '3d958c299b29491fcde53a71581e2583', '2025-07-24 01:57:13'),
(6, 15, 'dfcb75f06fe85bbaf000d3556191bf72', '2025-07-24 02:12:53'),
(8, 17, 'fc0d34d95eb2711d3d518b296c232e37', '2025-07-24 02:32:19'),
(9, 15, '7e5190ca0822d2479f4f1711e778e167', '2025-07-24 02:40:16'),
(10, 15, '8932524465c5b09735d45211916c4bab', '2025-07-24 02:41:58'),
(11, 15, 'c0b33bc83210f9825ff7303b8dea43ec', '2025-07-24 02:44:09'),
(12, 17, 'f3bc0e37b47eb00d33a6bf1bb35623bc', '2025-07-24 02:48:20'),
(13, 15, '0b556b46fb11ea31d36825ae51542d35', '2025-07-24 13:08:31'),
(14, 15, 'd2d0c616cb0c97d52159ca3aa481a75e', '2025-07-24 13:10:29'),
(15, 15, '2f9d6f605c91c63df0b2a6dfdcf47712', '2025-07-24 13:11:49'),
(16, 15, '406c7a4a47e0e3d219d806102129f829', '2025-07-24 13:12:05'),
(17, 15, 'a4da77d40580206bbf64903be12ec572', '2025-07-24 13:14:19'),
(19, 18, '9417f5e0d1efcd65dff5280cbd2a9be7', '2025-07-24 13:47:32'),
(20, 17, 'ad7ae743b9445e5e8329c72e61e793b9', '2025-07-24 14:02:00'),
(22, 19, 'eb86bea161b12d1605aabda8ca0d789d', '2025-07-24 22:27:49'),
(25, 15, '87ca48cba1827cced38cfb1b81a400ca', '2025-08-01 01:53:36'),
(26, 15, '63148d96d133cca71ab2c493f4aaa45f', '2025-08-01 01:53:37'),
(27, 15, 'fcfd112b24b0817dee5270a843b75ab9', '2025-08-01 02:01:05'),
(28, 15, '3c28a6e4761b4c973847081643c98ded', '2025-08-01 02:01:48'),
(29, 15, '1344a2bec50961ce6a0058fe7e3d7a98', '2025-08-01 02:03:20'),
(30, 17, '9fa55eaf5d53d11723c65713f578c64c', '2025-08-01 02:04:17');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(150) NOT NULL,
  `tipo_identificacion` enum('CC','TI','CE','') DEFAULT NULL,
  `num_identificacion` varchar(20) DEFAULT NULL,
  `correo` varchar(100) NOT NULL,
  `clave` varchar(255) NOT NULL,
  `fecha_registro` datetime DEFAULT current_timestamp(),
  `rol` enum('usuario','bibliotecario') NOT NULL DEFAULT 'usuario'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre`, `apellido`, `tipo_identificacion`, `num_identificacion`, `correo`, `clave`, `fecha_registro`, `rol`) VALUES
(15, 'David', 'Ortegón', 'CC', '1234567899', 'tutadavid1@gmail.com', '$2y$10$xkmwsagbevvteiJD.VZKXuNavAdzqiHeLN/8VtPWiAVELC8uGuc7y', '2025-07-23 16:58:25', 'usuario'),
(17, 'Chapito', 'Rodrigues', 'CC', '5755354576', 'tutasantiago@hotmail.com', '$2y$10$JS5BxyNEQ1KTh7aZpStR7uAtWjzL9FISZAz8LlYEvTyrqWI.IrjWa', '2025-07-23 21:31:19', 'usuario'),
(18, 'Zulma', 'Ortegón', 'CC', '4567886545', 'zeof__cos@hotmail.com', '$2y$10$UAUHDA47jDTiAJkiNQJJXORBSRp.gnBlsAZVELKVat6uLABms0esu', '2025-07-24 08:46:55', 'usuario'),
(19, 'Dayhana ', 'Milena', 'TI', '2345678998', 'murciacastillod@gmail.com', '$2y$10$rLYCK0VOT3xxEIzmzreU3uI6vIlnSOqvGp4zm5J1jiMhFSITqXVtW', '2025-07-24 17:27:39', 'usuario');

-- --------------------------------------------------------

--
-- Estructura Stand-in para la vista `vista_calificaciones`
-- (Véase abajo para la vista actual)
--
CREATE TABLE `vista_calificaciones` (
`libro_id` int(11)
,`promedio_calificacion` decimal(14,4)
,`total_reseñas` bigint(21)
);

-- --------------------------------------------------------

--
-- Estructura para la vista `vista_calificaciones`
--
DROP TABLE IF EXISTS `vista_calificaciones`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `vista_calificaciones`  AS SELECT `reseñas`.`libro_id` AS `libro_id`, avg(`reseñas`.`calificacion`) AS `promedio_calificacion`, count(0) AS `total_reseñas` FROM `reseñas` GROUP BY `reseñas`.`libro_id` ;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `autores`
--
ALTER TABLE `autores`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `bibliotecarios`
--
ALTER TABLE `bibliotecarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `correo` (`correo`);

--
-- Indices de la tabla `comentarios`
--
ALTER TABLE `comentarios`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `editoriales`
--
ALTER TABLE `editoriales`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `generos`
--
ALTER TABLE `generos`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `libros`
--
ALTER TABLE `libros`
  ADD PRIMARY KEY (`id`),
  ADD KEY `autor_id` (`autor_id`),
  ADD KEY `editorial_id` (`editorial_id`),
  ADD KEY `genero_id` (`genero_id`);

--
-- Indices de la tabla `lista_deseos`
--
ALTER TABLE `lista_deseos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`),
  ADD KEY `libro_id` (`libro_id`);

--
-- Indices de la tabla `notificaciones_pendientes`
--
ALTER TABLE `notificaciones_pendientes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`),
  ADD KEY `libro_id` (`libro_id`);

--
-- Indices de la tabla `prestamos`
--
ALTER TABLE `prestamos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`),
  ADD KEY `libro_id` (`libro_id`);

--
-- Indices de la tabla `reseñas`
--
ALTER TABLE `reseñas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`),
  ADD KEY `libro_id` (`libro_id`);

--
-- Indices de la tabla `solicitudes_recuperacion_contrasena`
--
ALTER TABLE `solicitudes_recuperacion_contrasena`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuario_id` (`usuario_id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `correo` (`correo`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `autores`
--
ALTER TABLE `autores`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT de la tabla `bibliotecarios`
--
ALTER TABLE `bibliotecarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `comentarios`
--
ALTER TABLE `comentarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `editoriales`
--
ALTER TABLE `editoriales`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `generos`
--
ALTER TABLE `generos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de la tabla `libros`
--
ALTER TABLE `libros`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- AUTO_INCREMENT de la tabla `lista_deseos`
--
ALTER TABLE `lista_deseos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=42;

--
-- AUTO_INCREMENT de la tabla `notificaciones_pendientes`
--
ALTER TABLE `notificaciones_pendientes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `prestamos`
--
ALTER TABLE `prestamos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `reseñas`
--
ALTER TABLE `reseñas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `solicitudes_recuperacion_contrasena`
--
ALTER TABLE `solicitudes_recuperacion_contrasena`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `comentarios`
--
ALTER TABLE `comentarios`
  ADD CONSTRAINT `comentarios_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`);

--
-- Filtros para la tabla `libros`
--
ALTER TABLE `libros`
  ADD CONSTRAINT `libros_ibfk_1` FOREIGN KEY (`autor_id`) REFERENCES `autores` (`id`),
  ADD CONSTRAINT `libros_ibfk_2` FOREIGN KEY (`editorial_id`) REFERENCES `editoriales` (`id`),
  ADD CONSTRAINT `libros_ibfk_3` FOREIGN KEY (`genero_id`) REFERENCES `generos` (`id`);

--
-- Filtros para la tabla `lista_deseos`
--
ALTER TABLE `lista_deseos`
  ADD CONSTRAINT `lista_deseos_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`),
  ADD CONSTRAINT `lista_deseos_ibfk_2` FOREIGN KEY (`libro_id`) REFERENCES `libros` (`id`);

--
-- Filtros para la tabla `notificaciones_pendientes`
--
ALTER TABLE `notificaciones_pendientes`
  ADD CONSTRAINT `notificaciones_pendientes_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`),
  ADD CONSTRAINT `notificaciones_pendientes_ibfk_2` FOREIGN KEY (`libro_id`) REFERENCES `libros` (`id`);

--
-- Filtros para la tabla `prestamos`
--
ALTER TABLE `prestamos`
  ADD CONSTRAINT `prestamos_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`),
  ADD CONSTRAINT `prestamos_ibfk_2` FOREIGN KEY (`libro_id`) REFERENCES `libros` (`id`);

--
-- Filtros para la tabla `reseñas`
--
ALTER TABLE `reseñas`
  ADD CONSTRAINT `reseñas_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`),
  ADD CONSTRAINT `reseñas_ibfk_2` FOREIGN KEY (`libro_id`) REFERENCES `libros` (`id`);

--
-- Filtros para la tabla `solicitudes_recuperacion_contrasena`
--
ALTER TABLE `solicitudes_recuperacion_contrasena`
  ADD CONSTRAINT `solicitudes_recuperacion_contrasena_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
