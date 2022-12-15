import { createStyles } from '@mantine/core';

export const useApiFileInputStyles = createStyles((theme) => ({
  container: {
    width: 100,
    height: 100,
    marginBottom: 20,
    position: 'relative',
    border: `1px dashed ${theme.fn.variant({ variant: 'default' }).border}`,
  },

  uploadButton: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },

  closeButton: {
    position: 'absolute',
    top: 5,
    right: 5,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },

  content: {
    width: 100,
    height: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
}));
