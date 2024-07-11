import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { BASEURL } from '../assets/baseURL';
import { CP_VERSION } from '../assets/baseURL';
import $ from 'jquery';
// import './EvaluatorDashboard.css';
import profile from '../assets/Profile-dashboard.gif';
import wallet from '../assets/wallet-dashboard.gif';
import Verification from '../assets/Verification-dashboard.gif';
import { withTranslation } from 'react-i18next';
import EvaluatorSidebar from '../../SidebarFiles/EvaluatorSidebar';
import { FaBars, FaRegFileAlt, FaCheckCircle, FaTimesCircle, FaAngleDoubleDown } from "react-icons/fa";
import * as FaIcons from "react-icons/fa";
import welcomeimg from '../assets/welcomeface2.png';
import walletimg from '../assets/icons/wallet.png';
import { confirmAlert } from "react-confirm-alert";
import resetPw from '../assets/pwexpired.png';
//Modified Flag
import ProgressBar from 'react-bootstrap/ProgressBar';
import batch from '../assets/batch.png';

import { TnC } from '../assets/Constant';
var acc = 20;
var kyc = 20;
var personal = 40;
var reference = 20
var tnc = 20;
let resultant;
let resultant1;
let resultant2

var enfPwMsg = "";
var lastLoginTime = "";
class EvaluatorDashboard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataLine: {
                labels: [],
                datasets: [
                    {
                        label: "",
                        fill: true,
                        lineTension: 0.3,
                        backgroundColor: "rgba(225, 204,230, .3)",
                        borderColor: "rgb(205, 130, 158)",
                        borderCapStyle: "butt",
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: "miter",
                        pointBorderColor: "rgb(205, 130,1 58)",
                        pointBackgroundColor: "rgb(255, 255, 255)",
                        pointBorderWidth: 10,
                        pointHoverRadius: 5,
                        pointHoverBackgroundColor: "rgb(0, 0, 0)",
                        pointHoverBorderColor: "rgba(220, 220, 220,1)",
                        pointHoverBorderWidth: 2,
                        pointRadius: 1,
                        pointHitRadius: 10,

                        data: []
                    }
                ]
            },
            dataBar: {
                labels: [],

                datasets: [
                    {
                        label: "% of Votes",
                        data: [12, 19, 3, 5, 2, 3],
                        backgroundColor: [
                            "rgba(255, 134,159,0.4)",
                            "rgba(98,  182, 239,0.4)",
                            "rgba(255, 218, 128,0.4)",
                            "rgba(113, 205, 205,0.4)",
                            "rgba(170, 128, 252,0.4)",
                            "rgba(255, 177, 101,0.4)"
                        ],
                        borderWidth: 2,
                        borderColor: [
                            "rgba(255, 134, 159, 1)",
                            "rgba(98,  182, 239, 1)",
                            "rgba(255, 218, 128, 1)",
                            "rgba(113, 205, 205, 1)",
                            "rgba(170, 128, 252, 1)",
                            "rgba(255, 177, 101, 1)"
                        ]
                    }
                ]
            },
            barChartOptions: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    xAxes: [
                        {
                            barPercentage: 1,
                            gridLines: {
                                display: true,
                                color: "rgba(0, 0, 0, 0.1)"
                            }
                        }
                    ],
                    yAxes: [
                        {
                            gridLines: {
                                display: true,
                                color: "rgba(0, 0, 0, 0.1)"
                            },
                            ticks: {
                                beginAtZero: true
                            }
                        }
                    ]
                }
            },
            evalSummary: {},
            amount: "",
            loanaccountno: "",
            paymenttype: 1,
            p2pdue: "",
            txnamt: "100",
            usertype: "5",

            name: "",
            walletbalance: "",
            commissionearned: "",
            commissiondue: "",
            noofactiverequests: "",
            activeloanamtdisbursed: "",
            noofactiveloans: "",
            totloansevaluated: "",
            loanreqamtevaluated: "",
            loanreqsevaluated: "",
            pendingrequest: "",
            //Modified Flag
            flagsMasterList: [],
            flagsMasterList1: [],
        }
        this.addMoney = this.addMoney.bind(this);
        this.txnamt = this.txnamt.bind(this);
        // this.withdrawMoney = this.withdrawMoney.bind(this);
    }

    txnamt(event) {
        this.setState({ txnamt: event.target.value })
    }
    componentDidMount() {
        this.evaluatorSummary();
        this.getUserStatusflag();
        this.getMasterStatusFlag()
        this.getPersonalDetails();

        lastLoginTime = sessionStorage.getItem('lastLoginTime');
        if (sessionStorage.getItem('isLogin') == "true" && sessionStorage.getItem('status') == 'Success') {
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
        } else {
            window.location = '/login'
        }

    }
    changePw = () => {
        window.location = "/changePassword";
        //this.props.history.push("/changePassword");
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
                    sessionStorage.setItem("loginNumber", resdata.msgdata.mobile);
                }
                else {
                }
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

                    sessionStorage.setItem("SisPanVerified", resdata.msgdata.isPanVerified)
                    sessionStorage.setItem("SisAddressVerified", resdata.msgdata.isAddressVerified)
                    sessionStorage.setItem("SisAccountVerified", resdata.msgdata.isAccountVerified)
                    sessionStorage.setItem("SisVkycVerified", resdata.msgdata.isVkycVerified)
                    sessionStorage.setItem("SisVkycVerified", resdata.msgdata.isVkycVerified)

                    // Get the previous value of isTnCSigned from sessionStorage
                    var prevTnCSigned = sessionStorage.getItem("isTncsigned");

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
                        $(".evlAccStatus").hide();
                    } else if (resultant < 100) {
                        $(".evlAccStatus").show();
                    } else if (isNaN(resultant) || resultant === undefined) {
                        $(".evlAccStatus").hide();
                    }
                }
                else {
                    alert(resdata.message);
                }
            })
    }
    Logout = () => {
        window.location = "/login";
    }
    evaluatorSummary() {
        const urlDash = BASEURL + '/lsp/getevalsummary'
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
                    console.log(resdata);
                    this.setState({ evalSummary: resdata.msgdata });
                    this.setState({ p2pdue: resdata.msgdata.p2pdue });
                    this.setState({ name: resdata.msgdata.name });
                    this.setState({ walletbalance: resdata.msgdata.walletbalance });
                    this.setState({ commissionearned: resdata.msgdata.commissionearned });
                    this.setState({ commissiondue: resdata.msgdata.commissiondue });
                    this.setState({ noofactiverequests: resdata.msgdata.noofactiverequests });
                    this.setState({ activeloanamtdisbursed: resdata.msgdata.activeloanamtdisbursed });
                    this.setState({ noofactiveloans: resdata.msgdata.noofactiveloans })
                    // this.setState({ totloansevaluated: resdata.msgdata.totloansevaluated });
                    this.setState({ loanreqsevaluated: resdata.msgdata.loanreqsevaluated });
                    this.setState({ loanreqamtevaluated: resdata.msgdata.loanreqamtevaluated });
                    this.setState({ pendingrequest: resdata.msgdata.pendingrequest });
                } else {
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

    addMoney() {
        // const popup = window.confirm("Are you sure you want to pay the dues ?");
        // if (popup == true) {
        //     sessionStorage.setItem("amount", this.state.p2pdue);
        //     window.location = "/payEvlDues";
        // }
        sessionStorage.setItem("amount", this.state.p2pdue);
        window.location = "/payEvlDues";
    }
    flagsModal = () => {
        $("#flagsModal").click()
    }
    routeToProfile = () => {
        // window.location = "/evaluatorDetails";
        $("#routeToProf").click()
    }
    onWidraw() {
        $('.divWid').toggle();
        $('.btnWid').toggle();
    }
    addMoneyToWallet = () => {
        window.location = "/evalWallet"
    }

    handleChange() {
        $('.text').toggle();
        $('#PImage').toggle();
        $('#Pinfo').toggle();
    }

    render() {
        const { t } = this.props

        var accountDetails = sessionStorage.getItem('SisAccountVerified')
        var kycVerification = sessionStorage.getItem('SisVkycVerified')
        var personalDetails = sessionStorage.getItem('SisAddressVerified')
        var tncDetails = sessionStorage.getItem('SistnCVerified')
        var referenceDetails = sessionStorage.getItem('SisRefVerified')
        console.log(referenceDetails)

        console.log(accountDetails,
            kycVerification,
            personalDetails,
            tncDetails)
        //Modified Flag

        return (
            <div className="container-dashboard d-flex flex-row" id="wrapper" style={{ marginTop: "-7px", backgroundColor: "#F4F7FC" }}>
                <EvaluatorSidebar />
                <div className="main-content container-fluid mt-2">
                    <div className="container-fluid row pt-2">
                        <div className="col-1" style={{ marginLeft: "-20px" }}>
                            <button onClick={() => { this.handleChange() }} className="btn navbar-dark navbar-toggler" id="menu-toggle"><FaBars style={{ height: "30px", width: "40px" }} /></button>
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
                                            <p className="greeting m-0">{t('Welcome ')}, {this.state.name}</p>
                                            {lastLoginTime !== undefined && lastLoginTime !== null && lastLoginTime !== '' ? ""
                                                :
                                                <p className="subtext m-0">{t(`Welcome to the platform! Glad to have you here.`)}</p>
                                            }
                                            {referenceDetails == 0 ? <span>
                                                <p style={{ fontFamily: "Poppins,sans-serif", fontWeight: "bold", color: "RGBA(5,54,82,1)", fontSize: "15px" }}>
                                                    Reference details incomplete
                                                </p>
                                                <p style={{ fontFamily: "Poppins,sans-serif", color: "RGBA(5,54,82,1)", marginTop: "-10px" }}>
                                                    <FaTimesCircle style={{ color: "grey" }} />
                                                    &nbsp;<span style={{ color: "#222C70" }}>Reference Details</span>
                                                </p>
                                                <Link to="/evaReferenceDetails">
                                                    <button className='btn text-white' id='BorcompleteProfile' style={{ backgroundColor: "rgb(0, 121, 191)", marginTop: "-6px", marginBottom: "10px" }}>
                                                        Update Reference
                                                    </button>
                                                </Link>
                                            </span>
                                                : null
                                            }
                                        </div>
                                    </div>
                                    <div className="col-4">
                                        <p className='evlAccStatus' style={{ fontFamily: "Poppins,sans-serif", paddingLeft: "20px", fontWeight: "bold", fontSize: "15px", textAlign: "center", color: "#222C70", display: "none" }}>Your profile is {resultant}% complete</p>
                                        <div className='row mb-2 evlAccStatus' style={{ marginTop: "-10px", display: "none" }}>
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
                        </div>
                    </div>
                    {/* Load Info */}
                    <button type="button" id='LaunchDetails' style={{ display: "none" }} class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter">
                        Instructions
                    </button>
                    <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered" role="document">
                            <div class="modal-content">
                                <div className="modal-body">
                                    <div className='row'>
                                        <div className='col'>
                                            <p style={{ color: "rgba(5,54,82,1)" }}><FaRegFileAlt style={{ fontSize: "25px" }} />User Instructions</p>
                                            <hr style={{ width: "140px" }} />
                                            <div className='row p-2'>
                                                <div className='col' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                    <p>1.After registration set reference details.</p>
                                                    <p>2.Fill the details in required fields.</p>
                                                    <p>3.Verification should completed by System user  for the 2 reference</p>
                                                    <p>4.Approval will be completed by the System admin.</p>
                                                    <p>5.Update your KYC status to verified.</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='row '>
                                        <div className='col' style={{ textAlign: "center" }}>
                                            <button type="button" class="btn" style={{ backgroundColor: "rgba(40,116,166,1)", color: "white" }} data-dismiss="modal">Close</button>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* new Design */}
                    <h4 class="ml-2" style={{ fontWeight: "bold", fontFamily: "Poppins,sans-serif", fontSize: "15px", color: "#222C70" }}>{t('Overview')}</h4>
                    <div class="row" style={{ marginTop: "-18px" }}>
                        <div class="col-md-3" >
                            <div className="card shadow-sm p-3 mb-3" style={{ borderRadius: "16px", color: "rgba(255,255,255,1)", backgroundColor: "RGBA(254,192,48,1)", cursor: "default" }}>
                                <div className="row align-items-center">
                                    <div className='col-2' style={{ marginTop: "-19px" }}>
                                        <FaIcons.FaMoneyCheck style={{ fontSize: "30px" }} />
                                    </div>
                                    <div className="col">
                                        <div className="card-content" style={{ color: "rgba(255,255,255,1)" }}>
                                            <p className="greeting m-0">{t('Amount Evaluated')}</p>
                                            <p className="subtext m-0">
                                                {this.state.loanreqamtevaluated ? <span>
                                                    ₹ {parseFloat(this.state.loanreqamtevaluated).toFixed(2).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
                                                </span> : "0.00"}
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
                                        <FaIcons.FaMoneyCheck style={{ fontSize: "30px" }} />
                                    </div>
                                    <div className="col">
                                        <div className="card-content" style={{ color: "rgba(255,255,255,1)" }}>
                                            <p className="greeting m-0">{t('Commission Earned')}</p>
                                            <p className="subtext m-0">
                                                {this.state.commissionearned ? <span>
                                                    ₹ {parseFloat(this.state.commissionearned).toFixed(2).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
                                                </span> : "0.00"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3" >
                            <div className="card shadow-sm p-3 mb-3" style={{ borderRadius: "16px", color: "rgba(255,255,255,1)", backgroundColor: "RGBA(34, 84, 130)", cursor: "default" }}>
                                <div className="row align-items-center">
                                    <div className='col-2' style={{ marginTop: "-19px" }}>
                                        <FaIcons.FaMoneyCheck style={{ fontSize: "30px" }} />
                                    </div>
                                    <div className="col">
                                        <div className="card-content" style={{ color: "rgba(255,255,255,1)" }}>
                                            <p className="greeting m-0">{t('Requests Evaluated')}</p>
                                            <p className="subtext m-0">
                                                {this.state.loanreqsevaluated ? this.state.loanreqsevaluated : "0"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3" >
                            <div className="card shadow-sm p-3 mb-3" style={{ borderRadius: "16px", color: "rgba(255,255,255,1)", backgroundColor: "RGBA(23,182,113,1)", cursor: "default" }}>
                                <div className="row align-items-center">
                                    <div className='col-2' style={{ marginTop: "-19px" }}>
                                        <FaIcons.FaRegMoneyBillAlt style={{ fontSize: "30px" }} />
                                    </div>
                                    <div className="col">
                                        <div className="card-content" style={{ color: "rgba(255,255,255,1)" }}>
                                            <p className="greeting m-0">{t('Pending Requests')}</p>
                                            <p className="subtext m-0">
                                                {this.state.pendingrequest ? this.state.pendingrequest : "0"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/*     wallet Detials */}
                    <div className='row' style={{ marginTop: "-10px", marginBottom: "5px" }}>
                        <div className='col'>
                            <div className="card shadow-sm p-3 mb-3" style={{ fontSize: "15px", cursor: "default", borderRadius: "15px", backgroundColor: "RGBA(255,247,229,1)" }}>
                                <div class="card-header" style={{ backgroundColor: "RGBA(255,168,0,1)", width: "110.8%", height: "28px", marginTop: "-17px", marginLeft: "-17.5px", borderRadius: "15px 15px 0 0", color: "white", fontWeight: "bold" }}>
                                    <p style={{ marginTop: "-6px", textAlign: "center", marginLeft: "-70px" }}>{t('Account Details')}</p>
                                </div>
                                <div className="row align-items-center" style={{ marginLeft: "-40px" }}>
                                    <div className='col-5' style={{ textAlign: "end" }}>
                                        <img src={walletimg} style={{ height: "30px" }} />
                                    </div>
                                    <div className="col-3" style={{ color: "#222C70", fontSize: "15px" }}>
                                        <div className="card-content">
                                            <p className="m-0" style={{ fontWeight: "500", paddingLeft: "30px" }}>{t('Account Balance')}</p>
                                            <p className="m-0" style={{ paddingLeft: "44px" }}>{this.state.walletbalance ? <span>
                                                ₹ {parseFloat(this.state.walletbalance).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
                                            </span> : "0.00"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="col-2" style={{ color: "#222C70", fontSize: "15px" }}>
                                        <div className="card-content">
                                            <p className="m-0" style={{ fontWeight: "500" }}>{t('Platform Due')}</p>
                                            <p className="m-0"><span style={{ fontWeight: "400" }}>{this.state.p2pdue ? <span>
                                                ₹ {parseFloat(this.state.p2pdue).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
                                            </span> : "0.00"}</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-8' style={{ textAlign: "end" }}>
                                        <button className="btn btn-sm" style={{ marginRight: "53px", backgroundColor: "RGBA(255,168,42,1)", color: "white", width: "200px" }} onClick={this.addMoneyToWallet}>Withdraw Money</button>
                                    </div>
                                    <div className='col-3' style={{ textAlign: "initial" }}>
                                        {this.state.evalSummary.p2pdue > 0 ?
                                            <button className="btn btn-sm font-weight-bold text-white" onClick={this.addMoney} style={{ backgroundColor: "RGB(74, 98, 217)", marginLeft: "-7px" }}>{t('PayDue')}</button>
                                            : null}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

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
                    <Link to="/evaluatorDetails">
                        <button id='routeToProf' style={{ display: "none" }}>Route
                        </button>
                    </Link>
                    <div className="fixed">
                        <div className="footer">
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

export default withTranslation()(EvaluatorDashboard)

