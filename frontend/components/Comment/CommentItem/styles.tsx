import styled from 'styled-components';

export const StyledCommentItemChildren = styled.div`
  display: flex;
`;

export const StyledCommentItem = styled.div`
  display: flex;
  padding: 10px 0;
  position: relative;
  flex: 1;
  .comment {
    &__close {
      position: absolute;
      right: 5px;
      top: 5px;
      cursor: pointer;
      font-size: 10px;
    }
    &__avatar {
      margin-right: 10px;
    }
    &__inner {
      display: flex;
      flex-direction: column;
      h4 {
        margin-bottom: 0;
        margin-top: -4px;
      }
      small {
        &:first-of-type {
          margin-right: 10px;
          opacity: 0.6;
        }
        &:last-of-type {
          font-weight: 600;
          cursor: pointer;
        }
      }
    }
  }
`;
