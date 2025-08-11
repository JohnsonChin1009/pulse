"use client";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { GoGear } from "react-icons/go";
import { IoIosArrowRoundForward } from "react-icons/io";
import { IoInformationCircleOutline } from "react-icons/io5";

export default function ProfilePage() {
  const links = [
    {
      id: 1,
      name: "About Me",
      target: "/about-me",
      icon: <IoInformationCircleOutline />,
    },
    {
      id: 2,
      name: "Settings",
      target: "/settings",
      icon: <GoGear />,
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
            <p className="font-headline">johnson</p>
          </div>

          {/* Menu Buttons */}
          <nav className="flex flex-col w-full space-y-7">
            {links.map((item) => (
              <a
                href={item.target}
                key={item.id}
                className="flex items-center justify-between text-gray-600 hover:text-black"
              >
                <div className="flex items-center justify-center space-x-4">
                  <div className="bg-primary rounded-full border-black border text-xl p-3">
                    {item.icon}
                  </div>
                  <p>{item.name}</p>
                </div>
                <div>
                  <IoIosArrowRoundForward size={24} />
                </div>
              </a>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
