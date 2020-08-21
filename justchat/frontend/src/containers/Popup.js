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
          <div style={{margin: '60px'}}>
            {this.props.children}
          </div> 
        </Modal>
      </>
    );
  }
}

export default AddChatModal;


