import { WebModule } from '@roxavn/core/web';

WebModule.settingsPageRenderRegister = () => import('./register');
