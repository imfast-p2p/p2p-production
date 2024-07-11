import React, { Component } from 'react';
import { BASEURL } from '../assets/baseURL';
import BorrowerSidebar from '../../SidebarFiles/BorrowerSidebar';
import $ from 'jquery';
import { Link } from 'react-router-dom';
import { confirmAlert } from 'react-confirm-alert';
import { withTranslation } from 'react-i18next';
import { FaCaretDown, FaAngleLeft } from "react-icons/fa";
import dashboardIcon from '../assets/icon_dashboard.png'
import * as FaIcons from "react-icons/fa";
import Loader from '../Loader/Loader';
import './LoanClosureblc.css';

var compareSum;
export class LoanClosureBalance extends Component {
    //updated
    constructor(props) {
        super(props)

        this.state = {
            loanaccountno: "",
            amount: "",
            closure: {},
            activeLoan: {},
            paymenttype: 2,
            emiamt: "",
            emiAmount: "",

            amtpayable: "",
            principal: "",
            interest: "",
            elcfee: "",
            b2ldue: "",
            preAmount: "",

            showLoader: false,
            MPINstatus: "",
            MPINotp: "",
            MPINref: "",
            setMPINFlag: "",

            repaymentBreakdown: {},
            resMsg: ""
        }

        this.getLoanClosureBalance = this.getLoanClosureBalance.bind(this);
        this.addMoney = this.addMoney.bind(this);
        this.amount = this.amount.bind(this);
        this.addEmi = this.addEmi.bind(this);
        this.preAmount = this.preAmount.bind(this);
    }
    amount(event) {
        this.setState({ amount: event.target.value })
    }
    preAmount(event) {
        this.setState({ preAmount: event.target.value })

        var payamount = parseInt(this.state.amtpayable);
        console.log(payamount);
        console.log(event.target.value)

        if (payamount < event.target.value) {
            $("#addPrePayBtn").prop("disabled", true)
        } else if (payamount > event.target.value) {
            $("#addPrePayBtn").prop("disabled", false)
        }
    }
    getLoanClosureBalance() {
        fetch(BASEURL + '/lsp/getloanamounttoclose', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                loanaccountno: sessionStorage.getItem("loanaccountno")
            })
        }).then(response => {
            console.log('Response:', response)
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata);
                if (resdata.status == 'SUCCESS') {
                    this.setState({ showLoader: false })

                    this.setState({ amtpayable: resdata.msgdata.amtpayable });
                    this.setState({ closure: resdata.msgdata })
                    this.setState({ principal: resdata.msgdata.principal })
                    this.setState({ interest: resdata.msgdata.interest })
                    this.setState({ elcfee: resdata.msgdata.elcfee })
                    this.setState({ b2ldue: resdata.msgdata.b2ldue })

                    compareSum = sessionStorage.getItem('emiamount')

                    if (Math.round(compareSum * 100) > Math.round(this.state.principal * 100)) {
                        $("#emiBtn").prop('disabled', true);
                    } else if (Math.round(compareSum * 100) < Math.round(this.state.principal * 100)) {
                        $("#emiBtn").prop('disabled', false);
                    }

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
                        console.log("Loan already closed")
                        confirmAlert({
                            message: resdata.message,
                            buttons: [
                                {
                                    label: "OK",
                                    onClick: () => {
                                        window.location = "/ViewAllLoans"
                                    },
                                },
                            ],
                        });
                    }
                }
            })
    }
    componentDidMount() {
        //setting Emi amount to state 
        if (sessionStorage.getItem('isLogin') == "true") {
            this.setState({ showLoader: true })

            this.setState({ emiAmount: sessionStorage.getItem('emiamount') })
            console.log(sessionStorage);
            this.getLoanClosureBalance();
            $("input[name='chkQstn']").click((event) => {
                if ($("#chkYes").is(":checked")) {
                    document.getElementById('chkYesCard').style.backgroundColor = "rgb(247, 252, 255)";
                    document.getElementById('chkNoCard').style.backgroundColor = "white";
                    document.getElementById('chkUYesCard').style.backgroundColor = "white";
                    $("#payEmi").show();
                    $("#payDue").hide();
                    $("#payClosure").hide();
                    this.setState({
                        repaymentBreakdown: {},
                        resMsg: ""
                    })
                    this.getRepaymentBreakdown(sessionStorage.getItem('emiamount')); // 'this' refers to the outer scope
                } if ($("#chkUYes").is(":checked")) {
                    document.getElementById('chkUYesCard').style.backgroundColor = "rgb(247, 252, 255)";
                    document.getElementById('chkNoCard').style.backgroundColor = "white";
                    document.getElementById('chkYesCard').style.backgroundColor = "white";
                    $("#payClosure").show();
                    $("#payEmi").hide();
                    $("#payDue").hide();
                    this.setState({
                        repaymentBreakdown: {},
                        resMsg: ""
                    })
                    this.getRepaymentBreakdown(this.state.amtpayable)
                }
                else if ($("#chkNo").is(":checked")) {
                    document.getElementById('chkNoCard').style.backgroundColor = "rgb(247, 252, 255)";
                    document.getElementById('chkUYesCard').style.backgroundColor = "white";
                    document.getElementById('chkYesCard').style.backgroundColor = "white";
                    $("#payEmi").hide();
                    $("#payClosure").hide();
                    $("#payDue").show();
                    this.setState({
                        repaymentBreakdown: {},
                        resMsg: ""
                    })
                }
            })
        } else {
            window.location = '/login'
        }
    }
    getRepaymentBreakdown = (amountReceived) => {
        console.log(amountReceived);
        // Determine the amount to send in the request
        var amountToSend = amountReceived === "otherPay" ? this.state.preAmount : amountReceived;
        if (amountReceived === "otherPay") {
            console.log(this.state.preAmount)
        }
        fetch(BASEURL + '/lsp/getrepaymentbreakdown', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                loanaccountnumber: sessionStorage.getItem("loanaccountno"),
                amount: amountToSend
            })
        }).then(response => {
            console.log('Response:', response)
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata);
                if (resdata.status == 'SUCCESS') {
                    this.setState({
                        showLoader: false,
                        repaymentBreakdown: resdata.msgdata
                    })

                } else {
                    this.setState({
                        showLoader: false,
                        repaymentBreakdown: {}
                    })
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
                        this.setState({
                            repaymentBreakdown: {},
                            resMsg: resdata.message
                        })
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
    addMoney = () => {
        // const popup = window.confirm("Are you sure you want to pay the amount ?");
        // if (popup == true) {
        //     sessionStorage.setItem("amount", this.state.amtpayable);
        //     window.location = "/payEMI";
        // }
        sessionStorage.setItem("amount", this.state.amtpayable);
        window.location = "/payEMI";
    }
    addEmi = () => {
        // const popup = window.confirm("Are you sure you want to pay the amount ?");
        // if (popup == true) {
        //     sessionStorage.setItem("amount", this.state.emiAmount);
        //     window.location = "/payEMI";
        // }
        sessionStorage.setItem("amount", this.state.emiAmount);
        window.location = "/payEMI";
    }
    addPrepay = () => {
        if (this.state.preAmount > 0) {
            // const popup = window.confirm("Are you sure you want to pay the amount ?");
            // if (popup == true) {

            //     sessionStorage.setItem("amount", this.state.preAmount);
            //     window.location = "/payEMI";
            // }
            sessionStorage.setItem("amount", this.state.preAmount);
            window.location = "/payEMI";
        } else {
            confirmAlert({
                message: "Minimum value exceeding.",
                buttons: [{
                    label: "Okay",
                    onClick: () => {
                    }
                }]
            })
        }
    }
    setTransactionPinStatus = () => {
        var data = JSON.stringify({
            status: this.state.MPINstatus,
            mobileotp: this.state.MPINotp,
            mobileref: this.state.MPINref
        })

        var mpinData = this.state.setMPINFlag == true ? data : "";
        fetch(BASEURL + '/usrmgmt/settransactionpinstatus', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: mpinData
        }).then(response => {
            console.log('Response:', response)
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata);
                if (resdata.status == 'Success') {
                    var mpin = resdata.msgdata.mobileref;
                    if (mpin) {
                        console.log(resdata.msgdata.mobileref)
                        this.setState({ MPINref: resdata.msgdata.mobileref })
                    }

                    confirmAlert({
                        message: resdata.message,
                        buttons: [
                            {
                                label: "Okay",
                                onClick: () => {

                                }
                            }
                        ],
                    })
                } else {
                    confirmAlert({
                        message: "Failure, Please Try again Later.",
                        buttons: [
                            {
                                label: "Okay",
                                onClick: () => {
                                }
                            }
                        ],

                    })
                }

            })
    }
    handleChange() {
        $('.text').toggle();
        $('#PImage').toggle();
        $('#Pinfo').toggle();
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
        const { repaymentBreakdown, resMsg } = this.state;
        const isRepaymentBreakdownEmpty = Object.keys(repaymentBreakdown).length === 0;
        console.log(repaymentBreakdown);
        const isButtonEnabled = this.state.preAmount !== '';
        return (
            <div className="container-dashboard d-flex flex-row" id="wrapper" style={{ marginTop: "-7px", backgroundColor: "#f4f7fc" }}>
                {
                    this.state.showLoader && <Loader />
                }
                <BorrowerSidebar />
                <div className="main-content" id="page-content-wrapper">
                    <div className="container-fluid row pt-2" style={{ marginBottom: "-11px" }}>
                        <div className="col-1" id="loanClosureRes">
                            <button style={{ marginLeft: "25px" }} onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className='col-6' id="loanClosureRes2" style={{ marginLeft: "20px", marginTop: "5px" }}>
                            <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                <Link to="/borrowerdashboard">Home</Link> / <Link to="/ViewAllLoans">View All Loans</Link> / Loan Closure Balance</p>
                        </div>
                        <div className='col'>

                        </div>
                        <div className='col-3'>

                        </div>
                        <div className="col" id="loanClosureRes3">
                            <button style={myStyle}>
                                <Link to="/ViewAllLoans" style={{ marginLeft: "10px" }}><FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} /><span style={{ textDecoration: "none", color: "white" }}>Back</span></Link></button>
                        </div>
                    </div>

                    <hr className="col-11" style={{ marginLeft: "50px", width: "88.6%", backgroundColor: "rgba(4,78,160,1)", marginTop: "-10px" }} />
                    <div className='row' style={{ marginTop: "-10px" }}>
                        <div className="col">
                            <p className="d-flex justify-content-center" style={{ fontSize: "20px", fontWeight: "bold", color: "rgb(5, 54, 82)" }}>{t('Loan Closure Balance')}</p>
                        </div>
                    </div>

                    <div className="container-fluid row pt-2" id='container' style={{ paddingLeft: "86px", marginTop: "-36px", fontSize: "14px" }}>
                        <div className='card' style={{ cursor: "default" }}>
                            <div className='row'>
                                <div className='col-4' id='LoanfirstCol'>
                                    <div className="form-row pt-3 pl-2" style={{ color: "rgb(5, 54, 82)" }}>
                                        <div className='col' id='headingloanclosure'>
                                            <div className="two__image" style={{ paddingLeft: "20px", marginLeft: "-10px" }}>
                                                <p className="text-white" style={{ paddingBottom: "6px", fontWeight: "600" }}>Loan Closure Balance</p>
                                            </div>
                                        </div>

                                        <div className='card' id='' style={{
                                            borderRadius: "10px", color: "rgb(5, 54, 82)",
                                            marginTop: "-8px", marginBottom: "0px", backgroundColor: "rgb(208, 234, 247)",
                                            border: "0px", cursor: "default"
                                        }}>
                                            <div class="row card-body">
                                                <div className='col pl-4'>
                                                    <h6 className='card-title' style={{ fontSize: "15px", fontWeight: "bold" }}>{t('Account Number')}</h6>
                                                    <h5 className='card-text' style={{ fontSize: "15px" }}>{sessionStorage.getItem("loanaccountno")}</h5>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col d-flex" id='vl' style={{ height: "210px", paddingTop: "10px" }}>
                                    <div class="vr"></div>
                                </div>
                                <div className='col-7'>
                                    <div className='row' id='secondCol1' style={{ marginLeft: "-60px", paddingTop: "10px" }}>
                                        <p style={{ color: "rgb(40, 116, 166)", fontWeight: "bold", marginLeft: "-10px", color: "rgb(5, 54, 82)" }}><FaIcons.FaMoneyBill style={{ fontSize: "14px" }} />&nbsp; Select Your Payment Options</p>
                                    </div>
                                    <div className='row' id='secondCol2' style={{ marginLeft: "-60px" }}>
                                        <div className="col ml-0 pl-0 ">
                                            <div className='card pl-3 cardPay' id="chkYesCard"
                                                style={{
                                                    paddingBottom: "5px", marginTop: "4px",
                                                    fontSize: "14px", border: "1px solid rgba(0,121,190,1)",
                                                    marginBottom: "0px", cursor: "default", color: "rgb(5, 54, 82)"
                                                }}>
                                                <div className='form-check mt-2'>
                                                    <input className='form-check-input' type='radio'
                                                        name="chkQstn" id="chkYes"
                                                        style={{ color: "rgba(5,54,82,1)", cursor: "pointer" }} />
                                                    <span style={{ fontWeight: "bold" }}>{t('Pay-EMI')}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col">
                                            <div className='card pl-3 cardPay' id="chkNoCard"
                                                style={{
                                                    paddingBottom: "5px", marginTop: "4px",
                                                    fontSize: "14px", border: "1px solid rgba(0,121,190,1)",
                                                    marginBottom: "0px", cursor: "default", color: "rgb(5, 54, 82)"
                                                }}>
                                                <div className='form-check mt-2'>
                                                    <input className='form-check-input' type='radio'
                                                        name="chkQstn" id="chkNo"
                                                        style={{ color: "rgba(5,54,82,1)", cursor: "pointer" }} />
                                                    <span style={{ fontWeight: "bold" }}>{t('Other Amount')}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='row' id='secondCol3' style={{ marginLeft: "-60px" }}>
                                        <div className="col ml-0 pl-0">
                                            <div className='card pl-3 cardPay' id="chkUYesCard"
                                                style={{
                                                    paddingBottom: "5px", marginTop: "4px",
                                                    fontSize: "14px", border: "1px solid rgba(0,121,190,1)",
                                                    marginBottom: "0px", cursor: "default", color: "rgb(5, 54, 82)"
                                                }}>
                                                <div className='form-check mt-2'>
                                                    <input className='form-check-input' type='radio'
                                                        name="chkQstn" id="chkUYes"
                                                        style={{ color: "rgba(5,54,82,1)", cursor: "pointer" }} />
                                                    <span style={{ fontWeight: "bold" }}>{t('Pay-Pre Closure')}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col">

                                        </div>
                                    </div>
                                </div>
                            </div>
                            <hr style={{ backgroundColor: "rgba(4,78,160,1)", marginLeft: "10px", marginRight: "10px" }} />

                            {/* EMI Pay */}
                            <div className="row displayAmount" id='payEmi' style={{ display: "none", marginTop: "-20px" }}>
                                <div className='col' id='emiHideCol'></div>
                                <div className="col-7 card" id='emicard' style={{
                                    float: "right",
                                    paddingTop: "10px", paddingBottom: "10px",
                                    backgroundColor: "#f7fcff",
                                    cursor: "default"
                                }}>
                                    <p style={{ marginLeft: "15px", textAlign: "center", fontFamily: "Poppins,sans-serif", fontWeight: "bold", fontSize: "14px", color: "rgba(5,54,82,1)" }}>{t('Pay EMI')}</p>
                                    <hr style={{ backgroundColor: "rgba(5,54,82,1)", marginLeft: "20px", marginRight: "10px", marginTop: "-12px" }} />
                                    <div className="row ml-0 pl-0">
                                        <div className="col" id='emiP' style={{ color: "rgba(5,54,82,1)", fontFamily: "Poppins,sans-serif" }}>
                                            <p>{t('Pay EMI')}</p>
                                        </div>
                                        <div className="col" id='emiP2' style={{ textAlign: "right", color: "rgba(5,54,82,1)", fontWeight: "bold", fontFamily: "Poppins,sans-serif" }}>
                                            <p>{this.state.emiAmount > 0 ? <p class="mb-0">₹ {parseFloat(this.state.emiAmount).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")} </p> : null}</p>
                                        </div>
                                    </div>

                                    <p style={{ marginLeft: "15px", textAlign: "center", fontFamily: "Poppins,sans-serif", fontWeight: "bold", fontSize: "14px", color: "rgba(5,54,82,1)" }}>{t('Repayment Breakdown')}</p>
                                    <hr style={{ backgroundColor: "rgba(5,54,82,1)", marginLeft: "20px", marginRight: "10px", marginTop: "-12px" }} />
                                    {!isRepaymentBreakdownEmpty ?
                                        <>
                                            {repaymentBreakdown.interestoutstanding !== "" &&
                                                <div className="row ml-0 pl-0">
                                                    <div className="col" style={{ color: "rgba(5,54,82,1)", fontFamily: "Poppins,sans-serif" }}>
                                                        <p>{t('Interest Outstanding')}</p>
                                                    </div>
                                                    <div className="col" style={{ textAlign: "right", color: "rgba(5,54,82,1)", fontWeight: "bold", fontFamily: "Poppins,sans-serif" }}>
                                                        <p>
                                                            ₹  {parseFloat(repaymentBreakdown.interestoutstanding).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
                                                        </p>
                                                    </div>
                                                </div>
                                            }
                                            {repaymentBreakdown.b2lchargesoutstanding !== "" &&
                                                <div className="row ml-0 pl-0">
                                                    <div className="col" style={{ color: "rgba(5,54,82,1)", fontFamily: "Poppins,sans-serif" }}>
                                                        <p>{t('B2L Charges Outstanding')}</p>
                                                    </div>
                                                    <div className="col" style={{ textAlign: "right", color: "rgba(5,54,82,1)", fontWeight: "bold", fontFamily: "Poppins,sans-serif" }}>
                                                        <p>
                                                            ₹  {(repaymentBreakdown.b2lchargesoutstanding).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
                                                        </p>
                                                    </div>
                                                </div>
                                            }
                                            {repaymentBreakdown.p2pfeeschargesoutstanding !== "" &&
                                                <div className="row ml-0 pl-0">
                                                    <div className="col" style={{ color: "rgba(5,54,82,1)", fontFamily: "Poppins,sans-serif" }}>
                                                        <p>{t('P2P Fee Charges Outstanding')}</p>
                                                    </div>
                                                    <div className="col" style={{ textAlign: "right", color: "rgba(5,54,82,1)", fontWeight: "bold", fontFamily: "Poppins,sans-serif" }}>
                                                        <p>
                                                            ₹  {(repaymentBreakdown.p2pfeeschargesoutstanding).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
                                                        </p>
                                                    </div>
                                                </div>
                                            }
                                            {repaymentBreakdown.prpp !== "" &&
                                                <div className="row ml-0 pl-0">
                                                    <div className="col" style={{ color: "rgba(5,54,82,1)", fontFamily: "Poppins,sans-serif" }}>
                                                        <p>{t('Principal Paid')}</p>
                                                    </div>
                                                    <div className="col" style={{ textAlign: "right", color: "rgba(5,54,82,1)", fontWeight: "bold", fontFamily: "Poppins,sans-serif" }}>
                                                        <p>
                                                            ₹  {(repaymentBreakdown.prpp).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
                                                        </p>
                                                    </div>
                                                </div>
                                            }
                                            {repaymentBreakdown.amtpaid !== "" &&
                                                <div className="row ml-0 pl-0">
                                                    <div className="col" style={{ color: "rgba(5,54,82,1)", fontFamily: "Poppins,sans-serif" }}>
                                                        <p>{t('Amount Paid')}</p>
                                                    </div>
                                                    <div className="col" style={{ textAlign: "right", color: "rgba(5,54,82,1)", fontWeight: "bold", fontFamily: "Poppins,sans-serif" }}>
                                                        <p>₹ {parseFloat(repaymentBreakdown.amtpaid).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")} </p>
                                                    </div>
                                                </div>
                                            }
                                        </>
                                        :
                                        <div className="row ml-0 pl-0">
                                            <div className="col" style={{ color: "rgba(5,54,82,1)", fontFamily: "Poppins,sans-serif" }}>
                                                <p>{resMsg}</p>
                                            </div>
                                        </div>
                                    }
                                </div>
                                <div className="row mb-2">
                                    <div className='col hideCol'></div>
                                    <div className='col-7'>
                                        <button className="btn btnPay" id='emiBtn' style={{
                                            width: "558px", marginLeft: "-16px",
                                            color: "white", backgroundColor: "rgb(40, 116, 166)",
                                            fontSize: "14px"
                                        }}
                                            onClick={this.addEmi}>
                                            Pay Now
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Other Pay */}
                            <div className="row displayAmount" id='payDue' style={{ display: "none", marginTop: "-20px" }}>
                                <div className='col' id='dueHideCol'></div>
                                <div className="col-7 card" id='othercard' style={{
                                    float: "right",
                                    paddingTop: "10px", paddingBottom: "10px",
                                    backgroundColor: "#f7fcff",
                                    cursor: "default"
                                }}>
                                    <p style={{ marginLeft: "15px", textAlign: "center", fontFamily: "Poppins,sans-serif", fontWeight: "bold", fontSize: "14px", color: "rgba(5,54,82,1)" }}>Other Amount</p>
                                    <hr style={{ backgroundColor: "rgba(5,54,82,1)", marginLeft: "20px", marginRight: "10px", marginTop: "-12px" }} />
                                    <div className="row ml-0 pl-0">
                                        <div className="col" style={{ paddingLeft: "30px" }}>
                                            <p style={{ color: "rgba(5,54,82,1)" }}>Total Amount Payable: ₹ {(this.state.amtpayable).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</p>
                                        </div>
                                        <div className="col" style={{ textAlign: "right", paddingRight: "30px" }}>
                                            <input type="number" placeholder='Enter Amount' onChange={this.preAmount} value={this.state.value} />
                                        </div>
                                    </div>
                                    <div className='row ml-0 pl-0'>
                                        <div className='col' style={{ textAlign: "center" }}>
                                            <button className='btn btn-sm text-white' style={{
                                                backgroundColor: "rgb(40, 116, 166)"
                                            }} disabled={!isButtonEnabled}
                                                onClick={() => this.getRepaymentBreakdown("otherPay")}>Check Repayment Breakdown</button>

                                        </div>
                                    </div>

                                    {!isRepaymentBreakdownEmpty ?
                                        <>
                                            <p style={{ marginLeft: "15px", textAlign: "center", fontFamily: "Poppins,sans-serif", fontWeight: "bold", fontSize: "14px", color: "rgba(5,54,82,1)" }}>{t('Repayment Breakdown')}</p>
                                            <hr style={{ backgroundColor: "rgba(5,54,82,1)", marginLeft: "20px", marginRight: "10px", marginTop: "-12px" }} />
                                            {repaymentBreakdown.interestoutstanding !== "" &&
                                                <div className="row ml-0 pl-0">
                                                    <div className="col" style={{ color: "rgba(5,54,82,1)", fontFamily: "Poppins,sans-serif" }}>
                                                        <p>{t('Interest Outstanding')}</p>
                                                    </div>
                                                    <div className="col" style={{ textAlign: "right", color: "rgba(5,54,82,1)", fontWeight: "bold", fontFamily: "Poppins,sans-serif" }}>
                                                        <p>
                                                            ₹  {(repaymentBreakdown.interestoutstanding).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
                                                        </p>
                                                    </div>
                                                </div>
                                            }
                                            {repaymentBreakdown.b2lchargesoutstanding !== "" &&
                                                <div className="row ml-0 pl-0">
                                                    <div className="col" style={{ color: "rgba(5,54,82,1)", fontFamily: "Poppins,sans-serif" }}>
                                                        <p>{t('B2L Charges Outstanding')}</p>
                                                    </div>
                                                    <div className="col" style={{ textAlign: "right", color: "rgba(5,54,82,1)", fontWeight: "bold", fontFamily: "Poppins,sans-serif" }}>
                                                        <p>
                                                            ₹  {(repaymentBreakdown.b2lchargesoutstanding).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
                                                        </p>
                                                    </div>
                                                </div>
                                            }
                                            {repaymentBreakdown.p2pfeeschargesoutstanding !== "" &&
                                                <div className="row ml-0 pl-0">
                                                    <div className="col" style={{ color: "rgba(5,54,82,1)", fontFamily: "Poppins,sans-serif" }}>
                                                        <p>{t('P2P Fee Charges Outstanding')}</p>
                                                    </div>
                                                    <div className="col" style={{ textAlign: "right", color: "rgba(5,54,82,1)", fontWeight: "bold", fontFamily: "Poppins,sans-serif" }}>
                                                        <p>
                                                            ₹  {(repaymentBreakdown.p2pfeeschargesoutstanding).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
                                                        </p>
                                                    </div>
                                                </div>
                                            }
                                            {repaymentBreakdown.prpp !== "" &&
                                                <div className="row ml-0 pl-0">
                                                    <div className="col" style={{ color: "rgba(5,54,82,1)", fontFamily: "Poppins,sans-serif" }}>
                                                        <p>{t('Principal Paid')}</p>
                                                    </div>
                                                    <div className="col" style={{ textAlign: "right", color: "rgba(5,54,82,1)", fontWeight: "bold", fontFamily: "Poppins,sans-serif" }}>
                                                        <p>
                                                            ₹  {(repaymentBreakdown.prpp).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
                                                        </p>
                                                    </div>
                                                </div>
                                            }
                                            {repaymentBreakdown.amtpaid !== "" &&
                                                <div className="row ml-0 pl-0">
                                                    <div className="col" style={{ color: "rgba(5,54,82,1)", fontFamily: "Poppins,sans-serif" }}>
                                                        <p>{t('Amount Paid')}</p>
                                                    </div>
                                                    <div className="col" style={{ textAlign: "right", color: "rgba(5,54,82,1)", fontWeight: "bold", fontFamily: "Poppins,sans-serif" }}>
                                                        <p>₹ {parseFloat(repaymentBreakdown.amtpaid).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")} </p>
                                                    </div>
                                                </div>
                                            }
                                        </>
                                        : <>
                                            <p style={{ marginLeft: "15px", textAlign: "center", fontFamily: "Poppins,sans-serif", fontWeight: "bold", fontSize: "14px", color: "rgba(5,54,82,1)" }}>{t('Repayment Breakdown')}</p>
                                            <hr style={{ backgroundColor: "rgba(5,54,82,1)", marginLeft: "20px", marginRight: "10px", marginTop: "-12px" }} />
                                            <div className="row ml-0 pl-0">
                                                <div className="col" style={{ color: "rgba(5,54,82,1)", fontFamily: "Poppins,sans-serif" }}>
                                                    <p>{resMsg}</p>
                                                </div>
                                            </div>
                                        </>
                                    }
                                </div>
                                <div className="row mb-2">
                                    <div className='col hideCol'></div>
                                    <div className='col-7'>
                                        <button className="btn btnPay" id='addPrePayBtn' style={{
                                            width: "558px", marginLeft: "-16px",
                                            color: "white", backgroundColor: "rgb(40, 116, 166)"
                                        }} onClick={this.addPrepay}>
                                            Pay Now
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* UPI Pay */}
                            <div className="row displayAmount" id='payClosure' style={{ display: "none", marginTop: "-20px" }}>
                                <div className='col' id='closureHideCol'></div>
                                <div className="col-7 card" id='upicard' style={{
                                    float: "right",
                                    paddingTop: "10px", paddingBottom: "10px",
                                    backgroundColor: "#f7fcff",
                                    cursor: "default"
                                }}>
                                    <p style={{ marginLeft: "15px", textAlign: "center", fontFamily: "Poppins,sans-serif", fontWeight: "bold", fontSize: "14px", color: "rgba(5,54,82,1)" }}>Pre-Closure Amount</p>
                                    <hr style={{ backgroundColor: "rgba(5,54,82,1)", marginLeft: "20px", marginRight: "10px", marginTop: "-12px" }} />
                                    <div className="row ml-0 pl-0">
                                        <div className="col" style={{ paddingLeft: "30px", color: "rgba(5,54,82,1)", fontFamily: "Poppins,sans-serif" }}>
                                            <p>Principle</p>
                                            <p>Interest</p>
                                            <p>Early Loan Closure Fee</p>
                                            <p>Due</p>
                                        </div>
                                        <div className="col" style={{ textAlign: "right", paddingRight: "30px", color: "rgba(5,54,82,1)", fontWeight: "bold" }}>
                                            <p>₹ {(this.state.principal).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</p>
                                            <p>₹ {this.state.interest}</p>
                                            <p>₹ {(this.state.elcfee).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</p>
                                            <p>₹ {(this.state.b2ldue).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</p>
                                        </div>
                                    </div>
                                    <hr style={{ backgroundColor: "rgba(5,54,82,1)", marginLeft: "20px", marginRight: "10px", marginTop: "-12px" }} />
                                    <div className="row ml-0 pl-0">
                                        <div className="col" style={{ paddingLeft: "30px", color: "rgba(5,54,82,1)", fontFamily: "Poppins,sans-serif" }}>
                                            <p>Total Amount Payable</p>
                                        </div>
                                        <div className="col" style={{ textAlign: "right", paddingRight: "30px", color: "rgba(5,54,82,1)", fontWeight: "bold" }}>
                                            <p>₹ {(this.state.amtpayable).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</p>
                                        </div>
                                    </div>

                                    {!isRepaymentBreakdownEmpty ?
                                        <>
                                            <p style={{ marginLeft: "15px", textAlign: "center", fontFamily: "Poppins,sans-serif", fontWeight: "bold", fontSize: "14px", color: "rgba(5,54,82,1)" }}>{t('Repayment Breakdown')}</p>
                                            <hr style={{ backgroundColor: "rgba(5,54,82,1)", marginLeft: "20px", marginRight: "10px", marginTop: "-12px" }} />
                                            {repaymentBreakdown.interestoutstanding !== "" &&
                                                <div className="row ml-0 pl-0">
                                                    <div className="col" style={{ color: "rgba(5,54,82,1)", fontFamily: "Poppins,sans-serif" }}>
                                                        <p>{t('Interest Outstanding')}</p>
                                                    </div>
                                                    <div className="col" style={{ textAlign: "right", color: "rgba(5,54,82,1)", fontWeight: "bold", fontFamily: "Poppins,sans-serif" }}>
                                                        <p>
                                                            ₹  {(repaymentBreakdown.interestoutstanding).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
                                                        </p>
                                                    </div>
                                                </div>
                                            }
                                            {repaymentBreakdown.b2lchargesoutstanding !== "" &&
                                                <div className="row ml-0 pl-0">
                                                    <div className="col" style={{ color: "rgba(5,54,82,1)", fontFamily: "Poppins,sans-serif" }}>
                                                        <p>{t('B2L Charges Outstanding')}</p>
                                                    </div>
                                                    <div className="col" style={{ textAlign: "right", color: "rgba(5,54,82,1)", fontWeight: "bold", fontFamily: "Poppins,sans-serif" }}>
                                                        <p>
                                                            ₹  {(repaymentBreakdown.b2lchargesoutstanding).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
                                                        </p>
                                                    </div>
                                                </div>
                                            }
                                            {repaymentBreakdown.p2pfeeschargesoutstanding !== "" &&
                                                <div className="row ml-0 pl-0">
                                                    <div className="col" style={{ color: "rgba(5,54,82,1)", fontFamily: "Poppins,sans-serif" }}>
                                                        <p>{t('P2P Fee Charges Outstanding')}</p>
                                                    </div>
                                                    <div className="col" style={{ textAlign: "right", color: "rgba(5,54,82,1)", fontWeight: "bold", fontFamily: "Poppins,sans-serif" }}>
                                                        <p>
                                                            ₹  {(repaymentBreakdown.p2pfeeschargesoutstanding).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
                                                        </p>
                                                    </div>
                                                </div>
                                            }
                                            {repaymentBreakdown.prpp !== "" &&
                                                <div className="row ml-0 pl-0">
                                                    <div className="col" style={{ color: "rgba(5,54,82,1)", fontFamily: "Poppins,sans-serif" }}>
                                                        <p>{t('Principal Paid')}</p>
                                                    </div>
                                                    <div className="col" style={{ textAlign: "right", color: "rgba(5,54,82,1)", fontWeight: "bold", fontFamily: "Poppins,sans-serif" }}>
                                                        <p>
                                                            ₹  {(repaymentBreakdown.prpp).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
                                                        </p>
                                                    </div>
                                                </div>
                                            }
                                            {repaymentBreakdown.amtpaid !== "" &&
                                                <div className="row ml-0 pl-0">
                                                    <div className="col" style={{ color: "rgba(5,54,82,1)", fontFamily: "Poppins,sans-serif" }}>
                                                        <p>{t('Amount Paid')}</p>
                                                    </div>
                                                    <div className="col" style={{ textAlign: "right", color: "rgba(5,54,82,1)", fontWeight: "bold", fontFamily: "Poppins,sans-serif" }}>
                                                        <p>₹ {parseFloat(repaymentBreakdown.amtpaid).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")} </p>
                                                    </div>
                                                </div>
                                            }
                                        </>
                                        : <>
                                            <p style={{ marginLeft: "15px", textAlign: "center", fontFamily: "Poppins,sans-serif", fontWeight: "bold", fontSize: "14px", color: "rgba(5,54,82,1)" }}>{t('Repayment Breakdown')}</p>
                                            <hr style={{ backgroundColor: "rgba(5,54,82,1)", marginLeft: "20px", marginRight: "10px", marginTop: "-12px" }} />
                                            <div className="row ml-0 pl-0">
                                                <div className="col" style={{ color: "rgba(5,54,82,1)", fontFamily: "Poppins,sans-serif" }}>
                                                    <p>{resMsg}</p>
                                                </div>
                                            </div>
                                        </>
                                    }
                                </div>
                                <div className="row mb-2">
                                    <div className='col hideCol'></div>
                                    <div className='col-7'>
                                        <button className="btn btnPay" style={{
                                            width: "558px", marginLeft: "-16px",
                                            color: "white", backgroundColor: "rgb(40, 116, 166)"
                                        }} onClick={this.addMoney}>
                                            Pay Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* <div className="card border-0 register-form tab-pane fade show active " id="user-details" style={{ padding: '30px', marginLeft: '45px', width: '92%' }}>
                        <div className="row">
                            <label for="chkYes" className='col'>
                                <input type="radio" id="chkYes" name="chkQstn" />
                                Pay-EMI
                            </label>
                            <label for="chkNo" className='col'>
                                <input type="radio" id="chkNo" name="chkQstn" />
                                Other Amount
                            </label>
                            <label for="chkUYes" className='col'>
                                <input type="radio" id="chkUYes" name="chkQstn" />
                                Pay-Pre Closure
                            </label>

                            <div id='payEmi' style={{ display: "none" }}>
                                <div className='card card-body'>
                                    <div className='row justify-content-center'>
                                        <div className='col-4'>
                                            <div class="card bg-secondary text-light mx-auto">
                                                <div class="card-header border-0 ">
                                                    {this.state.emiAmount > 0 ? <p class="mb-0">EMI: ₹{parseFloat(this.state.emiAmount).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")} </p> : null}

                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='row justify-content-center'>
                                        <div className='col'></div>
                                        <div className='col-2'>
                                            <button className="btn btn-info" onClick={this.addEmi}>Pay Now</button>
                                        </div>
                                        <div className='col'></div>
                                    </div>
                                </div>
                            </div>
                            <div id='payDue' style={{ display: "none" }}>
                                <div className='card card-body'>
                                    <div className='row justify-content-center'>
                                        <div className='col-4'>
                                            <div class="card bg-secondary text-light mx-auto">
                                                <div class="card-header border-0 ">
                                                    <p class="mb-0">Total Amount Payable: ₹ {(this.state.amtpayable).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")} </p>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='row justify-content-center'>
                                        <div className='col'></div>
                                        <div className='col-2'>
                                            <input type="string" placeholder='Enter amount' onChange={this.preAmount} value={this.state.value} style={{ marginLeft: "-30px" }} />
                                            <button className="btn btn-info" onClick={this.addPrepay}>Pay Now</button>
                                        </div>
                                        <div className='col'></div>
                                    </div>
                                </div>

                            </div>
                            <div id='payClosure' style={{ display: "none" }}>
                                <div className='card card-body'>
                                    <div className='row justify-content-center'>
                                        <div className='col-4'>
                                            <div class="card bg-secondary text-light mx-auto">
                                                <div class="card-header border-0 ">
                                                    <p class="mb-0">Principal: ₹ {(this.state.principal).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")} </p>
                                                    <p class="mb-0">Interest: ₹ {this.state.interest} </p>
                                                    <p class="mb-0">Early Closure Fee:₹ {(this.state.elcfee).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</p>
                                                    <p class="mb-0">B2L Due: ₹ {(this.state.b2ldue).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</p>
                                                    <p class="mb-0">Total Amount Payable: ₹ {(this.state.amtpayable).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")} </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='row justify-content-center'>
                                        <div className='col'></div>
                                        <div className='col-2'>
                                            <button className="btn btn-info" onClick={this.addMoney}>Pay Now</button>
                                        </div>
                                        <div className='col'></div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div> */}
                </div>
            </div>
        )
    }
}

export default withTranslation()(LoanClosureBalance)
