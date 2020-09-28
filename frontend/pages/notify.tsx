import PrivateLayout from '@/components/Layout/PrivateLayout';
import { IUser } from '@/types/user';
import { getUserFromServer } from '@/utils/index';
import { GetServerSideProps } from 'next';

interface INotify {
    user: IUser;
}

export default function Notify({user}: INotify) {
    return <PrivateLayout user={user}>Notify</PrivateLayout>;
}

export const getServerSideProps: GetServerSideProps<INotify> = async (ctx) => {
    return {
        props: {
            user: getUserFromServer(ctx)
        }
    }
}
