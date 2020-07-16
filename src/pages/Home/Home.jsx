import React, { Component } from "react";
import HalfNavbar from "../../components/HalfNavbar";
import NavigationBar from "../../components/NavigationBar";
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
            windowWidth: window.innerWidth,
            searchTerm: "",
            navbarShow: false,
        };
        this.searchTermChange = this.searchTermChange.bind(this);
        this.searchSubmit = this.searchSubmit.bind(this); 
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.onWindowScroll = this.onWindowScroll.bind(this);
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

    onWindowScroll() {
        if(window.scrollY > this.state.windowHeight/2) {
            this.setState({ navbarShow: true });
        } else {
            this.setState({ navbarShow: false });
        }
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

    searchTermChange(e) {
        this.setState({ searchTerm: e.target.value });
    }

    searchSubmit(e) {
        e.preventDefault();
        window.location = "/search?q=" + this.state.searchTerm;
    }

    render() {
        return (
            <>
                { this.state.navbarShow && <NavigationBar /> }
                <div className="row" style={{ height: this.state.windowHeight, width: this.state.windowWidth }}>
                    <div className="col-6" >
                        <div className="row" style={{ marginLeft: 15 }}>
                            <div className="col-6 banner-container">
                                <ScrollContainer vertical className="scroll-container" style={{ height: this.state.windowHeight }}>
                                    <Banner imgURL="https://marketplace.canva.com/EAD7RZBpky0/1/0/400w/canva-blue-and-white-gaming-logo-N-0-xW64Gwc.jpg" bannerSize={(this.state.windowWidth/4) - 50} />
                                    <Banner imgURL="https://media.gettyimages.com/vectors/happy-thanksgiving-day-square-banner-vector-illustration-vector-id860471696" bannerSize={(this.state.windowWidth/4) - 50} />
                                    <Banner imgURL="https://en.pimg.jp/048/726/450/1/48726450.jpg" bannerSize={(this.state.windowWidth/4) - 50} />
                                    <Banner imgURL="https://static.vecteezy.com/system/resources/previews/000/663/703/non_2x/students-learning-together-square-banner-vector.jpg" bannerSize={(this.state.windowWidth/4) - 50} />
                                </ScrollContainer>
                            </div>
                            <div className="col-6 banner-container">
                                <ScrollContainer vertical className="scroll-container" style={{ height: this.state.windowHeight }}>
                                    <Banner imgURL="https://media.gettyimages.com/vectors/happy-thanksgiving-day-square-banner-vector-illustration-vector-id860471696" bannerSize={(this.state.windowWidth/4) - 50} />
                                    <Banner imgURL="https://en.pimg.jp/048/726/450/1/48726450.jpg" bannerSize={(this.state.windowWidth/4) - 50} />
                                    <Banner imgURL="https://static.vecteezy.com/system/resources/previews/000/663/703/non_2x/students-learning-together-square-banner-vector.jpg" bannerSize={(this.state.windowWidth/4) - 50} />
                                    <Banner imgURL="https://marketplace.canva.com/EAD7RZBpky0/1/0/400w/canva-blue-and-white-gaming-logo-N-0-xW64Gwc.jpg" bannerSize={(this.state.windowWidth/4) - 50} />
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