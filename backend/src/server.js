
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import sn_paymentRoutes from "./routes/sn_paymentRoutes.js";
import path from "path";
import usersRoutes from "./routes/vd_usersRoutes.js";
import parcelRoutes from "./routes/ks_parcelRoutes.js"
import Stripe from "stripe"
import serviceRequestRouter from "./routes/GKServicceRequestRoutes.js";
import { connectDB } from "./config/db.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.use(
    cors({
        origin: "http://localhost:5173",
}));

//middleware
app.use(express.json());  


app.use("/api/users", usersRoutes);
app.use("/api/parcels", parcelRoutes);
app.use("/api/payments", sn_paymentRoutes)
app.use("/api/services", serviceRequestRouter);






connectDB().then(() => {
    app.listen(PORT, () => {
     console.log("Server started on port: ", PORT);
    });
});


