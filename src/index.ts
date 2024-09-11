import { FleaMarketItem } from "./types";
import express from "express";
import axios from "axios";

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
    console.log("Items data fetched:", itemsData);
  } catch (error) {
    console.error("Error fetching items:", error);
  }
};

// Inicializa y configura el servidor
const initialize = async () => {
  await fetchItems(); // Asegúrate de que los datos estén cargados

  setInterval(fetchItems, 28800000); // Configura el intervalo para actualizar los datos

  // Rutas
  app.get("/api/items", (_, res) => {
    res.json(itemsData);
  });

  app.get("/", (_, res) => {
    res.json({ message: "Hello world" });
  });

  // Escucha en el puerto solo en desarrollo
  if (process.env.NODE_ENV !== "production") {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  }
};

// Llama a la función de inicialización
initialize();

export default app;
