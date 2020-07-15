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
    InputGroup
} from "@blueprintjs/core";
import { INTENT_PRIMARY } from "@blueprintjs/core/lib/esm/common/classes";
import AuthService from "../../services/auth.service";

class SignUp extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: "",
            emailValid: true,
            password: "",
            passwordValid: true,
            redirectTo: "/",
            valid: false,
            message: "",
            loading: false,
        };

        this.responseGoogle = this.responseGoogle.bind(this);
        this.responseFacebook = this.responseFacebook.bind(this);
        this.redirect = this.redirect.bind(this);
    }

    redirect() {
        window.location = this.state.redirectTo;
    }

    render() {
        return (
            <>
                <div className="row" style={{ marginTop: 30 }}>
                    <div className="col-12">
                        <img src={GaijinLogo} style={{ width: 240 }} />
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
                                    <InputGroup id="email-input" placeholder="Email Address" intent={INTENT_PRIMARY} />
                                </FormGroup>
                            </div>
                            <div className="col-12">
                                <FormGroup
                                    helperText={!this.state.passwordValid && "Password is required"}
                                    intent={INTENT_PRIMARY}
                                    label={"First Name"}
                                    labelFor="first-name-input"
                                >
                                    <InputGroup id="password-input" placeholder="First Name" intent={INTENT_PRIMARY} />
                                </FormGroup>
                            </div>
                            <div className="col-12">
                                <FormGroup
                                    helperText={!this.state.passwordValid && "Password is required"}
                                    intent={INTENT_PRIMARY}
                                    label={"Last Name"}
                                    labelFor="last-name-input"
                                >
                                    <InputGroup id="password-input" placeholder="Last Name" intent={INTENT_PRIMARY} />
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
                                    <InputGroup id="password-input" placeholder="Password" intent={INTENT_PRIMARY} />
                                </FormGroup>
                            </div>
                            <div className="col-12">
                                <FormGroup
                                    helperText={!this.state.passwordValid && "Password is required"}
                                    intent={INTENT_PRIMARY}
                                    label={"Confirm Password"}
                                    labelFor="confirm-password-input"
                                >
                                    <InputGroup id="confirm-password-input" placeholder="Confirm Password" intent={INTENT_PRIMARY} />
                                </FormGroup>
                            </div>
                            <div className="col-12">
                                <Button onClick={this.handleRegister.bind(this)} style={{ width: "100%" }}>Sign Up</Button>
                            </div>
                        </div>
                        <Divider />
                        <div className="row" style={{ marginTop: 15 }}>
                            <div className="col-6">
                                <GoogleLogin
                                    clientId="880692175404-smp8q2u85pehekh59lk2pj2n4t39u7ha.apps.googleusercontent.com"
                                    render={renderProps => (
                                        <Button icon={<GoogleIcon style={{ maxWidth: 24, maxHeight: 24 }} />} onClick={renderProps.onClick} style={{ width: "100%" }}>Sign In with Google</Button>
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
                                        <Button icon={<FacebookIcon style={{ maxWidth: 24, maxHeight: 24 }} />} onClick={renderProps.onClick} style={{ width: "100%" }}>Sign In with Facebook</Button>
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

    handleRegister(e) {
        e.preventDefault();

        this.setState({
            message: "",
            loading: true
        });

        if(this.state.password !== this.state.confirmPassword) {
            this.setState({ message: "Password does not match", loading: false });
            return;
        }

        if(this.state.valid) {
            var self = this;
            AuthService.register(
                this.state.email,
                this.state.firstname,
                this.state.lastname,
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

}

export default SignUp;