import React, { Component } from "react";
import HalfNavbar from "../../components/HalfNavbar";
import {
    Button
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

class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            gaijinItems: [],
            windowHeight: window.innerHeight,
            windowWidth: window.innerWidth
        }; 
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    }

    componentDidMount() {
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }
    
    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }

    updateWindowDimensions() {
        this.setState({ windowWidth: window.innerWidth });
        this.setState({ windowHeight: window.innerHeight });
    }

    componentWillMount() {
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
  
        axios
        .get(`https://go.2gaijin.com/search`, config)
        .then(response => {
            if(response.data.status == "Success") { 
                this.setState({ gaijinItems: response.data.data.items });
            }
        });
    }

    render() {
        return (
            <>
                <div className="row" style={{ height: this.state.windowHeight, width: this.state.windowWidth }}>
                    <div className="col-6" >
                        <div className="row" style={{ marginLeft: 15 }}>
                            <div className="col-6 banner-container">
                                <ScrollContainer vertical className="scroll-container" style={{ height: this.state.windowHeight }}>
                                    <Banner bannerSize={(this.state.windowWidth/4) - 50} />
                                    <Banner bannerSize={(this.state.windowWidth/4) - 50} />
                                    <Banner bannerSize={(this.state.windowWidth/4) - 50} />
                                    <Banner bannerSize={(this.state.windowWidth/4) - 50} />
                                    <Banner bannerSize={(this.state.windowWidth/4) - 50} />
                                </ScrollContainer>
                            </div>
                            <div className="col-6 banner-container">
                                <ScrollContainer vertical className="scroll-container" style={{ height: this.state.windowHeight }}>
                                    <Banner bannerSize={(this.state.windowWidth/4) - 50} />
                                    <Banner bannerSize={(this.state.windowWidth/4) - 50} />
                                    <Banner bannerSize={(this.state.windowWidth/4) - 50} />
                                    <Banner bannerSize={(this.state.windowWidth/4) - 50} />
                                    <Banner bannerSize={(this.state.windowWidth/4) - 50} />
                                </ScrollContainer>
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
                                    <input className="bp3-input" type="search" style={{ height: 50, paddingLeft: 50 }} placeholder="Try Fridge, Table" dir="auto" />
                                    <Button className="large-search-btn" intent="warning">Search</Button>
                                </div>
                            </div>
                            <div className="row" style={{ margin: 0, marginLeft: 15, marginTop: 20, width: "100%" }}>
                                <Chip link="/" title="Near You" />
                                <Chip link="/" title="Washing Machine" />
                                <Chip link="/" title="Refrigerator" />
                                <Chip link="/" title="Electronics" />
                            </div>
                            <div className="row" style={{ margin: 0, marginLeft: 15, marginTop: 20, width: "100%" }}>
                                <h4 style={{ fontWeight: 600, textAlign: "left" }}>Have a question about 2Gaijin? <a href="/" style={{ color: "#E75B15" }}>Contact us!</a></h4>
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
            </>
        );
    }

}

export default Home;