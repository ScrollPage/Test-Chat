import React from 'react';
import LinkImage from '@/components/UI/Image/LinkImage';
import { IPost, IPostParent } from '@/types/post';
import { renderTimestamp } from '@/utils';
import { RollbackOutlined } from '@ant-design/icons';
import LazyLoadImage from '../../UI/Image/LazyLoadImage';

interface IPostItemBody {
    postOrParent: IPostParent | IPost;
    isParent: boolean;
}

const PostItemBody: React.FC<IPostItemBody> = ({ postOrParent, isParent }) => {
    return (
        <div className="user-post">
            {isParent && (
                <RollbackOutlined
                    style={{
                        fontSize: '23px',
                        marginTop: '16px',
                        marginRight: '13px',
                    }}
                />
            )}
            <div className="user-post__body">
                <div className="user-post__header">
                    <div className="user-post__avatar">
                        {postOrParent?.group_owner ? (
                            <LinkImage
                                href="/teams/[partyID]"
                                as={`/teams/${postOrParent.group_owner.id}`}
                                size={isParent ? '35' : '45'}
                                src={postOrParent.group_owner.image}
                            />
                        ) : (
                            <LinkImage
                                href="/userpage/[userID]"
                                as={`/userpage/${postOrParent.user.id}`}
                                size={isParent ? '35' : '45'}
                                src={postOrParent.user?.small_avatar}
                            />
                        )}
                    </div>
                    <div>
                        {postOrParent?.group_owner ? (
                            <p>{postOrParent.group_owner.name}</p>
                        ) : (
                            <p>
                                {postOrParent.user.first_name}{' '}
                                {postOrParent.user.last_name}
                            </p>
                        )}
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

export default PostItemBody;
