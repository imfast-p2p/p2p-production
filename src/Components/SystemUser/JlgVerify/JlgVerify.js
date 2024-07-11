import React, { Component } from 'react';
import $ from 'jquery';
import { BASEURL } from '../../assets/baseURL';
import SystemUserSidebar from "../SystemUserSidebar";
import { withTranslation } from 'react-i18next';
import { FaPlus } from "react-icons/fa";
import { FaCheckCircle, FaEllipsisV, FaAngleLeft, FaAngleDoubleRight, FaRegUser, FaEdit, FaMapMarkerAlt, FaHouseUser, FaUserEdit, FaFolderPlus, FaCalendar } from "react-icons/fa";
import dashboardIcon from '../../assets/icon_dashboard.png';
import { Link } from 'react-router-dom';
import openIt from '../../assets/AdminImg/openit.png'
import us from '../../assets/AdminImg/pro.png';
import editRole from '../../assets/editRole.png';
import ReactPaginate from 'react-paginate';
import '../../Borrower/Pagination.css';
import { confirmAlert } from "react-confirm-alert";
import pic3 from '../../assets/AdminImg/picture.png';
import sysUser from '../../assets/All.png';
import './Jlgverify.css';
import batch from '../../assets/batch.png';
import FacilitatorSidebar from '../../../SidebarFiles/FacilitatorSidebar';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'

var updatedStatus = 0;
export class JlgVerify extends Component {
    constructor(props) {
        super(props)
        this.state = {
            offset: 0,
            orgtableData: [],
            perPage: 10,
            currentPage: 0,
            pageCount: "",

            groupList: [],
            fullDetailsString: {},
            fullDetailsList: [],
            resMsg: "",

            groupName: "",
            groupDesc: "",
            footerFlag: true,

            checkStatus: 0,
            groupStatus: "",

            loginType: sessionStorage.getItem('userType')
        }
    }
    componentDidMount() {
        this.getGrouplist();
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
            groupList: slice
        })
    }
    selectMobileno = (event) => {
        this.setState({ selectedMobileno: event.target.value })
    }
    selectStatus = (event) => {
        updatedStatus = parseInt(event.target.value);
        this.setState({ checkStatus: event.target.value });
    }
    callStatus = () => {
        $("#managePermissionsModal").click();
    }
    getGrouplist = () => {
        let status = "status=" + updatedStatus;
        let mobileno = "mobileno=" + this.state.selectedMobileno;
        console.log(status, this.state.checkStatus);

        let url = BASEURL + '/usrmgmt/jlg/getgrouplist?';
        let params = "";
        if (this.state.checkStatus && this.state.selectedMobileno) {
            // Both status and mobileno are present
            params = status + "&" + mobileno;
        } else if (this.state.checkStatus && !this.state.selectedMobileno) {
            params = (this.state.checkStatus ? status : "")
        } else if (this.state.selectedMobileno && !this.state.checkStatus) {
            params = (this.state.selectedMobileno ? mobileno : "");
        }
        fetch(url + params, {
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
                if (resdata.status == "Success") {
                    if (resdata.msgdata) {
                        var list = resdata.msgdata;
                        list.sort((a, b) => {
                            return new Date(b.createdon).getTime() - new Date(a.createdon).getTime()
                        })
                        console.log(list);
                        var data = list;
                        console.log(data)
                        var slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
                        console.log(slice)

                        this.setState({
                            pageCount: Math.ceil(data.length / this.state.perPage),
                            orgtableData: data,
                            groupList: slice
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
                        this.setState({ resMsg: resdata.message })
                        $("#commonModal").click();
                        this.setState({ groupList: [] })
                    }
                }
            })
            .catch(err => {
                console.log(err.message)
            })
    }

    showFullDetails = (groupid, resolutiondocsignstatus, status) => {
        console.log(groupid, resolutiondocsignstatus);
        this.setState({ resolutionStatus: resolutiondocsignstatus });
        this.setState({ groupIntStatus: status })
        // var fullDetails = {
        //     "groupdesc": "imfast finfotech limited",
        //     "groupid": "JLG0000026",
        //     "groupname": "IMFAST",
        //     "createdon": "2023-11-08",
        //     "noofmembers": 2,
        //     "status": 0,
        //     "memberdetails": [
        //         {
        //             "memmid": 358,
        //             "name": "pallavi",
        //             "mobileno": "9844204926"
        //         },
        //         {
        //             "memmid": 388,
        //             "name": "Shashidhara",
        //             "mobileno": "8197635105"
        //         }
        //     ]
        // }
        // console.log(fullDetails);
        // this.setState({ fullDetailsString: fullDetails })
        // this.setState({ fullDetailsList: fullDetails.memberdetails })
        $('#viewFullDetailsModal').click()
        fetch(BASEURL + "/usrmgmt/jlg/getgroupfullinfo?groupId=" + groupid, {
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
                if (resdata.status == "Success") {
                    this.setState({ fullDetailsString: resdata.msgdata })
                    this.setState({ fullDetailsList: resdata.msgdata.memberdetails })
                    $('#viewFullDetailsModal').click();

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
                        $("#commonModal").click()
                    }
                }
            })
            .catch(err => {
                console.log(err.message)
            })
    }
    viewProfile = (memmid) => {
        let data1 = JSON.stringify({
            memmID: memmid,
            groupDetails: this.state.fullDetailsString,
            resolutionStatus: this.state.resolutionStatus
        })
        sessionStorage.setItem("pData", data1)
        window.location = "/verifyProfile";
    }
    updateStatus2 = () => {
        // var list = this.state.fullDetailsString;
        // console.log(list,
        //     list.groupdesc,
        //     list.groupid,
        //     list.groupname)
        // let data1 = JSON.stringify({
        //     groupID: list.groupid,
        //     groupName: list.groupname,
        //     groupDesc: list.groupdesc
        // })
        // sessionStorage.setItem("pData", data1)
        // window.location = "/approveGroup";
        this.setState({ footerFlag: false })
    }

    reviewComment = (event) => {
        this.setState({ reviewComment: event.target.value })
    }
    groupStatus = (event) => {
        this.setState({ groupStatus: event.target.value })
    }
    updateStatus = () => {
        // this.setState({ resMsg: "Success" })
        // $("#commonModal").click()
        var list = this.state.fullDetailsString;
        console.log(list,
            list.groupdesc,
            list.groupid,
            list.groupname)
        if (this.state.groupStatus === "" || null || undefined) {
            $("#exampleModalCenter5").hide()
            this.setState({ resMsg: "Status can not be empty, please select status." })
            $("#commonModal").click()
        } else {
            fetch(BASEURL + '/usrmgmt/jlg/setgroupstatus', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer " + sessionStorage.getItem('token')
                },
                body: JSON.stringify({
                    groupname: list.groupname,
                    status: parseInt(this.state.groupStatus),
                    reviewcomment: this.state.reviewComment
                })
            }).then(response => {
                console.log('Response:', response)
                return response.json();
            })
                .then((resdata) => {
                    if (resdata.status == 'Success') {
                        $("#exampleModalCenter5").hide()
                        this.setState({ resMsg: resdata.message })
                        $("#commonModal").click()
                    } else {
                        $("#exampleModalCenter5").hide()
                        console.log(resdata.message);
                        this.setState({ resMsg: resdata.message })
                        $("#commonModal").click()
                    }
                })
        }

    }
    reverBacktoMember = (event) => {
        this.setState({ footerFlag: true });
    }
    reloadPage = () => {
        if (this.state.resMsg.includes("Group approved successfully.")) {
            window.location.reload();
        } else if (this.state.resMsg.includes("failed")) {
            window.location.reload();
        } else if (this.state.resMsg.includes("Status can not be empty, please select status.")) {
            $('#viewFullDetailsModal').click();
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
        const { loginType } = this.state;
        return (
            <div className="container-dashboard d-flex flex-row" id="wrapper" style={{ backgroundColor: "#f4f7fc" }}>
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
                            <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                <Link to="/sysUserDashboard">Home</Link> / JLG Group List </p>
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
                    <hr className="col-11" style={{ marginLeft: "57px", width: "87%", marginTop: "-5px", backgroundColor: "rgba(4,78,160,1)" }} />
                    <div className='row' style={{ width: "93%", marginLeft: "40px", marginTop: "-10px" }}>
                        <div className='col' style={{ textAlign: "end" }}>
                            <button className='btn btn-sm text-white' style={{ backgroundColor: "rgb(0, 121, 191)" }} onClick={this.callStatus}>Select Status <FaAngleDoubleRight /></button>
                        </div>
                    </div>
                    {/* New Design */}

                    <div className='container-fluid row' style={{ paddingLeft: "82px", marginTop: "-10px" }}>
                        <div className='card' style={{ overflow: "auto" }}>
                            <div className='row pt-2'>
                                <div className='col'>
                                    <ul role="tablist" className="nav nav-pills nav-fill mb-3" >
                                        <li className="nav-item"> <a data-toggle="pill" href="#myEarning-details" className="nav-link active detailsTab"
                                            style={{ textAlign: "center", paddingTop: "10px", paddingBottom: "10px" }}>
                                            <img src={sysUser} style={{ width: "20px" }} /> &nbsp; {t('JLG Group List')} </a> </li>
                                    </ul>

                                </div>
                            </div>
                            <div className='row' style={{ marginTop: "-10px" }}>
                                <div className='col'>
                                    <div className='tab-content'>
                                        <div id="myEarning-details" className="register-form tab-pane fade show active" style={{ cursor: "default" }}>
                                            {this.state.groupList == "" ?
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
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('Group ID')}</Th>
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('Group Name')}</Th>
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('Group Description')}</Th>
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('Created On')}</Th>
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('Status')}</Th>
                                                                </Tr>
                                                            </Thead>
                                                            <Tbody>
                                                                {this.state.groupList.map((lists, index) => (
                                                                    <Tr key={index} style={{
                                                                        marginBottom: "-10px", transition: 'none', cursor: 'default', color: "rgba(5,54,82,1)",
                                                                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", backgroundColor: (index % 2 === 0) ? 'rgba(255,255,255,1)' : 'rgba(242,242,242,1)'
                                                                    }}>
                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}>{lists.groupid}</Td>
                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}>{lists.groupname}</Td>
                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}>{lists.groupdesc}</Td>
                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}>{lists.createdon.split("-").reverse().join("-")}</Td>
                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}>{lists.status == "0" ? <p style={{ color: "rgb(199, 188, 34)", fontWeight: "600", marginBottom: "-3px" }}>Inactive</p> :
                                                                            <>{lists.status == "1" ? <p style={{ color: "rgb(29, 143, 63)", fontWeight: "600", marginBottom: "-3px" }}>Approved</p> :
                                                                                <>{lists.status == "2" ? <p style={{ color: "rgb(240, 142, 67)", fontWeight: "600", marginBottom: "-3px" }}>Rejected</p> : ""}</>
                                                                            }
                                                                            </>
                                                                        }</Td>
                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "right", }}>
                                                                            <span className="dropdown">

                                                                                <FaEllipsisV style={{ fontSize: "26px" }}
                                                                                    className="btn dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" />
                                                                                &nbsp;
                                                                                <div className="dropdown-menu" aria-labelledby="dropdownMenuButton" style={{ marginLeft: "-160px" }}>
                                                                                    <a className="dropdown-item" onClick={this.showFullDetails.bind(this, lists.groupid, lists.resolutiondocsignstatus, lists.status)}>More Details</a>
                                                                                </div>
                                                                            </span>
                                                                        </Td>
                                                                    </Tr>
                                                                ))}
                                                            </Tbody>
                                                        </Table>
                                                        &nbsp;
                                                        {this.state.groupList.length > 0 &&
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

                    {/* view full details Modal */}
                    <button type="button" id='viewFullDetailsModal' style={{ display: "none" }} class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter5">
                        View Full Details Modal
                    </button>
                    <div class="modal fade" id="exampleModalCenter5" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered" role="document">
                            <div class="modal-content">
                                <div class="modal-body">
                                    <div className='row'>
                                        <div className='col'>
                                            {/* <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold", paddingLeft: "10px" }}><img src={addRole} width="25px" />Update Permissions</p>
                                            <hr style={{ width: "50px", marginTop: "-10px" }} /> */}
                                            <div className='row'>
                                                <div className='col' style={{ fontSize: "14px" }}>
                                                    <div className="card" style={{ borderRadius: "14px", cursor: "default" }}>
                                                        <div className='form-check mt-2' style={{ color: "rgb(5, 54, 82)" }}>
                                                            <div className='row'>
                                                                <div className='col-sm-4 col-md-4 col-lg-4'>
                                                                    <p className="mb-0 font-weight-bold">Group ID</p>
                                                                </div>
                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                </div>
                                                                <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                    <p className="mb-0">{this.state.fullDetailsString.groupid}</p>
                                                                </div>
                                                            </div>
                                                            <div className='row'>
                                                                <div className='col-sm-4 col-md-4 col-lg-4'>
                                                                    <p className="mb-0 font-weight-bold">Group Name</p>
                                                                </div>
                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                </div>
                                                                <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                    <p className="mb-0">{this.state.fullDetailsString.groupname}</p>
                                                                </div>
                                                            </div>
                                                            <div className='row'>
                                                                <div className='col-sm-4 col-md-4 col-lg-4'>
                                                                    <p className="mb-0 font-weight-bold">Group Description</p>
                                                                </div>
                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                </div>
                                                                <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                    <p className="mb-0">{this.state.fullDetailsString.groupdesc}</p>
                                                                </div>
                                                            </div>
                                                            <div className='row'>
                                                                <div className='col-sm-4 col-md-4 col-lg-4'>
                                                                    <p className="mb-0 font-weight-bold">Occupation</p>
                                                                </div>
                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                </div>
                                                                <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                    <p className="mb-0">{this.state.fullDetailsString.occupation}</p>
                                                                </div>
                                                            </div>
                                                            <div className='row'>
                                                                <div className='col-sm-4 col-md-4 col-lg-4'>
                                                                    <p className="mb-0 font-weight-bold">State</p>
                                                                </div>
                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                </div>
                                                                <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                    <p className="mb-0">{this.state.fullDetailsString.state}</p>
                                                                </div>
                                                            </div>
                                                            <div className='row'>
                                                                <div className='col-sm-4 col-md-4 col-lg-4'>
                                                                    <p className="mb-0 font-weight-bold">District</p>
                                                                </div>
                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                </div>
                                                                <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                    <p className="mb-0">{this.state.fullDetailsString.district}</p>
                                                                </div>
                                                            </div>
                                                            <div className='row'>
                                                                <div className='col-sm-4 col-md-4 col-lg-4'>
                                                                    <p className="mb-0 font-weight-bold">Taluk</p>
                                                                </div>
                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                </div>
                                                                <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                    <p className="mb-0">{this.state.fullDetailsString.taluk}</p>
                                                                </div>
                                                            </div>
                                                            <div className='row'>
                                                                <div className='col-sm-4 col-md-4 col-lg-4'>
                                                                    <p className="mb-0 font-weight-bold">Signing Status</p>
                                                                </div>
                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                </div>
                                                                <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                    {this.state.resolutionStatus == 1 ?
                                                                        <p className="mb-0" style={{ color: "rgb(179, 86, 29)" }}>Signing Initiated</p> :
                                                                        <span>{this.state.resolutionStatus == 2 ?
                                                                            <p className="mb-0" style={{ color: "rgb(235, 161, 52)" }}>Signing Pending</p> :
                                                                            <span>{this.state.resolutionStatus == 3 ?
                                                                                <p className="mb-0" style={{ color: "rgb(29, 179, 69)" }}>Signing Completed</p> :
                                                                                "Not Initiated"}</span>}</span>
                                                                    }
                                                                </div>
                                                            </div>
                                                            <div className='row'>
                                                                <div className='col-sm-4 col-md-4 col-lg-4'>
                                                                    <p className="mb-0 font-weight-bold">Created On</p>
                                                                </div>
                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                </div>
                                                                <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                    <p className="mb-0">{this.state.fullDetailsString.createdon ?
                                                                        this.state.fullDetailsString.createdon.split("-").reverse().join("-") : "-"
                                                                    }</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {this.state.footerFlag == true ?
                                                <div className='row'>
                                                    <div className='col' style={{ color: "rgba(5,54,82,1)" }}>
                                                        <p style={{ fontWeight: "500", fontSize: "14px", marginLeft: "34px", marginBottom: "4px" }}>{`Members(${this.state.fullDetailsString.noofmembers})`}</p>
                                                        <div className='row font-weight-normal' style={{ fontWeight: "800", fontSize: "15px", color: "rgba(5,54,82,1)", marginLeft: "10px" }}>
                                                            <div className='col-3'>
                                                                <p style={{ fontWeight: "600", marginLeft: "10px" }}>{t('Name')}</p>
                                                            </div>
                                                            <div className='col-2'>
                                                                <p style={{ fontWeight: "600", marginLeft: "3px" }}>{t('Signing')}</p>
                                                            </div>
                                                            <div className='col-4'>
                                                                <p style={{ fontWeight: "600", marginLeft: "-5px" }}>{t('Mobile Number')}</p>
                                                            </div>
                                                            <div className='col-3'>
                                                            </div>
                                                        </div>
                                                        <hr className="col-12" style={{ marginLeft: "16px", width: "85%", marginTop: "-15px", backgroundColor: "rgb(5, 54, 82)" }} />
                                                        <div className='scrollbar' style={{ marginTop: "-21px", height: "240px" }}>
                                                            {this.state.fullDetailsList.map((members, index) => {
                                                                return (
                                                                    <div className="col" key={index} style={{ marginBottom: "-10px" }}>
                                                                        <div className="card" style={{ borderRadius: "5px", cursor: "default" }}>
                                                                            <div className='form-check mt-2'>
                                                                                <div className='row'>
                                                                                    <div className='col-3' style={{
                                                                                        color: "rgb(5, 54, 82)",
                                                                                        fontWeight: "400", fontSize: "14px", fontStyle: "Poppins"
                                                                                    }}>
                                                                                        <span>{members.name}</span>
                                                                                    </div>
                                                                                    <div className='col-2' style={{
                                                                                        color: "rgb(5, 54, 82)",
                                                                                        fontWeight: "400", fontSize: "14px", fontStyle: "Poppins"
                                                                                    }}>
                                                                                        <p style={{ color: "rgb(179, 86, 29)", textWrap: "wrap", width: "70px" }}>{members.resolutiondocsignstatus == 1 ? "Initiated" :
                                                                                            <p style={{ color: "rgb(235, 161, 52)", textWrap: "wrap", width: "70px" }}>{members.resolutiondocsignstatus == 2 ? "Pending" :
                                                                                                <p style={{ color: "rgb(29, 179, 69)", textWrap: "wrap", width: "70px" }}>{members.resolutiondocsignstatus == 3 ? "Completed" : "Not Initiated"}
                                                                                                </p>}
                                                                                            </p>}
                                                                                        </p>
                                                                                    </div>
                                                                                    <div className='col-4' style={{
                                                                                        color: "rgb(5, 54, 82)",
                                                                                        fontWeight: "400", fontSize: "14px", fontStyle: "Poppins"
                                                                                    }}>
                                                                                        <span>{members.mobileno}</span>
                                                                                    </div>
                                                                                    <div className='col-3' style={{
                                                                                        color: "rgb(5, 54, 82)",
                                                                                        fontWeight: "400", fontSize: "14px", fontStyle: "Poppins"
                                                                                    }}>
                                                                                        <button className='btn btn-sm btn-success' style={{ marginLeft: "-23px", marginTop: "-7px" }} onClick={this.viewProfile.bind(this, members.memmid)}>View Profile</button>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            })}

                                                        </div>
                                                    </div>
                                                </div> :
                                                <div >
                                                    <div className='row'>
                                                        <div className="form-group col">
                                                            <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold", marginBottom: "1px", fontSize: "14px" }}>Status</p>
                                                            <select className='form-select' onChange={this.groupStatus} style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)" }}>
                                                                <option defaultValue>Select Status</option>
                                                                <option value="1">Approve</option>
                                                                <option value="2">Reject</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div className='row'>
                                                        <div className="form-group col">
                                                            <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold", marginBottom: "1px", fontSize: "14px" }}>Review Comment</p>
                                                            <textarea type="text" class="form-control" onChange={this.reviewComment}
                                                                rows={2} cols={30} maxLength={255}
                                                                placeholder="Review Comment" style={{ color: "rgb(5, 54, 82)", backgroundColor: "rgb(247, 248, 250)" }}>

                                                            </textarea>
                                                        </div>
                                                    </div>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                                {this.state.fullDetailsString.status != 1 && loginType === "1" ?
                                    <>
                                        {this.state.footerFlag == true ?
                                            <div className="modal-footer">
                                                {this.state.groupIntStatus !== "1" || this.state.groupIntStatus !== "2" ? <button id='agree' type="button" className="btn text-white btn-sm" style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.updateStatus2}>Update Status</button> :
                                                    <button id='agree' type="button" className="btn text-white btn-sm" style={{ backgroundColor: "rgb(136, 189, 72)" }} disabled>Update Status</button>}
                                                &nbsp;
                                                {/* <button id='agree' type="button" className="btn text-white btn-sm" style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.updateStatus2}>Update Status</button> */}
                                                &nbsp;
                                                <button id='disagree' type="button" class="btn text-white btn-sm" style={{ backgroundColor: "#0079BF" }} data-dismiss="modal">Cancel</button>
                                            </div> :
                                            <div className="modal-footer">
                                                <button id='agree' type="button" className="btn text-white btn-sm" style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.updateStatus}>Submit</button>
                                                &nbsp;
                                                <button id='disagree' type="button" class="btn text-white btn-sm" style={{ backgroundColor: "#0079BF" }} onClick={this.reverBacktoMember}>Cancel</button>
                                            </div>}
                                    </> : ""}

                            </div>
                        </div>
                    </div>

                    {/* managePermissions Modal */}
                    <button id='managePermissionsModal' style={{ display: "none" }} type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter">
                    </button>
                    <div className="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" data-backdrop="static">
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content" style={{ width: "300px", marginLeft: "100px" }}>
                                <div className="modal-body">
                                    <div className='row'>
                                        <div className='col'>
                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold" }}><img src={batch} width="25px" />Select</p>
                                            <hr style={{ width: "50px", marginTop: "-10px" }} />
                                            <span>
                                                <div className='mb-2'>
                                                    <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold", fontSize: "15px" }}>Enter Mobile Number</p>
                                                    <input type='number' className='form-control' maxLength={10} placeholder='Enter Mobile Number'
                                                        style={{ marginTop: "-15px" }} onChange={this.selectMobileno} />
                                                </div>
                                                <div className='mb-2'>
                                                    <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold", fontSize: "15px" }}>Select Status</p>
                                                    <select className='form-select' onChange={this.selectStatus} style={{ marginTop: "-15px" }}>
                                                        <option defaultValue>Select</option>
                                                        <option value="0">Not Approved</option>
                                                        <option value="1">Approved</option>
                                                        <option value="2">Rejected</option>
                                                    </select>
                                                </div>
                                            </span>
                                            <hr style={{ backgroundColor: "rgba(5,54,82,1)" }} />
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col' style={{ textAlign: "end" }}>
                                            <button type="button" class="btn text-white btn-sm" data-dismiss="modal"
                                                style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.getGrouplist}>Submit</button>
                                            &nbsp;
                                            <button type="button" class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "#0079BF" }}>Cancel</button>
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
                </div>
            </div>
        )
    }
}

export default withTranslation()(JlgVerify)