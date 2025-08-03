# Guia\_EstandaresCodigo.md Aeternum

## 1. Reglas de Nombres

### Variables (JavaScript & PHP)

* Usar nombres descriptivos en **camelCase**.
* Variables de contexto global deben tener prefijos que indiquen su uso.
* Evitar abreviaciones ambiguas.

**Ejemplos Aceptados:**

```js
let userList = [];
let bookRecommendation = {};
```

**Ejemplos NO Aceptados:**


### Clases (PHP)

* Nombre en **PascalCase**.
* Prefijo por módulo si aplica (ej: BookController).

**Ejemplos Aceptados:**

```php
class UserController {}
class WishlistModel {} // Se pueden usar minusculas y guiones bajos desde que este bien especificado para que es
```


### Métodos y Funciones (JS & PHP)

* Usar **camelCase**.
* Nombrar con verbos descriptivos.
* En el JS de Aeternum, funciones que manipulen DOM deben llevar prefijo "render" o "update" si aplica.

**Ejemplos Aceptados:**

```php
function getUserLoans() {}
function addBookToWishlist() {}
```

**Ejemplos NO Aceptados:**

```php
function Get_user_loans() {}
function add_book() {}
```

## 2. Comentarios y Documentación Interna

* Comentar procesos de interacción con la API de Open Library.
* En funciones JS que modifican la interfaz, describir qué parte del DOM se afecta.
* En PHP, documentar funciones que hagan consultas complejas a la base de datos.
* Se puede comentar cosas que no se entiendan o requiran revisión.

**Ejemplo Correcto (JS):**

```js
// Render recommended books section from Open Library API response
function renderRecommendedBooks(data) {
    // Clear current list
    // Iterate API response and append to DOM
}
```

**Ejemplo Correcto (PHP):**

```php
// Fetch wishlist items for a specific user
public function getWishlistByUser($userId) {
    // Execute SQL JOIN to retrieve books with authors
}
```

## 3. Identación y Estilo de Código

* **4 espacios** para indentación.
* Llaves en la misma línea (PHP y JS).
* CSS estructurado por secciones (Header, Body, Footer).

**Ejemplo Correcto (PHP):**

```php
public function addLoan($userId, $bookId) {
    if ($this->isBookAvailable($bookId)) {
        // Insert loan into database
    }
}
```

**Ejemplo Correcto (JS):**

```js
if (userId !== null) {
    renderUserWishlist(userId);
}
```

Se deben seguir estas convenciones al desarrollar funcionalidades como:

* Registro de usuarios.
* Gestión de listas de deseos.
* Préstamo y devolución de libros.
* Consumo de la API de Open Library.

La consistencia en nombres, indentación y comentarios es requerida para mantener la calidad del código en Aeternum.
