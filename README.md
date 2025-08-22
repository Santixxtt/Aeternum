# AETERNUM - Biblioteca Digital

Proyecto web de una biblioteca digital donde los usuarios pueden explorar, agregar libros a su lista de deseos, descargar libros de dominio público, pedir prestamos de estos libros de dominio publico si se encuentran en la API, manejo de sus libros.



## 📁 Estructura de Carpetas

Aeternum/
│
├── api/                      # Endpoints de API (¿REST?, ¿JSON? Podríamos afinarlo)
│
├── config/
│   ├── conexion.php          # Configuración de conexión a DB
│   └── configuracion.php     # Otras configuraciones globales
│
├── public/
│   ├── assets/               # Recursos estáticos
│   │   ├── css/
│   │   ├── img/
│   │   └── js/
│   ├── index.html            # Landing principal
│   ├── login.php             # Página de login
│   └── registro.php          # Registro de usuarios
│
├── src/
│   ├── Controllers/          # Lógica de controladores
│   ├── Models/               # Clases que representan tus datos
│   ├── Views/                # Vistas renderizadas
│   ├── Utils/                # Funciones útiles
│   └── Librerias/            # Libs externas o custo
│
└── README.md                # Documentación del proyecto



---

## ⚙️ Stack Tecnológico

| Tecnología      | Descripción                                     |
|-----------------|-------------------------------------------------|
| **HTML5**       | Estructura del sitio.                           |
| **CSS3**        | Estilos personalizados.                         |
| **JavaScript**  | Lógica de interfaz y consumo de la API de OpenLibrary. |
| **PHP**         | Backend para sesiones, conexión a base de datos, lista de deseos, etc. |
| **MySQL**       | Base de datos relacional para libros, usuarios y listas de deseos. |
| **PHPMailer**   | Envío de correos para recuperación de contraseñas. |
| **API OpenLibrary** | Fuente de datos de libros en tiempo real. |

---

## 🛠️ Configuración Inicial

### Clonar el proyecto:

git clone [https://github.com/Santixxtt/Aeternum]

## Base de Datos

aeternum.sql

## Dependencias

composer require phpmailer/phpmailer
composer require openlibrary/openlibrary
composer require XAMPP/XAMPP

