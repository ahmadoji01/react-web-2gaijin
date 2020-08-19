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

class UpdatePassword extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: "",
            resetToken: "",
            emailValid: true,
            password: "",
            passwordValid: true,
            confirmPassword: "",
            redirectTo: "/",
            valid: false,
            message: "",
            loading: false,
        };

        this.redirect = this.redirect.bind(this);
        this.onPasswordChange = this.onPasswordChange.bind(this);
        this.onConfirmPasswordChange = this.onConfirmPasswordChange.bind(this);
    }

    componentWillMount() {
        if(typeof(this.props.redirectTo) !== "undefined") {
            this.setState({ redirectTo: "/" + this.props.redirectTo });
        }

        if(typeof(this.props.email) !== "undefined") {
            this.setState({ email: this.props.email });
        }

        if(typeof(this.props.resetToken) !== "undefined") {
            this.setState({ resetToken: this.props.resetToken });
        }
    }

    redirect() {
        window.location.reload();
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
                        <FormGroup
                            helperText={!this.state.passwordValid && "Password is required"}
                            intent={INTENT_PRIMARY}
                            label={"Confirm Password"}
                            labelFor="confirm-password-input"
                            type="password"
                        >
                            <InputGroup type="password" id="confirm-password-input" onChange={this.onConfirmPasswordChange} placeholder="Confirm Password" intent={INTENT_PRIMARY} />
                        </FormGroup>
                    </div>
                    <div className="col-12">
                        {message}
                        {spinner}
                        <Button onClick={this.handleUpdatePassword.bind(this)} style={{ width: "100%" }}>Update Password</Button>
                    </div>
                </div>
            </div>
        );
    }

    onPasswordChange(e) {
        this.setState({ password: e.target.value });
    }

    onConfirmPasswordChange(e) {
        this.setState({ confirmPassword: e.target.value });
    }

    handleUpdatePassword(e) {
        e.preventDefault();

        this.setState({
            message: "",
            loading: true
        });

        if(this.state.password === "") {
            this.setState({ message: "Password is empty", loading: false });
            return;
        }

        if(this.state.password !== this.state.confirmPassword) {
            this.setState({ message: "Password does not match", loading: false });
            return;
        }

        var self = this;
        AuthService.updatePassword(this.state.email, this.state.password, this.state.resetToken).then(
        response => {
            this.setState({
                loading: false,
            });
            if(response.status == "Success") {
                this.setState({ message: "Your password has been successfully reset. You can try to sign in with your new password!" });
            } else {
                this.setState({ message: response.message });
            }
        });
    }


}

export default UpdatePassword;