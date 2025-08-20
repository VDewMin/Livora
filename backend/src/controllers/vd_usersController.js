import User from "../models/vd_user.js";

export const getAllUsers = async(req, res) => {

    try {
        const users = await User.find();
        res.status(200).json(users);
        
    } catch (error) {

        console.error("Error in getAllUsers", error);
        res.status(500).json({message: "Internal server error"});
    }
    
}

export const getUserById = async(req, res) => {

    try {
        const user = await User.findById(req.params.id);
        if(!user) return res.status(404).json({message: "Note not found"});
        res.json(user);
        res.status(200).json(user);
        
    } catch (error) {

        console.error("Error in getUserById", error);
        res.status(500).json({message: "Internal server error"});
    }
    res.status(200).send("You just fetched notes");
}

export const createUser = async(req, res) => {

    try{
        const {firstName, lastName, email, phoneNo, apartmentNo, password, role} = req.body
        const newUser = new User({firstName, lastName, email, phoneNo, apartmentNo, password, role});

        const savedUser = await newUser.save();
        res.status(201).json({savedUser});
    } catch (error) {

        console.error("Error in createUser controller", error);
        res.status(500).json({message: "Internal server error"});
    }
}

export const updateUser = async(req, res) => {

    try {
        const {firstName, lastName, email, phoneNo, apartmentNo, password, role} = req.body;
        const updatedUser = await User.findByIdAndUpdate(req.params.id, {firstName, lastName, email, phoneNo, apartmentNo, password, role}, {new:true});

        if(!updatedUser) return res.status(404).json({message:"Note not found"});
        res.status(200).json({updatedUser});
    } catch (error) {
        
        console.error("Error in updateUser controller", error);
        res.status(500).json({message: "Internal server error"});
    }
}

export const deleteUser = async(req, res) => {

    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if(!deletedUser) return res.status(404).json({message: 'Not not found'});
        res.status(200).json({deletedUser});

    } catch (error) {
        console.error("Error in deleteUser controller", error);
        res.status(500).json({message: "Internal server error"});
    }
}