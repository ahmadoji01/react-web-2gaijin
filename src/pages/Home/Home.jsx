import React, { Component } from "react";
import HalfNavbar from "../../components/HalfNavbar";
import NavigationBar from "../../components/NavigationBar";
import {
    Button,
    Classes,
    Dialog,
    H5
} from "@blueprintjs/core";
import "./Home.scss";
import HomeBg from "../../illustrations/homebg.svg";
import Chip from "../../components/Chip";
import Banner from "../../components/Banner";
import ScrollContainer from 'react-indiana-drag-scroll';
import ProductSlider from "../../components/ProductSlider";
import CategoriesContainer from "../../components/CategoriesContainer";
import CitiesContainer from "../../components/CitiesContainer";
import ProductTabs from "../../components/ProductTabs";
import axios from "axios";
import Footer from "../../components/Footer";
import AuthService from "../../services/auth.service";

import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import { ReactComponent as PeaceOutline} from "../../icons/PeaceOutline.svg";
import AddProduct from "../../dialogs/AddProduct";
import { Modal } from 'antd';
import SignIn from "../../dialogs/SignIn";
import UpdatePassword from "../../dialogs/UpdatePassword";
import ContactUs from "../../dialogs/ContactUs";

import AutoScroll from '@brianmcallister/react-auto-scroll';

import AdsBanner1 from "../../illustrations/ad_2gaijin_01.jpg";
import AdsBanner2 from "../../illustrations/ad_2gaijin_02.jpg";
import AdsBanner3 from "../../illustrations/ad_2gaijin_03.jpg";
import AdsBanner4 from "../../illustrations/ad_2gaijin_04.jpg";
import AdsBanner5 from "../../illustrations/ad_2gaijin_05.jpg";
import AdsBanner6 from "../../illustrations/ad_2gaijin_06.jpg";

const useStyles = makeStyles((theme) => ({
    root: {
        backgroundColor: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        '& > *': {
            margin: theme.spacing(1),
        },
    },
    extendedIcon: {
        marginRight: theme.spacing(1),
    },
}));

class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            gaijinItems: [],
            windowHeight: window.innerHeight,
            windowWidth: window.innerWidth,
            searchTerm: "",
            navbarShow: false,
            isAddProductOpen: false,
            isLoggedIn: false,
            isUpdatePassOpen: false,
            isContactDialogOpen: false,
            isEmailConfirmSuccessOpen: false, 
            isEmailConfirmFailOpen: false, 
            email: "",
            resetToken: "",
        };
        this.searchTermChange = this.searchTermChange.bind(this);
        this.searchSubmit = this.searchSubmit.bind(this); 
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.onWindowScroll = this.onWindowScroll.bind(this);
        this.showUpdatePassword = this.showUpdatePassword.bind(this);
        this.bannerAutoScroll = this.bannerAutoScroll.bind(this);
    }

    showUpdatePassword() {
        var field = 'email';
        var field2 = 'reset_password_token';
        var url = window.location.href;
        if(url.indexOf('?' + field + '=') != -1 || url.indexOf('&' + field + '=') != -1) {
            if(url.indexOf('?' + field2 + '=') != -1 || url.indexOf('&' + field2 + '=') != -1) {
                const queryString = window.location.search;
                const urlParams = new URLSearchParams(queryString);
                this.setState({ isUpdatePassOpen: true, email: urlParams.get("email"), resetToken: urlParams.get("reset_password_token") });
            }
        }
    }

    componentDidMount() {
        this.showUpdatePassword();

        var url = window.location.href;
        var getUrl = new URL(url);
        var emailConfirmSuccess = getUrl.searchParams.get("email_confirm_success");
        if(emailConfirmSuccess === "true") {
            this.setState({ isEmailConfirmSuccessOpen: true });
        } else if(emailConfirmSuccess === "false")  {
            this.setState({ isEmailConfirmFailOpen: true });
        }

        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
        window.addEventListener('scroll', this.onWindowScroll);

        let el = document.getElementById("banner-container-1");
        this.bannerAutoScroll();
    }
    
    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
        window.addEventListener('scroll', this.onWindowScroll);
    }

    updateWindowDimensions() {
        this.setState({ windowWidth: window.innerWidth });
        this.setState({ windowHeight: window.innerHeight });
    }

    onWindowScroll() {
        if(window.scrollY > this.state.windowHeight/2) {
            this.setState({ navbarShow: true });
        } else {
            this.setState({ navbarShow: false });
        }
    }

    componentWillMount() {
        if(AuthService.getCurrentUser()) {
            this.setState({ isLoggedIn: true });
        }

        fetch('https://go.2gaijin.com/')
        .then((response) => response.json())
        .then((responseJson) => {
            const jsonData = responseJson.data;
            this.setState({ data: jsonData});
        })
        .catch((error) => {
            console.error(error);
        });

        let config = {
            headers: { },
            params: {
              start: 1,
              limit: 8,
              userid: "5da95727697d19f3f01f62b6",
              status: "available",
              sortby: "newest"
            }
        }

        AuthService.refreshToken();
  
        axios
        .get(`https://go.2gaijin.com/search`, config)
        .then(response => {
            if(response.data.status == "Success") { 
                this.setState({ gaijinItems: response.data.data.items });
            }
        });
    }

    searchTermChange(e) {
        this.setState({ searchTerm: e.target.value });
    }

    searchSubmit(e) {
        e.preventDefault();
        window.location = "/search?q=" + this.state.searchTerm;
    }

    bannerAutoScroll() {
        let direction = 1;
        let delay = 25;
        let speed = 10;
        
        let direction2 = 1;
        let speed2 = 20;

        let el1 = document.getElementById("banner-container-1");    
        let el2 = document.getElementById("banner-container-2");
        el2.scrollTop = 50;
        function loop() {
            el1.scrollTop = el1.scrollTop + (direction * speed);
            if(el1.scrollTop >= 265) {
                direction = -1;
            } else if(el1.scrollTop <= 0) {
                direction = 1;
            }

            el2.scrollTop = el2.scrollTop + (direction2 * speed2);
            if(el2.scrollTop >= 265) {
                direction2 = -1;
            } else if(el2.scrollTop <= 0) {
                direction2 = 1;
            }

            setTimeout( loop, delay );
        }
        
        loop();
    }

    render() {
        const classes = useStyles;

        return (
            <>
                <Dialog 
                    isOpen={this.state.isEmailConfirmSuccessOpen} 
                    onClose={() => this.setState({isEmailConfirmSuccessOpen: false})}
                    title="Email Confirmation Successful">
                        <div className={Classes.DIALOG_BODY}><H5>Your email has successfully been confirmed!</H5></div>
                </Dialog>
                <Dialog 
                    isOpen={this.state.isEmailConfirmFailOpen} 
                    onClose={() => this.setState({isEmailConfirmFailOpen: false})}
                    title="Email Confirmation Failed">
                        <div className={Classes.DIALOG_BODY}><H5>Whoops. Something went wrong when confirming your email</H5></div>
                </Dialog>
                <Dialog 
                    isOpen={this.state.isUpdatePassOpen} 
                    onClose={() => this.setState({isUpdatePassOpen: false})}
                    title="Update your password">
                        <UpdatePassword email={this.state.email} resetToken={this.state.resetToken} />
                </Dialog>
                { this.state.isLoggedIn && <div className="fab-container">
                    <Fab variant="extended" size="large" color="secondary" onClick={() => this.setState({ isAddProductOpen: true })}>
                        <PeaceOutline className={classes.extendedIcon} />
                        Start Selling
                    </Fab>
                    <Modal
                    title="Add Your Product"
                    visible={this.state.isAddProductOpen}
                    onOk={this.handleOk}
                    onCancel={() => this.setState({ isAddProductOpen: false })}
                    footer={null}
                    >
                        <AddProduct />
                    </Modal>
                </div>}
                { !this.state.isLoggedIn && <div className="fab-container">
                    <Fab variant="extended" size="large" color="secondary" onClick={() => this.setState({ isAddProductOpen: true })}>
                        <PeaceOutline className={classes.extendedIcon} />
                        Start Selling
                    </Fab>
                    <Modal
                    title="Sign In"
                    visible={this.state.isAddProductOpen}
                    onOk={this.handleOk}
                    onCancel={() => this.setState({ isAddProductOpen: false })}
                    >
                        <SignIn />
                    </Modal>
                </div>}
                { this.state.navbarShow && <NavigationBar /> }
                <div className="row" style={{ height: this.state.windowHeight, width: "100%" }}>
                    <div className="col-6" >
                        <div className="row" style={{ marginLeft: 15 }}>
                            <div className="col-6 banner-container">
                                <div id="banner-container-1" className="banner-scroll-container" style={{height: this.state.windowHeight, overflow: "auto", scrollBehavior: "smooth", pointerEvents: "auto"}}>
                                    <Banner url="https://jobkita.jp" imgURL={AdsBanner1} bannerSize={(this.state.windowWidth/4) - 50} />
                                    <Banner url="/order_delivery" imgURL={AdsBanner2} bannerSize={(this.state.windowWidth/4) - 50} />
                                    <Banner url="https://jobkita.jp" imgURL={AdsBanner3} bannerSize={(this.state.windowWidth/4) - 50} />
                                    </div>
                            </div>
                            <div className="col-6 banner-container">
                                <div id="banner-container-2" className="banner-scroll-container" style={{height: this.state.windowHeight, overflow: "auto", scrollBehavior: "smooth", pointerEvents: "auto"}}>
                                    <Banner url="https://kitalabs.com" imgURL={AdsBanner4} bannerSize={(this.state.windowWidth/4) - 50} />
                                    <Banner url="/order_delivery" imgURL={AdsBanner5} bannerSize={(this.state.windowWidth/4) - 50} />
                                    <Banner url="https://jobkita.jp" imgURL={AdsBanner6} bannerSize={(this.state.windowWidth/4) - 50} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-6" style={{ position: "relative" }}>
                        <HalfNavbar />
                        <div className="row">
                            <div className="row" style={{ margin: 0, marginLeft: 15 }}>
                                <h1 style={{ fontWeight: 600, fontSize: 64, textAlign: "left", margin: 0 }}>Secondhand<br/> Platform<br/> for Gaijin</h1>
                            </div>
                            <div className="row" style={{ margin: 0, marginLeft: 15, marginTop: 20 }}>
                                <h4 style={{ fontWeight: 600, textAlign: "left", color: "grey" }}>Easily buy and sell secondhand stuffs</h4>
                            </div>
                            <div className="row" style={{ margin: 0, marginLeft: 15, marginTop: 20, width: "100%" }}>
                                <div className="bp3-input-group .bp3-large" style={{ width: "85%" }}>
                                    <span className="bp3-icon bp3-icon-search" style={{ fontSize: 24, paddingTop: 5, paddingLeft: 10, color: "#9BACCE" }}></span>
                                    <form onSubmit={this.searchSubmit}><input className="bp3-input" onChange={this.searchTermChange} type="search" style={{ height: 50, paddingLeft: 50 }} placeholder="Try Fridge, Table" dir="auto" /></form>
                                    <Button className="large-search-btn" intent="warning" onClick={this.searchSubmit} >Search</Button>
                                </div>
                            </div>
                            <div className="row" style={{ margin: 0, marginLeft: 15, marginTop: 20, width: "100%" }}>
                                <Chip link="/search?q=Washing Machine" title="Washing Machine" />
                                <Chip link="/search?q=Refrigerator" title="Refrigerator" />
                                <Chip link="/search?category=Electronics" title="Electronics" />
                            </div>
                            <div className="row" style={{ margin: 0, marginLeft: 15, marginTop: 20, width: "100%" }}>
                                <h4 style={{ fontWeight: 600, textAlign: "left" }}>Have a question about 2Gaijin? <a onClick={() => this.setState({ isContactDialogOpen: true })} style={{ color: "#E75B15" }}>Contact us!</a></h4>
                                <Dialog isOpen={this.state.isContactDialogOpen} onClose={() => this.setState({ isContactDialogOpen: false })}>
                                    <ContactUs />
                                </Dialog>
                            </div>
                        </div>
                        <div className="row" style={{ position:"absolute", bottom: 0, left: 30, width: "100%" }}>
                            <img src={HomeBg} style={{ width: (this.state.windowWidth/2) - 40 }} />
                        </div>
                    </div>
                </div>
                <div className="row" style={{ marginTop: 50, width: "100%" }}>
                    <ProductSlider title="2Gaijin's Picks" subtitle="Some items we'd love to share with fellow gaijins" items={this.state.gaijinItems} label="Featured" />
                </div>
                <div className="row custom-container" style={{ marginTop: 50, width: "100%" }}>
                    <div className="col-12">
                        <CategoriesContainer />
                    </div>
                </div>
                <div className="row custom-container" style={{ marginTop: 50, width: "100%" }}>
                    <ProductTabs />
                </div>
                <Footer />
            </>
        );
    }

}

export default Home;