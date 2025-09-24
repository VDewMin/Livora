import GKServiceRequest from "../models/GKServiceRequest.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export async function getAllServices(req, res){
    try {
        const services = await GKServiceRequest.find().sort({createdAt: -1});//newest first
        res.status(200).json(services);
    } catch (error) {
        console.error("error in getAllServices controller", error);
        res.status(500).json({message: "internal server error"});
    }
}

export async function getServicesById(req, res){
    try {
        const services = await GKServiceRequest.findById(req.params.id);//newest first
        if(!services) return res.status(404).json({ message:"service not found "});
        res.json(services);
    } catch (error) {
        console.error("error in gerServicesById controller", error);
        res.status(500).json({message: "internal server error"});
    }
}

export async function createServices(req, res){
    try {
        const {aptNo, contactNo, contactEmail, serviceType, description, fileUrl} = req.body
        const service = new GKServiceRequest({aptNo, contactNo, contactEmail, serviceType, description, fileUrl})

        const saveService = await service.save()
        res.status(201).json(saveService)
    } catch (error) {
        console.error("error in createServices controller", error);
        res.status(500).json({message: "internal server error"});
    }
}

export async function updateServices(req, res){
    try {
        const {aptNo, serviceId, contactNo, contactEmail, serviceType, description, fileUrl} = req.body
        const updateService = await GKServiceRequest.findByIdAndUpdate(req.params.id, 
            {aptNo, serviceId, contactNo, contactEmail, serviceType, description, fileUrl},
            {new: true,}
            );
        
        if (!updateService) return res.status(404).json({ message: "service not found" });

        res.status(201).json(updateService);
    } catch (error) {
        console.error("error in updateServices controller", error);
        res.status(500).json({message: "internal server error"});
    }
}

export async function deleteServices(req, res){
    try {
        const deleteService = await GKServiceRequest.findByIdAndDelete(req.params.id);
        
        if (!deleteService) return res.status(404).json({ message: "service not found" });

        res.status(201).json(deleteService);
    } catch (error) {
        console.error("error in deleteService controller", error);
        res.status(500).json({message: "internal server error"});
    }
}

// --- Setup Nodemailer Transporter ---
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // your Gmail address
    pass: process.env.EMAIL_PASS, // your App Password from Google
  },
});

// --- Assign technician + date and send email ---
export async function assignTechnician(req, res) {
  try {
    const { assignedTechnician, assignedDate } = req.body; // ✅ also get date from frontend

    if (!assignedTechnician || !assignedDate) {
      return res.status(400).json({ message: "Technician name and date are required" });
    }

    // Find and update service
    const service = await GKServiceRequest.findByIdAndUpdate(
      req.params.id,
      {
        assignedTechnician,
        assignedDate, // save date from frontend
        status: "Processing",
        assignedAt: new Date(),
      },
      { new: true }
    );

    if (!service) {
      return res.status(404).json({ message: "Service request not found" });
    }

    // --- Send email to user ---
    const mailOptions = {
      from: `"Service Admin" <${process.env.EMAIL_USER}>`,
      to: service.contactEmail,
      subject: "Technician Assigned for Your Service Request",
      html: `
        <h2>Service Request Update</h2>
        <p>Hello,</p>
        <p>Your service request <b>${service.serviceType}</b> has been assigned.</p>
        <p><b>Technician:</b> ${assignedTechnician}</p>
        <p><b>Scheduled Date:</b> ${new Date(assignedDate).toLocaleString()}</p>
        <p>Status: <span style="color:blue;">Processing</span></p>
        <br/>
        <p>We’ll notify you once the service is completed.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: "Technician assigned, date saved, and email sent ✅",
      service,
    });
  } catch (error) {
    console.error("❌ Error in assignTechnician:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
