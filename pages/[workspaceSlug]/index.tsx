import { ReactElement } from "react";
import { NextPageWithLayout } from "../_app";
import { AppLayout } from "@/components/layouts/app/AppLayout";

export const Page: NextPageWithLayout = () => {
  return <div></div>;
};

Page.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};

export default Page;
