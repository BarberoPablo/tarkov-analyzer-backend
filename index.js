"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const app = (0, express_1.default)();
// Variable para almacenar la respuesta
let itemsData = [];
// Función para obtener datos de la API de Tarkov
const fetchItems = async () => {
    try {
        const response = await axios_1.default.post("https://api.tarkov.dev/graphql", {
            query: `
        {
          items(lang: en) {
            id
            name
            shortName
            avg24hPrice
            lastOfferCount
            lastLowPrice
          }
        }
      `,
        });
        itemsData = response.data.data.items;
        console.log("Datos actualizados:", itemsData);
    }
    catch (error) {
        console.error("Error fetching items:", error);
    }
};
// Ruta para obtener los datos
app.get("/api/items", (req, res) => {
    res.json(itemsData);
});
// Llama a fetchItems al iniciar el servidor
fetchItems();
// Configura el intervalo para actualizar los datos cada 8 horas
setInterval(fetchItems, 28800000);
// Exporta el manejador de solicitudes para Vercel
exports.default = app;
if (process.env.NODE_ENV !== "production") {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}
