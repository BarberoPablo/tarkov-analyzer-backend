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
    console.log(itemsData);
  } catch (error) {
    console.error("Error fetching items:", error);
  }
};

// Llama a fetchItems al iniciar el servidor
const startServer = async () => {
  await fetchItems();

  // Configura el intervalo para actualizar los datos cada 8 horas
  setInterval(fetchItems, 28800000);

  app.get("/api/items", (_, res) => {
    res.json(itemsData);
  });

  app.get("/", (_, res) => {
    res.json({ message: "Hello world" });
  });

  if (process.env.NODE_ENV !== "production") {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  }
};

startServer();

export default app;
