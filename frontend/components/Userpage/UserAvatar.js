import React from 'react';
import styled from 'styled-components';
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { Button }  from 'antd';
import Cookie from 'js-cookie';

const UserAvatar = ({ data, userId }) => {
  return (
    <StyledUserAvatar>
      <div>
        <Avatar style={{ backgroundColor: '#87d068' }} size={200} shape="square" icon={<UserOutlined />} />
        {Cookie.get('userId') !== userId
         ? data.is_friend
          ? <Button style={{width: '100%', marginTop: '10px'}}>Удалить из друзей</Button> 
          : <Button style={{width: '100%', marginTop: '10px'}}>Добавить в друзья</Button>
         : <Button style={{width: '100%', marginTop: '10px'}}>Сменить данные</Button>}
      </div>
    </StyledUserAvatar>
  );
}

export default UserAvatar;

const StyledUserAvatar = styled.div`
  margin-right: 20px;
  > div {
    background-color: #f4f4f4;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px;
    flex-direction: column;
    p {
      margin-top: 10px;
    }
  }
`;
