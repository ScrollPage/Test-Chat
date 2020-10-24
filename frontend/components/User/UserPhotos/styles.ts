import styled from 'styled-components';

export const StyledUserPhotos = styled.div`
  background-color: #f4f4f4;
  display: flex;
  flex-direction: column;
  padding: 20px;
  .user-photos {
    &__items {
      display: flex;
      justify-content: center;
    }
    &__item {
      background-color: #fff;
      height: 100px;
      width: 100px;
      margin-left: 10px;
      position: relative;
      cursor: pointer;
      img {
        position: absolute;
        top: 50%;
        left: 50%;
        margin-right: -50%;
        max-height: 100px;
        max-width: 100px;
        transform: translate(-50%, -50%)
      }
      &:first-of-type {
        margin-left: 0px;
      }
      @media (max-width: 991.98px) {
        &:last-of-type {
          display: none;
        }
      }
      @media (max-width: 455px) {
        &:nth-child(3) {
          display: none;
        }
      }
    }
  }
  margin-bottom: 20px;
`;