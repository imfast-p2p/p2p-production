import React, { Component } from "react";
import $, { event } from "jquery";
import { BASEURL } from "../../assets/baseURL";
import SystemUserSidebar from "../SystemUserSidebar";
import { withTranslation } from "react-i18next";
import { FaSearch, FaAngleLeft, FaEllipsisV } from "react-icons/fa";
import dashboardIcon from '../../assets/icon_dashboard.png'
import { Link } from 'react-router-dom';
import accept from '../../assets/accept.png';
import ReactPaginate from 'react-paginate';
import '../../Borrower/Pagination.css'
import { confirmAlert } from "react-confirm-alert";
import openIt from '../../assets/AdminImg/openit.png';
import Loader from '../../Loader/Loader'
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'

var fromDate = "";
var toDate = ""
export class KycSessionList extends Component {
    constructor(props) {
        super(props);

        this.state = {
            reqNos: [],
            acceptReqs: "",
            utype: "",
            accepted: "0",
            fromdate: "",
            todate: "",
            dtoday: "",
            dfrday: "",

            offset: 0,
            orgtableData: [],
            perPage: 5,
            currentPage: 0,
            pageCount: "",

            resMsg: "",
            showLoader: false,
        };
    }

    componentDidMount() {
        this.loadDate();
        this.getKycSessionList();
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
        this.setState({ dfrday: frday });

        fromDate = frday;
        toDate = today;
    }
    fromdate = (event) => {
        // this.setState({ fromdate: event.target.value })
        fromDate = event.target.value;
        console.log(fromDate)
    }
    todate = (event) => {
        // this.setState({ todate: event.target.value })
        toDate = event.target.value;
    }
    accepted = (event) => {
        this.setState({ accepted: event.target.value });
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
            reqNos: slice
        })
    }
    getKycSessionList = () => {
        console.log(fromDate, toDate)
        let url = BASEURL + '/vf/getvkycsessionslist?fromdate=' + fromDate + "&todate=" + toDate + "&accepted=" + parseInt(this.state.accepted);
        fetch(url
            , {
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
                    this.setState({ reqNos: resdata.msgdata });

                    var data = resdata.msgdata
                    console.log(data)
                    var slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
                    console.log(slice)

                    this.setState({
                        pageCount: Math.ceil(data.length / this.state.perPage),
                        orgtableData: data,
                        reqNos: slice
                    })
                } else {
                    this.setState({ resMsg: resdata.message })
                    $("#commonModal").click();
                    this.setState({ reqNos: [] });
                }
            })
    }
    sessionActivities = (sessionid) => {
        sessionStorage.setItem("vkycSessionID", sessionid);
        window.location = "/sessionActivites";
    }
    sessionVideo = (sessionid) => {
        this.setState({ showLoader: true })
        fetch(BASEURL + '/vf/getvkycsessionvideo?sessionid=' + sessionid, {
            method: 'GET',
            headers: {
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            }
        })
            .then(response => {
                console.log(response)
                return response.blob(); // Use response.text() for non-JSON data
            })
            .then(async (videoUrl) => {
                console.log(videoUrl)
                this.setState({ showLoader: false })

                // Create a link element and trigger a click to start the download
                const link = document.createElement('a');
                link.href = window.URL.createObjectURL(videoUrl);
                link.download = 'session_Video.mp4';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            })
            .catch((error) => {
                this.setState({ showLoader: false })
                console.error('Error downloading video:', error);
                this.setState({ resMsg: error.message || "Error downloading video" });
                $("#commonModal").click();
            });
    };
    handleChange() {
        $('.text').toggle();
        $('#PImage').toggle();
        $('#Pinfo').toggle();
    }
    render() {
        const { t } = this.props;
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
                        <div className="col-1" id="kyCNav1">
                            <button style={{ marginLeft: "25px" }} onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className='col-4' id="kyCNav2" style={{ marginLeft: "20px", marginTop: "5px" }}>
                            <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                <Link to="/sysUserDashboard">Home</Link> / VKYC Session Audit </p>
                        </div>
                        <div className='col'>

                        </div>
                        <div className='col'>

                        </div>
                        <div className='col-3'>

                        </div>
                        <div className="col" id="kyCNav3">
                            <button style={myStyle}>
                                <Link to="/sysUserDashboard" style={{ marginLeft: "10px" }}><FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} /><span style={{ textDecoration: "none", color: "white" }}>Back</span></Link></button>
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
                                            &nbsp; {t('VKYC Session Audit')} </a> </li>
                                    </ul>

                                </div>
                            </div>
                            <div className='row mb-2' style={{marginTop:"-10px"}}>
                                <div className='col-lg-2 col-md-3 col-sm-4 col-6 Fdate mb-2'>
                                    <p htmlFor="date" style={{
                                        fontWeight: "600",
                                        fontSize: "13px", marginLeft: "0px", color: "rgba(5,54,82,1)",
                                        marginBottom: "5px"
                                    }}>{t('From Date*')}</p>
                                    <input className="form-control"
                                        type="date" defaultValue={this.state.dfrday}
                                        onChange={this.fromdate}
                                        style={{
                                            border: "1px solid rgba(40,116,166,1)",
                                            borderRadius: "5px",
                                            height: "34px",
                                            fontSize: "15px",
                                            color: "rgba(40,116,166,1)",
                                            paddingLeft: "10px",
                                            width: "100%",
                                        }} />
                                </div>
                                <div className='col-lg-2 col-md-3 col-sm-4 col-6 Fdate mb-2' style={{ fontSize: "15px" }}>
                                    <p htmlFor="date" style={{
                                        fontWeight: "600",
                                        fontSize: "13px", marginLeft: "0px", color: "rgba(5,54,82,1)",
                                        marginBottom: "5px"
                                    }}>{t('To Date*')}</p>
                                    <input className="form-control"
                                        type="date" defaultValue={this.state.dtoday}
                                        onChange={this.todate}
                                        style={{
                                            border: "1px solid rgba(40,116,166,1)",
                                            borderRadius: "5px",
                                            height: "34px",
                                            fontSize: "15px",
                                            color: "rgba(40,116,166,1)",
                                            paddingLeft: "10px",
                                            width: "100%",
                                        }} />
                                </div>
                                <div className='col-lg-3 col-md-3 col-sm-4 col-6 Fdate mb-2' style={{ fontSize: "15px" }}>
                                    <p htmlFor="date" style={{
                                        fontWeight: "600",
                                        fontSize: "13px", marginLeft: "0px", color: "rgba(5,54,82,1)",
                                        marginBottom: "5px",
                                    }}>{t('Status')}</p>
                                    <select className='form-select' style={{ height: "34px", border: "1px solid rgb(40, 116, 166)", color: "rgb(40, 116, 166)" }} onChange={this.accepted}>
                                        <option defaultValue>Select</option>
                                        <option value="1">Accepted</option>
                                        <option value="0">Not Accepted</option>
                                    </select>
                                </div>
                                <div className="col-lg-2 col-md-3 col-sm-4 col-6 Fdate mb-2 align-items-end" style={{marginTop:"23px"}}>
                                    <button type="button" className="btn btn-sm text-white w-100" style={{
                                        backgroundColor: "rgb(0, 121, 191)",
                                        paddingTop: "6px", paddingBottom: "6px"
                                    }}
                                        id='auditTrailBtn'
                                        onClick={this.getKycSessionList}>{t('Apply')}</button>
                                </div>
                            </div>


                            <div className='row' style={{ marginTop: "-10px" }}>
                                <div className='col'>
                                    <div className='tab-content'>
                                        <div id="myEarning-details" className="register-form tab-pane fade show active" style={{ cursor: "default" }}>
                                            {this.state.reqNos == "" ?
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
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('User ID')}</Th>
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('User Type')}</Th>
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('Agent Name')}</Th>
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('Requested On')}</Th>
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('Accepted On')}</Th>
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px" }}></Th>


                                                                </Tr>
                                                            </Thead>
                                                            <Tbody>
                                                                {this.state.reqNos.map((reqno, index) => (
                                                                    <Tr key={index} style={{
                                                                        marginBottom: "-10px", transition: 'none', cursor: 'default', color: "rgba(5,54,82,1)",
                                                                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", backgroundColor: (index % 2 === 0) ? 'rgba(255,255,255,1)' : 'rgba(242,242,242,1)'
                                                                    }}>
                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}>{reqno.username}</Td>
                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}> {reqno.utype == "2" ? "Lender" :
                                                                            <span>{reqno.utype == "3" ? "Borrower" : <span>{reqno.utype == "4" ? "Facilitator" : <span>{reqno.utype == "5" ? "Evaluator" : "-"}</span>}</span>}</span>}</Td>
                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}>{reqno.agentname}</Td>
                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}> {new Date(reqno.requestedon).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).split('/').join('-')}</Td>
                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left" }}>
                                                                            {new Date(reqno.acceptedon).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).split('/').join('-')}
                                                                        </Td>

                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}>
                                                                            <span className="dropdown">

                                                                                <FaEllipsisV style={{ fontSize: "26px" }}
                                                                                    className="btn dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" />
                                                                                &nbsp;
                                                                                <div className="dropdown-menu" aria-labelledby="dropdownMenuButton" style={{ marginLeft: "-160px" }}>
                                                                                    <a class="dropdown-item" onClick={this.sessionActivities.bind(this, reqno.sessionid)}>Session Activities</a>
                                                                                    <a class="dropdown-item" onClick={this.sessionVideo.bind(this, reqno.sessionid)}>VKYC Session Video</a>

                                                                                </div>
                                                                            </span>
                                                                        </Td>

                                                                    </Tr>
                                                                ))}
                                                            </Tbody>
                                                        </Table>
                                                        &nbsp;
                                                        {this.state.reqNos.length > 1 &&
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
                                        style={{ backgroundColor: "rgb(136, 189, 72)" }} >Okay</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withTranslation()(KycSessionList);