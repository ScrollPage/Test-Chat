import { useEffect } from 'react';
import { useRouter } from 'next/router';

import { useDispatch } from 'react-redux';
import { authActivate } from '@/store/actions/auth';

import VisitorLayout from '@/components/Layout/VisitorLayout';

export default function Activation() {
    const dispatch = useDispatch();

    const { query, push } = useRouter();

    useEffect(() => {
        if (query.token !== undefined && query.token !== null) {
            dispatch(authActivate(query.token?.[0]));
            setTimeout(() => {
                push({ pathname: '/' }, undefined, { shallow: true });
            }, 5000);
        }
    }, [query]);

    return (
        <VisitorLayout>
            Через 5 секунд вы будете переадресованы на страницу входа
        </VisitorLayout>
    );
}
