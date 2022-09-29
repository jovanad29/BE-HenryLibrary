# BE-HenryLibrary
Proyecto Grupal Henry Bootcamp

 <img src = "./front/public/home.jpg" >
 
 <br />

#

# E.Commerce sobre una libreria -> "Libreria Henry"

## Tecnologías utilizadas:

* __Javascript__
* __ReactJS__
* __Redux__
* __Hooks__
* __Chakra-ui__
* __Node.Js__
* __Express__
* __PostgreSQL / Sequelize__
* __Firebase__
* __MercadoPago__
* __Cloudinary__


<p align="left"> <a href="https://www.w3schools.com/css/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/css3/css3-original-wordmark.svg" alt="css3" width="40" height="40"/> </a> <a href="https://expressjs.com" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/express/express-original-wordmark.svg" alt="express" width="40" height="40"/> </a> <a href="https://firebase.google.com/" target="_blank" rel="noreferrer"> <img src="https://www.vectorlogo.zone/logos/firebase/index.html" alt="firebase" width="40" height="40"/> </a> <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg" alt="javascript" width="40" height="40"/> </a> <a href="https://nodejs.org" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/nodejs/nodejs-original-wordmark.svg" alt="nodejs" width="40" height="40"/> </a> <a href="https://www.postgresql.org" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/postgresql/postgresql-original-wordmark.svg" alt="postgresql" width="40" height="40"/> </a> <a href="https://reactjs.org/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original-wordmark.svg" alt="react" width="40" height="40"/> </a> <a href="https://es.redux.js.org/" target="_blank" rel="noreferrer"> <img src="https://www.svgrepo.com/svg/303557/redux-logo" alt="redux" width="40" height="40"/> </a> </p>


## Antes de empezar
Es necesario tener, al menos, la última versión estable de Node y NPM. Asegurese de tenerlas para instalar correctamente las dependencias necesarias para correr el proyecto.

Las versiones requeridas son:
- **Node**: 14.20 o superior
- **NPM**: 6.14 o superior

Para chequear que versiones tiene instaladas:
> node -v
>
> npm -v

## Instrucciones para correr el servidor de desarrollo

1. Clonar el repositorio
2. Crear una base de datos en postgres llamada bookst.
3. Hay dos carpetas: api y client. En estas carpetas estará el código back-end y front-end respectivamente.
4. Crear un archivo en api llamado .env, que tendrá la siguiente estructura: 

```
DB_USER=USUARIO_DE_DB
DB_PASSWORD=CONTRASEÑA_DE_DB
DB_HOST=localhost
DB_NAME=bookst
PASS_TOKEN=RaJwsh6NCfw4iTEu5fQpIsSlsQpUwxcPQguV3wpW60hStpAiFUKhp7laK8ONV6thYpf49mmFk0p7wm0OMiKjx0SIY8O4iU3YfA7pAqJByP2VdKhcHdXLmtv0SPo7B12fUHdht0QuI2pcw788yvzLXcZkRjyrCGrSv7CDYYDKVDmxjGm8OkDmTdociAvkNGAugc3fvmuy
MP_TOKEN=TEST-304236252926467-071712-29f3115ab12dc5ed7152e3a819778937-1162304452
EMAIL=henrylibreria@gmail.com
PASS=mokjforciolvkdaz
CLOUDINARY_NAME=dyohzviwo
CLOUDINARY_API_KEY=668372617521248
CLOUDINARY_API_SECRET=5QNVD-hIZPsnZ3lD39gLRKlAV-M
```

Reemplazar postgresUser y postgresPassword por tus propias credenciales para conectarse a postgres.

5. Correr los siguientes comandos en las carpetas /api y /front:
```
npm install
npm run sync (en api para sincronizar la base de datos con la API externa)
npm start
```

## Descripción
La aplicación tiene como finalidad poder brindarle al usuario una visualización de libros disponibles.
La plataforma no solo funcionará como un e-commerce, sino que también permitirá que los usuarios puedan dejar reviews una vez realizada la compra.

**Datos bancarios para poder simular una compra:**
- nickname: TETE2302478
- password: k8SOn8B1Ld
- email: test_user_14796887@testuser.com

Tarjetas:
- Mastercard: 5031 7557 3453 0604
- Visa: 4509 9535 6623 3704
CVC: 123, Vto: 11/25
dni: 01111111



## Funcionalidades:

**Funcionalidades extras:**
- Claro/Oscuro
- Idioma Español/Ingles
- Pagina Web totalmente responsive para Iphone 12 Pro (390 x 844)

 <img src = "./front/public/claroOscuro.jpg">
 <img src = "./front/public/responsive.jpg">


**Como usuario, usted puede:**
- Ver los libros disponibles
- Registrarse y logearse en la aplicación
- Agregar libros al carrito y pagarlas mediante mercado pago
- Seleccionar libros como favoritos 
- Filtrar libros con diferentes criterios
- Buscar libros por nombre
- Ordenar libros por precio y recomendaciones
- Acceder al detalle de cada libro 
- Una vez comprado un libro, puede dejar un review
- Acceder al panel de usuario donde puedo ver mis datos personales, cambiar la direccion, cambiar la contraseña, ver mi historial de compra y historial de review

<img src = "./front/public/detalles de libros.jpg" />
<img src = "./front/public/panelDeUsuario.jpg"/>
<img src = "./front/public/carrito.jpg/>


**Como administrador, usted puede:**
- Banear usuarios, imposibilitandolos de poder comprar libros y dejar reviews. 
- Enviar un email al usuario cuando se banneo
- Crear, editar y eliminar libros
- Disponer de un listado de compras completadas de usuarios, y poder cancelarlas en caso que hubiera alguna anomalía
- Enviar un email a todos los usuarios que compraron un determinada libro.

Vista de administrador (panel de control):



## Deployment

La aplicación tiene el backend y bases de datos en [RAILWAY](https://railway.app/) y el frontend en [NETLIFY](https://netlify.com)

[Link](https://henry-library.netlify.app/) para visitar la app.



