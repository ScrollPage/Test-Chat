import React, { useState } from 'react';
import FileUpload from '@/components/UI/FileUpload';
import { Input, Button } from 'antd';
import { addPostMutate, addRepostMutate } from '@/mutates/post';
import { IUser } from '@/types/user';
import { useDispatch } from 'react-redux';
import { addPost, rePost } from '@/store/actions/post';
import { IPost } from '@/types/post';
import { StyledPostCreate, StyledTopPost } from './styles';

interface IPostCreate {
  isRepost: boolean;
  pageUserId?: number;
  user: IUser;
  parent?: IPost;
  setClose?: () => void;
}

const PostCreate: React.FC<IPostCreate> = ({
  isRepost,
  pageUserId,
  user,
  parent,
  setClose,
}) => {
  const dispatch = useDispatch();

  const [postText, setPostText] = useState('');
  const [mutatedImage, setMutatedImage] = useState(null);
  const [image, setImage] = useState(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (postText.trim() !== '' || mutatedImage) {
      let postUrl = '/api/v1/feed/';
      if (pageUserId) {
        postUrl = `/api/v1/post/?id=${pageUserId}`;
      }
      if (isRepost && parent && setClose) {
        setClose();
        if (pageUserId === user.userId) {
          addRepostMutate(postText, mutatedImage, parent, user, postUrl);
        }
        dispatch(rePost(postText, image, parent.id, postUrl));
      } else {
        addPostMutate(postText, mutatedImage, user, postUrl);
        dispatch(addPost(postText, image, postUrl, pageUserId));
      }
      setPostText('');
      setMutatedImage(null);
      setImage(null);
    }
  };

  return (
    <>
      <StyledPostCreate>
        <form onSubmit={handleSubmit}>
          <StyledTopPost>
            <div>
              <Input.TextArea
                id="create_post"
                name="create_post"
                placeholder={isRepost ? 'Ваше сообщение' : 'Что у вас нового?'}
                value={postText}
                onChange={e => setPostText(e.target.value)}
                autoSize={{ minRows: 4, maxRows: 4 }}
              />
            </div>
            <div>
              <FileUpload
                mutatedImage={mutatedImage}
                setMutatedImage={setMutatedImage}
                setImage={setImage}
              />
            </div>
          </StyledTopPost>
          <Button htmlType="submit" style={{ width: '100%' }}>
            {isRepost ? 'Поделиться записью' : 'Опубликовать пост'}
          </Button>
        </form>
      </StyledPostCreate>
    </>
  );
};

export default PostCreate;