import React, { Component } from "react";
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
import { tuple } from "antd/lib/_util/type";

class MakeAppointmentWithDelivery extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            submitted: false,
            itemID: "",
            sellerID: "",
            isDelivery: true,
            validateInput: 0,
            loading: false,
            name: "",
            message: "",
            email: "",
            phoneNumber: "",
            destination: "",
            wechat: "",
            facebook: "",
            notes: "",
            notesPopupOpened: false,
            emailValid: true,
            phoneValid: true,
            timeValid: true,
            destinationValid: true,
            nameValid: true,
            time: new Date(),
            isSubmitted: false,
        };
        this.submitAppointment = this.submitAppointment.bind(this);
        this.onDestinationChange = this.onDestinationChange.bind(this);
        this.onNotesChange = this.onNotesChange.bind(this);
        this.onEmailChange = this.onEmailChange.bind(this);
        this.onFacebookChange = this.onFacebookChange.bind(this);
        this.onNameChange = this.onNameChange.bind(this);
        this.onPhoneNumberChange = this.onPhoneNumberChange.bind(this);
        this.onWeChatChange = this.onWeChatChange.bind(this);
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
                        <FormGroup
                            helperText={!this.state.nameValid && "Full name is required"}
                            intent={INTENT_PRIMARY}
                            label={"Name"}
                            labelFor="name-input"
                        >
                            <InputGroup id="name-input" value={this.state.name} onChange={this.onNameChange} placeholder="Full Name" intent={INTENT_PRIMARY} />
                        </FormGroup>
                    </div>
                    <div className="col-12">
                        <FormGroup
                            intent={INTENT_PRIMARY}
                            label={"Email Address"}
                            labelFor="email-input"
                        >
                            <InputGroup id="email-input" value={this.state.email} onChange={this.onEmailChange} placeholder="Email Address" intent={INTENT_PRIMARY} />
                        </FormGroup>
                    </div>
                    <div className="col-12">
                        <FormGroup
                            helperText={!this.state.phoneValid && "Phone Number is required"}
                            intent={INTENT_PRIMARY}
                            label={"Phone Number"}
                            labelFor="phone-number-input"
                        >
                            <InputGroup id="phone-number-input" value={this.state.phoneNumber} onChange={this.onPhoneNumberChange} placeholder="Phone Number" intent={INTENT_PRIMARY} />
                        </FormGroup>
                    </div>
                    <div className="col-12">
                        <FormGroup
                            intent={INTENT_PRIMARY}
                            label={"WeChat ID (optional)"}
                            labelFor="wechat-input"
                        >
                            <InputGroup id="notes-input" value={this.state.wechat} onChange={this.onWeChatChange} placeholder="WeChat ID" intent={INTENT_PRIMARY} />
                        </FormGroup>
                    </div>
                    <div className="col-12">
                        <FormGroup
                            intent={INTENT_PRIMARY}
                            label={"Facebook (optional)"}
                            labelFor="facebook-input"
                        >
                            <InputGroup id="facebook-input" value={this.state.facebook} onChange={this.onFacebookChange} placeholder="Link to your facebook account" intent={INTENT_PRIMARY} />
                        </FormGroup>
                    </div>
                    <div className="col-12">
                        <FormGroup
                            helperText={!this.state.destinationValid && "Destination is required"}
                            intent={INTENT_PRIMARY}
                            label={"Destination"}
                            labelFor="destination-input"
                        >
                            <InputGroup id="destination-input" value={this.state.destination} onChange={this.onDestinationChange} placeholder="Where the item should be delivered?" intent={INTENT_PRIMARY} />
                        </FormGroup>
                    </div>
                    <div className="col-12">
                        <FormGroup
                            intent={INTENT_PRIMARY}
                            label={"Notes (e.g. Other Items to be Delivered or Special Requests)"}
                            labelFor="notes-input"
                        >
                            <InputGroup id="notes-input" value={this.state.notes} onChange={this.onNotesChange} placeholder="Add your additional requests separated by comma (,)" intent={INTENT_PRIMARY} />
                        </FormGroup>
                    </div>
                    <div className="col-12">
                        {message}
                        {spinner}
                        <Button onClick={this.submitAppointment} disabled={this.state.loading || this.state.isSubmitted} style={{ width: "100%" }}>Submit Request</Button>
                    </div>
                </div>
            </div>
        );
    }

    submitAppointment() {
        if(!this.state.time) {
            this.setState({ timeValid: false });
            return;
        }

        if(!this.state.destination) {
            this.setState({ destinationValid: false });
            return;
        }

        if(!this.state.email) {
            this.setState({ emailValid: false });
            return;
        }

        if(!this.state.phoneNumber) {
            this.setState({ phoneValid: false });
            return;
        }
        
        if(!this.state.name) {
            this.setState({ nameValid: false });
            return;
        }

        var meetingTime = new Date(this.state.time).getTime();
        var status = "pending";
        if(this.state.itemID != "") {
            var payload = {
                "appointment": {
                    "status": status,
                    "meeting_time": meetingTime,
                    "product_id": this.state.itemID,
                    "seller_id": this.state.sellerID,
                    "is_delivery": this.state.isDelivery
                },
                "delivery": {
                    "destination": this.state.destination,
                    "name": this.state.name,
                    "email": this.state.email,
                    "phone": this.state.phoneNumber,
                    "wechat": this.state.wechat,
                    "facebook": this.state.facebook,
                    "notes": this.state.notes
                }
            }
            
            var self = this;
            AuthService.refreshToken().then(() => {
                self.setState({ message: "", loading: true, emailValid: true, phoneValid: true, nameValid: true, timeValid: true, destinationValid: true  });
                return axios
                .post(`https://go.2gaijin.com/insert_appointment_with_delivery`, payload, { 
                    headers: {
                        'Authorization': localStorage.getItem("access_token"),
                        'Content-Type': 'application/json'
                    }
                })
                .then(response => {
                    if(response.data.status == "Success") {
                        self.setState({ message: "Request sent to seller and delivery partner. You can continue your activity with us again while seller and our delivery partners are notified", loading: false });
                        self.setState({ submitted: true });
                        self.setState({ validateInput: 0 });
                        self.setState({ isSubmitted: true });
                    } else {
                        self.setState({ message: response.data.message, loading: false });
                    }
                });
            })
        }
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

    onNameChange(e) {
        this.setState({ name: e.target.value });
    }

    onEmailChange(e) {
        this.setState({ email: e.target.value });
    }

    onPhoneNumberChange(e) {
        this.setState({ phoneNumber: e.target.value });
    }

    onWeChatChange(e) {
        this.setState({ wechat: e.target.value });
    }

    onFacebookChange(e) {
        this.setState({ facebook: e.target.value });
    }

    onDestinationChange(e) {
        this.setState({ destination: e.target.value });
    }

    onNotesChange(e) {
        this.setState({ notes: e.target.value });
    }

    onTimeChange(e) {
        this.setState({ time: e });
    }
}

export default MakeAppointmentWithDelivery;