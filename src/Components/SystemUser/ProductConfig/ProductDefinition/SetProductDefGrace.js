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

var graceisActive = "0";
export class SetProductDefGrace extends Component {
    constructor(props) {
        super(props)

        this.state = {
            productid: sessionStorage.getItem("productID"),
            gracedaysprincpayment: "",
            gracedaysintpayment: "",
            arrearstoleranceamount: "",
            gracedaysonarrears: "",
            overduedaysbeforenpa: "",
            gracedayspenalinterest: "",
            latepenaltyfrequency: "",
            elcdaysgrace: "",
            listingPeriodDays: "",
            elcCoolingOff: "",
        }
    }
    componentDidMount() {
        if (sessionStorage.getItem("defGrace")) {
            graceisActive = sessionStorage.getItem("defGrace");
        }
        this.getProductDefGraceinfo()
    }
    getProductDefGraceinfo = () => {
        fetch(BASEURL + `/lms/getproductdefgraceinfo?productid=` + sessionStorage.getItem('productID') +
            '&productname=' + sessionStorage.getItem("prodName") + '&isactive=' + graceisActive, {
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
                    this.setState({
                        elcdaysgrace: resdata.msgdata.elcdaysgrace,
                        gracedaysonarrears: resdata.msgdata.gracedaysonarrears,
                        gracedaysintpayment: resdata.msgdata.gracedaysintpayment,
                        arrearstoleranceamount: resdata.msgdata.arrearstoleranceamount,
                        gracedayspenalinterest: resdata.msgdata.gracedayspenalinterest,
                        latepenaltyfrequency: resdata.msgdata.latepenaltyfrequency,
                        overduedaysbeforenpa: resdata.msgdata.overduedaysbeforenpa,
                        gracedaysprincpayment: resdata.msgdata.gracedaysprincpayment,
                        listingPeriodDays: resdata.msgdata.listingperioddays,
                        elcCoolingOff: resdata.msgdata.elccoolingoffperiod,
                    })
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
    productid = (event) => {
        this.setState({ productid: event.target.value })
    }
    gracedaysprincpayment = (event) => {
        this.setState({ gracedaysprincpayment: event.target.value })
    }
    gracedaysintpayment = (event) => {
        this.setState({ gracedaysintpayment: event.target.value })
    }
    arrearstoleranceamount = (event) => {
        this.setState({ arrearstoleranceamount: event.target.value })
    }
    gracedaysonarrears = (event) => {
        this.setState({ gracedaysonarrears: event.target.value })
    }
    overduedaysbeforenpa = (event) => {
        this.setState({ overduedaysbeforenpa: event.target.value })
    }
    gracedayspenalinterest = (event) => {
        this.setState({ gracedayspenalinterest: event.target.value })
    }
    latepenaltyfrequency = (event) => {
        this.setState({ latepenaltyfrequency: event.target.value })
    }
    elcdaysgrace = (event) => {
        this.setState({ elcdaysgrace: event.target.value })
    }
    listingPeriodDays = (event) => {
        this.setState({ listingPeriodDays: event.target.value })
    }
    elcCoolingOff = (event) => {
        this.setState({ elcCoolingOff: event.target.value })
    }
    setProductDefGrace = () => {
        var pID = this.state.productid;
        var one = this.state.gracedaysprincpayment
        var tw = this.state.gracedaysintpayment;
        var th = this.state.arrearstoleranceamount;
        var fo = this.state.gracedaysonarrears;
        var fiv = this.state.overduedaysbeforenpa;
        var six = this.state.gracedayspenalinterest;
        var sev = this.state.latepenaltyfrequency;
        var eigh = this.state.elcdaysgrace;

        if (pID == "" ||
            one == "" ||
            tw == "" ||
            th == "" ||
            fo == "" ||
            fiv == "" ||
            six == "" ||
            sev == "" ||
            eigh == "") {
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
            fetch(BASEURL + `/lms/setproductdefgraceinfo`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer " + sessionStorage.getItem('token')
                },
                body: JSON.stringify({
                    productid: this.state.productid,
                    gracedaysprincpayment: this.state.gracedaysprincpayment,
                    gracedaysintpayment: this.state.gracedaysintpayment,
                    arrearstoleranceamount: this.state.arrearstoleranceamount,
                    gracedaysonarrears: this.state.gracedaysonarrears,
                    overduedaysbeforenpa: this.state.overduedaysbeforenpa,
                    gracedayspenalinterest: this.state.gracedayspenalinterest,
                    latepenaltyfrequency: this.state.latepenaltyfrequency,
                    elcdaysgrace: this.state.elcdaysgrace,
                    productname: sessionStorage.getItem("prodName"),
                    isedited: "1",
                    listingperioddays: this.state.listingPeriodDays,
                    elccoolingoffperiod: this.state.elcCoolingOff
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
                        // alert("Failure,Please try again later.");
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

    cancelProductDefGrace = () => {
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
                        <div className="col-1" id="prodGraceRef1">
                            <button style={{ marginLeft: "25px" }} onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className='col-8' id="prodGraceRef2" style={{ marginLeft: "20px", marginTop: "5px" }}>
                            <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                <Link to="/sysUserDashboard">Home</Link> / <Link to="/productDefinition">Product List</Link> / <Link to="/productAttribute">Product Attribute</Link> / Set Product Definition Grace </p>
                        </div>
                        <div className='col'>

                        </div>

                        <div className="col" id="prodGraceRef3">
                            <button style={myStyle}>
                                <Link to="/productAttribute" style={{ marginLeft: "10px" }}><FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} /><span style={{ textDecoration: "none", color: "white" }}>Back</span></Link></button>
                        </div>

                    </div>
                    <hr className="col-11" style={{ marginLeft: "50px", width: "88.6%", backgroundColor: "rgba(4,78,160,1)" }} />

                    <div className="tab-content">
                        <div className="register-form tab-pane fade show active">
                            <div className='' >
                                <div className="card" style={{ cursor: 'default', marginLeft: "50px", width: "92%", overflow: "visible" }}>
                                    <div className="card-header border-1 bg-white">
                                        <div className='row' style={{ paddingLeft: "3px" }}>
                                            <div className='col-6' id='headingRef'>
                                                <div className="two__image" style={{ paddingLeft: "10px" }}>
                                                    <p className="text-white" style={{ paddingBottom: "6px", fontWeight: "600" }}>Set Product Definition Grace</p>
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
                                                <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Grace On Principal Payment(Days) *')}</p>
                                                <input type="number" className="form-control" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}
                                                    id="inputAddress" placeholder={t('Enter days')} onChange={this.gracedaysprincpayment} value={this.state.gracedaysprincpayment}
                                                />
                                            </div>
                                            <div className="form-group col-md-4">
                                                <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Grace On Interest Payment(Days) *')}</p>
                                                <input type="number" className="form-control" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}
                                                    id="inputAddress" placeholder={t('Enter days')} onChange={this.gracedaysintpayment} value={this.state.gracedaysintpayment}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-4">
                                                <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Arrears Tolerance Amount *')}</p>
                                                <input type="number" className="form-control" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}
                                                    id="inputAddress" placeholder={t('Enter amount')} onChange={this.arrearstoleranceamount} value={this.state.arrearstoleranceamount}
                                                />
                                            </div>
                                            <div className="form-group col-md-4">
                                                <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Grace On Arrears(Days) *')}</p>
                                                <input type="number" className="form-control" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}
                                                    id="inputAddress" placeholder={t('Enter days')} onChange={this.gracedaysonarrears} value={this.state.gracedaysonarrears}
                                                />
                                            </div>
                                            <div className="form-group col-md-4">
                                                <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Overdue Before NPA(Days) *')}</p>
                                                <input type="number" className="form-control" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}
                                                    id="inputAddress" placeholder={t('Enter Overdue days')} onChange={this.overduedaysbeforenpa} value={this.state.overduedaysbeforenpa}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-4">
                                                <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Grace On Penal Interest(Days) *')}</p>
                                                <input type="number" className="form-control" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}
                                                    id="inputAddress" placeholder={t('Enter Grace days ')} onChange={this.gracedayspenalinterest} value={this.state.gracedayspenalinterest}
                                                />
                                            </div>
                                            <div className="form-group col-md-4">
                                                <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Late Penalty Frequency(Days) *')}</p>
                                                <input type="number" className="form-control" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}
                                                    id="inputAddress" placeholder={t('Enter days')} onChange={this.latepenaltyfrequency} value={this.state.latepenaltyfrequency}
                                                />
                                            </div>
                                            <div className="form-group col-md-4">
                                                <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('ELC Grace(Days) *')}</p>
                                                <input type="number" className="form-control" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}
                                                    id="inputAddress" placeholder={t('Enter days')} onChange={this.elcdaysgrace} value={this.state.elcdaysgrace}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-4">
                                                <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Listing period days')}</p>
                                                <input type="number" className="form-control" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}
                                                    id="inputAddress" placeholder={t('Listing period days')} onChange={this.listingPeriodDays} value={this.state.listingPeriodDays}
                                                />
                                            </div>
                                            <div className="form-group col-md-4">
                                                <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Elc cooling off period')}</p>
                                                <input type="number" className="form-control" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}
                                                    id="inputAddress" placeholder={t('Elc cooling off period')} onChange={this.elcCoolingOff} value={this.state.elcCoolingOff}
                                                />
                                            </div>
                                        </div>
                                        <hr />
                                        <div className="form-row" style={{ textAlign: "center" }}>
                                            <div className="form-group col">
                                                <button type="button" className="btn mr-2 text-white btn-sm" style={{ backgroundColor: "rgb(136, 189, 72)", width: "90px" }}
                                                    onClick={this.setProductDefGrace}  >Submit</button>
                                                <button type="button" className="btn text-white btn-sm" style={{ backgroundColor: "#0079BF", width: "90px" }}
                                                    onClick={this.cancelProductDefGrace}>{t('Cancel')}</button>
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

export default withTranslation()(SetProductDefGrace)