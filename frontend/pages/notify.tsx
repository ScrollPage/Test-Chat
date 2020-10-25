import Head from 'next/head';
import { instance, instanceWithSSR } from '@/api/api';
import PrivateLayout from '@/components/Layout/PrivateLayout';
import NotifyItem from '@/components/Notify/NotifyItem';
import { zeroingNotify } from '@/store/actions/notify';
import { INotifyItem } from '@/types/notify';
import { IUser } from '@/types/user';
import { ensureAuth, getUserFromServer } from '@/utils/index';
import { GetServerSideProps } from 'next';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import Cookie from 'js-cookie';

interface INotify {
    user: IUser;
    notify: INotifyItem[] | null;
}

export default function Notify({ user, notify }: INotify) {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(zeroingNotify());
    }, []);

    useEffect(() => {
        const watchedNotify = async () => {
            const token = Cookie.get('token');
            await instance(token).put('/api/v1/notifications/');
        };
        watchedNotify();
    });

    const renderNotifyItems = (notify: INotifyItem[]) => {
        return notify.map((item, index) => (
            <NotifyItem
                key={`notify__key__${item.sender.id}__${index}`}
                sender={item.sender}
                event={item.event}
            />
        ));
    };

    return (
        <PrivateLayout user={user}>
            <Head>
                <title>Уведомления</title>
            </Head>
            <StyledNotify>
                <div className="notify__header">
                    <h2>Уведомления</h2>
                </div>
                <div className="notify-items">
                    {notify ? (
                        notify.length !== 0 ? (
                            renderNotifyItems(notify)
                        ) : (
                            <h3>У вас нет уведомлений</h3>
                        )
                    ) : (
                        <h3>Ошибка</h3>
                    )}
                </div>
            </StyledNotify>
        </PrivateLayout>
    );
}

export const getServerSideProps: GetServerSideProps<INotify> = async ctx => {
    ensureAuth(ctx);
    let notify: INotifyItem[] | null = null;

    await instanceWithSSR(ctx)
        .get('/api/v1/notifications/')
        .then(response => {
            notify = response?.data;
        })
        .catch(error => {
            console.log(error);
        });
    return {
        props: {
            user: getUserFromServer(ctx),
            notify: notify || null,
        },
    };
};

const StyledNotify = styled.div`
    margin-top: 20px;
    display: flex;
    flex-direction: column;
    .notify {
        &__header {
            width: 100%;
            display: flex;
            justify-content: center;
        }
        &__items {
            display: flex;
            flex-direction: column;
        }
    }
`;
