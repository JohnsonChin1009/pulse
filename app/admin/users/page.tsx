"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Ban,
  Mail,
  Heart,
  Activity,
  UserCheck,
  Stethoscope,
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  Users,
  TrendingUp,
} from "lucide-react"

const users = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    status: "active",
    hearts: 10,
    questsCompleted: 5,
    joinDate: "2023-01-01",
    lastActive: "2023-02-01",
    avatar: "/john.jpg",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    status: "inactive",
    hearts: 5,
    questsCompleted: 5,
    joinDate: "2023-01-01",
    lastActive: "2023-02-01",
    avatar: "/john.jpg",
  },
  {
    id: 3,
    name: "Ben Smith",
    email: "ben@example.com",
    status: "suspended",
    hearts: 5,
    questsCompleted: 5,
    joinDate: "2023-01-01",
    lastActive: "2023-02-01",
    avatar: "/john.jpg",
  },
]

const practitioners = [
  {
    id: 1,
    name: "Jane Smith",
    email: "jane@example.com",
    status: "verified",
    specialty: "Cardiology",
    documents: ["doc1.pdf", "doc2.pdf"],
    license: "12345",
    joinDate: "2023-01-01",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    status: "rejected",
    specialty: "Cardiology",
    documents: ["doc1.pdf", "doc2.pdf"],
    license: "12345",
    joinDate: "2023-01-01",
  },
  {
    id: 3,
    name: "Jane Smith",
    email: "jane@example.com",
    status: "pending",
    specialty: "Cardiology",
    documents: ["doc1.pdf", "doc2.pdf"],
    license: "12345",
    joinDate: "2023-01-01",
  },
]

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [verifyStatusFilter, setVerifyStatusFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("users")

  const filteredUsers = users.filter((user) => {
    if (statusFilter !== "all" && user.status !== statusFilter) return false
    if (
      !user.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !user.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
      return false
    return true
  })

  const filteredPractitioners = practitioners.filter((practitioner) => {
    if (verifyStatusFilter !== "all" && practitioner.status !== verifyStatusFilter) return false
    if (
      !practitioner.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !practitioner.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
      return false
    return true
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
      case "verified":
        return (
          <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
            <CheckCircle className="w-3 h-3 mr-1" />
            {status === "active" ? "Active" : "Verified"}
          </Badge>
        )
      case "inactive":
        return (
          <Badge variant="secondary" className="bg-muted text-muted-foreground">
            Inactive
          </Badge>
        )
      case "suspended":
        return (
          <Badge variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20">
            Suspended
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const UserCard = ({ user }: { user: (typeof users)[0] }) => (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 hover:border-primary/20">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12 ring-2 ring-primary/10">
              <AvatarImage src={user.avatar || "/test"} />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-serif font-semibold text-foreground">{user.name}</h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Eye className="w-4 h-4 mr-2" />
                View Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Mail className="w-4 h-4 mr-2" />
                Send Message
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                <Ban className="w-4 h-4 mr-2" />
                Suspend User
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center justify-between mb-4">
          {getStatusBadge(user.status)}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Heart className="w-4 h-4 text-red-500" />
              <span className="font-medium">{user.hearts}</span>
            </div>
            <div className="flex items-center gap-1">
              <Activity className="w-4 h-4 text-blue-500" />
              <span className="font-medium">{user.questsCompleted}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Joined {user.joinDate}</span>
          <span>Active {user.lastActive}</span>
        </div>
      </CardContent>
    </Card>
  )

  const PractitionerCard = ({ practitioner }: { practitioner: (typeof practitioners)[0] }) => (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50 hover:border-primary/20">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12 ring-2 ring-primary/10">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {practitioner.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-serif font-semibold text-foreground">{practitioner.name}</h3>
              <p className="text-sm text-muted-foreground">{practitioner.email}</p>
              <p className="text-xs text-primary font-medium">{practitioner.specialty}</p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Eye className="w-4 h-4 mr-2" />
                Review Application
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FileText className="w-4 h-4 mr-2" />
                View Documents
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Mail className="w-4 h-4 mr-2" />
                Send Message
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center justify-between mb-4">
          {getStatusBadge(practitioner.status)}
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <FileText className="w-4 h-4" />
            <span>{practitioner.documents.length} docs</span>
          </div>
        </div>

        <div className="flex justify-between text-xs text-muted-foreground">
          <span className="font-mono">{practitioner.license}</span>
          <span>Joined {practitioner.joinDate}</span>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-montserrat font-bold  text-3xl sm:text-4xl text-foreground mb-2">User Management</h1>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-2 bg-muted/50 rounded-xl shadow-md border border-muted-foreground/10">
            <TabsTrigger
                value="users"
                className="flex items-center gap-2 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-[0_3px_0_0_#000] transition-all"
            >
                <UserCheck className="w-4 h-4" />
                App Users
            </TabsTrigger>
            <TabsTrigger
                value="practitioners"
                className="flex items-center gap-2 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-[0_3px_0_0_#000] transition-all"
            >
                <Stethoscope className="w-4 h-4" />
                Practitioners
            </TabsTrigger>
            </TabsList>
          <TabsContent value="users" className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border-border/50 hover:border-primary/20 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Users</p>
                      <p className="text-2xl font-bold text-foreground">123</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50 hover:border-primary/20 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Active Users</p>
                      <p className="text-2xl font-bold text-foreground">98</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50 hover:border-primary/20 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Inactive</p>
                      <p className="text-2xl font-bold text-foreground">23</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50 hover:border-primary/20 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-destructive/10 rounded-lg flex items-center justify-center">
                      <Ban className="w-5 h-5 text-destructive" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Suspended</p>
                      <p className="text-2xl font-bold text-foreground">2</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-border/50">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search users by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 h-11 bg-background border-border/50 focus:border-primary/50"
                    />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="h-11 px-4 rounded-xl border-border/50 hover:border-primary/50 bg-transparent"
                      >
                        <Filter className="w-4 h-4 mr-2" />
                        Status: {statusFilter === "all" ? "All" : statusFilter}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => setStatusFilter("all")}>All Users</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setStatusFilter("active")}>Active</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setStatusFilter("inactive")}>Inactive</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setStatusFilter("suspended")}>Suspended</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredUsers.map((user) => (
                  <UserCard key={user.id} user={user} />
                ))}
              </div>
          </TabsContent>

          <TabsContent value="practitioners" className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border-border/50 hover:border-primary/20 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Stethoscope className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Practitioners</p>
                      <p className="text-2xl font-bold text-foreground">156</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50 hover:border-primary/20 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Verified</p>
                      <p className="text-2xl font-bold text-foreground">142</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50 hover:border-primary/20 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                      <Clock className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Pending Review</p>
                      <p className="text-2xl font-bold text-foreground">12</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border/50 hover:border-primary/20 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-destructive/10 rounded-lg flex items-center justify-center">
                      <AlertTriangle className="w-5 h-5 text-destructive" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Rejected</p>
                      <p className="text-2xl font-bold text-foreground">2</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-border/50">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search practitioners by name or email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 h-11 bg-background border-border/50 focus:border-primary/50"
                    />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="h-11 px-4 rounded-xl border-border/50 hover:border-primary/50 bg-transparent"
                      >
                        <Filter className="w-4 h-4 mr-2" />
                        Status: {verifyStatusFilter === "all" ? "All" : verifyStatusFilter}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => setVerifyStatusFilter("all")}>
                        All Practitioners
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setVerifyStatusFilter("verified")}>Verified</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setVerifyStatusFilter("pending")}>Pending</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setVerifyStatusFilter("rejected")}>Rejected</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredPractitioners.map((practitioner) => (
                  <PractitionerCard key={practitioner.id} practitioner={practitioner} />
                ))}
              </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
