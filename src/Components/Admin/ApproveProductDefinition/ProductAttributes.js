import React, { Component } from 'react';
import $ from 'jquery';
import { BASEURL } from '../../assets/baseURL';
import AdminSidebar from '../AdminSidebar';
import { withTranslation } from 'react-i18next';
import { FaPlus } from "react-icons/fa";
import { FaAngleLeft } from "react-icons/fa";
import dashboardIcon from '../../assets/icon_dashboard.png';
import { Link } from 'react-router-dom';
import Multiselect from 'multiselect-react-dropdown';
import * as FaIcons from "react-icons/fa";
import './ProductAttributes.css';
import prodAttr from '../../assets/AdminImg/prodAttri.png';
import editRole from '../../assets/editRole.png';
import { confirmAlert } from "react-confirm-alert";

var authAmt;
var authpurp;
var authint;
var authrpf;
var authgrace;
var authfund;
export class ProductAttributes extends Component {
    constructor(props) {
        super(props)
        this.state = {
            //Product Definition Amount
            authorized1: "",
            defloanamt: "",
            loanamtmultiple: "",
            maxloanamt: "",
            minloanamt: "",
            multipledisbursals: "",
            topup: "",

            // Product definition Funding
            maxfundinginvestor: "",
            autoinvestlimit: "",
            maxfundingcommit: "",
            minfundingcommit: "",
            minautofundingcommit: "",
            authorized2: "",
            fundinginmultiplesof: "",

            // Product definition Grace
            authorized3: "",
            elcdaysgrace: "",
            gracedaysonarrears: "",
            gracedaysintpayment: "",
            arrearstoleranceamount: "",
            gracedaysprincpayment: "",
            gracedayspenalinterest: "",
            latepenaltyfrequency: "",
            overduedaysbeforenpa: "",

            // Product definition Interest
            authorized4: "",
            interestpostingfrequency: "",
            penalintrate: "",
            interestaccrualperiod: "",
            interestrateperiod: "",
            allowpartialperiodintcalc: "",
            overduegraceamt: "",
            teaserintstdate: "",
            teaserintenddate: "",
            interestcalmethod: "",
            teaserintrateallowed: "",
            variableintbase: "",
            mininterestrate: "",
            maxinterestrate: "",
            interestmethod: "",
            teaserinterestrate: "",
            interesttype: "",

            // Product definition Repayment
            authorized5: "",
            partialprepaymentallowed: "",
            mindaysbeforefirstinst: "",
            allowvarinstallments: "",
            minnoofrepayments: "",
            epimultiple: "",
            repaymentfrequency: "",
            syncwithdisbursedate: "",
            noofrepaymentsdefault: "",
            fullprepaymentallowed: "",
            princthresholdlastint: "",
            maxnoofrepayments: "",

            // Product Purpose 
            loanPurposeDefList: [],
            loanpurpose: "",
            loanpurposeid: "",
            authorized6: "",

            //addProduct purpose
            productid: sessionStorage.getItem("productID"),

            productList: [],
            prodid: "",

            //Product Launch
            authprodtype: "",
            authpurp: "",
            authcur: "",
            authmem: "",
            authamt: "",
            authint: "",
            authrpf: "",
            authgrace: "",
            authfund: "",
            authprod: "",
            bllfeeamt: "",
            blefeeamt: "",
            latepaymentpenalty: "",
            borlatepaymentfrequency: "",
            borlatepaymentmaxcap: "",
            elcfeefixedpercentage: "0",
            elcfeemaxcap: "",
            faccommissionamt: "0",
            evlcommissionfixedpercentage: "0.005",
            evlcommissionmaxcap: "100",
            validfromdate: "",

        }
    }
    componentDidMount() {
        sessionStorage.getItem("productAuth");
        this.getProductDefamtInfo();
        this.getProductDefFundinginfo();
        this.getProductDefGraceinfo();
        this.getProductDefInterestinfo();
        this.getProductDefRepaymentinfo();
        this.getProductPurposeinfo();
    }
    // add Product Purpose
    getProductdefProductinfo = () => {
        $('#addProductPurpose').click();
        // fetch(BASEURL + '/lms/getproductdefproductinfo', {
        //     method: 'GET',
        //     headers: {

        //         'Authorization': "Bearer " + sessionStorage.getItem('token')
        //     }
        // })
        //     .then(response => {
        //         console.log('Response:', response)
        //         return response.json();
        //     })
        //     .then((resdata) => {
        //         console.log(resdata)
        //         if (resdata.status === 'SUCCESS') {
        //             console.log(resdata.msgdata)
        //             this.setState({ productList: resdata.msgdata })
        //         } else {
        //             alert("Issue: " + resdata.message);
        //         }
        //     })
        fetch(BASEURL + `/lms/getproductpurposeinfo?productid=` + this.state.productid, {
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
                if (resdata.status === 'Success') {
                    console.log(resdata.msgdata)
                    this.setState({ loanPurposeDefList: resdata.msgdata })
                } else {
                    //alert("Issue: " + resdata.message);
                }
            })
    }
    productid = (event) => {
        this.setState({ productid: event.target.value })
        console.log(this.state.prodid);
        // this.state.productList
        //     .filter((e) => e.productid == event.target.value)
        //     .map((prdt, index) => {
        //         this.getProductPurposeinfo(event.target.value);
        //     })
    }
    productPurpose = (event) => {
        this.setState({ loanpurposeid: event.target.value });
        console.log(this.state.loanpurposeid);
    }
    setProductPurpose = () => {
        fetch(BASEURL + `/lms/setproductpurposeinfo`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                productid: this.state.productid,
                loanpurposeid: this.state.loanpurposeid,

            })
        }).then(response => {
            console.log(response)
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata)
                if (resdata.status == 'Success') {
                    console.log(resdata.msgdata)
                    alert(resdata.message);
                    window.location = '/productAttributes';
                } else {
                    alert("Issue: " + resdata.message);
                    //window.location.reload();
                }
            })
            .catch(err => {
                console.log(err.message)
            })
    }
    cancelProductPurpose = () => {
        window.location.reload();
    }

    // Authorize Product Purpose
    authorizeProductpurpose = () => {
        fetch(BASEURL + '/lms/authorizeproductpurpose', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                productid: this.state.productid,
                loanpurposeid: this.state.loanpurposeid,
            })
        }).then(response => {
            console.log(response)
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata)
                if (resdata.status === 'Success') {
                    console.log(resdata.msgdata)
                    alert(resdata.message)
                    window.location = "/productAttributes"
                } else {
                    alert("Issue: " + resdata.message);
                    window.location.reload();
                }
            })
            .catch(err => {
                console.log(err.message)
            })
    }

    cancelAuth = () => {
        window.location.reload();
    }

    getProductDefamtInfo = () => {
        fetch(BASEURL + `/lms/getproductdefamtinfo?productid=` + sessionStorage.getItem('productID'), {
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
                if (resdata.status === 'Success') {
                    console.log(resdata.msgdata)
                    this.setState({ authorized1: resdata.msgdata.authorized })
                    this.setState({ defloanamt: resdata.msgdata.defloanamt })
                    this.setState({ loanamtmultiple: resdata.msgdata.loanamtmultiple })
                    this.setState({ maxloanamt: resdata.msgdata.maxloanamt })
                    this.setState({ minloanamt: resdata.msgdata.minloanamt })
                    this.setState({ multipledisbursals: resdata.msgdata.multipledisbursals })
                    this.setState({ topup: resdata.msgdata.topup })
                } else {
                    // alert("Issue: " + resdata.message);
                }
            })
    }
    getProductDefFundinginfo = () => {
        fetch(BASEURL + `/lms/getproductdeffundinginfo?productid=` + sessionStorage.getItem('productID'), {
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
                if (resdata.status === 'Success') {
                    console.log(resdata.msgdata)
                    this.setState({ maxfundinginvestor: resdata.msgdata.maxfundinginvestor })
                    this.setState({ autoinvestlimit: resdata.msgdata.autoinvestlimit })
                    this.setState({ maxfundingcommit: resdata.msgdata.maxfundingcommit })
                    this.setState({ minfundingcommit: resdata.msgdata.minfundingcommit })
                    this.setState({ minautofundingcommit: resdata.msgdata.minautofundingcommit })
                    this.setState({ authorized2: resdata.msgdata.authorized })
                    this.setState({ fundinginmultiplesof: resdata.msgdata.fundinginmultiplesof })
                } else {
                    // alert("Issue: " + resdata.message);
                }
            })
    }
    getProductDefGraceinfo = () => {
        fetch(BASEURL + `/lms/getproductdefgraceinfo?productid=` + sessionStorage.getItem('productID'), {
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
                if (resdata.status === 'Success') {
                    console.log(resdata.msgdata)
                    this.setState({ authorized3: resdata.msgdata.authorized })
                    this.setState({ elcdaysgrace: resdata.msgdata.elcdaysgrace })
                    this.setState({ gracedaysonarrears: resdata.msgdata.gracedaysonarrears })
                    this.setState({ gracedaysintpayment: resdata.msgdata.gracedaysintpayment })
                    this.setState({ arrearstoleranceamount: resdata.msgdata.arrearstoleranceamount })
                    this.setState({ gracedayspenalinterest: resdata.msgdata.gracedayspenalinterest })
                    this.setState({ latepenaltyfrequency: resdata.msgdata.latepenaltyfrequency })
                    this.setState({ overduedaysbeforenpa: resdata.msgdata.overduedaysbeforenpa })
                    this.setState({ gracedaysprincpayment: resdata.msgdata.gracedaysprincpayment })

                } else {
                    // alert("Issue: " + resdata.message);
                }
            })
    }
    getProductDefInterestinfo = () => {
        fetch(BASEURL + `/lms/getproductdefinterestinfo?productid=` + sessionStorage.getItem('productID'), {
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
                if (resdata.status === 'Success') {
                    console.log(resdata.msgdata)
                    this.setState({ authorized4: resdata.msgdata.authorized })
                    this.setState({ interestpostingfrequency: resdata.msgdata.interestpostingfrequency })
                    this.setState({ penalintrate: resdata.msgdata.penalintrate })
                    this.setState({ interestaccrualperiod: resdata.msgdata.interestaccrualperiod })
                    this.setState({ interestrateperiod: resdata.msgdata.interestrateperiod })
                    this.setState({ allowpartialperiodintcalc: resdata.msgdata.allowpartialperiodintcalc })
                    this.setState({ overduegraceamt: resdata.msgdata.overduegraceamt })
                    this.setState({ teaserintstdate: resdata.msgdata.teaserintstdate })
                    this.setState({ teaserintenddate: resdata.msgdata.teaserintenddate })
                    this.setState({ interestcalmethod: resdata.msgdata.interestcalmethod })
                    this.setState({ teaserintrateallowed: resdata.msgdata.teaserintrateallowed })
                    this.setState({ variableintbase: resdata.msgdata.variableintbase })
                    this.setState({ mininterestrate: resdata.msgdata.mininterestrate })
                    this.setState({ maxinterestrate: resdata.msgdata.maxinterestrate })
                    this.setState({ interestmethod: resdata.msgdata.interestmethod })
                    this.setState({ teaserinterestrate: resdata.msgdata.teaserinterestrate })
                    this.setState({ interesttype: resdata.msgdata.interesttype })



                } else {
                    // alert("Issue: " + resdata.message);
                }
            })
    }
    getProductDefRepaymentinfo = () => {
        fetch(BASEURL + `/lms/getproductdefrepaymentinfo?productid=` + sessionStorage.getItem('productID'), {
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
                if (resdata.status === 'Success') {
                    console.log(resdata.msgdata)
                    this.setState({ authorized5: resdata.msgdata.authorized })
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
                    // alert("Issue: " + resdata.message);
                }
            })
    }
    getProductPurposeinfo = () => {
        fetch(BASEURL + `/lms/getproductpurposeinfo?productid=` + sessionStorage.getItem('productID'), {
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
                if (resdata.status === 'Success') {
                    console.log(resdata.msgdata)

                    this.setState({ loanPurposeDefList: resdata.msgdata })
                } else {
                    // alert("Issue: " + resdata.message);
                }
            })
    }
    setproductdefAmt = () => {
        window.location = "/setproductdefAmts"
    }
    setproductdefFund = () => {
        window.location = "/setproductdefFunds"
    }
    setproductdefGrace = () => {
        window.location = "/setproductdefGraces"
    }
    setproductdefInterest = () => {
        window.location = "/setproductdefInterests"
    }
    setproductdefRepayment = () => {
        window.location = "/setproductdefRepayments"
    }
    setproductPurpose = () => {
        window.location = "/setproductPurposes"
    }

    authorizeProduct = (loanpurposeid) => {
        sessionStorage.setItem('LoanPurposeID', loanpurposeid)
        this.setState({ loanpurposeid: sessionStorage.getItem("LoanPurposeID") })
        console.log(this.state.loanpurposeid)
        $('#setProductPurpose').click();
        // window.location = "/authorizeProductpurpose"
    }
    //product Launch
    authprodtype = (event) => {
        this.setState({ authprodtype: event.target.value })
    }
    authpurp = (event) => {
        var valueData = event.target.checked;
        if (valueData == true) {
            authpurp = "1"
        } else {
            authpurp = "0"
        }

    }
    authcur = (event) => {
        this.setState({ authcur: event.target.value })
    }
    authmem = (event) => {
        this.setState({ authmem: event.target.value })
    }
    authamt = (event) => {
        console.log(event.target.checked)
        var valueData = event.target.checked;
        if (valueData == true) {
            authAmt = "1"
        } else {
            authAmt = "0"
        }
        console.log(authAmt)
    }
    authint = (event) => {
        var valueData = event.target.checked;
        if (valueData == true) {
            authint = "1"
        } else {
            authint = "0"
        }
    }
    authrpf = (event) => {
        var valueData = event.target.checked;
        if (valueData == true) {
            authrpf = "1"
        } else {
            authrpf = "0"
        }
    }
    authgrace = (event) => {
        var valueData = event.target.checked;
        if (valueData == true) {
            authgrace = "1"
        } else {
            authgrace = "0"
        }
    }
    authfund = (event) => {
        var valueData = event.target.checked;
        if (valueData == true) {
            authfund = "1"
        } else {
            authfund = "0"
        }
    }
    authprod = (event) => {
        this.setState({ authprod: event.target.value })
    }
    bllfeeamt = (event) => {
        this.setState({ bllfeeamt: event.target.value })
    }
    blefeeamt = (event) => {
        this.setState({ blefeeamt: event.target.value })
    }
    latepaymentpenalty = (event) => {
        this.setState({ latepaymentpenalty: event.target.value })
    }
    borlatepaymentfrequency = (event) => {
        this.setState({ borlatepaymentfrequency: event.target.value })
    }
    borlatepaymentmaxcap = (event) => {
        this.setState({ borlatepaymentmaxcap: event.target.value })
    }
    elcfeefixedpercentage = (event) => {
        this.setState({ elcfeefixedpercentage: event.target.value })
    }
    elcfeemaxcap = (event) => {
        this.setState({ elcfeemaxcap: event.target.value })
    }
    faccommissionamt = (event) => {
        this.setState({ faccommissionamt: event.target.value })
    }
    evlcommissionfixedpercentage = (event) => {
        this.setState({ evlcommissionfixedpercentage: event.target.value })
    }
    evlcommissionmaxcap = (event) => {
        this.setState({ evlcommissionmaxcap: event.target.value })
    }
    validfromdate = (event) => {
        this.setState({ validfromdate: event.target.value })
    }
    AuthorizeProduct = () => {
        fetch(BASEURL + '/lms/authorizeproductlaunch', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                productid: this.state.productid,
                authprodtype: this.state.authprodtype,
                authpurp: authpurp,
                authcur: this.state.authcur,
                authmem: this.state.authmem,
                authamt: authAmt,
                authint: authint,
                authrpf: authrpf,
                authgrace: authgrace,
                authfund: authfund,
                authprod: this.state.authprod,
                bllfeeamt: this.state.bllfeeamt,
                blefeeamt: this.state.blefeeamt,
                latepaymentpenalty: this.state.latepaymentpenalty,
                borlatepaymentfrequency: this.state.borlatepaymentfrequency,
                borlatepaymentmaxcap: this.state.borlatepaymentmaxcap,
                elcfeefixedpercentage: this.state.elcfeefixedpercentage,
                elcfeemaxcap: this.state.elcfeemaxcap,
                faccommissionamt: this.state.faccommissionamt,
                evlcommissionfixedpercentage: this.state.evlcommissionfixedpercentage,
                evlcommissionmaxcap: this.state.evlcommissionmaxcap,
                validfromdate: this.state.validfromdate
            })
        }).then(response => {
            return response.json();
        })//updated
            .then((resdata) => {
                console.log(resdata)
                if (resdata.status == 'Success') {
                    //alert(resdata.message)
                    confirmAlert({
                        message: resdata.message,
                        buttons: [
                            {
                                label: "OK",
                                onClick: () => {
                                    window.location = "/productDefinitions"
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
                                    window.location.reload()
                                },
                            },
                        ],
                    });
                    //window.location.reload()
                }

            })
    }
    cancelAuthorizeProduct = () => {
        window.location.reload()
    }

    handleChange() {
        $('.text').toggle();
    }

    render() {
        console.log(this.state.authorized1)
        const { t } = this.props
        var prodID = sessionStorage.getItem('productID');
        var loanpurposeID = sessionStorage.getItem('LoanPurposeID');
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
        var productAuth = sessionStorage.getItem("productAuth")
        var prodName = sessionStorage.getItem('prodName');
        var prodDesc = sessionStorage.getItem('prodDesc');
        var currencyCode = sessionStorage.getItem('currencyCode');
        var memGrp = sessionStorage.getItem('memberGrp');

        return (
            <div className="container-dashboard d-flex flex-row" id="wrapper" style={{ backgroundColor: "#f4f7fc" }}>
                <AdminSidebar />
                <div className="pl-3 pr-3 main-content" id="page-content-wrapper">
                    <div className="container-fluid row pt-2">
                        <div className="col-1" id="ProductAttrRes1">
                            <button style={{ marginLeft: "25px" }} onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className='col-6' id="ProductAttrRes2" style={{ marginLeft: "20px", marginTop: "5px" }}>
                            <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                <Link to="/landing">Home</Link> / <Link to="/productDefinitions">Product List</Link> / Product Attributes </p>
                        </div>
                        <div className='col'>

                        </div>
                        <div className='col'>

                        </div>
                        <div className='col'>

                        </div>
                        <div className="col" id="ProductAttrRes3">
                            <button style={myStyle}>
                                <Link to="/productDefinitions" style={{ marginLeft: "10px" }}><FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} /><span style={{ textDecoration: "none", color: "white" }}>Back</span></Link></button>
                        </div>

                    </div>
                    <hr className="col-11" style={{ marginLeft: "50px", width: "88.6%", backgroundColor: "rgba(4,78,160,1)", marginTop: "0px" }} />

                    <div className="tab-content">
                        <div className="register-form">
                            <div className='' >
                                <div className="card" style={{ marginLeft: "50px", cursor: 'default', width: "92%", backgroundColor: "#f4f7fc", border: "1.5px solid #0079bf" }}>
                                    <div className='row'>
                                        <div className='col-4' id='headingRef'>
                                            <div className="two__image" style={{ paddingLeft: "10px" }}>
                                                <p className="text-white" style={{ paddingBottom: "6px", fontWeight: "600" }}>Product Attributes</p>
                                            </div>
                                        </div>
                                        {/* <div className='col-4' style={{ color: "#222c70", fontSize: "16px",paddingTop:"5px", textAlign:"center" }}>
                                            <div>
                                                <p className="mb-0 font-weight-bold">Product Name: <span style={{fontWeight:"400"}}>{prodID}</span></p>
                                            </div>
                                        </div> */}
                                    </div>
                                    <div className='row pl-2 pr-2'>
                                        <div className='col'>
                                            <div className='card' style={{ cursor: "default" }}>
                                                <div className='form-group pl-2 pr-2 pt-2'>
                                                    <div className='row pl-2 pr-2'>
                                                        <div className="col" style={{ color: "#222c70", fontSize: "14px" }}>
                                                            <div className='row'>
                                                                <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                    <p className="mb-0 font-weight-bold">Product Name</p>
                                                                </div>
                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                </div>
                                                                <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                    <p className="mb-0">{prodName}</p>
                                                                </div>
                                                            </div>
                                                            <div className='row'>
                                                                <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                    <p className="mb-0 font-weight-bold">Product ID</p>
                                                                </div>
                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                </div>
                                                                <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                    <p className="mb-0">{prodID}</p>
                                                                </div>
                                                            </div>
                                                            <div className='row'>
                                                                <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                    <p className="mb-0 font-weight-bold">Product Description</p>
                                                                </div>
                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                </div>
                                                                <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                    <p className="mb-0">{prodDesc}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className='col'></div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='card' style={{ cursor: "default" }}>
                                                <div className='form-group pl-2 pr-2 pt-2'>
                                                    <div className='row'>
                                                        <div className='col-10' id="" style={{ fontFamily: "Poppins,sans-serif", fontWeight: "bold", color: "#222c70", fontSize: "15px" }}>
                                                            <img src={prodAttr} style={{ marginTop: "-6px", width: "15px", marginLeft: "1px" }} />&nbsp;<span>Amount Information</span>
                                                            <hr style={{ marginTop: "1px", backgroundColor: "rgba(4,78,160,1)" }} />
                                                        </div>
                                                        <div className='col-2' style={{ textAlign: "end" }}>
                                                            {/* {productAuth == 0 ? <button className='btn btn-sm' onClick={this.setproductdefAmt}
                                                                style={{ border: "2px solid #0079bf", marginTop: "-8px", color: "#0079bf" }}><FaIcons.FaEdit style={{ marginTop: "-4px" }} />&nbsp;<span>Edit</span></button>
                                                                : null} */}
                                                        </div>
                                                    </div>

                                                    <div className='row pl-2 pr-2' >
                                                        <div className='col' style={{ color: "#222c70", fontSize: "14px" }}>
                                                            <div className='row'>
                                                                <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                    <p className="mb-0 font-weight-bold">Default Loan Amount</p>
                                                                </div>
                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                </div>
                                                                <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                    {
                                                                        this.state.defloanamt ? <p className="mb-0">₹ {parseFloat(this.state.defloanamt).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</p> :
                                                                            "0"
                                                                    }
                                                                </div>
                                                            </div>
                                                            <div className='row'>
                                                                <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                    <p className="mb-0 font-weight-bold">Authorise</p>
                                                                </div>
                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                </div>
                                                                <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                    {
                                                                        this.state.authorized1 == "0" ? <p className="mb-0">Not Authorised</p> : <p className="mb-0">Authorised</p>
                                                                    }

                                                                </div>
                                                            </div>
                                                            <div className='row'>
                                                                <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                    <p className="mb-0 font-weight-bold">Loan Amount Multiple</p>
                                                                </div>
                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                </div>
                                                                <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                    <p className="mb-0">{this.state.loanamtmultiple}</p>
                                                                </div>
                                                            </div>
                                                            <div className='row'>
                                                                <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                    <p className="mb-0 font-weight-bold">Top Up</p>
                                                                </div>
                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                </div>
                                                                <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                    {
                                                                        this.state.topup == "0" ? <p className="mb-0">Not Allowed</p> : <p className="mb-0">Allowed</p>
                                                                    }

                                                                </div>
                                                            </div>

                                                        </div>
                                                        <div className='col' style={{ color: "#222c70", fontSize: "14px" }}>
                                                            <div className='row'>
                                                                <div className='col-sm-7 col-md-7 col-lg-7'>
                                                                    <p className="mb-0 font-weight-bold">Multiple Disbursals</p>
                                                                </div>
                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                </div>
                                                                <div className='col-sm-4 col-md-4 col-lg-4'>
                                                                    {
                                                                        this.state.multipledisbursals == "0" ? <p className="mb-0">Not Allowed</p> : <p className="mb-0">Allowed</p>
                                                                    }
                                                                </div>
                                                            </div>
                                                            <div className='row'>
                                                                <div className='col-sm-7 col-md-7 col-lg-7'>
                                                                    <p className="mb-0 font-weight-bold">Maximum Loan Amount</p>
                                                                </div>
                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                </div>
                                                                <div className='col-sm-4 col-md-4 col-lg-4'>
                                                                    {
                                                                        this.state.maxloanamt ? <p className="mb-0">₹ {parseFloat(this.state.maxloanamt).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</p> :
                                                                            "0"
                                                                    }
                                                                </div>
                                                            </div>
                                                            <div className='row'>
                                                                <div className='col-sm-7 col-md-7 col-lg-7'>
                                                                    <p className="mb-0 font-weight-bold">Minimum Loan Amount</p>
                                                                </div>
                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                </div>
                                                                <div className='col-sm-4 col-md-4 col-lg-4'>
                                                                    {
                                                                        this.state.minloanamt ? <p className="mb-0">₹ {parseFloat(this.state.minloanamt).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</p> :
                                                                            "0"
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {/* <div className='row pl-2 pr-2 pb-2'>
                                                        {this.state.authorized1 == "1" ? null :
                                                            <div className='col-12 form-check' style={{ textAlign: "end" }}>
                                                                <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" onChange={this.authamt} />
                                                                <label class="form-check-label" for="flexCheckDefault" style={{ fontFamily: "Poppins,sans-serif", fontSize: "15px", color: "rgb(34, 44, 112)" }} >Authorise</label>
                                                            </div>
                                                        }
                                                    </div> */}
                                                </div>
                                            </div>

                                            <div className='card' style={{ cursor: "default" }}>
                                                <div className='form-group pl-2 pr-2 pt-2' >
                                                    <div className='row'>
                                                        <div className='col-10' id="" style={{ fontFamily: "Poppins,sans-serif", fontWeight: "bold", color: "#222c70", fontSize: "15px" }}>
                                                            <img src={prodAttr} style={{ marginTop: "-6px", width: "15px", marginLeft: "1px" }} />&nbsp;<span>Funding Information</span>
                                                            <hr style={{ marginTop: "1px", backgroundColor: "rgba(4,78,160,1)" }} />
                                                        </div>
                                                        <div className='col-2' style={{ textAlign: "end" }}>

                                                            {/* {productAuth == 0 ? <button className='btn btn-sm' onClick={this.setproductdefFund}
                                                                style={{ border: "2px solid #0079bf", marginTop: "-8px", color: "#0079bf" }}><FaIcons.FaEdit style={{ marginTop: "-4px" }} />&nbsp;<span>Edit</span></button>
                                                                : null} */}
                                                        </div>
                                                    </div>

                                                    <div className='row pl-2 pr-2 pb-2'>
                                                        <div className='col' style={{ color: "#222c70", fontSize: "14px" }}>
                                                            <div className='row'>
                                                                <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                    <p className="mb-0 font-weight-bold">Maximum Funding Investor</p>
                                                                </div>
                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                </div>
                                                                <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                    <p className="mb-0">{this.state.maxfundinginvestor}</p>
                                                                </div>
                                                            </div>
                                                            <div className='row'>
                                                                <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                    <p className="mb-0 font-weight-bold">Authorise</p>
                                                                </div>
                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                </div>
                                                                <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                    {
                                                                        this.state.authorized2 == "0" ? <p className="mb-0">Not Authorised</p> : <p className="mb-0">Authorised</p>
                                                                    }

                                                                </div>
                                                            </div>
                                                            <div className='row'>
                                                                <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                    <p className="mb-0 font-weight-bold">Auto Investment Limit</p>
                                                                </div>
                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                </div>
                                                                <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                    <p className="mb-0">{this.state.autoinvestlimit}</p>
                                                                </div>
                                                            </div>
                                                            <div className='row'>
                                                                <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                    <p className="mb-0 font-weight-bold">Funding in multiples of</p>
                                                                </div>
                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                </div>
                                                                <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                    {
                                                                        this.state.fundinginmultiplesof ? <p className="mb-0">₹ {parseFloat(this.state.fundinginmultiplesof).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</p> :
                                                                            "0"
                                                                    }
                                                                </div>
                                                            </div>

                                                        </div>
                                                        <div className='col' style={{ color: "#222c70", fontSize: "14px" }}>
                                                            <div className='row'>
                                                                <div className='col-sm-7 col-md-7 col-lg-7'>
                                                                    <p className="mb-0 font-weight-bold">Minimum Auto-Funding Commit</p>
                                                                </div>
                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                </div>
                                                                <div className='col-sm-4 col-md-4 col-lg-4'>
                                                                    {
                                                                        this.state.minautofundingcommit ? <p className="mb-0">₹ {parseFloat(this.state.minautofundingcommit).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</p> :
                                                                            "0"
                                                                    }
                                                                </div>
                                                            </div>
                                                            <div className='row'>
                                                                <div className='col-sm-7 col-md-7 col-lg-7'>
                                                                    <p className="mb-0 font-weight-bold">Maximum Funding Commit</p>
                                                                </div>
                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                </div>
                                                                <div className='col-sm-4 col-md-4 col-lg-4'>
                                                                    <p className="mb-0">{this.state.maxfundingcommit}</p>
                                                                </div>
                                                            </div>
                                                            <div className='row'>
                                                                <div className='col-sm-7 col-md-7 col-lg-7'>
                                                                    <p className="mb-0 font-weight-bold">Minimum Funding Commit</p>
                                                                </div>
                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                </div>
                                                                <div className='col-sm-4 col-md-4 col-lg-4'>
                                                                    <p className="mb-0">{this.state.minfundingcommit}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {/* <div className='row pl-2 pr-2 pb-2'>
                                                        {this.state.authorized2 == 1 ? null :
                                                            <div className='col-12 form-check' style={{ textAlign: "end" }}>
                                                                <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" onChange={this.authfund} />
                                                                <label class="form-check-label" for="flexCheckDefault" style={{ fontFamily: "Poppins,sans-serif", fontSize: "15px", color: "rgb(34, 44, 112)" }} >Authorise</label>
                                                            </div>
                                                        }
                                                    </div> */}
                                                </div>
                                            </div>

                                            <div className='card' style={{ cursor: "default" }}>
                                                <div className='form-group pl-2 pr-2 pt-2'>
                                                    <div className='row'>
                                                        <div className='col-10' id="" style={{ fontFamily: "Poppins,sans-serif", fontWeight: "bold", color: "#222c70", fontSize: "15px" }}>
                                                            <img src={prodAttr} style={{ marginTop: "-6px", width: "15px", marginLeft: "1px" }} />&nbsp;<span>Grace Information</span>
                                                            <hr style={{ marginTop: "1px", backgroundColor: "rgba(4,78,160,1)" }} />
                                                        </div>
                                                        <div className='col-2' style={{ textAlign: "end" }}>

                                                            {/* {productAuth == 0 ? <button className='btn btn-sm' onClick={this.setproductdefGrace}
                                                                style={{ border: "2px solid #0079bf", marginTop: "-8px", color: "#0079bf" }}><FaIcons.FaEdit style={{ marginTop: "-4px" }} />&nbsp;<span>Edit</span></button>
                                                                : null} */}
                                                        </div>
                                                    </div>

                                                    <div className='row pl-2 pr-2 pb-2'>
                                                        <div className='col' style={{ color: "#222c70", fontSize: "14px" }}>
                                                            <div className='row'>
                                                                <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                    <p className="mb-0 font-weight-bold">ELC days grace</p>
                                                                </div>
                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                </div>
                                                                <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                    <p className="mb-0">{this.state.elcdaysgrace}</p>
                                                                </div>
                                                            </div>
                                                            <div className='row'>
                                                                <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                    <p className="mb-0 font-weight-bold">Authorise</p>
                                                                </div>
                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                </div>
                                                                <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                    {
                                                                        this.state.authorized3 == "0" ? <p className="mb-0">Not Authorised</p> : <p className="mb-0">Authorised</p>
                                                                    }

                                                                </div>
                                                            </div>
                                                            <div className='row'>
                                                                <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                    <p className="mb-0 font-weight-bold">Grace days on arrears</p>
                                                                </div>
                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                </div>
                                                                <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                    <p className="mb-0">{this.state.gracedaysonarrears}</p>
                                                                </div>
                                                            </div>
                                                            <div className='row'>
                                                                <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                    <p className="mb-0 font-weight-bold">Grace days intial payment</p>
                                                                </div>
                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                </div>
                                                                <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                    <p className="mb-0">{this.state.gracedaysintpayment}</p>
                                                                </div>
                                                            </div>
                                                            <div className='row'>
                                                                <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                    <p className="mb-0 font-weight-bold">Over due days before NPA</p>
                                                                </div>
                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                </div>
                                                                <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                    <p className="mb-0">{this.state.overduedaysbeforenpa}</p>
                                                                </div>
                                                            </div>

                                                        </div>
                                                        <div className='col' style={{ color: "#222c70", fontSize: "14px" }}>
                                                            <div className='row'>
                                                                <div className='col-sm-7 col-md-7 col-lg-7'>
                                                                    <p className="mb-0 font-weight-bold">Grace days principal payment</p>
                                                                </div>
                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                </div>
                                                                <div className='col-sm-4 col-md-4 col-lg-4'>
                                                                    <p className="mb-0">{this.state.gracedaysprincpayment}</p>
                                                                </div>
                                                            </div>
                                                            <div className='row'>
                                                                <div className='col-sm-7 col-md-7 col-lg-7'>
                                                                    <p className="mb-0 font-weight-bold">Grace days penal interest</p>
                                                                </div>
                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                </div>
                                                                <div className='col-sm-4 col-md-4 col-lg-4'>
                                                                    <p className="mb-0">{this.state.gracedayspenalinterest}</p>
                                                                </div>
                                                            </div>
                                                            <div className='row'>
                                                                <div className='col-sm-7 col-md-7 col-lg-7'>
                                                                    <p className="mb-0 font-weight-bold">Late Penalty Frequency</p>
                                                                </div>
                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                </div>
                                                                <div className='col-sm-4 col-md-4 col-lg-4'>
                                                                    <p className="mb-0">{this.state.latepenaltyfrequency}</p>
                                                                </div>
                                                            </div>
                                                            <div className='row'>
                                                                <div className='col-sm-7 col-md-7 col-lg-7'>
                                                                    <p className="mb-0 font-weight-bold">Arrears Tolerance Amount</p>
                                                                </div>
                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                </div>
                                                                <div className='col-sm-4 col-md-4 col-lg-4'>
                                                                    {
                                                                        this.state.arrearstoleranceamount ? <p className="mb-0">₹ {parseFloat(this.state.arrearstoleranceamount).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</p> :
                                                                            "0"
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {/* <div className='row pl-2 pr-2 pb-2'>
                                                        {this.state.authorized3 == 1 ? null :
                                                            <div className='col-12 form-check' style={{ textAlign: "end" }}>
                                                                <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" onChange={this.authgrace} />
                                                                <label class="form-check-label" for="flexCheckDefault" style={{ fontFamily: "Poppins,sans-serif", fontSize: "15px", color: "rgb(34, 44, 112)" }} >Authorise</label>
                                                            </div>
                                                        }
                                                    </div> */}
                                                </div>
                                            </div>

                                            <div className='card' style={{ cursor: "default" }}>
                                                <div className='form-group pl-2 pr-2 pt-2'>
                                                    <div className='row'>
                                                        <div className='col-10' id="" style={{ fontFamily: "Poppins,sans-serif", fontWeight: "bold", color: "#222c70", fontSize: "15px" }}>
                                                            <img src={prodAttr} style={{ marginTop: "-6px", width: "15px", marginLeft: "1px" }} />&nbsp;<span>Interest Information</span>
                                                            <hr style={{ marginTop: "1px", backgroundColor: "rgba(4,78,160,1)" }} />
                                                        </div>
                                                        <div className='col-2' style={{ textAlign: "end" }}>

                                                            {/* {productAuth == 0 ? <button className='btn btn-sm' onClick={this.setproductdefInterest}
                                                                style={{ border: "2px solid #0079bf", marginTop: "-8px", color: "#0079bf" }}><FaIcons.FaEdit style={{ marginTop: "-4px" }} />&nbsp;<span>Edit</span></button>
                                                                : null} */}
                                                        </div>
                                                    </div>

                                                    <div className='row pl-2 pr-2 pb-2'>
                                                        <div className='col' style={{ color: "#222c70", fontSize: "14px" }}>
                                                            <div className='row'>
                                                                <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                    <p className="mb-0 font-weight-bold">Interest Frequency</p>
                                                                </div>
                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                </div>
                                                                <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                    <p className="mb-0">{this.state.interestpostingfrequency}</p>
                                                                </div>
                                                            </div>
                                                            <div className='row'>
                                                                <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                    <p className="mb-0 font-weight-bold">Authorise</p>
                                                                </div>
                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                </div>
                                                                <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                    {
                                                                        this.state.authorized4 == "0" ? <p className="mb-0">Not Authorised</p> : <p className="mb-0">Authorised</p>
                                                                    }

                                                                </div>
                                                            </div>
                                                            <div className='row'>
                                                                <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                    <p className="mb-0 font-weight-bold">Penal Interest Rate</p>
                                                                </div>
                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                </div>
                                                                <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                    <p className="mb-0">{this.state.penalintrate}</p>
                                                                </div>
                                                            </div>
                                                            <div className='row'>
                                                                <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                    <p className="mb-0 font-weight-bold">Interest Period</p>
                                                                </div>
                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                </div>
                                                                <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                    <p className="mb-0">{this.state.interestaccrualperiod}</p>
                                                                </div>
                                                            </div>
                                                            <div className='row'>
                                                                <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                    <p className="mb-0 font-weight-bold">Interest Rate Period</p>
                                                                </div>
                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                </div>
                                                                <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                    <p className="mb-0">{this.state.interestrateperiod}</p>
                                                                </div>
                                                            </div>
                                                            <div className='row'>
                                                                <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                    <p className="mb-0 font-weight-bold">Allow partial period interest calculation</p>
                                                                </div>
                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                </div>
                                                                <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                    {
                                                                        this.state.allowpartialperiodintcalc == "0" ? <p className="mb-0">Not Allowed</p> : <p className="mb-0">Allowed</p>
                                                                    }
                                                                </div>
                                                            </div>
                                                            <div className='row'>
                                                                <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                    <p className="mb-0 font-weight-bold">Over Due Grace Amount</p>
                                                                </div>
                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                </div>
                                                                <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                    {
                                                                        this.state.overduegraceamt ? <p className="mb-0">₹ {parseFloat(this.state.overduegraceamt).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</p> :
                                                                            "0"
                                                                    }
                                                                </div>
                                                            </div>
                                                            <div className='row'>
                                                                <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                    <p className="mb-0 font-weight-bold">Teaser Interest Start Date</p>
                                                                </div>
                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                </div>
                                                                <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                    <p className="mb-0">{this.state.teaserintstdate}</p>
                                                                </div>
                                                            </div>
                                                            <div className='row'>
                                                                <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                    <p className="mb-0 font-weight-bold">Teaser Interest End Date</p>
                                                                </div>
                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                </div>
                                                                <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                    <p className="mb-0">{this.state.teaserintenddate}</p>
                                                                </div>
                                                            </div>

                                                        </div>
                                                        <div className='col' style={{ color: "#222c70", fontSize: "14px" }}>
                                                            <div className='row'>
                                                                <div className='col-sm-7 col-md-7 col-lg-7'>
                                                                    <p className="mb-0 font-weight-bold">Interest Call Method</p>
                                                                </div>
                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                </div>
                                                                <div className='col-sm-4 col-md-4 col-lg-4'>
                                                                    <p className="mb-0">{this.state.interestcalmethod}</p>
                                                                </div>
                                                            </div>
                                                            <div className='row'>
                                                                <div className='col-sm-7 col-md-7 col-lg-7'>
                                                                    <p className="mb-0 font-weight-bold">Teaser Interest Rate Allowed</p>
                                                                </div>
                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                </div>
                                                                <div className='col-sm-4 col-md-4 col-lg-4'>
                                                                    <p className="mb-0">{this.state.teaserintrateallowed}</p>
                                                                </div>
                                                            </div>
                                                            <div className='row'>
                                                                <div className='col-sm-7 col-md-7 col-lg-7'>
                                                                    <p className="mb-0 font-weight-bold">Variable Interest Base</p>
                                                                </div>
                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                </div>
                                                                <div className='col-sm-4 col-md-4 col-lg-4'>
                                                                    <p className="mb-0">{this.state.variableintbase}</p>
                                                                </div>
                                                            </div>
                                                            <div className='row'>
                                                                <div className='col-sm-7 col-md-7 col-lg-7'>
                                                                    <p className="mb-0 font-weight-bold">Minimum Interest Rate</p>
                                                                </div>
                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                </div>
                                                                <div className='col-sm-4 col-md-4 col-lg-4'>
                                                                    <p className="mb-0">{this.state.mininterestrate}</p>
                                                                </div>



                                                            </div>
                                                            <div className='row'>
                                                                <div className='col-sm-7 col-md-7 col-lg-7'>
                                                                    <p className="mb-0 font-weight-bold">Maximum Interest Rate</p>
                                                                </div>
                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                </div>
                                                                <div className='col-sm-4 col-md-4 col-lg-4'>
                                                                    <p className="mb-0">{this.state.maxinterestrate}</p>
                                                                </div>
                                                            </div>
                                                            <div className='row'>
                                                                <div className='col-sm-7 col-md-7 col-lg-7'>
                                                                    <p className="mb-0 font-weight-bold">Interest Method</p>
                                                                </div>
                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                </div>
                                                                <div className='col-sm-4 col-md-4 col-lg-4'>
                                                                    <p className="mb-0">{this.state.interestmethod}</p>
                                                                </div>
                                                            </div>
                                                            <div className='row'>
                                                                <div className='col-sm-7 col-md-7 col-lg-7'>
                                                                    <p className="mb-0 font-weight-bold">Teaser Interest Rate</p>
                                                                </div>
                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                </div>
                                                                <div className='col-sm-4 col-md-4 col-lg-4'>
                                                                    <p className="mb-0">{this.state.teaserinterestrate}</p>
                                                                </div>
                                                            </div>
                                                            <div className='row'>
                                                                <div className='col-sm-7 col-md-7 col-lg-7'>
                                                                    <p className="mb-0 font-weight-bold">Interest Type</p>
                                                                </div>
                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                </div>
                                                                <div className='col-sm-4 col-md-4 col-lg-4'>
                                                                    <p className="mb-0">{this.state.interesttype}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    {/* <div className='row pl-2 pr-2 pb-2'>
                                                        {this.state.authorized4 == 1 ? null :
                                                            <div className='col-12 form-check' style={{ textAlign: "end" }}>
                                                                <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" onChange={this.authint} />
                                                                <label class="form-check-label" for="flexCheckDefault" style={{ fontFamily: "Poppins,sans-serif", fontSize: "15px", color: "rgb(34, 44, 112)" }} >Authorise</label>
                                                            </div>
                                                        }
                                                    </div> */}
                                                </div>
                                            </div>

                                            <div className='card' style={{ cursor: "default" }}>
                                                <div className='form-group pl-2 pr-2 pt-2'>
                                                    <div className='row'>
                                                        <div className='col-10' id="" style={{ fontFamily: "Poppins,sans-serif", fontWeight: "bold", color: "#222c70", fontSize: "15px" }}>
                                                            <img src={prodAttr} style={{ marginTop: "-6px", width: "15px", marginLeft: "1px" }} />&nbsp;<span>Repayment Information</span>
                                                            <hr style={{ marginTop: "1px", backgroundColor: "rgba(4,78,160,1)" }} />
                                                        </div>
                                                        <div className='col-2' style={{ textAlign: "end" }}>

                                                            {/* {productAuth == 0 ? <button className='btn btn-sm' onClick={this.setproductdefRepayment}
                                                                style={{ border: "2px solid #0079bf", marginTop: "-8px", color: "#0079bf" }}><FaIcons.FaEdit style={{ marginTop: "-4px" }} />&nbsp;<span>Edit</span></button>
                                                                : null} */}
                                                        </div>
                                                    </div>

                                                    <div className='row pl-2 pr-2 pb-2'>
                                                        <div className='col' style={{ color: "#222c70", fontSize: "14px" }}>
                                                            <div className='row'>
                                                                <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                    <p className="mb-0 font-weight-bold">Partial pre payment allowed</p>
                                                                </div>
                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                </div>
                                                                <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                    {
                                                                        this.state.partialprepaymentallowed == "0" ? <p className="mb-0">Not Allowed</p> : <p className="mb-0">Allowed</p>
                                                                    }
                                                                </div>
                                                            </div>
                                                            <div className='row'>
                                                                <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                    <p className="mb-0 font-weight-bold">Authorise</p>
                                                                </div>
                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                </div>
                                                                <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                    {
                                                                        this.state.authorized5 == "0" ? <p className="mb-0">Not Authorised</p> : <p className="mb-0">Authorised</p>
                                                                    }

                                                                </div>
                                                            </div>
                                                            <div className='row'>
                                                                <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                    <p className="mb-0 font-weight-bold">Minimum days before first installments</p>
                                                                </div>
                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                </div>
                                                                <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                    <p className="mb-0">{this.state.mindaysbeforefirstinst}</p>
                                                                </div>
                                                            </div>
                                                            <div className='row'>
                                                                <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                    <p className="mb-0 font-weight-bold">Allow installments</p>
                                                                </div>
                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                </div>
                                                                <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                    {
                                                                        this.state.allowvarinstallments == "0" ? <p className="mb-0">Not Allowed</p> : <p className="mb-0">Allowed</p>
                                                                    }
                                                                </div>
                                                            </div>
                                                            <div className='row'>
                                                                <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                    <p className="mb-0 font-weight-bold">Minimum no of repayments</p>
                                                                </div>
                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                </div>
                                                                <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                    <p className="mb-0">{this.state.minnoofrepayments}</p>
                                                                </div>
                                                            </div>
                                                            <div className='row'>
                                                                <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                    <p className="mb-0 font-weight-bold">EPI multiple</p>
                                                                </div>
                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                </div>
                                                                <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                    <p className="mb-0">{this.state.epimultiple}</p>
                                                                </div>
                                                            </div>


                                                        </div>
                                                        <div className='col' style={{ color: "#222c70", fontSize: "14px" }}>
                                                            <div className='row'>
                                                                <div className='col-sm-7 col-md-7 col-lg-7'>
                                                                    <p className="mb-0 font-weight-bold">Repayment Frequency</p>
                                                                </div>
                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                </div>
                                                                <div className='col-sm-4 col-md-4 col-lg-4'>
                                                                    <p className="mb-0">{this.state.repaymentfrequency}</p>
                                                                </div>
                                                            </div>
                                                            <div className='row'>
                                                                <div className='col-sm-7 col-md-7 col-lg-7'>
                                                                    <p className="mb-0 font-weight-bold">Sync with disburse date</p>
                                                                </div>
                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                </div>
                                                                <div className='col-sm-4 col-md-4 col-lg-4'>
                                                                    <p className="mb-0">{this.state.syncwithdisbursedate}</p>
                                                                </div>
                                                            </div>
                                                            <div className='row'>
                                                                <div className='col-sm-7 col-md-7 col-lg-7'>
                                                                    <p className="mb-0 font-weight-bold">No of repayments default</p>
                                                                </div>
                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                </div>
                                                                <div className='col-sm-4 col-md-4 col-lg-4'>
                                                                    <p className="mb-0">{this.state.noofrepaymentsdefault}</p>
                                                                </div>
                                                            </div>
                                                            <div className='row'>
                                                                <div className='col-sm-7 col-md-7 col-lg-7'>
                                                                    <p className="mb-0 font-weight-bold">Full prepaymnet allowed</p>
                                                                </div>
                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                </div>
                                                                <div className='col-sm-4 col-md-4 col-lg-4'>
                                                                    {
                                                                        this.state.fullprepaymentallowed == "0" ? <p className="mb-0">Not Allowed</p> : <p className="mb-0">Allowed</p>
                                                                    }
                                                                </div>
                                                            </div>
                                                            <div className='row'>
                                                                <div className='col-sm-7 col-md-7 col-lg-7'>
                                                                    <p className="mb-0 font-weight-bold">Principal threshold last interest</p>
                                                                </div>
                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                </div>
                                                                <div className='col-sm-4 col-md-4 col-lg-4'>
                                                                    <p className="mb-0">{this.state.princthresholdlastint}</p>
                                                                </div>
                                                            </div>
                                                            <div className='row'>
                                                                <div className='col-sm-7 col-md-7 col-lg-7'>
                                                                    <p className="mb-0 font-weight-bold">Maximum no of repayments</p>
                                                                </div>
                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                </div>
                                                                <div className='col-sm-4 col-md-4 col-lg-4'>
                                                                    <p className="mb-0">{this.state.maxnoofrepayments}</p>
                                                                </div>
                                                            </div>

                                                        </div>
                                                    </div>
                                                    {/* <div className='row pl-2 pr-2 pb-2'>
                                                        {this.state.authorized5 == 1 ? null :
                                                            <div className='col-12 form-check' style={{ textAlign: "end" }}>
                                                                <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" onChange={this.authrpf} />
                                                                <label class="form-check-label" for="flexCheckDefault" style={{ fontFamily: "Poppins,sans-serif", fontSize: "15px", color: "rgb(34, 44, 112)" }} >Authorise</label>
                                                            </div>
                                                        }
                                                    </div> */}
                                                </div>
                                            </div>

                                            <div className='card' style={{ cursor: "default" }}>
                                                <div className='form-group pl-2 pr-2 pt-2'>
                                                    <div className='row'>
                                                        <div className='col-8' id="" style={{ fontFamily: "Poppins,sans-serif", fontWeight: "bold", color: "#222c70", fontSize: "15px" }}>
                                                            <img src={prodAttr} style={{ marginTop: "-6px", width: "15px", marginLeft: "1px" }} />&nbsp;<span>Purpose Information</span>
                                                            <hr style={{ marginTop: "1px", backgroundColor: "rgba(4,78,160,1)" }} />
                                                        </div>
                                                        <div className='col-4' style={{ textAlign: "end" }}>

                                                            {/* {productAuth == 0 ?
                                                                <button className='btn btn-sm' onClick={this.getProductdefProductinfo} style={{ border: "2px solid #0079bf", marginTop: "-8px", color: "#0079bf" }}><FaIcons.FaPlusCircle style={{ marginTop: "-4px" }} />&nbsp;<span>Add Product Purpose</span></button>
                                                                : null} */}
                                                        </div>
                                                    </div>


                                                    <div className='row pl-2 pr-2 pb-2' style={{ marginTop: "-20px" }}>
                                                        {this.state.loanPurposeDefList.map((list, index) => {
                                                            return (
                                                                <div className='col-6' key={index} style={{ color: "#222c70", fontSize: "14px" }}>
                                                                    <div className='card' style={{ cursor: "default" }}>
                                                                        <div className='row pr-2'>
                                                                            <div className='col' style={{ textAlign: "end" }}>
                                                                                <button className='btn btn-sm' onClick={this.authorizeProduct.bind(this, list.loanpurposeid)} style={{ border: "2px solid #0079bf", color: "#0079bf", cursor: "pointer" }}>
                                                                                    <FaIcons.FaRegEdit style={{ marginTop: "-4px" }} />&nbsp;<span>Authorise</span></button>
                                                                            </div>
                                                                        </div>
                                                                        <div className='row'>
                                                                            <div className='col-sm-4 col-md-4 col-lg-4'>
                                                                                <p className="mb-0 font-weight-bold">Loan Purpose</p>
                                                                            </div>
                                                                            <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                                <p className="mb-0 font-weight-bold">:</p>
                                                                            </div>
                                                                            <div className='col-sm-7 col-md-7 col-lg-7'>
                                                                                <p className="mb-0">{list.loanpurpose}</p>
                                                                            </div>
                                                                        </div>
                                                                        <div className='row'>
                                                                            <div className='col-sm-4 col-md-4 col-lg-4'>
                                                                                <p className="mb-0 font-weight-bold">Authorise</p>
                                                                            </div>
                                                                            <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                                <p className="mb-0 font-weight-bold">:</p>
                                                                            </div>
                                                                            <div className='col-sm-7 col-md-7 col-lg-7'>
                                                                                {list.authorized == "0" ? <p className="mb-0">Not Authorised</p> : <p className="mb-0">Authorised</p>}

                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                    {/* <div className='row pl-2 pr-2 pb-2'>
                                                        {productAuth == 1 ? null :
                                                            <div className='col-12 form-check' style={{ textAlign: "end" }}>
                                                                <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" onChange={this.authpurp} />
                                                                <label class="form-check-label" for="flexCheckDefault" style={{ fontFamily: "Poppins,sans-serif", fontSize: "15px", color: "rgb(34, 44, 112)" }} >Authorise</label>
                                                            </div>
                                                        }
                                                    </div> */}
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Add Product Purpose */}
                    <button type="button" id='addProductPurpose' style={{ display: "none" }} class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter">
                        Add Product purpose modal
                    </button>
                    <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered" role="document">
                            <div class="modal-content">
                                <div class="modal-body">
                                    <div className='row'>
                                        <div className='col' style={{}}>
                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold", paddingLeft: "10px" }}><img src={editRole} width="25px" />Edit Product Purpose</p>
                                            <hr style={{ width: "50px", marginTop: "-10px" }} />
                                            <div className='row mb-2'>
                                                <div className='col' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                    <p style={{ fontWeight: "500" }}>Product ID</p>
                                                    <input type="text" className="form-control" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px", textTransform: 'uppercase' }}
                                                        id="inputAddress" placeholder={t('Enter Product ID')} onChange={this.productid} value={this.state.productid}
                                                    />
                                                    {/* <select className="form-select border border-secondary" style={{ marginTop: "-5px", color: "RGBA(5,54,82,1)" }}
                                                        onChange={this.productid}>
                                                        <option defaultValue>{t('----Please Select----')}</option>
                                                        {this.state.productList.map((product, index) => (
                                                            <option key={index} value={product.productid} >{product.productid} </option>
                                                        ))
                                                        }
                                                    </select> */}
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className='col' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                    <p style={{ fontWeight: "500" }}>Loan Purpose</p>
                                                    <select className="form-select border border-secondary" style={{ marginTop: "-5px", color: "RGBA(5,54,82,1)" }}
                                                        onChange={this.productPurpose}>
                                                        <option defaultValue>{t('----Please Select----')}</option>
                                                        {this.state.loanPurposeDefList.map((purpose, index) => (
                                                            <option key={index} value={purpose.loanpurposeid} >{purpose.loanpurpose} </option>
                                                        ))
                                                        }
                                                    </select>
                                                </div>
                                            </div>
                                            <hr style={{ backgroundColor: "rgba(5,54,82,1)" }} />
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col' style={{ textAlign: "center" }}>
                                            <button type="button" class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.setProductPurpose}>Edit</button>&nbsp;
                                            <button type="button" class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "#0079BF" }} onClick={this.cancelProductPurpose}>Cancel</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* edit Product purpose */}
                    <button type="button" id='setProductPurpose' style={{ display: "none" }} class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter2">
                        Set Product Purpose
                    </button>
                    <div class="modal fade" id="exampleModalCenter2" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered" role="document">
                            <div class="modal-content">
                                <div class="modal-body">
                                    <div className='row'>
                                        <div className='col' style={{}}>
                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold", paddingLeft: "10px" }}><img src={editRole} width="25px" />Authorize Product Purpose</p>
                                            <hr style={{ width: "50px", marginTop: "-10px" }} />
                                            <div className='row mb-2'>
                                                <div className='col' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                    <p style={{ fontWeight: "500" }}>Product ID</p>
                                                    <input type="text" class="form-control" value={prodID}
                                                        placeholder="Name" style={{ height: "38px", color: "rgb(5, 54, 82)", marginTop: "-10px" }} />
                                                </div>
                                            </div>
                                            {/* <div className='row mb-2'>
                                                <div className='col' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                    <p style={{ fontWeight: "500" }}>Loan Purpose Id</p>
                                                    <input type="text" class="form-control" value={loanpurposeID}
                                                        placeholder="Name" style={{ height: "38px", color: "rgb(5, 54, 82)", marginTop: "-10px" }} />
                                                </div>
                                            </div> */}
                                            <hr style={{ backgroundColor: "rgba(5,54,82,1)" }} />
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col' style={{ textAlign: "center" }}>
                                            <button type="button" class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.authorizeProductpurpose}>Edit</button>&nbsp;
                                            <button type="button" class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "#0079BF" }} onClick={this.cancelAuth}>Close</button>
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

export default withTranslation()(ProductAttributes)