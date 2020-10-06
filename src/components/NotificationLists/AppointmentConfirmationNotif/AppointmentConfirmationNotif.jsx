import React, { Component } from 'react';
import './AppointmentConfirmationNotif.scss';
import Moment from 'react-moment';
import ProductCardHorizontal from '../../ProductCardHorizontal';
import { Button, Dialog } from "@blueprintjs/core";
import axios from 'axios';
import AvatarPlaceholder from "../../../illustrations/avatar-placeholder.png";


class AppointmentConfirmationNotif extends Component {
    
    state = {
        status: this.props.item.status,
    }

    constructor(props) {
        super(props);
        this.acceptAppointment = this.acceptAppointment.bind(this);
        this.onRequestRescheduleClick = this.onRequestRescheduleClick.bind(this);
    }

    onGoToAppointmentClick(userID) {
        window.location = "/profile/" + userID + "?appointment=1";
    }

    onRequestRescheduleClick(id) {
        let config = {
            headers: {'Authorization': localStorage.getItem("access_token") },
            params: {
                receiverid: id
            }
        }

        return axios
        .get(`https://go.2gaijin.com/initiate_chat`, config)
        .then(response => {
            window.location.href = "/m/" + response.data.data.room._id;
        });
    }

    acceptAppointment(appointmentID) {
        var payload = {
            "_id": appointmentID,
            "status": "accepted",
        }

        return axios.post(`https://go.2gaijin.com/confirm_appointment`, payload, {
            headers: {
                "Authorization": localStorage.getItem("access_token")
            }
        }).then(response => {
            if(response.data["status"] == "Success") {
                var jsonData = response.data.data;
                this.setState({ status: "accepted" });
            }
        });
    }

    rejectAppointment(appointmentID) {
        var payload = {
            "_id": appointmentID,
            "status": "rejected",
        }

        return axios.post(`https://go.2gaijin.com/confirm_appointment`, payload, {
            headers: {
                "Authorization": localStorage.getItem("access_token")
            }
        }).then(response => {
            if(response.data["status"] == "Success") {
                var jsonData = response.data.data;
                this.setState({ status: "rejected" });
            }
        });
    }

    render() {

        const calendarStrings = {
            lastDay : '[Yesterday at ] LT',
            sameDay : '[Today at ] LT',
            nextDay : '[Tomorrow at ] LT',
            lastWeek : '[last] dddd [at] LT',
            nextWeek : 'dddd [at] LT',
            sameElse : 'dddd, L [at] LT'
        };

        if(typeof(this.props.item) !== "undefined"){
            var notifItem = this.props.item;
            var meetingTime = notifItem.appointment.meeting_time;
            var avatarURL = "image";

            avatarURL = notifItem.notification_user.avatar_url;
            if(avatarURL == "") {
                avatarURL = AvatarPlaceholder;
            }
            
            let notifButton;
            if(this.state.status == "accepted") {
                notifButton = <div className="row notif-btn" style={{padding: 0, margin: 0}}>
                    <div className="col-6">
                        { notifItem.product.user_id == localStorage.getItem("user_id") && 
                            <Button className="general-washout-btn" style={{color: "#000", marginTop: 5}} onClick={() => this.onRequestRescheduleClick(notifItem.notification_user._id)} raised fill round>Chat with Buyer</Button>
                        } 
                        { notifItem.product.user_id != localStorage.getItem("user_id") && 
                            <Button className="general-btn" style={{color: "#fff", marginTop: 5}} onClick={() => this.onRequestRescheduleClick(notifItem.notification_user._id)} color="orange" raised fill round>Request Reschedule</Button>
                        } 
                    </div>
                    <div className="col-6">
                        <h5>Accepted</h5>
                    </div>
                </div>
            } else if(this.state.status == "rejected") {
                notifButton = <div className="row" style={{paddingBottom: 0, margin: 0}}>
                   <h5 style={{ marginLeft: 20 }}>Sorry, this item is taken</h5>
                </div>
            } else if(this.state.status == "pending") {
                notifButton = <div className="row" style={{paddingBottom: 0, margin: 0}}>
                    <div className="col-6">
                        <Button className="general-btn" style={{color: "#fff", marginTop: 5}} onClick={() => this.acceptAppointment(notifItem.appointment_id)} color="orange" raised fill round>Accept</Button>
                    </div>
                    <div className="col-6">
                        <Button className="general-reject-btn" style={{color: "#fff", marginTop: 5}} onClick={() => this.rejectAppointment(notifItem.appointment_id)} color="orange" raised fill round>Reject</Button>
                    </div>
                </div>
            }

            let notifTitle;
            if(this.props.confirmation) {
                if(notifItem.status == "rejected") {
                    notifTitle = <h7><b>{notifItem.notification_user.first_name}</b> rejected your <b>Appointment Request</b> on <b><Moment calendar={calendarStrings}>{notifItem.appointment.meeting_time}</Moment></b> for this item:</h7>;
                } else if(notifItem.status == "accepted") {
                    notifTitle = <h7><b>{notifItem.notification_user.first_name}</b> accepted your <b>Appointment Request</b> on <b><Moment calendar={calendarStrings}>{notifItem.appointment.meeting_time}</Moment></b> for this item:</h7>;
                }
            } else {
                notifTitle = <React.Fragment><h7>{notifItem.notification_user.first_name} sent you an appointment request</h7>
                <p className="notif-appointment-note">Appointment can be rescheduled after accepted</p>
                </React.Fragment>
            }

            return(
                <React.Fragment>
                    <div className="content">
                        <div className="row notif-row-header" style={{padding: "0 20px 0 20px", marginBottom: 0}}>
                            <div className="col-3">
                                <img src={avatarURL} className="avatar avatar-notif" />
                            </div>
                            <div className="col-9">
                                <div className="text">
                                    {notifTitle}
                                </div>
                            </div>
                        </div>
                        <div className="row" style={{padding: "0 20px 0 20px", margin: 0}}>
                            <ProductCardHorizontal item={notifItem.product} meeting_time={meetingTime} />
                        </div>
                        {notifButton}
                    </div>
                    <div className="divider-space-content"></div>
                </React.Fragment>
            );
        } else {
            return '';
        }
    }

}

export default AppointmentConfirmationNotif;