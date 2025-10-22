import mongoose from 'mongoose';

const conventionHallBookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone_number: { 
    type: String, 
    required: true,
    match: [/^\d{10}$/, "Please enter a valid 10-digit phone number"]
   },
  apartmentNo: { 
    type: String, 
    required: true,
    match: [/^[PR](?:[1-8]0[1-6]|0[1-6])$/, "enter a valid apartment number (e.g., P101, R806)"]
  },
  userId: { type: String, required: true },
  number_of_guests: { type: Number, required: true, min: 1 },
  time_duration: { type: Number, required: true, min: 1 }, // Hours
  date: { type: Date, required: true },
  purpose: { type: String, default: 'General Event' },
  status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
  rejection_reason: { type: String }, // Optional field for rejection reason
  total_cost: { type: Number, default: 0 },
}, {
  timestamps: true,
});

const ConventionHallBooking = mongoose.model('ConventionHallBooking', conventionHallBookingSchema);

export default ConventionHallBooking;