import { Box, Stack, Typography, Divider } from "@mui/material";
import Image from "next/image";
import LandingHeader from "@/components/landing/Header";
import banner from '@/public/images/banner.jpg'
import section1 from '@/public/images/section1.png'
import section2 from '@/public/images/section2.png'
import section3 from '@/public/images/section3.png'
import Footer from "@/layout/footer/Footer";

export default function Home() {
    return (
        <Box sx={{backgroundColor: '--var(background)'}}>
            <LandingHeader />
            <Box sx={{ width: 1 }}>
                <Box sx={{ width: '100%', height: '840px', position: 'relative' }}>
                    <Image src={banner}
                        style={{ width: "100%", height: "100%", objectFit: 'cover' }}
                        alt="image"
                    />
                    <Typography variant="h2" sx={{ color: 'white', fontWeight: "bold", position: 'absolute', left: 60, bottom: 50 }}>
                        CÙNG CHUNG TAY HỖ TRỢ LẪN NHAU<br />
                        XÂY DỰNG CỘNG ĐỒNG LÀNH MẠNH
                    </Typography>
                </Box>
                <Stack direction='row' sx={{ justifyContent: 'space-around', alignItems: 'center', mt: 20 }}>
                    <Box sx={{ maxWidth: '480px', height: 'auto' }}>
                        <Image
                            alt="alt"
                            src={section1}
                            style={{ width: "100%", height: "auto" }} // Tạo width linh hoạt
                        />
                    </Box>
                    <Box sx={{ maxWidth: '700px' }}>
                        <Typography variant="h4" sx={{ fontWeight: "bold", mb: 4 }}>
                            Cùng nhau đi xa, tiết kiệm và bảo vệ môi trường
                        </Typography>
                        <Typography variant="body" sx={{ fontSize: '20px' }}>
                            Thể hiện tinh thần đồng hành và chia sẻ lợi ích kinh tế, đồng thời nhấn mạnh ý thức bảo vệ môi trường.
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="body" sx={{ fontSize: '20px' }} >
                            Nhấn mạnh những lợi ích của việc đi nhờ xe, bao gồm tiết kiệm chi phí, an toàn và góp phần giảm lượng khí thải.
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="body" sx={{ fontSize: '20px' }}>
                            Nhấn mạnh tính kinh tế và sự đoàn kết của sinh viên thông qua việc đi chung xe.
                        </Typography>
                    </Box>
                </Stack>

                <Stack direction='row' sx={{ justifyContent: 'space-around', alignItems: 'center', mt: 20 }}>
                    <Box sx={{ width: '480px', height: 'auto' }}>
                        <Image
                            alt="alt"
                            src={section2}
                            style={{ width: "100%", height: "auto" }} // Tạo width linh hoạt
                        />
                    </Box>
                    <Box sx={{ maxWidth: '700px' }}>
                        <Typography variant="h4" sx={{ fontWeight: "bold", mb: 4 }}>
                            Chia sẻ chuyến đi - Kết nối những hành trình
                        </Typography>
                        <Typography variant="body" sx={{ fontSize: '20px' }}>
                            Tạo sự kết nối giữa sinh viên với những chuyến xe thuận tiện và an toàn.
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="body" sx={{ fontSize: '20px' }}>
                            Gợi mở sự gắn kết và xây dựng mối quan hệ giữa những người đi cùng nhau.
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="body" sx={{ fontSize: '20px' }}>
                            Tạo sự tin tưởng lẫn nhau giữa các sinh viên khi tham gia dịch vụ chia sẻ xe.
                        </Typography>
                    </Box>
                </Stack>

                <Stack direction='row' sx={{ justifyContent: 'space-around', alignItems: 'center', mt: 20 }}>
                    <Box sx={{ width: '480px', height: 'auto' }}>
                        <Image
                            alt="alt"
                            src={section3}
                            style={{ width: "100%", height: "auto" }} // Tạo width linh hoạt
                        />
                    </Box>
                    <Box sx={{ maxWidth: '700px' }}>
                        <Typography variant="h4" sx={{ fontWeight: "bold", mb: 4 }}>
                            Xe chung, niềm vui chung
                        </Typography>
                        <Typography variant="body" sx={{ fontSize: '20px' }}>
                            Tạo không khí vui vẻ, giúp sinh viên cảm thấy thoải mái và gần gũi hơn khi đi chung xe.
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="body" sx={{ fontSize: '20px' }}>
                            Khuyến khích sự kết nối và giao lưu giữa sinh viên trong suốt quá trình chia sẻ xe.
                        </Typography>
                    </Box>
                </Stack>
            </Box>
            <Footer />
        </Box>
    )
}
