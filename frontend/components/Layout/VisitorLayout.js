import React from 'react';
import styled from 'styled-components';

const VisitorLayout = ({ children }) => {
    return <StyledMain>{children}</StyledMain>;
};

export default VisitorLayout;

const StyledMain = styled.div`
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
`;
