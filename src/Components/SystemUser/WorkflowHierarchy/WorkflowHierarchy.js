import React, { Component } from 'react';
import $, { param } from 'jquery';
import { BASEURL } from '../../assets/baseURL';
import SystemUserSidebar from "../SystemUserSidebar";
import { withTranslation } from 'react-i18next';
import { FaPlus } from "react-icons/fa";
import {
    FaCheckCircle, FaFileAlt, FaTimesCircle,
    FaAngleLeft, FaAngleDoubleRight,
    FaRegUser, FaEdit, FaMapMarkerAlt,
    FaHouseUser, FaUserEdit, FaFolderPlus, FaDownload,
} from "react-icons/fa";
import dashboardIcon from '../../assets/icon_dashboard.png';
import { Link } from 'react-router-dom';
import openIt from '../../assets/AdminImg/openit.png'
import us from '../../assets/AdminImg/pro.png';
import editRole from '../../assets/editRole.png';
import ReactPaginate from 'react-paginate';
import '../../Borrower/Pagination.css';
import { confirmAlert } from "react-confirm-alert";
import jsPDF from "jspdf";
import "jspdf-autotable";
import logo2 from '../../assets/IFPL.jpg';
import batch from '../../assets/batch.png';
import Loader from '../../Loader/Loader';
import { FcOk } from "react-icons/fc";
import { GiSandsOfTime, GiTimeTrap } from "react-icons/gi";
import XMLParser from "react-xml-parser";

export class WorkflowHierarchy extends Component {
    constructor(props) {
        super(props)
        this.state = {
            offset: 0,
            orgtableData: [],
            perPage: 20,
            currentPage: 0,
            pageCount: "",

            getwkflwPendingLoansList: [],
            getHrcyStaffLists: [],
            list: [],
            pdfBtn: false,
            resMsg: "",
            userID: sessionStorage.getItem('userID'),
            loanreqNo: "",
            orderNo: "",
            officeLevel: "",
            staffHierarchy: "",
            staffMasterList: [],
            officemasterList: [],
            workflowLoanStatus: [],

            statusField: "",
            statusComments: "",
            pmID: "",

            //breakdown
            profileAttributes: {},
            loanStmtlist: {},
            creditEvlList: {},
            loanOffers: {},
            approvedActivities: [],
            activityID: "",
            showLoader: false,
            approveStatusFlag: false,
            assignedTo: "",
            performedBy: "",
            commentflag: false
        }
        this.list0ref = React.createRef();
    }
    componentDidMount() {
        this.getWfPendingList()
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
            getwkflwPendingLoansList: slice
        })
    }
    getWfPendingList = (params) => {
        var url;
        if (params === "allLoans") {
            url = `/usrmgmt/getwfpendingloans/hierarchy/approverstage?status=0`
            this.setState({ commentflag: false })
        } else if (params === "assignedLoans") {
            url = `/usrmgmt/getwfpendingloans/hierarchy/approverstage${this.state.userID ? `?username=${this.state.userID}` : ''}`
            this.setState({ commentflag: false })
        } else if (params === "rejectedLoans") {
            url = `/usrmgmt/getwfpendingloans/hierarchy/approverstage?status=2`
            this.setState({ commentflag: true })
        } else {
            url = `/usrmgmt/getwfpendingloans/hierarchy/approverstage?status=0`
            this.setState({ commentflag: false })
        }
        console.log(url)
        this.setState({ showLoader: true })
        fetch(BASEURL + url, {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            }
        }).then((response) => {
            console.log("Response:", response);
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata);
                if (resdata.status == "Success" || resdata.status == "SUCCESS") {
                    this.setState({ showLoader: false })

                    var data = resdata.msgdata
                    console.log(data)
                    var slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
                    console.log(slice)

                    this.setState({
                        pageCount: Math.ceil(data.length / this.state.perPage),
                        orgtableData: data,
                        getwkflwPendingLoansList: slice
                    })

                    this.getStaffhierarchy()
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
                        this.setState({ showLoader: false })
                    } else {
                        this.setState({ showLoader: false })
                        this.setState({ resMsg: resdata.message })
                        this.setState({
                            getwkflwPendingLoansList: [],
                            orgtableData: []
                        }, () => {
                            console.log(resdata.message)
                        });
                    }
                }
            })
            .catch(err => {
                console.log(err.message)
            })
    }
    viewMoreDetails = (lists) => {
        $("#moreDetailsModal1").click();
        console.log(lists)
        this.setState({
            loanreqNo: lists.loanrequestnumber,
            officeLevel: lists.officelevel,
            staffHierarchy: lists.staffhierarchy,
            assignedTo: lists.assignedto,
            performedBy: lists.performedby,
            pmID: lists.pmid
        }, () => {
            console.log(this.state.loanreqNo)
            this.getworkflowLoanStatus(this.state.loanreqNo)
        })
    }
    selectApprover = (lists) => {
        this.setState({
            loanreqNo: lists.loanrequestnumber,
            officeLevel: parseInt(lists.officelevel),
            staffHierarchy: lists.staffhierarchy,
            orderNo: lists.orderno,
            approveStatusFlag: false,
        }, () => {
            $("#staffModal").click()
            this.getHrcyStaffUsers()
        })
        console.log(lists.officelevel, this.state.officeLevel)
    }
    approveStatus = (lists) => {
        this.setState({
            loanreqNo: lists.loanrequestnumber,
            orderNo: lists.orderno,
            approveStatusFlag: true,
        }, () => {
            $("#staffModal").click()
        })
    }
    statusName = (event) => {
        this.setState({ statusField: event.target.value })
    }
    statusComments = (event) => {
        this.setState({ statusComments: event.target.value })
    }
    getHrcyStaffUsers = () => {
        // var url = `/usrmgmt/gethierarchystaffusers${this.state.officeLevel ? `?officelevel=${this.state.officeLevel}` : ''} ${this.state.staffHierarchy ? `&staffhierarchy=${this.state.staffHierarchy}` : ''}`;
        var url = `/usrmgmt/gethierarchystaffusers${this.state.officeLevel ? `?officelevel=${this.state.officeLevel}` : ''}${this.state.staffHierarchy ? `&staffhierarchy=${this.state.staffHierarchy}` : ''}`;
        this.setState({ showLoader: true })
        fetch(BASEURL + url, {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            }
        }).then((response) => {
            console.log("Response:", response);
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata);
                if (resdata.status == "Success" || resdata.status == "SUCCESS") {
                    this.setState({ showLoader: false })
                    this.setState({
                        getHrcyStaffLists: resdata.msgdata
                    })
                    const updatedStaffList = this.state.getHrcyStaffLists.map((staff) => {
                        const matchingStaffType = this.state.staffMasterList.find((master) => master.level === staff.staffhierarchy);
                        return {
                            ...staff,
                            stafftype: matchingStaffType ? matchingStaffType.stafftype : ''
                        };
                    });

                    this.setState({ getHrcyStaffLists: updatedStaffList });
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
                        this.setState({ resMsg: resdata.message })
                        this.setState({
                            getHrcyStaffLists: [],
                        }, () => {
                            console.log(resdata.message)
                        });
                    }
                }
            })
            .catch(err => {
                console.log(err.message)
            })
    }
    getStaffhierarchy = () => {
        var url = `/usrmgmt/getofficehierarchy?type=2`;
        this.setState({ showLoader: true })
        fetch(BASEURL + url, {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            }
        }).then((response) => {
            console.log("Response:", response);
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata);
                if (resdata.status == "Success" || resdata.status == "SUCCESS") {
                    this.setState({ showLoader: false })
                    this.setState({
                        staffMasterList: resdata.msgdata
                    })
                    const updatedwkflowList = this.state.getwkflwPendingLoansList.map((staff) => {
                        const matchingStaffType1 = this.state.staffMasterList.find((master) => master.level === staff.staffhierarchy);
                        return {
                            ...staff,
                            stafftype: matchingStaffType1 ? matchingStaffType1.stafftype : ''
                        };
                    });
                    // this.setState({ getwkflwPendingLoansList: updatedwkflowList });
                    console.log(updatedwkflowList)
                    this.getOfficeHierarchy(updatedwkflowList)
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
                        this.setState({ resMsg: resdata.message })
                        $("#commonModal").click();
                        this.setState({
                            staffMasterList: [],
                        }, () => {
                            console.log(resdata.message)
                        });
                    }
                }
            })
            .catch(err => {
                console.log(err.message)
            })
    }
    getOfficeHierarchy = (updatedwkflowList) => {
        fetch(BASEURL + '/usrmgmt/getofficehierarchy?type=1', {
            method: 'GET',
            headers: {
                'Authorization': "Bearer " + sessionStorage.getItem('token'),
                'Content-Type': 'application/json'
            },
        })
            .then((response) => {
                return response.json();
            })
            .then((resdata) => {
                if (resdata.status === 'Success') {
                    console.log(resdata);
                    this.setState({ officemasterList: resdata.msgdata });

                    const updatedwkflowList2 = updatedwkflowList.map((staff) => {
                        const matchingStaffType1 = this.state.officemasterList.find((master) => master.level === staff.officelevel);
                        return {
                            ...staff,
                            officetype: matchingStaffType1 ? matchingStaffType1.officetype : ''
                        };
                    });

                    this.setState({ getwkflwPendingLoansList: updatedwkflowList2 });
                    console.log(updatedwkflowList2)
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
                        this.setState({ resMsg: resdata.message })
                        this.setState({
                            officemasterList: [],
                        }, () => {
                            console.log(resdata.message)
                        });
                    }
                }
            })
            .catch((error) => {
                console.log(error);
                alert("Error: " + error.message);
            });
    }
    staffUserName = (event) => {
        this.setState({ userID: event.target.value })
    }
    assignReqToApprover = () => {
        var withAssign = JSON.stringify({
            loanrequestnumber: this.state.loanreqNo,
            orderno: this.state.orderNo,
            assignedto: this.state.userID
        })
        var withoutAssign = JSON.stringify({
            loanrequestnumber: this.state.loanreqNo,
            orderno: this.state.orderNo
        })
        var Result;
        var userID = sessionStorage.getItem('userID');
        if (userID === this.state.userID) {
            Result = withoutAssign;
        } else {
            Result = withAssign;
        }
        console.log(Result)
        fetch(BASEURL + `/usrmgmt/assignloanreqtoapprover`, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: Result
        }).then((response) => {
            console.log("Response:", response);
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata);
                if (resdata.status == "Success" || resdata.status == "SUCCESS") {
                    $('#exampleModalCenter29').modal('hide');
                    confirmAlert({
                        message: resdata.message,
                        buttons: [
                            {
                                label: "OK",
                                onClick: () => {

                                },
                            },
                        ],
                        closeOnClickOutside: false,
                    });
                } else {
                    $('#exampleModalCenter29').modal('hide');
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
                        $('#exampleModalCenter29').modal('hide');
                        confirmAlert({
                            message: resdata.message,
                            buttons: [
                                {
                                    label: "OK",
                                    onClick: () => {
                                        $('#exampleModalCenter29').modal('show');
                                    },
                                },
                            ],
                            closeOnClickOutside: false,
                        });
                        $(this.list0ref.current).val('');
                        this.setState({
                            userID: sessionStorage.getItem('userID'),
                        }, () => {
                            console.log(resdata.message)
                        });
                    }
                }
            })
            .catch(err => {
                console.log(err.message)
            })
    }
    getworkflowLoanStatus = (loanreqno) => {
        fetch(BASEURL + '/usrmgmt/getwfloanstatus/approverstage?loanrequestnumber=' + loanreqno, {
            method: 'GET',
            headers: {
                'Authorization': "Bearer " + sessionStorage.getItem('token'),
                'Content-Type': 'application/json'
            },
        })
            .then((response) => {
                return response.json();
            })
            .then((resdata) => {
                if (resdata.status === 'Success') {
                    console.log(resdata);
                    this.setState({ workflowLoanStatus: resdata.msgdata });
                    $("#activityLists").show();
                    $('#LN20').hide()
                    $('#LN50').hide()
                    $('#LN80').hide()
                    $('#LN110').hide()
                    $('#LN111').hide()
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
                        closeOnClickOutside: false,
                    });
                }
            })
            .catch((error) => {
                console.log(error);
                alert("Error: " + error.message);
            });
    }
    updateStatus = () => {
        var withAssign = JSON.stringify({
            loanrequestnumber: this.state.loanreqNo,
            orderno: this.state.orderNo,
            status: this.state.statusField,
            comments: this.state.statusComments
        })
        var withoutAssign = JSON.stringify({
            loanrequestnumber: this.state.loanreqNo,
            orderno: this.state.orderNo,
            status: this.state.statusField,
        })
        var Result;
        if (this.state.statusComments !== "") {
            Result = withAssign;
        } else if (this.state.statusComments === "") {
            Result = withoutAssign;
        }
        console.log(Result)
        fetch(BASEURL + `/usrmgmt/setloanreqapprovalstatus`, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: Result
        }).then((response) => {
            console.log("Response:", response);
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata);
                if (resdata.status == "Success" || resdata.status == "SUCCESS") {
                    $('#exampleModalCenter29').modal('hide');
                    confirmAlert({
                        message: resdata.message,
                        buttons: [
                            {
                                label: "OK",
                                onClick: () => {
                                    this.getWfPendingList("assignedLoans")
                                },
                            },
                        ],
                        closeOnClickOutside: false,
                    });
                } else {
                    if (resdata.code === '0102') {
                        $('#exampleModalCenter29').modal('hide');
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
                        $('#exampleModalCenter29').modal('hide');
                        this.setState({ resMsg: resdata.message })
                        $("#commonModal").click();
                        // this.setState({
                        //     getHrcyStaffLists: [],
                        // }, () => {
                        //     console.log(resdata.message)
                        // });
                    }
                }
            })
            .catch(err => {
                console.log(err.message)
            })
    }
    //updated(breakdown)
    getWflwBreakdown = (workflow) => {
        this.setState({ showLoader: true })
        var activityID = workflow.activityid;
        fetch(BASEURL + '/usrmgmt/getwfactivitybreakdowninfo?loanrequestnumber=' + this.state.loanreqNo + `&activityid=` + workflow.activityid, {
            method: 'GET',
            headers: {
                'Authorization': "Bearer " + sessionStorage.getItem('token'),
                'Content-Type': 'application/json'
            },
        })
            .then((response) => {
                return response.json();
            })
            .then((resdata) => {
                if (resdata.status === 'Success' || resdata.status === 'SUCCESS') {
                    this.setState({ showLoader: false })
                    if (activityID === "LN20") {
                        this.setState({ profileAttributes: resdata.msgdata })
                        $('#activityLists').hide()
                        $('#LN20').show()
                    } else if (activityID === "LN50") {
                        this.setState({ loanStmtlist: resdata.msgdata })
                        $('#activityLists').hide()
                        $('#LN50').show()
                    } else if (activityID === "LN80") {
                        this.setState({ creditEvlList: resdata.msgdata })
                        $('#activityLists').hide()
                        $('#LN80').show()
                    } else if (activityID === "LN110") {
                        this.setState({ loanOffers: resdata.msgdata[0] })
                        $('#activityLists').hide()
                        $('#LN110').show()
                    } else if (activityID === "LN111") {
                        this.setState({ approvedActivities: resdata.msgdata })
                        $('#activityLists').hide()
                        $('#LN111').show()
                    }
                } else {
                    this.setState({ showLoader: false })
                    $('.bd-example-modal-lg').modal('hide');
                    confirmAlert({
                        message: resdata.message,
                        buttons: [
                            {
                                label: "OK",
                                onClick: () => {
                                    $('.bd-example-modal-lg').modal('show');
                                },
                            },
                        ],
                        closeOnClickOutside: false,
                    });
                }
            })
            .catch((error) => {
                console.log(error);
                this.setState({ showLoader: false })
            });
    }
    downloadStmt(stmtid, filename) {
        console.log(stmtid);
        sessionStorage.setItem("stmtid", stmtid);
        this.bankStatements(stmtid, filename);
    }
    bankStatements = (stmtid, filename) => {
        var loanreqnum = this.state.loanreqNo
        console.log(filename, this.state.loanreqNo, loanreqnum)
        const extension = filename.split('.').pop();
        console.log(extension);
        if (extension == "xml") {
            fetch(BASEURL + "/usrmgmt/downloadstmt?stmtid=" + stmtid + "&loanreqno=" + loanreqnum, {
                headers: {
                    'Authorization': "Bearer " + sessionStorage.getItem('token'),
                },
            })
                .then(response => {
                    return response.text();
                })
                .then((response) => {
                    $('.bd-example-modal-lg').modal('hide');
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
                    $('.bd-example-modal-lg').modal('show');
                    $('.bd-example-modal-lg2').modal('hide')
                })
        } else if (extension == "pdf") {
            fetch(BASEURL + "/usrmgmt/downloadstmt?stmtid=" + stmtid + "&loanreqno=" + loanreqnum, {
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
                    $('.bd-example-modal-lg').modal('hide');
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
                    $('.bd-example-modal-lg').modal('show');
                    $('.bd-example-modal-lg2').modal('hide')
                })
        }
    }
    backToStmtModal = () => {
        $('.bd-example-modal-lg').modal('show');
        $('.bd-example-modal-lg2').modal('hide')
    }
    backToActivities = (params) => {
        if (params === 'LN20') {
            $('#LN20').hide()
            $('#activityLists').show()
        } else if (params === 'LN50') {
            $('#LN50').hide()
            $('#activityLists').show()
        } else if (params === 'LN80') {
            $('#LN80').hide()
            $('#activityLists').show()
        } else if (params === 'LN110') {
            $('#LN110').hide()
            $('#activityLists').show()
        } else if (params === 'LN111') {
            $('#LN111').hide()
            $('#activityLists').show()
        }
    }
    reloadPage = () => {
        var msg = this.state.resMsg
        if (msg.includes("successfull")) {
            window.location.reload();
        }
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
        const { activityID } = this.state;
        console.log(this.state.groupStatus)
        return (
            <div className="container-dashboard d-flex flex-row" id="wrapper" style={{ backgroundColor: "#f4f7fc", marginTop: "-7px" }}>
                {
                    this.state.showLoader && <Loader />
                }
                < SystemUserSidebar />
                <div className="pl-3 pr-3 main-content" id="page-content-wrapper">
                    <div className="container-fluid row pt-2">
                        <div className="col-1" id="ProductDefRes1">
                            <button style={{ marginLeft: "25px" }} onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className='col-4' id="ProductDefRes2" style={{ marginLeft: "20px", marginTop: "5px" }}>
                            <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                <Link to="/sysUserDashboard">Home</Link> / Approver Hierarchy</p>
                        </div>
                        <div className='col'>

                        </div>
                        <div className='col'>

                        </div>
                        <div className='col-3'>

                        </div>
                        <div className="col" id="ProductDefRes3">
                            <button style={myStyle}>
                                <Link to="/sysUserDashboard" style={{ marginLeft: "10px" }}><FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} /><span style={{ textDecoration: "none", color: "white" }}>Back</span></Link></button>
                        </div>

                    </div>
                    <hr className="col-11" style={{ marginLeft: "57px", width: "87%", marginTop: "-5px", backgroundColor: "rgba(4,78,160,1)" }} />

                    <div className='row' style={{ marginTop: "-10px" }}>
                        <div className="col-lg-8 col-sm-6 col-md-10" style={{ textAlign: "end" }}>
                            <p className="" style={{ fontSize: "20px", fontWeight: "bold", color: "rgba(5,54,82,1)", marginRight: "45px" }}>
                                Approver Hierarchy
                            </p>
                        </div>
                    </div>
                    {/* New Design */}
                    <div className='container-fluid row' style={{ paddingLeft: "82px", marginTop: "-26px" }}>
                        <div className='card'>
                            <div className='row pt-2'>
                                <div className='col'>
                                    <ul role="tablist" className="nav nav-pills nav-fill mb-3" >
                                        <li className="nav-item"> <a data-toggle="pill" href="#myEarning-details" className="nav-link active detailsTab"
                                            style={{ textAlign: "center", paddingTop: "10px", paddingBottom: "10px" }}
                                            onClick={() => this.getWfPendingList("allLoans")}>
                                            <FaFileAlt />&nbsp; {t('Pending Loans')} </a> </li>
                                        <li className="nav-item" > <a data-toggle="pill" href="#futureEarning-details" className="nav-link detailsTab"
                                            style={{ textAlign: "center", paddingTop: "10px", paddingBottom: "10px" }}
                                            onClick={() => this.getWfPendingList("assignedLoans")}
                                        ><FaCheckCircle />&nbsp;  {t('Assigned Loans')} </a> </li>
                                        <li className="nav-item" > <a data-toggle="pill" href="#approveRejectedLoans-details" className="nav-link detailsTab"
                                            style={{ textAlign: "center", paddingTop: "10px", paddingBottom: "10px" }}
                                            onClick={() => this.getWfPendingList("rejectedLoans")}
                                        ><FaTimesCircle />&nbsp; {t('Rejected Loans')} </a> </li>
                                    </ul>

                                </div>
                            </div>
                            <div className='row' style={{ marginTop: "-10px" }}>
                                <div className='col'>
                                    <div className='tab-content'>
                                        <div id="myEarning-details" className=" register-form tab-pane fade show active" style={{ cursor: "default" }}>
                                            {this.state.getwkflwPendingLoansList == "" ?
                                                <div className="row mt-2" style={{ marginLeft: "6px" }}>
                                                    <div className="col" style={{ textAlign: "center", color: "#222C70", fontSize: "14px", fontWeight: "500" }}>
                                                        <p>No lists available.</p>
                                                    </div>
                                                </div> :
                                                <>
                                                    <div style={{
                                                        whiteSpace: "nowrap"
                                                    }} id='secondAuditScroll'>
                                                        <div className='row font-weight-normal'
                                                            style={{
                                                                fontWeight: "800",
                                                                fontSize: "15px",
                                                                color: "rgba(5,54,82,1)",
                                                            }}>
                                                            <div className='col-lg-2 col-md-5 col-sm-8'>
                                                                <p style={{ marginLeft: "16px", fontWeight: "600" }}>{t('Loan Request No.')}</p>
                                                            </div>
                                                            <div className='col-lg-3 col-md-5 col-sm-8'>
                                                                <p style={{ fontWeight: "600", marginLeft: "10px" }}>{t('Activity Name')}</p>
                                                            </div>
                                                            <div className='col-lg-2 col-md-5 col-sm-8'>
                                                                <p style={{ fontWeight: "600", marginLeft: "1px" }}>{t('Staff Hierarchy')}</p>
                                                            </div>
                                                            <div className='col-lg-1 col-md-5 col-sm-8'>
                                                                <p style={{ fontWeight: "600", marginLeft: "-4px" }}>{t('Office Level')}</p>
                                                            </div>
                                                            <div className='col-lg-2 col-md-5 col-sm-8' style={{ textAlign: "end" }}>
                                                                <p style={{ fontWeight: "600" }}>{t('Order No.')}</p>
                                                            </div>
                                                            <div className='col-lg-2 col-md-5 col-sm-8'>
                                                                <p style={{ fontWeight: "600", marginLeft: "-10px" }}>{t('Status')}</p>
                                                            </div>
                                                        </div>
                                                        <hr className="col-12" style={{ width: "96.5%", marginTop: "-10px", backgroundColor: "rgba(4,78,160,1)" }} />

                                                        {/* Lists */}
                                                        <div className="" style={{
                                                            height: `${this.state.getwkflwPendingLoansList.length <= 5 ? "150px" : this.state.getwkflwPendingLoansList.length >= 10 && "300px"}`,
                                                            marginTop: "-16px"
                                                        }}>
                                                            {this.state.getwkflwPendingLoansList.map((lists, index) => {
                                                                return (
                                                                    <div className='col card border-0' key={index} style={{ marginBottom: "-15.5px", transition: 'none', overflow: "visible", color: "rgb(5, 54, 82)", cursor: 'default', backgroundColor: (index % 2 == 0) ? 'rgba(255,255,255,1)' : 'rgba(242,242,242,1)' }}>
                                                                        <div className="row item-list align-items-center">
                                                                            <div className="col-lg-2 col-md-5 col-sm-8">
                                                                                <p className="p-0" style={{ fontSize: "15px", fontWeight: "490", marginBottom: "-3px", textWrap: "wrap" }}>{lists.loanrequestnumber}</p>
                                                                            </div >
                                                                            <div className="col-lg-3 col-md-5 col-sm-8">
                                                                                <p style={{ fontSize: "15px", fontWeight: "490", marginBottom: "-3px" }}>{lists.activity}</p>
                                                                            </div >
                                                                            <div className="col-lg-2 col-md-5 col-sm-8">
                                                                                <p style={{ fontSize: "15px", fontWeight: "490", marginBottom: "-3px" }}>{lists.stafftype}</p>
                                                                            </div>
                                                                            <div className="col-lg-2 col-md-5 col-sm-8">
                                                                                <p style={{ fontSize: "15px", fontWeight: "490", marginBottom: "-3px" }}>{lists.officetype}</p>
                                                                            </div>
                                                                            <div className="col-lg-1 col-md-5 col-sm-8">
                                                                                <p style={{ fontSize: "15px", fontWeight: "490", marginBottom: "-3px" }}>{lists.orderno}</p>
                                                                            </div>
                                                                            <div className="col-lg-1 col-md-5 col-sm-8" style={{ textAlign: "" }}>
                                                                                <p style={{ fontSize: "15px", fontWeight: "490", marginBottom: "-3px" }}>{lists.status === "0" ? "Pending"
                                                                                    : lists.status === "1" ? "Approved"
                                                                                        : lists.status === "2" ? "Rejected" : "-"}</p>
                                                                            </div>
                                                                            <div className='col-lg-1 col-md-5 col-sm-8' style={{ textAlign: "end" }}>
                                                                                <img src={openIt} style={{ height: "29px" }}
                                                                                    class="btn dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" />
                                                                                &nbsp;
                                                                                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton" style={{ marginLeft: "-136px" }}>
                                                                                    <a class="dropdown-item" onClick={this.viewMoreDetails.bind(this, lists)}>More Details</a>
                                                                                    <a class="dropdown-item" onClick={this.selectApprover.bind(this, lists)}>Assign To Approver</a>
                                                                                </div>
                                                                            </div>
                                                                        </div >
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>
                                                        &nbsp;
                                                        {this.state.getwkflwPendingLoansList.length > 1 &&
                                                            <div className="row float-right">
                                                                <div className='col'></div>
                                                                <div className='col'>
                                                                    <div className='card border-0' style={{ height: "40px" }}>
                                                                        <ReactPaginate
                                                                            previousLabel={"<"}
                                                                            nextLabel={">"}
                                                                            breakLabel={"..."}
                                                                            breakClassName={"break-me"}
                                                                            pageCount={this.state.pageCount}
                                                                            onPageChange={this.handlePageClick}
                                                                            containerClassName={"pagination Customer"}
                                                                            subContainerClassName={"pages pagination"}
                                                                            activeClassName={"active"}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>}
                                                    </div>
                                                </>}
                                        </div>
                                        <div id="futureEarning-details" className=" register-form tab-pane fade" style={{ cursor: "default" }}>
                                            {this.state.getwkflwPendingLoansList == "" ?
                                                <div className="row mt-2" style={{ marginLeft: "6px" }}>
                                                    <div className="col" style={{ textAlign: "center", color: "#222C70", fontSize: "14px", fontWeight: "500" }}>
                                                        <p>{this.state.resMsg}</p>
                                                    </div>
                                                </div> :
                                                <>
                                                    <div style={{
                                                        whiteSpace: "nowrap"
                                                    }} id='secondAuditScroll'>
                                                        <div className='row font-weight-normal'
                                                            style={{
                                                                fontWeight: "800",
                                                                fontSize: "15px",
                                                                color: "rgba(5,54,82,1)",
                                                            }}>
                                                            <div className='col-lg-2 col-md-5 col-sm-8'>
                                                                <p style={{ marginLeft: "16px", fontWeight: "600" }}>{t('Loan Request No.')}</p>
                                                            </div>
                                                            <div className='col-lg-3 col-md-5 col-sm-8'>
                                                                <p style={{ fontWeight: "600", marginLeft: "10px" }}>{t('Activity Name')}</p>
                                                            </div>
                                                            <div className='col-lg-2 col-md-5 col-sm-8'>
                                                                <p style={{ fontWeight: "600", marginLeft: "1px" }}>{t('Staff Hierarchy')}</p>
                                                            </div>
                                                            <div className='col-lg-1 col-md-5 col-sm-8'>
                                                                <p style={{ fontWeight: "600", marginLeft: "-4px" }}>{t('Office Level')}</p>
                                                            </div>
                                                            <div className='col-lg-2 col-md-5 col-sm-8' style={{ textAlign: "end" }}>
                                                                <p style={{ fontWeight: "600" }}>{t('Order No.')}</p>
                                                            </div>
                                                            <div className='col-lg-2 col-md-5 col-sm-8'>
                                                                <p style={{ fontWeight: "600", marginLeft: "-10px" }}>{t('Status')}</p>
                                                            </div>
                                                        </div>
                                                        <hr className="col-12" style={{ width: "96.5%", marginTop: "-10px", backgroundColor: "rgba(4,78,160,1)" }} />

                                                        {/* Lists */}
                                                        <div className="" style={{
                                                            height: `${this.state.getwkflwPendingLoansList.length <= 5 ? "150px" : this.state.getwkflwPendingLoansList.length >= 10 && "300px"}`,
                                                            marginTop: "-16px"
                                                        }}>
                                                            {this.state.getwkflwPendingLoansList.map((lists, index) => {
                                                                return (
                                                                    <div className='col card border-0' key={index} style={{ marginBottom: "-15.5px", transition: 'none', overflow: "visible", color: "rgb(5, 54, 82)", cursor: 'default', backgroundColor: (index % 2 == 0) ? 'rgba(255,255,255,1)' : 'rgba(242,242,242,1)' }}>
                                                                        <div className="row item-list align-items-center">
                                                                            <div className="col-lg-2 col-md-5 col-sm-8">
                                                                                <p className="p-0" style={{ fontSize: "15px", fontWeight: "490", marginBottom: "-3px", textWrap: "wrap" }}>{lists.loanrequestnumber}</p>
                                                                            </div >
                                                                            <div className="col-lg-3 col-md-5 col-sm-8">
                                                                                <p style={{ fontSize: "15px", fontWeight: "490", marginBottom: "-3px" }}>{lists.activity}</p>
                                                                            </div >
                                                                            <div className="col-lg-2 col-md-5 col-sm-8">
                                                                                <p style={{ fontSize: "15px", fontWeight: "490", marginBottom: "-3px" }}>{lists.stafftype}</p>
                                                                            </div>
                                                                            <div className="col-lg-2 col-md-5 col-sm-8">
                                                                                <p style={{ fontSize: "15px", fontWeight: "490", marginBottom: "-3px" }}>{lists.officetype}</p>
                                                                            </div>
                                                                            <div className="col-lg-1 col-md-5 col-sm-8">
                                                                                <p style={{ fontSize: "15px", fontWeight: "490", marginBottom: "-3px" }}>{lists.orderno}</p>
                                                                            </div>
                                                                            <div className="col-lg-1 col-md-5 col-sm-8" style={{ textAlign: "" }}>
                                                                                <p style={{ fontSize: "15px", fontWeight: "490", marginBottom: "-3px" }}>{lists.status === "0" ? "Pending"
                                                                                    : lists.status === "1" ? "Approved"
                                                                                        : lists.status === "2" ? "Rejected" : "-"}</p>
                                                                            </div>
                                                                            <div className='col-lg-1 col-md-5 col-sm-8' style={{ textAlign: "end" }}>
                                                                                <img src={openIt} style={{ height: "29px" }}
                                                                                    class="btn dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" />
                                                                                &nbsp;
                                                                                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton" style={{ marginLeft: "-136px" }}>
                                                                                    <a class="dropdown-item" onClick={this.viewMoreDetails.bind(this, lists)}>More Details</a>
                                                                                    <a class="dropdown-item" onClick={this.approveStatus.bind(this, lists)}>Approve Status</a>
                                                                                </div>
                                                                            </div>
                                                                        </div >
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>
                                                        &nbsp;
                                                        {this.state.getwkflwPendingLoansList.length > 1 &&
                                                            <div className="row float-right">
                                                                <div className='col'></div>
                                                                <div className='col'>
                                                                    <div className='card border-0' style={{ height: "40px" }}>
                                                                        <ReactPaginate
                                                                            previousLabel={"<"}
                                                                            nextLabel={">"}
                                                                            breakLabel={"..."}
                                                                            breakClassName={"break-me"}
                                                                            pageCount={this.state.pageCount}
                                                                            onPageChange={this.handlePageClick}
                                                                            containerClassName={"pagination Customer"}
                                                                            subContainerClassName={"pages pagination"}
                                                                            activeClassName={"active"}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>}
                                                    </div>
                                                </>}
                                        </div>
                                        <div id="approveRejectedLoans-details" className=" register-form tab-pane fade" style={{ cursor: "default" }}>
                                            {this.state.getwkflwPendingLoansList == "" ?
                                                <div className="row mt-2" style={{ marginLeft: "6px" }}>
                                                    <div className="col" style={{ textAlign: "center", color: "#222C70", fontSize: "14px", fontWeight: "500" }}>
                                                        <p>{this.state.resMsg}</p>
                                                    </div>
                                                </div> :
                                                <>
                                                    <div style={{
                                                        whiteSpace: "nowrap"
                                                    }} id='secondAuditScroll'>
                                                        <div className='row font-weight-normal'
                                                            style={{
                                                                fontWeight: "800",
                                                                fontSize: "15px",
                                                                color: "rgba(5,54,82,1)",
                                                            }}>
                                                            <div className='col-lg-2 col-md-5 col-sm-8'>
                                                                <p style={{ marginLeft: "16px", fontWeight: "600" }}>{t('Loan Request No.')}</p>
                                                            </div>
                                                            <div className='col-lg-3 col-md-5 col-sm-8'>
                                                                <p style={{ fontWeight: "600", marginLeft: "10px" }}>{t('Activity Name')}</p>
                                                            </div>
                                                            <div className='col-lg-2 col-md-5 col-sm-8'>
                                                                <p style={{ fontWeight: "600", marginLeft: "1px" }}>{t('Staff Hierarchy')}</p>
                                                            </div>
                                                            <div className='col-lg-1 col-md-5 col-sm-8'>
                                                                <p style={{ fontWeight: "600", marginLeft: "-4px" }}>{t('Office Level')}</p>
                                                            </div>
                                                            <div className='col-lg-2 col-md-5 col-sm-8' style={{ textAlign: "end" }}>
                                                                <p style={{ fontWeight: "600" }}>{t('Order No.')}</p>
                                                            </div>
                                                            <div className='col-lg-2 col-md-5 col-sm-8'>
                                                                <p style={{ fontWeight: "600", marginLeft: "-10px" }}>{t('Status')}</p>
                                                            </div>
                                                        </div>
                                                        <hr className="col-12" style={{ width: "96.5%", marginTop: "-10px", backgroundColor: "rgba(4,78,160,1)" }} />

                                                        {/* Lists */}
                                                        <div className="" style={{
                                                            height: `${this.state.getwkflwPendingLoansList.length <= 5 ? "150px" : this.state.getwkflwPendingLoansList.length >= 10 && "300px"}`,
                                                            marginTop: "-16px"
                                                        }}>
                                                            {this.state.getwkflwPendingLoansList.map((lists, index) => {
                                                                return (
                                                                    <div className='col card border-0' key={index} style={{ marginBottom: "-15.5px", transition: 'none', overflow: "visible", color: "rgb(5, 54, 82)", cursor: 'default', backgroundColor: (index % 2 == 0) ? 'rgba(255,255,255,1)' : 'rgba(242,242,242,1)' }}>
                                                                        <div className="row item-list align-items-center">
                                                                            <div className="col-lg-2 col-md-5 col-sm-8">
                                                                                <p className="p-0" style={{ fontSize: "15px", fontWeight: "490", marginBottom: "-3px", textWrap: "wrap" }}>{lists.loanrequestnumber}</p>
                                                                            </div >
                                                                            <div className="col-lg-3 col-md-5 col-sm-8">
                                                                                <p style={{ fontSize: "15px", fontWeight: "490", marginBottom: "-3px" }}>{lists.activity}</p>
                                                                            </div >
                                                                            <div className="col-lg-2 col-md-5 col-sm-8">
                                                                                <p style={{ fontSize: "15px", fontWeight: "490", marginBottom: "-3px" }}>{lists.stafftype}</p>
                                                                            </div>
                                                                            <div className="col-lg-2 col-md-5 col-sm-8">
                                                                                <p style={{ fontSize: "15px", fontWeight: "490", marginBottom: "-3px" }}>{lists.officetype}</p>
                                                                            </div>
                                                                            <div className="col-lg-1 col-md-5 col-sm-8">
                                                                                <p style={{ fontSize: "15px", fontWeight: "490", marginBottom: "-3px" }}>{lists.orderno}</p>
                                                                            </div>
                                                                            <div className="col-lg-1 col-md-5 col-sm-8" style={{ textAlign: "" }}>
                                                                                <p style={{ fontSize: "15px", fontWeight: "490", marginBottom: "-3px" }}>{lists.status === "0" ? "Pending"
                                                                                    : lists.status === "1" ? "Approved"
                                                                                        : lists.status === "2" ? "Rejected" : "-"}</p>
                                                                            </div>
                                                                            <div className='col-lg-1 col-md-5 col-sm-8' style={{ textAlign: "end" }}>
                                                                                <img src={openIt} style={{ height: "29px" }}
                                                                                    class="btn dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" />
                                                                                &nbsp;
                                                                                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton" style={{ marginLeft: "-136px" }}>
                                                                                    <a class="dropdown-item" onClick={this.viewMoreDetails.bind(this, lists)}>More Details</a>
                                                                                    <a class="dropdown-item" onClick={this.approveStatus.bind(this, lists)}>Approve Status</a>
                                                                                </div>
                                                                            </div>
                                                                        </div >
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>
                                                        &nbsp;
                                                        {this.state.getwkflwPendingLoansList.length > 1 &&
                                                            <div className="row float-right">
                                                                <div className='col'></div>
                                                                <div className='col'>
                                                                    <div className='card border-0' style={{ height: "40px" }}>
                                                                        <ReactPaginate
                                                                            previousLabel={"<"}
                                                                            nextLabel={">"}
                                                                            breakLabel={"..."}
                                                                            breakClassName={"break-me"}
                                                                            pageCount={this.state.pageCount}
                                                                            onPageChange={this.handlePageClick}
                                                                            containerClassName={"pagination Customer"}
                                                                            subContainerClassName={"pages pagination"}
                                                                            activeClassName={"active"}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>}
                                                    </div>
                                                </>}
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
                                <div className="modal-body">
                                    <div className='row'>
                                        <div className='col'>
                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold" }}>
                                                {this.state.resMsg}
                                            </p>
                                            <hr style={{ backgroundColor: "rgba(5,54,82,1)" }} />
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col' style={{ textAlign: "center" }}>
                                            <button type="button" class="btn text-white btn-sm" data-dismiss="modal"
                                                style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.reloadPage}>Okay</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Staff Users */}
                    <button type="button" id="staffModal" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter29" style={{ display: "none" }}>
                        Staff Users
                    </button>
                    <div class="modal fade" data-backdrop="static" id="exampleModalCenter29" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered" role="document">
                            {/* staff users content */}
                            {this.state.approveStatusFlag === false ?
                                <div class="modal-content">
                                    <div class="modal-body" style={{ cursor: "default" }}>
                                        <div className='row mb-2'>
                                            <div className='col'>
                                                <p style={{ color: "rgba(5,54,82,1)", fontWeight: "500" }}>&nbsp;<img src={batch} width="25px" />Assign To Approver</p>
                                                <hr style={{ width: "15px", marginTop: "-10px", backgroundColor: "rgb(34, 44, 112)" }} />
                                            </div>
                                        </div>
                                        <div className='row mb-2' style={{ marginTop: "-10px" }}>
                                            <div className='col'>
                                                <p style={{ color: "rgba(5,54,82,1)", fontWeight: "500" }}>&nbsp;Loan Request Number *</p>
                                                <input className='form-control' style={{ marginTop: "-13px" }} value={this.state.loanreqNo} readOnly />
                                            </div>
                                        </div>
                                        <div className='row mb-2'>
                                            <div className='col'>
                                                {this.state.getHrcyStaffLists.length > 0 ?
                                                    <>
                                                        <p style={{ color: "rgba(5,54,82,1)", fontWeight: "500" }}>&nbsp;Staff Users *</p>
                                                        <select className='form-select' ref={this.list0ref}
                                                            onChange={this.staffUserName} style={{ marginTop: "-13px" }}>
                                                            <option defaultValue>Select</option>
                                                            {this.state.getHrcyStaffLists.map((lists) => (
                                                                <option value={lists.userid}>
                                                                    {lists.firstname} {lists.city ? ` (${lists.city}, ${lists.stafftype})` : ` (${lists.stafftype})`}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </> : ""
                                                    // <p style={{ color: "rgba(5,54,82,1)", fontWeight: "500" }}>
                                                    //     {this.state.resMsg ? ` ${this.state.resMsg}, you can assign to self too.` : ''}
                                                    // </p>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                    <div class="modal-footer">
                                        <div className='row'>
                                            <div className='col' style={{ paddingTop: "20px", textAlign: "end" }}>
                                                <button className='btn btn-sm text-white' id="assignHierarchyBtn" style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.assignReqToApprover}>Submit</button>
                                                &nbsp;
                                                <button className='btn btn-sm text-white' style={{ backgroundColor: "#0079BF" }} data-dismiss="modal">Cancel</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                :
                                <div class="modal-content">
                                    <div class="modal-body" style={{ cursor: "default" }}>
                                        <div className='row mb-2'>
                                            <div className='col'>
                                                <p style={{ color: "rgba(5,54,82,1)", fontWeight: "500" }}>&nbsp;<img src={batch} width="25px" />
                                                    Approve Status
                                                </p>
                                                <hr style={{ width: "15px", marginTop: "-10px", backgroundColor: "rgb(34, 44, 112)" }} />
                                            </div>
                                        </div>
                                        <div className='row mb-2' style={{ marginTop: "-10px" }}>
                                            <div className='col'>
                                                <p style={{ color: "rgba(5,54,82,1)", fontWeight: "500" }}>&nbsp;Loan Request Number *</p>
                                                <input className='form-control' style={{ marginTop: "-13px" }} value={this.state.loanreqNo} readOnly />
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className='col'>
                                                <p style={{ color: "rgba(5,54,82,1)", fontWeight: "500" }}>&nbsp;Status *</p>
                                                {/* <select className='form-select' onChange={this.staffUserName} style={{ marginTop: "-13px" }}> */}
                                                <select style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-13px" }} className="form-select" onChange={this.statusName} >
                                                    <option defaultValue>Select</option>
                                                    <option value="1">Approve</option>
                                                    <option value="2">Reject</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className='col'>
                                                <p style={{ color: "rgba(5,54,82,1)", fontWeight: "500" }}>&nbsp;
                                                    {this.state.commentflag === true ? "Comments *" : "Comments *"}
                                                </p>
                                                <textarea type="text" style={{ backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }} className="form-control" onChange={this.statusComments}
                                                    placeholder="Enter Comments" rows={3} cols={30} maxLength={255}>
                                                </textarea>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="modal-footer">
                                        <div className='row'>
                                            <div className='col' style={{ paddingTop: "20px", textAlign: "end" }}>
                                                <button className='btn btn-sm text-white' id="assignHierarchyBtn" style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.updateStatus}>Submit</button>
                                                &nbsp;
                                                <button className='btn btn-sm text-white' style={{ backgroundColor: "#0079BF" }} data-dismiss="modal">Cancel</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>

                    {/*moreDetailsModal*/}
                    <button type="button" id='moreDetailsModal1' style={{ display: "none" }} class="btn btn-primary" data-toggle="modal" data-target=".bd-example-modal-lg">
                        More Details Modal
                    </button>
                    <div class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
                        <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
                            <div className="modal-content" id='activityLists'>
                                <div class="modal-body">
                                    <div className='scrollbar1' id="auditScroll" style={{ marginTop: "-10px" }}>
                                        <div style={{
                                            whiteSpace: "nowrap"
                                        }} id='secondAuditScroll'>
                                            <div className='row font-weight-normal'
                                                style={{
                                                    fontWeight: "800",
                                                    fontSize: "14px",
                                                    color: "rgba(5,54,82,1)",
                                                }}>
                                                <div className='col'>
                                                    <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold" }}><img src={editRole} width="25px" />Activity Details</p>
                                                    <hr style={{ width: "50px", marginTop: "-10px", backgroundColor: "rgb(0, 121, 191)" }} />
                                                    <p style={{
                                                        fontWeight: "600", marginLeft: "16px",
                                                        fontSize: "14px", color: "rgba(5,54,82,1)"
                                                    }}>{t('Loan Request Number')}: <span style={{
                                                        fontWeight: "400"
                                                    }}>{this.state.loanreqNo}</span></p>
                                                    <p style={{
                                                        fontWeight: "600", marginLeft: "16px",
                                                        fontSize: "14px", color: "rgba(5,54,82,1)",marginTop:"-10px"
                                                    }}>{t('PM ID')}: <span style={{
                                                        fontWeight: "400"
                                                    }}>{this.state.pmID}</span></p>
                                                    {this.state.assignedTo !== "" &&
                                                        <p style={{
                                                            fontWeight: "600", marginLeft: "16px",
                                                            fontSize: "14px", color: "rgba(5,54,82,1)",
                                                            marginTop: "-10px"
                                                        }}>{t('Assigned To')}: <span style={{
                                                            fontWeight: "400"
                                                        }}>{this.state.assignedTo}</span>
                                                        </p>
                                                    }
                                                    {this.state.performedBy !== "" &&
                                                        <p style={{
                                                            fontWeight: "600", marginLeft: "16px",
                                                            fontSize: "14px", color: "rgba(5,54,82,1)",
                                                            marginTop: "-10px"
                                                        }}>{t('Approved By')}: <span style={{
                                                            fontWeight: "400"
                                                        }}>{this.state.performedBy}</span>
                                                        </p>
                                                    }

                                                    <div className='row font-weight-normal' style={{ fontWeight: "800", fontSize: "14px", color: "rgba(5,54,82,1)", marginTop: "-5px" }}>
                                                        <div className='col-4' style={{ textAlign: "" }}>
                                                            <p style={{ fontWeight: "600", marginLeft: "16px" }}>{t('Activity Name')}</p>
                                                        </div>
                                                        <div className='col-3' style={{ textAlign: "center" }}>
                                                            <p style={{ fontWeight: "600" }}>{t('Created On')}</p>
                                                        </div>
                                                        <div className='col-3' style={{ textAlign: "center" }}>
                                                            <p style={{ fontWeight: "600" }}>{t('Status')}</p>
                                                        </div>
                                                        <div className='col-2' style={{ marginTop: "-3px", marginLeft: "-40px" }}>
                                                        </div>
                                                    </div>
                                                    <hr className="col-11" style={{ marginLeft: "40px", width: "88.6%", marginTop: "-10px", marginBottom: "-10px" }} />

                                                    {/* Lists */}
                                                    {this.state.workflowLoanStatus && this.state.workflowLoanStatus.length > 0 &&
                                                        this.state.workflowLoanStatus.map((workflow, index) => {
                                                            return (
                                                                <div className='col card border-0' key={index} style={{ marginBottom: "-11.5px", transition: 'none', overflow: "visible", color: "rgb(5, 54, 82)", cursor: 'default', backgroundColor: (index % 2 == 0) ? 'rgba(255,255,255,1)' : 'rgba(242,242,242,1)' }}>
                                                                    <div className="row item-list align-items-center">
                                                                        <div className="col-lg-4 col-md-5 col-sm-8">
                                                                            <p style={{ fontSize: "14px", fontWeight: "490", marginBottom: "-3px" }}>{workflow.activityname}</p>
                                                                        </div >
                                                                        <div className="col-lg-3 col-md-5 col-sm-8" style={{ textAlign: "center" }}>
                                                                            <p style={{ fontSize: "14px", fontWeight: "490", marginBottom: "-3px" }}>{workflow.createdon.split(' ')[0]}</p>
                                                                        </div>
                                                                        <div className="col-lg-3 col-md-5 col-sm-8" style={{ textAlign: "center" }}>
                                                                            <p style={{ fontSize: "14px", fontWeight: "490", marginBottom: "-3px" }}>
                                                                                {workflow.activitystatus === "2" ? (
                                                                                    <span>
                                                                                        <FcOk /> Completed
                                                                                    </span>
                                                                                ) : (
                                                                                    <span>
                                                                                        <GiSandsOfTime /> Initiated
                                                                                    </span>
                                                                                )}
                                                                            </p>
                                                                        </div>
                                                                        <div className="col-lg-2 col-md-5 col-sm-8" style={{ textAlign: "end" }}>
                                                                            {workflow.activityid !== "LN10" &&
                                                                                <button className='btn btn-sm text-white'
                                                                                    onClick={this.getWflwBreakdown.bind(this, workflow)}
                                                                                    style={{ backgroundColor: "rgb(0, 121, 191)" }}>View</button>
                                                                            }
                                                                        </div>

                                                                    </div >
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                    <hr style={{ backgroundColor: "rgba(5,54,82,1)" }} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='row mb-2'>
                                        <div className='col' style={{ textAlign: "center" }}>
                                            <button type="button" id='disagree' class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "#0079bf" }}>Close</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='modal-content' id='LN20' style={{ display: "none" }}>
                                <div className='modal-body' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                    <div className='row'>
                                        <div className='col-lg-10 col-md-6 col-sm-12'>
                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold" }}><img src={editRole} width="25px" />Borrower Profile Attributes</p>
                                            <hr style={{ width: "50px", marginTop: "-10px", backgroundColor: "rgb(0, 121, 191)" }} />
                                        </div>
                                        <div className='col-lg-2 col-md-6 col-sm-12' style={{ textAlign: "end" }}>
                                            <button style={myStyle} onClick={() => this.backToActivities('LN20')}>
                                                <FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} />
                                                <span style={{ textDecoration: "none", color: "white" }}>Back</span>
                                            </button>
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col-lg-3 col-md-6 col-sm-8'>
                                            <p className="mb-0 font-weight-bold">Loan Request Number</p>
                                        </div>
                                        <div className='col-sm-1 col-md-1 col-lg-1'>
                                            <p className="mb-0 font-weight-bold">:</p>
                                        </div>

                                        <div className='col-lg-8 col-md-10 col-sm-12'>
                                            <p className='mb-0'>{this.state.profileAttributes.loanrequestnumber !== "" &&
                                                this.state.profileAttributes.loanrequestnumber}</p>
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col-lg-3 col-md-6 col-sm-8'>
                                            <p className="mb-0 font-weight-bold">Borrower ID</p>
                                        </div>
                                        <div className='col-sm-1 col-md-1 col-lg-1'>
                                            <p className="mb-0 font-weight-bold">:</p>
                                        </div>

                                        <div className='col-lg-8 col-md-10 col-sm-12'>
                                            <p className='mb-0'>{this.state.profileAttributes.borrowerid !== "" &&
                                                this.state.profileAttributes.borrowerid}</p>
                                        </div>
                                    </div>
                                    {this.state.profileAttributes.attributes && this.state.profileAttributes.attributes.length > 0 &&
                                        this.state.profileAttributes.attributes.map((profile, index) => {
                                            return (
                                                <>
                                                    <div className='row' key={index}>
                                                        <div className='col-lg-3 col-md-6 col-sm-8'>
                                                            <p className="mb-0 font-weight-bold">{profile.attributetype}</p>
                                                        </div>
                                                        <div className='col-sm-1 col-md-1 col-lg-1'>
                                                            <p className="mb-0 font-weight-bold">:</p>
                                                        </div>

                                                        <div className='col-lg-8 col-md-10 col-sm-12'>
                                                            <p className='mb-0'>{profile.attributevalue}</p>
                                                        </div>
                                                    </div>
                                                    {profile.remark !== "" &&
                                                        <div className='row mb-2'>
                                                            <div className='col-lg-3 col-md-6 col-sm-8'>
                                                                <p className="mb-0 font-weight-bold">Remark</p>
                                                            </div>
                                                            <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                <p className="mb-0 font-weight-bold">:</p>
                                                            </div>
                                                            <div className='col-lg-8 col-md-10 col-sm-12'>
                                                                <p className="mb-0 font-weight-bold">{profile.remark}</p>
                                                            </div>
                                                        </div>}
                                                </>
                                            )
                                        })}
                                </div>
                                <div className='row mb-2'>
                                    <div className='col' style={{ textAlign: "center" }}>
                                        <button type="button" id='disagree' class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "#0079bf" }}>Close</button>
                                    </div>
                                </div>
                            </div>
                            <div className='modal-content' id='LN50' style={{ display: "none" }}>
                                <div class="modal-body">
                                    <div className='row'>
                                        <div className='col-lg-10 col-md-6 col-sm-12'>
                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold" }}><FaFileAlt width="25px" />Uploaded Statements</p>
                                            <hr style={{ width: "50px", marginTop: "-10px", backgroundColor: "rgb(0, 121, 191)" }} />
                                        </div>
                                        <div className='col-lg-2 col-md-6 col-sm-12' style={{ textAlign: "end" }}>
                                            <button style={myStyle} onClick={() => this.backToActivities('LN50')}>
                                                <FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} />
                                                <span style={{ textDecoration: "none", color: "white" }}>Back</span>
                                            </button>
                                        </div>
                                    </div>
                                    <div className='scrollbar1 mb-4' style={{ marginTop: "-10px" }}>
                                        <div style={{
                                            whiteSpace: "nowrap"
                                        }} >
                                            <div className='row font-weight-normal'
                                                style={{
                                                    fontWeight: "800",
                                                    fontSize: "14px",
                                                    color: "rgba(5,54,82,1)",
                                                }}>
                                                <div className='col'>
                                                    <div className='row font-weight-normal' style={{ fontWeight: "800", fontSize: "14px", color: "rgba(5,54,82,1)" }}>
                                                        <div className='col-4' style={{ textAlign: "" }}>
                                                            <p style={{ fontWeight: "600", marginLeft: "16px" }}>{t('File Name')}</p>
                                                        </div>
                                                        <div className='col-3' style={{ textAlign: "center" }}>
                                                            <p style={{ fontWeight: "600" }}>{t('Statement ID')}</p>
                                                        </div>
                                                        <div className='col-3' style={{ textAlign: "center" }}>
                                                            <p style={{ fontWeight: "600" }}>{t('Status')}</p>
                                                        </div>
                                                        <div className='col-2' style={{ marginTop: "-3px", marginLeft: "-40px" }}>
                                                        </div>
                                                    </div>
                                                    <hr className="col-11" style={{ marginLeft: "40px", width: "88.6%", marginTop: "-10px", marginBottom: "-10px" }} />

                                                    {/* Lists */}
                                                    {this.state.loanStmtlist.stmtlist && this.state.loanStmtlist.stmtlist.length > 0 &&
                                                        this.state.loanStmtlist.stmtlist.map((loan, index) => {
                                                            return (
                                                                <div className='col card border-0' key={index} style={{ marginBottom: "-11.5px", transition: 'none', overflow: "visible", color: "rgb(5, 54, 82)", cursor: 'default', backgroundColor: (index % 2 == 0) ? 'rgba(255,255,255,1)' : 'rgba(242,242,242,1)' }}>
                                                                    <div className="row item-list align-items-center">
                                                                        <div className="col-lg-4 col-md-5 col-sm-8">
                                                                            <p style={{ fontSize: "14px", fontWeight: "490", marginBottom: "-3px" }}>{loan.filename}</p>
                                                                        </div >
                                                                        <div className="col-lg-3 col-md-5 col-sm-8" style={{ textAlign: "center" }}>
                                                                            <p style={{ fontSize: "14px", fontWeight: "490", marginBottom: "-3px" }}>{loan.stmtid}</p>
                                                                        </div>
                                                                        <div className="col-lg-3 col-md-5 col-sm-8" style={{ textAlign: "center" }}>
                                                                            <p style={{ fontSize: "14px", fontWeight: "490", marginBottom: "-3px" }}>
                                                                                {loan.isverified === "1" ? (
                                                                                    <span>
                                                                                        <FcOk /> Verified
                                                                                    </span>
                                                                                ) : (
                                                                                    <span>
                                                                                        <GiSandsOfTime /> Not Verified
                                                                                    </span>
                                                                                )}
                                                                            </p>
                                                                        </div>
                                                                        <div className="col-lg-2 col-md-5 col-sm-8" style={{ textAlign: "end" }}>
                                                                            <button className='btn btn-sm text-white'
                                                                                onClick={this.downloadStmt.bind(this, loan.stmtid, loan.filename)}
                                                                                style={{ backgroundColor: "rgb(0, 121, 191)" }}>View</button>
                                                                        </div>
                                                                    </div >
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold" }}><FaFileAlt width="25px" />Extracted Statements</p>
                                    <hr style={{ width: "50px", marginTop: "-10px", backgroundColor: "rgb(0, 121, 191)" }} />

                                    <div className='scrollbar1 mb-2' style={{ marginTop: "-10px" }}>
                                        <div style={{
                                            whiteSpace: "nowrap"
                                        }} >
                                            <div className='row font-weight-normal'
                                                style={{
                                                    fontWeight: "800",
                                                    fontSize: "14px",
                                                    color: "rgba(5,54,82,1)",
                                                }}>
                                                <div className='col'>
                                                    <div className='row font-weight-normal' style={{ fontWeight: "800", fontSize: "14px", color: "rgba(5,54,82,1)" }}>
                                                        <div className='col-4' style={{ textAlign: "" }}>
                                                            <p style={{ fontWeight: "600", marginLeft: "16px" }}>{t('Document Name')}</p>
                                                        </div>
                                                        <div className='col-3' style={{ textAlign: "center" }}>
                                                            <p style={{ fontWeight: "600" }}>{t('Document ID')}</p>
                                                        </div>
                                                        <div className='col-3' style={{ textAlign: "center" }}>
                                                            <p style={{ fontWeight: "600" }}>{t('Extracted Date')}</p>
                                                        </div>
                                                        <div className='col-2' style={{ marginTop: "-3px" }}>
                                                            <p style={{ fontWeight: "600", marginLeft: "8px" }}>{t('Status')}</p>
                                                        </div>
                                                    </div>
                                                    <hr className="col-11" style={{ marginLeft: "40px", width: "88.6%", marginTop: "-10px", marginBottom: "-10px" }} />

                                                    {/* Lists */}
                                                    {this.state.loanStmtlist.extractedstmtlist && this.state.loanStmtlist.extractedstmtlist.length > 0 &&
                                                        this.state.loanStmtlist.extractedstmtlist.map((loan, index) => {
                                                            return (
                                                                <div className='col card border-0' key={index} style={{ marginBottom: "-11.5px", transition: 'none', overflow: "visible", color: "rgb(5, 54, 82)", cursor: 'default', backgroundColor: (index % 2 == 0) ? 'rgba(255,255,255,1)' : 'rgba(242,242,242,1)' }}>
                                                                    <div className="row item-list align-items-center">
                                                                        <div className="col-lg-4 col-md-5 col-sm-8">
                                                                            <p style={{ fontSize: "14px", fontWeight: "490", marginBottom: "5px", marginTop: "5px" }}>{loan.docname}</p>
                                                                        </div >
                                                                        <div className="col-lg-3 col-md-5 col-sm-8" style={{ textAlign: "center" }}>
                                                                            <p style={{ fontSize: "14px", fontWeight: "490", marginBottom: "5px", marginTop: "5px" }}>{loan.docid}</p>
                                                                        </div>
                                                                        <div className="col-lg-3 col-md-5 col-sm-8" style={{ textAlign: "center" }}>
                                                                            <p style={{ fontSize: "14px", fontWeight: "490", marginBottom: "5px", marginTop: "5px" }}>{loan.extractedon}</p>
                                                                        </div>
                                                                        <div className="col-lg-2 col-md-5 col-sm-8" style={{ textAlign: "center" }}>
                                                                            <p style={{ fontSize: "14px", fontWeight: "490", marginBottom: "5px", marginTop: "5px" }}>
                                                                                {loan.isverified === 1 ? (
                                                                                    <span>
                                                                                        <FcOk /> Verified
                                                                                    </span>
                                                                                ) : (
                                                                                    <span>
                                                                                        <GiSandsOfTime /> Not Verified
                                                                                    </span>
                                                                                )}
                                                                            </p>
                                                                        </div>
                                                                    </div >
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='row mb-2'>
                                    <div className='col' style={{ textAlign: "center" }}>
                                        <button type="button" id='disagree' class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "#0079bf" }}>Close</button>
                                    </div>
                                </div>
                            </div>
                            <div className='modal-content' id='LN80' style={{ display: "none" }}>
                                <div className='modal-body' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                    <div className='row'>
                                        <div className='col-lg-10 col-md-6 col-sm-12'>
                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold" }}><img src={editRole} width="25px" />Credit Appraisal Data</p>
                                            <hr style={{ width: "50px", marginTop: "-10px", backgroundColor: "rgb(0, 121, 191)" }} />
                                        </div>
                                        <div className='col-lg-2 col-md-6 col-sm-12' style={{ textAlign: "end" }}>
                                            <button style={myStyle} onClick={() => this.backToActivities('LN80')}>
                                                <FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} />
                                                <span style={{ textDecoration: "none", color: "white" }}>Back</span>
                                            </button>
                                        </div>
                                    </div>
                                    {Object.keys(this.state.creditEvlList).length > 0 && (
                                        <div className='row'>
                                            {Object.entries(this.state.creditEvlList).map(([key, value]) => (
                                                <div className='col-lg-6 col-md- col-sm-12'>
                                                    <div className='row' key={key}>
                                                        <div className='col-lg-7 col-md-6 col-sm-8'>
                                                            <p className="mb-0 font-weight-bold">
                                                                {key === "loanreqno" ? "Loan Request Number" :
                                                                    key === "gincome" ? "Gross Income" :
                                                                        key === "nde" ? "Non Discretionary Exp. Value" :
                                                                            key === "ldef" ? "Number Of Loan Defaults" :
                                                                                key === "cbd" ? "Number Of Cheque Bounces" :
                                                                                    key === "evlmodulation" ? "Evaluator Moderation" :
                                                                                        key === "cescore" ? "CE Score" :
                                                                                            key === "riskrating" ? "Rating" : key
                                                                }
                                                            </p>
                                                        </div>
                                                        <div className='col-sm-1 col-md-1 col-lg-1'>
                                                            <p className="mb-0 font-weight-bold">:</p>
                                                        </div>
                                                        <div className='col-lg-4 col-md-10 col-sm-12'>
                                                            <p className='mb-0'>{value}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className='row mb-2'>
                                    <div className='col' style={{ textAlign: "center" }}>
                                        <button type="button" id='disagree' class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "#0079bf" }}>Close</button>
                                    </div>
                                </div>
                            </div>
                            <div className='modal-content' id='LN110' style={{ display: "none" }}>
                                <div className='modal-body' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                    <div className='row'>
                                        <div className='col-lg-10 col-md-6 col-sm-12'>
                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold" }}><img src={editRole} width="25px" />Loan Offer Details</p>
                                            <hr style={{ width: "50px", marginTop: "-10px", backgroundColor: "rgb(0, 121, 191)" }} />
                                        </div>
                                        <div className='col-lg-2 col-md-6 col-sm-12' style={{ textAlign: "end" }}>
                                            <button style={myStyle} onClick={() => this.backToActivities('LN110')}>
                                                <FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} />
                                                <span style={{ textDecoration: "none", color: "white" }}>Back</span>
                                            </button>
                                        </div>
                                    </div>
                                    {Object.keys(this.state.loanOffers).length > 0 && (
                                        <>
                                            <div className='row'>
                                                <div className='col-lg-6 col-md-8 col-sm-12'>
                                                    <div className='row'>
                                                        <div className='col-lg-6 col-md-8 col-sm-12'>
                                                            <p className="mb-0 font-weight-bold">Loan Request Number</p>
                                                        </div>
                                                        <div className='col-sm-1 col-md-1 col-lg-1'>
                                                            <p className="mb-0 font-weight-bold">:</p>
                                                        </div>

                                                        <div className='col-lg-5 col-md-10 col-sm-12'>
                                                            <p className='mb-0'>{this.state.loanOffers.loanreqno}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='col-lg-6 col-md-8 col-sm-12'>
                                                    <div className='row'>
                                                        <div className='col-lg-6 col-md-8 col-sm-12'>
                                                            <p className="mb-0 font-weight-bold">Loan Amount Offered</p>
                                                        </div>
                                                        <div className='col-sm-1 col-md-1 col-lg-1'>
                                                            <p className="mb-0 font-weight-bold">:</p>
                                                        </div>

                                                        <div className='col-lg-5 col-md-10 col-sm-12'>
                                                            {
                                                                this.state.loanOffers.loanamtoffered ? <p className="mb-0">₹ {parseFloat(this.state.loanOffers.loanamtoffered).toFixed(2)}</p> :
                                                                    ""
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className='col-lg-6 col-md-8 col-sm-12'>
                                                    <div className='row'>
                                                        <div className='col-lg-6 col-md-8 col-sm-12'>
                                                            <p className="mb-0 font-weight-bold">Tenure</p>
                                                        </div>
                                                        <div className='col-sm-1 col-md-1 col-lg-1'>
                                                            <p className="mb-0 font-weight-bold">:</p>
                                                        </div>

                                                        <div className='col-lg-5 col-md-10 col-sm-12'>
                                                            <p className='mb-0'>{this.state.loanOffers.tenure} {this.state.loanOffers.tenuredesc}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='col-lg-6 col-md-8 col-sm-12'>
                                                    <div className='row'>
                                                        <div className='col-lg-6 col-md-8 col-sm-12'>
                                                            <p className="mb-0 font-weight-bold">Interest Rate</p>
                                                        </div>
                                                        <div className='col-sm-1 col-md-1 col-lg-1'>
                                                            <p className="mb-0 font-weight-bold">:</p>
                                                        </div>

                                                        <div className='col-lg-5 col-md-10 col-sm-12'>
                                                            <p className='mb-0'>{this.state.loanOffers.interestrate}% P.A.</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className='col-lg-6 col-md-8 col-sm-12'>
                                                    <div className='row'>
                                                        <div className='col-lg-6 col-md-8 col-sm-12'>
                                                            <p className="mb-0 font-weight-bold">EMI Amount</p>
                                                        </div>
                                                        <div className='col-sm-1 col-md-1 col-lg-1'>
                                                            <p className="mb-0 font-weight-bold">:</p>
                                                        </div>

                                                        <div className='col-lg-5 col-md-10 col-sm-12'>
                                                            {
                                                                this.state.loanOffers.emiamt ? <p className="mb-0">₹ {parseFloat(this.state.loanOffers.emiamt).toFixed(2)}</p> :
                                                                    ""
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='col-lg-6 col-md-8 col-sm-12'>
                                                    <div className='row'>
                                                        <div className='col-lg-6 col-md-8 col-sm-12'>
                                                            <p className="mb-0 font-weight-bold">Risk Rating</p>
                                                        </div>
                                                        <div className='col-sm-1 col-md-1 col-lg-1'>
                                                            <p className="mb-0 font-weight-bold">:</p>
                                                        </div>

                                                        <div className='col-lg-5 col-md-10 col-sm-12'>
                                                            <p className='mb-0'>{this.state.loanOffers.riskrating}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                                <div className='row mb-2'>
                                    <div className='col' style={{ textAlign: "center" }}>
                                        <button type="button" id='disagree' class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "#0079bf" }}>Close</button>
                                    </div>
                                </div>
                            </div>
                            <div className='modal-content' id='LN111' style={{ display: "none" }}>
                                <div class="modal-body">
                                    <div className='row'>
                                        <div className='col-lg-10 col-md-6 col-sm-12'>
                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold" }}><img src={editRole} width="25px" />Approved Activities</p>
                                            <hr style={{ width: "50px", marginTop: "-10px", backgroundColor: "rgb(0, 121, 191)" }} />
                                        </div>
                                        <div className='col-lg-2 col-md-6 col-sm-12' style={{ textAlign: "end" }}>
                                            <button style={myStyle} onClick={() => this.backToActivities('LN111')}>
                                                <FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} />
                                                <span style={{ textDecoration: "none", color: "white" }}>Back</span>
                                            </button>
                                        </div>
                                    </div>
                                    <div className='scrollbar1 mb-2' style={{ marginTop: "-10px" }}>
                                        <div style={{
                                            whiteSpace: "nowrap"
                                        }} >
                                            <div className='row font-weight-normal'
                                                style={{
                                                    fontWeight: "800",
                                                    fontSize: "14px",
                                                    color: "rgba(5,54,82,1)",
                                                }}>
                                                <div className='col'>
                                                    <div className='row font-weight-normal' style={{ fontWeight: "800", fontSize: "14px", color: "rgba(5,54,82,1)" }}>
                                                        <div className='col-3' style={{ textAlign: "" }}>
                                                            <p style={{ fontWeight: "600", marginLeft: "16px" }}>{t('Activity Name')}</p>
                                                        </div>
                                                        <div className='col-2' style={{ textAlign: "" }}>
                                                            <p style={{ fontWeight: "600" }}>{t('Assigned To')}</p>
                                                        </div>
                                                        <div className='col-2' style={{ textAlign: "" }}>
                                                            <p style={{ fontWeight: "600" }}>{t('Performed By')}</p>
                                                        </div>
                                                        <div className='col-1' style={{ textAlign: "" }}>
                                                            <p style={{ fontWeight: "600", marginLeft: "-10px" }}>{t('Order No.')}</p>
                                                        </div>
                                                        <div className='col-2' style={{ textAlign: "" }}>
                                                            <p style={{ fontWeight: "600" }}>{t('Updated On')}</p>
                                                        </div>
                                                        <div className='col-2' style={{ marginTop: "-3px" }}>
                                                            <p style={{ fontWeight: "600" }}>{t('Status')}</p>
                                                        </div>
                                                    </div>
                                                    <hr className="col-11" style={{ marginLeft: "40px", width: "88.6%", marginTop: "-10px", marginBottom: "-10px" }} />

                                                    {/* Lists */}
                                                    {this.state.approvedActivities && this.state.approvedActivities.length > 0 &&
                                                        this.state.approvedActivities.map((activities, index) => {
                                                            return (
                                                                <div className='col card border-0' key={index} style={{ marginBottom: "-11.5px", transition: 'none', overflow: "visible", color: "rgb(5, 54, 82)", cursor: 'default', backgroundColor: (index % 2 == 0) ? 'rgba(255,255,255,1)' : 'rgba(242,242,242,1)' }}>
                                                                    <div className="row item-list align-items-center">
                                                                        <div className="col-lg-3 col-md-5 col-sm-8">
                                                                            <p style={{ fontSize: "14px", fontWeight: "490", marginBottom: "5px", marginTop: "5px" }}>{activities.activity}</p>
                                                                        </div >
                                                                        <div className="col-lg-2 col-md-5 col-sm-8">
                                                                            <p style={{ fontSize: "14px", fontWeight: "490", marginBottom: "5px", marginTop: "5px", marginLeft: "-4px" }}>{activities.assignedto}</p>
                                                                        </div>
                                                                        <div className="col-lg-2 col-md-5 col-sm-8">
                                                                            <p style={{ fontSize: "14px", fontWeight: "490", marginBottom: "5px", marginTop: "5px", wordWrap: "" }}>{activities.performedby}</p>
                                                                        </div>
                                                                        <div className="col-lg-1 col-md-5 col-sm-8">
                                                                            <p style={{ fontSize: "14px", fontWeight: "490", marginBottom: "5px", marginTop: "5px", wordWrap: "" }}>{activities.orderno}</p>
                                                                        </div>
                                                                        <div className="col-lg-2 col-md-5 col-sm-8">
                                                                            <p style={{ fontSize: "14px", fontWeight: "490", marginBottom: "5px", marginTop: "5px", marginLeft: "7px", }}>{activities.updatedon.substring(0, 10)}</p>
                                                                        </div>
                                                                        <div className="col-lg-2 col-md-5 col-sm-8">
                                                                            <p style={{ fontSize: "14px", fontWeight: "490", marginBottom: "5px", marginTop: "5px" }}>
                                                                                {activities.status === "1" ? (
                                                                                    <span>
                                                                                        <FcOk /> Verified
                                                                                    </span>
                                                                                ) : activities.status === "2" ?
                                                                                    (
                                                                                        <span>
                                                                                            <FaTimesCircle /> Rejected
                                                                                        </span>
                                                                                    ) : activities.status === "0" &&
                                                                                    (
                                                                                        <span>
                                                                                            <GiSandsOfTime /> Not Verified
                                                                                        </span>
                                                                                    )}
                                                                            </p>
                                                                        </div>
                                                                    </div >
                                                                </div>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='row mb-2'>
                                    <div className='col' style={{ textAlign: "center" }}>
                                        <button type="button" id='disagree' class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "#0079bf" }}>Close</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pdf preview */}
                    <button type="button" id='launchColl' style={{ display: "none" }} class="btn btn-primary" data-toggle="modal" data-target=".bd-example-modal-lg2">Large modal</button>
                    <div class="modal fade bd-example-modal-lg2" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel2" aria-hidden="true">
                        <div class="modal-dialog modal-lg">
                            <div class="modal-content">
                                <div className='modal-body'>
                                    <iframe src="" className="PDFdoc" type="application/pdf" style={{ overflow: "auto", height: "80vh", width: "100%" }}>

                                    </iframe>
                                </div>
                                <div className='modal-footer' style={{ marginTop: "-25px" }}>
                                    <div className='pt-2' style={{ textAlign: "end", paddingRight: "15px" }}>
                                        <button type="button" class="btn text-white btn-sm" style={{ backgroundColor: "rgb(0, 121, 191)" }} onClick={this.backToStmtModal}>Close</button>
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

export default withTranslation()(WorkflowHierarchy)