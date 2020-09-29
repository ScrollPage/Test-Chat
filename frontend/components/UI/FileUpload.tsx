import React, { useState } from 'react';
import { Upload, message } from 'antd';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';

interface IFileUpload {
    mutatedImage: any;
    setMutatedImage: (mutatedImage: any) => void;
    setImage: (image: any) => void;
} 

const FileUpload: React.FC<IFileUpload> = ({ mutatedImage, setMutatedImage, setImage }) => {
    const [loading, setLoading] = useState(false);

    function getBase64(img: any, callback: any) {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
    }

    function beforeUpload(file: any) {
        const isJpgOrPng =
            file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('Только JPG/PNG файлы!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Картинка должна быть меньше 2мб');
        }
        return isJpgOrPng && isLt2M;
    }

    const handleChange = (info: any) => {
        if (info.file.status === 'uploading') {
            setLoading(true);
            return;
        }
        if (info.file.status === 'done') {
            getBase64(info.file.originFileObj, (mutatedImage: any) => {
                setMutatedImage(mutatedImage);
                setLoading(false);
                setImage(info.file.originFileObj);
            });
        }
    };

    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>Загрузить фотографию</div>
        </div>
    );

    return (
        <Upload
            name="avatar"
            listType="picture-card"
            className="avatar-uploader"
            showUploadList={false}
            beforeUpload={beforeUpload}
            onChange={handleChange}
        >
            {mutatedImage ? (
                <img src={mutatedImage} alt="avatar" style={{ width: '100%' }} />
            ) : (
                uploadButton
            )}
        </Upload>
    );
};

export default FileUpload;
