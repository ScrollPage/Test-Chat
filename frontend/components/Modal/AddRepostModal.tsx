import React from 'react';
import NewModal from './NewModal';
import { useDispatch, useSelector } from 'react-redux';
import { getModalName, getModalProps } from '@/store/selectors';
import { modalHide } from '@/store/actions/modal';
import PostCreate from '../Userpage/PostCreate';

const AddRepostModal: React.FC = () => {
  const dispatch = useDispatch();

  const modalProps = useSelector(getModalProps);
  const modalName = useSelector(getModalName);

  const setClose = () => {
    dispatch(modalHide());
  };

  return (
    <NewModal isOpen={modalName === 'repost_modal'} setClose={setClose}>
      <PostCreate
        isRepost={true}
        pageUserId={modalProps.pageUserId}
        user={modalProps.user}
        parent={modalProps.parent}
        setClose={setClose}
      />
    </NewModal>
  );
};

export default AddRepostModal;
