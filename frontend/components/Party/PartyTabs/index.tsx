import React, { useState } from 'react';
import { Tabs } from 'antd';
import Posts from '@/components/Post/Posts';
import { IUser } from '@/types/user';
import { IGroupOwner, IPost } from '@/types/post';
import { StyledPartyTabs } from './styles';
import OfferPosts from '@/components/Post/OfferPosts';
const { TabPane } = Tabs;

interface IPartyTabs {
    user: IUser;
    posts?: IPost[];
    partyId?: number;
    isAdmin?: boolean;
    partyOwner: IGroupOwner;
}

const PartyTabs: React.FC<IPartyTabs> = ({
    user,
    posts,
    partyId,
    partyOwner,
    isAdmin
}) => {

    const [activeKey, setActiveKey] = useState('1');

    return (
        <StyledPartyTabs>
            <Tabs activeKey={activeKey} onChange={(key) => setActiveKey(key)} >
                <TabPane tab="Записи сообщества" key="1">
                    <Posts serverPosts={posts} user={user} partyId={partyId} partyOwner={partyOwner} isOffer={!isAdmin} />
                </TabPane>
                <TabPane tab="Предложенные" key="2" forceRender={true} >
                    <OfferPosts isAdmin={isAdmin} user={user} partyId={partyId} />
                </TabPane>
            </Tabs>
        </StyledPartyTabs>
    );
};

export default PartyTabs;
