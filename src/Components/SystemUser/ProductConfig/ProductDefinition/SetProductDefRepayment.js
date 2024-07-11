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

var repayisActive = "0";
export class SetProductDefRepayment extends Component {
    constructor(props) {
        super(props)

        this.state = {
            productid: sessionStorage.getItem("productID"),
            repaymentfrequency: "",
            syncwithdisbursedate: "1",
            noofrepaymentsdefault: "3",
            minnoofrepayments: "",
            maxnoofrepayments: "",
            mindaysbeforefirstinst: "",
            allowvarinstallments: "",
            epimultiple: "1",
            partialprepaymentallowed: "",
            fullprepaymentallowed: "",

            options: ['Monthly',
                'Weekly',
                'Daily',
                'Quarterly',
                'Yearly'],
        }
    }
    componentDidMount() {
        if (sessionStorage.getItem("defRepay")) {
            repayisActive = sessionStorage.getItem("defRepay");
        }
        this.getProductDefRepaymentinfo()
    }
    getProductDefRepaymentinfo = () => {
        fetch(BASEURL + `/lms/getproductdefrepaymentinfo?productid=` + sessionStorage.getItem('productID') +
            '&productname=' + sessionStorage.getItem("prodName") + '&isactive=' + repayisActive, {
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
                    this.setState({ partialprepaymentallowed: resdata.msgdata.partialprepaymentallowed })
                    this.setState({ mindaysbeforefirstinst: resdata.msgdata.mindaysbeforefirstinst })
                    this.setState({ allowvarinstallments: resdata.msgdata.allowvarinstallments })
                    this.setState({ minnoofrepayments: resdata.msgdata.minnoofrepayments })
                    this.setState({ epimultiple: resdata.msgdata.epimultiple })
                    this.setState({ repaymentfrequency: resdata.msgdata.repaymentfrequency })
                    this.setState({ syncwithdisbursedate: resdata.msgdata.syncwithdisbursedate })
                    this.setState({ noofrepaymentsdefault: resdata.msgdata.noofrepaymentsdefault })
                    this.setState({ fullprepaymentallowed: resdata.msgdata.fullprepaymentallowed })
                    this.setState({ princthresholdlastint: resdata.msgdata.princthresholdlastint })
                    this.setState({ maxnoofrepayments: resdata.msgdata.maxnoofrepayments })
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
    repaymentfrequency = (event) => {
        if (event.target.value == "Monthly") {
            this.setState({ repaymentfrequency: 0 })
        } else if (event.target.value == "Weekly") {
            this.setState({ repaymentfrequency: 1 })
        } else if (event.target.value == "Daily") {
            this.setState({ repaymentfrequency: 2 })
        } else if (event.target.value == "Quarterly") {
            this.setState({ repaymentfrequency: 3 })
        } else if (event.target.value == "Yearly") {
            this.setState({ repaymentfrequency: 4 })
        }
    }
    syncwithdisbursedate = (event) => {
        this.setState({ syncwithdisbursedate: event.target.value })
    }
    noofrepaymentsdefault = (event) => {
        this.setState({ noofrepaymentsdefault: event.target.value })
    }
    minnoofrepayments = (event) => {
        this.setState({ minnoofrepayments: event.target.value })
    }
    maxnoofrepayments = (event) => {
        this.setState({ maxnoofrepayments: event.target.value })
    }
    mindaysbeforefirstinst = (event) => {
        this.setState({ mindaysbeforefirstinst: event.target.value })
    }
    allowvarinstallments = (event) => {
        this.setState({ allowvarinstallments: event.target.value })
    }
    epimultiple = (event) => {
        this.setState({ epimultiple: event.target.value })
    }
    partialprepaymentallowed = (event) => {
        this.setState({ partialprepaymentallowed: event.target.value })
    }
    fullprepaymentallowed = (event) => {
        this.setState({ fullprepaymentallowed: event.target.value })
    }

    SetProductDefRepay = () => {
        var pID = this.state.productid;
        var one = this.state.repaymentfrequency;
        var tw = this.state.syncwithdisbursedate;
        var th = this.state.noofrepaymentsdefault;
        var fo = this.state.minnoofrepayments;
        var fiv = this.state.maxnoofrepayments;
        var six = this.state.mindaysbeforefirstinst;
        var sev = this.state.allowvarinstallments;
        var eigh = this.state.epimultiple;
        var nine = this.state.partialprepaymentallowed;
        var ten = this.state.fullprepaymentallowed;

        // if (pID == "" ||
        //     one == "" ||
        //     tw == "" ||
        //     th == "" ||
        //     fo == "" ||
        //     fiv == "" ||
        //     six == "" ||
        //     sev == "" ||
        //     eigh == "" ||
        //     nine == "" ||
        //     ten == "") {
        //     confirmAlert({
        //         message: "Invalid inputs.",
        //         buttons: [
        //             {
        //                 label: "OK",
        //                 onClick: () => {

        //                 },
        //             },
        //         ],
        //     });
        // } else {}
            fetch(BASEURL + `/lms/setproductdefrepaymentinfo`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer " + sessionStorage.getItem('token')
                },
                body: JSON.stringify({
                    productid: this.state.productid,
                    repaymentfrequency: this.state.repaymentfrequency,
                    syncwithdisbursedate: this.state.syncwithdisbursedate,
                    noofrepaymentsdefault: this.state.noofrepaymentsdefault,
                    minnoofrepayments: this.state.minnoofrepayments,
                    maxnoofrepayments: this.state.maxnoofrepayments,
                    mindaysbeforefirstinst: this.state.mindaysbeforefirstinst,
                    allowvarinstallments: this.state.allowvarinstallments,
                    epimultiple: this.state.epimultiple,
                    partialprepaymentallowed: this.state.partialprepaymentallowed,
                    fullprepaymentallowed: this.state.fullprepaymentallowed,
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
                        // window.location = '/productAttribute';
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

    cancelProductDefRepay = () => {
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
        const Style1 = {
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
            marginLeft: "14px",
            float: "right"
        }

        var repFreqType;
        if (this.state.repaymentfrequency == 0) {
            repFreqType = "Monthly"
        } else if (this.state.repaymentfrequency == 1) {
            repFreqType = "Weekly"
        } else if (this.state.repaymentfrequency == 2) {
            repFreqType = "Daily"
        } else if (this.state.repaymentfrequency == 3) {
            repFreqType = "Quarterly"
        } else if (this.state.repaymentfrequency == 4) {
            repFreqType = "Yearly"
        }

        var uniqueOptions = [...new Set(this.state.options)];
        return (
            <div className="container-dashboard d-flex flex-row" id="wrapper" style={{ backgroundColor: "#f4f7fc" }}>
                <SystemUserSidebar />
                <div className="pl-3 pr-3 main-content" id="page-content-wrapper">
                    <div className="container-fluid row pt-2">
                        <div className="col-1" id="prodRepayRef1">
                            <button style={{ marginLeft: "25px" }} onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className='col-8' id="prodRepayRef2" style={{ marginLeft: "20px", marginTop: "5px" }}>
                            <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                <Link to="/sysUserDashboard">Home</Link> / <Link to="/productDefinition">Product List</Link> / <Link to="/productAttribute">Product Attribute</Link> / Set Product Definition Repayment </p>
                        </div>
                        <div className='col'>

                        </div>

                        <div className="col" id="prodRepayRef3">
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
                                                    <p className="text-white" style={{ paddingBottom: "6px", fontWeight: "600" }}>Set Product Definition Repayment</p>
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
                                                <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Repayment Frequency *')}</p>
                                                {/* <input type="text" className="form-control" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}
                                                    id="inputAddress" placeholder={t('Enter duration')} onChange={this.repaymentfrequency} value={this.state.repaymentfrequency}
                                                /> */}
                                                <select className="form-select" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }} onChange={this.repaymentfrequency}>

                                                    {/* {this.state.repaymentfrequency ? <option>{this.state.repaymentfrequency == 0 ? "Monthly" :
                                                        <>{this.state.repaymentfrequency == 1 ? "Weekly" : <>{this.state.repaymentfrequency == 2 ? "Daily" : <>{this.state.repaymentfrequency == 3 ? "Quarterly" : "Yearly"}</>}</>}</>}</option> : <option defaultValue>Select</option>}
                                                    <option value="0">Monthly</option>
                                                    <option value="1">Weekly</option>
                                                    <option value="2">Daily</option>
                                                    <option value="3">Quarterly</option>
                                                    <option value="4">Yearly</option> */}

                                                    {this.state.repaymentfrequency ? (
                                                        repFreqType && (
                                                            <option key={repFreqType} value={repFreqType}>
                                                                {repFreqType}
                                                            </option>
                                                        )
                                                    ) : (
                                                        <option defaultValue="" >
                                                            Select
                                                        </option>
                                                    )}
                                                    {uniqueOptions.map(option => (
                                                        option && (
                                                            <option key={option} value={option}>
                                                                {option}
                                                            </option>
                                                        )
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="form-group col-md-4">
                                                <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Sync. With Disburse Date *')}</p>
                                                <input type="text" className="form-control" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px", textTransform: 'uppercase' }}
                                                    id="inputAddress" value={this.state.syncwithdisbursedate == 1 ? "Yes" : ""} readOnly
                                                />
                                                {/* <select className="form-select" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }} onChange={this.syncwithdisbursedate}>
                                                    {this.state.syncwithdisbursedate ? <option>{this.state.syncwithdisbursedate == 1 ? "Yes" : "No"}</option> : <option defaultValue>Select</option>}
                                                    <option value="1">Yes</option>
                                                </select> */}
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-4">
                                                <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('No. Of Repayments Default *')}</p>
                                                <input type="number" className="form-control" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}
                                                    id="inputAddress" value={this.state.noofrepaymentsdefault} placeholder={t('Enter no. of repayments ')} onChange={this.noofrepaymentsdefault}
                                                />
                                            </div>
                                            <div className="form-group col-md-4">
                                                <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Minimum No. Of Repayments *')}</p>
                                                <input type="number" className="form-control" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}
                                                    id="inputAddress" placeholder='Enter Min. no of repayments' onChange={this.minnoofrepayments} value={this.state.minnoofrepayments}
                                                />
                                            </div>
                                            <div className="form-group col-md-4">
                                                <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Maximum No. Of Repayments *')}</p>
                                                <input type="number" className="form-control" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}
                                                    id="inputAddress" placeholder='Enter Max. no of repayments' onChange={this.maxnoofrepayments} value={this.state.maxnoofrepayments}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-4">
                                                <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Min. Days Before First Installment *')}</p>
                                                <input type="number" className="form-control" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}
                                                    id="inputAddress" placeholder='Enter Min. days' onChange={this.mindaysbeforefirstinst} value={this.state.mindaysbeforefirstinst}
                                                />
                                            </div>
                                            <div className="form-group col-md-4">
                                                <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Allow Variable Installments *')}</p>
                                                < select className="form-select" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }} onChange={this.allowvarinstallments}>
                                                    {this.state.allowvarinstallments ? <option>{this.state.allowvarinstallments == 1 ? "Allow" : "Not Allow"}</option> : <option defaultValue>Select</option>}
                                                    <option value="1">Allow</option>
                                                    <option value="0">Not Allow</option>
                                                </select>
                                            </div>
                                            <div className="form-group col-md-4">
                                                <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('EPI Multiple *')}</p>
                                                <input type="number" className="form-control" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}
                                                    id="inputAddress" value={this.state.epimultiple} readOnly
                                                />
                                                {/* < select className="form-select" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }} onChange={this.epimultiple} >
                                                    {this.state.epimultiple ? <option>{this.state.epimultiple == 1 ? "Yes" : "No"}</option> : <option defaultValue>Select</option>}
                                                    <option value="1">Yes</option>
                                                </select> */}
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-4">
                                                <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Partial Pre-Payment Allowed *')}</p>
                                                < select className="form-select" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }} onChange={this.partialprepaymentallowed} >
                                                    {this.state.partialprepaymentallowed ? <option>{this.state.partialprepaymentallowed == 1 ? "Allow" : "Not Allow"}</option> : <option defaultValue>Select</option>}
                                                    <option value="1">Allow</option>
                                                    <option value="0">Not allow </option>
                                                </select>
                                            </div>
                                            <div className="form-group col-md-4">
                                                <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Full Pre-Payment Allowed *')}</p>
                                                < select className="form-select" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }} onChange={this.fullprepaymentallowed}>
                                                    {this.state.fullprepaymentallowed ? <option>{this.state.fullprepaymentallowed == 1 ? "Allow" : "Not allow"}</option> : <option defaultValue>Select</option>}
                                                    <option value="1">Allow </option>
                                                    <option value="0">Not allow </option>
                                                </select>
                                            </div>

                                        </div>
                                        <hr />
                                        <div className="form-row" style={{ textAlign: "center" }}>
                                            <div className="form-group col">
                                                <button type="button" className="btn mr-2 text-white btn-sm" style={{ backgroundColor: "rgb(136, 189, 72)", width: "90px" }}
                                                    onClick={this.SetProductDefRepay}  >Submit</button>
                                                <button type="button" className="btn text-white btn-sm" style={{ backgroundColor: "#0079BF", width: "90px" }}
                                                    onClick={this.cancelProductDefRepay}>{t('Cancel')}</button>
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

export default withTranslation()(SetProductDefRepayment)