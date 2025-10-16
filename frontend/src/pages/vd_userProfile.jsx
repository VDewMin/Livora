import { useParams } from "react-router";
import { useEffect, useState } from "react";
import axiosInstance from "../lib/axios";
import { SquarePen as PenSquareIcon, Trash2 as Trash2Icon, Camera, CreditCard as Edit, Check, User, Mail, Phone, Shield, Home, Users, Calendar, Briefcase, AlertCircle } from "lucide-react";
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
        staffType: false,
        secondaryPhoneNo: false,
        recoveryEmail: false,
        dateOfBirth: false,
        emergencyContactName: false,
        emergencyContactNumber: false,
        familyMembers: false,
        medicalConditions: false,
        job: false
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
        staffType: '',
        secondaryPhoneNo: '',
        recoveryEmail: '',
        dateOfBirth: '',
        emergencyContactName: '',
        emergencyContactNumber: '',
        familyMembers: '',
        medicalConditions: '',
        job: ''
    });

    const formatDateForInput = (value) => {
        if (!value) return "";
        const date = new Date(value);
        if (isNaN(date.getTime())) return "";
        return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    };

    const nameRegex = /^[A-Za-z\s]+$/;
    const emailRegex = /^(?!.*\.\.)[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    const phoneRegex = /^\d{10}$/;

    const [errors, setErrors] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNo: "",
        secondaryPhoneNo: "",
        recoveryEmail: "",
        emergencyContactNumber: "",
        emergencyContactName: ""
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

    const handleDeleteProfilePicture = async (userId) => {

        setConfirmDialog({
            isOpen: true,
            title: 'Delete Profile Picture',
            message: 'Are you sure you want to delete this picture?',
            onConfirm: async () => {
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
                    setConfirmDialog(prev => ({ ...prev, isOpen: false }));
                } catch (error) {
                    console.log("Error deleting profile picture", error);
                    toast.error("Failed to delete profile picture");
                    setConfirmDialog(prev => ({ ...prev, isOpen: false }));
                }
            }
        })
    };

    const handleInputChange = (field, value) => {
        if (field === "firstName" || field === "lastName" || field === "emergencyContactName") {
            if (value === "" || nameRegex.test(value)) {
                setErrors((prev) => ({ ...prev, [field]: "" }));
                setFormData((prev) => ({ ...prev, [field]: value }));
            } else {
                setErrors((prev) => ({
                    ...prev,
                    [field]: "Letters only. No numbers or special characters."
                }));
            }
            return;
        }

        if (field === "email") {
            const normalized = value.trim().toLowerCase();
            setFormData((prev) => ({ ...prev, email: normalized }));
            setErrors((prev) => ({
                ...prev,
                email:
                    normalized === "" || emailRegex.test(normalized)
                        ? ""
                        : "Enter a valid email (no spaces or consecutive dots).",
            }));
            return;
        }

        if (field === "recoveryEmail") {
            const normalized = value.trim().toLowerCase();
            setFormData((prev) => ({ ...prev, recoveryEmail: normalized }));
            setErrors((prev) => ({
                ...prev,
                recoveryEmail:
                    normalized === "" || emailRegex.test(normalized)
                        ? ""
                        : "Enter a valid email (no spaces or consecutive dots).",
            }));
            return;
        }

        if (field === "phoneNo" || field === "secondaryPhoneNo" || field === "emergencyContactNumber") {
            const onlyDigits = value.replace(/\D/g, "").slice(0, 10);
            setFormData((prev) => ({ ...prev, [field]: onlyDigits }));
            setErrors((prev) => ({
                ...prev,
                [field]:
                    onlyDigits === "" || phoneRegex.test(onlyDigits)
                        ? ""
                        : "Enter exactly 10 digits.",
            }));
            return;
        }

        if (field === "familyMembers") {
            const number = value.replace(/\D/g, "").slice(0, 2);
            setFormData((prev) => ({ ...prev, familyMembers: number }));
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
                firstName: !allEnabled,
                lastName: !allEnabled,
                email: !allEnabled,
                phoneNo: !allEnabled,
                secondaryPhoneNo: !allEnabled,
                recoveryEmail: !allEnabled,
                dateOfBirth: !allEnabled,
                emergencyContactName: !allEnabled,
                emergencyContactNumber: !allEnabled,
                familyMembers: !allEnabled,
                medicalConditions: !allEnabled,
                job: !allEnabled,
                staffType: prev.staffType
            };
        });
    };

    const handleSave = async (field) => {
        if ((field === "firstName" || field === "lastName" || field === "emergencyContactName") && formData[field] && !nameRegex.test(formData[field])) {
            toast.error(`${field}: letters only`);
            return;
        }
        if (field === "email" && !emailRegex.test(formData.email)) {
            toast.error("Enter a valid email address");
            return;
        }
        if (field === "recoveryEmail" && formData.recoveryEmail && !emailRegex.test(formData.recoveryEmail)) {
            toast.error("Enter a valid recovery email");
            return;
        }
        if (field === "phoneNo" && !phoneRegex.test(formData.phoneNo)) {
            toast.error("Phone must be exactly 10 digits");
            return;
        }
        if (field === "secondaryPhoneNo" && formData.secondaryPhoneNo && !phoneRegex.test(formData.secondaryPhoneNo)) {
            toast.error("Secondary phone must be exactly 10 digits");
            return;
        }
        if (field === "emergencyContactNumber" && formData.emergencyContactNumber && !phoneRegex.test(formData.emergencyContactNumber)) {
            toast.error("Emergency contact must be exactly 10 digits");
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
        if (formData.secondaryPhoneNo && !phoneRegex.test(formData.secondaryPhoneNo)) {
            toast.error("Secondary phone must be exactly 10 digits");
            return;
        }
        if (formData.recoveryEmail && !emailRegex.test(formData.recoveryEmail)) {
            toast.error("Enter a valid recovery email");
            return;
        }
        if (formData.emergencyContactNumber && !phoneRegex.test(formData.emergencyContactNumber)) {
            toast.error("Emergency contact must be exactly 10 digits");
            return;
        }
        if (formData.emergencyContactName && !nameRegex.test(formData.emergencyContactName)) {
            toast.error("Emergency contact name: letters only");
            return;
        }

        try {
            const updateData = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phoneNo: formData.phoneNo,
                secondaryPhoneNo: formData.secondaryPhoneNo,
                recoveryEmail: formData.recoveryEmail,
                dateOfBirth: formData.dateOfBirth,
                emergencyContactName: formData.emergencyContactName,
                emergencyContactNumber: formData.emergencyContactNumber,
                familyMembers: formData.familyMembers,
                medicalConditions: formData.medicalConditions,
                job: formData.job
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
                staffType: false,
                secondaryPhoneNo: false,
                recoveryEmail: false,
                dateOfBirth: false,
                emergencyContactName: false,
                emergencyContactNumber: false,
                familyMembers: false,
                medicalConditions: false,
                job: false
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
                    staffType: res.data.staffType || '',
                    secondaryPhoneNo: res.data.secondaryPhoneNo || '',
                    recoveryEmail: res.data.recoveryEmail || '',
                    dateOfBirth: formatDateForInput(res.data.dateOfBirth),
                    emergencyContactName: res.data.emergencyContactName || '',
                    emergencyContactNumber: res.data.emergencyContactNumber || '',
                    familyMembers: res.data.familyMembers || '',
                    medicalConditions: res.data.medicalConditions || '',
                    job: res.data.job || ''
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
                                    onClick={() => handleDeleteProfilePicture(user.userId)}
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
                        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <User className="w-5 h-5 mr-2 text-blue-600" />
                                Basic Information
                            </h3>
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
                                    {errors.firstName && <p className="text-sm text-red-600 mt-1">{errors.firstName}</p>}
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
                                    {errors.lastName && <p className="text-sm text-red-600 mt-1">{errors.lastName}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 flex items-center justify-between">
                                        <span className="flex items-center">
                                            <Calendar className="w-4 h-4 mr-2" />
                                            Date of Birth
                                        </span>
                                        <button
                                            onClick={() => toggleEdit('dateOfBirth')}
                                            className="text-blue-600 hover:text-blue-700 transition-colors"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="date"
                                            value={isEditing.dateOfBirth ? formData.dateOfBirth : formatDateForInput(user.dateOfBirth)}
                                            onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                                            readOnly={!isEditing.dateOfBirth}
                                            className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                                !isEditing.dateOfBirth ? 'bg-gray-50' : 'bg-white'
                                            }`}
                                        />
                                        {isEditing.dateOfBirth && (
                                            <button
                                                onClick={() => handleSave('dateOfBirth')}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-600 hover:text-green-700"
                                            >
                                                <Check className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                                {formData.role === "Resident" && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 flex items-center justify-between">
                                        <span className="flex items-center">
                                            <Briefcase className="w-4 h-4 mr-2" />
                                            Job
                                        </span>
                                        <button
                                            onClick={() => toggleEdit('job')}
                                            className="text-blue-600 hover:text-blue-700 transition-colors"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={isEditing.job ? formData.job : user.job || ''}
                                            onChange={(e) => handleInputChange('job', e.target.value)}
                                            readOnly={!isEditing.job}
                                            className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                                !isEditing.job ? 'bg-gray-50' : 'bg-white'
                                            }`}
                                        />
                                        {isEditing.job && (
                                            <button
                                                onClick={() => handleSave('job')}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-600 hover:text-green-700"
                                            >
                                                <Check className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>)}
                            </div>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <Mail className="w-5 h-5 mr-2 text-blue-600" />
                                Contact Information
                            </h3>
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
                                    {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 flex items-center justify-between">
                                        <span className="flex items-center">
                                            <Mail className="w-4 h-4 mr-2" />
                                            Recovery Email
                                        </span>
                                        <button
                                            onClick={() => toggleEdit('recoveryEmail')}
                                            className="text-blue-600 hover:text-blue-700 transition-colors"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="email"
                                            value={isEditing.recoveryEmail ? formData.recoveryEmail : user.recoveryEmail || ''}
                                            onChange={(e) => handleInputChange('recoveryEmail', e.target.value)}
                                            readOnly={!isEditing.recoveryEmail}
                                            className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                                !isEditing.recoveryEmail ? 'bg-gray-50' : 'bg-white'
                                            }`}
                                        />
                                        {isEditing.recoveryEmail && (
                                            <button
                                                onClick={() => handleSave('recoveryEmail')}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-600 hover:text-green-700"
                                            >
                                                <Check className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                    {errors.recoveryEmail && <p className="text-sm text-red-600 mt-1">{errors.recoveryEmail}</p>}
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
                                    {errors.phoneNo && <p className="text-sm text-red-600 mt-1">{errors.phoneNo}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 flex items-center justify-between">
                                        <span className="flex items-center">
                                            <Phone className="w-4 h-4 mr-2" />
                                            Secondary Phone
                                        </span>
                                        <button
                                            onClick={() => toggleEdit('secondaryPhoneNo')}
                                            className="text-blue-600 hover:text-blue-700 transition-colors"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="tel"
                                            value={isEditing.secondaryPhoneNo ? formData.secondaryPhoneNo : user.secondaryPhoneNo || ''}
                                            onChange={(e) => handleInputChange('secondaryPhoneNo', e.target.value)}
                                            readOnly={!isEditing.secondaryPhoneNo}
                                            className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                                !isEditing.secondaryPhoneNo ? 'bg-gray-50' : 'bg-white'
                                            }`}
                                        />
                                        {isEditing.secondaryPhoneNo && (
                                            <button
                                                onClick={() => handleSave('secondaryPhoneNo')}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-600 hover:text-green-700"
                                            >
                                                <Check className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                    {errors.secondaryPhoneNo && <p className="text-sm text-red-600 mt-1">{errors.secondaryPhoneNo}</p>}
                                </div>
                            </div>
                        </div>

                        <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <AlertCircle className="w-5 h-5 mr-2 text-red-600" />
                                Emergency Contact
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 flex items-center justify-between">
                                        <span className="flex items-center">
                                            <User className="w-4 h-4 mr-2" />
                                            Emergency Contact Name
                                        </span>
                                        <button
                                            onClick={() => toggleEdit('emergencyContactName')}
                                            className="text-blue-600 hover:text-blue-700 transition-colors"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={isEditing.emergencyContactName ? formData.emergencyContactName : user.emergencyContactName || ''}
                                            onChange={(e) => handleInputChange('emergencyContactName', e.target.value)}
                                            readOnly={!isEditing.emergencyContactName}
                                            className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                                !isEditing.emergencyContactName ? 'bg-gray-50' : 'bg-white'
                                            }`}
                                        />
                                        {isEditing.emergencyContactName && (
                                            <button
                                                onClick={() => handleSave('emergencyContactName')}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-600 hover:text-green-700"
                                            >
                                                <Check className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                    {errors.emergencyContactName && <p className="text-sm text-red-600 mt-1">{errors.emergencyContactName}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 flex items-center justify-between">
                                        <span className="flex items-center">
                                            <Phone className="w-4 h-4 mr-2" />
                                            Emergency Contact Number
                                        </span>
                                        <button
                                            onClick={() => toggleEdit('emergencyContactNumber')}
                                            className="text-blue-600 hover:text-blue-700 transition-colors"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="tel"
                                            value={isEditing.emergencyContactNumber ? formData.emergencyContactNumber : user.emergencyContactNumber || ''}
                                            onChange={(e) => handleInputChange('emergencyContactNumber', e.target.value)}
                                            readOnly={!isEditing.emergencyContactNumber}
                                            className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                                !isEditing.emergencyContactNumber ? 'bg-gray-50' : 'bg-white'
                                            }`}
                                        />
                                        {isEditing.emergencyContactNumber && (
                                            <button
                                                onClick={() => handleSave('emergencyContactNumber')}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-600 hover:text-green-700"
                                            >
                                                <Check className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                    {errors.emergencyContactNumber && <p className="text-sm text-red-600 mt-1">{errors.emergencyContactNumber}</p>}
                                </div>
                            </div>
                        </div>
                        
                        {formData.role === "Resident" && (
                        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <Users className="w-5 h-5 mr-2 text-blue-600" />
                                Additional Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 flex items-center justify-between">
                                        <span className="flex items-center">
                                            <Users className="w-4 h-4 mr-2" />
                                            Number of Family Members
                                        </span>
                                        <button
                                            onClick={() => toggleEdit('familyMembers')}
                                            className="text-blue-600 hover:text-blue-700 transition-colors"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={isEditing.familyMembers ? formData.familyMembers : user.familyMembers || ''}
                                            onChange={(e) => handleInputChange('familyMembers', e.target.value)}
                                            readOnly={!isEditing.familyMembers}
                                            min="0"
                                            className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                                !isEditing.familyMembers ? 'bg-gray-50' : 'bg-white'
                                            }`}
                                        />
                                        {isEditing.familyMembers && (
                                            <button
                                                onClick={() => handleSave('familyMembers')}
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
                                            <AlertCircle className="w-4 h-4 mr-2" />
                                            Medical Conditions
                                        </span>
                                        <button
                                            onClick={() => toggleEdit('medicalConditions')}
                                            className="text-blue-600 hover:text-blue-700 transition-colors"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={isEditing.medicalConditions ? formData.medicalConditions : user.medicalConditions || ''}
                                            onChange={(e) => handleInputChange('medicalConditions', e.target.value)}
                                            readOnly={!isEditing.medicalConditions}
                                            className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                                !isEditing.medicalConditions ? 'bg-gray-50' : 'bg-white'
                                            }`}
                                        />
                                        {isEditing.medicalConditions && (
                                            <button
                                                onClick={() => handleSave('medicalConditions')}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-600 hover:text-green-700"
                                            >
                                                <Check className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>)}

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
                            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <Home className="w-5 h-5 mr-2 text-blue-600" />
                                    Resident Details
                                </h3>
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
                            </div>
                        )}

                        {user.role === "Staff" && (
                            <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                    <Briefcase className="w-5 h-5 mr-2 text-green-600" />
                                    Staff Details
                                </h3>
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
                            </div>
                        )}
                    </div>

                    <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
                        <div className="text-sm text-gray-500">
                            Last updated: {new Date().toLocaleDateString()}
                        </div>
                        <div className="flex space-x-3">
                            {(isEditing.firstName || isEditing.lastName || isEditing.email || isEditing.phoneNo || isEditing.staffType ||
                              isEditing.secondaryPhoneNo || isEditing.recoveryEmail || isEditing.dateOfBirth || isEditing.emergencyContactName ||
                              isEditing.emergencyContactNumber || isEditing.familyMembers || isEditing.medicalConditions || isEditing.job) && (
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
