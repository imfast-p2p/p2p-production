import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { BASEURL } from '../assets/baseURL';
import LenderSidebar from '../../SidebarFiles/LenderSidebar';
import $ from 'jquery';
import './LoanListing.css';
import Rupees from '../assets/Rupees.png';
import Rupees1 from '../assets/Rupees1.png';
import { withTranslation } from 'react-i18next';
import { FaThumbsUp, FaMoneyBill, FaAngleDoubleDown, FaRegFileAlt, FaAngleLeft, FaUserCheck } from 'react-icons/fa';
import dashboardIcon from '../assets/icon_dashboard.png';
import batch from '../assets/batch.png';
import { confirmAlert } from "react-confirm-alert";
import { BsArrowRepeat, BsInfoCircle } from "react-icons/bs";
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import Loader from '../Loader/Loader';

// import '../Borrower/ConsentModal.css';
//updated
var loanlistingno;
var fundingAmt;
var consentData;
var consentID;
var consentType;
var consentStatus;

class LoanListing extends Component {
    constructor(props) {
        super(props)
        this.state = {
            type: "2",
            sortfield: "interest",
            sortby: "asc",
            riskrating: "all",
            producttype: "all",
            interestrate: "0",
            enablepreference: "0",
            preferencetype: "",
            loanList: [],
            loanlistno: [],
            productList: [],
            loanDetails: [],
            productid: "",
            date: "06-07-1991",

            MPin: "",
            mpinMOtp: "",
            pinStatus: "",
            txnflag: "",

            consentMode: "",
            consentOtp: "",
            consentMRef: "",
            consentData: "",
            verificationStatus: [],

            isBounceToBottom: true,
            updatedEMI: 0,
            checkedOne: "1",
            resMsg: "",

            txnOtp: "",
            txnMobReg: "",
            showModal: false,
            showLoader: false,
        }

        this.type = this.type.bind(this);
        this.sortfield = this.sortfield.bind(this);
        this.sortby = this.sortby.bind(this);
        this.riskrating = this.riskrating.bind(this);
        this.producttype = this.producttype.bind(this);
        this.enablepreference = this.enablepreference.bind(this);
        this.preferencetype = this.preferencetype.bind(this);
        this.loanListing = this.loanListing.bind(this);
        this.commitFund = this.commitFund.bind(this);
        this.getLoanFundings = this.getLoanFundings.bind(this);
        this.getListedLoanDetails = this.getListedLoanDetails.bind(this);
        this.getProductList = this.getProductList.bind(this);
        this.productid = this.productid.bind(this);
        this.interestrate = this.interestrate.bind(this);
    }

    type(event) {
        this.setState({ type: event.target.value })
    }
    interestrate(event) {
        this.setState({ interestrate: event.target.value })
    }
    productid(event) {
        this.setState({ productid: event.target.value })
    }
    sortfield(event) {
        this.setState({ sortfield: event.target.value })
    }
    sortby(event) {
        this.setState({ sortby: event.target.value })
    }
    fundAmount(event, i, emiamt, amt, listingno) {
        // const loanList = this.state.loanList;
        // loanList[i].investAmount = event.target.value;
        // this.setState({ loanList: loanList })
        this.reset(event.target.value, i);

        console.log(emiamt, amt);
        console.log(event.target.value)
        var calculate = (emiamt / amt) * event.target.value;
        console.log(calculate);
        this.setState({ updatedEMI: calculate });
        this.setState({ checkListingNo: listingno })
    }
    riskrating(event) {
        this.setState({ riskrating: event.target.value });
    }
    producttype(event) {
        this.setState({ producttype: event.target.value });
    }
    enablepreference(event) {
        this.setState({ enablepreference: event.target.value });
    }
    preferencetype(event) {
        this.setState({ preferencetype: event.target.value });
    }

    getProductList() {
        fetch(BASEURL + '/lsp/getloanproductlist', {
            headers: {
                'Authorization': "Bearer " + sessionStorage.getItem('token'),
            }
        }).then((Response) => {
            return Response.json();
        })
            .then((resdata) => {
                if (resdata.status == 'SUCCESS') {
                    console.log(resdata);
                    this.setState({
                        productList: resdata.msgdata
                    })
                    console.log(this.state.productList)

                    this.setState({
                        productList: this.state.productList.map((pdata) => {
                            console.log(pdata)
                            return pdata;
                        })
                    })
                    this.setState({ productid: resdata.msgdata[0] });
                    console.log(this.state.productid)



                } else {
                    // alert("Issue: " + resdata.message);
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }
    //Consent Type
    getGroupInfo() {
        fetch(BASEURL + '/configuration/getgroupinfo', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                groupnames: ["CONSENT-DATA"]
            })
        }).then((Response) => Response.json())
            .then((resdata) => {
                if (resdata.status === 'Success') {
                    //this.setState({ grpInfo: resdata.data.CONSENT-DATA })
                    var GroupInfo = resdata.data["CONSENT-DATA"];
                    console.log(GroupInfo);

                    GroupInfo.forEach(element => {
                        console.log(element);
                        console.log(element.attributename)
                        console.log(element.attributeoptions)
                        if (element.attributename == "COMMITFUND") {
                            console.log(element.attributeoptions);
                            var mapattriOpt = element.attributeoptions;
                            console.log(mapattriOpt);
                            mapattriOpt.map((options, index) => {
                                consentData = options.consentdata;
                                consentID = options.consentid;
                                consentType = options.consenttype;
                                consentStatus = options.status;

                                // this.setState({consentData:options.consentdata})
                                console.log(consentData, consentID, consentType, consentStatus)
                            })

                            // let originalString = consentData;
                            // let sentences = originalString.split('. ');
                            // modifiedString = sentences.map(sentence => `.${sentence}`).join('.\n');
                            console.log(consentData, consentID, consentType, consentStatus)
                        }
                    })
                } else {
                    // alert(resdata.message);
                }
            })
    }
    changeConsentType = (e) => {
        const consentType = e.target.checked;
        if (consentType == true) {
            this.setState({ consentMode: "1" });
        } else if (consentType == false) {
            this.setState({ consentMode: "" });
        }
        console.log(e.target.checked, this.state.consentMode);
    }
    getconsentOtp = () => {
        fetch(BASEURL + '/usrmgmt/getconsentotp', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                consenttype: consentType
            })
        }).then((Response) => Response.json())
            .then((resdata) => {
                if (resdata.status === 'Success') {
                    console.log(resdata.message);
                    var mobRef = resdata.msgdata.mobileref;
                    this.setState({ consentMRef: mobRef });
                } else {
                    alert(resdata.message);
                }
            })
    }
    isFundingAmountZeroOrEmpty = (fundingAmount) => {
        return fundingAmount === 0 || fundingAmount === "" || fundingAmount === null || fundingAmount === undefined;
    }
    commitStart = (l, i) => {
        loanlistingno = l.listingno;
        fundingAmt = this.state.loanList[i].investAmount;
        console.log(loanlistingno, fundingAmt)
        if (!this.isFundingAmountZeroOrEmpty(fundingAmt)) {
            $("#consentModal").click();
        } else {
            // Handle the case where fundingAmt is 0 or empty
            console.log("Funding amount is 0 or empty. Action not performed.");
            this.setState({ resMsg: "Please enter amount and try again." })
            $("#commonModal").click()
        }

    }
    setuserConsent = () => {
        fetch(BASEURL + '/usrmgmt/setuserconsent', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                consenttype: consentType,
                consentmode: this.state.consentMode,
                consentdata: consentData,
            })
        }).then((Response) => Response.json())
            .then((resdata) => {
                if (resdata.status == 'Success') {
                    console.log(resdata.message)
                    $("#exampleModalCenter").modal('hide');
                    this.commitFund();
                } else {
                    $("#exampleModalCenter").modal('hide');
                    this.setState({ resMsg: resdata.message })
                    $("#commonModal").click()
                }
            })
    }

    //PIN
    mpin = (e) => {
        this.setState({ MPin: e.target.value })
    }
    commitFund() {
        console.log(this.state.pinStatus)
        if (this.state.pinStatus == 1) {
            $("#pinModal").click();
            $("#transactionPinBody").show();
            // $("#consentBody").hide();
        } else if (this.state.pinStatus == 2) {
            this.txnOtpCommit()
        }
        else {
            //this.commitFunding(loanlistingno, fundingAmt)
            var data;
            var data2;
            var data3;

            data = JSON.stringify({
                loanlistingnumber: loanlistingno,
                lenderid: sessionStorage.getItem('userID'),
                fundingamt: fundingAmt,
                txnpin: this.state.MPin
            })
            data2 = JSON.stringify({
                loanlistingnumber: loanlistingno,
                lenderid: sessionStorage.getItem('userID'),
                fundingamt: fundingAmt
            })
            data3 = JSON.stringify({
                loanlistingnumber: loanlistingno,
                lenderid: sessionStorage.getItem('userID'),
                fundingamt: fundingAmt,
            })
            // var result = this.state.txnflag == 1 ? data : data2
            var result;
            if (this.state.txnflag == 1) {
                result = data;
            } else if (this.state.txnflag == 2) {
                result = data3;
            } else {
                result = data2;
            }
            fetch(BASEURL + '/lms/commitfunding', {
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
                    // this.state.loanList[i].investAmount = "";
                    //this.reset("", i);
                    if (resdata.status === 'Success' || resdata.status === 'SUCCESS') {
                        console.log(resdata);
                        $("#exampleModalCenter61").hide();
                        this.setState({ resMsg: "Amount Committed Successfully" })
                        $("#commonModal").click()
                        // this.reset();
                    } else {
                        $("#exampleModalCenter61").hide();
                        this.setState({ resMsg: resdata.message })
                        $("#commonModal").click()
                    }
                })
        }
    }
    txnOtpCommit = () => {
        fetch(BASEURL + '/lms/commitfunding', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                loanlistingnumber: loanlistingno,
                lenderid: sessionStorage.getItem('userID'),
                fundingamt: fundingAmt,
            })
        }).then(response => {
            console.log('Response:', response)
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata);
                if (resdata.status == 'SUCCESS') {
                    console.log(resdata, resdata.msgdata.mobileref);
                    this.setState({ txnMobReg: resdata.msgdata.mobileref })
                    console.log(this.state.txnMobReg)
                    $("#pinModal").click();
                    $("#otpTxnBody").show();
                    $("#consentBody").hide();
                } else {
                    $("#exampleModalCenter").hide();
                    this.setState({ resMsg: resdata.message })
                    $("#commonModal").click()
                }
            })
    }
    txnOtp = (event) => {
        this.setState({ txnOtp: event.target.value })
    }
    commitFunding = () => {
        console.log(loanlistingno, fundingAmt)
        var data;
        var data2;
        var data3;

        data = JSON.stringify({
            loanlistingnumber: loanlistingno,
            lenderid: sessionStorage.getItem('userID'),
            fundingamt: fundingAmt,
            txnpin: this.state.MPin
        })
        data2 = JSON.stringify({
            loanlistingnumber: loanlistingno,
            lenderid: sessionStorage.getItem('userID'),
            fundingamt: fundingAmt
        })
        data3 = JSON.stringify({
            loanlistingnumber: loanlistingno,
            lenderid: sessionStorage.getItem('userID'),
            fundingamt: fundingAmt,
            mobileotp: this.state.txnOtp,
            mobileref: this.state.txnMobReg
        })
        // var result = this.state.txnflag == 1 ? data : data2
        var result;
        if (this.state.txnflag == 1) {
            result = data;
            console.log(result)
        } else if (this.state.txnflag == 2) {
            result = data3;
            console.log(result)
        } else {
            result = data2;
            console.log(result)
        }

        fetch(BASEURL + '/lms/commitfunding', {
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
                // this.state.loanList[i].investAmount = "";
                //this.reset("", i);
                if (resdata.status == 'Success' || resdata.status == 'SUCCESS' || resdata.status == 'success') {
                    console.log(resdata);
                    $("#exampleModalCenter61").hide();
                    this.setState({ resMsg: "Amount Committed Successfully" })
                    $("#commonModal").click()
                    // this.reset();
                } else {
                    $("#exampleModalCenter61").hide();
                    this.setState({ resMsg: resdata.message })
                    $("#commonModal").click()
                }
            })
    }
    reset(value, i) {
        const loanList = this.state.loanList;
        loanList[i].investAmount = value;
        this.setState({ loanList: loanList })
    }

    loanListing(event) {
        const filterArray = [];
        if (this.state.riskrating != "all" && this.state.producttype != "all" && this.state.interestrate != "0") {
            filterArray.push({
                "riskrating": this.state.riskrating
            });
            filterArray.push({
                // "producttype": this.state.producttype
                "productid": this.state.producttype
            });
            filterArray.push({
                "interestrate": this.state.interestrate
            })
        }
        else if (this.state.riskrating != "all") {
            filterArray.push({
                "riskrating": this.state.riskrating
            });
        }
        else if (this.state.producttype != "all") {
            filterArray.push({
                // "producttype": this.state.producttype
                "productid": this.state.producttype
            });
        } else if (this.state.interestrate != "0") {
            filterArray.push({
                "interestrate": this.state.interestrate
            })
        }
        // const filterArray = [];
        // filterArray.push({
        //     "riskrating": this.state.riskrating
        // });
        // filterArray.push({
        //     "producttype": this.state.producttype
        // });
        this.setState({ showLoader: true })
        fetch(BASEURL + '/lms/getloanrequests', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                type: parseInt(this.state.type),
                sortfield: this.state.sortfield,
                sortby: this.state.sortby,
                filter: filterArray,
                enablepreference: parseInt(this.state.enablepreference),
                preferencetype: parseInt(this.state.preferencetype)
            })
        }).then((Response) => {

            console.log(Response);
            return Response.json();
        })
            .then((resdata) => {
                if (resdata.status === 'SUCCESS') {
                    // console.log(resdata);
                    this.setState({ showLoader: false })
                    const loanList = resdata.msgdata.map((loan, i) => {

                        loan.investAmount = "";
                        loan.showDetails = false;
                        return loan;

                    })
                    var list = resdata.msgdata;
                    list.sort((a, b) => {
                        return new Date(b.lastlistingdate).getTime() - new Date(a.lastlistingdate).getTime()
                    })
                    this.setState({ loanList: list })
                    //this.setState({ loanList: loanList });

                    const d = new Date();

                    const newdate = [d.getFullYear()] + "-" + ["0" + (d.getMonth() + 1)] + "-" + [d.getDate()];

                    this.setState({ date: newdate });

                    sessionStorage.setItem("noofBor", resdata.msgdata.length)
                    console.log(resdata.msgdata.length)


                } else {
                    if (resdata.code === '0102') {
                        this.setState({ showLoader: false })
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
                        this.setState({ showLoader: false })
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
                this.setState({ showLoader: false })
                console.log(error)
            })
    }

    getListedLoanDetails(lon) {
        fetch(BASEURL + '/lms/getlistedloandetails?loanlistingno=' + lon.listingno, {
            headers: {
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            }

        }).then(response => {
            console.log('Response:', response)
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata);
                if (resdata.status == 'SUCCESS') {
                    console.log(resdata);
                    this.setState({ loanDetails: resdata.msgdata.borattributes })
                    $('#mdetails').click();

                    this.setState({ verificationStatus: resdata.msgdata.verificationstatus })
                } else {
                    this.setState({
                        loanDetails: [],
                        verificationStatus: []
                    })
                    // alert(resdata.message);
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
    }

    getLoanFundings(li) {
        fetch(BASEURL + '/lms/getloanfundings', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                loanlistingno: li.listingno
            })
        }).then(response => {
            console.log('Response:', response)
            return response.json();

        })
            .then((resdata) => {
                if (resdata.status == 'SUCCESS') {
                    console.log(resdata);
                    this.setState({ loanlistno: resdata.msgdata });
                }
                else {
                    this.setState({ loanlistno: [] });
                }
            })
    }

    componentDidMount() {
        if (sessionStorage.getItem('isLogin') == "true") {
            this.loanListing();
            console.log(sessionStorage.getItem('token'));
            this.getProductList();
            this.getGroupInfo()
            this.setState({ pinStatus: sessionStorage.getItem("SisTxnPinEnabled") })
            this.setState({ txnflag: sessionStorage.getItem("SisTxnPinEnabled") })

        } else {
            window.location = '/login'
        }

    }

    onSelectList(loan, i) {
        this.getListedLoanDetails(loan)
        this.getLoanFundings(loan);
        // $('.P_Summery').toggle();
        const loanList = this.state.loanList;
        loanList[i].showDetails = !loanList[i].showDetails;
        this.setState({ loanList: loanList })
    }
    handleClick = () => {
        this.setState(prevState => ({
            isBounceToBottom: !prevState.isBounceToBottom
        }));
    }
    updateFlagEMI = (loan, listingno) => {
        this.setState(prevState => ({
            checkedOne: prevState.checkedOne === "1" ? "2" : "1"
        }));
        this.setState({ checkListingNo: listingno })
    }
    riskRatings = () => {
        $("#riskRatingModal").click()
    }
    reloadPage = () => {
        window.location.reload();
    }
    handleChange() {
        $('.text').toggle();
        $('#PImage').toggle();
        $('#Pinfo').toggle();
    }

    render() {
        console.log(consentData)
        const { t } = this.props
        const { isBounceToBottom } = this.state;
        const linkClass = isBounceToBottom ? "hvr-bounce-to-bottom" : "hvr-bounce-to-top";
        const buttonText = isBounceToBottom ? "Bounce To Bottom" : "Bounce To Top";
        return (
            <div className="container-dashboard d-flex flex-row" id="wrapper" style={{ marginTop: "-10px", backgroundColor: "#f4f7fc" }}>
                {
                    this.state.showLoader && <Loader />
                }
                <LenderSidebar />
                <div className="main-content" id="page-content-wrapper">
                    <div className="container-fluid row pt-2">
                        <div className="col-1" id='navRes1'>
                            <button style={{ marginLeft: "25px" }} onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className='col-4' id='navRes2' style={{ marginLeft: "20px", marginTop: "5px" }}>
                            <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                <Link to="/lenderdashboard">Home</Link> /Loan Listing</p>
                        </div>
                        <div className='col'>

                        </div>
                        <div className='col'>

                        </div>
                        <div className='col-3'>

                        </div>
                        <div className="col" id='navRes3'>
                            <button style={{ color: "white", height: "25px", width: "65px", border: "none", backgroundColor: "rgba(5,54,82,1)", borderRadius: "5px", marginLeft: "14px" }}>
                                <Link to="/lenderdashboard"><FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} /><span style={{ textDecoration: "none", color: "white" }}>Back</span></Link></button>
                        </div>
                    </div>
                    <hr className="col-11" style={{ marginLeft: "50px", marginTop: "-5px", width: "88.6%", backgroundColor: "rgba(4,78,160,1)" }} />
                    <div className='row' style={{ marginTop: "-14px" }}>
                        <div className="col">
                            <p className="d-flex justify-content-center" style={{ fontSize: "20px", fontWeight: "bold", color: "rgba(5,54,82,1)" }}>{t('LoanListing')}</p>
                        </div>
                    </div>

                    {/* Modal More Details */}
                    <button id='mdetails' style={{ display: "none", marginLeft: "67%" }} type="button" class="btn btn-info" data-toggle="modal" data-target=".bd-example-modal-lg">
                        Borrower Address Details
                    </button>
                    <div class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
                        <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
                            <div className="modal-content">
                                <div className="modal-body">
                                    <div className='row'>
                                        <div className='col'>
                                            <p className="font-weight-bold" style={{ color: "rgba(5,54,82,1)" }}><FaRegFileAlt style={{ fontSize: "25px" }} />Details</p>
                                            <hr style={{ width: "70px" }} />

                                            <p className="font-weight-bold" style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>Profile Details</p>
                                            <div className='card' style={{ marginTop: "-10px" }}>
                                                <div className='scrollbar' style={{ cursor: "default", overflowX: "hidden", height: "200px" }} >
                                                    <div className='row p-2'>
                                                        <div className='col' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                            {
                                                                this.state.loanDetails.map((attribute, index) => {
                                                                    return (
                                                                        <div key={index}>
                                                                            {
                                                                                attribute.attributetype == "Primary Profession" ?
                                                                                    <div className='row'>
                                                                                        <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                                            <p className="mb-0 font-weight-bold" style={{ width: "max-content" }}>{attribute.attributetype}</p>
                                                                                        </div>
                                                                                        <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                                            <p className="mb-0 font-weight-bold">:</p>
                                                                                        </div>
                                                                                        <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                                            <p className="mb-0">{attribute.attributevalue}</p>
                                                                                        </div>
                                                                                    </div> : null
                                                                            }
                                                                        </div>
                                                                    )
                                                                })
                                                            }
                                                            {
                                                                this.state.loanDetails.map((attribute, index) => {
                                                                    return (
                                                                        <div key={index}>
                                                                            {
                                                                                attribute.attributetype == "Secondary Profession" ?
                                                                                    <div className='row'>
                                                                                        <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                                            <p className="mb-0 font-weight-bold" style={{ width: "max-content" }}>{attribute.attributetype}</p>
                                                                                        </div>
                                                                                        <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                                            <p className="mb-0 font-weight-bold">:</p>
                                                                                        </div>
                                                                                        <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                                            <p className="mb-0">{attribute.attributevalue}</p>
                                                                                        </div>
                                                                                    </div> : null
                                                                            }
                                                                        </div>
                                                                    )
                                                                })
                                                            }
                                                            {
                                                                this.state.loanDetails.map((attribute, index) => {
                                                                    return (
                                                                        <div key={index}>
                                                                            {
                                                                                attribute.attributetype == "Income Range Group" ?
                                                                                    <div className='row'>
                                                                                        <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                                            <p className="mb-0 font-weight-bold">{attribute.attributetype}</p>
                                                                                        </div>
                                                                                        <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                                            <p className="mb-0 font-weight-bold">:</p>
                                                                                        </div>
                                                                                        <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                                            <p className="mb-0">{attribute.attributevalue}</p>
                                                                                        </div>
                                                                                    </div> : null
                                                                            }
                                                                        </div>
                                                                    )
                                                                })
                                                            }


                                                            {
                                                                this.state.loanDetails.map((attribute, index) => {
                                                                    return (
                                                                        <div key={index}>
                                                                            {
                                                                                attribute.attributetype == "Education" ?
                                                                                    <div className='row'>
                                                                                        <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                                            <p className="mb-0 font-weight-bold">{attribute.attributetype}</p>
                                                                                        </div>
                                                                                        <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                                            <p className="mb-0 font-weight-bold">:</p>
                                                                                        </div>
                                                                                        <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                                            <p className="mb-0">{attribute.attributevalue}</p>
                                                                                        </div>
                                                                                    </div> : null
                                                                            }
                                                                        </div>
                                                                    )
                                                                })
                                                            }

                                                            {
                                                                this.state.loanDetails.map((attribute, index) => {
                                                                    return (
                                                                        <div key={index}>
                                                                            {
                                                                                attribute.attributetype == "Residence Type" ?
                                                                                    <div className='row'>
                                                                                        <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                                            <p className="mb-0 font-weight-bold">{attribute.attributetype}</p>
                                                                                        </div>
                                                                                        <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                                            <p className="mb-0 font-weight-bold">:</p>
                                                                                        </div>
                                                                                        <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                                            <p className="mb-0">{attribute.attributevalue}</p>
                                                                                        </div>
                                                                                    </div> : null
                                                                            }
                                                                        </div>
                                                                    )
                                                                })
                                                            }

                                                            {
                                                                this.state.loanDetails.map((attribute, index) => {
                                                                    return (
                                                                        <div key={index}>
                                                                            {
                                                                                attribute.attributetype == "Account" ?
                                                                                    <div className='row'>
                                                                                        <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                                            <p className="mb-0 font-weight-bold">{attribute.attributetype}</p>
                                                                                        </div>
                                                                                        <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                                            <p className="mb-0 font-weight-bold">:</p>
                                                                                        </div>
                                                                                        <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                                            <p className="mb-0">{attribute.attributevalue}</p>
                                                                                        </div>
                                                                                    </div> : null
                                                                            }
                                                                        </div>
                                                                    )
                                                                })
                                                            }
                                                            {
                                                                this.state.loanDetails.map((attribute, index) => {
                                                                    return (
                                                                        <div key={index}>
                                                                            {
                                                                                attribute.attributetype == "Marital Status" ?
                                                                                    <div className='row'>
                                                                                        <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                                            <p className="mb-0 font-weight-bold">{attribute.attributetype}</p>
                                                                                        </div>
                                                                                        <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                                            <p className="mb-0 font-weight-bold">:</p>
                                                                                        </div>
                                                                                        <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                                            <p className="mb-0">{attribute.attributevalue}</p>
                                                                                        </div>
                                                                                    </div> : null
                                                                            }
                                                                        </div>
                                                                    )
                                                                })
                                                            }

                                                        </div>
                                                        <div className='col' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                            {
                                                                this.state.loanDetails.map((attribute, index) => {
                                                                    return (
                                                                        <div key={index}>
                                                                            {
                                                                                attribute.attributetype == "Relationship" ?
                                                                                    <div className='row'>
                                                                                        <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                                            <p className="mb-0 font-weight-bold">{attribute.attributetype}</p>
                                                                                        </div>
                                                                                        <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                                            <p className="mb-0 font-weight-bold">:</p>
                                                                                        </div>
                                                                                        <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                                            <p className="mb-0">{attribute.attributevalue}</p>
                                                                                        </div>
                                                                                    </div> : null
                                                                            }
                                                                        </div>
                                                                    )
                                                                })
                                                            }


                                                            {
                                                                this.state.loanDetails.map((attribute, index) => {
                                                                    return (
                                                                        <div key={index}>
                                                                            {
                                                                                attribute.attributetype == "Relation Reference Name" ?
                                                                                    <div className='row'>
                                                                                        <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                                            <p className="mb-0 font-weight-bold">{attribute.attributetype}</p>
                                                                                        </div>
                                                                                        <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                                            <p className="mb-0 font-weight-bold">:</p>
                                                                                        </div>
                                                                                        <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                                            <p className="mb-0">{attribute.attributevalue}</p>
                                                                                        </div>
                                                                                    </div> : null
                                                                            }
                                                                        </div>
                                                                    )
                                                                })
                                                            }

                                                            {
                                                                this.state.loanDetails.map((attribute, index) => {
                                                                    return (
                                                                        <div key={index}>
                                                                            {
                                                                                attribute.attributetype == "Land Holding" ?
                                                                                    <div className='row'>
                                                                                        <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                                            <p className="mb-0 font-weight-bold">{attribute.attributetype}</p>
                                                                                        </div>
                                                                                        <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                                            <p className="mb-0 font-weight-bold">:</p>
                                                                                        </div>
                                                                                        <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                                            <p className="mb-0">{attribute.attributevalue}</p>
                                                                                        </div>
                                                                                    </div> : null
                                                                            }
                                                                        </div>
                                                                    )
                                                                })
                                                            }


                                                            {
                                                                this.state.loanDetails.map((attribute, index) => {
                                                                    return (
                                                                        <div key={index}>
                                                                            {
                                                                                attribute.attributetype == "Age" ?
                                                                                    <div className='row'>
                                                                                        <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                                            <p className="mb-0 font-weight-bold">{attribute.attributetype}</p>
                                                                                        </div>
                                                                                        <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                                            <p className="mb-0 font-weight-bold">:</p>
                                                                                        </div>
                                                                                        <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                                            <p className="mb-0">{attribute.attributevalue}</p>
                                                                                        </div>
                                                                                    </div> : null
                                                                            }
                                                                        </div>
                                                                    )
                                                                })
                                                            }

                                                            {
                                                                this.state.loanDetails.map((attribute, index) => {
                                                                    return (
                                                                        <div key={index}>
                                                                            {
                                                                                attribute.attributetype == "Dependents" ?
                                                                                    <div className='row'>
                                                                                        <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                                            <p className="mb-0 font-weight-bold">{attribute.attributetype}</p>
                                                                                        </div>
                                                                                        <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                                            <p className="mb-0 font-weight-bold">:</p>
                                                                                        </div>
                                                                                        <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                                            <p className="mb-0">{attribute.attributevalue}</p>
                                                                                        </div>
                                                                                    </div> : null
                                                                            }
                                                                        </div>
                                                                    )
                                                                })
                                                            }

                                                            {
                                                                this.state.loanDetails.map((attribute, index) => {
                                                                    return (
                                                                        <div key={index}>
                                                                            {
                                                                                attribute.attributetype == "Years In Residence" ?
                                                                                    <div className='row'>
                                                                                        <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                                            <p className="mb-0 font-weight-bold">{attribute.attributetype}</p>
                                                                                        </div>
                                                                                        <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                                            <p className="mb-0 font-weight-bold">:</p>
                                                                                        </div>
                                                                                        <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                                            <p className="mb-0">{attribute.attributevalue}</p>
                                                                                        </div>
                                                                                    </div> : null
                                                                            }
                                                                        </div>
                                                                    )
                                                                })
                                                            }

                                                            {
                                                                this.state.loanDetails.map((attribute, index) => {
                                                                    return (
                                                                        <div key={index}>
                                                                            {
                                                                                attribute.attributetype == "Years Of Earning" ?
                                                                                    <div className='row'>
                                                                                        <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                                            <p className="mb-0 font-weight-bold">{attribute.attributetype}</p>
                                                                                        </div>
                                                                                        <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                                            <p className="mb-0 font-weight-bold">:</p>
                                                                                        </div>
                                                                                        <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                                            <p className="mb-0">{attribute.attributevalue}</p>
                                                                                        </div>
                                                                                    </div> : null
                                                                            }
                                                                        </div>
                                                                    )
                                                                })
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {this.state.loanlistno.length != 0 ?
                                                <>
                                                    <p className="font-weight-bold" style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>Funding Details</p>
                                                    <div className='card border-0 overflow-auto' style={{ height: '80px', marginTop: "-10px" }}>
                                                        <div className='scrollbar' style={{ cursor: "default", overflowX: "hidden", height: "150px" }} >
                                                            <div className='row p-2'>
                                                                {
                                                                    this.state.loanlistno.map((li, index) => {
                                                                        return (
                                                                            <div key={index}>
                                                                                <div className="row" style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                                                    <div className="col">
                                                                                        <div className='row'>
                                                                                            <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                                                <p className="mb-0 font-weight-bold">{t('Lender ID')}</p>
                                                                                            </div>
                                                                                            <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                                                <p className="mb-0 font-weight-bold">:</p>
                                                                                            </div>
                                                                                            <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                                                <p className="mb-0">{li.lenderid}</p>
                                                                                            </div>
                                                                                        </div>

                                                                                    </div >
                                                                                    <div className="col">
                                                                                        <div className='row'>
                                                                                            <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                                                <p className="mb-0 font-weight-bold">{t('FundAmount')}</p>
                                                                                            </div>
                                                                                            <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                                                <p className="mb-0 font-weight-bold">:</p>
                                                                                            </div>
                                                                                            <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                                                <p className="mb-0">₹{(li.fundamt).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</p>
                                                                                            </div>
                                                                                        </div>

                                                                                    </div >
                                                                                </div >
                                                                            </div>
                                                                        );
                                                                    })
                                                                }
                                                            </div>
                                                        </div>

                                                    </div>
                                                </> : ""}

                                            {/* Verification status */}
                                            {this.state.verificationStatus.length != 0 ?
                                                <>
                                                    <p className="font-weight-bold" style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>Verification Status</p>

                                                    <div className='card border-0 overflow-auto' style={{ height: '95px', marginTop: "-10px" }}>
                                                        <div className='scrollbar' style={{ cursor: "default", overflowX: "hidden", height: "150px" }} >
                                                            <div className='row p-2'>
                                                                {
                                                                    this.state.verificationStatus.map((status, index) => {
                                                                        return (
                                                                            <div className="col-6" key={index} style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                                                <div className='row'>
                                                                                    <div className='col-sm-7 col-md-7 col-lg-7'>
                                                                                        <p className="mb-0 font-weight-bold">{status.key}</p>
                                                                                    </div>
                                                                                    <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                                        <p className="mb-0 font-weight-bold">:</p>
                                                                                    </div>
                                                                                    <div className='col-sm-4 col-md-4 col-lg-4'>
                                                                                        {status.status == "1" || status.status == "9" ?
                                                                                            <p className="mb-0">Verified &nbsp;<FaUserCheck style={{ color: "green" }} /></p> :
                                                                                            <p className="mb-0">Not Verified</p>
                                                                                        }
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    })
                                                                }
                                                            </div>
                                                        </div>

                                                    </div>
                                                </> : ""}

                                            <div className='row '>
                                                <div className='col' style={{ textAlign: "center" }}>
                                                    <button type="button" class="btn btn-secondary" style={{ backgroundColor: "rgba(40,116,166,1)", color: "white" }} data-dismiss="modal">Close</button>
                                                </div>

                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Inputs */}
                    <div className='row' style={{ width: "91.5%", marginLeft: "10px", marginTop: "-28px" }}>
                        <table className="card" id='filterCard' style={{ marginLeft: "40px" }}>
                            <thead>
                                <tr>
                                    <div id="one">
                                        <th scope="col-1" className="p-0" style={{ marginLeft: "-20px" }}>
                                            <div className="form-group m-2 ml-3">
                                                <label htmlFor="type" style={{ fontSize: "14px", marginLeft: "1px", fontFamily: "Poppins,sans-serif", color: "rgb(5, 54, 82)" }}>{t('Type')}</label>
                                                <select className="form-select" onChange={this.type} style={{ border: "1px solid rgba(40,116,166,1)", width: '100px', fontSize: "14px" }}>
                                                    <option defaultValue>{t('Select')}</option>
                                                    <option value="1">{t('Open')}</option>
                                                    <option value="2">{t('Completed')}</option>

                                                </select>
                                            </div>
                                        </th>
                                        <th scope="col-1" className="p-0">
                                            <div className="form-group m-2">
                                                <label htmlFor="sort" style={{ fontSize: "14px", marginLeft: "1px", fontFamily: "Poppins,sans-serif", color: "rgb(5, 54, 82)" }}>{t('SortField')}</label>
                                                <select className="form-select" onChange={this.sortfield} style={{ border: "1px solid rgba(40,116,166,1)", width: '100px', fontSize: "14px" }}>
                                                    <option defaultValue>{t('Select')}</option>
                                                    <option>{t('amount')}</option>
                                                    <option>{t('interest')}</option>
                                                    <option>{t('tenure')}</option>
                                                </select>
                                            </div>
                                        </th>
                                        <th scope="col-1" className="p-0 ">
                                            <div className="form-group m-2">
                                                <label htmlFor="sort" style={{ fontSize: "14px", marginLeft: "1px", fontFamily: "Poppins,sans-serif", color: "rgb(5, 54, 82)" }}>{t('SortBy')}</label>
                                                <select className="form-select" onChange={this.sortby} style={{ border: "1px solid rgba(40,116,166,1)", width: '100px', fontSize: "14px" }}>
                                                    <option>{t('Select')}</option>
                                                    <option value="asc">{t('asc')}</option>
                                                    <option value="desc">{t('desc')}</option>
                                                </select>
                                            </div>
                                        </th>
                                        <th scope="col-1" className="p-0">
                                            <div className="form-group m-2">
                                                <label htmlFor="risk" id='wraplabel1' style={{ fontSize: "14px", marginLeft: "1px", fontFamily: "Poppins,sans-serif", color: "rgb(5, 54, 82)" }}>{t('RiskRating')} &nbsp;<BsInfoCircle onClick={this.riskRatings} /></label>
                                                <select className="form-select" onChange={this.riskrating} style={{ border: "1px solid rgba(40,116,166,1)", width: '100px', fontSize: "14px" }}>
                                                    <option defaultValue>{t('Select')}</option>
                                                    <option value="A">{t('A')}</option>
                                                    <option value="B">{t('B')}</option>
                                                    <option value="C">{t('C')}</option>
                                                    <option value="D">{t('D')}</option>
                                                    <option value="E">{t('E')}</option>
                                                    <option value="F">{t('F')}</option>
                                                </select>
                                            </div>
                                        </th>

                                        <th scope="col-1" className="p-0">
                                            <div className="form-group m-2">
                                                <label htmlFor="prod" style={{ fontSize: "14px", marginLeft: "1px", fontFamily: "Poppins,sans-serif", color: "rgb(5, 54, 82)" }}>{t('ProductType')}</label>

                                                <select className="form-select" onChange={this.producttype} style={{ border: "1px solid rgba(40,116,166,1)", width: '100px', fontSize: "14px" }}>
                                                    <option defaultValue>{t('Select')}</option>
                                                    {this.state.productList.map((product, index) => (
                                                        <option key={index} value={product.prodid}>{product.prodname} </option>
                                                    ))
                                                    }
                                                </select>
                                            </div>
                                        </th>
                                        <th scope="col-1" className="p-0">
                                            <div className="form-group m-2">
                                                <label htmlFor="sort" style={{ fontSize: "14px", marginLeft: "1px", fontFamily: "Poppins,sans-serif", color: "rgb(5, 54, 82)" }}>{t('EnablePreference')}</label>
                                                <select className="form-select" onChange={this.enablepreference} style={{ border: "1px solid rgba(40,116,166,1)", width: '100px', fontSize: "14px" }}>

                                                    <option defaultValue>{t('Select')} </option>
                                                    <option value="0">{t('disable')}</option>
                                                    <option value="1">{t('enable')}</option>
                                                </select>
                                            </div>
                                        </th>
                                        <th scope="col-1" className="p-0">
                                            <div className="form-group m-2">
                                                <label htmlFor="sort" style={{ fontSize: "14px", marginLeft: "1px", fontFamily: "Poppins,sans-serif", color: "rgb(5, 54, 82)" }}>{t('PreferenceType')}</label>
                                                <select className="form-select" onChange={this.preferencetype} style={{ border: "1px solid rgba(40,116,166,1)", width: '100px', fontSize: "14px" }}>
                                                    <option defaultValue>{t('Select')}</option>
                                                    <option value="2">{t('Partialmatching')}</option>
                                                    <option value="1">{t('fullmatching')}</option>
                                                </select>
                                            </div>
                                        </th>
                                        <th scope="col-1" className="p-0 mr-2" style={{ marginTop: "40px", marginLeft: "-12px" }}>
                                            <button type="button" style={{ width: '80px', backgroundColor: "rgba(40,116,166,1)", color: "white" }} className="btn pl-3 pr-3 ml-3 " onClick={this.loanListing}>{t('Apply')}</button>
                                        </th>

                                    </div>
                                </tr>
                            </thead>
                        </table>
                    </div>
                    {/* Lists */}
                    {
                        this.state.loanList && this.state.loanList.length > 0 ?
                            <div className='pl-5 pr-5'>
                                <div>
                                    <div className='scrollBar1' style={{ height: "400px", overflowY: "scroll", scrollbarWidth: "thin", border: "black solid 1px" }}>
                                        <Table>
                                            <Thead>
                                                <Tr className='pl-4 font-weight-normal' style={{ color: "rgba(5,54,82,1)" }}>
                                                    <Th style={{ fontSize: "14px", paddingLeft: "5px", fontWeight: "bold", marginTop: "5px", borderRight: "1px solid" }}>Borrower ID/Product</Th>
                                                    <Th style={{ fontSize: "14px", paddingLeft: "5px", fontWeight: "bold", marginTop: "5px", borderRight: "1px solid" }}>Loan Details</Th>
                                                    <Th style={{ fontSize: "14px", paddingLeft: "5px", fontWeight: "bold", marginTop: "5px", borderRight: "1px solid" }}>Funding Status</Th>
                                                    <Th style={{ fontSize: "14px", paddingLeft: "5px", fontWeight: "bold", marginTop: "5px", borderRight: "1px solid" }}>Invest</Th>
                                                    <Th style={{ fontSize: "14px", paddingLeft: "5px", fontWeight: "bold", marginTop: "5px", borderRight: "1px solid" }}>Details</Th>
                                                </Tr>
                                            </Thead>
                                            <Tbody >
                                                {
                                                    this.state.loanList.map((loan, index) => {
                                                        return (
                                                            <Tr key={index}
                                                                style={{ color: "rgb(5, 54, 82)", transition: 'none', cursor: 'default', backgroundColor: (index % 2 == 0) ? 'rgba(255,255,255,1)' : 'rgba(242,242,242,1)' }}>
                                                                <Td style={{ fontSize: "14px", paddingLeft: "5px", fontWeight: "490", textAlign: "left", verticalAlign: "top", paddingTop: "12px", border: "1px solid black" }}>
                                                                    <div >
                                                                        <p className="font-weight-bold" style={{ marginBottom: "1px" }}>Borrower ID</p>
                                                                        <p>{loan.borrowerid}
                                                                        </p>
                                                                    </div>
                                                                    <div >
                                                                        <p className="font-weight-bold" style={{ marginBottom: "1px" }}>Loan Product</p>
                                                                        <p>{loan.productid}
                                                                        </p>
                                                                    </div>
                                                                </Td>
                                                                <Td style={{ fontSize: "14px", paddingLeft: "5px", fontWeight: "490", textAlign: "left", verticalAlign: "top", paddingTop: "12px", border: "1px solid black" }}>
                                                                    <div >
                                                                        <p className="font-weight-bold" style={{ marginBottom: "1px" }}>Loan Listing Number : <span style={{ fontWeight: "400" }}>{loan.listingno}</span></p>
                                                                        <p className="font-weight-bold" style={{ marginBottom: "1px" }}>Tenure : <span style={{ fontWeight: "400" }}>{loan.tenure} {loan.repaymentfrequencydesc}</span></p>
                                                                        <p className="font-weight-bold" style={{ marginBottom: "1px" }}>{t('Amount Funded')} : <span style={{ fontWeight: "400" }}>₹{(loan.amtfunded).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</span></p>
                                                                        <p className="font-weight-bold" style={{ marginBottom: "1px" }}>Minimum Fund Allowed : <span style={{ fontWeight: "400" }}>₹{(loan.minfundallowed).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</span></p>
                                                                        <p className="font-weight-bold" style={{ marginBottom: "1px" }}>Maximum Fund Allowed : <span style={{ fontWeight: "400" }}>₹{(loan.maxfundallowed).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</span></p>
                                                                    </div>
                                                                </Td>
                                                                <Td style={{ fontSize: "14px", paddingLeft: "5px", fontWeight: "490", textAlign: "left", verticalAlign: "top", paddingTop: "12px", border: "1px solid black" }}>
                                                                    <div >
                                                                        <p className="font-weight-bold" style={{ marginBottom: "1px" }}>Loan Amount : <span style={{ fontWeight: "400" }}>₹{(loan.amt).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</span></p>
                                                                        <p className="font-weight-bold" style={{ marginBottom: "1px" }}>Risk Rating : <span style={{ fontWeight: "400" }}>{loan.riskrating}</span></p>
                                                                        <p className="font-weight-bold" style={{ marginBottom: "1px" }}>Interest Rate : <span style={{ fontWeight: "400" }}>{loan.interestrate} P.A.</span></p>
                                                                        <p className="font-weight-bold" style={{ marginBottom: "1px" }}>Left To Go : <span style={{ fontWeight: "400", color: "red" }}>{loan.listingperioddays} {t('Days')}</span></p>
                                                                    </div>
                                                                </Td>
                                                                <Td style={{ fontSize: "14px", paddingLeft: "5px", fontWeight: "490", textAlign: "center", verticalAlign: "top", paddingTop: "12px", border: "1px solid black" }}>
                                                                    <div style={{ fontSize: "14px" }}>
                                                                        {loan.islenderfunded == "true" ?
                                                                            <div style={{ textAlign: "center" }}>
                                                                                <button className="btn btn-sm btn-secondary text-white" style={{ cursor: "default" }}><FaMoneyBill />&nbsp;{t('Invested')}</button>&nbsp;
                                                                            </div>
                                                                            :
                                                                            <>{loan.amtfunded == loan.amt ?
                                                                                <div style={{ textAlign: "center" }} >
                                                                                    <button className="btn btn-sm btn-secondary text-white" style={{ cursor: "default" }}><FaMoneyBill />&nbsp;{t('Funded')}</button>&nbsp;
                                                                                </div> :
                                                                                <>
                                                                                    {loan.islenderfunded == "false" ?
                                                                                        <div style={{ textAlign: "center" }}>
                                                                                            <div style={{ marginBottom: "10px" }}>
                                                                                                <input type="text" className="w-40 invest_amount" value={loan.investAmount} onChange={(event) => this.fundAmount(event, index, loan.emiamt, loan.amt)} placeholder={t('Enteramount')} />&nbsp;
                                                                                            </div>
                                                                                            <div style={{ textAlign: "center", marginBottom: "10px" }}>
                                                                                                {this.state.checkedOne === "1" ?
                                                                                                    <button className='btn btn-sm' style={{ border: "1px solid rgb(0, 121, 191)", marginTop: "-4px" }}
                                                                                                        onClick={() => this.updateFlagEMI(loan, loan.listingno)}>Check EMI</button>
                                                                                                    :
                                                                                                    <>
                                                                                                        {this.state.checkListingNo === loan.listingno ?
                                                                                                            <button className='btn btn-sm text-white' style={{ backgroundColor: "rgb(0, 121, 191)", marginTop: "-4px" }}
                                                                                                                onClick={() => this.updateFlagEMI(loan, loan.listingno)}>₹{parseFloat(this.state.checkListingNo === loan.listingno ? this.state.updatedEMI : "").toFixed(2)}</button> :
                                                                                                            <button className='btn btn-sm' style={{ border: "1px solid rgb(0, 121, 191)", marginTop: "-4px" }}
                                                                                                                onClick={() => this.updateFlagEMI(loan, loan.listingno)}>Check EMI</button>}

                                                                                                    </>
                                                                                                }
                                                                                            </div>
                                                                                            <div style={{ marginBottom: "10px" }} >
                                                                                                <button className="btn btn-sm" style={{ backgroundColor: "rgba(0,121,190,1)", color: "white", marginTop: "-4px" }} onClick={() => this.commitStart(loan, index)}><FaMoneyBill />&nbsp;{t('Invest')}</button>&nbsp;
                                                                                            </div>
                                                                                        </div> :
                                                                                        <div style={{ textAlign: "center" }}>
                                                                                            <div style={{ marginBottom: "10px" }}>
                                                                                                <input type="text" className="w-40 invest_amount" value={loan.investAmount} onChange={(event) => this.fundAmount(event, index, loan.emiamt, loan.amt)} placeholder={t('Enteramount')} />&nbsp;
                                                                                            </div>
                                                                                            <div style={{ marginBottom: "10px" }}>
                                                                                                {this.state.checkedOne === "1" ?
                                                                                                    <button className='btn btn-sm' style={{ border: "1px solid rgb(0, 121, 191)", marginTop: "-4px" }}
                                                                                                        onClick={() => this.updateFlagEMI(loan, loan.listingno)}>Check EMI</button>
                                                                                                    :
                                                                                                    <>
                                                                                                        {this.state.checkListingNo === loan.listingno ?
                                                                                                            <button className='btn btn-sm text-white' style={{ backgroundColor: "rgb(0, 121, 191)", marginTop: "-4px" }}
                                                                                                                onClick={() => this.updateFlagEMI(loan, loan.listingno)}>₹{parseFloat(this.state.checkListingNo === loan.listingno ? this.state.updatedEMI : "").toFixed(2)}</button> :
                                                                                                            <button className='btn btn-sm' style={{ border: "1px solid rgb(0, 121, 191)", marginTop: "-4px" }}
                                                                                                                onClick={() => this.updateFlagEMI(loan, loan.listingno)}>Check EMI</button>}

                                                                                                    </>
                                                                                                }
                                                                                            </div>
                                                                                            <div style={{ textAlign: "center", marginBottom: "10px" }}>
                                                                                                <button className="btn btn-sm" style={{ backgroundColor: "rgba(0,121,190,1)", color: "white", marginTop: "-4px" }} onClick={() => this.commitStart(loan, index)}><FaMoneyBill />&nbsp;{t('Invest')}</button>&nbsp;
                                                                                            </div>
                                                                                        </div>}
                                                                                </>
                                                                            }
                                                                            </>
                                                                        }
                                                                    </div>
                                                                </Td>
                                                                <Td style={{ fontSize: "14px", paddingLeft: "5px", fontWeight: "490", textAlign: "center", verticalAlign: "top", paddingTop: "12px", border: "1px solid black" }}>
                                                                    <div>
                                                                        <button className="btn btn-sm text-white" onClick={() => this.onSelectList(loan, index)} style={{ borderRadius: "50%", backgroundColor: "rgba(0,121,190,1)", marginTop: "-4px" }}><FaAngleDoubleDown /></button>
                                                                    </div>
                                                                </Td>
                                                            </Tr>
                                                        )
                                                    }
                                                    )}
                                            </Tbody>
                                        </Table>
                                    </div>
                                </div>
                            </div> :
                            <div className='row '>
                                <div className="col">
                                    <p className="d-flex justify-content-center" style={{ fontSize: "20px", fontWeight: "bold", color: "rgba(5,54,82,1)" }}>{t('Lists not available.')}</p>
                                </div>
                            </div>
                    }
                    {/*  Modal */}
                    <button id='riskRatingModal' type="button" class="btn btn-primary" data-toggle="modal" data-target=".bd-example-modal-sm" style={{ display: "none" }}>Small modal</button>
                    <div class="modal fade bd-example-modal-sm" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true">
                        <div class="modal-dialog modal-sm">
                            <div className="modal-content">
                                <div className="modal-body">
                                    <p className="risk-rating-header">
                                        Risk Rating
                                    </p>
                                    <ul className="risk-rating-list">
                                        <li className="risk-rating-item">
                                            <span className="risk-rating-label">A:</span>
                                            <span className="risk-rating-description">Lowest Risk</span>
                                        </li>
                                        <li className="risk-rating-item">
                                            <span className="risk-rating-label">B:</span>
                                            <span className="risk-rating-description">Low Risk</span>
                                        </li>
                                        <li className="risk-rating-item">
                                            <span className="risk-rating-label">C:</span>
                                            <span className="risk-rating-description">Moderate Risk</span>
                                        </li>
                                        <li className="risk-rating-item">
                                            <span className="risk-rating-label">D:</span>
                                            <span className="risk-rating-description">High Risk</span>
                                        </li>
                                        <li className="risk-rating-item">
                                            <span className="risk-rating-label">E:</span>
                                            <span className="risk-rating-description">Higher Risk</span>
                                        </li>
                                        <li className="risk-rating-item">
                                            <span className="risk-rating-label">F:</span>
                                            <span className="risk-rating-description">Highest Risk</span>
                                        </li>
                                    </ul>
                                    <hr style={{ backgroundColor: "rgba(5,54,82,1)" }} />
                                    <div className='row'>
                                        <div className='col' style={{ textAlign: "center" }}>
                                            <button type="button" class="btn text-white btn-sm" data-dismiss="modal"
                                                style={{ backgroundColor: "rgb(136, 189, 72)" }} >Close</button>
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
                                    <div className='row'>
                                        <div className='col'>
                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold" }}><img src={batch} width="25px" />Transaction PIN</p>
                                            <hr style={{ width: "50px", marginTop: "-10px" }} />
                                            <div className='row'>
                                                <div style={{ display: "" }} className="col">
                                                    <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold", fontSize: "15px" }}>Enter PIN</p>
                                                    <input className='form-control' type='number' placeholder='Enter PIN' id='' onChange={this.mpin}
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
                                    <div className='row'>
                                        <div className='col' style={{ textAlign: "end" }}>
                                            <button type="button" class="btn text-white btn-sm"
                                                style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.commitFunding}>Submit</button>
                                            &nbsp;
                                            <button type="button" class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "#0079BF" }}>Cancel</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Consent Modal */}
                    <button id='consentModal' style={{ display: "none" }} type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter">
                    </button>
                    <div className="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" data-backdrop="static">
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content">
                                <div className="modal-body">
                                    <div id='consentBody'>
                                        <div className='row' style={{ paddingLeft: "5px" }}>
                                            <div className='col'>
                                                <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold" }}><img src={batch} width="25px" />Consent</p>
                                                <hr style={{ width: "50px", marginTop: "-10px", backgroundColor: "rgba(5,54,82,1)" }} />

                                                <div className="">
                                                    {{ consentData } ? <><input type="checkbox" className="form-check-input" id="" onChange={this.changeConsentType} style={{ position: "absolute", left: "19px" }} />
                                                        <p className="form-check-label" style={{ color: "rgba(5,54,82,1)", fontSize: "15px", fontWeight: "400", paddingLeft: "5px", paddingRight: "5px" }}>{consentData}</p></> : ""}
                                                </div>
                                                <hr style={{ backgroundColor: "rgba(5,54,82,1)" }} />
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className='col-6'>
                                                <button type="button" className="btn btn-sm text-white w-100 rounded-0" id='checkConsentBtn'
                                                    style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.setuserConsent}><FaThumbsUp />&nbsp;Agree </button>
                                            </div>
                                            <div className='col-6'>
                                                <button type="button" class="btn btn-sm text-white w-100 rounded-0" data-dismiss="modal" style={{ backgroundColor: "#0079BF" }}
                                                ><BsArrowRepeat />&nbsp;Cancel</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button id='pinModal' style={{ display: "none" }} type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter61">
                    </button>
                    <div className="modal fade" id="exampleModalCenter61" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle61" aria-hidden="true" data-backdrop="static">
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content" style={{ marginLeft: "100px" }}>
                                <div className="modal-body">
                                    <div id='transactionPinBody' style={{ display: "none" }}>
                                        <div className='row'>
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
                                        <div className='row'>
                                            <div className='col' style={{ textAlign: "end" }}>
                                                <button type="button" class="btn text-white btn-sm"
                                                    style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.commitFunding}>Submit</button>
                                                &nbsp;
                                                <button type="button" class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "#0079BF" }}>Cancel</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div id='otpTxnBody' style={{ display: "none" }}>
                                        <div className='row'>
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
                                                    style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.commitFunding}>Submit</button>
                                                &nbsp;
                                                <button type="button" class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "#0079BF" }}>Cancel</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*  Common Alert */}
                    <button id='commonModal' style={{ display: "none" }} type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter21">
                    </button>
                    <div className="modal fade" id="exampleModalCenter21" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" data-backdrop="static">
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content" style={{ width: "300px", marginLeft: "100px" }}>
                                <dvi class="modal-body">
                                    <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold", paddingLeft: "10px" }}>{this.state.resMsg}</p>
                                    <hr style={{ backgroundColor: "rgba(5,54,82,1)" }} />
                                </dvi>
                                <div class="modal-footer" style={{ marginTop: "-28px" }}>
                                    <button type="button" class="btn text-white btn-sm" data-dismiss="modal"
                                        style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.reloadPage}>Okay</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withTranslation()(LoanListing)
