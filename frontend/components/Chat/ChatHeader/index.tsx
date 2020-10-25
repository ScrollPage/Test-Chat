import React from 'react';
import { StyledChatHeader } from './styles';
import { PlusOutlined, LeftOutlined } from '@ant-design/icons';
import Link from 'next/link';
import ImageLink from '../../UI/Image/LoadImage';
import { IChatInfo } from '@/types/chat';
import { useDispatch } from 'react-redux';
import { IAddConversationModalProps } from '@/components/Modal/ModalInner/AddConversationModal';
import { modalShow } from '@/store/actions/modal';

interface IChatHeader {
    chatInfo: IChatInfo;
}

const ChatHeader: React.FC<IChatHeader> = ({ chatInfo }) => {

    const dispatch = useDispatch();

    const openModalHandler = () => {
        dispatch(
            modalShow<IAddConversationModalProps>('ADD_CONVERSATION_MODAL', {})
        );
    }

    return (
        <StyledChatHeader>
            <Link href="/dialogs">
                <a>
                    <div className="chat-header__nav">
                        <div>
                            <LeftOutlined />
                        </div>
                        <div>Назад</div>
                    </div>
                </a>
            </Link>
            <div>{`${chatInfo.companion.first_name} ${chatInfo.companion.last_name}`}</div>
            <div className="chat-header__right" >
                <div className="chat-header__plus">
                    <PlusOutlined style={{fontSize: '18px'}} onClick={openModalHandler} />
                </div>
                <ImageLink
                    src={chatInfo.companion.small_avatar}
                    href="/userpage/[userID]" 
                    as={`/userpage/${chatInfo.companion.id}`}
                />
            </div>
        </StyledChatHeader>
    );
};

export default ChatHeader;
