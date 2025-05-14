"use client";
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

import React from 'react'

function Loader() {
  return (
    <Skeleton count={1}/> 
  )
}

export default Loader