import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { BASEURL } from '../assets/baseURL';
import $ from 'jquery';
import FacilitatorSidebar from '../../SidebarFiles/FacilitatorSidebar';
import { withTranslation } from 'react-i18next';
import { FaCaretDown, FaAngleLeft } from "react-icons/fa";
import dashboardIcon from '../assets/icon_dashboard.png'
import ReactPaginate from 'react-paginate';
import '../Borrower/Pagination.css';
import '../Borrower/ViewAllLoans.css';
import { confirmAlert } from 'react-confirm-alert';

import Loader from '../Loader/Loader';
//updated
export class ViewLoanRequests extends Component {
    constructor(props) {
        super(props)

        this.state = {

            loanStatus: "1",
            fromdate: "",
            todate: "",
            dtoday: "",
            dfrday: "",

            loanOfferList: [],

            offset: 0,
            orgtableData: [],
            perPage: 5,
            currentPage: 0,
            pageCount: "",
            showLoader: false,
        }
    }
    componentDidMount() {
        if (sessionStorage.getItem('isLogin') == "true") {
            //this.setState({ showLoader: true })
            this.loadDate();
            this.viewAllLoans()
        } else {
            window.location = '/login'
        }

    }
    perPage = (event) => {
        this.setState({ perPage: event.target.value })
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
            loanOfferList: slice
        })
    }
    loanStatus = (e) => {
        this.setState({ loanStatus: e.target.value })
        if (e.target.value == 1) {
            this.setState({ loanName: "List of Active Loans" })
        } else if (e.target.value == 2) {
            this.setState({ loanName: "List of Closed Loans" })
        }

    }
    fromdate = (event) => {
        this.setState({ fromdate: event.target.value })
    }
    todate = (event) => {
        this.setState({ todate: event.target.value })
    }
    loadDate() {
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
    viewAllLoans = (event) => {
        fetch(BASEURL + '/lsp/assistedgetloanrequests', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                loanstatus: this.state.loanStatus,
            })
        }).then(response => {
            console.log('Response:', response)
            return response.json();

        })
            .then((resdata) => {
                if (resdata.status == 'SUCCESS') {
                    this.setState({ showLoader: false })
                    console.log(resdata.msgdata);
                    this.setState({ loanOfferList: resdata.msgdata })

                    var data = resdata.msgdata
                    console.log(data)
                    var slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
                    console.log(slice)

                    this.setState({
                        pageCount: Math.ceil(data.length / this.state.perPage),
                        orgtableData: data,
                        loanOfferList: slice
                    })

                    if (this.state.loanStatus == 1) {
                        this.setState({ loanName: "List of Active Loans" })
                    } else if (this.state.loanStatus == 2) {
                        this.setState({ loanName: "List of Closed Loans" })
                    }


                }
                else {
                    this.setState({ showLoader: false })
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
            }).catch((error) => {
                console.log(error)
            })
    }

    viewAllLoans2 = (event) => {

        fetch(BASEURL + '/lsp/assistedgetloanrequests', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                loanstatus: this.state.loanStatus,
                fromdate: this.state.fromdate,
                todate: this.state.todate
            })
        }).then(response => {
            console.log('Response:', response)
            return response.json();

        })
            .then((resdata) => {
                if (resdata.status == 'SUCCESS') {
                    console.log(resdata.msgdata);
                    this.setState({ loanOfferList: resdata.msgdata })

                    var data = resdata.msgdata
                    console.log(data)
                    var slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
                    console.log(slice)

                    this.setState({
                        pageCount: Math.ceil(data.length / this.state.perPage),
                        orgtableData: data,
                        loanOfferList: slice
                    })

                    if (this.state.loanStatus == 1) {
                        this.setState({ loanName: "List of Active Loans" })
                    } else if (this.state.loanStatus == 2) {
                        this.setState({ loanName: "List of Closed Loans" })
                    }


                }
                else {
                    alert("Issue: " + resdata.message);
                }
            }).catch((error) => {
                console.log(error)
            })
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
        return (
            <div className="container-dashboard d-flex flex-row" id="wrapper" style={{ marginTop: "-7px", backgroundColor: "#F4F7FC" }}>
                {
                    this.state.showLoader && <Loader />
                }
                <FacilitatorSidebar />
                <div className="main-content" id="page-content-wrapper">
                    <div className="container-fluid row pt-2" style={{ marginBottom: "-11px" }}>
                        <div className="col-1" id="allLoansnav">
                            <button style={{ marginLeft: "25px" }} onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className='col-4' id="allLoansnav2" style={{ marginLeft: "20px", marginTop: "5px" }}>
                            <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                <Link to="/facilitatorDashboard">Home</Link> / View Loans</p>
                        </div>
                        <div className='col'>

                        </div>
                        <div className='col'>

                        </div>
                        <div className='col-3'>

                        </div>
                        <div className="col" id="allLoansnav3">
                            <button style={myStyle}>
                                <Link to="/facilitatorDashboard" style={{ marginLeft: "10px" }}><FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} /><span style={{ textDecoration: "none", color: "white" }}>Back</span></Link></button>
                        </div>
                    </div>
                    <hr className="col-11" style={{ marginLeft: "50px", width: "88.6%", backgroundColor: "rgba(4,78,160,1)" }} />
                    <div className='row '>
                        <div className="col">
                            <p className="d-flex justify-content-center" style={{ fontSize: "20px", fontWeight: "bold" }}>{t('View Loan Requests')}</p>
                        </div>
                    </div>
                    {/* Select Date */}
                    <div className='row' style={{ paddingLeft: "50px" }}>
                        <div className='col-2'>
                            <p style={{ marginBottom: "4px", color: "rgba(5,54,82,1)", fontSize: "12px", fontWeight: "700" }}>Status</p>
                            <select onChange={this.loanStatus} style={{
                                border: "1px solid rgba(40,116,166,1)",
                                height: "35px", fontSize: "14px", borderRadius: "4px", color: "rgba(40,116,166,1)"
                            }} className="form-select">
                                <option value="1" defaultValue>Active Loans</option>
                                <option value="2">Closed Loans</option>
                            </select>
                        </div>
                        <div className='col-3'>
                            <p style={{ marginBottom: "4px", color: "rgba(5,54,82,1)", fontSize: "12px", fontWeight: "700" }}>From Date*</p>
                            <input id="Fdate" type="date" className='form-control'
                                defaultValue={this.state.dfrday} onChange={this.fromdate} style={{
                                    border: "1px solid rgba(40,116,166,1)",
                                    borderRadius: "5px",
                                    width: "240px",
                                    fontSize: "15px",
                                    color: "rgba(40,116,166,1)",
                                    paddingLeft: "10px"
                                }} />
                        </div>
                        <div className='col-3' style={{ fontSize: "15px" }}>
                            <p style={{ marginBottom: "4px", color: "rgba(5,54,82,1)", fontSize: "12px", fontWeight: "700" }}>To Date*</p>
                            <input id="Tdate" type="date" className='form-control'
                                defaultValue={this.state.dtoday} onChange={this.todate} style={{
                                    border: "1px solid rgba(40,116,166,1)",
                                    borderRadius: "5px",
                                    width: "240px",
                                    fontSize: "15px",
                                    color: "rgba(40,116,166,1)",
                                    paddingLeft: "10px"
                                }} />
                        </div>
                        <div className='col-2' style={{ paddingTop: '24px' }}>
                            <button type="button" className="btn btn-sm text-white" style={{ backgroundColor: "rgba(0,121,190,1)", width: "100px", }} onClick={this.viewAllLoans2}>{t('Apply')}</button>
                        </div>

                    </div>
                    {/* manual entities */}
                    <div class="d-flex flex-row" style={{ marginLeft: "50px", fontWeight: "700", fontSize: "14px", marginBottom: "1px", color: "rgba(5,54,82,1)" }}>
                        <div class="pt-2 pb-2 pr-1">Show</div>
                        <div class="pt-2 pb-2"><input type='number' name="number" value={this.state.perPage} style={{ width: "39px", height: "18px", paddingLleft: "4px", fontWeight: "600", fontSize: "14px" }} onChange={this.perPage} /></div>
                        <div class="pt-2 pb-2 pl-1">Entries in a page</div>
                    </div>
                    <div className='row'>
                        <div className="col">
                            <div className='card' style={{ width: "92%", marginLeft: "50px", marginBottom: "10px", cursor: "default", paddingBottom: "20px" }}>
                                <p style={{ fontWeight: "700", textAlign: "center", color: "rgba(31,88,126,1)", textDecoration: "underline" }}>{this.state.loanName}</p>

                                <div className='row pl-4' style={{ color: "rgba(5,54,82,1)", fontWeight: "600" }}>
                                    <div className='col-2'>
                                        <p>Borrower Name</p>
                                    </div>
                                    <div className='col-3'>
                                        <p>Loan Request Number</p>
                                    </div>
                                    <div className='col-2'>
                                        <p style={{ marginLeft: "-14px" }}>Loan Amount</p>
                                    </div>
                                    <div className='col-2'>
                                        <p style={{ marginLeft: "-14px" }}>Tenure</p>
                                    </div>
                                    <div className='col-2'>
                                        <p style={{ marginLeft: "-14px" }}>Request Date</p>
                                    </div>
                                </div>
                                <hr className="col" style={{ marginTop: "-10px" }} />
                                {
                                    this.state.loanOfferList.map((loan, index) => {
                                        return (
                                            <div key={index}>
                                                {loan.loanaccountstatus == this.state.loanStatus ?
                                                    <div className="row">
                                                        <div className="col">
                                                            <div className='card' href="javascript:;" style={{
                                                                marginBottom: "-10px", border: "1px solid rgba(40,116,166,1)", borderRadius: "5px", cursor: "default",
                                                                backgroundColor: (index % 2 == 0) ? 'rgba(255,255,255,1)' : 'rgba(242,242,242,1)'
                                                            }}>
                                                                <div className="row item-list align-items-center" style={{ color: "rgba(5,54,82,1)" }}>
                                                                    <div className='col-2'>
                                                                        <h6 className="pl-4" style={{ fontWeight: "490" }}>{loan.name}</h6>
                                                                    </div>
                                                                    <div className="col-3 mt-2 ">
                                                                        <h6 className="pl-4" style={{ fontWeight: "490" }}>{loan.loanreqno}</h6>
                                                                    </div>
                                                                    <div className="col-2 mt-2">
                                                                        <h6 style={{ fontWeight: "490" }}>₹{loan.offeredamt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</h6>
                                                                    </div>
                                                                    <div className="col-2 mt-2">
                                                                        <h6 style={{ fontWeight: "490" }}>{loan.tenureoffered} {loan.repaymentfrequencydesc}</h6>
                                                                    </div >
                                                                    <div className="col-2 mt-2">
                                                                        <h6 style={{ fontWeight: "490" }}>{loan.loanrequestdate}</h6>
                                                                    </div >
                                                                </div >
                                                            </div>
                                                        </div>
                                                    </div>
                                                    : null}
                                            </div>
                                        );
                                    })
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
                                        onPageChange={this.handlePageClick}
                                        containerClassName={"pagination"}
                                        subContainerClassName={"pages pagination"}
                                        activeClassName={"active"}
                                    />
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        )
    }
}

export default withTranslation()(ViewLoanRequests)




