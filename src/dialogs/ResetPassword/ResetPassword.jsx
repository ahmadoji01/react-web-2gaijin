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

class ResetPassword extends Component {

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

        this.redirect = this.redirect.bind(this);
        this.onEmailChange = this.onEmailChange.bind(this);
    }

    componentWillMount() {
        if(typeof(this.props.redirectTo) !== "undefined") {
            this.setState({ redirectTo: "/" + this.props.redirectTo });
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
                            helperText={!this.state.emailValid && "Email is required"}
                            intent={INTENT_PRIMARY}
                            label={"Email"}
                            labelFor="email-input"
                        >
                            <InputGroup id="email-input" onChange={this.onEmailChange} placeholder="Email Address" intent={INTENT_PRIMARY} />
                        </FormGroup>
                    </div>
                    <div className="col-12">
                        {message}
                        {spinner}
                        <Button onClick={this.handleResetPassword.bind(this)} style={{ width: "100%" }}>Reset Password</Button>
                    </div>
                </div>
            </div>
        );
    }

    onEmailChange(e) {
        this.setState({ email: e.target.value });
    }

    handleResetPassword(e) {
        e.preventDefault();

        this.setState({
            message: "",
            loading: true
        });

        if(this.state.email === "") {
            this.setState({ message: "Email is empty", loading: false });
            return;
        }

        var self = this;
        AuthService.resetPassword(this.state.email).then(
        response => {
            this.setState({
                loading: false,
            });
            if(response.status == "Success") {
                this.setState({ message: "A link to reset your password has been sent to your email!" });
            } else {
                this.setState({ message: response.message });
            }
        });
    }

}

export default ResetPassword;