import React, { Suspense } from 'react'
import PropertiesPage from './PropertiesPage'
import Loader from '@/components/common/Loader'

export default function page() {
  return (
    <Suspense fallback={Loader}>
        <PropertiesPage />
    </Suspense>
  )
}
