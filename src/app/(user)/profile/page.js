'use client'

import { Paper, Box, Typography, Stack, Rating, TableContainer, Table, TableRow, TableCell, TableBody,FormControlLabel } from '@mui/material'
import Switch from '@mui/material/Switch';
import {useState} from 'react'
import Image from "next/image";
import userHeader from '@/public/images/userHeader.png'

const userInfo = {
  id: 'Mã sinh viên',
  name: 'Họ và tên',
  birthday: 'Ngày sinh',
  sex: 'Giới tính',
  class: 'Lớp'
}

function Profile() {
  const [checked, setChecked] = useState(false);

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  return (
    <Paper elevation={3} sx={{ borderRadius: 7, overflow: "hidden", mt: 4 }}>
      <Box sx={{ width: 1, textAlign: "center", bgcolor: "primary.main", p: 2, color: 'white' }}>
        <Typography variant="h6">THÔNG TIN CÁ NHÂN</Typography>
      </Box>
      <Stack direction="row" sx={{ alignItems: "center", gap: 15, py: 3, px: 10 }}>
        <Stack sx={{alignItems: 'center'}}>
          <Image src={userHeader} alt="avt" width={100} height={100} />
          <Typography variant="h6" sx={{mt: 2}}>Huỳnh Thanh Tiến</Typography>
        </Stack>
        <Rating name="size-large" defaultValue={4} size="large" readOnly />
        <FormControlLabel
          sx={{
            ml: 15,
            '.MuiFormControlLabel-label': {
              fontWeight: 'bold'
            } 
          }}
          value="bottom"
          control={<Switch color="primary" />}
          checked={checked}
          onChange={handleChange}
          label="Xác thực 2 lớp"
          labelPlacement="start"
        />
      </Stack>
      <TableContainer component={Paper} elevation={2}>
        <Table sx={{ tableLayout: "fixed", width: "100%" }}>
          <TableBody>
            {Object.entries(userInfo).map(([key, value]) => (
              <TableRow key={key}>
                <TableCell sx={{ fontWeight: "bold", fontSize: "1rem", py: 3.5, pl: 10 }}>{value}</TableCell>
                <TableCell sx={{ fontSize: "1rem" }} align="left">
                  xxxxxxxxx
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>


    </Paper>
  )
}

export default Profile