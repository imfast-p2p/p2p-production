import React, { Component } from 'react';
import { BASEURL } from '../../assets/baseURL';
import SystemUserSidebar from '../SystemUserSidebar';
import $, { event } from 'jquery';
import './SysCustomerSupport.css';
import { withTranslation } from 'react-i18next';
import * as FaIcons from "react-icons/fa";
import { Link } from 'react-router-dom';
import { FaAngleLeft, FaUserTimes, FaUserCheck, FaEllipsisV } from 'react-icons/fa';
import dashboardIcon from '../../assets/icon_dashboard.png';

import totalTick from '../../assets/AdminImg/totTick.png';
import openTick from '../../assets/AdminImg/openTick.png';
import openit from '../../assets/AdminImg/openit.png';

import ReactPaginate from 'react-paginate';
import '../../Borrower/Pagination.css';
import { confirmAlert } from "react-confirm-alert";
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import a1 from '../../assets/AdminImg/approve.png'
import a2 from '../../assets/AdminImg/notapprove.png';

export class SysUserCustomerSupport extends Component {
    constructor(props) {
        super(props)
        this.state = {
            fromdate: "",
            todate: "",
            issuestatus: "",
            supportTcktList1: [],
            supportTcktList: [],
            dtoday: "",
            dfrday: "",
            allTckts: [],

            offset: 0,
            perPage: 10,
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

        console.log(this.state.todate, this.state.fromdate)
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
                if (resdata.status == 'SUCCESS') {
                    this.setState({
                        supportTcktList1: resdata.msgdata,
                        supportTcktList: resdata.msgdata
                    })

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
                if (resdata.status == 'SUCCESS') {
                    this.setState({
                        supportTcktList1: resdata.msgdata,
                        supportTcktList: resdata.msgdata
                    })
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

    supportTcktDetails(tickets) {
        console.log(tickets.issuedesc);
        console.log(tickets.issuetype);
        console.log(tickets.mobilenumber);
        console.log(tickets.raisedon);
        console.log(tickets.sladuration);
        console.log(tickets.reqno);
        sessionStorage.setItem("issuedesc", tickets.issuedesc);
        sessionStorage.setItem("issuetype", tickets.issuetype);
        sessionStorage.setItem("mobilenumber", tickets.mobilenumber);
        sessionStorage.setItem("raisedon", tickets.raisedon);
        sessionStorage.setItem("sladuration", tickets.sladuration);
        sessionStorage.setItem("slaDurationType", tickets.sladurationtype)
        sessionStorage.setItem("reqno", tickets.reqno);
        sessionStorage.setItem("lastupdated", tickets.lastupdated)
        sessionStorage.setItem("raisedby", tickets.raisedby)
        sessionStorage.setItem("issuStatus", tickets.issuestatus)
        sessionStorage.setItem("issueName", tickets.issuename)
        sessionStorage.setItem("reviewerName", tickets.reviewer)
        window.location = "/sysSupportTckt";

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
            <div className="container-dashboard d-flex flex-row" id="wrapper" style={{ backgroundColor: "#f4f7fc" }}>
                <SystemUserSidebar />
                <div className="main-content" id="page-content-wrapper">
                    <div className="container-fluid row pt-2">
                        <div className="col-1">
                            <button style={{ marginLeft: "25px" }} onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className='col-4' style={{ marginLeft: "20px", marginTop: "5px" }}>
                            <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                <Link to="/sysUserDashboard">Home</Link> / Grievance Support</p>
                        </div>
                        <div className='col'>

                        </div>
                        <div className='col'>

                        </div>
                        <div className='col-3'>

                        </div>
                        <div className="col">
                            <button style={myStyle}>
                                <Link to="/sysUserDashboard"><FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} /><span style={{ textDecoration: "none", color: "white" }}>Back</span></Link></button>
                        </div>
                    </div>
                    <hr className="col-11" style={{ marginLeft: "50px", width: "88.6%", backgroundColor: "rgba(4,78,160,1)", marginTop: "0px" }} />
                    <div className='container-fluid row' style={{ paddingLeft: "82px", marginTop: "-25px" }}>
                        <div className='card' style={{ overflow: "auto" }}>
                            <div className='row pt-2'>
                                <div className='col'>
                                    <ul role="tablist" className="nav nav-pills nav-fill mb-3" >
                                        <li className="nav-item"> <a data-toggle="pill" href="#myEarning-details" className="nav-link active detailsTab"
                                            style={{ textAlign: "center", paddingTop: "10px", paddingBottom: "10px", cursor: "default" }}>
                                            &nbsp; {t('Grievance Support')} </a> </li>
                                    </ul>

                                </div>
                            </div>

                            <div className='row' style={{marginTop:"-10px"}}>
                                <div className='col'>
                                    <p style={{ color: "#0079BF", fontFamily: "Poppins,sans-serif", fontWeight: "500", fontSize: "15px" }}>Ticket Statistics</p>
                                </div>
                            </div>
                            <div className='row' style={{  width: "94.5%", marginTop: "-30px" }}>
                                <div className='col-sm-3' >
                                    <div className='card' id='BcardChange1' style={{
                                        cursor: "default",
                                        borderLeft: "4px solid #0079bf",
                                        borderTop: "1.5px solid #0079bf", borderRight: "1.5px solid #0079bf", borderBottom: "1.5px solid #0079bf"
                                    }}>
                                        <div className='row' style={{ padding: "10px", color: "#0079BF", fontFamily: "Poppins,sans-serif", fontWeight: "600", fontSize: "15px" }}>
                                            <div className='col-8'>
                                                <p>Total</p>
                                            </div>
                                            <div className='col-4'>
                                                <p>{this.state.supportTcktList1.length}</p>
                                            </div>
                                            {/* <div className='col'>
                                        <p>No. Of Raised</p>
                                        <hr style={{ marginTop: "-10px", width: "20%" }} />
                                        <div className='row'>
                                            <div className='col-6' style={{ paddingLeft: "26px" }}>
                                                <img src={totalTick} style={{ width: "20px" }} />
                                            </div>
                                            <div className='col-6'>
                                                <p>{this.state.supportTcktList1.length}</p>
                                            </div>
                                        </div>
                                    </div> */}
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
                                            <div className='col-8'>
                                                <p>Unassigned</p>
                                            </div>
                                            <div className='col-4'>
                                                <p>{this.state.supportTcktList1.filter((tickets) => tickets.issuestatus == 0).length}</p>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                                <div className='col-sm-3' >
                                    <div className='card' id='BcardChange3' style={{
                                        cursor: "default",
                                        borderLeft: "4px solid #0079bf",
                                        borderTop: "1.5px solid #0079bf", borderRight: "1.5px solid #0079bf", borderBottom: "1.5px solid #0079bf"
                                    }}>
                                        <div className='row' style={{ padding: "10px", color: "#0079BF", fontFamily: "Poppins,sans-serif", fontWeight: "600", fontSize: "15px" }}>
                                            <div className='col-8'>
                                                <p>Closed</p>
                                            </div>
                                            <div className='col-4'>
                                                <p>{this.state.supportTcktList1.filter((tickets) => tickets.issuestatus == 2).length}</p>
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
                                            <div className='col-8'>
                                                <p>Processing</p>
                                            </div>
                                            <div className='col-4'>
                                                <p>{this.state.supportTcktList1.filter((tickets) => tickets.issuestatus == 1).length}</p>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='row' style={{ padding: "10px", marginLeft:"-25px", marginTop:"-20px" }}>
                                <div className='col-lg-2 col-md-3 col-sm-4 col-6 Fdate mb-2'>
                                    <p htmlFor="date" style={{
                                        fontWeight: "600",
                                        fontSize: "13px", marginLeft: "0px", color: "rgba(5,54,82,1)",
                                        marginBottom: "5px"
                                    }}>{t('From Date*')}</p>
                                    <input id="Fdate" type="date" className='form-control'
                                        defaultValue={this.state.dfrday} onChange={this.fromdate} style={{
                                            border: "1px solid rgba(40,116,166,1)",
                                            borderRadius: "5px",
                                            width: "100%",
                                            fontSize: "15px",
                                            color: "rgba(40,116,166,1)",
                                            paddingLeft: "10px"
                                        }} />
                                </div>
                                &nbsp;
                                <div className='col-lg-2 col-md-3 col-sm-4 col-6 Fdate mb-2' style={{ fontSize: "15px" }}>
                                    <p htmlFor="date" style={{
                                        fontWeight: "600",
                                        fontSize: "13px", marginLeft: "0px", color: "rgba(5,54,82,1)",
                                        marginBottom: "5px"
                                    }}>{t('To Date*')}</p>
                                    <input id="Tdate" type="date" className='form-control'
                                        defaultValue={this.state.dtoday} onChange={this.todate} style={{
                                            border: "1px solid rgba(40,116,166,1)",
                                            borderRadius: "5px",
                                            width: "100%",
                                            fontSize: "15px",
                                            color: "rgba(40,116,166,1)",
                                            paddingLeft: "10px"
                                        }} />
                                </div>
                                &nbsp;
                                <div className="col-lg-3 col-md-3 col-sm-4 col-6 Fdate mb-2" style={{ fontSize: "15px" }}>
                                    <p htmlFor="status" style={{ fontWeight: "600", fontSize: "13px" }}>{t('IssueStatus')}: </p>
                                    <select className="form-select" onChange={this.issuestatus} style={{ marginTop: "-12px" }}>
                                        <option defaultValue>{t('Select')}</option>
                                        <option value="0">{t('open')}</option>
                                        <option value="1">{t('processing')}</option>
                                        <option value="2">{t('closed')}</option>
                                        <option value="3">{t('Allstates')}</option>
                                    </select>
                                </div>
                                &nbsp;
                                <div className="col-lg-2 col-md-3 col-sm-4 col-6 Fdate mb-2 align-items-end" style={{ paddingTop: '21px' }}>
                                    <button type="button" className="btn text-white" style={{
                                        backgroundColor: "rgb(0, 121, 191)",
                                        paddingLeft: "40px", paddingRight: "40px"
                                    }}
                                        onClick={this.supportTickets}>{t('Apply')}</button>
                                </div>
                            </div>

                            <div className='row' style={{ marginTop: "-10px" }}>
                                <div className='col'>
                                    <div className='tab-content'>
                                        <div id="myEarning-details" className="register-form tab-pane fade show active" style={{ cursor: "default" }}>
                                            {this.state.supportTcktList == "" ?
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
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('Raised On')}</Th>
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('Request Number')}</Th>
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('Issue Name')}</Th>
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('Assigned To')}</Th>
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('Status')}</Th>
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px" }}></Th>
                                                                </Tr>
                                                            </Thead>
                                                            <Tbody>
                                                                {this.state.supportTcktList.map((tickets, index) => (
                                                                    <Tr key={index} style={{
                                                                        marginBottom: "-10px", transition: 'none', cursor: 'default', color: "rgba(5,54,82,1)",
                                                                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", backgroundColor: (index % 2 === 0) ? 'rgba(255,255,255,1)' : 'rgba(242,242,242,1)'
                                                                    }}>
                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}>{new Date(tickets.raisedon).toLocaleDateString('en-GB').split("/").join("-")}</Td>
                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}>{tickets.reqno}</Td>
                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}>{tickets.issuename}</Td>
                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}>{tickets.reviewer ? tickets.reviewer : "-"}</Td>
                                                                        {tickets.issuestatus === "0" && <Td style={{ color: "rgb(199, 188, 34)", fontSize: "14px", fontWeight: "490", textAlign: "left", }}><img src={a2} style={{ height: "19px" }} />&nbsp;Open</Td>}
                                                                        {tickets.issuestatus === "1" && <Td style={{ color: "rgb(29, 143, 63)", fontSize: "14px", fontWeight: "490", textAlign: "left", }}><img src={a1} style={{ height: "19px" }} />&nbsp;Processing</Td>}
                                                                        {tickets.issuestatus === "2" && <Td style={{ color: "rgb(5, 54, 82)", fontSize: "14px", fontWeight: "490", textAlign: "left", }}><FaUserCheck style={{ marginLeft: "-10px" }} />&nbsp;Closed</Td>}
                                                                        <Td> <span className="dropdown">

                                                                            <FaEllipsisV style={{ fontSize: "26px" }}
                                                                                className="btn dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" />
                                                                            &nbsp;
                                                                            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton" style={{ marginLeft: "-160px" }}>
                                                                                <a class="dropdown-item" onClick={this.supportTcktDetails.bind(this, tickets)}>Ticket Details</a>

                                                                            </div>
                                                                        </span>
                                                                        </Td>
                                                                    </Tr>
                                                                ))}
                                                            </Tbody>
                                                        </Table>
                                                        &nbsp;
                                                        {this.state.supportTcktList.length > 1 &&
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

export default withTranslation()(SysUserCustomerSupport)