import { IDeleteCommentModalProps } from '@/components/Modal/ModalInner/DeleteCommentModal';
import ImageLink from '@/components/UI/Image/LinkImage';
import { modalShow } from '@/store/actions/modal';
import { IComment } from '@/types/comment';
import { renderTimestamp } from '@/utils';
import { CloseOutlined, RollbackOutlined } from '@ant-design/icons';
import React from 'react';
import { useDispatch } from 'react-redux';
import { StyledCommentItem, StyledCommentItemChildren } from './styles';

interface ICommentItem {
    comment: IComment;
    userId: number;
    postId: number;
    pageUserId?: number;
}

const CommentItem: React.FC<ICommentItem> = ({
    comment,
    userId,
    postId,
    pageUserId,
}) => {
    const dispatch = useDispatch();

    const deleteCommentHanlder = (commentId: number, postId: number) => {
        dispatch(
            modalShow<IDeleteCommentModalProps>('COMMENT_DELETE_MODAL', {
                commentId,
                postId,
                pageUserId,
            })
        );
    };

    const renderCommentChildren = (comments: IComment[]) => {
        return comments.map(comment => {
            return (
                <StyledCommentItemChildren>
                    <RollbackOutlined
                        style={{
                            fontSize: '20px',
                            marginTop: '14px',
                            marginRight: '13px',
                        }}
                    />
                    <CommentItem
                        key={`comment__key__${comment.id}`}
                        comment={comment}
                        userId={userId}
                        postId={postId}
                        pageUserId={pageUserId}
                    />
                </StyledCommentItemChildren>
            );
        });
    };

    return (
        <>
            <StyledCommentItem>
                {userId === comment.user.id && (
                    <div
                        className="comment__close"
                        onClick={() => deleteCommentHanlder(comment.id, postId)}
                    >
                        <CloseOutlined />
                    </div>
                )}
                <div className="comment__avatar">
                    <ImageLink
                        href="/userpage/[userID]"
                        as={`/userpage/${comment.user.id}`}
                        size={'30'}
                        src={
                            comment.user?.small_avatar &&
                            comment.user?.small_avatar
                        }
                    />
                </div>
                <div className="comment__inner">
                    <h4>{`${comment.user.first_name} ${comment.user.last_name}`}</h4>
                    <span>{comment.text}</span>
                    <div>
                        <small>
                            {comment?.timestamp
                                ? renderTimestamp(comment.timestamp)
                                : 'только что...'}
                        </small>
                        <small>Ответить</small>
                    </div>
                </div>
            </StyledCommentItem>
            <div className="comment__children">
                {comment?.children && renderCommentChildren(comment.children)}
            </div>
        </>
    );
};

export default CommentItem;
