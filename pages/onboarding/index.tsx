import OnboardingForm from "@/components/onboarding/OnboardingForm";
import React from "react";
import { NextPageWithLayout } from "../_app";
import OnboardingLayout from "@/components/layouts/OnboardingLayout";

const Page: NextPageWithLayout = () => {
  return (
    <>
      <div className="w-1/2">
        <OnboardingForm />
      </div>
    </>
  );
};
Page.getLayout = (page) => {
  return <OnboardingLayout>{page}</OnboardingLayout>;
};
export default Page;
