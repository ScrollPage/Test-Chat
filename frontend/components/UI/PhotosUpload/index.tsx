import React, { ChangeEvent, useState } from 'react';
import ProgressBar from '../ProgressBar';
import { StyledPhotosUpload } from './styles';

const PhotosUpload: React.FC<{pageUserId: number}> = ({pageUserId}) => {
    const [file, setFile] = useState<File | undefined>(undefined);
    const [error, setError] = useState('');

    const types = ['image/png', 'image/jpeg'];

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        let selected = event.target?.files?.[0];

        if (selected && types.includes(selected.type)) {
            setFile(selected);
            setError('');
        } else {
            setFile(undefined);
            setError('Пожалуйта выберите картинку (png или jpg)');
        }
  };
  
    return (
        <StyledPhotosUpload>
            <form>
                <label>
                    <input type="file" onChange={handleChange} />
                    <span>+</span>
                </label>
                <div className="photos-upload__output">
                    {error && (
                        <div className="photos-upload__error">{error}</div>
                    )}
                    {file && <div>{file.name}</div>}
                    {file && <ProgressBar pageUserId={pageUserId} file={file} setFile={setFile} />}
                </div>
            </form>
        </StyledPhotosUpload>
    );
};

export default PhotosUpload;
