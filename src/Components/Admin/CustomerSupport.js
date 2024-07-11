import React, { Component } from 'react';
import { BASEURL } from '../assets/baseURL';
import AdminSidebar from './AdminSidebar';
import $, { event } from 'jquery';
import './CustomerSupport.css';
import date from '../assets/date&time.png';
import request from '../assets/requestno.png';
import issue from '../assets/Issuetype.png';
import discription from '../assets/discription.png';
import { withTranslation } from 'react-i18next';
import * as FaIcons from "react-icons/fa";
import { Link } from 'react-router-dom';
import { FaAngleLeft, FaFileUpload } from 'react-icons/fa';
import dashboardIcon from '../assets/icon_dashboard.png';

import totalTick from '../assets/AdminImg/totTick.png';
import openTick from '../assets/AdminImg/openTick.png';
import openit from '../assets/AdminImg/openit.png';

import ReactPaginate from 'react-paginate';
import '../Borrower/Pagination.css'
import { confirmAlert } from "react-confirm-alert";

export class CustomerSupport extends Component {


    constructor(props) {
        super(props)

        this.state = {
            fromdate: "2021-11-20",
            todate: "2021-12-27",
            issuestatus: "",
            supportTcktList: [],
            dtoday: "",
            dfrday: "",
            allTckts: [],

            offset: 0,
            perPage: 5,
            currentPage: 0,
            pageCount: "",

        }
        this.fromdate = this.fromdate.bind(this);
        this.todate = this.todate.bind(this);
        this.issuestatus = this.issuestatus.bind(this);
        this.supportTickets = this.supportTickets.bind(this);


    }

    componentDidMount() {
        this.loadDate();
        this.ticketStatistics();
    }

    fromdate(event) {
        this.setState({ fromdate: event.target.value })
    }
    todate(event) {
        this.setState({ todate: event.target.value })
    }
    issuestatus(event) {
        this.setState({ issuestatus: event.target.value })
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
            supportTcktList: slice
        })
    }

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
    }

    ticketStatistics(event) {
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
        fetch(BASEURL + '/grievance/getsupporttickets', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                fromdate: frday,
                todate: today,
                issuestatus: "3"
            })
        }).then(response => {
            console.log('Response:', response)
            return response.json();
        })
            .then((resdata) => {
                if (resdata.status == 'Success' || 'SUCCESS') {
                    this.setState({ supportTcktList: resdata.msgdata })

                    var data = resdata.msgdata
                    console.log(data)
                    if (data) {
                        var slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
                        console.log(slice)
                        this.setState({
                            pageCount: Math.ceil(data.length / this.state.perPage),
                            orgtableData: data,
                            supportTcktList: slice
                        })
                    }
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
                                        // window.location.reload();
                                    },
                                },
                            ],
                        });
                    }
                }
            })
    }
    supportTickets(event) {
        fetch(BASEURL + '/grievance/getsupporttickets', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                fromdate: this.state.fromdate,
                todate: this.state.todate,
                issuestatus: this.state.issuestatus
            })
        }).then(response => {
            console.log('Response:', response)
            return response.json();
        })
            .then((resdata) => {
                if (resdata.status == 'Success') {
                    this.setState({ supportTcktList: resdata.msgdata })
                    var data = resdata.msgdata
                    console.log(data)
                    var slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
                    console.log(slice)

                    this.setState({
                        pageCount: Math.ceil(data.length / this.state.perPage),
                        orgtableData: data,
                        supportTcktList: slice
                    })

                } else {
                    alert("Issue: " + resdata.message);
                }
            })
    }

    supportTcktDetails(issuedesc, issuetype, mobilenumber, raisedon, sladuration, reqno, lastupdated, raisedby) {
        console.log(issuedesc);
        console.log(issuetype);
        console.log(mobilenumber);
        console.log(raisedon);
        console.log(sladuration);
        console.log(reqno);
        sessionStorage.setItem("issuedesc", issuedesc);
        sessionStorage.setItem("issuetype", issuetype);
        sessionStorage.setItem("mobilenumber", mobilenumber);
        sessionStorage.setItem("raisedon", raisedon);
        sessionStorage.setItem("sladuration", sladuration);
        sessionStorage.setItem("reqno", reqno);
        sessionStorage.setItem("lastupdated", lastupdated)
        sessionStorage.setItem("raisedby", raisedby)
        window.location = "/supportTcktDetails";

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
        return (
            <div className="container-dashboard d-flex flex-row" id="wrapper" style={{ backgroundColor: "#f4f7fc" }}>
                <AdminSidebar />
                <div className="main-content" id="page-content-wrapper">
                    <div className="container-fluid row pt-2">
                        <div className="col-1">
                            <button style={{ marginLeft: "25px" }} onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className='col-4' style={{ marginLeft: "20px", marginTop: "5px" }}>
                            <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                <Link to="/landing">Home</Link> / Customer Support</p>
                        </div>
                        <div className='col'>

                        </div>
                        <div className='col'>

                        </div>
                        <div className='col-3'>

                        </div>
                        <div className="col">
                            <button style={myStyle}>
                                <Link to="/landing"><FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} /><span style={{ textDecoration: "none", color: "white" }}>Back</span></Link></button>
                        </div>
                    </div>
                    <hr className="col-11" style={{ marginLeft: "50px", width: "88.6%", backgroundColor: "rgba(4,78,160,1)", marginTop: "0px" }} />
                    {/* New Design */}
                    <div className='row'>
                        <div className='col' style={{ paddingLeft: "6%" }}>
                            <p style={{ color: "#0079BF", fontFamily: "Poppins,sans-serif", fontWeight: "500", fontSize: "15px" }}>Ticket Statistics</p>
                        </div>
                    </div>
                    <div className='row' style={{ marginLeft: "34px", width: "94.5%", marginTop: "-20px" }}>
                        <div className='col-sm-3' >
                            <div className='card' id='BcardChange1' style={{
                                cursor: "default",
                                borderLeft: "4px solid #0079bf",
                                borderTop: "1.5px solid #0079bf", borderRight: "1.5px solid #0079bf", borderBottom: "1.5px solid #0079bf"
                            }}>
                                <div className='row' style={{ padding: "10px", color: "#0079BF", fontFamily: "Poppins,sans-serif", fontWeight: "600", fontSize: "15px" }}>
                                    <div className='col'>
                                        <p>No. Of Raised</p>
                                        <hr style={{ marginTop: "-10px", width: "20%" }} />
                                        <div className='row'>
                                            <div className='col-6' style={{ paddingLeft: "26px" }}>
                                                <img src={totalTick} style={{ width: "20px" }} />
                                            </div>
                                            <div className='col-6'>
                                                <p>{this.state.supportTcktList && this.state.supportTcktList.length}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='col-sm-3' >
                            <div className='card' id='BcardChange2' style={{
                                cursor: "default",
                                borderLeft: "4px solid #0079bf",
                                borderTop: "1.5px solid #0079bf", borderRight: "1.5px solid #0079bf", borderBottom: "1.5px solid #0079bf"
                            }}>
                                <div className='row' style={{ padding: "10px", color: "#0079BF", fontFamily: "Poppins,sans-serif", fontWeight: "600", fontSize: "15px" }}>
                                    <div className='col'>
                                        <p>Open</p>
                                        <hr style={{ marginTop: "-10px", width: "20%" }} />
                                        <div className='row'>
                                            <div className='col-6' style={{ paddingLeft: "25px" }}>
                                                <img src={openTick} style={{ width: "30px" }} />
                                            </div>
                                            <div className='col-6'>
                                                <p>{this.state.supportTcktList && this.state.supportTcktList.filter((tickets) => tickets.issuestatus == 0).length}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div></div>
                        </div>
                        <div className='col-sm-3' >
                            <div className='card' id='BcardChange3' style={{
                                cursor: "default",
                                borderLeft: "4px solid #0079bf",
                                borderTop: "1.5px solid #0079bf", borderRight: "1.5px solid #0079bf", borderBottom: "1.5px solid #0079bf"
                            }}>
                                <div className='row' style={{ padding: "10px", color: "#0079BF", fontFamily: "Poppins,sans-serif", fontWeight: "600", fontSize: "15px" }}>
                                    <div className='col'>
                                        <p>Closed</p>
                                        <hr style={{ marginTop: "-10px", width: "20%" }} />
                                        <div className='row'>
                                            <div className='col-6' style={{ paddingLeft: "25px" }}>
                                                <img src={openTick} style={{ width: "30px" }} />
                                            </div>
                                            <div className='col-6'>
                                                <p>{this.state.supportTcktList && this.state.supportTcktList.filter((tickets) => tickets.issuestatus == 2).length}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='col-sm-3' >
                            <div className='card' id='BcardChange4' style={{
                                cursor: "default",
                                borderLeft: "4px solid #0079bf",
                                borderTop: "1.5px solid #0079bf", borderRight: "1.5px solid #0079bf", borderBottom: "1.5px solid #0079bf"
                            }}>
                                <div className='row' style={{ padding: "10px", color: "#0079BF", fontFamily: "Poppins,sans-serif", fontWeight: "600", fontSize: "15px" }}>
                                    <div className='col'>
                                        <p style={{}}>InProcessing</p>
                                        <hr style={{ marginTop: "-10px", width: "20%" }} />
                                        <div className='row'>
                                            <div className='col-6' style={{ paddingLeft: "25px" }}>
                                                <img src={openTick} style={{ width: "30px" }} />
                                            </div>
                                            <div className='col-6'>
                                                <p>{this.state.supportTcktList && this.state.supportTcktList.filter((tickets) => tickets.issuestatus == 1).length}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='row' style={{ marginLeft: "34px", width: "94.5%", marginTop: "-20px" }}>
                        <div className='col'>
                            <div className='card'>
                                <div className='row' style={{ padding: "10px" }}>
                                    <div className='col-3'>
                                        <p htmlFor="date" style={{
                                            fontWeight: "600",
                                            fontSize: "13px", marginLeft: "0px", color: "rgba(5,54,82,1)",
                                            marginBottom: "5px"
                                        }}>{t('From Date*')}</p>
                                        <input id="Fdate" type="date"
                                            defaultValue={this.state.dfrday} onChange={this.fromdate} style={{
                                                border: "1px solid rgba(40,116,166,1)",
                                                borderRadius: "5px",
                                                width: "240px",
                                                height: "30px",
                                                fontSize: "15px",
                                                color: "rgba(40,116,166,1)",
                                                paddingLeft: "10px"
                                            }} />
                                    </div>
                                    &nbsp;
                                    <div className='col-3' style={{ fontSize: "15px" }}>
                                        <p htmlFor="date" style={{
                                            fontWeight: "600",
                                            fontSize: "13px", marginLeft: "0px", color: "rgba(5,54,82,1)",
                                            marginBottom: "5px"
                                        }}>{t('To Date*')}</p>
                                        <input id="Tdate" type="date"
                                            defaultValue={this.state.dtoday} onChange={this.todate} style={{
                                                border: "1px solid rgba(40,116,166,1)",
                                                borderRadius: "5px",
                                                width: "240px",
                                                height: "30px",
                                                fontSize: "15px",
                                                color: "rgba(40,116,166,1)",
                                                paddingLeft: "10px"
                                            }} />
                                    </div>
                                    &nbsp;
                                    <div className="col-3" style={{ fontSize: "15px" }}>
                                        <p htmlFor="status" style={{ fontWeight: "600", fontSize: "13px" }}>{t('IssueStatus')}: </p>
                                        <select className="form-select" onChange={this.issuestatus} style={{ height: "35px", marginTop: "-16px" }}>
                                            <option defaultValue>{t('Select')}</option>
                                            <option value="0">{t('open')}</option>
                                            <option value="1">{t('processing')}</option>
                                            <option value="2">{t('closed')}</option>
                                            <option value="3">{t('Allstates')}</option>
                                        </select>
                                    </div>
                                    &nbsp;
                                    <div className="col-2" style={{ paddingTop: '21px' }}>
                                        <button type="button" className="btn btn-sm text-white" style={{
                                            backgroundColor: "rgb(0, 121, 191)",
                                            paddingLeft: "40px", paddingRight: "40px"
                                        }}
                                            onClick={this.supportTickets}>{t('Apply')}</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='row pl-4 font-weight-normal' style={{ marginLeft: "50px", fontWeight: "800", fontSize: "15px", color: "rgba(5,54,82,1)" }}>
                        <div className='col-2'>
                            <p style={{ marginLeft: "-15px", fontWeight: "600" }}>{t('Date&Time')}</p>
                        </div>
                        <div className='col-2'>
                            <p style={{ fontWeight: "600" }}>{t('RequestNumber')}</p>
                        </div>
                        <div className='col-2'>
                            <p style={{ marginLeft: "40px", fontWeight: "600" }}>{t('IssueType')}</p>
                        </div>
                        <div className='col-3'>
                            <p style={{ marginLeft: "39px", fontWeight: "600" }}>{t('IssueDescription')}</p>
                        </div>
                        <div className='col-2'>
                            <p style={{ marginLeft: "43px", fontWeight: "600" }}>{t('Status')}</p>
                        </div>
                    </div>
                    <hr className="col-11" style={{ marginLeft: "50px", width: "88.6%", marginTop: "-10px" }} />

                    {/* Lists */}

                    <div className="">
                        {
                            this.state.supportTcktList && this.state.supportTcktList.length > 0 &&
                            this.state.supportTcktList.map((tickets, index) => {
                                return (
                                    <div className='col' key={index}>
                                        <div className='card border-0' style={{ marginBottom: "-10px", transition: 'none', color: "rgb(5, 54, 82)", cursor: 'default', width: "95%", marginLeft: "30px", backgroundColor: (index % 2 == 0) ? 'rgba(255,255,255,1)' : 'rgba(242,242,242,1)' }}>
                                            <div className="row item-list align-items-center">
                                                <div className="col-3" style={{ paddingLeft: "20px" }}>
                                                    <p className="ml-4 p-0" style={{ fontSize: "15px", fontWeight: "490", marginTop: "15px" }}>{tickets.raisedon}</p>
                                                </div >
                                                <div className="col-2">
                                                    <p style={{ fontSize: "15px", fontWeight: "490", paddingTop: "12px", marginLeft: "-23px" }}>{tickets.reqno}</p>
                                                </div >
                                                <div className="col-2">
                                                    <p style={{ fontSize: "15px", fontWeight: "490", paddingTop: "12px" }}>{tickets.issuetype}</p>
                                                </div>
                                                <div className="col-3">
                                                    <p style={{ fontSize: "15px", fontWeight: "490", paddingTop: "12px", }}>{tickets.issuedesc}
                                                    </p>
                                                </div>
                                                <div className='col-1'>
                                                    {/* open=rgb(5, 133, 30) */}
                                                    {/* closed= rgb(158, 13, 8) */}
                                                    {/* processing=rgb(209, 167, 15) */}
                                                    <p style={{ fontSize: "15px", paddingTop: "12px", fontWeight: "600", width: "100px" }}>
                                                        {tickets.issuestatus == "0" ? <span style={{ color: "rgb(5, 133, 30)" }}>Open</span> : <span>{tickets.issuestatus == "1" ?
                                                            <span style={{ color: "rgb(209, 167, 15)" }}>Processing</span> : <span style={{ color: "rgb(158, 13, 8)" }}>Closed</span>}</span>}
                                                        &nbsp;
                                                    </p>

                                                </div>
                                                <div className='col-1'>
                                                    <span style={{ paddingLeft: "15px", cursor: "pointer" }} onClick={this.supportTcktDetails.bind(this, tickets.issuedesc, tickets.issuetype,
                                                        tickets.mobilenumber, tickets.raisedon, tickets.sladuration, tickets.reqno, tickets.lastupdated, tickets.raisedby)}>
                                                        <img src={openit} style={{ width: "7px" }} />
                                                    </span>
                                                </div>
                                            </div >
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div className="row mt-4 float-right mr-4">
                        <div className='card border-0'>
                            <ReactPaginate
                                previousLabel={"<"}
                                nextLabel={">"}
                                breakLabel={"..."}
                                breakClassName={"break-me"}
                                pageCount={this.state.pageCount}
                                // marginPagesDisplayed={1}
                                // pageRangeDisplayed={5}
                                onPageChange={this.handlePageClick}
                                containerClassName={"pagination"}
                                subContainerClassName={"pages pagination"}
                                activeClassName={"active"}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withTranslation()(CustomerSupport)
