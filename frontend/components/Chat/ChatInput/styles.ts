import styled from 'styled-components';

export const StyledChatInput = styled.div`
    background: white;
    border-top: 1px solid #f0f0f0;
    position: sticky;
    bottom: 0;
    width: 100%;
    height: 70px;
    padding: 10px;
    > form {
        height: 100%;
    }
`;

export const StyledChatInputInner = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    > div {
        display: flex;
        align-items: center;
        &:first-of-type {
            flex: 1;
            margin-right: 10px;
        }
    }
`;
