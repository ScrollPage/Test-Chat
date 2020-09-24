import React, { useState } from 'react';
import styled from 'styled-components';
import FileUpload from '@/components/UI/FileUpload';
import { Input, Button } from 'antd';

const PostCreate = ({ isRepost, addPostMutate }) => {

  const [newPost, setNewPost] = useState('');
  const [imageUrl, setImageUrl] = useState(null);

  const handleSubmit = event => {
    event.preventDefault();
    addPostMutate(isRepost, newPost, imageUrl);
    setNewPost('');
    setImageUrl(null);
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
                size="large"
                placeholder={isRepost ? 'Ваше сообщение' : 'Что у вас нового?'}
                value={newPost}
                onChange={e => setNewPost(e.target.value)}
                autoSize={{ minRows: 4, maxRows: 4 }}
              />
            </div>
            <div>
              <FileUpload
                imageUrl={imageUrl}
                setImageUrl={setImageUrl}
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
}

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
