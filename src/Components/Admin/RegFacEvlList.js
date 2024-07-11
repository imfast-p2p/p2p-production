import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import { BASEURL } from '../assets/baseURL';
import AdminSidebar from './AdminSidebar';
import { withTranslation } from 'react-i18next';
import v1 from '../assets/All.png';
import v2 from '../assets/verfied.png';
import v3 from '../assets/notVerified.png';
import { FaAngleLeft, FaUserCheck, FaMobileAlt, FaEye } from 'react-icons/fa';
import dashboardIcon from '../assets/icon_dashboard.png';
import notEvaluated from '../assets/NotEvaluated.png';
import Evaluated from '../assets/Evaluated.png';
import batch from '../assets/batch.png';
import ReactPaginate from 'react-paginate';
import '../Borrower/Pagination.css';
import { confirmAlert } from 'react-confirm-alert';


// var pmType = "";
export class RegFacEvlList extends Component {
    constructor(props) {
        super(props)
        this.state = {
            facEvlList: [],

            offset: 0,
            loanOfferList: [],
            orgtableData: [],
            perPage: 5,
            currentPage: 0,
            pageCount: "",


            offset2: 0,
            perPage2: 5,
            orgtableData2: [],
            currentPage2: 0,
            pageCount2: "",

            facList: [],
            evlList: [],
            pmType: ""
        }

        this.getRegFacEvl = this.getRegFacEvl.bind(this);
        this.approveSysUser = this.approveSysUser.bind(this);
    }

    componentDidMount() {
        this.getRegFacEvl();
        if (sessionStorage.getItem('sAdmin') === "1" && sessionStorage.getItem('pmDefault') === "1") {
            //Super Admin
            // pmType = "superAdmin";
            this.setState({ pmType: "superAdmin" })
        } else if (sessionStorage.getItem('pmDefault') === "0") {
            // pmType="pmAdmin"
            this.setState({ pmType: "pmAdmin" })
        } else {
            // pmType = "0";
            this.setState({ pmType: "0" })
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
            facList: slice
        })
    }
    handlePageClick2 = (event) => {
        const selectedPage = event.selected;
        const offset = selectedPage * this.state.perPage2;
        this.setState({
            currentPage2: selectedPage,
            offset2: offset
        }, () => {
            this.loadMoreData2();
        })
    }
    loadMoreData2 = () => {
        const data = this.state.orgtableData2;
        const slice = data.slice(this.state.offset2, this.state.offset2 + this.state.perPage2)
        this.setState({
            pageCount2: Math.ceil(data.length / this.state.perPage2),
            evlList: slice
        })
    }
    getRegFacEvl() {
        fetch(BASEURL + '/lsp/getregfacevallist', {
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
                if (resdata.status === 'SUCCESS') {
                    this.setState({ facEvlList: resdata.msgdata })
                    //Facilitator List
                    let filteredData = resdata.msgdata.filter(item => item.facevaltype == 4);
                    console.log(filteredData);
                    this.setState({ facList: filteredData })

                    var data = filteredData
                    console.log(data)
                    var slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
                    console.log(slice)

                    this.setState({
                        pageCount: Math.ceil(data.length / this.state.perPage),
                        orgtableData: data,
                        filteredData: slice
                    })
                    //Evaluator List
                    let filteredData2 = resdata.msgdata.filter(item => item.facevaltype == 5);
                    console.log(filteredData2);
                    this.setState({ evlList: filteredData2 })

                    var data2 = filteredData
                    console.log(data2)
                    var slice2 = data2.slice(this.state.offset2, this.state.offset2 + this.state.perPage2)
                    console.log(slice2)

                    this.setState({
                        pageCount2: Math.ceil(data2.length / this.state.perPage2),
                        orgtableData: data2,
                        filteredData: slice2
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
                        confirmAlert({
                            message: resdata.message,
                            buttons: [
                                {
                                    label: "OK",
                                    onClick: () => {
                                        // window.location.reload();
                                    },
                                },
                            ],
                        });
                    }
                }
            })
    }

    approveSysUser(reqsysuserid, facevaltype) {
        fetch(BASEURL + '/lsp/approvesysuserasfaceval', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                regsysuserid: reqsysuserid,
                regasutype: facevaltype
            })
        })
            .then(response => {
                console.log('Response:', response)
                return response.json();
            })
            .then((resdata) => {
                console.log(resdata)
                if (resdata.status == 'SUCCESS') {
                    alert(resdata.message)

                } else {
                    alert("Issue: " + resdata.message);
                }

            })
    }

    handleChange() {
        $('.text').toggle();
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
        const { pmType } = this.state;
        return (
            <div className="container-dashboard d-flex flex-row" id="wrapper">
                <AdminSidebar />
                <div className="main-content bg-light" id="page-content-wrapper">
                    <div className="container-fluid row pt-2">
                        <div className="col-1" id='facnavRes1'>
                            <button style={{ marginLeft: "25px" }} onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className='col-5' id='facnavRes2' style={{ marginLeft: "20px", marginTop: "5px" }}>
                            <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                <Link to="/landing">Home</Link> /
                                {pmType === "pmAdmin" ? "Facilitator List" : "Internal Facilitator & Evaluator List"}
                            </p>
                        </div>
                        <div className='col'>

                        </div>
                        <div className='col'>

                        </div>
                        <div className='col-3'>

                        </div>
                        <div className="col" id='facnavRes3'>
                            <button style={myStyle}>
                                <Link to="/landing"><FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} /><span style={{ textDecoration: "none", color: "white" }}>Back</span></Link></button>
                        </div>
                    </div>

                    <hr className="col-11" style={{ marginLeft: "50px", width: "88.6%", backgroundColor: "rgba(4,78,160,1)", marginTop: "0px" }} />
                    <div className='container-fluid row' style={{ paddingLeft: "86px", marginTop: "-20px" }}>
                        <div className='card'>
                            <div className='row pt-2 pl-2 pr-2'>
                                <div className='col'>
                                    <ul role="tablist" className="nav nav-pills nav-fill mb-3" >
                                        <li className="nav-item"> <a data-toggle="pill" id="myNavLink" href="#Facil-List" className="nav-link active"
                                            style={{ textAlign: "center", paddingTop: "10px", paddingBottom: "10px", fontWeight: "bold" }}><img src={v3} style={{ width: "30px" }} /> &nbsp;Facilitator </a> </li>
                                        {pmType === "pmAdmin" ?
                                            ""
                                            : <li className="nav-item"> <a data-toggle="pill" id="myNavLink" href="#Evl-List" className="nav-link"
                                                style={{ textAlign: "center", paddingTop: "10px", paddingBottom: "10px", fontWeight: "bold" }}>
                                                <img src={v3} style={{ width: "30px" }} /> &nbsp;Evaluator </a> </li>
                                        }

                                    </ul>
                                </div>
                            </div>
                            <div className='row font-weight-normal' style={{ fontWeight: "800", fontSize: "15px", color: "rgba(5,54,82,1)" }}>
                                <div className='col-2' style={{ paddingLeft: "30px" }}>
                                    <p style={{ fontWeight: "600" }}>Req. Sysuser ID</p>
                                </div>

                                <div className='col-2'>
                                    <p style={{ fontWeight: "600", width: "max-content" }}>Req. Sysuser Name</p>
                                </div>
                                <div className='col-2'>
                                    <p style={{ fontWeight: "600" }}>{t('RequestedOn')}</p>
                                </div>

                                <div className='col-2'>
                                    <p style={{ fontWeight: "600", marginLeft: "10px" }}>{t('ApprovedOn')}</p>
                                </div>
                                <div className='col-2'>
                                    <p style={{ fontWeight: "600" }}>{t('ApprovedBy')}</p>
                                </div>
                                <div className='col-2'>
                                    <p style={{ fontWeight: "600", }}>{t('ApprovedStatus')}</p>
                                </div>
                            </div>
                            <hr style={{ marginTop: "-10px" }} />
                            <div className="row" style={{ marginTop: "-25px", marginBottom: "20px" }}>
                                <div className='col'>
                                    <div className='tab-content'>
                                        <div id="Facil-List" className=" register-form tab-pane fade show active" style={{ cursor: "default" }}>
                                            {
                                                this.state.facList.map((list, index) => {
                                                    return (
                                                        <div key={index}>
                                                            <div className='card' style={{ marginBottom: "-10px", transition: 'none', cursor: 'default', backgroundColor: (index % 2 == 0) ? 'rgba(255,255,255,1)' : 'rgba(242,242,242,1)' }}>
                                                                <div className="row item-list align-items-center">
                                                                    <div className="col-2">
                                                                        <p className="" style={{ paddingLeft: "20px", marginTop: "12px", fontSize: "16px", color: "rgba(5,54,82,1)", fontWeight: "490" }}>{list.reqsysuserid == "" ? "-" : list.reqsysuserid}</p>
                                                                    </div >
                                                                    <div className="col-2">
                                                                        <p style={{ paddingTop: "16px", fontSize: "14px", color: "rgba(5,54,82,1)", fontWeight: "490" }}>{list.reqsysusername == "" ? "-" : list.reqsysusername}</p>
                                                                    </div >
                                                                    <div className="col-2">
                                                                        <p style={{ paddingTop: "10px", fontSize: "16px", color: "rgba(5,54,82,1)", fontWeight: "490" }}>{list.requestedon == "" ? "-" : list.requestedon}</p>
                                                                    </div>
                                                                    <div className="col-2">
                                                                        <p className="" style={{ paddingTop: "10px", fontSize: "16px", paddingLeft: "8px", color: "rgba(5,54,82,1)", fontWeight: "490" }}>{list.approvedon == "" ? "-" : list.approvedon}</p>
                                                                    </div>
                                                                    <div className="col-2">
                                                                        <p className="" style={{ paddingTop: "10px", fontSize: "16px", color: "rgba(5,54,82,1)", fontWeight: "490" }}>{list.approvedby == "" ? "-" : list.approvedby}</p>
                                                                    </div>
                                                                    <div className="col" style={{ cursor: "pointer", textAlign: "center" }}>
                                                                        {list.approvedstatus == 0 ?
                                                                            <button className="btn text-white btn-sm" style={{ backgroundColor: "rgb(0, 121, 191)" }}
                                                                                onClick={this.approveSysUser.bind(this, list.reqsysuserid, list.facevaltype)}>&nbsp;<img src={notEvaluated} width="20px" />&nbsp;Approve Now</button>
                                                                            : <button className='btn btn-sm' style={{ color: "rgb(0, 121, 191)", cursor: "default", fontWeight: "bold" }}>&nbsp;<img src={Evaluated} width="20px" />&nbsp;Approved</button>}
                                                                    </div>
                                                                </div >
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            }
                                            <div className="row">
                                                <div className='col'></div>
                                                <div className='col'>
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
                                        <div id="Evl-List" className=" register-form tab-pane fade show" style={{ cursor: "default" }}>
                                            {
                                                this.state.evlList.map((list, index) => {
                                                    return (
                                                        <div key={index}>
                                                            <div className='card' style={{ marginBottom: "-10px", transition: 'none', cursor: 'default', backgroundColor: (index % 2 == 0) ? 'rgba(255,255,255,1)' : 'rgba(242,242,242,1)' }}>
                                                                <div className="row item-list align-items-center">
                                                                    <div className="col-2">
                                                                        <p className="" style={{ paddingLeft: "20px", marginTop: "12px", fontSize: "16px", color: "rgba(5,54,82,1)", fontWeight: "490" }}>{list.reqsysuserid == "" ? "-" : list.reqsysuserid}</p>
                                                                    </div >
                                                                    <div className="col-2">
                                                                        <p style={{ paddingTop: "16px", fontSize: "14px", color: "rgba(5,54,82,1)", fontWeight: "490" }}>{list.reqsysusername == "" ? "-" : list.reqsysusername}</p>
                                                                    </div >
                                                                    <div className="col-2">
                                                                        <p style={{ paddingTop: "10px", fontSize: "16px", color: "rgba(5,54,82,1)", fontWeight: "490" }}>{list.requestedon == "" ? "-" : list.requestedon}</p>
                                                                    </div>
                                                                    <div className="col-2">
                                                                        <p className="" style={{ paddingTop: "10px", fontSize: "16px", paddingLeft: "8px", color: "rgba(5,54,82,1)", fontWeight: "490" }}>{list.approvedon == "" ? "-" : list.approvedon}</p>
                                                                    </div>
                                                                    <div className="col-2">
                                                                        <p className="" style={{ paddingTop: "10px", fontSize: "16px", color: "rgba(5,54,82,1)", fontWeight: "490" }}>{list.approvedby == "" ? "-" : list.approvedby}</p>
                                                                    </div>
                                                                    <div className="col" style={{ cursor: "pointer", textAlign: "center" }}>
                                                                        {list.approvedstatus == 0 ?
                                                                            <button className="btn text-white btn-sm" style={{ backgroundColor: "rgb(0, 121, 191)" }}
                                                                                onClick={this.approveSysUser.bind(this, list.reqsysuserid, list.facevaltype)}>&nbsp;<img src={notEvaluated} width="20px" />&nbsp;Not Approved</button>
                                                                            : <button className='btn btn-sm' style={{ color: "rgb(0, 121, 191)", cursor: "default", fontWeight: "bold" }}>&nbsp;<img src={Evaluated} width="20px" />&nbsp;Approved</button>}
                                                                    </div>
                                                                </div >
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            }

                                            <div className="row">
                                                <div className='col'></div>
                                                <div className='col'>
                                                    <div className='card border-0' style={{ height: "40px" }}>
                                                        <ReactPaginate
                                                            previousLabel={"<"}
                                                            nextLabel={">"}
                                                            breakLabel={"..."}
                                                            breakClassName={"break-me"}
                                                            pageCount={this.state.pageCount2}
                                                            onPageChange={this.handlePageClick2}
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
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        )
    }
}

export default withTranslation()(RegFacEvlList)