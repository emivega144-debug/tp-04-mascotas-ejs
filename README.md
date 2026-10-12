# Trabajo práctico 04

## Descripción
Aplicación web para consultar mascotas en adopción y agregar temporalmente nuevos registros mediante un formulario. Utiliza Express y EJS para renderizar las páginas HTML.

## Instalación
Para inicializar y preparar el proyecto, ejecuta:
* npm init -y
* npm install express ejs express-ejs-layouts

## Ejecución
Para iniciar la aplicación:
* Instala las dependencias con npm install.
* Inicia el servidor ejecutando npm start.

## Páginas y rutas
* GET /: Muestra la página inicial.
* GET /mascotas: Muestra el listado de mascotas disponibles.
* GET /mascotas/nueva: Presenta el formulario para agregar mascotas.
* GET /mascotas/:id: Muestra el detalle de una mascota en particular (o una página de error 404 si no existe).
* POST /mascotas: Ruta encargada de procesar el formulario.

## Estructura de vistas
El proyecto utiliza plantillas EJS organizadas en la carpeta views/, dividiendo la interfaz gráfica en un layout principal, vistas específicas por página y parciales. 

## Recursos estáticos
La hoja de estilos CSS, la imagen SVG y el archivo JavaScript se toman desdes la carpeta public/.

## Formulario
El formulario permite cargar una mascota enviando los datos requeridos por el método POST, aplicando una validación mínima en el servidor para asegurar que los campos sean válidos.

## Persistencia de los datos
La aplicación inicia leyendo los datos de un archivo mascotas.json, y todo registro nuevo se almacena únicamente de forma temporal.

## Explicaciones

* Diferencia entre layout, vista y parcial: El layout maneja la estructura general de la página HTML, la vista tiene el contenido específico de cada ruta, y el parcial es un bloque que se reutiliza, como un menú o un pie de página.
* Datos enviados a una vista mediante res.render: EJS procesa estos datos en el servidor y los convierte en variables para la plantilla. El navegador solo recibe el HTML ya armado, nunca el código de las instrucciones EJS.
* Función de express.static: Define una carpeta (como`public/) como la raíz pública del sitio. Esto permite acceder a archivos estáticos sin tener que escribir el nombre de esa carpeta en la URL.
* Función de express.urlencoded: Permite que el servidor pueda leer los datos que envía un formulario HTML tradicional. Los procesa y los deja listos para usar adentro de req.body.
* Recorrido POST, redirección y GET: Tras procesar un POST correctamente, se redirige al usuario a una ruta GET (como el listado). Esto evita que, si el usuario actualiza la pestaña, se vuelva a enviar el formulario por accidente.
* Motivo por el cual el nuevo registro desaparece al reiniciar: Los registros nuevos solo se guardan en la memoria temporal mediante un .push() y no se escriben en el archivo JSON original. Por eso, al reiniciar el servidor, la memoria se limpia y los datos se pierden.