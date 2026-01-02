'use client'

import ResetPasswordContent from '@/components/reset-password/ResetPasswordContent'
import { Suspense } from 'react'

export default function ResetPassword() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  )
}