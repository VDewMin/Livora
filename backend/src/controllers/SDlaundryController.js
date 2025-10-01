import LaundryRequest from '../models/SDLaundryRequest.js';

const calculateCost = (weight, service_type) => {
  const baseRate = service_type === 'silver' ? 100 : 150; // LKR per kg
  return weight * baseRate;
};

// Create a new laundry request
export async function createLaundryRequest (req, res)  {
  try {
    const { resident_name, resident_id, weight, service_type, time_duration } = req.body;
    const total_cost = calculateCost(weight, service_type);
    const newRequest = new LaundryRequest({ resident_name, resident_id, weight, service_type, time_duration, total_cost });
    const savedRequest = await newRequest.save();
    res.status(201).json(savedRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all laundry requests
export async function getAllLaundryRequests  (req, res)  {
  try {
    const requests = await LaundryRequest.find();
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export async function getLaundryRequestById (req, res)  {
  try {
    const request = await LaundryRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single laundry request by ID
export async function getLaundryRequestByScheduleId(req, res) {
  try {
    const request = await LaundryRequest.findOne({ schedule_id: req.params.schedule_id });
    if (!request) return res.status(404).json({ message: 'Request not found' });
    res.json(request);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// Update a laundry request
export async function updateLaundryRequest (req, res)  {
  try {
    const { weight, service_type, time_duration, status } = req.body;
    const total_cost = calculateCost(weight, service_type);
    const updatedRequest = await LaundryRequest.findByIdAndUpdate(
      req.params.id,
      { weight, service_type, time_duration, total_cost, status },
      { new: true, runValidators: true }
    );
    if (!updatedRequest) return res.status(404).json({ message: 'Request not found' });
    res.json(updatedRequest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a laundry request
 export async function deleteLaundryRequest (req, res)  {
  try {
    const deletedRequest = await LaundryRequest.findByIdAndDelete(req.params.id);
    if (!deletedRequest) return res.status(404).json({ message: 'Request not found' });
    res.json({ message: 'Request deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
