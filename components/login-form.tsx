"use client";

import { signIn } from "@/lib/auth-client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GithubIcon } from "@/lib/icons";
import { toast } from "sonner";

export function LoginForm({ ...props }: React.ComponentProps<"div">) {
  const handleSignIn = async () => {
    try {
      await signIn.social({
        provider: "github",
        callbackURL: "/dashboard",
      });
    } catch (error) {
      console.error(error);
      toast.error("Sign in failed", {
        description: "Please try again later",
      });
    }
  };

  return (
    <div className="flex flex-col gap-6" {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Connect with your github account to login
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <Button
                onClick={handleSignIn}
                variant="outline"
                className="w-full"
              >
                <GithubIcon className="size-4" />
                Login with Github
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
