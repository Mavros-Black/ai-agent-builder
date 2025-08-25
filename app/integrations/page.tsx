'use client'

import DashboardLayout from '@/components/dashboard-layout'
import { IntegrationsDashboard } from '@/components/integrations-dashboard'

export default function IntegrationsPage() {
  return (
    <DashboardLayout 
      title="Integrations"
      description="Connect your favorite tools and services"
    >
      <IntegrationsDashboard />
    </DashboardLayout>
  )
}
