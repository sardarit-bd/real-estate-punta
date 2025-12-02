import React, { Suspense } from 'react'
import PropertiesPage from './PropertiesPage'

export default function page() {
  return (
    <Suspense fallback="Loading..">
        <PropertiesPage />
    </Suspense>
  )
}
