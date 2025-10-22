import mongoose from 'mongoose';

const laundryRequestSchema = new mongoose.Schema({
  resident_name: {
    type: String,
    required: true,
  },
  resident_id: {
    type: String,
    required: true,
   
  },
  weight: {
    type: Number,
    required: true,
    min: 0.1,
  },
  service_type: {
    type: String,
    enum: ['silver', 'premium'],
    required: true,
  },
  time_duration: {
    type: Number,
    required: true,
    min: 1,
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'cancelled'],
    default: 'pending',
  },
  total_cost: {
    type: Number,
    required: true,
  },
  schedule_id: {
    type: String,
    unique: true,
    default: () => `LAUN${Date.now().toString(36).toUpperCase()}`,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

const LaundryRequest = mongoose.model('SDLaundryRequest', laundryRequestSchema);

export default LaundryRequest;