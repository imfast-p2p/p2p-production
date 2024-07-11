import React, { Component } from 'react';
import $, { event } from 'jquery';
import { BASEURL } from '../../../assets/baseURL';
import SystemUserSidebar from '../../SystemUserSidebar';
import { withTranslation } from 'react-i18next';
import { FaPlus } from "react-icons/fa";
import { FaAngleLeft, FaAngleDoubleLeft, FaEdit } from "react-icons/fa";
import dashboardIcon from '../../../assets/icon_dashboard.png';
import { Link } from 'react-router-dom';
import * as FaIcons from "react-icons/fa";
import './ProductAttribute.css'
import prodAttr from '../../../assets/AdminImg/prodAttri.png';
import editRole from '../../../assets/editRole.png';
import { confirmAlert } from "react-confirm-alert";
import { BsInfoCircle } from "react-icons/bs";
import openIt from '../../../assets/AdminImg/openit.png'

var authAmt;
var authpurp;
var authint;
var authrpf;
var authgrace;
var authfund;
var authprodtype;
var authcur;
var authmem;
var authprod;

var amtisActive = "0";
var fundisActive = "0";
var graceisActive = "0";
var intisActive = "0";
var repayisActive = "0";
var prdPurpisActive = "0";

var workflowAssignFlag = false;
export class ProductAttribute extends Component {
    constructor(props) {
        super(props)
        this.state = {
            makerPermissions: [],
            checkerPermissions: [],
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
            listingPeriodDays: "",
            elcCoolingOff: "",

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

            productid: sessionStorage.getItem("productID"),
            productList: [],
            prodid: "",
            prodName: sessionStorage.getItem("prodName"),
            prodActive: sessionStorage.getItem("isActive"),
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
            borloanprocessingfixedpercentage: "",
            borloanprocessingmaxcap: "",
            elcfeefixedpercentage: "0",
            elcfeemaxcap: "",
            faccommissionamt: "0",
            evlcommissionfixedpercentage: "",
            evlcommissionmaxcap: "100",
            validfromdate: "",
            bllfeefixedpercentage: "",
            bllfeemaxcap: "",
            blefeefixedpercentage: "",
            blefeemaxcap: "",
            latepaymentpenaltyfixedpercentage: "",
            latepaymentpenaltymaxcap: "",
            borloanprocessingamt: "",
            elcfeeamt: "",
            faccommissionfixedpercentage: "",
            faccommissionmaxcap: "",
            evlcommissionamt: "",
            evlCommissionFlag: false,
            bllfeechargeruletype: "",
            evlcommissionchargeruletype: "",
            blefeechargeruletype: "",
            latepaymentpenaltychargeruletype: "",
            borloanprocessingchargeruletype: "",
            elcfeechargeruletype: "",
            faccommissionchargeruletype: "",

            loanPurposeGroup: [],
            filteredPurpose: [],

            workflowMasterList: [],
            workflowID: "",

            //charges
            chargesList: [],
            bllFeeObj: {},
            bleFeeObj: {},
            latePPObj: {},
            elcFeeObj: {},
            facComObj: {},
            evlComeObj: {},
            borLpfObj: {},

            chargeRuleList: [],
            chargeRuleList2: [],

            //error
            elcFeeFixPerError: false,
            elcFeeMaxCapError: false,
            borLoanProcessFeeFixPerError: false,
            borLoanProcessFeeMaxCapError: false,
            evlcommFixPerError: false,
            evlcommMaxCapError: false,
            editFlag: false,
            approveFlag: false,
            makerFlag: false,
            checkerFlag: false,

            toggle1Flag: false,
            toggle2Flag: false,
            toggle3Flag: false,
            toggle4Flag: false,
            toggle5Flag: false,
            toggle6Flag: false,
            toggle7Flag: false,
        }
    }
    componentDidMount() {
        sessionStorage.getItem("SysproductAuth");

        var storedArrayStringJSON = sessionStorage.getItem("rolePermData")
        var storedArray = JSON.parse(storedArrayStringJSON);
        console.log(storedArray);
        if (storedArray) {
            storedArray.forEach(element => {
                // if (element.rolename === "READ_PROD_INFO") {
                //     console.log(element.permissions);
                //     this.setState({ makerPermissions: element.permissions })
                // }
                if (element.rolename === "UPDATE_PROD_INFO") {
                    console.log(element.permissions);
                    this.setState({
                        makerPermissions: element.permissions,
                        makerFlag: true
                    })
                }

                if (element.rolename === "APPROVE_PROD_INFO") {
                    console.log(element.permissions);
                    this.setState({
                        checkerPermissions: element.permissions,
                        checkerFlag: true
                    })
                }
            });
        }


        var prodDefInfoList = sessionStorage.getItem("prodDefInfo");
        console.log(prodDefInfoList);
        var parseDPrdInfo = JSON.parse(prodDefInfoList)
        console.log(parseDPrdInfo);
        parseDPrdInfo.forEach(element => {
            console.log(element);
            if (element.defname == "AMOUNT") {
                amtisActive = element.defstatus;
                console.log(element.defstatus)
                console.log('Amount: ' + amtisActive)
                sessionStorage.setItem("defAmt", element.defstatus)

            } else if (element.defname == "FUNDING") {
                fundisActive = element.defstatus;
                console.log(element.defstatus)
                console.log('Funding: ' + fundisActive)
                sessionStorage.setItem("defFund", element.defstatus)

            } else if (element.defname == "GRACE") {
                graceisActive = element.defstatus;
                console.log(element.defstatus)
                console.log('Grace: ' + graceisActive)
                sessionStorage.setItem("defGrace", element.defstatus)

            } else if (element.defname == "INTEREST") {
                intisActive = element.defstatus;
                console.log(element.defstatus)
                console.log('Interest: ' + intisActive)
                sessionStorage.setItem("defInt", element.defstatus)

            } else if (element.defname == "REPAYMENT") {
                repayisActive = element.defstatus;
                console.log(element.defstatus)
                console.log('Dependents: ' + repayisActive)
                sessionStorage.setItem("defRepay", element.defstatus)

            } else if (element.defname == "PURPOSE") {
                prdPurpisActive = element.defstatus;
                console.log(element.defstatus)
                console.log('PPurpose: ' + prdPurpisActive)
                sessionStorage.setItem("defPpurp", element.defstatus)

            }
        });
        this.getProductDefamtInfo();
        this.getProductDefFundinginfo();
        this.getProductDefGraceinfo();
        this.getProductDefInterestinfo();
        this.getProductDefRepaymentinfo();
        this.getProductPurposeinfo();

        this.getWorkflowLists();
        console.log(this.state.makerPermissions, this.state.checkerPermissions)
        if (sessionStorage.getItem('editFlag') === "true") {
            this.setState({ editFlag: true })
        } else {
            this.setState({ editFlag: false })
        }
    }
    getProductDefamtInfo = () => {
        fetch(BASEURL + `/lms/getproductdefamtinfo?productid=` + sessionStorage.getItem('productID') +
            '&productname=' + sessionStorage.getItem("prodName") + '&isactive=' + amtisActive, {
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
                if (resdata.status === 'SUCCESS') {
                    console.log(resdata.msgdata)
                    this.setState({ authorized1: resdata.msgdata.authorized })
                    this.setState({ defloanamt: resdata.msgdata.defloanamt })
                    this.setState({ loanamtmultiple: resdata.msgdata.loanamtmultiple })
                    this.setState({ maxloanamt: resdata.msgdata.maxloanamt })
                    this.setState({ minloanamt: resdata.msgdata.minloanamt })
                    this.setState({ multipledisbursals: resdata.msgdata.multipledisbursals })
                    this.setState({ topup: resdata.msgdata.topup })

                    this.getCharges()
                } else {
                    //alert("Issue: " + resdata.message);
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
    getProductDefFundinginfo = () => {
        fetch(BASEURL + `/lms/getproductdeffundinginfo?productid=` + sessionStorage.getItem('productID') +
            '&productname=' + sessionStorage.getItem("prodName") + '&isactive=' + fundisActive, {
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
                if (resdata.status === 'SUCCESS') {
                    console.log(resdata.msgdata)
                    this.setState({ maxfundinginvestor: resdata.msgdata.maxfundinginvestor })
                    this.setState({ autoinvestlimit: resdata.msgdata.autoinvestlimit })
                    this.setState({ maxfundingcommit: resdata.msgdata.maxfundingcommit })
                    this.setState({ minfundingcommit: resdata.msgdata.minfundingcommit })
                    this.setState({ minautofundingcommit: resdata.msgdata.minautofundingcommit })
                    this.setState({ authorized2: resdata.msgdata.authorized })
                    this.setState({ fundinginmultiplesof: resdata.msgdata.fundinginmultiplesof })
                } else {
                    //alert("Issue: " + resdata.message);
                }
            })
    }
    getProductDefGraceinfo = () => {
        fetch(BASEURL + `/lms/getproductdefgraceinfo?productid=` + sessionStorage.getItem('productID') +
            '&productname=' + sessionStorage.getItem("prodName") + '&isactive=' + graceisActive, {
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
                if (resdata.status === 'SUCCESS') {
                    console.log(resdata.msgdata)
                    this.setState({
                        authorized3: resdata.msgdata.authorized,
                        elcdaysgrace: resdata.msgdata.elcdaysgrace,
                        gracedaysonarrears: resdata.msgdata.gracedaysonarrears,
                        gracedaysintpayment: resdata.msgdata.gracedaysintpayment,
                        arrearstoleranceamount: resdata.msgdata.arrearstoleranceamount,
                        gracedayspenalinterest: resdata.msgdata.gracedayspenalinterest,
                        latepenaltyfrequency: resdata.msgdata.latepenaltyfrequency,
                        overduedaysbeforenpa: resdata.msgdata.overduedaysbeforenpa,
                        gracedaysprincpayment: resdata.msgdata.gracedaysprincpayment,
                        // listingPeriodDays: resdata.msgdata.listingperioddays,
                        // elcCoolingOff: resdata.msgdata.elccoolingoffperiod
                    })
                } else {
                    //alert("Issue: " + resdata.message);
                }
            })
    }
    getProductDefInterestinfo = () => {
        fetch(BASEURL + `/lms/getproductdefinterestinfo?productid=` + sessionStorage.getItem('productID') +
            '&productname=' + sessionStorage.getItem("prodName") + '&isactive=' + intisActive, {
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
                if (resdata.status === 'SUCCESS') {
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
                    //alert("Issue: " + resdata.message);
                }
            })
    }
    getProductDefRepaymentinfo = () => {
        fetch(BASEURL + `/lms/getproductdefrepaymentinfo?productid=` + sessionStorage.getItem('productID') +
            '&productname=' + sessionStorage.getItem("prodName") + '&isactive=' + repayisActive, {
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
                if (resdata.status === 'SUCCESS') {
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
                    //alert("Issue: " + resdata.message);
                }
            })
    }
    getLoanpurpose = () => {
        fetch(BASEURL + '/lms/getloanpurpose', {
            method: "GET",
            headers: {
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            }
        }).then(response => {
            console.log('Response:', response)
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata)
                if (resdata.status === 'SUCCESS') {
                    console.log(resdata.msgdata);
                    this.setState({ loanPurposeGroup: resdata.msgdata });
                    $('#addProductPurpose').click();
                } else {
                    //alert("Issue: " + resdata.message);
                }
            })
    }
    filterPurpose = (event) => {
        this.state.loanPurposeGroup.filter((e) => e.loanpurposegrp == event.target.value).map((prdt, index) => {
            this.setState({ filteredPurpose: prdt.loanpurposeinfo })
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
                if (resdata.status === 'SUCCESS') {
                    console.log(resdata.msgdata)

                    this.setState({ loanPurposeDefList: resdata.msgdata })
                } else {
                    //alert("Issue: " + resdata.message);
                }
            })
    }
    setproductdefAmt = () => {
        window.location = "/setproductdefAmt"
    }
    setproductdefFund = () => {
        window.location = "/setproductdefFund"
    }
    setproductdefGrace = () => {
        window.location = "/setproductdefGrace"
    }
    setproductdefInterest = () => {
        window.location = "/setproductdefInterest"
    }
    setproductdefRepayment = () => {
        window.location = "/setproductdefRepayment"
    }
    // setproductPurpose = () => {
    //     window.location = "/setproductPurpose"
    // }
    getProductdefProductinfo = () => {
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
                if (resdata.status === 'SUCCESS') {
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
    }
    productPurpose = (event) => {
        this.setState({ loanpurposeid: event.target.value });
        console.log(this.state.loanpurposeid);
    }
    setproductPurpose = () => {
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
                    // alert(resdata.message);
                    confirmAlert({
                        message: resdata.message,
                        buttons: [
                            {
                                label: "Okay",
                                onClick: () => {
                                    this.getProductdefProductinfo();
                                },
                            },
                        ],
                    });

                    //window.location = '/productAttributes';
                } else {
                    confirmAlert({
                        message: resdata.message,
                        buttons: [
                            {
                                label: "Okay",
                                onClick: () => {
                                },
                            },
                        ],
                    });
                    //window.location.reload();
                }
            })
            .catch(err => {
                console.log(err.message)
            })
    }

    //product Launch
    authprodtype = (event) => {
        //this.setState({ authprodtype: event.target.value })
        console.log(event.target.checked)
        var valueData = event.target.checked;
        if (valueData == true) {
            authprodtype = "1"
        } else {
            authprodtype = "0"
        }
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
        //this.setState({ authcur: event.target.value })
        console.log(event.target.checked)
        var valueData = event.target.checked;
        if (valueData == true) {
            authcur = "1"
        } else {
            authcur = "0"
        }
    }
    authmem = (event) => {
        //this.setState({ authmem: event.target.value })
        console.log(event.target.checked)
        var valueData = event.target.checked;
        if (valueData == true) {
            authmem = "1"
        } else {
            authmem = "0"
        }
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
        //this.setState({ authprod: event.target.value })
        console.log(event.target.checked)
        var valueData = event.target.checked;
        if (valueData == true) {
            authprod = "1"
        } else {
            authprod = "0"
        }
    }
    bllfeeamt = (event) => {
        this.setState({ bllfeeamt: event.target.value })
    }
    bllfeefixedpercentage = (event) => {
        this.setState({ bllfeefixedpercentage: event.target.value })
    }
    bllfeemaxcap = (event) => {
        this.setState({ bllfeemaxcap: event.target.value })
    }
    blefeeamt = (event) => {
        this.setState({ blefeeamt: event.target.value })
    }
    blefeefixedpercentage = (event) => {
        this.setState({ blefeefixedpercentage: event.target.value })
    }
    blefeemaxcap = (event) => {
        this.setState({ blefeemaxcap: event.target.value })
    }
    latepaymentpenalty = (event) => {
        this.setState({ latepaymentpenalty: event.target.value })
    }
    latepaymentpenaltyfixedpercentage = (event) => {
        this.setState({ latepaymentpenaltyfixedpercentage: event.target.value })
    }
    latepaymentpenaltymaxcap = (event) => {
        this.setState({ latepaymentpenaltymaxcap: event.target.value })
    }
    borloanprocessingfixedpercentage = (event) => {
        this.setState({ borloanprocessingfixedpercentage: event.target.value })
        var inputValue = event.target.value;
        if (/^(\d(\.\d{1,2})?|1?\d(\.\d{1,2})?|20(\.00)?)$/.test(inputValue)) {
            this.setState({ borloanprocessingfixedpercentage: inputValue });
            this.setState({ borLoanProcessFeeFixPerError: false })
        } else {
            this.setState({ borLoanProcessFeeFixPerError: true })
        }
    }
    borloanprocessingmaxcap = (event) => {
        this.setState({ borloanprocessingmaxcap: event.target.value })
    }
    borloanprocessingamt = (event) => {
        this.setState({ borloanprocessingamt: event.target.value })
    }
    elcfeefixedpercentage = (event) => {
        this.setState({ elcfeefixedpercentage: event.target.value })
        var inputValue = event.target.value;
        if (/^(\d(\.\d{1,2})?|1?\d(\.\d{1,2})?|20(\.00)?)$/.test(inputValue)) {
            this.setState({ elcfeefixedpercentage: inputValue });
            this.setState({ elcFeeFixPerError: false })
        } else {
            this.setState({ elcFeeFixPerError: true })
        }
    }
    elcfeemaxcap = (event) => {
        this.setState({ elcfeemaxcap: event.target.value })
    }
    elcfeeamt = (event) => {
        this.setState({ elcfeeamt: event.target.value })
    }
    faccommissionamt = (event) => {
        this.setState({ faccommissionamt: event.target.value })
    }
    faccommissionmaxcap = (event) => {
        this.setState({ faccommissionmaxcap: event.target.value })
    }
    faccommissionfixedpercentage = (event) => {
        this.setState({ faccommissionfixedpercentage: event.target.value })
    }
    evlcommissionfixedpercentage = (event) => {
        this.setState({ evlcommissionfixedpercentage: event.target.value })
        var inputValue = event.target.value;
        if (/^(\d(\.\d{1,2})?|1?\d(\.\d{1,2})?|20(\.00)?)$/.test(inputValue)) {
            this.setState({ evlcommissionfixedpercentage: inputValue });
            this.setState({ evlcommFixPerError: false })
        } else {
            this.setState({ evlcommFixPerError: true })
        }
    }
    evlcommissionmaxcap = (event) => {
        this.setState({ evlcommissionmaxcap: event.target.value })
    }
    evlcommissionamt = (event) => {
        this.setState({ evlcommissionamt: event.target.value })
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
                authprodtype: authprodtype,
                authpurp: authpurp,
                authcur: authcur,
                authmem: authmem,
                authamt: authAmt,
                authint: authint,
                authrpf: authrpf,
                authgrace: authgrace,
                authfund: authfund,
                authprod: authprod,
                bllfeeamt: this.state.bllfeeamt,
                blefeeamt: this.state.blefeeamt,
                latepaymentpenalty: this.state.latepaymentpenalty,
                borloanprocessingfixedpercentage: this.state.borloanprocessingfixedpercentage,
                borloanprocessingmaxcap: this.state.borloanprocessingmaxcap,
                elcfeefixedpercentage: this.state.elcfeefixedpercentage,
                elcfeemaxcap: this.state.elcfeemaxcap,
                faccommissionamt: this.state.faccommissionamt,
                evlcommissionfixedpercentage: this.state.evlcommissionfixedpercentage,
                evlcommissionmaxcap: this.state.evlcommissionmaxcap,
                validfromdate: this.state.validfromdate,
                productname: sessionStorage.getItem("prodName"),

                borloanprocessingfixedamt: "0.00",
                elcfeefixedamt: "0.00",
                evlcommissionfixedamt: "0.00"
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
                                label: "Okay",
                                onClick: () => {
                                    if (workflowAssignFlag == true) {
                                        this.submitAssignWkflow();
                                    } else {
                                        window.location = "/productDefinition"
                                    }

                                },
                            },
                        ],
                    });
                } else {
                    confirmAlert({
                        message: resdata.message,
                        buttons: [
                            {
                                label: "Okay",
                                onClick: () => {
                                    //window.location.reload()
                                },
                            },
                        ],
                    });
                    //window.location.reload()
                }

            })
    }
    cancelAuthorizeProduct = () => {
        //window.location.reload()
        $("#cancelProduct").click();
    }
    discardProduct = () => {
        // fetch(BASEURL + `/lms/deletependingproduct`, {
        //     method: 'POST',
        //     headers: {
        //         'Accept': 'application/json',
        //         'Content-Type': 'application/json',
        //         'Authorization': "Bearer " + sessionStorage.getItem('token')
        //     },
        //     body: JSON.stringify({
        //         productid: sessionStorage.getItem("productID"),
        //         productname: sessionStorage.getItem("prodName"),
        //     })
        // }).then(response => {
        //     console.log(response)
        //     return response.json();
        // })
        //     .then((resdata) => {
        //         console.log(resdata)
        //         if (resdata.status == 'Success') {
        //             console.log(resdata.msgdata)
        //             confirmAlert({
        //                 message: "Product discarded successfully.",
        //                 buttons: [
        //                     {
        //                         label: "Okay",
        //                         onClick: () => {
        //                             window.location = "/productDefinition"
        //                         },
        //                     },
        //                 ],
        //             });
        //         } else {
        //             confirmAlert({
        //                 message: resdata.message,
        //                 buttons: [
        //                     {
        //                         label: "Okay",
        //                         onClick: () => {

        //                         },
        //                     },
        //                 ],
        //             });
        //         }
        //     })
        //     .catch(err => {
        //         console.log(err.message)
        //     })
        confirmAlert({
            message: "Product discarded successfully.",
            buttons: [
                {
                    label: "Okay",
                    onClick: () => {
                        window.location = "/productDefinition"
                    },
                },
            ],
        });
    }
    saveProduct = () => {
        window.location = ""
    }
    getWorkflowLists = () => {
        fetch(BASEURL + "/lms/getworkflowlist", {
            method: "GET",
            headers: {
                Authorization: "Bearer " + sessionStorage.getItem("token"),
            },
        })
            .then((response) => {
                console.log("Response:", response);
                return response.json();
            })
            .then((resdata) => {
                console.log(resdata);
                if (resdata.status == "SUCCESS") {
                    var workflowMasterList = resdata.msgdata;
                    console.log(workflowMasterList)

                    this.setState({ workflowMasterList: resdata.msgdata })
                } else {

                }
            })
            .catch(err => {
                console.log(err.message)
            })
    }
    workFlowID = (e) => {
        console.log(e.target.value)
        this.setState({ workflowID: e.target.value })
        if (e.target.value == "") {
            workflowAssignFlag = false;
            console.log(workflowAssignFlag)
        } else if (e.target.value == "Select Workflow") {
            workflowAssignFlag = false;
            console.log(workflowAssignFlag)
        } else {
            workflowAssignFlag = true;
            console.log(workflowAssignFlag)
        }

    }
    submitAssignWkflow = () => {
        fetch(BASEURL + '/lms/assignworkflow', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                productid: sessionStorage.getItem("productID"),
                workflowid: this.state.workflowID
            })
        }).then((Response) => {
            console.log(Response);
            return Response.json();
        })
            .then((resdata) => {
                if (resdata.status === 'Success') {
                    console.log(resdata);

                    confirmAlert({
                        message: resdata.message,
                        buttons: [
                            {
                                label: "Okay",
                                onClick: () => {
                                    window.location = "/productDefinition"
                                },
                            },
                        ],

                    });

                }
                else {
                    //alert(resdata.message)
                    window.location = "/productDefinition"
                }
            }).catch((error) => {
                console.log(error)
            })
    }
    getCharges = () => {
        fetch(BASEURL + "/lms/getcharges", {
            method: "GET",
            headers: {
                Authorization: "Bearer " + sessionStorage.getItem("token"),
            },
        })
            .then((response) => {
                console.log("Response:", response);
                return response.json();
            })
            .then((resdata) => {
                console.log(resdata);
                if (resdata.status == "SUCCESS") {
                    this.setState({ chargesList: resdata.msgdata });
                    var chargeLists = resdata.msgdata;
                    var chrgeID;
                    chargeLists.forEach((ele) => {
                        console.log(ele.chargeid);
                        chrgeID = ele.chargeid;
                        if (chrgeID === "BLLFEE") {
                            this.setState({ bllFeeObj: ele })
                        } else if (chrgeID === "BLEFEE") {
                            this.setState({ bleFeeObj: ele })
                        } else if (chrgeID === "LATEPP") {
                            this.setState({ latePPObj: ele })
                        } else if (chrgeID === "ELCFEE") {
                            this.setState({ elcFeeObj: ele })
                        } else if (chrgeID === "FACCOM") {
                            this.setState({ facComObj: ele })
                        } else if (chrgeID === "EVLCOM") {
                            this.setState({ evlComeObj: ele })
                        } else if (chrgeID === "BORLPF") {
                            this.setState({ borLpfObj: ele })
                        }
                    })
                    this.getChargeRules();
                } else {

                }
            })
            .catch(err => {
                console.log(err.message)
            })
    }
    // console.log(sessionStorage.getItem("isActive"))
    // console.log(sessionStorage.getItem('productID'));
    getChargeRules = () => {
        fetch(BASEURL + "/lms/getchargerules", {
            method: "GET",
            headers: {
                Authorization: "Bearer " + sessionStorage.getItem("token"),
            },
        })
            .then((response) => {
                console.log("Response:", response);
                return response.json();
            })
            .then((resdata) => {
                console.log(resdata);
                if (resdata.status == "SUCCESS") {
                    console.log(resdata);
                    const chargeRules = resdata.msgdata;
                    const targetProductId = sessionStorage.getItem("productID");
                    const chargeIds = ["BLLFEE", "LATEPP", "BLEFEE", "BORLPF", "ELCFEE", "FACCOM", "EVLCOM"];

                    const stateUpdateMap = {
                        "BLLFEE": (ele) => {
                            this.setState({ bllfeeamt: parseFloat(ele.chargeamount).toFixed(2) });
                            this.setState({ bllfeefixedpercentage: parseFloat(ele.fixedpercentage).toFixed(2) });
                            this.setState({ bllfeemaxcap: parseFloat(ele.maxcap).toFixed(2) });
                            this.setState({ bllfeechargeruletype: ele.chargeruletype });
                            this.setState({ bllfeechargeruletype: ele.chargeruletype }, () => {
                                console.log(this.state.bllfeechargeruletype)
                                if (this.state.bllfeechargeruletype === "2") {
                                    this.setState({ toggle1Flag: true })
                                }
                                else {
                                    this.setState({ toggle1Flag: false })
                                }
                            });
                        },

                        "BLEFEE": (ele) => {
                            this.setState({ blefeeamt: parseFloat(ele.chargeamount).toFixed(2) });
                            this.setState({ blefeefixedpercentage: parseFloat(ele.fixedpercentage).toFixed(2) });
                            this.setState({ blefeemaxcap: parseFloat(ele.maxcap).toFixed(2) });
                            this.setState({ blefeechargeruletype: ele.chargeruletype }, () => {
                                console.log(this.state.blefeechargeruletype)
                                if (this.state.blefeechargeruletype === "2") {
                                    this.setState({ toggle2Flag: true })
                                }
                                else {
                                    this.setState({ toggle2Flag: false })
                                }
                            });
                        },

                        "LATEPP": (ele) => {
                            this.setState({ latepaymentpenalty: parseFloat(ele.chargeamount).toFixed(2) });
                            this.setState({ latepaymentpenaltyfixedpercentage: parseFloat(ele.fixedpercentage).toFixed(2) });
                            this.setState({ latepaymentpenaltymaxcap: parseFloat(ele.maxcap).toFixed(2) });
                            this.setState({ latepaymentpenaltychargeruletype: ele.chargeruletype }, () => {
                                console.log(this.state.latepaymentpenaltychargeruletype)
                                if (this.state.latepaymentpenaltychargeruletype === "2") {
                                    this.setState({ toggle3Flag: true })
                                }
                                else {
                                    this.setState({ toggle3Flag: false })
                                }
                            });
                        },

                        "BORLPF": (ele) => {
                            this.setState({ borloanprocessingamt: parseFloat(ele.chargeamount).toFixed(2) });
                            this.setState({ borloanprocessingfixedpercentage: parseFloat(ele.fixedpercentage).toFixed(2) });
                            this.setState({ borloanprocessingmaxcap: parseFloat(ele.maxcap).toFixed(2) });
                            this.setState({ borloanprocessingchargeruletype: ele.chargeruletype }, () => {
                                console.log(this.state.borloanprocessingchargeruletype)
                                if (this.state.borloanprocessingchargeruletype === "2") {
                                    this.setState({ toggle4Flag: true })
                                }
                                else {
                                    this.setState({ toggle4Flag: false })
                                }
                            });
                        },
                        "ELCFEE": (ele) => {
                            this.setState({ elcfeeamt: parseFloat(ele.chargeamount).toFixed(2) });
                            this.setState({ elcfeefixedpercentage: parseFloat(ele.fixedpercentage).toFixed(2) });
                            this.setState({ elcfeemaxcap: parseFloat(ele.maxcap).toFixed(2) });
                            this.setState({ elcfeechargeruletype: ele.chargeruletype }, () => {
                                console.log(this.state.elcfeechargeruletype)
                                if (this.state.elcfeechargeruletype === "2") {
                                    this.setState({ toggle5Flag: true })
                                }
                                else {
                                    this.setState({ toggle5Flag: false })
                                }
                            });
                        },
                        "FACCOM": (ele) => {
                            this.setState({ faccommissionamt: parseFloat(ele.chargeamount).toFixed(2) });
                            this.setState({ faccommissionfixedpercentage: parseFloat(ele.fixedpercentage).toFixed(2) });
                            this.setState({ faccommissionmaxcap: parseFloat(ele.maxcap).toFixed(2) });
                            this.setState({ faccommissionchargeruletype: ele.chargeruletype }, () => {
                                console.log(this.state.faccommissionchargeruletype)
                                if (this.state.faccommissionchargeruletype === "2") {
                                    this.setState({ toggle6Flag: true })
                                }
                                else {
                                    this.setState({ toggle6Flag: false })
                                }
                            });
                        },
                        "EVLCOM": (ele) => {
                            this.setState({ evlcommissionamt: parseFloat(ele.chargeamount).toFixed(2) });
                            this.setState({ evlcommissionfixedpercentage: parseFloat(ele.fixedpercentage).toFixed(2) });
                            this.setState({ evlcommissionmaxcap: parseFloat(ele.maxcap).toFixed(2) });
                            this.setState({ evlcommissionchargeruletype: ele.chargeruletype }, () => {
                                console.log(this.state.evlcommissionchargeruletype)
                                if (this.state.evlcommissionchargeruletype === "2") {
                                    this.setState({ toggle7Flag: true })
                                }
                                else {
                                    this.setState({ toggle7Flag: false })
                                }
                            });
                        }
                    };


                    chargeIds.forEach(chargeId => {
                        let matchedCharge = chargeRules.find(rule => rule.productid === targetProductId && rule.chargeid === chargeId);
                        if (!matchedCharge) {
                            matchedCharge = chargeRules.find(rule => rule.productid === "ALL" && rule.chargeid === chargeId);
                        }
                        if (matchedCharge && stateUpdateMap[chargeId]) {
                            stateUpdateMap[chargeId](matchedCharge);
                        }
                    });
                    let filteredData = chargeRules.filter(item => {
                        return (
                            chargeIds.includes(item.chargeid) &&
                            (item.productid === targetProductId || item.productid === "ALL")
                        );
                    });
                    console.log(filteredData);
                    // Create a map to keep track of chargeid presence
                    let chargeIdMap = {};

                    // Remove duplicates based on chargeid, prioritizing targetProductId over "ALL"
                    let uniqueFilteredData = [];
                    filteredData.forEach(item => {
                        if (!(item.chargeid in chargeIdMap)) {
                            uniqueFilteredData.push(item);
                            chargeIdMap[item.chargeid] = true;
                        } else if (item.productid !== "ALL") {
                            // Replace the record with "ALL" productid with the one with specific productid
                            uniqueFilteredData = uniqueFilteredData.filter(i => i.chargeid !== item.chargeid);
                            uniqueFilteredData.push(item);
                        }
                    });
                    console.log("Prioritized Filtered Data:", uniqueFilteredData);
                    this.setState({ chargeRuleList2: uniqueFilteredData });
                } else {

                }
            })
            .catch(err => {
                console.log(err.message)
            })
    }
    viewChargeRulesBasedOnID = () => {
        $("#viewChargeRulesBasedOnID").click();
    }
    // Authorize Product Purpose
    authorizeProductPurpose = (list) => {
        fetch(BASEURL + '/lms/authorizeproductpurpose', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                productid: sessionStorage.getItem('productID'),
                loanpurposeid: list.loanpurposeid,
            })
        }).then(response => {
            console.log(response)
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata)
                if (resdata.status === 'Success' || resdata.status === 'SUCCESS') {
                    console.log(resdata.msgdata)
                    confirmAlert({
                        message: resdata.message,
                        buttons: [
                            {
                                label: "Okay",
                                onClick: () => {

                                },
                            },
                        ],
                    });
                } else {
                    confirmAlert({
                        message: resdata.message,
                        buttons: [
                            {
                                label: "Okay",
                                onClick: () => {

                                },
                            },
                        ],

                    });
                }
            })
            .catch(err => {
                console.log(err.message)
            })
    }
    enableProductEdit = (params) => {
        console.log(params)
        if (params === "editPrdt") {
            this.setState({ editFlag: true }, () => {
                sessionStorage.setItem("editFlag", true)
            })
        } else if (params === "approvePdt") {
            this.setState({ approveFlag: true })
        }
    }
    toggle1 = (event) => {
        const newValue = event.target.checked ? 1 : 0;
        console.log(event.target.checked, newValue)
        if (newValue === 1) {
            this.setState({ toggle1Flag: true })
        }
        else if (newValue === 0) {
            this.setState({ toggle1Flag: false })
        }
    }
    toggle2 = (event) => {
        const newValue = event.target.checked ? 1 : 0;
        console.log(event.target.checked, newValue)
        if (newValue === 1) {
            this.setState({ toggle2Flag: true })
        }
        else if (newValue === 0) {
            this.setState({ toggle2Flag: false })
        }
    }
    toggle3 = (event) => {
        const newValue = event.target.checked ? 1 : 0;
        console.log(event.target.checked, newValue)
        if (newValue === 1) {
            this.setState({ toggle3Flag: true })
        }
        else if (newValue === 0) {
            this.setState({ toggle3Flag: false })
        }
    }
    toggle4 = (event) => {
        const newValue = event.target.checked ? 1 : 0;
        console.log(event.target.checked, newValue)
        if (newValue === 1) {
            this.setState({ toggle4Flag: true })
        }
        else if (newValue === 0) {
            this.setState({ toggle4Flag: false })
        }
    }
    toggle5 = (event) => {
        const newValue = event.target.checked ? 1 : 0;
        console.log(event.target.checked, newValue)
        if (newValue === 1) {
            this.setState({ toggle5Flag: true })
        }
        else if (newValue === 0) {
            this.setState({ toggle5Flag: false })
        }
    }
    toggle6 = (event) => {
        const newValue = event.target.checked ? 1 : 0;
        console.log(event.target.checked, newValue)
        if (newValue === 1) {
            this.setState({ toggle6Flag: true })
        }
        else if (newValue === 0) {
            this.setState({ toggle6Flag: false })
        }
    }
    toggle7 = (event) => {
        const newValue = event.target.checked ? 1 : 0;
        console.log(event.target.checked, newValue)
        if (newValue === 1) {
            this.setState({ toggle7Flag: true })
        }
        else if (newValue === 0) {
            this.setState({ toggle7Flag: false })
        }
    }
    handleChange() {
        $('.text').toggle();
    }

    render() {
        const { t } = this.props
        console.log(this.state.toggle1Flag);
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
        const Style1 = {
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
            marginLeft: "14px",
            float: "right"
        }
        console.log(sessionStorage.getItem("isActive"))
        var prodID = sessionStorage.getItem('productID');
        var productAuth = sessionStorage.getItem("SysproductAuth");
        var prodName = sessionStorage.getItem('prodName');
        var prodDesc = sessionStorage.getItem('prodDesc');
        var currencyCode = sessionStorage.getItem('currencyCode');
        var memGrp = sessionStorage.getItem('memberGrp');
        const { makerPermissions, checkerPermissions, makerFlag, checkerFlag, editFlag, approveFlag } = this.state;
        console.log(makerPermissions, checkerPermissions, makerFlag, checkerFlag);
        return (
            <div className="container-dashboard d-flex flex-row" id="wrapper" style={{ backgroundColor: "#f4f7fc" }}>
                <SystemUserSidebar />
                <div className="pl-3 pr-3 main-content" id="page-content-wrapper">
                    <div className="container-fluid row pt-2">
                        <div className="col-1" id="ProductAttrRes1">
                            <button style={{ marginLeft: "25px" }} onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className='col-6' id="ProductAttrRes2" style={{ marginLeft: "20px", marginTop: "5px" }}>
                            <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                <Link to="/sysUserDashboard">Home</Link> / <Link to="/productDefinition">Product List</Link> / Product Attributes </p>
                        </div>
                        <div className='col'>

                        </div>
                        <div className='col'>

                        </div>
                        <div className='col'>

                        </div>
                        <div className="col" id="ProductAttrRes3">
                            <button style={myStyle}>
                                <Link to="/productDefinition" style={{ marginLeft: "10px" }}><FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} /><span style={{ textDecoration: "none", color: "white" }}>Back</span></Link></button>
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
                                        {/* <div className='col-4' style={{ color: "#222c70", fontSize: "16px", paddingTop: "5px", textAlign: "center" }}>
                                            <div>
                                                <p className="mb-0 font-weight-bold">Product Name: <span style={{ fontWeight: "400" }}>{prodID}</span></p>
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
                                                            {sessionStorage.getItem('isdisbursed') &&
                                                                <div className='row'>
                                                                    <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                        <p className="mb-0 font-weight-bold">Amount Disburse To</p>
                                                                    </div>
                                                                    <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                        <p className="mb-0 font-weight-bold">:</p>
                                                                    </div>
                                                                    <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                        <p className="mb-0">{sessionStorage.getItem('isdisbursed') === "1" ?
                                                                            "Supplier Account" :
                                                                            sessionStorage.getItem('isdisbursed') === "0" &&
                                                                            "Borrower Account"}</p>
                                                                    </div>
                                                                </div>
                                                            }
                                                        </div>

                                                        <div className="col" style={{ color: "#222c70", fontSize: "14px" }}>
                                                            <div className='row'>
                                                                <div className='col-lg-12' style={{ textAlign: "end" }}>
                                                                    {makerFlag ?
                                                                        <p className="mb-0 font-weight-bold">
                                                                            <FaEdit id="enableDisableWkflw" style={{ cursor: "pointer" }} onClick={() => this.enableProductEdit("editPrdt")} />
                                                                            &nbsp;
                                                                            Edit</p> :
                                                                        (checkerFlag && sessionStorage.getItem("approvePrdtFlag") === "true") ?
                                                                            <p className="mb-0 font-weight-bold">
                                                                                <FaEdit id="enableDisableWkflw" style={{ cursor: "pointer" }} onClick={() => this.enableProductEdit("approvePdt")} />
                                                                                &nbsp;
                                                                                Approve</p> : ""
                                                                    }
                                                                </div>
                                                            </div>
                                                        </div>
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

                                                        {makerPermissions.map((permission, index) => {
                                                            if (permission.permissionname === "SET_PRODUCT_DEF_AMT_INFO" && permission.status === "1") {
                                                                return (
                                                                    editFlag && (
                                                                        <div className='col-2 makerEditCommon' style={{ textAlign: "end" }} key={index}>
                                                                            <Link to="/setproductdefAmt">
                                                                                <button className='btn btn-sm'
                                                                                    //onClick={this.setproductdefAmt}
                                                                                    style={{ border: "2px solid #0079bf", marginTop: "-8px", color: "#0079bf" }}>
                                                                                    <FaIcons.FaEdit style={{ marginTop: "-4px" }} />&nbsp;<span>Edit</span>
                                                                                </button>
                                                                            </Link>
                                                                        </div>
                                                                    )
                                                                )
                                                            }
                                                        })}
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
                                                                    <p className="mb-0 font-weight-bold">Authorised</p>
                                                                </div>
                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                </div>
                                                                <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                    {
                                                                        this.state.authorized1 == "0" ? <p className="mb-0">Not Authorised</p> : <span>{this.state.authorized1 == "1" ? <p className="mb-0">Authorised</p> : ""}</span>
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
                                                                    {
                                                                        this.state.loanamtmultiple ?
                                                                            <p className="mb-0">
                                                                                ₹ {parseFloat(this.state.loanamtmultiple).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
                                                                            </p> : "-"
                                                                    }
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
                                                                    {this.state.topup == "0" ? <p className="mb-0">Not Allowed</p> : <span>{this.state.topup == "1" ? <p className="mb-0">Allowed</p> : ""}</span>}

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
                                                                        this.state.multipledisbursals == "0" ? <p className="mb-0">Not Allowed</p> : <span>{this.state.multipledisbursals == "1" ? <p className="mb-0">Allowed</p> : ""}</span>
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
                                                    {checkerPermissions.map((permission, index) => {
                                                        if (permission.permissionname === "AUTHORIZE_PRODUCT_LAUNCH" && permission.status === "1") {
                                                            return (
                                                                approveFlag && (
                                                                    <div className='row pl-2 pr-2 pb-2'>
                                                                        <div className='col-12 form-check' style={{ textAlign: "end" }}>
                                                                            <input class="form-check-input" type="checkbox" value="1" id="flexCheckDefault" onChange={this.authamt} />
                                                                            <label class="form-check-label" for="flexCheckDefault" style={{ fontFamily: "Poppins,sans-serif", fontSize: "15px", color: "rgb(34, 44, 112)" }} >Authorise</label>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            )
                                                        }
                                                    })}
                                                </div>
                                            </div>

                                            <div className='card' style={{ cursor: "default" }}>
                                                <div className='form-group pl-2 pr-2 pt-2'>
                                                    <div className='row'>
                                                        <div className='col-10' id="" style={{ fontFamily: "Poppins,sans-serif", fontWeight: "bold", color: "#222c70", fontSize: "15px" }}>
                                                            <img src={prodAttr} style={{ marginTop: "-6px", width: "15px", marginLeft: "1px" }} />&nbsp;<span>Interest Information</span>
                                                            <hr style={{ marginTop: "1px", backgroundColor: "rgba(4,78,160,1)" }} />
                                                        </div>
                                                        {makerPermissions.map((permission, index) => {
                                                            if (permission.permissionname === "SET_PRODUCT_DEF_INTEREST_INFO" && permission.status === "1") {
                                                                return (
                                                                    editFlag && (
                                                                        <div className='col-2' style={{ textAlign: "end" }}>
                                                                            <Link to="/setproductdefInterest">
                                                                                <button className='btn btn-sm'
                                                                                    // onClick={this.setproductdefInterest}
                                                                                    style={{ border: "2px solid #0079bf", marginTop: "-8px", color: "#0079bf" }}><FaIcons.FaEdit style={{ marginTop: "-4px" }} />&nbsp;
                                                                                    <span>Edit</span>
                                                                                </button>
                                                                            </Link>
                                                                        </div>
                                                                    )
                                                                )
                                                            }
                                                        })}
                                                    </div>

                                                    <div className='row pl-2 pr-2'>
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
                                                                    <p className="mb-0 font-weight-bold">Authorised</p>
                                                                </div>
                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                </div>
                                                                <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                    {
                                                                        this.state.authorized4 == "0" ? <p className="mb-0">Not Authorised</p> : <span>{this.state.authorized4 == "1" ? <p className="mb-0">Authorised</p> : ""}</span>
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
                                                                        this.state.allowpartialperiodintcalc == "0" ? <p className="mb-0">Not Allowed</p> : <span>{this.state.allowpartialperiodintcalc == "1" ? <p className="mb-0">Allowed</p> : ""}</span>
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
                                                                    <p className="mb-0">{this.state.teaserintstdate ? this.state.teaserinterestrate : "-"}</p>
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
                                                                    <p className="mb-0">{this.state.teaserintenddate ? this.state.teaserintenddate : "-"}</p>
                                                                </div>
                                                            </div>

                                                        </div>
                                                        <div className='col' style={{ color: "#222c70", fontSize: "14px" }}>
                                                            <div className='row'>
                                                                <div className='col-sm-7 col-md-7 col-lg-7'>
                                                                    <p className="mb-0 font-weight-bold">Interest Calculator Method</p>
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
                                                                    <p className="mb-0 font-weight-bold">Teaser Interest Rate</p>
                                                                </div>
                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                </div>
                                                                <div className='col-sm-4 col-md-4 col-lg-4'>
                                                                    <p className="mb-0">{this.state.teaserintrateallowed === "1" ? "Allowed" :
                                                                        this.state.teaserintrateallowed === "0" ? "Not Allowed" : "-"}</p>
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
                                                    {checkerPermissions.map((permission, index) => {
                                                        if (permission.permissionname === "AUTHORIZE_PRODUCT_LAUNCH" && permission.status === "1") {
                                                            return (
                                                                approveFlag && (
                                                                    <div className='row pl-2 pr-2 pb-2'>
                                                                        <div className='col-12 form-check' style={{ textAlign: "end" }}>
                                                                            <input class="form-check-input" type="checkbox" value="1" id="flexCheckDefault" onChange={this.authint} />
                                                                            <label class="form-check-label" for="flexCheckDefault" style={{ fontFamily: "Poppins,sans-serif", fontSize: "15px", color: "rgb(34, 44, 112)" }} >Authorise</label>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            )
                                                        }
                                                    })}
                                                </div>
                                            </div>

                                            <div className='card' style={{ cursor: "default" }}>
                                                <div className='form-group pl-2 pr-2 pt-2'>
                                                    <div className='row'>
                                                        <div className='col-10' id="" style={{ fontFamily: "Poppins,sans-serif", fontWeight: "bold", color: "#222c70", fontSize: "15px" }}>
                                                            <img src={prodAttr} style={{ marginTop: "-6px", width: "15px", marginLeft: "1px" }} />&nbsp;<span>Repayment Information</span>
                                                            <hr style={{ marginTop: "1px", backgroundColor: "rgba(4,78,160,1)" }} />
                                                        </div>
                                                        {makerPermissions.map((permission, index) => {
                                                            if (permission.permissionname === "SET_PRODUCT_DEF_REPAYMENT_INFO" && permission.status === "1") {
                                                                return (
                                                                    editFlag && (
                                                                        <div className='col-2' style={{ textAlign: "end" }}>
                                                                            <Link to="/setproductdefRepayment">
                                                                                <button className='btn btn-sm'
                                                                                    // onClick={this.setproductdefRepayment}
                                                                                    style={{ border: "2px solid #0079bf", marginTop: "-8px", color: "#0079bf" }}><FaIcons.FaEdit style={{ marginTop: "-4px" }} />&nbsp;<span>Edit</span></button>
                                                                            </Link>
                                                                        </div>
                                                                    )
                                                                )
                                                            }
                                                        })}
                                                    </div>

                                                    <div className='row pl-2 pr-2'>
                                                        <div className='col' style={{ color: "#222c70", fontSize: "14px" }}>
                                                            <div className='row'>
                                                                <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                    <p className="mb-0 font-weight-bold">Partial Pre Payment</p>
                                                                </div>
                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                </div>
                                                                <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                    {this.state.partialprepaymentallowed == "0" ? <p className="mb-0">Not Allowed</p> : <span>{this.state.partialprepaymentallowed == "1" ? <p className="mb-0">Allowed</p> : ""}</span>}

                                                                </div>
                                                            </div>
                                                            <div className='row'>
                                                                <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                    <p className="mb-0 font-weight-bold">Authorised</p>
                                                                </div>
                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                </div>
                                                                <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                    {
                                                                        this.state.authorized5 == "0" ? <p className="mb-0">Not Authorised</p> : <span>{this.state.partialprepaymentallowed == "1" ? <p className="mb-0">Authorised</p> : ""}</span>
                                                                    }

                                                                </div>
                                                            </div>
                                                            <div className='row'>
                                                                <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                    <p className="mb-0 font-weight-bold">Minimum Days Before First Installments</p>
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
                                                                    <p className="mb-0 font-weight-bold">Allow Installments</p>
                                                                </div>
                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                </div>
                                                                <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                    {this.state.allowvarinstallments == "0" ? <p className="mb-0">Not Allowed</p> : <span>{this.state.allowvarinstallments == "1" ? <p className="mb-0">Allowed</p> : ""}</span>}
                                                                </div>
                                                            </div>
                                                            <div className='row'>
                                                                <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                    <p className="mb-0 font-weight-bold">Minimum No. Of Repayments</p>
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
                                                                    <p className="mb-0 font-weight-bold">EPI Multiple</p>
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
                                                                    <p className="mb-0 font-weight-bold">Sync. With Disburse Date</p>
                                                                </div>
                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                </div>
                                                                <div className='col-sm-4 col-md-4 col-lg-4'>
                                                                    <p className="mb-0">{this.state.syncwithdisbursedate === "1" ? "Yes" : this.state.syncwithdisbursedate === "0" ? "No" : "-"}</p>
                                                                </div>
                                                            </div>
                                                            <div className='row'>
                                                                <div className='col-sm-7 col-md-7 col-lg-7'>
                                                                    <p className="mb-0 font-weight-bold">No. Of Repayments Default</p>
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
                                                                    <p className="mb-0 font-weight-bold">Full Prepayment Allowed</p>
                                                                </div>
                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                </div>
                                                                <div className='col-sm-4 col-md-4 col-lg-4'>
                                                                    {this.state.fullprepaymentallowed == "0" ? <p className="mb-0">Not Allowed</p> : <span>{this.state.fullprepaymentallowed == "1" ? <p className="mb-0">Allowed</p> : ""}</span>}

                                                                </div>
                                                            </div>
                                                            <div className='row'>
                                                                <div className='col-sm-7 col-md-7 col-lg-7'>
                                                                    <p className="mb-0 font-weight-bold">Principal Threshold Last Interest</p>
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
                                                                    <p className="mb-0 font-weight-bold">Maximum No. Of Repayments</p>
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
                                                    {checkerPermissions.map((permission, index) => {
                                                        if (permission.permissionname === "AUTHORIZE_PRODUCT_LAUNCH" && permission.status === "1") {
                                                            return (
                                                                approveFlag && (
                                                                    <div className='row pl-2 pr-2 pb-2'>
                                                                        <div className='col-12 form-check' style={{ textAlign: "end" }}>
                                                                            <input class="form-check-input" type="checkbox" value="1" id="flexCheckDefault" onChange={this.authrpf} />
                                                                            <label class="form-check-label" for="flexCheckDefault" style={{ fontFamily: "Poppins,sans-serif", fontSize: "15px", color: "rgb(34, 44, 112)" }} >Authorise</label>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            )
                                                        }
                                                    })}
                                                </div>
                                            </div>

                                            <div className='card' style={{ cursor: "default" }}>
                                                <div className='form-group pl-2 pr-2 pt-2'>
                                                    <div className='row'>
                                                        <div className='col-10' id="" style={{ fontFamily: "Poppins,sans-serif", fontWeight: "bold", color: "#222c70", fontSize: "15px" }}>
                                                            <img src={prodAttr} style={{ marginTop: "-6px", width: "15px", marginLeft: "1px" }} />&nbsp;<span>Grace Information</span>
                                                            <hr style={{ marginTop: "1px", backgroundColor: "rgba(4,78,160,1)" }} />
                                                        </div>
                                                        {makerPermissions.map((permission, index) => {
                                                            if (permission.permissionname === "SET_PRODUCT_DEF_GRACE_INFO" && permission.status === "1") {
                                                                return (
                                                                    editFlag && (
                                                                        <div className='col-2' style={{ textAlign: "end" }}>
                                                                            <Link to="/setproductdefGrace">
                                                                                <button className='btn btn-sm'
                                                                                    //onClick={this.setproductdefGrace}
                                                                                    style={{ border: "2px solid #0079bf", marginTop: "-8px", color: "#0079bf" }}><FaIcons.FaEdit style={{ marginTop: "-4px" }} />&nbsp;<span>Edit</span></button>
                                                                            </Link>
                                                                        </div>
                                                                    )
                                                                )
                                                            }
                                                        })}
                                                    </div>
                                                    <div className='row pl-2 pr-2'>
                                                        <div className='col' style={{ color: "#222c70", fontSize: "14px" }}>
                                                            <div className='row'>
                                                                <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                    <p className="mb-0 font-weight-bold">ELC Days Grace</p>
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
                                                                    <p className="mb-0 font-weight-bold">Authorised</p>
                                                                </div>
                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                </div>
                                                                <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                    {
                                                                        this.state.authorized3 == "0" ? <p className="mb-0">Not Authorised</p> : <span>{this.state.authorized3 == "1" ? <p className="mb-0">Authorised</p> : ""}</span>
                                                                    }

                                                                </div>
                                                            </div>
                                                            <div className='row'>
                                                                <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                    <p className="mb-0 font-weight-bold">Grace Days On Arrears</p>
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
                                                                    <p className="mb-0 font-weight-bold">Grace Days Intial Payment</p>
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
                                                                    <p className="mb-0 font-weight-bold">Over Due Days Before NPA</p>
                                                                </div>
                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                </div>
                                                                <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                    <p className="mb-0">{this.state.overduedaysbeforenpa}</p>
                                                                </div>
                                                            </div>
                                                            {/* <div className='row'>
                                                                <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                    <p className="mb-0 font-weight-bold">Listing period days</p>
                                                                </div>
                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                </div>
                                                                <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                    <p className="mb-0">{this.state.listingPeriodDays}</p>
                                                                </div>
                                                            </div> */}
                                                        </div>
                                                        <div className='col' style={{ color: "#222c70", fontSize: "14px" }}>
                                                            <div className='row'>
                                                                <div className='col-sm-7 col-md-7 col-lg-7'>
                                                                    <p className="mb-0 font-weight-bold">Grace Days Principal Payment</p>
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
                                                                    <p className="mb-0 font-weight-bold">Grace Days Penal Interest</p>
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
                                                            {/* <div className='row'>
                                                                <div className='col-sm-7 col-md-7 col-lg-7'>
                                                                    <p className="mb-0 font-weight-bold">ELC cooling off period</p>
                                                                </div>
                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                </div>
                                                                <div className='col-sm-4 col-md-4 col-lg-4'>
                                                                    <p className="mb-0">{this.state.elcCoolingOff}</p>
                                                                </div>
                                                            </div> */}

                                                        </div>
                                                    </div>
                                                    {checkerPermissions.map((permission, index) => {
                                                        if (permission.permissionname === "AUTHORIZE_PRODUCT_LAUNCH" && permission.status === "1") {
                                                            return (
                                                                approveFlag && (
                                                                    <div className='row pl-2 pr-2 pb-2'>
                                                                        <div className='col-12 form-check' style={{ textAlign: "end" }}>
                                                                            <input class="form-check-input" type="checkbox" value="1" id="flexCheckDefault" onChange={this.authgrace} />
                                                                            <label class="form-check-label" for="flexCheckDefault" style={{ fontFamily: "Poppins,sans-serif", fontSize: "15px", color: "rgb(34, 44, 112)" }} >Authorise</label>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            )
                                                        }
                                                    })}
                                                </div>
                                            </div>
                                            <div className='card' style={{ cursor: "default" }}>
                                                <div className='form-group pl-2 pr-2 pt-2' >
                                                    <div className='row'>
                                                        <div className='col-10' id="" style={{ fontFamily: "Poppins,sans-serif", fontWeight: "bold", color: "#222c70", fontSize: "15px" }}>
                                                            <img src={prodAttr} style={{ marginTop: "-6px", width: "15px", marginLeft: "1px" }} />&nbsp;<span>Funding Information</span>
                                                            <hr style={{ marginTop: "1px", backgroundColor: "rgba(4,78,160,1)" }} />
                                                        </div>
                                                        {makerPermissions.map((permission, index) => {
                                                            if (permission.permissionname === "SET_PRODUCT_DEF_FUNDING_INFO" && permission.status === "1") {
                                                                return (
                                                                    editFlag && (
                                                                        <div className='col-2' style={{ textAlign: "end" }}>
                                                                            <Link to="/setproductdefFund">
                                                                                <button className='btn btn-sm'
                                                                                    //onClick={this.setproductdefFund}
                                                                                    style={{ border: "2px solid #0079bf", marginTop: "-8px", color: "#0079bf" }}><FaIcons.FaEdit style={{ marginTop: "-4px" }} />&nbsp;<span>Edit</span></button>
                                                                            </Link>
                                                                        </div>
                                                                    )
                                                                )
                                                            }
                                                        })}
                                                    </div>
                                                    <div className='row pl-2 pr-2'>
                                                        <div className='col' style={{ color: "#222c70", fontSize: "14px" }}>
                                                            <div className='row'>
                                                                <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                    <p className="mb-0 font-weight-bold">Maximum Funding Investor</p>
                                                                </div>
                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                </div>
                                                                <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                    {this.state.maxfundinginvestor ?
                                                                        <p className="mb-0">₹ {parseFloat(this.state.maxfundinginvestor).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
                                                                        </p> : "-"
                                                                    }
                                                                </div>
                                                            </div>
                                                            <div className='row'>
                                                                <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                    <p className="mb-0 font-weight-bold">Authorised</p>
                                                                </div>
                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                </div>
                                                                <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                    {
                                                                        this.state.authorized2 == "0" ? <p className="mb-0">Not Authorised</p> : <span>{this.state.authorized2 == "1" ? <p className="mb-0">Authorised</p> : ""}</span>
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
                                                                    <p className="mb-0 font-weight-bold">Funding In Multiples Of</p>
                                                                </div>
                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                </div>
                                                                <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                    {
                                                                        this.state.fundinginmultiplesof ? <p className="mb-0">₹ {parseFloat(this.state.fundinginmultiplesof).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</p> :
                                                                            "-"
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
                                                                            "-"
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
                                                    {checkerPermissions.map((permission, index) => {
                                                        if (permission.permissionname === "AUTHORIZE_PRODUCT_LAUNCH" && permission.status === "1") {
                                                            return (
                                                                approveFlag && (
                                                                    <div className='row pl-2 pr-2 pb-2'>
                                                                        <div className='col-12 form-check' style={{ textAlign: "end" }}>
                                                                            <input class="form-check-input" type="checkbox" value="1" id="flexCheckDefault" onChange={this.authfund} />
                                                                            <label class="form-check-label" for="flexCheckDefault" style={{ fontFamily: "Poppins,sans-serif", fontSize: "15px", color: "rgb(34, 44, 112)" }} >Authorise</label>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            )
                                                        }
                                                    })}
                                                </div>
                                            </div>

                                            <div className='card' style={{ cursor: "default" }}>
                                                <div className='form-group pl-2 pr-2 pt-2'>
                                                    <div className='row'>
                                                        <div className='col-8' id="" style={{ fontFamily: "Poppins,sans-serif", fontWeight: "bold", color: "#222c70", fontSize: "15px" }}>
                                                            <img src={prodAttr} style={{ marginTop: "-6px", width: "15px", marginLeft: "1px" }} />&nbsp;<span>Purpose Information</span>
                                                            <hr style={{ marginTop: "1px", backgroundColor: "rgba(4,78,160,1)" }} />
                                                        </div>
                                                        {makerPermissions.map((permission, index) => {
                                                            if (permission.permissionname === "SET_PRODUCT_DEF_REPAYMENT_INFO" && permission.status === "1") {
                                                                return (
                                                                    editFlag && (
                                                                        <div className='col-4' style={{ textAlign: "end" }}>
                                                                            {/* {productAuth == 1 ? null : <button className='btn btn-sm' onClick={this.setproductPurpose}
                                                                            style={{ border: "2px solid #0079bf", marginTop: "-8px", color: "#0079bf" }}><FaIcons.FaEdit style={{ marginTop: "-4px" }} />&nbsp;<span>Edit</span></button>
                                                                            } */}
                                                                            <button className='btn btn-sm' onClick={this.getLoanpurpose} style={{ border: "2px solid #0079bf", marginTop: "-8px", color: "#0079bf" }}><FaIcons.FaPlusCircle style={{ marginTop: "-4px" }} />&nbsp;<span>Add Product Purpose</span></button>
                                                                        </div>
                                                                    )
                                                                )
                                                            }
                                                        })}
                                                    </div>

                                                    <div className='row pl-2 pr-2 pb-2' style={{ marginTop: "-20px" }}>
                                                        {this.state.loanPurposeDefList.map((list, index) => {
                                                            return (
                                                                <div className='col-6' key={index} >
                                                                    <div className='card p-2' style={{ cursor: "default", overflow: "visible" }}>
                                                                        <div className='row' style={{ color: "#222c70", fontSize: "14px" }}>
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
                                                                        <div className='row' style={{ color: "#222c70", fontSize: "14px" }}>
                                                                            <div className='col-sm-4 col-md-4 col-lg-4'>
                                                                                <p className="mb-0 font-weight-bold">Authorised</p>
                                                                            </div>
                                                                            <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                                <p className="mb-0 font-weight-bold">:</p>
                                                                            </div>
                                                                            <div className='col-sm-7 col-md-7 col-lg-7'>
                                                                                {list.authorized == "0" ? <p className="mb-0">Not Authorised
                                                                                    {list.authorized === 0 && approveFlag &&
                                                                                        <button className='btn btn-sm' style={{ backgroundColor: "rgb(136, 189, 72)", color: "white", float: "right" }}
                                                                                            onClick={this.authorizeProductPurpose.bind(this, list)}>Authorize</button>
                                                                                    }
                                                                                </p> : <p className="mb-0">Authorised</p>}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                    {checkerPermissions.map((permission, index) => {
                                                        if (permission.permissionname === "AUTHORIZE_PRODUCT_PURPOSE" && permission.status === "1") {
                                                            return (
                                                                approveFlag && (
                                                                    <div className='row pl-2 pr-2 pb-2'>
                                                                        <div className='col-12 form-check' style={{ textAlign: "end" }}>
                                                                            <input class="form-check-input" type="checkbox" value="1" id="flexCheckDefault" onChange={this.authpurp} />
                                                                            <label class="form-check-label" for="flexCheckDefault" style={{ fontFamily: "Poppins,sans-serif", fontSize: "15px", color: "rgb(34, 44, 112)" }} >Authorise</label>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            )
                                                        }
                                                    })}

                                                </div>
                                            </div>
                                            {checkerPermissions.map((permission, index) => {
                                                if (permission.permissionname === "AUTHORIZE_PRODUCT_LAUNCH" && permission.status === "1") {
                                                    return (
                                                        approveFlag && (
                                                            <>
                                                                <div className='card' style={{ cursor: "default" }}>
                                                                    <div className='form-group pl-4 pr-2 pt-2'>
                                                                        <div className='row pl-2 pr-2'>
                                                                            <div className="col-6" style={{ color: "#222c70", fontSize: "14px" }}>
                                                                                <div className='row'>
                                                                                    <div className='col-4'>
                                                                                        <span><input class="form-check-input" type="checkbox" value="1" id="flexCheckDefault" onChange={this.authprodtype} /></span>
                                                                                        <p className="mb-0 font-weight-bold">Product Type</p>
                                                                                    </div>
                                                                                    <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                                        <p className="mb-0 font-weight-bold">:</p>
                                                                                    </div>
                                                                                    <div className='col-5'>
                                                                                        <p className="mb-0">{prodID}</p>
                                                                                    </div>

                                                                                </div>
                                                                            </div>
                                                                            <div className='col-6' style={{ color: "#222c70", fontSize: "14px" }}>
                                                                                <div className='row'>
                                                                                    <div className='col-4'>
                                                                                        <span><input class="form-check-input" type="checkbox" value="1" id="flexCheckDefault" onChange={this.authprod} /></span>
                                                                                        <p className="mb-0 font-weight-bold">Product Name</p>
                                                                                    </div>
                                                                                    <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                                        <p className="mb-0 font-weight-bold">:</p>
                                                                                    </div>
                                                                                    <div className='col-5'>
                                                                                        <p className="mb-0">{prodName}</p>
                                                                                    </div>

                                                                                </div>

                                                                            </div>
                                                                        </div>
                                                                        <div className='row pl-2 pr-2'>
                                                                            <div className='col-6' style={{ color: "#222c70", fontSize: "14px" }}>
                                                                                <div className='row'>
                                                                                    <div className='col-4'>
                                                                                        <span><input class="form-check-input" type="checkbox" value="1" id="flexCheckDefault" onChange={this.authcur} /></span>
                                                                                        <p className="mb-0 font-weight-bold">Currency</p>
                                                                                    </div>
                                                                                    <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                                        <p className="mb-0 font-weight-bold">:</p>
                                                                                    </div>
                                                                                    <div className='col-5'>
                                                                                        <p className="mb-0">{currencyCode}</p>
                                                                                    </div>

                                                                                </div>

                                                                            </div>
                                                                            <div className='col-6' style={{ color: "#222c70", fontSize: "14px" }}>
                                                                                <div className='row'>
                                                                                    <div className='col-4'>
                                                                                        <span><input class="form-check-input" type="checkbox" value="1" id="flexCheckDefault" onChange={this.authmem} /></span>
                                                                                        <p className="mb-0 font-weight-bold">Member Group</p>
                                                                                    </div>
                                                                                    <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                                        <p className="mb-0 font-weight-bold">:</p>
                                                                                    </div>
                                                                                    <div className='col-5'>
                                                                                        <p className="mb-0">{memGrp}</p>
                                                                                    </div>

                                                                                </div>

                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className='card' style={{ cursor: "default" }}>
                                                                    <div className='form-group pl-2 pr-2 pt-2'>
                                                                        <div className='row'>
                                                                            <div className='col-8' id="" style={{ fontFamily: "Poppins,sans-serif", fontWeight: "bold", color: "#222c70", fontSize: "15px" }}>
                                                                                <img src={prodAttr} style={{ marginTop: "-6px", width: "15px", marginLeft: "1px" }} />&nbsp;<span>Authorise Product Launch</span>
                                                                                <hr style={{ marginTop: "1px", backgroundColor: "rgba(4,78,160,1)" }} />
                                                                            </div>
                                                                            <div className='col-4' style={{ textAlign: "end" }}>
                                                                                <button className='btn btn-sm' onClick={this.viewChargeRulesBasedOnID}
                                                                                    style={{ border: "2px solid #0079bf", marginTop: "-8px", color: "#0079bf" }}>
                                                                                    <FaIcons.FaAngleDoubleLeft style={{ marginTop: "-4px" }} />&nbsp;
                                                                                    <span>View Charges</span>
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                        <div className='row pl-2 pr-2'>
                                                                            <div className='form-row'>
                                                                                <div className="form-group col">
                                                                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                                        <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins, sans-serif", fontWeight: "bold", marginBottom: "1px", fontSize: "14px" }}>
                                                                                            {t(`${this.state.bllFeeObj.chargedescription}`)} *
                                                                                        </p>

                                                                                    </div>
                                                                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                                        <p style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontSize: "12px", marginBottom: "8px" }}>Charge Type</p>
                                                                                        <div className="form-check form-switch" style={{ marginLeft: "5px", marginTop: "-10px" }}>
                                                                                            <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" checked={this.state.toggle1Flag} onChange={this.toggle1} style={{ height: "20px", width: "40px" }} />
                                                                                            <label className="form-check-label" htmlFor="flexSwitchCheckDefault"></label>
                                                                                        </div>
                                                                                        <p style={{ color: "#222C70", fontFamily: "Poppins, sans-serif", fontSize: "12px", marginBottom: "8px", marginLeft: "20px" }}>
                                                                                            {this.state.toggle1Flag === true ? "(Variable)" : "(Fixed)"}
                                                                                        </p>

                                                                                        {/* <p>{this.state.bllfeechargeruletype}</p> */}
                                                                                    </div>
                                                                                    {this.state.toggle1Flag === true ?
                                                                                        <div className=''>
                                                                                            <div className='row'>
                                                                                                <div className='col'>
                                                                                                    <p style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontSize: "12px", marginBottom: "8px" }}>Fixed Percentage</p>
                                                                                                </div>
                                                                                                <div className='col'>
                                                                                                    <p style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontSize: "12px", marginBottom: "8px" }}>Maximum Cap</p>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className='row' style={{ marginTop: "-10px" }}>
                                                                                                <div className='input-group col'>
                                                                                                    <input type="number" class="form-control"
                                                                                                        placeholder={t('Enter Fixed Percentage')}
                                                                                                        onChange={this.bllfeefixedpercentage}
                                                                                                        value={this.state.bllfeefixedpercentage} />
                                                                                                    <div class="input-group-append">
                                                                                                        <span class="input-group-text">%</span>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className='input-group col'>
                                                                                                    <input type="number" className="form-control" style={{ backgroundColor: "rgb(247, 248, 250)" }}
                                                                                                        id="inputAddress" placeholder={t('Enter Maximum Cap')} onChange={this.bllfeemaxcap}
                                                                                                        value={this.state.bllfeemaxcap}
                                                                                                    />
                                                                                                </div>
                                                                                            </div>
                                                                                        </div> :
                                                                                        <div>
                                                                                            <p style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontSize: "12px", marginBottom: "8px" }}>Fixed Amount</p>

                                                                                            <input type="number" className="form-control" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}
                                                                                                id="inputAddress" placeholder={t(`Enter Fixed Amount`)} onChange={this.bllfeeamt}
                                                                                                value={this.state.bllfeeamt}
                                                                                            />
                                                                                        </div>}

                                                                                </div>
                                                                                <div className="form-group col">

                                                                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold", marginBottom: "1px", fontSize: "14px" }}>{t(`${this.state.bleFeeObj.chargedescription}`)} *</p>

                                                                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                                        <p style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontSize: "12px", marginBottom: "8px" }}>Charge Type</p>
                                                                                        <div className="form-check form-switch" style={{ marginLeft: "5px", marginTop: "-5px" }}>
                                                                                            <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" checked={this.state.toggle2Flag} onChange={this.toggle2} style={{ height: "20px", width: "40px" }} />
                                                                                            <label className="form-check-label" htmlFor="flexSwitchCheckDefault"></label>
                                                                                        </div>
                                                                                        <p style={{ color: "#222C70", fontFamily: "Poppins, sans-serif", fontSize: "12px", marginBottom: "8px", marginLeft: "20px" }}>
                                                                                            {this.state.toggle2Flag === true ? "(Variable)" : "(Fixed)"}
                                                                                        </p>
                                                                                    </div>

                                                                                    {this.state.toggle2Flag === true ?
                                                                                        <div className=''>
                                                                                            <div className='row'>
                                                                                                <div className='col'>
                                                                                                    <p style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontSize: "12px", marginBottom: "8px" }}>Fixed Percentage</p>
                                                                                                </div>
                                                                                                <div className='col'>
                                                                                                    <p style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontSize: "12px", marginBottom: "8px" }}>Maximum Cap</p>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className='row' style={{ marginTop: "-10px" }}>
                                                                                                <div className='input-group col'>
                                                                                                    <input type="number" class="form-control"
                                                                                                        placeholder={t('Enter Fixed Percentage')}
                                                                                                        onChange={this.blefeefixedpercentage}
                                                                                                        value={this.state.blefeefixedpercentage} />
                                                                                                    <div class="input-group-append">
                                                                                                        <span class="input-group-text">%</span>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className='input-group col'>
                                                                                                    <input type="number" className="form-control" style={{ backgroundColor: "rgb(247, 248, 250)" }}
                                                                                                        id="inputAddress" placeholder={t('Enter Maximum Cap')} onChange={this.blefeemaxcap}
                                                                                                        value={this.state.blefeemaxcap}
                                                                                                    />
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                        :
                                                                                        <div>
                                                                                            <p style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontSize: "12px", marginBottom: "8px" }}>Fixed Amount</p>
                                                                                            <input type="number" className="form-control" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}
                                                                                                id="inputAddress" placeholder={t(`Enter Fixed Amount`)} onChange={this.blefeeamt}
                                                                                                value={this.state.blefeeamt}
                                                                                            /></div>
                                                                                    }


                                                                                </div>
                                                                            </div>
                                                                            <div className='form-row'>
                                                                                <div className="form-group col">

                                                                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold", marginBottom: "1px", fontSize: "14px" }}>{t(`${this.state.latePPObj.chargedescription}`)} *</p>

                                                                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                                        <p style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontSize: "12px", marginBottom: "8px" }}>Charge Type</p>
                                                                                        <div className="form-check form-switch" style={{ marginLeft: "5px", marginTop: "-5px" }}>
                                                                                            <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" checked={this.state.toggle3Flag} onChange={this.toggle3} style={{ height: "20px", width: "40px" }} />
                                                                                            <label className="form-check-label" htmlFor="flexSwitchCheckDefault"></label>
                                                                                        </div>
                                                                                        <p style={{ color: "#222C70", fontFamily: "Poppins, sans-serif", fontSize: "12px", marginBottom: "8px", marginLeft: "20px" }}>
                                                                                            {this.state.toggle3Flag === true ? "(Variable)" : "(Fixed)"}
                                                                                        </p>
                                                                                    </div>
                                                                                    {this.state.toggle3Flag === true ?
                                                                                        <div className=''>
                                                                                            <div className='row'>
                                                                                                <div className='col'>
                                                                                                    <p style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontSize: "12px", marginBottom: "8px" }}>Fixed Percentage</p>
                                                                                                </div>
                                                                                                <div className='col'>
                                                                                                    <p style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontSize: "12px", marginBottom: "8px" }}>Maximum Cap</p>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className='row' style={{ marginTop: "-10px" }}>
                                                                                                <div className='input-group col'>
                                                                                                    <input type="number" class="form-control"
                                                                                                        placeholder={t('Enter Fixed Percentage')}
                                                                                                        onChange={this.latepaymentpenaltyfixedpercentage}
                                                                                                        value={this.state.latepaymentpenaltyfixedpercentage} />
                                                                                                    <div class="input-group-append">
                                                                                                        <span class="input-group-text">%</span>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className='input-group col'>
                                                                                                    <input type="number" className="form-control" style={{ backgroundColor: "rgb(247, 248, 250)" }}
                                                                                                        id="inputAddress" placeholder={t('Enter Maximum Cap')} onChange={this.latepaymentpenaltymaxcap}
                                                                                                        value={this.state.latepaymentpenaltymaxcap}
                                                                                                    />
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                        :
                                                                                        <div>
                                                                                            <p style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontSize: "12px", marginBottom: "8px" }}>Fixed Amount</p>
                                                                                            <input type="text" className="form-control" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}
                                                                                                id="inputAddress" placeholder={t(`Enter Fixed Amount`)} onChange={this.latepaymentpenalty}
                                                                                                value={this.state.latepaymentpenalty}
                                                                                            />
                                                                                        </div>
                                                                                    }

                                                                                </div>
                                                                                <div className="form-group col">

                                                                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold", marginBottom: "1px", fontSize: "14px" }}>{t(`${this.state.facComObj.chargedescription}`)} *</p>

                                                                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                                        <p style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontSize: "12px", marginBottom: "8px" }}>Charge Type</p>
                                                                                        <div className="form-check form-switch" style={{ marginLeft: "5px", marginTop: "-5px" }}>
                                                                                            <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" checked={this.state.toggle4Flag} onChange={this.toggle4} style={{ height: "20px", width: "40px" }} />
                                                                                            <label className="form-check-label" htmlFor="flexSwitchCheckDefault"></label>
                                                                                        </div>
                                                                                        <p style={{ color: "#222C70", fontFamily: "Poppins, sans-serif", fontSize: "12px", marginBottom: "8px", marginLeft: "20px" }}>
                                                                                            {this.state.toggle4Flag === true ? "(Variable)" : "(Fixed)"}
                                                                                        </p>
                                                                                    </div>
                                                                                    {this.state.toggle4Flag === true ?
                                                                                        <div className=''>
                                                                                            <div className='row'>
                                                                                                <div className='col'>
                                                                                                    <p style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontSize: "12px", marginBottom: "8px" }}>Fixed Percentage</p>
                                                                                                </div>
                                                                                                <div className='col'>
                                                                                                    <p style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontSize: "12px", marginBottom: "8px" }}>Maximum Cap</p>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className='row' style={{ marginTop: "-10px" }}>
                                                                                                <div className='input-group col'>
                                                                                                    <input type="number" class="form-control"
                                                                                                        placeholder={t('Enter Fixed Percentage')}
                                                                                                        onChange={this.faccommissionfixedpercentage}
                                                                                                        value={this.state.faccommissionfixedpercentage} />
                                                                                                    <div class="input-group-append">
                                                                                                        <span class="input-group-text">%</span>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className='input-group col'>
                                                                                                    <input type="number" className="form-control" style={{ backgroundColor: "rgb(247, 248, 250)" }}
                                                                                                        id="inputAddress" placeholder={t('Enter Maximum Cap')} onChange={this.faccommissionmaxcap}
                                                                                                        value={this.state.faccommissionmaxcap}
                                                                                                    />
                                                                                                </div>
                                                                                            </div>
                                                                                        </div> :

                                                                                        <div>
                                                                                            <p style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontSize: "12px", marginBottom: "8px" }}>Fixed Amount</p>
                                                                                            <input type="text" className="form-control" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}
                                                                                                id="inputAddress" placeholder={t(`Enter Fixed Amount`)} onChange={this.faccommissionamt}
                                                                                                value={this.state.faccommissionamt}
                                                                                            />
                                                                                        </div>
                                                                                    }

                                                                                </div>
                                                                            </div>
                                                                            <div className='form-row mb-3'>
                                                                                <div className='col'>

                                                                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold", marginBottom: "2px", fontSize: "14px" }}>{t(`${this.state.elcFeeObj.chargedescription}`)} *</p>

                                                                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                                        <p style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontSize: "12px", marginBottom: "8px" }}>Charge Type</p>
                                                                                        <div className="form-check form-switch" style={{ marginLeft: "5px", marginTop: "-5px" }}>
                                                                                            <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" checked={this.state.toggle5Flag} onChange={this.toggle5} style={{ height: "20px", width: "40px" }} />
                                                                                            <label className="form-check-label" htmlFor="flexSwitchCheckDefault"></label>
                                                                                        </div>
                                                                                        <p style={{ color: "#222C70", fontFamily: "Poppins, sans-serif", fontSize: "12px", marginBottom: "8px", marginLeft: "20px" }}>
                                                                                            {this.state.toggle5Flag === true ? "(Variable)" : "(Fixed)"}
                                                                                        </p>
                                                                                    </div>
                                                                                    {this.state.toggle5Flag === true ? <div className=''>
                                                                                        <div className='row'>
                                                                                            <div className='col'>
                                                                                                <p style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontSize: "12px", marginBottom: "8px" }}>Fixed Percentage</p>
                                                                                            </div>
                                                                                            <div className='col'>
                                                                                                <p style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontSize: "12px", marginBottom: "8px" }}>Maximum Cap</p>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className='row' style={{ marginTop: "-10px" }}>
                                                                                            <div className='input-group col'>
                                                                                                <input type="number" class="form-control"
                                                                                                    placeholder={t('Enter Fixed Percentage')}
                                                                                                    onChange={this.elcfeefixedpercentage}
                                                                                                    value={this.state.elcfeefixedpercentage} />
                                                                                                <div class="input-group-append">
                                                                                                    <span class="input-group-text">%</span>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className='input-group col'>
                                                                                                <input type="number" className="form-control" style={{ backgroundColor: "rgb(247, 248, 250)" }}
                                                                                                    id="inputAddress" placeholder={t('Enter Maximum Cap')} onChange={this.elcfeemaxcap}
                                                                                                    value={this.state.elcfeemaxcap}
                                                                                                />
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className='row'>
                                                                                            <div className='col'>
                                                                                                {(this.state.elcFeeFixPerError) ?
                                                                                                    <p style={{ color: "red", fontFamily: "Poppins,sans-serif", fontSize: "12px" }}>
                                                                                                        <BsInfoCircle />&nbsp;Invalid Percentage</p> : ''}
                                                                                            </div>
                                                                                            <div className='col'>

                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                        :
                                                                                        <div>
                                                                                            <p style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontSize: "12px", marginBottom: "8px" }}>Fixed Amount</p>
                                                                                            <input type="text" className="form-control" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}
                                                                                                id="inputAddress" placeholder={t(`Enter Fixed Amount`)} onChange={this.elcfeeamt}
                                                                                                value={this.state.elcfeeamt}
                                                                                            />
                                                                                        </div>}
                                                                                </div>
                                                                                <div className='col'>

                                                                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold", marginBottom: "2px", fontSize: "14px" }}>{t(`${this.state.borLpfObj.chargedescription}`)} *</p>

                                                                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                                        <p style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontSize: "12px", marginBottom: "8px" }}>Charge Type</p>
                                                                                        <div className="form-check form-switch" style={{ marginLeft: "5px", marginTop: "-5px" }}>
                                                                                            <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" checked={this.state.toggle6Flag} onChange={this.toggle6} style={{ height: "20px", width: "40px" }} />
                                                                                            <label className="form-check-label" htmlFor="flexSwitchCheckDefault"></label>
                                                                                        </div>
                                                                                        <p style={{ color: "#222C70", fontFamily: "Poppins, sans-serif", fontSize: "12px", marginBottom: "8px", marginLeft: "20px" }}>
                                                                                            {this.state.toggle6Flag === true ? "(Variable)" : "(Fixed)"}
                                                                                        </p>
                                                                                    </div>
                                                                                    {this.state.toggle6Flag === true ?
                                                                                        <div>
                                                                                            <div className='row'>
                                                                                                <div className='col'>
                                                                                                    <p style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontSize: "12px", marginBottom: "8px" }}>Fixed Percentage</p>
                                                                                                </div>
                                                                                                <div className='col'>
                                                                                                    <p style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontSize: "12px", marginBottom: "8px" }}>Maximum Cap</p>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className='row' style={{ marginTop: "-10px" }}>
                                                                                                <div className='input-group col'>
                                                                                                    <input type="number" class="form-control"
                                                                                                        placeholder={t('Enter Fixed Percentage')}
                                                                                                        onChange={this.borloanprocessingfixedpercentage}
                                                                                                        value={this.state.borloanprocessingfixedpercentage} />
                                                                                                    <div class="input-group-append">
                                                                                                        <span class="input-group-text">%</span>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className='input-group col'>
                                                                                                    <input type="number" className="form-control" style={{ backgroundColor: "rgb(247, 248, 250)" }}
                                                                                                        id="inputAddress" placeholder={t('Enter Maximum Cap')} onChange={this.borloanprocessingmaxcap}
                                                                                                        value={this.state.borloanprocessingmaxcap}
                                                                                                    />
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className='row'>
                                                                                                <div className='col'>
                                                                                                    {(this.state.borLoanProcessFeeFixPerError) ?
                                                                                                        <p style={{ color: "red", fontFamily: "Poppins,sans-serif", fontSize: "12px" }}>
                                                                                                            <BsInfoCircle />&nbsp;Invalid Percentage</p> : ''}
                                                                                                </div>
                                                                                                <div className='col'>

                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                        :
                                                                                        <div>
                                                                                            <p style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontSize: "12px", marginBottom: "8px" }}>Fixed Amount</p>
                                                                                            <input type="text" className="form-control" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}
                                                                                                id="inputAddress" placeholder={t(`Enter Fixed Amount`)} onChange={this.borloanprocessingamt}
                                                                                                value={this.state.borloanprocessingamt}
                                                                                            />
                                                                                        </div>
                                                                                    }
                                                                                </div>
                                                                            </div>
                                                                            <div className='form-row mb-3'>
                                                                                <div className='col'>

                                                                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold", marginBottom: "2px", fontSize: "14px" }}>{t(`${this.state.evlComeObj.chargedescription}`)} *</p>

                                                                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                                        <p style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontSize: "12px", marginBottom: "8px" }}>Charge Type</p>
                                                                                        <div className="form-check form-switch" style={{ marginLeft: "5px", marginTop: "-5px" }}>
                                                                                            <input className="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" checked={this.state.toggle7Flag} onChange={this.toggle7} style={{ height: "20px", width: "40px" }} />
                                                                                            <label className="form-check-label" htmlFor="flexSwitchCheckDefault"></label>
                                                                                        </div>
                                                                                        <p style={{ color: "#222C70", fontFamily: "Poppins, sans-serif", fontSize: "12px", marginBottom: "8px", marginLeft: "20px" }}>
                                                                                            {this.state.toggle7Flag === true ? "(Variable)" : "(Fixed)"}
                                                                                        </p>
                                                                                        {/* <p>{this.state.evlcommissionchargeruletype}</p> */}
                                                                                    </div>
                                                                                    {this.state.toggle7Flag === true ?
                                                                                        <div>
                                                                                            <div className='row'>
                                                                                                <div className='col'>
                                                                                                    <p style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontSize: "12px", marginBottom: "8px" }}>Fixed Percentage</p>
                                                                                                </div>
                                                                                                <div className='col'>
                                                                                                    <p style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontSize: "12px", marginBottom: "8px" }}>Maximum Cap</p>
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className='row' style={{ marginTop: "-10px" }}>
                                                                                                <div className='input-group col'>
                                                                                                    <input type="number" class="form-control"
                                                                                                        placeholder={t('Enter Fixed Percentage')}
                                                                                                        onChange={this.evlcommissionfixedpercentage}
                                                                                                        value={this.state.evlcommissionfixedpercentage} />
                                                                                                    <div class="input-group-append">
                                                                                                        <span class="input-group-text">%</span>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <div className='input-group col'>
                                                                                                    <input type="number" className="form-control" style={{ backgroundColor: "rgb(247, 248, 250)" }}
                                                                                                        id="inputAddress" placeholder={t('Enter Maximum Cap')} onChange={this.evlcommissionmaxcap}
                                                                                                        value={this.state.evlcommissionmaxcap}
                                                                                                    />
                                                                                                </div>
                                                                                            </div>
                                                                                            <div className='row'>
                                                                                                <div className='col'>
                                                                                                    {(this.state.evlcommFixPerError) ?
                                                                                                        <p style={{ color: "red", fontFamily: "Poppins,sans-serif", fontSize: "12px" }}>
                                                                                                            <BsInfoCircle />&nbsp;Invalid Percentage</p> : ''}
                                                                                                </div>
                                                                                                <div className='col'>

                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                        :
                                                                                        <div>
                                                                                            <p style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontSize: "12px", marginBottom: "8px" }}>Fixed Amount</p>
                                                                                            <input type="text" className="form-control" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}
                                                                                                id="inputAddress" placeholder={t(`Enter Fixed Amount`)} onChange={this.evlcommissionamt}
                                                                                                value={this.state.evlcommissionamt}
                                                                                            />
                                                                                        </div>
                                                                                    }
                                                                                </div>

                                                                                <div className='col'>
                                                                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold", marginBottom: "28px", fontSize: "14px" }}>{t('Valid From Date')}</p>
                                                                                    <input type="date" className="form-control" style={{ backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}
                                                                                        id="inputAddress" onChange={this.validfromdate}
                                                                                    />
                                                                                </div>
                                                                            </div>
                                                                            <div className='form-row'>
                                                                                <div className="form-group col-6">
                                                                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold", fontSize: "14px" }}>{t('Workflow ID')}</p>
                                                                                    <select className='form-select' onChange={this.workFlowID} style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}>
                                                                                        <option>Select Workflow</option>
                                                                                        {this.state.workflowMasterList.map((lists, index) => {
                                                                                            return (
                                                                                                <option value={lists.workflowid}>{lists.workflowname}</option>
                                                                                            )
                                                                                        })
                                                                                        }
                                                                                    </select>
                                                                                </div>
                                                                            </div>
                                                                            <hr />
                                                                            {checkerPermissions.map((permission, index) => {
                                                                                if (permission.permissionname === "AUTHORIZE_PRODUCT_LAUNCH" && permission.status === "1") {
                                                                                    return (
                                                                                        <div className="form-row">
                                                                                            <div className="form-group col pt-2" style={{ textAlign: "end" }}>
                                                                                                <button className='btn btn-sm text-white' onClick={this.AuthorizeProduct}
                                                                                                    style={{ backgroundColor: "rgb(136, 189, 72)" }}>Submit</button> &nbsp;
                                                                                                <button className='btn btn-sm text-white' onClick={this.cancelAuthorizeProduct}
                                                                                                    style={{ backgroundColor: "#0079BF" }}>Cancel</button>
                                                                                            </div>
                                                                                        </div>
                                                                                    )
                                                                                }
                                                                            })}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </>
                                                        )
                                                    )
                                                }
                                            })}

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
                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold", paddingLeft: "10px" }}><img src={editRole} width="25px" />Add Product Purpose</p>
                                            <hr style={{ width: "50px", marginTop: "-10px" }} />
                                            <div className='row mb-2'>
                                                <div className='col' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                    <p style={{ fontWeight: "500" }}>Product ID</p>
                                                    <input type="text" className="form-control" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px", textTransform: 'uppercase' }}
                                                        id="inputAddress" placeholder={t('Enter Product ID')} value={this.state.productid} readOnly
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
                                            <div className='row mb-2'>
                                                <div className='col' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                    <p style={{ fontWeight: "500" }}>Loan Purpose Group</p>
                                                    <select className="form-select border border-secondary" style={{ marginTop: "-5px", color: "RGBA(5,54,82,1)" }}
                                                        onChange={this.filterPurpose}>
                                                        <option defaultValue>{t('----Please Select----')}</option>
                                                        {this.state.loanPurposeGroup.map((purpose, index) => (
                                                            <option key={index} value={purpose.loanpurposegrp} >{purpose.loanpurposegrp} </option>
                                                        ))
                                                        }
                                                    </select>
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className='col' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                    <p style={{ fontWeight: "500" }}>Loan Purpose</p>
                                                    <select className="form-select border border-secondary" style={{ marginTop: "-5px", color: "RGBA(5,54,82,1)" }}
                                                        onChange={this.productPurpose}>
                                                        <option defaultValue>{t('----Please Select----')}</option>
                                                        {this.state.filteredPurpose.map((purpose, index) => (
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
                                            <button type="button" class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.setproductPurpose}>Save</button>&nbsp;
                                            <button type="button" class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "#0079BF" }} >Cancel</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Cancel Product */}
                    <button type="button" id='cancelProduct' style={{ display: "none" }} class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter2">
                        Cancel Product modal
                    </button>
                    <div class="modal fade" id="exampleModalCenter2" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered" role="document">
                            <div class="modal-content" style={{ width: "300px", marginLeft: "100px" }}>
                                <div class="modal-body">
                                    <div className='row'>
                                        <div className='col' style={{}}>

                                            <div className='row mb-2'>
                                                <div className='col' style={{ color: "rgba(5,54,82,1)", fontSize: "15px" }}>
                                                    <p style={{ fontWeight: "500" }}>Do you really want to?</p>
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className='col' style={{ textAlign: "center" }}>
                                                    <button type="button" class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.saveProduct}>Save</button>&nbsp;
                                                    <button type="button" class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "#0079BF" }} onClick={this.discardProduct}>Discard</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>

                    {/* view charge Rules */}
                    <button type="button" id='viewChargeRulesBasedOnID' class="btn btn-primary" data-toggle="modal" data-target=".bd-example-modal-lg" style={{ display: "none" }}>
                        View charge rules modal
                    </button>
                    <div class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
                        <div class="modal-dialog modal-lg">
                            <div class="modal-content">
                                <div class="modal-body">
                                    <div className='row'>
                                        <div className='col' style={{}}>
                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold", paddingLeft: "10px" }}><img src={editRole} width="25px" />&nbsp;{t(`Available Charges(for reference)`)}</p>
                                            <hr style={{ width: "50px", marginTop: "-10px" }} />

                                            <div className='row'>
                                                <div className='col' style={{ color: "rgba(5,54,82,1)" }}>
                                                    <div className="row pl-4 align-items-center mt-3 sysUsers">
                                                        <div className="col-3">
                                                            <p style={{ fontWeight: "500", color: "rgb(5, 54, 82)" }}>
                                                                Charge Name
                                                            </p>
                                                        </div>
                                                        <div className="col-3" style={{ textAlign: "end" }}>
                                                            <p style={{ fontWeight: "500", color: "rgb(5, 54, 82)" }}>
                                                                Charge Amount
                                                            </p>
                                                        </div>
                                                        <div className="col-3" style={{ textAlign: "end" }}>
                                                            <p style={{ fontWeight: "500", color: "rgb(5, 54, 82)" }}>
                                                                Fixed Percentage
                                                            </p>
                                                        </div>
                                                        <div className="col-3">
                                                            <p style={{ fontWeight: "500", color: "rgb(5, 54, 82)" }}>
                                                                Maximum Cap
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className='' style={{ marginTop: "-21px" }}>
                                                        {this.state.chargeRuleList2.map((chargeRules, index) => {
                                                            return (
                                                                <div className='col' key={index}>
                                                                    <div className='card border-0' style={{ marginBottom: "-10px", transition: 'none', overflow: "visible", color: "rgb(5, 54, 82)", cursor: 'default', backgroundColor: (index % 2 == 0) ? 'rgba(255,255,255,1)' : 'rgba(242,242,242,1)' }}>
                                                                        <div className="row item-list align-items-center">
                                                                            <div className='col-4'>
                                                                                <p style={{ paddingLeft: "11px", fontSize: "16px", color: "rgba(5,54,82,1)", fontWeight: "490", marginBottom: "1px" }}>
                                                                                    {chargeRules.chargeid == "BLLFEE" ? "Borrower Loan Listing Fee" :
                                                                                        <>{chargeRules.chargeid == "BLEFEE" ? "Loan Listing Extension Fee" :
                                                                                            <>{chargeRules.chargeid == "LATEPP" ? "Late Payment Penalty" :
                                                                                                <>{chargeRules.chargeid == "BORLPF" ? "Borrower Loan Processing Fee" :
                                                                                                    <>{chargeRules.chargeid == "ELCFEE" ? "Early Loan Closure Fee" :
                                                                                                        <>{chargeRules.chargeid == "FACCOM" ? "Facilitating Commission" :
                                                                                                            <>{chargeRules.chargeid == "EVLCOM" ? "Evaluating Commission" : ""}
                                                                                                            </>}
                                                                                                        </>}
                                                                                                    </>}
                                                                                                </>}
                                                                                            </>}
                                                                                        </>}
                                                                                </p>
                                                                            </div>
                                                                            <div className='col-3'>
                                                                                <p style={{ paddingLeft: "14px", fontSize: "16px", color: "rgba(5,54,82,1)", fontWeight: "490", marginBottom: "1px" }}>₹{chargeRules.chargeamount}</p>
                                                                            </div>
                                                                            <div className='col-2'>
                                                                                <p style={{ paddingLeft: "16px", fontSize: "16px", color: "rgba(5,54,82,1)", fontWeight: "490", marginBottom: "1px" }}>{chargeRules.fixedpercentage}</p>
                                                                            </div>
                                                                            <div className='col-3'>
                                                                                <p style={{ paddingLeft: "16px", fontSize: "16px", color: "rgba(5,54,82,1)", fontWeight: "490", marginBottom: "1px" }}>{chargeRules.maxcap}</p>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })}

                                                    </div>
                                                </div>
                                            </div>
                                            <hr style={{ backgroundColor: "rgba(5,54,82,1)" }} />
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col' style={{ textAlign: "end" }}>
                                            <button type="button" class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "#0079BF" }} >Close</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        )
    }
}

export default withTranslation()(ProductAttribute)