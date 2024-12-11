'use client'

import { Container, Grid2 as Grid, Typography } from '@mui/material'

function Footer() {
    return (
        <Container sx={{ py: 10, px: 5, mt: 20, bgcolor: '#D9D9D9' }}>
            <Grid container spacing={2} sx={{}}>
                <Grid size={3}>
                    <Typography variant="h5" color='primary' sx={{ fontWeight: "bold" }}>
                        GRAB STUDENT
                    </Typography>
                </Grid>
                <Grid size={3}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                        An toàn khi đi chung xe
                    </Typography>
                    <br />
                    <Typography variant="body" sx={{ fontSize: '20px' }}>
                        Luôn kiểm tra thông tin <br />
                        người lái và hành khách
                        <br /><br />
                        Giữ liên lạc với bạn bè <br />
                        hoặc gia đình khi bạn đi xe
                    </Typography>
                </Grid>
                <Grid size={3}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                        Theo dõi chúng tôi
                    </Typography>
                    <br />
                    <Typography variant="body" sx={{ fontSize: '20px' }}>
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
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                        Liên hệ với chúng tôi:
                    </Typography>
                    <br />
                    <Typography variant="body" sx={{ fontSize: '20px' }}>
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