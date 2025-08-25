'use client'

import DashboardLayout from '@/components/dashboard-layout'
import { ROIDashboard } from '@/components/roi-dashboard'

export default function ROIPage() {
  return (
    <DashboardLayout 
      title="ROI Analytics"
      description="Track your automation impact and cost savings"
    >
      <ROIDashboard />
    </DashboardLayout>
  )
}
