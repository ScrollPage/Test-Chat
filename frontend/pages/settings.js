import PrivateLayout from '@/components/Layout/PrivateLayout';
import { AuthContext } from '@/context/auth/AuthContext';
import { Button } from 'antd';
import { useContext } from 'react';
import styled from 'styled-components';

export default function Settings() {

  const { logout } = useContext(AuthContext);

  return (
    <PrivateLayout>
      <StyledSettings>
        <div>
          Settings
      </div>
        <div>
          <Button onClick={() => logout()}>
            Выйти из аккаунта
        </Button>
        </div>
      </StyledSettings>
    </PrivateLayout>
  );
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