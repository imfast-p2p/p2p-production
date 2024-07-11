import React, { Component } from 'react';
import $, { param } from 'jquery';
import { BASEURL } from '../assets/baseURL';
import SystemUserSidebar from "./SystemUserSidebar";
import { withTranslation } from 'react-i18next';
import {FaFileAlt,  FaAngleLeft,   
} from "react-icons/fa";
import dashboardIcon from '../assets/icon_dashboard.png';
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import '../Borrower/Pagination.css';
import { confirmAlert } from "react-confirm-alert";
import "jspdf-autotable";
import Loader from '../Loader/Loader';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'

export class SupplierList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            offset: 0,
            orgtableData: [],
            perPage: 10,
            currentPage: 0,
            pageCount: "",
            list: [],
            pdfBtn: false,
            resMsg: "",
            userID: sessionStorage.getItem('userID'),
            pmID: "",
            supplierLists: [],

        }
    }
    componentDidMount() {
        this.getSupplierList()
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
            supplierLists: slice
        })
    }
    getSupplierList = () => {
        fetch(BASEURL + "/lms/getsupplierlist", {
            method: "GET",
            headers: {
                Authorization: "Bearer " + sessionStorage.getItem("token"),
            },
        })
            .then((response) => {
                console.log("Response:", response);
                return response.json();
            })
            .then((resdata) => {
                console.log(resdata);
                if (resdata.status == "Success" || resdata.status == "SUCCESS") {
                    // this.setState({ supplierLists: resdata.msgdata })
                    this.setState({ showLoader: false })

                    var data = resdata.msgdata
                    console.log(data)
                    var slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
                    console.log(slice)

                    this.setState({
                        pageCount: Math.ceil(data.length / this.state.perPage),
                        orgtableData: data,
                        supplierLists: slice
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
                        this.setState({ resMsg: resdata.message })
                    }
                }
            })
            .catch(err => {
                console.log(err.message)
            })
    }
    downloadStmt(supplierid) {
        console.log(supplierid);
        // sessionStorage.setItem("stmtid", stmtid);
        this.downloadSupplierAgreement(supplierid);
    }
    downloadSupplierAgreement = (supplierid) => {
        console.log("Supplier ID:", supplierid);

        if (!supplierid) {
            console.error("Failure: Supplier ID should not be empty");
            $('.bd-example-modal-lg').modal('show');
            return;
        }

        fetch(BASEURL + "/lms/downloadsupplieragreement?supplierid=" + supplierid, {
            headers: {
                'Authorization': "Bearer " + sessionStorage.getItem('token'),
            },
            method: 'GET',
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("No matching documents or other error occurred");
                }
                return response.blob();
            })
            .then((responseBlob) => {
                // $('.bd-example-modal-lg').modal('hide');
                $("#launchColl11").click();
                console.log('Response:', responseBlob);

                var collFile = new Blob([responseBlob], { type: 'application/pdf' });
                console.log(collFile);

                var collfileURL = URL.createObjectURL(collFile);
                console.log(collfileURL);

                document.getElementsByClassName('PDFdoc1')[0].src = collfileURL + "#zoom=100";
            })
            .catch((error) => {
                console.error("Error:", error.message);
                // $('.bd-example-modal-lg').modal('show');
                $('.bd-example-modal-lg211').modal('hide');
            });
    };

    backToStmtModal = () => {
        // $('.bd-example-modal-lg').modal('show');
        $('.bd-example-modal-lg211').modal('hide')
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
            <div className="container-dashboard d-flex flex-row" style={{ backgroundColor: "#f4f7fc", marginTop: "-7px" }}>
                {
                    this.state.showLoader && <Loader />
                }
                < SystemUserSidebar />
                <div className="pl-3 pr-3 main-content" style={{ width: "100%" }}>
                    <div className="container-fluid row pt-2">
                        <div className="col-1" id="ProductDefRes1">
                            <button style={{ marginLeft: "25px" }} onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className='col-4' id="ProductDefRes2" style={{ marginLeft: "20px", marginTop: "5px" }}>
                            <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                <Link to="/sysUserDashboard">Home</Link> / Supplier List</p>
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
                    {/* New Design */}
                    <div className='container-fluid row' style={{ paddingLeft: "82px", marginTop: "-26px" }}>
                        <div className='card' style={{overflow:"auto"}}>
                            <div className='row pt-2'>
                                <div className='col'>
                                    <ul role="tablist" className="nav nav-pills nav-fill mb-3" >
                                        <li className="nav-item"> <a data-toggle="pill" href="#myEarning-details" className="nav-link active detailsTab"
                                            style={{ textAlign: "center", paddingTop: "10px", paddingBottom: "10px" }}>
                                            <FaFileAlt />&nbsp; {t('Supplier List')} </a> </li>
                                    </ul>

                                </div>
                            </div>
                            <div className='row' style={{ marginTop: "-10px" }}>
                                <div className='col'>
                                    <div className='tab-content'>
                                        <div id="myEarning-details" className="register-form tab-pane fade show active" style={{ cursor: "default" }}>
                                            {this.state.supplierLists == "" ?
                                                <div className="row mt-2" style={{ marginLeft: "6px" }}>
                                                    <div className="col text-center" style={{ color: "#222C70", fontSize: "14px", fontWeight: "500" }}>
                                                        <p>No lists available.</p>
                                                    </div>
                                                </div> :
                                                <>
                                                    <div style={{ whiteSpace: "nowrap" }} id='secondAuditScroll'>
                                                        <Table responsive>
                                                            <Thead>
                                                                <Tr style={{ fontSize: "15px", color: "rgba(5,54,82,1)", paddingLeft: "6px" }}>
                                                                    <Th style={{  fontWeight: "600", marginTop: "5px" }}>{t('Supplier Name')}</Th>
                                                                    <Th style={{  fontWeight: "600", marginTop: "5px" }}>{t('Supplier Description')}</Th>
                                                                    <Th style={{  fontWeight: "600", marginTop: "5px" }}></Th>
                                                                </Tr>
                                                            </Thead>
                                                            <Tbody>
                                                                {this.state.supplierLists.map((lists, index) => (
                                                                    <Tr key={index} style={{ marginBottom: "-10px", transition: 'none', cursor: 'default', 
                                                                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", backgroundColor: (index % 2 === 0) ? 'rgba(255,255,255,1)' : 'rgba(242,242,242,1)' }}>
                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}>{lists.suppliername}</Td>
                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}>{lists.supplierdesc}</Td>
                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "right",}}>
                                                                            <button className='btn btn-sm text-white' onClick={this.downloadStmt.bind(this, lists.supplierid)} style={{ backgroundColor: "rgb(0, 121, 191)" }}>View</button>
                                                                        </Td>
                                                                    </Tr>
                                                                ))}
                                                            </Tbody>
                                                        </Table>
                                                        &nbsp;
                                                        {this.state.supplierLists.length > 1 &&
                                                            <div className="row justify-content-end">
                                                                <div className='col-auto'>
                                                                    <div className='card border-0' style={{ height: "40px" }}>
                                                                        <div style={{ marginTop: "-25px", marginLeft:"16px" }}>
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
                                                style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.reloadPage}>Okay</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* Pdf preview */}
                    <button type="button" id='launchColl11' style={{ display: "none" }} class="btn btn-primary" data-toggle="modal" data-target=".bd-example-modal-lg211">Large modal</button>
                    <div class="modal fade bd-example-modal-lg211" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel2" aria-hidden="true">
                        <div class="modal-dialog modal-lg">
                            <div class="modal-content">
                                <div className='modal-body'>
                                    <iframe src="" className="PDFdoc1" type="application/pdf" style={{ overflow: "auto", height: "80vh", width: "100%" }}>

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

export default withTranslation()(SupplierList)