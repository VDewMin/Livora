import { useParams } from "react-router";
import { useEffect, useState } from "react";
import axiosInstance from "../lib/axios";
import { SquarePen as PenSquareIcon, Trash2 as Trash2Icon, Camera, CreditCard as Edit, Check, User, Mail, Phone, Shield, Home, Users, X } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../context/vd_AuthContext";
import ConfirmDialog from "../components/vd_confirmDialog";

const UserProfile = () => {

    const { userId } = useParams();
    const [user, setUser] = useState(null);
    const { user: authUser, setUser: setAuthUser, updateUser } = useAuth();
    const [isEditing, setIsEditing] = useState({
        firstName: false,
        lastName: false,
        email: false,
        phoneNo: false,
        apartmentNo: false,
        residentType: false,
        staffType: false
    });

    const [formData, setFormData] = useState({
        userId: '',
        firstName: '',
        lastName: '',
        email: '',
        phoneNo: '',
        role: '',
        apartmentNo: '',
        residentType: '',
        staffType: ''
    });

    const nameRegex = /^[A-Za-z]+$/;
    const emailRegex = /^(?!.*\.\.)[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;
    const phoneRegex = /^\d{10}$/;

    const [errors, setErrors] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNo: ""
    });

    const [confirmDialog, setConfirmDialog] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => {}
    });


    const [showImageModal, setShowImageModal] = useState(false);

    const handleDelete = async (e, _id) => {
        e.preventDefault();
        
        setConfirmDialog({
            isOpen: true,
            title: 'Delete Account',
            message: 'Are you sure you want to delete this account?',
            onConfirm: async () => {
                try {
                    await axiosInstance.delete(`/users/${_id}`);
                    setUser(null);
                    toast.success("User account deleted");
                } catch (error) {
                    console.log("Error in handleDelete", error);
                    toast.error("Failed to delete user");
                }
                setConfirmDialog(prev => ({ ...prev, isOpen: false }));
            }
        });
    };


    const handleDeleteProfilePicture = async () => {
        if (!window.confirm("Are you sure?")) return;

        try {
            const res = await axiosInstance.delete(`/users/${user.userId}/profile-picture`);
            setUser(res.data);

            if (
                (authUser?._id && authUser?._id === res.data?._id) ||
                (authUser?.userId && authUser?.userId === res.data?.userId) ||
                (authUser?.email && authUser?.email === res.data?.email)
            ) {
                updateUser({ ...res.data, profilePicture: res.data.profilePicture });
            }

            toast.success("Profile picture deleted");
        } catch (error) {
            console.log("Error deleting profile picture", error);
            toast.error("Failed to delete profile picture");
        }
    };

    const handleInputChange = (field, value) => {
        if (field === "firstName" || field === "lastName") {
            const lettersOnly = value.replace(/[^A-Za-z]/g, "");
            setFormData(prev => ({ ...prev, [field]: lettersOnly }));
            return;
        }

        if (field === "email") {
            const v = value.trim().toLowerCase();
            const valid = v === "" || emailRegex.test(v);
            setFormData(prev => ({ ...prev, email: v }));
            setErrors(prev => ({ ...prev, email: valid ? "" : "Enter a valid email" }));
            return;
        }

        if (field === "phoneNo") {
            const digits = value.replace(/\D/g, "").slice(0, 10);
            const valid = digits === "" || phoneRegex.test(digits);
            setFormData(prev => ({ ...prev, phoneNo: digits }));
            setErrors(prev => ({ ...prev, phoneNo: valid ? "" : "Exactly 10 digits" }));
            return;
        }
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const toggleEdit = (field) => {
        setIsEditing(prev => ({ ...prev, [field]: !prev[field] }));
    };

    const toggleAllEditableFields = () => {
        setIsEditing(prev => {
            const allEnabled = prev.firstName && prev.lastName && prev.email && prev.phoneNo;
            return {
                ...prev,
                firstName: !allEnabled,
                lastName: !allEnabled,
                email: !allEnabled,
                phoneNo: !allEnabled
            };
        });
    };

    const handleSave = async (field) => {
        if (field === "firstName" && !nameRegex.test(formData.firstName)) {
            toast.error("First name: letters only");
            return;
        }
        if (field === "lastName" && !nameRegex.test(formData.lastName)) {
            toast.error("Last name: letters only");
            return;
        }
        if (field === "email" && !emailRegex.test(formData.email)) {
            toast.error("Enter a valid email address");
            return;
        }
        if (field === "phoneNo" && !phoneRegex.test(formData.phoneNo)) {
            toast.error("Phone must be exactly 10 digits");
            return;
        }
        try {
            const updateData = { [field]: formData[field] };
            await axiosInstance.put(`/users/${userId}`, updateData);

            setUser(prev => ({ ...prev, [field]: formData[field] }));
            setIsEditing(prev => ({ ...prev, [field]: false }));
            toast.success("Profile updated successfully");
        } catch (error) {
            console.log("Error updating profile", error);
            toast.error("Failed to update profile");
        }
    };

    const handleSaveAll = async () => {
        if (!nameRegex.test(formData.firstName)) {
            toast.error("First name: letters only");
            return;
        }
        if (!nameRegex.test(formData.lastName)) {
            toast.error("Last name: letters only");
            return;
        }
        if (!emailRegex.test(formData.email)) {
            toast.error("Enter a valid email address");
            return;
        }
        if (!phoneRegex.test(formData.phoneNo)) {
            toast.error("Phone must be exactly 10 digits");
            return;
        }

        try {
            const updateData = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phoneNo: formData.phoneNo
            };

            if (user.role === "Staff" && isEditing.staffType) {
                updateData.staffType = formData.staffType;
            }

            await axiosInstance.put(`/users/${userId}`, updateData);

            setUser(prev => ({ ...prev, ...updateData }));
            setIsEditing({
                firstName: false,
                lastName: false,
                email: false,
                phoneNo: false,
                apartmentNo: false,
                residentType: false,
                staffType: false
            });
            toast.success("All changes saved successfully");
        } catch (error) {
            console.log("Error updating profile", error);
            toast.error("Failed to save changes");
        }
    };

    useEffect(() => {
        if (!userId) return;

        axiosInstance
            .get(`/users/${userId}`)
            .then((res) => {
                setUser(res.data);
                setFormData({
                    userId: res.data.userId || '',
                    firstName: res.data.firstName || '',
                    lastName: res.data.lastName || '',
                    email: res.data.email || '',
                    phoneNo: res.data.phoneNo || '',
                    role: res.data.role || '',
                    apartmentNo: res.data.apartmentNo || '',
                    residentType: res.data.residentType || '',
                    staffType: res.data.staffType || ''
                });
            })
            .catch((err) => console.error("Error fetching user:", err));
    }, [userId]);

    if (!user) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading user profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">User Profile</h1>
                            <p className="text-gray-600 mt-1">View and manage user information</p>
                        </div>
                        <div className="flex items-center space-x-3">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                user.role === 'Admin' ? 'bg-purple-100 text-purple-800' :
                                user.role === 'Staff' ? 'bg-blue-100 text-blue-800' :
                                'bg-green-100 text-green-800'
                            }`}>
                                {user.role}
                            </span>

                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                user.userId === 'Admin' ? 'bg-purple-100 text-purple-800' :
                                user.userId === 'Staff' ? 'bg-blue-100 text-blue-800' :
                                'bg-green-100 text-green-800'
                            }`}>
                                {user.userId}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-8">
                    <div className="flex items-start space-x-6 mb-8">
                        <div className="relative">
                            <div
                                className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity"
                                onClick={() => user.profilePicture && setShowImageModal(true)}
                            >
                                {user.profilePicture ? (

                                <img
                                    src={`${axiosInstance.defaults.baseURL}/users/${user.userId}/profile-picture?updated=${user.updatedAt || Date.now()}`}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />

                                ) : (
                                <User className="w-10 h-10 text-gray-400" />
                                )}
                            </div>
                            <label htmlFor="profileUpload" className="absolute -bottom-1 -right-1 w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 cursor-pointer">
                                <Camera className="w-4 h-4 text-white" />
                            </label>
                            {user.profilePicture && (
                                <button
                                    onClick={handleDeleteProfilePicture}
                                    className="absolute -top-1 -right-1 w-8 h-8 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 cursor-pointer transition-colors"
                                    title="Delete profile picture"
                                >
                                    <Trash2Icon className="w-4 h-4 text-white" />
                                </button>
                            )}
                            <input
                                id="profileUpload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={async (e) => {
                                const formData = new FormData();
                                formData.append("profilePicture", e.target.files[0]);
                                try {
                                    const res = await axiosInstance.put(`/users/${user.userId}/profile-picture`, formData, {
                                    headers: { "Content-Type": "multipart/form-data" },
                                    });
                                    setUser(res.data);

                                    if (
                                        (authUser?._id && authUser?._id === res.data?._id) ||
                                        (authUser?.userId && authUser?.userId === res.data?.userId) ||
                                        (authUser?.email && authUser?.email === res.data?.email)
                                    ) {
                                        updateUser({ ...res.data, profilePicture: res.data.profilePicture });
                                    }

                                    toast.success("Profile picture updated");
                                } catch (err) {
                                    console.error("Upload failed", err);
                                    toast.error("Failed to update profile picture");
                                }
                                }}
                            />
                        </div>

                        <div className="flex-1">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                                {user.firstName} {user.lastName}
                            </h2>
                            <p className="text-gray-600">{user.email}</p>
                            <p className="text-gray-600 text-xs">{user.userId}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={toggleAllEditableFields}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Edit Profile"
                            >
                                <PenSquareIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 flex items-center justify-between">
                                    <span className="flex items-center">
                                        <User className="w-4 h-4 mr-2" />
                                        First Name
                                    </span>
                                    <button
                                        onClick={() => toggleEdit('firstName')}
                                        className="text-blue-600 hover:text-blue-700 transition-colors"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={isEditing.firstName ? formData.firstName : user.firstName}
                                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                                        readOnly={!isEditing.firstName}
                                        className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                            !isEditing.firstName ? 'bg-gray-50' : 'bg-white'
                                        }`}
                                    />
                                    {isEditing.firstName && (
                                        <button
                                            onClick={() => handleSave('firstName')}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-600 hover:text-green-700"
                                        >
                                            <Check className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 flex items-center justify-between">
                                    <span className="flex items-center">
                                        <User className="w-4 h-4 mr-2" />
                                        Last Name
                                    </span>
                                    <button
                                        onClick={() => toggleEdit('lastName')}
                                        className="text-blue-600 hover:text-blue-700 transition-colors"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={isEditing.lastName ? formData.lastName : user.lastName}
                                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                                        readOnly={!isEditing.lastName}
                                        className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                            !isEditing.lastName ? 'bg-gray-50' : 'bg-white'
                                        }`}
                                    />
                                    {isEditing.lastName && (
                                        <button
                                            onClick={() => handleSave('lastName')}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-600 hover:text-green-700"
                                        >
                                            <Check className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 flex items-center justify-between">
                                    <span className="flex items-center">
                                        <Mail className="w-4 h-4 mr-2" />
                                        Email
                                    </span>
                                    <button
                                        onClick={() => toggleEdit('email')}
                                        className="text-blue-600 hover:text-blue-700 transition-colors"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                </label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        value={isEditing.email ? formData.email : user.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        readOnly={!isEditing.email}
                                        className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                            !isEditing.email ? 'bg-gray-50' : 'bg-white'
                                        }`}
                                    />
                                    {isEditing.email && (
                                        <button
                                            onClick={() => handleSave('email')}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-600 hover:text-green-700"
                                        >
                                            <Check className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 flex items-center justify-between">
                                    <span className="flex items-center">
                                        <Phone className="w-4 h-4 mr-2" />
                                        Phone Number
                                    </span>
                                    <button
                                        onClick={() => toggleEdit('phoneNo')}
                                        className="text-blue-600 hover:text-blue-700 transition-colors"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                </label>
                                <div className="relative">
                                    <input
                                        type="tel"
                                        value={isEditing.phoneNo ? formData.phoneNo : user.phoneNo}
                                        onChange={(e) => handleInputChange('phoneNo', e.target.value)}
                                        readOnly={!isEditing.phoneNo}
                                        className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                            !isEditing.phoneNo ? 'bg-gray-50' : 'bg-white'
                                        }`}
                                    />
                                    {isEditing.phoneNo && (
                                        <button
                                            onClick={() => handleSave('phoneNo')}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-600 hover:text-green-700"
                                        >
                                            <Check className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center">
                                <Shield className="w-4 h-4 mr-2" />
                                Role
                            </label>
                            <input
                                type="text"
                                value={user.role}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                                readOnly
                            />
                        </div>

                        {user.role === "Resident" && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 flex items-center">
                                        <Home className="w-4 h-4 mr-2" />
                                        Apartment No
                                    </label>
                                    <input
                                        type="text"
                                        value={user.apartmentNo}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                                        readOnly
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 flex items-center">
                                        <Users className="w-4 h-4 mr-2" />
                                        Resident Type
                                    </label>
                                    <input
                                        type="text"
                                        value={user.residentType}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                                        readOnly
                                    />
                                </div>
                            </div>
                        )}

                        {user.role === "Staff" && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 flex items-center justify-between">
                                    <span className="flex items-center">
                                        <Users className="w-4 h-4 mr-2" />
                                        Staff Type
                                    </span>
                                    <button
                                        onClick={() => toggleEdit('staffType')}
                                        className="text-blue-600 hover:text-blue-700 transition-colors"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={isEditing.staffType ? formData.staffType : user.staffType}
                                        onChange={(e) => handleInputChange('staffType', e.target.value)}
                                        readOnly={!isEditing.staffType}
                                        className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                            !isEditing.staffType ? 'bg-gray-50' : 'bg-white'
                                        }`}
                                    />
                                    {isEditing.staffType && (
                                        <button
                                            onClick={() => handleSave('staffType')}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-600 hover:text-green-700"
                                        >
                                            <Check className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
                        <div className="text-sm text-gray-500">
                            Last updated: {new Date().toLocaleDateString()}
                        </div>
                        <div className="flex space-x-3">
                            {(isEditing.firstName || isEditing.lastName || isEditing.email || isEditing.phoneNo || isEditing.staffType) && (
                                <button
                                    onClick={handleSaveAll}
                                    className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors flex items-center space-x-2"
                                >
                                    <Check className="w-4 h-4" />
                                    <span>Save Changes</span>
                                </button>
                            )}
                            <button
                                onClick={(e) => handleDelete(e, user._id)}
                                className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors flex items-center space-x-2"
                            >
                                <Trash2Icon className="w-4 h-4" />
                                <span>Delete User</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        {showImageModal && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
                    onClick={() => setShowImageModal(false)}
                >
                    <div className="relative max-w-4xl max-h-screen">
                        <img
                            src={`${axiosInstance.defaults.baseURL}/users/${user.userId}/profile-picture?updated=${user.updatedAt || Date.now()}`}
                            alt="Profile Full View"
                            className="max-w-full max-h-screen object-contain rounded-lg"
                            onClick={(e) => e.stopPropagation()}
                        />
                        <button
                            onClick={() => setShowImageModal(false)}
                            className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors shadow-lg"
                        >
                            <span className="text-2xl text-gray-700">×</span>
                        </button>
                    </div>
                </div>
            )}

        {/* Confirm delete dialog */}
        <ConfirmDialog
            isOpen={confirmDialog.isOpen}
            title={confirmDialog.title}
            message={confirmDialog.message}
            onConfirm={confirmDialog.onConfirm}
            onCancel={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
        />
        </div>
    );
};

export default UserProfile;
