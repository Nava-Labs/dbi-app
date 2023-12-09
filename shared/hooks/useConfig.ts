import { useMemo } from "react";
import { supportedChainID, SupportedChainID } from "../types/chain.types";
import dataSource from "../utils/dataSource";
import { Chain } from "wagmi";

const DEFAULT_CHAIN_ID = 80001;

type DataSourceKey = keyof typeof dataSource;

function useConfig(chain: Chain & {
  unsupported?: boolean;
}) {
  const defaultData = dataSource[DEFAULT_CHAIN_ID];

  const value: typeof dataSource[SupportedChainID] = useMemo(() => {
    if (!chain || chain.unsupported) return defaultData;

    const chainId = chain.id as DataSourceKey;
    if (!supportedChainID.includes(chainId)) return defaultData;
    
    return dataSource[chainId];
  }, [chain, defaultData]);

  return value;
}

export default useConfig;
