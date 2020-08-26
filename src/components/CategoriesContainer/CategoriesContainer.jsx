import React, { Component } from "react";
import "./CategoriesContainer.scss";
import CategoryIcon from "../CategoryIcon";

class CategoriesContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            iconSize: (window.innerWidth/15),
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
        this.setState({ iconSize: (window.innerWidth/15) });
    } 

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
                        See items based on the category
                    </div>
                </div>
                <div className="row category-row">
                    <div className="content">
                        <a href="/search?category=Apparels">
                            <CategoryIcon iconname="Apparels" iconcolor="light-red" iconsize={this.state.iconSize}/>
                        </a>
                    </div>
                    <div className="content">
                        <a href="/search?category=Books">
                            <CategoryIcon iconname="Books" iconcolor="yellow" iconsize={this.state.iconSize}/>
                        </a>
                    </div>
                    <div className="content">
                        <a href="/search?category=Electronics">
                            <CategoryIcon iconname="Electronics" iconcolor="purple" iconsize={this.state.iconSize}/>
                        </a>
                    </div>
                    <div className="content">
                        <a href="/search?category=Footwear">
                            <CategoryIcon iconname="Footwear" iconsize={this.state.iconSize}/>
                        </a>
                    </div>
                    <div className="content">
                        <a href="/search?category=Furnitures">
                            <CategoryIcon iconname="Furnitures" iconcolor="green" iconsize={this.state.iconSize}/>
                        </a>
                    </div>
                    <div className="content">
                        <a href="/search?category=Kitchens">
                            <CategoryIcon iconname="Kitchens" iconcolor="dark-purple" iconsize={this.state.iconSize}/>
                        </a>
                    </div>
                    <div className="content">
                        <a href="/search?category=Sports">
                            <CategoryIcon iconname="Sports" iconcolor="dark-red" iconsize={this.state.iconSize}/>
                        </a>
                    </div>
                    <div className="content">
                        <a href="/search?category=Vehicles">
                            <CategoryIcon iconname="Vehicles" iconcolor="grey" iconsize={this.state.iconSize}/>
                        </a>
                    </div>
                    <div className="content">
                        <a href="/search?category=White Appliances">
                            <CategoryIcon iconname="White Appliances" iconcolor="purple" iconsize={this.state.iconSize}/>
                        </a>
                    </div>
                    <div className="content">
                        <a href="/search?category=Miscellaneous">
                            <CategoryIcon iconname="Miscellaneous" iconcolor="dark-purple" iconsize={this.state.iconSize}/>
                        </a>
                    </div>
                </div>
            </div>
        );
    }

}

export default CategoriesContainer;