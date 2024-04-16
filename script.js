// Importación de módulos necesarios
import express from "express";
import fs from "fs";
import path from "path";

//Crea una constante para la aplicacion de express
const app = express();
//Definición del puerto en el que se ejecutará el servidor
const PORT = 3000;

//Middleware para servir archivos estáticos desde el directorio 'public'
app.use(express.static(path.join("public")));

// Middleware para el manejo de datos en JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Array para almacenar los datos de los deportes
let deportes = [];

// Ruta POST para agregar un nuevo deporte
app.post("/agregar", (req,res) => {
    // Obtiene los datos de nombre y precio del cuerpo de la solicitud
    const {nombre, precio }= req.body;
    // Leer los datos actuales del archivo JSON de deportes
    try {
        // Intenta leer los datos actuales del archivo JSON de deportes
        deportes = JSON.parse(fs.readFileSync("deportes.json", "utf8"));
    } catch (error) {
        // Si hay un error al leer el archivo de deportes
        console.error("Error al leer el archivo de deportes:", error);
    }
    // Agregar el nuevo deporte a la lista deportes
   deportes.push({ nombre, precio });
   // Escribir los datos actualizados en el archivo JSON de deportes
   fs.writeFileSync("deportes.json", JSON.stringify(deportes));
   // Enviar una respuesta al cliente indicando que el deporte se ha agregado correctamente
   res.send(`Deporte ${nombre} agregado con exito.`);
});

// Ruta para obtener todos los deportes
app.get("/deportes", (req, res) => {
    try {
        // Intenta leer los datos actuales del archivo JSON de deportes
        deportes = JSON.parse(fs.readFileSync("deportes.json", "utf8"));
    } catch (error) {
         // Envía una respuesta al cliente con todos los deportes en formato JSON
        console.error("Error al leer el archivo de deportes:", error);
    }
    // Enviar una respuesta al cliente con todos los deportes en formato JSON
    res.json({ deportes });
});

// Ruta para editar el precio de un deporte
app.put("/editar/:nombre", (req, res) => {
    // Obtiene el nombre del deporte de los parámetros de la solicitud
    const { nombre } = req.params;
    // Obtiene el nuevo precio del deporte del cuerpo de la solicitud
    const { precio } = req.body;
    // Leer los datos actuales del archivo JSON de deportes
    try {
        deportes = JSON.parse(fs.readFileSync("deportes.json", "utf8"));
    } catch (error) {
        console.error('Error al leer el archivo de deportes:', error);
    }

    // Buscar el deporte por nombre y actualizar su precio
    const deporteIndex = deportes.findIndex(d => d.nombre === nombre);
    if (deporteIndex !== -1) {
        deportes[deporteIndex].precio = precio;
        // Escribir los datos actualizados en el archivo JSON de deportes
        fs.writeFileSync("deportes.json", JSON.stringify(deportes));
        // Enviar una respuesta al cliente indicando que el precio del deporte se ha actualizado correctamente
        res.send("Precio del deporte actualizado correctamente.");
    } else {
        // Enviar una respuesta de error al cliente si el deporte no se encuentra
        res.status(404).send("Deporte no encontrado.");
    }
});

// Ruta para eliminar un deporte
app.delete("/eliminar/:nombre", (req, res) => {
    // Obtiene el nombre del deporte de los parámetros de la solicitud
    const { nombre } = req.params;
    // Leer los datos actuales del archivo JSON de deportes
    try {
        deportes = JSON.parse(fs.readFileSync("deportes.json", "utf8"));
    } catch (error) {
        console.error("Error al leer el archivo de deportes:", error);
    }
    // Filtrar los deportes, excluyendo el deporte a eliminar
    const deportesFiltrados = deportes.filter(d => d.nombre !== nombre);
    // Escribir los datos actualizados en el archivo JSON de deportes
    fs.writeFileSync("deportes.json", JSON.stringify(deportesFiltrados));
    // Enviar una respuesta al cliente indicando que el deporte se ha eliminado correctamente
    res.send("Deporte eliminado correctamente.");
});

// Iniciar el servidor y escuchar en el puerto especificado
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

//Crear una ruta genérica que devuelva un mensaje diciendo “Esta página no existe...” al consultar una ruta que no esté definida en el servidor.
app.get("*", (req, res) => {
    //
    res.send("Esta página no existe");
});