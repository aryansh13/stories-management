import express from "express";
import cors from "cors";
import db from './config/Database.js';
import routesApi from './routes/RoutesApi.js';


const app = express();
app.use(cors());
app.use(express.json());
app.use(routesApi);

// Sync semua model dengan database
(async () => {
    try {
        await db.sync();
        console.log("All models were synchronized successfully.");
    } catch (error) {
        console.error("Failed to sync models:", error);
    }
})();

app.listen(5000, () => console.log("Server up and is running..."));