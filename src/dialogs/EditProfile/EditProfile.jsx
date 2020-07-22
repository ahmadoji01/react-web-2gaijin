import React, { Component } from "react";
import AuthService from "../../services/auth.service";
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import { ReactComponent as FacebookIcon  } from "../../icons/FacebookIcon.svg";
import { ReactComponent as GoogleIcon } from "../../icons/GoogleIcon.svg";
import "./EditProfile.scss";
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

import { DateInput } from "@blueprintjs/datetime";
import "@blueprintjs/datetime/lib/css/blueprint-datetime.css";
import axios from "axios";

class EditProfile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            firstName: "",
            firstNameValid: true,
            lastName: "",
            email: "",
            emailValid: true,
            phoneNumber: "",
            birthday: "",
            shortBio: "",
            paypal: "",
            wechat: "",
            bankAccountNumber: "",
            bankAccountName: "",
            bankName: "",
            cod: false,
            redirectTo: "/",
            valid: false,
            message: "",
            loading: false,
        };

        this.updateProfile = this.updateProfile.bind(this);
        this.redirect = this.redirect.bind(this);
        this.onFirstNameChange = this.onFirstNameChange.bind(this);
        this.onLastNameChange = this.onLastNameChange.bind(this);
        this.onEmailChange = this.onEmailChange.bind(this);
        this.onPhoneNumberChange = this.onPhoneNumberChange.bind(this);
        this.onBirthdayChange = this.onBirthdayChange.bind(this);
        this.onShortBioChange = this.onShortBioChange.bind(this);
    }

    componentWillMount() {
        AuthService.refreshToken();

        if(typeof(this.props.redirectTo) !== "undefined") {
            this.setState({ redirectTo: "/" + this.props.redirectTo });
        }

        this.setState({ firstName: this.props.editProfile.first_name });
        this.setState({ lastName: this.props.editProfile.last_name });
        this.setState({ email: this.props.editProfile.email });
        this.setState({ phoneNumber: this.props.editProfile.phone });
        this.setState({ shortBio: this.props.editProfile.short_bio });
        this.setState({ birthday: new Date(this.props.editProfile.date_of_birth) });
    }

    redirect() {
        window.location = this.state.redirectTo;
    }

    render() {
        if(typeof(this.props.editProfile) === "undefined") {
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
                    <div className="col-12" style={{ marginBottom: 20 }}>
                        <H3>Sign In to 2Gaijin</H3>
                    </div>
                    <div className="col-12">
                        <FormGroup
                            helperText={!this.state.firstNameValid && "First name is required"}
                            intent={INTENT_PRIMARY}
                            label={"First Name"}
                            labelFor="first-name-input"
                        >
                            <InputGroup id="first-name-input" value={this.state.firstName} onChange={this.onFirstNameChange} placeholder="First Name" intent={INTENT_PRIMARY} />
                        </FormGroup>
                    </div>
                    <div className="col-12">
                        <FormGroup
                            intent={INTENT_PRIMARY}
                            label={"Last Name"}
                            labelFor="last-name-input"
                        >
                            <InputGroup id="last-name-input" value={this.state.lastName} onChange={this.onLastNameChange} placeholder="Last Name" intent={INTENT_PRIMARY} />
                        </FormGroup>
                    </div>
                    <div className="col-12">
                        <FormGroup
                            helperText={!this.state.emailValid && "Email is required"}
                            intent={INTENT_PRIMARY}
                            label={"Email"}
                            labelFor="email-input"
                        >
                            <InputGroup id="email-input" value={this.state.email} onChange={this.onEmailChange} placeholder="Email Address" intent={INTENT_PRIMARY} />
                        </FormGroup>
                    </div>
                    <div className="col-12">
                        <FormGroup
                            helperText={!this.state.emailValid && "Email is required"}
                            intent={INTENT_PRIMARY}
                            label={"Phone Number"}
                            labelFor="phone-number-input"
                        >
                            <InputGroup id="phone-number-input" value={this.state.phoneNumber} onChange={this.onPhoneNumberChange} placeholder="Phone Number" intent={INTENT_PRIMARY} />
                        </FormGroup>
                    </div>
                    <div className="col-12">
                        <FormGroup
                            helperText={!this.state.emailValid && "Email is required"}
                            intent={INTENT_PRIMARY}
                            label={"Short Bio"}
                            labelFor="short-bio-input"
                        >
                            <InputGroup id="short-bio-input" value={this.state.shortBio} onChange={this.onShortBioChange} placeholder="Describe yourself shortly" intent={INTENT_PRIMARY} />
                        </FormGroup>
                    </div>
                    <div className="col-12">
                        <FormGroup
                            intent={INTENT_PRIMARY}
                            label={"Birthday"}
                            labelFor="birthday-input"
                        >
                            <DateInput formatDate={date => date.toLocaleString()} 
                                onChange={this.onBirthdayChange}
                                parseDate={str => new Date(str)}
                                minDate={new Date(1920, 1, 1, 12, 0, 0, 0)}
                                placeholder={"M/D/YYYY"}
                                id="birthday-input" value={this.state.birthday}  />
                        </FormGroup>
                    </div>
                    <div className="col-12">
                        {message}
                        {spinner}
                        <Button onClick={this.updateProfile.bind(this)} style={{ width: "100%" }}>Update Profile</Button>
                    </div>
                </div>
            </div>
        );
    }

    onFirstNameChange(e) {
        this.setState({ firstName: e.target.value });
    }
    
    onLastNameChange(e) {
        this.setState({ lastName: e.target.value });
    }

    onEmailChange(e) {
        this.setState({ email: e.target.value });
    }
    
    onPhoneNumberChange(e) {
        this.setState({ phoneNumber: e.target.value });
    }
    
    onBirthdayChange(e) {
        this.setState({ birthday: e });
    }
    
    onShortBioChange(e) {
        this.setState({ shortBio: e.target.value });
    }

    updateProfile(e) {
        e.preventDefault();
        
        if(!localStorage.getItem("access_token")) { return; }

        this.setState({
            message: "",
            loading: true
        });

        if(this.state.firstName === "") {
            this.setState({ message: "First name is empty", loading: false });
            return;
        }

        if(this.state.email === "") {
            this.setState({ message: "Email is empty", loading: false });
            return;
        }

        var birthday = new Date(this.state.birthday).getTime();
        var payload = {
            "first_name": this.state.firstName,
            "last_name": this.state.lastName,
            "phone": this.state.phoneNumber,
            "email": this.state.email,
            "short_bio": this.state.shortBio,
            "date_of_birth": birthday
        }

        let self = this;
        return axios.post(`https://go.2gaijin.com/update_profile`, payload, {
            headers: {
                'Content-Type': 'application/json',
                "Authorization": localStorage.getItem("access_token")
            }
        }).then(response => {
            if(response.data.status === "Success") {
                self.setState({ message: "Profile successfully updated", loading: false });
            } else {
                self.setState({ message: "Some errors occured, try again", loading: false });
            }
        });
    }

}

export default EditProfile;