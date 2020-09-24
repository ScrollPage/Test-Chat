import PrivateLayout from '@/components/Layout/PrivateLayout';
import { getUserFromServer } from '@/utils/index.js';

export default function Notify({user}) {
    return <PrivateLayout user={user}>Notify</PrivateLayout>;
}

export const getServerSideProps = async ctx => {
    return {
        props: {
            user: getUserFromServer(ctx)
        }
    }
}