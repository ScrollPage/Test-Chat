import styled from 'styled-components';
import { instanceWithSSR } from '@/api/api';
import useSWR from 'swr';
import PrivateLayout from '@/components/Layout/PrivateLayout';
import { getAsString, getUserFromServer } from '@/utils/index';
import { GetServerSideProps } from 'next';
import { IUser } from '@/types/user';
import { IPhoto } from '@/types/photo';
import PhotosUpload from '@/components/UI/PhotosUpload';
import { motion } from 'framer-motion';
import LazyLoadImage from '@/components/UI/Image/LazyLoadImage';
import Masonry from '@/components/Photo/Masonry';
import { useState } from 'react';
import SliderModal from '@/components/Modal/SliderModal';

interface IPhotos {
    user: IUser;
    photos: IPhoto[] | null;
    pageUserId: number;
}

export default function Photos({ user, photos, pageUserId }: IPhotos) {
    const [selectedImage, setSelectedImage] = useState<number | null>(null);

    const { data } = useSWR(`/api/v1/photo/?id=${pageUserId}`, {
        initialData: photos,
    });

    const renderPhotos = (photos: IPhoto[]) => (
        <Masonry minWidth={220}>
            {photos.map((photo, index) => (
                <motion.div
                    layout
                    whileHover={{ scale: 1.05 }}
                    key={`photos__key__${photo.id}__${index}`}
                    className="photos__item"
                    onClick={() => setSelectedImage(index)}
                >
                    <LazyLoadImage
                        src={photo.picture}
                        csrc={photo.compressed_picture}
                    />
                </motion.div>
            ))}
        </Masonry>
    );

    return (
        <PrivateLayout user={user}>
            <StyledPhotos>
                <div className="photos__header">
                    <h2>
                        Фотографии{' '}
                        {data && data.length > 0
                            ? data[0]?.owner?.user?.id !== user?.userId
                                ? `${data[0]?.owner?.user?.first_name} ${data[0]?.owner?.user?.last_name}`
                                : null
                            : null}
                    </h2>
                </div>
                <div className="photos__upload">
                    <PhotosUpload pageUserId={pageUserId} />
                </div>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="photos__items"
                >
                    {data ? (
                        data.length !== 0 ? (
                            renderPhotos(data)
                        ) : (
                            <h2>Нет фотографий</h2>
                        )
                    ) : (
                        <h2>Загрузка...</h2>
                    )}
                </motion.div>
            </StyledPhotos>
            {photos && selectedImage && (
                <SliderModal
                    setSelectedImage={setSelectedImage}
                    selectedImage={selectedImage}
                    photos={photos}
                    user={user}
                    pageUserId={pageUserId}
                />
            )}
        </PrivateLayout>
    );
}

export const getServerSideProps: GetServerSideProps<IPhotos> = async ctx => {
    const pageUserId = getAsString(ctx?.params?.userID);
    let photos: IPhoto[] | null = null;

    await instanceWithSSR(ctx)
        .get(`/api/v1/photo/?id=${pageUserId}`)
        .then(response => {
            photos = response?.data;
        })
        .catch(error => {
            console.log(error);
        });
    return {
        props: {
            user: getUserFromServer(ctx),
            photos: photos || null,
            pageUserId: Number(pageUserId),
        },
    };
};

const StyledPhotos = styled.div`
    margin: 20px 0 ;
    display: flex;
    flex-direction: column;
    .photos {
        &__header {
            width: 100%;
            display: flex;
            justify-content: center;
        }
        &__upload {
            display: flex;
            justify-content: center;
            margin-bottom: 10px;
        }
        &__item {
            img {
                width: 100% !important;
                /* height: auto !important; */
                cursor: pointer;
                /* min-height:  */
            }
        }
    }
`;
