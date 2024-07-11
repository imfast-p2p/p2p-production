import React, { Component } from 'react';
import { MDBContainer } from "mdbreact";
import './BorrowerDashboard.css';
import { Link } from 'react-router-dom';
import { BASEURL } from '../assets/baseURL';
import { CP_VERSION } from '../assets/baseURL';
import BorrowerSidebar from '../../SidebarFiles/BorrowerSidebar';
import $ from 'jquery';//updated
import wallet from '../assets/wallet-dashboard.gif';
import profile from '../assets/Profile-dashboard.gif';
import loan from '../assets/loan-dashboard.gif';
import transection from '../assets/transection-dashboard.gif'
import { withTranslation } from 'react-i18next';
import * as serviceWorker from "../../serviceWorker";
import { subscribeUser } from "../../Subscription";
import { FaBars, FaCheckCircle, FaTimesCircle, FaBell, FaAngleDoubleDown } from "react-icons/fa";
import { confirmAlert } from "react-confirm-alert";
// import { RangeStepInput } from 'react-range-step-input';

import * as FaIcons from "react-icons/fa";
import welcomeimg from '../assets/welcomeface2.png';
import walletimg from '../assets/icons/wallet.png'
import { TnC } from '../assets/Constant';
import resetPw from '../assets/pwexpired.png';
import batch from '../assets/batch.png';
import Loader from '../Loader/Loader';
//Modified Flag
import ProgressBar from 'react-bootstrap/ProgressBar';
var acc = 20;
var kyc = 20;
var personal = 40;
var tnc = 20;
let resultant;
let resultant1;
let resultant2

var enfPwMsg = "";
var lastLoginTime = "";
class BorrowerDashboard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            borSummary: {},
            amount: "",
            loanaccountno: "",
            paymenttype: 1,
            p2pdue: "",

            name: "",
            noofloansrequest: "",
            noofactiveloans: "",
            totloanamtrequested: "",
            totactiveloanamtdisbursed: "",
            totamtoutstanding: "",
            walletbalance: "",
            noofloanspredisbursement: "",
            noofactiveloanrequests: "",
            showLoader: false,

            isPanVerified: "",
            isAddressVerified: "",
            isAccountVerified: "",
            isVkycVerified: "",
            isTnCSigned: "",

            textAlignFlag: true,

            //Modified Flag
            flagsMasterList: [
            ],
            flagsMasterList1: [],
        }

        this.addMoney = this.addMoney.bind(this);
    }

    // amount(event) {
    //     this.setState({ amount: event.target.value })
    // }

    componentDidMount() {
        //this.getToken();
        //serviceWorker.register();
        //subscribeUser();
        lastLoginTime = sessionStorage.getItem('lastLoginTime');
        if (sessionStorage.getItem('isLogin') == "true" && sessionStorage.getItem('status') == 'Success') {
            this.setState({ showLoader: true })
            this.borrowerSummary();
            this.getMasterStatusFlag();
            // this.getPersonalDetails()
            console.log(sessionStorage.getItem('userID'));

            if (this.props.location.frompath == "login") {
                var propsLocation = this.props.location.state.enforcePassData;
                console.log(propsLocation.enforcePasswd, propsLocation.enforcePassMsg);

                var enfprcePwMsg = propsLocation.enforcePassMsg;
                console.log("Check frompath" + enfprcePwMsg)

                if (enfprcePwMsg && enfprcePwMsg.trim() !== "") {
                    enfPwMsg = enfprcePwMsg;
                    $("#passwordExpModal").click();
                }
            }
            window.addEventListener('popstate', this.handlePopstate);
            window.history.pushState(null, null, window.location.pathname);


            //screen shrink
            window.addEventListener('resize', this.handleResize);
            this.handleResize();
        } else {
            window.location = '/login'
        }
    }
    componentWillUnmount() {
        window.removeEventListener('popstate', this.handlePopstate);
        window.removeEventListener('resize', this.handleResize);

    }
    handleResize = () => {
        console.log(window.innerWidth)
        if (window.innerWidth <= 685) {
            this.hideSideNav();
            this.setState({ textAlignFlag: false });
        } else {
            $(".component-to-toggle").show()
        }
    }
    handlePopstate = (event) => {
        event.preventDefault();
        window.history.pushState(null, null, window.location.pathname);
    };
    changePw = () => {
        window.location = "/changePassword";
        // this.props.history.push("/changePassword");
        // $("#changePwd").click()
    }
    getPersonalDetails(event) {
        fetch(BASEURL + '/usrmgmt/getpersonaldetails', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                memmid: parseInt(sessionStorage.getItem('memmID')),
            })
        }).then((Response) => Response.json())
            .then((resdata) => {
                if (resdata.status === 'Success') {
                    //console.log(resdata);
                    sessionStorage.setItem('Bname', resdata.msgdata.name);
                    sessionStorage.setItem("loginNumber", resdata.msgdata.mobile);
                    this.setState({ name: resdata.msgdata.name });
                }
                else {
                }
            })
    }

    borrowerSummary() {
        const urlDash = BASEURL + '/lsp/getborrowersummary?borrowerid=' + sessionStorage.getItem('userID')
        fetch(urlDash, {
            headers: {
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            }
        })
            .then(response => {
                console.log('Response:', response)
                return response.json();
            })
            .then((resdata) => {
                if (resdata.status == 'SUCCESS') {
                    this.setState({ showLoader: false })
                    console.log(resdata);
                    this.setState({ borSummary: resdata.msgdata });
                    // sessionStorage.setItem('Bname', resdata.msgdata.name);
                    // sessionStorage.setItem('email', resdata.msgdata.email);
                    // this.loadSummary(resdata);

                    this.setState({ noofloansrequest: resdata.msgdata.noofloansrequest });
                    this.setState({ noofactiveloans: resdata.msgdata.noofactiveloans });
                    this.setState({ totloanamtrequested: resdata.msgdata.totloanamtrequested });
                    this.setState({ totactiveloanamtdisbursed: resdata.msgdata.totactiveloanamtdisbursed });
                    this.setState({ totamtoutstanding: resdata.msgdata.totamtoutstanding })
                    this.setState({ walletbalance: resdata.msgdata.walletbalance })
                    this.setState({ noofloanspredisbursement: resdata.msgdata.noofloanspredisbursement })
                    this.setState({ noofactiveloanrequests: resdata.msgdata.noofactiveloanrequests })

                    this.setState({ p2pdue: resdata.msgdata.p2pdue });
                    // this.setState({ summary: resdata.msgdata })

                    sessionStorage.setItem("Bp2pDue", resdata.msgdata.p2pdue)

                    this.getUserStatusflag();
                    this.getPersonalDetails()
                } else {
                    this.setState({ showLoader: false })
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
            .catch((error) => {
                console.log(error)
            })
    }
    //Modified Flag
    getMasterStatusFlag = () => {
        fetch(BASEURL + '/usrmgmt/getuserstatusflagsmaster', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            }
        }).then((Response) => Response.json())
            .then((resdata) => {
                if (resdata.status === 'Success' || resdata.status === 'SUCCESS') {
                    this.setState({ flagsMasterList: resdata.msgdata }, () => {
                        this.getUserStatusflag()
                    })
                }
                else {
                }
            })
    }
    getUserStatusflag = (event) => {
        fetch(BASEURL + '/usrmgmt/getuserstatusflags', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            }
        }).then((Response) => Response.json())
            .then((resdata) => {
                if (resdata.status === 'Success') {
                    console.log(resdata.msgdata);

                    // Get the previous value of isTnCSigned from sessionStorage
                    var prevTnCSigned = sessionStorage.getItem("isTncsigned");

                    sessionStorage.setItem("SisPanVerified", resdata.msgdata.isPanVerified)
                    sessionStorage.setItem("SisAddressVerified", resdata.msgdata.isAddressVerified)
                    sessionStorage.setItem("SisAccountVerified", resdata.msgdata.isAccountVerified)
                    sessionStorage.setItem("SisVkycVerified", resdata.msgdata.isVkycVerified)
                    sessionStorage.setItem("SistnCVerified", resdata.msgdata.isTnCSigned)

                    var currentTnCSigned = resdata.msgdata.isTnCSigned;
                    // Check if the value changed from 0 to 1
                    if (prevTnCSigned === "0" && currentTnCSigned === "1") {
                        // Logout the user
                        console.log("Logout executed");
                        $("#loginExpModal").click();
                    } else {
                        console.log("Not Logout")
                    }

                    //Modified Flag
                    var flagsMasterList = this.state.flagsMasterList;
                    var actualStatusFlagJsons = resdata.msgdata;
                    // Initialize a counter for flags set to 1
                    let flagsSetTo1 = 0;
                    resultant1 = flagsMasterList.filter((flag) => flag.flagname !== "isEmailVerified");
                    console.log(resultant1);
                    resultant2 = Object.fromEntries(
                        Object.entries(actualStatusFlagJsons).filter(([key, value]) => key !== "isEmailVerified")
                    );
                    console.log(resultant2);
                    // Calculate the total number of flags
                    const totalFlags = resultant1.length;
                    console.log(totalFlags)
                    // Iterate over flagsMasterList and check if the flag in actualStatusFlagJsons is set to 1
                    resultant1.forEach(flag => {
                        if (resultant2[flag.flagname] === 1 || resultant2[flag.flagname] === 9) {
                            flagsSetTo1++;
                        }
                    });

                    // Calculate the percentage
                    const percentage = (flagsSetTo1 / totalFlags) * 100;
                    const roundFigure = Math.floor(percentage);
                    console.log(percentage);
                    console.log(`Percentage of flags set to: ${roundFigure}%`);
                    resultant = roundFigure;

                    let updatedFlagsMasterList = resultant1.map(flag => {
                        if (resultant2.hasOwnProperty(flag.flagname)) {
                            return {
                                ...flag,
                                status: resultant2[flag.flagname]
                            };
                        } else {
                            return flag;
                        }
                    });
                    console.log(updatedFlagsMasterList);
                    this.setState({ flagsMasterList1: updatedFlagsMasterList })

                    if (resultant >= 100) {
                        $(".borAccStatus").hide();
                    } else if (resultant < 100) {
                        $(".borAccStatus").show();
                    } else if (isNaN(resultant) || resultant === undefined) {
                        $(".borAccStatus").hide();
                    }

                    console.log(resultant);
                }
                else {
                }
            })
    }
    flagsModal = () => {
        $("#flagsModal").click()
    }
    routeToProfile = () => {
        // window.location = "/borrowerDetails";
        $("#routeToProf").click()
    }
    Logout = () => {
        window.location = "/login";
    }
    getToken() {
        const urlDash = BASEURL + "/pushservice/getpushnotificationkey";
        fetch(urlDash, {
            headers: {
                Authorization: "Bearer " + sessionStorage.getItem("token"),
            },
        })
            .then((response) => {
                console.log("Response:", response);
                return response.json();
            }) //updated
            .then((resdata) => {
                if (resdata.status == "SUCCESS") {
                    console.log(resdata);
                    // this.loadSummery(resdata);
                    //this.setState({ lndSummary: resdata.msgdata });
                    sessionStorage.setItem("publicKey", resdata.msgdata.publickey);
                    if (sessionStorage.getItem("publicKey") != null) {
                        serviceWorker.register();
                        subscribeUser();
                    }
                    console.log(sessionStorage.getItem("publicKey"));
                    // sessionStorage.setItem('walletBalance', resdata.msgdata.availablewalletbalance);
                    // sessionStorage.setItem('lockedFund', resdata.msgdata.lockedfunds);
                    // sessionStorage.setItem('loanStatus', resdata.msgdata.statusid);
                    // sessionStorage.setItem('Lname', resdata.msgdata.name);
                    // sessionStorage.setItem('email', resdata.msgdata.email);
                    // this.setState({ p2pdue: resdata.msgdata.p2pdue });
                } else {
                    alert("Issue: " + resdata.message);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }

    addMoney() {
        sessionStorage.setItem("amount", this.state.p2pdue);
        sessionStorage.setItem("loanaccountno", this.state.loanaccountno);
        window.location = "/payDues";
    }

    BclosedLoans = () => {
        window.location = "/viewClosedLoans"
    }
    BactiveLoans = () => {
        window.location = "/viewActiveLoans"
    }
    handleChange() {
        $(".component-to-toggle").show()
        $('.text').toggle();
        $('#PImage').toggle();
        $('#Pinfo').toggle();
    }
    hideSideNav = () => {
        $(".component-to-toggle").hide();
    }
    onAdd() {
        $('.divAdd').toggle();
        $('.btnAdd').toggle();
    }

    render() {
        const { t } = this.props
        // var TnCVerified = sessionStorage.getItem('isTncsigned');
        // let TncView;
        // if (TnCVerified == 0) {
        //     TncView = <marquee width="86%" direction="left" >
        //         Your T&C document is not signed. Please check your mail and sign it.
        //     </marquee>
        // } else if (TnCVerified == 1) {
        //     TncView = null;
        // }

        var accountDetails = sessionStorage.getItem('SisAccountVerified')
        var kycVerification = sessionStorage.getItem('SisVkycVerified')
        var personalDetails = sessionStorage.getItem('SisAddressVerified')
        var tncDetails = sessionStorage.getItem('SistnCVerified')

        console.log(accountDetails,
            kycVerification,
            personalDetails,
            tncDetails)
        //Modified Flag
        console.log(this.state.textAlignFlag)
        return (
            <div className="container-dashboard d-flex flex-row" id="wrapper" style={{ marginTop: "-7px", backgroundColor: "#F4F7FC" }}>
                {
                    this.state.showLoader && <Loader />
                }
                <div className="component-to-toggle">
                    <BorrowerSidebar />
                </div>
                <div className="main-content container-fluid mt-2" style={{ fontFamily: "Poppins,sans-serif" }}>
                    <div className="container-fluid row pt-2">
                        <div className="col-1" style={{ marginLeft: "-20px" }}>
                            <button onClick={() => { this.handleChange() }} className="btn navbar-dark navbar-toggler" id="menu-toggle"><FaBars style={{ height: "25px", width: "40px" }} /></button>
                        </div>
                        <div className='col-4' id="" style={{ marginLeft: "20px", marginTop: "5px" }}>
                        </div>
                        <div className='col'>

                        </div>
                        <div className='col'>

                        </div>
                        <div className='col'>

                        </div>
                        <div className="col-4" style={{ textAlign: "end" }}>
                            {lastLoginTime !== undefined && lastLoginTime !== null && lastLoginTime !== '' ?
                                <p style={{ fontFamily: "Poppins,sans-serif", fontWeight: "bold", color: "RGBA(34, 44, 112)", fontSize: "15px" }}>{t('Last Login Time')}: <span style={{ fontWeight: "400" }}>{lastLoginTime}</span></p>
                                : ""
                            }
                        </div>
                    </div>
                    <div className='row' style={{ marginTop: "-10px" }}>
                        <div className='col'>
                            <div className="card shadow-sm p-3 mb-3" id='commonCard-container'>
                                <div className="row align-items-center">
                                    <div className="col-4">
                                        <div className="card-content">
                                            <p className="greeting m-0">{t('Welcome ')}, {this.state.name} </p>
                                            {lastLoginTime !== undefined && lastLoginTime !== null && lastLoginTime !== '' ? ""
                                                :
                                                <p className="subtext m-0">{t(`Welcome to the platform! Glad to have you here.`)}</p>
                                            }
                                        </div>
                                    </div>
                                    <div className="col-4">
                                        <p className='borAccStatus' style={{ fontFamily: "Poppins,sans-serif", paddingLeft: "20px", fontWeight: "bold", fontSize: "15px", textAlign: "center", color: "#222C70", display: "none" }}>Your profile is {resultant}% complete</p>
                                        <div className='row mb-2 borAccStatus' style={{ marginTop: "-10px", display: "none" }}>
                                            <div className='col-lg-2 col-md-6 col-sm-12'></div>
                                            <div className='col-lg-8 col-md-8 col-sm-12' style={{ textAlign: "center", paddingLeft: "39px" }}>
                                                <ProgressBar animated now={resultant} label={`${resultant}%`} />
                                            </div>
                                            <div className='col-lg-2 col-md-6 col-sm-12'>
                                                <FaAngleDoubleDown
                                                    style={{ marginTop: "-15px", cursor: "pointer" }} onClick={this.flagsModal} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-4" style={{ textAlign: "end" }}>
                                        <div className="card-image">
                                            <img src={welcomeimg} alt="User waving" className="img-fluid" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* <div className='card item-list' style={{ borderRadius: "16px", backgroundColor: "rgba(240,249,255,1)", position: "relative", zIndex: "1", cursor: "default", color: "#222C70" }}>
                                <div className='row item-list align-items-center'>
                                    <div className="card-body">
                                        <div className='row'>
                                            <div className='col-3' id='textPart' style={{ paddingLeft: "30px" }}>
                                                <p style={{ fontFamily: "Poppins,sans-serif", fontWeight: "bold", fontSize: "17px" }}>{t('Hello')}, {this.state.name} </p>
                                                <p style={{ fontFamily: "Poppins,sans-serif" }}>{t(`It's good to see you again.`)}</p>
                                            </div>
                                            <div className='col-7' id="borAccStatus">
                                                <p style={{ fontFamily: "Poppins,sans-serif", paddingLeft: "20px", fontWeight: "bold", fontSize: "17px", textAlign: "center", color: "#222C70" }}>Your profile is {resultant}% complete</p>
                                                <div className='row mb-2' style={{ marginTop: "-10px" }}>
                                                    <div className='col-lg-3 col-md-6 col-sm-12'></div>
                                                    <div className='col-lg-6 col-md-8 col-sm-12' style={{ textAlign: "center", paddingLeft: "39px" }}>
                                                        <ProgressBar animated now={resultant} label={`${resultant}%`} />
                                                    </div>
                                                    <div className='col-lg-3 col-md-6 col-sm-12'>
                                                        <FaAngleDoubleDown
                                                            style={{ marginTop: "-15px", cursor: "pointer" }} onClick={this.flagsModal} />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='col-10' id="borAccStatus1" style={{ textAlign: "end" }}>
                                        <img src={welcomeimg} style={{ height: "100px", position: "absolute", marginTop: "-100px" }} />
                                    </div>
                                </div>
                            </div> */}
                        </div>
                    </div>

                    {/* New Design */}
                    <h4 class="ml-2" style={{ fontWeight: "bold", fontFamily: "Poppins,sans-serif", fontSize: "15px", color: "#222C70" }}>{t('Overview')}</h4>
                    <div class="row" style={{ marginTop: "-18px" }}>
                        <div class="col-md-3" >
                            <div className="card shadow-sm p-3 mb-3" style={{ borderRadius: "16px", color: "rgba(255,255,255,1)", backgroundColor: "RGBA(254,192,48,1)", cursor: "default" }}>
                                <div className="row align-items-center">
                                    <div className='col-2' style={{ marginTop: "-19px" }}>
                                        <FaIcons.FaMoneyBill style={{ fontSize: "30px" }} />
                                    </div>
                                    <div className="col">
                                        <div className="card-content" style={{ color: "rgba(255,255,255,1)" }}>
                                            <p className="greeting m-0">{t('Amount Requested')}</p>
                                            <p className="subtext m-0">{this.state.totloanamtrequested ? <span>
                                                ₹ {parseFloat(this.state.totloanamtrequested).toFixed(2).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
                                            </span> : "0"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3" >
                            <div className="card shadow-sm p-3 mb-3" style={{ borderRadius: "16px", color: "rgba(255,255,255,1)", backgroundColor: "RGBA(248,122,64,1)", cursor: "default" }}>
                                <div className="row align-items-center">
                                    <div className='col-2' style={{ marginTop: "-19px" }}>
                                        <FaIcons.FaMoneyBill style={{ fontSize: "30px" }} />
                                    </div>
                                    <div className="col">
                                        <div className="card-content" style={{ color: "rgba(255,255,255,1)" }}>
                                            <p className="greeting m-0">{t('Amount Disbursed')}</p>
                                            <p className="subtext m-0">{this.state.totactiveloanamtdisbursed ? <span>
                                                ₹ {parseFloat(this.state.totactiveloanamtdisbursed).toFixed(2).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
                                            </span> : "0"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3" >
                            <div className="card shadow-sm p-3 mb-3" style={{ borderRadius: "16px", color: "rgba(255,255,255,1)", backgroundColor: "RGBA(21,162,183,1)", cursor: "default" }}>
                                <div className="row align-items-center">
                                    <div className='col-2' style={{ marginTop: "-19px" }}>
                                        <FaIcons.FaMoneyBill style={{ fontSize: "30px" }} />
                                    </div>
                                    <div className="col">
                                        <div className="card-content" style={{ color: "rgba(255,255,255,1)" }}>
                                            <p className="greeting m-0">{t('Amount Outstanding')}</p>
                                            <p className="subtext m-0">{this.state.totamtoutstanding ? <span>
                                                ₹ {parseFloat(this.state.totamtoutstanding).toFixed(2).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
                                            </span> : "0"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3" >
                            <div className="card shadow-sm p-3 mb-3" style={{ borderRadius: "16px", color: "rgba(255,255,255,1)", backgroundColor: "RGBA(5,116,22,1)", cursor: "default" }}>
                                <div className="row align-items-center">
                                    <div className='col-2' style={{ marginTop: "-19px" }}>
                                        <FaIcons.FaMoneyBill style={{ fontSize: "30px" }} />
                                    </div>
                                    <div className="col">
                                        <div className="card-content" style={{ color: "rgba(255,255,255,1)" }}>
                                            <p className="greeting m-0">{t('Platform Due')}<br /> <span style={{ fontWeight: "400" }}>{this.state.p2pdue ? <span>
                                                ₹ {parseFloat(this.state.p2pdue).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
                                            </span> : "0.00"}</span>
                                            </p>
                                            <p className="subtext m-0">{this.state.p2pdue > 0 ?
                                                <button id="payButton" className="btn btn-info font-weight-bold float-right" onClick={this.addMoney} style={{ backgroundColor: "RGB(74, 98, 217)", textAlign: "center", marginTop: "-37px" }}>{t('Pay')}</button>
                                                : null}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* second row */}
                    <div class="row" style={{ marginTop: "-15px" }}>
                        <div class="col-md-3" >
                            <Link to="/loanRequest" style={{ textDecoration: "none" }}>
                                <div className="card shadow-sm p-4 mb-3" style={{ borderRadius: "16px", color: "rgba(255,255,255,1)", backgroundColor: "RGBA(18,44,84,1)" }}>
                                    <div className="row align-items-center">
                                        <div className='col-2'>
                                            <FaIcons.FaRegListAlt style={{ fontSize: "30px" }} />
                                        </div>
                                        <div className="col">
                                            <div className="card-content" style={{ color: "rgba(255,255,255,1)" }}>
                                                <p className="greeting m-0">{t('Request New Loan')}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                        <div class="col-md-3" >
                            <Link to="/viewAllLoanRequests" style={{ textDecoration: "none" }}>
                                <div className="card shadow-sm p-3 mb-3" style={{ borderRadius: "16px", color: "rgba(255,255,255,1)", backgroundColor: "RGBA(23,166,242,1)", cursor: "default" }}>
                                    <div className="row align-items-center">
                                        <div className='col-2' style={{ marginTop: "-19px" }}>
                                            <FaIcons.FaMoneyCheck style={{ fontSize: "30px" }} />
                                        </div>
                                        <div className="col">
                                            <div className="card-content" style={{ color: "rgba(255,255,255,1)" }}>
                                                <p className="greeting m-0">{t('Loan Requests')}</p>
                                                <p className="subtext m-0">{this.state.noofloansrequest ? this.state.noofloansrequest : "0"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                        <div class="col-md-3" >
                            <Link to="/ViewAllLoans" style={{ textDecoration: "none" }}>
                                <div className="card shadow-sm p-3 mb-3" style={{ borderRadius: "16px", color: "rgba(255,255,255,1)", backgroundColor: "RGBA(23,182,113,1)", cursor: "default" }}>
                                    <div className="row align-items-center">
                                        <div className='col-2' style={{ marginTop: "-19px" }}>
                                            <FaIcons.FaMoneyCheck style={{ fontSize: "30px" }} />
                                        </div>
                                        <div className="col">
                                            <div className="card-content" style={{ color: "rgba(255,255,255,1)" }}>
                                                <p className="greeting m-0">{t('Active Loans')}</p>
                                                <p className="subtext m-0">{this.state.noofactiveloans ? this.state.noofactiveloans : "0"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                        <div class="col-md-3" >
                            <Link to="/ViewAllLoans" style={{ textDecoration: "none" }}>
                                <div className="card shadow-sm p-3 mb-3" style={{ borderRadius: "16px", color: "rgba(255,255,255,1)", backgroundColor: "RGBA(253,89,26,1)", cursor: "default" }}>
                                    <div className="row align-items-center">
                                        <div className='col-2' style={{ marginTop: "-19px" }}>
                                            <FaIcons.FaMoneyCheck style={{ fontSize: "30px" }} />
                                        </div>
                                        <div className="col">
                                            <div className="card-content" style={{ color: "rgba(255,255,255,1)" }}>
                                                <p className="greeting m-0">{t('Closed Loans')}</p>
                                                <p className="subtext m-0">0
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>

                    {/* wallet Detials */}
                    <div className='row' style={{ marginTop: "-10px", marginBottom: "31px" }}>
                        <div className='col'>
                            <div className="card shadow-sm p-3 mb-3" style={{ fontSize: "15px", cursor: "default", borderRadius: "15px", backgroundColor: "RGBA(255,247,229,1)" }}>
                                <div class="card-header" style={{ backgroundColor: "RGBA(255,168,0,1)", width: "110.8%", height: "28px", marginTop: "-17px", marginLeft: "-17.5px", borderRadius: "15px 15px 0 0", color: "white", fontWeight: "bold" }}>
                                    <p style={{ marginTop: "-6px", textAlign: "center", marginLeft: "-70px" }}>{t('Escrow Account')}</p>
                                </div>
                                <div className="row align-items-center" style={{ marginLeft: "-40px" }}>
                                    <div className='col-5' style={{ textAlign: "end" }}>
                                        <img src={walletimg} style={{ height: "30px" }} />
                                    </div>
                                    <div className="col-3" style={{ color: "#222C70", fontSize: "15px", textAlign: "" }}>
                                        <div className="card-content">
                                            <p className="m-0" style={{ fontWeight: "500" }}>{t('Escrow Account Balance')}</p>
                                            <p className="m-0" style={{ paddingLeft: "55px" }}>{this.state.walletbalance ? <span>
                                                ₹ {parseFloat(this.state.walletbalance).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
                                            </span> : "0.00"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* <div className='row' style={{ marginLeft: "0.5px", marginTop: "-13px" }}>
                        <div class="card text-center" id="BescrowChange1" style={{ width: "98.5%", fontSize: "15px", borderRadius: "15px", height: "160px", cursor: "default" }}>
                            <div class="card-header" style={{ backgroundColor: "RGBA(255,168,0,1)", width: "110.8%", height: "28px", marginLeft: "-13.5px", borderRadius: "15px 15px 0 0", color: "white", fontWeight: "bold" }}>
                                <p style={{ marginTop: "-6px" }}>{t('Escrow Account')}</p>
                            </div>
                            <div class="row card-body" style={{ backgroundColor: "RGBA(255,247,229,1)", width: "107.5%", marginLeft: "-12px", borderRadius: "0 0 15px 15px" }}>
                                <div className='col' id="BescrowChange2" style={{ textAlign: "end" }}>
                                    <img src={walletimg} style={{ fontSize: "30px" }} />
                                </div>
                                <div className='col-3' id="BescrowChange3">
                                    <p className='card-title' style={{ color: "#222C70" }}>{t('Escrow Account Balance')}</p>
                                    <p className='card-text' style={{ color: "#222C70" }}>
                                        ₹ {parseFloat(this.state.walletbalance).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
                                    </p>
                                </div>
                                <div className='col'>

                                </div>

                            </div>

                        </div>
                    </div> */}

                    {/* Password expiry */}
                    <button type="button" id='passwordExpModal' style={{ display: "none" }} class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter3">
                        Password expiry modal
                    </button>
                    <div class="modal fade" id="exampleModalCenter3" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered" role="document">
                            <div class="modal-content">
                                <div class="modal-header" style={{ marginBottom: "-20px" }}>
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <dvi class="modal-body" style={{ marginBottom: "-20px" }}>
                                    <img src={resetPw} style={{ width: "80px" }} />
                                    <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold", paddingLeft: "10px" }}>{enfPwMsg}</p>
                                </dvi>
                                <div class="modal-footer">
                                    <button type="button" class="btn text-white"
                                        style={{ backgroundColor: "rgb(0, 121, 191)" }} onClick={this.changePw}>
                                        Change password
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Login expiry */}
                    <button type="button" id='loginExpModal' style={{ display: "none" }} class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter31">
                        Login Expiry modal
                    </button>
                    <div class="modal fade" id="exampleModalCenter31" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered" role="document">
                            <div class="modal-content">
                                <div class="modal-header" style={{ marginBottom: "-20px" }}>
                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <dvi class="modal-body" style={{ marginBottom: "-20px" }}>
                                    <img src={resetPw} style={{ width: "80px" }} />
                                    <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold", paddingLeft: "10px" }}>
                                        You have become privilege customer. please Logout and Login to access all the features.
                                    </p>
                                </dvi>
                                <div class="modal-footer">
                                    <button type="button" class="btn text-white"
                                        style={{ backgroundColor: "rgb(0, 121, 191)" }} onClick={this.Logout}>
                                        Okay
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Modified Flag */}
                    <button type="button" id="flagsModal" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal12" style={{ display: "none" }}>
                        Flags Modal
                    </button>
                    <div class="modal fade" id="exampleModal12" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="static">
                        <div class="modal-dialog" role="document">
                            <div class="modal-content">
                                <div class="modal-body">
                                    <div className='row mb-2'>
                                        <div className='col-10'>
                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "600", paddingLeft: "8px" }}><img src={batch} style={{ width: "26px" }} /> &nbsp;Profile Status</p>
                                            <hr style={{ width: "70px", marginTop: "-12px" }} />
                                        </div>
                                        <div className="col-2">
                                            <FaTimesCircle type="button" class="close" data-dismiss="modal" aria-label="Close" style={{ color: "rgb(5, 54, 82)", fontSize: "18px" }} />
                                        </div>
                                    </div>
                                    <div className="mb-2" style={{ marginTop: "-10px", }}>
                                        <div className="row">
                                            {this.state.flagsMasterList1 && this.state.flagsMasterList1.length > 0 &&
                                                this.state.flagsMasterList1.map((flags, index) => {
                                                    return (
                                                        <div className='col-lg-6 col-md-10 col-sm-12' key={index}>
                                                            {(flags.status == 1 || flags.status == 9) ? <FaCheckCircle style={{ color: "green" }} /> : <FaTimesCircle style={{ color: "grey" }} />}
                                                            &nbsp;<span style={{ color: "#222C70" }}>{flags.processdesc}</span>
                                                        </div>
                                                    )
                                                })}
                                        </div>
                                        <div className='row'>
                                            <div className='col' style={{ textAlign: "center" }}>
                                                <button className='btn text-white' id='BorcompleteProfile' data-dismiss="modal"
                                                    onClick={this.routeToProfile}
                                                    style={{ backgroundColor: "rgb(0, 121, 191)" }}>
                                                    Complete Profile
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Link to="/borrowerDetails">
                        <button id='routeToProf' style={{ display: "none" }}>Route
                        </button>
                    </Link>
                    {/* Route to change password page */}
                    <Link to="/changePassword"><button id='changePwd' style={{ display: "none" }}>Refresh
                    </button></Link>

                    {/* Footer */}
                    <div className="absolute">
                        <div className="footer ">
                            <div className="footer-body">
                                <div className="row">
                                    <div className="bg-dark">
                                        <h5 className="mb-0"></h5>
                                        <span className="mb-0"></span>
                                        <p className="m-3 text-light">{CP_VERSION} </p>
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

export default withTranslation()(BorrowerDashboard)

