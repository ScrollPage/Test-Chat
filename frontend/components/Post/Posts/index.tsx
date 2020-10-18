import React from 'react';
import PostItem from '../PostItem';
import PostCreate from '../PostCreate';
import useSWR from 'swr';
import { IGroupOwner, IPost } from '@/types/post';
import { IUser } from '@/types/user';
import { whereAreThePostLink } from '@/utils';

interface IPosts {
    serverPosts?: IPost[];
    pageUserId?: number;
    user: IUser;
    partyId?: number;
    isOffer?: boolean;
    partyOwner?: IGroupOwner;
}

const Posts: React.FC<IPosts> = ({
    serverPosts,
    pageUserId,
    user,
    partyId,
    partyOwner,
    isOffer
}) => {
 
    const { data: posts = [] } = useSWR<IPost[]>(whereAreThePostLink(pageUserId, partyId), {
        initialData: serverPosts,
    });

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
            <PostCreate isRepost={false} pageUserId={pageUserId} user={user} partyId={partyId} partyOwner={partyOwner} isOffer={isOffer} />
            <div style={{ marginTop: '20px' }}>
                {posts ? (
                    posts.length === 0 ? (
                        <h2>Нет постов</h2>
                    ) : (
                        renderPosts(posts)
                    )
                ) : (
                    'Загрузка'
                )}
            </div>
        </>
    );
};

export default Posts;
