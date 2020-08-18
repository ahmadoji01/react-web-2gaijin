import axios from "axios";
import Cookies from 'js-cookie';

class AuthService {
    login(email, password) {
        var payload = {
            "email": email,
            "password": password,
        }
        
        return axios
        .post(`https://go.2gaijin.com/sign_in`, payload, { 
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            var resData = response.data.data;
            if(resData) {
                var data = response.data.data.user;
                localStorage.setItem("user_id", data._id);
                localStorage.setItem("first_name", data.first_name);
                localStorage.setItem("last_name", data.last_name);
                localStorage.setItem("email", data.email);
                localStorage.setItem("phone", data.phone);
                localStorage.setItem("access_token", data.authentication_token);
                localStorage.setItem("refresh_token", data.refresh_token);
                localStorage.setItem("avatar_url", data.avatar_url);
                return data;
            } else {
                return response.data;
            }
        });
    }

    oauthLogin(accessToken) {
        var payload = {
            "access_token": accessToken
        }
        
        return axios
        .post(`https://go.2gaijin.com/auth/google/callback`, payload, { 
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            var resData = response.data.data;
            if(resData) {
                var data = response.data.data.user;
                localStorage.setItem("user_id", data._id);
                localStorage.setItem("first_name", data.first_name);
                localStorage.setItem("last_name", data.last_name);
                localStorage.setItem("email", data.email);
                localStorage.setItem("phone", data.phone);
                localStorage.setItem("access_token", data.authentication_token);
                localStorage.setItem("refresh_token", data.refresh_token);
                localStorage.setItem("avatar_url", data.avatar_url);
                return data;
            } else {
                return response.data;
            }
        });
    }

    oauthFacebookLogin(id, accessToken) {
        var payload = {
            "id": id,
            "access_token": accessToken
        }
        
        return axios
        .post(`https://go.2gaijin.com/auth/facebook/callback`, payload, { 
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => {
            var resData = response.data.data;
            if(resData) {
                var data = response.data.data.user;
                localStorage.setItem("user_id", data._id);
                localStorage.setItem("first_name", data.first_name);
                localStorage.setItem("last_name", data.last_name);
                localStorage.setItem("email", data.email);
                localStorage.setItem("phone", data.phone);
                localStorage.setItem("access_token", data.authentication_token);
                localStorage.setItem("refresh_token", data.refresh_token);
                localStorage.setItem("avatar_url", data.avatar_url);
                return data;
            } else {
                return response.data;
            }
        });
    }

    logout() {
        
        return axios.post(`https://go.2gaijin.com/sign_out`, {}, {
            headers: {
                'Content-Type': 'application/json',
                "Authorization": localStorage.getItem("access_token")
            }
        }).then(response => {
            localStorage.removeItem("user_id");
            localStorage.removeItem("first_name");
            localStorage.removeItem("last_name");
            localStorage.removeItem("email");
            localStorage.removeItem("phone");
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            localStorage.removeItem("avatar_url");
        });
    }

    register(email, firstname, lastname, password) {
        var payload = {
            "email": email,
            "password": password,
            "first_name": firstname,
            "last_name": lastname
        }
        return axios.post(`https://go.2gaijin.com/sign_up`, payload, {
            headers: { 
                "Content-Type": "application/json"
            }
        }).then(response => {
            var resData = response.data.data;
            if(resData) {
                var data = response.data.data.user;
                if (data["authentication_token"]) {
                    localStorage.setItem("user_id", data._id);
                    localStorage.setItem("first_name", data.first_name);
                    localStorage.setItem("last_name", data.last_name);
                    localStorage.setItem("email", data.email);
                    localStorage.setItem("phone", data.phone);
                    localStorage.setItem("access_token", data.authentication_token);
                    localStorage.setItem("refresh_token", data.refresh_token);
                    localStorage.setItem("avatar_url", data.avatar_url);
                }
            }
            return response.data;
        });
    }

    refreshToken() {
        if(!localStorage.getItem("refresh_token")) {
            return;
        }

        return axios.post(`https://go.2gaijin.com/refresh_token`, {}, {
            headers: {
                "Authorization": localStorage.getItem("refresh_token")
            }
        }).then(response => {
            if(response.data["status"] == "Success") {
                var jsonData = response.data.data;
                localStorage.setItem("access_token", jsonData.token["auth_token"]); 
            }
            return;
        });
    }

    resetPassword(email) {
        var payload = {
            "email": email,
            "source": "desktop_web_app"
        }

        return axios.post(`https://go.2gaijin.com/reset_password`, payload, {
            headers: {
                "Content-Type": "application/json"
            }
        }).then(response => {
            var data = response.data;
            return data;
        });
    }

    updatePassword(email, password, resetToken) {
        var payload = {
            "email": email,
            "password": password,
            "reset_token": resetToken
        }

        return axios.post(`https://go.2gaijin.com/update_password`, payload, {
            headers: {
                "Content-Type": "application/json"
            }
        }).then(response => {
            var data = response.data;
            return data;
        });
    }

    getCurrentUser() {
        return localStorage.getItem("access_token");
    }
}

export default new AuthService();
