import React, { Component } from "react";
import 'react-chat-elements/dist/main.css';
import { Button, ChatItem, Input, MessageBox } from 'react-chat-elements';
import AuthService from "../../services/auth.service";
import axios from "axios";
import AvatarPlaceholder from "../../illustrations/avatar-placeholder.png";
import "./Messages.scss";

class Messages extends Component {

    constructor(props) {
        super(props);
        this.state = {
            people: [],
            messagesData: [],
            lobbies: [],
            totalMessages: 0
        };
        this.loadChatRoomInfo = this.loadChatRoomInfo.bind(this);
    }

    render() {
        return(
            <div className="row">
                <div className="col-3 lobby-container" style={{ height: window.innerHeight - 30 }}>
                {
                    this.state.lobbies.map(function(lobby, index) {
                        let iconUrl = lobby.icon_url;
                        if(lobby.icon_url === "") {
                            iconUrl = AvatarPlaceholder;
                        }
                        return <ChatItem
                            avatar={iconUrl}
                            alt={'Avatar'}
                            title={lobby.name}
                            subtitle={lobby.last_message}
                            date={lobby.last_active}
                            unread={!lobby.is_read}
                            onClick={() => {window.location = "/m/" + lobby._id} } />;
                    })
                }
                </div>
                <div className="col-9 chat-container" style={{ height: window.innerHeight - 30 }}>
                    {
                        this.state.messagesData.map( function(message, index) {
                            let position = "left";
                            if(message.user_id === localStorage.getItem("user_id")) {
                                position = "right";
                            }
                            if(message.message) {
                                return <MessageBox
                                    position={position}
                                    type={'text'}
                                    text={message.message}
                                    date={new Date(message.created_at)}
                                    />;
                            } else if(message.image) {
                                return <MessageBox
                                    position={position}
                                    type={'photo'}
                                    text={message.message}
                                    date={new Date(message.created_at)}
                                    data={{
                                        uri: message.image,
                                        status: {
                                            click: false,
                                            loading: 0,
                                        }
                                    }} />;
                            }
                        })
                    }
                    <div className="chat-input-container">
                        <Input
                            placeholder="Type here..."
                            multiline={true}
                            leftButtons={
                                <Button
                                    color='white'
                                    backgroundColor='black'
                                    text='Send'/>
                            }
                            rightButtons={
                                <Button
                                    color='white'
                                    backgroundColor='black'
                                    text='Send'/>
                            }/>
                    </div>
                </div>
            </div>
        );
    }

    componentWillMount() {
        var user = AuthService.getCurrentUser();
        if(user) {
            AuthService.refreshToken().then(
            () => {

                axios
                .post(`https://go.2gaijin.com/chat_lobby`, {}, { 
                    headers: {
                        'Authorization': localStorage.getItem("access_token"),
                        'Content-Type': 'application/json'
                    }
                })
                .then(response => {
                    this.setState({ isLoading: false });
                    if(response.data.data){
                        this.setState({lobbies: response.data.data.chat_lobby});
                        if(response.data.data.chat_lobby[0]) {
                            if(!this.props.match.params.roomID) {
                                window.location = "/m/" + response.data.data.chat_lobby[0]._id;
                            }
                        }
                    }
                });

                if(!this.props.match.params.roomID) {
                    return;
                }

                this.loadChatRoomInfo();
        
            });
        }
    }

    loadChatRoomInfo() {
        let config = {
            headers: {'Authorization': localStorage.getItem("access_token") },
            params: {
                room: this.props.match.params.roomID
            }
        }
        axios
        .get(`https://go.2gaijin.com/chat_users`, config)
        .then(response => {
            var usersData = response.data.data.users;
            var usersTmp = [];
            let currUser;
            if(usersData) {
                usersData.map( function(user, index) {  
                    user.name = user.first_name + " " + user.last_name;
                    if(user.avatar_url == "") {
                        user.avatar_url = "images/avatar-placeholder.png";
                    }
                    if(user._id == localStorage.getItem("user_id")) {
                        currUser = user;
                    }
                    usersTmp.push(user);
                });
                this.setState({ people: usersTmp }, () => {
                    axios
                    .get(`https://go.2gaijin.com/chat_messages`, config)
                    .then(response => {
                        var msgsData = response.data.data.messages;
                        var msgsTmp = [];
                        var currUserID = localStorage.getItem("user_id");
                        if(msgsData) {
                            const people = this.state.people;
                            var photos = new Array();
                            var self = this;
                            var photoIndex = 0; 
                            msgsData.map( function(message, index) {
                                var person = people.find(person => person._id === message.user_id); 
                                if(person.avatar_url == "") {
                                    person.avatar_url = "images/avatar-placeholder.png";
                                }
                                if(message.user_id != currUserID){
                                    message.type = "received";
                                    //message.name = person.first_name + " " + person.last_name;
                                    //message.avatar_url = person.avatar_url;
                                } else {
                                    message.type = "sent";
                                }
                                if(message.image != "") {
                                    message.photo_index = photoIndex;
                                    var photo = { url: message.image, caption: "" };
                                    photos.push(photo);
                                    photoIndex++;
                                }
                                msgsTmp.push(message);
                            });
                            this.setState({ messagesData: msgsTmp });
                            this.setState({ totalMessages: response.data.data.total_messages });
                        }
                    })
                });
                this.setState({ current_person: currUser });
            }
        });
    }

}

export default Messages;