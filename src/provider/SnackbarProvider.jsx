'use client'

import { SnackbarProvider as MuiSnackbarProvider  } from "notistack";

function SnackbarProvider({ children }) {
  return (
    <MuiSnackbarProvider
      maxSnack={3} // Số lượng thông báo tối đa hiển thị cùng lúc
      anchorOrigin={{
        vertical: "top", // Vị trí dọc: 'top' hoặc 'bottom'
        horizontal: "right", // Vị trí ngang: 'left', 'center', 'right'
      }}
      autoHideDuration={3000} // Thời gian tự động ẩn (ms)
    >
      {children}
    </MuiSnackbarProvider>
  );
}

export default SnackbarProvider;
