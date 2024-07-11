import React, { Component } from 'react';
import $ from 'jquery';
import { BASEURL } from '../../../assets/baseURL';
import SystemUserSidebar from '../../SystemUserSidebar';
import { withTranslation } from 'react-i18next';
import { FaPlus } from "react-icons/fa";
import { FaCheckCircle, FaTimesCircle, FaAngleLeft, FaEject, FaRegUser, FaEdit, FaMapMarkerAlt, FaHouseUser, FaUserEdit } from "react-icons/fa";
import dashboardIcon from '../../../assets/icon_dashboard.png';
import { Link } from 'react-router-dom';
import Multiselect from 'multiselect-react-dropdown';
import * as FaIcons from "react-icons/fa";
import { confirmAlert } from "react-confirm-alert";
import batch from '../../../assets/batch.png';

var intisActive = "0";
export class SetProductDefInterest extends Component {
    constructor(props) {
        super(props)

        this.state = {
            productid: sessionStorage.getItem("productID"),
            interesttype: "VARIABLE",
            variableintbase: "Risk",
            interestcalmethod: "",
            interestdiff: "0.00",
            interestrateperiod: "",
            interestaccrualperiod: "",
            interestmethod: "",
            interestpostingfrequency: "",
            allowpartialperiodintcalc: "",
            penalintrate: "",
            overduegraceamt: "",
            teaserintrateallowed: "0",
            teaserinterestrate: "",

            penalIntFlag: false,
            teaserIntFlag: false,
            intSpreadList: [],
            defIntrate: "",

            IntcalmethodList: [],
            IntmethodList: [],
            IntaccrualPeriodList: [],
            IntposFreqList: [],
            IntratePeriodList: [],
        }
    }
    componentDidMount() {
        if (sessionStorage.getItem('isLogin') == "true" && sessionStorage.getItem('status') == 'Success') {
            if (sessionStorage.getItem("defInt")) {
                intisActive = sessionStorage.getItem("defInt");
            }
            this.getProductDefInterestinfo();
        } else {
            window.location = '/login'
        }


    }
    getProductInterestSpread = () => {
        fetch(BASEURL + `/lms/getproductinterestspread`, {
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
                if (resdata.status == 'SUCCESS') {
                    console.log(resdata.msgdata);
                    console.log(resdata.msgdata.intspread);
                    console.log(resdata.msgdata.defintrate);

                    this.setState({ intSpreadList: resdata.msgdata.intspread })
                    this.setState({ defIntrate: resdata.msgdata.defintrate })
                    $("#interestSpreadModal").click()
                } else {
                }
            })
    }
    viewIntList = () => {
        this.getProductInterestSpread();
    }
    getProductDefInterestinfo = () => {
        fetch(BASEURL + `/lms/getproductdefinterestinfo?productid=` + sessionStorage.getItem('productID') +
            '&productname=' + sessionStorage.getItem("prodName") + '&isactive=' + intisActive, {
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
                    this.setState({ interestpostingfrequency: resdata.msgdata.interestpostingfrequency })
                    this.setState({ penalintrate: resdata.msgdata.penalintrate })
                    this.setState({ interestaccrualperiod: resdata.msgdata.interestaccrualperiod })
                    this.setState({ interestrateperiod: resdata.msgdata.interestrateperiod })
                    this.setState({ allowpartialperiodintcalc: resdata.msgdata.allowpartialperiodintcalc })
                    this.setState({ overduegraceamt: resdata.msgdata.overduegraceamt })
                    // this.setState({ teaserintstdate: resdata.msgdata.teaserintstdate })
                    // this.setState({ teaserintenddate: resdata.msgdata.teaserintenddate })
                    this.setState({ interestcalmethod: resdata.msgdata.interestcalmethod })
                    this.setState({ teaserintrateallowed: resdata.msgdata.teaserintrateallowed })
                    this.setState({ variableintbase: resdata.msgdata.variableintbase })
                    this.setState({ mininterestrate: resdata.msgdata.mininterestrate })
                    this.setState({ maxinterestrate: resdata.msgdata.maxinterestrate })
                    this.setState({ interestmethod: resdata.msgdata.interestmethod })
                    this.setState({ teaserinterestrate: resdata.msgdata.teaserinterestrate })
                    this.setState({ interesttype: resdata.msgdata.interesttype })

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
    interesttype = (event) => {
        this.setState({ interesttype: event.target.value })
    }
    variableintbase = (event) => {
        this.setState({ variableintbase: event.target.value })
    }
    interestcalmethod = (event) => {
        this.setState({ interestcalmethod: event.target.value })
    }
    interestdiff = (event) => {
        this.setState({ interestdiff: event.target.value })
    }
    interestrateperiod = (event) => {
        this.setState({ interestrateperiod: event.target.value })
    }
    interestaccrualperiod = (event) => {
        this.setState({ interestaccrualperiod: event.target.value })
    }
    interestmethod = (event) => {
        this.setState({ interestmethod: event.target.value })
    }
    interestpostingfrequency = (event) => {
        this.setState({ interestpostingfrequency: event.target.value })
        console.log(event.target.value)
    }
    allowpartialperiodintcalc = (event) => {
        this.setState({ allowpartialperiodintcalc: event.target.value })
    }
    penalintrate = (event) => {
        this.setState({ penalintrate: event.target.value })
    }
    overduegraceamt = (event) => {
        this.setState({ overduegraceamt: event.target.value })
    }
    teaserintrateallowed = (event) => {
        this.setState({ teaserintrateallowed: event.target.value })
    }
    teaserinterestrate = (event) => {
        this.setState({ teaserinterestrate: event.target.value })
    }

    SetProductDefInterest = () => {
        // var pID = this.state.productid;
        // var one = this.state.interesttype;
        // var tw = this.state.variableintbase;
        // var th = this.state.interestcalmethod;
        // var fo = this.state.interestdiff;
        // var fiv = this.state.interestrateperiod;
        // var six = this.state.interestaccrualperiod;
        // var sev = this.state.interestmethod;
        // var eigh = this.state.interestpostingfrequency;
        // var nine = this.state.allowpartialperiodintcalc;
        // var ten = this.state.penalintrate;
        // var elv = this.state.overduegraceamt;
        // var twlv = this.state.teaserintrateallowed;
        // var thirt = this.state.teaserinterestrate;
        // var fourt = this.state.allowPartialInt;

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
        //     ten == "" ||
        //     elv == "" ||
        //     twlv == "" ||
        //     thirt == "" ||
        //     fourt == "") {
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
        // } else {
        fetch(BASEURL + `/lms/setproductdefinterestinfo`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                productid: this.state.productid,
                interesttype: this.state.interesttype,
                variableintbase: this.state.variableintbase,
                interestcalmethod: this.state.interestcalmethod,
                interestdiff: this.state.interestdiff,
                interestrateperiod: this.state.interestrateperiod,
                interestaccrualperiod: this.state.interestaccrualperiod,
                interestmethod: this.state.interestmethod,
                interestpostingfrequency: this.state.interestpostingfrequency,
                allowpartialperiodintcalc: this.state.allowpartialperiodintcalc,
                penalintrate: this.state.penalintrate,
                overduegraceamt: this.state.overduegraceamt,
                teaserintrateallowed: this.state.teaserintrateallowed,
                teaserinterestrate: this.state.teaserinterestrate,
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
                    //window.location.reload();
                }
            })
            .catch(err => {
                console.log(err.message)
            })
        // }
    }

    cancelProductDefInterest = () => {
        window.location.reload();
    }
    //getters of Params
    getParamsIntcalmethod = () => {
        fetch(BASEURL + `/lms/getparameters?parameterkey=interestcalmethod`, {
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
                    this.setState({ IntcalmethodList: resdata.msgdata })
                } else {
                }
            })
    }
    getParamsIntmethod = () => {
        fetch(BASEURL + `/lms/getparameters?parameterkey=interestmethod`, {
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
                    this.setState({ IntmethodList: resdata.msgdata })
                } else {
                }
            })
    }
    getParamsIntaccrualPeriod = () => {
        fetch(BASEURL + `/lms/getparameters?parameterkey=interestaccrualperiod`, {
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
                    this.setState({ IntaccrualPeriodList: resdata.msgdata })
                } else {
                }
            })
    }
    getParamsIntposFreq = () => {
        fetch(BASEURL + `/lms/getparameters?parameterkey=interestpostingfrequency`, {
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
                    this.setState({ IntposFreqList: resdata.msgdata })
                } else {
                }
            })
    }
    getParamsIntratePeriod = () => {
        fetch(BASEURL + `/lms/getparameters?parameterkey=interestrateperiod`, {
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
                    this.setState({ IntratePeriodList: resdata.msgdata })
                } else {
                }
            })
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
        var intPosFrequency;
        if (this.state.interestpostingfrequency == 0) {
            intPosFrequency = "Monthly"
        } else if (this.state.interestpostingfrequency == 1) {
            intPosFrequency = "Quarterly"
        } else if (this.state.interestpostingfrequency == 2) {
            intPosFrequency = "Yearly"
        } else if (this.state.interestpostingfrequency == 3) {
            intPosFrequency = "Daily"
        } else if (this.state.interestpostingfrequency == 4) {
            intPosFrequency = "Weekly"
        }

        var intaccrualPeriod;
        if (this.state.interestaccrualperiod == 0) {
            intaccrualPeriod = "Daily"
        } else if (this.state.interestaccrualperiod == 1) {
            intaccrualPeriod = "Same as repayment period"
        }

        var intMethod;
        if (this.state.interestmethod == 0) {
            intMethod = "Declining Balance"
        } else if (this.state.interestmethod == 1) {
            intMethod = "Flat"
        }

        var intRatePeriod;
        if (this.state.interestrateperiod == 0) {
            intRatePeriod = "Annual"
        } else if (this.state.interestrateperiod == 1) {
            intRatePeriod = "Monthly"
        }

        var intCalMethod;
        if (this.state.interestcalmethod == 0) {
            intCalMethod = "Actual/Actual"
        }

        var interestcaluniqueOptions = [...new Set(this.state.IntcalmethodList)];
        var interestPosFrequniqueOptions = [...new Set(this.state.IntposFreqList)];
        var intaccrualPerioduniqueOptions = [...new Set(this.state.IntaccrualPeriodList)];
        var intMethoduniqueOptions = [...new Set(this.state.IntmethodList)];
        var intRatePerioduniqueOptions = [...new Set(this.state.IntratePeriodList)];
        return (
            <div className="container-dashboard d-flex flex-row" id="wrapper" style={{ backgroundColor: "#f4f7fc" }}>
                <SystemUserSidebar />
                <div className="pl-3 pr-3 main-content" id="page-content-wrapper">
                    <div className="container-fluid row pt-2">
                        <div className="col-1" id="prodIntRef1">
                            <button style={{ marginLeft: "25px" }} onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className='col-8' id="prodIntRef2" style={{ marginLeft: "20px", marginTop: "5px" }}>
                            <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                <Link to="/sysUserDashboard">Home</Link> / <Link to="/productDefinition">Product List</Link> / <Link to="/productAttribute">Product Attribute</Link> / Set Product Definition Interest </p>
                        </div>
                        <div className='col'>

                        </div>

                        <div className="col" id="prodIntRef3">
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
                                                    <p className="text-white" style={{ paddingBottom: "6px", fontWeight: "600" }}>Set Product Definition Interest</p>
                                                </div>
                                            </div>
                                            <div className='col-6' style={{ textAlign: "end" }}>
                                                <p style={{ fontSize: "14px", color: "#0079BF", cursor: "pointer" }} onClick={this.viewIntList}><FaEject />&nbsp;Product Interest Rate</p>
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-4">
                                                <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Product ID *')}</p>
                                                <input type="text" className="form-control" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px", textTransform: 'uppercase' }}
                                                    id="inputAddress" value={this.state.productid} readOnly
                                                />
                                            </div>
                                            <div className="form-group col-md-4">
                                                <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Interest Type *')}</p>
                                                <input type="text" className="form-control" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}
                                                    id="inputAddress" value={this.state.interesttype} readOnly
                                                />
                                                {/* <select className="form-select" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }} onChange={this.interesttype} >
                                                    {this.state.interesttype ? <option>{this.state.interesttype == "VARIABLE" ? "VARIABLE" : ""}</option> : <option defaultValue>Select</option>}
                                                    <option defaultValue>Select</option>
                                                    <option value="VARIABLE">VARIABLE</option>
                                                </select> */}
                                            </div>
                                            <div className="form-group col-md-4">
                                                <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Variable Interest Base *')}</p>
                                                <input type="text" className="form-control" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}
                                                    id="inputAddress" value={this.state.variableintbase} readOnly
                                                />
                                                {/* <select className="form-select" onChange={this.variableintbase} style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }} >
                                                    {this.state.variableintbase ? <option>{this.state.variableintbase == "Risk" ? "Risk" : ""}</option> : <option defaultValue>Select</option>}
                                                    <option value="Risk">Risk</option>
                                                </select> */}
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-4">
                                                <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Interest Cal. Method *')}</p>
                                                <select className='form-select'
                                                    style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}
                                                    onClick={this.getParamsIntcalmethod}
                                                    onChange={this.interestcalmethod}
                                                >
                                                    {this.state.interestcalmethod ? (
                                                        intCalMethod && (
                                                            <option key={intCalMethod} value={intCalMethod}>
                                                                {intCalMethod}
                                                            </option>
                                                        )
                                                    ) : (
                                                        <option defaultValue="">
                                                            Select
                                                        </option>
                                                    )}

                                                    {interestcaluniqueOptions.map(option => (
                                                        option.parametervalue && (
                                                            <option key={option.parameterid} value={option.parameterid}>
                                                                {option.parametervalue}
                                                            </option>
                                                        )
                                                    ))}
                                                </select>
                                                {/* <input type="text" className="form-control" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}
                                                    id="inputAddress" value={this.state.interestcalmethod} readOnly
                                                /> */}
                                                {/* <select className="form-select" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }} onChange={this.interestcalmethod}>
                                                    {this.state.interestcalmethod ? <option>{this.state.interestcalmethod == "0" ? "Yes" : "No"}</option> : <option defaultValue>Select</option>}
                                                    <option defaultValue>Select</option>
                                                    <option value="0">Yes</option>
                                                </select> */}
                                            </div>
                                            <div className="form-group col-md-4">
                                                <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Product Interest Offset *')}</p>
                                                <input type="number" className="form-control" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}
                                                    id="inputAddress" placeholder={t('Enter interest rate')} value={this.state.interestdiff} onChange={this.interestdiff}
                                                />
                                            </div>
                                            <div className="form-group col-md-4">
                                                <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Interest Rate Period *')}</p>
                                                <select className='form-select'
                                                    style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}
                                                    onClick={this.getParamsIntratePeriod}
                                                    value={this.state.interestrateperiod}
                                                    onChange={this.interestrateperiod}
                                                >


                                                    {this.state.interestrateperiod ? (
                                                        intRatePeriod && (
                                                            <option key={intRatePeriod} value={intRatePeriod}>
                                                                {intRatePeriod}
                                                            </option>
                                                        )
                                                    ) : (
                                                        <option defaultValue="">
                                                            Select
                                                        </option>
                                                    )}

                                                    {intRatePerioduniqueOptions.map(option => (
                                                        option.parametervalue && (
                                                            <option key={option.parameterid} value={option.parameterid}>
                                                                {option.parametervalue}
                                                            </option>
                                                        )
                                                    ))}
                                                </select>
                                                {/* <input type="number" className="form-control" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}
                                                    id="inputAddress" placeholder={t('Enter interest rate period')} value={this.state.interestrateperiod} onChange={this.interestrateperiod}
                                                /> */}
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-4">
                                                <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Interest Accrual Period *')}</p>
                                                <select className='form-select'
                                                    style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}
                                                    onClick={this.getParamsIntaccrualPeriod}
                                                    value={this.state.interestaccrualperiod}
                                                    onChange={this.interestaccrualperiod}
                                                >

                                                    {this.state.interestaccrualperiod ? (
                                                        intaccrualPeriod && (
                                                            <option key={intaccrualPeriod} value={intaccrualPeriod}>
                                                                {intaccrualPeriod}
                                                            </option>
                                                        )
                                                    ) : (
                                                        <option defaultValue="">
                                                            Select
                                                        </option>
                                                    )}

                                                    {intaccrualPerioduniqueOptions.map(option => (
                                                        option.parametervalue && (
                                                            <option key={option.parameterid} value={option.parameterid}>
                                                                {option.parametervalue}
                                                            </option>
                                                        )
                                                    ))}

                                                </select>
                                                {/* <input type="number" className="form-control" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}
                                                    id="inputAddress" placeholder={t('Enter Interest accrual period')} value={this.state.interestaccrualperiod} onChange={this.interestaccrualperiod}
                                                /> */}
                                            </div>
                                            <div className="form-group col-md-4">
                                                <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Interest Method *')}</p>
                                                <select className='form-select'
                                                    style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}
                                                    onClick={this.getParamsIntmethod}
                                                    onChange={this.interestmethod}
                                                >
                                                    {this.state.interestmethod ? (
                                                        intMethod && (
                                                            <option key={intMethod} value={intMethod}>
                                                                {intMethod}
                                                            </option>
                                                        )
                                                    ) : (
                                                        <option defaultValue="">
                                                            Select
                                                        </option>
                                                    )}

                                                    {intMethoduniqueOptions.map(option => (
                                                        option.parametervalue && (
                                                            <option key={option.parameterid} value={option.parameterid}>
                                                                {option.parametervalue}
                                                            </option>
                                                        )
                                                    ))}

                                                </select>
                                                {/* <input type="number" className="form-control" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}
                                                    id="inputAddress" placeholder={t('Enter Interest method')} value={this.state.interestmethod} onChange={this.interestmethod}
                                                /> */}
                                            </div>
                                            <div className="form-group col-md-4">
                                                <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Interest Posting Frequency *')}</p>
                                                <select className='form-select'
                                                    style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}
                                                    onClick={this.getParamsIntposFreq}
                                                    // value={this.state.interestpostingfrequency}
                                                    onChange={this.interestpostingfrequency}
                                                >
                                                    {this.state.interestpostingfrequency ? (
                                                        intPosFrequency && (
                                                            <option key={intPosFrequency} value={intPosFrequency}>
                                                                {intPosFrequency}
                                                            </option>
                                                        )
                                                    ) : (
                                                        <option defaultValue="">
                                                            Select
                                                        </option>
                                                    )}

                                                    {interestPosFrequniqueOptions.map(option => (
                                                        option.parametervalue && (
                                                            <option key={option.parameterid} value={option.parameterid}>
                                                                {option.parametervalue}
                                                            </option>
                                                        )
                                                    ))}
                                                </select>
                                                {/* <input type="number" className="form-control" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}
                                                    id="inputAddress" placeholder={t('Enter days')} value={this.state.interestpostingfrequency} onChange={this.interestpostingfrequency}
                                                /> */}
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-4">
                                                <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Allow Partial Period Interest *')}</p>
                                                <select id="inputState" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }} className="form-select" onChange={this.allowpartialperiodintcalc} >
                                                    {this.state.allowpartialperiodintcalc ? <option>{this.state.allowpartialperiodintcalc == 1 ? "Allow" : "Not Allowed"}</option> : <option defaultValue>Select</option>}
                                                    <option value="1">Allow</option>
                                                    <option value="0">Not Allowed</option>
                                                </select>
                                            </div>
                                            <div className="form-group col-md-4">
                                                <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Penal Interest Rate(% P.A.) *')}</p>
                                                <input type="number" className="form-control" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}
                                                    id="inputAddress" placeholder={t('Enter interest rate(1-100)')} value={this.state.penalintrate} onChange={this.penalintrate}
                                                />
                                            </div>
                                            <div className="form-group col-md-4">
                                                <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Overdue Grace Amount *')}</p>
                                                <input type="number" className="form-control" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}
                                                    id="inputAddress" placeholder={t('Enter Overdue amount')} value={this.state.overduegraceamt} onChange={this.overduegraceamt}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-row">

                                            <div className="form-group col-md-4">
                                                <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Teaser Interest Rate Allowed *')}</p>
                                                {/* <input type="number" className="form-control" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}
                                                    id="inputAddress" placeholder={t('Enter interest rate allowed')} value={this.state.teaserintrateallowed} onChange={this.teaserintrateallowed}
                                                /> */}
                                                <select id="inputState" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }} className="form-select" onChange={this.teaserintrateallowed} >
                                                    {this.state.teaserintrateallowed ? <option>{this.state.teaserintrateallowed == 1 ? "Allow" : "Not Allowed"}</option> : <option defaultValue>Select</option>}
                                                    <option value="1">Allow</option>
                                                    <option value="0">Not Allowed</option>
                                                </select>
                                            </div>
                                            <div className="form-group col-md-4">
                                                <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Teaser Interest Rate(% P.A.) *')}</p>
                                                <input type="number" className="form-control" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}
                                                    id="inputAddress" placeholder={t('Enter interest rate(1-100)')} value={this.state.teaserinterestrate} onChange={this.teaserinterestrate}
                                                />
                                            </div>
                                        </div>

                                        <hr />
                                        <div className="form-row" style={{ textAlign: "center" }}>
                                            <div className="form-group col">
                                                <button type="button" className="btn mr-2 text-white btn-sm" style={{ backgroundColor: "rgb(136, 189, 72)", width: "90px" }}
                                                    onClick={this.SetProductDefInterest}  >Submit</button>
                                                <button type="button" className="btn text-white btn-sm" style={{ backgroundColor: "#0079BF", width: "90px" }}
                                                    onClick={this.cancelProductDefInterest}>{t('Cancel')}</button>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>


                    {/* OVD Data modal */}
                    <button type="button" id='interestSpreadModal' style={{ display: "none" }} class="btn btn-primary" data-toggle="modal" data-target=".bd-example-modal-lg">
                        Product Interest Spread Modal
                    </button>
                    <div class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
                        <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
                            <div className="modal-content">
                                <div class="modal-body">
                                    <div className='row'>
                                        <div className='col'>
                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold" }}><img src={batch} width="25px" />Product Interest Spread List</p>
                                            <hr style={{ width: "50px", marginTop: "-10px", backgroundColor: "rgb(0, 121, 191)" }} />
                                            <div className='row scrollbar'>
                                                <div className='col'>
                                                    <table className='table table-bordered' style={{ fontSize: "14px" }}>
                                                        <thead>
                                                            <tr>
                                                                <th scope="col" style={{ color: "rgba(5,54,82,1)", fontWeight: "bold" }}>Risk Rating</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {this.state.intSpreadList.map((list, index) => {
                                                                return (
                                                                    <>
                                                                        <tr>
                                                                            <th scope='row' style={{ color: "rgba(5,54,82,1)", fontWeight: "bold" }}>{list.riskrating}</th>
                                                                            <tr>
                                                                                <th style={{ color: "rgba(5,54,82,1)", fontWeight: "bold" }}>Loan Size:</th>
                                                                                {list.info.map((subList, subindex) => {
                                                                                    return (
                                                                                        <td key={subindex} style={{ color: "rgba(5,54,82,1)" }}>{subList.loansize}</td>
                                                                                    )
                                                                                })}
                                                                            </tr>
                                                                            <tr>
                                                                                <th style={{ color: "rgba(5,54,82,1)", fontWeight: "bold" }}>Interest Rate:</th>
                                                                                {list.info.map((subList2, subIndex) => {
                                                                                    return (
                                                                                        <td key={subIndex} style={{ color: "rgba(5,54,82,1)" }}>{subList2.intrate}%</td>
                                                                                    )
                                                                                })}
                                                                            </tr>
                                                                        </tr>
                                                                    </>
                                                                )
                                                            })
                                                            }
                                                        </tbody>
                                                    </table>
                                                    <p style={{ color: "rgba(5,54,82,1)" }}><span style={{ fontWeight: "bold" }}>Default Interest Rate: </span>{this.state.defIntrate}%</p>
                                                </div>
                                            </div>

                                            <hr style={{ backgroundColor: "rgba(5,54,82,1)" }} />
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col' style={{ textAlign: "end" }}>
                                            <button type="button" id='disagree' class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "#0079bf" }}>Close</button>
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

export default withTranslation()(SetProductDefInterest)