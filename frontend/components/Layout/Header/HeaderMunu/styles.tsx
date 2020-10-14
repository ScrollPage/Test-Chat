import styled from 'styled-components';

export const StyledAvatarMenu = styled.div`
    position: absolute;
    background-color: white;
    border: 1px solid #f0f0f0;
    right: 0;
    bottom: -78px;
    display: flex;
    flex-direction: column;
    > div {
        padding: 10px 15px;
        &:first-of-type {
            margin-bottom: 0px;
        }
        &:last-of-type {
            color: black;
        }
    }
`;
