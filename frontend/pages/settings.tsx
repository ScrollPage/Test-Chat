import { IUser } from '@/types/user';
import { useDispatch } from 'react-redux';
import { getUserFromServer } from '@/utils/index';
import styled from 'styled-components';
import { Button } from 'antd';
import { logout } from '@/store/actions/auth';
import PrivateLayout from '@/components/Layout/PrivateLayout';
import { GetServerSideProps } from 'next';

interface ISettings {
    user: IUser;
}

export default function Settings({user}: ISettings) {
    const dispatch = useDispatch();
    return (
        <PrivateLayout user={user}>
            <StyledSettings>
                <div>Settings</div>
                <div>
                    <Button onClick={() => dispatch(logout())}>
                        Выйти из аккаунта
                    </Button>
                </div>
            </StyledSettings>
        </PrivateLayout>
    );
}

export const getServerSideProps: GetServerSideProps<ISettings> = async (ctx) => {
    return {
        props: {
            user: getUserFromServer(ctx)
        }
    }
}

const StyledSettings = styled.div`
    display: flex;
    flex-direction: column;
    height: calc(100vh - 80px);
    width: 100%;
    align-items: center;
    > div {
        &:first-of-type {
            flex: 1;
        }
        &:last-of-type {
            margin: 40px;
        }
    }
`;
