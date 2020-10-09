import React, { Component } from "react";
import "./AcceptAppointment.scss";
import {
    Button,
    Classes,
    Divider,
    H3,
    FormGroup, 
    InputGroup,
    Spinner
} from "@blueprintjs/core";
import { INTENT_PRIMARY } from "@blueprintjs/core/lib/esm/common/classes";
import AuthService from "../../services/auth.service";
import axios from "axios";
import { DatePicker } from "@blueprintjs/datetime";

class AcceptAppointment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            submitted: false,
            validateInput: 0,
            loading: false,
            timeValid: true,
            time: new Date(),
            isSubmitted: false,
        };
        this.acceptAppointment = this.acceptAppointment.bind(this);
        this.onTimeChange = this.onTimeChange.bind(this);
    }

    render() {
        if(typeof(this.props.productID) === "undefined") {
            return "";
        }

        let message;
        if(this.state.message) {
            message = <p>{this.state.message}</p>
        }

        let spinner;
        if(this.state.loading) {
            spinner = <Spinner intent="warning" size={24} style={{ marginBottom: 10 }} />;
        }

        return (
            <div className={`${Classes.DIALOG_BODY} appointment-dialog`}>
                <div className="row" style={{ marginBottom: 20 }}>
                    <div className="col-12">
                        <h5>Pick your time to meet with this buyer</h5>
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
                        <Button onClick={() => this.acceptAppointment(this.props.appointmentID)} disabled={this.state.loading || this.state.isSubmitted} style={{ width: "100%" }}>Accept This Request</Button>
                    </div>
                </div>
            </div>
        );
    }

    acceptAppointment(appointmentID) {
        var payload = {
            "_id": appointmentID,
            "status": "accepted",
        }

        this.setState({ message: "" });
        this.setState({ loading: true });

        axios.post(`https://go.2gaijin.com/confirm_appointment`, payload, {
            headers: {
                "Authorization": localStorage.getItem("access_token")
            }
        }).then(response => {
            if(response.data["status"] == "Success") {
                var jsonData = response.data.data;
                this.setState({ status: "accepted" });
                
                payload = {
                    "_id": appointmentID,
                    "meeting_time": new Date(this.state.time).getTime()
                }

                return axios.post(`https://go.2gaijin.com/reschedule_appointment`, payload, {
                    headers: {
                        "Authorization": localStorage.getItem("access_token")
                    }
                }).then(response => {
                    this.setState({ loading: false, message: response.data.message });
                    if(response.data["status"] == "Success") {
                        var jsonData = response.data.data;
                        this.setState({ isAppointmentAccepted: true });
                        this.setState({ loading: false });
                        this.setState({ meetingTime: jsonData.meeting_time });
                        this.setState({ message: "You have successfully accepted this request" });
                        this.setState({ isSubmitted: true });
                    }
                });
            } else {
                this.setState({ message: response.data["message"] });
                this.setState({ loading: false });
            }
        });
    }

    componentWillMount() {
        this.setState({ name: localStorage.getItem("first_name") + " " + localStorage.getItem("last_name") });
        this.setState({ email: localStorage.getItem("email") });
        this.setState({ phoneNumber: localStorage.getItem("phone") });

        fetch('https://go.2gaijin.com/products/' + this.props.productID)
        .then((response) => response.json())
        .then((responseJson) => {
            const jsonData = responseJson.data;
            this.setState({ data: jsonData});
            this.setState({ itemID: jsonData.item._id });
            this.setState({ sellerID: jsonData.seller._id });
        })
        .catch((error) => {
            console.error(error);
        });
    }

    onTimeChange(e) {
        this.setState({ time: e });
    }
}

export default AcceptAppointment;