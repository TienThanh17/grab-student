"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

const ProtectAdmin = ({ children }) => {
    // const router = useRouter();
    // const login = useSelector((state) => state.user.login);
    // useEffect(() => {
    //   if (!login) {
    //     router.push("/");
    //   }
    // }, [login]);
    return <>{children}</>;
};

export default ProtectAdmin;
