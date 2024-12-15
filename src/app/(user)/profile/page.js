'use client'

import { Paper, Box, Typography, Stack, Rating, TableContainer, Table, TableRow, TableCell, TableBody, FormControlLabel, Dialog, DialogTitle, DialogContent, TextField, Button, DialogActions, InputAdornment } from '@mui/material'
import Switch from '@mui/material/Switch';
import { useState } from 'react'
import Image from "next/image";
import userHeader from '@/public/images/userHeader.png'
import { useSelector, useDispatch } from 'react-redux';
import { changePasswordService, update2fa } from '@/services/userService';
import { useSnackbar } from 'notistack';
import { updateUser2fa } from '@/redux-toolkit/userSlice';
import Loading from '@/components/loading/Loading';
import KeyIcon from '@mui/icons-material/Key';
import LockIcon from '@mui/icons-material/Lock';

const userInfo = {
  email: 'Mã sinh viên',
  name: 'Họ và tên',
  gender: 'Giới tính',
  birthday: 'Ngày sinh',
  phonenumber: 'Số điện thoại',
  studentClass: 'Lớp',
}

const generateIdStudent = (email) => {
  return email.substring(0, email.indexOf("@"));
}

function Profile() {
  const user = useSelector((state) => state.user.userInfo)
  const [checked, setChecked] = useState(user?.is2faEnabled);
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  // State cho các dialog
  const [openChangePassword, setOpenChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");


  console.log(user)
  // console.log(checked)

  const handleChange = async (event) => {
    setLoading(true)
    const previousChecked = checked; // Lưu trạng thái hiện tại
    const newChecked = event.target.checked; // Lấy trạng thái mới
    setChecked(newChecked); // Cập nhật trạng thái tạm thời
    try {
      const res = await update2fa(user.id, event.target.checked)
      if (res.data.code === 0) {
        dispatch(updateUser2fa(event.target.checked))
      }
    } catch (error) {
      console.log(error);
      setChecked(previousChecked);
      enqueueSnackbar(
        "Lỗi",
        { variant: "error" }
      );
    } finally {
      setLoading(false)
    }
  };

  // Đóng mở dialog
  const handleOpenChangePassword = () => setOpenChangePassword(true);
  const handleCloseChangePassword = () => setOpenChangePassword(false);

  // Xử lý đổi mật khẩu
  const handleChangePassword = async () => {
    try {
      const res = await changePasswordService({ id: user.id, currentPassword, newPassword });
      if (res.data.code === 0) {
        enqueueSnackbar("Đổi mật khẩu thành công!", { variant: "success" });
        setOpenChangePassword(false);
      }
    } catch (error) {
      console.error(error);
      if(error.response.data.code === 6) {
        enqueueSnackbar("Mật khẩu không chính xác", { variant: "error" });
      } else{
        enqueueSnackbar("Lỗi khi đổi mật khẩu", { variant: "error" });
      }
    }
  };

  return (
    <Paper elevation={3} sx={{ borderRadius: 7, overflow: "hidden", mt: 4 }}>
      <Box sx={{ width: 1, textAlign: "center", bgcolor: "primary.main", p: 2, color: 'white' }}>
        <Typography variant="h6">THÔNG TIN CÁ NHÂN</Typography>
      </Box>
      <Stack direction="row" sx={{ alignItems: "center", gap: 15, py: 3, px: 10 }}>
        <Stack sx={{ alignItems: 'center' }}>
          <img src={user.avatarUrl} alt="avt" style={{ width: '6rem', height: '6rem', borderRadius: '5rem' }} />
          <Typography variant="h6" sx={{ mt: 2 }}>{user.name}</Typography>
        </Stack>
        <Rating name="size-large" defaultValue={4} size="large" readOnly />
        <Stack direction='column' justifyContent='center' alignItems='flex-start' ml={5} mt='30px'>
          <FormControlLabel
            sx={{
              '.MuiFormControlLabel-label': {
                fontWeight: 'bold'
              }
            }}
            value="bottom"
            control={<Switch color="primary" />}
            checked={checked}
            onChange={handleChange}
            disabled={loading}
            label="Xác thực 2 lớp"
            labelPlacement="start"
          />
          <Button variant="text" color="primary" sx={{ ml: 1 }} onClick={handleOpenChangePassword}>Đổi mật khẩu</Button>
        </Stack>
      </Stack>
      <TableContainer component={Paper} elevation={2}>
        <Table sx={{ tableLayout: "fixed", width: "100%" }}>
          <TableBody>
            {Object.entries(userInfo).map(([key, value]) => (
              <TableRow key={key}>
                <TableCell sx={{ fontWeight: "bold", fontSize: "1rem", py: 3.5, pl: 10 }}>{value}</TableCell>
                <TableCell sx={{ fontSize: "1rem" }} align="left">
                  {key !== 'email' && key !== 'gender' ? user[key] : key === 'email' ? generateIdStudent(user[key]) : key === 'gender' && user[key] ? 'Nam' : 'Nữ'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog đổi mật khẩu */}
      <Dialog open={openChangePassword} onClose={handleCloseChangePassword} maxWidth="xs" fullWidth disableScrollLock >
        <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>
          Đổi mật khẩu
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 2 }}>
            {/* Field nhập mật khẩu hiện tại */}
            <TextField
              label="Mật khẩu hiện tại"
              type="password"
              fullWidth
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="action" />
                    </InputAdornment>
                  )
                }
              }}
            />
            {/* Field nhập mật khẩu mới */}
            <TextField
              label="Mật khẩu mới"
              type="password"
              fullWidth
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <KeyIcon color="action" />
                    </InputAdornment>
                  )
                }
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", gap: 2, pb: 2 }}>
          <Button onClick={handleCloseChangePassword} variant="outlined" color="error">
            Hủy
          </Button>
          <Button
            onClick={handleChangePassword}
            variant="contained"
            color="primary"
            disabled={!currentPassword || !newPassword} // Vô hiệu hóa nếu chưa nhập
          >
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  )
}

export default Profile