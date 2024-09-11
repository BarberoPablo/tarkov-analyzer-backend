import { FleaMarketItem } from "./types";
import express from "express";
import cors from "cors";
import axios from "axios";

const app = express();

app.use(cors({ origin: "http://localhost:5173/" }));

//let itemsData: FleaMarketItem[] = [];

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

    return response.data.data.items;
  } catch (error) {
    console.error("Error fetching items:", error);
  }
};

/* // Fetch items data when the server starts
fetchItems().then(() => {
  // Set up an interval to fetch items every 8 hours (28800000 ms)
  setInterval(fetchItems, 60000);
}); */

app.get("/api/items", async (_, res) => {
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

    console.log("Items data on request");
    res.json(response.data.data.items);
  } catch (error) {
    console.error("Error fetching items:", error);
  }
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

export default app;
