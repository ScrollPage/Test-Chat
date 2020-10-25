import React from 'react';
import { CloseOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { getModalName, getModalProps } from '@/store/selectors';
import { modalHide } from '@/store/actions/modal';
import AddRepostModal from './ModalInner/PostRepostModal';
import ChangeAvatarModal from './ModalInner/ChangeAvatarModal';
import DeleteCommentModal from './ModalInner/DeleteCommentModal';
import DeletePostModal from './ModalInner/DeletePostModal';
import { StyledBackDrop, StyledRootModal } from './styles';
import AddConversationModal from './ModalInner/AddConversationModal';

const MODAL_COMPONENTS = {
  'POST_REPOST_MODAL': AddRepostModal, 
  'AVATAR_CHANGE_MODAL': ChangeAvatarModal, 
  'COMMENT_DELETE_MODAL': DeleteCommentModal,
  'POST_DELETE_MODAL': DeletePostModal,
  'ADD_CONVERSATION_MODAL': AddConversationModal
}

const RootModal: React.FC = () => {

  const dispatch = useDispatch();

  const modalProps = useSelector(getModalProps);
  const modalName = useSelector(getModalName);

  const setClose = () => {
    dispatch(modalHide());
  };

  if (!modalName) {
    return null;
  }

  const SpecificModal = MODAL_COMPONENTS[modalName]

  return (
    <>
      <StyledRootModal>
        <div>
          <div className="root-modal__close" onClick={() => setClose()}>
            <CloseOutlined />
          </div>
          <SpecificModal {...modalProps} setClose={setClose} />
        </div>
      </StyledRootModal>
      <StyledBackDrop onClick={() => setClose()} />
    </>
  );
};

export default RootModal;