import React, { useState } from 'react';
import styled from 'styled-components';
import FileUpload from '@/components/UI/FileUpload';
import { Input, Button } from 'antd';
import { addPostMutate, addRepostMutate } from '@/mutates/post';
import { IUser } from '@/types/user';
import { useDispatch } from 'react-redux';
import { addPost, rePost } from '@/store/actions/post';
import { IPost } from '@/types/post';

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

const StyledPostCreate = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 20px;
  padding-bottom: 12px !important;
  background-color: #f4f4f4;
`;

const StyledTopPost = styled.div`
  flex: 1;
  display: flex;
  @media (max-width: 991.98px) {
    flex-direction: column;
  }
  > div {
    &:first-of-type {
      margin-right: 20px;
      flex: 1;
      @media (max-width: 991.98px) {
        margin-right: 0px;
      }
    }
    &:last-of-type {
      .ant-upload-select-picture-card {
        height: 98px;
        width: 98px;
      }
      @media (max-width: 991.98px) {
        width: 100%;
        margin-top: 20px;
        .ant-upload-select-picture-card {
          width: 100%;
          height: 20px;
        }
      }
    }
  }
`;
