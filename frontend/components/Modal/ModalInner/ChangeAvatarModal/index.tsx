import React, { useState } from 'react';
import { useDispatch} from 'react-redux';
import ImgCrop from 'antd-img-crop';
import { Upload, message, Button } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { mutate } from 'swr';
import { IContact } from '@/types/contact';
import { avatarChange } from '@/store/actions/auth';
import { StyledChangeAvatarModal } from './styles';

export interface IChangeAvatarModalProps {
  userId: number;
}

interface IChangeAvatarModal extends IChangeAvatarModalProps {
  setClose: () => void;
}

const ChangeAvatarModal: React.FC<IChangeAvatarModal> = ({userId, setClose}) => {
  const [avatarImage, setAvatarImage] = useState<any>(null);
  const [mutatedImage, setMutatedImage] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

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

  const changeAvatarHandler = () => {
    const triggerUrl = `/api/v1/contact/${userId}/`;
    if (mutatedImage) {
      mutate(triggerUrl, async (contact: IContact) => {
        if (contact) {
          return { ...contact, avatar: mutatedImage };
        }
      }, false);
      dispatch(avatarChange(avatarImage, triggerUrl));
      setClose();
    }
  }

  return (
      <StyledChangeAvatarModal>
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
          onClick={changeAvatarHandler}
          disabled={!avatarImage || loading}
        >Подтвердить</Button>
      </StyledChangeAvatarModal>
  );
};

export default ChangeAvatarModal;


