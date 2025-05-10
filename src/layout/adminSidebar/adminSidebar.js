"use client";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { handleChangePage } from "../../redux-toolkit/paginationSlice";
import { usePathname, useRouter } from "next/navigation";
import "./adminSidebar.scss";

const MENU = [
    {
        id: "default",
        value: "Quản lý người dùng",
        path: "/admin/user",
    },
    {
        id: "manager-post",
        value: "Quản lý bài đăng",
        path: "/admin/post",
    },
    {
        id: "manager-rideRequest",
        value: "Quản lý yêu cầu",
        path: "/admin/rideRequest",
    },
    {
        id: "manager-ride",
        value: "Quản lý chuyến đi",
        path: "/admin/ride",
    },
    {
        id: "manager-review",
        value: "Quản lý đánh giá",
        path: "/admin/review",
    },
];

function AdminSidebar() {
    const router = useRouter();
    const dispatch = useDispatch();
    const pathname = usePathname();
    const crumbs = pathname.split("/");
    const [selectedItem, setSelectedItem] = useState(crumbs[2] || "default");

    const handleClickMenuItem = (id, path) => {
        dispatch(handleChangePage(1));
        router.push(path);
        setSelectedItem(id);
    };

    return (
        <div className="admin-sidebar-container">
            <div className="menu">
                {MENU.map((item) => (
                    <div
                        key={item.id}
                        className={`menu-item-container ${selectedItem === item.id ? "selected" : ""}`}
                        onClick={() => handleClickMenuItem(item.id, item.path)}
                    >
                        <div className="menu-item">
                            <h3 className="text">{item.value}</h3>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AdminSidebar;
