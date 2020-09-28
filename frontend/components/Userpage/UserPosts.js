import React, { useState } from 'react';
import UserPost from './UserPost';
import PostCreate from './PostCreate';
import Modal from '@/components/Modal/Modal';
import { addLike, removeLike } from '@/store/actions/post';
import { addPost, rePost, deletePost } from '@/store/actions/post';
import { useDispatch } from 'react-redux';
import { mutate, trigger } from 'swr';
import DeletePostModal from '@/components/Modal/DeletePostModal';

const UserPosts = ({ posts, pageUserId, user }) => {
    const dispatch = useDispatch();

    const [isOpen, setIsOpen] = useState(false);
    const [parent, setParent] = useState(null);

    const [isDeletePost, setIsDeletePost] = useState(false);
    const [deletePostId, setDeletePostId] = useState(null);
    
    const setIsOpenHandler = (parent) => {
        setIsDeletePost(false);
        setIsOpen(true);
        setParent(parent);
    }

    const setIsDeletePostHandler = (postId) => {
        setIsDeletePost(true);
        setIsOpen(true);
        setDeletePostId(postId);
    }

    const likeMutate = (index, postId) => {
        const url = `/api/v1/post/?id=${pageUserId}`;
        let newPosts = [...posts];
        if (posts[index].is_liked) {
            newPosts[index] = { ...posts[index], is_liked: false, num_likes: posts[index].num_likes - 1 };
            mutate(url, newPosts, false);
            dispatch(removeLike(postId));
        } else {
            newPosts[index] = { ...posts[index], is_liked: true, num_likes: posts[index].num_likes + 1 };
            mutate(url, newPosts, false);
            dispatch(addLike(postId));
        }
    }

    const addPostMutate = (isRepost, newPost, imageUrl, image) => {
        const url = `/api/v1/post/?id=${pageUserId}`;
        if (newPost.trim() !== '' || imageUrl) {
            let newPosts;
            let addNewPost = {
                id: 0,
                image: imageUrl,
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
                    last_name: user.lastName
                }
            }
            if (isRepost) {
                if (parent.user.id == user.userId) {
                    addNewPost.parent = {
                        id: parent.id,
                        text: parent.text,
                        image: parent.image,
                        user: {
                            id: parent.user.id,
                            first_name: parent.user.first_name,
                            last_name: parent.user.last_name
                        }
                    }
                    newPosts = [addNewPost, ...posts];
                    mutate(url, newPosts);
                }
                dispatch(rePost(newPost, image, parent.id));
                setIsOpen(false);
                trigger(url);
            } else {
                newPosts = [addNewPost, ...posts];
                mutate(url, newPosts);
                dispatch(addPost(newPost, image, pageUserId));
                trigger(url);
            }
        }
    }

    const deletePostMutate = () => {
        setIsOpen(false);
        const url = `/api/v1/post/?id=${pageUserId}`;
        mutate(url, posts.filter(post => post.id !== deletePostId), false);
        dispatch(deletePost(deletePostId));
    }

    const renderPosts = posts => {
        return posts.map((post, index) => (
            <UserPost
                key={`post__key__${index}`}
                index={index}
                post={post}
                setIsOpenHandler={setIsOpenHandler}
                likeMutate={likeMutate}
                user={user}
                setIsDeletePostHandler={setIsDeletePostHandler}
            />
        ));
    };

    return (
        <>
            <Modal
                isOpen={isOpen}
                setIsOpen={setIsOpen}
            >
                {isDeletePost ? (
                    <DeletePostModal deletePostMutate={deletePostMutate} />
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
                {posts.length === 0 ? <h2>Нет постов</h2> : renderPosts(posts)}
            </div>
        </>
    );
};

export default UserPosts;

