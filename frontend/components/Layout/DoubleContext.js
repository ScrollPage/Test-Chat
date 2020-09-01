import React, { useContext } from 'react';
import { MessageContext } from '@/context/message/MessageContext';
import { AuthContext } from '@/context/auth/AuthContext';

export const DoubleContext = () => {
  const foo = useContext(MessageContext);
  const bar = useContext(AuthContext);

  return <B foo={foo} bar={bar} />
}