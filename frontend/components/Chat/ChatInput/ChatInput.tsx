import React from 'react';
import { StyledChatInput, StyledChatInputInner } from './styles';
import { Input, Button } from 'antd';
import { SendOutlined } from '@ant-design/icons';

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
