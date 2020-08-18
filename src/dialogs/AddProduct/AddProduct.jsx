import React, { Component } from "react";
import {
    Button,
    Classes,
    Divider,
    H3,
    FormGroup, 
    InputGroup,
    Spinner
} from "@blueprintjs/core";
import { INTENT_PRIMARY } from "@blueprintjs/core/lib/esm/common/classes";
import AuthService from "../../services/auth.service";
import Subscription from "../Subscription";
import axios from "axios";

import { InputNumber, TreeSelect, Upload } from 'antd';
import 'antd/dist/antd.css';
import ImgCrop from 'antd-img-crop';

import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import { getCroppedImg, resizeImg } from '../../services/imageprocessing';

class AddProduct extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            categories: [],
            selectedCategory: "",
            submitted: false,
            itemID: "",
            sellerID: "",
            isSubscribed: true,
            isDelivery: true,
            validateInput: 0,
            loading: false,
            name: "",
            brand: "",
            condition: "",
            yearsOwned: "",
            description: "",
            modelName: "",
            price: 0,
            notes: "",
            latitude: 0.0,
            longitude: 0.0,
            imgsToUpload: [],
            notesPopupOpened: false,
            nameValid: true,
            priceValid: true,
            categoryValid: true,
            imageValid: true,
            descValid: true,
            time: new Date(),
            isError: false,
        };
        this.submitItem = this.submitItem.bind(this);
        this.onNameChange = this.onNameChange.bind(this);
        this.onPriceChange = this.onPriceChange.bind(this);
        this.onCategoryChange = this.onCategoryChange.bind(this);
        this.onModelChange = this.onModelChange.bind(this);
        this.onDescriptionChange = this.onDescriptionChange.bind(this);
        this.onYearsOwnedChange = this.onYearsOwnedChange.bind(this);
        this.onConditionChange = this.onConditionChange.bind(this);
        this.onBrandChange = this.onBrandChange.bind(this);
    }

    render() {
        let message;
        if(this.state.message) {
            message = <p>{this.state.message}</p>
        }

        let spinner;
        if(this.state.loading) {
            spinner = <Spinner intent="warning" size={24} style={{ marginBottom: 10 }} />;
        }

        if(!this.state.isSubscribed) {
            return (
                <Subscription />
            );
        }

        return (
            <div className={`${Classes.DIALOG_BODY} appointment-dialog`}>
                <div className="row" style={{ marginBottom: 20 }}>
                    <div className="col-12">
                        <FormGroup
                            helperText={!this.state.nameValid && "Item's name is required"}
                            intent={INTENT_PRIMARY}
                            label={"Item's Name"}
                            labelFor="name-input"
                        >
                            <InputGroup id="name-input" value={this.state.name} onChange={this.onNameChange} placeholder="Type your item's name" intent={INTENT_PRIMARY} />
                        </FormGroup>
                    </div>
                    <div className="col-12">
                        <FormGroup
                            helperText={!this.state.categoryValid && "Category is required"}
                            intent={INTENT_PRIMARY}
                            label={"Category"}
                            labelFor="category-input"
                        >
                            <TreeSelect
                                showSearch
                                style={{ width: '100%' }}
                                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                treeData={this.state.categories}
                                placeholder="Pick a category for this item"
                                onChange={this.onCategoryChange}
                            />
                        </FormGroup>
                    </div>
                    <div className="col-12">
                        <FormGroup
                            helperText={!this.state.priceValid && "Price is required"}
                            intent={INTENT_PRIMARY}
                            label={"Price"}
                            labelFor="price-input"
                        >
                            <InputNumber
                                style={{ width: '100%' }}
                                formatter={value => `¥ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                id="price-input"
                                value={this.state.price}
                                onChange={this.onPriceChange} 
                                placeholder="How much the item costs?" />
                        </FormGroup>
                    </div>
                    <div className="col-12">
                        <FormGroup
                            intent={INTENT_PRIMARY}
                            label={"Brand Name"}
                            labelFor="brand-input"
                        >
                            <InputGroup id="brand-input" value={this.state.brand} onChange={this.onBrandChange} placeholder="What is the brand of this item?" intent={INTENT_PRIMARY} />
                        </FormGroup>
                    </div>
                    <div className="col-12">
                        <FormGroup
                            intent={INTENT_PRIMARY}
                            label={"Item's Condition"}
                            labelFor="condition-input"
                        >
                            <InputGroup id="condition-input" value={this.state.condition} onChange={this.onConditionChange} placeholder="e.g. Still functions properly" intent={INTENT_PRIMARY} />
                        </FormGroup>
                    </div>
                    <div className="col-12">
                        <FormGroup
                            intent={INTENT_PRIMARY}
                            label={"Model Name"}
                            labelFor="model-input"
                        >
                            <InputGroup id="model-input" value={this.state.modelName} onChange={this.onModelChange} placeholder="What is the model name of your item?" intent={INTENT_PRIMARY} />
                        </FormGroup>
                    </div>
                    <div className="col-12">
                        <FormGroup
                            helperText={!this.state.descValid && "Description about items is required"}
                            intent={INTENT_PRIMARY}
                            label={"Item's Description"}
                            labelFor="description-input"
                        >
                            <CKEditor
                                editor={ ClassicEditor }
                                data={this.state.description}
                                config={{toolbar: [ 'heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote' ]}}
                                placeholder='You can describe how your item looks like here!'
                                onChange={ this.onDescriptionChange }
                            />
                        </FormGroup>
                    </div>
                    <div className="col-12">
                        <FormGroup
                            helperText={!this.state.imageValid && "You have to add at least one image"}
                            intent={INTENT_PRIMARY}
                            label={"Item's Images"}
                        >
                            <ImgCrop rotate>
                                <Upload
                                    listType="picture-card"
                                    fileList={this.state.imgsToUpload}
                                    onChange={this.onChange}
                                    onPreview={this.onPreview}
                                >
                                    {this.state.imgsToUpload.length < 8 && '+ Add Image'}
                                </Upload>
                            </ImgCrop>
                        </FormGroup>
                    </div>
                    <div className="col-12">
                        {message}
                        {spinner}
                        <Button onClick={this.submitItem} disabled={this.state.loading} style={{ width: "100%" }}>Sell This Item</Button>
                    </div>
                </div>
            </div>
        );
    }

    onChange = async ({ fileList: newFileList }) => {
        var i = 0;
        for(i = 0; i < newFileList.length; i++) {
            delete newFileList[i].error;
            newFileList[i].status = "success";

            try {
                let base64Img = await readFile(newFileList[i].originFileObj);
                let resized = await resizeImg(base64Img, 800, 800);
                let thumb = await resizeImg(base64Img, 300, 300);            
                newFileList[i].imgUrl = resized;
                newFileList[i].thumbUrl = thumb;
            } catch (e) {
                console.error(e);
            }             
        }
        this.setState({ imgsToUpload: newFileList });
    };
    
    onPreview = async file => {
        let src = file.url;
        if (!src) {
          src = await new Promise(resolve => {
            const reader = new FileReader();
            reader.readAsDataURL(file.originFileObj);
            reader.onload = () => resolve(reader.result);
          });
        }
        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow.document.write(image.outerHTML);
    };

    submitItem() {
        if(!this.state.name) {
            this.setState({ nameValid: false });
            return;
        }

        if(!this.state.price) {
            this.setState({ priceValid: false });
            return;
        }

        if(!this.state.selectedCategory) {
            this.setState({ categoryValid: false });
            return;
        }

        if(this.state.imgsToUpload.length <= 0) {
            this.setState({ imageValid: false });
            return;
        }

        if(this.state.description) {
            this.setState({ descValid: false });
        }

        let imagesArray = new Array();
        for(var i = 0; i < this.state.imgsToUpload.length; i++) {
            let parts = this.state.imgsToUpload[i].imgUrl.split(';');
            let imageData = parts[1].split(',')[1];
            
            parts = this.state.imgsToUpload[i].thumbUrl.split(';');
            let thumbImageData = parts[1].split(',')[1];

            let content = { "thumb_data": thumbImageData, "image_data": imageData };
            imagesArray.push(content);
        }
        console.log(imagesArray);

        var payload = {
            "product": {
                "name": this.state.name,
                "price": this.state.price,
                "description": this.state.description,
                "category_ids": [this.state.selectedCategory],
                "latitude": parseFloat(this.state.latitude),
                "longitude": parseFloat(this.state.longitude)
            },
            "product_detail": {
                "brand": this.state.brand,
                "condition": this.state.condition,
                "years_owned": this.state.yearsOwned,
                "model_name": this.state.modelName
            },
            "product_images": imagesArray
        }
        this.setState({ message: "", loading: true, nameValid: true, imageValid: true, priceValid: true, categoryValid: true, imageValid: true });
        
        return axios.post(`https://go.2gaijin.com/add_product`, payload, {
            headers: {
                "Authorization": localStorage.getItem("access_token"),
                "Content-Type": "application/json"
            }
        }).then(response => {
            if(response.data["status"] == "Success") {
                window.location = "/product/" + response.data.data.InsertedID
                this.setState({ loading: false });
                this.$f7router.navigate("/");
            } else if(response.data.message === "Unsubscribed") {
                this.setState({ message: "You have to subscribe to start selling your item", loading: false });
            } else {
                this.setState({ message: "Something went wrong. Try again", loading: false });
            }
        });
    }

    onCategoryChange = value => {
        this.setState({ selectedCategory: value });
    };

    componentWillMount() {
        let config = {
            headers: {'Authorization': localStorage.getItem("access_token") },
        }

        axios
        .get(`https://go.2gaijin.com/get_subscription_status`, config)
        .then(response => {
            if(response.data.status == "Success") {
                var isSubscribed = response.data.data.is_subscribed;
                this.setState({ isSubscribed: isSubscribed });
            } else {
                this.setState({ isError: true });
            }
        });

        return axios
        .get(`https://go.2gaijin.com/get_categories`, {}, {})
        .then(response => {
            var fetchData = response.data.data.categories;
            var json = fetchData;
            json = JSON.parse(JSON.stringify(json).split('"name":').join('"title":'));
            json = JSON.parse(JSON.stringify(json).split('"_id":').join('"value":'));
            this.setState({categories: json});
        });
    }

    onNameChange(e) {
        this.setState({ name: e.target.value });
    }

    onModelChange(e) {
        this.setState({ modelName: e.target.value });
    }

    onBrandChange(e) {
        this.setState({ brand: e.target.value });
    }

    onYearsOwnedChange(e) {
        this.setState({ yearsOwned: e.target.value });
    }

    onDescriptionChange = ( event, editor ) => {
        //this.setState({ description: editorState });
    }

    onPriceChange = value => {
        this.setState({ price: parseInt(value) });
    }

    onConditionChange(e) {
        this.setState({ condition: e.target.value });
    }
}

function readFile(file) {
    return new Promise(resolve => {
      const reader = new FileReader()
      reader.addEventListener('load', () => resolve(reader.result), false)
      reader.readAsDataURL(file)
    })
}

export default AddProduct;