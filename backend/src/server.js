import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import sn_paymentRoutes from "./routes/sn_paymentRoutes.js";
import sn_expenseRoutes from "./routes/sn_expenseRoutes.js"
import usersRoutes from "./routes/vd_usersRoutes.js";
import parcelRoutes from "./routes/ks_parcelRoutes.js"
import serviceRequestRouter from "./routes/GKServicceRequestRoutes.js";
import { connectDB } from "./config/db.js";
import noteRoutes from "./routes/SDnotesRoutes.js";
import purchaseRoutes from "./routes/SDpurchaseRoutes.js";
import conventionHallBookingRoutes from "./routes/SDConventionHallBookingRoutes.js";
import laundryRoutes from "./routes/SDlaundryRoutes.js";


dotenv.config();

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
app.use("/api/notes",noteRoutes)
app.use("/api/purchases", purchaseRoutes)
app.use('/api/convention-hall-bookings',conventionHallBookingRoutes)
app.use('/api/laundry', laundryRoutes);



connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server started on port: ", PORT);
  });
});