import React, { Component } from "react";
import 'react-chat-elements/dist/main.css';
import { ChatItem, Input, MessageBox } from 'react-chat-elements';
import AuthService from "../../services/auth.service";
import axios from "axios";
import AvatarPlaceholder from "../../illustrations/avatar-placeholder.png";
import ArrowIcon from "../../icons/ArrowIcon.svg";
import CameraIcon from "../../icons/CameraIcon.svg";
import SendIcon from "../../icons/SendIcon.svg";
import "./Messages.scss";
import { getCroppedImg, resizeImg } from '../../services/imageprocessing';
import { animateScroll } from "react-scroll";
import { Button, Classes, Card, H3 } from "@blueprintjs/core";
import parse from 'html-react-parser';
import EmptyIllustration from "../../illustrations/EmptyIllustration.png";

class Messages extends Component {

    constructor(props) {
        super(props);
        this.state = {
            people: [],
            messagesData: [],
            lobbies: [],
            totalMessages: 0,
            activeRoomID: "",
            chatPic: null,
            chatPicWidth: 0, chatPicHeight: 0,
            maxWidth: 600, maxHeight: 400,
            ws: null,
            isLoading: false,
        };
        this.inputRef = React.createRef();
        this.picInput = React.createRef();
        this.textInput = React.createRef();
        this.loadChatRoomInfo = this.loadChatRoomInfo.bind(this);
        this.onFileChange = this.onFileChange.bind(this);
        this.onFileRetrieved = this.onFileRetrieved.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.onTextInputChange = this.onTextInputChange.bind(this);
        this.scrollToBottom = this.scrollToBottom.bind(this);
    }


    render() {
        let self = this;
        let activeIcon;
        let activeName;
        return(
            <div className="row">
                <div className="col-3 lobby-container" style={{ height: window.innerHeight - 30 }}>
                <div className="lobby-header-container">
                    <Button className={`${Classes.MINIMAL} back-arrow`} onClick={() => {window.location = "/"}}><img src={ArrowIcon} style={{ width: 30 }} /></Button>
                    <h3 className="lobby-title">Chats</h3>
                </div>
                {
                    this.state.lobbies.map(function(lobby, index) {
                        let iconUrl = lobby.icon_url;
                        if(lobby.icon_url === "") {
                            iconUrl = AvatarPlaceholder;
                        }

                        let activeRoom = "";
                        if(lobby._id === self.props.match.params.roomID) {
                            activeRoom = "active-room";
                            activeName = lobby.name;
                            if(lobby.icon_url === "") {
                                activeIcon = AvatarPlaceholder
                            } else {
                                activeIcon = lobby.icon_url;
                            }
                        }

                        return <ChatItem
                            className={activeRoom}
                            avatar={iconUrl}
                            alt={'Avatar'}
                            title={lobby.name}
                            subtitle={lobby.last_message}
                            date={new Date(lobby.last_active)}
                            unread={!lobby.is_read}
                            onClick={() => {window.location = "/m/" + lobby._id} } />;
                    })
                }
                </div>
                <div id="msg-container" className="col-9 chat-container" style={{ height: window.innerHeight - 30 }}>
                    <div className="chat-header-container">
                        <div className="row">
                            <div className="col-6" style={{ textAlign: "left" }}>
                                <div className="row">
                                    <div className="col-2">
                                        <img src={activeIcon} className="avatar" style={{ maxHeight: 50 }} />
                                    </div>
                                    <div className="col-10 active-chat-name" style={{ textAlign: "left" }}>
                                        {activeName}
                                    </div>
                                </div>
                            </div>
                            <div className="col-6 active-chat-name">
                                
                            </div>
                        </div>
                    </div>
                    { this.state.messagesData.length < 1 && 
                        <Card style={{ width: "97.5%" }}>
                            <img src={EmptyIllustration} />
                            <H3 style={{ marginTop: 10 }}>
                                {this.state.lobbies.length > 1 && "You have no interaction with this person. Send message for them by typing your message on the message box below" }
                                {this.state.lobbies.length < 1 && "You have no active interaction with anyone. Start interacting by requesting the items the seller put on our platform!" }
                            </H3>
                        </Card>
                    }
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
                                    text={parse(message.message)}
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
                    { this.scrollToBottom() }
                    <div className="chat-input-container">
                        <Input
                            inputStyle={{ backgroundColor: "#F2F7FF", borderRadius: 20, paddingLeft: 20, marginLeft: 30, maxWidth: "85%" }}
                            placeholder="Type here..."
                            multiline={true}
                            onChange={this.onTextInputChange}
                            ref={this.textInput}
                            leftButtons={
                                <div class="image-upload">
                                    <label for="file-input">
                                        <img src={CameraIcon} style={{ maxHeight: 37 }} />
                                    </label>
                                    <input id="file-input" type="file" ref={ this.picInput } className="chat-img-input" onChange={this.onFileChange()}  />
                                </div>
                            }
                            rightButtons={
                                <img src={SendIcon} style={{ maxHeight: 37 }} onClick={this.sendMessage} />
                            }/>
                    </div>
                </div>
            </div>
        );
    }
    
    componentDidMount() {
        this.connect();
        var self = this;
        this.textInput.current.input.addEventListener("keyup", function(event) {
            if (event.key === "Enter") {
                self.sendMessage();
            }
        });
    }

    componentDidUpdate() {
        this.scrollToBottom();
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

    scrollToBottom() {
        animateScroll.scrollToBottom({
          containerId: "msg-container"
        });
    }

    onTextInputChange(e) {
        if(e.target.value === "\n") {
        }
    }

    onFileChange = () => async e => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0]
            await readFile(file).then(
            res => {
                this.setState({
                    chatPic: res
                });
                this.onFileRetrieved();
            });
        }
    }

    onFileRetrieved = async () => {
        if(this.state.chatPic) {
            const img = new Image();

            img.src = this.state.chatPic;

            var imgWidth;
            var imgHeight;
            var resizer = 1.0;
            var maxWidth = this.state.maxWidth;
            var maxHeight = this.state.maxHeight;
            var ws = this.state.ws;

            var roomID = this.props.match.params.roomID;
            var userID = localStorage.getItem("user_id");

            var self = this;
            img.onload = async function() {
                imgWidth = img.naturalWidth;
                imgHeight = img.naturalHeight;

                if(imgWidth > maxWidth || imgHeight > maxHeight) {
                    if(imgWidth > imgHeight) {
                        resizer = maxWidth / imgWidth;
                    } else {
                        resizer = maxHeight / imgHeight;
                    }
                }

                self.setState({ isLoading: true });
                var picToUpload = await resizeImg(img.src, imgWidth * resizer, imgHeight * resizer);
                let parts = picToUpload.split(';');
                let imageData = parts[1].split(',')[1];
                var dataToSend = { "user_id": userID, "room_id": roomID, "img_data": imageData };
                let config = { headers: {'Authorization': localStorage.getItem("access_token"), "Content-Type": "application/json" }}
                axios
                .post(`https://go.2gaijin.com/insert_image_message`, dataToSend, config)
                .then(response => {
                    if(response.data.status == "Success") {
                        var roomMsg = response.data.data.room_message;
                        var sendToWs = roomMsg;
                        self.setState({ isLoading: false });
                        try {
                            ws.send(JSON.stringify(sendToWs));
                        } catch (error) {
                            console.log(error);
                        }
                    }
                });
            };
        }
    }

    loadChatRoomInfo() {
        this.setState({ activeRoomID: this.props.match.params.roomID });

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

    sendMessage() {
        const self = this;
        const regex = /(<([^>]+)>)/ig;
        const text = self.textInput.current.input.value.replace(regex, '');
        //const text = self.textInput.current.input.value.replace(/\n/g, '<br>').trim();
        var messageToSend = {};
        if (text.trim().length) {
            messageToSend = {
                user_id: localStorage.getItem("user_id"),
                room_id: this.props.match.params.roomID,
                message: text,
            };
        } else {
            return;
        }

        self.setState({
            // Reset attachments
            attachments: [],
            // Hide sheet
            sheetVisible: false,
        });
        self.textInput.current.input.value = "";
        
        let config = { headers: {'Authorization': localStorage.getItem("access_token"), "Content-Type": "application/json" }}
        axios
        .post(`https://go.2gaijin.com/insert_message`, messageToSend, config)
        .then(response => {
            if(response.data.status == "Success") {
                var roomMsg = response.data.data.room_message;      
                self.sendMsgWs(JSON.stringify(roomMsg));
            }
        });
        
        if (text.length) self.textInput.current.input.focus();
    }

    sendMsgWs = (msgToSend) => {
        const ws = this.state.ws;
        try {
            ws.send(msgToSend);
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * @function connect
     * This function establishes the connect with the websocket and also ensures constant reconnection if connection closes
     */
    connect = () => {
        var ws = new WebSocket("wss://go.2gaijin.com/ws?room=" + this.props.match.params.roomID);
        let that = this; // cache the this
        var connectInterval;

        // websocket onopen event listener
        ws.onopen = () => {
            //console.log("connected websocket main component");

            this.setState({ ws: ws });

            that.timeout = 250; // reset timer to 250 on open of websocket connection 
            clearTimeout(connectInterval); // clear Interval on on open of websocket connection
        };

        // websocket onclose event listener
        ws.onclose = e => {
            /*console.log(
                `Socket is closed. Reconnect will be attempted in ${Math.min(
                    10000 / 1000,
                    (that.timeout + that.timeout) / 1000
                )} second.`,
                e.reason
            );*/

            that.timeout = that.timeout + that.timeout; //increment retry interval
            connectInterval = setTimeout(this.check, Math.min(10000, that.timeout)); //call check function after timeout
        };

        ws.onmessage = evt => {
            // listen to data sent from the websocket server
            var receivedData = JSON.parse(evt.data);
            if(localStorage.getItem("user_id") == receivedData.user_id) {
                receivedData.type = "sent";
                delete receivedData.name;
                delete receivedData.avatar_url;

                var dataToSend = receivedData;
            } else {
                receivedData.type = "received";
            }
            var dataToSend = { "_id": receivedData._id };
            let config = { headers: {'Authorization': localStorage.getItem("access_token"), "Content-Type": "application/json" }}
            axios.post(`https://go.2gaijin.com/add_message_reader`, dataToSend, config);
            this.setState(prevState => ({
                messagesData: [...this.state.messagesData, receivedData]
            }), this.scrollToBottom());
        }

        // websocket onerror event listener
        ws.onerror = err => {
            console.error(
                "Socket encountered error: ",
                err.message,
                "Closing socket"
            );

            ws.close();
        };
    };

    check = () => {
        const { ws } = this.state;
        if (!ws || ws.readyState == WebSocket.CLOSED) this.connect(); //check if websocket instance is closed, if so call `connect` function.
    };

}

function readFile(file) {
    return new Promise(resolve => {
      const reader = new FileReader()
      reader.addEventListener('load', () => resolve(reader.result), false)
      reader.readAsDataURL(file)
    })
}

export default Messages;