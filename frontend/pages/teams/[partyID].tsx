import { IUser } from '@/types/user';
import { getAsString, getUserFromServer } from '@/utils/index';
import styled from 'styled-components';
import PrivateLayout from '@/components/Layout/PrivateLayout';
import { GetServerSideProps } from 'next';
import { instanceWithSSR } from '@/api/api';
import { IParty } from '@/types/party';
import useSWR from 'swr';
import PeopleList from '@/components/Team/TeamList';
import Link from 'next/link';
import PartyHeader from '@/components/Team/TeamHeader';

interface IPartyFC {
  user: IUser;
  party?: IParty;
  partyId?: number;
}

export default function Party({ user, party, partyId }: IPartyFC) {
  const { data } = useSWR(`/api/v1/group/${partyId}/`, { initialData: party });

  console.log(data)

  // const renderPosts = (posts: Array<IPost>) => {
  //   return posts.map(post => (
  //     <UserPost key={`post__key__${post.id}`} user={user} post={post} />
  //   ));
  // };

  return (
    <PrivateLayout user={user}>
      <StyledParty>
        {data ? (
          <PartyHeader
            groupName={data.name}
            isJoined={data.joined}
            groupImage={data.image}
            partyId={partyId}
          />
        ) : (
          <h4>Загрузка...</h4>
        )}
        <div className="party__main">
          <div className="party__posts">Тут будут посты</div>
          {data ? (
            <div className="party__right">
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
                <PeopleList
                  people={data.members}
                />
              </div>
            </div>
          ) : (
            <h4>Загрузка...</h4>
          )}
        </div>
      </StyledParty>
    </PrivateLayout>
  );
}

export const getServerSideProps: GetServerSideProps<IPartyFC> = async ctx => {
  const partyId = getAsString(ctx?.params?.partyID);

  let party: IParty | undefined = undefined;

  // let posts: Array<IPost> = [];

  await instanceWithSSR(ctx)
    .get(`/api/v1/group/${partyId}/`)
    .then(response => {
      party = response?.data;
    })
    .catch(error => {
      console.log(error);
    });

  // await instanceWithSSR
  //   .get(`/api/v1/group/accept/${partyId}/`)
  //   .then(response => {
  //     posts = response?.data;
  //   })
  //   .catch(error => {
  //     console.log(error);
  //   });

  return {
    props: {
      user: getUserFromServer(ctx),
      party,
      partyId: Number(partyId),
    },
  };
};

const StyledParty = styled.div`
  margin: 20px 0;
  .party {
    &__main {
      display: flex;
    }
    &__posts {
      /* max-width: 500px; */
      flex: 0 1 500px;
    }
    &__right {
      display: flex;
      flex-direction: column;
      flex: 1 1 auto;
      /* margin-left: 20px; */
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
  }
`;
