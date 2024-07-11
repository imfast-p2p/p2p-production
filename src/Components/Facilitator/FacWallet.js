import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import { BASEURL } from '../assets/baseURL';
import * as CgIcons from "react-icons/cg";
import * as AiIcons from "react-icons/ai";
import * as HiIcons from "react-icons/hi";
import FacilitatorSidebar from '../../SidebarFiles/FacilitatorSidebar';
import { FaUsers, FaAngleLeft, FaRegFileAlt, FaRegFolder, } from 'react-icons/fa';
import dashboardIcon from '../assets/icon_dashboard.png';
import escAcc from '../assets/esAcc.png';
import { withTranslation } from 'react-i18next';
import Loader from '../Loader/Loader';
import { confirmAlert } from 'react-confirm-alert';
import batch from '../assets/batch.png';

export class FacWallet extends Component {

    constructor(props) {
        super(props)

        this.state = {
            lenderidref: "",

            lenderid: "",
            txnamount: "",
            lockedFund: "",
            avwallet: "",
            amount: "",
            loanaccountno: "",
            paymenttype: 3,
            usertype: "",

            walletBalance: "",
            commissionearned: "",
            facilitatedloanreqamt: "",

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
        this.facSummary = this.facSummary.bind(this);
    }

    amount(event) {
        this.setState({ amount: event.target.value })
    }
    txnamount(event) {
        this.setState({ txnamount: event.target.value })
    }
    componentDidMount() {
        this.setState({ showLoader: true })
        this.facSummary();
        // this.onLoadWallet();   
        $("input[name='chkQstn']").click(function () {
            if ($("#chkYes").is(":checked")) {
                $("#txnm").hide();
                $("#amt").show();
            }
            else {
                $("#txnm").show();
                $("#amt").hide();
            }
        });

        this.setState({ pinStatus: sessionStorage.getItem("SisTxnPinEnabled") })
    }
    facSummary() {
        const urlDash = BASEURL + '/lsp/getfacsummary'
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
                    this.setState({ walletBalance: resdata.msgdata.walletbalance });
                    this.setState({ commissionearned: resdata.msgdata.commissionearned });
                    this.setState({ facilitatedloanreqamt: resdata.msgdata.facilitatedloanreqamt });
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
    addMoney() {
        fetch(BASEURL + '/lms/makepayment', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                amount: this.state.amount,
                loanaccountno: this.state.loanaccountno,
                paymenttype: 3
            })
        }).then(response => {
            console.log('Response:', response)
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata);
                if (resdata.status == 'SUCCESS') {
                    // alert(resdata.message);
                    window.location = "/payFacDues";
                    sessionStorage.setItem("productinfo", resdata.msgdata.productinfo);
                    sessionStorage.setItem("firstname", resdata.msgdata.firstname);
                    sessionStorage.setItem("email", resdata.msgdata.email);
                    sessionStorage.setItem("phone", resdata.msgdata.phone);
                    this.state.amount = resdata.msgdata.amount;
                    sessionStorage.setItem("amount", this.state.amount);
                    sessionStorage.setItem("surl", resdata.msgdata.surl);
                    sessionStorage.setItem("furl", resdata.msgdata.furl);
                    sessionStorage.setItem("lastname", resdata.msgdata.lastname);
                    sessionStorage.setItem("curl", resdata.msgdata.curl);
                    sessionStorage.setItem("address1", resdata.msgdata.address1);
                    sessionStorage.setItem("address2", resdata.msgdata.address2);
                    sessionStorage.setItem("city", resdata.msgdata.city);
                    sessionStorage.setItem("state", resdata.msgdata.state);
                    sessionStorage.setItem("country", resdata.msgdata.country);
                    sessionStorage.setItem("zipcode", resdata.msgdata.zipcode);
                    sessionStorage.setItem("udf1", resdata.msgdata.udf1);
                    sessionStorage.setItem("udf2", resdata.msgdata.udf2);
                    sessionStorage.setItem("udf3", resdata.msgdata.udf3);
                    sessionStorage.setItem("udf4", resdata.msgdata.udf4);
                    sessionStorage.setItem("udf5", resdata.msgdata.udf5);
                    sessionStorage.setItem("pg", resdata.msgdata.pg);
                    sessionStorage.setItem("key", resdata.msgdata.key);
                    sessionStorage.setItem("txnid", resdata.msgdata.txnid);
                    sessionStorage.setItem("hash", resdata.msgdata.hash);
                    // window.location.reload();
                } else {
                    alert("Issue: " + resdata.message);
                    window.location.reload();
                }
            })

    }
    //updated
    withdrawMoney() {
        if (this.state.pinStatus == 1) {
            $("#mpinStatusModal").click();
        } else if (this.state.pinStatus == 2) {
            this.txnOtpWithdraw();
        } else {
            this.withdrawmoneyFinal()
        }
    }
    txnOtpWithdraw = () => {
        this.setState({ showLoader: true })

        $('#txnm1').prop('disabled', true)
        $('#txnm2').prop('disabled', true)
        $('#txnm1').css({ 'border-color': 'grey' })
        $('#txnm2').css({ 'background-color': 'grey' })

        fetch(BASEURL + '/lms/facevlwithdrawmoney', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                usertype: "4",
                txnamt: this.state.txnamount
            })
        }).then(response => {
            console.log('Response:', response)
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata);
                if (resdata.status == 'Success') {
                    this.setState({ showLoader: false })
                    if (this.state.walletBalance <= 0) {
                        alert("Wallet balance is 0.")
                        window.location.reload();

                    } else {
                        this.setState({ txnMobReg: resdata.mobileref })
                        $("#transactionPinBody").hide();
                        $("#otpTxnBody").show();
                    }

                } else {
                    this.setState({ showLoader: false })
                    alert(resdata.message);

                }
            })
    }
    txnOtp = (event) => {
        this.setState({ txnOtp: event.target.value })
    }
    mpin = (e) => {
        this.setState({ MPin: e.target.value })
    }
    withdrawmoneyFinal = () => {
        this.setState({ showLoader: true })

        $('#txnm1').prop('disabled', true)
        $('#txnm2').prop('disabled', true)
        $('#txnm1').css({ 'border-color': 'grey' })
        $('#txnm2').css({ 'background-color': 'grey' })

        var data;
        var data2;
        var data3;
        data = JSON.stringify({
            usertype: "4",
            txnamt: this.state.txnamount,
            txnpin: this.state.MPin
        })
        data2 = JSON.stringify({
            usertype: "4",
            txnamt: this.state.txnamount
        })
        data3 = JSON.stringify({
            usertype: "4",
            txnamt: this.state.txnamount,
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
        fetch(BASEURL + '/lms/facevlwithdrawmoney', {
            method: 'post',
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
                if (resdata.status == 'Success') {
                    this.setState({ showLoader: false })
                    if (this.state.walletBalance <= 0) {
                        alert("Wallet balance is 0.")
                        window.location.reload();
                        // confirmAlert({
                        //     message: "Wallet balance is 0.",
                        //     buttons: [{
                        //         label: "Okay",
                        //         onClick: () => {
                        //             window.location.reload();
                        //         }
                        //     }]
                        // })

                    } else {
                        alert("Facilitator withdrawn money request raised to bank");
                        window.location.reload();
                        // confirmAlert({
                        //     message: "Facilitator withdrawn money request raised to bank.",
                        //     buttons: [{
                        //         label: "Okay",
                        //         onClick: () => {
                        //             window.location.reload();
                        //         }
                        //     }]
                        // })
                    }

                } else {
                    this.setState({ showLoader: false })
                    alert(resdata.message);
                    //window.location.reload();
                    // confirmAlert({
                    //     message: resdata.message,
                    //     buttons: [{
                    //         label: "Okay",
                    //         onClick: () => {
                    //             window.location.reload();
                    //         }
                    //     }]
                    // })
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
            <div className="container-dashboard d-flex flex-row" id="wrapper" style={{ marginTop: "-7px", backgroundColor: "#F4F7FC" }}>
                {
                    this.state.showLoader && <Loader />
                }
                <FacilitatorSidebar />
                <div className="main-content" id="page-content-wrapper">
                    <div className="container-fluid row pt-2">
                        <div className="col-1" id='facnavRes1'>
                            <button style={{ marginLeft: "25px" }} onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className='col-4' id='facnavRes2' style={{ marginLeft: "20px", marginTop: "5px" }}>
                            <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                <Link to="/facilitatorDashboard">Home</Link> / Account</p>
                        </div>
                        <div className='col'>

                        </div>
                        <div className='col'>

                        </div>
                        <div className='col-3'>

                        </div>
                        <div className="col" id='facnavRes3'>
                            <button style={myStyle}>
                                <Link to="/facilitatorDashboard"><FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} /><span style={{ textDecoration: "none", color: "white" }}>Back</span></Link></button>
                        </div>
                    </div>

                    <div className="container-fluid row pt-2" id='container' style={{ paddingLeft: "86px" }}>
                        <div className='card' style={{ cursor: "default" }}>
                            <div className='row'>
                                <div className='col-4' id='firstCol'>
                                    <div className="form-row pt-3 pl-2">
                                        <div className='col' id='headingfacwl'>
                                            <div className="two__image" style={{ paddingLeft: "20px", marginLeft: "-10px" }}>
                                                <p className="text-white" style={{ paddingBottom: "6px", fontWeight: "600" }}>Balance</p>
                                            </div>
                                        </div>
                                        <div className='card' id='myWalletCard1' style={{ borderRadius: "10px", marginTop: "-3px", marginBottom: "0px", backgroundColor: "rgb(208, 234, 247)", color: "rgba(5,54,82,1)", border: "0px", cursor: "default" }}>
                                            <div class="row card-body">
                                                <div className='col pl-4'>
                                                    <h6 className='card-title' >{t('Facilitated Amount')}</h6>
                                                    <h5 className='card-text' >₹{(this.state.facilitatedloanreqamt).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</h5>

                                                </div>
                                            </div>
                                        </div>
                                        <div className='card' id='myWalletCard2' style={{ borderRadius: "10px", marginBottom: "0px", backgroundColor: "rgb(208, 234, 247)", color: "rgba(5,54,82,1)", border: "0px", cursor: "default" }}>
                                            <div class="row card-body">
                                                <div className='col pl-4'>
                                                    <h6 className='card-title' >{t('Commission Earned')}</h6>
                                                    <h5 className='card-text' >₹{(this.state.commissionearned).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</h5>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='card' id='myWalletCard3' style={{ borderRadius: "10px", backgroundColor: "rgb(208, 234, 247)", color: "rgba(5,54,82,1)", border: "0px", cursor: "default" }}>
                                            <div class="row card-body">
                                                <div className='col pl-4'>
                                                    <h6 className='card-title'>{t('Current Balance')}</h6>
                                                    <h5 className='card-text'>₹{(this.state.walletBalance).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
                                                    </h5>
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
                                        <p style={{ color: "rgb(40, 116, 166)", fontWeight: "bold", marginLeft: "-10px" }}><img src={escAcc} style={{ width: "30px" }} />&nbsp; Account Details</p>
                                    </div>
                                    <div className='row' style={{ marginLeft: "-60px" }}>
                                        <ul role="tablist" className="nav nav-pills nav-fill mb-3" >
                                            <li className="nav-item"> <a data-toggle="pill" href="#withdraw-money" className="nav-link active detailsTab"
                                                style={{ textAlign: "initial" }}> {t('Withdraw Money')} </a> </li>
                                        </ul>
                                    </div>
                                    <div className='row' id='thirdCol2' style={{ marginLeft: "-70px" }}>
                                        <div className='tab-content'>
                                            <div className=" register-form tab-pane fade show active">
                                                <p style={{ fontWeight: "bold", color: "rgb(34, 44, 112)" }}>Enter Amount</p>
                                                <div style={{ paddingBottom: "20px", marginTop: "-10px" }}>
                                                    <input id="txnm1" type="string" onChange={this.txnamount} className="" placeholder="Enter Amount"
                                                        style={{
                                                            border: "1px solid rgba(40,116,166,1)",
                                                            width: "300px",

                                                            height: "38px",
                                                            borderRadius: "5px",
                                                            color: "RGBA(5,54,82,1)"
                                                        }} required />
                                                </div>

                                                <button id='txnm2' onClick={this.withdrawMoney} style={{ height: "38px", width: "300px", border: "0px", color: "white", backgroundColor: "rgb(40, 116, 166)" }}>
                                                    Withdraw Money
                                                </button>
                                            </div>
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
                        <div className="col p-4 m-3" style={{ backgroundColor: "RGB(49, 173, 134)" }}>
                            <h6 className="mb-0">Total Wallet Balance</h6>
                            <span className="mb-0">
                               
                                <h6 class="mb-0"> <p>₹{(this.state.walletBalance).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</p></h6>
                            </span>
                        </div>
                        <div className="col p-4 m-3 bg-info">
                            <h6 className="mb-0">Commission Earned</h6>
                            <span className="mb-0">
                                
                                <h6 class="mb-0"><p>₹{(this.state.commissionearned).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</p></h6>
                            </span>
                        </div>
                        <div className="col p-4 m-3 bg-secondary">
                            <h6 className="mb-0">Facilitated Amount</h6>
                            <span className="mb-0">
                                
                                <h6 class="mb-0"> <p>₹{(this.state.facilitatedloanreqamt).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</p></h6>
                            </span>
                        </div>
                    </div>

                    <div className="card border-0 register-form tab-pane fade show active " id="user-details" style={{ padding: '30px', marginLeft: '45px', width: '92%' }}>
                        <div className="row justify-content-md-center ml-5">
                            <label for="chkNo" className=' col col-lg-4' >
                                <input type="radio" id="chkNo" name="chkQstn" onClick={this.onWidraw} />WithdrawMoney
                            </label>
                        </div>

                        <div className="row justify-content-md-center">
                            <div id="amt" className="col-md-auto mt-2 " style={{ display: "none" }}>
                                <input type="string" onChange={this.amount} className="" placeholder='EnterTheAmount' required />
                                <div className="mt-2">
                                    <button type="button" className="btn btn-success mt-2" onClick={this.addMoney}>AddMoney</button>
                                </div>
                            </div>
                            <div id="txnm" className="col-md-auto mt-2 " style={{ display: "none" }}>
                                <input type="string" onChange={this.txnamount} className="" placeholder="Enter The Amount" required />
                                <div className="mt-2">
                                    <button type="button" className="btn btn-info" onClick={this.withdrawMoney}>WithdrawMoney</button>
                                </div>
                            </div>
                        </div>
                    </div> */}
                </div>
            </div >
        )
    }
}

export default withTranslation()(FacWallet);
