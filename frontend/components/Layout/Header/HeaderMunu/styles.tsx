import styled, { css } from 'styled-components';

export const StyledAvatarMenu = styled.div`
    -ms-user-select: none;
    -moz-user-select: none;
    -khtml-user-select: none;
    -webkit-user-select: none;
    position: absolute;
    background-color: white;
    border: 1px solid #f0f0f0;
    right: 0;
    bottom: -78px;
    display: flex;
    flex-direction: column;
    /* z-index: 9; */
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

export const StyledBackDrop = styled.div`
    z-index: -1;
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    cursor: default;
`;

export const StyledHeaderMenu = styled.div<{ menuOpen: boolean }>`
    cursor: pointer;
    .styled-avatar__container {
        visibility: ${({ menuOpen }) => menuOpen ? 'visible' : 'hidden' };
        transform: ${({ menuOpen }) => menuOpen ? 'translateY(10px)' : 'translateY(20px)' };
        opacity: ${({ menuOpen }) => menuOpen ? '1' : '0' };
        transition: all 0.4s ease;
        position: relative;
    }
`;