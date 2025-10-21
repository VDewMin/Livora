import ConventionHallBooking from "../models/SDConventionHallBooking.js";

export async function getAllBookings(req, res) {
  try {
    const bookings = await ConventionHallBooking.find().sort({ date: 1 });
    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error in getAllBookings:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getBookingById(req, res) {
  try {
    const booking = await ConventionHallBooking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    res.status(200).json(booking);
  } catch (error) {
    console.error("Error in getBookingById:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function createBooking(req, res) {
  try {
    const { name, phone_number, apartmentNo, userId, number_of_guests, time_duration, date, purpose } = req.body;
    console.log("Received booking data:", req.body);

    const existingBookings = await ConventionHallBooking.find({
      date: { $gte: new Date(date), $lte: new Date(date).setHours(23, 59, 59) },
    });
    console.log("Existing bookings:", existingBookings);

    const total_cost = time_duration * 500;
    const booking = new ConventionHallBooking({
      name,
      phone_number,
      apartmentNo,
      userId,
      number_of_guests,
      time_duration,
      date: new Date(date),
      purpose,
      total_cost,
    });
    console.log("New booking object:", booking);
    const savedBooking = await booking.save();
    console.log("Saved booking:", savedBooking);
    res.status(201).json(savedBooking);
  } catch (error) {
    console.error("Error in createBooking:", error.stack);
    res.status(500).json({ message: "Internal server error", details: error.message });
  }
}

export async function updateBooking(req, res) {
  try {
    const { name, phone_number, apartmentNo, userId, number_of_guests, time_duration, date, purpose } = req.body;
    const total_cost = time_duration * 500;
    const updatedBooking = await ConventionHallBooking.findByIdAndUpdate(
      req.params.id,
      { name, phone_number, apartmentNo, userId, number_of_guests, time_duration, date, purpose, total_cost },
      { new: true }
    );
    if (!updatedBooking) return res.status(404).json({ message: "Booking not found" });
    res.status(200).json(updatedBooking);
  } catch (error) {
    console.error("Error in updateBooking:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function updateBookingStatus(req, res) {
  try {
    const { id } = req.params;
    const { status, rejection_reason } = req.body; // Include rejection_reason
    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }
    const updatedBooking = await ConventionHallBooking.findByIdAndUpdate(
      id,
      { status, rejection_reason: status === "rejected" ? rejection_reason : undefined }, // Only set rejection_reason if rejected
      { new: true, runValidators: true }
    );
    if (!updatedBooking) return res.status(404).json({ message: "Booking not found" });
    res.status(200).json(updatedBooking);
  } catch (error) {
    console.error("Error in updateBookingStatus:", error.stack);
    res.status(500).json({ message: "Internal server error", details: error.message });
  }
}

export async function deleteBooking(req, res) {
  try {
    const deletedBooking = await ConventionHallBooking.findByIdAndDelete(req.params.id);
    if (!deletedBooking) return res.status(404).json({ message: "Booking not found" });
    res.status(200).json({ message: "Booking deleted successfully" });
  } catch (error) {
    console.error("Error in deleteBooking:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}