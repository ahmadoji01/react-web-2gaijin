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

class ContactUs extends Component {
    
    render() {
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
                            intent={INTENT_PRIMARY}
                            label={"Email Address"}
                            labelFor="email-input"
                        >
                            <InputGroup id="email-input" value={this.state.email} onChange={this.onEmailChange} placeholder="Email Address" intent={INTENT_PRIMARY} />
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
                        {message}
                        {spinner}
                        <Button onClick={this.submitDelivery} disabled={this.state.loading} style={{ width: "100%" }}>Submit Delivery Request</Button>
                    </div>
                </div>
            </div>
        );
    }

}

export default ContactUs;