import styled from 'styled-components';

export const StyledFriendItem = styled.div`
  padding: 10px 0;
  width: 100%;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  > div {
    :first-of-type {
      margin-right: 30px;
    }
    :last-of-type {
      height: 80px;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      h4 {
        font-weight: bold;
        opacity: 0.8;
        margin-top: 0;
      }
    }
  }
`;


