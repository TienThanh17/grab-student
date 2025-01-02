'use client'

import { Container, Grid2 as Grid, Typography } from '@mui/material'
import Image from 'next/image'; // Sử dụng thẻ Image của Next.js
import logo from "@/public/images/logo.png";

function Footer() {
    return (
        <Container sx={{ py: 8, px: 5, mt: 20, bgcolor: '#D9D9D9' }}>
            <Grid container spacing={2}>
                <Grid size={3}>
                    <Image 
                        src={logo}// Đường dẫn ảnh (thay đổi theo ý bạn)
                        alt="Grab Student Logo" 
                        style={{ width: "10rem", height: "auto" }}
                    />
                </Grid>
                <Grid size={3}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                        An toàn khi đi chung xe
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '14px', lineHeight: '1.6' }}>
                        Luôn kiểm tra thông tin <br />
                        người lái và hành khách
                        <br /><br />
                        Giữ liên lạc với bạn bè <br />
                        hoặc gia đình khi bạn đi xe
                    </Typography>
                </Grid>
                <Grid size={3}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                        Theo dõi chúng tôi
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '14px', lineHeight: '1.6' }}>
                        Facebook: Lê Thanh Quỳnh
                        <br /> <br />
                        Instagram: Lê Thanh Quỳnh
                        <br /> <br />
                        Facebook: Huỳnh Thanh Tiến
                        <br /> <br />
                        Instagram: Huỳnh Thanh Tiến
                    </Typography>
                </Grid>
                <Grid size={3}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                        Liên hệ với chúng tôi:
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '14px', lineHeight: '1.6' }}>
                        Email: thanhquynhdhsp@gmail.com
                        <br /> <br />
                        Số điện thoại: +84 123 456 789
                        <br /> <br />
                        Email: theboyhunter@gmail.com
                        <br /> <br />
                        Số điện thoại: +84 123 456 789
                    </Typography>
                </Grid>
            </Grid>
        </Container>
    )
}

export default Footer;
