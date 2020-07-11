import React, { Component } from "react";
import "./CitiesContainer.scss";
import Banner from "../Banner";

class CitiesContainer extends Component {

    render() {
        if(typeof(this.props.bannerSize) === "undefined") { return ""; }

        return(
            <div className="category-container">
                <div className="section-container">
                    <div className="category-title">
                        Explore by Cities
                    </div>
                </div>
                <div className="section-container" style={{ marginBottom: 12 }}>
                    <div className="category-subtitle">
                        Lorem Ipsum
                    </div>
                </div>
                <div className="row cities-row">
                    <div className="col-4">
                        <div className="content">
                            <a href="/search/ /Apparels">
                                <Banner bannerSize={this.props.bannerSize} />
                            </a>
                        </div>
                    </div>
                    <div className="col-4">
                        <div className="content">
                            <a href="/search/ /Books">
                                <Banner bannerSize={this.props.bannerSize} />
                            </a>
                        </div>
                    </div>
                    <div className="col-4">
                        <div className="content">
                            <a href="/search/ /Electronics">
                                <Banner bannerSize={this.props.bannerSize} />
                            </a>
                        </div>
                    </div>
                </div>
                <div className="row cities-row">
                    <div className="col-4">
                        <div className="content">
                            <a href="/search/ /Footwear">
                                <Banner bannerSize={this.props.bannerSize} />
                            </a>
                        </div>
                    </div>
                    <div className="col-4">
                        <div className="content">
                            <a href="/search/ /Furnitures">
                                <Banner bannerSize={this.props.bannerSize} />
                            </a>
                        </div>
                    </div>
                    <div className="col-4">
                        <div className="content">
                            <a href="/search/ /Kitchens">
                                <Banner bannerSize={this.props.bannerSize} />
                            </a>
                        </div>
                    </div>
                </div>
                <div className="row cities-row">
                    <div className="col-4">
                        <div className="content">
                            <a href="/search/ /Sports">
                                <Banner bannerSize={this.props.bannerSize} />
                            </a>
                        </div>
                    </div>
                    <div className="col-4">
                        <div className="content">
                            <a href="/search/ /Vehicles">
                                <Banner bannerSize={this.props.bannerSize} />
                            </a>
                        </div>
                    </div>
                    <div className="col-4">
                        <div className="content">
                            <a href="/search/ /White Appliances">
                                <Banner bannerSize={this.props.bannerSize} />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

export default CitiesContainer;