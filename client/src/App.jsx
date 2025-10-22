import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Start from "./pages/Start";
import Homepage from "./pages/Homepage";
import Profile from "./pages/Profile";
import TopNavbar from "./components/TopNavbar";
import BottomNavbar from "./components/BottomNavbar";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import VerifyOtp from "./pages/VerifyOtp";
const App = () => {
  const location = useLocation();

  const hideNavbarRoutes = ["/sign-up", "/sign-in", "/", "/verify-otp"];

  const isNavbarHidden = hideNavbarRoutes.includes(location.pathname);
  return (
    <>
      <ToastContainer />
      {!isNavbarHidden && <TopNavbar />}
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/home" element={<Homepage />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      {!isNavbarHidden && <BottomNavbar />}
    </>
  );
};

export default App;
