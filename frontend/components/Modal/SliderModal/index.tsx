import Container from '@/styles/Container';
import { IPhoto } from '@/types/photo';
import React, { Dispatch, MouseEvent, SetStateAction, useEffect } from 'react';
import { StyledSliderModal } from './styles';
import {
    CloseOutlined,
    LeftSquareTwoTone,
    RightSquareTwoTone,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import Comments from '@/components/Comment/Comments';
import { IUser } from '@/types/user';
import LinkImage from '@/components/UI/Image/LinkImage';

interface ISliderModal {
    setSelectedImage: Dispatch<SetStateAction<number | null>>;
    selectedImage: number;
    photos: IPhoto[];
    pageUserId: number;
    user: IUser;
}

const SliderModal: React.FC<ISliderModal> = ({
    setSelectedImage,
    selectedImage,
    photos,
    pageUserId,
    user,
}) => {

    const handleClick = (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        if (target.classList.contains('slider-modal__inner')) {
            setSelectedImage(null);
        }
    };

    const handleChange = (where: 'left' | 'right') => {
        if (where === 'left') {
            if (selectedImage > 0) {
                setSelectedImage(selectedImage - 1);
            }
        }
        if (where === 'right') {
            if (selectedImage < photos.length - 1) {
                setSelectedImage(selectedImage + 1);
            }
        }
    };

    return (
        <StyledSliderModal
            onClick={handleClick}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={'slider-modal__inner'}
        >
            <Container className={'slider-modal__inner'}>
                <div className="slider-modal__inner">
                    <div className="slider-modal__photo ">
                        <motion.img
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            src={photos[selectedImage].picture}
                        />
                        <div
                            onClick={() => handleChange('left')}
                            className="slider-modal__arrow"
                        >
                            <LeftSquareTwoTone
                                twoToneColor="#1b0b0b"
                                style={{ fontSize: '35px' }}
                            />
                        </div>
                        <div
                            onClick={() => handleChange('right')}
                            className="slider-modal__arrow"
                        >
                            <RightSquareTwoTone
                                twoToneColor="#000"
                                style={{ fontSize: '35px' }}
                            />
                        </div>
                        <div className="slider-modal__amount">
                            {`${selectedImage + 1} / ${photos.length} `}
                        </div>
                    </div>
                    <div className="slider-modal__main">
                        <div>
                            <LinkImage
                                href="/userpage/[userID]"
                                as={`/userpage/${user.userId}`}
                                size={'45'}
                                src={user?.smallAvatar}
                            />
                            <h3>{`${user.firstName} ${user.lastName}`}</h3>
                        </div>
                        <Comments
                            photoId={photos[selectedImage].id}
                            pageUserId={pageUserId}
                            user={user}
                        />
                    </div>
                    {/* <div className="slider-modal__close">
                        <CloseOutlined style={{ fontSize: '20px' }} />
                    </div> */}
                </div>
            </Container>
        </StyledSliderModal>
    );
};

export default SliderModal;
