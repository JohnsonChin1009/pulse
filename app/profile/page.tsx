"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";

export default function ProfilePage() {
  const achievements = [
    {
      id: 1,
      title: "First Words",
      badgeURL:
        "https://github.githubassets.com/assets/yolo-default-be0bbff04951.png",
    },
    {
      id: 2,
      title: "Wave Rider",
      badgeURL:
        "https://github.githubassets.com/assets/pull-shark-default-498c279a747d.png",
    },
    {
      id: 3,
      title: "Mood Streaker",
      badgeURL:
        "https://github.githubassets.com/assets/quickdraw-default--light-medium-5450fadcbe37.png",
    },
    {
      id: 4,
      title: "Vibe Checker",
      badgeURL:
        "https://github.githubassets.com/assets/starstruck-default--medium-2670f78c9f2f.png",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <div className="absolute top-0 left-0 max-h-screen w-full">
        <img
          src="/decorators/top-background.svg"
          alt="Top Background"
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1 flex flex-col items-center justify-between px-8 pt-36">
        <div className="space-y-20 w-full">
          <div className="flex flex-col items-center justify-center space-y-2">
            <Avatar className="w-32 h-32 border-[2px] border-black">
              <AvatarImage src="https://avatars.githubusercontent.com/u/107231772?v=4" />
              <AvatarFallback>JC</AvatarFallback>
            </Avatar>
            <div className="space-y-1 text-center">
              <p className="font-headline">johnson</p>
              <p className="font-main">Journeyman</p>
            </div>
          </div>

          {/* Statistics Section */}
          <div className="flex flex-col space-y-8">
            <div className="flex items-center gap-3">
              <Separator className="flex-1 bg-foreground" />
              <h2 className="font-headline text-center">Stats</h2>
              <Separator className="flex-1 bg-foreground" />
            </div>
            <div className="flex gap-10 items-center justify-center text-center">
              <div className="flex flex-col space-y-1">
                <h3 className="font-main font-bold text-sm">Highest Lvl.</h3>
                <p>52</p>
              </div>
              <div className="flex flex-col space-y-1">
                <h3 className="font-main font-bold text-sm">Score</h3>
                <p>5505</p>
              </div>
              <div className="flex flex-col space-y-1">
                <h3 className="font-main font-bold text-sm">Achievements</h3>
                <p>{achievements.length}</p>
              </div>
            </div>
          </div>

          {/* Achievements Section */}
          <div className="flex flex-col space-y-8">
            <div className="flex items-center gap-3">
              <Separator className="flex-1 bg-foreground" />
              <h2 className="font-headline text-center">Achievements</h2>
              <Separator className="flex-1 bg-foreground" />
            </div>

            {/* Badges wall */}
            <div className="grid grid-cols-3 gap-6 place-items-center">
              {achievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="flex flex-col items-center text-center space-y-2"
                >
                  <Image
                    src={achievement.badgeURL}
                    alt={achievement.title}
                    width={80}
                    height={80}
                    className="rounded-full border border-gray-300 hover:border-black shadow-sm"
                  />
                  <p className="text-sm font-main">{achievement.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
