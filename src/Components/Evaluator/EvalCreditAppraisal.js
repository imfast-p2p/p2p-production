import React, { Component } from 'react';
import { BASEURL } from '../assets/baseURL';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import EvaluatorSidebar from '../../SidebarFiles/EvaluatorSidebar';
import { confirmAlert } from "react-confirm-alert";
import {
    FaUsers, FaAngleLeft, FaUserCircle,
    FaRegFileAlt, FaRegFile, FaEye, FaTimesCircle,
    FaCheckCircle, FaListAlt, FaUserMinus, FaWpforms
} from 'react-icons/fa';
import dashboardIcon from '../assets/icon_dashboard.png';
import { BsFolderPlus } from 'react-icons/bs';
import { withTranslation } from 'react-i18next';
import batch from '../assets/batch.png';
import openit from '../assets/AdminImg/openit.png';
import XMLParser from "react-xml-parser";
import jsPDF from "jspdf";
import { List } from 'antd';
import Loader from '../Loader/Loader';

var formDatas;
export class EvalCreditAppraisal extends Component {
    constructor() {

        super();

        this.state = {
            loanreqno: "",
            gincome: "",	// gross income
            nde: "",		// Non Discretionary Exp. Ratio
            ldef: "",			// No. of loan default
            cbd: "",			// No. of check bounce
            lvr: "",		    // Loan value ratio
            defintrate: "",	// default interest rate	
            evlmodulation: "",	// range -50 to 50

            borProfDetails: {},
            borProfData: [],
            attributetypeid: "",
            attributevalue: "",
            loanreqno: "",
            remark: "",
            deviationReason: "",

            loanStmt: [],
            extStmtList: [],

            Oemiamt: "",
            Ointerestrate: "",
            Oloanamtofferend: "",
            OLoanreqno: "",
            Otenure: "",
            Otenuredesc: "",
            Oriskrating: "",

            profilename: "",
            facilitatorId: "",
            loanamtreq: "",
            loanreqdate: "",
            primaryProfession: "",
            secondaryProfession: "",
            education: "",
            residenceType: "",
            landHolding: "",
            age: "",
            dependencies: "",
            yearsInResidence: "",
            yearsofearning: "",
            incomeRangegroup: "",
            remark1: "",
            remark2: "",
            remark3: "",
            remark4: "",
            remark5: "",
            remark6: "",
            remark7: "",
            remark8: "",
            remark9: "",
            remark10: "",

            collateralList: [],

            rejectReason: "",
            Rgincome: "",
            Rnde: "",
            Rldef: "",
            Rcbd: "",
            Rlvr: "",
            rating: "",
            Revlmodulation: "0",
            sanctionAmt: "",

            //Form Details
            formDetailList: [],
            formFieldLists: [],

            formCategory: "",
            formType: "",

            resMsg: "",
            noStmtMsg: "",
            showLoader: false,
        }

        this.nde = this.nde.bind(this);
        this.ldef = this.ldef.bind(this);
        this.cbd = this.cbd.bind(this);
        this.lvr = this.lvr.bind(this);
        this.defintrate = this.defintrate.bind(this);
        this.evlmodulation = this.evlmodulation.bind(this);
        this.getBorProfileInfo = this.getBorProfileInfo.bind(this);
        this.getLoanStmt = this.getLoanStmt.bind(this);

    }

    gincome = (event) => {
        this.setState({ gincome: event.target.value })
        var original = parseFloat(sessionStorage.getItem("gincome"));
        var margin = parseFloat(original / 100) * 10;
        console.log(original)
        console.log(event.target.value)
        console.log(margin)
        console.log("original+margin=" + (original + margin));
        console.log("original-margin=" + parseFloat(original - margin));

        if ((parseFloat(event.target.value) > parseFloat(original + margin))) {
            $('#reason').show();
            $('#reason1').show();
        } else if ((parseFloat(event.target.value) < parseFloat(original - margin))) {
            $('#reason').show();
            $('#reason1').show();
        }
        else {
            $('#reason').hide();
            $('#reason1').hide();
        }

        // if(maxpercent){
        //     $('#reason').show();
        //     $('#reason1').show();

        // }else if(amount===event.target.value){
        //     $('#reason').hide();
        //     $('#reason1').hide();
        // }else{
        //     $('#reason').hide();
        //     $('#reason1').hide();
        // }


    }
    deviationReason = (event) => {
        this.setState({ deviationReason: event.target.value })
    }
    nde = (event) => {
        this.setState({ nde: event.target.value })
    }
    ldef = (event) => {
        this.setState({ ldef: event.target.value })
    }
    cbd = (event) => {
        this.setState({ cbd: event.target.value })
    }
    lvr(event) {
        this.setState({ lvr: event.target.value })
    }
    defintrate(event) {
        this.setState({ defintrate: event.target.value })
    }
    evlmodulation(event) {
        this.setState({ evlmodulation: event.target.value });
    }
    sanctionAmt = (event) => {
        this.setState({ sanctionAmt: event.target.value })
    }
    componentDidMount() {
        this.getBorProfileInfo();
        this.getBorProfileAttributes()
        this.getLoanStmt();
        this.getborFinancialData();
        this.getFormTxnData();
    }
    getloanOffers = () => {
        this.setState({ showLoader: true });
        setTimeout(() => {
            this.setState({ showLoader: false });
            this.callLoanOffers()
        }, 10000);
    }
    callLoanOffers = () => {
        fetch(BASEURL + '/lms/getloanoffers', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                loanreqno: sessionStorage.getItem('loanreqno')
            })
        }).then(response => {
            console.log('Response:', response)
            return response.json();

        })
            .then((resdata) => {
                if (resdata.status == 'SUCCESS' || resdata.status == 'Success') {
                    console.log(resdata);
                    this.setState({
                        Oemiamt: resdata.msgdata[0].emiamt,
                        Ointerestrate: resdata.msgdata[0].interestrate,
                        Oloanamtofferend: resdata.msgdata[0].loanamtoffered,
                        OLoanreqno: resdata.msgdata[0].loanreqno,
                        Otenure: resdata.msgdata[0].tenure,
                        Otenuredesc: resdata.msgdata[0].tenuredesc,
                        Oriskrating: resdata.msgdata[0].riskrating
                    })
                    $("#modal").click()

                    console.log(this.state.Oemiamt, this.state.Ointerestrate, this.state.Oloanamtofferend, this.state.OLoanreqno, this.state.Otenure, this.state.Otenuredesc)
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
    getborFinancialData = () => {
        fetch(BASEURL + '/lms/getboranalyzedfinancialdata?loanreqno=' + sessionStorage.getItem('loanreqno'), {
            headers: {
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            }
        })
            .then((Response) => {
                return Response.json();
            })
            .then((resdata) => {
                if (resdata.status == 'SUCCESS') {
                    console.log(resdata);
                    this.setState({ gincome: resdata.msgdata.gincome })
                    sessionStorage.setItem("gincome", resdata.msgdata.gincome);
                    this.setState({ nde: resdata.msgdata.nde })
                    this.setState({ ldef: resdata.msgdata.ldef })
                    this.setState({ cbd: resdata.msgdata.cbd })
                    this.setState({ lvr: resdata.msgdata.lvr })

                    this.setState({ Rgincome: resdata.msgdata.gincome })
                    this.setState({ Rnde: resdata.msgdata.nde })
                    this.setState({ Rldef: resdata.msgdata.ldef })
                    this.setState({ Rcbd: resdata.msgdata.cbd })
                    this.setState({
                        Rlvr: resdata.msgdata.lvr,
                        rating: resdata.msgdata.rating
                    })
                } else {
                    //alert("Issue: " + resdata.message);
                    // window.location='/getEvaluatorLoans'
                }
            })
    }
    getExtractedStmtList = () => {
        fetch(BASEURL + '/lms/getextractedstmtlist?loanreqno=' + sessionStorage.getItem('loanreqno'), {
            headers: {
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            }
        })
            .then((Response) => {
                return Response.json();
            })
            .then((resdata) => {
                if (resdata.status == 'SUCCESS') {
                    console.log(resdata);
                    this.setState({ extStmtList: resdata.msgdata })

                } else {
                    //alert("Issue: " + resdata.message);
                    // window.location='/getEvaluatorLoans';
                    this.setState({ noStmtMsg: resdata.message })
                }
            })
    }
    getcollateralDocList = () => {
        fetch(BASEURL + '/lsp/getloancollateraldoc?loanreqno=' + sessionStorage.getItem('loanreqno'), {
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
                    this.setState({ collateralList: resdata.msgdata })
                    console.log(resdata.msgdata)
                } else {
                    confirmAlert({
                        message: "For this Loan, supplier invoices are not uploaded.",
                        buttons: [
                            {
                                label: "Okay",
                                onClick: () => {

                                },
                            },
                        ],
                        closeOnClickOutside: false,
                    });
                }
            })
    }

    getBorProfileInfo() {
        fetch(BASEURL + '/lsp/getborprofileinfo?loanreqnumber=' + sessionStorage.getItem('loanreqno'), {
            headers: {
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            }
        })
            .then((Response) => {
                return Response.json();
            })
            .then((resdata) => {
                if (resdata.status == 'SUCCESS') {
                    console.log(resdata);

                    var profilename;
                    var facilitatorId;
                    var Loanamtreq;
                    var Loanreqdate;

                    var borProfileDetails = resdata.msgdata;
                    borProfileDetails.map((profile, index) => {
                        return (
                            profilename = profile.name,
                            facilitatorId = profile.facilatatorid,
                            Loanamtreq = profile.loanamtreq,
                            Loanreqdate = profile.loanreqdate,
                            this.setState({
                                profilename: profilename,
                                facilitatorId: facilitatorId,
                                loanamtreq: Loanamtreq,
                                loanreqdate: Loanreqdate
                            })
                        )
                    })


                } else {
                    //alert("Issue: " + resdata.message);
                    // window.location='/getEvaluatorLoans'
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
    getBorProfileAttributes() {
        fetch(BASEURL + '/lsp/getborrowerprofileattributes?loanrequestnumber=' + sessionStorage.getItem("loanreqno"), {
            headers: {
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            }
        })
            .then((Response) => {
                return Response.json();
            })
            .then((resdata) => {
                if (resdata.status == 'SUCCESS') {
                    console.log(resdata);
                    this.setState({ borProfDetails: resdata.msgdata });

                    var primaryProfession;
                    var secondaryProfession;
                    var education;
                    var residenceType;
                    var landHolding;
                    var age;
                    var dependencies;
                    var yearsInResidence;
                    var yearsofearning;
                    var incomeRangegroup;

                    var remark1;
                    var remark2;
                    var remark3;
                    var remark4;
                    var remark5;
                    var remark6;
                    var remark7;
                    var remark8;
                    var remark9;
                    var remark10;
                    var profile = this.state.borProfDetails;
                    var result = profile.attributes.forEach((element, index) => {
                        if (element.attributetype === "Primary Profession") {
                            primaryProfession = element.attributevalue
                        }
                        if (element.attributetype === "Secondary Profession") {
                            secondaryProfession = element.attributevalue
                        }
                        if (element.attributetype === "Education") {
                            education = element.attributevalue
                        }
                        if (element.attributetype === "Residence Type") {
                            residenceType = element.attributevalue
                        }
                        if (element.attributetype === "Land Holding") {
                            landHolding = element.attributevalue
                        }
                        if (element.attributetype === "Age") {
                            age = element.attributevalue
                        }
                        if (element.attributetype === "Dependents") {
                            dependencies = element.attributevalue
                        }
                        if (element.attributetype === "Years In Residence") {
                            yearsInResidence = element.attributevalue
                        }
                        if (element.attributetype === "Years Of Earning") {
                            yearsofearning = element.attributevalue
                        }
                        if (element.attributetype === "Income Range Group") {
                            incomeRangegroup = element.attributevalue
                        }
                    })
                    // primaryProfession = profile.attributes.map((attribute, SubIndex) => {
                    //     return (
                    //         attribute.attributetype == "Primary Profession" ? attribute.attributevalue : null
                    //     )
                    // });


                    // Remark
                    remark1 = profile.attributes.map((attribute, SubIndex) => {
                        return (
                            attribute.attributetype == "Primary Profession" ? attribute.remark : ""
                        )
                    })
                    remark2 = profile.attributes.map((attribute, SubIndex) => {
                        return (
                            attribute.attributetype == "Education" ? attribute.remark : ""
                        )
                    })
                    remark3 = profile.attributes.map((attribute, SubIndex) => {
                        return (
                            attribute.attributetype == "Residence Type" ? attribute.remark : ""
                        )
                    })
                    remark4 = profile.attributes.map((attribute, SubIndex) => {
                        return (
                            attribute.attributetype == "Land Holding" ? attribute.remark : ""
                        )
                    })
                    remark5 = profile.attributes.map((attribute, SubIndex) => {
                        return (
                            attribute.attributetype == "Age" ? attribute.remark : ""
                        )
                    })
                    remark6 = profile.attributes.map((attribute, SubIndex) => {
                        return (
                            attribute.attributetype == "Dependents" ? attribute.remark : ""
                        )
                    })
                    remark7 = profile.attributes.map((attribute, SubIndex) => {
                        return (
                            attribute.attributetype == "Years In Residence" ? attribute.remark : ""
                        )
                    })
                    remark8 = profile.attributes.map((attribute, SubIndex) => {
                        return (
                            attribute.attributetype == "Years Of Earning" ? attribute.remark : ""
                        )
                    })
                    remark9 = profile.attributes.map((attribute, SubIndex) => {
                        return (
                            attribute.attributetype == "Income Range Group" ? attribute.remark : ""
                        )
                    })
                    remark10 = profile.attributes.map((attribute, SubIndex) => {
                        return (
                            attribute.attributetype == "Secondary Profession" ? attribute.remark : ""
                        )
                    })

                    this.setState({
                        primaryProfession: primaryProfession,
                        secondaryProfession: secondaryProfession,
                        education: education,
                        residenceType: residenceType,
                        landHolding: landHolding,
                        age: age,
                        dependencies: dependencies,
                        yearsInResidence: yearsInResidence,
                        yearsofearning: yearsofearning,
                        incomeRangegroup: incomeRangegroup
                    })

                    console.log(primaryProfession,
                        secondaryProfession,
                        education,
                        residenceType,
                        landHolding,
                        age,
                        dependencies,
                        yearsInResidence,
                        yearsofearning,
                        incomeRangegroup,
                        result
                    )
                    var remark1conv = remark1.toString().replace(/,/g, '');
                    this.setState({ remark1: remark1conv })

                    var remark2conv = remark2.toString().replace(/,/g, '');
                    this.setState({ remark2: remark2conv })

                    var remark3conv = remark3.toString().replace(/,/g, '');
                    this.setState({ remark3: remark3conv })

                    var remark4conv = remark4.toString().replace(/,/g, '');
                    this.setState({ remark4: remark4conv })

                    var remark5conv = remark5.toString().replace(/,/g, '');
                    this.setState({ remark5: remark5conv })

                    var remark6conv = remark6.toString().replace(/,/g, '');
                    this.setState({ remark6: remark6conv })

                    var remark7conv = remark7.toString().replace(/,/g, '');
                    this.setState({ remark7: remark7conv })

                    var remark8conv = remark8.toString().replace(/,/g, '');
                    this.setState({ remark8: remark8conv })

                    var remark9conv = remark9.toString().replace(/,/g, '');
                    this.setState({ remark9: remark9conv })

                    var remark10conv = remark10.toString().replace(/,/g, '');
                    this.setState({ remark10: remark10conv })
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
    }
    EvlCredAppraisal = (event) => {
        if (this.state.evlmodulation === "" || null || undefined) {
            this.setState({ resMsg: "Please enter moderation range." })
            $("#commonModal").click();
        } else {
            var result;
            var withSanctionAmt = JSON.stringify({
                loanreqno: sessionStorage.getItem('loanreqno'),
                gincome: this.state.gincome,
                nde: this.state.nde,
                ldef: this.state.ldef,
                cbd: this.state.cbd,
                lvr: this.state.lvr,
                evlmodulation: this.state.evlmodulation,
                deviationreason: this.state.deviationReason,
                loanmodifiedamt: this.state.sanctionAmt
            })
            var withoutSanctionAmt = JSON.stringify({
                loanreqno: sessionStorage.getItem('loanreqno'),
                gincome: this.state.gincome,
                nde: this.state.nde,
                ldef: this.state.ldef,
                cbd: this.state.cbd,
                lvr: this.state.lvr,
                evlmodulation: this.state.evlmodulation,
                deviationreason: this.state.deviationReason,
            })
            if (this.state.sanctionAmt) {
                result = withSanctionAmt
            } else {
                result = withoutSanctionAmt
            }
            console.log(result)
            fetch(BASEURL + '/lms/evlcreditappraisal', {
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

                        confirmAlert({
                            message: resdata.message,
                            buttons: [
                                {
                                    label: "Okay",
                                    onClick: () => {
                                        this.getloanOffers()
                                    }
                                }
                            ],
                            closeOnClickOutside: false,
                        })
                        // alert(resdata.message);
                        //window.location='/getEvaluatorLoans'
                    } else {
                        // alert("Failure, Please Try again Later.");
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
                    }

                })
        }

    }
    rejectReason = (e) => {
        this.setState({ rejectReason: e.target.value })
    }

    Rgincome = (e) => {
        this.setState({ Rgincome: e.target.value })
    }
    Rnde = (e) => {
        this.setState({ Rnde: e.target.value })
    }
    Rldef = (e) => {
        this.setState({ Rldef: e.target.value })
    }
    Rcbd = (e) => {
        this.setState({ Rcbd: e.target.value })
    }
    Rlvr = (e) => {
        this.setState({ Rlvr: e.target.value })
    }
    Revlmodulation = (e) => {
        this.setState({ Revlmodulation: e.target.value })
    }
    rejectLoan = () => {
        fetch(BASEURL + '/lms/evlrejectloanreq', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                loanreqno: sessionStorage.getItem('loanreqno'),
                loanrejectreason: this.state.rejectReason,
                gincome: this.state.Rgincome,
                nde: this.state.Rnde,
                ldef: this.state.Rldef,
                cbd: this.state.Rcbd,
                lvr: this.state.Rlvr,
                evlmodulation: this.state.Revlmodulation,
                deviationreason: "0"
            })
        }).then(response => {
            console.log('Response:', response)
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata);
                if (resdata.status == 'Success') {
                    confirmAlert({
                        message: resdata.message,
                        buttons: [
                            {
                                label: "Okay",
                                onClick: () => {
                                    window.location = '/getEvaluatorLoans'
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
                                label: "Okay",
                                onClick: () => {
                                    //window.location='/getEvaluatorLoans'
                                },
                            },
                        ],
                        closeOnClickOutside: false,
                    });
                    //alert("Failure, Please Try again Later.");
                }

            })
    }
    cancelReject = () => {
        window.location = "/getEvaluatorLoans"
    }
    getLoanStmt() {
        fetch(BASEURL + '/usrmgmt/getstmtslist?loanreqno=' + sessionStorage.getItem('loanreqno'), {
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
    collDocuments = (colldocrefid, loanreqno) => {
        fetch(BASEURL + '/lsp/getloancollateraldoc?loanreqno=' + loanreqno + '&colldocrefid=' + colldocrefid, {
            headers: {
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            responseType: 'arraybuffer',
            dataType: 'blob'
        })
            .then(response => {
                return response.blob();
            })
            .then((response) => {
                $("#launchColl").click();
                console.log('Response:', response)
                var collFile = new Blob([(response)], { type: 'application/pdf' });
                console.log(collFile);
                var collfileURL = URL.createObjectURL(collFile);
                console.log(collfileURL);
                document.getElementsByClassName('PDFdoc')[0].src = collfileURL + "#zoom=100";
            })
            .catch((error) => {
                console.log(error)
            })
    }
    bankStatements = (stmtid, filename) => {
        console.log(filename)
        const extension = filename.split('.').pop();
        console.log(extension);
        if (extension == "xml") {
            fetch(BASEURL + "/usrmgmt/downloadstmt?stmtid=" + stmtid + "&loanreqno=" + sessionStorage.getItem('loanreqno'), {
                headers: {
                    'Authorization': "Bearer " + sessionStorage.getItem('token'),
                },
            })
                .then(response => {
                    return response.text();
                })
                .then((response) => {
                    $("#launchColl").click();
                    console.log('Response:', response)

                    var jsonDataFromXml = new XMLParser().parseFromString(response);
                    console.log(jsonDataFromXml)
                    var jsonLists = [];
                    jsonLists = jsonDataFromXml.children;
                    console.log(jsonLists);

                    var transactionList = [];
                    var transactionAttri = {};
                    var StartDate;
                    var EndDate;
                    jsonLists.forEach(element => {
                        console.log(element);
                        console.log(element.name);
                        if (element.name == "Transactions") {
                            transactionList = element.children;
                            transactionAttri = element.attributes;

                            StartDate = transactionAttri.startDate;
                            EndDate = transactionAttri.endDate;
                            console.log(transactionList);
                            console.log(transactionAttri);
                            console.log(StartDate, EndDate);
                        }
                    });
                    var profileList = [];
                    var profilechildrenList = [];
                    var profileAtri = {};
                    jsonLists.forEach(element => {
                        console.log(element);
                        console.log(element.name);
                        if (element.name == "Profile") {
                            profileList = element.children;
                            profileList.forEach(e => {
                                console.log(e);
                                profilechildrenList = e.children;
                                console.log(profilechildrenList);
                                profilechildrenList.forEach(e => {
                                    console.log(e);
                                    if (e.name == "Holder") {
                                        profileAtri = e.attributes;
                                        console.log(profileAtri)
                                    }
                                })
                            })
                            console.log(profileList);
                        }
                    });
                    const unit = "pt";
                    const size = "A4"; // Use A1, A2, A3 or A4
                    const orientation = "portrait"; // portrait or landscape
                    const marginLeft = 40;
                    const doc = new jsPDF(orientation, unit, size);
                    doc.setFontSize(13);

                    const title1 = "Borrower Statement";
                    const heading1 = "Name: " + profileAtri.name;
                    const heading2 = "Date : From " + StartDate + " to " + EndDate;
                    const title = title1 + '\n' + heading1 + '\n' + heading2;
                    const headers = [["Amount", "Current Balance", "Reference Number", "TXN. Type", "Date"]];

                    const data = transactionList.map(list => [list.attributes.amount,
                    list.attributes.currentBalance,
                    list.attributes.reference,
                    list.attributes.type,
                    list.attributes.valueDate
                    ]);

                    let content = {
                        startY: 100,
                        head: headers,
                        body: data
                    };
                    doc.text(title, marginLeft, 40);
                    doc.autoTable(content);

                    var collFile = new Blob([(doc.output('blob'))], { type: 'application/pdf' });
                    console.log(collFile);
                    var collfileURL = URL.createObjectURL(collFile);
                    console.log(collfileURL);
                    document.getElementsByClassName('PDFdoc')[0].src = collfileURL + "#zoom=100";
                })
                .catch((error) => {
                    console.log(error)
                })
        } else if (extension == "pdf") {
            fetch(BASEURL + "/usrmgmt/downloadstmt?stmtid=" + stmtid + "&loanreqno=" + sessionStorage.getItem('loanreqno'), {
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
                    $("#launchColl").click();
                    console.log('Response:', response)
                    var collFile = new Blob([(response)], { type: 'application/pdf' });
                    console.log(collFile);
                    var collfileURL = URL.createObjectURL(collFile);
                    console.log(collfileURL);
                    document.getElementsByClassName('PDFdoc')[0].src = collfileURL + "#zoom=100";
                })
                .catch((error) => {
                    console.log(error)
                })
        }

    }
    downloadStmt(stmtid, filename) {
        console.log(stmtid);
        sessionStorage.setItem("stmtid", stmtid);
        this.bankStatements(stmtid, filename);
        // window.location = "/downloadStatement";
    }
    cancelCredAppraisal = () => {
        window.location = "/evaluatorDashboard"
    }
    extStmtInfo = (docid) => {
        sessionStorage.setItem('docName', docid)
        window.location = "/extStmtInfo"
    }
    updtStmtStatus = (docid) => {
        sessionStorage.setItem('docName', docid)
        window.location = "/updtStmt"
    }
    getFormTxnData = () => {
        fetch(BASEURL + '/lsp/getformtxndata?majorid=' + sessionStorage.getItem("loanreqno"), {
            method: 'GET',
            headers: {
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
        }).then(response => {
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata)
                if (resdata.status == 'SUCCESS') {
                    console.log(resdata.message);

                    this.setState({
                        formDetailList: resdata.msgdata
                    })
                    console.log(this.state.formDetailList);
                } else {
                    // confirmAlert({
                    //     message: resdata.message,
                    //     buttons: [
                    //         {
                    //             label: "Okay",
                    //             onClick: () => {

                    //             }
                    //         }
                    //     ],
                    //     closeOnClickOutside: false,
                    // })
                }

            })
    }
    submitEV = () => {
        window.location = "/getEvaluatorLoans"
    }
    handleChange() {
        $('.text').toggle();
        $('#PImage').toggle();
        $('#Pinfo').toggle();
    }
    render() {
        const { t } = this.props
        const reqno = sessionStorage.getItem('loanreqno');
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
        var tenureDesc = this.state.Otenuredesc;
        var getTenureDesc = "";
        if (tenureDesc == "Daily") {
            getTenureDesc = "Days"
        } else if (tenureDesc == "Monthly") {
            getTenureDesc = "Months"
        } else if (tenureDesc == "Yearly") {
            getTenureDesc = "Year"
        } else if (tenureDesc == "Weekly") {
            getTenureDesc = "Week"
        } else if (tenureDesc == "Quarterly") {
            getTenureDesc = "Quarter"
        }
        console.log(getTenureDesc)
        console.log(this.state.secondaryProfession)
        return (
            <div className="container-dashboard d-flex flex-row" id="wrapper" style={{ marginTop: "-7px", backgroundColor: "#f4f7fc" }}>
                {
                    this.state.showLoader && <Loader />
                }
                <EvaluatorSidebar />
                <div className="main-content" id="page-content-wrapper">
                    <div className="container-fluid row pt-2">
                        <div className="col-1" id='evlnavRes1'>
                            <button style={{ marginLeft: "25px" }} onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className='col-5' id='evlnavRes2' style={{ marginLeft: "20px", marginTop: "5px" }}>
                            <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                <Link to="/evaluatorDashboard">Home</Link> / <Link to="/getEvaluatorLoans">Loan Evaluation</Link> / Evaluator Credit Appraisal</p>
                        </div>
                        <div className='col'>

                        </div>
                        <div className='col'>

                        </div>
                        <div className='col-3'>

                        </div>
                        <div className="col" id='evlnavRes3'>
                            <button style={myStyle}>
                                <Link to="/getEvaluatorLoans"><FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} /><span style={{ textDecoration: "none", color: "white" }}>Back</span></Link></button>
                        </div>
                    </div>

                    <hr className="col-11" style={{ marginLeft: "50px", width: "88.6%", backgroundColor: "rgba(4,78,160,1)", marginTop: "0px" }} />

                    <div className='row' style={{ paddingLeft: "50px" }}>
                        <div className='col-4' id='headingRef'>
                            <div className="two__image" style={{ paddingLeft: "10px" }}>
                                <p className="text-white" style={{ paddingBottom: "6px", fontWeight: "600", fontSize: "15px" }}>Evaluator Credit Appraisal</p>
                            </div>
                        </div>
                    </div>
                    <button type="button" id='modal' style={{ display: "none" }} class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter">
                        Evl creditappraisal modal
                    </button>
                    <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered" role="document">
                            <div class="modal-content">
                                <div class="modal-body">
                                    <div className='row'>
                                        <div className='col'>
                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold", fontSize: "15px" }}><img src={batch} width="25px" />Offer Details</p>
                                            <hr style={{ width: "50px", marginTop: "-10px", backgroundColor: "rgb(0, 121, 191)" }} />

                                            <div className='row' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                <div className='col-sm-5 col-md-5 col-lg-5'>
                                                    <p className="mb-0 font-weight-bold">Loan Request Number</p>
                                                </div>
                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                    <p className="mb-0 font-weight-bold">:</p>
                                                </div>
                                                <div className='col-sm-4 col-md-4 col-lg-4'>
                                                    <p className="mb-0">{this.state.OLoanreqno}</p>
                                                </div>
                                            </div>
                                            <div className='row' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                <div className='col-sm-5 col-md-5 col-lg-5'>
                                                    <p className="mb-0 font-weight-bold">Loan Amount Offered</p>
                                                </div>
                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                    <p className="mb-0 font-weight-bold">:</p>
                                                </div>
                                                <div className='col-sm-4 col-md-4 col-lg-4'>
                                                    {
                                                        this.state.Oloanamtofferend ? <p className="mb-0">₹ {parseFloat(this.state.Oloanamtofferend).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</p> :
                                                            ""
                                                    }
                                                </div>
                                            </div>
                                            <div className='row' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                <div className='col-sm-5 col-md-5 col-lg-5'>
                                                    <p className="mb-0 font-weight-bold">EMI</p>
                                                </div>
                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                    <p className="mb-0 font-weight-bold">:</p>
                                                </div>
                                                <div className='col-sm-4 col-md-4 col-lg-4'>
                                                    {
                                                        this.state.Oemiamt ? <p className="mb-0">₹ {parseFloat(this.state.Oemiamt).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</p> :
                                                            ""
                                                    }
                                                </div>
                                            </div>
                                            <div className='row' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                <div className='col-sm-5 col-md-5 col-lg-5'>
                                                    <p className="mb-0 font-weight-bold">Interest Rate</p>
                                                </div>
                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                    <p className="mb-0 font-weight-bold">:</p>
                                                </div>
                                                <div className='col-sm-4 col-md-4 col-lg-4'>
                                                    <p className="mb-0">{(this.state.Ointerestrate * 100).toFixed(2)}% P.A.</p>
                                                </div>
                                            </div>
                                            <div className='row' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                <div className='col-sm-5 col-md-5 col-lg-5'>
                                                    <p className="mb-0 font-weight-bold">Tenure</p>
                                                </div>
                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                    <p className="mb-0 font-weight-bold">:</p>
                                                </div>
                                                <div className='col-sm-4 col-md-4 col-lg-4'>
                                                    <p className="mb-0">{this.state.Otenure} {getTenureDesc}</p>
                                                </div>
                                            </div>
                                            <div className='row' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                <div className='col-sm-5 col-md-5 col-lg-5'>
                                                    <p className="mb-0 font-weight-bold">Risk Rating</p>
                                                </div>
                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                    <p className="mb-0 font-weight-bold">:</p>
                                                </div>
                                                <div className='col-sm-4 col-md-4 col-lg-4'>
                                                    <p className="mb-0">{this.state.Oriskrating}</p>
                                                </div>
                                            </div>
                                            <hr style={{ backgroundColor: "rgba(5,54,82,1)" }} />
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col' style={{ textAlign: "center" }}>
                                            <button type="button" id='okSubmit' class="btn text-white btn-sm" style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.submitEV}>Okay</button>
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
                                    <button type="button" class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "rgb(0, 121, 191)" }}>Close</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="container" style={{ width: "94%" }}>
                        <div class="row">
                            <div class="col-md-4 mb-3">
                                <ul class="nav nav-pills flex-column" id="myTab" role="tablist" style={{ fontSize: "15px", fontFamily: "Poppins,sans-serif" }}
                                >
                                    <li class="nav-item mb-2">
                                        <a class="nav-link active" id="ref-tab" data-toggle="tab"
                                            href="#home" role="tab" aria-controls="home" aria-selected="true"><FaUserCircle />&nbsp;Borrower Details</a>
                                    </li>
                                    <li class="nav-item mb-2" >
                                        <a class="nav-link" id="refprofile-tab" data-toggle="tab"
                                            href="#profile" role="tab" aria-controls="profile" aria-selected="false"><FaRegFileAlt />&nbsp;Uploaded Statement</a>
                                    </li>
                                    <li class="nav-item mb-2" onClick={this.getExtractedStmtList}>
                                        <a class="nav-link" id="appraisal-tab" data-toggle="tab"
                                            href="#transaction" role="tab" aria-controls="transaction" aria-selected="false"><FaListAlt />&nbsp;Transaction Details</a>
                                    </li>
                                    <li class="nav-item mb-2" onClick={this.getcollateralDocList}>
                                        <a class="nav-link" id="appraisal3-tab" data-toggle="tab"
                                            href="#collateralDoc" role="tab" aria-controls="collateralDoc" aria-selected="false"><FaRegFile />&nbsp;Supplier Invoice</a>
                                    </li>
                                    <li class="nav-item mb-2">
                                        <a class="nav-link" id="appraisal2-tab" data-toggle="tab"
                                            href="#creditAppraisal" role="tab" aria-controls="creditAppraisal" aria-selected="false"><FaUsers />&nbsp;Evaluator Credit Appraisal</a>
                                    </li>
                                    <li class="nav-item mb-2">
                                        <a class="nav-link" id="reject-tab" data-toggle="tab"
                                            href="#rejectLoan" role="tab" aria-controls="rejectLoan" aria-selected="false"><FaUserMinus />&nbsp;Reject Loan Request</a>
                                    </li>
                                    {/* <li class="nav-item" onClick={this.getFormTxnData}>
                                        <a class="nav-link" id="formData-tab" data-toggle="tab"
                                            href="#formData" role="tab" aria-controls="formData" aria-selected="false"><FaWpforms />&nbsp;Form Data</a>
                                    </li> */}
                                </ul>
                            </div>
                            <div class="col-md-8">
                                <div class="tab-content" id="myTabContent" style={{ marginTop: "-15px", marginLeft: "-20px" }}>
                                    <div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="ref-tab">
                                        <div className="card" style={{ cursor: "default" }}>
                                            <div className="card-header border-1 bg-white">
                                                <div className='row'>
                                                    <div className='col'>
                                                        <p style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}><span className="font-weight-bold">Loan Request Number : </span>{reqno}</p>
                                                    </div>
                                                </div>

                                                <div className='row mb-2'>
                                                    <div className='col'>
                                                        <div className='card' style={{ marginTop: "-10px" }}>
                                                            <div className='' style={{ cursor: "default" }} >
                                                                <div className='row p-2'>
                                                                    <div className='col' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                                        <div className='row'>
                                                                            <div className='col-4'>
                                                                                <p className="mb-0 font-weight-bold">Borrower Name</p>
                                                                            </div>
                                                                            <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                                <p className="mb-0 font-weight-bold">:</p>
                                                                            </div>
                                                                            <div className='col-7'>
                                                                                <p className="mb-0">{this.state.profilename}</p>
                                                                            </div>
                                                                        </div>
                                                                        <div className='row'>
                                                                            <div className='col-4'>
                                                                                <p className="mb-0 font-weight-bold">Facilitator ID</p>
                                                                            </div>
                                                                            <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                                <p className="mb-0 font-weight-bold">:</p>
                                                                            </div>
                                                                            <div className='col-7'>
                                                                                <p className="mb-0">{this.state.facilitatorId}</p>
                                                                            </div>
                                                                        </div>
                                                                        <div className='row'>
                                                                            <div className='col-4'>
                                                                                <p className="mb-0 font-weight-bold">Loan Amount Request</p>
                                                                            </div>
                                                                            <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                                <p className="mb-0 font-weight-bold">:</p>
                                                                            </div>
                                                                            <div className='col-7'>
                                                                                <p className="mb-0">
                                                                                    ₹ {parseFloat(this.state.loanamtreq).toFixed(2).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                        <div className='row'>
                                                                            <div className='col-4'>
                                                                                <p className="mb-0 font-weight-bold">Request Date</p>
                                                                            </div>
                                                                            <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                                <p className="mb-0 font-weight-bold">:</p>
                                                                            </div>
                                                                            <div className='col-7'>
                                                                                <p className="mb-0">{this.state.loanreqdate.split("-").reverse().join("-")}</p>
                                                                            </div>
                                                                        </div>
                                                                        <div style={{ backgroundColor: (this.state.remark1 == "") ? "" : "rgb(240, 249, 255)" }}>
                                                                            <div className='row'>
                                                                                <div className='col-4'>
                                                                                    <p className="mb-0 font-weight-bold">Primary Profession</p>
                                                                                </div>
                                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                                </div>

                                                                                <div className='col-7'>
                                                                                    <p className='mb-0'>{this.state.primaryProfession}</p>
                                                                                </div>
                                                                            </div>
                                                                            {this.state.remark1 == "" ? <div></div> :
                                                                                <div className='row mb-2'>
                                                                                    <div className='col-4'>
                                                                                        <p className="mb-0 font-weight-bold">Remark</p>
                                                                                    </div>
                                                                                    <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                                        <p className="mb-0 font-weight-bold">:</p>
                                                                                    </div>
                                                                                    <div className='col-7'>
                                                                                        <p className="mb-0 font-weight-bold">{this.state.remark1}</p>
                                                                                    </div>
                                                                                </div>}
                                                                        </div>
                                                                        <div style={{ backgroundColor: (this.state.remark10 == "") ? "" : "rgb(240, 249, 255)" }}>
                                                                            {this.state.secondaryProfession === undefined ? <></> :
                                                                                <div className='row'>
                                                                                    <div className='col-4'>
                                                                                        <p className="mb-0 font-weight-bold">Secondary Profession</p>
                                                                                    </div>
                                                                                    <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                                        <p className="mb-0 font-weight-bold">:</p>
                                                                                    </div>

                                                                                    <div className='col-7'>
                                                                                        <p className='mb-0'>{this.state.secondaryProfession}</p>
                                                                                    </div>
                                                                                </div>
                                                                            }
                                                                            {this.state.remark10 == "" ? <div></div> :
                                                                                <div className='row mb-2'>
                                                                                    <div className='col-4'>
                                                                                        <p className="mb-0 font-weight-bold">Remark</p>
                                                                                    </div>
                                                                                    <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                                        <p className="mb-0 font-weight-bold">:</p>
                                                                                    </div>
                                                                                    <div className='col-7'>
                                                                                        <p className="mb-0 font-weight-bold">{this.state.remark10}</p>
                                                                                    </div>
                                                                                </div>}
                                                                        </div>
                                                                        <div style={{ backgroundColor: (this.state.remark2 == "") ? "" : "rgb(240, 249, 255)" }}>
                                                                            <div className='row'>
                                                                                <div className='col-4'>
                                                                                    <p className="mb-0 font-weight-bold">Education</p>
                                                                                </div>
                                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                                </div>
                                                                                <div className='col-7'>
                                                                                    <p className="mb-0">{this.state.education}</p>
                                                                                </div>
                                                                            </div>
                                                                            {this.state.remark2 == "" ? <div></div> :
                                                                                <div className='row mb-2'>
                                                                                    <div className='col-4'>
                                                                                        <p className="mb-0 font-weight-bold">Remark</p>
                                                                                    </div>
                                                                                    <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                                        <p className="mb-0 font-weight-bold">:</p>
                                                                                    </div>
                                                                                    <div className='col-7'>
                                                                                        <p className="mb-0 font-weight-bold">{this.state.remark2}</p>
                                                                                    </div>
                                                                                </div>}
                                                                        </div>
                                                                        <div style={{ backgroundColor: (this.state.remark3 == "") ? "" : "rgb(240, 249, 255)" }}>
                                                                            <div className='row'>
                                                                                <div className='col-4'>
                                                                                    <p className="mb-0 font-weight-bold">Residence Type</p>
                                                                                </div>
                                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                                </div>
                                                                                <div className='col-7'>
                                                                                    <p className="mb-0">{this.state.residenceType}</p>
                                                                                </div>
                                                                            </div>
                                                                            {this.state.remark3 == "" ? <div></div> :
                                                                                <div className='row mb-2'>
                                                                                    <div className='col-4'>
                                                                                        <p className="mb-0 font-weight-bold">Remark</p>
                                                                                    </div>
                                                                                    <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                                        <p className="mb-0 font-weight-bold">:</p>
                                                                                    </div>
                                                                                    <div className='col-7'>
                                                                                        <p className="mb-0 font-weight-bold">{this.state.remark3}</p>
                                                                                    </div>
                                                                                </div>}
                                                                        </div>
                                                                        <div style={{ backgroundColor: (this.state.remark4 == "") ? "" : "rgb(240, 249, 255)" }}>
                                                                            <div className='row'>
                                                                                <div className='col-4'>
                                                                                    <p className="mb-0 font-weight-bold">Land Holding</p>
                                                                                </div>
                                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                                </div>
                                                                                <div className='col-7'>
                                                                                    <p className="mb-0">{this.state.landHolding}</p>
                                                                                </div>
                                                                            </div>
                                                                            {this.state.remark4 == "" ? <div></div> :
                                                                                <div className='row mb-2'>
                                                                                    <div className='col-4'>
                                                                                        <p className="mb-0 font-weight-bold">Remark</p>
                                                                                    </div>
                                                                                    <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                                        <p className="mb-0 font-weight-bold">:</p>
                                                                                    </div>
                                                                                    <div className='col-7'>
                                                                                        <p className="mb-0 font-weight-bold">{this.state.remark4}</p>
                                                                                    </div>
                                                                                </div>}
                                                                        </div>
                                                                        <div style={{ backgroundColor: (this.state.remark9 == "") ? "" : "rgb(240, 249, 255)" }}>
                                                                            <div className='row'>
                                                                                <div className='col-4'>
                                                                                    <p className="mb-0 font-weight-bold">Income Range Group</p>
                                                                                </div>
                                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                                </div>
                                                                                <div className='col-7'>
                                                                                    <p className="mb-0">{this.state.incomeRangegroup}</p>
                                                                                </div>
                                                                            </div>
                                                                            {this.state.remark9 == "" ? <div></div> :
                                                                                <div className='row mb-2'>
                                                                                    <div className='col-4'>
                                                                                        <p className="mb-0 font-weight-bold">Remark</p>
                                                                                    </div>
                                                                                    <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                                        <p className="mb-0 font-weight-bold">:</p>
                                                                                    </div>
                                                                                    <div className='col-7'>
                                                                                        <p className="mb-0 font-weight-bold">{this.state.remark9}</p>
                                                                                    </div>
                                                                                </div>}
                                                                        </div>
                                                                        <div style={{ backgroundColor: (this.state.remark6 == "") ? "" : "rgb(240, 249, 255)" }}>
                                                                            <div className='row'>
                                                                                <div className='col-4'>
                                                                                    <p className="mb-0 font-weight-bold">Dependents</p>
                                                                                </div>
                                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                                </div>
                                                                                <div className='col-7'>
                                                                                    <p className="mb-0">{this.state.dependencies}</p>
                                                                                </div>
                                                                            </div>
                                                                            {this.state.remark6 == "" ? <div></div> :
                                                                                <div className='row mb-2'>
                                                                                    <div className='col-4'>
                                                                                        <p className="mb-0 font-weight-bold">Remark</p>
                                                                                    </div>
                                                                                    <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                                        <p className="mb-0 font-weight-bold">:</p>
                                                                                    </div>
                                                                                    <div className='col-7'>
                                                                                        <p className="mb-0 font-weight-bold">{this.state.remark6}</p>
                                                                                    </div>
                                                                                </div>}

                                                                        </div>
                                                                        <div style={{ backgroundColor: (this.state.remark7 == "") ? "" : "rgb(240, 249, 255)" }}>
                                                                            <div className='row'>
                                                                                <div className='col-4'>
                                                                                    <p className="mb-0 font-weight-bold">Years in Residence</p>
                                                                                </div>
                                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                                </div>
                                                                                <div className='col-7'>
                                                                                    <p className="mb-0">{this.state.yearsInResidence}</p>
                                                                                </div>
                                                                            </div>
                                                                            {this.state.remark7 == "" ? <div></div> :
                                                                                <div className='row mb-2'>
                                                                                    <div className='col-4'>
                                                                                        <p className="mb-0 font-weight-bold">Remark</p>
                                                                                    </div>
                                                                                    <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                                        <p className="mb-0 font-weight-bold">:</p>
                                                                                    </div>
                                                                                    <div className='col-7'>
                                                                                        <p className="mb-0 font-weight-bold">{this.state.remark7}</p>
                                                                                    </div>
                                                                                </div>}

                                                                        </div>
                                                                        <div style={{ backgroundColor: (this.state.remark8 == "") ? "" : "rgb(240, 249, 255)" }}>
                                                                            <div className='row'>
                                                                                <div className='col-4'>
                                                                                    <p className="mb-0 font-weight-bold">Years of Earning</p>
                                                                                </div>
                                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                                </div>
                                                                                <div className='col-7'>
                                                                                    <p className="mb-0">{this.state.yearsofearning}</p>
                                                                                </div>
                                                                            </div>
                                                                            {this.state.remark8 == "" ? <div></div> :
                                                                                <div className='row mb-2'>
                                                                                    <div className='col-4'>
                                                                                        <p className="mb-0 font-weight-bold">Remark</p>
                                                                                    </div>
                                                                                    <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                                        <p className="mb-0 font-weight-bold">:</p>
                                                                                    </div>
                                                                                    <div className='col-7'>
                                                                                        <p className="mb-0 font-weight-bold">{this.state.remark8}</p>
                                                                                    </div>
                                                                                </div>}

                                                                        </div>
                                                                        <div style={{ backgroundColor: (this.state.remark5 == "") ? "" : "rgb(240, 249, 255)" }}>
                                                                            <div className='row'>
                                                                                <div className='col-4'>
                                                                                    <p className="mb-0 font-weight-bold">Age</p>
                                                                                </div>
                                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                                </div>
                                                                                <div className='col-7'>
                                                                                    <p className="mb-0">{this.state.age}</p>
                                                                                </div>
                                                                            </div>
                                                                            {this.state.remark5 == "" ? <div></div> :
                                                                                <div className='row mb-2'>
                                                                                    <div className='col-4'>
                                                                                        <p className="mb-0 font-weight-bold">Remark</p>
                                                                                    </div>
                                                                                    <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                                        <p className="mb-0 font-weight-bold">:</p>
                                                                                    </div>
                                                                                    <div className='col-7'>
                                                                                        <p className="mb-0 font-weight-bold">{this.state.remark5}</p>
                                                                                    </div>
                                                                                </div>}
                                                                        </div>
                                                                    </div>
                                                                    {/* <div className='col' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                                        
                                                                    </div> */}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {this.state.formDetailList && this.state.formDetailList.length > 0 &&
                                                    <>
                                                        <div className='row'>
                                                            <div className='col'>
                                                                <p style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}><span className="font-weight-bold">Verifier Feedback</span></p>
                                                            </div>
                                                        </div>
                                                        <div className='row'>
                                                            <div className='col'>
                                                                <div className='card' style={{ marginTop: "-10px", cursor: "default" }}>
                                                                    {this.state.formDetailList.map((form, subIndex) => {
                                                                        return (
                                                                            <div className='row p-2' key={subIndex}>
                                                                                {form.formdata && form.formdata.formfields && form.formdata.formfields.map((formData, index) => {
                                                                                    return (
                                                                                        <div className='col-4' key={index} style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                                                            <p style={{ fontWeight: "bold" }}>{formData.field}</p>
                                                                                            <p style={{ marginTop: "-15px" }}>{formData.value}</p>
                                                                                        </div>
                                                                                    )
                                                                                })}
                                                                            </div>
                                                                        )
                                                                    })}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </>

                                                }


                                            </div>
                                        </div>
                                    </div>
                                    <div class="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="refprofile-tab">
                                        <div className="card" style={{ cursor: "default", fontSize: "14px" }}>
                                            <div className="card-header border-1 bg-white">
                                                <div className='row'>
                                                    <div className='col'>
                                                        <p style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}><span className="font-weight-bold">Loan Request  Number : </span>{reqno}</p>
                                                    </div>
                                                </div>
                                                {
                                                    this.state.loanStmt.map((loan, index) => {
                                                        return (
                                                            <>
                                                                <div className='row'>
                                                                    <div className='col'>
                                                                        <div className='card'>
                                                                            <div className='' style={{ cursor: "default" }} >
                                                                                <div className='row p-2'>
                                                                                    <div className='col' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                                                        <div className='row'>
                                                                                            <div className='col-sm-3 col-md-3 col-lg-3'>
                                                                                                <p className="mb-0 font-weight-bold">File Name</p>
                                                                                            </div>
                                                                                            <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                                                <p className="mb-0 font-weight-bold">:</p>
                                                                                            </div>
                                                                                            <div className='col'>
                                                                                                <p className="mb-0">{loan.filename}</p>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className='row'>
                                                                                            <div className='col-sm-3 col-md-3 col-lg-3'>
                                                                                                <p className="mb-0 font-weight-bold">Statement ID</p>
                                                                                            </div>
                                                                                            <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                                                <p className="mb-0 font-weight-bold">:</p>
                                                                                            </div>
                                                                                            <div className='col'>
                                                                                                <p className="mb-0">{loan.stmtid}</p>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div className='row'>
                                                                    <div className='col' style={{ textAlign: "center" }}>
                                                                        <button className='btn btn-sm text-white' style={{ backgroundColor: "#0079BF" }} onClick={this.downloadStmt.bind(this, loan.stmtid, loan.filename)}>View Statement</button>
                                                                    </div>
                                                                </div>
                                                            </>
                                                        )
                                                    })
                                                }


                                            </div>
                                        </div>
                                    </div>
                                    <div class="tab-pane fade" id="transaction" role="tabpanel" aria-labelledby="transaction">
                                        <div className="card" style={{ cursor: "default", overflow: "visible", fontSize: "14px" }}>
                                            <div className="card-header border-1 bg-white">
                                                <div className='row'>
                                                    <div className='col'>
                                                        <p style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}><span className="font-weight-bold">Loan Request  Number : </span>{reqno}</p>
                                                    </div>
                                                </div>
                                                <div className='row font-weight-normal' style={{ fontWeight: "800", fontSize: "14px", color: "rgba(5,54,82,1)" }}>
                                                    <div className='col' style={{ paddingLeft: "25px" }}>
                                                        <p style={{ fontWeight: "600" }}>{t('Document ID')}</p>
                                                    </div>
                                                    <div className='col'>
                                                        <p style={{ fontWeight: "600" }}>{t('Document Name')}</p>
                                                    </div>
                                                    <div className='col' style={{ textAlign: "end" }}>
                                                        <p style={{ fontWeight: "600", marginRight: "-15px" }}>{t('Extracted Date')}</p>
                                                    </div>
                                                    <div className='col'>
                                                        <p style={{ fontWeight: "600", marginLeft: "-3px" }}>{t('Verification Status')}</p>
                                                    </div>
                                                </div>
                                                <hr className="col-12" style={{ marginTop: "-10px", width: "96.6%", marginLeft: "-5px" }} />
                                                <div className="row" style={{ marginTop: "-25px", marginBottom: "20px" }}>
                                                    {
                                                        this.state.extStmtList.map((Lists, index) => {
                                                            return (
                                                                <div key={index}>
                                                                    <div class="card" style={{ cursor: 'default', overflow: "visible", borderLeft: "6px solid rgb(0, 121, 190)", backgroundColor: (index % 2 == 0) ? 'rgba(255,255,255,1)' : 'rgba(242,242,242,1)' }} >
                                                                        <div class="row align-items-center" style={{ color: "rgb(5, 54, 82)", paddingTop: "10px" }}>
                                                                            <div class="col-2">
                                                                                <p style={{ paddingLeft: "10px" }}>{Lists.docid}</p>
                                                                            </div>
                                                                            <div class="col-5" style={{ textAlign: "center" }}>
                                                                                <p>{Lists.docname}</p>
                                                                            </div>

                                                                            <div class="col-2">
                                                                                <p style={{ width: "100px" }}>{new Date(Lists.extractedon).toLocaleDateString('en-GB').split("/").join("-")}</p>
                                                                            </div>
                                                                            <div className='col-3' style={{ marginTop: "-14px" }}>
                                                                                {Lists.isverified == 1 ? <span>Verified&nbsp;<FaCheckCircle style={{ color: "green" }} /></span> :
                                                                                    <span>{Lists.isverified == 0 ? <span>Not Verified&nbsp;<FaTimesCircle style={{ color: "grey" }} /></span> : <span>Rejected&nbsp;<FaTimesCircle style={{ color: "grey" }} /></span>}</span>}

                                                                                &nbsp;
                                                                                <span class="dropup">
                                                                                    <img src={openit} class="btn dropdown-toggle dropdown-toggle-split"
                                                                                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" style={{ height: "35px" }} />

                                                                                    <div class="dropdown-menu" aria-labelledby="dropdownMenuButton" style={{ marginLeft: "-160px" }}>
                                                                                        <a class="dropdown-item" onClick={this.extStmtInfo.bind(this, Lists.docid)}>Statement Information</a>
                                                                                        {Lists.isverified == 0 &&
                                                                                            <a class="dropdown-item" onClick={this.updtStmtStatus.bind(this, Lists.docid)}>Update Statement Status</a>
                                                                                        }
                                                                                    </div>
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })
                                                    }
                                                </div>
                                                <div className='row' style={{ textAlign: "center" }}>
                                                    <p style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>{this.state.noStmtMsg}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="tab-pane fade" id="collateralDoc" role="tabpanel" aria-labelledby="collateralDoc">
                                        <div className="card" style={{ cursor: "default", fontSize: "14px" }}>
                                            <div className="card-header border-1 bg-white">
                                                <div className='row'>
                                                    <div className='col'>
                                                        <p style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}><span className="font-weight-bold">Loan Request Number : </span>{reqno}</p>
                                                    </div>
                                                </div>
                                                <div className='row font-weight-normal' style={{ fontWeight: "800", fontSize: "14px", color: "rgba(5,54,82,1)" }}>
                                                    <div className='col' style={{ paddingLeft: "30px" }}>
                                                        <p style={{ fontWeight: "600" }}>{t('Document Type')}</p>
                                                    </div>
                                                    <div className='col'>
                                                        <p style={{ fontWeight: "600" }}>{t('Document Name')}</p>
                                                    </div>
                                                    <div className='col' style={{ textAlign: "center" }}>
                                                        <p style={{ fontWeight: "600", paddingLeft: "40px" }}>{t('View')}</p>
                                                    </div>
                                                </div>
                                                <hr className="col-12" style={{ marginTop: "-10px", width: "96.6%", marginLeft: "-5px" }} />
                                                <div className="row" style={{ marginTop: "-25px", marginBottom: "20px" }}>
                                                    {
                                                        this.state.collateralList.map((collList, index) => {
                                                            return (
                                                                <div key={index}>
                                                                    <div class="card" style={{ color: "rgb(5, 54, 82)", cursor: 'default', overflow: "visible", borderLeft: "6px solid rgb(0, 121, 190)", backgroundColor: (index % 2 == 0) ? 'rgba(255,255,255,1)' : 'rgba(242,242,242,1)' }} >
                                                                        <div class="row align-items-center" style={{ color: "rgb(5, 54, 82)" }}>
                                                                            <div class="col-3">
                                                                                <p style={{ paddingLeft: "18px", marginTop: "10px" }}>{collList.colldocrefid}</p>
                                                                            </div>
                                                                            <div class="col-6" style={{ paddingLeft: "80px" }}>
                                                                                <p style={{ marginTop: "10px" }}>{collList.docname}</p>
                                                                            </div>
                                                                            <div class="col-3" style={{ textAlign: "center" }}>
                                                                                <FaEye style={{ fontSize: "30px", color: "rgba(0,121,190,1)", marginLeft: "-12px" }} onClick={this.collDocuments.bind(this, collList.colldocrefid, collList.loanreqno)} />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="tab-pane fade" id="creditAppraisal" role="tabpanel" aria-labelledby="creditAppraisal">
                                        <div className="card" style={{ cursor: "default", fontSize: "14px" }}>
                                            <div className="card-header border-1 bg-white">
                                                <div className="form-row">
                                                    <div className="form-group col-md-6">
                                                        <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Gross Income(P.A.) *')}</p>
                                                        <input type="text" className="form-control" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}
                                                            id="inputAddress" placeholder={t('Gross Income')} onChange={this.gincome}
                                                            value={this.state.gincome} />
                                                    </div>
                                                    <div className="form-group col-md-6">
                                                        <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Non Discretionary Exp. Value *')}</p>
                                                        <input type="text" className="form-control" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}
                                                            id="inputAddress" placeholder={t('Non Discretionary Exp. Value')} onChange={this.nde}
                                                            value={this.state.nde} />
                                                    </div>
                                                </div>
                                                <div className="form-row">
                                                    <div className="form-group col-md-6">
                                                        <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Number Of Loan Defaults *')}</p>
                                                        <input type="text" className="form-control" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}
                                                            id="inputAddress" placeholder={t('Number Of Loan Default')} onChange={this.ldef} value={this.state.ldef} />
                                                    </div>
                                                    <div className="form-group col-md-6">
                                                        <p htmlFor="Email" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Number Of Cheque Bounces *')}</p>
                                                        <input type="text" className="form-control" id="inputAddress" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}
                                                            placeholder={t('Number Of Cheque Bounce')} onChange={this.cbd}
                                                            value={this.state.cbd} />
                                                    </div>
                                                </div>
                                                <div className="form-row">
                                                    <div className="form-group col-md-6">
                                                        <p htmlFor="Mobile" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Loan Value Ratio *')}</p>
                                                        <input type="number" className="form-control" id="inputAddress" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}
                                                            placeholder={t('Loan Value Ratio')} onChange={this.lvr}
                                                            value={this.state.lvr} />
                                                    </div>
                                                    <div className="form-group col-md-6">
                                                        <p htmlFor="Pan" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold", width: "max-content" }}>{t("Evaluator Moderation (Range -50 to 50) *")}</p>
                                                        <input id="Pan" type="text" className="form-control" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}
                                                            placeholder={t('Evaluator Moderation')} onChange={this.evlmodulation} />
                                                    </div>
                                                </div>
                                                <div className="form-row">
                                                    <div className="form-group col-md-6">
                                                        <p htmlFor="Rating" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Sanction Amount(Optional)')}</p>
                                                        <input type="number" className="form-control" id="inputAddress" onChange={this.sanctionAmt} placeholder='Enter Amount'
                                                            style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="form-row">
                                                    {this.state.rating &&
                                                        <div className="form-group col-md-6">
                                                            <p htmlFor="Rating" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Rating *')}</p>
                                                            <input type="number" className="form-control" id="inputAddress" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}
                                                                value={this.state.rating} readOnly />
                                                        </div>
                                                    }
                                                    <div className="form-group col-md-6">
                                                        <p htmlFor="Mobile" id='reason' style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold", display: "none" }}>{t('Deviation Reason (Maximum 255 words) *')}</p>
                                                        <textarea id="reason1" className="form-control" rows={4} cols={40} style={{ display: "none", marginTop: "-10px" }} type="text" maxLength={255} onChange={this.deviationReason}></textarea>
                                                    </div>
                                                </div>
                                                <hr />

                                                <div className="form-row" style={{ textAlign: "center" }}>
                                                    <div className="form-group col">
                                                        <button type="button" className="btn mr-2 text-white btn-sm" style={{ backgroundColor: "rgb(136, 189, 72)" }}
                                                            onClick={this.EvlCredAppraisal}>Approve & Generate Sanction Letter</button>
                                                        {/* <button type="button" className="btn text-white btn-sm" style={{ backgroundColor: "#0079BF" }}
                                                            onClick={this.cancelCredAppraisal}>{t('Discard')}</button> */}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="tab-pane fade" id="rejectLoan" role="tabpanel" aria-labelledby="rejectLoan">
                                        <div className="card" style={{ cursor: "default", fontSize: "14px" }}>
                                            <div className="card-header border-1 bg-white">
                                                <div className="form-row">
                                                    <div className="form-group col-md-6">
                                                        <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Gross Income(P.A.) *')}</p>
                                                        <input type="text" className="form-control" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-14px" }}
                                                            id="inputAddress" placeholder={t('Gross Income')} onChange={this.Rgincome}
                                                            value={this.state.Rgincome} />
                                                    </div>
                                                    <div className="form-group col-md-6">
                                                        <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Non Discretionary Exp. Value *')}</p>
                                                        <input type="text" className="form-control" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-14px" }}
                                                            id="inputAddress" placeholder={t('Non Discretionary Exp. Value')} onChange={this.Rnde}
                                                            value={this.state.Rnde} />
                                                    </div>
                                                </div>
                                                <div className="form-row">
                                                    <div className="form-group col-md-6">
                                                        <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Number Of Loan Default *')}</p>
                                                        <input type="text" className="form-control" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-14px" }}
                                                            id="inputAddress" placeholder={t('Number Of Loan Default')} onChange={this.Rldef}
                                                            value={this.state.Rldef} />
                                                    </div>
                                                    <div className="form-group col-md-6">
                                                        <p htmlFor="Email" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Number Of Cheque Bounce *')}</p>
                                                        <input type="text" className="form-control" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-14px" }}
                                                            id="inputAddress" placeholder={t('Number Of Cheque Bounce')} onChange={this.Rcbd}
                                                            value={this.state.Rcbd} />
                                                    </div>
                                                </div>
                                                <div className="form-row">
                                                    <div className="form-group col-md-6">
                                                        <p htmlFor="Mobile" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Loan Value Ratio *')}</p>
                                                        <input type="text" className="form-control" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-14px" }}
                                                            id="inputAddress" placeholder={t('Loan value ratio')} onChange={this.Rlvr}
                                                            value={this.state.Rlvr} />
                                                    </div>
                                                    <div className="form-group col-md-6">
                                                        <p htmlFor="Pan" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold", width: "max-content" }}>{t("Evaluator Moderation (Range -50 to 50) *")}</p>
                                                        <input type="text" className="form-control" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-14px" }}
                                                            id="inputAddress" placeholder={t('Evaluator Moderation')} onChange={this.Revlmodulation}
                                                            value={this.state.Revlmodulation} />
                                                    </div>
                                                </div>
                                                <div className="form-row">
                                                    {this.state.rating &&
                                                        <div className="form-group col-md-6">
                                                            <p htmlFor="Rating" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Rating *')}</p>
                                                            <input type="number" className="form-control" id="inputAddress" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}
                                                                value={this.state.rating} readOnly />
                                                        </div>
                                                    }
                                                    <div className="form-group col-6">
                                                        <p htmlFor="Pan" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t("Reject Reason *")}</p>
                                                        <textarea type="text" class="form-control" onChange={this.rejectReason}
                                                            rows={3} cols={30} maxLength={255}
                                                            placeholder="Description" style={{ color: "rgb(5, 54, 82)", marginTop: "-10px" }}>
                                                        </textarea>
                                                    </div>
                                                </div>
                                                <hr />
                                                <div className="form-row" style={{ textAlign: "center" }}>
                                                    <div className="form-group col">
                                                        <button type="button" className="btn mr-2 text-white btn-sm" style={{ backgroundColor: "rgb(136, 189, 72)" }}
                                                            onClick={this.rejectLoan}>Reject</button>
                                                        <button type="button" className="btn text-white btn-sm" style={{ backgroundColor: "#0079BF" }}
                                                            onClick={this.cancelReject}>{t('Discard')}</button>
                                                    </div>
                                                </div>
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
                                        style={{ backgroundColor: "rgb(136, 189, 72)" }} >Close</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withTranslation()(EvalCreditAppraisal);
