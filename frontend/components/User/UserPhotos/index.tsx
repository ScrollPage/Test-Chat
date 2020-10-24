import SliderModal from '@/components/Modal/SliderModal';
import { IPhoto } from '@/types/photo';
import { IUser } from '@/types/user';
import Link from 'next/link';
import React, { useState } from 'react';
import { StyledUserPhotos } from './styles';

interface IUserPhotos {
    photos: IPhoto[];
    pageUserId: number;
    user: IUser;
}

const UserPhotos: React.FC<IUserPhotos> = ({ photos, pageUserId, user }) => {
    const [selectedImage, setSelectedImage] = useState<number | null>(null);
    const renderPhotos = (photos: IPhoto[]) => {
        const fourPhoto = photos.slice(0, 4);
        return fourPhoto.map((photo, index) => (
            <div
                key={`photo__key__${photo.id} __${index}`}
                className="user-photos__item"
                onClick={() => setSelectedImage(index)}
            >
                <img src={photo.picture} />
            </div>
        ));
    };

    return (
        <StyledUserPhotos>
            <div className="user-photos__header">
                <Link href="/photos/[userID]" as={`/photos/${pageUserId}`}>
                    <a>
                        <h3>Фотографии</h3>
                    </a>
                </Link>
            </div>
            <div className="user-photos__items">{renderPhotos(photos)}</div>
            {photos && selectedImage !== null && (
                <SliderModal
                    setSelectedImage={setSelectedImage}
                    selectedImage={selectedImage}
                    photos={photos}
                    pageUserId={pageUserId}
                    user={user}
                />
            )}
        </StyledUserPhotos>
    );
};

export default UserPhotos;
