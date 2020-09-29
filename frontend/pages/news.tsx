import PrivateLayout from '@/components/Layout/PrivateLayout';
import { IUser } from '@/types/user';
import { getUserFromServer } from '@/utils/index';
import { GetServerSideProps } from 'next';

interface INews {
    user: IUser;
}

export default function News({user}: INews) {
    return <PrivateLayout user={user}>News</PrivateLayout>;
}

export const getServerSideProps: GetServerSideProps<INews> = async (ctx) => {
    return {
        props: {
            user: getUserFromServer(ctx)
        }
    }
}
