import { FleaMarketItem } from "./types";
import express from "express";
import axios from "axios";

const app = express();

let itemsData: FleaMarketItem[] = [];

// Función para obtener datos
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
    console.log("Items data fetched:", itemsData); // Verifica que los datos se están cargando
  } catch (error) {
    console.error("Error fetching items:", error);
  }
};

// Configura las rutas
const setupRoutes = () => {
  app.get("/api/items", (_, res) => {
    console.log("Items data on request:", itemsData); // Verifica el estado de itemsData
    res.json(itemsData);
  });

  app.get("/", (_, res) => {
    res.json({ message: "Hello world" });
  });
};

// Inicializa el servidor
const initialize = async () => {
  await fetchItems(); // Espera a que los datos se carguen

  setupRoutes(); // Configura las rutas después de cargar los datos

  setInterval(fetchItems, 28800000); // Configura el intervalo para actualizar los datos

  // Solo para desarrollo
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
