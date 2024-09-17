"use client"

import React from 'react';
import { InfinitySpin } from 'react-loader-spinner';

export default function Loading() {
  return (
    // <div style={{
    //   display: 'flex',
    //   justifyContent: 'center',
    //   alignItems: 'center',
    //   height: '100vh',
    //   width: '100vw',
    // }}>
    //   <InfinitySpin
    //     visible={true}
    //     width="200"
    //     color="#4fa94d"
    //     ariaLabel="infinity-spin-loading"
    //   />
    // </div>


      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
  );
}