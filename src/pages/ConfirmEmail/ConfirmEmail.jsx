import React, { Component } from "react";
import axios from "axios";

class ConfirmEmail extends Component {

    componentDidMount() {
        var url_string = window.location.href;
        var url = new URL(url_string);
        var email = url.searchParams.get("email");
        var token = url.searchParams.get("token");
        
        let config = {
            headers: {'Authorization': localStorage.getItem("access_token") },
            params: {
              email: email,
              confirm_token: token
            }
        }

        var self = this;
        return axios
        .get(`https://go.2gaijin.com/confirm_email`, config)
        .then(response => {
            if(response.data.status == "Success") {
                window.location.href = "/?email_confirm_success=true";
            } else {
                window.location.href = "/?email_confirm_success=false";
            }
        });
    }

    render() {
        return(<div />);
    }
    
}

export default ConfirmEmail;