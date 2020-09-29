import React from 'react';
import styled from 'styled-components';
import { HeartOutlined, HeartTwoTone } from '@ant-design/icons';

interface ILike {
    isTap: boolean;
    postId: number;
    likeMutate: (index: number, postId: number) => void;
    index: number;
}

const Like: React.FC<ILike> = ({ isTap, postId, likeMutate, index }) => {
    return (
        <StyledLike onClick={() => likeMutate(index, postId)}>
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
