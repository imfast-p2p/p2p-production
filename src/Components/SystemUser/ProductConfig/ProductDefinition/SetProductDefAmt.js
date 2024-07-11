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

var amtisActive = "0";
export class SetProductDefAmt extends Component {

    constructor(props) {
        super(props)

        this.state = {
            productid: sessionStorage.getItem("productID"),
            defloanamt: "",
            maxloanamt: "",
            minloanamt: "",
            loanamtmultiple: "",
            multipledisbursals: "",
            topup: "",
        }
    }
    componentDidMount() {
        if (sessionStorage.getItem("defAmt")) {
            amtisActive = sessionStorage.getItem("defAmt");
            console.log("Active: ", amtisActive);
        }
        this.getProductDefamtInfo();
    }
    getProductDefamtInfo = () => {
        fetch(BASEURL + `/lms/getproductdefamtinfo?productid=` + sessionStorage.getItem('productID') +
            '&productname=' + sessionStorage.getItem("prodName") + '&isactive=' + amtisActive, {
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
                    this.setState({ defloanamt: resdata.msgdata.defloanamt })
                    this.setState({ loanamtmultiple: resdata.msgdata.loanamtmultiple })
                    this.setState({ maxloanamt: resdata.msgdata.maxloanamt })
                    this.setState({ minloanamt: resdata.msgdata.minloanamt })
                    this.setState({ multipledisbursals: resdata.msgdata.multipledisbursals })
                    this.setState({ topup: resdata.msgdata.topup })
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
                        // confirmAlert({
                        //     message: resdata.message,
                        //     buttons: [
                        //         {
                        //             label: "OK",
                        //             onClick: () => {
                        //             },
                        //         },
                        //     ],
                        // });
                    }
                }
            })
    }

    prodId = (event) => {
        this.setState({ productid: event.target.value.toLocaleUpperCase() })
    }
    defloanamt = (event) => {
        this.setState({ defloanamt: event.target.value })
    }
    maximumloanAmt = (event) => {
        this.setState({ maxloanamt: event.target.value })
    }
    minimumloanamt = (event) => {
        this.setState({ minloanamt: event.target.value })
    }
    loanAmtmultiple = (event) => {
        this.setState({ loanamtmultiple: event.target.value })
    }
    multipledisbursals = (event) => {
        this.setState({ multipledisbursals: event.target.value })
    }
    topup = (event) => {
        this.setState({ topup: event.target.value })
    }
    setProductDefAmt = () => {
        var pID = this.state.productid;
        var defAmt = this.state.defloanamt;
        var maxLoan = this.state.maxloanamt;
        var minLoan = this.state.minloanamt;
        var loanmul = this.state.loanamtmultiple;
        var mulDis = this.state.multipledisbursals;
        var Tp = this.state.topup;

        if (pID == "" ||
            defAmt == "" ||
            maxLoan == "" ||
            minLoan == "" ||
            loanmul == "" ||
            mulDis == "" ||
            Tp == "") {
            confirmAlert({
                message: "Invalid inputs.",
                buttons: [
                    {
                        label: "OK",
                        onClick: () => {

                        },
                    },
                ],
            });
        } else {
            fetch(BASEURL + `/lms/setproductdefamtinfo`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer " + sessionStorage.getItem('token')
                },
                body: JSON.stringify({
                    productid: this.state.productid,
                    defloanamt: this.state.defloanamt,
                    maxloanamt: this.state.maxloanamt,
                    minloanamt: this.state.minloanamt,
                    loanamtmultiple: this.state.loanamtmultiple,
                    multipledisbursals: this.state.multipledisbursals,
                    topup: this.state.topup,
                    productname: sessionStorage.getItem("prodName"),
                    isedited: "1"
                })
            }).then(response => {
                console.log(response)
                return response.json();
            })
                .then((resdata) => {
                    console.log(resdata)
                    if (resdata.status == 'Success') {
                        console.log(resdata.msgdata)
                        // alert(resdata.message);
                        // window.location = "/productAttribute";
                        confirmAlert({
                            message: resdata.message,
                            buttons: [
                                {
                                    label: "OK",
                                    onClick: () => {
                                        window.location = '/productAttribute';
                                    },
                                },
                            ],
                        });
                    } else {
                        confirmAlert({
                            message: resdata.message,
                            buttons: [
                                {
                                    label: "OK",
                                    onClick: () => {
                                        // window.location.reload();
                                    },
                                },
                            ],
                        });
                    }
                })
                .catch(err => {
                    console.log(err.message)
                })
        }
    }
    cancelProductDefAmt = () => {
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
                        <div className="col-1" id="prodAmtRef1">
                            <button style={{ marginLeft: "25px" }} onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className='col-8' id="prodAmtRef2" style={{ marginLeft: "20px", marginTop: "5px" }}>
                            <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                <Link to="/sysUserDashboard">Home</Link> / <Link to="/productDefinition">Product List</Link> / <Link to="/productAttribute">Product Attribute</Link>/ Set Product Definition Amount </p>
                        </div>
                        <div className='col'>

                        </div>

                        <div className="col" id="prodAmtRef3">
                            <button style={myStyle}>
                                <Link to="/productAttribute" style={{ marginLeft: "10px" }}><FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} /><span style={{ textDecoration: "none", color: "white" }}>Back</span></Link></button>
                        </div>

                    </div>
                    <hr className="col-11" style={{ marginLeft: "50px", width: "88.6%", backgroundColor: "rgba(4,78,160,1)", marginTop: "0px" }} />

                    <div className="tab-content">
                        <div className="register-form tab-pane fade show active">
                            <div className='' >
                                <div className="card" style={{ cursor: 'default', marginLeft: "50px", width: "92%", overflow: "visible" }}>
                                    <div className="card-header border-1 bg-white">
                                        <div className='row' style={{ paddingLeft: "3px" }}>
                                            <div className='col-6' id='headingRef'>
                                                <div className="two__image" style={{ paddingLeft: "10px" }}>
                                                    <p className="text-white" style={{ paddingBottom: "6px", fontWeight: "600" }}>Set Product Definition Amount</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-4">
                                                <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Product ID *')}</p>
                                                <input type="text" className="form-control" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px", textTransform: 'uppercase' }}
                                                    id="inputAddress" placeholder={t('Enter Product ID')} value={this.state.productid} readOnly
                                                />
                                            </div>
                                            <div className="form-group col-md-4">
                                                <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Default Loan Amount *')}</p>
                                                <input type="number" className="form-control" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}
                                                    id="inputAddress" placeholder={t('Enter Loan Amount')} onChange={this.defloanamt} value={this.state.defloanamt}
                                                />
                                            </div>
                                            <div className="form-group col-md-4">
                                                <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Maximum Loan Amount *')}</p>
                                                <input type="number" className="form-control" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}
                                                    id="inputAddress" placeholder={t('Enter Maximum Loan Amount')} onChange={this.maximumloanAmt} value={this.state.maxloanamt}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-4">
                                                <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Minimum Loan Amount *')}</p>
                                                <input type="number" className="form-control" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}
                                                    id="inputAddress" placeholder={t('Enter Minimum Loan Amount')} onChange={this.minimumloanamt} value={this.state.minloanamt}
                                                />
                                            </div>
                                            <div className="form-group col-md-4">
                                                <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Loan Amount Multiple *')}</p>
                                                <input type="number" className="form-control" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}
                                                    id="inputAddress" placeholder={t('Enter Amount In Multiple')} onChange={this.loanAmtmultiple} value={this.state.loanamtmultiple}
                                                />
                                            </div>
                                            <div className="form-group col-md-4">
                                                <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Multiple Disbursals *')}</p>
                                                <select id="inputState" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }} className="form-select" onChange={this.multipledisbursals} >
                                                    {this.state.multipledisbursals ? <option>{this.state.multipledisbursals == 1 ? "Allowed" : "Not Allowed"}</option> : <option defaultValue>Select</option>}
                                                    <option value="1">Yes</option>
                                                    <option value="0">No</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-4">
                                                <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Topup *')}</p>
                                                <select id="inputState" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }} className="form-select" onChange={this.topup} >
                                                    {this.state.topup ? <option>{this.state.topup == 1 ? "Topup Allowed" : "Topup Not Allowed"}</option> : <option defaultValue>Select</option>}
                                                    <option value="1">Topup Allowed</option>
                                                    <option value="0">Topup Not Allowed</option>
                                                </select>

                                            </div>
                                        </div>
                                        <hr />
                                        <div className="form-row" style={{ textAlign: "center" }}>
                                            <div className="form-group col">
                                                <button type="button" className="btn mr-2 text-white btn-sm" style={{ backgroundColor: "rgb(136, 189, 72)", width: "90px" }}
                                                    onClick={this.setProductDefAmt}  >Submit</button>
                                                <button type="button" className="btn text-white btn-sm" style={{ backgroundColor: "#0079BF", width: "90px" }}
                                                    onClick={this.cancelProductDefAmt}>{t('Cancel')}</button>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        )
    }
}

export default withTranslation()(SetProductDefAmt)