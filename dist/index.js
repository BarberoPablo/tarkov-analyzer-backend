import express from "express";
import axios from "axios";
const app = express();
let itemsData = [];
const fetchItems = async () => {
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
    }
    catch (error) {
        console.error("Error fetching items:", error);
    }
};
// Fetch items data when the server starts
fetchItems().then(() => {
    // Set up an interval to fetch items every 8 hours (28800000 ms)
    setInterval(fetchItems, 60000);
});
app.get("/api/items", (_, res) => {
    console.log("Items data on request");
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
export default app;
