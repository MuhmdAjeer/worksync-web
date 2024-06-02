import React, { PropsWithChildren } from "react";
import StoreWrapper from "./wrappers/store-wrapper";
import { SWRConfig, SWRConfiguration } from "swr";
export const SWR_CONFIG: SWRConfiguration = {
  refreshWhenHidden: false,
  revalidateIfStale: true,
  revalidateOnFocus: true,
  revalidateOnMount: true,
  refreshInterval: 600000,
  errorRetryCount: 3,
 
};

const AppProvider = (props: PropsWithChildren) => {
  return (
    <StoreWrapper>
      <SWRConfig value={SWR_CONFIG}>{props.children}</SWRConfig>
    </StoreWrapper>
  );
};

export default AppProvider;
