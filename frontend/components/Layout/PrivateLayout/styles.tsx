import styled from 'styled-components';

export const StyledMain = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    padding-top: 60px;
    @media (max-width: 575.98px) {
        padding-top: 70px;
    }
    .private-layout__main {
        margin-left: 180px;
        @media (max-width: 575.98px) {
            margin-left: 55px;
        }
    }
`;
