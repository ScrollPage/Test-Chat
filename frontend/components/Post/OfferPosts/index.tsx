import React from 'react';
import PostItem from '../PostItem';
import useSWR from 'swr';
import { IPost } from '@/types/post';
import { IUser } from '@/types/user';
import Loading from '@/components/UI/Loading';

interface IOfferPosts {
    user: IUser;
    partyId?: number;
    isAdmin?: boolean;
}

const OfferPosts: React.FC<IOfferPosts> = ({ user, partyId, isAdmin }) => {
    const { data: posts } = useSWR<IPost[]>(`/api/v1/group/offer/${partyId}/`);

    const renderPosts = (posts: Array<IPost>) => {
        return posts.map(post => (
            <PostItem
                key={`post__key__${post.id}`}
                user={user}
                post={post}
                partyId={partyId}
                isOffer={true}
                isAdmin={isAdmin}
            />
        ));
    };

    return (
        <>
            <div>
                {posts ? (
                    posts.length === 0 ? (
                        <div>
                            <h2>Нет предложенных постов</h2>
                        </div>
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
