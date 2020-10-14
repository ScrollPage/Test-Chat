import styled, { css } from 'styled-components';

export const StyledUserAvatar = styled.div<{ isHover: boolean }>`
margin-right: 20px;
> div {
  background-color: #f4f4f4;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  flex-direction: column;
  p {
    margin-top: 10px;
  }
}
.user-avatar {
  &__image {
    position: relative;
    img {
      height: 200px;
    }
    ${props =>
      props.isHover &&
      css`
        &:hover {
          .user-avatar__hover {
            display: block;
          }
        }
      `}
  }
  &__hover {
    display: none;
    position: absolute;
    bottom: 0px;
    left: 0;
    width: 100%;
    text-align: center;
    background: #000;
    color: #fff;
    padding: 10px 0;
    opacity: 0.7;
    cursor: pointer;
  }
}
@media (max-width: 900px) {
  margin-right: 0px;
}
`;
