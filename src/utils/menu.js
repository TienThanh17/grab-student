import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import AssistantIcon from "@mui/icons-material/Assistant";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import LoyaltyIcon from "@mui/icons-material/Loyalty";

export const USER_MENU = [
  {
    to: "/user/profile",
    icon: PersonOutlineOutlinedIcon,
    text: "Thông tin tài khoản",
    type: "USER",
  },
  {
    to: "/user/favourite",
    icon: LoyaltyIcon,
    text: "Sản phẩm yêu thích",
    type: "USER",
  },
  {
    to: "/user/orders",
    icon: DescriptionOutlinedIcon,
    text: "Lịch sử đơn hàng",
    type: "USER",
  },
  {
    to: "/user/feedback",
    icon: AssistantIcon,
    text: "Đánh giá sản phẩm",
    type: "USER",
  },
  {
    to: "/admin",
    icon: ManageAccountsIcon,
    text: "Quản lý cửa hàng",
    type: "ADMIN",
  },
  {
    to: "",
    icon: LogoutOutlinedIcon,
    text: "Đăng xuất",
    type: "LOGOUT",
  },
];
