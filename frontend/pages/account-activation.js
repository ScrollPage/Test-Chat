import { useEffect } from 'react';
import { useRouter } from 'next/router';

import { authActivate } from '@/store/actions/auth';
import { useDispatch } from 'react-redux';

import VisitorLayout from '@/components/Layout/PrivateLayout';

export default function Activation() {

  const dispatch = useDispatch();

  const { query, push } = useRouter();

  useEffect(() => {
    if (query.token !== undefined && query.token !== null) {
      dispatch(authActivate(query.token));
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