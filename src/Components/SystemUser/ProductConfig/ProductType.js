import React, { Component } from 'react';
import $ from 'jquery';
import { BASEURL } from '../../assets/baseURL';
import SystemUserSidebar from '../SystemUserSidebar';
import { withTranslation } from 'react-i18next';
import { FaPlus } from "react-icons/fa";
import { FaCheckCircle, FaTimesCircle, FaAngleLeft, FaThumbsUp, FaRegUser, FaEdit, FaMapMarkerAlt, FaHouseUser, FaUserEdit } from "react-icons/fa";
import dashboardIcon from '../../assets/icon_dashboard.png';
import {Link} from 'react-router-dom';

export class ProductType extends Component {

    constructor(props) {
        super(props)

        this.state = {
            lists: []
        }

    }


    componentDidMount() {
        this.getProductType()
    }
    getProductType = () => {
        fetch(BASEURL + '/lms/getproducttype', {
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
                if (resdata.status === 'SUCCESS') {
                    console.log(resdata.msgdata)
                    this.setState({ lists: resdata.msgdata })
                } else {
                    alert("Issue: " + resdata.message);
                }
            })
    }
    createProductType = () => {
        window.location = "/createProductType"
    }
    LoanPurposeGroup = () => {
        window.location = "/loanPurposeGroup"
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
            <div className="container-dashboard d-flex flex-row" id="wrapper">
                <SystemUserSidebar />
                <div className="pl-3 pr-3 main-content bg-light" id="page-content-wrapper">
                    <div className="container-fluid row pt-2" style={{ marginBottom: "-11px" }}>
                        <div className="col-1" id="">
                            <button style={{ marginLeft: "25px" }} onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className='col-4' id="" style={{ marginLeft: "20px", marginTop: "5px" }}>
                            <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                <Link to="">Home</Link> / Product Type</p>
                        </div>
                        <div className='col'>

                        </div>
                        <div className='col'>

                        </div>
                        <div className='col-3'>

                        </div>
                        <div className="col" id="">
                            <button style={myStyle}>
                                <Link to="" style={{ marginLeft: "10px" }}><FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} /><span style={{ textDecoration: "none", color: "white" }}>Back</span></Link></button>
                        </div>

                    </div>
                    <hr className="col-11" style={{ marginLeft: "50px", width: "88.6%", backgroundColor: "rgba(4,78,160,1)" }} />
                    <div className='row '>
                        <div className="col">
                            <p className="d-flex justify-content-center" style={{ fontSize: "20px", fontWeight: "bold" }}>{t('Product Type Details')}</p>
                        </div>
                    </div>

                    <div className="tab-content h-100">
                        <div className="register-form tab-pane fade show active">
                            <div className="card" style={{ cursor: 'default' }}>
                                <div className="card-header">
                                    <div className="row align-items-center" style={{ color: "rgb(5, 54, 82)", fontWeight: "bold" }}>
                                        <div className="col-2">
                                            <p>{t('Product Type')}</p>
                                        </div>
                                        <div className="col-2">
                                            <p>{t('Added By')}</p>
                                        </div>
                                        <div className="col-3">
                                            <p>{t('Product Name')}</p>
                                        </div>
                                        <div className="col-3">
                                            <p>{t('Product Description')}</p>
                                        </div>
                                        <div className="col-2">
                                            <p>{t('Added On')}</p>
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <button className='btn btn-sm float-right'
                                style={{ color: "white", backgroundColor: "rgb(40, 116, 166)" }} onClick={this.createProductType}><FaPlus />&nbsp;Create</button>
                            &nbsp;
                            <div className="">
                                {
                                    this.state.lists.map((list, index) => {
                                        return (
                                            <div key={index}>
                                                <div class="card" style={{ cursor: 'default', overflow: "visible" }}>
                                                    <div class="card-header">
                                                        <a className="">
                                                            <div class="row align-items-center" style={{ color: "rgb(5, 54, 82)" }}>
                                                                <div class="col-2">
                                                                    <p>{list.producttype}</p>
                                                                </div>
                                                                <div class="col-2">
                                                                    <p>{list.addedby}</p>
                                                                </div>
                                                                <div class="col-3">
                                                                    <p>{list.producttypename}</p>
                                                                </div>
                                                                <div class="col-3">
                                                                    <p>{list.producttypedesc}</p>
                                                                </div>
                                                                <div class="col-2">
                                                                    <span>{list.addedon}</span>
                                                                    &nbsp;
                                                                    <span class="dropup">
                                                                        <button type="button" style={{ backgroundColor: "rgb(40, 116, 166)", color: "white" }}
                                                                            class="btn dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                                            <span class="sr-only">Toggle Dropdown</span>
                                                                        </button>
                                                                        <div class="dropdown-menu" aria-labelledby="dropdownMenuButton" style={{ marginLeft: "-160px" }}>
                                                                            <a class="dropdown-item" onClick={this.LoanPurposeGroup}>Loan Purpose Group</a>
                                                                        </div>
                                                                    </span>
                                                                </div>

                                                            </div>
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })
                                }
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        )
    }
}

export default withTranslation()(ProductType)