import { Text } from '@radix-ui/themes';
import React, { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}
const ErrorMessage = ({ children }: Props) => {
  if (!children) return null;
  return (
    <Text as="p" color="red">
      {children}
    </Text>
  );
};

export default ErrorMessage;
