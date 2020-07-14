import React, { Component } from "react";
import NavigationBar from "../../components/NavigationBar";
import axios from "axios";
import shortid from "shortid";
import ProductCard from "../../components/ProductCard";
import TreeMenu from 'react-simple-tree-menu';
import 'react-simple-tree-menu/dist/main.css';
import "./Search.scss";

class Search extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            categories: [],
            searchterm: this.props.match.params.searchTerm,
            loading: false,
            start: 1,
            limit: 36,
            category: this.props.match.params.category,
            sortby: "relevance",
            status: "",
            priceMin: 0,
            priceMax: 75000,
            popupOpened: false,
            totalItems: 0,
            searchTitle: this.props.match.params.searchTerm,
            isLoadingPageOpen: false,
            currLat: 0.0,
            currLng: 0.0,
            cardWidth: (window.innerWidth/6) - 50, 
            cardHeight: (window.innerHeight/5) - 50,
            viewportWidth: window.innerWidth,
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
        this.setState({ cardWidth: (window.innerWidth/6) - 50 });
        this.setState({ cardHeight: (window.innerHeight/5) - 50 });
        this.setState({ viewportWidth: window.innerHeight });
    }
    
    componentWillMount() {
        var searchTerm = this.state.searchterm;
        if(searchTerm == " ") {
            searchTerm = "";
        }
        this.setState({ searchterm: searchTerm });

        var categorySearch = "";
        if(typeof(this.state.category) !== "undefined") {
            categorySearch = this.state.category;
        }
        this.setState({ category: categorySearch });

        var status = "";
        //status = "available";
        this.setState({ status: status });

        axios
        .get(`https://go.2gaijin.com/search?q=` + 
        searchTerm +
        "&category=" + categorySearch +
        "&status=" + status + 
        "&sortby=relevance" + 
        "&start=1&limit=36", {}, {})
        .then(response => {
            var fetchData = response.data.data.items;
            this.setState({data: fetchData});
            this.setState({totalItems: response.data.data.total_items});
            this.setState({ isLoadingPageOpen: false });
        });

        return axios
        .get(`https://go.2gaijin.com/get_categories`, {}, {})
        .then(response => {
            var fetchData = response.data.data.categories;
            var json = fetchData;
            json = JSON.parse(JSON.stringify(json).split('"children":').join('"nodes":'));
            json = JSON.parse(JSON.stringify(json).split('"name":').join('"label":'));
            json = JSON.parse(JSON.stringify(json).split('"_id":').join('"key":'));
            this.setState({categories: json});
        });
    }

    render() {

        let cardClassName;
        if(this.state.viewportWidth < 768) {
            cardClassName = "col-3";
        } else {
            cardClassName = "col-2dot4";
        }

        let items;
        if(this.state.data.length > 0) {
            let cardWidth = this.state.cardWidth;
            let cardHeight = this.state.cardHeight;
            items = this.state.data.map(function(item, i) {
                return <div className={cardClassName}><ProductCard key={shortid.generate()} item={item} cardWidth={cardWidth} cardHeight={cardHeight} /></div>
            });
        }

        return(
            <>
                <NavigationBar />
                <div className="row">
                    <div className="col-3" style={{ backgroundColor: "#F6FAFF", border: "1px solid #E0E5EE", paddingRight: 0 }}>
                        <h5 className="search-filter-text">Filter</h5>
                        <TreeMenu data={this.state.categories} />
                        <h5 className="search-filter-text">Price</h5>
                        <div class="bp3-input-group bp3-large price-input">
                            <span class="bp3-icon price-input">¥</span>
                            <input type="text" class="bp3-input bp3-large" placeholder="Maximum Price" />
                        </div>
                        <div class="bp3-input-group bp3-large price-input">
                            <span class="bp3-icon price-input">¥</span>
                            <input type="text" class="bp3-input bp3-large" placeholder="Minimum Price" />
                        </div>
                    </div>
                    <div className="col-9">
                        <div className="row" style={{ marginTop: 20, paddingBottom: 0, paddingLeft: 30 }}>
                            <div className="col-8">
                                <p className="search-title">Showing results of <span className="search-term">"{this.state.searchTitle}"</span> - {this.state.totalItems} item(s)</p>
                            </div>
                            <div className="col-4">
                                <p className="search-title">Showing results of <span className="search-term">"{this.state.searchTitle}"</span> - {this.state.totalItems} item(s)</p>
                            </div>
                        </div>
                        <div className="row" style={{ padding: 30, paddingTop: 0, marginTop: 0 }}>
                            {items}
                        </div>
                    </div>
                </div>
            </>
        );
    }
    
}

export default Search;