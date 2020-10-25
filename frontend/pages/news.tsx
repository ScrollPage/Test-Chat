import Head from 'next/head';
import PrivateLayout from '@/components/Layout/PrivateLayout';
import { IPost } from '@/types/post';
import { IUser } from '@/types/user';
import { ensureAuth, getUserFromServer } from '@/utils/index';
import { instanceWithSSR } from '@/api/api';
import { GetServerSideProps } from 'next';
import styled from 'styled-components';
import Posts from '@/components/Post/Posts';

interface INews {
    user: IUser;
    serverPosts: IPost[];
}

function News({ user, serverPosts }: INews) {
    return (
        <PrivateLayout user={user}>
            <Head>
                <title>Новости</title>
            </Head>
            <StyledNews>
                <Posts serverPosts={serverPosts} user={user} />
            </StyledNews>
        </PrivateLayout>
    );
}

export const getServerSideProps: GetServerSideProps<INews> = async ctx => {
    ensureAuth(ctx);
    let posts: Array<IPost> = [];

    await instanceWithSSR(ctx)
        .get(`/api/v1/feed/`)
        .then(response => {
            posts = response?.data;
        })
        .catch(error => {
            console.log(error);
        });
    return {
        props: {
            user: getUserFromServer(ctx),
            serverPosts: posts,
        },
    };
};

export default News

const StyledNews = styled.div`
    margin-top: 20px;
    max-width: 500px;
    @media (max-width: 575.98px) {
        margin-top: 0px;
    }
`;
