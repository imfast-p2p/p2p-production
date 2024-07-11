import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { BASEURL } from '../../assets/baseURL';
import AdminSidebar from '../AdminSidebar';
import $ from 'jquery';
import { confirmAlert } from "react-confirm-alert";
import { withTranslation } from 'react-i18next';
import { FaAngleLeft, FaExclamationCircle, FaCaretSquareRight, FaCaretSquareLeft } from 'react-icons/fa';
import dashboardIcon from '../../assets/icon_dashboard.png';
import ReactPaginate from 'react-paginate';
import openIt from '../../assets/AdminImg/openit.png';
import editRole from '../../assets/editRole.png';
import batch from '../../assets/batch.png';
import Loader from '../../Loader/Loader';
import Tooltip from "@material-ui/core/Tooltip";
import 'jquery-datetimepicker/build/jquery.datetimepicker.min.css';
import 'jquery-datetimepicker/build/jquery.datetimepicker.full.min.js';

var moreDetails;
var requestData;
var responseData;
var responseMsgData;

var renderListItems = [];
var inptPageNO = "1";

var fromDate = "";
var toDate = ""
class AuditTrails extends Component {
    constructor(props) {
        super(props)
        this.state = {
            fromdate: "",
            todate: "",
            dtoday: "",
            dfrday: "",

            inptStatus: "",
            inptPageNo: "1",

            offset: 0,
            perPage: 20,
            currentPage: 0,
            pageCount: "",

            auditTrailsList: [],
            indextotpageno: "",
            indexcurrentpageno: "",
            totalRecords: "",
            error: "",

            moreDetails: {},
            requestData: {},
            responseData: {},
            responseMsgData: {},

            showLoader: false,
        }
    }
    componentDidMount() {
        // this.adminTransactions2()
        if (sessionStorage.getItem('isLogin') == "true" && sessionStorage.getItem('status') == 'Success') {
            this.loadDate();
            // var msgdata = {
            //     "indextotpageno": "5",
            //     "indexcurrentpageno": "1",
            //     "totalrecords": "1000",

            //     "audittrailsdetails": [{
            //         "operationtype": "ACCEPT_LOAN_OFFER",
            //         "status": "1",
            //         "performedby": "bor-0000000003",
            //         "txnon": "2023-09-26 13:10:02",
            //         "auditid": "2"
            //     },
            //     {
            //         "operationtype": "RAISE_LOAN_REQUEST",
            //         "status": "1",
            //         "performedby": "bor-0000000003",
            //         "txnon": "2023-09-26 13:10:02",
            //         "auditid": "3"
            //     }
            //     ]
            // };
            // this.setState({
            //     indextotpageno: msgdata.indextotpageno,
            //     indexcurrentpageno: msgdata.indexcurrentpageno,
            //     auditTrailsList: msgdata.audittrailsdetails,
            //     totalRecords: msgdata.totalrecords
            // })

            $("#datetimepicker").datetimepicker({
                format: 'Y-m-d H:i:i',
                formatTime: 'H:i:i',
                formatDate: 'Y-m-d',
                step: 30
            })
            $("#datetimepicker").on('change', this.fromdate);
            $("#datetimepicker2").datetimepicker({
                format: 'Y-m-d H:i:i',
                formatTime: 'H:i:i',
                formatDate: 'Y-m-d',
                step: 30
            })
            $("#datetimepicker2").on('change', this.todate);

            // Add an event listener for the popstate event
            window.addEventListener('popstate', this.handlePopstate);
            // Manipulate the history to stay on the same page
            window.history.pushState(null, null, window.location.pathname);

            window.addEventListener('scroll', this.handleScroll);
        } else {
            window.location = '/login'
        }
    }
    componentWillUnmount() {
        // Clean up the event listener when the component is unmounted
        window.removeEventListener('popstate', this.handlePopstate);

        // window.removeEventListener('scroll', this.handleScroll);
    }
    // handleScroll = () => {
    //     const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    //     const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
    //     const clientHeight = document.documentElement.clientHeight || window.innerHeight;

    //     if (scrollTop === 0) {
    //         // Reached the top
    //         console.log('Reached the top! Call API for more data.');
    //         this.fetchData();
    //     } else if (scrollTop + clientHeight === scrollHeight) {
    //         // Reached the bottom
    //         console.log('Reached the bottom! Call API for more data.');
    //         this.fetchData();
    //     }
    // };
    // fetchData = async () => {
    //     // Your API call logic here
    //     // Example: Replace with your actual API endpoint and logic
    //     try {
    //         this.auditTrails()
    //     } catch (error) {
    //         console.error('Error fetching data:', error);
    //     } finally {
    //     }
    // };
    handlePopstate = (event) => {
        // Prevent the default behavior of the back button
        event.preventDefault();
        // Manipulate the history to stay on the same page
        window.history.pushState(null, null, window.location.pathname);
    };
    perPage = (event) => {
        this.setState({ perPage: event.target.value })
        this.auditTrails()
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
            auditTrailsList: slice
        })
    }
    fromdate = (event) => {
        // this.setState({ fromdate: event.target.value })
        console.log(event.target.value)
        const selectedFromDate = event.target.value;
        const selectedToDate = this.state.todate;

        if (this.isDifferenceWithinOneMonth(selectedFromDate, selectedToDate)) {
            fromDate = selectedFromDate;
            this.setState({ fromdate: selectedFromDate, error: '' });
            $("#auditTrailBtn").prop('disabled', false);
        } else {
            fromDate = selectedFromDate;
            this.setState({
                fromdate: selectedFromDate,
                error: "Date ranges should not exceed 1 month.",
            });
            $("#auditTrailBtn").prop('disabled', true);
        }
    }
    todate = (event) => {
        // this.setState({ todate: event.target.value })
        const selectedFromDate = this.state.fromdate;
        const selectedToDate = event.target.value;

        if (this.isDifferenceWithinOneMonth(selectedFromDate, selectedToDate)) {
            toDate = selectedToDate;
            this.setState({ todate: selectedToDate, error: '' });
            $("#auditTrailBtn").prop('disabled', false);
        } else {
            toDate = selectedToDate;
            this.setState({
                todate: selectedToDate,
                error: "Date ranges should not exceed 6 months.",
            });
            $("#auditTrailBtn").prop('disabled', true);

        }
    }

    isDifferenceWithinOneMonth = (fromDate, toDate) => {
        const oneMonthInMilliseconds = 30 * 24 * 60 * 60 * 1000; // Approximate

        const difference = new Date(toDate) - new Date(fromDate);

        return difference <= oneMonthInMilliseconds;
    };
    inputStatus = (e) => {
        this.setState({ inptStatus: e.target.value })
    }
    handleLeftArrowClick = () => {
        // Ensure inptPageNo doesn't go below 0
        if (this.state.inptPageNo > 0) {
            this.setState(prevState => ({
                inptPageNo: parseInt(prevState.inptPageNo, 10) - 1
            }), () => {
                console.log(this.state.inptPageNo);
                inptPageNO = this.state.inptPageNo;
                this.auditTrails();
            });
        }
    }

    handleRightArrowClick = () => {
        this.setState(prevState => ({
            inptPageNo: parseInt(prevState.inptPageNo, 10) + 1
        }), () => {
            console.log(this.state.inptPageNo);
            inptPageNO = this.state.inptPageNo;
            this.auditTrails();
        });
    }

    loadDate = () => {
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();
        var frday;

        var hours = String(today.getHours()).padStart(2, '0');
        var minutes = String(today.getMinutes()).padStart(2, '0');
        var seconds = String(today.getSeconds()).padStart(2, '0');

        today = yyyy + '-' + mm + '-' + dd + ' ' + hours + ':' + minutes + ':' + seconds;
        // Set the date to the first day of the month
        var firstDay = new Date(yyyy, mm - 1, 1);

        var frdd = String(firstDay.getDate()).padStart(2, '0');
        var frmm = String(firstDay.getMonth() + 1).padStart(2, '0');
        var fryyyy = firstDay.getFullYear();

        frday = fryyyy + '-' + frmm + '-' + frdd + ' ' + hours + ':' + minutes + ':' + seconds;
        this.setState({ dtoday: today });
        this.setState({ todate: today })
        this.setState({ dfrday: frday });
        this.setState({ fromdate: frday })
        fromDate = frday;
        toDate = today;
        console.log(fromDate, toDate)

        this.auditTrails()
    }
    auditTrails = () => {
        // var today = new Date();
        // var dd = String(today.getDate()).padStart(2, '0');
        // var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        // var yyyy = today.getFullYear();
        // var frday;

        // var hours = String(today.getHours()).padStart(2, '0');
        // var minutes = String(today.getMinutes()).padStart(2, '0');
        // var seconds = String(today.getSeconds()).padStart(2, '0');

        // today = yyyy + '-' + mm + '-' + dd + ' ' + hours + ':' + minutes + ':' + seconds;
        // // Set the date to the first day of the month
        // var firstDay = new Date(yyyy, mm - 1, 1);

        // var frdd = String(firstDay.getDate()).padStart(2, '0');
        // var frmm = String(firstDay.getMonth() + 1).padStart(2, '0');
        // var fryyyy = firstDay.getFullYear();

        // frday = fryyyy + '-' + frmm + '-' + frdd + ' ' + hours + ':' + minutes + ':' + seconds;
        // this.setState({ dtoday: today });
        // this.setState({ todate: today })
        // this.setState({ dfrday: frday });
        // this.setState({ fromdate: frday })
        console.log(fromDate, toDate)

        var withoutStatus = JSON.stringify({
            fromdate: fromDate,
            todate: toDate,
            indexpageno: inptPageNO
        })
        var withStatus = JSON.stringify({
            fromdate: fromDate,
            todate: toDate,
            status: this.state.inptStatus,
            indexpageno: inptPageNO
        })
        var Result;
        if (this.state.inptStatus == "" || null) {
            Result = withoutStatus;
        } else {
            Result = withStatus;
        }
        this.setState({ showLoader: true })
        fetch(BASEURL + '/usrmgmt/getallaudittrails', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: Result
        }).then(response => {
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata)
                if (resdata.status.toLowerCase() === ('success')) {
                    console.log(resdata);

                    this.setState({
                        indextotpageno: resdata.msgdata.totalpageno,
                        indexcurrentpageno: resdata.msgdata.currentpageno,
                        auditTrailsList: resdata.msgdata.audittrailsdetails,
                        totalRecords: resdata.msgdata.totalrecords
                    })
                    var data = resdata.msgdata.audittrailsdetails
                    console.log(data)
                    var slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
                    console.log(slice)

                    this.setState({
                        pageCount: Math.ceil(data.length / this.state.perPage),
                        orgtableData: data,
                        auditTrailsList: slice
                    })
                    this.setState({ showLoader: false })
                    // this.setState((prevState) => ({ auditTrailsList: [...prevState.auditTrailsList, ...data] }));

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
    viewMoreDetails = (auditid) => {
        // moreDetails = {
        //     "operationtype": "ACCEPT_LOAN_OFFER",
        //     "status": "1",
        //     "performedby": "bor-0000000003",
        //     "txnon": "2023-09-01",
        //     "auditid": "2",
        //     "requestdata": {
        //         "loanreqno": "R0000000861",
        //         "loanofferid": "1672643005977",
        //         "emailotp": "519125",
        //         "mobileotp": "821367",
        //         "otpref": "614663"
        //     },
        //     "responsedata": {
        //         "code": "0000",
        //         "msgdata": {
        //             "loanofferid": "1672643005977",
        //             "loanreqno": "R0000000861"
        //         },
        //         "message": "Accept loan offer request raised successfully.",
        //         "status": "SUCCESS"

        //     }
        // }

        // requestData = moreDetails.requestdata;
        // responseData = moreDetails.responsedata;
        // responseMsgData = responseData.msgdata;
        // this.setState({
        //     moreDetails: moreDetails,
        //     requestData: requestData,
        //     responseData: responseData,
        //     responseMsgData: responseMsgData
        // })

        // $("#viewMoremodal").click()
        fetch(BASEURL + '/usrmgmt/getaudittrailinfo?auditid=' + auditid, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
        }).then(response => {
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata)
                if (resdata.status == "Success") {
                    console.log(resdata);

                    requestData = resdata.msgdata.requestdata;
                    responseData = resdata.msgdata.responsedata;
                    responseMsgData = responseData.msgdata;
                    this.setState({
                        moreDetails: resdata.msgdata,
                        requestData: requestData,
                        responseData: responseData,
                        responseMsgData: responseMsgData
                    })
                    $("#viewMoremodal").click()
                    console.log(requestData,
                        responseData,
                        responseMsgData)

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
    handleChange() {
        $('.text').toggle();
        $("#Pinfo").toggle();
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

        var RequestData = () => (
            <div>
                {Object.keys(this.state.requestData).map((key) => (
                    <div className='row' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }} key={key}>
                        <div className='col-sm-5 col-md-5 col-lg-3'>
                            <p className="mb-0 font-weight-bold" style={{ width: "max-content" }}>
                                {
                                    key === "usertype" ? "User Type" :
                                        key === "utype" ? "User Type" :
                                            key === "userid" ? "User ID" :
                                                key === "lenderid" ? "Lender ID" :
                                                    key === "todate" ? "To Date" :
                                                        key === "indexpageno" ? "Index Page No." :
                                                            key === "fromdate" ? "From Date" :
                                                                key === "memmid" ? "Member ID" :
                                                                    key === "userpassword" ? "User Password" :
                                                                        key === "username" ? "User Name" : key
                                }</p>
                        </div>
                        <div className='col-sm-1 col-md-1 col-lg-1'>
                            <p className="mb-0 font-weight-bold">:</p>
                        </div>
                        <div className='col-sm-6 col-md-6 col-lg-8'>
                            <p className="mb-0" style={{ wordWrap: 'break-word' }}>{this.state.requestData[key]}</p>
                        </div>
                    </div>
                ))}
            </div>
        );
        var ResponseData = () => (
            <div>
                {
                    Object.keys(this.state.responseData).map((key) => {
                        const keydata = this.state.responseData[key];
                        return (key === 'accessToken' || keydata?.memmid || keydata?.data?.otpref) ? (
                            <div className='row' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }} key={key}>
                                <div className='col-sm-5 col-md-5 col-lg-3'>
                                    <p className="mb-0 font-weight-bold" style={{ width: "max-content" }}>
                                        {(key === "userName" ? "User Name" :
                                            key === "lastlogintime" ? "{t('Last Login Time')}" :
                                                key === "accessToken" ? "Access Token" :
                                                    key === "refreshToken" ? "Refresh Token" :
                                                        key.charAt(0).toUpperCase() + key.slice(1)) + ": "}
                                    </p>
                                </div>
                                <div className='col-sm-7 col-md-7 col-lg-9'>
                                    {Array.isArray(this.state.responseData[key]) ?
                                        this.state.responseData[key].map((item, index) => (
                                            <span key={index}>
                                                {item}{index < this.state.responseData[key].length - 1 ? ', ' : ''}
                                            </span>
                                        )) :
                                        typeof this.state.responseData[key] === 'object' && this.state.responseData[key] !== null ?
                                            <pre>{JSON.stringify(this.state.responseData[key], null, 2)}</pre> :
                                            <span>{this.state.responseData[key]}</span>}
                                </div>
                            </div>
                        ) : (
                            <div className='row' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }} key={key}>
                                <div className='col-sm-5 col-md-5 col-lg-3'>
                                    <p className="mb-0 font-weight-bold" style={{ width: "max-content" }}>
                                        {(key === "msg" || key === "message") ? "Message" :
                                            key === "statusCode" ? "Status Code" :
                                                key === "status" ? "Status" :
                                                    key}</p>
                                </div>
                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                    <p className="mb-0 font-weight-bold">:</p>
                                </div>
                                <div className='col-sm-6 col-md-6 col-lg-8'>
                                    {typeof this.state.responseData[key] === 'object' ? (
                                        Object.keys(this.state.responseData[key]).map((subKey) => (
                                            <div key={subKey}>
                                                <p className="mb-0 font-weight-bold">{subKey}</p>
                                                {Array.isArray(this.state.responseData[key][subKey]) ? (
                                                    this.state.responseData[key][subKey].map((item, index) => (
                                                        <div key={index} style={{ marginLeft: '20px' }}>
                                                            <p className="mb-0 font-weight-bold">{item.attributename}</p>
                                                            {item.attributeoptions.map((option, idx) => (
                                                                <div key={idx} style={{ marginLeft: '20px' }}>
                                                                    <p className="mb-0"><strong>Consent Data:</strong> {option.consentdata}</p>
                                                                    <p className="mb-0"><strong>Consent ID:</strong> {option.consentid}</p>
                                                                    <p className="mb-0"><strong>Status:</strong> {option.status}</p>
                                                                    <p className="mb-0"><strong>Consent Type:</strong> {option.consenttype}</p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="mb-0" style={{ wordWrap: 'break-word' }}>
                                                        {key === "status" ? this.state.responseData[key].toString() : this.state.responseData[key]}
                                                    </p>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <p className="mb-0" style={{ wordWrap: 'break-word' }}>
                                            {key === "status" ? this.state.responseData[key].toString() : this.state.responseData[key]}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        );

        return (
            <div className="container-dashboard d-flex flex-row" id="wrapper" style={{ backgroundColor: "#f4f7fc" }}>
                <AdminSidebar />
                <div className="main-content" id="page-content-wrapper">
                    <div className="container-fluid row pt-2">
                        <div className="col-1" id="BnavRes1">
                            <button style={{ marginLeft: "25px" }} onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className='col-4' id="BnavRes2" style={{ marginLeft: "20px", marginTop: "5px" }}>
                            <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                <Link to="/landing">Home</Link> / Audit Trail List</p>
                        </div>
                        <div className='col'>

                        </div>
                        <div className='col'>

                        </div>
                        <div className='col-3'>

                        </div>
                        <div className="col" id="BnavRes3">
                            <button style={myStyle}>
                                <Link to="/landing"><FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} /><span style={{ textDecoration: "none", color: "white" }}>Back</span></Link></button>
                        </div>
                    </div>
                    <hr className="col-11" style={{ marginLeft: "50px", width: "88.6%", backgroundColor: "rgba(4,78,160,1)", marginTop: "0px" }} />
                    <div className='row ' style={{ marginTop: "-10px" }}>
                        <div className="col">
                            <p className="d-flex justify-content-center" style={{ fontSize: "20px", fontWeight: "bold", color: "rgba(5,54,82,1)" }}>{t('Audit Trail List')}</p>
                        </div>
                    </div>

                    {/* New Design */}
                    {/* Select Date */}
                    <div className='row' style={{ paddingLeft: "50px", marginTop: "-15px" }}>
                        <div className='col-lg-2 col-md-3 col-sm-4 col-6 Fdate'>
                            <p htmlFor="date" style={{
                                fontWeight: "600",
                                fontSize: "13px", marginLeft: "0px", color: "rgba(5,54,82,1)",
                                marginBottom: "5px"
                            }}>{t('From Date*')}</p>

                            <input className="form-control"
                                id="datetimepicker" defaultValue={this.state.dfrday}
                                onChange={this.fromdate}
                                style={{
                                    border: "1px solid rgba(40,116,166,1)",
                                    borderRadius: "5px",
                                    height: "34px",
                                    fontSize: "15px",
                                    color: "rgba(40,116,166,1)",
                                    paddingLeft: "10px",
                                    width: "160px",
                                }} />
                        </div>
                        &nbsp;
                        <div className='col-lg-2 col-md-3 col-sm-4 col-6 Fdate' style={{ fontSize: "15px" }}>
                            <p htmlFor="date" style={{
                                fontWeight: "600",
                                fontSize: "13px", marginLeft: "0px", color: "rgba(5,54,82,1)",
                                marginBottom: "5px"
                            }}>{t('To Date*')}</p>

                            <input className="form-control"
                                id="datetimepicker2" defaultValue={this.state.dtoday}
                                onChange={this.todate}
                                style={{
                                    border: "1px solid rgba(40,116,166,1)",
                                    borderRadius: "5px",
                                    height: "34px",
                                    fontSize: "15px",
                                    color: "rgba(40,116,166,1)",
                                    paddingLeft: "10px",
                                    width: "160px",
                                }} />
                        </div>
                        <div className='col-lg-3 col-md-3 col-sm-4 col-6 Fdate' style={{ fontSize: "15px" }}>
                            <p htmlFor="date" style={{
                                fontWeight: "600",
                                fontSize: "13px", marginLeft: "0px", color: "rgba(5,54,82,1)",
                                marginBottom: "5px",
                            }}
                            >{t('Status')}</p>
                            <select className='form-select' style={{ height: "34px", border: "1px solid rgb(40, 116, 166)", color: "rgb(40, 116, 166)" }} onChange={this.inputStatus}>
                                <option defaultValue>Select</option>
                                <option value="1">Success</option>
                                <option value="0">Failure</option>
                            </select>
                        </div>
                        {/* <div className='col-lg-2 col-md-2 col-sm-2 col-6 Fdate' style={{ fontSize: "15px" }}>
                            <p style={{
                                fontWeight: "600",
                                fontSize: "13px", marginLeft: "0px", color: "rgba(5,54,82,1)",
                                marginBottom: "5px"
                            }}>{t('Index Page Number')}</p>
                            <FaCaretSquareLeft id='squareLeft' onClick={this.handleLeftArrowClick} />
                            &nbsp;
                            <span style={{ color: "rgb(40, 116, 166)" }}>{this.state.inptPageNo}</span>
                            &nbsp;
                            <FaCaretSquareRight id='squareRight' onClick={this.handleRightArrowClick} />
                        </div> */}
                        <div className="col-lg-2 col-md-3 col-sm-4 col-6 Fdate" style={{ paddingTop: '23px' }}>
                            <button type="button" className="btn btn-sm text-white" style={{
                                backgroundColor: "rgb(0, 121, 191)",
                                paddingTop: "6px", paddingBottom: "6px",
                                paddingLeft: "47px", paddingRight: "47px"
                            }}
                                id='auditTrailBtn'
                                onClick={this.auditTrails}>{t('Apply')}</button>
                        </div>
                    </div>
                    {this.state.error &&
                        <div className="row" style={{ paddingLeft: "50px" }}>
                            <div className="col">
                                <p style={{ fontSize: "14px", marginLeft: "0px", color: 'red' }}><FaExclamationCircle />{this.state.error}</p>
                            </div>
                        </div>
                    }
                    {this.state.auditTrailsList == "" ?
                        <div className="row mt-2" style={{ marginLeft: "6px" }}>
                            <div className="col" style={{ textAlign: "center", color: "#222C70", fontSize: "14px", fontWeight: "500" }}>
                                <p>No audit trails available.</p>
                            </div>
                        </div> :
                        <>
                            <div class="d-flex flex-wrap align-items-center" style={{ marginLeft: "50px", fontWeight: "600", fontSize: "14px", color: "rgba(5,54,82,1)" }}>
                                <div class="pt-2 pb-3 pr-1">Show</div>
                                <div class="pt-2 pb-2">
                                    <select onChange={this.perPage}>
                                        <option defaultValue="20">20</option>
                                        <option value="30">30</option>
                                        <option value="50">50</option>
                                    </select>
                                </div>
                                <div class="pt-2 pb-3 pl-1 pr-4">Entries in a page</div>
                                {/* <div class="pt-2 pb-3 pr-1 pl-4">Total Page Number: <span style={{ fontWeight: "400" }}>{this.state.indextotpageno}</span></div> */}
                                <div class="pt-2 pb-3 pr-1 pr-4">Current Page Number: <span style={{ fontWeight: "400" }}>{this.state.indexcurrentpageno}</span></div>
                                <div class="pt-2 pb-3 pr-1">Total Records: <span style={{ fontWeight: "400" }}>{this.state.totalRecords}</span></div>
                            </div>

                            <div className='scrollbar' id="auditScroll" scroll={true}>
                                <div style={{
                                    whiteSpace: "nowrap"
                                }} id='secondAuditScroll'>
                                    <div className='row pl-4 font-weight-normal'
                                        style={{
                                            marginLeft: "35px",
                                            fontWeight: "800",
                                            fontSize: "15px",
                                            color: "rgba(5,54,82,1)",
                                        }}>
                                        <div className='col-2'>
                                            <p style={{ marginLeft: "-15px", fontWeight: "600" }}>{t('Operation Type')}</p>
                                        </div>
                                        <div className='col-3'>
                                            <p style={{ marginLeft: "50px", fontWeight: "600" }}>{t('Performed By')}</p>
                                        </div>
                                        <div className='col-3'>
                                            <p style={{ fontWeight: "600" }}>{t('Transaction On')}</p>
                                        </div>
                                        <div className='col-2'>
                                            <p style={{ fontWeight: "600", marginLeft: "-14px" }}>{t('Status')}</p>
                                        </div>
                                        <div className='col-2'>
                                            <FaCaretSquareLeft id='squareLeft' onClick={this.handleLeftArrowClick} />
                                            &nbsp;
                                            <span style={{ color: "rgb(40, 116, 166)" }}>{this.state.inptPageNo}</span>
                                            &nbsp;
                                            <FaCaretSquareRight id='squareRight' onClick={this.handleRightArrowClick} />
                                        </div>
                                    </div>
                                    <hr className="col-11" style={{ marginLeft: "50px", width: "88.6%", marginTop: "-7px", backgroundColor: "rgba(4,78,160,1)" }} />

                                    {/* Lists */}
                                    <div className="scrollbar" style={{
                                        height: 400, overflowY: 'auto',
                                        marginTop: "-16px"
                                    }}>
                                        {
                                            this.state.auditTrailsList.map((lists, index) => {
                                                return (
                                                    <div className='col' key={index}>
                                                        <div className='card border-0' style={{ marginBottom: "-15.7px", transition: 'none', overflow: "visible", color: "rgb(5, 54, 82)", cursor: 'default', width: "95%", marginLeft: "30px", backgroundColor: (index % 2 == 0) ? 'rgba(255,255,255,1)' : 'rgba(242,242,242,1)' }}>
                                                            <div className="row item-list align-items-center">
                                                                <div className="col">
                                                                    {lists.operationtype.length > 17 ? (
                                                                        <Tooltip title={lists.operationtype}>
                                                                            <p className="p-0" style={{ fontSize: "15px", fontWeight: "490", marginBottom: "-3px", marginLeft: "10px" }}>
                                                                                {lists.operationtype.substring(0, 18) + ".."}
                                                                            </p>
                                                                        </Tooltip>
                                                                    ) : (
                                                                        <p className="p-0" style={{ fontSize: "15px", fontWeight: "490", marginBottom: "-3px", marginLeft: "10px" }}>
                                                                            {lists.operationtype}
                                                                        </p>
                                                                    )}
                                                                </div >
                                                                <div className="col">
                                                                    <p style={{ fontSize: "15px", fontWeight: "490", marginLeft: "22px", marginBottom: "-3px" }}>{lists.performedby}</p>
                                                                </div >
                                                                <div className="col">
                                                                    <p style={{ fontSize: "15px", fontWeight: "490", marginBottom: "-3px", marginLeft: "-2px" }}>{lists.txnon}</p>
                                                                </div>
                                                                <div className="col">
                                                                    {lists.status == "1" ? (
                                                                        <p className="" style={{ fontSize: "15px", fontWeight: "500", marginBottom: "-3px", marginLeft: "5px", color: "rgb(23, 173, 58)" }}>Success</p>
                                                                    ) : lists.status == "0" ? (
                                                                        <p className="" style={{ fontSize: "15px", fontWeight: "500", marginBottom: "-3px", marginLeft: "5px", color: "rgb(255,165,0)" }}>Failure</p>
                                                                    ) : (
                                                                        <p className="" style={{ fontSize: "15px", fontWeight: "500", marginBottom: "-3px", marginLeft: "5px" }}></p>
                                                                    )}
                                                                </div>
                                                                <div className="col-1">
                                                                    {/* <p class="dropup">
                                                                        <img src={openIt} style={{ height: "35px", marginBottom: "-10px" }}
                                                                            class="btn dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" />
                                                                        &nbsp;
                                                                        <div class="dropdown-menu" aria-labelledby="dropdownMenuButton" style={{ marginLeft: "-114px" }}>
                                                                            <a class="dropdown-item" onClick={this.viewMoreDetails.bind(this, lists.auditid)}>More Details</a>
                                                                        </div>
                                                                    </p> */}
                                                                    <p class="btn-group dropleft">
                                                                        <img src={openIt} style={{ height: "35px", marginBottom: "-10px" }}
                                                                            class="btn dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" />
                                                                        &nbsp;
                                                                        <div class="dropdown-menu" aria-labelledby="dropdownMenuButton" style={{ marginLeft: "-114px" }}>
                                                                            <a class="dropdown-item" onClick={this.viewMoreDetails.bind(this, lists.auditid)}>More Details</a>
                                                                        </div>
                                                                    </p>
                                                                </div>
                                                            </div >
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                    &nbsp;
                                    <div className="row float-right mr-4">
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

                        </>}
                    {/* View More Modal */}
                    <button type="button" id='viewMoremodal' style={{ display: "none" }} class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter1">
                        View More modal
                    </button>
                    <div class="modal fade" id="exampleModalCenter1" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered" role="document">
                            <div class="modal-content">
                                <div class="modal-body">
                                    <div className='row'>
                                        <div className='col'>
                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold" }}><img src={batch} width="25px" />More Details</p>
                                            <hr style={{ width: "50px", marginTop: "-10px", backgroundColor: "rgb(0, 121, 191)" }} />

                                            <div className='row' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                <div className='col-sm-5 col-md-4 col-lg-3'>
                                                    <p className="mb-0 font-weight-bold" style={{ width: "max-content" }}>Operation Type</p>
                                                </div>
                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                    <p className="mb-0 font-weight-bold">:</p>
                                                </div>
                                                <div className='col-sm-6 col-md-6 col-lg-8'>
                                                    <p className="mb-0" style={{ wordWrap: 'break-word' }}>{this.state.moreDetails.operationtype}</p>
                                                </div>
                                            </div>
                                            <div className='row' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                <div className='col-sm-5 col-md-4 col-lg-3'>
                                                    <p className="mb-0 font-weight-bold" style={{ width: "max-content" }}>Performed By</p>
                                                </div>
                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                    <p className="mb-0 font-weight-bold">:</p>
                                                </div>
                                                <div className='col-sm-6 col-md-6 col-lg-8'>
                                                    <p className="mb-0" style={{ wordWrap: 'break-word' }}>{this.state.moreDetails.performedby}</p>
                                                </div>
                                            </div>
                                            <div className='row' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                <div className='col-sm-5 col-md-4 col-lg-3'>
                                                    <p className="mb-0 font-weight-bold" style={{ width: "max-content" }}>Transaction On</p>
                                                </div>
                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                    <p className="mb-0 font-weight-bold">:</p>
                                                </div>
                                                <div className='col-sm-6 col-md-6 col-lg-8'>
                                                    <p className="mb-0" style={{ wordWrap: 'break-word' }}>{this.state.moreDetails.txnon}</p>
                                                </div>
                                            </div>
                                            <div className='row' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                <div className='col-sm-5 col-md-4 col-lg-3'>
                                                    <p className="mb-0 font-weight-bold" style={{ width: "max-content" }}>Audit Trail ID</p>
                                                </div>
                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                    <p className="mb-0 font-weight-bold">:</p>
                                                </div>
                                                <div className='col-sm-6 col-md-6 col-lg-8'>
                                                    <p className="mb-0" style={{ wordWrap: 'break-word' }}>{this.state.moreDetails.auditid}</p>
                                                </div>
                                            </div>
                                            <div className='row' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                <div className='col-sm-5 col-md-4 col-lg-3'>
                                                    <p className="mb-0 font-weight-bold" style={{ width: "max-content" }}>Status</p>
                                                </div>
                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                    <p className="mb-0 font-weight-bold">:</p>
                                                </div>
                                                <div className='col-sm-6 col-md-6 col-lg-8'>
                                                    {this.state.moreDetails.status == "1" ? (
                                                        <p className="" style={{ wordWrap: 'break-word', color: "rgb(23, 173, 58)" }}>Success</p>
                                                    ) : this.state.moreDetails.status == "0" ? (
                                                        <p className="" style={{ wordWrap: 'break-word', color: "rgb(255,165,0)" }}>Failure</p>
                                                    ) : (
                                                        <p className="" style={{ wordWrap: 'break-word' }}></p>
                                                    )}
                                                </div>
                                            </div>
                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold", marginBottom: "0px", textDecoration: "underline" }}>Request Data</p>
                                            <RequestData />

                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold", marginBottom: "0px", textDecoration: "underline" }}>Response Data</p>
                                            <ResponseData />
                                            <hr style={{ backgroundColor: "rgba(5,54,82,1)" }} />
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col' style={{ textAlign: "center" }}>
                                            <button type="button" id='okSubmit' class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "rgb(136, 189, 72)" }}>Close</button>
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

export default withTranslation()(AuditTrails)
