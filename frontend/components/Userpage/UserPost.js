import React from 'react';
import styled from 'styled-components';
import { CloseOutlined } from '@ant-design/icons';
import Link from 'next/link';
import Like from '@/components/UI/Like';
import Repost from '@/components/UI/Repost';
import LinkAvatar from '@/components/UI/LinkAvatar';

const UserPost = ({ post, setIsOpenHandler, likeMutate, index, user, setIsDeletePostHandler }) => {
    return (
        <StyledUserPost>
            {post.user.id == user.userId && (
                <div
                    className="user-post__close"
                    onClick={() => setIsDeletePostHandler(post.id)}
                >
                    <CloseOutlined />
                </div>
            )}
            <div className="user-post__header">
                <div>
                    <LinkAvatar
                        href="/userpage/[userID]"
                        as={`/userpage/${post.user.id}`}
                        style={{ marginRight: '15px' }}
                        isUsername={post.user.id == user.userId}
                    />
                </div>
                <div>
                    <p>{post.user.first_name} {post.user.last_name}</p>
                    <small>только что</small>
                </div>
            </div>
            <div className="user-post__body">
                {post.text && (
                    <div>{post.text}</div>
                )}
                {post.image && (<div>
                    <img src={post.image} alt="" />
                </div>)}
            </div>
            {post.parent && (
                <>
                    <hr />
                    <div className="user-post__header">
                        <div>
                            <LinkAvatar
                                href="/userpage/[userID]"
                                as={`/userpage/${post.parent.user.id}`}
                                style={{ marginRight: '15px' }}
                                isUsername={post.parent.user.id == user.userId}
                            />
                        </div>
                        <div>
                            <p>{post.parent.user.first_name} {post.parent.user.last_name}</p>
                            <small>только что</small>
                        </div>
                    </div>
                    <div className="user-post__body">
                        {post.parent.text && (
                            <div>{post.parent.text}</div>
                        )}
                        {post.parent.image && (<div>
                            <img src={post.parent.image} alt="" />
                        </div>)}
                    </div>
                </>
            )}
            <div className="user-post__footer">
                <div>
                    <Like
                        isTap={post.is_liked}
                        postId={post.id}
                        // setNumLikes={setNumLikes}
                        likeMutate={likeMutate}
                        index={index}
                    />
                    <h2>{post.num_likes}</h2>
                </div>
                <div>
                    <Repost setIsOpenHandler={setIsOpenHandler} post={post} />
                    <h2>{post.num_reposts}</h2>
                </div>
            </div>
        </StyledUserPost>
    );
};

export default UserPost;

const StyledUserPost = styled.div`
    padding: 20px;
    background-color: #f4f4f4;
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
    position: relative;
    .user-post__close {
        position: absolute;
        right: 10px;
        top: 10px;
        cursor: pointer;
    }
    hr {
        width: 100%;
        background-color: #1890ff;
        border: 1px solid #1890ff;
        margin: 30px 0;
    }
    .user-post__header {
        display: flex;
        justify-content: flex-start;
        > div {
            &:first-of-type {
                display: flex;
                justify-content: center;
                align-items: center;
            }
            &:last-of-type {
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                a {
                    color: black;
                }
                p {
                    margin-bottom: 0;
                    font-weight: 600;
                }
                small {
                    opacity: 0.6;
                }
            }
        }
    }
    .user-post__body {
        /* margin-top: 12px; */
        display: flex;
        flex-direction: column;
        > div {
            &:last-of-type {
                margin-top: 12px;
                img {
                    max-width: 100%;
                }
            }
        }
    }
    .user-post__footer {
        margin-top: 20px;
        display: flex;
        > div {
            display: flex;
            align-items: center;
            h2 {
                margin-bottom: 4px;
            }
        }
    }
`;
