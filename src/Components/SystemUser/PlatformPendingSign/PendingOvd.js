import React, { Component } from "react";
import $ from "jquery";
import { BASEURL } from "../../assets/baseURL";
import SystemUserSidebar from "../SystemUserSidebar";
import { withTranslation } from "react-i18next";
import { FaSearch, FaAngleLeft, FaEye, FaFilter, FaFileAlt, FaEllipsisV } from "react-icons/fa";
import dashboardIcon from '../../assets/icon_dashboard.png'
import { Link } from 'react-router-dom';
import accept from '../../assets/accept.png';
import ReactPaginate from 'react-paginate';
import '../../Borrower/Pagination.css';
import { confirmAlert } from "react-confirm-alert";
import openIt from '../../assets/AdminImg/openit.png';
import batch from '../../assets/batch.png';
import Loader from '../../Loader/Loader';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
var input, filter, ul, li, a, i, txtValue;
var ovdCode;
var rejectFlag = false;
export class PendingOvd extends Component {
    constructor(props) {
        super(props);
        this.state = {
            reqNos: [],
            acceptReqs: "",
            utype: "",
            reqNo: "",
            memmid: "",
            pos: "",

            ovdCode: "",
            ovdImgID: "",
            ovdStatus: "",
            rejectReason: "",
            mobileNo: "",

            offset: 0,
            orgtableData: [],
            perPage: 10,
            currentPage: 0,
            pageCount: "",

            getPlatformStatus: "",
            txnID: "",

            //view
            viewOvdDataList: [],
            viewMobileno: '',

            //Status
            ovdImgList: [],
            showLoader: false,
            formDetailList: [],
            filterStatus: "0",
            failureMsg: "",

            fromdate: "",
            todate: "",
            dtoday: "",
            dfrday: "",
            dateError: false,

            docuTypeFlag: true,
            images: [],
            resMsg: ""
        };
    }
    componentDidMount() {
        this.loadDate();
        // this.getpendingovdlist();
    }
    componentWillUnmount() {
        //on unmount clear entutyid from session
        sessionStorage.removeItem('entityId')
    }
    loadDate = () => {
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
        this.setState({
            dtoday: today,
            todate: today,
            dfrday: frday,
            fromdate: frday
        }, () => {
            this.getpendingovdlist(); // Call getpendingovdlist after setting the dates
        });
    }
    fromdate = (event) => {
        const fromDateValue = event.target.value;
        const toDateValue = this.state.todate;

        this.setState({ fromdate: fromDateValue });
        if (toDateValue && fromDateValue > toDateValue) {
            this.setState({ dateError: true });
        } else {
            this.setState({ dateError: false });
        }
    }
    todate = (event) => {
        const toDateValue = event.target.value;
        const fromDateValue = this.state.fromdate;

        this.setState({ todate: toDateValue });
        if (fromDateValue && toDateValue < fromDateValue) {
            this.setState({ dateError: true });
        } else {
            this.setState({ dateError: false });
        }
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
    filterStatus = (event) => {
        this.setState({ filterStatus: event.target.value },()=>{
            this.getpendingovdlist()
        })
    }
    getpendingovdlist = () => {
        this.setState({ showLoader: true })
        console.log(sessionStorage.getItem('entityId'))
        const entityid = sessionStorage.getItem('entityId')
        // fetch(BASEURL + `/usrmgmt/getpendingovdlist?docstatus=` + parseInt(this.state.filterStatus) +
        //     `&fromdate=` + this.state.fromdate +
        //     `&todate=` + this.state.todate +
        //     ...((this.state.entityid) && `&entityid=${this.state.entityid}`), {
        //     method: "Get",
        //     headers: {
        //         'Accept': "application/json",
        //         "Content-Type": "application/json",
        //         'Authorization': "Bearer " + sessionStorage.getItem("token"),
        //     },
        // })
        fetch(`${BASEURL}/usrmgmt/getpendingovdlist?docstatus=${parseInt(this.state.filterStatus)}&fromdate=${this.state.fromdate}&todate=${this.state.todate}${entityid ? `&entityid=${entityid}` : ''}`, {
            method: "Get",
            headers: {
                'Accept': "application/json",
                "Content-Type": "application/json",
                'Authorization': "Bearer " + sessionStorage.getItem("token"),
            },
        })
            .then((Response) => Response.json())
            .then((resdata) => {
                if (resdata.status === "Success" || resdata.status === "SUCCESS") {
                    this.setState({ showLoader: false })
                    console.log(resdata);

                    var list = resdata.msgdata;
                    console.log(resdata.msgdata)
                    // this.setState({ uploadedOVDLists: resdata.msgdata })
                    console.log(list)
                    if (list) {
                        list.sort((a, b) => {
                            return new Date(b.createdon).getTime() - new Date(a.createdon).getTime()
                        })
                        console.log(list);
                        this.setState({ reqNos: list })

                        var data = resdata.msgdata
                        console.log(data)
                        var slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
                        console.log(slice)

                        this.setState({
                            pageCount: Math.ceil(data.length / this.state.perPage),
                            orgtableData: data,
                            reqNos: slice
                        })
                    }
                    if (this.state.filterStatus === "0") {
                        this.setState({ docuTypeFlag: true })
                    } else if (this.state.filterStatus === "1") {
                        this.setState({ docuTypeFlag: false })
                    } else if (this.state.filterStatus === "2") {
                        this.setState({ docuTypeFlag: false })
                    }
                } else {
                    this.setState({ showLoader: false })
                    this.setState({
                        failureMsg: resdata.message,
                        reqNos: [],
                        orgtableData: []
                    }, () => {
                        console.log(resdata.message, this.state.failureMsg)
                    });
                }
            });
    }
    setOvdStatusModal = (ovdcode, mobileno, ovdimglist) => {
        console.log(ovdcode, mobileno, ovdimglist)
        this.setState({ ovdCode: ovdcode })
        this.setState({ mobileNo: mobileno })
        this.setState({ ovdImgList: ovdimglist })
        console.log(this.state.ovdCode, this.state.mobileNo)
        $("#setOvdStatusModal").click();
    }
    ovdPageType = (e) => {
        this.setState({ ovdImgID: e.target.value })
    }
    ovdStatus = (e) => {
        this.setState({ ovdStatus: e.target.value })
        if (e.target.value == "1") {
            rejectFlag = false;
            $("#rejectReasonField").hide();
        } else if (e.target.value == "2") {
            rejectFlag = true;
            $("#rejectReasonField").show();
        }
    }
    ovdRejectreason = (e) => {
        this.setState({ rejectReason: e.target.value })
    }
    setpendOvdStatus = () => {
        var withReject = JSON.stringify({
            ovdcode: this.state.ovdCode,
            ovdid: "1",
            status: this.state.ovdStatus,
            rejectreason: this.state.rejectReason,
            mobileno: this.state.mobileNo
        })
        var withoutReject = JSON.stringify({
            ovdcode: this.state.ovdCode,
            ovdid: "1",
            status: this.state.ovdStatus,
            mobileno: this.state.mobileNo
        })
        var result = rejectFlag == true ? withReject : withoutReject;
        fetch(BASEURL + '/usrmgmt/setpendingovdstatus', {
            method: 'Post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: result
        }).then(response => {
            console.log('Response:', response)
            return response.json();
        }).then((resdata) => {
            if (resdata.status == "Success") {
                console.log(resdata);
                $("#exampleModalCenter3").modal('hide')
                confirmAlert({
                    message: resdata.message,
                    buttons: [
                        {
                            label: "Okay",
                            onClick: () => {
                                this.getpendingovdlist()
                            }
                        }
                    ],
                })
                // window.location = "/sysUserDashboard";
            } else {
                $("#exampleModalCenter3").modal('hide')
                confirmAlert({
                    message: resdata.message,
                    buttons: [
                        {
                            label: "Okay",
                            onClick: () => {
                                $("#exampleModalCenter3").modal('show')
                            }
                        }
                    ],
                })
            }

        })
    }
    ovdData = (ovddata) => {
        console.log(ovddata.address)
        var name = ovddata.name;
        var dob = ovddata.dob;
        var idno = ovddata.dlno;
        var VotID = ovddata.votid;
        var gender = ovddata.gender;
        var address = ovddata.address;
        var issueDate = ovddata.issueddate;

        console.log(name,
            dob,
            idno,
            VotID,
            gender,
            address,
            issueDate)
        this.setState({
            ovdName: name,
            ovdDob: dob,
            ovdAddress: address,
            ovdVotId: VotID,
            ovdIssuedate: issueDate
        })
        $("#ovddataModal").click()
    }
    //View Image
    viewDetails = (lists) => {
        $("#formAddressDetails").click();
        this.userDetails(lists);
        this.viewFormDetails(lists);
    }
    userDetails = async (lists) => {
        console.log(lists.ovdimglist, lists.mobileno, lists.ovdcode, lists.ovddata);

        this.setState({
            viewOvdDataList: lists.ovdimglist,
            viewOvdCode: lists.ovdcode,
            viewMobileno: lists.mobileno
        }, async () => {
            // After state has been updated, process each item in viewOvdDataList
            for (let i = 0; i < this.state.viewOvdDataList.length; i++) {
                await this.viewGetuploadedovdimage(this.state.viewOvdDataList[i].pagetype);
            }
        });
    }
    viewGetuploadedovdimage = async (pagetype) => {
        const { viewMobileno, viewOvdCode } = this.state;
        this.setState({ showLoader: true })
        try {
            const response = await fetch(`${BASEURL}/usrmgmt/getuploadedovdimage?mobileno=${viewMobileno}&ovdcode=${viewOvdCode}&pagetype=${pagetype}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const blob = await response.blob();
            const base64 = await this.convertBlobToBase64(blob);

            this.setState(prevState => ({
                images: [...prevState.images, { pagetype, base64 }],
                showLoader: false
            }));
        } catch (error) {
            console.error('Error:', error);
            this.setState({ showLoader: false })
            // Handle upload error (you can add more error handling logic here)
        }
    }
    convertBlobToBase64 = (blob) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result.split(',')[1]); // Get base64 string only
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    }
    viewFormDetails = (lists) => {
        this.setState({
            showLoader: true
        })
        fetch(BASEURL + '/lsp/getformtxndata?majorid=' + lists.referenceno, {
            method: 'GET',
            headers: {
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
        }).then(response => {
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata)
                if (resdata.status == 'SUCCESS') {
                    console.log(resdata.message);
                    this.setState({
                        formDetailList: resdata.msgdata,
                        showLoader: false
                    })
                    console.log(this.state.formDetailList);
                } else {
                    this.setState({
                        resMsg: resdata.message,
                        showLoader: false
                    })
                }

            })
    }
    downloadUploadedovdimage = () => {
        fetch(BASEURL + '/usrmgmt/getuploadedovdimage?mobileno=' + this.state.viewMobileno + "&ovdcode=" + this.state.viewOvdCode + "&pagetype=" + this.state.viewPageType, {
            method: 'Get',
            headers: {
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
        }).then((Response) => Response.blob())
            .then((resdata) => {
                console.log(resdata);

                const url = window.URL.createObjectURL(resdata);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                // the filename you want
                a.download = this.state.viewOvdCode + ".jpg";
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
            })
    }
    clearOVDImage = () => {
        // $('#img').last().remove();
        this.setState({
            formDetailList: [],
            images: []
        })
    }

    myFunction = (e) => {
        e.preventDefault()
        input = document.getElementById("myInput");
        filter = e.target.value.toUpperCase();
        ul = document.getElementById("myUL");
        li = ul.getElementsByTagName("div");
        for (i = 0; i < li.length; i++) {
            a = li[i].getElementsByTagName("p")[0];
            if (a) {
                txtValue = a.textContent || a.innerText;
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    li[i].style.display = "";
                } else {
                    li[i].style.display = "none";
                }
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
        const { images } = this.state
        return (
            <div className="container-dashboard d-flex flex-row" id="wrapper" style={{ backgroundColor: "#F4F7FC", marginTop: "-7px" }}>
                {
                    this.state.showLoader && <Loader />
                }
                <SystemUserSidebar />
                <div className="main-content" id="page-content-wrapper">
                    <div className="container-fluid row pt-2">
                        <div className="col-1" id="">
                            <button style={{ marginLeft: "25px" }} onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className='col-5' id="" style={{ marginLeft: "20px", marginTop: "5px" }}>
                            <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                {/* <Link to="/sysUserDashboard">Home</Link> / Document Verification</p> */}
                                <Link to="/sysUserDashboard">Home</Link> {sessionStorage.getItem('entityId') ? <Link to="/pendingEntityList">/ Entity Details</Link> : null} / Document Verification</p>
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

                    {/* <div className='container-fluid row' style={{ paddingLeft: "82px", marginTop: "-20px", marginTop: "-22px" }}>
                        <div className='card' style={{overflow:"auto"}}>
                            <div style={{ cursor: "default", color: "rgba(5,54,82,1)", marginBottom: "20px" }} >
                                <div className='row'>
                                    <div className='col' style={{ textAlign: "center", fontSize: "15px", fontWeight: "600", fontFamily: "'Poppins', sans-serif" }}>
                                        <p>Document Verification</p>
                                    </div>
                                </div>
                                
                                <div className='row mb-2'>
                                    <div className='col-lg-3 col-md-3 col-sm-4 Fdate' style={{ fontSize: "15px" }}>
                                        <p htmlFor="date" style={{
                                            fontWeight: "600",
                                            fontSize: "13px", marginLeft: "0px", color: "rgba(5,54,82,1)",
                                            marginBottom: "5px",
                                        }}
                                        ><FaFilter />&nbsp;{t('Select Status')} *</p>
                                        <select className='form-select' style={{ border: "1px solid rgb(40, 116, 166)", color: "rgb(40, 116, 166)" }}
                                            onChange={this.filterStatus}>
                                            <option value="" defaultValue>Select</option>
                                            <option value="0">Not Approved</option>
                                            <option value="2">Rejected</option>
                                        </select>
                                    </div>
                                    <div className='col-lg-3 col-md-3 col-sm-4 Fdate' style={{ fontSize: "15px" }}>
                                        <p htmlFor="date" style={{
                                            fontWeight: "600",
                                            fontSize: "13px", marginLeft: "0px", color: "rgba(5,54,82,1)",
                                            marginBottom: "5px",
                                        }}
                                        >{t('From Date')} *</p>
                                        <input id="Fdate" className="form-control" type="date"
                                            defaultValue={this.state.dfrday} onChange={this.fromdate} style={{
                                                border: "1px solid rgba(40,116,166,1)",
                                                borderRadius: "5px",
                                                fontSize: "15px",
                                                color: "rgba(40,116,166,1)",
                                            }} />
                                    </div>
                                    <div className='col-lg-3 col-md-3 col-sm-4 Fdate' style={{ fontSize: "15px" }}>
                                        <p htmlFor="date" style={{
                                            fontWeight: "600",
                                            fontSize: "13px", marginLeft: "0px", color: "rgba(5,54,82,1)",
                                            marginBottom: "5px",
                                        }}
                                        >{t('To Date')} *</p>
                                        <input id="Tdate" className="form-control" type="date"
                                            defaultValue={this.state.dtoday} onChange={this.todate} style={{
                                                border: "1px solid rgba(40,116,166,1)",
                                                borderRadius: "5px",
                                                fontSize: "15px",
                                                color: "rgba(40,116,166,1)",
                                            }} />
                                    </div>
                                    <div className="col-lg-3 col-md-3 col-sm-4 Fdate" style={{ paddingTop: '23px' }}>
                                        <button type="button" className="btn btn-sm text-white" style={{
                                            backgroundColor: "rgb(0, 121, 191)",
                                            paddingTop: "8px", paddingBottom: "8px",
                                            paddingLeft: "47px", paddingRight: "47px"
                                        }}
                                            id=''
                                            onClick={this.getpendingovdlist}>{t('Apply')}</button>
                                    </div>
                                </div>
                                {this.state.dateError && <p className="text-danger">To Date cannot be less than From Date</p>}

                                <div className='row' style={{ marginTop: "-10px" }}>
                                    <div className='col'>
                                        <div className='tab-content'>
                                            <div id="myEarning-details" className="register-form tab-pane fade show active" style={{ cursor: "default" }}>
                                                {this.state.reqNos == "" ?
                                                    <>
                                                        <div className="row mt-2" style={{ marginLeft: "6px" }}>
                                                            <div className="col" style={{ textAlign: "center", color: "rgba(5,54,82,1)", fontSize: "14px", fontWeight: "500" }}>
                                                                <p>{this.state.failureMsg}</p>
                                                            </div>
                                                        </div>
                                                    </> :
                                                    <>
                                                        <div style={{ whiteSpace: "nowrap" }} id='secondAuditScroll'>
                                                            <Table responsive>
                                                                <Thead>
                                                                    <Tr style={{ fontSize: "15px", color: "rgba(5,54,82,1)", paddingLeft: "6px" }}>
                                                                        <Th style={{ fontWeight: "600", marginTop: "5px", padding: "8px" }}>{t("Document Type")}</Th>
                                                                        <Th style={{ fontWeight: "600", marginTop: "5px", padding: "8px" }}>{t("Mobile No.")}</Th>
                                                                        <Th style={{ fontWeight: "600", marginTop: "5px", padding: "8px" }}>{t("Created On")}</Th>
                                                                        <Th style={{ fontWeight: "600", marginTop: "5px", padding: "8px" }}>{t("Status")}</Th>
                                                                        {this.state.docuTypeFlag === false &&
                                                                            <Th style={{ fontWeight: "600", marginTop: "5px", padding: "8px" }}>{t("Verified By")}</Th>
                                                                        }
                                                                        {this.state.docuTypeFlag === false &&
                                                                            <Th style={{ fontWeight: "600", marginTop: "5px", padding: "8px" }}>{t("Reject Reason")}</Th>
                                                                        }
                                                                        {this.state.docuTypeFlag === true &&
                                                                            <Th style={{ fontWeight: "600", marginTop: "5px", padding: "8px" }}></Th>
                                                                        }
                                                                    </Tr>
                                                                </Thead>
                                                                <Tbody>
                                                                    {this.state.reqNos && this.state.reqNos.map((lists, index) => {
                                                                        return (
                                                                            <Tr key={index}
                                                                                style={{
                                                                                    marginBottom: "-10px", transition: 'none', cursor: 'default',
                                                                                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", backgroundColor: (index % 2 === 0) ? 'rgba(255,255,255,1)' : 'rgba(242,242,242,1)', height: "40px"
                                                                                }}>
                                                                                <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", padding: "8px" }}>{lists.ovdcode}</Td>
                                                                                <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", padding: "8px" }}>{lists.mobileno}</Td>
                                                                                <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", padding: "8px" }}>{lists.createdon}</Td>
                                                                                {lists.status == "0" ?
                                                                                    <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", padding: "8px" }}>
                                                                                        Not Approved</Td> :
                                                                                    lists.status == "1" ?
                                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", padding: "8px" }}>
                                                                                            Approved</Td> :
                                                                                        lists.status == "2" &&
                                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", padding: "8px" }}>
                                                                                            Rejected</Td>}
                                                                                {this.state.docuTypeFlag === false &&
                                                                                    <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", padding: "8px" }}>{lists.verifiedby}</Td>
                                                                                }
                                                                                {this.state.docuTypeFlag === false &&
                                                                                    <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", padding: "8px" }}>{lists.rejectreason}</Td>
                                                                                }
                                                                                {this.state.docuTypeFlag === true &&
                                                                                    <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "right", padding: "8px" }}>
                                                                                        <h6 className="" style={{ marginTop: "4px", fontSize: "16px", color: "rgba(5,54,82,1)", fontWeight: "490" }}>
                                                                                            <span className="dropup">
                                                                                                <img src={openIt} style={{ height: "35px" }}
                                                                                                    className="btn dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" />
                                                                                                &nbsp;
                                                                                                <div className="dropdown-menu" aria-labelledby="dropdownMenuButton" style={{ marginLeft: "-160px" }}>
                                                                                                    {lists.ovddata && Object.keys(lists.ovddata).length > 0 && (
                                                                                                        <a className="dropdown-item" onClick={this.ovdData.bind(this, lists.ovddata)}>OVD Data</a>
                                                                                                    )}
                                                                                                    <a className="dropdown-item" onClick={this.viewDetails.bind(this, lists)}>View Details</a>
                                                                                                    <a className="dropdown-item" onClick={this.setOvdStatusModal.bind(this, lists.ovdcode, lists.mobileno, lists.ovdimglist)}>Update Status</a>
                                                                                                </div>
                                                                                            </span>
                                                                                        </h6>
                                                                                    </Td>
                                                                                }
                                                                            </Tr>
                                                                        )
                                                                    })}
                                                                </Tbody>
                                                            </Table>
                                                            {this.state.reqNos.length >= 1 &&
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

                                                    </>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> */}


                    <div className='container-fluid row' style={{ paddingLeft: "82px", marginTop: "-26px" }}>
                        <div className='card' style={{ overflow: "auto", cursor: "default" }}>
                            <div className='row pt-2'>
                                <div className='col'>
                                    <ul role="tablist" className="nav nav-pills nav-fill mb-3" >
                                        <li className="nav-item"> <a data-toggle="pill" href="#myEarning-details" className="nav-link active detailsTab"
                                            style={{ textAlign: "center", paddingTop: "10px", paddingBottom: "10px" }}>
                                            <FaFileAlt />&nbsp; {t('Document Verification')} </a> </li>
                                    </ul>

                                </div>
                            </div>
                            <div className='row mb-2'>
                                <div className='col-lg-3 col-md-3 col-sm-4 Fdate' style={{ fontSize: "15px" }}>
                                    <p htmlFor="date" style={{
                                        fontWeight: "600",
                                        fontSize: "13px", marginLeft: "0px", color: "rgba(5,54,82,1)",
                                        marginBottom: "5px",
                                    }}
                                    ><FaFilter />&nbsp;{t('Select Status')} *</p>
                                    <select className='form-select' style={{ border: "1px solid rgb(40, 116, 166)", color: "rgb(40, 116, 166)" }}
                                        onChange={this.filterStatus}>
                                        <option value="" defaultValue>Select</option>
                                        <option value="0">Not Approved</option>
                                        <option value="1">Approved</option>
                                        <option value="2">Rejected</option>
                                    </select>
                                </div>
                                <div className='col-lg-3 col-md-3 col-sm-4 Fdate' style={{ fontSize: "15px" }}>
                                    <p htmlFor="date" style={{
                                        fontWeight: "600",
                                        fontSize: "13px", marginLeft: "0px", color: "rgba(5,54,82,1)",
                                        marginBottom: "5px",
                                    }}
                                    >{t('From Date')} *</p>
                                    <input id="Fdate" className="form-control" type="date"
                                        defaultValue={this.state.dfrday} onChange={this.fromdate} style={{
                                            border: "1px solid rgba(40,116,166,1)",
                                            borderRadius: "5px",
                                            fontSize: "15px",
                                            color: "rgba(40,116,166,1)",
                                        }} />
                                </div>
                                <div className='col-lg-3 col-md-3 col-sm-4 Fdate' style={{ fontSize: "15px" }}>
                                    <p htmlFor="date" style={{
                                        fontWeight: "600",
                                        fontSize: "13px", marginLeft: "0px", color: "rgba(5,54,82,1)",
                                        marginBottom: "5px",
                                    }}
                                    >{t('To Date')} *</p>
                                    <input id="Tdate" className="form-control" type="date"
                                        defaultValue={this.state.dtoday} onChange={this.todate} style={{
                                            border: "1px solid rgba(40,116,166,1)",
                                            borderRadius: "5px",
                                            fontSize: "15px",
                                            color: "rgba(40,116,166,1)",
                                        }} />
                                </div>
                                <div className="col-lg-3 col-md-3 col-sm-4 Fdate" style={{ paddingTop: '23px' }}>
                                    <button type="button" className="btn btn-sm text-white" style={{
                                        backgroundColor: "rgb(0, 121, 191)",
                                        paddingTop: "8px", paddingBottom: "8px",
                                        paddingLeft: "47px", paddingRight: "47px"
                                    }}
                                        id=''
                                        onClick={this.getpendingovdlist}>{t('Apply')}</button>
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
                                                    <div style={{ whiteSpace: "nowrap" }} id='secondAuditScroll'>
                                                        <Table responsive>
                                                            <Thead>
                                                                <Tr style={{ fontSize: "15px", color: "rgba(5,54,82,1)", paddingLeft: "6px" }}>
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px", textAlign: "left" }}>{t('Document Type')}</Th>
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px", textAlign: "left" }}>{t('Mobile No.')}</Th>
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px", textAlign: "left" }}>{t("Created On")}</Th>
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px", textAlign: "left" }}>{t("Status")}</Th>
                                                                    {(this.state.docuTypeFlag === false && this.state.filterStatus === "2") ?
                                                                        <Th style={{ fontWeight: "600", marginTop: "5px", textAlign: "left" }}>{t("Verified By")}</Th>
                                                                        : (this.state.docuTypeFlag === false && this.state.filterStatus === "1") &&
                                                                        <Th style={{ fontWeight: "600", marginTop: "5px", textAlign: "left" }}>{t("Verified By")}</Th>
                                                                    }
                                                                    {(this.state.docuTypeFlag === false && this.state.filterStatus === "2") &&
                                                                        <Th style={{ fontWeight: "600", marginTop: "5px", textAlign: "left" }}>{t("Reject Reason")}</Th>
                                                                    }
                                                                    {this.state.docuTypeFlag === true &&
                                                                        <Th style={{ fontWeight: "600", marginTop: "5px", textAlign: "left" }}></Th>
                                                                    }
                                                                </Tr>
                                                            </Thead>
                                                            <Tbody>
                                                                {this.state.reqNos.map((lists, index) => (
                                                                    <Tr key={index} style={{
                                                                        color: "rgba(5,54,82,1)",
                                                                        marginBottom: "-10px", transition: 'none', cursor: 'default',
                                                                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", backgroundColor: (index % 2 === 0) ? 'rgba(255,255,255,1)' : 'rgba(242,242,242,1)'
                                                                    }}>
                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left" }}>{lists.ovdcode}</Td>
                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left" }}>{lists.mobileno}</Td>
                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left" }}>{lists.createdon.split("-").reverse().join("-")}</Td>
                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left" }}>
                                                                            {lists.status === "0" ? "Not Approved" : lists.status === "1" ? "Approved" : "Rejected"}
                                                                        </Td>
                                                                        {this.state.docuTypeFlag === false && (
                                                                            <>
                                                                                {this.state.filterStatus === "2" ?
                                                                                    <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left" }}>{lists.verifiedby}</Td>
                                                                                    :
                                                                                    <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left" }}>{lists.verifiedby}</Td>
                                                                                }
                                                                                <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left" }}>{lists.rejectreason}</Td>
                                                                            </>
                                                                        )}

                                                                        {this.state.docuTypeFlag === true &&
                                                                            <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "right" }}>

                                                                                <span className="dropup">

                                                                                    <FaEllipsisV style={{ fontSize: "26px" }}
                                                                                        className="btn dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" />
                                                                                    &nbsp;
                                                                                    <div className="dropdown-menu" aria-labelledby="dropdownMenuButton" style={{ marginLeft: "-160px" }}>
                                                                                        {lists.ovddata && Object.keys(lists.ovddata).length > 0 && (
                                                                                            <a className="dropdown-item" onClick={() => this.ovdData(lists.ovddata)}>OVD Data</a>
                                                                                        )}
                                                                                        <a className="dropdown-item" onClick={() => this.viewDetails(lists)}>View Details</a>
                                                                                        <a className="dropdown-item" onClick={() => this.setOvdStatusModal(lists.ovdcode, lists.mobileno, lists.ovdimglist)}>Update Status</a>
                                                                                    </div>
                                                                                </span>

                                                                            </Td>
                                                                        }
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

                    {/* OVD Data modal */}
                    <button type="button" id='ovddataModal' style={{ display: "none" }} class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter">
                        OVD Data Modal
                    </button>
                    <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered" role="document">
                            <div class="modal-content">
                                <div class="modal-body">
                                    <div className='row'>
                                        <div className='col'>
                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold" }}><img src={batch} width="25px" />OVD Data</p>
                                            <hr style={{ width: "50px", marginTop: "-10px", backgroundColor: "rgb(0, 121, 191)" }} />

                                            <div className='row' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                <div className='col-sm-5 col-md-5 col-lg-5'>
                                                    <p className="mb-0 font-weight-bold">Name</p>
                                                </div>
                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                    <p className="mb-0 font-weight-bold">:</p>
                                                </div>
                                                <div className='col-sm-6 col-md-6 col-lg-6'>
                                                    <p className="mb-0">{this.state.ovdName}</p>
                                                </div>
                                            </div>
                                            <div className='row' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                <div className='col-sm-5 col-md-5 col-lg-5'>
                                                    <p className="mb-0 font-weight-bold">Date of birth</p>
                                                </div>
                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                    <p className="mb-0 font-weight-bold">:</p>
                                                </div>
                                                <div className='col-sm-4 col-md-4 col-lg-4'>
                                                    <p className="mb-0">{this.state.ovdDob}</p>
                                                </div>
                                            </div>
                                            <div className='row' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                <div className='col-sm-5 col-md-5 col-lg-5'>
                                                    <p className="mb-0 font-weight-bold">Document ID</p>
                                                </div>
                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                    <p className="mb-0 font-weight-bold">:</p>
                                                </div>
                                                <div className='col-sm-6 col-md-6 col-lg-6'>
                                                    <p className="mb-0">{this.state.ovdVotId}</p>
                                                </div>
                                            </div>
                                            <div className='row' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                <div className='col-sm-5 col-md-5 col-lg-5'>
                                                    <p className="mb-0 font-weight-bold">Date</p>
                                                </div>
                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                    <p className="mb-0 font-weight-bold">:</p>
                                                </div>
                                                <div className='col-sm-4 col-md-4 col-lg-4'>
                                                    <p className="mb-0">{this.state.ovdIssuedate}</p>
                                                </div>
                                            </div>
                                            <div className='row' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                <div className='col-sm-5 col-md-5 col-lg-5'>
                                                    <p className="mb-0 font-weight-bold">Address</p>
                                                </div>
                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                    <p className="mb-0 font-weight-bold">:</p>
                                                </div>
                                                <div className='col-sm-6 col-md-6 col-lg-6'>
                                                    <p className="mb-0">{this.state.ovdAddress}</p>
                                                </div>
                                            </div>
                                            {/* <div className='row' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                <div className='col-sm-5 col-md-5 col-lg-5'>
                                                    <p className="mb-0 font-weight-bold">Gender</p>
                                                </div>
                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                    <p className="mb-0 font-weight-bold">:</p>
                                                </div>
                                                <div className='col-sm-4 col-md-4 col-lg-4'>
                                                    <p className="mb-0">Male</p>
                                                </div>
                                            </div> */}

                                            <hr style={{ backgroundColor: "rgba(5,54,82,1)" }} />
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col' style={{ textAlign: "center" }}>
                                            <button type="button" id='disagree' class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "#0079bf" }}>Close</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* set OVD Status */}
                    <button type="button" id="setOvdStatusModal" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter3" style={{ display: "none" }}>
                        Set OVD Status modal
                    </button>
                    <div class="modal fade" data-backdrop="static" id="exampleModalCenter3" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered" role="document">
                            <div class="modal-content">
                                <div class="modal-header">
                                    <h5 class="modal-title" id="exampleModalLongTitle" style={{ color: "#00264d" }}>Set OVD Status</h5>
                                </div>
                                <div class="modal-body">
                                    {/* <div className='row mb-3'>
                                        <div className='col'>
                                            <p style={{ color: "rgb(5, 54, 82)", fontWeight: "500" }}>Page Type</p>
                                            <select className='form-select' style={{ marginTop: "-10px" }} onChange={this.ovdPageType}>
                                                <option defaultValue>Select</option>
                                                {this.state.ovdImgList.map((list, index) => {
                                                    return (
                                                        <option key={index} style={{ color: "GrayText" }} value={list.pagetype}>
                                                            {list.pagetype == "1" ? "Front Page" : "Back Page"}
                                                        </option>
                                                    )
                                                })}
                                            </select>
                                        </div>
                                    </div> */}

                                    <div className='row' style={{ marginTop: "-10px" }}>
                                        <div className='col'>
                                            <p style={{ color: "rgb(5, 54, 82)", fontWeight: "500" }}>Status *</p>
                                            <select className='form-select' style={{ marginTop: "-10px" }} onChange={this.ovdStatus}>
                                                <option defaultValue>Select</option>
                                                <option value="1">Approve</option>
                                                <option value="2">Reject</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className='row mt-2' id="rejectReasonField" style={{ display: "none" }}>
                                        <div className='col'>
                                            <p style={{ color: "rgb(5, 54, 82)", fontWeight: "500" }}>Reject Reason *</p>
                                            <textarea type="text" className="form-control" style={{ marginTop: "-10px" }} onChange={this.ovdRejectreason}></textarea>
                                        </div>
                                    </div>

                                </div>
                                <div class="modal-footer">
                                    <div className='row'>
                                        <div className='col' style={{ paddingTop: "20px", textAlign: "end" }}>
                                            <button className='btn btn-sm text-white delUpldSubmBtn' style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.setpendOvdStatus}>Submit</button>
                                            &nbsp;
                                            <button className='btn btn-sm text-white' data-dismiss="modal" style={{ backgroundColor: "#0079BF" }}>Cancel</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form Details */}
                    <button id='formAddressDetails' style={{ display: "none", marginLeft: "67%" }} type="button" class="btn btn-info" data-toggle="modal" data-target=".bd-example-modal-lg">
                        Borrower Details
                    </button>
                    <div class="modal fade bd-example-modal-lg" data-backdrop="static" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
                        <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
                            <div className="modal-content">
                                <div className="modal-body">
                                    <div className='row'>
                                        <div className='col-lg-6 col-md-12 col-sm-12'>
                                            <p style={{ fontWeight: "bold", color: "rgba(5,54,82,1)", fontSize: "14px", paddingLeft: "8px" }}><img src={batch} style={{ width: "26px" }} /> &nbsp;Uploaded Documents</p>
                                            <hr style={{ width: "70px", marginTop: "-6px" }} />
                                            {images && images.length > 0 ?
                                                <div className="scrollbar" style={{ height: "370px", overflowY: "scroll", scrollbarWidth: "thin", }}>
                                                    {images.map((image, index) => (
                                                        <img
                                                            key={index}
                                                            src={`data:image/jpeg;base64,${image.base64}`}
                                                            alt={`Image ${image.pagetype}`}
                                                            style={{ width: "100%", height: "auto", overflow: "hidden" }}
                                                        />
                                                    ))}
                                                </div> :
                                                <div className="row">
                                                    <div className="col">
                                                        <p style={{ fontWeight: "bold", color: "rgba(5,54,82,1)", fontSize: "13px", paddingLeft: "8px" }}>Documents not available.</p>
                                                    </div>
                                                </div>
                                            }
                                        </div>
                                        <div className='col-lg-6 col-md-12 col-sm-12'>
                                            <div className="row">
                                                <div className="col">
                                                    <p style={{ fontWeight: "bold", color: "rgba(5,54,82,1)", fontSize: "14px", paddingLeft: "8px" }}><img src={batch} style={{ width: "26px" }} /> &nbsp;Form Details</p>
                                                </div>
                                                <div className="col">
                                                    <button type="button" class="close" data-dismiss="modal" aria-label="Close" onClick={this.clearOVDImage}>
                                                        <span aria-hidden="true">&times;</span>
                                                    </button>
                                                </div>
                                            </div>
                                            <hr style={{ width: "70px", marginTop: "-6px" }} />
                                            {this.state.formDetailList && this.state.formDetailList.length > 0 ?
                                                <>
                                                    <div className='row' style={{ marginTop: "-20px" }}>
                                                        <div className='col'>
                                                            {this.state.formDetailList.map((form, subIndex) => {
                                                                return (
                                                                    <div className='row p-1' key={subIndex}>
                                                                        <p style={{ fontWeight: "bold", color: "rgba(5,54,82,1)", fontSize: "14px", marginLeft: "2px" }}>{form.type === "ADDRESSUPDATE" ? "Address Details" : "OVD Details"}</p>
                                                                        {form.formdata && form.formdata.formfields && form.formdata.formfields.map((formData, index) => {
                                                                            return (
                                                                                <div className='col-lg-6 col-md-12 col-sm-12' key={index} style={{ color: "rgba(5,54,82,1)", fontSize: "14px", marginTop: "-13px" }}>
                                                                                    <p style={{ fontWeight: "bold" }}>{formData.field}</p>
                                                                                    <p style={{ marginTop: "-15px" }}>{formData.value}</p>
                                                                                </div>
                                                                            )
                                                                        })}
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>
                                                    </div>
                                                </> :
                                                <div className="row">
                                                    <div className="col">
                                                        <p style={{ fontWeight: "bold", color: "rgba(5,54,82,1)", fontSize: "13px", paddingLeft: "8px" }}>{this.state.resMsg}</p>
                                                    </div>
                                                </div>
                                            }
                                        </div>
                                    </div>
                                    <div className='row mt-2'>
                                        <div className='col' style={{ textAlign: "center" }}>
                                            <button type="button" class="btn btn-sm text-white" data-dismiss="modal"
                                                style={{ paddingLeft: "20px", paddingRight: "20px", backgroundColor: "rgb(0, 121, 190)" }} onClick={this.clearOVDImage}>Close</button>
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

export default withTranslation()(PendingOvd);