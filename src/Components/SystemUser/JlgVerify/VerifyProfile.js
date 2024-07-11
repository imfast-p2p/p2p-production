import React, { Component } from 'react';
import $ from 'jquery';
import { BASEURL } from '../../assets/baseURL';
import SystemUserSidebar from "../SystemUserSidebar";
import { withTranslation } from 'react-i18next';
import { FaPlus } from "react-icons/fa";
import { FaCheckCircle, FaTimesCircle, FaAngleLeft, FaThumbsUp, FaRegUser, FaEdit, FaMapMarkerAlt, FaHouseUser, FaUserEdit, FaFolderPlus, FaCalendar, FaFileDownload } from "react-icons/fa";
import dashboardIcon from '../../assets/icon_dashboard.png';
import { Link } from 'react-router-dom';
import openIt from '../../assets/AdminImg/openit.png'
import us from '../../assets/AdminImg/pro.png';
import editRole from '../../assets/editRole.png';
import ReactPaginate from 'react-paginate';
import '../../Borrower/Pagination.css';
import { confirmAlert } from "react-confirm-alert";

var permanentaddress = {};
var presentaddress = {};
export class VerifyProfile extends Component {

    constructor(props) {
        super(props)

        this.state = {
            pdocsNum: "",
            pdocsID: "",
            TnCdocumentFlag: false,
            resMsg: "",

            memmId: "",
            groupdetails: {},
            personalDetailList: [],
            accountDetails: {},
            addressDetails: [],
            permanentDetails: {},
            presentDetails: {},
            resolutionStatus: 0
        }
    }
    componentDidMount = () => {
        console.log(sessionStorage.getItem("pData"));
        var data = sessionStorage.getItem("pData");
        var parsedData = JSON.parse(data);
        console.log(parsedData);
        this.setState({ memmId: parsedData.memmID });
        this.setState({ groupdetails: parsedData.groupDetails });
        this.setState({ resolutionStatus: parsedData.resolutionStatus })

        console.log(parsedData.memmID)
        this.getPersonalDetails(parsedData.memmID)
        this.getAddressDetails(parsedData.memmID)
        this.getBankDetails(parsedData.memmID)

    }
    getPersonalDetails = (memmid) => {
        fetch(BASEURL + '/usrmgmt/getpersonaldetails', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                memmid: memmid,
            })
        }).then((Response) => Response.json())
            .then((resdata) => {
                if (resdata.status === 'Success') {
                    this.setState({ personalDetailList: resdata.msgdata.attributes })
                }
                else {
                    this.setState({ resMsg: resdata.message })
                    $("#commonModal").click()
                }
            })
    }
    getAddressDetails = (memmid) => {
        fetch(BASEURL + '/usrmgmt/getaddressdetails', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                memmid: memmid,
            })
        }).then((Response) => Response.json())
            .then((resdata) => {
                if (resdata.status === 'Success') {
                    var responseAddress = resdata.msgdata;
                    const length = responseAddress.length;
                    this.setState({ addressDetails: resdata.msgdata })
                    this.state.addressDetails.forEach((element) => {
                        if (element.addresstypedesc.includes("Permanent address")) {
                            permanentaddress = element;
                        } else if (element.addresstypedesc.includes("present address")) {
                            presentaddress = element;
                        }
                    })
                    console.log(permanentaddress,
                        presentaddress)

                }
                else {
                    this.setState({ resMsg: resdata.message })
                    $("#commonModal").click()
                }
            })
    }
    getBankDetails = (memmid) => {
        fetch(BASEURL + '/usrmgmt/getaccountdetails', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                memmid: memmid,
            })
        }).then((Response) => Response.json())
            .then((resdata) => {
                if (resdata.status === 'Success') {
                    console.log(resdata);
                    this.setState({ accountDetails: resdata.msgdata })
                    // this.getDocumentDetails(memmid)
                }
                else {
                    this.setState({ resMsg: resdata.message })
                    $("#commonModal").click()
                }
            })
    }
    getDocumentDetails = (memmid) => {
        fetch(BASEURL + '/usrmgmt/getdocument?jlgid=' + this.state.groupdetails.groupid, {
            method: 'Get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
        }).then(response => {
            return response.blob();
        })
            .then((response) => {
                $("#launchColl").click();
                console.log('Response:', response)
                var collFile = new Blob([(response)], { type: 'application/pdf' });
                console.log(collFile);
                var collfileURL = URL.createObjectURL(collFile);
                console.log(collfileURL);
                document.getElementsByClassName('PDFdoc')[0].src = collfileURL + "#zoom=100";
            })
            .catch((error) => {
                console.log(error)
            })
        // .then((Response) => Response.json())
        //     .then((resdata) => {
        //         if (resdata.status === 'Success') {


        //         } else {
        //             this.setState({ resMsg: resdata.message })
        //             $("#commonModal").click()
        //         }
        //     })
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
        console.log(presentaddress)
        return (
            <div className="container-dashboard d-flex flex-row" id="wrapper" style={{ backgroundColor: "#f4f7fc" }}>
                < SystemUserSidebar />
                <div className="pl-3 pr-3 main-content" id="page-content-wrapper">
                    <div className="container-fluid row pt-2">
                        <div className="col-1" id="ProductDefRes1">
                            <button style={{ marginLeft: "25px" }} onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className='col-4' id="ProductDefRes2" style={{ marginLeft: "20px", marginTop: "5px" }}>
                            <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                <Link to="/sysUserDashboard">Home</Link> / <Link to="/jlgverify">JLG Group List</Link> / Profile Details</p>
                        </div>
                        <div className='col'>

                        </div>
                        <div className='col'>

                        </div>
                        <div className='col-3'>

                        </div>
                        <div className="col" id="ProductDefRes3">
                            <button style={myStyle}>
                                <Link to="/jlgverify" style={{ marginLeft: "10px" }}><FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} /><span style={{ textDecoration: "none", color: "white" }}>Back</span></Link></button>
                        </div>

                    </div>
                    <hr className="col-11" style={{ marginLeft: "50px", width: "88.6%", backgroundColor: "rgba(4,78,160,1)" }} />
                    <div className="tab-content">
                        <div className="register-form">
                            <div className='' >
                                <div className="card" style={{ marginLeft: "50px", cursor: 'default', width: "92%", backgroundColor: "#f4f7fc", border: "1.5px solid #0079bf" }}>
                                    <div className='row'>
                                        <div className='col-4' id='headingRef'>
                                            <div className="two__image" style={{ paddingLeft: "10px" }}>
                                                <p className="text-white" style={{ paddingBottom: "6px", fontWeight: "600" }}>Profile Details</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='row pl-2 pr-2'>
                                        <div className='col'>
                                            <div className='card' style={{ cursor: "default" }}>
                                                <div className='form-group pl-2 pr-2 pt-2'>
                                                    <div className='row pl-2 pr-2'>
                                                        <div className="col" style={{ color: "#222c70", fontSize: "14px" }}>
                                                            <div className='row'>
                                                                <div className='col-sm-4 col-md-4 col-lg-4'>
                                                                    <p className="mb-0 font-weight-bold">Group ID</p>
                                                                </div>
                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                </div>
                                                                <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                    <p className="mb-0">{this.state.groupdetails.groupid}</p>
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
                                                                    <p className="mb-0">{this.state.groupdetails.groupname}</p>
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
                                                                    <p className="mb-0">{this.state.groupdetails.groupdesc}</p>
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
                                                                    <p className="mb-0">{this.state.groupdetails.createdon ?
                                                                        this.state.groupdetails.createdon.split("-").reverse().join("-") : "-"
                                                                    }</p>
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
                                                        </div>
                                                        <div className='col' style={{ color: "#222c70", fontSize: "14px" }}>
                                                            <div className='row'>
                                                                <div className='col-sm-4 col-md-4 col-lg-4'>
                                                                    <p className="mb-0 font-weight-bold">Occupation</p>
                                                                </div>
                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                </div>
                                                                <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                    <p className="mb-0">{this.state.groupdetails.occupation}</p>
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
                                                                    <p className="mb-0">{this.state.groupdetails.state}</p>
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
                                                                    <p className="mb-0">{this.state.groupdetails.district}</p>
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
                                                                    <p className="mb-0">{this.state.groupdetails.taluk}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="accordion accordion-flush" id="accordionFlushExample">
                                                <div className="row mb-2">
                                                    <div className="col">
                                                        <div class="accordion-item" style={{ backgroundColor: "#f4f7fc", border: "1.5px solid #0079bf", borderRadius: "5px" }}>
                                                            <div class="accordion-header" id="flush-headingThree">
                                                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" style={{ color: "rgb(34, 44, 112)", fontWeight: "bold", fontSize: "14px" }}
                                                                    data-bs-target="#flush-collapseThree" aria-expanded="false" aria-controls="flush-collapseThree">
                                                                    Personal Details
                                                                </button>
                                                            </div>
                                                            <div id="flush-collapseThree" class="accordion-collapse collapse" aria-labelledby="flush-headingThree" data-bs-parent="#accordionFlushExample">
                                                                <div class="accordion-body">
                                                                    <div className="form-row">
                                                                        <div className="form-group col-12" style={{ fontSize: "14px" }}>
                                                                            <div className='row pr-2' >
                                                                                {this.state.personalDetailList.map((list, index) => {
                                                                                    return (
                                                                                        <div className='col-6' style={{ color: "#222c70", fontSize: "14px" }} key={index}>
                                                                                            <div className='row'>
                                                                                                <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                                                    <p className="mb-0 font-weight-bold">{list.attributetype}</p>
                                                                                                </div>
                                                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                                                </div>
                                                                                                <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                                                    <p className="mb-0">{list.attributevalue}</p>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    )
                                                                                })}

                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="row mb-2">
                                                    <div className="col">
                                                        <div class="accordion-item" style={{ backgroundColor: "#f4f7fc", border: "1.5px solid #0079bf", borderRadius: "5px" }}>
                                                            <div class="accordion-header" id="flush-headingOne">
                                                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" style={{ color: "rgb(34, 44, 112)", fontWeight: "bold", fontSize: "14px" }}
                                                                    data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
                                                                    Address Details
                                                                </button>
                                                            </div>
                                                            <div id="flush-collapseOne" class="accordion-collapse collapse" aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample">
                                                                <div class="accordion-body">
                                                                    <div className="form-row">
                                                                        <div className="form-group col-12" style={{ fontSize: "14px" }}>
                                                                            {/* Permanent */}
                                                                            <div className='row pr-2'>
                                                                                <div className='row'>
                                                                                    <div className='col-4' id='headingRef'>
                                                                                        <div className="two__image" style={{ paddingLeft: "10px" }}>
                                                                                            <p className="text-white" style={{ paddingBottom: "6px", fontWeight: "600" }}>{permanentaddress.addresstypedesc}</p>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className='col-6' style={{ color: "#222c70", fontSize: "14px" }}>
                                                                                    <div className='row'>
                                                                                        <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                                            <p className="mb-0 font-weight-bold">Address Line 1</p>
                                                                                        </div>
                                                                                        <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                                            <p className="mb-0 font-weight-bold">:</p>
                                                                                        </div>
                                                                                        <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                                            <p className="mb-0">{permanentaddress.address1}</p>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className='col-6' style={{ color: "#222c70", fontSize: "14px" }}>
                                                                                    <div className='row'>
                                                                                        <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                                            <p className="mb-0 font-weight-bold">Address Line 2</p>
                                                                                        </div>
                                                                                        <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                                            <p className="mb-0 font-weight-bold">:</p>
                                                                                        </div>
                                                                                        <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                                            <p className="mb-0">{permanentaddress.address2}</p>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className='row pr-2' >
                                                                                <div className='col-6' style={{ color: "#222c70", fontSize: "14px" }}>
                                                                                    <div className='row'>
                                                                                        <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                                            <p className="mb-0 font-weight-bold">Landmark</p>
                                                                                        </div>
                                                                                        <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                                            <p className="mb-0 font-weight-bold">:</p>
                                                                                        </div>
                                                                                        <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                                            <p className="mb-0">{permanentaddress.address3}</p>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className='col-6' style={{ color: "#222c70", fontSize: "14px" }}>
                                                                                    <div className='row'>
                                                                                        <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                                            <p className="mb-0 font-weight-bold">City</p>
                                                                                        </div>
                                                                                        <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                                            <p className="mb-0 font-weight-bold">:</p>
                                                                                        </div>
                                                                                        <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                                            <p className="mb-0">{permanentaddress.city}</p>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className='row pr-2' >
                                                                                <div className='col-6' style={{ color: "#222c70", fontSize: "14px" }}>
                                                                                    <div className='row'>
                                                                                        <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                                            <p className="mb-0 font-weight-bold">District</p>
                                                                                        </div>
                                                                                        <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                                            <p className="mb-0 font-weight-bold">:</p>
                                                                                        </div>
                                                                                        <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                                            <p className="mb-0">{permanentaddress.district}</p>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className='col-6' style={{ color: "#222c70", fontSize: "14px" }}>
                                                                                    <div className='row'>
                                                                                        <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                                            <p className="mb-0 font-weight-bold">State</p>
                                                                                        </div>
                                                                                        <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                                            <p className="mb-0 font-weight-bold">:</p>
                                                                                        </div>
                                                                                        <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                                            <p className="mb-0">{permanentaddress.state}</p>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className='row pr-2 mb-3' >
                                                                                <div className='col-6' style={{ color: "#222c70", fontSize: "14px" }}>
                                                                                    <div className='row'>
                                                                                        <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                                            <p className="mb-0 font-weight-bold">Pincode</p>
                                                                                        </div>
                                                                                        <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                                            <p className="mb-0 font-weight-bold">:</p>
                                                                                        </div>
                                                                                        <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                                            <p className="mb-0">{permanentaddress.pincode}</p>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className='row pr-2 mb-3' >
                                                                                <div className='col-6' style={{ color: "#222c70", fontSize: "14px" }}>
                                                                                    <div className='row'>
                                                                                        <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                                            <p className="mb-0 font-weight-bold">Taluk</p>
                                                                                        </div>
                                                                                        <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                                            <p className="mb-0 font-weight-bold">:</p>
                                                                                        </div>
                                                                                        <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                                            <p className="mb-0">{permanentaddress.taluk}</p>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>

                                                                            {/* Present */}
                                                                            {!presentaddress || Object.keys(presentaddress).length === 0 ?
                                                                                <></> :
                                                                                <>
                                                                                    <div className='row pr-2'>
                                                                                        <div className='row'>
                                                                                            <div className='col-4' id='headingRef'>
                                                                                                <div className="two__image" style={{ paddingLeft: "10px" }}>
                                                                                                    <p className="text-white" style={{ paddingBottom: "6px", fontWeight: "600" }}>{presentaddress.addresstypedesc}</p>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className='col-6' style={{ color: "#222c70", fontSize: "14px" }}>
                                                                                            <div className='row'>
                                                                                                <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                                                    <p className="mb-0 font-weight-bold">Address Line 1</p>
                                                                                                </div>
                                                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                                                </div>
                                                                                                <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                                                    <p className="mb-0">{presentaddress.address1}</p>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className='col-6' style={{ color: "#222c70", fontSize: "14px" }}>
                                                                                            <div className='row'>
                                                                                                <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                                                    <p className="mb-0 font-weight-bold">Address Line 2</p>
                                                                                                </div>
                                                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                                                </div>
                                                                                                <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                                                    <p className="mb-0">{presentaddress.address2}</p>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className='row pr-2' >
                                                                                        <div className='col-6' style={{ color: "#222c70", fontSize: "14px" }}>
                                                                                            <div className='row'>
                                                                                                <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                                                    <p className="mb-0 font-weight-bold">Landmark</p>
                                                                                                </div>
                                                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                                                </div>
                                                                                                <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                                                    <p className="mb-0">{presentaddress.address3}</p>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className='col-6' style={{ color: "#222c70", fontSize: "14px" }}>
                                                                                            <div className='row'>
                                                                                                <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                                                    <p className="mb-0 font-weight-bold">City</p>
                                                                                                </div>
                                                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                                                </div>
                                                                                                <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                                                    <p className="mb-0">{presentaddress.city}</p>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className='row pr-2' >
                                                                                        <div className='col-6' style={{ color: "#222c70", fontSize: "14px" }}>
                                                                                            <div className='row'>
                                                                                                <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                                                    <p className="mb-0 font-weight-bold">District</p>
                                                                                                </div>
                                                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                                                </div>
                                                                                                <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                                                    <p className="mb-0">{presentaddress.district}</p>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className='col-6' style={{ color: "#222c70", fontSize: "14px" }}>
                                                                                            <div className='row'>
                                                                                                <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                                                    <p className="mb-0 font-weight-bold">State</p>
                                                                                                </div>
                                                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                                                </div>
                                                                                                <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                                                    <p className="mb-0">{presentaddress.state}</p>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className='row pr-2' >
                                                                                        <div className='col-6' style={{ color: "#222c70", fontSize: "14px" }}>
                                                                                            <div className='row'>
                                                                                                <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                                                    <p className="mb-0 font-weight-bold">Pincode</p>
                                                                                                </div>
                                                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                                                </div>
                                                                                                <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                                                    <p className="mb-0">{presentaddress.pincode}</p>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className='row pr-2' >
                                                                                        <div className='col-6' style={{ color: "#222c70", fontSize: "14px" }}>
                                                                                            <div className='row'>
                                                                                                <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                                                    <p className="mb-0 font-weight-bold">Taluk</p>
                                                                                                </div>
                                                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                                                    <p className="mb-0 font-weight-bold">:</p>
                                                                                                </div>
                                                                                                <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                                                    <p className="mb-0">{presentaddress.taluk}</p>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </>}

                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="row mb-2">
                                                    <div className="col">
                                                        <div class="accordion-item" style={{ backgroundColor: "#f4f7fc", border: "1.5px solid #0079bf", borderRadius: "5px" }}>
                                                            <div class="accordion-header" id="flush-headingTwo">
                                                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" style={{ color: "rgb(34, 44, 112)", fontWeight: "bold", fontSize: "14px" }}
                                                                    data-bs-target="#flush-collapseTwo" aria-expanded="false" aria-controls="flush-collapseTwo">
                                                                    Account Details
                                                                </button>
                                                            </div>
                                                            <div id="flush-collapseTwo" class="accordion-collapse collapse" aria-labelledby="flush-headingTwo" data-bs-parent="#accordionFlushExample">
                                                                <div class="accordion-body">
                                                                    <div className="form-row">
                                                                        <div className="form-group col-12" style={{ fontSize: "14px" }}>
                                                                            <div className='row pr-2' >
                                                                                <div className='col-6' style={{ color: "#222c70", fontSize: "14px" }}>
                                                                                    <div className='row'>
                                                                                        <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                                            <p className="mb-0 font-weight-bold">Account Type</p>
                                                                                        </div>
                                                                                        <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                                            <p className="mb-0 font-weight-bold">:</p>
                                                                                        </div>
                                                                                        <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                                            <p className="mb-0">{this.state.accountDetails.accounttype == 1 ? "Savings Account" :
                                                                                                <span>{this.state.accountDetails.accounttype == 2 ? "Current Account" : ""}</span>}</p>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className='col-6' style={{ color: "#222c70", fontSize: "14px" }}>
                                                                                    <div className='row'>
                                                                                        <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                                            <p className="mb-0 font-weight-bold">Account Number</p>
                                                                                        </div>
                                                                                        <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                                            <p className="mb-0 font-weight-bold">:</p>
                                                                                        </div>
                                                                                        <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                                            <p className="mb-0">{this.state.accountDetails.accountno}</p>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className='row pr-2' >
                                                                                <div className='col-6' style={{ color: "#222c70", fontSize: "14px" }}>
                                                                                    <div className='row'>
                                                                                        <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                                            <p className="mb-0 font-weight-bold">IFSC</p>
                                                                                        </div>
                                                                                        <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                                            <p className="mb-0 font-weight-bold">:</p>
                                                                                        </div>
                                                                                        <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                                            <p className="mb-0">{this.state.accountDetails.accountifsc}</p>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                                <div className='col-6' style={{ color: "#222c70", fontSize: "14px" }}>
                                                                                    <div className='row'>
                                                                                        <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                                            <p className="mb-0 font-weight-bold">UPI ID</p>
                                                                                        </div>
                                                                                        <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                                            <p className="mb-0 font-weight-bold">:</p>
                                                                                        </div>
                                                                                        <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                                            <p className="mb-0">{this.state.accountDetails.accountvpa}</p>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className='row pr-2 mb-3' >
                                                                                <div className='col-6' style={{ color: "#222c70", fontSize: "14px" }}>
                                                                                    <div className='row'>
                                                                                        <div className='col-sm-5 col-md-5 col-lg-5'>
                                                                                            <p className="mb-0 font-weight-bold">Branch</p>
                                                                                        </div>
                                                                                        <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                                            <p className="mb-0 font-weight-bold">:</p>
                                                                                        </div>
                                                                                        <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                                            <p className="mb-0">{this.state.accountDetails.branch}</p>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="row mb-2">
                                                    <div className="col">
                                                        <div class="accordion-item" style={{ backgroundColor: "#f4f7fc", border: "1.5px solid #0079bf", borderRadius: "5px" }}>
                                                            <div class="accordion-header" id="flush-headingFour">
                                                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" style={{ color: "rgb(34, 44, 112)", fontWeight: "bold", fontSize: "14px" }}
                                                                    data-bs-target="#flush-collapseFour" aria-expanded="false" aria-controls="flush-collapseFour">
                                                                    Document Details
                                                                </button>
                                                            </div>
                                                            <div id="flush-collapseFour" class="accordion-collapse collapse" aria-labelledby="flush-headingFour" data-bs-parent="#accordionFlushExample">
                                                                <div class="accordion-body">
                                                                    <div className="form-row">
                                                                        <div className="form-group col-12" style={{ fontSize: "14px" }}>
                                                                            <div className='row pr-2' >
                                                                                <div className='row'>
                                                                                    <div className='col' style={{ marginLeft: "5px", textAlign: "center" }}>
                                                                                        {/* <p className="downloadTnc" id='downloadTnCid' style={{ cursor: "pointer", fontWeight: "500", fontSize: "14px" }} onClick={this.getDocumentDetails}>
                                                                                            View Document &nbsp; <FaFileDownload style={{ marginTop: "-4px" }} />
                                                                                        </p> */}
                                                                                        <button type="button" className="btn" id="digisubmit4"
                                                                                            style={{ backgroundColor: "rgba(0,121,190,1)", color: "white", borderRadius: "10px" }} onClick={this.getDocumentDetails}><FaFileDownload style={{ marginTop: "-4px" }} />&nbsp;JLG Resolution Document</button>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Pdf preview */}
                    <button type="button" id='launchColl' style={{ display: "none" }} class="btn btn-primary" data-toggle="modal" data-target=".bd-example-modal-lg">Large modal</button>

                    <div class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
                        <div class="modal-dialog modal-lg">
                            <div class="modal-content">
                                <iframe src="" className="PDFdoc" type="application/pdf" style={{ overflow: "auto", height: "100vh", width: "100%" }}>

                                </iframe>
                                <div className='pt-2' style={{ textAlign: "end", paddingRight: "15px" }}>
                                    <button type="button" class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "#0079BF" }}>Close</button>
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

export default withTranslation()(VerifyProfile)