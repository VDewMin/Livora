import {Route, Routes } from "react-router";

import KsViewParcels from "./pages/KsViewParcels.jsx"
import KsAddParcel from "./pages/KsAddParcel.jsx";
import KsParcelDetail from "./pages/KsParcelDetail.jsx"

import GKViewServices from './pages/GKViewServices.jsx'
import GKUpdateService from './pages/GKUpdateService.jsx'
import GKDeleteService from './pages/GKDeleteService.jsx'
import GKRequestService from './pages/GKRequestService.jsx';
import AdminAnnouncements from './pages/GKAdminAnnouncement.jsx';
import Checkout from "./pages/SN_Checkout.jsx";
import Success from "./pages/SN_Success.jsx";
import Cancel from "./pages/SN_Cancel.jsx";
import VerifyOTP from "./pages/SN_VerifyOTP.jsx";
import OfflineSlipForm from "./pages/SN_SlipuploadForm.jsx";
import PaymentHistory from "./pages/SN_PaymentHistory.jsx";
import PaymentDetail from "./pages/SN_PaymentDetail.jsx";
import ExpensePage from "./pages/SN_ExpensePage.jsx";
import AdminBillingDashboard from "./pages/SN_AdminBillingDashboard.jsx";
import ResidentBillingPage from "./pages/SN_ResidentBillingDashboard.jsx";


import Login from "./pages/vd_login.jsx";
import GuestRoute from "./components/vd_guestRoute.jsx";
import Register from './pages/vd_register.jsx'
import ResidentList from "./pages/vd_residentList.jsx";
import StaffList from "./pages/vd_staffList.jsx";
import ProfileSettings from "./pages/vd_profileSettings.jsx";
import ProtectedRoute from "./components/vd_protectedRoute.jsx";
import VerifyOtp from "./pages/vd_verifyOtp.jsx";
import ForgotPassword from "./pages/vd_forgotPassword.jsx";
import ResetPassword from "./pages/vd_resetPassword.jsx";
import DashboardLayout from "./components/vd_dashboardLayout.jsx";
import UserProfile from "./pages/vd_userProfile.jsx";
import UpdateUser from "./pages/vd_updateUser.jsx";
import ResidentDashboard from "./pages/vd_residentDashboard.jsx";
import AdminDashboard from "./pages/vd_adminDashboard.jsx";
import FeedbackForm from "./pages/vd_feedbackForm.jsx";
import FeedbackList from "./pages/vd_feedbackList.jsx";
import Notifications from "./pages/vd_notification.jsx";


import GKAdminViewServices from './pages/GKAdminViewServices.jsx';
import ChangePassword from "./pages/vd_changePassword.jsx";
import KsSecurityDashboard from "./pages/KsSecurityDashboard.jsx";
import KsScanner from "./pages/KsScanner.jsx";
import KsAdminDeliveries from "./pages/KsAdminDeliveries.jsx";
import KsSlots from "./pages/KsSlots.jsx";


import HomePage from './pages/SDHomePage'
import CreatePage from './pages/SDCreatePage'
import NoteDetailsPage from './pages/SDNoteDetailsPage'
import PurchasesList from './pages/SDpurchasesList'
import SDcreatepurchase from './pages/SDcreatepurchase'
import SDpurchaseDetails from './components/SDpurchaseDetails'
import SDAdminPurchasesTable from './pages/SDAdminPurchasesTable'
import SDConventionHallBookingForm from "./components/SDConventionHallBookingForm.jsx";
import SDConventionHallBookingDetails from "./components/SDConventionHallBookingDetails.jsx";
import SDConventionHallHomePage from "./components/SDConventionHallHomePage.jsx";
import SDAdminConventionHallBookings from "./pages/SDAdminConventionHallBookings.jsx";
import SDAdminConventionHallBookingsDetails from "./pages/SDAdminBookingDetails.jsx";
import SDLaundryRequestForm from "./pages/SDLaundryRequestForm.jsx";
import SDLaundryDetails from "./pages/SDLaundryDetails.jsx";
import SDLaundryStaffView from "./pages/SDLaundryStaffView.jsx";
import SDLandingPage from "./pages/SDLandingPage.jsx";
import SDApartmentPage from "./pages/SDApartmentPage.jsx";
import SDAboutUsPage from "./pages/SDAboutUsPage.jsx";
import SDContactUsPage from "./pages/SDContactUsPage.jsx";
import SDLaundryEdit from "./pages/SDLaundryEdit.jsx";
import SecurityPrivacy from "./pages/vd_securityAndPrivacy.jsx";
import SDpurchasesList from "./pages/SDpurchasesList";
import SDresidentpurchaseDetails from "./components/SDresidentpurchaseDetails.jsx";
import LivoraLandingPage from "./pages/LivoraLandingPage.jsx";
import LivoraDetailsPage from "./pages/LivoraDetailsPage.jsx";

const App = () =>{
    return(
        <div className="p-4">
            <Routes>

                <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>

                    <Route path="/resident/user-view" element={<ProtectedRoute allowedRoles={["Resident"]}><GKViewServices /></ProtectedRoute>} />
                    <Route path="/update-service/:id" element={<GKUpdateService />} />
                    <Route path="/delete-service/:id" element={<GKDeleteService />} />
                    <Route path="/add-service" element={<GKRequestService />} />
                    <Route path="/admin/admin-view" element={<ProtectedRoute allowedRoles={["Admin"]}><GKAdminViewServices /></ProtectedRoute>} />
                    <Route path="/admin/send-announcements" element={<ProtectedRoute allowedRoles={["Admin"]}>< AdminAnnouncements/></ProtectedRoute>} />
                    
                    <Route path="/chekout" element={<Checkout/>} />
                    <Route path="/verify-otp" element={<VerifyOTP />} />
                    <Route path="/success" element={<Success />} />
                    <Route path="/cancel" element={<Cancel />} />
                    <Route path="/offline-slip" element={<OfflineSlipForm />} />
                    <Route path="/payment-history" element={<PaymentHistory />} />
                    <Route path="/payment-detail/:id" element={<PaymentDetail />} />
                    <Route path="/expense" element={<ExpensePage />} />
                    <Route path="/admin/billing" element={<ProtectedRoute><AdminBillingDashboard /></ProtectedRoute>} />
                    <Route path="/resident/billing" element={<ProtectedRoute><ResidentBillingPage /></ProtectedRoute>} />
                    
                    
                    <Route path="/register" element={<Register />} />
                    <Route path="/profile/:userId" element={<ProtectedRoute><UserProfile /></ProtectedRoute>}/>
                    <Route path="/admin/residentlist" element={<ProtectedRoute allowedRoles={["Admin"]}><ResidentList/></ProtectedRoute>}/>
                    <Route path="/admin/stafflist" element={<ProtectedRoute allowedRoles={["Admin"]}><StaffList/></ProtectedRoute>}/>
                    <Route path="/users/:userId" element={<ProtectedRoute><ProfileSettings /></ProtectedRoute>} />
                    <Route path="/profile-settings" index element={<ProtectedRoute><ProfileSettings /></ProtectedRoute>} />
                    <Route path="/change-password/:userId" element={<ProtectedRoute><ChangePassword/></ProtectedRoute>}></Route>
                    <Route path="/account/reset-password/:token" element={<ProtectedRoute><ResetPassword /></ProtectedRoute>} />
                    <Route path="/account/forgot-password" element={<ProtectedRoute><ForgotPassword /></ProtectedRoute>} />
                    <Route path="/admin/update-user/:id" element={<ProtectedRoute allowedRoles={["Admin"]}><UpdateUser /></ProtectedRoute>} />
                    <Route path="/resident/dashboard/:userId" element={<ProtectedRoute allowedRoles={["Resident"]}><ResidentDashboard /></ProtectedRoute>} />
                    <Route path="/admin/dashboard/" element={<ProtectedRoute allowedRoles={["Admin"]}><AdminDashboard /></ProtectedRoute>} />
                    <Route path="/resident/feedback" element={<ProtectedRoute allowedRoles={["Resident"]}><FeedbackForm /></ProtectedRoute>}/>
                    <Route path="/admin/feedback" element={<ProtectedRoute allowedRoles={["Admin"]}><FeedbackList /></ProtectedRoute>} />
                    <Route path="/resident/feedback" element={<ProtectedRoute allowedRoles={["Resident"]}><FeedbackForm /></ProtectedRoute>} />
                    <Route path="/security-privacy/:userId" element={<ProtectedRoute><SecurityPrivacy /></ProtectedRoute>} />
                    <Route path="/notifications/:userId" element={<ProtectedRoute><Notifications /></ProtectedRoute>}></Route>

                    <Route path="/viewParcels" element={<KsViewParcels />} />  
                    <Route path="/addParcel" element={<KsAddParcel />} />       
                    <Route path="/parcel/:id" element={<KsParcelDetail />} />
                    <Route path="/scanner" element={<KsScanner />} />
                    <Route path="/securityDashboard" element={<ProtectedRoute><KsSecurityDashboard /></ProtectedRoute>} />
                    <Route path="/admin/deliveries" element={<KsAdminDeliveries />} />
                    <Route path="/slots" element={<KsSlots />} />

                    

                    <Route path='/notes' element={<ProtectedRoute allowedRoles={["Admin"]}><HomePage/></ProtectedRoute>}/>
                    <Route path="/admin/purchases" element={<ProtectedRoute allowedRoles={["Admin"]}><SDAdminPurchasesTable/></ProtectedRoute>}/>
                    <Route path="/admin/convention-hall-bookings" element={<ProtectedRoute allowedRoles={["Admin"]}><SDAdminConventionHallBookings/></ProtectedRoute>}/>
                  <Route path="/admin/convention-hall-booking/:id" element={<ProtectedRoute allowedRoles={["Admin"]}><SDAdminConventionHallBookingsDetails/></ProtectedRoute>}/>
                  <Route path="/purchases" element={<ProtectedRoute allowedRoles={["Admin"]}><SDpurchasesList/></ProtectedRoute>}/>
                  <Route path="/laundry/staff" element={<ProtectedRoute allowedRoles={["Admin"]}><SDLaundryStaffView/></ProtectedRoute>}/>
                


                </Route>
                

                <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
                <Route path="/verify-otp/:userId" element={<GuestRoute><VerifyOtp /></GuestRoute>} />
                <Route path="/profile/:userId" element={<ProtectedRoute><ProfileSettings /></ProtectedRoute>}/>
                <Route path="/users/:userId" element={<ProtectedRoute><ProfileSettings /></ProtectedRoute>} />
                <Route path="/profile-settings" element={<ProtectedRoute><ProfileSettings /></ProtectedRoute>} />


               

                
                

               
                {/*<Route path="/admin-view" element={<GKAdminViewServices />} /> */}
                
                
                
               <Route path='/create' element={<CreatePage/>} />
               <Route path='/note/:id' element={<NoteDetailsPage/>} />
               
               <Route path="/purchases/create" element={<SDcreatepurchase />} />
              
               <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
               <Route path="/purchases/:id" element={<SDpurchaseDetails />} />

                <Route path="/convention-hall-home" element={<SDConventionHallHomePage />} />
               <Route path="/convention-hall-bookings" element={<SDConventionHallBookingForm />} />
               <Route path="/convention-hall-booking/:id" element={<SDConventionHallBookingDetails />} /> {/* Updated route */} 
               <Route path="/resident/purchase/:id" element={<SDresidentpurchaseDetails />} />
                              </Route>
                
               <Route path="/purchases/create" element={<SDcreatepurchase />} />
               
               <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
                <Route path="/laundry/request" element={<SDLaundryRequestForm />} />
                <Route path="/laundry/details/:schedule_id" element={<SDLaundryDetails />} />
                <Route path="/laundry/edit/:schedule_id" element={<SDLaundryEdit />} />
                </Route>
                <Route path="/" element={<SDLandingPage />} />
                
                <Route path="/landing" element={<SDLandingPage />} />
                <Route path="/apartments" element={<SDApartmentPage />} />
                <Route path="/about" element={<SDAboutUsPage />} />
                <Route path="/contact" element={<SDContactUsPage />} />
                <Route path="/livora" element={<LivoraLandingPage/>} />
                <Route path="/livora/details" element={<LivoraDetailsPage/>} />

 
                <Route path="/forgot-password" element={<GuestRoute><ForgotPassword /></GuestRoute>} />
                <Route path="/reset-password/:token" element={<GuestRoute><ResetPassword /></GuestRoute>} />

               
                
            </Routes>


        </div>


       
        
    );
};

export default App