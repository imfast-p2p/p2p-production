import React, { Component } from 'react';
import $ from 'jquery';
import { BASEURL } from '../../../assets/baseURL';
import SystemUserSidebar from '../../SystemUserSidebar';
import { withTranslation } from 'react-i18next';
import { FaPlus } from "react-icons/fa";
import { FaCheckCircle, FaTimesCircle, FaAngleLeft, FaThumbsUp, FaRegUser, FaEdit, FaMapMarkerAlt, FaHouseUser, FaUserEdit } from "react-icons/fa";
import dashboardIcon from '../../../assets/icon_dashboard.png';
import { Link } from 'react-router-dom';
import Multiselect from 'multiselect-react-dropdown';
import * as FaIcons from "react-icons/fa";
import { confirmAlert } from "react-confirm-alert";

export class SetProductPurpose extends Component {

    constructor(props) {
        super(props)

        this.state = {
            productid: sessionStorage.getItem("productID"),
            loanpurposeid: "",

            productList: [],
            prodid: "",
            loanPurposeDefList: [],

        }

    }

    componentDidMount() {
        this.getProductPurposeinfo();
    }

    getProductdefProductinfo = () => {
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
                if (resdata.status === 'SUCCESS') {
                    console.log(resdata.msgdata)
                    this.setState({ productList: resdata.msgdata })
                } else {
                    alert("Issue: " + resdata.message);
                }
            })
    }
    productid = (event) => {
        this.setState({ prodid: event.target.value })
        console.log(this.state.prodid);
        // this.state.productList
        //     .filter((e) => e.productid == event.target.value)
        //     .map((prdt, index) => {
        //         this.getProductPurposeinfo(event.target.value);
        //     })
    }
    getProductPurposeinfo = (produid) => {
        //this.setState({ prodid: produid })
        fetch(BASEURL + `/lms/getproductpurposeinfo?productid=` + this.state.productid, {
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
                    this.setState({ loanPurposeDefList: resdata.msgdata })
                } else {
                    //alert("Issue: " + resdata.message);
                    if (resdata.code === '0102') {
                        confirmAlert({
                            message: resdata.message + ", please login again to continue.",
                            buttons: [
                                {
                                    label: "OK",
                                    onClick: () => {
                                        window.location = '/login';
                                        sessionStorage.removeItem('status')
                                        sessionStorage.clear();
                                        sessionStorage.clear();
                                    },
                                },
                            ],
                            closeOnClickOutside: false,
                        });
                    } else {
                        confirmAlert({
                            message: resdata.message,
                            buttons: [
                                {
                                    label: "OK",
                                    onClick: () => {
                                    },
                                },
                            ],
                        });
                    }
                }
            })
    }
    productPurpose = (event) => {
        this.setState({ loanpurposeid: event.target.value });
        console.log(this.state.loanpurposeid);
    }

    setProductPurpose = () => {
        fetch(BASEURL + `/lms/setproductpurposeinfo`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                productid: this.state.productid,
                loanpurposeid: this.state.loanpurposeid,

            })
        }).then(response => {
            console.log(response)
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata)
                if (resdata.status == 'Success') {
                    console.log(resdata.msgdata)
                    //alert(resdata.message);
                    confirmAlert({
                        message: resdata.message,
                        buttons: [
                            {
                                label: "Okay",
                                onClick: () => {
                                    window.location = '/productAttribute';
                                },
                            },
                        ],
                    });

                } else {
                    confirmAlert({
                        message: "Failure,Please try again later.",
                        buttons: [
                            {
                                label: "Okay",
                                onClick: () => {

                                },
                            },
                        ],
                    });
                    //alert("Issue: " + resdata.message);
                    //window.location.reload();
                }
            })
            .catch(err => {
                console.log(err.message)
            })
    }
    cancelProductPurpose = () => {
        window.location.reload();
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
            <div className="container-dashboard d-flex flex-row" id="wrapper" style={{ backgroundColor: "#f4f7fc" }}>
                <SystemUserSidebar />
                <div className="pl-3 pr-3 main-content" id="page-content-wrapper">
                    <div className="container-fluid row pt-2">
                        <div className="col-1" id="prodPurposeRef1">
                            <button style={{ marginLeft: "25px" }} onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className='col-8' id="prodPurposeRef2" style={{ marginLeft: "20px", marginTop: "5px" }}>
                            <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                <Link to="/sysUserDashboard">Home</Link> / <Link to="/productDefinition">Product List</Link> / <Link to="/productAttribute">Product Attribute</Link> / Set Product Purpose </p>
                        </div>
                        <div className='col'>

                        </div>

                        <div className="col" id="prodPurposeRef3">
                            <button style={myStyle}>
                                <Link to="/productAttribute" style={{ marginLeft: "10px" }}><FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} /><span style={{ textDecoration: "none", color: "white" }}>Back</span></Link></button>
                        </div>

                    </div>
                    <hr className="col-11" style={{ marginLeft: "50px", width: "88.6%", backgroundColor: "rgba(4,78,160,1)" }} />
                    <div className='row '>
                        <div className="col">
                            <p className="d-flex justify-content-center" style={{ fontSize: "20px", fontWeight: "bold" }}>{t('Set Product Purpose')}</p>
                        </div>
                    </div>

                    <div className="tab-content h-100">
                        <div className="register-form tab-pane fade show active">
                            <div className='' style={{ marginLeft: "15%" }}>
                                <div className="card" style={{ cursor: 'default', width: "50%" }}>
                                    <div className="card-header border-0">
                                        <div className='form-group'>
                                            <div className="row item-list align-items-center">

                                                <div className="group">
                                                    <p htmlFor="s" className="label" style={{ fontWeight: "bold", color: "rgba(5,54,82,1)" }} >{t('Product ID')} </p>
                                                    <input type="text" className="form-control" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px", textTransform: 'uppercase' }}
                                                        id="inputAddress" placeholder={t('Enter Product ID')} onChange={this.productid} value={this.state.productid}
                                                    />
                                                    {/* <select className="form-select border border-secondary" style={{ marginTop: "-5px", color: "RGBA(5,54,82,1)" }}
                                                        onChange={this.productid}>
                                                        <option defaultValue>{t('----Please Select----')}</option>
                                                        {this.state.productList.map((product, index) => (
                                                            <option key={index} value={product.productid} >{product.productid} </option>
                                                        ))
                                                        }
                                                    </select> */}
                                                </div>
                                                &nbsp;
                                                <div className="group">
                                                    <p htmlFor="s" className="label" style={{ fontWeight: "bold", color: "rgba(5,54,82,1)" }} >{t('Loan Purpose')} </p>
                                                    <select className="form-select border border-secondary" style={{ marginTop: "-5px", color: "RGBA(5,54,82,1)" }}
                                                        onChange={this.productPurpose}>
                                                        <option defaultValue>{t('----Please Select----')}</option>
                                                        {this.state.loanPurposeDefList.map((purpose, index) => (
                                                            <option key={index} value={purpose.loanpurposeid} >{purpose.loanpurpose} </option>
                                                        ))
                                                        }
                                                    </select>
                                                </div>

                                                <div className="group pt-2" style={{ textAlign: "end" }}>
                                                    <button className='btn btn-success' style={{ width: "100px" }} onClick={this.setProductPurpose}>Submit</button> &nbsp;
                                                    <button className='btn btn-info' style={{ width: "100px" }} onClick={this.cancelProductPurpose}>Cancel</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div >
                                </div >
                            </div>
                        </div>
                    </div>


                </div>
            </div>
        )
    }
}

export default withTranslation()(SetProductPurpose)