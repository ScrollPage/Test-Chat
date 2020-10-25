import styled from 'styled-components';

export const StyledDialog = styled.div`
    height: 60px;
    width: 100%;
    border-bottom: 1px solid #f0f0f0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .dialog-item {
        &__main {
          display: flex;
          align-items: center;
        }
        &__unread {
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: red;
            border-radius: 50%;
            height: 16px;
            width: 16px;
            margin-right: 10px;
            margin-top: 4px;
            span {
                transform: translateY(-1px);
                color: #fff;
            }
        }
    }
`;
