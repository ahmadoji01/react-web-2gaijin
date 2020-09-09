import React, { Component } from "react";
import { Alignment, Classes, Button, Dialog, Navbar, NavbarHeading, NavbarDivider, NavbarGroup, Icon } from "@blueprintjs/core";
import "./Footer.scss";
import GaijinLogo from "../../illustrations/gaijinlogo.svg";
import AboutUs from "../../dialogs/AboutUs";
import ContactUs from "../../dialogs/ContactUs";

class Footer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            windowWidth: window.innerWidth,
            windowHeight: window.innerHeight,
            isAboutUsDialogOpen: false,
            isContactUsDialogOpen: false
        }
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
        window.addEventListener('scroll', this.onWindowScroll);
    }
    
    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
        window.addEventListener('scroll', this.onWindowScroll);
    }

    updateWindowDimensions() {
        this.setState({ windowWidth: window.innerWidth });
        this.setState({ windowHeight: window.innerHeight });
    }

    render() {
        return(
            <>
                <nav class="bp3-navbar">
                    <div style={{margin: "0 auto", width: this.state.windowWidth - 100}}>
                        <div class="bp3-navbar-group bp3-align-right">
                            <a href="/"><button class="bp3-button bp3-minimal">Home</button></a>
                            <button class="bp3-button bp3-minimal" onClick={() => this.setState({ isAboutUsDialogOpen: true })}>About Us</button>
                            <button class="bp3-button bp3-minimal" onClick={() => this.setState({ isContactUsDialogOpen: true })}>Contact Us</button>
                        </div>
                    </div>
                    <Dialog isOpen={this.state.isAboutUsDialogOpen} onClose={() => this.setState({ isAboutUsDialogOpen: false })}>
                        <AboutUs />
                    </Dialog>
                    <Dialog isOpen={this.state.isContactUsDialogOpen} onClose={() => this.setState({ isContactUsDialogOpen: false })}>
                        <ContactUs />
                    </Dialog>
                </nav>
                <div className="row footer-content">
                    <div className="col-1"></div>
                    <div className="col-3">
                        <img src={GaijinLogo} style={{ width: 240, marginBottom: 20 }} />
                        <p style={{ textAlign: "left" }}>2Gaijin.com is operated by KitaLabs Co., Ltd.</p>
                    </div>
                    <div className="col-3">
                        <h3>Contact</h3>
                        <p style={{ textAlign: "left", paddingLeft: 10 }}><Icon icon="add" iconSize={20} /> Sapporo, Hokkaido, Japan</p>
                        <p style={{ textAlign: "left", paddingLeft: 10 }}><Icon icon="phone" iconSize={20} /> Phone: (+81)80-8293-4266</p>
                        <p style={{ textAlign: "left", paddingLeft: 10 }}><Icon icon="envelope" iconSize={20} /> Email: <a href="mailto:2gaijin@kitalabs.com">2gaijin@kitalabs.com</a></p>
                    </div>
                    <div className="col-3">
                        
                    </div>
                    <div className="col-1"></div>
                </div>
            </>
        );
    }

}

export default Footer;