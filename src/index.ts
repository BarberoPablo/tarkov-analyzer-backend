import express from "express";
import axios from "axios";
import { FleaMarketItem } from "./types";

const app = express();

let itemsData: FleaMarketItem[] = [];

const fetchItems = async (): Promise<void> => {
  try {
    const response = await axios.post("https://api.tarkov.dev/graphql", {
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
  } catch (error) {
    console.error("Error fetching items:", error);
  }
};

app.get("/api/items", (req, res) => {
  res.json(itemsData);
});

app.get("/api", (req, res) => {
  res.json({ message: "Hello /api" });
});

app.get("/", (req, res) => {
  res.json({ message: "Hello " });
});

// Llama a fetchItems al iniciar el servidor
fetchItems();

// Configura el intervalo para actualizar los datos cada 8 horas
setInterval(fetchItems, 28800000);

// Exporta el manejador de solicitudes para Vercel

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
