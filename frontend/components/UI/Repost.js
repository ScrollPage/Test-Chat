import React from 'react';
import styled from 'styled-components';
import { NotificationOutlined } from '@ant-design/icons';

const Repost = ({setIsOpenHandler, post}) => {
    return (
        <StyledRepost>
            <NotificationOutlined 
              style={{ fontSize: '23px' }}
              onClick={() => setIsOpenHandler(post)}
            />
        </StyledRepost>
    );
};

export default Repost;

const StyledRepost = styled.div`
    margin-left: 20px;
    margin-right: 10px;
    &:hover {
        cursor: pointer;
    }
`;
