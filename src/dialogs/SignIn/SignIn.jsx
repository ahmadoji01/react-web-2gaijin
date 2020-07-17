import React, { Component } from "react";
import AuthService from "../../services/auth.service";
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props';
import { ReactComponent as FacebookIcon  } from "../../icons/FacebookIcon.svg";
import { ReactComponent as GoogleIcon } from "../../icons/GoogleIcon.svg";
import "./SignIn.scss";
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

class SignIn extends Component {

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
        this.onEmailChange = this.onEmailChange.bind(this);
        this.onPasswordChange = this.onPasswordChange.bind(this);
    }

    componentWillMount() {
        if(typeof(this.props.redirectTo) !== "undefined") {
            this.setState({ redirectTo: "/" + this.props.redirectTo });
        }
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
            <div className={Classes.DIALOG_BODY}>
                <div className="row" style={{ marginBottom: 20 }}>
                    <div className="col-12" style={{ marginBottom: 20 }}>
                        <H3>Sign In to 2Gaijin</H3>
                    </div>
                    <div className="col-12">
                        <FormGroup
                            helperText={!this.state.emailValid && "Email is required"}
                            intent={INTENT_PRIMARY}
                            label={"Email"}
                            labelFor="email-input"
                        >
                            <InputGroup id="email-input" onChange={this.onEmailChange} placeholder="Email Address" intent={INTENT_PRIMARY} />
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
                            <InputGroup type="password" id="password-input" onChange={this.onPasswordChange} placeholder="Password" intent={INTENT_PRIMARY} />
                        </FormGroup>
                    </div>
                    <div className="col-12">
                        {message}
                        {spinner}
                        <Button onClick={this.handleLogin.bind(this)} style={{ width: "100%" }}>Sign In</Button>
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
            </div>
        );
    }

    onEmailChange(e) {
        this.setState({ email: e.target.value });
    }
    
    onPasswordChange(e) {
        this.setState({ password: e.target.value });
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

    handleLogin(e) {
        e.preventDefault();

        this.setState({
            message: "",
            loading: true
        });

        if(this.state.email === "") {
            this.setState({ message: "Email is empty", loading: false });
            return;
        }
        
        if(this.state.password === "") {
            this.setState({ message: "Password is empty", loading: false });
            return;
        }

        var self = this;
        AuthService.login(this.state.email, this.state.password).then(
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

export default SignIn;