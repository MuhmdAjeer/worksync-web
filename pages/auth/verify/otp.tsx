/* eslint-disable react/no-unescaped-entities */
"use client";
import Typography from "@/components/ui/Typography";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

import React, { useState } from "react";
import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useVerifyCode } from "@/hooks/Auth";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import ApiClient from "@/lib/apiClient";
import { useRouter } from "next/navigation";
import AuthLayout from "@/components/layouts/AuthLayout";
import { NextPageWithLayout } from "@/pages/_app";

const Page: NextPageWithLayout = () => {
  const [value, setValue] = useState<string>("");
  const verifyCodeMutation = useVerifyCode();
  const params = useSearchParams();
  const email = params.get("email");
  const router = useRouter();
  const handleSubmit = () => {
    if (!email) {
      return;
    }
    verifyCodeMutation.mutate(
      { code: value, email: email },
      {
        onSuccess: () => {
          toast.success("Verification success!");
          router.push("/auth/login");
        },
      }
    );
  };
  const resendCode = async () => {
    try {
      if (!email) {
        return;
      }
      await ApiClient.resendCode({ email });
      toast.success("New code send successfully!");
    } catch (error) {
      toast.error("Failed to send new code");
    }
  };
  return (
    <div className="relative z-10 mt-[calc(30vh)] h-fit w-full max-w-md overflow-hidden border-y border-gray-200 sm:rounded-2xl sm:border sm:shadow-xl">
      <Card>
        <CardHeader>
          <Typography variant="h4">Please enter your Code to verify</Typography>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center">
            <InputOTP onChange={(e) => setValue(e)} value={value} maxLength={6}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
          {/* <Typography affects="muted" variant="p">
            By signing up, I accept the Tenant Cloud Terms of Service and
            acknowledge the Privacy Policy.
          </Typography> */}
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button
            disabled={value!.length < 6}
            onClick={handleSubmit}
            className="w-full"
          >
            Confirm
          </Button>
          {/* <Typography affects={"removePMargin"} variant="h4">
            Or continue with:
          </Typography> */}
          <Typography color="gray" variant="h4" affects="muted">
            Didn't received code?{" "}
            <Button variant="link" className="text-info" onClick={resendCode}>
              Resend Code
            </Button>
          </Typography>
        </CardFooter>
      </Card>
    </div>
  );
};

Page.getLayout = function getLayout(page) {
  return <AuthLayout>{page}</AuthLayout>;
};

export default Page;
