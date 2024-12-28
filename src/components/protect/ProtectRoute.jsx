'use client'

import Cookies from 'js-cookie';
import { redirect } from 'next/navigation';
import { useSelector } from 'react-redux';

function ProtectRoute({ children }) {
  const isLogin = useSelector((state) => state.user.isLogin);
  const token = Cookies.get('accessToken');
  // console.log('token', token);
  
  if (!isLogin || !token) {
    redirect('/login');
  }

  return (
    <>{children}</>
  )
}

export default ProtectRoute