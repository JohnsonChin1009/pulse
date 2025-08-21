"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Target, Trophy, Medal } from "lucide-react"
import { QuestsTab } from "./quest"
import { AchievementsTab } from "./achievement"
import { LeaderboardTab } from "./leaderboard"
import type { Quest, Achievement, LeaderboardUser } from "./questTypes"

export default function QuestsPage() {
  const quests: Quest[] = [
    {
      id: 1,
      title: "Daily Heart Check",
      description: "Monitor your heart rate for 7 consecutive days",
      points: 100,
      difficulty: "easy",
      status: "active",
      availableDate: "",
      expirationDate: "",
      completions: 1250,
    },
    {
      id: 2,
      title: "Cardio Champion",
      description: "Complete 30 minutes of cardio exercise",
      points: 200,
      difficulty: "medium",
      status: "active",
      availableDate: "",
      expirationDate: "",
      completions: 890,
    },
    {
      id: 3,
      title: "Heart Health Expert",
      description: "Read 5 cardiovascular health articles",
      points: 150,
      difficulty: "hard",
      status: "active",
      availableDate: "",
      expirationDate: "",
      completions: 2100,
    },
  ]

  const achievements: Achievement[] = [
    {
      name: "Heart Hero",
      description: "Completed 50 quests",
      icon: "Trophy",
      count: 245,
    },
    {
      name: "Streak Master",
      description: "7-day quest streak",
      icon: "Crown",
      count: 189,
    },
    {
      name: "Knowledge Seeker",
      description: "Read 100 articles",
      icon: "Star",
      count: 156,
    },
    {
      name: "Community Helper",
      description: "Helped 10 users",
      icon: "Award",
      count: 78,
    },
  ]

  const leaderboard: LeaderboardUser[] = [
    { rank: 1, name: "Sarah Johnson", points: 2850, avatar: "SJ" },
    { rank: 2, name: "Mike Chen", points: 2720, avatar: "MC" },
    { rank: 3, name: "Emma Davis", points: 2650, avatar: "ED" },
    { rank: 4, name: "Alex Rodriguez", points: 2580, avatar: "AR" },
    { rank: 5, name: "Lisa Wang", points: 2490, avatar: "LW" },
    { rank: 6, name: "Test Data", points: 2480, avatar: "LW" },
  ]

  return (
    <div className="p-6 max-w-7xl mx-auto pb-25 md:pb-0 mb-0 md:mb-12">
      <div className="flex items-center gap-4 mb-6">
        <div>
          <h1 className="font-montserrat font-bold text-3xl text-gray-900">Quest Management</h1>
        </div>
      </div>

      <Tabs defaultValue="quests" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger
            value="quests"
            className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-[0_3px_0_0_#000] transition-all"
          >
            <Target className="w-4 h-4" />
            Quests
          </TabsTrigger>
          <TabsTrigger
            value="achievements"
            className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-[0_3px_0_0_#000] transition-all"
          >
            <Trophy className="w-4 h-4" />
            Achievements
          </TabsTrigger>
          <TabsTrigger
            value="leaderboard"
            className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-[0_3px_0_0_#000] transition-all"
          >
            <Medal className="w-4 h-4" />
            Leaderboard
          </TabsTrigger>
        </TabsList>

        <TabsContent value="quests">
          <QuestsTab quests={quests} achievements={achievements} />
        </TabsContent>

        <TabsContent value="achievements">
          <AchievementsTab achievements={achievements} />
        </TabsContent>

        <TabsContent value="leaderboard">
          <LeaderboardTab leaderboard={leaderboard} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
