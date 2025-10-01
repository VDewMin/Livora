import mongoose from 'mongoose';

const conventionHallBookingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone_number: { type: String, required: true },
  apartment_room_number: { type: String, required: true },
  number_of_guests: { type: Number, required: true, min: 1 },
  time_duration: { type: Number, required: true, min: 1 }, // Hours
  date: { type: Date, required: true },
  purpose: { type: String, default: 'General Event' }, // Enhanced field
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' }, // Enhanced field
  total_cost: { type: Number, default: 0 }, // Enhanced field, calculated based on duration
}, {
  timestamps: true,
});

const ConventionHallBooking = mongoose.model('ConventionHallBooking', conventionHallBookingSchema);

export default ConventionHallBooking;