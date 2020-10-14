import React from 'react';
import { StyledMain } from './styles';

interface IVisitorLayout {
    children: React.ReactNode;
} 

const VisitorLayout: React.FC<IVisitorLayout> = ({ children }) => {
    return <StyledMain>{children}</StyledMain>;
};

export default VisitorLayout;

