# Aeternum - Libreria Virtual

Aeternum es una libreria virtual moderna que busca que los usuarios puedan leer o encontrar libros de manera facil, rapida y segura en un solo lugar, permitiendo a los libros públicos opción de descarga, tambien enfocandose en un entorno real donde se puedan hacer prestamos fisicos. Funcionando con React y FastAPI con varias capas de seguridad para que tus datos esten seguros.

---

## 🧩 Manual de Usuario

1. ### Introducción
   
   Este manual describe cómo instalar y ejecutar la aplicación web *Aeternum*, desarrollada con **FastAPI** como backend y       **React + Vite** como frontend, para que puedas entender mejor como funciona y si quieres desplegarlo localmente. A           continuación, detallaremos los requisitos previos y las instrucciones paso a paso para cada componente    de la aplicación.
   
2. ### 💻 Requisitos del Sistema

   Para garantizar un funcionamiento óptimo de **Librería Aeternum**, se recomienda contar con lo siguiente:
   
   * **Python:** 3.11 o superior (para el backend con FastAPI)
   * **Node.js:** v20.x o superior (para el frontend con React/Vite)
   * **Git:** Para clonar el repositorio.
   * **MySQL**: MySQL instalado localmente o credenciales de acceso a Railway
   * **Navegador Web**: Recomendado Google, Rave, FireFox o Edge

   ---
  
3. ### Preparación de Entorno

   - **Instalar Python**

     **Descarga:**
     Puedes obtener el instalador oficial desde [https://www.python.org/downloads/](https://www.python.org/downloads/).
    *(Recuerda marcar la opción para agregar Python al PATH durante la instalación en Windows.)*

     **Verificación (Bash):**
     Para confirmar la instalación, ejecuta:

      ```bash
      python --version
      pip --version
      ```
    - **Instalar Node.js**

       **Descarga:**
       Puedes obtener el instalador oficial desde [https://nodejs.org/en/download](https://nodejs.org/en/download).

       **Verificación (Bash):**
       Para confirmar la instalación, ejecuta:

       ```bash
       node -v
       npm -v
       ```
    - **Instalar Git**

       **Descarga:**
       Puedes obtener el instalador oficial desde [https://git-scm.com/download/](https://git-scm.com/download/).

       **Verificación (Bash):**
         Para confirmar la instalación, ejecuta:

       ```bash
       git --version
       ```
4. ### Clonar Repositorio

      ```
       git clone https://github.com/Santixxtt/Aeternum.git
      ```
5. ### Instalar Dependencias
   #### Requeriments.txt
   **Frontend**
   ```
   cd aeternum
   npm install
   ```
   **Backend**
   ```
   cd backend
   pip install -r requeriments.txt
   ```
   Aqui se instalaran todos los requerimientos que necesita el programa para funcionar
6. ### Configuración
   En la carpeta backend crearas un archivo **.env** integraras los siguientes contenidos
   **Base de Datos en la Nube**
   ```
   mysql://root:yUHXDnqrMmGvNygnFHjRHiKnWhiJrXZF@yamanote.proxy.rlwy.net:28425/railway
   ```
   **Redis**
   ```
   redis://default:yNnOdmFoFqSiobQgnVjOHccXRbGYWoSQ@crossover.proxy.rlwy.net:58201
   ```
   Si usas algun otro servicio o en la nube recuerda poner tu **URL** para quee pueda funcionar.
7. ### Ejecutar la Aplicación
   **Frontend**
   ```
   cd aeternum
   npm run dev
   ```
   **Backend**
   ```
   cd backend
   uvicorn app.main:app --reload
   ```
8. ### Verificación de Servidor y levantamiento
   **Backend**
   En el navegador preferiblemente Google, abriras ``` http://localhost:8000/docs ``` esto abrira el Swagger y verifica que     este la documentación activa.
   **Frontend**
   Para el frontend en el navegador abriras ``` http://localhost:5173 ```, deberas poder ver ya la interfaz de la página con    esta URL.

##### Manual de usuario: ```link_por_generar```
