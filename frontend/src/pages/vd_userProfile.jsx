import { useParams } from "react-router";
import { useEffect, useState } from "react";
import axiosInstance from "../lib/axios";
import {PenSquareIcon, Trash2Icon} from "lucide-react"
import toast from "react-hot-toast";

 
const UserProfile = () => {
    const { userId } = useParams();
    const [user, setUser] = useState(null);

    const handleDelete = async (e, _id) => {
        e.preventDefault();

        if (!window.confirm("Are you sure you want to delete this account?")) return;

        try {
            await axiosInstance.delete(`/users/${_id}`);

            // Clear user state
            setUser(null);

            toast.success("User account deleted");

            // Optional: redirect admin to users list
            // navigate("/users");
        } catch (error) {
            console.log("Error in handleDelete", error);
            toast.error("Failed to delete user");
        }
    };


    useEffect(() =>{

        if(!userId) return;

        axiosInstance
        .get(`/users/${userId}`)
        .then((res) => setUser(res.data))
        .catch((err) => console.error("Error fetching user:", err));
    }, [userId]);

    if(!user){
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-2xl shadow-md w-96">
            <h2 className="text-2xl font-bold text-center mb-6">User Profile</h2>

            <p><strong>Name:</strong> {user.firstName} {user.lastName}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Phone:</strong> {user.phoneNo}</p>
            <p><strong>Role:</strong> {user.role}</p>

            {user.role === "Resident" && (
            <>
                <p><strong>Apartment No:</strong> {user.apartmentNo}</p>
                <p><strong>Resident Type:</strong> {user.residentType}</p>
            </>
            )}

            {user.role === "Staff" && (
            <>
                <p><strong>Staff Type:</strong> {user.staffType}</p>
            </>
            )}

            <div className="flex justify-between mt-6">
                <PenSquareIcon className="size-4"/>
                <button className="btn btn-ghost btn-xs text-error" onClick={(e) => handleDelete(e, user._id)}>
                    <Trash2Icon className="size-4"/>
                </button>
                    
            </div>

        </div>
        </div>
    );
};
export default UserProfile;