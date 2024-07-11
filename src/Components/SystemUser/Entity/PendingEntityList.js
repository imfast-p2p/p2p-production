import React, { Component } from 'react';
import $ from 'jquery';
import { BASEURL } from '../../assets/baseURL';
import SystemUserSidebar from "../SystemUserSidebar";
import { withTranslation } from 'react-i18next';
import { FaRegFileAlt, FaAngleLeft, FaFileAlt, FaEllipsisV } from "react-icons/fa";
import dashboardIcon from '../../assets/icon_dashboard.png';
import { Link } from 'react-router-dom';
import openIt from '../../assets/AdminImg/openit.png'
// import us from '../../assets/AdminImg/pro.png';
// import editRole from '../../assets/editRole.png';
import ReactPaginate from 'react-paginate';
import '../../Borrower/Pagination.css';
import { confirmAlert } from "react-confirm-alert";
import batch from '../../assets/batch.png';
import "jspdf-autotable";
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'

export class PendingEntityList extends Component {
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
            showLoader: false,
            PendingEntityList: [],
            entityid: "",
            entityDetailsList: {},
            entityMembers: [],
            loading: true,
            error: null,
            status1: "",
            status1Comments: "",
            entityname: "",
            entityStatus: '',
            KYCstatus: false
        }
        this.selRef1 = React.createRef();
        this.textareaRef = React.createRef();
    }
    componentDidMount() {
        this.getPendingEntityList()
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
            PendingEntityList: slice
        })
    }
    getPendingEntityList() {
        // this.setState({
        //     PendingEntityList: [
        //         {
        //             "entityid": "E01",                    //String(20)
        //             "entityname": "Partnership Group",          //String(30)
        //             "entitytype": "2",                    //String(1)
        //             "contactpersonname": "Shashidhara c",  //String(100)
        //             "contactpersonemail": "shashidharac@gmail.com", //String(100)
        //             "contactpersonmobileno": "987654321"       //String(12)
        //         },
        //         {
        //             "entityid": "E02",                    //String(20)
        //             "entityname": "New group",          //String(30)
        //             "entitytype": "1",                    //String(1)
        //             "contactpersonname": "Shashidhara c",  //String(100)
        //             "contactpersonemail": "shashidharac@gmail.com", //String(100)
        //             "contactpersonmobileno": "987654321"       //String(12)
        //         },
        //         {
        //             "entityid": "E03",                    //String(20)
        //             "entityname": "Group ABC",          //String(30)
        //             "entitytype": "1",                    //String(1)
        //             "contactpersonname": "Shashidhara c",  //String(100)
        //             "contactpersonemail": "shashidharac@gmail.com", //String(100)
        //             "contactpersonmobileno": "987654321"       //String(12)
        //         },
        //         {
        //             "entityid": "E04",                    //String(20)
        //             "entityname": "D Group",          //String(30)
        //             "entitytype": "2",                    //String(1)
        //             "contactpersonname": "Shashidhara c",  //String(100)
        //             "contactpersonemail": "shashidharac@gmail.com", //String(100)
        //             "contactpersonmobileno": "987654321"       //String(12)
        //         }
        //     ]
        // })
        var url = `/usrmgmt/getpendingentitylist`
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
                        PendingEntityList: slice
                    })
                } else {
                    alert("Issue: " + resdata.message);
                }
            })
            .catch(err => {
                console.log(err.message)
            })
    }
    getEntityDetails() {
        var url = `/usrmgmt/getentitydetails?entityid=${this.state.entityid}&status=${this.state.entityStatus} `
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
                    this.setState({ entityDetailsList: resdata.msgdata })

                } else {
                    alert("Issue: " + resdata.message);
                }
            })
            .catch(err => {
                console.log(err.message)
            })
        this.getEntityMembers()
    }
    getEntityMembers = () => {
        var url = `/usrmgmt/getentitymembers?entityid=${this.state.entityid}&status=${this.state.entityStatus} `
        this.setState({ showLoader: true })
        fetch(BASEURL + url, {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            }
        })
            .then(response => response.json())
            .then((data) => {
                if (data.status === 'Success') {
                    this.setState({
                        entityMembers: data.msgdata.entitymemberinfo,
                        loading: false
                    }, () => {
                        this.checkKYCStatus(data.msgdata.entitymemberinfo)
                    });
                } else {
                    this.setState({
                        error: data.message,
                        loading: false
                    });
                    confirmAlert({
                        message: data.message,
                        buttons: [
                            {
                                label: "OK",
                                onClick: () => {
                                    // Add any action if needed on failure
                                },
                            },
                        ],
                    });
                }
            })
            .catch((error) => {
                console.error("Error fetching entity members:", error);
                this.setState({
                    error: "Failed to fetch entity members",
                    loading: false
                });
                confirmAlert({
                    message: "Failed to fetch entity members",
                    buttons: [
                        {
                            label: "OK",
                            onClick: () => {
                                // Add any action if needed on network error
                            },
                        },
                    ],
                });
            });
    };
    viewDetails = (entityid, status) => {


        $("#entityModal").click();
        console.log(entityid)
        this.setState({
            entityid: entityid,
            entityStatus: status
        }, () => {
            console.log(this.state.entityid)
            console.log(this.state.entityStatus)
            this.getEntityDetails()
        })

    }
    gotoDocVerfn = (entityId) => {
        console.log(entityId)
        sessionStorage.setItem('entityId', entityId)
        window.location = '/ovdPendingStatus';

    }
    // viewEntityMembers = (entityId) => {
    //     this.getEntityMembers()

    //     $("#entityMemModal").click();
    //     console.log(entityId)
    //     this.setState({
    //         entityid: entityId,
    //     }, () => {
    //         console.log(this.state.entityid)
    //     })

    // }
    // approveStatus = (entityId, entityName) => {
    //     this.setState({
    //         entityid: entityId,
    //         entityname: entityName
    //     }, () => {
    //         $("#statusModal").click()
    //     })
    // }
    statusName = (event) => {
        this.setState({ status1: event.target.value })
    }
    statusComments = (event) => {
        this.setState({ status1Comments: event.target.value })
    }
    updateStatus = () => {
        var Result = JSON.stringify({
            entityid: this.state.entityid,
            status: this.state.status1,
            // ...((this.state.status1==="2"?comment:this.state.status1Comments))
        });
        if (this.state.status1Comments && this.state.status1 === "2") {
            Result.comment = this.state.status1Comments
        }
        console.log(Result)
        fetch(BASEURL + `/usrmgmt/setpendingentitystatus`, {
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
                    $('#exampleModal13').modal('hide');
                    confirmAlert({
                        message: resdata.message,
                        buttons: [
                            {
                                label: "OK",
                                onClick: () => {
                                    this.getPendingEntityList()
                                },
                            },
                        ],
                        closeOnClickOutside: false,
                    });
                } else {
                    if (resdata.code === '0102') {
                        $('#exampleModal13').modal('hide');
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
                        $('#exampleModal13').modal('hide');
                        this.setState({ resMsg: resdata.message })
                        // $("#commonModal").click();
                    }
                }
            })
            .catch(err => {
                console.log(err.message)
            })
    }
    clearStatus = () => {
        console.log("clear")
        $(this.selRef1.current).val('');
        this.textareaRef.current.value = '';
        this.setState({
            status1: "",
            status1Comments: ""
        })
    }
    checkKYCStatus = (members) => {
        const KYCstatus = members.every(member => member.kycverified === "1");
        this.setState({ KYCstatus }); // Update the state with the new KYCstatus value
        return KYCstatus;
    };
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
        const { entityDetailsList, KYCstatus } = this.state;
        console.log(entityDetailsList)
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
            <div className="container-dashboard d-flex flex-row" id="wrapper" style={{ backgroundColor: "#f4f7fc", marginTop: "-7px" }}>
                < SystemUserSidebar />
                <div className="pl-3 pr-3 main-content" id="page-content-wrapper">
                    <div className="container-fluid row pt-2">
                        <div className="col-1" id="ProductDefRes1">
                            <button style={{ marginLeft: "25px" }} onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className='col-4' id="ProductDefRes2" style={{ marginLeft: "20px", marginTop: "5px" }}>
                            <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                <Link to="/sysUserDashboard">Home</Link> / Entity List</p>
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
                    <div className='container-fluid row' style={{ paddingLeft: "82px", marginTop: "-26px" }}>
                        <div className='card' style={{ overflow: "auto" }}>
                            <div className='row pt-2'>
                                <div className='col'>
                                    <ul role="tablist" className="nav nav-pills nav-fill mb-3" >
                                        <li className="nav-item"> <a data-toggle="pill" href="#myEarning-details" className="nav-link active detailsTab"
                                            style={{ textAlign: "center", paddingTop: "10px", paddingBottom: "10px", cursor: "default" }}>
                                            <FaFileAlt />&nbsp; {t('Entity List')} </a> </li>
                                    </ul>

                                </div>
                            </div>
                            <div className='row' style={{ marginTop: "-10px" }}>
                                <div className='col'>
                                    <div className='tab-content'>
                                        <div id="myEarning-details" className="register-form tab-pane fade show active" style={{ cursor: "default" }}>
                                            {this.state.PendingEntityList == "" ?
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
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('Entity Name')}</Th>
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('Entity Type')}</Th>
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('Contact Person')}</Th>
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('Email ID')}</Th>
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('Mobile No.')}</Th>
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px" }}></Th>
                                                                </Tr>
                                                            </Thead>
                                                            <Tbody>
                                                                {this.state.PendingEntityList.map((lists, index) => (
                                                                    <Tr key={index} style={{
                                                                        marginBottom: "-10px", transition: 'none', cursor: 'default', color: "rgba(5,54,82,1)",
                                                                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", backgroundColor: (index % 2 === 0) ? 'rgba(255,255,255,1)' : 'rgba(242,242,242,1)'
                                                                    }}>
                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}>{lists.entityname}</Td>
                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}>{lists.entitytype === "1" ? "Proprietorship" : lists.entitytype === "2" ? "Partnership" : ""}</Td>
                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}>{lists.contactpersonname}</Td>
                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}>{lists.contactpersonemail}</Td>
                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}>{lists.contactpersonmobileno}</Td>
                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "right" }}>

                                                                            <span className="dropdown">

                                                                                <FaEllipsisV style={{ fontSize: "26px" }}
                                                                                    className="btn dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" />
                                                                                &nbsp;
                                                                                <div className="dropdown-menu" aria-labelledby="dropdownMenuButton" style={{ marginLeft: "-160px" }}>
                                                                                    <a className="dropdown-item" onClick={this.viewDetails.bind(this, lists.entityid, lists.status)}>More Details</a>
                                                                                    <a className="dropdown-item" onClick={this.gotoDocVerfn.bind(this, lists.entityid)}>Document Verification</a>
                                                                                    {/* <a className="dropdown-item" onClick={() => this.viewEntityMembers(lists.entityid)}>Entity Members</a> */}
                                                                                    {/* <a className="dropdown-item" onClick={() => this.approveStatus(lists.entityid, lists.entityname)}>Approve Status</a> */}

                                                                                </div>
                                                                            </span>

                                                                        </Td>
                                                                    </Tr>
                                                                ))}
                                                            </Tbody>
                                                        </Table>
                                                        &nbsp;
                                                        {this.state.PendingEntityList.length > 1 &&
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


                    {/* Modal */}
                    <button type="button" id="entityModal" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal13" style={{ display: "none" }}>
                        Entity Details Modal
                    </button>
                    <div class="modal fade bd-example-modal-lg" id="exampleModal13" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true" data-backdrop="static">
                        <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
                            <div class="modal-content">

                                <div class="modal-body">
                                    <div className='row'>
                                        <button type="button" class="close" data-dismiss="modal" style={{ textAlign: "end", marginTop: "-15px", marginLeft: "-5px" }} aria-label="Close">
                                            <span aria-hidden="true">&times;</span>
                                        </button>
                                    </div>

                                    <div className='row'>
                                        <div className='col'>
                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "500" }}><FaRegFileAlt style={{ fontSize: "20px" }} />Entity Details</p>
                                            <hr style={{ width: "70px", marginTop: "-10px" }} />

                                            {/* Updated */}
                                            {/* <p className="font-weight-bold" style={{ color: "rgba(5,54,82,1)", fontSize: "14px", marginTop: "-10px" }}>Entity Details</p> */}
                                            <div className='card border-0' style={{ cursor: "default", marginTop: "-10px" }}>
                                                {entityDetailsList && entityDetailsList === "" ?

                                                    <div className="row mt-2" style={{ marginLeft: "6px" }}>
                                                        <div className="col text-center" style={{ color: "#222C70", fontSize: "14px", fontWeight: "500" }}>
                                                            <p>No lists available.</p>
                                                        </div>
                                                    </div>
                                                    :
                                                    <div style={{ border: "1px solid rgb(0, 121, 191)", borderRadius: "5px" }}>
                                                        <div className='row p-2'>
                                                            {Object.keys(entityDetailsList)
                                                                .filter(key =>
                                                                    (key === "entityname" ||
                                                                        key === "entityaddress" ||
                                                                        key === "status" ||
                                                                        key === "entitytype" ||
                                                                        key === "gstn" ||
                                                                        key === "entitypan" ||
                                                                        key === "cin" ||
                                                                        key === "createdby" ||
                                                                        key === "approvedby" ||
                                                                        key === "approvedon" ||
                                                                        key === "createdon" ||
                                                                        key === "pincode") &&
                                                                    entityDetailsList[key] !== ""
                                                                )
                                                                .map((key, index) => {
                                                                    let value = entityDetailsList[key];
                                                                    if (key === "status" && value) {
                                                                        value = value === "1" ? "Active" : "Not active";
                                                                    }
                                                                    if (key === "entitytype" && value) {
                                                                        value = value === "1" ? "Proprietorship" : value === "2" ? "Partnership" : "";
                                                                    }
                                                                    if (key === "approvedon" && value) {
                                                                        value = value.split("-").reverse().join("-")
                                                                    }
                                                                    if (key === "createdon" && value) {
                                                                        // Extract only the date part from the string
                                                                        const datePart = value.split(" ")[0];
                                                                        const date = new Date(datePart);
                                                                        if (!isNaN(date)) {
                                                                            // Format the date to DD-MM-YYYY
                                                                            value = date.toLocaleDateString('en-GB').replace(/\//g, '-');
                                                                        } else {
                                                                            value = "Invalid Date";
                                                                        }
                                                                    }
                                                                    return (
                                                                        <div className='col-lg-6 col-sm-12' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }} key={index}>
                                                                            <div className='row'>
                                                                                <div className='col-sm-4 col-md-4 col-lg-4'>
                                                                                    <p className="mb-0 font-weight-bold" style={{ width: "max-content" }}>
                                                                                        {key === "entityname" ? "Entity Name" :
                                                                                            key === "entityaddress" ? "Entity Address" :
                                                                                                key === "status" ? "Status" :
                                                                                                    key === "entitytype" ? "Entity Type" :
                                                                                                        key === "gstn" ? "GSTN Number" :
                                                                                                            key === "entitypan" ? "Entity PAN" :
                                                                                                                key === "cin" ? "CIN" :
                                                                                                                    key === "createdby" ? "Created By" :
                                                                                                                        key === "approvedby" ? "Approved By" :
                                                                                                                            key === "approvedon" ? "Approved On" :
                                                                                                                                key === "createdon" ? "Created On" :
                                                                                                                                    key === "pincode" ? "PIN Code" : key}
                                                                                    </p>
                                                                                </div>
                                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                                </div>
                                                                                <div className='col-sm-7 col-md-7 col-lg-7'>
                                                                                    <p className="mb-0">{value}</p>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })}

                                                        </div>
                                                    </div>

                                                }
                                            </div>
                                        </div>
                                    </div>

                                    <div className='row'>
                                        <div className='col'>
                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "500" }}><FaRegFileAlt style={{ fontSize: "20px" }} />Entity Member Details</p>
                                            <hr style={{ width: "70px", marginTop: "-10px" }} />

                                            {/* Updated */}
                                            {/* <p className="font-weight-bold" style={{ color: "rgba(5,54,82,1)", fontSize: "14px", marginTop: "-10px" }}>Entity Details</p> */}
                                            <div className='card border-0' style={{ cursor: "default", marginTop: "-10px" }}>
                                                <div style={{ border: "1px solid rgb(0, 121, 191)", borderRadius: "5px" }}>
                                                    {this.state.entityMembers == "" ?
                                                        <div className="row mt-2" style={{ marginLeft: "6px" }}>
                                                            <div className="col text-center" style={{ color: "#222C70", fontSize: "14px", fontWeight: "500" }}>
                                                                <p>No lists available.</p>
                                                            </div>
                                                        </div> :
                                                        <>
                                                            <div style={{ whiteSpace: "nowrap" }} id='secondAuditScroll'>
                                                                <Table responsive>
                                                                    <Thead>
                                                                        <Tr style={{ fontSize: "14px", color: "rgba(5,54,82,1)", paddingLeft: "6px" }}>
                                                                            <Th style={{ fontWeight: "bold", marginTop: "5px" }}>{t('Name')}</Th>
                                                                            <Th style={{ fontWeight: "bold", marginTop: "5px" }}>{t('Mobile No.')}</Th>
                                                                            <Th style={{ fontWeight: "bold", marginTop: "5px" }}>{t('Email ID')}</Th>
                                                                            <Th style={{ fontWeight: "bold", marginTop: "5px" }}>{t('PAN')}</Th>
                                                                            <Th style={{ fontWeight: "bold", marginTop: "5px" }}>{t('KYC Status')}</Th>
                                                                            <Th style={{ fontWeight: "bold", marginTop: "5px" }}>{t('Designation')}</Th>

                                                                        </Tr>
                                                                    </Thead>
                                                                    <Tbody>
                                                                        {this.state.entityMembers.map((lists, index) => (
                                                                            <Tr key={index} style={{
                                                                                marginBottom: "-10px", transition: 'none', cursor: 'default', color: "rgba(5,54,82,1)",
                                                                                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", backgroundColor: (index % 2 === 0) ? 'rgba(255,255,255,1)' : 'rgba(242,242,242,1)'
                                                                            }}>
                                                                                <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}>{lists.name}</Td>
                                                                                <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}>{lists.mobileno}</Td>
                                                                                <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}>{lists.email}</Td>
                                                                                <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}>{lists.pan}</Td>
                                                                                <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}> {lists.kycverified === "1" || lists.kycverified === "9" ? "Verified" : lists.kycverified === "0" ? "Not Verified" : ""}</Td>
                                                                                <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}>{lists.designation}</Td>
                                                                            </Tr>
                                                                        ))}
                                                                    </Tbody>
                                                                </Table>
                                                                &nbsp;
                                                                {/* {this.state.entityMembers.length > 1 &&
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
                                                            </div>} */}
                                                            </div>
                                                        </>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <p style={{ color: "rgba(5,54,82,1)", fontWeight: "500" }}><FaRegFileAlt style={{ fontSize: "20px" }} />Update Status</p>
                                    <hr style={{ width: "70px", marginTop: "-10px" }} />
                                    {KYCstatus === true ?
                                        <>
                                            <div className='row' style={{ marginTop: "-15px" }}>

                                                <div className='col'>
                                                    <p style={{ color: "rgba(5,54,82,1)", fontWeight: "500" }}>&nbsp;
                                                        Comments (Mandatory if rejected)
                                                    </p>
                                                    <textarea type="text" ref={this.textareaRef} style={{ backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }} className="form-control" onChange={this.statusComments}
                                                        placeholder="Enter Comments" rows={3} cols={30} maxLength={255}>
                                                    </textarea>
                                                </div>
                                                <div className='col'>
                                                    <p style={{ color: "rgba(5,54,82,1)", fontWeight: "500" }}>&nbsp;Status *</p>
                                                    <select ref={this.selRef1} style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }} className="form-select" onChange={this.statusName} >
                                                        <option defaultValue>Select</option>
                                                        <option value="1">Approve</option>
                                                        <option value="2">Reject</option>
                                                    </select>
                                                </div>

                                            </div>

                                            <div class="modal-footer">
                                                <div className='row'>
                                                    <div className='col' style={{ paddingTop: "20px", textAlign: "end" }}>
                                                        <button className='btn btn-sm text-white' id="assignHierarchyBtn" style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.updateStatus}>Submit</button>
                                                        &nbsp;
                                                        <button className='btn btn-sm text-white' style={{ backgroundColor: "#0079BF" }} onClick={this.clearStatus} data-dismiss="modal">Cancel</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </> :
                                        <div className='row'>
                                            <div className='col' style={{ marginTop: "-10px" }}>
                                                <p style={{ color: "#222C70", fontFamily: "Poppins, sans-serif", fontSize: "13px" }}>
                                                    Please note: KYC verification is pending for some members. Please verify the KYC details of all members before approving the entity.
                                                </p>
                                            </div>
                                        </div>}

                                </div>


                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withTranslation()(PendingEntityList)