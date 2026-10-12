const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const path = require("node:path");
const { leerJsonMascotas } = require("./archivos.js");

const app = express();
const PORT = 3000;

const rutaDatos = path.join(__dirname, "..", "datos", "mascotas.json");
const estadosPermitidos = ["En adopción", "Adoptada", "Reservada"];

async function main() {
  const mascotas = await leerJsonMascotas(rutaDatos);

  app.get("/api/mascotas", (req, res) => res.json(mascotas));

  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, "..", "views"));
  app.use(expressLayouts);
  app.set("layout", "layouts/main");
  app.use(express.static(path.join(__dirname, "..", "public")));
  app.use(express.urlencoded({ extended: false }));

  app.get("/", (req, res) => {
    res.render("inicio", {
      titulo: "Mascotas en adopcion",
      cantidad: mascotas.length,
    });
  });

  app.get("/mascotas", (req, res) => {
    res.render("mascotas/lista", {
      titulo: "Mascotas",
      mascotas,
    });
  });

  app.get("/mascotas/nueva", (req, res) => {
    res.render("mascotas/nueva", {
      titulo: "Registrar mascota",
      error: null,
      valores: {
        nombre: "",
        especie: "",
        edad: "",
        estado: estadosPermitidos[0],
        descripcion: "",
      },
      estadosPermitidos,
    });
  });

  app.get("/mascotas/:id", (req, res) => {
    const id = Number(req.params.id);
    const mascota = mascotas.find((item) => item.id === id);

    if (!mascota) {
      return res.status(404).render("no-encontrado", {
        titulo: "Mascota no encontrada",
        mensaje: "No encontramos una mascota con este id",
      });
    }
    res.render("mascotas/detalle", {
      titulo: mascota.nombre,
      mascota,
    });
  });

  app.post("/mascotas", (req, res) => {
    const valores = {
      nombre: String(req.body.nombre || "").trim(),
      especie: String(req.body.especie || "").trim(),
      edad: String(req.body.edad || "").trim(),
      estado: String(req.body.estado || "").trim(),
      descripcion: String(req.body.descripcion || "").trim(),
    };
    const edad = Number(valores.edad);
    let error = null;

    if (!valores.nombre || !valores.especie || valores.edad === "" || !valores.descripcion){
        error = "Completa todos los campos antes de enviar el formulario";
    }
    else if (!Number.isFinite(edad) || edad < 0){
        error = "La edad debe ser un numero mayor o igual a cero";
    }
    else if (!estadosPermitidos.includes(valores.estado)){
        error = "Selecciona uno de los estados disponibles";
    }

    if (error){
        return res.status(400).render("mascotas/nueva", {
            titulo: "Registrar mascota",
            valores,
            error,
            estadosPermitidos
        });
    }

    const ultimoId = mascotas.length === 0 ? 0 : Math.max(...mascotas.map((m) => m.id));
    const nuevaMascota = {
      id: ultimoId + 1,
      nombre: valores.nombre,
      especie: valores.especie,
      edad,
      estado: valores.estado,
      descripcion: valores.descripcion
    };

    mascotas.push(nuevaMascota);
    res.redirect("/mascotas");
  });

app.use((req, res) => {
    res.status(404).render("no-encontrado",{
        titulo: "Pagina no encontrada",
        mensaje: "La pagina que buscas no exite,"
    });
});


app.listen(PORT, () => {
    console.log(`Aplicacion disponible en http://localhost:${PORT}`);
});

}

main().catch((error) => {
    console.error("No se pudo iniciar la aplicacion:", error);
  process.exitCode = 1;
});
