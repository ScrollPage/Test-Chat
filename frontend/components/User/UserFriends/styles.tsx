import styled, { css } from 'styled-components';

export const StyledUserFriends = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    padding-bottom: 10px;
    width: 200px !important;
    margin-left: -10px;
`;

export const StyledUserFriend = styled.div<{ end?: number }>`
    display: contents;
    .user-friends__avatar {
        width: 25px;
        height: 25px;
    }
    ${({ end }) =>
        end === 1 &&
        css`
            &::after {
                content: '';
                width: 100%;
            }
        `}
`;
