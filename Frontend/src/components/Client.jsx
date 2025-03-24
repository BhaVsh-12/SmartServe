import React from "react";
import { Outlet } from "react-router-dom";
import MainLayout from "./CLayout/MainLayout";

const Client = () => {
  return (
    <MainLayout>
      <Outlet /> {/* This renders the nested routes from App.jsx */}
    </MainLayout>
  );
};

export default Client;
