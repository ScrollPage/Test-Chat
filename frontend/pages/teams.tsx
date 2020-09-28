import PrivateLayout from '@/components/Layout/PrivateLayout';
import { IUser } from '@/types/user';
import { getUserFromServer } from '@/utils/index';
import { GetServerSideProps } from 'next';

interface ITeams {
    user: IUser;
}

export default function Teams({user}: ITeams) {
    return <PrivateLayout user={user}>Teams</PrivateLayout>;
}

export const getServerSideProps: GetServerSideProps<ITeams> = async (ctx) => {
    return {
        props: {
            user: getUserFromServer(ctx)
        }
    }
}