import React, { Component } from "react";
import SubscriptionIllustration from "../../illustrations/SubscriptionIllustration.png";
import { Button } from "@blueprintjs/core";
import "./Subscription.scss";
import axios from "axios";

class Subscription extends Component {

    constructor(props) {
        super(props);
        this.state = {activeClasses: [false, false, false, false, false, false], activeIndex: 0};
        this.toggleSelectedPricing = this.toggleSelectedPricing.bind(this);
        this.goToPaymentPage = this.goToPaymentPage.bind(this);
        this.sendCardPayment = this.sendCardPayment.bind(this);
    }

    toggleSelectedPricing(index) {
        var activeClasses = this.state.activeClasses;
        var i = 0;
        for(i = 0; i < activeClasses.length; i++) {
            activeClasses[i] = false;
        }
        if(activeClasses[index] == false) {
            activeClasses[index] = true;
        } else {
            activeClasses[index] = false;
        }

        this.setState({ activeClasses: activeClasses });
        this.setState({ activeIndex: index });
    }

    goToPaymentPage() {
        var activeIndex = this.state.activeIndex;
        var months = 1;
        if(activeIndex == 0) {
            months = 1;
        } else if(activeIndex == 1) {
            months = 3;
        } else if(activeIndex == 2) {
            months = 5;
        } else if(activeIndex == 3) {
            months = 7;
        } else if(activeIndex == 4) {
            months = 9;
        } else if(activeIndex == 5) {
            months = 12;
        }

        const { OmiseCard, Omise } = window;

        var charge = 100;
        var monthsSubscribed = months;
        var total = monthsSubscribed * charge;

        OmiseCard.configure({
            publicKey: "pkey_test_5kg29vvml1oqwpclafj"
        });
        Omise.setPublicKey("pkey_test_5kg29vvml1oqwpclafj");

        var self = this;
        
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
            window.location.href = "/";
        });
    }

    render() {
        let activeClasses = this.state.activeClasses;

        return (
                <div style={{height: '90%', width: '100%'}} className="justify-content-center align-items-center">
                    <div className="row" style={{ marginTop: 30, paddingBottom: 0 }}>
                        <div className="col-12">
                            <div style={{display: 'table', margin: '0 auto'}}><img style={{ maxWidth: 300 }} src={SubscriptionIllustration} /></div>
                            <div style={{fontWeight: 900, display: 'table', margin: '0 auto'}}><h4><b>Choose a subscription plan</b></h4></div>
                            <div style={{fontWeight: 700, display: 'table', margin: '0 auto'}}><p style={{ marginRight: 10, marginLeft: 10, textAlign: "center" }}><b>...and start selling your worthy-unused items today</b></p></div>
                        </div>
                    </div>
                    <div onClick={() => this.toggleSelectedPricing(0)} className={`pricing-list-item pricing-first ${activeClasses[0]? "pricing-selected" : ""}`}>
                        <div className="row pricing-item-inner">
                            <div className="col-2 align-self-center">
                            </div>
                            <div className="col-5 align-self-center">
                                <p>1 month</p>
                            </div>
                            <div className="col-3">
                                <p style={{ textAlign: "right" }}><b>¥100</b><br />total</p>
                            </div>
                            <div className="col-2">
                            </div>
                        </div>
                    </div>
                    <div onClick={() => this.toggleSelectedPricing(1)} className={`pricing-list-item ${activeClasses[1]? "pricing-selected" : ""}`}>
                        <div className="row pricing-item-inner">
                            <div className="col-2 align-self-center">
                            </div>
                            <div className="col-5 align-self-center">
                                <p>3 months</p>
                            </div>
                            <div className="col-3">
                                <p style={{ textAlign: "right" }}><b>¥300</b><br />total</p>
                            </div>
                            <div className="col-2">
                            </div>
                        </div>
                    </div>
                    <div onClick={() => this.toggleSelectedPricing(2)} className={`pricing-list-item ${activeClasses[2]? "pricing-selected" : ""}`}>
                        <div className="row pricing-item-inner">
                            <div className="col-2 align-self-center">
                            </div>
                            <div className="col-5 align-self-center">
                                <p>5 months</p>
                            </div>
                            <div className="col-3">
                                <p style={{ textAlign: "right" }}><b>¥500</b><br />total</p>
                            </div>
                            <div className="col-2">
                            </div>
                        </div>
                    </div>
                    <div onClick={() => this.toggleSelectedPricing(3)} className={`pricing-list-item ${activeClasses[3]? "pricing-selected" : ""}`}>
                        <div className="row pricing-item-inner">
                            <div className="col-2 align-self-center">
                            </div>
                            <div className="col-5 align-self-center">
                                <p>7 months</p>
                            </div>
                            <div className="col-3">
                                <p style={{ textAlign: "right" }}><b>¥700</b><br />total</p>
                            </div>
                            <div className="col-2">
                            </div>
                        </div>
                    </div>
                    <div onClick={() => this.toggleSelectedPricing(4)} className={`pricing-list-item ${activeClasses[4]? "pricing-selected" : ""}`}>
                        <div className="row pricing-item-inner">
                            <div className="col-2 align-self-center">
                            </div>
                            <div className="col-5 align-self-center">
                                <p>9 months</p>
                            </div>
                            <div className="col-3">
                                <p style={{ textAlign: "right" }}><b>¥900</b><br />total</p>
                            </div>
                            <div className="col-2">
                            </div>
                        </div>
                    </div>
                    <div onClick={() => this.toggleSelectedPricing(5)} className={`pricing-list-item pricing-last ${activeClasses[5]? "pricing-selected" : ""}`}>
                        <div className="row pricing-item-inner">
                            <div className="col-2 align-self-center">
                            </div>
                            <div className="col-5 align-self-center">
                                <p>12 months</p>
                            </div>
                            <div className="col-3">
                                <p style={{ textAlign: "right" }}><b>¥1200</b><br />total</p>
                            </div>
                            <div className="col-2">
                            </div>
                        </div>
                    </div>
                    <div style={{height: '10%', marginTop: 10, padding: 10 }}>
                        <Button className="general-btn" onClick={ this.goToPaymentPage } style={{color: '#fff'}} raised fill round>Subscribe and Start Selling</Button>
                    </div>
                </div>
        );
    }

}

export default Subscription;