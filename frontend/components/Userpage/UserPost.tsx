import React, { useState } from 'react';
import styled from 'styled-components';
import { CloseOutlined, RollbackOutlined } from '@ant-design/icons';
import Like from '@/components/UI/Like';
import Repost from '@/components/UI/Repost';
import LinkAvatar from '@/components/UI/LinkAvatar';
import { renderTimestamp } from '@/utils/index';
import { IPost, IPostParent } from '@/types/post';
import { IUser } from '@/types/user';
import ShowComment from '@/components/UI/ShowComment';
import Comments from '@/components/Comment/Comments';
import LazyLoadImage from '../UI/LazyLoadImage';

interface IUserPost {
    post: IPost;
    setIsOpenHandler: (parent: IPostParent) => void;
    likeMutate: (postId: number) => void;
    user: IUser;
    setIsDeletePostHandler: (postId: number) => void;
    pageUserId: number;
}

const UserPost: React.FC<IUserPost> = ({
    post,
    setIsOpenHandler,
    likeMutate,
    user,
    setIsDeletePostHandler,
    pageUserId
}) => {
    const [isCommentsOpen, setIsCommentsOpen] = useState<number | null>(null);

    console.log(post)

    return (
        <StyledUserPost>
            {(post.owner == user.userId || post.user.id == user.userId) && (
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
                        size={45}
                    />
                </div>
                <div>
                    <p>
                        {post.user.first_name} {post.user.last_name}
                    </p>
                    <small>
                        {post?.timestamp
                            ? renderTimestamp(post.timestamp)
                            : 'только что'}
                    </small>
                </div>
            </div>
            <div className="user-post__body">
                {post.text && <div>{post.text}</div>}
                {post.image && post.compressed_image && (
                    <div>
                        <LazyLoadImage csrc={post.compressed_image} src={post.image} />
                    </div>
                )}
            </div>
            {post.parent && (
                <>
                    <hr />
                    <div className="user-repost">
                        <RollbackOutlined style={{ fontSize: '23px', marginTop: '8px', marginRight: '13px'}} />
                        <div className="user-repost__body">
                            <div className="user-post__header">
                                <div>
                                    <LinkAvatar
                                        href="/userpage/[userID]"
                                        as={`/userpage/${post.parent.user.id}`}
                                        style={{ marginRight: '15px' }}
                                        isUsername={post.parent.user.id == user.userId}
                                        size={45}
                                    />
                                </div>
                                <div>
                                    <p>
                                        {post.parent.user.first_name}{' '}
                                        {post.parent.user.last_name}
                                    </p>
                                    <small>
                                        {post?.parent?.timestamp
                                            ? renderTimestamp(
                                                  post.parent.timestamp
                                              )
                                            : 'только что'}
                                    </small>
                                </div>
                            </div>
                            <div className="user-post__body">
                                {post.parent.text && (
                                    <div>{post.parent.text}</div>
                                )}
                                {post.parent.image && post.parent.compressed_image && (
                                    <div>
                                        <LazyLoadImage csrc={post.parent.compressed_image} src={post.parent.image} />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}
            <div className="user-post__footer">
                <div>
                    <Like
                        isTap={post.is_liked}
                        postId={post.id}
                        likeMutate={likeMutate}
                    />
                    <h2>{post.num_likes}</h2>
                </div>
                <div>
                    <Repost setIsOpenHandler={setIsOpenHandler} post={post} />
                    <h2>{post.num_reposts}</h2>
                </div>
                <div>
                    <ShowComment
                        postId={post.id}
                        setIsCommentsOpen={setIsCommentsOpen}
                        isCommentsOpen={isCommentsOpen}
                    />
                    <h2>{post.num_comments}</h2>
                </div>
            </div>
            <hr />
            {isCommentsOpen && <Comments user={user} postId={isCommentsOpen} pageUserId={pageUserId} />}
        </StyledUserPost>
    );
};

export default UserPost;

const StyledUserPost = styled.div`
    padding: 20px;
    padding-bottom: 0px;
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
        background-color: #fff;
        border: 2px solid #fff;
        width: calc(100% + 38px);
        margin-left: -20px;
        &:first-of-type {
            margin-top: 30px;
            margin-bottom: 20px;
        }
        &:last-of-type {
            margin-bottom: 0px;
        }
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
        display: flex;
        flex-direction: column;
        > div {
            margin-top: 12px;
            img {
                max-width: 100%;
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
    .user-repost {
        display: flex;
    }
`;
