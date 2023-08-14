import { type AppProviderComponent } from '@roxavn/core/web';
import { EthereumClient } from '@web3modal/ethereum';
import { Web3Modal } from '@web3modal/react';
import { useMemo } from 'react';
import { WagmiConfig, type Config } from 'wagmi';

export interface Web3ProviderProps {
  children: React.ReactElement;
  wagmiConfig: Config;
  projectId: string;
}

export function Web3Provider({
  children,
  wagmiConfig,
  projectId,
}: Web3ProviderProps) {
  const ethereumClient = useMemo(() => {
    return new EthereumClient(
      wagmiConfig,
      wagmiConfig.publicClient.chains || []
    );
  }, [wagmiConfig]);

  return (
    <>
      <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>
      <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
    </>
  );
}

declare module '@roxavn/core/web' {
  interface AppProviderConfigs {
    web3Provider: {
      options: Omit<Web3ProviderProps, 'children'>;
      component: AppProviderComponent;
    };
  }
}
