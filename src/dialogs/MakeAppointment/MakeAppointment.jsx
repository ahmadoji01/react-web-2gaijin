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

class MakeAppointment extends Component {
    
    
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            submitted: false,
            itemID: "",
            sellerID: "",
            isDelivery: false,
            validateInput: 0,
            isLoading: false,
            message: "",
            loading: false,
            timeValid: true,
            time: new Date(),
            isSubmitted: false,
        };
        this.submitAppointment = this.submitAppointment.bind(this);
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

        var meetingTime = new Date(this.state.time).getTime();
        var status = "pending";
        if(this.state.itemID != "") {
            var payload = {
                "status": status,
                "meeting_time": meetingTime,
                "product_id": this.state.itemID,
                "seller_id": this.state.sellerID,
                "is_delivery": this.state.isDelivery
            }
            
            var self = this;
            AuthService.refreshToken().then(() => {
                self.setState({ message: "", loading: true, timeValid: true });
                return axios
                .post(`https://go.2gaijin.com/insert_appointment`, payload, { 
                    headers: {
                        'Authorization': localStorage.getItem("access_token"),
                        'Content-Type': 'application/json'
                    }
                })
                .then(response => {
                    if(response.data.status == "Success") {
                        self.setState({ message: "Request sent to seller. You can continue your activity with us again while seller is notified", loading: false });
                        self.setState({submitted: true});
                        self.setState({ validateInput: 0 });
                        self.setState({ isSubmitted: true });
                    } else {
                        self.setState({ message: "Oops.... Something went wrong. Try again", loading: false });
                    }
                });
            })
        }
    }

    componentWillMount() {
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

export default MakeAppointment;