import { IPost, IPostParent } from '@/types/post';
import { IUser } from '@/types/user';
import { renderTimestamp } from '@/utils';
import { RollbackOutlined } from '@ant-design/icons';
import React from 'react';
import LazyLoadImage from '../UI/LazyLoadImage';
import LoadImage from '../UI/LoadImage';

interface IUserPostBody {
  postOrParent: IPostParent | IPost;
  user: IUser;
  isParent: boolean;
}

const UserPostBody: React.FC<IUserPostBody> = ({
  postOrParent,
  user,
  isParent,
}) => {

  return (
    <div className="user-post">
      {isParent && (
        <RollbackOutlined
          style={{ fontSize: '23px', marginTop: '8px', marginRight: '13px' }}
        />
      )}
      <div className="user-post__body">
        <div className="user-post__header">
          <div className="user-post__avatar" >
            <LoadImage
              href="/userpage/[userID]"
              as={`/userpage/${postOrParent.user.id}`}
              size={isParent ? '35' : '45'}
              src={postOrParent.user?.small_avatar && postOrParent.user?.small_avatar}
              isCircle={true}
            />
          </div>
          <div>
            <p>
              {postOrParent.user.first_name} {postOrParent.user.last_name}
            </p>
            <small>
              {postOrParent?.timestamp
                ? renderTimestamp(postOrParent.timestamp)
                : 'только что'}
            </small>
          </div>
        </div>
        <div className="user-post__body">
          {postOrParent.text && <div>{postOrParent.text}</div>}
          {postOrParent.image && postOrParent.compressed_image && (
            <div>
              <LazyLoadImage
                csrc={postOrParent.compressed_image}
                src={postOrParent.image}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserPostBody;
