import styled, { css } from 'styled-components';

export const StyledUserFriends = styled.div`
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    padding-bottom: 10px;
    width: 200px !important;
    margin-left: -10px;
`;

export const StyledUserFriend = styled.div<{ end?: boolean }>`
    display: contents;
    .user-friends__avatar {
        width: 25px;
        height: 25px;
    }
    ${({ end }) =>
        end &&
        css`
            &::after {
                content: '';
                width: 100%;
            }
        `}
`;
