"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FcGoogle } from "react-icons/fc";

export default function SignInPage() {
  const handleGoogleOauthLogin = async () => {
    console.log("OAuth Login triggered");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 sm:px-8 md:px-16 py-10 bg-white">
      <div className="w-full max-w-sm md:max-w-lg lg:max-w-xl space-y-16">
        <div className="space-y-3 justify-start">
          <h1 className="font-headline text-3xl sm:text-4xl">Welcome Back!</h1>
          <p className="font-main font-medium">
            learn healthy habits, one step at a time
          </p>
        </div>
        <div className="flex flex-col space-y-6">
          <Input placeholder="Email" type="email" />
          <div className="space-y-2">
            <Input placeholder="Password" type="password" />
            <Button variant="text" className="w-full justify-end">
              Forgot Password?
            </Button>
          </div>
        </div>
        <Button className="font-headline">Login</Button>
      </div>
      <div className="space-y-5 mt-10">
        <div className="flex items-center gap-3 text-sm">
          <Separator className="flex-1" />
          or with
          <Separator className="flex-1" />
        </div>
        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={handleGoogleOauthLogin}
            className="w-full rounded-xl max-w-xs gap-2 p-5"
          >
            <FcGoogle size={20} />
            Google
          </Button>
        </div>
      </div>
    </div>
  );
}
