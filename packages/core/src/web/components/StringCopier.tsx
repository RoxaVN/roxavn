import { Flex } from '@mantine/core';
import { CopyButton } from './Buttons.js';

export function StringCopier({
  value,
  maxLength = 10,
}: {
  value: string;
  maxLength?: number;
}) {
  return (
    <Flex gap="sm" align="flex-end">
      {value.length > maxLength ? (
        <span title={value}>{`${value.slice(0, maxLength - 1)}...`}</span>
      ) : (
        value
      )}
      <CopyButton value={value} />
    </Flex>
  );
}
