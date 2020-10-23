import styled from 'styled-components';

export const NavLink = styled.a<{ active: boolean }>`
    color: ${({ active }) => (active ? '#1890ff' : 'black')};
    display: flex;
    padding: 20px 20px 20px 0;
    opacity: 0.6;
    position: relative;
    @media (max-width: 575.98px) {
        padding-left: 5px;
    }
    > div {
        &:first-of-type {
            margin-right: 20px;
            @media (max-width: 575.98px) {
                margin: 0;
            }
        }
    }
    .nav-link__dialogs {
        position: absolute;
        bottom: 10px;
        left: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: red;
        border-radius: 50%;
        height: 16px;
        width: 16px;
        span {
            transform: translateY(-1px);
            color: #fff;
        }
    }
    .nav-link__name {
        @media (max-width: 575.98px) {
            display: none;
        }
    }
`;

export const StyledNavbar = styled.div`
    width: 160px;
    position: fixed;
    height: 100%;
    border-right: 1px solid #f0f0f0;
    display: flex;
    flex-direction: column;
    .ant-menu {
        border: none;
    }
    @media (max-width: 575.98px) {
        width: auto;
    }
`;
