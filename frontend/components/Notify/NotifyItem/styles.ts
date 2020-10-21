import styled from 'styled-components';

export const StyledNotifyItem = styled.div`
  display: flex;
  padding: 10px 0;
  justify-content: flex-start;
  border-bottom: 1px solid #f0f0f0;
  .notify-item {
    &__avatar {
      margin-right: 5px;
    }
    &__message {
      display: flex;
      align-items: center;
      p {
        margin-bottom: 0;
      }
    }
  }
`;