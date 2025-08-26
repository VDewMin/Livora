import GKServiceRequest from "../models/GKServiceRequest.js";

export async function gerAllServices(req, res){
    try {
        const services = await GKServiceRequest.find().sort({createdAt: -1});//newest first
        res.status(200).json(services);
    } catch (error) {
        console.error("error in getAllServices controller", error);
        res.status(500).json({message: "internal server error"});
    }
}

export async function createServices(req, res){
    try {
        const {roomId, contactNo, serviceType, description, fileUrl} = req.body
        const service = new GKServiceRequest({roomId, contactNo, serviceType, description, fileUrl})

        const saveService = await service.save()
        res.status(201).json(saveService)
    } catch (error) {
        console.error("error in createServices controller", error);
        res.status(500).json({message: "internal server error"});
    }
}

export async function updateServices(req, res){
    try {
        const {roomId, contactNo, serviceType, description, fileUrl} = req.body
        const updateService = await GKServiceRequest.findByIdAndUpdate(req.params.id, 
            {roomId, contactNo, serviceType, description, fileUrl},
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