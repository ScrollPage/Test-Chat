import styled from 'styled-components';

export const StyledNotify = styled.div`
    position: relative;
    a {
        outline: none;
        text-decoration: none;
        color: #fff;
    }
    .notify {
        &__count {
            position: absolute;
            bottom: -6px;
            left: -6px;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: red;
            border-radius: 50%;
            height: 16px;
            width: 16px;
            span {
                transform: translateY(-1.5px);
            }
        }
    }
`;
