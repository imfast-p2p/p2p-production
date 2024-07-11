import React, { Component } from 'react';
import './ViewAllLoanRequests.css';
import { Link } from 'react-router-dom';
import { BASEURL } from '../assets/baseURL';
import { confirmAlert } from "react-confirm-alert";
import 'react-confirm-alert/src/react-confirm-alert.css';
import BorrowerSidebar from '../../SidebarFiles/BorrowerSidebar';
import $ from 'jquery';
import { withTranslation } from 'react-i18next';
import {
    FaCheckCircle, FaFileAlt, FaRegFileAlt,
    FaFileSignature, FaRegTrashAlt, FaAngleLeft, FaAngleDoubleDown,
    FaAngleRight,
    FaTimesCircle
} from "react-icons/fa";
import { getItem } from 'localforage';
import ReactPaginate from 'react-paginate';
import './Pagination.css'
import dashboardIcon from '../assets/icon_dashboard.png';
import batch from '../assets/batch.png';

import Loader from '../Loader/Loader';
import '../SystemUser/Workflow/LoanWorkflow.css';
import { FcOk } from "react-icons/fc";
import { GiSandsOfTime, GiTimeTrap } from "react-icons/gi";
import { MdNotStarted } from "react-icons/md";
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'
//updated
var loanStatusParent;
export class ViewAllLoanRequests extends Component {
    constructor(props) {
        super(props)
        this.state = {
            borrowerid: "",
            loanreqno: "",
            loanofferid: "",

            loanOfferDetails: {},
            fundPercent: "0.0 %",
            showResultStat: false,
            status: "",
            otp: "",
            loanstats: "",
            loanlistingnumber: "",
            loantenure: "",
            riskrating: "",
            loanlistingno: sessionStorage.getItem('loanlistingnumber'),
            loanlistingdays: "",
            consent: "Y",
            consentmsg: "something",
            loanStmt: [],
            stmtsverified: "",

            offset: 0,
            loanOfferList: [],
            orgtableData: [],
            perPage: 10,
            currentPage: 0,
            pageCount: "",

            productId: "",
            showLoader: false,

            acceptFundisDisable: false,
            agreementSignedFlag: "",

            toggle: null,
            loanOfferArray: [],
            loanFundingArray: {},

            //Loan Request Consent
            loanconsentsignerinfo: [],
            loanReqStatus: [],

            workflowLists: [],

            //references
            referenceLists: []
        }

        this.viewLoans = this.viewLoans.bind(this);
        this.acceptOffer = this.acceptOffer.bind(this);
        this.loanFundingStat = this.loanFundingStat.bind(this);
        this.triggerLoan = this.triggerLoan.bind(this);
        this.verifyLoan = this.verifyLoan.bind(this);
        this.loanListingExtension = this.loanListingExtension.bind(this);
    }

    componentDidMount() {
        if (sessionStorage.getItem('isLogin') == "true") {
            this.setState({ showLoader: true })
            console.log(sessionStorage.getItem('token'));
            console.log(sessionStorage.getItem('userID'));
            console.log(sessionStorage.getItem('loanReqNo'));
            console.log(sessionStorage.getItem('loanlistingnumber'))
            this.viewLoans();

        } else {
            window.location = '/login'
        }

    }

    // dashboard=()=>{
    //     window.location="/borrowerdashboard"
    // }

    perPage = (event) => {
        this.setState({ perPage: event.target.value })
        console.log(this.state.perPage);
        this.viewLoans();
    }

    onSelectList = (loan, i) => {
        // $('.P_Summery').toggle();
        const loanList = this.state.loanOfferList;
        loanList[i].showDetails = !loanList[i].showDetails;
        this.setState({ loanOfferList: loanList })
    }

    handlePageClick = (event) => {

        const selectedPage = event.selected;
        const offset = selectedPage * this.state.perPage;
        this.setState({
            currentPage: selectedPage,
            offset: offset
        }, () => {
            this.loadMoreData();
        })
    }
    loadMoreData = () => {
        const data = this.state.orgtableData;
        const slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
        this.setState({
            pageCount: Math.ceil(data.length / this.state.perPage),
            loanOfferList: slice
        })
    }
    getLoanStmt = (loanreq) => {
        fetch(BASEURL + '/usrmgmt/getstmtslist?loanreqno=' + loanreq, {
            headers: {
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            }
        })
            .then((Response) => {
                return Response.json();
            })
            .then((resdata) => {
                if (resdata.status == 'Success') {
                    console.log(resdata);

                    this.setState({ loanStmt: resdata.msgdata });
                } else {
                    // alert("Issue: " + resdata.message);
                }
            })
    }

    deleteStmt = (stmtid, loanreqno) => {
        fetch(BASEURL + '/usrmgmt/deletestmt', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                id: stmtid,
                loanreqno: loanreqno
            })
        }).then(response => {
            console.log('Response:', response)
            return response.json();

        })
            .then((resdata) => {
                if (resdata.status == 'Success') {
                    alert(resdata.message)
                    const newList = this.state.loanStmt.filter((l) => l.stmtid !== stmtid);

                    this.setState({ loanStmt: newList });
                    // $('#reuploadStmt').click(function()
                    // {
                    //     $('#reUpload ').click();
                    // })
                    //this.uploadFile()
                } else {
                    confirmAlert({
                        message: resdata.message,
                        buttons: [
                            {
                                label: "Okay",
                                onClick: () => { },
                            },
                        ],
                    });
                }
            })


    }
    uploadFile = (loanreq) => {
        console.log(sessionStorage.getItem('loanrequestnumber'))
        const formData = new FormData()
        var fileField = document.getElementById("uploadpdf");
        var body = JSON.stringify({
            stmt_type: 1,
            stmt_format: 1,
            stmt_page: 1,
            loan_req_num: sessionStorage.getItem('loanrequestnumber')
        })

        formData.append("stmt", fileField.files[0]);
        formData.append("stmtinfo", body);

        fetch(BASEURL + '/usrmgmt/uploadstatement', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: formData
        })
            .then(response => response.json())
            .then((resdata) => {
                console.log(resdata);
                if (resdata.status == 'SUCCESS') {
                    console.log(resdata.message);
                    alert(resdata.message)

                } else {
                    alert(resdata.message); //undefined
                }

            })
            .catch(error => console.log(error)
            );
    }

    uploadFile2 = () => {
        console.log(sessionStorage.getItem('loanrequestnumber'))
        const formsData = new FormData()
        var fileFields = document.getElementById("uploadpdf2");
        var body = JSON.stringify({
            stmt_type: 1,
            stmt_format: 1,
            stmt_page: 1,
            loan_req_num: sessionStorage.getItem('loanrequestnumber')
        })

        formsData.append("stmt", fileFields.files[0]);
        formsData.append("stmtinfo", body);

        fetch(BASEURL + '/usrmgmt/uploadstatement', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: formsData
        })
            .then(response => response.json())
            .then((resdata) => {
                console.log(resdata);
                if (resdata.status == 'SUCCESS') {
                    console.log(resdata.message);
                    alert(resdata.message)

                } else {
                    alert(resdata.message); //undefined
                }

            })
            .catch(error => console.log(error)
            );
    }
    reUpload = () => {
        console.log(sessionStorage.getItem('loanrequestnumber'))
        fetch(BASEURL + '/lsp/requestloanreprocessing', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                loanreqno: sessionStorage.getItem('loanrequestnumber')
            })
        }).then(response => {
            console.log('Response:', response)
            return response.json();

        }).then((resdata) => {
            if (resdata.status == 'Success') {
                alert(resdata.message)
                window.location.reload();

            } else {
                confirmAlert({
                    message: resdata.message,
                    buttons: [
                        {
                            label: "Okay",
                            onClick: () => { },
                        },
                    ],
                });
            }
        })
    }

    viewLoans(event) {
        fetch(BASEURL + '/lsp/getborrowerloanrequests', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                borrowerid: sessionStorage.getItem('userID')
            })
        }).then(response => {
            console.log('Response:', response)
            return response.json();

        })
            .then((resdata) => {
                if (resdata.status == 'SUCCESS') {
                    this.setState({ showLoader: false })
                    console.log(resdata.msgdata)
                    // var filterdLoanreqList = resdata.msgdata.filter(loan => loan.loanaccountstatus == 0);
                    var filterdLoanreqList = resdata.msgdata.filter(loan => loan.loanaccountstatus == 0 || loan.loanaccountstatus == "");
                    console.log(filterdLoanreqList);
                    this.setState({
                        loanOfferList: filterdLoanreqList.map((pdata) => {
                            pdata.showResults = false;
                            return pdata;
                        })
                    })
                    console.log(this.state.loanOfferList)
                    var data = filterdLoanreqList
                    console.log(data)
                    var slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
                    console.log(slice)

                    this.setState({
                        pageCount: Math.ceil(data.length / this.state.perPage),
                        orgtableData: data,
                        loanOfferList: slice
                    })
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
    }

    acceptOffer = (loanreqno, offerid) => {
        console.log(loanreqno, offerid);

        this.setState({ loanreqno: loanreqno });
        this.setState({ loanofferid: offerid })
        if (sessionStorage.getItem("SisVkycVerified") == 0) {
            $("#alertModal").click()
        } else {

            fetch(BASEURL + '/lsp/acceptloanoffer', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer " + sessionStorage.getItem('token')
                },
                body: JSON.stringify({
                    loanreqno: loanreqno,
                    loanofferid: offerid
                })
            }).then(response => {
                console.log('Response:', response)
                return response.json();
            })
                .then((resdata) => {
                    console.log(resdata);
                    if (resdata.status == 'SUCCESS') {
                        console.log(resdata);
                        // alert("Loan Offer Accepted Successfully")
                        confirmAlert({
                            message: "Loan Offer Accepted Successfully",
                            buttons: [
                                {
                                    label: "Okay",
                                    onClick: () => {
                                        window.location.reload()
                                    },
                                },
                            ],
                        });
                        console.log(this.state.loanreqno)

                    } else {
                        confirmAlert({
                            message: resdata.message,
                            buttons: [
                                {
                                    label: "Okay",
                                    onClick: () => {
                                        window.location = "/borrowerdashboard"
                                    },
                                },
                            ],
                        });
                    }
                })
        }
    }

    loanFundingStat(loanreq) {
        this.state.loanstats = "";
        this.setState({ loanreqno: loanreq });
        console.log(loanreq)
        fetch(BASEURL + '/lsp/getloanfundingstatus', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                loanreqno: loanreq
            })
        }).then(response => {
            console.log('Response:', response)
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata);
                if (resdata.status == 'SUCCESS') {
                    sessionStorage.setItem('loanlistingnumber', resdata.msgdata.loanlistingno);

                    // console.log(resdata.msgdata);
                    console.log('Funding percent:', resdata.msgdata.fundingperc);
                    sessionStorage.setItem('loanrequestnumber', resdata.msgdata.loanreqno);

                    // console.log(sessionStorage.getItem('loanlistingnumber'))
                    const fundP = resdata.msgdata.fundingperc + "%";
                    const fundPer = fundP.replace(" ", "0");

                    this.setState({ showResultStat: true });
                    this.setState({ status: resdata.status });
                    this.setState({ fundPercent: fundPer });
                    this.setState({ loanstats: resdata.msgdata.loanstatus });
                    this.setState({ loantenure: resdata.msgdata.tenure });
                    this.setState({ riskrating: resdata.msgdata.riskrating });
                    this.setState({ loanlistingdays: resdata.msgdata.listingperioddays })

                    console.log(resdata.msgdata.loanstatus)

                    this.setState({ loanFundingArray: resdata.msgdata })

                    var loanlistingNo = resdata.msgdata.loanlistingno
                    this.getloanaccountStatus(loanlistingNo)

                } else {
                    // confirmAlert({
                    //     message: "Issue: " + resdata.message,
                    //     buttons: [
                    //         {
                    //             label: "Okay",
                    //             onClick: () => { },
                    //         },
                    //     ],
                    // });
                }
            })
    }
    getloanaccountStatus = (loanlistingNo) => {
        fetch(BASEURL + '/lsp/getloanaccountstatus', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                loanlistingno: loanlistingNo
            })
        }).then((Response) => {
            return Response.json();
        })
            .then((resdata) => {
                if (resdata.status == 'SUCCESS') {
                    console.log(resdata);
                    var loandocumentationstatus = resdata.msgdata.loandocumentationstatus;
                    console.log(loandocumentationstatus);

                    this.setState({ agreementSignedFlag: loandocumentationstatus })
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }
    triggerLoan = () => {
        // this.setState({ loanreqno: this.state.loanOfferDetails.loanreqno });
        // console.log(this.state.loanOfferDetails.loanreqno)
        if (sessionStorage.getItem("SisVkycVerified") == 0) {
            $("#acceptfundalertModal").click()
        } else {
            fetch(BASEURL + '/lsp/triggerloanacceptancereq', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer " + sessionStorage.getItem('token')
                },
                body: JSON.stringify({
                    loanreqno: this.state.loanreqno,
                    borrowerid: sessionStorage.getItem('userID')
                })
            }).then(response => {
                console.log('Response:', response)
                return response.json();
            })
                .then((resdata) => {
                    console.log(resdata);
                    if (resdata.status == 'Success') {
                        console.log(resdata.message);
                        $("#loanAcceptModal").click();
                        this.setState({ acceptFundisDisable: true })
                        // var otpField = prompt("Loan acceptance request raised successfully. Please enter OTP:");
                        // if (otpField == null || otpField == "") {
                        //     alert("Loan Offer Generation get cancelled");
                        // } else {
                        //     this.state.otp = otpField;
                        //     this.verifyLoan();
                        // }

                        var timeleft = 30;
                        var downloadTimer = setInterval(function () {
                            if (timeleft < 0) {
                                clearInterval(downloadTimer);
                                document.getElementById("countdown2").innerHTML = "Resend OTP";
                                $('#countdown').hide()
                                $('#countdown2').show()

                            } else {
                                document.getElementById("countdown").innerHTML = "Resend OTP in " + timeleft + "s";
                                $('#countdown2').hide()
                                $('#countdown').show()
                            }
                            timeleft -= 1;
                        }, 1000);

                    } else {
                        confirmAlert({
                            message: resdata.message,
                            buttons: [
                                {
                                    label: "Okay",
                                    onClick: () => { },
                                },
                            ],
                        });
                    }
                })
        }
    }
    retriggerFundAcceptOTP = () => {
        fetch(BASEURL + '/lsp/triggerloanacceptancereq', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                loanreqno: this.state.loanreqno,
                borrowerid: sessionStorage.getItem('userID')
            })
        }).then(response => {
            console.log('Response:', response)
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata);
                if (resdata.status == 'Success') {
                    console.log(resdata.message);
                    this.setState({ acceptFundisDisable: true })
                    alert(resdata.message)
                    var timeleft = 30;
                    var downloadTimer = setInterval(function () {
                        if (timeleft < 0) {
                            clearInterval(downloadTimer);
                            document.getElementById("countdown2").innerHTML = "Resend OTP";
                            $('#countdown').hide()
                            $('#countdown2').show()

                        } else {
                            document.getElementById("countdown").innerHTML = "Resend OTP in " + timeleft + "s";
                            $('#countdown2').hide()
                            $('#countdown').show()
                        }
                        timeleft -= 1;
                    }, 1000);
                } else {
                    alert(resdata.message)
                    // confirmAlert({
                    //     message: resdata.message,
                    //     buttons: [
                    //         {
                    //             label: "Okay",
                    //             onClick: () => { },
                    //         },
                    //     ],
                    // });
                }
            })
    }
    cancelAcceptFund = () => {
        this.setState({ acceptFundisDisable: false })
    }
    loanAcceptanceOtp = (e) => {
        this.setState({ otp: e.target.value })
    }

    verifyLoan = () => {
        // this.setState({ loanreqno: this.state.loanOfferDetails.loanreqno });
        // console.log(this.state.loanOfferDetails.loanreqno)
        fetch(BASEURL + '/lsp/verifyLoanAcceptanceRequest', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                loanreqno: this.state.loanreqno,
                borrowerid: sessionStorage.getItem('userID'),
                otp: this.state.otp
            })
        }).then(response => {
            console.log('Response:', response)
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata);
                if (resdata.status == 'Success') {
                    console.log(resdata.message);
                    sessionStorage.setItem('loanrequestnumber', this.state.loanreqno);
                    window.location = "/agreementSign";
                } else {
                    var getValue = document.getElementById("loanAcceptInput");
                    if (getValue.value != "") {
                        getValue.value = "";
                    }

                    confirmAlert({
                        message: resdata.message,
                        buttons: [
                            {
                                label: "Okay",
                                onClick: () => {
                                    this.setState({ acceptFundisDisable: false })


                                },
                            },
                        ],
                    });
                }
            })
    }

    withdrawLoanRequest = (event) => {
        confirmAlert({
            message: "Would you prefer to withdraw the loan request?",
            buttons: [
                {
                    label: "Yes",
                    onClick: () => {
                        this.submitWithdrawRequest();
                    }
                },
                {
                    label: "No",
                    onClick: () => {

                    }
                }
            ],
        });
    }
    submitWithdrawRequest = () => {
        fetch(BASEURL + '/lsp/withdrawloanrequest', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                loanreqno: this.state.loanreqno
            })
        }).then(response => {
            console.log('Response:', response)
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata);
                if (resdata.status == 'Success') {
                    console.log(resdata);
                    confirmAlert({
                        message: "Withdraw Request Successfull",
                        buttons: [
                            {
                                label: "Okay",
                                onClick: () => { window.location.reload() },
                            },
                        ],
                    });


                } else {
                    alert(resdata.message);
                    window.location.reload();
                }
            })
    }
    loanListingExtension(event) {

        fetch(BASEURL + '/lsp/loanlistingextension', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                loanlistingno: sessionStorage.getItem('loanlistingnumber'),
                consent: this.state.consent,
                consentmsg: this.state.consentmsg
            })
        }).then(response => {
            console.log('Response:', response)
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata);
                if (resdata.status == 'Success') {
                    console.log(resdata);
                    alert(resdata.message);
                } else {
                    alert(resdata.message);
                }
            })
    }
    initialDisbursement(event) {
        if (sessionStorage.getItem("SisVkycVerified") == 0) {
            $("#disburseAlertModal").click()
        } else {
            fetch(BASEURL + '/lsp/initiateloandisbursement', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer " + sessionStorage.getItem('token')
                },
                body: JSON.stringify({
                    loanlistingno: sessionStorage.getItem('loanlistingnumber')
                })
            }).then((Response) => {
                return Response.json();
            })
                .then((resdata) => {
                    if (resdata.status == 'Success') {
                        console.log(resdata);
                        // alert("Loan disbursement initiated. Please check your account after sometime");
                        confirmAlert({
                            message: "Loan disbursement initiated. Please check your account after sometime",
                            buttons: [
                                {
                                    label: "Okay",
                                    onClick: () => {
                                        window.location.reload()
                                    },
                                },
                            ],
                        });
                    } else {
                        alert(resdata.message);
                    }
                })
                .catch((error) => {
                    console.log(error)
                })
        }
    }
    handleToggle = (loan, loanreqno, isstmtsverified, productid, loanstatus) => {
        if (this.state.toggle === loanreqno) {
            // setToggle(null);
            this.setState({ toggle: null });
            return false
        }
        this.getLoanRequestDetails(loanreqno)
        this.getLoanReqWfStages(loanreqno);
        //    setToggle(id)
        this.setState({ toggle: loanreqno })
        this.setState({ loanreqno: loanreqno });
        this.setState({ productId: productid });
        loanStatusParent = loanstatus;
        console.log(typeof (loanStatusParent));

        console.log(this.state.productId)
        this.getLoanStmt(loanreqno)
        if (loanStatusParent == 2 || loanStatusParent == 3) {
            fetch(BASEURL + '/lsp/getloanoffers', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer " + sessionStorage.getItem('token')
                },
                body: JSON.stringify({
                    loanreqno: loanreqno
                })
            }).then(response => {
                console.log('Response:', response)
                return response.json();

            })
                .then((resdata) => {
                    if (resdata.status == 'SUCCESS') {
                        console.log(resdata);

                        sessionStorage.setItem('loanrequestnumber', this.state.loanreqno)
                        this.getLoanStmt(loanreqno)
                        this.setState({
                            loanOfferList: this.state.loanOfferList.map((pdata) => {
                                if (pdata.loanreqno === loanreqno) {
                                    pdata.showResults = true;
                                } else {
                                    pdata.showResults = false;
                                }
                                return pdata;
                            })
                        });

                        this.loanFundingStat(loanreqno);
                        // this.setState({ loanofferid: resdata.msgdata[0].offerid });
                        // this.setState({ loanOfferDetails: resdata.msgdata[0] });

                        this.setState({ loanOfferArray: resdata.msgdata })
                        //Added for clear the values
                        this.setState({ fundPercent: "0.0%" });
                        this.setState({ stmtsverified: isstmtsverified })
                        console.log(this.state.stmtsverified)
                        var testArray = this.state.loanOfferArray;
                        var test2 = testArray.length;
                        console.log(test2)
                        // sessionStorage.setItem('isstmtVerified',this.state.stmtsverified)
                        // console.log(sessionStorage.getItem('isstmtVerified'))

                        if (loanStatusParent.loanreqstatus == 1) {
                            document.getElementById("loanStatus").innerHTML = "Status : Active(Loan Request Raised)";
                        }
                        else if (loanStatusParent.loanreqstatus == 2) {
                            document.getElementById("loanStatus").innerHTML = "Status : Offer Generated";
                            // this.getLoanTenure();
                        }
                        else if (loanStatusParent.loanreqstatus == 3) {
                            // document.getElementById("loanStatus").innerHTML = "Offer Accepted";
                            // this.getLoanTenure();

                        }
                        else if (loanStatusParent.loanreqstatus == 4) {
                            //document.getElementById("loanStatus").innerHTML = "Status: Rejected";
                            // this.getLoanTenure();
                        }
                        else if (loanStatusParent.loanreqstatus == 5) {
                            //document.getElementById("loanStatus").innerHTML = "Status: Withdrawn";
                            // this.getLoanTenure();
                        }


                    } else {
                        // confirmAlert({
                        //     message: resdata.message,
                        //     buttons: [
                        //         {
                        //             label: "Okay",
                        //             onClick: () => { },
                        //         },
                        //     ],
                        // });
                        console.log(resdata.message)
                    }
                })
        }
    }
    getLoanReqWfStages = (loanreqno) => {
        fetch(BASEURL + '/usrmgmt/getloanreqwfstages?loanrequestnumber=' + loanreqno, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            }
        }).then((Response) => Response.json())
            .then((resdata) => {
                if (resdata.status === 'Success' || 'success' || 'SUCCESS') {
                    this.setState({ workflowLists: resdata.msgdata })
                }
                else {
                }
            })
    }
    getLoanRequestDetails = (loanreqno) => {
        fetch(BASEURL + '/lsp/getloanrequeststatus', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                loanreqno: loanreqno
            })
        }).then(response => {
            console.log('Response:', response)
            return response.json();
        })
            .then((resdata) => {
                if (resdata.status == 'SUCCESS') {
                    console.log(resdata);
                    this.setState({
                        loanReqStatus: resdata.msgdata.loanconsentsignerinfo,
                    })
                } else {

                    console.log(resdata.message)
                }
            })
    }
    viewSanctionLetter = () => {
        $("#viewSanction").click();
        // sessionStorage.setItem('loanrequestnumber',this.state.loanreqno);
        // sessionStorage.getItem('loanlistingnumber')
    }
    viewLoanReqDocu = () => {
        fetch(BASEURL + '/lms/borr/getloanagreement?loanreqno=' + this.state.loanreqno + "&doctype=2", {
            headers: {
                'Authorization': "Bearer " + sessionStorage.getItem('token'),
            },
            responseType: 'arraybuffer',
            dataType: 'blob'
        })
            .then(response => {
                return response.blob();
            })
            .then((response) => {
                $("#myLargeModalLabel1").modal('hide');
                console.log('Response:', response)
                var file = new Blob([(response)], { type: 'application/pdf' });
                console.log(file);
                var fileURL = URL.createObjectURL(file);
                console.log(fileURL);
                document.getElementsByClassName('PDFdoc')[0].src = fileURL + "#zoom=50";
                $("#launchColl").click();
            })
            .catch((error) => {
                console.log(error)
            })
    }
    moreDetails = () => {
        $("#moreDetailsModal").click()
    }
    getReferenceDetails = (loanreqno) => {
        console.log(this.state.loanreqno)
        fetch(BASEURL + '/lsp/getreferencesforloanrequest?loanrequestnumber=' + this.state.loanreqno, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            }
        }).then((Response) => Response.json())
            .then((resdata) => {
                if (resdata.status === 'Success' || resdata.status === 'SUCCESS') {
                    this.setState({ referenceLists: resdata.msgdata.referenceinfo }, () => {
                        $("#viewRefModal").click()
                    })
                }
                else {

                }
            })
    }
    handleChange() {
        $('.text').toggle();
        $('#PImage').toggle();
        $('#Pinfo').toggle();
    }
    render() {
        const { t } = this.props;
        console.log(this.state.loanReqStatus)
        const Results = () => (
            <div className='row' style={{ fontSize: "14px", color: "" }}>
                {loanStatusParent == 1 ?
                    <>
                        <div className='row'>
                            <div className='col-md-4'>
                                <div className='row' style={{ marginLeft: "10px" }}>
                                    <p className='col font-weight-bold'>
                                        <p >{t('RequestNumber')} : <span style={{ fontWeight: "400" }}>{this.state.loanreqno}</span></p>
                                    </p>
                                </div>
                            </div>
                            <div className='col-md-4'>
                                <div className='row' style={{ marginLeft: "10px" }}>
                                    <p className='col font-weight-bold'>Product ID : <span style={{ fontWeight: "400" }}>{this.state.productId}</span></p>
                                </div>
                            </div>
                            <div className='col-md-4'>
                                <div className='row' style={{ marginLeft: "10px" }}>
                                    <p className='col font-weight-bold'>{t('Status : Active(Loan Request Raised)')}</p>
                                </div>
                            </div>
                        </div>
                        <div className='row'>
                            <div className='col' style={{ textAlign: "end", marginRight: "10px", marginBottom: "10px" }}>
                                {this.state.loanReqStatus && Object.keys(this.state.loanReqStatus).length !== 0 && (
                                    <button className='btn btn-success' onClick={this.moreDetails}><FaAngleDoubleDown />More Details</button>
                                )}
                                &nbsp;
                                <button className="btn text-white" style={{ backgroundColor: "rgb(0, 121, 191)" }} onClick={this.getReferenceDetails}>View References</button>
                                &nbsp;
                                <button className="btn btn-info" onClick={this.withdrawLoanRequest}>{t('WithdrawRequest')}</button>
                            </div>
                        </div>
                    </>
                    : <>
                        {loanStatusParent == 3 ?
                            <div style={{ paddingLeft: "42px" }}>
                                {this.state.loanreqno == this.state.loanFundingArray.loanreqno && (
                                    <>
                                        <div className='row'>
                                            <div className='col-md-4'>
                                                <p className='font-weight-bold'>
                                                    <p >{t('RequestNumber')} : <span style={{ fontWeight: "400" }}>{this.state.loanreqno}</span></p>
                                                </p>
                                            </div>
                                            <div className='col-md-4'>
                                                <p className='font-weight-bold'>
                                                    <p >Product ID : <span style={{ fontWeight: "400" }}>{this.state.productId}</span></p>
                                                </p>
                                            </div>
                                            <div className='col-md-4'>
                                                <p className='font-weight-bold'>
                                                    <p >{t('Amount Offered')} : <span style={{ fontWeight: "400" }}>₹ {parseFloat(this.state.loanFundingArray.loanamtlisted).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span></p>
                                                </p>
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className='col-md-4'>
                                                <p className='font-weight-bold'>
                                                    <p >{t('Interest Rate :')} <span style={{ fontWeight: "400" }}>{this.state.loanFundingArray.interestrate} P.A.</span></p>
                                                </p>
                                            </div>
                                            <div className='col-md-4'>
                                                <p className='font-weight-bold'>{t('Tenure')} : <span style={{ fontWeight: "400" }}>
                                                    {this.state.loanFundingArray.tenure}
                                                    {this.state.loanFundingArray.tenuredesc == "Daily" ?
                                                        <span id="loanTenure" style={{ marginLeft: "7px" }}>Days</span> : <span>{this.state.loanFundingArray.tenuredesc == "Weekly" ?
                                                            <span id="loanTenure" style={{ marginLeft: "7px" }}>Weeks</span> : <span>{this.state.loanFundingArray.tenuredesc == "Quarterly" ? <span style={{ marginLeft: "7px" }}>Quarter</span> : <span style={{ marginLeft: "7px" }}>Months</span>}</span>
                                                        }</span>
                                                    }</span>
                                                </p>
                                            </div>
                                            <div className='col-md-4'>
                                                <p className='font-weight-bold'>Risk Rating : <span style={{ fontWeight: "400" }}>{this.state.loanFundingArray.riskrating}</span></p>
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className='col-md-4'>
                                                <p className='font-weight-bold'>{t('EMI')} : <span style={{ fontWeight: "400" }}>₹ {parseFloat(this.state.loanFundingArray.emi).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</span>
                                                </p>
                                            </div>
                                            <div className='col-md-4'>
                                                {loanStatusParent == 3 ? <p className='font-weight-bold'>{t('Status')} : {t('OfferAccepted')}</p> : <p>
                                                    {loanStatusParent == 2 ?
                                                        <p id="loanStatus"></p> :
                                                        <p>{loanStatusParent == 8 ? <p className='font-weight-bold'>Status : Rejected</p> :
                                                            <p>{loanStatusParent == 1 ? <p id="loanStatus"></p> : <p className='font-weight-bold'>Status : Withdrawn</p>}</p>}</p>
                                                    }</p>}
                                            </div>
                                        </div>
                                    </>
                                )}
                                {/* {this.state.loanOfferArray && (
                                    <div className='row' style={{ marginLeft: "15px" }}>
                                        <div className='col' style={{ textAlign: "end" }}>
                                            <button className="btn text-white mr-2" onClick={this.withdrawLoanRequest} style={{ backgroundColor: "#0079BF" }}>{t('WithdrawRequest')}</button>
                                            &nbsp;
                                            <button className="btn text-white" onClick={this.viewSanctionLetter} style={{ backgroundColor: "#0079BF" }}><FaFileAlt />{t('View Sanction Letter')}</button>
                                        </div>
                                        <div>
                                            <p>*Note: Your loan request is accepted and an offer generated. Please read the sanction letter, and accept the offer for further processing to release the amount.</p>
                                        </div>
                                    </div>
                                )} */}
                            </div>
                            : <>
                                {loanStatusParent == 2 ?
                                    <>
                                        <div className='row' style={{ marginLeft: "15px" }}>
                                            <div className='col'>
                                                {this.state.loanOfferArray.map((offerGenerated, index) => {
                                                    return (
                                                        <>{this.state.loanreqno == offerGenerated.loanreqno && (
                                                            <div className='card' style={{ padding: "15px 10px 0px 10px", cursor: "default", backgroundColor: (index % 2 == 0) ? 'rgba(255,255,255,1)' : 'rgba(242,242,242,1)' }}>
                                                                <div className='row mb-2' id='' style={{ marginTop: "-10px" }}>
                                                                    <div className='col-md-3'>
                                                                        <p style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>Request Number</p>
                                                                        <p style={{ color: "RGBA(5,54,82,1)", marginTop: "-15px" }}>{offerGenerated.loanreqno}</p>
                                                                    </div>
                                                                    <div className='col-md-3'>
                                                                        <p style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>Product ID</p>
                                                                        <p style={{ color: "RGBA(5,54,82,1)", marginTop: "-15px" }}>{this.state.productId}</p>
                                                                    </div>
                                                                    <div className='col-md-3'>
                                                                        <p style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>Amount Offered</p>
                                                                        <p style={{ color: "RGBA(5,54,82,1)", marginTop: "-15px" }}>₹ {parseFloat(offerGenerated.loanamtoffered).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</p>
                                                                    </div>
                                                                    <div className='col-md-3'>
                                                                        <p style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>Tenure</p>
                                                                        <p style={{ color: "RGBA(5,54,82,1)", marginTop: "-15px" }}>{offerGenerated.tenure}
                                                                            {offerGenerated.tenuredesc == "Daily" ?
                                                                                <span id="loanTenure" style={{ marginLeft: "7px" }}>Days</span> : <span>{offerGenerated.tenuredesc == "Weekly" ?
                                                                                    <span id="loanTenure" style={{ marginLeft: "7px" }}>Weeks</span> : <span>{offerGenerated.tenuredesc == "Quarterly" ?
                                                                                        <span style={{ marginLeft: "7px" }}>Quarter</span>
                                                                                        : <span style={{ marginLeft: "7px" }}>Months</span>}</span>
                                                                                }</span>
                                                                            }</p>
                                                                    </div>
                                                                </div>
                                                                <div className='row' id='' style={{ marginTop: "-10px" }}>
                                                                    <div className='col-md-3'>
                                                                        <p style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>Risk Rating</p>
                                                                        <p style={{ color: "RGBA(5,54,82,1)", marginTop: "-15px" }}>{offerGenerated.riskrating}</p>
                                                                    </div>
                                                                    <div className='col-md-3'>
                                                                        <p style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>Interest Rate</p>
                                                                        <p style={{ color: "RGBA(5,54,82,1)", marginTop: "-15px" }}>{offerGenerated.interestrate} P.A.</p>
                                                                    </div>
                                                                    <div className='col-md-3'>
                                                                        <p style={{ fontWeight: "bold", color: "RGBA(5,54,82,1)" }}>EMI</p>
                                                                        <p style={{ color: "RGBA(5,54,82,1)", marginTop: "-15px" }}>₹ {parseFloat(offerGenerated.emiamt).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')} </p>
                                                                    </div>
                                                                    <div className='col-md-3'>
                                                                        <button className="btn text-white mr-2" onClick={this.acceptOffer.bind(this, offerGenerated.loanreqno, offerGenerated.offerid)} style={{ backgroundColor: "rgb(136, 189, 72)" }}>{t('AcceptOffer')}</button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        )}

                                                        </>
                                                    )
                                                })}

                                            </div>
                                        </div>
                                        {this.state.loanOfferArray.length > 0 && (
                                            <div className='row' style={{ marginLeft: "15px" }}>
                                                <div className='col' style={{ textAlign: "end" }}>
                                                    <button className="btn text-white" style={{ backgroundColor: "rgb(0, 121, 191)" }} onClick={this.getReferenceDetails}>View References</button>
                                                    &nbsp;
                                                    <button className="btn text-white mr-2" onClick={this.withdrawLoanRequest} style={{ backgroundColor: "#0079BF" }}>{t('WithdrawRequest')}</button>
                                                    &nbsp;
                                                    <button className="btn text-white" onClick={this.viewSanctionLetter} style={{ backgroundColor: "#0079BF" }}>{t('View Sanction Letter')}</button>
                                                </div>
                                                <div>
                                                    <p>*Note: Your loan request is accepted and an offer generated, please read the sanction letter, and accept the offer for further processing.</p>
                                                </div>
                                            </div>
                                        )}

                                    </> : <>
                                        {loanStatusParent == 4 ?
                                            <>
                                                <div className='row'>
                                                    <div className='col-md-4'>
                                                        <div className='row' style={{ marginLeft: "10px" }}>
                                                            <p className='col font-weight-bold'>
                                                                <p >{t('RequestNumber')} : <span style={{ fontWeight: "400" }}>{this.state.loanreqno}</span></p>
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className='col-md-4'>
                                                        <div className='row' style={{ marginLeft: "10px" }}>
                                                            <p className='col font-weight-bold'>Product ID : <span style={{ fontWeight: "400" }}>{this.state.productId}</span></p>
                                                        </div>
                                                    </div>
                                                    <div className='col-md-4'>
                                                        <div className='row' style={{ marginLeft: "10px" }}>
                                                            <p className='col font-weight-bold'>{t('Status : Active(Loan Request Raised)')}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </> :
                                            <>
                                                {loanStatusParent == 5 ?
                                                    <>
                                                        <div className='row'>
                                                            <div className='col-md-4'>
                                                                <div className='row' style={{ marginLeft: "10px" }}>
                                                                    <p className='col font-weight-bold'>
                                                                        <p>{t('RequestNumber')} : <span style={{ fontWeight: "400" }}>{this.state.loanreqno}</span></p>
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className='col-md-4'>
                                                                <div className='row' style={{ marginLeft: "10px" }}>
                                                                    <p className='col font-weight-bold'>Product ID : <span style={{ fontWeight: "400" }}>{this.state.productId}</span></p>
                                                                </div>
                                                            </div>
                                                            <div className='col-md-4'>
                                                                <div className='row' style={{ marginLeft: "10px" }}>
                                                                    <p className='col font-weight-bold'>{t('Status : Withdrawn')}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </> :

                                                    loanStatusParent === "8" &&
                                                    <>
                                                        <div className='row'>
                                                            <div className='col-md-4'>
                                                                <div className='row' style={{ marginLeft: "10px" }}>
                                                                    <p className='col font-weight-bold'>
                                                                        <p >{t('RequestNumber')} : <span style={{ fontWeight: "400" }}>{this.state.loanreqno}</span></p>
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className='col-md-4'>
                                                                <div className='row' style={{ marginLeft: "10px" }}>
                                                                    <p className='col font-weight-bold'>Product ID : <span style={{ fontWeight: "400" }}>{this.state.productId}</span></p>
                                                                </div>
                                                            </div>
                                                            <div className='col-md-4'>
                                                                <div className='row' style={{ marginLeft: "10px" }}>
                                                                    <p className='col font-weight-bold'>{t('Status : Rejected')}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </>}
                                            </>
                                        }
                                    </>}
                            </>}
                    </>
                }
                {(loanStatusParent == 3 && this.state.loanstats == 1) ?
                    <div className='row'>
                        <div className='col' style={{ textAlign: "end", marginRight: "10px", marginBottom: "10px" }}>
                            <button className="btn btn-info" onClick={this.withdrawLoanRequest}>{t('WithdrawRequest')}</button>
                        </div>
                    </div>
                    : null}

                {/* // {this.state.loanOfferDetails.loanreqstatus == 2 ?
                    //     <div className='row'>
                    //         <div className='col' style={{ textAlign: "start", marginBottom: "10px" }}>
                    //             <button className="btn text-white mr-2" onClick={this.acceptOffer} style={{ backgroundColor: "rgb(136, 189, 72)" }}>{t('AcceptOffer')}</button>
                    //             &nbsp;
                    //             <button className="btn text-white mr-2" onClick={this.withdrawLoanRequest} style={{ backgroundColor: "#0079BF" }}>{t('WithdrawRequest')}</button>
                    //             &nbsp;

                    //             <button className="btn text-white" onClick={this.viewSanctionLetter} style={{ backgroundColor: "#0079BF" }}><FaFileAlt />{t('View Sanction Letter')}</button>
                    //         </div>
                    //         <div>
                    //             <p>*Note: Your loan request is accepted and an offer generated. Please read the sanction letter, and accept the offer for further processing to release the amount.</p>
                    //         </div>
                    //     </div>

                    //     : null}

                    // {(this.state.loanOfferDetails.loanreqstatus == 3 && this.state.loanstats == 1) ?
                    //     <div className='row'>
                    //         <div className='col' style={{ textAlign: "end", marginRight: "10px", marginBottom: "10px" }}>
                    //             <button className="btn btn-info" onClick={this.withdrawLoanRequest}>{t('WithdrawRequest')}</button>
                    //         </div>
                    //     </div>
                    //     : null} */}
                {this.state.workflowLists && this.state.workflowLists.length !== 0 ?
                    <>
                        <div className="form-row" style={{ marginLeft: "35px" }}>
                            <div className='col-5' id='headinglndwl'>
                                <div className="two__image" style={{ paddingLeft: "9px", marginLeft: "-10px" }}>
                                    <p className="text-white" style={{ paddingBottom: "6px", fontWeight: "600" }}>Loan Request Process and Status</p>
                                </div>
                            </div>
                        </div>
                        <div className="form-row mb-2" style={{ marginLeft: "23px" }}>
                            <div className='col'>
                                <MdNotStarted />&nbsp;<span style={{ fontSize: "14px", color: "rgb(5, 54, 82)" }}>Not Initiated</span>
                                &nbsp; &nbsp;
                                <GiSandsOfTime />&nbsp;<span style={{ fontSize: "14px", color: "rgb(5, 54, 82)" }}>Initiated</span>
                                &nbsp; &nbsp;
                                <FcOk />&nbsp;<span style={{ fontSize: "14px", color: "rgb(5, 54, 82)" }}>Completed</span>
                                &nbsp;&nbsp;
                                <FaTimesCircle />&nbsp;<span style={{ fontSize: "14px", color: "rgb(5, 54, 82)" }}>Rejected</span>
                            </div>
                        </div>
                        <div className="row" style={{ marginLeft: "16px" }}>
                            <div class="main">
                                <ul id="progress">
                                    {this.state.workflowLists.map((step, index) => {
                                        return (
                                            <li key={index} className={step.activityStatus === "2" || step.activityStatus === "9" ? 'active' : ''} style={{ color: step.activityStatus === "2" || step.activityStatus === "9" ? '#fff' : 'rgb(5, 54, 82)' }}>
                                                {step.activityStatus === "2" || step.activityStatus === "9" ? <FcOk /> : <span>{step.activityStatus === "0" ? <MdNotStarted /> : <span>{step.activityStatus === "3" ? <FaTimesCircle /> : <GiSandsOfTime />}</span>}</span>} <span>{step.activity}</span>
                                            </li>
                                        )
                                    }
                                    )}
                                </ul>
                            </div>
                        </div>
                    </>
                    : ""}


            </div>
        );
        const ResultsBar = () => (
            <div>
                {this.state.stmtsverified == 2 && loanStatusParent != 5 ?
                    <div className='row'>
                        <div className='col' style={{ textAlign: "end", marginRight: "40px", marginBottom: "10px" }}>
                            <button className="btn btn-primary mr-2" onClick={this.stmtList} data-toggle="collapse" data-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">Request for reprocessing</button>
                        </div>
                    </div>
                    : null
                }
                {loanStatusParent == 3 ?
                    <div className='row' style={{ fontSize: "14px", marginLeft: "23px" }}>
                        {this.state.loanstats == 4 || this.state.loanstats == 8 ? "" :
                            <>
                                <h6 className="text-uppercase pl-2">{t('FundingStatus')}</h6>
                                <div className='col-4'>
                                    <div className="progress mb-3">
                                        <div className="progress-bar progress-bar-striped" role="progressbar" style={{ width: this.state.fundPercent }}
                                            aria-valuenow='80' aria-valuemin='100' aria-valuemax='100'>
                                            {this.state.fundPercent}
                                        </div>
                                    </div>
                                </div>
                                <div className='col'>
                                    {this.state.fundPercent == "100.0%" ? "" :
                                        <button className="btn text-white" onClick={this.viewSanctionLetter} style={{ backgroundColor: "#0079BF", marginTop: "-30px" }}><FaFileAlt />{t('View Sanction Letter')}</button>
                                    }
                                </div>

                            </>}


                        {this.state.loanstats == 4 ?
                            <>
                                <span>
                                    {this.state.agreementSignedFlag == "1" || this.state.agreementSignedFlag == "9" ?
                                        <>
                                            <span><FaCheckCircle style={{ color: "rgb(136, 189, 72)" }} /> &nbsp;</span>
                                            <Link to="/agreementSign">
                                                <button className='btn text-white btn-sm' style={{ backgroundColor: "rgb(136, 189, 72)", marginBottom: "10px" }}>
                                                    <FaRegFileAlt />View Agreement
                                                </button>
                                            </Link>
                                            {/* &nbsp;
                                            <button className='btn text-white btn-sm' style={{ backgroundColor: "#0079BF", marginTop: "-10px" }} onClick={this.initialDisbursement}>Request Disbursement</button>
                                            <div>
                                                <p>*Note: Your loan documentation completed, please request for disbursement.</p>
                                            </div> */}
                                        </> :
                                        <>
                                            <Link to="/agreementSign">
                                                <button className='btn text-white btn-sm' style={{ backgroundColor: "rgb(136, 189, 72)", marginBottom: "10px" }}>
                                                    <FaFileSignature />Sign Agreement
                                                </button>
                                            </Link>
                                            &nbsp;
                                            <button className="btn btn-sm text-white" onClick={this.withdrawLoanRequest} style={{ backgroundColor: "#0079BF", marginTop: "-10px" }}>{t('WithdrawRequest')}</button>
                                        </>
                                    }
                                </span>
                            </>
                            :
                            <div>
                                {this.state.loanstats == 3 ?
                                    // {this.state.fundPercent == "100.00%" ?
                                    <div className='mb-2'>
                                        <button type="button" id="acceptfundBtn" disabled={this.state.acceptFundisDisable}
                                            className="btn text-white" onClick={this.triggerLoan} style={{ backgroundColor: "rgb(136, 189, 72)" }}>{t('AcceptFunding')}</button>
                                        <button className="btn text-white ml-2" onClick={this.viewSanctionLetter} style={{ backgroundColor: "#0079BF" }}><FaFileAlt />{t('View Sanction Letter')}</button>
                                        <button className="btn text-white ml-2" onClick={this.withdrawLoanRequest} style={{ backgroundColor: "#0079BF" }}>{t('WithdrawRequest')}</button>
                                        <div>
                                            <p>*Note: Loan funding is completed, please accept funding to proceed with documentation.</p>
                                        </div>
                                    </div>
                                    : null}
                            </div>
                        }
                        {(this.state.loanlistingdays <= 4 && (this.state.loanlistingdays >= 0) && (this.state.loanstats == 2)) ?
                            <div className="row">
                                <div className="col">
                                    <h6>{this.state.loanlistingdays} {t('Daysleft')}</h6>
                                </div >
                                <div className="col">
                                    <button onClick={this.loanListingExtension} className="btn btn-info">{t('ExtendListingDate')}</button>
                                </div >
                            </div> : null}
                    </div> : null}
                {loanStatusParent == 1 ?
                    <div className="p-2 bg-white collapse" id="collapseExample" style={{ width: "95%", marginLeft: "20px" }}>
                        {
                            this.state.loanStmt.map((loan, index) => {
                                return (
                                    <div className='row'>
                                        {loan.isverified == 2 ?
                                            <div className='col-8'>
                                                <p className="text-primary">Delete the rejected statement and upload the statement again for reprocessing.</p>
                                            </div> : ""}
                                    </div>
                                )
                            })
                        }

                        <div className='row'>
                            <div className='col-md-4'>
                                <p className='font-weight-bold'>Statement Id</p>
                            </div>
                            <div className='col-md-4'>
                                <p className='font-weight-bold'>File Name</p>
                            </div>
                        </div>

                        {
                            this.state.loanStmt.map((loan, index) => {
                                return (
                                    <div className='row' key={index}>
                                        <div className='col-md-4'>
                                            <p>{loan.stmtid}</p>
                                        </div>
                                        <div className='col-md-4'>
                                            {loan.isverified == 1 ?
                                                <p>
                                                    <p className='row'>
                                                        <p className='col'>{loan.filename}</p>
                                                        <p className='col'><FaCheckCircle style={{ color: "green" }} />&nbsp;</p>
                                                    </p>

                                                </p>
                                                :
                                                <p>
                                                    {loan.isverified == 2 ?
                                                        <p>
                                                            <p className="row" style={{ cursor: "pointer" }} onClick={this.deleteStmt.bind(this, loan.stmtid, loan.loanreqno)}>
                                                                <p className='col'>{loan.filename}</p>
                                                                <p className='col'><FaRegTrashAlt style={{ color: "grey" }} />&nbsp;</p>
                                                            </p>
                                                        </p>
                                                        : <p>
                                                            <p className="row">
                                                                <p className='col'>{loan.filename}</p>
                                                                <p className='col'></p>
                                                            </p>
                                                            {loan.filename ?
                                                                <button className="btn btn-success" onClick={this.reUpload} style={{ textDecoration: "none" }}>ReProcessing</button> :
                                                                <>
                                                                    <input type="file" id="uploadpdf2" accept='.pdf' className="border text-dark" style={{ width: "200px" }} />
                                                                    <div className='card'>
                                                                        <button className="btn btn-info" onClick={this.uploadFile2} style={{ textDecoration: "none" }}>Upload Document</button>
                                                                        <button className="btn btn-success" onClick={this.reUpload} style={{ textDecoration: "none" }}>ReProcessing</button>
                                                                    </div>
                                                                </>}

                                                        </p>}
                                                </p>}

                                        </div>
                                    </div>
                                )

                            })
                        }
                        <div className='row'>
                            <div className='col'>
                                <input type="file" id="uploadpdf2" accept='.pdf' className="border text-dark" style={{ width: "300px" }} />
                                <div className='row mt-2'>
                                    <div className='col'>
                                        <button className="btn btn-info" onClick={this.uploadFile2} style={{ textDecoration: "none" }}>Upload Document</button>
                                        &nbsp;
                                        <button className="btn btn-success" onClick={this.reUpload} style={{ textDecoration: "none" }}>ReProcessing</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div> : null
                }
                {/* {this.state.stmtsverified == 2 && this.state.loanOfferDetails.loanreqstatus != 5 ?
                    <div className='row'>
                        <div className='col' style={{ textAlign: "end", marginRight: "40px", marginBottom: "10px" }}>
                            <button className="btn btn-primary mr-2" onClick={this.stmtList} data-toggle="collapse" data-target="#collapseExample" aria-expanded="false" aria-controls="collapseExample">Request for reprocessing</button>
                        </div>
                    </div>
                    : null} */}
                {/* {this.state.loanOfferDetails.loanreqstatus == 3 ?
                    <div className='row pl-4' style={{ fontSize: "14px" }}>
                        <h6 className="text-uppercase pl-2">{t('FundingStatus')}</h6>
                        <div className='col-4'>
                            <div className="progress mb-3">
                                <div className="progress-bar progress-bar-striped" role="progressbar" style={{ width: this.state.fundPercent }}
                                    aria-valuenow='80' aria-valuemin='100' aria-valuemax='100'>
                                    {this.state.fundPercent}
                                </div>
                            </div>
                        </div>
                        <div className='col'>
                            {this.state.fundPercent == "100.0%" ? "" :
                                <button className="btn text-white" onClick={this.viewSanctionLetter} style={{ backgroundColor: "#0079BF", marginTop: "-30px" }}><FaFileAlt />{t('View Sanction Letter')}</button>
                            }
                        </div>

                        {this.state.loanstats == 4 ?
                            <>
                                <span>
                                    {this.state.agreementSignedFlag == "1" || this.state.agreementSignedFlag == "9" ?
                                        <>
                                            <span><FaCheckCircle style={{ color: "rgb(136, 189, 72)" }} /> &nbsp;</span>
                                            <Link to="/agreementSign">
                                                <button className='btn text-white btn-sm' style={{ backgroundColor: "rgb(136, 189, 72)", marginBottom: "10px" }}>
                                                    <FaRegFileAlt />View Agreement
                                                </button>
                                            </Link>
                                            &nbsp;
                                            <button className='btn text-white btn-sm' style={{ backgroundColor: "#0079BF", marginTop: "-10px" }} onClick={this.initialDisbursement}>Request For Disbursement</button>
                                            <div>
                                                <p>*Note: Your loan documentation completed, please request for disbursement.</p>
                                            </div>
                                        </> :
                                        <Link to="/agreementSign">
                                            <button className='btn text-white btn-sm' style={{ backgroundColor: "rgb(136, 189, 72)", marginBottom: "10px" }}>
                                                <FaFileSignature />Sign Agreement
                                            </button>
                                        </Link>
                                    }
                                </span>
                            </>
                            :
                            <div>
                                {this.state.loanstats == 3 ?
                                    <div className='mb-2'>
                                        <button type="button" id="acceptfundBtn" disabled={this.state.acceptFundisDisable}
                                            className="btn text-white" onClick={this.triggerLoan} style={{ backgroundColor: "rgb(136, 189, 72)" }}>{t('AcceptFunding')}</button>
                                        <button className="btn text-white ml-2" onClick={this.viewSanctionLetter} style={{ backgroundColor: "#0079BF" }}><FaFileAlt />{t('View Sanction Letter')}</button>
                                        <div>
                                            <p>*Note: Thanks for accepting the offer.Please proceed with documentation.</p>
                                        </div>
                                    </div>
                                    : null}
                            </div>
                        }
                        {(this.state.loanlistingdays <= 4 && (this.state.loanlistingdays >= 0) && (this.state.loanstats == 2)) ?
                            <div className="row">
                                <div className="col">
                                    <h6>{this.state.loanlistingdays} {t('Daysleft')}</h6>
                                </div >
                                <div className="col">
                                    <button onClick={this.loanListingExtension} className="btn btn-info">{t('ExtendListingDate')}</button>
                                </div >
                            </div> : null}
                    </div> : null} */}

                {/* {this.state.loanOfferDetails.loanreqstatus == 1 ?
                    <div className="p-2 bg-white collapse" id="collapseExample" style={{ width: "95%", marginLeft: "20px" }}>
                        {
                            this.state.loanStmt.map((loan, index) => {
                                return (
                                    <div className='row'>
                                        {loan.isverified == 2 ?
                                            <div className='col-8'>
                                                <p className="text-primary">Delete the rejected statement and upload the statement again for reprocessing.</p>
                                            </div> : ""}
                                    </div>
                                )
                            })
                        }

                        <div className='row'>
                            <div className='col-4'>
                                <p className='font-weight-bold'>Statement Id</p>
                            </div>
                            <div className='col-4'>
                                <p className='font-weight-bold'>File Name</p>
                            </div>
                        </div>

                        {
                            this.state.loanStmt.map((loan, index) => {
                                return (
                                    <div className='row' key={index}>
                                        <div className='col-4'>
                                            <p>{loan.stmtid}</p>
                                        </div>
                                        <div className='col-4'>
                                            {loan.isverified == 1 ?
                                                <p>
                                                    <p className='row'>
                                                        <p className='col'>{loan.filename}</p>
                                                        <p className='col'><FaCheckCircle style={{ color: "green" }} />&nbsp;</p>
                                                    </p>

                                                </p>
                                                :
                                                <p>
                                                    {loan.isverified == 2 ?
                                                        <p>
                                                            <p className="row" style={{ cursor: "pointer" }} onClick={this.deleteStmt.bind(this, loan.stmtid, loan.loanreqno)}>
                                                                <p className='col'>{loan.filename}</p>
                                                                <p className='col'><FaRegTrashAlt style={{ color: "grey" }} />&nbsp;</p>
                                                            </p>
                                                        </p>
                                                        : <p>
                                                            <p className="row">
                                                                <p className='col'>{loan.filename}</p>
                                                                <p className='col'></p>
                                                            </p>
                                                            {loan.filename ?
                                                                <button className="btn btn-success" onClick={this.reUpload} style={{ textDecoration: "none" }}>ReProcessing</button> :
                                                                <>
                                                                    <input type="file" id="uploadpdf2" accept='.pdf' className="border text-dark" style={{ width: "200px" }} />
                                                                    <div className='card'>
                                                                        <button className="btn btn-info" onClick={this.uploadFile2} style={{ textDecoration: "none" }}>Upload Document</button>
                                                                        <button className="btn btn-success" onClick={this.reUpload} style={{ textDecoration: "none" }}>ReProcessing</button>
                                                                    </div>
                                                                </>}

                                                        </p>}
                                                </p>}

                                        </div>
                                    </div>
                                )

                            })
                        }
                        <div className='row'>
                            <div className='col'>
                                <input type="file" id="uploadpdf2" accept='.pdf' className="border text-dark" style={{ width: "300px" }} />
                                <div className='row mt-2'>
                                    <div className='col'>
                                        <button className="btn btn-info" onClick={this.uploadFile2} style={{ textDecoration: "none" }}>Upload Document</button>
                                        &nbsp;
                                        <button className="btn btn-success" onClick={this.reUpload} style={{ textDecoration: "none" }}>ReProcessing</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div> : null
                } */}
            </div>
        );
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
        console.log(this.state.loanOfferList)
        return (
            <div className="container-dashboard d-flex flex-row" id="wrapper" style={{ marginTop: "-7px", backgroundColor: "#f4f7fc" }}>
                {
                    this.state.showLoader && <Loader />
                }
                <BorrowerSidebar />
                <div className="main-content" id="page-content-wrapper">
                    <div className="container-fluid row pt-2" style={{ marginBottom: "-11px" }}>
                        <div className="col-1" id="viewAllLoanreq">
                            <button style={{ marginLeft: "25px" }} onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className='col-4' id="viewAllLoanreq2" style={{ marginLeft: "20px", marginTop: "5px" }}>
                            <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                <Link to="/borrowerdashboard">Home</Link> / View Loan Requests</p>
                        </div>
                        <div className='col'>

                        </div>
                        <div className='col'>

                        </div>
                        <div className='col-3'>

                        </div>
                        <div className="col" id="viewAllLoanreq3">
                            <button style={myStyle}>
                                <Link to="/borrowerdashboard" style={{ marginLeft: "10px" }}><FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} /><span style={{ textDecoration: "none", color: "white" }}>Back</span></Link></button>
                        </div>
                    </div>
                    <hr className="col-11" style={{ marginLeft: "50px", marginTop: "1px", width: "88.6%", backgroundColor: "rgba(4,78,160,1)" }} />
                    {/* <div className='row'>
                        <div className="col">
                            <p className="d-flex justify-content-center" style={{ fontSize: "20px", marginTop: "-10px", fontWeight: "bold" }}>{t('MyLoanRequests')}</p>
                        </div>
                    </div> */}
                    {/* manual entities */}
                    {/* <div class="d-flex flex-row" style={{ marginLeft: "50px", marginTop: "-10px", fontWeight: "600", fontSize: "14px", color: "rgba(5,54,82,1)" }}>
                        <div class="pt-2 pb-2 pr-1">Show</div>
                        <div class="pt-2 pb-2">
                            <select onChange={this.perPage}>
                                <option defaultValue="5">5</option>
                                <option value="10">10</option>
                                <option value="20">20</option>
                            </select>
                        </div>
                        <div class="pt-2 pb-2 pl-1">Entries in a page</div>
                    </div> */}


                    <div className='container-fluid row' style={{ paddingLeft: "82px", marginTop: "-26px" }}>
                        <div className='card' style={{ overflow: "auto" }}>
                            <div className='row pt-2'>
                                <div className='col'>
                                    <ul role="tablist" className="nav nav-pills nav-fill mb-3" >
                                        <li className="nav-item"> <a data-toggle="pill" href="#myEarning-details" className="nav-link active detailsTab"
                                            style={{ textAlign: "center", paddingTop: "10px", paddingBottom: "10px" }}>
                                            <FaFileAlt />&nbsp; {t('MyLoanRequests')} </a> </li>
                                    </ul>

                                </div>
                            </div>

                            <div className='row' style={{ marginTop: "-30px" }}>
                                <div className='col'>
                                    <p style={{ fontWeight: "700", textAlign: "center", color: "rgba(31,88,126,1)", textDecoration: "underline" }}>{this.state.loanName}</p>
                                    <div className='tab-content'>
                                        <div id="myEarning-details" className="register-form tab-pane fade show active" style={{ cursor: "default" }}>
                                            {this.state.loanOfferList == "" ?
                                                <div className="row mt-2" style={{ marginLeft: "6px" }}>
                                                    <div className="col" style={{ textAlign: "center", color: "#222C70", fontSize: "14px", fontWeight: "500" }}>
                                                        <p>No Requests Available !</p>
                                                    </div>
                                                </div> :
                                                <>
                                                    <Table responsive>
                                                        <Thead>
                                                            <Tr style={{ fontSize: "15px", color: "rgba(5,54,82,1)", paddingLeft: "6px" }}>
                                                                <Th style={{ fontWeight: "600", marginTop: "5px" }}>Loan Request Number</Th>
                                                                <Th style={{ fontWeight: "600", marginTop: "5px" }}>Request Amount</Th>
                                                                <Th style={{ fontWeight: "600", marginTop: "5px" }}>Request Date</Th>
                                                                <Th style={{ fontWeight: "600", marginTop: "5px" }}></Th>
                                                                <Th></Th>
                                                            </Tr>
                                                        </Thead>
                                                        <Tbody>
                                                            {
                                                                this.state.loanOfferList.map((loan, index) => {
                                                                    return (
                                                                        <>
                                                                            <Tr key={index} style={{ backgroundColor: (index % 2 == 0) ? 'rgba(255,255,255,1)' : 'rgba(242,242,242,1)', color: "rgba(5,54,82,1)" }}>
                                                                                <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", paddingTop: "3px", paddingBottom: "3px" }}>{loan.loanreqno}</Td>
                                                                                <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", paddingTop: "3px", paddingBottom: "3px" }}>₹ {loan.requestedamt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</Td>
                                                                                <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", paddingTop: "3px", paddingBottom: "3px" }}>{loan.loanrequestdate.split("-").reverse().join("-")}</Td>
                                                                                <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", paddingTop: "3px", paddingBottom: "3px", cursor: "pointer" }}>
                                                                                    <button className='btn btn-sm text-white' onClick={() => this.handleToggle(loan, loan.loanreqno, loan.isstmtsverified, loan.productid, loan.loanstatus)} style={{ backgroundColor: "rgb(0, 121, 191)" }}>View</button>
                                                                                </Td>
                                                                            </Tr>
                                                                            {(loan.loanreqno === this.state.toggle) &&
                                                                                <Tr key={`details-${index}`} style={{ border: "1px solid rgba(40,116,166,1)", borderRadius: "5px", backgroundColor: "rgba(255,255,255,1)" }}>
                                                                                    <Td colSpan="5">
                                                                                        <div id="content">
                                                                                            <div className='row mt-2' style={{ textAlign: "left" }}>
                                                                                                <Results loanData={loan} />
                                                                                                <ResultsBar loanData={loan} />
                                                                                            </div>
                                                                                        </div>
                                                                                    </Td>
                                                                                </Tr>
                                                                            }
                                                                        </>
                                                                    )
                                                                })
                                                            }
                                                        </Tbody>
                                                    </Table>
                                                    {this.state.loanOfferList.length > 0 &&
                                                        <div className="row justify-content-end">
                                                            <div className='col-auto'>
                                                                <div className='card border-0' style={{ height: "40px" }}>
                                                                    <div style={{ marginTop: "-25px", marginLeft: "16px" }}>
                                                                        <ReactPaginate

                                                                            previousLabel={"<"}
                                                                            nextLabel={">"}
                                                                            breakLabel={"..."}
                                                                            breakClassName={"break-me"}
                                                                            pageCount={this.state.pageCount}
                                                                            onPageChange={this.handlePageClick}
                                                                            containerClassName={"pagination"}
                                                                            subContainerClassName={"pages pagination"}
                                                                            activeClassName={"active"}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>}
                                                </>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>


                        </div>
                    </div>
                    {/* lists */}

                    {/* <div className='row' id='container' style={{ marginTop: "-20px" }}>
                        <div className='col-12' id=''>
                            <div className='card' style={{ width: "92%", marginLeft: "50px", marginBottom: "10px", cursor: "default", paddingBottom: "20px" }}>

                                <div className='row' style={{ marginLeft: "8px", marginBottom: "-22px", fontWeight: "600", color: "rgba(5,54,82,1)" }}>
                                    <div className='col-4'>
                                        <p >Loan Request Number</p>
                                    </div>
                                    <div className='col-3'>
                                        <p style={{ marginLeft: "22px" }}>Request Amount</p>
                                    </div>
                                    <div className='col-3'>
                                        <p style={{ marginLeft: "11px" }}>Request Date</p>
                                    </div>
                                    <div className='col'>

                                    </div>
                                </div>
                                {
                                    this.state.loanOfferList.map((loan, index) => {
                                        return (
                                            <div key={loan.loanreqno}>

                                                <div className="row">
                                                    <div className="col">
                                                        <div className='card' href="javascript:;" style={{
                                                            marginBottom: "-10px", border: "1px solid rgba(40,116,166,1)", cursor: "default",
                                                            borderRadius: "5px", backgroundColor: (index % 2 == 0) ? 'rgba(255,255,255,1)' : 'rgba(242,242,242,1)'
                                                        }}>
                                                            <div className="row item-list align-items-center" style={{ color: "rgba(5,54,82,1)" }}>
                                                                <div className="col-3 mt-2">
                                                                    <h6 className="pl-4" style={{ fontWeight: "490" }}>{loan.loanreqno}</h6>
                                                                </div>
                                                                <div className="col-3 mt-2" style={{ textAlign: "end" }}>
                                                                    <h6 style={{ fontWeight: "490" }}>₹ {loan.requestedamt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</h6>
                                                                </div>
                                                                <div className="col-4 mt-2" style={{ textAlign: "center" }}>
                                                                    <h6 style={{ fontWeight: "490" }}>{loan.loanrequestdate.split("-").reverse().join("-")}</h6>
                                                                </div >
                                                                <div class="col" style={{ cursor: "pointer" }}>
                                                                    <button className='btn btn-sm text-white' onClick={() => this.handleToggle(loan, loan.loanreqno, loan.isstmtsverified, loan.productid, loan.loanstatus)}
                                                                        style={{ backgroundColor: "rgb(0, 121, 191)" }}>View</button>
                                                                </div>
                                                            </div>
                                                            {(loan.loanreqno === this.state.toggle) ?
                                                                <div id="content" style={{ border: "1px solid rgba(40,116,166,1)", borderRadius: "5px" }}>
                                                                    <div className='row mt-2'>
                                                                        <Results loanData={loan} />
                                                                        <ResultsBar loanData={loan} />
                                                                    </div>
                                                                </div> : ''}
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                        )
                                    })
                                }
                                <div className="row mt-1">
                                    <div className='col'></div>
                                    <div className='col'>
                                        <div className='card border-0'>
                                            <ReactPaginate
                                                previousLabel={"<"}
                                                nextLabel={">"}
                                                breakLabel={"..."}
                                                breakClassName={"break-me"}
                                                pageCount={this.state.pageCount}
                                                onPageChange={this.handlePageClick}
                                                containerClassName={"pagination"}
                                                subContainerClassName={"pages pagination"}
                                                activeClassName={"active"}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> */}

                    {/* Alert Modal */}
                    <button id='alertModal' style={{ display: "none" }} type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter">
                    </button>
                    <div className="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" data-backdrop="static">
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content" style={{ width: "300px", marginLeft: "100px" }}>
                                <div className="modal-body">
                                    <div className='row'>
                                        <div className='col'>
                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold" }}>
                                                Please Complete KYC Verification to accept Loan Offer.
                                            </p>
                                            <hr style={{ backgroundColor: "rgba(5,54,82,1)" }} />
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col' style={{ textAlign: "center" }}>
                                            <button type="button" class="btn text-white btn-sm" data-dismiss="modal"
                                                style={{ backgroundColor: "rgb(136, 189, 72)" }}>Ok</button>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/*  Modal */}
                    <button id='acceptfundalertModal' style={{ display: "none" }} type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter2">
                    </button>
                    <div className="modal fade" id="exampleModalCenter2" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" data-backdrop="static">
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content" style={{ width: "300px", marginLeft: "100px" }}>
                                <div className="modal-body">
                                    <div className='row'>
                                        <div className='col'>

                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold" }}>
                                                Please Complete KYC Verification to accept funding.
                                            </p>

                                            <hr style={{ backgroundColor: "rgba(5,54,82,1)" }} />
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col' style={{ textAlign: "center" }}>
                                            <button type="button" class="btn text-white btn-sm" data-dismiss="modal"
                                                style={{ backgroundColor: "rgb(136, 189, 72)" }}>Ok</button>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Ref Modal */}
                    <button type="button" id="viewRefModal" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal13" style={{ display: "none" }}>
                        Reference Details Modal
                    </button>
                    <div class="modal fade bd-example-modal-lg" id="exampleModal13" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true" data-backdrop="static">
                        <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
                            <div class="modal-content">
                                <div class="modal-body">
                                    <div className='row'>
                                        <button type="button" class="close" data-dismiss="modal" style={{ textAlign: "end", marginTop: "-15px", marginLeft: "-5px" }} aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>
                                    <div className='row'>
                                        <div className='col'>
                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "500" }}><FaRegFileAlt style={{ fontSize: "20px" }} />Reference Details</p>
                                            <hr style={{ width: "70px", marginTop: "-10px" }} />

                                            {/* Updated */}
                                            <div className='card border-0' style={{ cursor: "default", marginTop: "-10px" }}>
                                                <div style={{ border: "1px solid rgb(0, 121, 191)", borderRadius: "5px" }}>
                                                    {this.state.referenceLists == "" ?
                                                        <div className="row mt-2" style={{ marginLeft: "6px" }}>
                                                            <div className="col text-center" style={{ color: "#222C70", fontSize: "14px", fontWeight: "500" }}>
                                                                <p>No lists available.</p>
                                                            </div>
                                                        </div> :
                                                        <>
                                                            <div style={{ whiteSpace: "nowrap" }} id='secondAuditScroll'>
                                                                <Table responsive>
                                                                    <Thead>
                                                                        <Tr style={{ fontSize: "14px", color: "rgba(5,54,82,1)", paddingLeft: "6px" }}>
                                                                            <Th style={{ fontWeight: "bold", marginTop: "5px" }}>{t('Reference Name')}</Th>
                                                                            <Th style={{ fontWeight: "bold", marginTop: "5px" }}>{t('Reference Mobile No.')}</Th>
                                                                            <Th style={{ fontWeight: "bold", marginTop: "5px" }}>{t('Email ID')}</Th>
                                                                        </Tr>
                                                                    </Thead>
                                                                    <Tbody>
                                                                        {this.state.referenceLists.map((lists, index) => (
                                                                            <Tr key={index} style={{
                                                                                marginBottom: "-10px", transition: 'none', cursor: 'default', color: "rgba(5,54,82,1)",
                                                                                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", backgroundColor: (index % 2 === 0) ? 'rgba(255,255,255,1)' : 'rgba(242,242,242,1)'
                                                                            }}>
                                                                                <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}>{lists.refname}</Td>
                                                                                <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}>{lists.refmobile}</Td>
                                                                                <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}>{lists.refemail ? lists.refemail : "-"}</Td>
                                                                            </Tr>
                                                                        ))}
                                                                    </Tbody>
                                                                </Table>
                                                            </div>
                                                        </>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>


                            </div>
                        </div>
                    </div>
                    {/*  Disburse Modal */}
                    <button id='disburseAlertModal' style={{ display: "none" }} type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter3">
                    </button>
                    <div className="modal fade" id="exampleModalCenter3" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" data-backdrop="static">
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content" style={{ width: "300px", marginLeft: "100px" }}>
                                <div className="modal-body">
                                    <div className='row'>
                                        <div className='col'>

                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold" }}>
                                                Please Complete KYC Verification to disburse money.
                                            </p>
                                            <hr style={{ backgroundColor: "rgba(5,54,82,1)" }} />
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col' style={{ textAlign: "center" }}>
                                            <button type="button" class="btn text-white btn-sm" data-dismiss="modal"
                                                style={{ backgroundColor: "rgb(136, 189, 72)" }}>Ok</button>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Loan acceptance request Modal */}
                    <button id='loanAcceptModal' style={{ display: "none" }} type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter6">
                    </button>
                    <div className="modal fade" id="exampleModalCenter6" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" data-backdrop="static">
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content" id='theModalContent' style={{ marginLeft: "" }}>
                                <div className="modal-body">
                                    <div className='row'>
                                        <div className='col'>
                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold" }}><img src={batch} width="25px" />Enter OTP for funding acceptance</p>
                                            <hr style={{ width: "50px", marginTop: "-10px" }} />
                                            <div className='row'>
                                                <div style={{ display: "" }} className="col">
                                                    <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold", fontSize: "15px" }}>Mobile OTP</p>
                                                    <input className='form-control' type='number' placeholder='Enter OTP' id='loanAcceptInput' onChange={this.loanAcceptanceOtp}
                                                        onInput={(e) => {
                                                            e.target.value = Math.max(0, parseInt(e.target.value || 0, 10)).toString().slice(0, 6)
                                                        }}
                                                        autoComplete='off' style={{ marginTop: "-10px" }} />
                                                </div>
                                            </div>

                                            <div className='row mt-2'>
                                                <div className='col' style={{ textAlign: "end" }}>
                                                    <p id="countdown" style={{ color: "grey" }}></p>
                                                    <p id='countdown2' style={{ cursor: "pointer", fontWeight: "600", color: "rgba(5,54,82,1)", textDecorationLine: "underline" }} onClick={this.retriggerFundAcceptOTP}></p>
                                                </div>
                                            </div>
                                            <hr style={{ backgroundColor: "rgba(5,54,82,1)" }} />
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col' id='loanAcceptInputButtons' style={{ textAlign: "end" }}>
                                            <button type="button" class="btn text-white btn-sm" data-dismiss="modal"
                                                style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.verifyLoan}>Submit</button>
                                            &nbsp;
                                            <button type="button" class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "#0079BF" }} onClick={this.cancelAcceptFund}>Cancel</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pdf preview */}
                    <button type="button" id='launchColl' style={{ display: "none" }} class="btn btn-primary" data-toggle="modal" data-target=".bd-example-modal-lg">Large modal</button>

                    <div class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
                        <div class="modal-dialog modal-lg">
                            <div class="modal-content">
                                <iframe src="" className="PDFdoc" type="application/pdf" style={{ overflow: "auto", height: "100vh", width: "100%" }}>

                                </iframe>
                                <div className='pt-2' style={{ textAlign: "end", paddingRight: "15px" }}>
                                    <button type="button" class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "#0079BF" }}>Close</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* More details */}
                    <button id='moreDetailsModal' style={{ display: "none" }} type="button" class="btn btn-info" data-toggle="modal" data-target=".bd-example-modal-lg13">
                        More Details
                    </button>
                    <div class="modal fade bd-example-modal-lg13" id="myLargeModalLabel1" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel1" aria-hidden="true">
                        <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
                            <div className="modal-content">
                                <div className="modal-body">
                                    <div className='row'>
                                        <div className='col'>
                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold" }}><FaRegFileAlt style={{ fontSize: "24px" }} />More Details</p>
                                            <hr style={{ width: "70px" }} />
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col-5' id='headingRef'>
                                            <div className="two__image" style={{ paddingLeft: "10px" }}>
                                                <p className="text-white" style={{ paddingBottom: "6px", fontWeight: "600" }}>Consent Signing Status</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='card border-0' style={{ cursor: "default", marginTop: "-10px" }}>
                                        <div style={{ border: "1px solid rgb(0, 121, 191)", borderRadius: "5px" }}>
                                            {this.state.loanReqStatus == "" ?
                                                <div className="row mt-2" style={{ marginLeft: "6px" }}>
                                                    <div className="col text-center" style={{ color: "#222C70", fontSize: "14px", fontWeight: "500" }}>
                                                        <p>No lists available.</p>
                                                    </div>
                                                </div> :
                                                <>
                                                    {this.state.loanReqStatus && Object.keys(this.state.loanReqStatus).length !== 0 && (
                                                        <div style={{ whiteSpace: "nowrap" }} id='secondAuditScroll'>
                                                            <Table responsive>
                                                                <Thead>
                                                                    <Tr style={{ fontSize: "14px", color: "rgba(5,54,82,1)", paddingLeft: "6px" }}>
                                                                        <Th style={{ fontWeight: "bold", marginTop: "5px" }}>{t('Name')}</Th>
                                                                        <Th style={{ fontWeight: "bold", marginTop: "5px" }}>{t('Signing Status')}</Th>
                                                                        {/* <Th style={{ fontWeight: "bold", marginTop: "5px" }}>{t('Signed On')}</Th> */}
                                                                    </Tr>
                                                                </Thead>
                                                                <Tbody>
                                                                    {this.state.loanReqStatus.map((lists, index) => (
                                                                        <Tr key={index} style={{
                                                                            marginBottom: "-10px", transition: 'none', cursor: 'default', color: "rgba(5,54,82,1)",
                                                                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", backgroundColor: (index % 2 === 0) ? 'rgba(255,255,255,1)' : 'rgba(242,242,242,1)'
                                                                        }}>
                                                                            <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}>{lists.signername}</Td>
                                                                            <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}>{lists.signedstatus === 1 ? <span style={{ color: "rgb(29, 179, 69)" }}>Completed</span> : lists.signedstatus === 0 && "Pending"}</Td>
                                                                            {/* <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}>{lists.refemail ? lists.refemail : "-"}</Td> */}
                                                                        </Tr>
                                                                    ))}
                                                                </Tbody>
                                                            </Table>
                                                        </div>
                                                    )}
                                                    <div className='row mb-2 mt-2'>
                                                        <div className='col' style={{ textAlign: "end" }}>
                                                            <button className="btn btn-sm text-white" onClick={this.viewLoanReqDocu} style={{ backgroundColor: "#0079BF" }}><FaFileAlt />{t('View Loan Request Consent')}</button>
                                                        </div>
                                                    </div>
                                                </>}
                                        </div>
                                    </div>
                                    {/* {this.state.loanReqStatus && Object.keys(this.state.loanReqStatus).length !== 0 && (
                                        <>
                                            <div className='row'>
                                                <div className='col' style={{ color: "rgba(5,54,82,1)" }}>
                                                    <div className='row font-weight-normal' style={{ fontWeight: "800", fontSize: "15px", color: "rgba(5,54,82,1)", marginLeft: "10px" }}>
                                                        <div className='col-3'>
                                                            <p style={{ fontWeight: "600", marginLeft: "10px" }}>{t('Name')}</p>
                                                        </div>
                                                        <div className='col-3'>
                                                            <p style={{ fontWeight: "600", marginLeft: "3px" }}>{t('Status')}</p>
                                                        </div>
                                                        <div className='col-4'>
                                                            <p style={{ fontWeight: "600", marginLeft: "-5px" }}>{t('Signed on')}</p>
                                                        </div>

                                                    </div>
                                                    <hr className="col-12" style={{ marginLeft: "16px", width: "92%", marginTop: "-15px", backgroundColor: "rgb(5, 54, 82)" }} />
                                                    <div className='scrollbar' style={{ marginTop: "-10px", height: (this.state.loanReqStatus.length > 2 ? "240px" : "100px") }}>
                                                        {this.state.loanReqStatus.map((sign, index) => {
                                                            return (
                                                                <div className="col" key={index} style={{ marginBottom: "-10px" }}>
                                                                    <div className="card" style={{ borderRadius: "5px", cursor: "default" }}>
                                                                        <div className='form-check mt-2'>
                                                                            <div className='row'>
                                                                                <div className='col-3' style={{
                                                                                    color: "rgb(5, 54, 82)",
                                                                                    fontWeight: "400", fontSize: "14px", fontStyle: "Poppins"
                                                                                }}>
                                                                                    <span>{sign.signername}</span>
                                                                                </div>
                                                                                <div className='col-3' style={{
                                                                                    color: "rgb(5, 54, 82)",
                                                                                    fontWeight: "400", fontSize: "14px", fontStyle: "Poppins"
                                                                                }}>
                                                                                    <p style={{ color: "rgb(29, 179, 69)", textWrap: "wrap", }}>Completed</p>
                                                                                </div>
                                                                                <div className='col-4' style={{
                                                                                    color: "rgb(5, 54, 82)",
                                                                                    fontWeight: "400", fontSize: "14px", fontStyle: "Poppins"
                                                                                }}>
                                                                                    <span>{sign.signedon}</span>
                                                                                </div>

                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='row mb-2 mt-2'>
                                                <div className='col' style={{ textAlign: "end" }}>
                                                    <button className="btn btn-sm text-white" onClick={this.viewLoanReqDocu} style={{ backgroundColor: "#0079BF" }}><FaFileAlt />{t('View Loan Request Consent')}</button>
                                                </div>
                                            </div>
                                        </>
                                    )
                                    } */}
                                </div>
                                <div class="modal-footer">
                                    <button type="button" class="btn btn-sm btn-secondary" data-dismiss="modal" style={{ backgroundColor: "#0079BF" }}>Close</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Route to Thank You page */}
                <Link to="/viewSancLetter"><button id='viewSanction' style={{ display: "none" }}>Refresh
                </button></Link>
            </div>
        )
    }
}

export default withTranslation()(ViewAllLoanRequests)