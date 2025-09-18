import User from "../models/vd_user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const saltRounds = 10;
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

export const getAllUsers = async (req, res) => {
  try {
    const { role } = req.query; // get ?role=Resident from URL
    let users;

    if (role) {
      users = await User.find({ role });
    } else {
      users = await User.find();
    }

    res.status(200).json(users);
  } catch (error) {
    console.error("Error in getAllUsers", error);
    res.status(500).json({ message: "Internal server error" });
  }
};


export const getUserById = async(req, res) => {

    try {
        const user = await User.findById(req.params.id);
        if(!user) return res.status(404).json({message: "Note not found"});
        res.json(user);
        
    } catch (error) {

        console.error("Error in getUserById", error);
        res.status(500).json({message: "Internal server error"});
    }
    
}

export const createUser = async(req, res) => {

    try{
        const {firstName, lastName, email, phoneNo, password, role, apartmentNo, residentType, staffType} = req.body

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = new User({
            firstName, 
            lastName, 
            email, 
            phoneNo, 
            password: hashedPassword, 
            role, 
            ...(role === "Resident" && { apartmentNo, residentType }),
            ...(role === "Staff" && { staffType }),
        });

        const savedUser = await newUser.save();
        res.status(201).json({savedUser});
    } catch (error) {

        console.error("Error in createUser controller", error);
        res.status(500).json({message: "Internal server error"});
    }
}

export const updateUser = async(req, res) => {

    try {
        const {firstName, lastName, email, phoneNo, password, role, apartmentNo, residentType, staffType,} = req.body;

        const updateData = {
            firstName,
            lastName,
            email,
            phoneNo,
            password,
            role,
            ...(role === "Resident" && { apartmentNo, residentType }),
            ...(role === "Staff" && { staffType, department }),
        };

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id, 
            updateData, 
            {new:true}
        );

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

export const loginUser = async (req, res) => {
    try{
        const { email, password} = req.body;

        //check if user exists
        const user = await User.findOne({email});
        if(!user){
            return res.status(400).json({message: "Invalid email or password"});
        }

        //password check
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({message: "Invalid email or password"});
        }

        //Generate jwt token
        const token = jwt.sign(
            { id: user._id, role: user.role},
            JWT_SECRET,
            {expiresIn: "1h"}
        );

        // return user and token
        res.json({
            message: "Login successfull",
            token,
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
            },
        });

    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({message: "Server error"});
    }
};

