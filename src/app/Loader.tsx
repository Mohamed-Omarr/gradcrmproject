import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'

import React from 'react'

function Loader() {
  return (
    <Skeleton count={5}/> 
  )
}

export default Loader