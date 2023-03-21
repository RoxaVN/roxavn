import { TFunction } from 'i18next';
import { ExactProps } from '../../base';

export class PageItem extends ExactProps<PageItem> {
  label?: React.ReactNode | { (t: TFunction): React.ReactNode };
  description?: React.ReactNode | { (t: TFunction): React.ReactNode };
  icon?: React.ComponentType<{
    size?: number | string;
    stroke?: number | string;
  }>;
  path?: string;
  element?: React.ReactElement;
  children?: Array<PageItem>;
}
