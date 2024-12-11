// import { NextResponse } from 'next/server';

// export function middleware(req) {
//   const token = req.cookies.get('accessToken'); // Lấy token từ cookie

//   if (!token) {
//     // Chuyển hướng về trang login nếu không có token
//     return NextResponse.redirect(new URL('/login', req.url));
//   }

//   // Cho phép request tiếp tục nếu có token
//   return NextResponse.next();
// }

// // Áp dụng middleware cho các route cụ thể
// export const config = {
//   matcher: ['/protected-page/:path*'], // Áp dụng cho các route cần bảo vệ
// };
