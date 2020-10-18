import { IChangeAvatarModalProps } from '@/components/Modal/ModalInner/ChangeAvatarModal';
import LinkImage from '@/components/UI/Image/LinkImage';
import { modalShow } from '@/store/actions/modal';
import { joinGroup } from '@/store/actions/teams';
import { IParty } from '@/types/party';
import { Button } from 'antd';
import React from 'react';
import { useDispatch } from 'react-redux';
import { mutate } from 'swr';
import { StyledPartyHeader } from './styles';

interface IPartyHeader {
    groupName: string;
    isJoined: boolean;
    groupImage?: string;
    partyId?: number;
    isAdmin: boolean;
    userId?: number;
}

const PartyHeader: React.FC<IPartyHeader> = ({
    groupName,
    isJoined,
    groupImage,
    partyId,
    isAdmin,
    userId,
}) => {
    const dispatch = useDispatch();

    const joinHandler = (isJoin: boolean) => {
        if (partyId) {
            const groupLink = `/api/v1/group/${partyId}/`;  
            mutate(groupLink, async (party: IParty) => {
                if (party) {
                    return {
                        ...party,
                        joined: isJoin,
                    };
                }
            });
            dispatch(joinGroup(partyId, !isJoin, groupLink));
        }
    };

    const changeAvatarHandler = () => {
        if (userId) {
            dispatch(
                modalShow<IChangeAvatarModalProps>('AVATAR_CHANGE_MODAL', {
                    userId,
                    partyId,
                })
            );
        }
    };

    return (
        <StyledPartyHeader isAdmin={isAdmin}>
            <div className="party-header__main">
                <div className="party-header__image">
                    <LinkImage
                        isCircle={true}
                        src={groupImage}
                        size={'60'}
                        isMedia={true}
                    />
                    <div
                        className="party-header__hover"
                        onClick={() => changeAvatarHandler()}
                    >
                        Сменить
                    </div>
                </div>
                <div className="party-header__name">
                    <h2>{groupName}</h2>
                </div>
            </div>
            <div className="party-header__joined">
                {isJoined ? (
                    <Button
                        onClick={() => joinHandler(false)}
                        type="primary"
                        danger
                        ghost
                    >
                        Отписаться
                    </Button>
                ) : (
                    <Button onClick={() => joinHandler(true)} type="primary">
                        Подписаться
                    </Button>
                )}
            </div>
        </StyledPartyHeader>
    );
};

export default PartyHeader;
