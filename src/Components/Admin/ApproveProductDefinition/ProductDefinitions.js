import React, { Component } from 'react';
import $ from 'jquery';
import { BASEURL } from '../../assets/baseURL';
import AdminSidebar from '../AdminSidebar';
import { withTranslation } from 'react-i18next';
import { FaPlus } from "react-icons/fa";
import { FaCheckCircle, FaTimesCircle, FaAngleLeft, FaThumbsUp, FaRegUser, FaEdit, FaMapMarkerAlt, FaHouseUser, FaUserEdit } from "react-icons/fa";
import dashboardIcon from '../../assets/icon_dashboard.png';
import { Link } from 'react-router-dom';
import Multiselect from 'multiselect-react-dropdown';
import './ProductDefinitions.css'
import openIt from '../../assets/AdminImg/openit.png'

export class ProductDefinitions extends Component {

    constructor(props) {
        super(props)

        this.state = {
            productDefLists: []
        }

    }
    componentDidMount() {
        this.getproductDefProductInfo();
    }

    getproductDefProductInfo = () => {
        fetch(BASEURL + '/lms/getproductdefproductinfo', {
            method: 'GET',
            headers: {

                'Authorization': "Bearer " + sessionStorage.getItem('token')
            }
        })
            .then(response => {
                console.log('Response:', response)
                return response.json();
            })
            .then((resdata) => {
                console.log(resdata)
                if (resdata.status.toLowerCase() === ('success')) {
                    console.log(resdata.msgdata)
                    this.setState({ productDefLists: resdata.msgdata })
                } else {
                    alert("Issue: " + resdata.message);
                }
            })
    }
    productAttribute = (productid,authorized,productname,productdesc,currencycode,membergroup) => {
        sessionStorage.setItem("productID", productid);
        sessionStorage.setItem("productAuth", authorized);
        sessionStorage.setItem("prodName",productname);
        sessionStorage.setItem("prodDesc",productdesc)
        sessionStorage.setItem("currencyCode",currencycode);
        sessionStorage.setItem("memberGrp",membergroup);
        window.location = "/productAttributes";
    }
    authorizeProduct = (productid) => {
        sessionStorage.setItem("productID", productid);
        window.location = "/authorizeProduct";
    }
    handleChange() {
        $('.text').toggle();
    }

    render() {
        const { t } = this.props
        const myStyle = {
            color: "white",
            textAlign: "center",
            textDecoration: "none",
            display: "inline-block",
            margin: "4px 2px",
            cursor: "pointer",
            fontSize: "12px",
            // height: "25px",
            width: "65px",
            border: "none",
            backgroundColor: "rgba(5,54,82,1)",
            borderRadius: "5px",
            marginLeft: "14px"
        }

        return (
            <div className="container-dashboard d-flex flex-row" id="wrapper" style={{backgroundColor:"#f4f7fc"}}>
                <AdminSidebar />
                <div className="pl-3 pr-3 main-content" id="page-content-wrapper">
                    <div className="container-fluid row pt-2">
                        <div className="col-1" id="ProductDefRes1">
                            <button style={{ marginLeft: "25px" }} onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className='col-4' id="ProductDefRes2" style={{ marginLeft: "20px", marginTop: "5px" }}>
                            <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                <Link to="/landing">Home</Link> / Product List </p>
                        </div>
                        <div className='col'>

                        </div>
                        <div className='col'>

                        </div>
                        <div className='col-3'>

                        </div>
                        <div className="col" id="ProductDefRes3">
                            <button style={myStyle}>
                                <Link to="/landing" style={{ marginLeft: "10px" }}><FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} /><span style={{ textDecoration: "none", color: "white" }}>Back</span></Link></button>
                        </div>

                    </div>
                    <hr className="col-11" style={{ marginLeft: "50px", width: "88.6%", backgroundColor: "rgba(4,78,160,1)" }} />
                    <div className='row '>
                        <div className="col">
                            <p className="d-flex justify-content-center" style={{ fontSize: "20px", fontWeight: "bold",color:"#222C70" }}>{t('Product List')}</p>
                        </div>
                    </div>

                    <div className='row pl-4' style={{ marginLeft: "20px", width: "95%", fontWeight: "400", fontSize: "15px", color: "rgba(5,54,82,1)" }}>
                        <div className='col-2'>
                            <p>{t('Product ID')}</p>
                        </div>
                        <div className='col-3' style={{ textAlign: "center" }}>
                            <p>{t('Product Name')}</p>
                        </div>
                        <div className='col-4' style={{ textAlign: "center" }}>
                            <p>{t('Product Description')}</p>
                        </div>
                        <div className='col-2' style={{ textAlign: "center" }}>
                            <p>{t('Active Status')}</p>
                        </div>
                    </div>
                    <hr className="col-11" style={{ marginLeft: "50px", width: "88.6%", marginTop: "-10px" }} />

                    <div className="">
                        {
                            this.state.productDefLists.map((lists, index) => {
                                return (
                                    <div className='col' key={index}>
                                        <div className='card border-0'
                                            style={{ marginBottom: "-10px",cursor:"default", overflow: "visible", transition: 'none', width: "95%", marginLeft: "30px", backgroundColor: (index % 2 == 0) ? 'rgba(255,255,255,1)' : 'rgba(242,242,242,1)' }}>
                                            <div className="card-header" style={{ paddingRight: "21px", paddingTop: "10px", paddingBottom: "6px", color: "rgb(5, 54, 82)" }}>
                                                <div className="row item-list align-items-center">
                                                    <div class="col-2">
                                                        <p>{lists.productid}</p>
                                                    </div>
                                                    <div class="col-3" style={{ textAlign: "center" }}>
                                                        <p>{lists.productname}</p>
                                                    </div>
                                                    <div class="col-4" style={{ textAlign: "center" }}>
                                                        <p>{lists.productdesc}</p>
                                                    </div>
                                                    <div className='col-2' style={{ textAlign: "center" }}>
                                                        <p>{lists.authorized == "0" ? <span>Inactive</span> : <span>Active</span>}</p>
                                                    </div>
                                                    <div class="col-1">
                                                        <p class="dropup">
                                                            <img src={openIt} style={{height:"35px"}}
                                                            class="btn dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"/>
                                                            &nbsp;
                                                            {/* <button type="button" style={{ backgroundColor: "rgb(40, 116, 166)", color: "white" }}
                                                                class="btn dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                                <span class="sr-only" ></span>
                                                            </button> */}
                                                            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton" style={{ marginLeft: "-160px" }}>
                                                                {/* {lists.authorized=="1"?null:<span>{lists.authorized=="0"?<a class="dropdown-item" onClick={this.authorizeProduct.bind(this, lists.productid)}>Product Launch</a>:null}</span>} */}
                                                                
                                                                <a class="dropdown-item" onClick={this.productAttribute.bind(this, lists.productid,lists.authorized,lists.productname,lists.productdesc,lists.currencycode,lists.membergroup)}>Product Attributes</a>
                                                            </div>
                                                        </p>
                                                        
                                                    </div>
                                                </div >
                                            </div >
                                        </div>
                                    </div>
                                )
                            }
                            )
                        }


                    </div>


                </div>
            </div>
        )
    }
}

export default withTranslation()(ProductDefinitions)