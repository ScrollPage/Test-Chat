import React from 'react';
import styled from 'styled-components';
import { HeartOutlined, HeartTwoTone } from '@ant-design/icons';

interface ILike {
    isTap: boolean;
    postId: number;
    likeMutate: (postId: number) => void;
}

const Like: React.FC<ILike> = ({ isTap, postId, likeMutate }) => {
    return (
        <StyledLike onClick={() => likeMutate(postId)}>
            {isTap ? (
                <HeartTwoTone
                    twoToneColor="#eb2f96"
                    style={{ fontSize: '23px' }}
                />
            ) : (
                    <HeartOutlined style={{ fontSize: '23px' }} />
                )}
        </StyledLike>
    );
};

export default Like;

const StyledLike = styled.div`
    margin-right: 10px;
    &:hover {
        cursor: pointer;
    }
`;
