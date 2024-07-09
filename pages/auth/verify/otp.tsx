import Typography from "@/components/ui/Typography";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import React, { useEffect, useState } from "react";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useVerifyCode } from "@/hooks/Auth";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import AuthLayout from "@/components/layouts/AuthLayout";
import { NextPageWithLayout } from "@/pages/_app";
import { AuthService } from "@/services/auth.service";

const authService = new AuthService();

const Page: NextPageWithLayout = () => {
  const [value, setValue] = useState<string>("");

  const verifyCodeMutation = useVerifyCode();
  const params = useSearchParams();
  const router = useRouter();

  const email = params.get("email");

  useEffect(() => {
    if (!email) {
      router.push("/auth/register");
    }
  }, [email, router]);

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
      await authService.resendCode({ email });
      toast.success("New code send successfully!");
    } catch (error) {
      toast.error("Failed to send new code");
    }
  };

  return (
    <div className="relative z-10 mt-[calc(30vh)] h-fit w-full max-w-md overflow-hidden border-y border-secondary sm:rounded-2xl sm:border sm:shadow-xl">
      <Card>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <CardHeader>
            <Typography variant="h4">
              Please enter your Code to verify
            </Typography>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <InputOTP
                onChange={(e) => setValue(e)}
                value={value}
                maxLength={6}
              >
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
          </CardContent>
          <CardFooter className="flex flex-col gap-2">
            <Button
              type="submit"
              disabled={value!.length < 6 || verifyCodeMutation.isPending}
              className="w-full"
            >
              Confirm
            </Button>
            <Typography color="gray" variant="h4" affects="muted">
              Didnt received code?{" "}
              <Button
                disabled={verifyCodeMutation.isPending}
                variant="link"
                className="text-info"
                onClick={resendCode}
              >
                Resend Code
              </Button>
            </Typography>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

Page.getLayout = function getLayout(page) {
  return <AuthLayout>{page}</AuthLayout>;
};

export default Page;
