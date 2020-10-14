import styled from 'styled-components';

export const StyledSearch = styled.div`
    width: 100%;
    height: 60px;
    border-bottom: 1px solid #f0f0f0;
    display: flex;
    align-items: center;
    > div {
        &:first-of-type {
            margin: 0 20px 0 10px;
        }
        &:last-of-type {
            flex: 1;
        }
    }
`;
