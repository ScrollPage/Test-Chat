import React, { useState, useEffect } from 'react';
import Contact from "../components/Contact";
import { useSelector, useDispatch } from 'react-redux';
import { openAddChatPopup } from '../store/actions/nav';
import { getUserChats } from '../store/actions/messages';
import { authLogin, logout, authSignup } from '../store/actions/auth';
import WebSocketInstance from '../websocket';
import useReactRouter from 'use-react-router'

const Sidepanel = () => {

    const { match } = useReactRouter();

    const isAuthenticated = useSelector(state => state.auth.token !== null);
    const loading = useSelector(state => state.auth.loading);
    const token = useSelector(state => state.auth.token);
    const username = useSelector(state => state.auth.username);
    const chats = useSelector(state => state.message.chats);

    const dispatch = useDispatch();

    const [loginForm, setLoginForm] = useState(true);

    useEffect(() => {
        if (token !== null && token !== undefined) {
            dispatch(getUserChats(username, token));
        } 
    }, [token])

    const addChat = () => {
        dispatch(openAddChatPopup());
    }

    const changeForm = () => {
        setLoginForm(state => !state);
    }

    const logoutHandler = () => {
        if (match.params.chatID !== undefined && match.params.chatID !== null) {
            WebSocketInstance.disconnect();
        }
        dispatch(logout()); 
    }

    const authenticate = (e) => {
        e.preventDefault();
        if (loginForm) {
            dispatch(authLogin(
                e.target.username.value,
                e.target.password.value
            ));
        } else {
            dispatch(authSignup(
                e.target.username.value,
                e.target.email.value,
                e.target.password.value,
                e.target.password2.value
            ));
        }
    }

    const activeChats = chats.map(chat => {
        return (
            <Contact
                key={chat.id}
                name={`Чат Номер ${chat.id}`}
                picURL="http://emilcarlsson.se/assets/louislitt.png"
                status="busy"
                chatURL={`/${chat.id}`} />
        )
    })

    return (
        <div id="sidepanel">
            <div id="profile">
                <div className="wrap">
                    <img id="profile-img" src="http://emilcarlsson.se/assets/mikeross.png" className="online" alt="" />
                    <p>Mike Ross</p>
                    <i className="fa fa-chevron-down expand-button" aria-hidden="true"></i>
                    <div id="status-options">
                        <ul>
                            <li id="status-online" className="active"><span className="status-circle"></span> <p>Online</p></li>
                            <li id="status-away"><span className="status-circle"></span> <p>Away</p></li>
                            <li id="status-busy"><span className="status-circle"></span> <p>Busy</p></li>
                            <li id="status-offline"><span className="status-circle"></span> <p>Offline</p></li>
                        </ul>
                    </div>
                    <div id="expanded">
                        {
                            loading ?

                                <h1>Загрузка....</h1> :

                                isAuthenticated ?

                                    <button onClick={logoutHandler} className="authBtn"><span>Logout</span></button>

                                    :

                                    <div>
                                        <form method="POST" onSubmit={authenticate}>

                                            {
                                                loginForm ?

                                                    <div>
                                                        <input name="username" type="text" placeholder="username" />
                                                        <input name="password" type="password" placeholder="password" />
                                                    </div>

                                                    :

                                                    <div>
                                                        <input name="username" type="text" placeholder="username" />
                                                        <input name="email" type="email" placeholder="email" />
                                                        <input name="password" type="password" placeholder="password" />
                                                        <input name="password2" type="password" placeholder="password confirm" />
                                                    </div>
                                            }

                                            <button type="submit">Authenticate</button>

                                        </form>

                                        <button onClick={changeForm}>Switch</button>
                                    </div>
                        }
                    </div>
                </div>
            </div>
            <div id="search">
                <label htmlFor=""><i className="fa fa-search" aria-hidden="true"></i></label>
                <input type="text" placeholder="Search contacts..." />
            </div>
            <div id="contacts">
                <ul>
                    {token === null ? <p style={{ textAlign: 'center', marginTop: '30px' }}>У вас нет Чатов</p> : activeChats}
                </ul>
            </div>
            <div id="bottom-bar">
                <button
                    id="addcontact"
                    onClick={addChat}
                >
                    <i className="fa fa-user-plus fa-fw" aria-hidden="true" />
                    <span>Add contact</span>
                </button>
                <button id="settings"><i className="fa fa-cog fa-fw" aria-hidden="true"></i> <span>Settings</span></button>
            </div>
        </div>
    );
}

export default Sidepanel;
