'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { 
  Users, 
  UserPlus, 
  Settings, 
  Download, 
  Upload, 
  MoreHorizontal,
  Shield,
  Eye,
  Edit,
  Trash2
} from 'lucide-react'

interface TeamMember {
  id: string
  name: string
  email: string
  role: 'admin' | 'editor' | 'viewer'
  status: 'active' | 'pending' | 'inactive'
  joinedAt: string
  lastActive: string
}

const mockTeamMembers: TeamMember[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@company.com',
    role: 'admin',
    status: 'active',
    joinedAt: '2024-01-15',
    lastActive: '2024-01-20'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@company.com',
    role: 'editor',
    status: 'active',
    joinedAt: '2024-01-10',
    lastActive: '2024-01-19'
  },
  {
    id: '3',
    name: 'Mike Wilson',
    email: 'mike@company.com',
    role: 'viewer',
    status: 'pending',
    joinedAt: '2024-01-18',
    lastActive: 'Never'
  }
]

const roleColors = {
  admin: 'bg-red-100 text-red-800 border-red-200',
  editor: 'bg-blue-100 text-blue-800 border-blue-200',
  viewer: 'bg-green-100 text-green-800 border-green-200'
}

const statusColors = {
  active: 'bg-green-100 text-green-800 border-green-200',
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  inactive: 'bg-gray-100 text-gray-800 border-gray-200'
}

export function TeamWorkspace() {
  const [members, setMembers] = useState<TeamMember[]>(mockTeamMembers)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<'editor' | 'viewer'>('viewer')

  const handleInviteMember = () => {
    if (!inviteEmail) return
    
    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: inviteEmail.split('@')[0],
      email: inviteEmail,
      role: inviteRole,
      status: 'pending',
      joinedAt: new Date().toISOString().split('T')[0],
      lastActive: 'Never'
    }
    
    setMembers([...members, newMember])
    setInviteEmail('')
    setInviteRole('viewer')
  }

  const handleRoleChange = (memberId: string, newRole: TeamMember['role']) => {
    setMembers(members.map(member => 
      member.id === memberId ? { ...member, role: newRole } : member
    ))
  }

  const handleRemoveMember = (memberId: string) => {
    setMembers(members.filter(member => member.id !== memberId))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Team Workspace</h2>
          <p className="text-gray-600">Manage your team members and collaboration settings</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Upload className="w-4 h-4 mr-2" />
            Import Workflows
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="members" className="space-y-4">
        <TabsList>
          <TabsTrigger value="members">Team Members</TabsTrigger>
          <TabsTrigger value="workflows">Shared Workflows</TabsTrigger>
          <TabsTrigger value="settings">Workspace Settings</TabsTrigger>
        </TabsList>

        {/* Team Members Tab */}
        <TabsContent value="members" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Team Members ({members.length})
                  </CardTitle>
                  <CardDescription>
                    Manage team access and permissions
                  </CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Invite Member
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Invite Team Member</DialogTitle>
                      <DialogDescription>
                        Send an invitation to join your team workspace
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="colleague@company.com"
                          value={inviteEmail}
                          onChange={(e) => setInviteEmail(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="role">Role</Label>
                        <Select value={inviteRole} onValueChange={(value: any) => setInviteRole(value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="editor">Editor - Can create and edit workflows</SelectItem>
                            <SelectItem value="viewer">Viewer - Can view and use workflows</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button onClick={handleInviteMember} className="w-full">
                        Send Invitation
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members.map((member) => (
                    <TableRow key={member.id}>
                      <TableCell className="font-medium">{member.name}</TableCell>
                      <TableCell>{member.email}</TableCell>
                      <TableCell>
                        <Select 
                          value={member.role} 
                          onValueChange={(value: any) => handleRoleChange(member.id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="editor">Editor</SelectItem>
                            <SelectItem value="viewer">Viewer</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Badge className={`text-xs ${statusColors[member.status]}`}>
                          {member.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{member.joinedAt}</TableCell>
                      <TableCell>{member.lastActive}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-600"
                              onClick={() => handleRemoveMember(member.id)}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Remove
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Shared Workflows Tab */}
        <TabsContent value="workflows" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Shared Workflow Library</CardTitle>
              <CardDescription>
                Workflows shared with your team
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No shared workflows yet</p>
                <p className="text-sm">Team members can share their workflows here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Workspace Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Security Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Two-Factor Authentication</Label>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-gray-600">Require 2FA for all members</span>
                    <Button variant="outline" size="sm">Enable</Button>
                  </div>
                </div>
                <div>
                  <Label>Session Timeout</Label>
                  <Select defaultValue="8h">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1h">1 hour</SelectItem>
                      <SelectItem value="4h">4 hours</SelectItem>
                      <SelectItem value="8h">8 hours</SelectItem>
                      <SelectItem value="24h">24 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Collaboration Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Default Role for New Members</Label>
                  <Select defaultValue="viewer">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="viewer">Viewer</SelectItem>
                      <SelectItem value="editor">Editor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Workflow Approval</Label>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-gray-600">Require approval for new workflows</span>
                    <Button variant="outline" size="sm">Enable</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
