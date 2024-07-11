import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import { BASEURL } from '../assets/baseURL';
import LenderSidebar from '../../SidebarFiles/LenderSidebar';
import { t } from 'i18next';
import { withTranslation } from 'react-i18next';
import { confirmAlert } from 'react-confirm-alert';
import dashboardIcon from '../assets/icon_dashboard.png';
import { FaAngleLeft, FaThumbsUp } from "react-icons/fa";
import Loader from '../Loader/Loader';

export class PayLndDues extends Component {
    //updated
    constructor(props) {
        super(props)

        this.state = {
            productinfo: sessionStorage.getItem('productinfo'),
            firstname: sessionStorage.getItem('firstname'),
            email: sessionStorage.getItem('email'),
            phone: sessionStorage.getItem('phone'),
            amount: sessionStorage.getItem('amount'),
            surl: sessionStorage.getItem('surl'),
            furl: sessionStorage.getItem('furl'),
            lastname: sessionStorage.getItem('lastname'),
            curl: sessionStorage.getItem('curl'),
            address1: sessionStorage.getItem('address1'),
            address2: sessionStorage.getItem('address2'),
            city: sessionStorage.getItem('city'),
            state: sessionStorage.getItem('state'),
            country: sessionStorage.getItem('country'),
            zipcode: sessionStorage.getItem('zipcode'),
            udf1: sessionStorage.getItem('udf1'),
            udf2: sessionStorage.getItem('udf2'),
            udf3: sessionStorage.getItem('udf3'),
            udf4: sessionStorage.getItem('udf4'),
            udf5: sessionStorage.getItem('udf5'),
            pg: sessionStorage.getItem('pg'),
            key: sessionStorage.getItem('key'),
            txnid: sessionStorage.getItem('txnid'),
            hash: sessionStorage.getItem('hash'),

            utype: '',
            paymenttype: "",
            loanaccountno: sessionStorage.getItem('loanaccountno'),
            amt: "",
            vpa: "",
            name: "CAPITAL HUB PTE LTD",
            showLoader: false,
            disableKeyPress: false
        }
        this.productinfo = this.productinfo.bind(this);
        this.firstname = this.firstname.bind(this);
        this.email = this.email.bind(this);
        this.phone = this.phone.bind(this);
        this.amount = this.amount.bind(this);
        this.surl = this.surl.bind(this);
        this.furl = this.furl.bind(this);
        this.key = this.key.bind(this);
        this.txnid = this.txnid.bind(this);
        this.hash = this.hash.bind(this);
        this.submitPayuForm = this.submitPayuForm.bind(this);
        this.submitUpiForm = this.submitUpiForm.bind(this);
        this.loanaccountno = this.loanaccountno.bind(this);
        this.vpa = this.vpa.bind(this);
        this.name = this.name.bind(this);
    }

    loanaccountno() {
        this.setState({ loanaccountno: this.state.loanaccountno })
    }
    vpa(event) {
        var match = /[a-zA-Z0-9_]{3,}@[a-zA-Z]{2,64}/;
        var vpaNo = event.target.value;
        if (match.test(vpaNo)) {
            this.setState({ vpa: vpaNo })
            console.log("passed")
        } else {
            return false;
        }
    }
    name(event) {
        this.setState({ name: event.target.name })
    }

    productinfo() {
        this.setState({ productinfo: this.state.productinfo })
    }
    firstname() {
        this.setState({ firstname: this.state.firstname })
    }
    email() {
        this.setState({ email: this.state.email })
    }
    phone() {
        this.setState({ phone: this.state.phone })
    }
    amount() {
        this.setState({ amount: this.state.amount })
    }
    surl() {
        this.setState({ surl: this.state.surl })
    }
    furl() {
        this.setState({ furl: this.state.furl })
    }
    key() {
        this.setState({ key: this.state.key })
    }
    txnid() {
        this.setState({ txnid: this.state.txnid })
    }
    hash() {
        this.setState({ hash: this.state.hash })
    }
    componentDidMount() {
        //Setting Utype
        if (sessionStorage.getItem('isLogin') == "true") {
            this.setState({ loaded: true })
            this.setState({ utype: sessionStorage.getItem('userType') })
            $("input[name='chkQstn']").click(function () {
                if ($("#chkYes").is(":checked")) {
                    $("#payumoney").show();
                    $("#qrcode").hide();
                    $("#upi").hide();
                } if ($("#chkUYes").is(":checked")) {
                    $("#upi").show();
                    $("#payumoney").hide();
                    $("#qrcode").hide();
                }
                else if ($("#chkNo").is(":checked")) {
                    $("#payumoney").hide();
                    $("#upi").hide();
                    $("#qrcode").show();
                }
            });

            $('#chkNo').click(function () {
                document.getElementById('cardchkNo').style.backgroundColor = "rgb(230, 243, 245)";
                document.getElementById('cardchkUYes').style.backgroundColor = "white";
            })
            $('#chkUYes').click(function () {
                document.getElementById('cardchkUYes').style.backgroundColor = "rgb(230, 243, 245)";
                document.getElementById('cardchkNo').style.backgroundColor = "white";
            })
            window.addEventListener('keydown', this.handleKeyPress);
        } else {
            window.location = '/login'
        }

    };
    componentWillUnmount() {
        window.removeEventListener('keydown', this.handleKeyPress);
    }
    handleKeyPress = (event) => {
        if (this.state.disableKeyPress) {
            event.preventDefault();
        }
    };
    submitUpiForm() {
        $('input').prop('disabled', true)
        this.setState({ showLoader: true });
        var vpa = this.state.vpa;

        var match = /[a-zA-Z0-9_]{3,}@[a-zA-Z]{2,64}/;
        if (match.test(vpa)) {
            fetch(BASEURL + '/lms/getpaymentcollectrequest', {
                method: "post",
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer " + sessionStorage.getItem('token')
                },
                body: JSON.stringify({
                    amt: parseFloat(this.state.amount),
                    utype: this.state.utype,
                    paymenttype: 3,
                    // loanaccountno:this.state.loanaccountno,
                    vpa: this.state.vpa,
                    name: this.state.name
                })
            }).then(response => {
                this.setState({ showLoader: false });
                console.log('Response:', response)
                return response.json();
            }).then((resdata) => {
                console.log(resdata);
                if(resdata.status==="SUCCESS"||resdata.status==="Success"){
                    this.setState({ showLoader: false });
                    this.setState({ disableKeyPress: true });
                    confirmAlert({
                        message: resdata.message,
                        buttons: [{
                            label: "Okay",
                            onClick: () => {
                                $("#lndDashboard").click()
                                //window.location = "/lenderDashboard"
                            }
                        }],
                        closeOnClickOutside: false,
                        onKeypress: () => { }
                    })
                }else{
                    this.setState({ showLoader: false });
                    confirmAlert({
                        message: resdata.message,
                        buttons: [{
                            label: "Okay",
                            onClick: () => {
                            }
                        }],
                        closeOnClickOutside: false,
                        onKeypress: () => { }
                    })
                }
            })
        } else {
            this.setState({ showLoader: false });
            confirmAlert({
                message: "Invalid UPI ID,Enter correct UPI ID.",
                buttons: [{
                    label: "Okay",
                    onClick: () => {
                        this.setState({ loaded: true })
                        window.location.reload()
                    }
                }],
                closeOnClickOutside: false,
                onKeypress: () => { }
            })
        }

    }
    submitPayuForm() {
        fetch("https://test.payu.in/_payment", {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                productinfo: this.state.productinfo,
                firstname: this.state.firstname,
                email: this.state.email,
                phone: this.state.phone,
                amount: parseInt(this.state.amount),
                surl: this.state.surl,
                furl: this.state.furl,
                lastname: this.state.lastname,
                curl: this.state.curl,
                address1: this.state.address1,
                address2: this.state.address2,
                city: this.state.city,
                state: this.state.state,
                country: this.state.country,
                zipcode: this.state.zipcode,
                udf1: this.state.udf1,
                udf2: this.state.udf2,
                udf3: this.state.udf3,
                udf4: this.state.udf4,
                udf5: this.state.udf5,
                pg: this.state.pg,
                key: this.state.key,
                txnid: this.state.txnid,
                hash: this.state.hash
            })
        }).then(response => {
            console.log('Response:', response)
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata);

            })

    }

    handleChange() {
        $('.text').toggle();
        $('#PImage').toggle();
        $('#Pinfo').toggle();
    }
    cancelUpiForm = () => {
        window.location.reload();
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
                    <div className="container-fluid row pt-2" style={{ marginBottom: "-11px" }}>
                        <div className="col-1" id='LPay1'>
                            <button style={{ marginLeft: "25px" }} onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className='col-4' id='LPay2' style={{ marginLeft: "20px", marginTop: "5px" }}>
                            <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                <Link to="/lenderdashboard">Home</Link> / Payment Gateway</p>
                        </div>
                        <div className='col'>

                        </div>
                        <div className='col'>

                        </div>
                        <div className='col-3'>

                        </div>
                        <div className="col" id='LPay3'>
                            <button style={myStyle}>
                                <Link to="/lenderdashboard" style={{ marginLeft: "10px" }}><FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} /><span style={{ textDecoration: "none", color: "white" }}>Back</span></Link></button>
                        </div>
                    </div>
                    <hr className="col-11" style={{ marginLeft: "50px", width: "88.6%", backgroundColor: "rgba(4,78,160,1)" }} />

                    {/* <div className="row">
                    <div className="card border-0 register-form tab-pane fade show active " id="user-details" style={{ padding: '30px', marginLeft: '45px',width: '92%' }}>
                            <div className="row">
                                <h4 className="pl-4 mt-2" style={{ textAlign: 'center' }}>Payment Gateway</h4>
                            </div>
                            <hr />
                            <div className="row">
                                <div className="col-lg-6 col-md-6 col-sm-6">
                                    <div className="d-flex m-5">
                                        <label>
                                            <input type="radio" name="colorRadio"
                                                value="one" /> </label>
                                        <h6 className="label mr-2">Pay with PayU money</h6>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-6">
                                    <div className="d-flex m-5">
                                        <label>
                                            <input type="radio" name="colorRadio"
                                                value="two" /> </label>

                                        <h6 className="label mr-2">Pay with QR Code</h6>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-lg-6 col-md-6 col-sm-6" style={{ paddingLeft: '62px' }}>
                                    <div class="box one">
                                        <h6 style={{marginLeft: '10px'}}>You are being redirected to PayU money site for payment.</h6>
                                        <button className="btn btn-primary ml-5 mr-2" onClick={this.submitPayuForm}>I Agree</button>
                                        <Link to="/lenderdashboard">
                                            <button className="btn btn-danger mr-2 ml-2">Cancel</button>
                                        </Link>
                                    </div>
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-6" style={{ paddingLeft: '62px' }}>
                                    <div class="box two">
                                        <h6 style={{marginLeft: '10px'}}>You are being redirected to QR Code for payment.</h6>
                                        <Link to="/paymentQRCodeLndDue">
                                            <button className="btn btn-success  ml-2">Pay via QR code</button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> */}
                    {/* <div className="row">
                        <div className="col-3"></div>
                        <div className="col-6"> */}
                    <form action="https://test.payu.in/_payment" target="_blank" name="payuform" method="POST">
                        {/* <h3>Mandatory Parameters</h3> */}
                        <div class="form-group">
                            {/* <label for="productInfo">Product Info:</label> */}
                            <input type="hidden" class="form-control" id="productinfo" name="productinfo" value={this.state.productinfo} />
                        </div>
                        <div class="form-group">
                            {/* <label for="firstname">First Name:</label> */}
                            <input type="hidden" class="form-control" id="firstname" name="firstname" value={this.state.firstname} />
                        </div>
                        <div class="form-group">
                            {/* <label for="email">Email:</label> */}
                            <input type="hidden" class="form-control" id="email" name="email" value={this.state.email} />
                        </div>
                        <div class="form-group">
                            {/* <label for="phone">Phone:</label> */}
                            <input type="hidden" class="form-control" id="phone" name="phone" value={this.state.phone} />
                        </div>
                        <div class="form-group">
                            {/* <label for="amount">Amount:</label> */}
                            <input type="hidden" class="form-control" id="amount" name="amount" value={this.state.amount} />
                        </div>
                        <div class="form-group">
                            {/* <label for="surl">Success Url:</label> */}
                            <input type="hidden" class="form-control" id="surl" name="surl" value={this.state.surl} />
                        </div>
                        <div class="form-group">
                            {/* <label for="furl">Failure Url:</label> */}
                            <input type="hidden" class="form-control" id="furl" name="furl" value={this.state.furl} />
                        </div>
                        {/* <h3>Optional Parameters</h3> */}
                        <div class="form-group">
                            {/* <label for="lastname">LastName:</label> */}
                            <input type="hidden" class="form-control" id="lastname" name="lastname" value={this.state.lastname} />
                        </div>
                        <div class="form-group">
                            {/* <label for="curl">Cancel Url:</label> */}
                            <input type="hidden" class="form-control" id="curl" name="curl" value={this.state.curl} />
                        </div>

                        <div class="form-group">
                            {/* <label for="address1">Address1:</label> */}
                            <input type="hidden" class="form-control" id="address1" name="address1" value={this.state.address1} />
                        </div>

                        <div class="form-group">
                            {/* <label for="address2">Address2:</label> */}
                            <input type="hidden" class="form-control" id="address2" name="address2" value={this.state.address2} />
                        </div>

                        <div class="form-group">
                            {/* <label for="city">City:</label> */}
                            <input type="hidden" class="form-control" id="city" name="city" value={this.state.city} />
                        </div>
                        <div class="form-group">
                            {/* <label for="state">State:</label> */}
                            <input type="hidden" class="form-control" id="state" name="state" value={this.state.state} />
                        </div>
                        <div class="form-group">
                            {/* <label for="country">Country:</label> */}
                            <input type="hidden" class="form-control" id="country" name="country" value={this.state.country} />
                        </div>
                        <div class="form-group">
                            {/* <label for="zipcode">Zipcode:</label> */}
                            <input type="hidden" class="form-control" id="zipcode" name="zipcode" value={this.state.zipcode} />
                        </div>
                        <div class="form-group">
                            {/* <label for="udf1">Udf1:</label> */}
                            <input type="hidden" class="form-control" id="udf1" name="udf1" value={this.state.udf1} />
                        </div>
                        <div class="form-group">
                            {/* <label for="udf2">Udf2:</label> */}
                            <input type="hidden" class="form-control" id="udf2" name="udf2" value={this.state.udf2} />
                        </div>
                        <div class="form-group">
                            {/* <label for="udf1">Udf3:</label> */}
                            <input type="hidden" class="form-control" id="udf3" name="udf3" value={this.state.udf3} />
                        </div>
                        <div class="form-group">
                            {/* <label for="udf1">Udf4:</label> */}
                            <input type="hidden" class="form-control" id="udf4" name="udf4" value={this.state.udf4} />
                        </div>
                        <div class="form-group">
                            {/* <label for="udf1">Udf5:</label> */}
                            <input type="hidden" class="form-control" id="udf5" name="udf5" value={this.state.udf5} />
                        </div>
                        <div class="form-group">
                            {/* <label for="pg">Pg:</label> */}
                            <input type="hidden" class="form-control" id="pg" name="pg" value={this.state.pg} />
                        </div>

                        {/* <button className="btn btn-primary" onclick={this.pay}>Submit</button><br /> */}

                        <input type="hidden" name="key" id="key" value={this.state.key} /><br />
                        <input type="hidden" id="hash" name="hash" value={this.state.hash} /><br />
                        <input type="hidden" name="txnid" id="txnid" value={this.state.txnid} /><br />

                        {/* <div className="border p-3">
                                    <h6>You are being redirected to PayU money site for payment.</h6>
                                    <button className="btn btn-primary ml-5 mr-2" onclick={this.submitPayuForm}>I Agree</button>
                                    <Link to="/lenderdashboard">
                                        <button className="btn btn-danger mr-2 ml-2">Cancel</button>
                                    </Link>
                                    <Link to="/paymentQRCodeLndDue">
                                        <button className="btn btn-success  ml-2">Pay via QR code</button>
                                    </Link>
                                </div> */}
                        {/* <div className="row" style={{ marginTop: "-90px" }}>
                            <div className="card border-0 register-form tab-pane fade show active " id="user-details" style={{ padding: '30px', marginLeft: '45px', width: '92%' }}>
                                <div className="row">
                                    <label className="pl-3" style={{ textAlign: 'center' }}>{t('Lender Due ')}</label>
                                    <label className="pl-3" style={{ textAlign: 'center' }}>{t('Amount: ')}
                                        <span style={{ fontWeight: "lighter" }}>₹{sessionStorage.getItem('amount')}</span>
                                    </label>
                                </div>
                                <hr />

                                <div className="row">
                                    <p>{t('PleaseSelectPaymentOption')}</p>

                                    <label for="chkYes" className='col' style={{ color: "RGB(207, 206, 202)" }} title="Service unavailable">
                                        <input type="radio" id="chkYes" name="chkQstn" disabled="true" />
                                        {t('PaywithPayUmoney')}
                                    </label>

                                    <label for="chkNo" className='col' style={{ marginLeft: "160px" }}>
                                        <input type="radio" id="chkNo" name="chkQstn" />
                                        {t('PaywithQRCode')}
                                    </label>
                                    <label for="chkUYes" className='col' style={{ marginLeft: "160px" }}>
                                        <input type="radio" id="chkUYes" name="chkQstn" />
                                        {t('Pay with UPI')}
                                    </label>


                                    <hr style={{ marginLeft: "-10px" }} />
                                    <div id="payumoney" style={{ display: "none" }}>
                                        <div class="card card-body">

                                            <div className='row'>
                                                <div className='col-3'></div>
                                                <div className='col-6'>
                                                    <button className="btn btn-primary">{t('PaywithPayUmoney')}</button>
                                                    <Link to="/lenderdashboard">
                                                        <button className="btn btn-danger ml-2">{t('Cancel')}</button>
                                                    </Link>
                                                </div>
                                                <div className='col-3'></div>
                                            </div>
                                        </div>
                                    </div>
                                    <div id="qrcode" style={{ display: "none" }}>

                                        <div class="card card-body">
                                            <div className='row'>
                                                <div className='col-3'></div>
                                                <div className='col-6' style={{ marginLeft: "120px" }}>
                                                    <Link to="/paymentQRCodeLndDue">
                                                        <button className="btn btn-success">{t('PayWithQRCode')}</button>
                                                    </Link>
                                                    <Link to="/lenderdashboard">
                                                        <button className="btn btn-danger ml-2">{t('Cancel')}</button>
                                                    </Link>
                                                </div>
                                                <div className='col-3'></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div> */}
                    </form>
                    {/* <div className='col' style={{ width: "98%", marginLeft: "15px", marginTop: "-30px" }}>
                        <div id="upi" style={{ display: "none" }}>
                            <div class="card card-body">
                                <div className='row'>
                                    <div className='col-3'></div>
                                    <div className='col-6' style={{ marginLeft: "100px" }}>
                                        <input type="string" placeholder='Enter UPI ID' onChange={this.vpa} style={{ width: "280px", height: "37px", marginRight: "4px" }} />
                                        <button className="btn btn-success mb-2" onClick={this.submitUpiForm}>Pay</button>
                                    </div>
                                    <div className='col-3'></div>
                                </div>
                            </div>
                        </div>
                    </div> */}

                    {/* new Payment Gateway */}
                    <div className="tab-content" style={{ marginTop: "-90px" }}>
                        <div className="register-form">
                            <div className='' style={{ marginLeft: "15%" }}>
                                <div className="card" style={{ cursor: 'default', width: "50%" }}>
                                    <div className='form-group pl-2 pr-2 pt-2'>
                                        <p style={{ textAlign: "center", fontWeight: "bold", color: "rgb(31, 88, 126)" }}>Payment Gateway</p>
                                        <hr style={{ backgroundColor: "rgba(4,78,160,1)" }} />
                                    </div>
                                    <div className='form-group pl-2 pr-2' style={{ marginTop: "-20px" }}>
                                        <div className='row'>
                                            <div className='col'>
                                                <p style={{ color: "rgb(31, 88, 126)" }}>{t('Lender Due ')}</p>
                                            </div>
                                            <div className='col' style={{ textAlign: "end" }}>
                                                <p style={{ color: "rgb(31, 88, 126)" }}>{t('Amount: ')} <span style={{ fontWeight: "bold" }}>₹ {parseFloat(sessionStorage.getItem('amount')).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</span>
                                                </p>
                                            </div>
                                        </div>
                                        <hr style={{ marginTop: "1px", backgroundColor: "rgba(4,78,160,1)" }} />
                                    </div>
                                    <div className='form-group pl-2 pr-2' style={{ marginTop: "-20px" }}>
                                        <p style={{ color: "rgb(31, 88, 126)" }}>Select Payment Method</p>
                                        <div className='row' style={{ marginTop: "-20px" }}>
                                            <div className='col'>
                                                <div className='card pl-3' style={{ height: "40px", marginBottom: "1px", cursor: "default" }}>
                                                    <div className='form-check mt-2' style={{ color: "RGB(207, 206, 202)" }} title="Service unavailable">
                                                        <input className='form-check-input' type="radio" id="chkYes" name="chkQstn" disabled="true"
                                                        /><span style={{ paddingLeft: "10px", color: "rgb(144, 207, 222)" }}>Pay with PayU money</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col'>
                                                <div className='card pl-3' id='cardchkNo' style={{ height: "40px", marginBottom: "1px", cursor: "default" }}>
                                                    <div className='form-check mt-2'>
                                                        <input className='form-check-input' type="radio" id="chkNo" name="chkQstn"
                                                            style={{ color: "rgb(31, 88, 126)" }} /><span style={{ paddingLeft: "10px", color: "rgb(31, 88, 126)" }}>Pay with QR Code
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className='col'>
                                                <div className='card pl-3' id='cardchkUYes' style={{ height: "40px", marginBottom: "1px", cursor: "default" }}>
                                                    <div className='form-check mt-2'>
                                                        <input className='form-check-input' type="radio" id="chkUYes" name="chkQstn"
                                                            style={{ color: "rgb(31, 88, 126)" }} /><span style={{ paddingLeft: "10px", color: "rgb(31, 88, 126)" }}>Pay with UPI</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='col'>

                                            </div>
                                        </div>
                                        <hr style={{ backgroundColor: "rgba(4,78,160,1)" }} />
                                    </div>
                                    <div className='form-group pl-2 pr-2' id="qrcode" style={{ display: "none", marginTop: "-20px" }}>
                                        <div className='row'>
                                            <div className='col-6' style={{ textAlign: "end", paddingRight: "1px" }}>
                                                <Link to="/paymentQRCodeLndDue">
                                                    <button className='btn-sm text-white' style={{ backgroundColor: "rgb(136, 189, 72)" }}>Pay With QR Code</button>
                                                </Link>
                                            </div>
                                            <div className='col-4'>
                                                <Link to="/lenderdashboard">
                                                    <button className='btn-sm text-white' style={{ backgroundColor: "#0079bf" }}>Cancel</button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='form-group pl-2 pr-2' id="upi" style={{ display: "none", marginTop: "-20px" }}>
                                        <div className='row'>
                                            <div className='col-7'>
                                                <input type="string" placeholder='Enter UPI ID' style={{ width: "260px" }} onChange={this.vpa} />
                                            </div>
                                            <div className='col-2'>
                                                <button className='btn-sm' style={{ backgroundColor: "rgb(136, 189, 72)", width: "80px", height: "30px", border: "none", color: "white" }} onClick={this.submitUpiForm}>Pay</button>
                                            </div>
                                            &nbsp;
                                            <div className='col-2'>
                                                <button className='btn-sm' style={{ backgroundColor: "#0079bf", width: "80px", height: "30px", border: "none", color: "white" }} onClick={this.cancelUpiForm}>Cancel</button>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Route to dashboard*/}
                                    <Link to="/lenderDashboard"><button id='lndDashboard' style={{ display: "none" }}>Refresh
                                    </button></Link>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div >
        )
    }
}

export default withTranslation()(PayLndDues)
