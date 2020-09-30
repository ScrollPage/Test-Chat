import React from 'react';
import { Input, Button } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import styled from 'styled-components';

interface IChatInput {
    sendMessage: (e: React.FormEvent<HTMLFormElement>) => void;
    messageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    message: string;
}

const ChatInput: React.FC<IChatInput>= ({ sendMessage, messageChange, message }) => {
    return (
        <StyledChatInput>
            <form onSubmit={sendMessage}>
                <StyledChatInputInner>
                    <div>
                        <Input onChange={e => messageChange(e)} value={message} />
                    </div>
                    <div>
                        <Button htmlType="submit">
                            <SendOutlined />
                        </Button>
                    </div>
                </StyledChatInputInner>
            </form>
        </StyledChatInput>
    );
};

export default ChatInput;

const StyledChatInput = styled.div`
    z-index: 1;
    background: white;
    border-top: 1px solid #f0f0f0;
    position: sticky;
    bottom: 0;
    width: 100%;
    height: 70px;
    padding: 10px;
    > form {
        height: 100%;
    }
`;

const StyledChatInputInner = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    > div {
        display: flex;
        align-items: center;
        &:first-of-type {
            flex: 1;
            margin-right: 10px;
        }
    }
`;
