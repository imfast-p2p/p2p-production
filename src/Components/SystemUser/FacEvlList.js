import React, { Component } from 'react';
import $, { event } from 'jquery';
import { BASEURL } from '../assets/baseURL';
import User from '../assets/User.png';
import Name from '../assets/Name.png';
import SystemUserSidebar from './SystemUserSidebar';
import { withTranslation } from 'react-i18next';
import dashboardIcon from '../assets/icon_dashboard.png';
import { FaAngleLeft, FaEye, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import ReactPaginate from 'react-paginate';
import '../Borrower/Pagination.css'
import { Link } from "react-router-dom";
import { confirmAlert } from 'react-confirm-alert';

import facEvlVw from '../assets/sysImg/facEvVw.png';

export class FacEvlList extends Component {
    constructor(props) {
        super(props)
        this.state = {

            Lists: [],
            fromdate: "",
            todate: "",
            dtoday: "",
            dfrday: "",

            stateList: [],
            districtList: [],
            utype: "",
            state1: "",
            district: "",
            city: "",
            pincode: "",
            userStatus: "",

            referenceDetails: [],
            referencedetails: [],
            referencedetails2: [],
            approvestatus: "",

            offset: 0,
            orgtableData: [],
            perPage: 5,
            currentPage: 0,
            pageCount: "",
            showLoader: false,

            pmType: "",
        }

        this.fromdate = this.fromdate.bind(this);
        this.todate = this.todate.bind(this);
    }
    componentDidMount() {
        this.listDate()
        this.getStateList()

        if (sessionStorage.getItem('pmDefault') === "0") {
            this.setState({ pmType: "pmSystemUser" })
        } else {
            this.setState({ pmType: "platformSysUser" })
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
            Lists: slice
        })
    }
    status = (event) => {
        this.setState({ utype: event.target.value })
    }
    userStatus = (event) => {
        this.setState({ userStatus: event.target.value })
    }
    fromdate(event) {
        this.setState({ fromdate: event.target.value })
    }
    todate(event) {
        this.setState({ todate: event.target.value })
    }
    listDate() {
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

    }
    district = (event) => {
        this.setState({ district: event.target.value })
    }
    city = (event) => {
        this.setState({ city: event.target.value })
    }
    state1 = (event) => {
        this.setState({ state1: event.target.value })

        this.state.stateList
            .filter((e) => e.statecode == event.target.value)
            .map(() => {
                this.getDistrictList(event.target.value);
            })
    }
    statecode = (event) => {
        this.setState({ statecode: event.target.value })
    }
    pincode = (event) => {
        this.setState({ pincode: event.target.value })
    }
    getStateList(event) {
        fetch(BASEURL + '/usrmgmt/getstatelist', {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            }
        }).then((Response) => Response.json())
            .then((resdata) => {
                if (resdata.status === 'Success') {
                    console.log(resdata);
                    this.setState({ stateList: resdata.msgdata })
                    this.state.stateList.map((statelist) => {
                        return statelist.statename;
                    })
                }
                else {
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

    getDistrictList(statecod) {
        this.setState({ state1: statecod })
        fetch(BASEURL + '/usrmgmt/getdistrictlist?statecode=' + statecod, {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            }
        }).then((Response) => Response.json())
            .then((resdata) => {
                if (resdata.status === 'Success') {
                    console.log(resdata);
                    this.setState({ districtList: resdata.msgdata.distlist })
                }
                // else {
                //     alert("Issue: " + resdata.message);
                // }
            })
    }
    // '&statecode=' + this.state.state1 + '&districtcode=' + this.state.district +
    //      '&city=' + this.state.city + '&pincode=' + this.state.pincode +

    getFacEvalLists = () => {
        let utype = "utype=" + this.state.utype;
        let fromdate = "&fromdate=" + this.state.fromdate;
        let todate = "&todate=" + this.state.todate;
        let userStatus = "&userstatus=" + this.state.userStatus;
        let state = "&statecode=" + this.state.state1;
        let district = "&districtcode=" + this.state.district;
        let city = "&city=" + this.state.city;
        let pinCode = "&pincode=" + this.state.pincode;

        let url = BASEURL + '/usrmgmt/getfacevallist?';
        let params = (this.state.utype ? utype : "") + (this.state.fromdate ? fromdate : "") + (this.state.todate ? todate : "") + (this.state.userStatus ? userStatus : "")
            + (this.state.state1 ? state : "") + (this.state.district ? district : "") + (this.state.city ? city : "") + (this.state.pincode ? pinCode : "");
        console.log(this.state.utype,
            this.state.fromdate,
            this.state.todate,
            this.state.userStatus,
            this.state.state1,
            this.state.district,
            this.state.city,
            this.state.pincode
        )
        console.log(url);
        console.log(params);
        fetch(url + params
            , {
                method: 'get',
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
                if (resdata.status === 'Success') {
                    var facEvllist = resdata.msgdata;
                    facEvllist.sort((a, b) => {
                        return new Date(b.registredon).getTime() - new Date(a.registredon).getTime()
                    })
                    console.log(facEvllist);

                    this.setState({ Lists: facEvllist })

                    var data = resdata.msgdata
                    console.log(data)
                    var slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
                    console.log(slice)

                    this.setState({
                        pageCount: Math.ceil(data.length / this.state.perPage),
                        orgtableData: data,
                        Lists: slice
                    })
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
    }
    setrefDetails = (userid, status, username) => {
        sessionStorage.setItem('useriD', userid)
        sessionStorage.setItem('userIDStatus', status)
        sessionStorage.setItem('associateName', username)
        window.location = "/sysUserRefDetails"
    }

    // Setting ReferenceDetails
    // approvestatus = (event) => {
    //     this.setState({ approvestatus: event.target.value })
    // }

    // getRefDetails=()=> {
    //     fetch(BASEURL + '/lsp/getreferencedetails?userid=' + sessionStorage.getItem("useriD"), {
    //         headers: {
    //             'Authorization': "Bearer " + sessionStorage.getItem('token')
    //         }
    //     })
    //         .then((Response) => {
    //             return Response.json();
    //         })
    //         .then((resdata) => {
    //             if (resdata.status == 'SUCCESS') {
    //                 console.log(resdata);
    //                 this.setState({ referenceDetails: resdata.msgdata });
    //                 this.setState({ referencedetails: resdata.msgdata[0].refcheckflag })
    //                 console.log(this.state.referencedetails)
    //                 this.setState({ referencedetails2: resdata.msgdata[1].refcheckflag })
    //                 console.log(this.state.referencedetails2)


    //             } else {
    //                 alert("Issue: " + resdata.message);
    //             }
    //         })
    // }
    // approveFacEval = () => {
    //     fetch(BASEURL + '/lsp/approvefacevl', {
    //         method: 'POST',
    //         headers: {
    //             'Accept': 'application/json',
    //             'Content-Type': 'application/json',
    //             'Authorization': "Bearer " + sessionStorage.getItem('token')
    //         },
    //         body: JSON.stringify({
    //             reqid: sessionStorage.getItem('useriD'),
    //             approvestatus: this.state.approvestatus
    //         })
    //     }).then((Response) => Response.json())
    //         .then((resdata) => {
    //             if (resdata.status === 'success') {
    //                 console.log(resdata);
    //                 window.location = "/sysUserDashboard"
    //             }
    //             else {
    //                 alert("Issue: " + resdata.message);
    //             }
    //         })
    // }

    // verifyrefDetails = (refmobileno, requestorid) => {
    //     sessionStorage.setItem("refMobile", refmobileno)
    //     sessionStorage.setItem("reqID", requestorid)
    //     window.location = '/verifyRefDetails'
    // }

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
        const { pmType } = this.state
        return (
            <div className="container-dashboard d-flex flex-row" id="wrapper">
                <SystemUserSidebar />
                <div className="pl-3 pr-3 main-content bg-light" id="page-content-wrapper">
                    <div className="container-fluid row pt-2">
                        <div className="col-1">
                            <button style={{ marginLeft: "25px" }} onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className='col-4' style={{ marginLeft: "20px", marginTop: "5px" }}>
                            <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                <Link to="/sysUserDashboard">Home</Link> /
                                {pmType === "pmSystemUser" ? "Associate List" : "Associate List"}</p>
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

                    {/* New Design */}
                    <div className="card" style={{ marginLeft: "50px", cursor: 'default', width: "92%", borderRadius: "7px", padding: "10px" }}>
                        <div className='row mb-3'>
                            <div className='col-3'>
                                <p htmlFor="date" style={{
                                    fontWeight: "600",
                                    fontSize: "13px", marginLeft: "0px", color: "rgba(5,54,82,1)",
                                    marginBottom: "5px"
                                }}>{t('From Date*')}</p>
                                <input id="Fdate" type="date"
                                    defaultValue={this.state.dfrday} onChange={this.fromdate} style={{
                                        border: "1.5px solid rgb(0, 121, 191)",
                                        borderRadius: "5px",
                                        width: "215px",
                                        height: "34px",
                                        fontSize: "15px",
                                        color: "rgba(40,116,166,1)",
                                        paddingLeft: "10px"
                                    }} />
                            </div>

                            <div className='col-3' style={{ fontSize: "15px" }}>
                                <p htmlFor="date" style={{
                                    fontWeight: "600",
                                    fontSize: "13px", marginLeft: "0px", color: "rgba(5,54,82,1)",
                                    marginBottom: "5px"
                                }}>{t('To Date*')}</p>
                                <input id="Tdate" type="date"
                                    defaultValue={this.state.dtoday} onChange={this.todate} style={{
                                        border: "1.5px solid rgb(0, 121, 191)",
                                        borderRadius: "5px",
                                        width: "215px",
                                        height: "34px",
                                        fontSize: "15px",
                                        color: "rgb(0, 121, 191)",
                                        paddingLeft: "10px"
                                    }} />
                            </div>
                            <div className='col-3'>
                                <p htmlFor="date" style={{
                                    fontWeight: "600",
                                    fontSize: "13px", marginLeft: "0px", color: "rgba(5,54,82,1)",
                                    marginBottom: "5px"
                                }}>{t('User Type*')}</p>
                                {pmType === "pmSystemUser" ?
                                    <select className='form-select' style={{ height: "34px", color: "rgb(0, 121, 191)", border: "1.5px solid rgb(0, 121, 191)" }} onChange={this.status}>
                                        <option defaultValue>{t('Select')}</option>
                                        <option value="4">{t('Facilitator')}</option>
                                    </select>
                                    :
                                    <select className='form-select' style={{ height: "34px", color: "rgb(0, 121, 191)", border: "1.5px solid rgb(0, 121, 191)" }} onChange={this.status}>
                                        <option defaultValue>{t('Select')}</option>
                                        <option value="4">{t('Facilitator')}</option>
                                        <option value="5">{t('Evaluator')}</option>
                                    </select>
                                }

                            </div>
                            <div className='col-3'>
                                <p htmlFor="date" style={{
                                    fontWeight: "600",
                                    fontSize: "13px", marginLeft: "0px", color: "rgba(5,54,82,1)",
                                    marginBottom: "5px"
                                }}>{t('Status')}</p>
                                <select className='form-select' style={{ height: "34px", color: "rgb(0, 121, 191)", border: "1.5px solid rgb(0, 121, 191)" }} onChange={this.userStatus}>
                                    <option defaultValue>{t('Select')}</option>
                                    <option value="0">{t('Not Approved')}</option>
                                    <option value="1">{t('Approved')}</option>
                                    <option value="2">{t('Rejected')}</option>
                                    <option value="3">{t('Deleted')}</option>
                                    <option value="4">{t('Blocked')}</option>
                                </select>
                            </div>

                        </div>
                        <div className='row'>
                            <div className='col-3'>
                                <p htmlFor="date" style={{
                                    fontWeight: "600",
                                    fontSize: "13px", marginLeft: "0px", color: "rgba(5,54,82,1)",
                                    marginBottom: "5px"
                                }}>{t('State')}</p>
                                <select className='form-select' style={{ height: "34px", color: "rgb(0, 121, 191)", border: "1.5px solid rgb(0, 121, 191)" }} onClick={this.state1}>
                                    <option defaultValue>{t('Select State')}</option>
                                    {this.state.stateList.map((states, index) => (
                                        <option key={index} value={states.statecode} style={{ color: "GrayText" }}>{states.statename} </option>
                                    ))
                                    }
                                </select>
                            </div>
                            <div className='col-3'>
                                <p htmlFor="date" style={{
                                    fontWeight: "600",
                                    fontSize: "13px", marginLeft: "0px", color: "rgba(5,54,82,1)",
                                    marginBottom: "5px"
                                }}>{t('District')}</p>
                                <select className='form-select' style={{ height: "34px", color: "rgb(0, 121, 191)", border: "1.5px solid rgb(0, 121, 191)" }} onChange={this.district}>
                                    <option defaultValue>{t('Select District')}</option>
                                    {this.state.districtList.map((districts, index) => {
                                        return (
                                            <option key={index} value={districts.distid} style={{ color: "GrayText" }}>{districts.distname}</option>
                                        )
                                    })
                                    }
                                </select>
                            </div>
                            <div className='col-2'>
                                <p htmlFor="date" style={{
                                    fontWeight: "600",
                                    fontSize: "13px", marginLeft: "0px", color: "rgba(5,54,82,1)",
                                    marginBottom: "5px"
                                }}>{t('City')}</p>
                                <input className='form-control' type='text' placeholder='Enter City' style={{ height: "34px", color: "rgb(0, 121, 191)", border: "1.5px solid rgb(0, 121, 191)" }} onClick={this.city} />
                            </div>
                            <div className='col-2'>
                                <p htmlFor="date" style={{
                                    fontWeight: "600",
                                    fontSize: "13px", marginLeft: "0px", color: "rgba(5,54,82,1)",
                                    marginBottom: "5px"
                                }}>{t('Pincode')}</p>
                                <input className='form-control' type='text' placeholder='Enter Pincode' style={{ height: "34px", color: "rgb(0, 121, 191)", border: "1.5px solid rgb(0, 121, 191)" }} onClick={this.pincode} />
                            </div>
                            <div className='col-2'>
                                <button type="button" className="btn btn-sm text-white" style={{
                                    backgroundColor: "rgb(0, 121, 191)",
                                    paddingLeft: "40px", paddingRight: "40px", marginTop: "25px"
                                }}
                                    onClick={this.getFacEvalLists}>{t('Apply')}</button>
                            </div>

                        </div>


                    </div>
                    {/* End of Input Latest Design */}
                    {/* <div className='row'>
                        <div className='col' style={{ paddingLeft: "6%", textAlign: "center" }}>
                            <p style={{ color: "#0079BF", fontFamily: "Poppins,sans-serif", fontWeight: "600", fontSize: "17px" }}>
                                {pmType === "pmSystemUser" ? "Facilitator List" : "Facilitator/Evaluator List"}</p>
                        </div>
                    </div> */}

                    {/* Lower Lists */}
                    {
                        this.state.Lists == "" || null || undefined ?
                            null :
                            <>
                                <div className='row font-weight-normal' style={{ marginLeft: "13px", fontWeight: "800", fontSize: "15px", color: "rgba(5,54,82,1)" }}>
                                    <div className='col-3'>
                                        <p style={{ marginLeft: "41px", fontWeight: "600" }}>{t('User ID')}</p>
                                    </div>
                                    <div className='col-3'>
                                        <p style={{ fontWeight: "600" }}>{t('User Name')}</p>
                                    </div>
                                    <div className='col-2'>
                                        <p style={{ fontWeight: "600" }}>{t('Mobile Number')}</p>
                                    </div>
                                    <div className='col-2'>
                                        <p style={{ fontWeight: "600" }}>{t('User Type')}</p>
                                    </div>
                                </div>
                                <hr className="col-11" style={{ marginLeft: "50px", width: "88.6%", marginTop: "-10px" }} />

                                <div className=''>
                                    {
                                        this.state.Lists.map((user, index) => {
                                            return (
                                                <div className='col' key={index}>
                                                    <div className='card border-0' style={{ marginBottom: "-10px", transition: 'none', color: "rgb(5, 54, 82)", cursor: 'default', width: "95%", marginLeft: "30px" }}>
                                                        <div className="row item-list align-items-center">
                                                            <div className="col-3" style={{ paddingLeft: "20px" }}>
                                                                <p className="ml-3 p-0" style={{ fontSize: "17px", fontWeight: "490", marginTop: "15px" }}>{user.userid}</p>
                                                            </div >
                                                            <div className="col-3">
                                                                <p style={{ fontSize: "17px", fontWeight: "490", paddingTop: "12px" }}>{user.username}</p>
                                                            </div >
                                                            <div className="col-2">
                                                                <p style={{ fontSize: "17px", fontWeight: "490", paddingTop: "12px", paddingLeft: "13px" }}>{user.mobileno}</p>
                                                            </div>
                                                            <div className="col-2">
                                                                <p className="" style={{ fontSize: "17px", fontWeight: "490", paddingTop: "12px", marginLeft: "20px" }}>{user.userid.includes('FAC') ? "Facilitator" : "Evaluator"}</p>
                                                            </div>
                                                            <div className="col-2" style={{ textAlign: "center" }}>
                                                                {user.status == "1" ? "Approved" :
                                                                    <img src={facEvlVw} style={{ width: "40px", cursor: "pointer" }} onClick={this.setrefDetails.bind(this, user.userid, user.status, user.username)} />}

                                                            </div>
                                                        </div >
                                                    </div>
                                                </div>
                                            )
                                        }
                                        )
                                    }
                                </div>
                                <div className="row mt-4 float-right mr-4">
                                    <div className='card border-0'>
                                        <ReactPaginate
                                            previousLabel={"<"}
                                            nextLabel={">"}
                                            breakLabel={"..."}
                                            breakClassName={"break-me"}
                                            pageCount={this.state.pageCount}
                                            // marginPagesDisplayed={1}
                                            // pageRangeDisplayed={5}
                                            onPageChange={this.handlePageClick}
                                            containerClassName={"pagination"}
                                            subContainerClassName={"pages pagination"}
                                            activeClassName={"active"}
                                        />
                                    </div>
                                </div>
                            </>
                    }

                </div>
            </div>
        )
    }
}

export default withTranslation()(FacEvlList)