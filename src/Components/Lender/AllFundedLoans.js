import React, { Component } from 'react';
import { BASEURL } from '../assets/baseURL';
import LenderSidebar from '../../SidebarFiles/LenderSidebar';
import $ from 'jquery';
import * as FaIcons from "react-icons/fa";
import { withTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { FaAngleDown, FaMoneyBill, FaAngleDoubleDown, FaRegFileAlt, FaAngleLeft } from 'react-icons/fa';
import dashboardIcon from '../assets/icon_dashboard.png'
import { confirmAlert } from 'react-confirm-alert';

import './AllFundedLoans.css'

class AllFundedLoans extends Component {
    //updated
    constructor(props) {
        super(props)

        this.state = {
            lenderid: "",
            fromdate: "",
            todate: "",
            fundedLoanList: [],
            loanlistingno: "",
            lenderid: "",
            fundedamt: "",
            loanstatus: "3",
            dtoday: "",
            dfrday: ""
        }
        this.fromdate = this.fromdate.bind(this);
        this.todate = this.todate.bind(this);
        this.loanstatus = this.loanstatus.bind(this);
        this.fundedLoans = this.fundedLoans.bind(this);
        // this.dtoday = this.dtoday.bind(this);
        // this.dfrday = this.dfrday.bind(this);
    }

    componentDidMount() {
        if (sessionStorage.getItem('isLogin') == "true") {
            console.log(sessionStorage.getItem('token'));
            console.log(sessionStorage.getItem('userID'));
            console.log(sessionStorage.getItem('loanStatus'));
            this.loadDate();
            this.loadfundedLoans();
        } else {
            window.location = '/login'
        }

    }

    fromdate(event) {
        this.setState({ fromdate: event.target.value })
    }
    todate(event) {
        this.setState({ todate: event.target.value })
    }
    loanstatus(event) {
        this.setState({ loanstatus: event.target.value })
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
    loadfundedLoans = (event) => {
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

        fetch(BASEURL + '/lms/getfundedloans', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                lenderid: sessionStorage.getItem('userID'),
                fromdate: frday,
                todate: today,
                loanstatus: this.state.loanstatus
            })
        }).then(response => {
            console.log('Response:', response)
            return response.json();

        })
            .then((resdata) => {
                if (resdata.status == 'SUCCESS') {
                    var list = resdata.msgdata;
                    list.sort((a, b) => {
                        return new Date(b.txndate).getTime() - new Date(a.txndate).getTime()
                    })
                    console.log(list);
                    this.setState({ fundedLoanList: list })
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
                        this.setState({ fundedLoanList: [] })
                        // confirmAlert({
                        //     message: resdata.message,
                        //     buttons: [
                        //         {
                        //             label: "OK",
                        //             onClick: () => {
                        //                 // window.location.reload();
                        //             },
                        //         },
                        //     ],
                        // });
                    }
                }
            })
    }

    fundedLoans(event) {
        fetch(BASEURL + '/lms/getfundedloans', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                lenderid: sessionStorage.getItem('userID'),
                fromdate: this.state.fromdate,
                todate: this.state.todate,
                loanstatus: this.state.loanstatus
            })
        }).then(response => {
            console.log('Response:', response)
            return response.json();

        })
            .then((resdata) => {
                if (resdata.status == 'SUCCESS') {
                    var list = resdata.msgdata;
                    list.sort((a, b) => {
                        return new Date(b.txndate).getTime() - new Date(a.txndate).getTime()
                    })
                    console.log(list);
                    this.setState({ fundedLoanList: list })
                } else {
                    this.setState({ fundedLoanList: [] })
                    // confirmAlert({
                    //     message: resdata.message,
                    //     buttons: [
                    //         {
                    //             label: "OK",
                    //             onClick: () => {
                    //                 // window.location.reload();
                    //             },
                    //         },
                    //     ],
                    // });
                }
            })
    }
    withdrawFund(l) {
        fetch(BASEURL + '/lms/withdrawfunding', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                loanlistingno: l.loanlistingno,
                lenderid: sessionStorage.getItem('userID'),
                fundedamt: parseInt(l.fundamt)
            })
        }).then(response => {
            console.log('Response:', response)
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata);
                if (resdata.status == 'Success') {
                    alert("withdraw funding successfull.")
                } else {
                    alert("Issue: " + resdata.message);
                }
            })
    }
    handleChange() {
        $('.text').toggle();
        $('#PImage').toggle();
        $('#Pinfo').toggle();
    }
    render() {
        const { t } = this.props
        return (
            <div className="container-dashboard d-flex flex-row" id="wrapper" style={{ marginTop: "-10px", backgroundColor: "#f4f7fc" }}>
                <LenderSidebar />
                <div className="main-content" id="page-content-wrapper">
                    <div className="container-fluid row pt-2">
                        <div className="col-1" id='navRes1'>
                            <button style={{ marginLeft: "25px" }} onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className='col-4' id='navRes2' style={{ marginLeft: "20px", marginTop: "5px" }}>
                            <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                <Link to="/lenderdashboard">Home</Link> /My Funded Loans</p>
                        </div>
                        <div className='col'>

                        </div>
                        <div className='col'>

                        </div>
                        <div className='col-3'>

                        </div>
                        <div className="col" id='navRes3'>
                            <button style={{ color: "white", height: "25px", width: "65px", border: "none", backgroundColor: "rgba(5,54,82,1)", borderRadius: "5px", marginLeft: "14px" }}>
                                <Link to="/lenderdashboard"><FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} /><span style={{ textDecoration: "none", color: "white" }}>Back</span></Link></button>
                        </div>
                    </div>

                    <hr className="col-11" style={{ marginLeft: "50px", width: "88.6%", backgroundColor: "rgba(4,78,160,1)", marginTop: "-10px" }} />
                    <div className='row '>
                        <div className="col">
                            <p className="d-flex justify-content-center" style={{ fontSize: "20px", fontWeight: "bold" }}>{t('MyFundedLoans')}</p>
                        </div>
                    </div>

                    {/* Filter */}
                    <div className='row' style={{ paddingLeft: "50px" }}>
                        <div className='col-3' id='date1'>
                            <label htmlFor="date" id='label1' className="label" style={{ fontSize: "14px", marginLeft: "0px", fontFamily: "Poppins,sans-serif", color: "rgba(5,54,82,1)" }}>{t('From Date*')}</label><br />
                            <input id="Fdate" type="date"
                                defaultValue={this.state.dfrday} onChange={this.fromdate} style={{
                                    border: "1px solid rgba(40,116,166,1)",
                                    borderRadius: "5px",
                                    width: "260px",
                                    fontSize: "15px",
                                    color: "rgba(40,116,166,1)",
                                    paddingLeft: "10px"
                                }} />
                        </div>
                        <div className='col-3' id='date2' style={{ fontSize: "15px", marginLeft: "20px" }}>
                            <label htmlFor="date" className="label" style={{ fontSize: "14px", marginTop: "5px", fontFamily: "Poppins,sans-serif", marginLeft: "0px", color: "rgba(5,54,82,1)" }}>{t('To Date*')}</label><br />
                            <input id="Tdate" type="date"
                                defaultValue={this.state.dtoday} onChange={this.todate} style={{
                                    border: "1px solid rgba(40,116,166,1)",
                                    borderRadius: "5px",
                                    width: "260px",
                                    fontSize: "15px",
                                    color: "rgba(40,116,166,1)",
                                    marginTop: "1px",
                                    paddingLeft: "10px"
                                }} />
                        </div>
                        <div className='col-3' id='status' style={{ fontSize: "15px", marginLeft: "20px" }}>
                            <label className="label" style={{ fontSize: "14px", marginTop: "5px", fontFamily: "Poppins,sans-serif", marginLeft: "0px", color: "rgba(5,54,82,1)" }}>Loan Status*</label><br />
                            <select id="StatusA" onChange={this.loanstatus} style={{
                                border: "1px solid rgba(40,116,166,1)",
                                height: "25px", width: "170px",
                                fontSize: "14px", borderRadius: "4px", color: "rgba(40,116,166,1)"
                            }}>
                                <option defaultValue>{t('--Select--')}</option>
                                <option value="1">{t('Active')}</option>
                                <option value="2">{t('Closed')}</option>
                                <option value="3">{t('All')}</option>
                                <option value="0">{t('Predisbursed')}</option>
                            </select>
                        </div>
                        <div className='col' style={{ paddingTop: '30px' }}>
                            <button type="button" className="btn btn-sm text-white" style={{ backgroundColor: "rgba(0,121,190,1)", width: "100px", }} onClick={this.fundedLoans}>{t('Apply')}</button>
                        </div>
                    </div>
                    <hr className="col-11" style={{ marginLeft: "50px", width: "88.6%" }} />

                    {/* The Lists */}
                    <div className='pl-5 pr-5'>
                        {this.state.fundedLoanList == "" ?
                            <div className="row mt-2" style={{ marginLeft: "6px" }}>
                                <div className="col" style={{ textAlign: "center", color: "#222C70", fontSize: "14px", fontWeight: "500" }}>
                                    <p>No lists available.</p>
                                </div>
                            </div> :
                            <div className="scrollbar" style={{ cursor: "default", overflowX: "hidden" }} >
                                <div className='row pl-2 pr-2' >
                                    {
                                        this.state.fundedLoanList && this.state.fundedLoanList.length > 0 &&
                                        this.state.fundedLoanList.map((loans, index) => {
                                            return (
                                                <div className='col-lg-4 col-md-6 col-sm-12 mb-4' key={index}>
                                                    <div className='card p-3' style={{ border: "2px solid rgba(0,121,190,1)", marginBottom: "1px", cursor: "default", color: "rgb(5, 54, 82)" }}>
                                                        <div className='row' style={{ fontSize: "14px" }}>
                                                            <p className="font-weight-bold" style={{ marginBottom: "1px" }}>Borrower ID</p>
                                                            <p>{loans.borrowerid}
                                                                <hr style={{ color: "rgba(42,143,211,1)" }} />
                                                            </p>
                                                            <div className='col-lg-6 col-sm-12 col-md-12' style={{ marginTop: "-30px" }}>
                                                                {loans.loanaccountno === "" ?
                                                                    <p>
                                                                        <p className="font-weight-bold" style={{ marginBottom: "1px", width: "" }}>{t('Loan Listing No.')}</p>
                                                                        <p>{loans.loanlistingno}</p>
                                                                    </p>
                                                                    : <p>
                                                                        <p className="font-weight-bold" style={{ marginBottom: "1px", width: "max-content" }}>{t('Loan Account No.')}</p>
                                                                        <p>{loans.loanaccountno}</p>
                                                                    </p>
                                                                }
                                                                <p className="font-weight-bold" style={{ marginBottom: "1px" }}>{t('LoanAmount')}</p>
                                                                <p>₹{(loans.loanamt).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
                                                                </p>

                                                                <p className="font-weight-bold" style={{ marginBottom: "1px" }}>{t('InterestRate')}</p>
                                                                <p>{loans.interestrate}
                                                                </p>
                                                            </div>
                                                            <div className='col-lg-6 col-sm-12 col-md-12' style={{ marginTop: "-30px" }}>
                                                                <p className="font-weight-bold" style={{ marginBottom: "1px" }}>{t('FundedAmount')}</p>
                                                                <p>₹{(loans.fundamt).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
                                                                </p>
                                                                <p className="font-weight-bold" style={{ marginBottom: "1px" }}>{t('Funded On')}</p>
                                                                <p>{loans.txndate.split("-").reverse().join("-")}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className='row' style={{ fontSize: "14px" }}>
                                                            {loans.listingstatus == 2 ?
                                                                <div style={{ textAlign: "center" }}>
                                                                    <button type="button" className="btn btn-sm"
                                                                        style={{ backgroundColor: "rgba(0,121,190,1)", color: "white" }}
                                                                        onClick={() => this.withdrawFund(loans)}><FaMoneyBill />&nbsp;{t('WithdrawFunding')}</button>
                                                                </div>
                                                                : <>{loans.loanstatus == 1 ?
                                                                    <div style={{ textAlign: "center" }}>
                                                                        <button type="button" className="btn btn-sm" style={{ border: "1px solid blue" }}>{t('ActiveLoan')}</button>
                                                                    </div> : <>{loans.loanstatus == 2 ?
                                                                        <div style={{ textAlign: "center" }}>
                                                                            <button type="button" className="btn btn-sm" style={{ border: "1px solid rgba(40,116,166,1)", color: "rgba(40,116,166,1)", cursor: "default" }}>{t('Closed Loan')}</button>
                                                                        </div> : <div style={{ textAlign: "center" }}>
                                                                            <button type="button" className="btn btn-sm" style={{ border: "1px solid rgba(40,116,166,1)", color: "rgba(40,116,166,1)", cursor: "default" }}>{t('Pre-Disbursed')}</button>
                                                                        </div>}</>}</>
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>}

                    </div>

                    {/* <div className="">
                        {
                            this.state.fundedLoanList.map((loans, index) => {
                                return (
                                    <div key={index}>
                                        <div className="row" >
                                            <div className="col">
                                                <div className="card item-list" style={{ cursor: "default" }}>
                                                    <div className="card-header border-0">
                                                        <div className="row item-list align-items-center">
                                                            <div className="col">
                                                                <h6>{t('BorrowerId')}</h6>
                                                                <p>{loans.borrowerid}</p>
                                                            </div>
                                                            
                                                            <div className="col">
                                                                {loans.loanaccountno === "" ?
                                                                    <div>
                                                                        <h6>{t('LoanListingNumber')}</h6><p>{loans.loanlistingno}</p> </div>
                                                                    : <p><h6>{t('LoanAccountNumber')}</h6><p>{loans.loanaccountno}</p></p>
                                                                }
                                                            </div>
                                                            <div className="col">
                                                                <h6>{t('LoanAmount')}</h6>
                                                                <p>{(loans.loanamt).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</p>
                                                            </div >
                                                            <div className="col">
                                                                <h6>{t('FundedAmount')}</h6>
                                                                <p>{loans.fundamt}</p>
                                                            </div >
                                                            <div className="col">
                                                                <h6>{t('InterestRate')}</h6>
                                                                <p>{loans.interestrate}</p>
                                                            </div>
                                                            <div className="col">
                                                                <h6>{t('FundedOn')}</h6>
                                                                <p>{loans.txndate}</p>
                                                            </div>
                                                            <div className="col">
                                                           
                                                                {loans.listingstatus == 2 ?
                                                                    <div>
                                                                        <button className="btn btn-primary" onClick={() => this.withdrawFund(loans)}>{t('WithdrawFunding')}</button> </div>
                                                                    : <p>{loans.loanstatus == 1 ? <div><h6>{t('ActiveLoan')}</h6> </div> : <p>{loans.loanstatus == 2 ? <div><h6>{t('CloseLoan')}</h6> </div> : <div><h6>{t('Pre-disbursed')}</h6> </div>}</p>}</p>
                                                                }
                                                            </div>
                                                        </div >
                                                    </div >
                                                </div >
                                            </div >
                                        </div >
                                    </div>
                                );
                            })
                        }
                    </div> */}

                </div>
            </div>
        )
    }
}

export default withTranslation()(AllFundedLoans)
