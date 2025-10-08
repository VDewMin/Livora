import GKServiceRequest from "../models/GKServiceRequest.js";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

/**
 * Get all services
 */
export async function getAllServices(req, res) {
  try {
    const services = await GKServiceRequest.find().sort({ createdAt: -1 }); // newest first
    res.status(200).json(services);
  } catch (error) {
    console.error("Error in getAllServices:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * Get logged-in user's services
 */
export async function getMyServices(req, res) {
  try {
    const services = await GKServiceRequest.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(services);
  } catch (error) {
    console.error("Error in getMyServices:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * Get service by ID
 */
export async function getServicesById(req, res) {
  try {
    const service = await GKServiceRequest.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }
    res.status(200).json(service);
  } catch (error) {
    console.error(" Error in getServicesById:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * Create new service request (with image upload)
 */
export async function createServices(req, res) {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized: user not found" });
    }
    const { aptNo, contactNo, contactEmail, serviceType, description } = req.body;
    const fileUrl = req.file;


    const service = new GKServiceRequest({
      userId: req.user._id,   // from authMiddleware
      aptNo,
      contactNo,
      contactEmail,
      serviceType,
      description,
     fileUrl: fileUrl ? {data: fileUrl.buffer , contentType: fileUrl.mimetype} : null,
    });

    const saved = await service.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error("Error in createServices:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * Update service (support updating file as buffer)
 */
export async function updateServices(req, res) {
  try {
    const { aptNo, serviceId, contactNo, contactEmail, serviceType, description } = req.body;

    // Build update data
    const updateData = {
      contactNo,
      contactEmail,
      serviceType,
      description,
    };

    // Include file only if uploaded
    if (req.file) {
      updateData.fileUrl = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    }

    // Update service by ID
    const updated = await GKServiceRequest.findByIdAndUpdate(req.params.id,updateData,{ new: true });

    if (!updated) {
      return res.status(404).json({ message: "Service not found" });
    }

    res.status(200).json(updated);
  } catch (error) {
    console.error("Error in updateServices:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}



import fs from "fs";

/**
 * Delete service (and its file if stored on disk)
 */
export async function deleteServices(req, res) {
  try {
    const service = await GKServiceRequest.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    //If fileUrl is stored as a path (string), delete from disk
    if (service.fileUrl && typeof service.fileUrl === "string") {
      fs.unlink(`.${service.fileUrl}`, (err) => {
        if (err) {
          console.error("Error deleting file:", err);
        } else {
          console.log("File deleted:", service.fileUrl);
        }
      });
    }

    //Delete document from MongoDB
    await GKServiceRequest.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Service and file deleted successfully" });
  } catch (error) {
    console.error("Error in deleteServices:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}


/**
 * --- Nodemailer Setup ---
 */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Gmail address
    pass: process.env.EMAIL_PASS, // App password
  },
});

/**
 * Assign technician + date and send email
 */
export async function assignTechnician(req, res) {
  try {
    const { assignedTechnician, assignedDate } = req.body;

    if (!assignedTechnician || !assignedDate) {
      return res
        .status(400)
        .json({ message: "Technician name and date are required" });
    }

    // Update service
    const service = await GKServiceRequest.findByIdAndUpdate(
      req.params.id,
      {
        assignedTechnician,
        assignedDate,
        status: "Processing", //fixed enum value
        assignedAt: new Date(),
      },
      { new: true }
    );

    if (!service) {
      return res.status(404).json({ message: "Service request not found" });
    }

    // --- Send email notification ---
    const mailOptions = {
      from: `"LIVORA" <${process.env.EMAIL_USER}>`,
      to: service.contactEmail,
      subject: "Technician Assigned for Your Service Request",
      html: `
        <h2>Service Request Update</h2>
        <p>Hello,</p>
        <p>Your service request <b>${service.serviceType}</b> has been assigned.</p>
        <p><b>Technician:</b> ${assignedTechnician}</p>
        <p><b>Scheduled Date:</b> ${new Date(assignedDate).toLocaleString()}</p>
        <p>Status: <span style="color:blue;">In Processing</span></p>
        <br/>
        <p>We’ll notify you once the service is completed.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: "Technician assigned, date saved, and email sent",
      service,
    });
  } catch (error) {
    console.error("Error in assignTechnician:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
