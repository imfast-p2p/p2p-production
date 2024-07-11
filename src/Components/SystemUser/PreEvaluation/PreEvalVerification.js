import React, { Component } from 'react';
import $ from 'jquery';
import { BASEURL } from '../../assets/baseURL';
import SystemUserSidebar from "../SystemUserSidebar";
import FacilitatorSidebar from '../../../SidebarFiles/FacilitatorSidebar';
import { withTranslation } from 'react-i18next';
import { FaAngleLeft,FaEllipsisV } from "react-icons/fa";
import dashboardIcon from '../../assets/icon_dashboard.png';
import { Link } from 'react-router-dom';
import openIt from '../../assets/AdminImg/openit.png'
import ReactPaginate from 'react-paginate';
import '../../Borrower/Pagination.css';
import { confirmAlert } from "react-confirm-alert";
import sysUser from '../../assets/All.png';
import batch from '../../assets/batch.png';
import Loader from '../../Loader/Loader';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'

var updatedStatus = 1;
export class PreEvalVerification extends Component {
    constructor(props) {
        super(props)
        this.state = {
            offset: 0,
            orgtableData: [],
            perPage: 10,
            currentPage: 0,
            pageCount: "",

            preEvalList: [],
            fullDetailsString: {},
            resMsg: "",
            updatedStatus: 1,
            showLoader: false,
            loginType: sessionStorage.getItem('userType')
        }
    }
    componentDidMount() {
        this.getPreEvallist();
        // if (sessionStorage.getItem('pmDefault') === "0") {
        //     this.setState({ pmType: "pmSystemUser" }); // Update state using setState
        // } else {
        //     this.setState({ pmType: "platformSysUser" }); // Update state using setState
        // }
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
            preEvalList: slice
        })
    }
    preEvlStatus = (status) => {
        this.setState({ updatedStatus: status }, () => {
            this.getPreEvallist(this.state.updatedStatus);
        });
    }
    getPreEvallist = () => {
        // var responseData = {
        //     "msgdata": {
        //         "activityname": "Pre Evaluation Verification",
        //         "activityid": "LN40",
        //         "loanrequestdetails": [
        //             {
        //                 "loanrequestnumber": "R000000001",
        //                 "activitystatus": "1",
        //                 "createdon": "2023-11-27",
        //                 "isenabled": "1",
        //                 "productid": "HOME",
        //                 "pgmmgrid": "11",
        //                 "updatedon": "",
        //                 "performedby": "",
        //                 "comments": ""
        //             },
        //             {
        //                 "loanrequestnumber": "R000000002",
        //                 "activitystatus": "2",
        //                 "createdon": "2023-11-27",
        //                 "isenabled": "0",
        //                 "productid": "HOME",
        //                 "pgmmgrid": "11",
        //                 "updatedon": "",
        //                 "performedby": "",
        //                 "comments": ""
        //             }
        //         ]
        //     },
        //     "message": "Pre evaluation verification list"
        // }
        // console.log(responseData);
        // this.setState({ preEvalList: responseData.msgdata.loanrequestdetails });
        console.log(this.state.updatedStatus)
        this.setState({ showLoader: true })
        let url = BASEURL + '/lsp/getwfpendingloans/preevaluation?status=' + this.state.updatedStatus;
        fetch(url, {
            method: "GET",
            headers: {
                Authorization: "Bearer " + sessionStorage.getItem("token"),
            },
        }).then((response) => {
            console.log("Response:", response);
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata);
                if (resdata.status == "SUCCESS") {
                    this.setState({ showLoader: false })
                    this.setState({ preEvalList: resdata.msgdata.loanrequestdetails });

                    var data = this.state.preEvalList
                    console.log(data)
                    var slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
                    console.log(slice)

                    this.setState({
                        pageCount: Math.ceil(data.length / this.state.perPage),
                        orgtableData: data,
                        preEvalList: slice
                    })
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
                        this.setState({
                            resMsg: resdata.message,
                            showLoader: false
                        })
                        $("#commonModal").click();
                        this.setState({ groupList: [] })
                    }
                }
            })
            .catch(err => {
                console.log(err.message)
            })
    }
    showFullDetails = (lists) => {
        console.log(lists);
        sessionStorage.setItem("loanreqno", lists.loanrequestnumber);
        let data1 = JSON.stringify({
            List: lists
        })
        sessionStorage.setItem("preData", data1)
        window.location = "/verifyPreProfile";
    }
    handleChange() {
        $('.text').toggle();
        $('#PImage').toggle();
        $('#Pinfo').toggle();
    }
    render() {
        const { t } = this.props
        const{loginType}  = this.state
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
                {
                    this.state.showLoader && <Loader />
                }
                {/* < SystemUserSidebar /> */}
                {loginType === "4" ?
                    < FacilitatorSidebar />
                    :
                    loginType === "1" &&
                    < SystemUserSidebar />
                }
                <div className="pl-3 pr-3 main-content" id="page-content-wrapper">
                    <div className="container-fluid row pt-2">
                        <div className="col-1" id="ProductDefRes1">
                            <button style={{ marginLeft: "25px" }} onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className='col-4' id="ProductDefRes2" style={{ marginLeft: "20px", marginTop: "5px" }}>
                            {/* <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} /> */}
                                {/* <Link to="/sysUserDashboard">Home</Link> / Loan Request Verification</p> */}

                                {loginType === "1" ?
                                <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                    <Link to="/sysUserDashboard">Home</Link> / Loan Request Verification</p>
                                :
                                loginType === "4" &&
                                <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                    <Link to="/facilitatorDashboard">Home</Link> / Loan Request Verification</p>
                            }
                        </div>
                        <div className='col'>

                        </div>
                        <div className='col'>

                        </div>
                        <div className='col-3'>

                        </div>
                        <div className="col" id="ProductDefRes3">
                            <button style={myStyle}>
                                <Link to={loginType === "4" ? "/facilitatorDashboard" : loginType === "1" && "/sysUserDashboard"} style={{ marginLeft: "10px" }}>
                                    <FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} />
                                    <span style={{ textDecoration: "none", color: "white" }}>Back</span></Link></button>
                        </div>

                    </div>
                    <hr className="col-11" style={{ marginLeft: "50px", width: "88.6%", backgroundColor: "rgba(4,78,160,1)", marginTop: "-5px" }} />
                    <div className='row '>
                        <div className="col">
                            <p className="d-flex justify-content-center" style={{ marginTop: "-10px", fontSize: "18px", fontWeight: "bold", color: "rgba(5,54,82,1)" }}>{t('Loan Request Verification')}</p>
                        </div>
                    </div>
                    {/* New Design */}
                    <div className='container-fluid row' style={{ paddingLeft: "86px", marginTop: "-20px" }}>
                        <div className='card' style={{ cursor: "default" }}>
                            <div className='row pt-2 pl-2 pr-2'>
                                <div className='col'>
                                    <ul role="tablist" className="nav nav-pills nav-fill mb-3" style={{ fontSize: "15px" }}>
                                        <li className="nav-item" onClick={() => this.preEvlStatus(1)}><a data-toggle="pill" id="myNavLink" href="#activeproducts" className="nav-link active"
                                            style={{ textAlign: "center", paddingTop: "10px", paddingBottom: "10px", fontWeight: "bold" }} >
                                            <img src={sysUser} style={{ width: "20px" }} /> &nbsp; {t('Pending List')} </a> </li>
                                        <li className="nav-item" onClick={() => this.preEvlStatus(2)}><a data-toggle="pill" id="myNavLink" href="#activeproducts" className="nav-link"
                                            style={{ textAlign: "center", paddingTop: "10px", paddingBottom: "10px", fontWeight: "bold" }} >
                                            <img src={sysUser} style={{ width: "20px" }} /> &nbsp; {t('Approved List')} </a> </li>
                                    </ul>
                                </div>
                            </div>
                            {/* {!this.state.preEvalList || Object.keys(this.state.preEvalList).length === 0 ?
                                <></> :
                                <div className='scrollbar jlgverify' id="auditScroll">
                                    <div style={{
                                        whiteSpace: "nowrap"
                                    }} id='secondAuditScroll'>
                                        <div className="tab-content h-100" >
                                            <div class="tab-pane fade show active " id="activeproducts" role="tabpanel" style={{ marginBottom: "20px" }}>
                                                <div className='row font-weight-normal' style={{ fontWeight: "800", fontSize: "14px", color: "rgba(5,54,82,1)", marginLeft: "10px" }}>
                                                    <div className='col-3'>
                                                        <p style={{ fontWeight: "600" }}>{t('Loan Request Number')}</p>
                                                    </div>
                                                    <div className='col-2'>
                                                        <p style={{ fontWeight: "600", marginLeft: "-3px" }}>{t('Product Name')}</p>
                                                    </div>
                                                    <div className='col-3' style={{ textAlign: "center" }}>
                                                        <p style={{ fontWeight: "600", marginLeft: "-25px" }}>{t('Created On')}</p>
                                                    </div>
                                                  
                                                    <div className='col-3' style={{ textAlign: "center" }}>
                                                        <p style={{ fontWeight: "600", marginLeft: "-50px" }}>{t('Created On')}</p>
                                                    </div>
                                                </div>
                                                <hr className="col-12" style={{ marginLeft: "13px", width: "94%", marginTop: "-10px", backgroundColor: "rgb(5, 54, 82)" }} />
                                                {
                                                    this.state.preEvalList.map((lists, index) => {
                                                        return (
                                                            <div className='col' key={index} style={{ marginTop: "-10px", fontSize: "14px" }}>
                                                                <div className='card border-0' style={{ marginBottom: "-10px", transition: 'none', overflow: "visible", color: "rgb(5, 54, 82)", cursor: 'default', backgroundColor: (index % 2 === 0) ? 'rgba(255,255,255,1)' : 'rgba(242,242,242,1)' }}>
                                                                    <div className="row item-list align-items-center">
                                                                        <div class="col-3">
                                                                            <p style={{ marginBottom: "-3px", marginLeft: "10px" }}>{lists.loanrequestnumber}</p>
                                                                        </div>
                                                                        <div class="col-2" >
                                                                            <p style={{ marginLeft: "10px", marginBottom: "-3px" }}>{lists.productid}</p>
                                                                        </div>
                                                                        <div class="col-3" style={{ textAlign: "center" }}>
                                                                            {lists.createdon &&
                                                                                <p style={{ marginBottom: "-3px" }}>{lists.createdon.split(" ")[0].split("-").reverse().join("-")}</p>
                                                                            }
                                                                        </div>
                                                                        <div className='col-3' style={{ textAlign: "center" }}>
                                                                            {lists.activitystatus == "0" ? <p style={{ color: "rgb(199, 188, 34)", fontWeight: "600", marginBottom: "-3px" }}>Not Initiated</p> :
                                                                                <>{lists.activitystatus == "1" ? <p style={{ color: "rgb(5, 54, 82)", fontWeight: "600", marginBottom: "-3px" }}>Pending</p> :
                                                                                    <>{lists.activitystatus == "2" ? <p style={{ color: "rgb(29, 143, 63)", fontWeight: "600", marginBottom: "-3px" }}>Approved</p> :
                                                                                        <>{lists.activitystatus == "9" ? <p style={{ color: "rgb(29, 143, 63)", fontWeight: "600", marginBottom: "-3px" }}>Skipped</p> : ""}</>}</>
                                                                                }
                                                                                </>
                                                                            }
                                                                        </div>
                                                                        <div class="col-1" style={{ textAlign: "end" }}>
                                                                            <p class="btn-group dropleft">
                                                                                <img src={openIt} style={{ height: "35px", marginBottom: "-10px" }}
                                                                                    class="btn dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" />
                                                                                &nbsp;
                                                                                <div class="dropdown-menu" aria-labelledby="dropdownMenuButton" style={{ marginLeft: "-114px" }}>
                                                                                    <a class="dropdown-item" onClick={this.showFullDetails.bind(this, lists)}>Verify Details</a>
                                                                                </div>
                                                                            </p>
                                                                        </div>

                                                                    </div >
                                                                </div >
                                                            </div>
                                                        )
                                                    }
                                                    )
                                                }
                                                <div className="row">
                                                    <div className='col'></div>
                                                    <div className='col' style={{ marginRight: "15px" }}>
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
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>} */}


                                <div className='row' style={{ marginTop: "-10px" }}>
                                <div className='col'>
                                    <div className='tab-content  h-100'>
                                        <div id="activeproducts" className="tab-pane fade show active" role="tabpanel"style={{ cursor: "default",marginBottom: "20px" }}>
                                            {this.state.preEvalList == "" ?
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
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('Loan Request Number')}</Th>
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('Product Name')}</Th>
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('Created On')}</Th>
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('Status')}</Th>
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px", textAlign: "right" }}></Th>
                                                                </Tr>
                                                            </Thead>
                                                            <Tbody>
                                                                {this.state.preEvalList.map((lists, index) => (
                                                                    <Tr key={index} style={{
                                                                        marginBottom: "-10px", transition: 'none', cursor: 'default', color: "rgba(5,54,82,1)",
                                                                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", backgroundColor: (index % 2 === 0) ? 'rgba(255,255,255,1)' : 'rgba(242,242,242,1)'
                                                                    }}>
                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}>{lists.loanrequestnumber}</Td>
                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}>{lists.productid}</Td>
                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}>{lists.createdon.split(" ")[0].split("-").reverse().join("-")}</Td>
                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}>{lists.activitystatus == "0" ? <p style={{ color: "rgb(199, 188, 34)", fontWeight: "600", marginBottom: "-3px" }}>Not Initiated</p> :
                                                                                <>{lists.activitystatus == "1" ? <p style={{ color: "rgb(5, 54, 82)", fontWeight: "600", marginBottom: "-3px" }}>Pending</p> :
                                                                                    <>{lists.activitystatus == "2" ? <p style={{ color: "rgb(29, 143, 63)", fontWeight: "600", marginBottom: "-3px" }}>Approved</p> :
                                                                                        <>{lists.activitystatus == "9" ? <p style={{ color: "rgb(29, 143, 63)", fontWeight: "600", marginBottom: "-3px" }}>Skipped</p> : ""}</>}</>
                                                                                }
                                                                                </>
                                                                            }</Td>
                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "right", }}>
                                                                            <span className="dropdown">

                                                                                <FaEllipsisV style={{ fontSize: "26px" }}
                                                                                    className="btn dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" />
                                                                                &nbsp;
                                                                                <div className="dropdown-menu" aria-labelledby="dropdownMenuButton" style={{ marginLeft: "-160px" }}>
                                                                                    <a className="dropdown-item"  onClick={this.showFullDetails.bind(this, lists)}>Verify Details</a>
                                                                                </div>
                                                                            </span>
                                                                        </Td>
                                                                    </Tr>
                                                                ))}
                                                            </Tbody>
                                                        </Table>
                                                        &nbsp;
                                                        {this.state.preEvalList.length > 0 &&
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
                                                style={{ backgroundColor: "rgb(136, 189, 72)" }}>Okay</button>
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

export default withTranslation()(PreEvalVerification)