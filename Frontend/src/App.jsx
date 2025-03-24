import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Client from "./components/Client";
import ExplorePage from "./Cpages/ExplorePage";
import ChatPage from "./Cpages/ChatPage";
import ReviewsPage from "./Cpages/ReviewsPage";
import HistoryPage from "./Cpages/HistoryPage";
import ProfilePage from "./Cpages/ProfilePage";
import SettingsPage from "./Cpages/SettingsPage";
import PaymentPage from "./Cpages/PaymentPage";
import ProviderDetailPage from "./Cpages/ProviderDetailPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./serviceman/components/Layout";
import Profile from "./serviceman/pages/Profile";
import Requests from "./serviceman/pages/Requests";
import Chat from "./serviceman/pages/Chat";
import Payments from "./serviceman/pages/Payments";
import Reviews from "./serviceman/pages/Reviews";
import Membership from "./serviceman/pages/Membership";
import { Toaster } from "react-hot-toast";
import ExploreServices from './Cpages/ExploreServices';
function App() {
  return (
    <>
      {/* ✅ Place Toaster outside Routes */}
      <Toaster position="top-right" />

      <Routes>
        <Route path="/" element={<Home />} />

        {/* Service Provider Routes */}
        
        <Route path="/service" element={<Layout />}>
          <Route path="profile" element={<Profile />} />
          <Route path="requests" element={<Requests />} />
          <Route path="chat" element={<Chat />} />
          <Route path="payments" element={<Payments />} />
          <Route path="reviews" element={<Reviews />} />
          <Route path="membership" element={<Membership />} />
        </Route>

        {/* Client Routes inside Protected Route */}
        <Route path="/client" element={<ProtectedRoute />}>
  <Route element={<Client />}> {/* Wrap all routes inside Client */}
    <Route index element={<ExplorePage />} />
    <Route path="explore" element={<ExplorePage />} />
    <Route path="chat" element={<ChatPage />} />
    <Route path="reviews" element={<ReviewsPage />} />
    <Route path="history" element={<HistoryPage />} />
    <Route path="profile" element={<ProfilePage />} />
    <Route path="settings" element={<SettingsPage />} />
    <Route path="payment" element={<PaymentPage />} />
    <Route path="explore/:servicename" element={<ExploreServices />} />
    <Route path="provider/:servicename/:providerId" element={<ProviderDetailPage />} /> {/* Corrected route */}
  </Route>
</Route>

      </Routes>
    </>
  );
}

export default App;
