import styled, {css} from 'styled-components';

export const Container = styled.div`
    flex-grow: 1;
    margin: 0 auto;
    padding: 0 15px;
    position: relative;
    height: 100%;
    @media (min-width: 575.98px) {
        max-width: 540px;
        padding: 0px;
    }
    @media (min-width: 767.98px) {
        max-width: 720px;
    }
    @media (min-width: 991.98px) {
        max-width: 960px;
    }
    @media (min-width: 1199.98px) {
        max-width: 1140px;
    }
    ${props => props.fluid && css`
        padding: 0px;
        margin: 0px;
        max-width: 100% !important;
    `}
`;