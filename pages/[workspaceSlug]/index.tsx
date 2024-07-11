import { ReactElement } from "react";
import { NextPageWithLayout } from "../_app";
import { AppLayout } from "@/components/layouts/app/AppLayout";
import Room from "@/components/Room";

export const Page: NextPageWithLayout = () => {
  return (
    <div>
      {/* <Room /> */}
    </div>
  );
};

Page.getLayout = function getLayout(page: ReactElement) {
  return <AppLayout>{page}</AppLayout>;
};

export default Page;
