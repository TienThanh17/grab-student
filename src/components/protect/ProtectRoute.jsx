'use client'

import { redirect } from 'next/navigation';
import { useSelector } from 'react-redux';

function ProtectRoute({children}) {
    const isLogin = useSelector((state) => state.user.isLogin);
    if(!isLogin) {
      redirect('/login');
    }

  return (
    <>{children}</>
  )
}

export default ProtectRoute