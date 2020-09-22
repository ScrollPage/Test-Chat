import React, { useState } from 'react';

import { useDispatch } from 'react-redux';

import styled from 'styled-components';
import { Input, Button } from 'antd';
import { addPost } from '@/store/actions/post';
import FileUpload from '@/components/UI/FileUpload';
import UserPost from './UserPost';

const UserPosts = ({ posts }) => {
  const dispatch = useDispatch();

  const [newPost, setNewPost] = useState('');
  const [imageUrl, setImageUrl] = useState(null);

  const handleSubmit = event => {
    event.preventDefault();
    console.log(imageUrl);
    console.log(newPost);
    dispatch(addPost(newPost, imageUrl));
  };

  const renderPosts = posts => {
    return posts.map((post, index) => (
      <UserPost key={`post__key__${index}`} post={post} />
    ));
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
                placeholder="Что у вас нового?"
                value={newPost}
                onChange={e => setNewPost(e.target.value)}
                autoSize={{ minRows: 4, maxRows: 4 }}
              />
            </div>
            <div>
              <FileUpload imageUrl={imageUrl} setImageUrl={setImageUrl} />
            </div>
          </StyledTopPost>
          <Button htmlType="submit" style={{ width: '100%' }}>
            Опубликовать пост
          </Button>
        </form>
      </StyledPostCreate>
      <StyledUserPosts>
        {posts.length === 0 ? <h2>Нет постов</h2> : renderPosts(posts)}
      </StyledUserPosts>
    </>
  );
};

export default UserPosts;

const StyledPostCreate = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  margin-top: 20px;
  padding: 20px;
  padding-bottom: 12px !important;
  background-color: #f4f4f4;
`;

const StyledUserPosts = styled.div`
  margin-top: 20px;
`;

const StyledTopPost = styled.div`
  flex: 1;
  display: flex;
  > div {
    &:first-of-type {
      margin-right: 20px;
      flex: 1;
    }
    &:last-of-type {
      .ant-upload.ant-upload-select-picture-card {
        height: 98px;
        width: 98px;
      }
    }
  }
`;
