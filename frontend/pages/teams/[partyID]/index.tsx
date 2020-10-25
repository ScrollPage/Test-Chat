import Head from 'next/head';
import { IUser } from '@/types/user';
import { ensureAuth, getAsString, getUserFromServer } from '@/utils/index';
import styled from 'styled-components';
import PrivateLayout from '@/components/Layout/PrivateLayout';
import { GetServerSideProps } from 'next';
import { instanceWithSSR } from '@/api/api';
import { IParty } from '@/types/party';
import useSWR from 'swr';
import PeopleList from '@/components/Team/TeamList';
import Link from 'next/link';
import PartyHeader from '@/components/Party/PartyHeader';
import { IPost, IPostUser } from '@/types/post';
import PartyTabs from '@/components/Party/PartyTabs';
import { Button } from 'antd';
import { useRouter } from 'next/router';

interface IPartyFC {
    user: IUser;
    party?: IParty;
    partyId?: number;
    posts?: IPost[];
}

export default function Party({ user, party, partyId, posts }: IPartyFC) {
    const { data } = useSWR(`/api/v1/group/${partyId}/`, {
        initialData: party,
    });
    const { push } = useRouter();

    const isStaff = (staff: IPostUser[]) => {
        return staff.filter(item => item.id === user.userId).length > 0
    }

    return (
        <PrivateLayout user={user}>
            <Head>
                <title>Сообщества</title>
            </Head>
            {data ? (
                <StyledParty>
                    <PartyHeader
                        groupName={data.name}
                        isJoined={data.joined}
                        groupImage={data.image}
                        partyId={partyId}
                        isAdmin={data.admin.id === user.userId}
                        userId={user.userId}
                    />
                    <div className="party__main">
                        <div className="party__posts">
                            <PartyTabs
                                posts={posts}
                                user={user}
                                partyId={partyId}
                                partyOwner={{
                                    image: data.image,
                                    name: data.name,
                                    id: data.id,
                                }}
                                isAdmin={isStaff(data.staff) || data.admin.id === user.userId }
                            />
                        </div>
                        <div className="party__right">
                            <div className="party-right__inner">
                                <div className="party__info">
                                    <h4>О нас:</h4>
                                    <p>{data.info}</p>
                                    <h4>Создатель:</h4>
                                    <Link
                                        href={'/userpage/[userID]'}
                                        as={`/userpage/${data.admin.id}`}
                                    >
                                        <a>
                                            <p>{`${data.admin.first_name} ${data.admin.last_name}`}</p>
                                        </a>
                                    </Link>
                                </div>
                                <div className="party__members">
                                    <h4>Участники: ({data.num_members})</h4>
                                    <PeopleList people={data.members} />
                                </div>
                                {data.admin.id === user.userId && (
                                    <div className="party__change">
                                        <Button
                                            type="primary"
                                            onClick={() =>
                                                push(
                                                    '/teams/[partyID]/change',
                                                    `/teams/${partyId}/change`,
                                                    { shallow: true }
                                                )
                                            }
                                        >
                                            Управление
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </StyledParty>
            ) : (
                <h4>Загрузка...</h4>
            )}
        </PrivateLayout>
    );
}

export const getServerSideProps: GetServerSideProps<IPartyFC> = async ctx => {
    ensureAuth(ctx);
    const partyId = getAsString(ctx?.params?.partyID);

    let party: IParty | undefined = undefined;
    let posts: IPost[] | undefined = undefined;

    await instanceWithSSR(ctx)
        .get(`/api/v1/group/${partyId}/`)
        .then(response => {
            party = response?.data;
        })
        .catch(error => {
            console.log(error);
        });
    await instanceWithSSR(ctx)
        .get(`/api/v1/group/accept/${partyId}/`)
        .then(response => {
            posts = response?.data;
        })
        .catch(error => {
            console.log(error);
        });

    return {
        props: {
            user: getUserFromServer(ctx),
            posts,
            party,
            partyId: Number(partyId),
        },
    };
};

const StyledParty = styled.div`
    margin: 20px 0;
    @media (max-width: 575.98px) {
        margin-top: 0px;
    }
    .party {
        &__main {
            display: flex;
            @media (max-width: 991.98px) {
                flex-direction: column;
            }
        }
        &__posts {
            /* max-width: 500px; */
            flex: 0 1 500px;
            margin-right: 20px;
            @media (max-width: 991.98px) {
                order: 2;
                margin-top: 20px;
                margin-right: 0;
            }
        }
        &__right {
            display: flex;
            flex-direction: column;
            flex: 1;
            height: auto;
            @media (max-width: 991.98px) {
                order: 1;
            }
            /* margin-left: 20px; */
        }
        &-right__inner {
            position: sticky;
            top: 80px;
        }
        &__info {
            background-color: #f4f4f4;
            padding: 10px;
            align-items: center;
            display: flex;
            flex-direction: column;
        }
        &__members {
            background-color: #f4f4f4;
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-top: 20px;
            padding: 10px;
        }
        &__change {
            background-color: #f4f4f4;
            margin-top: 20px;
            padding: 10px;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }
`;
