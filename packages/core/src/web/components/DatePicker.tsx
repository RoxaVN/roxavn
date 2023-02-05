import {
  DatePicker as MantineDatePicker,
  DateRangePicker as MantineDateRangePicker,
} from '@mantine/dates';

export interface DatePickerProps
  extends Omit<
    React.ComponentProps<typeof MantineDatePicker>,
    'value' | 'onChange'
  > {
  value?: string;
  onChange?: (value: string) => void;
}

export const DatePicker = ({ value, onChange, ...props }: DatePickerProps) => {
  const mValue = value ? new Date(value) : undefined;
  const mOnChange = (v: Date) =>
    onChange && onChange(v && v.toISOString().slice(0, 10));
  return <MantineDatePicker value={mValue} onChange={mOnChange} {...props} />;
};

export type DateRangePickerValue = [string | null, string | null] | undefined;

export interface DateRangePickerProps
  extends Omit<
    React.ComponentProps<typeof MantineDateRangePicker>,
    'value' | 'onChange'
  > {
  value?: DateRangePickerValue;
  onChange?: (value: DateRangePickerValue) => void;
}

export const DateRangePicker = ({
  value,
  onChange,
  ...props
}: DateRangePickerProps) => {
  return (
    <MantineDateRangePicker
      value={
        value && [
          value[0] ? new Date(value[0]) : null,
          value[1] ? new Date(value[1]) : null,
        ]
      }
      onChange={(v) => {
        if (onChange) {
          const newValue: DateRangePickerValue = [
            v[0] && v[0].toISOString().slice(0, 10),
            v[1] && v[1].toISOString().slice(0, 10),
          ];
          if (newValue[0] == null && newValue[1] == null) {
            onChange(undefined);
          } else {
            onChange(newValue);
          }
        }
      }}
      {...props}
    />
  );
};
