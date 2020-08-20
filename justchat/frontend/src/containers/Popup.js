import React from 'react';
import { Modal } from 'antd';

class AddChatModal extends React.Component {
  render() {
    return (
      <>
        <Modal
          centered
          footer={null}
          visible={this.props.isVisible}
          onCancel={this.props.close}
        >
          {this.props.children}
        </Modal>
      </>
    );
  }
}

export default AddChatModal;


