import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { useDispatch } from 'react-redux';
import { emailActivate } from '@/store/actions/auth';
import VisitorLayout from '@/components/Layout/VisitorLayout';
import { ensureRedirectToDialogs, getAsString } from '@/utils';
import { GetServerSideProps } from 'next';

interface IActivation {
    token?: string; 
}

export default function Activation({ token }: IActivation) {
    const dispatch = useDispatch();

    const { push } = useRouter();

    useEffect(() => {
        if (token) {
            dispatch(emailActivate(token));
            setTimeout(() => {
                push({ pathname: '/' }, undefined, { shallow: true });
            }, 5000);
        }
    }, [token]);

    return (
        <VisitorLayout>
            <Head>
                <title>Активация аккаунта</title>
            </Head>
            Через 5 секунд вы будете переадресованы на страницу входа
        </VisitorLayout>
    );
}

export const getServerSideProps: GetServerSideProps<IActivation> = async ctx => {
    ensureRedirectToDialogs(ctx);
    let token = getAsString(ctx.query.token);
    return {
        props: {
            token
        },
    };
};


