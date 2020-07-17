import React, { Component } from "react";
import GaijinLogo from "../../illustrations/gaijinlogo.svg";
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import { ReactComponent as FacebookIcon  } from "../../icons/FacebookIcon.svg";
import { ReactComponent as GoogleIcon } from "../../icons/GoogleIcon.svg";
import ConfirmedIllustration from "../../illustrations/ConfirmedIllustration.png";
import {
    Card, H3, Classes, Button,
    Divider,
    FormGroup, 
    InputGroup,
    Spinner
} from "@blueprintjs/core";
import { INTENT_PRIMARY, INTENT_WARNING } from "@blueprintjs/core/lib/esm/common/classes";
import AuthService from "../../services/auth.service";

class SignUp extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: "",
            emailValid: true,
            password: "",
            confirmPassword: "",
            firstName: "",
            lastName: "",
            passwordValid: true,
            confirmPasswordValid: true,
            firstNameValid: true,
            redirectTo: "/",
            valid: false,
            message: "",
            loading: false,
        };

        this.responseGoogle = this.responseGoogle.bind(this);
        this.responseFacebook = this.responseFacebook.bind(this);
        this.redirect = this.redirect.bind(this);
        this.handleRegister = this.handleRegister.bind(this);
        this.onConfirmPasswordChange = this.onConfirmPasswordChange.bind(this);
        this.onEmailChange = this.onEmailChange.bind(this);
        this.onFirstNameChange = this.onFirstNameChange.bind(this);
        this.onLastNameChange = this.onLastNameChange.bind(this);
        this.onPasswordChange = this.onPasswordChange.bind(this);
    }

    redirect() {
        window.location = this.state.redirectTo;
    }

    render() {

        let message;
        if(this.state.message) {
            message = <p>{this.state.message}</p>
        }

        let spinner;
        if(this.state.loading) {
            spinner = <Spinner intent="warning" size={24} style={{ marginBottom: 10 }} />;
        }

        return (
            <>
                <div className="row" style={{ marginTop: 30 }}>
                    <div className="col-12">
                        <a href="/"><img src={GaijinLogo} style={{ width: 240 }} /></a>
                    </div>
                </div>
                <div className="row" style={{ marginTop: 70 }}>
                    <div className="col-6" >
                        <div class="bp3-card no-shadow" style={{ width: "80%", marginLeft: 80 }}>
                            <img src={ConfirmedIllustration} style={{ maxWidth: 400, maxHeight: 400 }} />
                            <h3 class="bp3-heading" style={{ marginTop: 10 }}>Sign up with us!</h3>
                            <p>And engage yourself on 2Gaijin community to enjoy the benefits of trading your secondhand items...</p>
                        </div>
                    </div>
                    <div className="col-6" style={{ textAlign: "left" }}>
                        <Card elevation={2} style={{ width: "75%", marginLeft: 80, boxShadow: 0, border: 0 }} >
                        <div className="row" style={{ marginBottom: 20 }}>
                            <div className="col-12" style={{ marginBottom: 20, textAlign: "center" }}>
                                <H3>Sign Up to 2Gaijin</H3>
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
                                    helperText={!this.state.firstNameValid && "First Name is required"}
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
                                    helperText={!this.state.passwordValid && "Password is required"}
                                    intent={INTENT_PRIMARY}
                                    label={"Password"}
                                    labelFor="password-input"
                                    type="password"
                                >
                                    <InputGroup type="password" id="password-input" value={this.state.password} onChange={this.onPasswordChange} placeholder="Password" intent={INTENT_PRIMARY} />
                                </FormGroup>
                            </div>
                            <div className="col-12">
                                <FormGroup
                                    helperText={!this.state.confirmPasswordValid && "Password is not the same"}
                                    intent={INTENT_PRIMARY}
                                    label={"Confirm Password"}
                                    labelFor="confirm-password-input"
                                    type="password"
                                >
                                    <InputGroup type="password" id="confirm-password-input" value={this.state.confirmPassword} onChange={this.onConfirmPasswordChange} placeholder="Confirm Password" intent={INTENT_PRIMARY} />
                                </FormGroup>
                            </div>
                            <div className="col-12">
                                {spinner}
                                {message}
                                <Button onClick={this.handleRegister} disabled={this.state.loading} style={{ width: "100%" }}>Sign Up</Button>
                            </div>
                        </div>
                        <Divider />
                        <div className="row" style={{ marginTop: 15 }}>
                            <div className="col-6">
                                <GoogleLogin
                                    clientId="880692175404-smp8q2u85pehekh59lk2pj2n4t39u7ha.apps.googleusercontent.com"
                                    render={renderProps => (
                                        <Button icon={<GoogleIcon style={{ maxWidth: 24, maxHeight: 24 }} />} onClick={renderProps.onClick} style={{ width: "100%" }}>Sign Up with Google</Button>
                                    )}
                                    onSuccess={this.responseGoogle}
                                    onFailure={this.responseGoogle}
                                    cookiePolicy={'single_host_origin'}
                                />
                            </div>
                            <div className="col-6">
                                <FacebookLogin
                                    appId="936813033337153"
                                    autoLoad
                                    fields="name,first_name,last_name,email,picture"
                                    render={renderProps => (
                                        <Button icon={<FacebookIcon style={{ maxWidth: 24, maxHeight: 24 }} />} onClick={renderProps.onClick} style={{ width: "100%" }}>Sign Up with Facebook</Button>
                                    )}
                                    callback={() => this.responseFacebook} 
                                />
                            </div>
                        </div>
                        </Card> 
                    </div>
                </div>
            </>
        );
    }

    redirect() {
        window.location = "/";
    }

    responseGoogle = (response) => {
        if(typeof(response.accessToken) !== "undefined") {
            var accessToken = response.accessToken;
            var self = this;
            AuthService.oauthLogin(accessToken).then(
            response => {
                if(!localStorage.getItem("access_token")) {
                    this.setState({
                        loading: false,
                        message: response.message
                    });
                } else {
                    self.redirect();
                }
            });
        }
    }

    responseFacebook = (response) => {
        console.log(response);
        if(typeof(response.accessToken) !== "undefined") {
            var accessToken = response.accessToken;
            var id = response.id;
            var self = this;
            AuthService.oauthFacebookLogin(id, accessToken).then(
            response => {
                if(!localStorage.getItem("access_token")) {
                    this.setState({
                        loading: false,
                        message: response.message
                    });
                } else {
                    self.redirect();
                }
            });
        }
    }

    onFirstNameChange(e) {
        this.setState({ firstName: e.target.value });
    }

    onLastNameChange(e) {
        this.setState({ lastName: e.target.value });
    }
    
    onPasswordChange(e) {
        this.setState({ password: e.target.value });
    }
    
    onConfirmPasswordChange(e) {
        this.setState({ confirmPassword: e.target.value });
    }

    onEmailChange(e) {
        this.setState({ email: e.target.value });
    }

    handleRegister(e) {
        e.preventDefault();

        console.log(this.state.email);
        console.log(this.state.firstName);
        console.log(this.state.lastName);
        console.log(this.state.password);
        console.log(this.state.confirmPassword);

        this.setState({
            message: "",
            loading: true,
            firstNameValid: true,
            passwordValid: true
        });

        if(this.state.firstName == "") {
            this.setState({ firstNameValid: false });
            return;
        }

        if(this.state.password == "") {
            this.setState({ passwordValid: false });
            return;
        }

        if(this.state.password !== this.state.confirmPassword) {
            this.setState({ message: "Password does not match", loading: false });
            return;
        }


        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if ( !re.test(this.state.email) ) {
            console.log(this.state.password);
            this.setState({ emailValid: false });
            return;
        }
        
        var self = this;
        AuthService.register(
            this.state.email,
            this.state.firstName,
            this.state.lastName,
            this.state.password
        ).then( response => {
            if(localStorage.getItem("access_token")) {
                this.setState({
                    message: response.message,
                    loading: false
                });
                self.redirect();
            } else {
                this.setState({
                    message: response.message,
                    loading: false
                });
            }
        });
    }

}

export default SignUp;