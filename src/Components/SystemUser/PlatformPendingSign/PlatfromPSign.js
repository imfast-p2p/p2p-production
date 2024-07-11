import React, { Component } from "react";
import $ from "jquery";
import { BASEURL } from "../../assets/baseURL";
import SystemUserSidebar from "../SystemUserSidebar";
import { withTranslation } from "react-i18next";
import { FaSearch, FaAngleLeft, FaUserPlus } from "react-icons/fa";
import dashboardIcon from '../../assets/icon_dashboard.png'
import { Link } from 'react-router-dom';
import accept from '../../assets/accept.png';
import ReactPaginate from 'react-paginate';
import '../../Borrower/Pagination.css';
import { confirmAlert } from "react-confirm-alert";
import openIt from '../../assets/AdminImg/openit.png';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'

var input, filter, ul, li, a, i, txtValue;
export class PlatformPSign extends Component {
    constructor(props) {
        super(props);

        this.state = {
            reqNos: [],
            acceptReqs: "",
            utype: "",
            reqNo: "",
            memmid: "",
            pos: "",

            offset: 0,
            orgtableData: [],
            perPage: 10,
            currentPage: 0,
            pageCount: "",

            getPlatformStatus: "0",
            txnID: ""

        };
    }

    componentDidMount() {
        this.getPlatformSignReq();
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
    getStatus = (e) => {
        this.setState({ getPlatformStatus: e.target.value })
    }
    getPlatformSignReq = (event) => {
        fetch(BASEURL + "/lms/getplatformpendingsigningreqs?status=" + this.state.getPlatformStatus, {
            method: "GET",
            headers: {
                'Accept': "application/json",
                "Content-Type": "application/json",
                'Authorization': "Bearer " + sessionStorage.getItem("token"),
            },
        })
            .then((Response) => Response.json())
            .then((resdata) => {
                if (resdata.status == "SUCCESS") {
                    console.log(resdata);
                    var list = resdata.msgdata
                    list.sort((a, b) => {
                        return new Date(b.updatedon).getTime() - new Date(a.updatedon).getTime()
                    })
                    this.setState({ reqNos: list });

                    var data = list
                    console.log(data)
                    var slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
                    console.log(slice)

                    this.setState({
                        pageCount: Math.ceil(data.length / this.state.perPage),
                        orgtableData: data,
                        reqNos: slice
                    })
                } else {
                    //alert("Issue: " + resdata.message);
                }
            });
    }
    platformSignAgreement = (loanrequestnumber) => {
        fetch(BASEURL + '/lms/borr/signloanagreement', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                loanreqno: loanrequestnumber
            })
        }).then((Response) => {
            return Response.json();
        })
            .then((resdata) => {
                if (resdata.status == 'SUCCESS' || resdata.status == 'Success' || resdata.status == 'success') {
                    console.log(resdata);
                    //alert(resdata.message);

                    // if (resdata.msgdata['META_DATA']) {
                    //     metaData = resdata.msgdata['META_DATA'];
                    //     console.log(metaData);
                    //     sessionStorage.setItem("dde_data", metaData);
                    //     window.location = "/ddeSign";
                    // } else {
                    confirmAlert({
                        message: resdata.message,
                        buttons: [
                            {
                                label: "Okay",
                                onClick: () => {
                                    // window.location = "/viewAllLoanRequests"
                                },
                            },
                        ],
                    });
                    // }
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
            .catch((error) => {
                console.log(error)
            })
    }
    resendEsignLink = (loanrequestnumber) => {
        console.log(loanrequestnumber)
        fetch(BASEURL + '/lms/resendsigninglink', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                loanreqno: loanrequestnumber
            })
        }).then((Response) => {
            return Response.json();
        })
            .then((resdata) => {
                console.log(resdata);
                // alert(resdata.message);
                if (resdata.status == "Success") {
                    confirmAlert({
                        message: resdata.message,
                        buttons: [
                            {
                                label: "Okay",
                                onClick: () => {
                                    window.location = "/sysUserDashboard"
                                },
                            },
                        ],
                    });
                    this.setState({ txnID: resdata.msgdata.transid });
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
            .catch((error) => {
                console.log(error)
            })
    }
    myFunction = (e) => {
        e.preventDefault();
        const filter = e.target.value.toUpperCase();
        const ul = document.getElementById("myUL");
        const rows = ul.getElementsByTagName("tr");
        
        for (let i = 0; i < rows.length; i++) {
            const cells = rows[i].getElementsByTagName("td");
            let match = false;
            
            for (let j = 0; j < cells.length; j++) {
                const cell = cells[j];
                if (cell) {
                    const txtValue = cell.textContent || cell.innerText;
                    if (txtValue.toUpperCase().indexOf(filter) > -1) {
                        match = true;
                        break;
                    }
                }
            }
    
            if (match) {
                rows[i].style.display = "";
            } else {
                rows[i].style.display = "none";
            }
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
        const myStyle2 = {
            color: "white",
            textAlign: "center",
            textDecoration: "none",
            display: "inline-block",
            cursor: "pointer",
            fontSize: "12px",
            // height: "25px",
            width: "185px",
            border: "none",
            backgroundColor: "rgba(5,54,82,1)",
            borderRadius: "5px",
            padding: "7px 0px"
        }
        return (
            <div className="container-dashboard d-flex flex-row" id="wrapper" style={{ backgroundColor: "#F4F7FC" }}>
                <SystemUserSidebar />
                <div className="main-content" id="page-content-wrapper">
                    <div className="container-fluid row pt-2">
                        <div className="col-1" id="">
                            <button style={{ marginLeft: "25px" }} onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className='col-5' id="" style={{ marginLeft: "20px", marginTop: "5px" }}>
                            <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                <Link to="/sysUserDashboard">Home</Link> / Platform Signing</p>
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
                                            style={{ textAlign: "center", paddingTop: "10px", paddingBottom: "10px", cursor: "default" }}>
                                            &nbsp; {t('Platform Signing')} </a> </li>
                                    </ul>

                                </div>
                            </div>
                            <div className="row mb-2" style={{marginTop:"-15px"}}>
                                <div className="col-md-3 col-12 mb-2 mb-md-0">
                                    <p style={{ color: "rgba(5,54,82,1)", fontWeight: "500", fontSize:"15px" }}>Status</p>
                                    <select className="form-select" onChange={this.getStatus} style={{ marginTop: "-15px" }}>
                                        <option defaultValue>Select Status</option>
                                        <option value="0">Not Signed</option>
                                        <option value="1">Partially Signed</option>
                                        <option value="2">Signed</option>
                                    </select>
                                </div>
                                <div className="col-md-2 col-12" style={{ paddingTop: "27px" }}>
                                    <button className="btn btn-sm text-white w-100" style={{ backgroundColor: "rgba(0,121,190,1)" }} onClick={this.getPlatformSignReq}>Apply</button>
                                </div>
                            </div>
                            <div className='row mb-3'>
                                <div className='col-12' style={{ paddingRight: "45px" }}>
                                    <div className="row example">
                                        <div className='col-md-10 col-12 mb-2 mb-md-0'>
                                            <input type="text" className="form-control" placeholder="Search by User ID" style={{ height: "38px", color: "rgb(5, 54, 82)" }} name="search" autoComplete='off' onKeyUp={this.myFunction} />
                                        </div>
                                        <div className='col-md-2 col-12'>
                                            <button className="btn btn-primary w-100" style={myStyle2}>
                                                <FaSearch style={{ fontSize: "15px" }} />&nbsp;<span style={{ textDecoration: "none", color: "white", fontSize: "15px" }}>Search</span>
                                            </button>
                                        </div>
                                    </div>
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
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('Borrower ID')}</Th>
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('Loan Account No.')}</Th>
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('Transaction ID')}</Th>
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('Requested On')}</Th>
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('Updated On')}</Th>
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('Status')}</Th>

                                                                </Tr>
                                                            </Thead>
                                                            <Tbody id="myUL">
                                                                {this.state.reqNos.map((reqno, index) => (
                                                                    <Tr key={index} style={{
                                                                        marginBottom: "-10px", transition: 'none', cursor: 'default', color: "rgba(5,54,82,1)",
                                                                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", backgroundColor: (index % 2 === 0) ? 'rgba(255,255,255,1)' : 'rgba(242,242,242,1)'
                                                                    }}>
                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}>{reqno.borrowerid}</Td>
                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}>{reqno.loanaccountno}</Td>
                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}>{reqno.txnid}</Td>

                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}>{reqno.signreqsenton &&
                                                                            <span>
                                                                                {
                                                                                    (() => {
                                                                                        const date = new Date(reqno.signreqsenton);
                                                                                        // Format the date to DD-MM-YYYY
                                                                                        const formattedDate = date.toLocaleDateString('en-GB'); // 'en-GB' formats as DD/MM/YYYY
                                                                                        return formattedDate.replace(/\//g, '-'); // Replace '/' with '-'
                                                                                    })()
                                                                                }
                                                                            </span>}</Td>
                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}>{reqno.updatedon &&
                                                                            <span>
                                                                                {
                                                                                    (() => {
                                                                                        const date = new Date(reqno.updatedon);
                                                                                        // Format the date to DD-MM-YYYY
                                                                                        const formattedDate = date.toLocaleDateString('en-GB'); // 'en-GB' formats as DD/MM/YYYY
                                                                                        return formattedDate.replace(/\//g, '-'); // Replace '/' with '-'
                                                                                    })()
                                                                                }
                                                                            </span>}</Td>
                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}>{reqno.status == "0" ?
                                                                            <button className="btn btn-sm text-white" style={{ backgroundColor: "#0079bf" }} onClick={this.platformSignAgreement.bind(this, reqno.loanrequestnumber)}>Sign Agreement</button> :
                                                                            <>{reqno.status == "1" ?
                                                                                <button className="btn btn-sm text-white" style={{ backgroundColor: "#0079bf" }} onClick={this.platformSignAgreement.bind(this, reqno.loanrequestnumber)}>Sign Agreement</button> :
                                                                                <>{reqno.status == "2" ?
                                                                                    <h6 className="" style={{ marginTop: "4px", fontSize: "16px", color: "rgba(5,54,82,1)", fontWeight: "490" }}>
                                                                                        Signed
                                                                                    </h6> : "-"}</>}</>}</Td>

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
                </div>
            </div>
        );
    }
}

export default withTranslation()(PlatformPSign);