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

interface IPostItem {
  post: IPost;
  user: IUser;
  pageUserId?: number;
  partyId?: number;
}

const PostItem: React.FC<IPostItem> = ({
  post,
  user,
  pageUserId,
  partyId
}) => {
  const dispatch = useDispatch();

  const [isCommentsOpen, setIsCommentsOpen] = useState<number | null>(null);

  const deletePostHanlder = (postId: number, pageUserId?: number, partyId?: number) => {
    dispatch(modalShow<IDeletePostModalProps>('POST_DELETE_MODAL', { pageUserId, postId, partyId }));
  };

  return (
    <StyledPostItem>
      {(post.user.id === user.userId || pageUserId === user.userId || post?.group_owner?.id === user.userId) && (
        <div
          className="user-post__close"
          onClick={() => deletePostHanlder(post.id, pageUserId, post?.group_owner?.id)}
        >
          <CloseOutlined />
        </div>
      )}
      <PostItemBody postOrParent={post} isParent={false} />
      {post.parent && (
        <>
          <hr />
          <PostItemBody
            postOrParent={post.parent}
            isParent={true}
          />
        </>
      )}
      <div className="user-post__footer">
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
          <Repost post={post} pageUserId={pageUserId} user={user} />
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
      {isCommentsOpen && (
        <Comments user={user} postId={isCommentsOpen} pageUserId={pageUserId} />
      )}
    </StyledPostItem>
  );
};

export default PostItem;