'use client'

import DashboardLayout from '@/components/dashboard-layout'
import { TeamWorkspace } from '@/components/team-workspace'

export default function TeamPage() {
  return (
    <DashboardLayout 
      title="Team Workspace"
      description="Manage team members and collaboration"
    >
      <TeamWorkspace />
    </DashboardLayout>
  )
}
