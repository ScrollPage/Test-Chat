import React, { useState } from 'react';
import { CloseOutlined, RollbackOutlined } from '@ant-design/icons';
import Like from '@/components/UI/Icons/Like/Like';
import Repost from '@/components/UI/Icons/Repost/Repost';
import { IPost } from '@/types/post';
import { IUser } from '@/types/user';
import ShowComment from '@/components/UI/Icons/ShowComment/ShowComment';
import Comments from '@/components/Comment/Comments';
import { useDispatch } from 'react-redux';
import { modalShow } from '@/store/actions/modal';
import PostItemBody from '../PostItemBody';
import { IDeletePostModalProps } from '../../Modal/ModalInner/DeletePostModal';
import { StyledPostItem } from './styles';
import { Button } from 'antd';
import Views from '@/components/UI/Icons/Views';

interface IPostItem {
    post: IPost;
    user: IUser;
    pageUserId?: number;
    partyId?: number;
    isOffer?: boolean;
    isAdmin?: boolean;
}

const PostItem: React.FC<IPostItem> = ({
    post,
    user,
    pageUserId,
    partyId,
    isOffer,
    isAdmin,
}) => {
    const dispatch = useDispatch();

    const [isCommentsOpen, setIsCommentsOpen] = useState<number | null>(null);

    const deletePostHanlder = (
        postId: number,
        pageUserId?: number,
        partyId?: number,
        isOfferConfirm?: boolean
    ) => {
        dispatch(
            modalShow<IDeletePostModalProps>('POST_DELETE_MODAL', {
                pageUserId,
                postId,
                partyId,
                isOffer,
                isOfferConfirm,
            })
        );
    };

    return (
        <StyledPostItem>
            {(post.user.id === user.userId ||
                pageUserId === user.userId ||
                post?.group_owner?.id === user.userId) && (
                <div
                    className="user-post__close"
                    onClick={() =>
                        deletePostHanlder(
                            post.id,
                            pageUserId,
                            post?.group_owner?.id,
                            false
                        )
                    }
                >
                    <CloseOutlined />
                </div>
            )}
            <PostItemBody postOrParent={post} isParent={false} />
            {post.parent && (
                <>
                    <hr />
                    <PostItemBody postOrParent={post.parent} isParent={true} />
                </>
            )}
            {isOffer ? (
                <div className="user-post__offer">
                    {isAdmin && (
                        <Button
                            type="primary"
                            onClick={() =>
                                deletePostHanlder(
                                    post.id,
                                    pageUserId,
                                    post?.group_owner?.id,
                                    true
                                )
                            }
                        >
                            Принять
                        </Button>
                    )}
                </div>
            ) : (
                <>
                    <div className="user-post__footer">
                        <div className="user-post__tap">
                            <div>
                                <Like
                                    isTap={post.is_liked}
                                    postId={post.id}
                                    pageUserId={pageUserId}
                                    partyId={partyId}
                                />
                                <h2>{post.num_likes}</h2>
                            </div>
                            <div>
                                <Repost
                                    post={post}
                                    pageUserId={pageUserId}
                                    user={user}
                                />
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
                        <div className="user-post__views">
                            <Views
                                isWatched={post.is_watched}
                                postId={post.id}
                                pageUserId={pageUserId}
                                partyId={partyId}
                            />
                            <h2>{post.num_reviews}</h2>
                        </div>
                    </div>
                    <hr />
                    {isCommentsOpen && pageUserId && (
                        <Comments
                            user={user}
                            postId={isCommentsOpen}
                            pageUserId={pageUserId}
                        />
                    )}
                </>
            )}
        </StyledPostItem>
    );
};

export default PostItem;
