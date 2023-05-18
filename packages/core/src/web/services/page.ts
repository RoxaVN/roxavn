import { ExactProps } from '../../base/index.js';

export class PageItem extends ExactProps<PageItem> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ComponentType<{
    size?: number | string;
    stroke?: number | string;
  }>;
  path?: string;
  element?: React.ReactElement;
  children?: Array<PageItem>;
}
