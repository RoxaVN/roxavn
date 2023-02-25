import { Progress, Stack, Text } from '@mantine/core';
import { useEffect, useState } from 'react';

export interface TasksProgressProps {
  tasks: Array<{
    name?: React.ReactNode;
    handler: () => Promise<void>;
  }>;
  children?: React.ReactElement;
}

export const TasksProgress = ({ tasks, children }: TasksProgressProps) => {
  const [progress, setProgress] = useState(0);
  const [label, setLabel] = useState<React.ReactNode>();

  const load = async () => {
    setProgress(0);
    for (let i = 0; i < tasks.length; i += 1) {
      setLabel(tasks[i].name);
      await tasks[i].handler();
      setProgress(Math.floor(((i + 1) * 100) / tasks.length));
    }
  };

  useEffect(() => {
    load();
  }, [tasks]);

  if (children && progress === 100) {
    return children;
  }
  return (
    <Stack align="center" justify="center">
      <Text c="dimmed">{label}</Text>
      <Progress value={progress} />
    </Stack>
  );
};
