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
import PublicRoute from "./components/PublicRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import Events from "./pages/Events";
const App = () => {
  const location = useLocation();

  const hideNavbarRoutes = ["/sign-up", "/sign-in", "/", "/verify-otp"];

  const isNavbarHidden = hideNavbarRoutes.includes(location.pathname);
  return (
    <>
      <ToastContainer />
      {!isNavbarHidden && <TopNavbar />}
      <Routes>
        <Route
          path="/"
          element={
            <PublicRoute>
              <Start />
            </PublicRoute>
          }
        />
        <Route
          path="/sign-in"
          element={
            <PublicRoute>
              <SignIn />
            </PublicRoute>
          }
        />
        <Route
          path="/sign-up"
          element={
            <PublicRoute>
              <SignUp />
            </PublicRoute>
          }
        />
        <Route
          path="/verify-otp"
          element={
            <PublicRoute>
              <VerifyOtp />
            </PublicRoute>
          }
        />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Homepage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/events"
          element={
            <ProtectedRoute>
              <Events />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
      </Routes>
      {!isNavbarHidden && <BottomNavbar />}
    </>
  );
};

export default App;
