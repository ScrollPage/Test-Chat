import { useDispatch } from 'react-redux';

import styled from 'styled-components';
import { Button } from 'antd';
import { logout } from '@/store/actions/auth';
import PrivateLayout from '@/components/Layout/PrivateLayout';

export default function Settings() {
  const dispatch = useDispatch();
  return (
    <PrivateLayout>
      <StyledSettings>
        <div>Settings</div>
        <div>
          <Button onClick={() => dispatch(logout())}>Выйти из аккаунта</Button>
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
