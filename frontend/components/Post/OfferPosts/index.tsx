import React from 'react';
import PostItem from '../PostItem';
import useSWR from 'swr';
import { IPost } from '@/types/post';
import { IUser } from '@/types/user';
import Loading from '@/components/UI/Loading';

interface IOfferPosts {
    pageUserId?: number;
    user: IUser;
    partyId?: number;
}

const OfferPosts: React.FC<IOfferPosts> = ({ pageUserId, user, partyId }) => {
    const { data: posts } = useSWR<IPost[]>(`/api/v1/group/offer/${partyId}/`);

    const renderPosts = (posts: Array<IPost>) => {
        return posts.map(post => (
            <PostItem
                key={`post__key__${post.id}`}
                user={user}
                post={post}
                pageUserId={pageUserId}
                partyId={partyId}
            />
        ));
    };

    return (
        <>
            <div>
                {posts ? (
                    posts.length === 0 ? (
                        <h2>Нет постов</h2>
                    ) : (
                        renderPosts(posts)
                    )
                ) : (
                    <div style={{ width: '100%', height: '200px' }}>
                        <Loading />
                    </div>
                )}
            </div>
        </>
    );
};

export default OfferPosts;
