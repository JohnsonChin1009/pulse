/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Target, Trophy, Medal } from "lucide-react"
import { QuestsTab } from "./quest"
import { AchievementsTab } from "./achievement"
import { LeaderboardTab } from "./leaderboard"
import type { Quest, Achievement, LeaderboardUser } from "./questTypes"
import { useEffect, useState } from "react"

export default function QuestsPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [quests, setQuests] = useState<Quest[]>([]);

  const fetchQuests = async () => {
    try {
      const res = await fetch("/api/admin/quest/fetch");
      const data = await res.json();
      setQuests(data.quest);
    } catch (error) {
      console.error("Failed to fetch quests:", error);
    }
  };

  useEffect(() => {
    fetchQuests();
  }, []);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch("/api/admin/leaderboard");
        const data = await res.json();

        const sortedLeaderboard = (data.leaderboard ?? [])
          .map((user: any, index: number) => ({
            rank: index + 1,
            name: user.username || "Unknown",
            points: user.highestScore ?? 0,
            avatar: user.profile_picture_url || "",
          }));

        setLeaderboard(sortedLeaderboard);
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
      } 
    };
    fetchLeaderboard();
  }, []);


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
          <QuestsTab quests={quests} achievements={achievements} onRefresh={fetchQuests}/>
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
