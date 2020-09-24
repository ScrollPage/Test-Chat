import PrivateLayout from '@/components/Layout/PrivateLayout';
import { getUserFromServer } from '@/utils/index.js';

export default function Teams({user}) {
    return <PrivateLayout user={user}>Teams</PrivateLayout>;
}

export const getServerSideProps = async ctx => {
    return {
        props: {
            user: getUserFromServer(ctx)
        }
    }
}