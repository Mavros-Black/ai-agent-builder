'use client'

import DashboardLayout from '@/components/dashboard-layout'
import { SecuritySettings } from '@/components/security-settings'

export default function SecurityPage() {
  return (
    <DashboardLayout 
      title="Security Settings"
      description="Manage your account security and privacy"
    >
      <SecuritySettings />
    </DashboardLayout>
  )
}
