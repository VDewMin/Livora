
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import path from "path";
import usersRoutes from "./routes/vd_usersRoutes.js";

import { connectDB } from "./config/db.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001
const __dirname = path.resolve();

app.use(
    cors({
        origin: "http://localhost:5173",
}));

//middleware
app.use(express.json());  //this middleware will parse JSON bodies: req.body

app.use("/api/users", usersRoutes);

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("Server started on port: ", PORT);
    });
});


