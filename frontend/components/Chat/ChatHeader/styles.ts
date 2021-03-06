import styled from 'styled-components';

export const StyledChatHeader = styled.div`
z-index: 1;
background: white;
position: sticky;
top: 0px;
width: 100%;
height: 60px;
padding: 10px;
border-bottom: 1px solid #f0f0f0;
display: flex;
justify-content: space-between;
align-items: center;
@media (max-width: 575.98px) {
    padding-top: 0px;
    padding-right: 0;
}
.chat-header {
    &__nav {
        width: 100%;
        cursor: pointer !important;
        height: 100%;
        display: flex;
        align-items: center;
        > div {
            &:first-of-type {
                margin-right: 10px;
            }
        }
    }
    &__right {
        display: flex;
    }
    &__plus {
        display: flex;
        align-items: center;
        margin-right: 20px;
        > span {
            cursor: pointer;
        }
    }
}
`;
