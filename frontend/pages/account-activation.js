import VisitorLayout from '@/components/Layout/PrivateLayout';
import { useContext, useEffect } from 'react';
import { AuthContext } from '@/context/auth/AuthContext';
import { useRouter } from 'next/router';

export default function Activation() {

  const { query, push } = useRouter();

  const { authActivate } = useContext(AuthContext);

  useEffect(() => {
    if (query.token !== undefined && query.token !== null) {
      authActivate(query.token);
      setTimeout(() => {
        push({ pathname: '/' }, undefined, { shallow: true });
      }, 5000)
    }
  }, [query])

  return (
    <VisitorLayout>
      Через 5 секунд вы будете переадресованы на страницу входа
    </VisitorLayout>
  );
}