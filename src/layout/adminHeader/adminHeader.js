"use client";
import React from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import "./adminHeader.scss";
import UserMenu from "../../components/UserMenu/UserMenu";
import { USER_MENU } from "../../utils/menu";
import { logOut } from "../../redux-toolkit/userSlice";
import Image from "next/image";

function AdminHeader() {
  const avatar = useSelector((state) => state.user.userInfo.avatar);
  const userName = useSelector((state) => state.user.userInfo.userName);
  const roleId = useSelector((state) => state.user.userInfo?.roleData?.roleId);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogOut = () => {
    dispatch(logOut());
    router.push("/admin/login");
  };

  return (
    <div className="admin-header-container">
      <div className="admin-info">
        <h2 className="admin-name">Trang quản lý</h2>
      </div>
    </div>
  );
}

export default AdminHeader;
