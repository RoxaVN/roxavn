import { WebModule } from '../services';

export interface ModuleTProps {
  module: WebModule;
  k: string;
  options?: any;
}

export const ModuleT = ({ module, k, options }: ModuleTProps) => {
  const { t } = module.useTranslation();
  return <>{t(k, options)}</>;
};
