import styled from 'styled-components';

export const StyledAddConversationModal = styled.div`
    display: flex;
    flex-direction: column;
    .add-conversation-modal {
        &__header {
            border-bottom: 1px solid #f0f0f0;
            margin-bottom: 20px;
        }
        &__avatar {
            display: flex;
            align-items: center;
        }
        &__name {
            margin-left: 10px;
        }
        &__item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
        }
        &__checkbox {
            display: flex;
            align-items: center;
        }
        &__submit {
          margin-top: 30px;
          display: flex;
          justify-content: center;
        }
    }
`;
