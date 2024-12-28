import AdminLayout from "@/layout/adminLayout/adminLayout";
import "./admin.scss";

export const metadata = {
  title: "Trang quản lý",
  description:
    "",
};

export default function LayoutUser({ children }) {
  return (
    <AdminLayout>
      {children}
    </AdminLayout>
  );
}
