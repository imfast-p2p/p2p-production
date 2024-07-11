import React, { Component } from 'react';
import './LenderDashboard.css';
import { Link } from 'react-router-dom';
import { MDBContainer } from "mdbreact";
import { BASEURL } from '../assets/baseURL';
import { CP_VERSION } from '../assets/baseURL';
import LenderSidebar from '../../SidebarFiles/LenderSidebar';
import $ from 'jquery';
import { withTranslation } from 'react-i18next';
import * as serviceWorker from "../../serviceWorker";
import { subscribeUser } from "../../Subscription";
import { FaBars, FaCheckCircle, FaTimesCircle, FaAngleDoubleDown } from "react-icons/fa";
import * as FaIcons from "react-icons/fa";
import welcomeimg from '../assets/welcomeface2.png';
import walletimg from '../assets/icons/wallet.png'
import { confirmAlert } from "react-confirm-alert";

import Loader from '../Loader/Loader';
import { TnC } from '../assets/Constant';
import resetPw from '../assets/pwexpired.png';

//Modified Flag
import ProgressBar from 'react-bootstrap/ProgressBar';
import batch from '../assets/batch.png';

var acc = 20;
var kyc = 20;
var personal = 40;
var tnc = 20;
let resultant;
let resultant1;
let resultant2

var enfPwMsg = "";
var lastLoginTime = "";
class LenderDashboard extends Component {
    constructor(props) {
        super(props)
        this.state = {
            dataBar: {
                labels: [],
                // labels: ["Red", "Blue", "Yellow", "Green", "Purple", "Orange"],
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
            lndSummary: {},
            amount: "",
            loanaccountno: "",
            paymenttype: "",
            p2pdue: "",
            walletBalance: "",
            avwallet: "",
            totfunding: "",
            totactivefunding: "",

            name: "",
            noofactiveloansfunded: "",
            totactivefunding: "",
            noofloansfundscommitted: "",
            lockedfunds: "",
            availablewalletbalance: "",
            walletbalance: "",

            fromdate: "",
            todate: "",
            borTrnList: [],
            borTrnList2: [],
            dtoday: "",
            dfrday: "",

            showLoader: false,

            isPanVerified: "",
            isAddressVerified: "",
            isAccountVerified: "",
            isVkycVerified: "",
            isTnCSigned: "",

            //Modified Flag
            flagsMasterList: [],
            flagsMasterList1: [],
        }
        this.addMoney = this.addMoney.bind(this);
    }
    componentDidMount() {
        // this.getToken();
        // serviceWorker.register();
        // subscribeUser();
        lastLoginTime = sessionStorage.getItem('lastLoginTime');

        if (sessionStorage.getItem('isLogin') == "true" && sessionStorage.getItem('status') == 'Success') {
            this.setState({ showLoader: true });
            this.lenderSummary();
            this.getUserStatusflag()
            this.getMasterStatusFlag()
            this.getPersonalDetails()

            // this.getvapdetails();
            console.log(sessionStorage.getItem('userID'))

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
                } else {
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
                        $(".lenAccStatus").hide();
                    } else if (resultant < 100) {
                        $(".lenAccStatus").show();
                    } else if (isNaN(resultant) || resultant === undefined) {
                        $(".lenAccStatus").hide();
                    }

                    console.log(resultant)
                }
                else {
                    alert(resdata.message);
                }
            })
    }
    Logout = () => {
        window.location = "/login";
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
                    sessionStorage.setItem('Lname', resdata.msgdata.name);
                    sessionStorage.setItem("loginNumber", resdata.msgdata.mobile);
                }
                else {
                }
            })
    }

    lenderSummary() {
        const urlDash = BASEURL + '/lms/getlendersummary?lenderid=' + sessionStorage.getItem('userID')
        fetch(urlDash, {
            headers: {
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            }
        })
            .then(response => {
                console.log('Response:', response)
                return response.json();
            })//updated
            .then((resdata) => {
                if (resdata.status == 'SUCCESS') {
                    console.log(resdata);
                    this.setState({ showLoader: false })
                    // this.loadSummery(resdata);
                    this.setState({ lndSummary: resdata.msgdata });

                    sessionStorage.setItem('walletBalance', resdata.msgdata.availablewalletbalance);
                    sessionStorage.setItem('lockedFund', resdata.msgdata.lockedfunds);
                    sessionStorage.setItem('loanStatus', resdata.msgdata.statusid);
                    sessionStorage.setItem('Lname', resdata.msgdata.name);
                    sessionStorage.setItem('email', resdata.msgdata.email);

                    //updated
                    this.setState({ name: resdata.msgdata.name });
                    this.setState({ noofactiveloansfunded: resdata.msgdata.noofactiveloansfunded });
                    this.setState({ totactivefunding: resdata.msgdata.totactivefunding });
                    this.setState({ noofloansfundscommitted: resdata.msgdata.noofloansfundscommitted });
                    this.setState({ lockedfunds: resdata.msgdata.lockedfunds });
                    this.setState({ avwallet: resdata.msgdata.availablewalletbalance });
                    this.setState({ walletBalance: resdata.msgdata.walletbalance });
                    this.setState({ p2pdue: resdata.msgdata.p2pdue });
                    this.setState({ totfunding: resdata.msgdata.totfunding });
                    this.setState({ totactivefunding: resdata.msgdata.totactivefunding })
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
                } else {
                    alert("Issue: " + resdata.message);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }
    getvapdetails = () => {
        fetch('http://localhost:9000/vapidpublickey', {
            method: 'get',
        }).then((Response) => {
            return Response.text();
        }).then((resdata) => {
            // this.setState({ convertedVapidPublicKey: resdata })
            var convertedVapidPublicKey = resdata;
            console.log(convertedVapidPublicKey);
            sessionStorage.setItem("publicKey", resdata)
            if (sessionStorage.getItem("publicKey") != null) {
                serviceWorker.register();
                subscribeUser();
            }

        })
            .catch((error) => {
                console.error('Error retrieving VAPID public key:', error)
            })

    }
    addMoney() {
        // const popup = window.confirm("Are you sure you want to pay the dues ?");
        // if (popup == true) {
        //     sessionStorage.setItem("amount", this.state.p2pdue);
        //     window.location = "/payLndDues";
        // }
        sessionStorage.setItem("amount", this.state.p2pdue);
        window.location = "/payLndDues";
    }
    flagsModal = () => {
        $("#flagsModal").click()
    }
    routeToProfile = () => {
        // window.location = "/LenderDetails";
        $("#routeToProf").click()
    }
    addMoneyToWallet = () => {
        window.location = "/myWallet"
    }

    handleChange() {
        $('.text').toggle();
        $('#PImage').toggle();
        $('#Pinfo').toggle();
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
        return (
            <div className="container-dashboard d-flex flex-row" id="wrapper" style={{ marginTop: "-10px", backgroundColor: "#f4f7fc" }}>
                {
                    this.state.showLoader && <Loader />
                }
                <LenderSidebar />
                <div className="main-content container-fluid mt-2">
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
                                            <p className="greeting m-0">{t('Welcome ')}, {sessionStorage.getItem('Lname')}</p>
                                            {lastLoginTime !== undefined && lastLoginTime !== null && lastLoginTime !== '' ? ""
                                                :
                                                <p className="subtext m-0">{t(`Welcome to the platform! Glad to have you here.`)}</p>
                                            }
                                        </div>
                                    </div>
                                    <div className="col-4">
                                        <p className='lenAccStatus' style={{ fontFamily: "Poppins,sans-serif", paddingLeft: "20px", fontWeight: "bold", fontSize: "15px", textAlign: "center", color: "#222C70", display: "none" }}>Your profile is {resultant}% complete</p>
                                        <div className='row mb-2 lenAccStatus' style={{ marginTop: "-10px", display: "none" }}>
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
                    {/* New Design */}
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
                                            <p className="greeting m-0">{t('Funded Loans')}</p>
                                            <p className="subtext m-0">{this.state.noofactiveloansfunded}
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
                                            <p className="greeting m-0">{t('Amount Funded')}</p>
                                            <p className="subtext m-0">{this.state.totactivefunding ? <span>
                                                ₹ {parseFloat(this.state.totactivefunding).toFixed(2).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
                                            </span> : "0.00"}
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
                                            <p className="greeting m-0">{t('Committed Loans')}</p>
                                            <p className="subtext m-0">{this.state.noofloansfundscommitted}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div className="card shadow-sm p-3 mb-3" style={{ borderRadius: "16px", color: "rgba(255,255,255,1)", backgroundColor: "RGBA(5,116,22,1)", cursor: "default" }}>
                                <div className="row align-items-center">
                                    <div className='col-2' style={{ marginTop: "-19px" }}>
                                        <FaIcons.FaMoneyBill style={{ fontSize: "30px" }} />
                                    </div>
                                    <div className="col">
                                        <div className="card-content" style={{ color: "rgba(255,255,255,1)" }}>
                                            <p className="greeting m-0">{t('Amount Committed')}</p>
                                            <p className="subtext m-0">
                                                {this.state.lockedfunds ? <span>
                                                    ₹ {parseFloat(this.state.lockedfunds).toFixed(2).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
                                                </span> : "0"}
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
                            <Link to="/loanListing" style={{ textDecoration: "none" }}>
                                <div className="card shadow-sm p-4 mb-3" style={{ borderRadius: "16px", color: "rgba(255,255,255,1)", backgroundColor: "RGBA(18,44,84,1)" }}>
                                    <div className="row align-items-center">
                                        <div className='col-2'>
                                            <FaIcons.FaMoneyCheck style={{ fontSize: "30px" }} />
                                        </div>
                                        <div className="col">
                                            <div className="card-content" style={{ color: "rgba(255,255,255,1)" }}>
                                                <p className="greeting m-0">{t('Market Place')}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                        <div class="col-md-3" >
                            <div className="card shadow-sm p-3 mb-3" style={{ borderRadius: "16px", color: "rgba(255,255,255,1)", backgroundColor: "RGBA(34, 84, 130)", cursor: "default" }}>
                                <div className="row align-items-center">
                                    <div className='col-2' style={{ marginTop: "-19px" }}>
                                        <FaIcons.FaMoneyBill style={{ fontSize: "30px" }} />
                                    </div>
                                    <div className="col">
                                        <div className="card-content" style={{ color: "rgba(255,255,255,1)" }}>
                                            <p className="greeting m-0">{t('Total Amt. Invested')}</p>
                                            <p className="subtext m-0">
                                                {this.state.totfunding ? <span>
                                                    ₹ {parseFloat(this.state.totfunding).toFixed(2).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
                                                </span> : "0"}
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
                                        <FaIcons.FaMoneyBill style={{ fontSize: "30px" }} />
                                    </div>
                                    <div className="col">
                                        <div className="card-content" style={{ color: "rgba(255,255,255,1)" }}>
                                            <p className="greeting m-0">{t('Total Active Funding')}</p>
                                            <p className="subtext m-0">
                                                {this.state.totactivefunding ? <span>
                                                    ₹ {parseFloat(this.state.totactivefunding).toFixed(2).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
                                                </span> : "0"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3">
                            <div className="card shadow-sm p-3 mb-3" style={{ borderRadius: "16px", color: "rgba(255,255,255,1)", backgroundColor: "RGBA(253,89,26,1)", cursor: "default" }}>
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

                    {/* wallet Detials */}
                    <div className='row' style={{ marginTop: "-10px", marginBottom: "5px" }}>
                        <div className='col'>
                            <div className="card shadow-sm p-3 mb-3" style={{ fontSize: "15px", cursor: "default", borderRadius: "15px", backgroundColor: "RGBA(255,247,229,1)" }}>
                                <div class="card-header" style={{ backgroundColor: "RGBA(255,168,0,1)", width: "110.8%", height: "28px", marginTop: "-17px", marginLeft: "-17.5px", borderRadius: "15px 15px 0 0", color: "white", fontWeight: "bold" }}>
                                    <p style={{ marginTop: "-6px", textAlign: "center", marginLeft: "-70px" }}>{t('Escrow Account')}</p>
                                </div>
                                <div className="row align-items-center" style={{ marginLeft: "-40px" }}>
                                    <div className='col-3' style={{ textAlign: "end" }}>
                                        <img src={walletimg} style={{ height: "30px" }} />
                                    </div>
                                    <div className="col-2" style={{ color: "#222C70", fontSize: "15px" }}>
                                        <div className="card-content">
                                            <p className="m-0" style={{ fontWeight: "500" }}>{t('Total Escrow Balance')}</p>
                                            <p className="m-0" style={{ paddingLeft: "30px" }}>{this.state.walletBalance ? <span>
                                                ₹ {parseFloat(this.state.walletBalance).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
                                            </span> : "0.00"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="col-2" style={{ color: "#222C70", fontSize: "15px", textAlign: "center" }}>
                                        <div className="card-content">
                                            <p className="m-0" style={{ fontWeight: "500", paddingLeft: "29px" }}>{t('Locked Funds')}</p>
                                            <p className="m-0" style={{ paddingLeft: "30px" }}>{this.state.lockedfunds ? <span>
                                                ₹ {parseFloat(this.state.lockedfunds).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
                                            </span> : "0.00"}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="col-3" style={{ color: "#222C70", fontSize: "15px", textAlign: "" }}>
                                        <div className="card-content">
                                            <p className="m-0" style={{ fontWeight: "500" }}>{t('Available balance')}</p>
                                            <p className="m-0" style={{ paddingLeft: "18px" }}>{this.state.avwallet ? <span>
                                                ₹ {parseFloat(this.state.avwallet).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
                                            </span> : "0.00"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col' style={{ textAlign: "center" }}>
                                        <button className="btn btn-sm" style={{ backgroundColor: "RGBA(255,168,42,1)", color: "white", width: "200px" }} onClick={this.addMoneyToWallet}>Add/Withdraw Money</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* New Investment View */}
                    {/* <h4 class="ml-2" style={{ fontWeight: "bold", fontFamily: "Poppins,sans-serif", color: "#222C70", fontSize: "20px" }}>Investment Overview</h4>
                    <div class="row" style={{ marginTop: "-15px" }}>
                        <div class="col-sm-6" >
                            <div class="card text-center" id="" style={{ borderRadius: "16px", backgroundColor: "RGB(230, 240, 242)", cursor: "default" }}>
                                <div class="card-header" style={{ backgroundColor: "RGBA(23,166,242,1)", width: "107%", marginLeft: "-15px", borderRadius: "15px 15px 0 0", color: "white", fontWeight: "bold" }}>
                                    Active Loans
                                </div>
                                <div class="card-body">
                                    <div className="row item-list" >
                                        <div className="col">
                                            <p className="ml-4" style={{ fontSize: "14px", color: "RGBA(126,132,163,1)" }}>Borrower Names</p>
                                        </div>
                                        <div className="col">
                                            <p style={{ fontSize: "14px", color: "RGBA(126,132,163,1)" }}>Amount</p>
                                        </div>
                                    </div>
                                    <hr style={{ marginTop: "2px" }} />

                                    <div className="row item-list" style={{ marginTop: "-10px" }}>
                                        {
                                            this.state.borTrnList.map((loans, index) => {
                                                return (
                                                    <div key={index}>
                                                        <div className="col">
                                                            <h6 className="ml-4">{loans.borrowerid}</h6>
                                                        </div>
                                                        <div className="col">
                                                            <h6>₹{(loans.loanamt).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</h6>
                                                        </div>
                                                        <hr style={{ marginTop: "2px" }} />
                                                    </div>
                                                )
                                            })
                                        }

                                    </div>
                                    <button className='btn' style={{ backgroundColor: "RGBA(23,166,242,1)", color: "white", float: "right" }}>View More</button>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-6">
                            <div class="card text-center" id="" style={{ borderRadius: "16px", backgroundColor: "RGBA(239,255,239,1)", cursor: "default" }}>
                                <div class="card-header" style={{ backgroundColor: "RGBA(6,116,10,1)", width: "107%", marginLeft: "-15px", borderRadius: "15px 15px 0 0", color: "white", fontWeight: "bold" }}>
                                    Closed Loans
                                </div>
                                <div class="card-body">
                                    <div className="row item-list" >
                                        <div className="col">
                                            <p className="ml-4" style={{ fontSize: "14px", color: "RGBA(126,132,163,1)" }}>Borrower Names</p>
                                        </div>
                                        <div className="col">
                                            <p style={{ fontSize: "14px", color: "RGBA(126,132,163,1)" }}>Amount</p>
                                        </div>
                                    </div>
                                    <hr style={{ marginTop: "2px" }} />

                                    <div className="row item-list" style={{ marginTop: "-10px" }}>
                                        {
                                            this.state.borTrnList2.map((loans2, subindex) => {
                                                return (
                                                    <div key={subindex}>
                                                        <div className="col">
                                                            <h6 className="ml-4">{loans2.borrowerid}</h6>
                                                        </div>
                                                        <div className="col">
                                                            <h6>₹{(loans2.loanamt).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</h6>
                                                        </div>
                                                        <hr style={{ marginTop: "2px" }} />
                                                    </div>
                                                )
                                            })
                                        }

                                    </div>
                                    <button className='btn' style={{ backgroundColor: "RGBA(6,116,10,1)", color: "white", float: "right" }}>View More</button>
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
                                <div class="modal-body" style={{ marginBottom: "-20px" }}>
                                    <img src={resetPw} style={{ width: "80px" }} />
                                    <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold", paddingLeft: "10px" }}>
                                        You have become privilege customer. please Logout and Login to access all the features.
                                    </p>
                                </div>
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
                    <Link to="/LenderDetails">
                        <button id='routeToProf' style={{ display: "none" }}>Route
                        </button>
                    </Link>
                    <div className="absolute">
                        <div className="footer ">
                            <div className="footer-body">
                                <div className="row">

                                    <div className="bg-dark">
                                        <h5 className="mb-0"></h5>
                                        <span className="mb-0"></span>
                                        <p className="m-3 text-light">{CP_VERSION}  </p>
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

export default withTranslation()(LenderDashboard)
