const fs = require("node:fs/promises");

async function leerJsonMascotas(ruta) {
  const contenido = await fs.readFile(ruta, "utf-8");
  return JSON.parse(contenido);
}

module.exports = { leerJsonMascotas };
