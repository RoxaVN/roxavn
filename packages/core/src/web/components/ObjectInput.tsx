import { JsonInput } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { useEffect, useState } from 'react';

export interface ObjectInputProps
  extends Omit<React.ComponentProps<typeof JsonInput>, 'value' | 'onChange'> {
  value?: Record<string, any>;
  onChange?: (value?: Record<string, any>) => void;
  delay?: number;
}

export const ObjectInput = ({
  value,
  onChange,
  delay = 200,
  ...props
}: ObjectInputProps) => {
  const [inputVal, setInputVal] = useState(value ? JSON.stringify(value) : '');
  const [debounced] = useDebouncedValue(inputVal, delay);

  useEffect(() => {
    try {
      const parsed = JSON.parse(debounced);
      onChange && onChange(parsed);
    } catch (e) {
      onChange && onChange();
    }
  }, [debounced]);

  return <JsonInput {...props} value={inputVal} onChange={setInputVal} />;
};
