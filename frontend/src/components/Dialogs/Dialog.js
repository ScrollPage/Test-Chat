import React from 'react';
import styled from 'styled-components';
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const Dialog = ({ chatURL, name }) => {
  return (
    <Link to={`${chatURL}`}>
      <StyledDialog>
        <div>
          <Avatar style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
        </div>
        <div>
          {name}
      </div>
      </StyledDialog>
    </Link>
  );
}

export default Dialog;

const StyledDialog = styled.div`
  height: 60px; 
  width: 100%;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
