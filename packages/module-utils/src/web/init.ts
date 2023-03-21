import { WebModule } from '@roxavn/core/web';

export default function () {
  WebModule.settingsPageRenderRegister = () => import('./register');
}
