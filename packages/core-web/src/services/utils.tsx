import { format, formatRelative, parseJSON } from 'date-fns';
import { i18nClient } from './i18n';

const utils = {
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
    percent: (v: number) => v && `${v}%`,
    number: (v: number) => utils.Number.formatLocale(v),
    abbrNumber: (v: number) => utils.Number.abbreviate(v),
    datetimeRelative: (v: string) =>
      v &&
      formatRelative(parseJSON(v), new Date(), {
        locale: i18nClient.dateFnsLocale,
      }),
    datetime: (v: string) =>
      v &&
      format(parseJSON(v), 'PPPp', {
        locale: i18nClient.dateFnsLocale,
      }),
    date: (v: string) =>
      v &&
      format(parseJSON(v), 'PPP', {
        locale: i18nClient.dateFnsLocale,
      }),
  },
};

export { utils };
