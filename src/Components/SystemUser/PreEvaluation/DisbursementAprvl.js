import React, { Component } from 'react';
import $ from 'jquery';
import { BASEURL } from '../../assets/baseURL';
import SystemUserSidebar from "../SystemUserSidebar";
import { withTranslation } from 'react-i18next';
import { FaPlus } from "react-icons/fa";
import { FaEllipsisV, FaTimesCircle, FaAngleLeft, FaAngleDoubleRight, FaRegUser, FaEdit, FaMapMarkerAlt, FaHouseUser, FaUserEdit, FaFolderPlus, FaDownload, FaRegSave } from "react-icons/fa";
import dashboardIcon from '../../assets/icon_dashboard.png';
import { Link } from 'react-router-dom';
import openIt from '../../assets/AdminImg/openit.png'
// import us from '../../assets/AdminImg/pro.png';
// import editRole from '../../assets/editRole.png';
import ReactPaginate from 'react-paginate';
import '../../Borrower/Pagination.css';
import { confirmAlert } from "react-confirm-alert";
import batch from '../../assets/batch.png';
// import jsPDF from "jspdf";
import "jspdf-autotable";
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'
// import logo2 from '../../assets/IFPL.jpg';
// import batch from '../../assets/batch.png';
// import { FcOk } from "react-icons/fc";
// import { GiSandsOfTime, GiTimeTrap } from "react-icons/gi";

export class DisbursementAprvl extends Component {
    constructor(props) {
        super(props)
        this.state = {
            offset: 0,
            orgtableData: [],
            perPage: 20,
            currentPage: 0,
            pageCount: "",
            list: [],
            pdfBtn: false,
            resMsg: "",
            userID: sessionStorage.getItem('userID'),
            loanreqNo: "",
            orderNo: "",
            showLoader: false,
            getDisbursePendingList: []
        }
    }
    componentDidMount() {
        this.getWfDisbursePendingList()
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
            getDisbursePendingList: slice
        })
    }
    getWfDisbursePendingList() {
        var url = `/lsp/getwfpendingloans/disbursementapproval`
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

                    var data = resdata.msgdata.loanrequestdetails
                    console.log(data)
                    var slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
                    console.log(slice)

                    this.setState({
                        pageCount: Math.ceil(data.length / this.state.perPage),
                        orgtableData: data,
                        getDisbursePendingList: slice
                    })
                } else {
                    $("#exampleModal").modal('hide')
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
    viewMoreDetails = (lists) => {
        $("#disburseModal").click();
        console.log(lists)
        this.setState({
            loanreqNo: lists.loanrequestnumber,
            status: lists.activitystatus,
            createdon: lists.createdon,
            productid: lists.productid,
            updatedon: lists.updatedon,
            performedby: lists.performedby
        }, () => {
            console.log(this.state.loanreqNo)
        })

    }
    initialDisbursement = (lists) => {
        fetch(BASEURL + '/lsp/initiateloandisbursement', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                loanrequestnumber: lists.loanrequestnumber
            })
        }).then((Response) => {
            return Response.json();
        })
            .then((resdata) => {
                if (resdata.status == 'Success' || resdata.success === "SUCCESS") {
                    console.log(resdata);
                    // alert("Loan disbursement initiated. Please check your account after sometime");
                    confirmAlert({
                        message: resdata.message,
                        buttons: [
                            {
                                label: "Okay",
                                onClick: () => {
                                    this.getWfDisbursePendingList()
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
            .catch((error) => {
                console.log(error)
            })
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
        console.log(this.state.groupStatus)
        return (
            <div className="container-dashboard d-flex flex-row" id="wrapper" style={{ backgroundColor: "#f4f7fc", marginTop: "-7px" }}>
                < SystemUserSidebar />
                <div className="pl-3 pr-3 main-content" id="page-content-wrapper">
                    <div className="container-fluid row pt-2">
                        <div className="col-1" id="ProductDefRes1">
                            <button style={{ marginLeft: "25px" }} onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className='col-4' id="ProductDefRes2" style={{ marginLeft: "20px", marginTop: "5px" }}>
                            <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                <Link to="/sysUserDashboard">Home</Link> / Disbursement Approval</p>
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

                    <div className='container-fluid row' style={{ paddingLeft: "82px", marginTop: "-26px" }}>
                        <div className='card' style={{ overflow: "auto" }}>
                            <div className='row pt-2'>
                                <div className='col'>
                                    <ul role="tablist" className="nav nav-pills nav-fill mb-3" >
                                        <li className="nav-item"> <a data-toggle="pill" href="#myEarning-details" className="nav-link active detailsTab"
                                            style={{ textAlign: "center", paddingTop: "10px", paddingBottom: "10px", cursor: "default" }}>
                                            &nbsp; {t('Disbursement Approval')} </a> </li>
                                    </ul>

                                </div>
                            </div>

                            <div className='row' style={{ marginTop: "-10px" }}>
                                <div className='col'>
                                    <div className='tab-content'>
                                        <div id="myEarning-details" className="register-form tab-pane fade show active" style={{ cursor: "default" }}>
                                            {this.state.getDisbursePendingList == "" ?
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
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('Product ID')}</Th>
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('Created On')}</Th>
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('Status')}</Th>
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px" }}></Th>
                                                                </Tr>
                                                            </Thead>
                                                            <Tbody>
                                                                {this.state.getDisbursePendingList.map((lists, index) => (
                                                                    <Tr key={index} style={{
                                                                        marginBottom: "-10px", transition: 'none', cursor: 'default', color: "rgba(5,54,82,1)",
                                                                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", backgroundColor: (index % 2 === 0) ? 'rgba(255,255,255,1)' : 'rgba(242,242,242,1)'
                                                                    }}>
                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}>{lists.loanrequestnumber}</Td>
                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}>{lists.productid}</Td>
                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}>{lists.createdon &&
                                                                            <span>
                                                                                {
                                                                                    (() => {
                                                                                        const date = new Date(lists.createdon);
                                                                                        // Format the date to DD-MM-YYYY
                                                                                        const formattedDate = date.toLocaleDateString('en-GB'); // 'en-GB' formats as DD/MM/YYYY
                                                                                        return formattedDate.replace(/\//g, '-'); // Replace '/' with '-'
                                                                                    })()
                                                                                }
                                                                            </span>}</Td>
                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}>{lists.activitystatus === "1" ? "Pending"
                                                                            : lists.activitystatus === "2" ? "Approved"
                                                                                : lists.activitystatus === "3" ? "Rejected" : "-"}</Td>
                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}>
                                                                            <button className='btn btn-sm text-white' style={{ backgroundColor: "rgb(0, 121, 191)" }} onClick={this.initialDisbursement.bind(this, lists)}>Disburse</button>
                                                                            {/* <FaEllipsisV style={{ fontSize: "26px" }}
                                                                                className="btn dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" />

                                                                            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton" style={{ marginLeft: "-160px" }}>
                                                                                <a className="dropdown-item" onClick={this.viewMoreDetails.bind(this, lists)}>More Details</a>

                                                                            </div> */}
                                                                        </Td>
                                                                    </Tr>
                                                                ))}
                                                            </Tbody>
                                                        </Table>
                                                        &nbsp;
                                                        {this.state.getDisbursePendingList.length > 1 &&
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

                    <button type="button" id="disburseModal" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal" style={{ display: "none" }}>
                        Disbursement details modal
                    </button>
                    <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="static">
                        <div class="modal-dialog" role="document">
                            <div class="modal-content">
                                <div class="modal-body">
                                    <div className='row mb-2'>
                                        <div className='col-10'>
                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "600", paddingLeft: "8px" }}><img src={batch} style={{ width: "26px" }} /> &nbsp;Details</p>
                                            <hr style={{ width: "70px", marginTop: "-12px" }} />
                                        </div>
                                        <div className="col-2">
                                            <FaTimesCircle type="button" class="close" data-dismiss="modal" aria-label="Close" style={{ color: "rgb(5, 54, 82)", fontSize: "18px" }} />
                                        </div>
                                    </div>
                                    <div className="mb-2" style={{ border: "1.5px dashed rgb(81,164,219)", borderRadius: "5px", marginTop: "-10px", }}>
                                        <div className="row" >
                                            <div className="col" style={{ padding: "5px 35px", fontSize: "14px" }} >
                                                <div className="row">
                                                    <div className='col-sm-3 col-md-3 col-lg-4'>
                                                        <p className="mb-0 font-weight-bold" style={{ color: "#222C70", fontWeight: "450" }}>Loan Request No.</p>
                                                    </div>
                                                    <div className='col-sm-1 col-md-1 col-lg-1'>
                                                        <p className="mb-0 font-weight-bold" style={{ color: "#222C70" }}>:</p>
                                                    </div>
                                                    <div className='col-sm-6 col-md-6 col-lg-6'>
                                                        <p className="mb-0" style={{ color: "#222C70" }}>{this.state.loanreqNo}</p>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className='col-sm-3 col-md-3 col-lg-4'>
                                                        <p className="mb-0 font-weight-bold" style={{ color: "#222C70", fontWeight: "450" }}>Created On</p>
                                                    </div>
                                                    <div className='col-sm-1 col-md-1 col-lg-1'>
                                                        <p className="mb-0 font-weight-bold" style={{ color: "#222C70" }}>:</p>
                                                    </div>
                                                    <div className='col-sm-6 col-md-6 col-lg-6'>
                                                        <p className="mb-0" style={{ color: "#222C70" }}>
                                                            {this.state.createdon &&
                                                                <span>
                                                                    {
                                                                        (() => {
                                                                            const date = new Date(this.state.createdon);
                                                                            // Format the date to DD-MM-YYYY
                                                                            const formattedDate = date.toLocaleDateString('en-GB'); // 'en-GB' formats as DD/MM/YYYY
                                                                            return formattedDate.replace(/\//g, '-'); // Replace '/' with '-'
                                                                        })()
                                                                    }
                                                                </span>}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className='col-sm-3 col-md-3 col-lg-4'>
                                                        <p className="mb-0 font-weight-bold" style={{ color: "#222C70", fontWeight: "450" }}>Product ID</p>
                                                    </div>
                                                    <div className='col-sm-1 col-md-1 col-lg-1'>
                                                        <p className="mb-0 font-weight-bold" style={{ color: "#222C70" }}>:</p>
                                                    </div>
                                                    <div className='col-sm-6 col-md-6 col-lg-6'>
                                                        <p className="mb-0" style={{ color: "#222C70" }}>{this.state.productid}</p>
                                                    </div>
                                                </div>
                                                {this.state.updatedon !== null || this.state.updatedon !== "null" &&
                                                    <div className="row">
                                                        <div className='col-sm-3 col-md-3 col-lg-4'>
                                                            <p className="mb-0 font-weight-bold" style={{ color: "#222C70", fontWeight: "450" }}>Updated On</p>
                                                        </div>
                                                        <div className='col-sm-1 col-md-1 col-lg-1'>
                                                            <p className="mb-0 font-weight-bold" style={{ color: "#222C70" }}>:</p>
                                                        </div>
                                                        <div className='col-sm-6 col-md-6 col-lg-6'>
                                                            <p className="mb-0" style={{ color: "#222C70" }}>
                                                                {this.state.updatedon}

                                                            </p>
                                                        </div>
                                                    </div>
                                                }

                                                {this.state.performedby !== null || this.state.performedby !== "null" &&
                                                    <div className="row">
                                                        <div className='col-sm-3 col-md-3 col-lg-4'>
                                                            <p className="mb-0 font-weight-bold" style={{ color: "#222C70", fontWeight: "450" }}>Performed By</p>
                                                        </div>
                                                        <div className='col-sm-1 col-md-1 col-lg-1'>
                                                            <p className="mb-0 font-weight-bold" style={{ color: "#222C70" }}>:</p>
                                                        </div>
                                                        <div className='col-sm-6 col-md-6 col-lg-6'>
                                                            <p className="mb-0" style={{ color: "#222C70" }}>{this.state.performedby}</p>
                                                        </div>
                                                    </div>
                                                }

                                                <div className="row">
                                                    <div className='col-sm-3 col-md-3 col-lg-4'>
                                                        <p className="mb-0 font-weight-bold" style={{ color: "#222C70", fontWeight: "450" }}>Status</p>
                                                    </div>
                                                    <div className='col-sm-1 col-md-1 col-lg-1'>
                                                        <p className="mb-0 font-weight-bold" style={{ color: "#222C70" }}>:</p>
                                                    </div>
                                                    <div className='col-sm-6 col-md-6 col-lg-6'>
                                                        <p className="mb-0" style={{ color: "#222C70" }}>{this.state.status === "1" ? "Pending"
                                                            : this.state.status === "2" ? "Approved"
                                                                : this.state.status === "3" ? "Rejected" : "-"}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>


                                    <div className="mb-2 mt-2" style={{ border: "1.5px dashed rgb(81,164,219)", borderRadius: "5px", marginTop: "-10px", }}>
                                        <div className="row" style={{ padding: "10px" }}>
                                            <div className='col'>
                                                <p style={{ color: "rgba(5,54,82,1)", fontWeight: "500", marginBottom: "5px" }}>&nbsp;Status</p>
                                                <select
                                                    className="form-select"
                                                    onChange={this.approveStatus}
                                                    style={{
                                                        height: "37px",
                                                        backgroundColor: "rgb(247, 248, 250)",
                                                        borderRadius: "5px",
                                                        border: "none",
                                                        width: "100%"
                                                    }}
                                                >
                                                    <option defaultValue>Select</option>
                                                    <option value="1">Approve</option>
                                                    <option value="0">Reject</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mb-2 mt-2" style={{ border: "1.5px dashed rgb(81,164,219)", borderRadius: "5px", marginTop: "-10px", }}>
                                        <div className="row" style={{ padding: "10px" }}>
                                            <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold", fontSize: "14px", marginBottom: "5px" }}>Comment</p>
                                            <textarea
                                                type="text"
                                                className="form-control"
                                                onChange={this.reviewerdesc}
                                                rows={1}
                                                maxLength={255}
                                                placeholder="Enter here.."
                                                style={{
                                                    color: "rgb(5, 54, 82)",
                                                    backgroundColor: "rgb(247, 248, 250)",
                                                    borderRadius: "5px",
                                                    border: "none",
                                                    resize: "none",
                                                    marginLeft: "10px",
                                                    width: "calc(100% - 20px)", // Adjusted width to account for the border and padding
                                                    height: "100px"
                                                }}
                                            ></textarea>
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col' style={{ textAlign: "center" }}>
                                            <button type="button" class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.handleSubmit}>Submit</button>&nbsp;
                                            <button type="button" class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "#0079BF" }} >Cancel</button>
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

export default withTranslation()(DisbursementAprvl)