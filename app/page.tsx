"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LandingPage() {
  return (
    <main className="py-10 flex flex-col space-y-6 px-4">
      <Button variant="default">Login</Button>
      <Button variant="destructive">Login</Button>
      <Button variant="text">Login</Button>
      <Button variant="icon">Login</Button>
      <Button variant="outline">Login</Button>
      <Button variant="secondary">Login</Button>
      <Button variant="ghost">Login</Button>
      <Button variant="link">Login</Button>
      <Input placeholder="Email" />
    </main>
  );
}
