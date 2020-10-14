import React from 'react';
import { HeartOutlined, HeartTwoTone } from '@ant-design/icons';
import { mutate } from 'swr';
import { IPost } from '@/types/post';
import { useDispatch } from 'react-redux';
import { addPostLike, removePostLike } from '@/store/actions/post';
import { StyledLike } from './styles';
import { whereAreThePostLink } from '@/utils';

interface ILike {
    isTap: boolean;
    postId: number;
    pageUserId?: number;
    partyId?: number;
}

const Like: React.FC<ILike> = ({ isTap, postId, pageUserId, partyId }) => {
    const dispatch = useDispatch();

    const likeMutate = (postId: number): void => {
        const postUrl = whereAreThePostLink(pageUserId, partyId);
        mutate(
            postUrl,
            async (posts: IPost[]) => {
                if (posts) {
                    const index = posts.findIndex(post => post.id === postId);
                    let newPosts = [...posts];
                    if (posts[index].is_liked) {
                        newPosts[index] = {
                            ...posts[index],
                            is_liked: false,
                            num_likes: posts[index].num_likes - 1,
                        };
                        dispatch(removePostLike(postId));
                        return newPosts;
                    } else {
                        newPosts[index] = {
                            ...posts[index],
                            is_liked: true,
                            num_likes: posts[index].num_likes + 1,
                        };
                        dispatch(addPostLike(postId));
                        return newPosts;
                    }
                }
            },
            false
        );
    };

    return (
        <StyledLike onClick={() => likeMutate(postId)}>
            {isTap ? (
                <HeartTwoTone
                    twoToneColor="#eb2f96"
                    style={{ fontSize: '23px' }}
                />
            ) : (
                <HeartOutlined style={{ fontSize: '23px' }} />
            )}
        </StyledLike>
    );
};

export default Like;
