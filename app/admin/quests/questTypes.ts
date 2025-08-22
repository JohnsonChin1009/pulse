export interface Quest {
  id: number
  title: string
  description: string
  points: number
  difficulty: string
  status: string
  availableDate: string
  expirationDate: string
  completions: number
}

export interface EditQuest {
  id: number
  title: string
  description: string
  points: number
  difficulty: string
  availableDate: string
  expirationDate: string
  achievement: {
    achievementId: number
    achievementName: string
  }
}

export interface Achievement {
  title?: string
  name?: string
  description: string
  score?: number
  icon: string 
  count?: number
}

export interface LeaderboardUser {
  rank: number
  name: string
  points: number
  avatar: string
}

export interface NewQuest {
  title: string
  description: string
  points: string
  difficulty: string
  availableDate: string
  expirationDate: string
}
