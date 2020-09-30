import React, { useState } from 'react';
import UserPost from './UserPost';
import PostCreate from './PostCreate';
import Modal from '@/components/Modal/Modal';
import { addLike, removeLike } from '@/store/actions/post';
import { addPost, rePost, deletePost } from '@/store/actions/post';
import { useDispatch } from 'react-redux';
import useSWR, { mutate } from 'swr';
import DeletePostModal from '@/components/Modal/DeleteModal';
import { IPost, IPostParent } from '@/types/post';
import { IUser } from '@/types/user';

interface IUserPosts {
    serverPosts: IPost[];
    pageUserId: number;
    user: IUser;
}

const UserPosts: React.FC<IUserPosts> = ({ serverPosts, pageUserId, user }) => {
    const {
        data: posts = [],
        mutate: postsMutate,
    } = useSWR<IPost[]>(`/api/v1/post/?id=${pageUserId}`, { initialData: serverPosts });

    const dispatch = useDispatch();

    const [isOpen, setIsOpen] = useState(false);
    const [parent, setParent] = useState<IPostParent | null>(null);
    const [isDeletePost, setIsDeletePost] = useState(false);
    const [deletePostId, setDeletePostId] = useState<number | null>(null);

    const setIsOpenHandler = (parent: IPostParent): void => {
        setIsDeletePost(false);
        setIsOpen(true);
        setParent(parent);
    };

    const setIsDeletePostHandler = (postId: number): void => {
        setIsDeletePost(true);
        setIsOpen(true);
        setDeletePostId(postId);
    };

    const likeMutate = (postId: number): void => {
        const index = posts.findIndex(post => post.id === postId);
        let newPosts = [...posts];
        if (posts[index].is_liked) {
            newPosts[index] = {
                ...posts[index],
                is_liked: false,
                num_likes: posts[index].num_likes - 1,
            };
            postsMutate(newPosts, false);
            dispatch(removeLike(postId));
        } else {
            newPosts[index] = {
                ...posts[index],
                is_liked: true,
                num_likes: posts[index].num_likes + 1,
            };
            postsMutate(newPosts, false);
            dispatch(addLike(postId));
        }
    };

    const addPostMutate = (isRepost: boolean, newPost: string, mutatedImage: any, image: any): void => {
        const triggerUrl = `/api/v1/post/?id=${pageUserId}`;
        let newPosts;
        let addNewPost: IPost = {
            id: 0,
            image: mutatedImage,
            is_liked: false,
            is_watched: false,
            num_likes: 0,
            num_reposts: 0,
            num_reviews: 0,
            parent: null,
            text: newPost,
            user: {
                id: user.userId,
                first_name: user.firstName,
                last_name: user.lastName,
                avatar: null
            },
            group_owner: null,
            num_comments: 0,
            compressed_image: null
        };
        if (isRepost) {
            if (parent) {
                if (pageUserId === user.userId) {
                    addNewPost.parent = {
                        id: parent.id,
                        text: parent.text,
                        image: parent.image,
                        user: {
                            id: parent.user.id,
                            first_name: parent.user.first_name,
                            last_name: parent.user.last_name,
                            avatar: null
                        },
                        parent: null,
                        compressed_image: null
                    };
                    newPosts = [addNewPost, ...posts];
                    postsMutate(newPosts, false);
                    console.log('repost mutate');
                }
                dispatch(rePost(newPost, image, parent.id, triggerUrl));
                setIsOpen(false);
            }
        } else {
            newPosts = [addNewPost, ...posts];
            postsMutate(newPosts, false);
            console.log('post mutate');
            dispatch(addPost(newPost, image, pageUserId, triggerUrl));
        }
    };

    const deletePostMutate = (): void => {
        setIsOpen(false);
        if (deletePostId) {
            postsMutate(posts.filter(post => post.id !== deletePostId), false);
            dispatch(deletePost(deletePostId));
        }
    };

    const renderPosts = (posts: Array<IPost>) => {
        return posts.map((post, index) => (
            <UserPost
                key={`post__key__${index}`}
                user={user}
                post={post}
                likeMutate={likeMutate}
                setIsOpenHandler={setIsOpenHandler}
                setIsDeletePostHandler={setIsDeletePostHandler}
                pageUserId={pageUserId}
                
            />
        ));
    };

    return (
        <>
            {posts && (
                <>
                    <Modal isOpen={isOpen} setIsOpen={setIsOpen}>
                        {isDeletePost ? (
                            <DeletePostModal
                                deletePostMutate={deletePostMutate}
                            />
                        ) : (
                            <PostCreate
                                addPostMutate={addPostMutate}
                                isRepost={true}
                            />
                        )}
                    </Modal>
                    <PostCreate
                        addPostMutate={addPostMutate}
                        isRepost={false}
                    />
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
            )}
        </>
    );
};

export default UserPosts;
