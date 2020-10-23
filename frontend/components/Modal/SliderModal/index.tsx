import Container from '@/styles/Container';
import { IPhoto } from '@/types/photo';
import React, { Dispatch, MouseEvent, SetStateAction } from 'react';
import { StyledSliderModal } from './styles';
import {
    CloseOutlined,
    LeftSquareTwoTone,
    RightSquareTwoTone,
} from '@ant-design/icons';
import { motion } from 'framer-motion';

interface ISliderModal {
    setSelectedImage: Dispatch<SetStateAction<number | null>>;
    selectedImage: number;
    photos: IPhoto[];
}

const SliderModal: React.FC<ISliderModal> = ({
    setSelectedImage,
    selectedImage,
    photos,
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
    }

    return (
        <StyledSliderModal
            onClick={handleClick}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={'slider-modal__inner'}
        >
            <Container>
                <div className="slider-modal__inner">
                    <div className="slider-modal__photo ">
                        <motion.img
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            src={photos[selectedImage].picture}
                        />
                        <div onClick={() => handleChange('left')} className="slider-modal__arrow">
                            <LeftSquareTwoTone
                                twoToneColor="#1b0b0b"
                                style={{ fontSize: '35px' }}
                            />
                        </div>
                        <div onClick={() => handleChange('right')} className="slider-modal__arrow">
                            <RightSquareTwoTone
                                twoToneColor="#000"
                                style={{ fontSize: '35px' }}
                            />
                        </div>
                    </div>
                    <div className="slider-modal__main"></div>
                    <div className="slider-modal__close">
                        <CloseOutlined style={{ fontSize: '20px' }} />
                    </div>
                </div>
            </Container>
        </StyledSliderModal>
    );
};

export default SliderModal;
