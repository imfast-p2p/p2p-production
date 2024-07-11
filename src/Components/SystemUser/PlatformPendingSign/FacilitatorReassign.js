import React, { Component } from "react";
import $, { param } from "jquery";
import { BASEURL } from "../../assets/baseURL";
import SystemUserSidebar from "../SystemUserSidebar";
import { withTranslation } from "react-i18next";
import { FaSearch, FaAngleLeft, FaExclamationCircle, FaEllipsisV } from "react-icons/fa";
import dashboardIcon from '../../assets/icon_dashboard.png'
import { Link } from 'react-router-dom';
import accept from '../../assets/accept.png';
import ReactPaginate from 'react-paginate';
import '../../Borrower/Pagination.css';
import { confirmAlert } from "react-confirm-alert";
import openIt from '../../assets/AdminImg/openit.png';
import Loader from '../../Loader/Loader';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'

export class FacilitatorReassign extends Component {
    constructor(props) {
        super(props);

        this.state = {
            requests: [],
            facLists: [],
            loanReqNo: "",
            facID: "",
            reassignReason: "",

            fromdate: "",
            todate: "",
            dtoday: "",
            dfrday: "",

            fromdateEvl: "",
            todateEvl: "",

            offset: 0,
            orgtableData: [],
            perPage: 10,
            currentPage: 0,
            pageCount: "",

            evlReqsts: [],
            offset2: 0,
            orgtableData2: [],
            perPage2: 10,
            currentPage2: 0,
            pageCount2: "",

            getPlatformStatus: "",
            txnID: "",
            showLoader: false,
            facEvlFlag: true
        };
        this.facRef = React.createRef();
        this.evlRef = React.createRef();
    }

    componentDidMount() {
        // var data = this.state.requests
        // console.log(data)
        // var slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
        // console.log(slice)

        // this.setState({
        //     pageCount: Math.ceil(data.length / this.state.perPage),
        //     orgtableData: data,
        //     requests: slice
        // });

        this.loadDate();
        this.loadAllloanreq();
    }
    fromdate = (event) => {
        this.setState({ fromdate: event.target.value })
        const selectedFromDate = event.target.value;
        const selectedToDate = this.state.todate;

        if (this.isDifferenceWithinSixMonths(selectedFromDate, selectedToDate)) {
            this.setState({ fromdate: selectedFromDate, error: '' });
            $(".loanReqButton").prop('disabled', false);
        } else {
            this.setState({
                fromdate: selectedFromDate,
                error: "Date ranges should not exceed 6 months.",
            });
            $(".loanReqButton").prop('disabled', true);
        }
    }
    todate = (event) => {
        this.setState({ todate: event.target.value });
        const selectedFromDate = this.state.fromdate;
        const selectedToDate = event.target.value;

        if (this.isDifferenceWithinSixMonths(selectedFromDate, selectedToDate)) {
            this.setState({ todate: selectedToDate, error: '' });
            $(".loanReqButton").prop('disabled', false);
        } else {
            this.setState({
                todate: selectedToDate,
                error: "Date ranges should not exceed 6 months.",
            });
            $(".loanReqButton").prop('disabled', true);

        }
    }
    fromdateEvl = (event) => {
        this.setState({ fromdateEvl: event.target.value })
        const selectedFromDate = event.target.value;
        const selectedToDate = this.state.todateEvl;

        if (this.isDifferenceWithinSixMonths(selectedFromDate, selectedToDate)) {
            this.setState({ fromdateEvl: selectedFromDate, error: '' });
            $(".loanReqButton2").prop('disabled', false);
        } else {
            this.setState({
                fromdateEvl: selectedFromDate,
                errorEvl: "Date ranges should not exceed 6 months.",
            });
            $(".loanReqButton2").prop('disabled', true);
        }
    }
    todateEvl = (event) => {
        this.setState({ todateEvl: event.target.value });
        const selectedFromDate = this.state.fromdateEvl;
        const selectedToDate = event.target.value;

        if (this.isDifferenceWithinSixMonths(selectedFromDate, selectedToDate)) {
            this.setState({ todateEvl: selectedToDate, error: '' });
            $(".loanReqButton2").prop('disabled', false);
        } else {
            this.setState({
                todateEvl: selectedToDate,
                errorEvl: "Date ranges should not exceed 6 months.",
            });
            $(".loanReqButton2").prop('disabled', true);

        }
    }
    isDifferenceWithinSixMonths = (fromDate, toDate) => {
        const sixMonthsInMilliseconds = 6 * 30 * 24 * 60 * 60 * 1000; // Approximate

        const difference = new Date(toDate) - new Date(fromDate);

        return difference <= sixMonthsInMilliseconds;
    };

    loadDate() {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();
        var frday;

        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }

        today = yyyy + '-' + mm + '-' + dd;
        frday = yyyy + '-' + mm + '-' + '01';
        this.setState({ dtoday: today });
        this.setState({ todate: today })
        this.setState({ dfrday: frday });
        this.setState({ fromdate: frday })

        this.setState({ fromdateEvl: frday })
        this.setState({ todateEvl: today })
    }
    loadAllloanreq = () => {
        var today = new Date();
        var dd = today.getDate();
        var mm = today.getMonth() + 1; //January is 0!
        var yyyy = today.getFullYear();
        var frday;

        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }

        today = yyyy + '-' + mm + '-' + dd;
        frday = yyyy + '-' + mm + '-' + '01';

        this.setState({ showLoader: true })
        fetch(BASEURL + "/lsp/getplatformallloanrequests ", {
            method: "POST",
            headers: {
                'Accept': "application/json",
                "Content-Type": "application/json",
                'Authorization': "Bearer " + sessionStorage.getItem("token"),
            },
            body: JSON.stringify({
                fromdate: frday,
                todate: today,
            })
        })
            .then((Response) => Response.json())
            .then((resdata) => {
                if (resdata.status == "SUCCESS") {
                    this.setState({ showLoader: false })

                    console.log(resdata);
                    var list = resdata.msgdata;
                    list.sort((a, b) => {
                        return new Date(b.requestedon).getTime() - new Date(a.requestedon).getTime()
                    })
                    console.log(list);
                    this.setState({ requests: list });

                    var data = resdata.msgdata
                    console.log(data)
                    var slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
                    console.log(slice)

                    this.setState({
                        pageCount: Math.ceil(data.length / this.state.perPage),
                        orgtableData: data,
                        requests: slice
                    })
                } else {
                    //alert("Issue: " + resdata.message);
                    this.setState({ showLoader: false })
                }
            });

    }
    getAllLoanReq = (params) => {
        if (params === "facLoans") {
            fetch(BASEURL + "/lsp/getplatformallloanrequests ", {
                method: "POST",
                headers: {
                    'Accept': "application/json",
                    "Content-Type": "application/json",
                    'Authorization': "Bearer " + sessionStorage.getItem("token"),
                },
                body: JSON.stringify({
                    fromdate: this.state.fromdate,
                    todate: this.state.todate,
                })
            })
                .then((Response) => Response.json())
                .then((resdata) => {
                    if (resdata.status == "SUCCESS") {
                        console.log(resdata);
                        var list = resdata.msgdata;
                        list.sort((a, b) => {
                            return new Date(b.requestedon).getTime() - new Date(a.requestedon).getTime()
                        })
                        console.log(list);
                        this.setState({ requests: list });

                        var data = resdata.msgdata
                        console.log(data)
                        var slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
                        console.log(slice)

                        this.setState({
                            pageCount: Math.ceil(data.length / this.state.perPage),
                            orgtableData: data,
                            requests: slice
                        })
                    } else {
                        //alert("Issue: " + resdata.message);
                    }
                });
        } else if (params === "evlLoans") {
            fetch(BASEURL + "/lsp/getplatformallloanrequests ", {
                method: "POST",
                headers: {
                    'Accept': "application/json",
                    "Content-Type": "application/json",
                    'Authorization': "Bearer " + sessionStorage.getItem("token"),
                },
                body: JSON.stringify({
                    fromdate: this.state.fromdateEvl,
                    todate: this.state.todateEvl,
                })
            })
                .then((Response) => Response.json())
                .then((resdata) => {
                    if (resdata.status == "SUCCESS") {
                        console.log(resdata);
                        var list = resdata.msgdata;
                        list.sort((a, b) => {
                            return new Date(b.requestedon).getTime() - new Date(a.requestedon).getTime()
                        })
                        console.log(list);
                        this.setState({ evlReqsts: list });

                        var data = resdata.msgdata
                        console.log(data)
                        var slice = data.slice(this.state.offset2, this.state.offset2 + this.state.perPage2)
                        console.log(slice)

                        this.setState({
                            pageCount2: Math.ceil(data.length / this.state.perPage2),
                            orgtableData2: data,
                            evlReqsts: slice
                        })
                    } else {
                        //alert("Issue: " + resdata.message);
                    }
                });
        }
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
            requests: slice
        })
    }

    handlePageClick2 = (event) => {
        const selectedPage = event.selected;
        const offset = selectedPage * this.state.perPage2;
        this.setState({
            currentPage2: selectedPage,
            offset2: offset
        }, () => {
            this.loadMoreData2();
        })
    }
    loadMoreData2 = () => {
        const data = this.state.orgtableData2;
        const slice = data.slice(this.state.offset2, this.state.offset2 + this.state.perPage2)
        this.setState({
            pageCount2: Math.ceil(data.length / this.state.perPage2),
            evlReqsts: slice
        })
    }
    getStatus = (e) => {
        this.setState({ getPlatformStatus: e.target.value })
    }
    facReassignModal = (loanreqno) => {
        this.setState({
            loanReqNo: loanreqno,
            facEvlFlag: true
        }, () => {
            this.getFacilitators();
            $("#setfacRefModal").click()
        });
    }
    evlReassignModal = (loanreqno) => {
        this.setState({
            loanReqNo: loanreqno,
            facEvlFlag: false
        }, () => {
            console.log(this.state.loanReqNo,
                this.state.facEvlFlag, loanreqno)
            this.getFacilitators();
            $("#setfacRefModal").click()
        });
    }
    facIDs = (e) => {
        this.setState({ facID: e.target.value })
    }
    facReassignReason = (e) => {
        this.setState({ reassignReason: e.target.value })
    }
    getFacilitators() {
        fetch(BASEURL + `/usrmgmt/getfacevallist?utype=${this.state.facEvlFlag === true ? "4" : "5"}&userstatus=1`, {
            method: 'get',
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
                    this.setState({ facLists: resdata.msgdata })
                } else {

                }
            })
    }
    setFacilitatorReassign = () => {
        // var withReason = JSON.stringify({
        //     loanrequestnumber: this.state.loanReqNo,
        //     facilitatorid: this.state.facID,
        //     reason: this.state.reassignReason
        // });
        // var withoutReason = JSON.stringify({
        //     loanrequestnumber: this.state.loanReqNo,
        //     facilitatorid: this.state.facID,
        // });
        // var result;
        // if (this.state.reassignReason === "") {
        //     result = withoutReason
        // } else {
        //     result = withReason
        // }
        fetch(BASEURL + '/lsp/reassignfacilitatortoloanrequest', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                loanrequestnumber: this.state.loanReqNo,
                facilitatorid: this.state.facID,
                reason: this.state.reassignReason
            })
        }).then((Response) => {
            return Response.json();
        })
            .then((resdata) => {
                console.log(resdata);
                // alert(resdata.message);
                if (resdata.status.toLowerCase() === ('success')) {
                    $("#exampleModalCenter3").modal('hide');
                    confirmAlert({
                        message: resdata.message,
                        buttons: [
                            {
                                label: "Okay",
                                onClick: () => {
                                    this.getAllLoanReq("facLoans");
                                    $(this.facRef.current).val('');
                                },
                            },
                        ],
                    });
                } else {
                    $("#exampleModalCenter3").modal('hide');
                    confirmAlert({
                        message: resdata.message,
                        buttons: [
                            {
                                label: "Okay",
                                onClick: () => {
                                    $("#exampleModalCenter3").modal('show');
                                },
                            },
                        ],
                    });
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }
    cancelFacReassign = () => {
        $("#exampleModalCenter3").modal('hide');
        this.setState({ reassignReason: '' });
    }
    reAssignToEvl = () => {
        // var withReason =JSON.stringify({
        //     loanrequestnumber: this.state.loanReqNo,
        //     evaluatorid: this.state.facID,
        //     reason: this.state.reassignReason
        // });
        // var withoutReason = JSON.stringify({
        //     loanrequestnumber: this.state.loanReqNo,
        //     evaluatorid: this.state.facID,
        // });
        // var result;
        // if (this.state.reassignReason === "") {
        //     result = withoutReason
        // } else {
        //     result =withReason
        // }
        // console.log(result)
        fetch(BASEURL + '/lsp/reassignevaluatortoloanrequest', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                loanrequestnumber: this.state.loanReqNo,
                evaluatorid: this.state.facID,
                reason: this.state.reassignReason
            })
        }).then((Response) => {
            return Response.json();
        })
            .then((resdata) => {
                console.log(resdata);
                if (resdata.status.toLowerCase() === ('success')) {
                    $("#exampleModalCenter3").modal('hide');
                    confirmAlert({
                        message: resdata.message,
                        buttons: [
                            {
                                label: "Okay",
                                onClick: () => {
                                    this.getAllLoanReq("evlLoans");
                                    $(this.evlRef.current).val('');
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
                                    $("#exampleModalCenter3").modal('show');
                                },
                            },
                        ],
                    });
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }
    cancelEvlReassign = () => {
        $("#exampleModalCenter3").modal('hide');
        this.setState({ reassignReason: '' });
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
            <div className="container-dashboard d-flex flex-row" id="wrapper" style={{ backgroundColor: "#F4F7FC" }}>
                {
                    this.state.showLoader && <Loader />
                }
                <SystemUserSidebar />
                <div className="main-content" id="page-content-wrapper">
                    <div className="container-fluid row pt-2">
                        <div className="col-1" id="">
                            <button style={{ marginLeft: "25px" }} onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className='col-4' id="" style={{ marginLeft: "40px", marginTop: "5px" }}>
                            <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                <Link to="/sysUserDashboard">Home</Link> / Loan Assignment</p>
                        </div>
                        <div className='col'>

                        </div>
                        <div className='col'>

                        </div>
                        <div className='col-3'>

                        </div>
                        <div className="col" id="">
                            <button style={myStyle}>
                                <Link to="/sysUserDashboard" style={{ marginLeft: "10px" }}><FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} /><span style={{ textDecoration: "none", color: "white" }}>Back</span></Link></button>
                        </div>
                    </div>
                    <hr className="col-11" style={{ marginLeft: "50px", width: "88.6%", backgroundColor: "rgba(4,78,160,1)", marginTop: "0px" }} />

                    <div className='container-fluid row' style={{ paddingLeft: "82px", marginTop: "-26px" }}>
                        <div className='card' style={{ overflow: "auto" }}>
                            <div className='row pt-2'>
                                <div className='col'>
                                    <ul role="tablist" className="nav nav-pills nav-fill mb-3" >
                                        <li className="nav-item"> <a data-toggle="pill" href="#myEarning-details" className="nav-link active detailsTab"
                                            style={{ textAlign: "center", paddingTop: "10px", paddingBottom: "10px" }}> {t('Facilitator Reassign')} </a> </li>
                                        <li className="nav-item" > <a data-toggle="pill" href="#futureEarning-details" className="nav-link detailsTab"
                                            style={{ textAlign: "center", paddingTop: "10px", paddingBottom: "10px" }} onClick={() => this.getAllLoanReq("evlLoans")}> {t('Evaluator Reassign')} </a> </li>
                                    </ul>

                                </div>
                            </div>
                            <div className='row' style={{ marginTop: "-10px" }}>
                                <div className='col'>
                                    <div className='tab-content'>
                                        <div id="myEarning-details" className=" register-form tab-pane fade show active" style={{ cursor: "default" }}>
                                            <div className='row' style={{ marginBottom: this.state.error ? "" : "15px" }}>
                                                <div className='col-3' id='date1'>
                                                    <label htmlFor="date" className="" style={{ fontSize: "13px", marginLeft: "0px", color: "rgba(5,54,82,1)", fontFamily: "Poppins,sans-serif" }}>{t('From Date*')}</label><br />
                                                    <input id="Fdate" type="date"
                                                        defaultValue={this.state.dfrday} onChange={this.fromdate} style={{
                                                            border: "1px solid rgba(40,116,166,1)",
                                                            borderRadius: "5px",
                                                            width: "200px",
                                                            height: "35px",
                                                            fontSize: "15px",
                                                            color: "rgba(40,116,166,1)",

                                                        }} />
                                                </div>
                                                <div className='col-3' id='date2' style={{ fontSize: "15px" }}>
                                                    <label htmlFor="date" className="" style={{ fontSize: "13px", marginLeft: "0px", color: "rgba(5,54,82,1)", fontFamily: "Poppins,sans-serif" }}>{t('To Date*')}</label><br />
                                                    <input id="Tdate" type="date"
                                                        defaultValue={this.state.dtoday} onChange={this.todate} style={{
                                                            border: "1px solid rgba(40,116,166,1)",
                                                            borderRadius: "5px",
                                                            width: "200px",
                                                            height: "35px",
                                                            fontSize: "15px",
                                                            color: "rgba(40,116,166,1)",

                                                        }} />
                                                </div>
                                                <div className='col-2' style={{ paddingTop: '30px' }}>
                                                    <button type="button" className="btn btn-sm text-white loanReqButton" style={{
                                                        backgroundColor: "rgba(0,121,190,1)", width: "100px",
                                                        height: "35px",
                                                    }} onClick={() => this.getAllLoanReq("facLoans")}>{t('Apply')}</button>
                                                </div>
                                            </div>
                                            {this.state.error &&
                                                <div className="row mb-2">
                                                    <div className="col">
                                                        <p style={{ fontSize: "14px", marginLeft: "0px", color: 'red' }}><FaExclamationCircle />{this.state.error}</p>
                                                    </div>
                                                </div>
                                            }

                                            {this.state.requests == "" ?
                                                <div className="row mt-2" style={{ marginLeft: "6px" }}>
                                                    <div className="col text-center" style={{ color: "#222C70", fontSize: "14px", fontWeight: "500" }}>
                                                        <p>No lists available.</p>
                                                    </div>
                                                </div> :
                                                <>
                                                    <div style={{ whiteSpace: "nowrap" }} id='secondAuditScroll1'>
                                                        <Table responsive>
                                                            <Thead>
                                                                <Tr style={{ fontSize: "15px", color: "rgba(5,54,82,1)", paddingLeft: "6px" }}>
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('Loan Request No.')}</Th>
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('Borrower ID')}</Th>
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('Facilitator ID')}</Th>
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('Requested On')}</Th>
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('Fac. Verified')}</Th>
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('Loan Request Status')}</Th>
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px" }}></Th>
                                                                </Tr>
                                                            </Thead>
                                                            <Tbody>
                                                                {this.state.requests.map((lists, index) => (
                                                                    <Tr key={index} style={{
                                                                        marginBottom: "-10px", transition: 'none', cursor: 'default', color: "rgba(5,54,82,1)",
                                                                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", backgroundColor: (index % 2 === 0) ? 'rgba(255,255,255,1)' : 'rgba(242,242,242,1)'
                                                                    }}>
                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}>{lists.loanreqno}</Td>
                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}>{lists.borrowerid}</Td>
                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}>{lists.facid}</Td>
                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}>{lists.requestedon &&
                                                                            new Date(lists.requestedon).toLocaleDateString('en-GB').replace(/\//g, '-')}</Td>
                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}> {lists.facverificationstatus == "0" ? "Not Verified" : <span style={{ color: "rgb(29, 143, 63)" }}>
                                                                            {lists.facverificationstatus == "1" ? "Verified" : <span style={{ color: "rgb(27, 18, 199)" }}>
                                                                                {lists.facverificationstatus == "9" ? "Skipped" : ""}</span>}
                                                                        </span>}</Td>
                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}>{lists.status == "1" ? "Active" :
                                                                            lists.status == "2" ? "Offer Generated" :
                                                                                lists.status == "3" ? "Offer Accepted" :
                                                                                    lists.status == "4" ? "Rejected" :
                                                                                        lists.status == "5" ? "Withdrawn" :
                                                                                            lists.status == "6" ? "Loanlisted" :
                                                                                                lists.status == "8" ? "Rejected" : ""
                                                                        }</Td>
                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "right" }}>

                                                                            <span className="dropdown">
                                                                                {lists.facverificationstatus === "1" || lists.facverificationstatus === "9" ? (
                                                                                    <FaEllipsisV style={{ fontSize: "26px" }}
                                                                                        className="btn dropdown-toggle dropdown-toggle-split" />

                                                                                ) : (
                                                                                    <>

                                                                                        <FaEllipsisV style={{ fontSize: "26px" }}
                                                                                            className="btn dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" />

                                                                                        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton" style={{ marginLeft: "-160px" }}>
                                                                                            <a className="dropdown-item" onClick={() => this.facReassignModal(lists.loanreqno)}>ReAssign To Facilitator</a>

                                                                                        </div>
                                                                                    </>
                                                                                )}
                                                                            </span>

                                                                        </Td>
                                                                    </Tr>
                                                                ))}
                                                            </Tbody>
                                                        </Table>
                                                        &nbsp;
                                                        {this.state.requests.length > 1 &&
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
                                                    </div>
                                                </>}

                                        </div>



                                        <div id="futureEarning-details" className=" register-form tab-pane fade" style={{ cursor: "default" }}>
                                            <div className='row' style={{ marginBottom: this.state.error ? "" : "15px" }}>
                                                <div className='col-3' id='date1'>
                                                    <label htmlFor="date" className="" style={{ fontSize: "13px", marginLeft: "0px", color: "rgba(5,54,82,1)", fontFamily: "Poppins,sans-serif" }}>{t('From Date*')}</label><br />
                                                    <input id="Fdate" type="date"
                                                        defaultValue={this.state.dfrday} onChange={this.fromdateEvl} style={{
                                                            border: "1px solid rgba(40,116,166,1)",
                                                            borderRadius: "5px",
                                                            width: "200px",
                                                            height: "35px",
                                                            fontSize: "15px",
                                                            color: "rgba(40,116,166,1)",

                                                        }} />
                                                </div>
                                                <div className='col-3' id='date2' style={{ fontSize: "15px" }}>
                                                    <label htmlFor="date" className="" style={{ fontSize: "13px", marginLeft: "0px", color: "rgba(5,54,82,1)", fontFamily: "Poppins,sans-serif" }}>{t('To Date*')}</label><br />
                                                    <input id="Tdate" type="date"
                                                        defaultValue={this.state.dtoday} onChange={this.todateEvl} style={{
                                                            border: "1px solid rgba(40,116,166,1)",
                                                            borderRadius: "5px",
                                                            width: "200px",
                                                            height: "35px",
                                                            fontSize: "15px",
                                                            color: "rgba(40,116,166,1)",

                                                        }} />
                                                </div>
                                                <div className='col-2' style={{ paddingTop: '30px' }}>
                                                    <button type="button" className="btn btn-sm text-white loanReqButton2" style={{
                                                        backgroundColor: "rgba(0,121,190,1)", width: "100px",
                                                        height: "35px",
                                                    }} onClick={() => this.getAllLoanReq("evlLoans")}>{t('Apply')}</button>
                                                </div>
                                            </div>
                                            {this.state.error &&
                                                <div className="row mb-2">
                                                    <div className="col">
                                                        <p style={{ fontSize: "14px", marginLeft: "0px", color: 'red' }}><FaExclamationCircle />{this.state.error}</p>
                                                    </div>
                                                </div>
                                            }

                                            {this.state.evlReqsts == "" ?
                                                <div className="row mt-2" style={{ marginLeft: "6px" }}>
                                                    <div className="col text-center" style={{ color: "#222C70", fontSize: "14px", fontWeight: "500" }}>
                                                        <p>No lists available.</p>
                                                    </div>
                                                </div> :
                                                <>
                                                    <div style={{ whiteSpace: "nowrap" }} id='secondAuditScroll1'>
                                                        <Table responsive>
                                                            <Thead>
                                                                <Tr style={{ fontSize: "15px", color: "rgba(5,54,82,1)", paddingLeft: "6px" }}>
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('Loan Request No.')}</Th>
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('Borrower ID')}</Th>
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('Evaluator ID')}</Th>
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('Requested On')}</Th>
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('Evl. Verified')}</Th>
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('Loan Request Status')}</Th>
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px" }}></Th>
                                                                </Tr>
                                                            </Thead>
                                                            <Tbody>
                                                                {this.state.evlReqsts.map((lists, index) => (
                                                                    <Tr key={index} style={{
                                                                        marginBottom: "-10px", transition: 'none', cursor: 'default', color: "rgba(5,54,82,1)",
                                                                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", backgroundColor: (index % 2 === 0) ? 'rgba(255,255,255,1)' : 'rgba(242,242,242,1)'
                                                                    }}>
                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}>{lists.loanreqno}</Td>
                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}>{lists.borrowerid}</Td>
                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}>{lists.evaluatorid}</Td>
                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}>{lists.requestedon &&
                                                                            new Date(lists.requestedon).toLocaleDateString('en-GB').replace(/\//g, '-')}</Td>
                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}>{lists.evlverificationstatus == "0" ? "Not Verified" : <span style={{ color: "rgb(29, 143, 63)" }}>
                                                                                        {lists.evlverificationstatus == "1" ? "Verified" : <span style={{ color: "rgb(27, 18, 199)" }}>
                                                                                            {lists.evlverificationstatus == "9" ? "Skipped" : ""}</span>}
                                                                                    </span>}</Td>
                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}> {lists.status == "1" ? "Active" :
                                                                                        lists.status == "2" ? "Offer Generated" :
                                                                                            lists.status == "3" ? "Offer Accepted" :
                                                                                                lists.status == "4" ? "Rejected" :
                                                                                                    lists.status == "5" ? "Withdrawn" :
                                                                                                        lists.status == "6" ? "Loanlisted" :
                                                                                                            lists.status == "8" ? "Rejected" : ""
                                                                                    }</Td>
                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "right" }}>

                                                                            <span className="dropdown">
                                                                                {lists.evlverificationstatus === "1" || lists.evlverificationstatus === "9" ? (
                                                                                    <FaEllipsisV style={{ fontSize: "26px" }}
                                                                                        className="btn dropdown-toggle dropdown-toggle-split" />

                                                                                ) : (
                                                                                    <>

                                                                                        <FaEllipsisV style={{ fontSize: "26px" }}
                                                                                            className="btn dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" />

                                                                                        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton" style={{ marginLeft: "-160px" }}>
                                                                                            <a className="dropdown-item" onClick={this.evlReassignModal.bind(this, lists.loanreqno)}>ReAssign To Evaluator</a>

                                                                                        </div>
                                                                                    </>
                                                                                )}
                                                                            </span>

                                                                        </Td>
                                                                    </Tr>
                                                                ))}
                                                            </Tbody>
                                                        </Table>
                                                        &nbsp;
                                                        {this.state.evlReqsts.length > 1 &&
                                                            <div className="row justify-content-end">
                                                                <div className='col-auto'>
                                                                    <div className='card border-0' style={{ height: "40px" }}>
                                                                        <div style={{ marginTop: "-25px", marginLeft: "16px" }}>
                                                                            <ReactPaginate
                                                                                previousLabel={"<"}
                                                                                nextLabel={">"}
                                                                                breakLabel={"..."}
                                                                                breakClassName={"break-me"}
                                                                                pageCount={this.state.pageCount2}
                                                                                onPageChange={this.handlePageClick2}
                                                                                containerClassName={"pagination"}
                                                                                subContainerClassName={"pages pagination"}
                                                                                activeClassName={"active"}
                                                                            />
                                                                        </div>
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

                    {/* set OVD Status */}
                    <button type="button" id="setfacRefModal" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter3" style={{ display: "none" }}>
                        Set Fac Ref modal
                    </button>
                    <div class="modal fade" data-backdrop="static" id="exampleModalCenter3" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered" role="document">
                            {this.state.facEvlFlag === true ?
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h5 class="modal-title" id="exampleModalLongTitle" style={{ color: "#00264d" }}>Reassign To Facilitator</h5>
                                    </div>
                                    <div class="modal-body">
                                        <div className="row mb-2">
                                            <div className="col">
                                                <p style={{ color: "rgb(5, 54, 82)", fontWeight: "500" }}>Loan Request Number *</p>
                                                <input type="text" className="form-control" readOnly value={this.state.loanReqNo} style={{ marginTop: "-10px" }} />
                                            </div>
                                        </div>
                                        <div className='row mb-2'>
                                            <div className='col'>
                                                <p style={{ color: "rgb(5, 54, 82)", fontWeight: "500" }}>Facilitator ID *</p>
                                                <select className='form-select' ref={this.facRef} style={{ marginTop: "-10px" }} onChange={this.facIDs}>
                                                    <option defaultValue>Select</option>
                                                    {this.state.facLists.map((list, index) => {
                                                        return (
                                                            <option key={index} style={{ color: "GrayText" }} value={list.userid}>
                                                                {list.userid}({list.username})
                                                            </option>
                                                        )
                                                    })}
                                                </select>
                                            </div>
                                        </div>
                                        <div className='row' id="rejectReasonField">
                                            <div className='col'>
                                                <p style={{ color: "rgb(5, 54, 82)", fontWeight: "500" }}>{`Reassign Reason`}</p>
                                                <textarea type="text" className="form-control" value={this.state.reassignReason} style={{ marginTop: "-10px" }} maxLength={250} onChange={this.facReassignReason}></textarea>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="modal-footer">
                                        <div className='row'>
                                            <div className='col' style={{ paddingTop: "20px", textAlign: "end" }}>
                                                <button className='btn btn-sm text-white delUpldSubmBtn' style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.setFacilitatorReassign}>Submit</button>
                                                &nbsp;
                                                <button className='btn btn-sm text-white' data-dismiss="modal" style={{ backgroundColor: "#0079BF" }} onChange={this.cancelFacReassign}>Cancel</button>
                                            </div>
                                        </div>
                                    </div>
                                </div> :
                                <div class="modal-content">
                                    <div class="modal-header">
                                        <h5 class="modal-title" id="exampleModalLongTitle" style={{ color: "#00264d" }}>Reassign To Evaluator</h5>
                                    </div>
                                    <div class="modal-body">
                                        <div className="row mb-2">
                                            <div className="col">
                                                <p style={{ color: "rgb(5, 54, 82)", fontWeight: "500" }}>Loan Request Number *</p>
                                                <input type="text" className="form-control" readOnly value={this.state.loanReqNo} style={{ marginTop: "-10px" }} />
                                            </div>
                                        </div>
                                        <div className='row mb-2'>
                                            <div className='col'>
                                                <p style={{ color: "rgb(5, 54, 82)", fontWeight: "500" }}>Evaluator ID *</p>
                                                <select className='form-select' ref={this.evlRef} style={{ marginTop: "-10px" }} onChange={this.facIDs}>
                                                    <option defaultValue>Select</option>
                                                    {this.state.facLists.map((list, index) => {
                                                        return (
                                                            <option key={index} style={{ color: "GrayText" }} value={list.userid}>
                                                                {list.userid}({list.username})
                                                            </option>
                                                        )
                                                    })}
                                                </select>
                                            </div>
                                        </div>
                                        <div className='row' id="rejectReasonField">
                                            <div className='col'>
                                                <p style={{ color: "rgb(5, 54, 82)", fontWeight: "500" }}>{`Reassign Reason`}</p>
                                                <textarea type="text" className="form-control" value={this.state.reassignReason} style={{ marginTop: "-10px" }} maxLength={250} onChange={this.facReassignReason}></textarea>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="modal-footer">
                                        <div className='row'>
                                            <div className='col' style={{ paddingTop: "20px", textAlign: "end" }}>
                                                <button className='btn btn-sm text-white delUpldSubmBtn' style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.reAssignToEvl}>Submit</button>
                                                &nbsp;
                                                <button className='btn btn-sm text-white' data-dismiss="modal" style={{ backgroundColor: "#0079BF" }} onChange={this.cancelEvlReassign}>Cancel</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withTranslation()(FacilitatorReassign);