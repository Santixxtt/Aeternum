## Aeternum
El Manual de Usuario de Librería Aeternum es una guía práctica diseñada para orientar al usuario final —tanto administradores como lectores— en el uso correcto del sistema.
Su propósito es garantizar una experiencia sencilla, clara y eficiente, evitando el uso de lenguaje técnico innecesario.

Este manual busca que el usuario pueda navegar, realizar préstamos, devoluciones y consultar el catálogo sin dificultad.

🧩 Componentes del Manual de Usuario

🏠¡Bienvenido(a) a Librería Aeternum! Este sistema fue desarrollado como una herramienta digital para gestionar libros, préstamos y devoluciones de manera moderna y automatizada.

Propósito del software:
Optimizar los procesos bibliotecarios, reduciendo tiempos de búsqueda y registro, tanto para usuarios como para el personal administrativo.

Público objetivo:
El sistema está dirigido a administradores, encargados de la gestión de la biblioteca, y a usuarios registrados, quienes pueden consultar el catálogo y realizar préstamos.

Convenciones usadas:

Negrita: destaca nombres de botones o secciones.

Cursiva: resalta opciones o acciones específicas.

🔹 Íconos: indican pasos o advertencias importantes.

Contacto de soporte:
📧 aeternum.soporte@gmail.com

💬 Chat interno disponible para soporte técnico en la interfaz administrativa.

💻 Requisitos del Sistema

Para garantizar un funcionamiento óptimo de Librería Aeternum, se recomienda contar con un equipo moderno y actualizado.
El sistema puede ejecutarse en Windows y requiere una instalación previa de Node.js y una base de datos MongoDB activa.

El hardware mínimo recomendado incluye un procesador Intel i3 o equivalente, 4 GB de memoria RAM, y al menos 500 MB de espacio libre en disco.
Sin embargo, para un rendimiento más fluido, se aconseja utilizar un equipo con 8 GB de RAM y un procesador Intel i5 o superior.

En cuanto al software, se recomienda utilizar un navegador moderno como Google Chrome. Además, se debe contar con Git instalado para clonar el repositorio y gestionar versiones del proyecto. 

⚙️ Instalación y Configuración
🪜 Pasos de instalación

Clonar el repositorio del proyecto:

git clone https://github.com/Santixxtt/Aeternum_new.git
cd Aeternum_new


Instalar dependencias:

npm install

Ejecutar el proyecto en entorno local:

npm run dev


Abrir el navegador en 👉 http://localhost:5173/

🚀 Primeros Pasos / Inicio Rápido

Inicia sesión con tus credenciales registradas.

Accede al menú principal, donde podrás:

📚 Consultar el catálogo de libros disponibles.

🔖 Solicitar préstamos y verificar su estado.

📅 Registrar devoluciones de ejemplares.

👤 Editar tu perfil o actualizar información personal.

🖥️ Descripción de la Interfaz

La interfaz de Librería Aeternum es intuitiva y está organizada por módulos:

Inicio: resumen de libros disponibles y préstamos activos.

Usuarios: permite registrar, modificar o eliminar usuarios.

Libros: gestión del inventario bibliotecario.

Préstamos: registro y control de préstamos y devoluciones.

Reportes: estadísticas y reportes de uso.

🔧 Funcionalidades Principales

Registro, actualización y eliminación de libros.

Administración de usuarios con diferentes roles.

Control de préstamos y devoluciones.

Búsqueda avanzada por título, autor o categoría.

Generación de reportes en tiempo real.

Descarga de libros 

Opción de agregar comentario o generar una reseña acerca del libro

❗ Manejo de Errores y Solución de Problemas

🔑 No se puede iniciar sesión
   Causa posible🤔: Usuario no registrado o contraseña incorrecta ❌
   Solución✅: Verificar credenciales o contactar al administrador 📲

🖥️ El servidor no inicia
   Causa posible🤔: Falta de dependencias 📜
   Solución✅: Ejecutar npm install ⬇️

⏰ Lentitud en el sistema
   Causa Posible🤔: Exceso de registros, conexión débil o procesos simultáneos 🔃
   Solución✅: Optimizar consultas, limpiar base de datos y usar índices en colecciones grandes 🗂️

💬❓ Preguntas Frecuentes (FAQ)

¿Puedo acceder desde el celular? 📱
Sí, la aplicación es completamente responsive. 🤳

¿Qué pasa si olvido mi contraseña? 🧠
Puedes solicitar una nueva desde la opción “Recuperar contraseña” en el login. 🔔

¿Se pueden tener varios administradores? 👥
Sí, el sistema admite múltiples administradores con diferentes permisos. 📌

📚 Glosario

Backend: parte del sistema que maneja la lógica y los datos. ✍️

Frontend: interfaz visible para el usuario. 👀

Préstamo: asignación temporal de un libro a un usuario. 📚

Devolución: acción de regresar un libro prestado. ⬆️

🧰 Manual de Instalación – Librería Aeternum
Introducción

Este manual explica cómo instalar y ejecutar la aplicación Librería Aeternum, desarrollada con React, Vite, TailwindCSS, Node.js y Python.

Requisitos previos

Para ejecutar el sistema correctamente, asegúrate de tener instalados los siguientes componentes:

Sistema operativo compatible: Windows 10 

Node.js versión 18 o superior

Git instalado y configurado

Preparación del entorno

Instala Node.js

Verifica las versiones instaladas:

node -v
npm -v
git -v

Instalación del proyecto
git clone https://github.com/Santixxtt/Aeternum_new.git
cd Aeternum_new
npm install

Verificación

Ejecuta el servidor y abre el navegador en:
👉  http://localhost:5173/

npm run dev

❗ Manejo de Errores y Solución de Problemas

A continuación se presentan algunos errores comunes que pueden surgir durante el uso o despliegue de Librería Aeternum, junto con sus causas y soluciones:

⚠️ Error: ❌ Cannot find module
  💡 Causa: Falta de dependencias
  ✅ Solución: Ejecuta el comando: npm install para reinstalar todos los módulos necesarios.

⚠️ Error: 🧩 Página vacía tras el despliegue
  💡 Causa: Error en la compilación del proyecto
  ✅ Solución: Ejecuta el comando: npm run build antes del despliegue para generar los archivos de producción.

⚠️ Error: 🧩 🧱 Error 404 - Página no encontrada
  💡 Causa: Ruta inexistente o mal definida en React Router
  ✅ Solución: Verifica las rutas del frontend y la configuración del enrutamiento.