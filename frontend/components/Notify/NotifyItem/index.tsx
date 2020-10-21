import LinkImage from '@/components/UI/Image/LinkImage';
import { IPostUser } from '@/types/post';
import Link from 'next/link';
import React from 'react';
import { StyledNotifyItem } from './styles';

interface INotifyItem {
    sender: IPostUser;
    event: 1 | 2 | 3 | 4 | 5;
}

const NotifyItem: React.FC<INotifyItem> = ({ sender, event }) => {
    const renderKindOfNotify = (event: number, name: string, id: number) => {
        let message = '';
        switch (event) {
            case 1:
                message = 'отправил/a вам сообщение';
                break;
            case 2:
                message = 'хочет добавить вас в друзья';
                break;
            case 3:
                message = 'принял/а вашу заявку в друзья';
                break;
            case 4:
                message = 'лайкнул/а что-то ваше';
                break;
            case 5:
                message = 'репостнул/а вашу запись';
                break;
        }
        return (
            <>
                <Link href="/userpage/[userID]" as={`/userpage/${id}`}>
                    <a>{name}&nbsp;</a>
                </Link>
                {message}
            </>
        );
    };

    return (
        <StyledNotifyItem>
            <div className="notify-item__avatar">
                <LinkImage
                    href="/userpage/[userID]"
                    as={`/userpage/${sender.id}`}
                    src={sender.small_avatar}
                />
            </div>
            <div className="notify-item__message">
                <p>
                    {renderKindOfNotify(
                        event,
                        `${sender.first_name} ${sender.last_name}`,
                        sender.id
                    )}
                </p>
            </div>
        </StyledNotifyItem>
    );
};

export default NotifyItem;
