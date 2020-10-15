import React from 'react';
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
    partyOwner: IGroupOwner;
}

const PartyTabs: React.FC<IPartyTabs> = ({
    user,
    posts,
    partyId,
    partyOwner,
}) => {
    const changeTab = (key: string) => {
        console.log(key);
    };

    return (
        <StyledPartyTabs>
            <Tabs defaultActiveKey="1" onChange={changeTab}>
                <TabPane tab="    Записи сообщества" key="1">
                    <Posts serverPosts={posts} user={user} partyId={partyId} partyOwner={partyOwner} />
                </TabPane>
                <TabPane tab="Предложенные посты" key="2">
                    <OfferPosts user={user} partyId={partyId} />
                </TabPane>
            </Tabs>
        </StyledPartyTabs>
    );
};

export default PartyTabs;
