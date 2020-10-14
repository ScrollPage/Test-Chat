import styled from 'styled-components';

export const StyledLoading = styled.div`
    height: 100%;
    width: 100%;
    position: relative;
    > div {
        position: absolute;
        top: 50%;
        left: 50%;
        margin-top: -15px;
        margin-left: -15px;
    }
`;
