import React, { Component } from "react";

class Payment extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
        }
        this.sendCardPayment = this.sendCardPayment.bind(this);
        this.sendKonbiniPayment = this.sendKonbiniPayment.bind(this);
    }

    componentDidMount() {
        const { OmiseCard, Omise } = window;

        var charge = 100;
        var monthsSubscribed = parseInt(this.props.months);
        var total = monthsSubscribed * charge;

        OmiseCard.configure({
            publicKey: "pkey_test_5kg29vvml1oqwpclafj"
        });
        Omise.setPublicKey("pkey_test_5kg29vvml1oqwpclafj");

        var self = this;
        
        var creditCardBtn = document.querySelector("#creditCardBtn");
        creditCardBtn.addEventListener("click", (event) => {
            event.preventDefault();
            OmiseCard.open({
                amount: total,
                currency: "JPY",
                defaultPaymentMethod: "credit_card",
                onCreateTokenSuccess: (nonce) => {
                    if (nonce.startsWith("tokn_")) {
                        self.sendCardPayment(total, nonce, monthsSubscribed);
                    } else {
                        //form.omiseSource.value = nonce;
                    };
                }
            });
        });
    }

    sendCardPayment(amount, tokenString, monthsSubscribed) {
        var payload = {
            "amount": amount,
            "currency": "jpy",
            "token": tokenString,
            "months_subscribed": monthsSubscribed,
        }

        return axios.post(`https://go.2gaijin.com/credit_card_payment`, payload, {
            headers: {
                "Authorization": localStorage.getItem("access_token")
            }
        }).then(response => {
            console.log(response.data);
        });
    }

    render() {
        
    }
}

export default Payment;