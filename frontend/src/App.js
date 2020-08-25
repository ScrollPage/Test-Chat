import React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import * as authActions from './store/actions/auth';
import * as navActions from './store/actions/nav';
import * as messagesActions from './store/actions/messages';
import BaseRouter from './routes';
// import AddChatModal from './containers/Popup';
// import AddChatForm from './containers/Form';
import WebSocketInstance from './websocket';
import { Alert } from './components/Alert';
import Layout from './components/Layout/Layout';

class App extends React.Component {

  componentDidMount() {
    this.props.onTryAutoSignup();
    WebSocketInstance.addCallbacks(this.props.setMessages.bind(this), this.props.addMessage.bind(this));
  }

  constructor(props) {
    super(props);
  }

  //   render() {
  //     return (
  //       <Router>
  //         <div id="frame">
  //           <Sidepanel />
  //           <div className="content">
  //             <AddChatModal
  //               isVisible={this.props.showAddChatPopup}
  //               close={() => this.props.closeAddChatPopup()}
  //             >
  //               <AddChatForm />
  //             </AddChatModal>
  //             <Profile />
  //             <BaseRouter />
  //           </div>
  //         </div>
  //       </Router>
  //     );
  //   };
  // }

  render() {
    return (
      <Router>
        <Layout>
          <Alert />
          <BaseRouter isAuth={!!localStorage.getItem('token')} />
        </Layout>
      </Router>
    );
  };
}

const mapStateToProps = state => {
  return {
    showAddChatPopup: state.nav.showAddChatPopup,
    isAuth: !!state.auth.token
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onTryAutoSignup: () => dispatch(authActions.authCheckState()),
    closeAddChatPopup: () => dispatch(navActions.closeAddChatPopup()),
    addMessage: message => dispatch(messagesActions.addMessage(message)),
    setMessages: messages => dispatch(messagesActions.setMessages(messages))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);


// import React, { useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { closeAddChatPopup } from './store/actions/nav';
// import { setMessages, addMessage } from './store/actions/messages';
// import { authCheckState } from './store/actions/auth';
// import WebSocketInstance from './websocket';
// import { BrowserRouter as Router } from 'react-router-dom';
// import BaseRouter from './routes';
// import Sidepanel from './containers/Sidepanel';
// import Profile from './containers/Profile';
// import AddChatModal from './containers/Popup';
// import AddChatForm from './containers/Form';

// const App = () => {

//   const showAddChatPopup = useSelector(state => state.nav.showAddChatPopup);

//   const dispatch = useDispatch();

//   const setMessagesHandler = () => {
//     dispatch(setMessages);
//   }

//   const addMessageHandler = () => {
//     dispatch(addMessage);
//   }

//   useEffect(() => {
//     dispatch(authCheckState());
//     WebSocketInstance.addCallbacks(setMessagesHandler.bind(this), addMessageHandler.bind(this));
//   }, []);

//   return (
//     <Router>
//       <div id="frame">
//         <Sidepanel />
//         <div className="content">
//           <AddChatModal
//             isVisible={showAddChatPopup}
//             close={() => dispatch(closeAddChatPopup())}
//           >
//             <AddChatForm />
//           </AddChatModal>
//           <Profile />
//           <BaseRouter />
//         </div>
//       </div>
//     </Router>
//   );
// }

// export default App;
