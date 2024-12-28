"use client";
import React from "react";
import AdminHeader from "../adminHeader/adminHeader";
import AdminSidebar from "../adminSidebar/adminSidebar";
import "./adminLayout.scss";

function AdminLayout({ children }) {
  return (
    <div className="admin-layout-container">
      <AdminHeader />
      <div className="content">
        <AdminSidebar />
        <div className="children">{children}</div>
      </div>
    </div>
  );
}

export default AdminLayout;
