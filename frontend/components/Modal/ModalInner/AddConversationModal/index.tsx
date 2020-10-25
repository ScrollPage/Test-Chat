import LinkImage from '@/components/UI/Image/LinkImage';
import { createConversation } from '@/store/actions/friend';
import { IGlobalUser } from '@/types/people';
import { Button, Checkbox } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import useSWR from 'swr';
import { StyledAddConversationModal } from './styles';

export interface IAddConversationModalProps {
}

interface IAddConversationModal extends IAddConversationModalProps {
    setClose: () => void;
}

const AddConversationModal: React.FC<IAddConversationModal> = ({
    setClose,
}) => {
    const { data: friends } = useSWR('/api/v1/friends/');

    const dispatch = useDispatch();

    const [chosenFriends, setChosenFriends] = useState<number[]>([]);
    const [disable, setDisable] = useState(true);

    useEffect(() => {
        if (chosenFriends.length > 1) {
            setDisable(false);
        } else {
            setDisable(true);
        }
    }, [chosenFriends]);

    const onChange = (friendId: number) => {
        if (chosenFriends.includes(friendId)) {
            setChosenFriends(state => state.filter(item => item !== friendId));
        } else {
            setChosenFriends(state => [...state, friendId]);
        }
    };

    const onSubmit = () => {
        dispatch(createConversation(chosenFriends))
        setClose();
    }

    const renderFriends = (friends: IGlobalUser[]) => {
        return friends.map((friend, index) => (
            <div
                className="add-conversation-modal__item"
                key={`friend-conversation__key__${friend.id}__${index}`}
            >
                <div className="add-conversation-modal__avatar">
                    <LinkImage
                        href="/userpage/[userID]"
                        as={`/userpage/${friend.id}`}
                        size={'40'}
                        src={friend.small_avatar}
                        isCircle={true}
                    />
                    <div className="add-conversation-modal__name">
                        {`${friend.first_name} ${friend.last_name}`}
                    </div>
                </div>
                <div className="add-conversation-modal__checkbox">
                    <Checkbox onChange={() => onChange(friend.id)} />
                </div>
            </div>
        ));
    };

    return (
        <StyledAddConversationModal>
            <div className="add-conversation-modal__header">
                <h2>Выберите участников:</h2>
            </div>
            {friends ? (
                friends.length !== 0 ? (
                    renderFriends(friends)
                ) : (
                    <h3>У вас нет друзей</h3>
                )
            ) : (
                <h3>Загрузка...</h3>
            )}
            <div className="add-conversation-modal__submit">
                <Button onClick={onSubmit} htmlType="submit" type="primary" disabled={disable}>
                    Создать беседу
                </Button>
            </div>
        </StyledAddConversationModal>
    );
};

export default AddConversationModal;
