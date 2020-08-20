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
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

class ContactUs extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            isSubmitted: false,
            loading: false,
            name: "",
            email: "",
            message: "",
            submitMsg: "",
            nameValid: true,
            emailValid: true,
            msgValid: true,
        };
        this.submitTicket = this.submitTicket.bind(this);
        this.onNameChange = this.onNameChange.bind(this);
        this.onEmailChange = this.onEmailChange.bind(this);
        this.onMessageChange = this.onMessageChange.bind(this);
    }

    componentWillMount() {
        if(localStorage.getItem("first_name")) {
            this.setState({ name: localStorage.getItem("first_name") + " " + localStorage.getItem("last_name") });
        }
        if(localStorage.getItem("email")) {
            this.setState({ email: localStorage.getItem("email")});
        }
    }

    render() {

        let submitMsg;
        if(this.state.submitMsg) {
            submitMsg = <p>{this.state.submitMsg}</p>
        }

        let spinner;
        if(this.state.loading) {
            spinner = <Spinner intent="warning" size={24} style={{ marginBottom: 10 }} />;
        }

        return(
            <div className={`${Classes.DIALOG_BODY} appointment-dialog`}>
                <div className="row" style={{ marginBottom: 20 }}>
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
                            helperText={!this.state.emailValid && "Email is required"}
                            intent={INTENT_PRIMARY}
                            label={"Email Address"}
                            labelFor="email-input"
                        >
                            <InputGroup id="email-input" value={this.state.email} onChange={this.onEmailChange} placeholder="Email Address" intent={INTENT_PRIMARY} />
                        </FormGroup>
                    </div>
                    <div className="col-12">
                        <FormGroup
                            helperText={!this.state.msgValid && "Message is required"}
                            intent={INTENT_PRIMARY}
                            label={"Message"}
                            labelFor="description-input"
                        >
                            <CKEditor
                                editor={ ClassicEditor }
                                data={this.state.message}
                                config={{toolbar: [ 'heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote' ]}}
                                placeholder='Tell me what you want to know about us!'
                                onChange={ this.onMessageChange }
                            />
                        </FormGroup>
                    </div>
                    <div className="col-12">
                        {submitMsg}
                        {spinner}
                        <Button onClick={this.submitTicket} disabled={this.state.loading || this.state.isSubmitted} style={{ width: "100%" }}>Submit Ticket</Button>
                    </div>
                </div>
            </div>
        );
    }
    
    onNameChange(e) {
        this.setState({ name: e.target.value });
    }

    onEmailChange(e) {
        this.setState({ email: e.target.value });
    }

    onMessageChange = ( event, editor ) => {
        this.setState({ message: editor.getData() });
    }


    submitTicket() {
        this.setState({ submitMsg: "", loading: true });

        if(!this.state.name) {
            this.setState({ nameValid: false, loading: false });
            return;
        }

        if(!this.state.email) {
            this.setState({ emailValid: false, loading: false });
            return;
        }

        if(!this.state.message) {
            this.setState({ msgValid: false, loading: false });
            return;
        }

        var payload = {
            "name": this.state.name,
            "email": this.state.email,
            "message": this.state.message
        }
        this.setState({ submitMsg: "", loading: true, nameValid: true, emailValid: true, msgValid: true});
        
        return axios.post(`https://go.2gaijin.com/send_ticket`, payload, {})
        .then(response => {
            if(response.data["status"] == "Success") {
                this.setState({ isSubmitted: true, loading: false, submitMsg: "Your message has successfully been sent. Our admin will reach you through the email info you have provided" });
            } else if(response.data["status"] == "Error") {
                this.setState({ loading: false, submitMsg: "Whoops. Something went wrong. Try submitting again" });
            }
        });
    }

}

export default ContactUs;