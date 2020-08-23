import React from 'react';
import styled from 'styled-components';

const PublicLayout = ({children}) => {
  return (
    <StyledPublicLayout>
      <div className="public-layout__header">Scroll Chat</div>
      {children}
    </StyledPublicLayout>
  )
}

export default PublicLayout;

const StyledPublicLayout = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 100px;
  position: relative;
  .public-layout__header {
    position: absolute;
    top: 35px;
    font-weight: 900;
    font-size: 18px;
    color: #1890ff;
  } 
`;
