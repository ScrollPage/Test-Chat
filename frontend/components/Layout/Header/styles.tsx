import styled from 'styled-components';

export const StyledHeader = styled.div`
    background: #1890ff;
    z-index: 2;
    position: fixed;
    width: 100%;
`;

export const StyledHeaderInner = styled.div`
    color: white;
    width: 100%;
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    > div {
        &:first-of-type {
            font-weight: 900;
            font-size: 18px;
            display: flex;
            flex: 1;
        }
    }
    .styled-avatar__arrow {
        margin-top: 3px;
        margin-left: 10px;
        display: inline-block;
    }
`;

export const StyledAvatar = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    height: 100%;
    cursor: pointer !important;
    .header-avatar {
        margin-right: 10px;
    }
    @media (max-width: 500px) {
        p {
            display: none;
        }
    }
    p {
        margin-bottom: 0px;
    }
`;