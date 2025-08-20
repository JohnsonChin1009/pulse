"use client";

import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";

export default function SignInPage() {
  const router = useRouter();

  // form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // UI/control state
  const [isUser, setIsUser] = useState(false); // false = ask email, true = ask password
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const handleContinueOrLogin = async () => {
    setErr(null);

    // STEP 1: Check if user exists
    if (!isUser) {
      if (!email) {
        setErr("Please enter your email.");
        return;
      }
      setLoading(true);
      try {
        const res = await fetch("/api/user-exists", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const data = await res
          .json()
          .catch(() => ({}) as { exists?: boolean; error?: string });

        if (!res.ok) throw new Error(data.error || "Failed to check account.");

        if (data.exists) {
          // Show password field + change button label to "Login"
          setIsUser(true);
        } else {
          router.push(`/user-register?email=${encodeURIComponent(email)}`);
        }
      } catch (e: any) {
        setErr(e.message || "Something went wrong.");
      } finally {
        setLoading(false);
      }
      return;
    }

    // STEP 2: Login
    if (!password) {
      setErr("Please enter your password.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        router.push("/"); // success
      } else {
        const data = await res.json().catch(() => ({}));
        setErr(data.error || "Invalid email or password.");
      }
    } catch (e: any) {
      setErr(e.message || "Login failed.");
    } finally {
      setLoading(false);
    }
  };

  // allow Enter key to submit current step
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      void handleContinueOrLogin();
    }
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
          {/* Step 1: Email (always visible, but disabled when on password step) */}
          <Input
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={onKeyDown}
            required
            disabled={isUser || loading}
          />

          {/* Step 2: Password (only shows after we confirm user exists) */}
          {isUser && (
            <div className="space-y-2">
              <Input
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={onKeyDown}
                required
                disabled={loading}
              />
              <Button
                type="button"
                variant="text"
                className="w-full justify-end"
                onClick={() => router.push("/forgot-password")}
              >
                Forgot Password?
              </Button>
            </div>
          )}

          {err && <p className="text-sm text-red-600">{err}</p>}
        </div>

        <Button
          onClick={handleContinueOrLogin}
          className="font-headline"
          disabled={loading || (!isUser && !email) || (isUser && !password)}
        >
          {loading
            ? isUser
              ? "Logging in..."
              : "Checking..."
            : isUser
              ? "Login"
              : "Continue"}
        </Button>
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
            onClick={() =>
              (window.location.href = "/api/oauth/start?provider=google")
            }
            className="w-full rounded-xl max-w-xs gap-2 p-5"
            disabled={loading}
          >
            <FcGoogle size={20} />
            Google
          </Button>
        </div>
      </div>
    </div>
  );
}
