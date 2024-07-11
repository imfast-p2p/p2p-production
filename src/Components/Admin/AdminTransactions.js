import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { BASEURL } from '../assets/baseURL';
import AdminSidebar from './AdminSidebar';
import $ from 'jquery';
import { confirmAlert } from "react-confirm-alert";
import { withTranslation } from 'react-i18next';
import { FaAngleLeft } from 'react-icons/fa';
import dashboardIcon from '../assets/icon_dashboard.png';
import ReactPaginate from 'react-paginate';

class AdminTransactions extends Component {
    constructor(props) {
        super(props)
        this.state = {
            fromdate: "",
            todate: "",
            dtoday: "",
            dfrday: "",

            amount: "",
            debtorname: "",
            creditdebit: "",
            valuedate: "",
            bankrefno: "",

            adminTxnList: [],

            offset: 0,
            perPage: 5,
            currentPage: 0,
            pageCount: "",
        }
    }
    componentDidMount() {
        if (sessionStorage.getItem('isLogin') == "true" && sessionStorage.getItem('status') == 'Success') {
            this.adminTransactions2()
            this.loadDate();
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
            adminTxnList: slice
        })
    }
    fromdate = (event) => {
        this.setState({ fromdate: event.target.value })
    }
    todate = (event) => {
        this.setState({ todate: event.target.value })
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
        this.setState({ dtoday: today });
        this.setState({ todate: today })
        this.setState({ dfrday: frday });
        this.setState({ fromdate: frday })

    }
    adminTransactions2 = () => {
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
        fetch(BASEURL + '/lms/getplatformbankstmttxns', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                fromdate: frday,
                todate: today,
            })
        }).then(response => {
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata)
                if (resdata.status == 'SUCCESS') {
                    console.log(resdata);
                    this.setState({ adminTxnList: resdata.msgdata })

                    var data = resdata.msgdata
                    console.log(data)
                    var slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
                    console.log(slice)

                    this.setState({
                        pageCount: Math.ceil(data.length / this.state.perPage),
                        orgtableData: data,
                        adminTxnList: slice
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
    adminTransactions = () => {
        fetch(BASEURL + '/lms/getplatformbankstmttxns', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                fromdate: this.state.fromdate,
                todate: this.state.todate,
            })
        }).then(response => {
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata)
                if (resdata.status == 'SUCCESS') {
                    console.log(resdata);
                    this.setState({ adminTxnList: resdata.msgdata })

                    var data = resdata.msgdata
                    console.log(data)
                    var slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
                    console.log(slice)

                    this.setState({
                        pageCount: Math.ceil(data.length / this.state.perPage),
                        orgtableData: data,
                        adminTxnList: slice
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

    handleChange() {
        $('.text').toggle();
        $("#Pinfo").toggle();
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
            <div className="container-dashboard d-flex flex-row" id="wrapper" style={{ backgroundColor: "#f4f7fc" }}>
                <AdminSidebar />
                <div className="main-content" id="page-content-wrapper">
                    <div className="container-fluid row pt-2">
                        <div className="col-1">
                            <button style={{ marginLeft: "25px" }} onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className='col-4' style={{ marginLeft: "20px", marginTop: "5px" }}>
                            <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                <Link to="/landing">Home</Link> / Escrow Passbook</p>
                        </div>
                        <div className='col'>

                        </div>
                        <div className='col'>

                        </div>
                        <div className='col-3'>

                        </div>
                        <div className="col">
                            <button style={myStyle}>
                                <Link to="/landing"><FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} /><span style={{ textDecoration: "none", color: "white" }}>Back</span></Link></button>
                        </div>
                    </div>
                    <hr className="col-11" style={{ marginLeft: "50px", width: "88.6%", backgroundColor: "rgba(4,78,160,1)", marginTop: "0px" }} />
                    <div className='row '>
                        <div className="col">
                            <p className="d-flex justify-content-center" style={{ fontSize: "20px", fontWeight: "bold", color: "rgba(5,54,82,1)" }}>{t('Escrow Passbook')}</p>
                        </div>
                    </div>

                    {/* New Design */}
                    {/* Select Date */}
                    <div className='row' style={{ paddingLeft: "50px" }}>
                        <div className='col-3'>
                            <label htmlFor="date" className="label" style={{ fontSize: "13px", marginLeft: "0px", color: "rgba(5,54,82,1)" }}>{t('From Date*')}</label><br />
                            <input id="Fdate" type="date"
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
                            <label htmlFor="date" className="label" style={{ fontSize: "13px", marginLeft: "0px", color: "rgba(5,54,82,1)" }}>{t('To Date*')}</label><br />
                            <input id="Tdate" type="date"
                                defaultValue={this.state.dtoday} onChange={this.todate} style={{
                                    border: "1px solid rgba(40,116,166,1)",
                                    borderRadius: "5px",
                                    width: "240px",
                                    fontSize: "15px",
                                    color: "rgba(40,116,166,1)",
                                    marginTop: "3px",
                                    paddingLeft: "10px"
                                }} />
                        </div>
                        <div className='col-2' style={{ paddingTop: '30px' }}>
                            <button type="button" className="btn btn-sm text-white" style={{ backgroundColor: "rgba(0,121,190,1)", width: "100px", }} onClick={this.adminTransactions}>{t('Apply')}</button>
                        </div>
                    </div>

                    {/* <div className="m-3">
                        <div className="form-group m-2">
                            <h6 className=" pl-1">{t('SelectDate')}</h6>
                            <hr style={{ width: '100px' }} />
                            <div className="row">
                                <div className="col-sm-5 col-md-5 col-lg-5 form-group">
                                    <label htmlFor="date" className="label">{t('FromDate')}: </label><br />
                                    <input id="Fdate" type="date" defaultValue={this.state.dfrday} onChange={this.fromdate} className="input ml-2" />
                                </div>
                                <div className="col-sm-5 col-md-5 col-lg-5 form-group">
                                    <label htmlFor="date" className="label">{t('ToDate')}: </label><br />
                                    <input id="Tdate" type="date" defaultValue={this.state.dtoday} onChange={this.todate} className="input ml-2" />
                                </div>
                                <div className="col-sm-2 col-md-2 col-lg-2 form-group" style={{ paddingTop: '6px' }}>
                                    <button type="button" className="btn btn-success pl-3 pr-3 pb-2 ml-3 mt-4 mb-2" onClick={this.adminTransactions}>{t('Apply')}</button>
                                </div>
                            </div>
                        </div>
                    </div> */}
                    {this.state.adminTxnList == "" ?
                        <div className="row mt-2" style={{ marginLeft: "6px" }}>
                            <div className="col" style={{ textAlign: "center", color: "#222C70", fontSize: "14px", fontWeight: "500" }}>
                                <p>No statements available !</p>
                            </div>
                        </div> :
                        <>
                            <div class="d-flex flex-row" style={{ marginLeft: "50px", fontWeight: "600", fontSize: "14px", color: "rgba(5,54,82,1)" }}>
                                <div class="pt-2 pb-3 pr-1">Show</div>
                                <div class="pt-2 pb-2"><input type='number' name="number" value={this.state.perPage} style={{ width: "39px", height: "18px", paddingLleft: "4px", fontWeight: "600", fontSize: "14px" }} onChange={this.perPage} /></div>
                                <div class="pt-2 pb-3 pl-1">Entries in a page</div>
                            </div>
                            <div className='row pl-4 font-weight-normal' style={{ marginLeft: "50px", fontWeight: "800", fontSize: "15px", color: "rgba(5,54,82,1)" }}>
                                <div className='col-2'>
                                    <p style={{ marginLeft: "-15px", fontWeight: "600" }}>{t('Date')}</p>
                                </div>
                                <div className='col-3'>
                                    <p style={{ marginLeft: "50px", fontWeight: "600" }}>{t('Debitor Name')}</p>
                                </div>
                                <div className='col-3'>
                                    <p style={{ marginLeft: "40px", fontWeight: "600" }}>{t('Bank Reference no.')}</p>
                                </div>
                                <div className='col'>
                                    <p style={{ marginLeft: "140px", fontWeight: "600" }}>{t('Amount')}</p>
                                </div>
                            </div>
                            <hr className="col-11" style={{ marginLeft: "50px", width: "88.6%", marginTop: "-10px" }} />

                            {/* Lists */}
                            <div className="">
                                {
                                    this.state.adminTxnList.map((lists, index) => {
                                        return (
                                            <div className='col' key={index}>
                                                <div className='card border-0' style={{ marginBottom: "-10px", transition: 'none', color: "rgb(5, 54, 82)", cursor: 'default', width: "95%", marginLeft: "30px", backgroundColor: (index % 2 == 0) ? 'rgba(255,255,255,1)' : 'rgba(242,242,242,1)' }}>
                                                    <div className="row item-list align-items-center">
                                                        <div className="col" style={{ paddingLeft: "20px" }}>
                                                            <p className="ml-4 p-0" style={{ fontSize: "17px", fontWeight: "490", marginTop: "15px" }}>{lists.valuedate}</p>
                                                        </div >
                                                        <div className="col">
                                                            <p style={{ fontSize: "17px", fontWeight: "490", paddingTop: "12px" }}>{lists.debtorname}</p>
                                                        </div >
                                                        <div className="col">
                                                            <p style={{ fontSize: "17px", fontWeight: "490", paddingTop: "12px", marginLeft: "-5px" }}>{lists.bankrefno}</p>
                                                        </div>
                                                        <div className="col">
                                                            <p className="mr-5" style={{ fontSize: "17px", fontWeight: "490", paddingTop: "12px", paddingLeft: "90px" }}>₹ {lists.amount} {lists.creditdebit == "CRDT" ? "CR" : "DR"}</p>
                                                        </div>
                                                    </div >
                                                </div>
                                            </div>
                                        )
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
                                        // marginPagesDisplayed={1}
                                        // pageRangeDisplayed={5}
                                        onPageChange={this.handlePageClick}
                                        containerClassName={"pagination"}
                                        subContainerClassName={"pages pagination"}
                                        activeClassName={"active"}
                                    />
                                </div>
                            </div>
                        </>}

                    {/* <div className="row">
                        <div className="col">
                            {
                                this.state.adminTxnList.map((lists, index) => {
                                    return (
                                        <div className="row" key={index}>
                                            <div className="col">
                                                <div className="card item-list" style={{ cursor: "default", marginBottom: "-5px" }}>
                                                    <div className="card-header border-0">

                                                        <div className="row item-list align-items-center">
                                                            <div className="col-2">
                                                                <p>{t('Date')}</p>
                                                                <h6>{lists.valuedate}</h6>
                                                            </div>
                                                            <div className="col">
                                                                <p>{t('Debitor Name')}</p>
                                                                <h6>{lists.debtorname}</h6>
                                                            </div>
                                                            <div className="col">
                                                                <p>{t('Bank Reference no.')}</p>
                                                                <h6>{lists.bankrefno}</h6>
                                                            </div >
                                                            <div className="col">
                                                                <p>{t('Amount')}</p>
                                                                <h6>₹{lists.amount} {lists.creditdebit == "CRDT" ? "CR" : "DR"}</h6>
                                                            </div >

                                                        </div >
                                                    </div >
                                                </div >
                                            </div >
                                        </div >
                                    )
                                })
                            }

                        </div>
                    </div> */}
                </div>
            </div>
        )
    }
}

export default withTranslation()(AdminTransactions)
