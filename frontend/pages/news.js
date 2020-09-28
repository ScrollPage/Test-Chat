import PrivateLayout from '@/components/Layout/PrivateLayout';
import { getUserFromServer } from '@/utils/index';

export default function News({user}) {
    return <PrivateLayout user={user}>News</PrivateLayout>;
}

export const getServerSideProps = async ctx => {
    return {
        props: {
            user: getUserFromServer(ctx)
        }
    }
}