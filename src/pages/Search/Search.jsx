import React, { Component } from "react";
import NavigationBar from "../../components/NavigationBar";
import axios from "axios";
import shortid from "shortid";
import ProductCard from "../../components/ProductCard";
import TreeMenu from 'react-simple-tree-menu';
import 'react-simple-tree-menu/dist/main.css';
import "./Search.scss";
import {
    Card, H3, Classes, Button
} from "@blueprintjs/core";

import { makeStyles } from '@material-ui/core/styles';
import Pagination from '@material-ui/lab/Pagination';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import EmptyIllustration from "../../illustrations/EmptyIllustration.png";
import Footer from "../../components/Footer";
import AuthService from "../../services/auth.service";
import SignIn from "../../dialogs/SignIn";

import Fab from '@material-ui/core/Fab';
import { ReactComponent as PeaceOutline} from "../../icons/PeaceOutline.svg";
import AddProduct from "../../dialogs/AddProduct";
import { Modal } from 'antd';
import { geolocated } from 'react-geolocated';

const useStyles = makeStyles((theme) => ({
    root: {
            '& > *': {
            marginTop: theme.spacing(2),
        },
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
}));

class Search extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoggedIn: false,
            data: [],
            categories: [],
            searchterm: "",
            loading: false,
            limitPerPage: 40,
            currentPage: 1,
            totalPage: 1,
            start: 1,
            limit: 40,
            category: "",
            sortby: "relevance",
            status: "",
            priceMin: null,
            priceMax: null,
            popupOpened: false,
            totalItems: 0,
            searchTitle: "",
            isLoadingPageOpen: false,
            currLat: 0.0,
            currLng: 0.0,
            cardWidth: (window.innerWidth/6) - 50, 
            cardHeight: (window.innerHeight/5) - 50,
            viewportWidth: window.innerWidth,
            noItemFound: false,
        };
        this.getItems = this.getItems.bind(this);
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.calculateTotalPage = this.calculateTotalPage.bind(this);
        this.handlePageChange = this.handlePageChange.bind(this);
        this.onMinPriceChange = this.onMinPriceChange.bind(this);
        this.onMaxPriceChange = this.onMaxPriceChange.bind(this);
        this.categoryChange = this.categoryChange.bind(this);
        this.onPriceInputBlur = this.onPriceInputBlur.bind(this);
        this.onSortChange = this.onSortChange.bind(this);
        this.onStatusChange = this.onStatusChange.bind(this);
        this.findCoordinates = this.findCoordinates.bind(this);
    }

    findCoordinates = () => {
        navigator.geolocation.getCurrentPosition(position => {
            const location = JSON.stringify(position);
            this.setState({ currLat: position.coords.latitude, currLng: position.coords.longitude });
        });
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
        this.findCoordinates();
        if(AuthService.getCurrentUser()) {
            this.setState({ isLoggedIn: true });
        }
        
        const urlParams = new URLSearchParams(this.props.location.search);
        const query = urlParams.get('q');
        const category = urlParams.get('category');
        const pricemax = urlParams.get('pricemax');
        const page = urlParams.get('page');

        let searchTerm = query;
        let sortby = urlParams.get('sortby');
        if(!sortby) {
            sortby = "relevance";
        }
        this.setState({ sortby: sortby });
        if(!query) {
            searchTerm = "";
        }
        this.setState({ searchterm: searchTerm });
        this.setState({ searchTitle: searchTerm });

        let categorySearch = category;
        if(!category) {
            categorySearch = "";
        }
        this.setState({ category: categorySearch });

        let status = urlParams.get('status');
        if(!status) {
            status = "available";
        }
        this.setState({ status: status });

        let priceMax = pricemax;
        this.setState({ priceMax: priceMax });
        if(!pricemax) {
            priceMax = 99999999999;
        }

        if(page) {
            this.setState({ currentPage: parseInt(page) });
        }

        if(!query) {
            if(category) {
                this.setState({ searchTitle: category });
            }
        } else {
            this.setState({ searchTitle: query });
        }
        
        let start = (parseInt(page) - 1) * this.state.limitPerPage + 1;
        let limit = ((parseInt(page) - 1) * this.state.limitPerPage) + this.state.limitPerPage;

        let self = this;
        axios
        .get(`https://go.2gaijin.com/search?q=` + 
        searchTerm +
        "&category=" + categorySearch +
        "&status=" + status + 
        "&sortby=" + sortby +
        "&pricemax=" + priceMax + 
        "&start="+ start + "&limit=" + limit, {}, {})
        .then(response => {
            if(response.data.status == "Success") {
                var fetchData = response.data.data.items;
                
                if(fetchData.length <= 0) {
                    this.setState({ noItemFound: true });
                } else {
                    this.setState({ noItemFound: false });
                }
                
                this.setState({data: fetchData});
                this.setState({totalItems: response.data.data.total_items}, () => { self.calculateTotalPage() });
            }
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
            
            for(var i = 0; i < json.length; i++) {
                json[i]["key"] = json[i]["label"];
            }

            this.setState({categories: json});
        });
    }

    calculateTotalPage() {
        this.setState({ totalPage: Math.ceil(this.state.totalItems / this.state.limitPerPage) });
    }

    getItems() {
        let start = (this.state.currentPage - 1) * this.state.limitPerPage + 1;
        let limit = ((this.state.currentPage - 1) * this.state.limitPerPage) + this.state.limitPerPage;

        let priceMin = this.state.priceMin, priceMax = this.state.priceMax;
        if(!priceMin) {
            priceMin = 0;
        }
        if(!priceMax) {
            priceMax = 99999999999;
        }

        let self = this;
        return axios
        .get(`https://go.2gaijin.com/search?q=` + 
        this.state.searchterm +
        "&category=" + this.state.category +
        "&status=" + this.state.status + 
        "&sortby=" + this.state.sortby + 
        "&pricemin=" + priceMin +
        "&pricemax=" + priceMax +
        "&start="+ start + "&limit=" + limit, {}, {})
        .then(response => {
            if(response.data.status == "Success") {
                var fetchData = response.data.data.items;

                if(fetchData.length <= 0) {
                    this.setState({ noItemFound: true });
                } else {
                    this.setState({ noItemFound: false });
                }

                this.setState({data: fetchData}, () => { window.scrollTo(0,0); });
                this.setState({ totalItems: response.data.data.total_items}, () => { self.calculateTotalPage(); });
            }
            this.setState({ isLoadingPageOpen: false });
        });
    }

    handlePageChange(event, value) {
        let self = this;

        let url = new URL(window.location);
        url.searchParams.set("page", value);
        window.location = url;

        this.setState({ currentPage: parseInt(value) }, () => { self.getItems()});
    }

    onSortChange(e) {
        let self = this;

        let url = new URL(window.location);
        url.searchParams.set("sortby", e.target.value);
        window.location = url;

        this.setState({ sortby: e.target.value }, () => { self.getItems()});
    }
    
    onStatusChange(e) {
        let self = this;
        
        let url = new URL(window.location);
        url.searchParams.set("status", e.target.value);
        url.searchParams.set("page", "1");
        window.location = url;

        this.setState({ status: e.target.value }, () => { self.getItems()});
    }

    onMinPriceChange(e) {
        let minPrice = parseInt(e.target.value);
        if(minPrice <= 0) { minPrice = 0 }
        this.setState({priceMin: minPrice});
    }

    onMaxPriceChange(e) {
        let maxPrice = parseInt(e.target.value);
        if(maxPrice <= 0) { maxPrice = 0 }
        this.setState({priceMax: maxPrice});
    }

    onPriceInputBlur() {
        let self = this;
        if(this.state.priceMax){
            if(this.state.priceMin) {
                if(this.state.priceMin >= this.state.priceMax) {
                    this.setState({ priceMin: self.state.priceMax }, () => { this.getItems(); });
                    return;
                }
            }
        }
        if(this.state.priceMin){
            if(this.state.priceMax) {
                if(this.state.priceMax <= this.state.priceMin) {
                    this.setState({ priceMax: self.state.priceMin }, () => { this.getItems(); });
                    return;
                }
            }
        }

        this.getItems();
    }

    categoryChange(key, name) {
        let self = this;
        
        let url = new URL(window.location);
        url.searchParams.set("category", name);
        url.searchParams.set("q", "");
        url.searchParams.set("page", "1");
        window.location = url;
        
        this.setState({ currentPage: 1 });

        this.setState({ searchTitle: name });
        this.setState({ searchterm: "" });

        this.setState({ category: name }, () => { self.getItems(); });
    }

    render() {
        let cardClassName;
        if(this.state.viewportWidth < 700) {
            cardClassName = "col-3";
        } else {
            cardClassName = "col-2dot4";
        }

        let currLat = this.state.currLat, currLng = this.state.currLng;

        let items;
        if(this.state.data.length > 0) {
            let cardWidth = this.state.cardWidth;
            let cardHeight = this.state.cardHeight;
            items = this.state.data.map(function(item, i) {
                return <div className={cardClassName}><ProductCard key={shortid.generate()} lat={currLat} lng={currLng} item={item} cardWidth={cardWidth} cardHeight={cardHeight} /></div>
            });
        }

        const classes = useStyles;

        return(
            <>
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
                <NavigationBar term={this.state.searchterm} />
                <div className="row search-container">
                    <div className="col-3" style={{ backgroundColor: "#F6FAFF", border: "1px solid #E0E5EE", paddingRight: 0 }}>
                        <h5 className="search-filter-text">Filter</h5>
                        <TreeMenu data={this.state.categories} initialActiveKey={this.state.category} onClickItem={({ key, label, ...props }) => { this.categoryChange(key, label) }} />
                        <h5 className="search-filter-text">Price</h5>
                        <div class="bp3-input-group bp3-large price-input">
                            <span class="bp3-icon price-input">¥</span>
                            <input type="number" onBlur={this.onPriceInputBlur} onChange={this.onMinPriceChange} value={this.state.priceMin} class="bp3-input bp3-large" placeholder="Minimum Price" />
                        </div>
                        <div class="bp3-input-group bp3-large price-input">
                            <span class="bp3-icon price-input">¥</span>
                            <input type="number" onBlur={this.onPriceInputBlur} onChange={this.onMaxPriceChange} value={this.state.priceMax} class="bp3-input bp3-large" placeholder="Maximum Price" />
                        </div>
                    </div>
                    <div className="col-9">
                        <div className="row" style={{ marginTop: 20, paddingBottom: 0, paddingLeft: 30, paddingRight: 30 }}>
                            { this.state.noItemFound && 
                                <Card style={{ width: "97.5%" }}>
                                    <img src={EmptyIllustration} />
                                    <H3 style={{ marginTop: 10 }}>
                                        Oops... No items found with the search term...
                                    </H3>
                                    <p>
                                        You can try with different filters and search term to yield the better search results
                                    </p>
                                </Card> 
                            }
                            { !this.state.noItemFound && <><div className="col-6">
                                <p className="search-title">Showing results of <span className="search-term">"{this.state.searchTitle}"</span> - {this.state.totalItems} item(s)</p>
                            </div>
                            <div className="col-3">
                                <FormControl variant="outlined" className={useStyles.formControl}>
                                    <InputLabel htmlFor="outlined-status-native-simple">Status</InputLabel>
                                    <Select
                                    native
                                    defaultValue={this.state.status}
                                    onChange={this.onStatusChange}
                                    inputProps={{
                                        name: 'status',
                                        id: 'outlined-status-native-simple',
                                    }}
                                    >
                                        <option value=" ">Any</option>
                                        <option value="available">Available</option>
                                        <option value="sold">Sold Out</option>
                                    </Select>
                                </FormControl>
                            </div>
                            <div className="col-3">
                                <FormControl variant="outlined" className={useStyles.formControl}>
                                    <InputLabel htmlFor="outlined-sort-native-simple">Sort By</InputLabel>
                                    <Select
                                    native
                                    onChange={this.onSortChange}
                                    defaultValue={this.state.sortby}
                                    inputProps={{
                                        name: 'sort',
                                        id: 'outlined-sort-native-simple',
                                    }}
                                    >
                                        <option value="relevance">Relevance</option>
                                        <option value="highestprice">Price: High to Low</option>
                                        <option value="lowestprice">Price: Low to High</option>
                                        <option value="newest">Date Posted: Recent to Old</option>
                                        <option value="oldest">Date Posted: Old to Recent</option>
                                    </Select>
                                </FormControl>
                            </div>
                            </>
                            }
                        </div>
                        <div className="row" style={{ padding: 30, paddingTop: 0, marginTop: 0, marginLeft: 0, marginRight: 0 }}>
                            {items}
                        </div>
                        <div className={useStyles.root} style={{ marginBottom: 20 }} >
                            <Pagination count={this.state.totalPage} variant="outlined" defaultPage={this.state.currentPage} onChange={this.handlePageChange} />
                        </div>
                    </div>
                </div>
                <Footer />
            </>
        );
    }
    
}

export default geolocated({
    positionOptions: {
        enableHighAccuracy: true,
    },
    userDecisionTimeout: 5000,
  })(Search);