import styled from 'styled-components';

export const StyledCommentInput = styled.div`
  margin: 10px 0 20px 0;
  .comment__inner {
    display: flex;
    > div {
      &:first-of-type {
        margin-right: 20px;
        flex: 1;
      }
    }
  }
`;