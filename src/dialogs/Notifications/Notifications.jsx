import React, { Component } from "react";
import AuthService from "../../services/auth.service.js";
import { Button, Classes, Popover, Position } from "@blueprintjs/core";
import AppointmentConfirmationNotif from "../../components/NotificationLists/AppointmentConfirmationNotif";
import TrustCoinNotif from "../../components/NotificationLists/TrustCoinNotif";
import TrustCoinSentNotif from "../../components/NotificationLists/TrustCoinSentNotif";
import axios from "axios";
import Moment from 'react-moment';
import moment from 'moment';
import "./Notifications.scss";

import Badge from '@material-ui/core/Badge';
import NotificationIcon from "../../icons/NotificationIcon.svg";

class Notifications extends Component {

    constructor(props) {
        super(props);
        this.state = {
            notifications: [],
            isNotificationOpen: false,
            isLoading: true,
            isNotifRead: true,
        };
    }

    componentWillMount() {
        var user = AuthService.getCurrentUser();
        let config = {
            headers: { 
                "Authorization": localStorage.getItem("access_token")
            },
            params: {
              
            }
        }  
  
        this.setState({isLoading: true});
        return axios
        .get(`https://go.2gaijin.com/get_notifications`, config)
        .then(response => {
            if(response.data.data){
                this.setState({ notifications: response.data.data.notifications });
            }
            this.setState({isLoading: false});
        });
    }

    componentDidUpdate(previousProps, previousState) {
        if (previousProps.isNotifRead !== this.props.isNotifRead) {
            this.setState({isNotifRead: this.props.isNotifRead});
        }
    }

    render() {
        if(!AuthService.getCurrentUser()) {
            return "";
        }
        
        const calendarStrings = {
            lastDay : '[Yesterday]',
            sameDay : '[Today]',
            nextDay : '[Tomorrow]',
            lastWeek : '[last] dddd',
            nextWeek : 'dddd',
            sameElse : 'L'
        };

        let notifItems;
        var comparedTime = moment();
        if(this.state.notifications.length >= 1) {
            notifItems = this.state.notifications.map(function(notifItem, i) {
                let notifDate = new Date(notifItem.created_at).getTime();
                let today = new Date().getTime();
                let timeDiff = today - notifDate;
                let timeDiffInHours = timeDiff / (1000 * 3600);
                let notifType;
                if(notifItem.type == "order_incoming") {
                    notifType = <div key={i+1}><AppointmentConfirmationNotif item={notifItem} confirmation={false} /></div>;
                } else if(notifItem.type == "appointment_confirmation") {
                    notifType = <div key={i+1}><AppointmentConfirmationNotif item={notifItem} confirmation={true} /></div>;
                } else if(notifItem.type == "give_trust_coin") {
                    if(notifItem.status === "finished" && timeDiffInHours <= 24.0) {
                        notifType = <div key={i+1}><TrustCoinNotif notifNum={i+1} item={notifItem} /></div>
                    }
                } else if(notifItem.type == "trust_coin_sent") {
                    if(timeDiffInHours <= 24.0) {
                        notifType = <div key={i+1}><TrustCoinSentNotif notifNum={i+1} item={notifItem} /></div>
                    }
                }
                
                if( i == 0 || !comparedTime.isSame(notifItem.created_at, 'day') ) {
                    comparedTime = moment(notifItem.created_at);
                    return <React.Fragment>
                        <div className="title-time notif-row">
                            <span><Moment calendar={calendarStrings}>{notifItem.created_at}</Moment></span>
                        </div>
                        {notifType}
                    </React.Fragment>;
                }
                return(notifType);
            });
        }

        notifItems = <div className="notif-container">{notifItems}</div>;

        return(
            <>
                <Popover
                    content={notifItems}
                    isOpen={this.state.isNotificationOpen}
                    position={Position.BOTTOM}
                    onClose={ () => this.setState({ isNotificationOpen: false }) }
                >  
                    <Button className={Classes.MINIMAL} onClick={ () => this.setState({ isNotificationOpen: true, isNotifRead: true }) }><Badge color="secondary" variant="dot" invisible={this.state.isNotifRead}><img src={NotificationIcon} style={{ maxWidth: 24 }} /></Badge></Button>
                </Popover>
            </>
        );
    }
}

export default Notifications;