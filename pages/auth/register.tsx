import Typography from "@/components/ui/Typography";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { CreateUserDto } from "@/generated/dto/create-user-dto";
import { useRegisterUser } from "@/hooks/Auth";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "@/lib/schema/Auth";
import { useRouter } from "next/navigation";
import AuthLayout from "@/components/layouts/AuthLayout";
import { NextPageWithLayout } from "../_app";

const Register: NextPageWithLayout = () => {
  const { mutate } = useRegisterUser();
  const router = useRouter();
  const form = useForm<CreateUserDto>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const registerHandler: SubmitHandler<CreateUserDto> = (data) => {

    mutate(data, {
      onSuccess: () => {
        router.push(`/auth/verify/otp?email=${data.email}`);
      },
    });
  };

  return (
    <div className="relative z-10 mt-[calc(30vh)] h-fit w-full max-w-md overflow-hidden border-y border-gray-200 sm:rounded-2xl sm:border sm:shadow-xl">
      <Card>
        <CardHeader>
          <Typography variant="h4">Sign Up to Continue</Typography>
          {/* <CardDescription>Stay connected to your team!</CardDescription> */}
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 flex-col">
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
          </div>
          <Typography affects="muted" variant="p">
            By signing up, I accept the Tenant Cloud Terms of Service and
            acknowledge the Privacy Policy.
          </Typography>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button
            onClick={() => {
              void form.handleSubmit(registerHandler)();
            }}
            className="w-full"
          >
            Sign Up
          </Button>
          {/* <Typography affects={"removePMargin"} variant="h4">
            Or continue with:
          </Typography> */}
          <Separator title="or continue" className="my-2" />
          <Button className="w-full ">
            <GitHubLogoIcon />
          </Button>
          <Typography color="gray" variant="h4" affects="muted">
            Already have an account?{" "}
            <Link className="text-info" href="/auth/login">
              Login
            </Link>
          </Typography>
        </CardFooter>
      </Card>
    </div>
  );
};
Register.getLayout = function getLayout(page) {
  return <AuthLayout>{page}</AuthLayout>;
};

export default Register;
