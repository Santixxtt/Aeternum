<?php

    include("configuracion.php");
    $conexion = new mysqli($host, $user, $password, $db);
    if(mysqli_connect_error()) {
        echo "No esta conectado a la base de datos ", mysqli_connect_error();
        exit();
    } /*else {
        echo "Conectado con la Base de Datos";
    }*/
?>