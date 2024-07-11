import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import { BASEURL } from '../assets/baseURL';
import LenderSidebar from '../../SidebarFiles/LenderSidebar';
import i18n from "i18next";
import { withTranslation } from 'react-i18next';
import { confirmAlert } from 'react-confirm-alert';
import { FaAngleLeft } from 'react-icons/fa';
import dashboardIcon from '../assets/icon_dashboard.png';
import './MyWallet.css';
import * as FaIcons from "react-icons/fa";
import batch from '../assets/batch.png';

import Loader from '../Loader/Loader';

//updated
export class MyWallet extends Component {

    constructor(props) {
        super(props)

        this.state = {
            lenderidref: "",

            lenderid: "",
            txnamount: "",
            walletBalance: "",
            lockedFund: "",
            avwallet: "",
            amount: "",
            loanaccountno: "",
            paymenttype: "",

            showLoader: false,
            pinStatus: "",
            MPin: "",

            txnOtp: "",
            txnMobReg: "",
        }

        this.amount = this.amount.bind(this);
        this.txnamount = this.txnamount.bind(this);
        this.addMoney = this.addMoney.bind(this);
        this.withdrawMoney = this.withdrawMoney.bind(this);
        this.lenderSummary = this.lenderSummary.bind(this);
    }

    amount(event) {
        this.setState({ amount: event.target.value });
    }

    txnamount(event) {
        this.setState({ txnamount: event.target.value })
    }

    componentDidMount() {
        // this.setState({ loaded: true })
        if (sessionStorage.getItem('isLogin') == "true") {
            this.setState({ showLoader: true })
            this.lenderSummary();

            this.setState({ pinStatus: sessionStorage.getItem("SisTxnPinEnabled") })
        } else {
            window.location = '/login'
        }
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
            })
            .then((resdata) => {
                if (resdata.status == 'SUCCESS') {
                    this.setState({ showLoader: false });
                    console.log(resdata);
                    this.setState({ walletBalance: resdata.msgdata.walletbalance });
                    this.setState({ lockedFund: resdata.msgdata.lockedfunds });
                    this.setState({ avwallet: resdata.msgdata.availablewalletbalance });
                } else {
                    this.setState({ showLoader: false });
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
                                        // window.location.reload();
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
        if (this.state.amount > 0) {
            // const popup = window.confirm("Are you sure you want to add amount in wallet ?");
            // if (popup == true) {
            //     sessionStorage.setItem("amount", this.state.amount);
            //     window.location = "/payUmoney";
            // }
            sessionStorage.setItem("amount", this.state.amount);
            $("#myWallet").click()
            //window.location = "/payUmoney";
        } else {
            confirmAlert({
                message: "Please enter the amount.",
                buttons: [{
                    label: "Okay",
                    onClick: () => {
                    }
                }
                ]
            })
        }

    }
    withdrawMoney() {
        // this.setState({ loaded: false })
        if (this.state.pinStatus == 1) {
            $("#mpinStatusModal").click();
        } else if (this.state.pinStatus == 2) {
            this.txnOtpWithdraw();
        }
        else {
            this.withdrawmoneyFinal()
        }
    }
    txnOtpWithdraw = () => {
        this.setState({ showLoader: true })
        if (this.state.txnamount) {
            console.log("this executed")
            $('#withdrawinpt').prop('disabled', true)
            $('#withdrawBtn').prop('disabled', true)
            $('#withdrawinpt').css({ 'border-color': 'grey' })
            $('#withdrawBtn').css({ 'background-color': 'grey' })

            fetch(BASEURL + '/lms/withdrawmoney', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer " + sessionStorage.getItem('token')
                },
                body: JSON.stringify({
                    lenderid: sessionStorage.getItem('userID'),
                    txnamount: this.state.txnamount,
                })
            }).then(response => {

                console.log('Response:', response)
                return response.json();
            })
                .then((resdata) => {
                    console.log(resdata);
                    if (resdata.status == 'SUCCESS') {
                        // this.setState({ loaded: true })
                        this.setState({ showLoader: false })
                        console.log("this executed2")

                        this.setState({ txnMobReg: resdata.msgdata.mobileref })
                        $("#mpinStatusModal").click();
                        $("#transactionPinBody").hide();
                        $("#otpTxnBody").show();

                        $('#withdrawinpt').prop('disabled', false)
                        $('#withdrawBtn').prop('disabled', false)
                        $('#withdrawinpt').css({ 'border-color': 'rgba(40,116,166,1)' })
                        $('#withdrawBtn').css({ 'background-color': 'rgb(40, 116, 166)' })

                    } else {
                        // this.setState({ loaded: true })
                        this.setState({ showLoader: false })
                        alert(resdata.message);
                        //window.location.reload();
                    }
                })
        } else {
            confirmAlert({
                message: "Please enter minimum amount to withdraw.",
                buttons: [
                    {
                        label: "Okay",
                        onClick: () => {
                            // window.location.reload();
                        }
                    }
                ],
                closeOnClickOutside: false,
            })
        }

    }
    txnOtp = (event) => {
        this.setState({ txnOtp: event.target.value })
    }
    mpin = (e) => {
        this.setState({ MPin: e.target.value })
    }
    withdrawmoneyFinal = () => {
        this.setState({ showLoader: true })
        $('#withdrawinpt').prop('disabled', true)
        $('#withdrawBtn').prop('disabled', true)
        $('#withdrawinpt').css({ 'border-color': 'grey' })
        $('#withdrawBtn').css({ 'background-color': 'grey' })

        var data;
        var data2;
        var data3;
        data = JSON.stringify({
            lenderid: sessionStorage.getItem('userID'),
            txnamount: this.state.txnamount,
            txnpin: this.state.MPin
        })
        data2 = JSON.stringify({
            lenderid: sessionStorage.getItem('userID'),
            txnamount: this.state.txnamount
        })
        data3 = JSON.stringify({
            lenderid: sessionStorage.getItem('userID'),
            txnamount: this.state.txnamount,
            mobileotp: this.state.txnOtp,
            mobileref: this.state.txnMobReg
        })
        // var result = this.state.pinStatus == 1 ? data : data2
        var result;
        if (this.state.pinStatus == 1) {
            result = data;
        } else if (this.state.pinStatus == 2) {
            result = data3;
        } else {
            result = data2;
        }
        fetch(BASEURL + '/lms/withdrawmoney', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: result
        }).then(response => {

            console.log('Response:', response)
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata);
                if (resdata.status == 'SUCCESS' || 'Success') {
                    // this.setState({ loaded: true })
                    this.setState({ showLoader: false })
                    //$("#exampleModalCenter6").hide()
                    // confirmAlert({
                    //     message: "Lender withdrawn money request raised to bank.",
                    //     buttons: [{
                    //         label: "Okay",
                    //         onClick: () => {
                    //             window.location.reload();
                    //             $('#withdrawinpt').prop('disabled', false)
                    //             $('#withdrawBtn').prop('disabled', false)
                    //             $('#withdrawinpt').css({ 'border-color': 'rgba(40,116,166,1)' })
                    //             $('#withdrawBtn').css({ 'background-color': 'rgb(40, 116, 166)' })
                    //         }
                    //     }
                    //     ]
                    // })
                    alert("Lender withdraw money request raised to bank");
                    window.location.reload();
                    $('#withdrawinpt').prop('disabled', false)
                    $('#withdrawBtn').prop('disabled', false)
                    $('#withdrawinpt').css({ 'border-color': 'rgba(40,116,166,1)' })
                    $('#withdrawBtn').css({ 'background-color': 'rgb(40, 116, 166)' })

                } else {
                    // this.setState({ loaded: true })
                    this.setState({ showLoader: false })
                    confirmAlert({
                        message: "Please enter minimum amount to withdraw.",
                        buttons: [
                            {
                                label: "Okay",
                                onClick: () => {
                                    window.location.reload();
                                }
                            }
                        ],
                        closeOnClickOutside: false,
                    })
                    //window.location.reload();
                }
            })
    }
    onAdd() {
        $('.divAdd').toggle();
        $('.btnAdd').toggle();
    }

    onWidraw() {
        $('.divWid').toggle();
        $('.btnWid').toggle();
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
        return (
            <div className="container-dashboard d-flex flex-row" id="wrapper" style={{ marginTop: "-10px", backgroundColor: "#f4f7fc" }}>
                {
                    this.state.showLoader && <Loader />
                }
                <LenderSidebar />
                <div className="main-content" id="page-content-wrapper">
                    <div className="container-fluid row pt-2">
                        <div className="col-1" id='myWalletRes1'>
                            <button style={{ marginLeft: "25px" }} onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className='col-4' id='myWalletRes2' style={{ marginLeft: "20px", marginTop: "5px" }}>
                            <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                <Link to="/lenderdashboard">Home</Link>/ Escrow Account</p>
                        </div>
                        <div className='col'>

                        </div>
                        <div className='col'>

                        </div>
                        <div className='col-3'>

                        </div>
                        <div className="col" id='myWalletRes3'>
                            <button style={myStyle}>
                                <Link to="/lenderdashboard"><FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} /><span style={{ textDecoration: "none", color: "white" }}>Back</span></Link></button>
                        </div>
                    </div>
                    <hr className="col-11" style={{ marginLeft: "50px", width: "88.6%", backgroundColor: "rgba(4,78,160,1)", marginTop: "-10px" }} />

                    <div className="container-fluid row pt-2" id='container' style={{ paddingLeft: "86px", marginTop:"-20px" }}>
                        <div className='card' style={{ cursor: "default" }}>
                            <div className='row'>
                                <div className='col-4' id='firstCol'>
                                    <div className="form-row pt-3 pl-2">
                                        <div className='col' id='headinglndwl'>
                                            <div className="two__image" style={{ paddingLeft: "20px", marginLeft: "-10px" }}>
                                                <p className="text-white" style={{ paddingBottom: "6px", fontWeight: "600" }}>Balance</p>
                                            </div>
                                        </div>
                                        <div className='card' id='myWalletCard1' style={{ borderRadius: "10px", marginTop: "-3px", marginBottom: "0px", backgroundColor: "rgb(208, 234, 247)", color: "rgba(5,54,82,1)", border: "0px", cursor: "default" }}>
                                            <div class="row card-body">
                                                <div className='col pl-4'>
                                                    <h6 className='card-title'>{t('Total Escrow Balance')}</h6>
                                                    <h5 style={{fontSize:"14px"}} className='card-text'>₹ {(this.state.walletBalance).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</h5>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='card' id='myWalletCard2' style={{ borderRadius: "10px", marginBottom: "0px", backgroundColor: "rgb(208, 234, 247)", color: "rgba(5,54,82,1)", border: "0px", cursor: "default" }}>
                                            <div class="row card-body">
                                                <div className='col pl-4'>
                                                    <h6 className='card-title' >{t('Locked Funds')}</h6>
                                                    <h5 style={{fontSize:"14px"}} className='card-text' >₹ {(this.state.lockedFund).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</h5>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='card' id='myWalletCard3' style={{ borderRadius: "10px", backgroundColor: "rgb(208, 234, 247)", color: "rgba(5,54,82,1)", border: "0px", cursor: "default" }}>
                                            <div class="row card-body">
                                                <div className='col pl-4'>
                                                    <h6 className='card-title' >{t('Available Balance')}</h6>
                                                    <h5 style={{fontSize:"14px"}} className='card-text' >₹ {(this.state.avwallet).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</h5>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col d-flex" id='vl' style={{ height: "394px", paddingTop: "10px" }}>
                                    <div class="vr"></div>
                                </div>
                                <div className='col-7'>
                                    <div className='row' id='thirdCol1' style={{ marginLeft: "-60px", paddingTop: "10px" }}>
                                        <p style={{ color: "rgb(40, 116, 166)", fontWeight: "bold", marginLeft: "-10px" }}><FaIcons.FaMoneyCheck />&nbsp; Escrow Account</p>
                                    </div>
                                    <div className='row' style={{ marginLeft: "-60px" }}>
                                        <ul role="tablist" className="nav nav-pills nav-fill mb-3" >
                                            <li className="nav-item"> <a data-toggle="pill" href="#add-money" id="myNavLink" className="nav-link active"
                                                style={{ textAlign: "center" }}> {t('Add Money')} </a> </li>
                                            <li className="nav-item"> <a data-toggle="pill" href="#withdraw-money" id="myNavLink" className="nav-link"
                                                style={{ textAlign: "center" }}> {t('Withdraw Money')} </a> </li>
                                        </ul>
                                        {/* <hr style={{ marginTop: "-8px" }} /> */}
                                    </div>
                                    <div className='row' id='thirdCol2' style={{ marginLeft: "-70px" }}>
                                        <div className='tab-content'>
                                            <div id="add-money" className=" register-form tab-pane fade show active">
                                                <p style={{ fontWeight: "bold", fontFamily: "Poppins,sans-serif",fontSize:"15px", color: "rgb(34, 44, 112)" }}>Enter Amount</p>
                                                <div style={{ paddingBottom: "20px", marginTop: "-10px" }}>
                                                    <input id="" type="string" onChange={this.amount} className="" placeholder="Enter Amount"
                                                        style={{
                                                            border: "1px solid rgba(40,116,166,1)",
                                                            width: "300px",

                                                            height: "38px",
                                                            borderRadius: "5px",
                                                            color: "RGBA(5,54,82,1)"
                                                        }} required />
                                                </div>

                                                <button onClick={this.addMoney} style={{ height: "38px", width: "300px", border: "0px", color: "white", backgroundColor: "rgb(40, 116, 166)" }}>
                                                    Add Money
                                                </button>

                                            </div>
                                            <div id="withdraw-money" className=" register-form tab-pane fade">
                                                <p style={{ fontWeight: "bold", color: "rgb(34, 44, 112)" }}>Enter Amount</p>
                                                <div style={{ paddingBottom: "20px", marginTop: "-10px" }}>
                                                    <input id="withdrawinpt" type="string" onChange={this.txnamount} className="" placeholder="Enter Amount"
                                                        style={{
                                                            border: "1px solid rgba(40,116,166,1)",
                                                            width: "300px",

                                                            height: "38px",
                                                            borderRadius: "5px",
                                                            color: "RGBA(5,54,82,1)"
                                                        }} required />
                                                </div>

                                                <button id='withdrawBtn' onClick={this.withdrawMoney} style={{ height: "38px", width: "300px", border: "0px", color: "white", backgroundColor: "rgb(40, 116, 166)" }}>
                                                    Withdraw Money
                                                </button>
                                            </div>

                                            {/* Route to payG*/}
                                            <Link to="/payUmoney"><button id='myWallet' style={{ display: "none" }}>Refresh
                                            </button></Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CommitFundingMpin Modal */}
                    <button id='mpinStatusModal' style={{ display: "none" }} type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter6">
                    </button>
                    <div className="modal fade" id="exampleModalCenter6" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" data-backdrop="static">
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content" style={{ width: "330px", marginLeft: "100px" }}>
                                <div className="modal-body">
                                    <div className='row' id='transactionPinBody'>
                                        <div className='col'>
                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold" }}><img src={batch} width="25px" />Transaction PIN</p>
                                            <hr style={{ width: "50px", marginTop: "-10px" }} />
                                            <div className='row'>
                                                <div style={{ display: "" }} className="col">
                                                    <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold", fontSize: "15px" }}>Enter PIN</p>
                                                    <input className='form-control' type='password' placeholder='Enter PIN' id='' onChange={this.mpin}
                                                        autoComplete='off' style={{ marginTop: "-10px" }} />
                                                </div>
                                            </div>

                                            {/* <div className='row mt-2'>
                                                <div className='col' style={{ textAlign: "end" }}>
                                                    <p id="countdown" style={{ color: "grey" }}></p>
                                                    <p id='countdown2' style={{ cursor: "pointer", fontWeight: "600", color: "rgba(5,54,82,1)", textDecorationLine: "underline" }} onClick={this.retriggerFundAcceptOTP}></p>
                                                </div>
                                            </div> */}
                                            <hr style={{ backgroundColor: "rgba(5,54,82,1)" }} />
                                        </div>
                                    </div>
                                    <div className='row' id='otpTxnBody' style={{ display: "none" }}>
                                        <div className='col'>
                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold" }}><img src={batch} width="25px" />Transaction OTP</p>
                                            <hr style={{ width: "50px", marginTop: "-10px" }} />
                                            <div className='row'>
                                                <div className="col">
                                                    <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold", fontSize: "15px" }}>Enter OTP</p>
                                                    <input className='form-control' type='password' placeholder='Enter OTP' id='' onChange={this.txnOtp}
                                                        onInput={(e) => {
                                                            e.target.value = Math.max(0, parseInt(e.target.value || 0, 10)).toString().slice(0, 6)
                                                        }}
                                                        autoComplete='off' style={{ marginTop: "-10px" }} />
                                                </div>
                                            </div>
                                            <hr style={{ backgroundColor: "rgba(5,54,82,1)" }} />
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col' style={{ textAlign: "end" }}>
                                            <button type="button" class="btn text-white btn-sm"
                                                style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.withdrawmoneyFinal}>Submit</button>
                                            &nbsp;
                                            <button type="button" class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "#0079BF" }}>Cancel</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* <div className="row mb-3 mr-2 p-4 text-light">
                        <div className="col p-4 m-3" style={{backgroundColor:"RGB(49, 173, 134)"}}>
                            <h6 className="mb-0">{t('TotalWalletBalance')}</h6>
                            <span className="mb-0">
                               
                                <h6 class="mb-0"> <p>₹{(this.state.walletBalance).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</p></h6>
                            </span>
                        </div>
                        <div className="col p-4 m-3 bg-info">
                            <h6 className="mb-0">{t('LockedFunds')}</h6>
                            <span className="mb-0">
                            
                                <h6 class="mb-0"><p>₹{(this.state.lockedFund).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</p></h6>
                            </span>
                        </div>
                        <div className="col p-4 m-3 bg-secondary">
                            <h6 className="mb-0">{t('AvailableBalance')}</h6>
                            <span className="mb-0">
                                
                                <h6 class="mb-0"> <p>₹{(this.state.avwallet).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</p></h6>
                            </span>
                        </div>
                    </div>
                    <div className="card border-0 register-form tab-pane fade show active " id="user-details" style={{ padding: '30px', marginLeft: '45px', width: '92%' }}>
                        <div className="row justify-content-md-center ml-5">
                        
                                <label for="chkYes" className='col col-lg-2 ' >
                                    <input type="radio" id="chkYes" name="chkQstn" onClick={this.onAdd}/>AddMoney
                                </label>
                                
                                <label for="chkNo" className=' col col-lg-4' >
                                    <input type="radio" id="chkNo" name="chkQstn"  onClick={this.onWidraw}/>WithdrawMoney
                                </label>
                        </div>

                        <div className="row justify-content-md-center">
                        <div id="amt" className="col-md-auto mt-2 " style={{ display: "none" }}>
                                <input type="string" onChange={this.amount}  className="" placeholder={t('EnterTheAmount')} required/>
                                    <div className="mt-2">
                                        <button type="button" className="btn btn-success mt-2" onClick={this.addMoney}>{t('AddMoney')}</button>
                                    </div>
                            </div>
                            <div id="txnm" className="col-md-auto mt-2 " style={{ display: "none" }}>
                                <input type="string" onChange={this.txnamount}  className="" placeholder="Enter The Amount" required/>
                                    <div className="mt-2">
                                        <button type="button" className="btn btn-info" onClick={this.withdrawMoney}>{t('WithdrawMoney')}</button>
                                    </div>
                            </div>
                        </div>
                    </div> */}
                </div>
            </div >
        )
    }
}

export default withTranslation()(MyWallet)