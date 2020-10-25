import Head from 'next/head';
import React from 'react';
import styled from 'styled-components';
import { GetServerSideProps } from 'next';
import { ensureAuth, getAsString, getUserFromServer } from '@/utils';
import { IUser } from '@/types/user';
import Error from 'next/error';
import { instanceWithSSR } from '@/api/api';
import { IParty } from '@/types/party';
import PrivateLayout from '@/components/Layout/PrivateLayout';
import PartyChangeInfo from '@/components/Party/PartyChangeInfo';
import { Tabs } from 'antd';
import PartyChangeMembers from '@/components/Party/PartyChangeMembers';
const { TabPane } = Tabs;

interface ITeamChange {
    user: IUser;
    partyId: number | null;
    party: IParty | null;
}

const TeamsChange = ({ user, party, partyId }: ITeamChange) => {
    if (party?.admin.id !== user.userId) {
        return <Error statusCode={404} />;
    }

    return (
        <PrivateLayout user={user}>
            <Head>
                <title>Сообщества</title>
            </Head>
            <StyledTeamChange>
                <div className="team-change">
                    <h3>Сменить данные сообщества</h3>
                </div>
                <Tabs defaultActiveKey="info">
                    <TabPane tab="Информация" key="info">
                        {party && (
                            <PartyChangeInfo
                                name={party.name}
                                info={party.info}
                                partyId={partyId}
                            />
                        )}
                    </TabPane>
                    <TabPane tab="Участники" key="members">
                        {party && (
                            <PartyChangeMembers
                                party={party}
                                partyId={partyId}
                            />
                        )}
                    </TabPane>
                </Tabs>
            </StyledTeamChange>
        </PrivateLayout>
    );
};

export default TeamsChange;

export const getServerSideProps: GetServerSideProps<ITeamChange> = async ctx => {
    ensureAuth(ctx);
    const partyId = getAsString(ctx?.params?.partyID);

    let party: IParty | null = null;

    await instanceWithSSR(ctx)
        .get(`/api/v1/group/${partyId}/`)
        .then(response => {
            party = response?.data;
        })
        .catch(error => {
            console.log(error);
        });

    return {
        props: {
            user: getUserFromServer(ctx),
            partyId: Number(partyId) || null,
            party: party || null,
        },
    };
};

const StyledTeamChange = styled.div`
    margin: 50px auto;
    @media (max-width: 575.98px) {
        margin: 20px auto;
    }
    .change__top {
        margin-bottom: 1.5rem;
    }
    .ant-btn {
        width: 100%;
    }
    width: 100%;
    max-width: 400px;
    .team-change {
        h3 {
            text-align: center;
        }
        margin-bottom: 20px;
    }
`;
