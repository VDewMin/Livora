import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import path from "path";
import sn_paymentRoutes from "./routes/sn_paymentRoutes.js";
import sn_expenseRoutes from "./routes/sn_expenseRoutes.js"
import usersRoutes from "./routes/vd_usersRoutes.js";
import parcelRoutes from "./routes/ks_parcelRoutes.js"
import serviceRequestRouter from "./routes/GKServicceRequestRoutes.js";
import { connectDB } from "./config/db.js";

const app = express();
const PORT = process.env.PORT || 5001


app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        credentials: true,
    })
);

//middleware
app.use(express.json());  


app.use("/api/users", usersRoutes);
app.use("/api/parcels", parcelRoutes);
app.use("/api/payments", sn_paymentRoutes)
app.use("/api/expenses", sn_expenseRoutes)
app.use("/api/services", serviceRequestRouter);


connectDB().then(() => {
    app.listen(PORT, () => {
     console.log("Server started on port: ", PORT);
    });
});


