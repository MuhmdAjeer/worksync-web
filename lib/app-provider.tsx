import React, { PropsWithChildren } from "react";
import StoreWrapper from "./wrappers/store-wrapper";
import { SWRConfig, SWRConfiguration } from "swr";

const AppProvider = (props: PropsWithChildren) => {
  return <StoreWrapper>{props.children}</StoreWrapper>;
};

export default AppProvider;
