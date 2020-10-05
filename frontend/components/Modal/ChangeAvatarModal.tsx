import React, { useState } from 'react';
import NewModal from './NewModal';
import { useDispatch, useSelector } from 'react-redux';
import { getModalName, getModalProps } from '@/store/selectors';
import { modalHide } from '@/store/actions/modal';
import ImgCrop from 'antd-img-crop';
import { Upload, message, Button } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { mutate } from 'swr';
import { IContact } from '@/types/contact';
import { avatarChange } from '@/store/actions/auth';

const ChangeAvatarModal: React.FC = () => {
  const [avatarImage, setAvatarImage] = useState<any>(null);
  const [mutatedImage, setMutatedImage] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const modalProps = useSelector(getModalProps);
  const modalName = useSelector(getModalName);

  const setClose = () => {
    dispatch(modalHide());
  };

  function getBase64(img: any, callback: any) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  function beforeUpload(file: any) {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  }

  const onPreview = async (file: any) => {
    let src = file.url;
    if (!src) {
      src = await new Promise(resolve => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  const handleChange = (info: any) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj, (mutatedImage: any) => {
        setAvatarImage(info.file.originFileObj);
        setMutatedImage(mutatedImage);
        setLoading(false);
      });
    }
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Загрузить фотографию</div>
    </div>
  );

  const changeAvatarHandler = (modalProps: { userId: number }) => {
    const triggerUrl = `/api/v1/contact/${modalProps.userId}/`;
    if (mutatedImage) {
      mutate(triggerUrl, async (contact: IContact) => {
        if (contact) {
          return { ...contact, avatar: mutatedImage };
        }
      }, false);
      console.log(avatarImage);
      dispatch(avatarChange(avatarImage, triggerUrl));
      setClose();
    }
  }

  return (
    <NewModal isOpen={modalName === 'avatar_modal'} setClose={setClose}>
      <StyledChangeAvatar>
        <ImgCrop grid>
          <Upload
            name="avatar"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            beforeUpload={beforeUpload}
            onChange={handleChange}
            onPreview={onPreview}
          >
            {mutatedImage ? (
              <img src={mutatedImage} alt="avatar" style={{ width: '100%' }} />
            ) : (
              uploadButton
            )}
          </Upload>
        </ImgCrop>
        <Button
          type="primary"
          onClick={() => changeAvatarHandler(modalProps)}
          disabled={!avatarImage || loading}
        >Подтвердить</Button>
      </StyledChangeAvatar>
    </NewModal>
  );
};

export default ChangeAvatarModal;

const StyledChangeAvatar = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  > span {
    width: 150px;
    margin-left: 46px;
    margin-bottom: 30px;
  }
`;
