import { Badge, Group } from '@mantine/core';
import dayjs from 'dayjs';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import { Suspense } from 'react';

dayjs.extend(utc);
dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);

export const utils = {
  Component: {
    lazy: (fallback?: React.ReactElement) => {
      return (target: any, name: PropertyKey): any => {
        let ComponentType: React.ComponentType;
        const componentWrapper = (props: any) => {
          if (ComponentType) {
            return (
              <Suspense fallback={fallback}>
                <ComponentType {...props} />
              </Suspense>
            );
          }
          throw new Error(name.toString() + " isn't implemented");
        };

        const descriptor = {
          get(this: any) {
            return componentWrapper;
          },
          set(newVal: React.ComponentType) {
            ComponentType = newVal;
          },
        };

        Object.defineProperty(target, name, descriptor);
      };
    },
  },
  Number: {
    formatLocale(n: number | string) {
      const number = typeof n === 'string' ? parseFloat(n) : n;
      return number && number.toLocaleString('vi-VN');
    },
    abbreviate(v: number, suffixList?: Array<string>) {
      if (v === 0) {
        return '0';
      } // terminate early
      if (!v) {
        return null;
      } // terminate early
      const fixed = 0;
      const suffix = suffixList || ['', 'K', 'M', 'B', 'T'];
      const b = v.toPrecision(2).split('e');
      const k =
        b.length === 1
          ? 0
          : Math.floor(
              Math.min(parseInt(b[1].slice(1)), (suffix.length - 1) * 3) / 3
            );
      const c = parseFloat(
        k < 1 ? v.toFixed(fixed) : (v / 1000 ** k).toFixed(1 + fixed)
      );
      const d = c < 0 ? c : Math.abs(c);
      const e = `${d} ${suffix[k]}`;
      return e;
    },
  },
  Render: {
    shorten: (v: string) => (
      <div className="p-text-nowrap p-text-truncate" style={{ width: '10rem' }}>
        {v}
      </div>
    ),
    boolean: (v: boolean | number) => v && <i className="pi pi-check" />,
    percent: (v: number) => v && `${(v * 100).toFixed(1)}%`,
    number: (v: number) => utils.Number.formatLocale(v),
    abbrNumber: (v: number) => utils.Number.abbreviate(v),
    relativeTime: (v: dayjs.ConfigType) => v && dayjs.utc(v).fromNow(),
    datetime: (v: dayjs.ConfigType) => v && dayjs.utc(v).local().format('LLL'),
    date: (v: dayjs.ConfigType) => v && dayjs.utc(v).local().format('LL'),
    tags: (v: Array<string>) => (
      <Group>
        {v.map((item) => (
          <Badge key={item}>{item}</Badge>
        ))}
      </Group>
    ),
  },
};
