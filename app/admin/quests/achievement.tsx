"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Plus, MoreVertical, Edit, Trash2 } from "lucide-react"
import * as LucideIcons from "lucide-react"
import { LucideProps } from "lucide-react"
import type React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { Achievement } from "./questTypes"
import { Textarea } from "@/components/ui/textarea"

const iconsData = [{ name: "Trophy" }, { name: "Crown" }, { name: "Star" }, { name: "Award" }, { name: "Medal" }]

function DynamicLucideIcon({ name, ...props }: { name: string } & LucideProps) {
  if (name && name in LucideIcons) {
    const IconComponent =
      LucideIcons[name as keyof typeof LucideIcons] as React.ComponentType<LucideProps>
    return <IconComponent {...props} />
  }
  return <span className="text-white font-bold">?</span>
}

interface AchievementsTabProps {
  achievements: Achievement[]
}

export function AchievementForm({
  onSave,
  initialData,
  isEditing = false,
}: {
  onSave: (a: Achievement) => void
  initialData?: Achievement
  isEditing?: boolean
}) {
  const [form, setForm] = useState({
    title: initialData?.title || initialData?.name || "",
    description: initialData?.description || "",
    score: initialData?.score?.toString() || "",
    icon: initialData?.icon || "",
  })

  const handleSubmit = () => {
    const achievement: Achievement = {
      title: form.title,
      score: Number.parseInt(form.score),
      icon: form.icon,
      description: initialData?.description || "",
      count: initialData?.count || 0,
    }
    onSave(achievement)
  }

  return (
    <div className="space-y-3 mt-5">
      <Label htmlFor="achievementTitle" className="mb-3">
        Achievement Title
      </Label>
      <Input
        placeholder="Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        className="rounded-sm border-gray-300"
      />

      <Label htmlFor="achievementScore" className="mb-3">
        Achievement Score
      </Label>
      <Input
        type="number"
        placeholder="Score"
        value={form.score}
        onChange={(e) => setForm({ ...form, score: e.target.value })}
        className="rounded-sm border-gray-300"
      />

      <Label htmlFor="achievementDescription" className="mb-3">
        Achievement Description
      </Label>
        <Textarea
          id="description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Describe the quest"
          rows={3}
          className="rounded-sm border-gray-300 border-2"
        />
      <Label htmlFor="achievementIcon" className="mb-3">
        Achievement Icon
      </Label>
      <select
        id="achievementIcon"
        value={form.icon}
        onChange={(e) => setForm({ ...form, icon: e.target.value })}
        className="w-full rounded-md border border-gray-300 pt-3 pb-3 px-3 py-2 text-sm shadow-sm focus:border-[#F5BE66] focus:ring focus:ring-[#F5BE66]/50"
      >
        <option value="">-- Select Icon --</option>
        {iconsData.map((icon) => (
          <option key={icon.name} value={icon.name}>
            {icon.name}
          </option>
        ))}
      </select>
      <Button onClick={handleSubmit} className="bg-[#F5BE66] hover:bg-[#E5AE56] mt-5">
        {isEditing ? "Update Achievement" : "Save Achievement"}
      </Button>
    </div>
  )
}

export function AchievementsTab({ achievements }: AchievementsTabProps) {
  const [showAchievementDialog, setShowAchievementDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteAlert, setShowDeleteAlert] = useState(false)
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null)
  const [selectedIndex, setSelectedIndex] = useState<number>(-1)

  const [searchQuery, setSearchQuery] = useState("")

  const handleAddAchievement = (achievement: Achievement) => {
    console.log("Adding achievement:", achievement)
    setShowAchievementDialog(false)
  }

  const handleEditAchievement = (achievement: Achievement) => {
    console.log("Updating achievement:", achievement)
    setShowEditDialog(false)
    setSelectedAchievement(null)
  }

  const handleDeleteAchievement = () => {
    console.log("Deleting achievement at index:", selectedIndex)
    setShowDeleteAlert(false)
    setSelectedAchievement(null)
    setSelectedIndex(-1)
  }

  const openEditDialog = (achievement: Achievement, index: number) => {
    setSelectedAchievement(achievement)
    setSelectedIndex(index)
    setShowEditDialog(true)
  }

  const openDeleteAlert = (achievement: Achievement, index: number) => {
    setSelectedAchievement(achievement)
    setSelectedIndex(index)
    setShowDeleteAlert(true)
  }

  const filteredAchievements = achievements.filter((a) =>
    (a.name || a.title || "")
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  )

  return (
    <div className="space-y-6">
    <div className="flex flex-col w-full gap-4">
      <Dialog open={showAchievementDialog} onOpenChange={setShowAchievementDialog}>
        <DialogTrigger asChild>
          <Button className="bg-[#F5BE66] hover:bg-[#E5AE56] w-50">
            <Plus className="w-4 h-4 mr-2" /> Add Achievement
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Achievement</DialogTitle>
          </DialogHeader>
          <AchievementForm onSave={handleAddAchievement} />
        </DialogContent>
      </Dialog>

      <div className="relative mt-3">
        <LucideIcons.Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search quests by title or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 rounded-sm border-gray-300"
        />
      </div>
    </div>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Achievement</DialogTitle>
          </DialogHeader>
          {selectedAchievement && (
            <AchievementForm onSave={handleEditAchievement} initialData={selectedAchievement} isEditing={true} />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Alert */}
      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Achievement</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{selectedAchievement?.title || selectedAchievement?.name}&quot;? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="outline" className="rounded-xl" onClick={() => setShowDeleteAlert(false)}>
              Cancel
            </Button>
            <Button onClick={handleDeleteAchievement} className="w-full md:w-25">
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Achievements List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredAchievements.map((achievement, index) => (
          <Card key={index} className="relative">
            <CardContent className="p-6 text-center">
              <div className="absolute top-2 right-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => openEditDialog(achievement, index)}>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => openDeleteAlert(achievement, index)} className="text-red-600">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="w-16 h-16 bg-[#F5BE66] rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="w-8 h-8 text-white font-bold">
                  <DynamicLucideIcon name={achievement.icon as string} className="w-8 h-8 text-white" />
                </span>
              </div>
              <h3 className="font-dela text-lg text-gray-900 mb-2">{achievement.name || achievement.title}</h3>
              <p className="text-gray-600 font-montserrat text-sm mb-3">{achievement.description}</p>
              <Badge variant="secondary">{achievement.count} earned</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
