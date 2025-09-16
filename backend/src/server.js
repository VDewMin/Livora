import dotenv from "dotenv";
dotenv.config();

console.log("PARCEL_VERIFY_SECRET =", process.env.PARCEL_VERIFY_SECRET);
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS length:", process.env.EMAIL_PASS?.length);

import express from "express";
import cors from "cors";

import sn_paymentRoutes from "./routes/sn_paymentRoutes.js";
import path from "path";
import usersRoutes from "./routes/vd_usersRoutes.js";
import parcelRoutes from "./routes/ks_parcelRoutes.js";

import serviceRequestRouter from "./routes/GKServicceRequestRoutes.js";
import { connectDB } from "./config/db.js";


const app = express();
const PORT = process.env.PORT || 5001;

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

//middleware
app.use(express.json()); //this middleware will parse JSON bodies: req.body

app.use("/api/users", usersRoutes);
app.use("/api/parcels", parcelRoutes);
app.use("/api/payments", sn_paymentRoutes);
app.use("/api/services", serviceRequestRouter);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server started on port: ", PORT);
  });
});
