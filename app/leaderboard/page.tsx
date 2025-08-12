"use client";

import { useState } from "react";

export default function LeaderboardPage() {
  const [leaderboardState, setLeaderboardState] = useState<
    "Weekly" | "All Time"
  >("Weekly");

  const leaderboard = [
    { id: 1, name: "Johnson", score: 5505 },
    { id: 2, name: "Lily Riggs", score: 3531 },
    { id: 3, name: "Stephie Lingo", score: 5445 },
    { id: 4, name: "Prabu the Great", score: 2031 },
    { id: 5, name: "ShuenRou the Infamous", score: 4431 },
  ].sort((a, b) => b.score - a.score); // Sort highest score first

  return (
    <div className="bg-primary flex flex-col min-h-screen py-10 px-6 space-y-5">
      <h1 className="text-center font-headline text-xl">Leaderboard</h1>

      {/* Toggle Button */}
      <div className="bg-white rounded-full p-1 w-[220px] mx-auto flex">
        {["Weekly", "All Time"].map((option) => (
          <button
            key={option}
            onClick={() => setLeaderboardState(option as "Weekly" | "All Time")}
            className={`flex-1 px-4 py-2 text-sm rounded-full transition-all duration-200 font-main font-semibold hover:cursor-pointer
              ${
                leaderboardState === option
                  ? "bg-primary text-black shadow"
                  : "text-gray-600"
              }`}
          >
            {option}
          </button>
        ))}
      </div>

      {/* Banner Text */}
      <div className="flex gap-6 text-white rounded-xl p-6 bg-[#AD66F5]">
        <div className="text-lg font-headline p-3 rounded-2xl bg-[#851AF0]">
          #4
        </div>
        <p className="font-main font-semibold">
          You are doing better than 60% of other players!
        </p>
      </div>

      {/* Leaderboard Section */}
      <div className="flex flex-col gap-3">
        {leaderboard.map((player, index) => (
          <div
            key={player.id}
            className="flex items-center justify-between p-3 py-5 rounded-xl bg-white shadow-sm"
          >
            {/* Rank with colors */}
            <span
              className={`w-6 text-center font-bold ${
                index === 0
                  ? "text-yellow-500"
                  : index === 1
                    ? "text-gray-400"
                    : index === 2
                      ? "text-orange-500"
                      : "text-gray-700"
              }`}
            >
              #{index + 1}
            </span>

            {/* Name */}
            <span className="flex-1 ml-3 font-main text-sm font-semibold truncate">
              {player.name}
            </span>

            {/* Score */}
            <span className="font-bold text-sm text-gray-800">
              {player.score}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
