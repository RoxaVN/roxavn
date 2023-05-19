import { Avatar, AvatarProps } from '@mantine/core';

import { FileInfo } from '../../base/index.js';

export interface ApiAvatarProps extends Omit<AvatarProps, 'src'> {
  file: FileInfo;
}

export const ApiAvatar = ({ file, ...props }: ApiAvatarProps) => {
  return <Avatar {...props} src={file.url} />;
};
