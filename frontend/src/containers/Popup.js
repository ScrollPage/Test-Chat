import React from 'react';
import { Modal } from 'antd';

const AddChatModal = ({close, isVisible, children}) => {
  return (
    <Modal
      centered
      footer={null}
      visible={isVisible}
      onCancel={close}
    >
      <div style={{ margin: '60px' }}>
        {children}
      </div>
    </Modal>
  );
}

export default AddChatModal;



