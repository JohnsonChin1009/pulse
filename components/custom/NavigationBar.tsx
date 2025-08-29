"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Trophy, MessageSquare, User } from "lucide-react";
import { cn } from "@/lib/utils";

export default function NavigationBar() {
  const pathname = usePathname();

  const navItems = [
    {
      href: "/user",
      icon: Home,
      active: pathname === "/user",
    },
    {
      href: "/user/leaderboard",
      icon: Trophy,
      active: pathname?.startsWith("/user/leaderboard"),
    },
    {
      href: "/user/forum",
      icon: MessageSquare,
      active: pathname?.startsWith("/user/forum"),
    },
    {
      href: "/user/profile",
      icon: User,
      active: pathname?.startsWith("/user/profile"),
    },
  ];

  return (
    <nav className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-200 rounded-t-2xl z-50 shadow-lg">
      <div className="flex items-center justify-around py-3 px-2">
        {navItems.map(({ href, icon: Icon, active }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center justify-center p-3 rounded-full transition-all duration-200",
              active
                ? "text-white bg-primary"
                : "text-gray-400 hover:text-gray-600 hover:bg-gray-50",
            )}
          >
            <Icon
              size={24}
              className={cn(
                "transition-transform duration-200",
                active && "scale-110",
              )}
            />
          </Link>
        ))}
      </div>
    </nav>
  );
}
