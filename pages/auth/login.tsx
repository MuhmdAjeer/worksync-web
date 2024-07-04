"use client";

import Typography from "@/components/ui/Typography";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { CreateUserDto } from "@/generated/dto/create-user-dto";
import { loginSchema } from "@/lib/schema/Auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { NextPageWithLayout } from "../_app";
import AuthLayout from "@/components/layouts/AuthLayout";
import { signIn } from "next-auth/react";
import { UserService } from "@/services/user.service";

const userService = new UserService();

const Login: NextPageWithLayout = () => {
  const form = useForm<CreateUserDto>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const router = useRouter();

  return (
    <div className="relative z-10 mt-[calc(30vh)] h-fit w-full max-w-md overflow-hidden border-y border-secondary sm:rounded-2xl sm:border sm:shadow-xl">
      <Card>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await signIn("credentials", {
              redirect: false,
              email: form.getValues("email"),
              password: form.getValues("password"),
            }).then(async (response) => {
              if (response?.ok) {
                const user = await userService.getCurrentUser();
                if (!user.onboarding?.is_onboarded) {
                  router.push("/onboarding");
                } else {
                  router.push("/");
                }
                return;
              } else {
                toast.error("Invalid credentials");
              }
            });
          }}
        >
          <CardHeader>
            <Typography variant="h4">Welcome Back, Login</Typography>

            <CardDescription>Stay connected to your team!</CardDescription>
          </CardHeader>
          <CardContent>
            <div>
              <Controller
                control={form.control}
                name="email"
                render={({ field, fieldState }) => (
                  <Input
                    {...field}
                    name="email"
                    type="email"
                    label="Email"
                    placeholder="Email"
                    message={fieldState.error?.message}
                    size={28}
                  />
                )}
              />
            </div>
            <div>
              <Controller
                control={form.control}
                name="password"
                render={({ field, fieldState }) => (
                  <Input
                    {...field}
                    name="password"
                    type="password"
                    label="Password"
                    placeholder="Password"
                    message={fieldState.error?.message}
                    size={28}
                  />
                )}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button type="submit" className="w-full">
              Submit
            </Button>{" "}
            {/* <div
              className="flex h-8 items-end space-x-1"
              aria-live="polite"
              aria-atomic="true"
            ></div> */}
            <Separator className="my-2" />
            <Button
              onClick={async (e) => {
                e.preventDefault();
                await signIn("github");
              }}
              className="w-full "
            >
              <GitHubLogoIcon />
            </Button>
            <Typography
              className="text-primary/70"
              variant="h4"
              affects="muted"
            >
              New to Worksync?{" "}
              <Link className="text-primary" href="/auth/register">
                Create an account
              </Link>
            </Typography>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

Login.getLayout = function getLayout(page) {
  return <AuthLayout>{page}</AuthLayout>;
};

export default Login;
