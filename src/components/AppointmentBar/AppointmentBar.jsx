import React, { Component } from 'react';
import './AppointmentBar.scss';
import { geolocated } from 'react-geolocated';
import ProductCardHorizontal from '../ProductCardHorizontal';
import Moment from 'react-moment';
import axios from 'axios';
import { Button, Classes, FormGroup, Dialog, Spinner, Switch } from "@blueprintjs/core";
import AvatarPlaceholder from "../../illustrations/avatar-placeholder.png";
import { DatePicker } from "@blueprintjs/datetime";
import { INTENT_PRIMARY } from "@blueprintjs/core/lib/esm/common/classes";

class AppointmentBar extends Component {
    

    constructor(props) {
        super(props);
        this.state = { appMessage: "", appLoading: false, currLat: 0.0, currLng: 0.0, time: new Date(), status: this.props.item.status, meetingTime: "", locText: "", isDateChanged: false, isLoading: false, isRescheduleDialogOpen: false };
        this.findCoordinates = this.findCoordinates.bind(this);
        this.finishAppointment = this.finishAppointment.bind(this);
        this.rescheduleAppointment = this.rescheduleAppointment.bind(this);
        this.handleChat = this.handleChat.bind(this);
        this.handleDateChange = this.handleDateChange.bind(this);
        this.calcDistance = this.calcDistance.bind(this);
        this.onTimeChange = this.onTimeChange.bind(this);
    }

    findCoordinates = () => {
        navigator.geolocation.getCurrentPosition(position => {
            const location = JSON.stringify(position);
            this.setState({ currLat: position.coords.latitude, currLng: position.coords.longitude }, () => {
                this.calcDistance();
            });
        });
    }

    onTimeChange(e) {
        this.setState({ time: e });
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

    handleChat(id) {
        var payload = {}

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

    handleDateChange(e) {
        console.log(e);
    }

    finishAppointment(id) {
        var payload = {
            "_id": id,
        }

        return axios.post(`https://go.2gaijin.com/finish_appointment`, payload, {
            headers: {
                "Authorization": localStorage.getItem("access_token")
            }
        }).then(response => {
            if(response.data["status"] == "Success") {
                var jsonData = response.data.data;
                this.setState({ status: "finished" });
            }
        });
    }

    rescheduleAppointment(id) {
        this.setState({ appLoading: true, appMessage: "" });
        var payload = {
            "_id": id,
            "meeting_time": new Date(this.state.time).getTime()
        }
        console.log(payload);

        return axios.post(`https://go.2gaijin.com/reschedule_appointment`, payload, {
            headers: {
                "Authorization": localStorage.getItem("access_token")
            }
        }).then(response => {
            this.setState({ appLoading: false, appMessage: response.data.message });
            if(response.data["status"] == "Success") {
                var jsonData = response.data.data;
                this.setState({ isDateChanged: true });
                this.setState({ isLoading: false });
                this.setState({ meetingTime: jsonData.meeting_time });
            }
        });
    }

    calcDistance() {
        if(typeof(this.props.item.product_detail) !== 'undefined') {
            var item = this.props.item.product_detail;
            var lat1 = parseFloat(item.location.latitude);
            var lng1 = parseFloat(item.location.longitude);
            var lat2 = parseFloat(this.state.currLat);
            var lng2 = parseFloat(this.state.currLng);

            if(this.state.locText != "") {
                return;
            }
            
            if (lat1 === 0.0 || lat2 === 0.0) {
                if(this.state.locText != "") {
                    this.setState({ locText: "" });
                }
                return;
            }

            var R = 6371;
            var dLat = (lat2-lat1) * (Math.PI/180);
            var dLon = (lng2-lng1) * (Math.PI/180); 
            var a = 
                Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1 * (Math.PI/180)) * Math.cos(lat2 * (Math.PI/180)) * 
                Math.sin(dLon/2) * Math.sin(dLon/2)
                ; 
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
            var d = R * c;

            this.setState({ locText: d.toFixed(1) + " km"});
        }
    }
    
    componentDidMount() {
        this.findCoordinates();
        this.setState({ meetingTime: this.props.item.meeting_time });
        var self = this;
        var today = new Date();
    }

    render() {

        if(typeof(this.props.item) !== "undefined"){
            var appointmentUserID = this.props.item.appointment_user._id;
            if(this.props.item.status != "rejected") {
                var item = this.props.item;
                var avatarURL = AvatarPlaceholder;

                if(item.appointment_user.avatar_url != "") {
                    avatarURL = item.appointment_user.avatar_url;
                }
                
                let notifButton;
                if(this.props.type == "seller") {
                    if(this.state.status == "accepted") {
                        notifButton = <div className="row" style={{paddingBottom: 0, marginBottom: 0}}>
                            <div className="col-6">
                                <Button className="general-washout-btn" onClick={() => {this.setState({isRescheduleDialogOpen: true})}} style={{color: "#000", marginTop: 5}} raised fill round>Reschedule</Button>
                            </div>
                            <div className="col-6">
                                <Button className="general-btn" style={{color: "#fff", marginTop: 5}} onClick={() => this.finishAppointment(item._id)} raised fill round>Finish Transaction</Button>
                            </div>
                        </div>
                    } else if(this.state.status == "rejected") {
                        notifButton = <div className="row" style={{paddingBottom: 0, marginBottom: 0}}>
                            <Button className="general-disabled-btn" style={{color: "#EF7132", marginTop: 5}} color="orange" raised fill round>This Appointment is Rejected</Button>
                        </div>
                    } else if(this.state.status == "pending") {
                        notifButton = <div className="row" style={{paddingBottom: 0, marginBottom: 0}}>
                            <div className="col-6">
                                <Button className="general-btn" style={{color: "#fff", marginTop: 5}} onClick={() => this.acceptAppointment(item._id)} color="orange" raised fill round>Accept</Button>
                            </div>
                            <div className="col-6">
                                <Button className="general-reject-btn" style={{color: "#fff", marginTop: 5}} onClick={() => this.rejectAppointment(item._id)} color="orange" raised fill round>Reject</Button>
                            </div>
                        </div>
                    } else if(this.state.status == "finished") {
                        notifButton = <div className="row" style={{paddingBottom: 0, marginBottom: 0}}>
                            <h5>Transaction has finished</h5>
                        </div>
                    }
                } else if(this.props.type == "buyer") {
                    if(this.state.status == "accepted") {
                        notifButton = <div className="row" style={{paddingBottom: 0, marginBottom: 0}}>
                            <div className="col-6">
                                <Button className="general-washout-btn" style={{color: "#000", marginTop: 5}} onClick={() => this.handleChat(appointmentUserID)} raised fill round>Chat with Seller</Button>
                            </div>
                        </div>
                    } else if(this.state.status == "rejected") {
                        notifButton = <div className="row" style={{paddingBottom: 0, marginBottom: 0}}>
                            <Button className="general-disabled-btn" style={{color: "#EF7132", marginTop: 5}} color="orange" raised fill round>This Appointment is Rejected</Button>
                        </div>
                    } else if(this.state.status == "pending") {
                        notifButton = <div className="row" style={{paddingBottom: 0, marginBottom: 0}}>
                            <div className="col-6">
                                <Button className="general-washout-btn" style={{color: "#000", marginTop: 5}} onClick={() => this.handleChat(appointmentUserID)} raised fill round>Chat with Seller</Button>
                            </div>
                            <div className="col-6">
                                <Button className="general-disabled-btn" style={{color: "#EF7132", marginTop: 5}} raised fill round>In Review...</Button>
                            </div>
                        </div>
                    } else if(this.state.status == "finished") {
                        notifButton = <div className="row" style={{paddingBottom: 0, marginBottom: 0}}>
                            <Button className="general-disabled-btn" style={{color: "#EF7132", marginTop: 5}} raised fill round>Appointment has finished</Button>
                        </div>
                    }
                }

                let rescheduleSheet;
                if(this.state.status == "accepted") {
                    let message;
                    if(this.state.appMessage) {
                        message = <p>{this.state.appMessage}</p>
                    }

                    let spinner;
                    if(this.state.appLoading) {
                        spinner = <Spinner intent="warning" size={24} style={{ marginBottom: 10 }} />;
                    }

                    rescheduleSheet = <Dialog
                        position="bottom"
                        style={{height: 'auto', backgroundColor: "white"}}
                        backdrop
                        isOpen={this.state.isRescheduleDialogOpen}
                        onClose={() => this.setState({isDateUpdate: false, isRescheduleDialogOpen: false})}
                        title="Pick a new time to meet with buyer"
                        >
                               <div className={Classes.DIALOG_BODY}>
                                    <div className="row" style={{ marginBottom: 20 }}>
                                        <div className="col-12">
                                            <FormGroup
                                                helperText={!this.state.timeValid && "You have to pick the requested time"}
                                                intent={INTENT_PRIMARY}
                                                label={"Requested Time"}
                                                labelFor="time-input"
                                            >
                                                <DatePicker
                                                    onChange={(newDate) => this.onTimeChange(newDate)}
                                                    minDate={new Date()}
                                                    value={this.state.time}
                                                    shortcuts={true}
                                                    timePrecision={"minute"}
                                                />
                                            </FormGroup>
                                        </div>
                                        <div className="col-12">
                                            {message}
                                            {spinner}
                                            <Button onClick={() => this.rescheduleAppointment(item._id)} disabled={this.state.appLoading} style={{ width: "100%" }}>Reschedule Appointment</Button>
                                        </div>
                                    </div>
                                </div> 
                        </Dialog>
                }

                return(
                    <React.Fragment>
                        <div className="content">
                            <div className="row" style={{paddingBottom: 0, marginBottom: 10}}>
                                <a href={`/profile/${appointmentUserID}`} className="col-2 notif-img-container"><img src={avatarURL} className="avatar avatar-navbar" /></a>
                                <div className="col-10">
                                    <div className="row" style={{paddingBottom: 0, marginBottom: 0}}>
                                        <div className="col-10">
                                            <div className="text">
                                                <a href={`/profile/${appointmentUserID}`}><h6>{item.appointment_user.first_name}</h6></a>
                                            </div>
                                        </div>
                                        <div className="col-2">
                                            <div className="text">
                                                <h6>{this.state.locText}</h6>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row" style={{marginTop: 0, paddingBottom: 0, marginBottom: 0}}>
                                <ProductCardHorizontal item={item.product_detail} meeting_time={this.state.meetingTime} />
                            </div>
                            {notifButton}
                        </div>
                        {rescheduleSheet}
                    </React.Fragment>
                );
            } else {
                return '';
            }
        } else {
            return '';
        }
    }
}

export default geolocated({
    positionOptions: {
        enableHighAccuracy: true,
    },
    userDecisionTimeout: 5000,
  })(AppointmentBar);