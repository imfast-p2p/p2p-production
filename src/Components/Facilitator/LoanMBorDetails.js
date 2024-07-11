
import React, { Component } from 'react';
import { BASEURL } from '../assets/baseURL';
import FacilitatorSidebar from '../../SidebarFiles/FacilitatorSidebar';
import $ from 'jquery';
import { Link } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { confirmAlert } from 'react-confirm-alert';

export class LoanMBorDetails extends Component {


    constructor(props) {
        super(props)

        this.state = {
            name: "",
            mobileno: "",
            gender: "",
            email: "",
        }

    }

    getBorrowerProfileInfo = (loanreq) => {
        fetch(BASEURL + '/lsp/getborprofileinfo?loanreqnumber=' + sessionStorage.getItem("loanReq"), {
            headers: {
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            }
        })
            .then((Response) => {
                return Response.json();
            })
            .then((resdata) => {
                if (resdata.status == 'SUCCESS') {
                    console.log(resdata);

                    this.setState({ name: resdata.msgdata[0].name })
                    this.setState({ mobileno: resdata.msgdata[0].mobile })
                    this.setState({ gender: resdata.msgdata[0].gender })
                    this.setState({ email: resdata.msgdata[0].email })


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
                                    },
                                },
                            ],
                        });
                    }
                }
            })
    }
    componentDidMount() {
        this.getBorrowerProfileInfo();
    }

    handleChange() {
        $('.text').toggle();
        $('#PImage').toggle();
        $('#Pinfo').toggle();
    }

    render() {
        const { t } = this.props
        const loanreqno = sessionStorage.getItem("loanReq");
        const borid = sessionStorage.getItem("borrowerid");
        const emi = sessionStorage.getItem("emiamt");
        const ir = sessionStorage.getItem("interestrate");
        const lastrepay = sessionStorage.getItem("lastrepaymentdate");
        const lasttx = sessionStorage.getItem("lasttxndate");
        const loanouts = sessionStorage.getItem("loanoutstanding");
        const pricipalloan = sessionStorage.getItem("principaloutstanding");
        const tenure = sessionStorage.getItem("tenure");
        const repayment = sessionStorage.getItem("repaymentfrequencydesc");

        return (
            <div className="container-dashboard d-flex flex-row" id="wrapper" style={{marginTop:"-7px",backgroundColor: "#F7FCFF"}}>
                <FacilitatorSidebar />

                <div className="main-content" id="page-content-wrapper">

                    <div className="container-fluid row pt-4">
                        <div className="col">
                            <button onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className="col">
                            <h4 className="pl-4">{t('Borrower Details')}</h4>
                        </div>
                        <div className="col"></div>
                    </div>
                    <hr />
                    <div className="bg-light p-5">
                        <div className="row">
                            <div className="col">
                                <h6>Loan Request no: {loanreqno}</h6>
                            </div>
                        </div>

                        <div className="card" style={{ cursor: "default" }}>
                            <div className="card-header border-0">
                                <div className="row item-list align-items-center">
                                    <div className="col-sm-3 col-md-3 col-lg-3">
                                        <h6 className="ml-4">{t('Borrower Name')}</h6>
                                    </div >
                                    <div className="col-sm-3 col-md-3 col-lg-3">
                                        <h6>{t('Gender')}</h6>
                                    </div >
                                    <div className="col-sm-2 col-md-2 col-lg-2">
                                        <h6>{t('Email')}</h6>
                                    </div>
                                    <div className="col-sm-4 col-md-4 col-lg-4">
                                        <h6 className=" mr-5" style={{ marginLeft: '90px' }} >{t('Mobile Number')}</h6>
                                    </div>
                                </div >
                            </div >
                        </div >
                        <div className='row'>
                            <div>
                                <div className="">
                                    <div className="card-header border-0" style={{ paddingRight: "21px", paddingTop: "0px", paddingBottom: "0px", marginBottom: '-10px', marginTop: '0px' }}>
                                        <div className="row item-list align-items-center">
                                            <div className="col">
                                                <p className="ml-4 p-0">{this.state.name}</p>
                                            </div >
                                            <div className="col">
                                                <p> {this.state.gender == "M" ? "Male" : <p>{this.state.gender == "F" ? "Female" : "Others"}</p>}</p>
                                            </div >
                                            <div className="col">
                                                <p>{this.state.email}</p>
                                            </div>
                                            <div className="col">
                                                <p className=" mr-5">{this.state.mobileno}</p>
                                            </div>
                                        </div >
                                    </div >
                                </div >
                            </div>
                        </div>

                        <div className='row' style={{ justifyContent: "center" }}>
                            <div className="col-sm-6 col-md-6 col-lg-6 ml-2">
                                <div className="card" style={{ cursor: "default" }}>
                                    <div className="card-header border-1">
                                        <div className='row'>
                                            <div className='col-sm-5 col-md-5 col-lg-5'>
                                                <p className="mb-0 font-weight-bold">Borrower Id</p>
                                            </div>
                                            <div className='col-sm-1 col-md-1 col-lg-1'>
                                                <p className="mb-0 font-weight-bold">:</p>
                                            </div>
                                            <div className='col-sm-6 col-md-6 col-lg-6'>
                                                <p className="mb-0">{borid}</p>
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className='col-sm-5 col-md-5 col-lg-5'>
                                                <p className="mb-0 font-weight-bold">EMI</p>
                                            </div>
                                            <div className='col-sm-1 col-md-1 col-lg-1'>
                                                <p className="mb-0 font-weight-bold">:</p>
                                            </div>
                                            <div className='col-sm-6 col-md-6 col-lg-6'>
                                                <p className="mb-0">₹ {parseFloat(emi).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</p>
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className='col-sm-5 col-md-5 col-lg-5'>
                                                <p className="mb-0 font-weight-bold">Interest Rate</p>
                                            </div>
                                            <div className='col-sm-1 col-md-1 col-lg-1'>
                                                <p className="mb-0 font-weight-bold">:</p>
                                            </div>
                                            <div className='col-sm-6 col-md-6 col-lg-6'>
                                                <p className="mb-0">{ir}% P.A.</p>
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className='col-sm-5 col-md-5 col-lg-5'>
                                                <p className="mb-0 font-weight-bold">Last Repayment Date</p>
                                            </div>
                                            <div className='col-sm-1 col-md-1 col-lg-1'>
                                                <p className="mb-0 font-weight-bold">:</p>
                                            </div>
                                            <div className='col-sm-6 col-md-6 col-lg-6'>
                                                <p className="mb-0">{lastrepay}</p>
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className='col-sm-5 col-md-5 col-lg-5'>
                                                <p className="mb-0 font-weight-bold">Last Emi Date</p>
                                            </div>
                                            <div className='col-sm-1 col-md-1 col-lg-1'>
                                                <p className="mb-0 font-weight-bold">:</p>
                                            </div>
                                            <div className='col-sm-6 col-md-6 col-lg-6'>
                                                <p className="mb-0">{lasttx}</p>
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className='col-sm-5 col-md-5 col-lg-5'>
                                                <p className="mb-0 font-weight-bold">Amount Overdue</p>
                                            </div>
                                            <div className='col-sm-1 col-md-1 col-lg-1'>
                                                <p className="mb-0 font-weight-bold">:</p>
                                            </div>
                                            <div className='col-sm-6 col-md-6 col-lg-6'>
                                                <p className="mb-0">₹ {parseFloat(loanouts).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</p>
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className='col-sm-5 col-md-5 col-lg-5'>
                                                <p className="mb-0 font-weight-bold">Principal Outstanding</p>
                                            </div>
                                            <div className='col-sm-1 col-md-1 col-lg-1'>
                                                <p className="mb-0 font-weight-bold">:</p>
                                            </div>
                                            <div className='col-sm-6 col-md-6 col-lg-6'>
                                                <p className="mb-0">₹ {parseFloat(pricipalloan).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</p>
                                            </div>
                                        </div>
                                        <div className='row'>
                                            <div className='col-sm-5 col-md-5 col-lg-5'>
                                                <p className="mb-0 font-weight-bold">Tenure</p>
                                            </div>
                                            <div className='col-sm-1 col-md-1 col-lg-1'>
                                                <p className="mb-0 font-weight-bold">:</p>
                                            </div>
                                            <div className='col-sm-6 col-md-6 col-lg-6'>
                                                <p className="mb-0">{tenure} {repayment == "Day(s)" ? "Days" : <p>{repayment == "Month(s)" ? "Months" : ""}</p>}</p>
                                            </div>
                                        </div>
                                        {/* <p><span style={{ fontWeight: "bold" }}>Borrower Id: </span>{borid}</p>
                                        <p><span style={{ fontWeight: "bold" }}>Emi Amount:</span> ₹{parseFloat(emi).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</p>
                                        <p><span style={{ fontWeight: "bold" }}>Interest Rate: </span>{ir}%</p>
                                        <p><span style={{ fontWeight: "bold" }}>Last Repayment Date:</span> {lastrepay}</p>
                                        <p><span style={{ fontWeight: "bold" }}>Last Transaction Date:</span> {lasttx}</p>
                                        <p><span style={{ fontWeight: "bold" }}>Loan Outstanding:</span> ₹{parseFloat(loanouts).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</p>
                                        <p><span style={{ fontWeight: "bold" }}>Principal Outstanding:</span> ₹{parseFloat(pricipalloan).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</p>
                                        <p><span style={{ fontWeight: "bold" }}>Tenure: </span>{tenure} {repayment == "Day(s)" ? "Days" : <p>{repayment == "Month(s)" ? "Months" : ""}</p>}</p> */}
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

export default withTranslation()(LoanMBorDetails)
