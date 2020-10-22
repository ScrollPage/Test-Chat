import { instance } from '@/api/api';
import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { StyledProgressBar } from './styles';
import Cookie from 'js-cookie';
import { mutate, trigger } from 'swr';
import { IPhoto } from '@/types/photo';
import { connectAdvanced } from 'react-redux';

interface IProgressBar {
    file: File;
    setFile: Dispatch<SetStateAction<File | undefined>>;
    pageUserId: number;
}

const ProgressBar: React.FC<IProgressBar> = ({ file, setFile, pageUserId }) => {
    // const { progress, url } = useStorage(file);
    const [percent, setPercent] = useState(0);
    const [first, setFirst] = useState(true);

    useEffect(() => {
        const upload = async () => {
            let data = new FormData();
            data.append('picture', file);

            const options = {
                onUploadProgress: (progressEvent: any) => {
                    const { loaded, total } = progressEvent;
                    let perc = Math.floor((loaded * 100) / total);
                    if (perc < 100) {
                        setPercent(perc);
                    }
                },
            };
            const token = Cookie.get('token');
            await instance(token)
                .post('/api/v1/photo/', data, options)
                .then(res => {
                    setPercent(100);
                    setFile(undefined);
                    mutate(
                        `/api/v1/photo/?id=${pageUserId}`,
                        async (photos: IPhoto[]) => {
                            if (photos) {
                                const newPhoto = {
                                    ...photos?.[0],
                                    id: 0,
                                    picture: URL.createObjectURL(file),
                                };
                                return [newPhoto, ...photos];
                            }
                        },
                        false
                    );
                    // trigger(`/api/v1/photo/?id=${pageUserId}`);
                });
        };
        if (first) {
            setFirst(false);
            upload();
        }
    });
    return (
        <StyledProgressBar
            initial={{ width: 0 }}
            animate={{ width: 100 + '%' }}
        ></StyledProgressBar>
    );
};

export default ProgressBar;
