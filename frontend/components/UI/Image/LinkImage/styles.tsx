import styled, { css } from 'styled-components';

export const StyledLinkImage = styled.div<{size?: string, isCircle?: boolean}>`
  position: relative;
  ${props =>
      props.size &&
      css`
          height: ${props.size}px;
          width: ${props.size}px;
      `}
  img {
      height: 100%;
  }
  ${props =>
      props.isCircle &&
      css`
          border-radius: 50%;
          overflow: hidden;
      `}
`;
