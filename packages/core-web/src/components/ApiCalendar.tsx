import { parse, format } from 'date-fns';
import { Calendar } from 'primereact/calendar';

export interface ApiMonthRangeProps {
  className?: string;
  name?: string;
  yearRange?: string;
  value?: (string | undefined)[];
  onChange?: (e: {
    target: {
      name?: string;
      value: (string | undefined)[];
    };
  }) => void;
}

function ApiMonthRange({
  className,
  name,
  yearRange,
  value,
  onChange,
}: ApiMonthRangeProps) {
  const now = new Date();
  const year = now.getFullYear();
  yearRange = yearRange || `${year - 20}:${year + 10}`;
  const parseValue = value
    ? [
        value[0] ? parse(value[0], 'yyyy-MM', now) : undefined,
        value[1] ? parse(value[1], 'yyyy-MM', now) : undefined,
      ]
    : [];
  const formatValue = (v: Date) => (v ? format(v, 'yyyy-MM') : undefined);
  return (
    <div className="p-inputgroup">
      <Calendar
        className={className}
        value={parseValue[0]}
        onChange={(e) => {
          if (onChange) {
            const event = {
              target: {
                value: [
                  formatValue(e.target.value as Date),
                  value ? value[1] : undefined,
                ],
                name,
              },
            };
            onChange(event);
          }
        }}
        view="month"
        dateFormat="mm/yy"
        yearNavigator
        yearRange={yearRange}
        showButtonBar
      />
      <span className="p-inputgroup-addon">
        <i className="pi pi-arrow-right"></i>
      </span>
      <Calendar
        className={className}
        value={parseValue[1]}
        onChange={(e) => {
          if (onChange) {
            const event = {
              target: {
                value: [
                  value ? value[0] : undefined,
                  formatValue(e.target.value as Date),
                ],
                name,
              },
            };
            onChange(event);
          }
        }}
        view="month"
        dateFormat="mm/yy"
        yearNavigator
        yearRange={yearRange}
        showButtonBar
      />
    </div>
  );
}

export { ApiMonthRange };
