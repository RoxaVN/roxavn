import { DatePicker as MantineDatePicker } from '@mantine/dates';

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
