import React, { Component } from "react";
import "./CategoriesContainer.scss";
import CategoryIcon from "../CategoryIcon";

class CategoriesContainer extends Component {

    render() {
        return(
            <div className="category-container">
                <div className="section-container">
                    <div className="category-title">
                        Explore by Categories
                    </div>
                </div>
                <div className="section-container" style={{ marginBottom: 12 }}>
                    <div className="category-subtitle">
                        Lorem Ipsum
                    </div>
                </div>
                <div className="row category-row">
                    <div className="col-4">
                        <div className="content">
                            <a href="/search/ /Apparels">
                                <CategoryIcon iconname="Apparels" iconcolor="light-red"/>
                            </a>
                        </div>
                    </div>
                    <div className="col-4">
                        <div className="content">
                            <a href="/search/ /Books">
                                <CategoryIcon iconname="Books" iconcolor="yellow"/>
                            </a>
                        </div>
                    </div>
                    <div className="col-4">
                        <div className="content">
                            <a href="/search/ /Electronics">
                                <CategoryIcon iconname="Electronics" iconcolor="purple"/>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="row category-row">
                    <div className="col-4">
                        <div className="content">
                            <a href="/search/ /Footwear">
                                <CategoryIcon iconname="Footwear"/>
                            </a>
                        </div>
                    </div>
                    <div className="col-4">
                        <div className="content">
                            <a href="/search/ /Furnitures">
                                <CategoryIcon iconname="Furnitures" iconcolor="green"/>
                            </a>
                        </div>
                    </div>
                    <div className="col-4">
                        <div className="content">
                            <a href="/search/ /Kitchens">
                                <CategoryIcon iconname="Kitchens" iconcolor="dark-purple"/>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="row category-row">
                    <div className="col-4">
                        <div className="content">
                            <a href="/search/ /Sports">
                                <CategoryIcon iconname="Sports" iconcolor="dark-red"/>
                            </a>
                        </div>
                    </div>
                    <div className="col-4">
                        <div className="content">
                            <a href="/search/ /Vehicles">
                                <CategoryIcon iconname="Vehicles" iconcolor="grey"/>
                            </a>
                        </div>
                    </div>
                    <div className="col-4">
                        <div className="content">
                            <a href="/search/ /White Appliances">
                                <CategoryIcon iconname="White Appliances" iconcolor="purple"/>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="row category-row">
                    <div className="col-4">
                        <div className="content">
                            <a href="/search/ /Miscellaneous">
                                <CategoryIcon iconname="Miscellaneous" iconcolor="dark-purple"/>
                            </a>
                        </div>
                    </div>
                    <div className="col-4">
                        <div className="content">
                            
                        </div>
                    </div>
                    <div className="col-4">
                        <div className="content">
                            
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

export default CategoriesContainer;