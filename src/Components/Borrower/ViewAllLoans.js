import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { BASEURL } from '../assets/baseURL';
import $ from 'jquery';
import BorrowerSidebar from '../../SidebarFiles/BorrowerSidebar';
import { CardGroup, Button, Card } from 'react-bootstrap';
import Borrower from '../assets/borrower.png';
import Lender from '../assets/lender.png';
import { withTranslation } from 'react-i18next';
import { FaFileAlt, FaAngleLeft } from "react-icons/fa";
import dashboardIcon from '../assets/icon_dashboard.png'
import ReactPaginate from 'react-paginate';
import './Pagination.css'
import './ViewAllLoans.css'
import { confirmAlert } from "react-confirm-alert";
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'

import Loader from '../Loader/Loader';
import { colors } from '@material-ui/core';
//updated
export class ViewAllLoans extends Component {
    constructor(props) {
        super(props)

        this.state = {
            loanlistingno: sessionStorage.getItem('loanlistingnumber'),
            borrowerid: sessionStorage.getItem('userID'),
            loanreqno: "",
            loanOfferList: [],
            loanListingNo: "",
            activeLoan: {},
            amount: "",
            loanaccountno: "",
            paymenttype: 2,
            emiamt: "",
            interestrate: "",

            productid: "",
            loanamt: "",
            loandisbursementdate: "",
            lastrepaymentdate: "",
            repaymentfrequencydesc: "",
            amtoverdue: "",
            principaloutstanding: "",
            p2pfeeschargesoutstanding: "",
            loanoutstanding: "",
            firstrepaymentdate: "",

            loanType: "1",
            loanName: "List of Active Loans",
            loanStatus: "1",

            vpa: "",
            dynamicvpa: "",
            ifsccode: "",

            offset: 0,
            loanOfferList: [],
            orgtableData: [],
            perPage: 10,
            currentPage: 0,
            pageCount: "",

            showLoader: false,
        }
    }
    componentDidMount() {
        if (sessionStorage.getItem('isLogin') == "true") {
            this.setState({ showLoader: true })
            this.loadDate();
            this.viewAllLoans()
        } else {
            window.location = '/login'
        }

    }
    perPage = (event) => {
        this.setState({ perPage: event.target.value })
    }

    // handlePageClick = (event) => {
    //     const selectedPage = event.selected;
    //     const offset = selectedPage * this.state.perPage;
    //     this.setState({
    //         currentPage: selectedPage,
    //         offset: offset
    //     }, () => {
    //         this.loadMoreData();
    //     })
    // }
    // loadMoreData = () => {
    //     console.log(this.state.orgtableData)
    //     const data = this.state.orgtableData;
    //     const slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
    //     this.setState({
    //         pageCount: Math.ceil(data.length / this.state.perPage),
    //         loanOfferList: slice
    //     })
    // }
    loanStatus = (e) => {
        this.setState({ loanStatus: e.target.value })
        this.setState({ loanType: e.target.value })
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
    viewAllLoans = (event) => {
        if (this.state.loanStatus == 1) {
            this.setState({ loanName: "List of Active Loans" })
        } else if (this.state.loanStatus == 2) {
            this.setState({ loanName: "List of Closed Loans" })
        }
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
        fetch(BASEURL + '/lsp/getborrowerloanrequests', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                borrowerid: sessionStorage.getItem('userID'),
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
                    this.setState({ showLoader: false })
                    console.log(resdata.msgdata);
                    if (this.state.loanStatus == 1) {
                        var filterdLoanreqList = resdata.msgdata.filter(loan => loan.loanaccountstatus == 1);
                        console.log(filterdLoanreqList);
                        this.setState({
                            loanOfferList: filterdLoanreqList.map((pdata) => {
                                pdata.showResults = false;
                                return pdata;
                            })
                        })
                        var data = filterdLoanreqList
                        console.log(data)
                        var slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
                        console.log(slice)

                        this.setState({
                            pageCount: Math.ceil(data.length / this.state.perPage),
                            orgtableData: data,
                            loanOfferList: slice
                        })
                    } else if (this.state.loanStatus == 2) {
                        var filterdLoanreqList = resdata.msgdata.filter(loan => loan.loanaccountstatus == 2);
                        console.log(filterdLoanreqList);
                        this.setState({
                            loanOfferList: filterdLoanreqList.map((pdata) => {
                                pdata.showResults = false;
                                return pdata;
                            })
                        })
                        var data = filterdLoanreqList
                        console.log(data)
                        var slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
                        console.log(slice)

                        this.setState({
                            pageCount: Math.ceil(data.length / this.state.perPage),
                            orgtableData: data,
                            loanOfferList: slice
                        })
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
            });
    }

    viewAllLoans2 = (event) => {
        if (this.state.loanStatus == 1) {
            this.setState({ loanName: "List of Active Loans" })
        } else if (this.state.loanStatus == 2) {
            this.setState({ loanName: "List of Closed Loans" })
        }

        fetch(BASEURL + '/lsp/getborrowerloanrequests', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                borrowerid: sessionStorage.getItem('userID'),
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
                    if (this.state.loanStatus == 1) {
                        var filterdLoanreqList = resdata.msgdata.filter(loan => loan.loanaccountstatus == 1);
                        console.log(filterdLoanreqList);
                        this.setState({
                            loanOfferList: filterdLoanreqList.map((pdata) => {
                                pdata.showResults = false;
                                return pdata;
                            })
                        })
                        var data = filterdLoanreqList
                        console.log(data)
                        var slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
                        console.log(slice)

                        this.setState({
                            pageCount: Math.ceil(data.length / this.state.perPage),
                            orgtableData: data,
                            loanOfferList: slice
                        })
                    } else if (this.state.loanStatus == 2) {
                        var filterdLoanreqList = resdata.msgdata.filter(loan => loan.loanaccountstatus == 2);
                        console.log(filterdLoanreqList);
                        this.setState({
                            loanOfferList: filterdLoanreqList.map((pdata) => {
                                pdata.showResults = false;
                                return pdata;
                            })
                        })
                        var data = filterdLoanreqList
                        console.log(data)
                        var slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
                        console.log(slice)

                        this.setState({
                            pageCount: Math.ceil(data.length / this.state.perPage),
                            orgtableData: data,
                            loanOfferList: slice
                        })
                    }


                }
                else {
                    alert("Issue: " + resdata.message);
                }
            });
    }

    getLoanAccountStatus = (l) => {
        fetch(BASEURL + '/lsp/getloanaccountstatus', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                loanlistingno: l.loanlistingno
            })
        }).then(response => {
            console.log('Response:', response)
            return response.json();

        })
            .then((resdata) => {
                if (resdata.status === 'SUCCESS') {
                    console.log(resdata);
                    this.setState({
                        loanOfferList: this.state.loanOfferList.map((pdata) => {
                            if (pdata.loanlistingno === l.loanlistingno) {
                                pdata.showResults = true;
                            } else {
                                pdata.showResults = false;
                            }
                            return pdata;
                        })
                    })
                    this.setState({ activeLoan: resdata.msgdata });
                    this.setState({ loanaccountno: resdata.msgdata.loanaccountno })
                    this.setState({ productid: resdata.msgdata.productid });
                    this.setState({ loanamt: resdata.msgdata.loanamt });
                    this.setState({ loandisbursementdate: resdata.msgdata.loandisbursementdate });
                    this.setState({ lastrepaymentdate: resdata.msgdata.lastrepaymentdate });
                    this.setState({ repaymentfrequencydesc: resdata.msgdata.repaymentfrequencydesc });
                    this.setState({ amtoverdue: resdata.msgdata.amtoverdue });
                    this.setState({ principaloutstanding: resdata.msgdata.principaloutstanding });
                    this.setState({ p2pfeeschargesoutstanding: resdata.msgdata.p2pfeeschargesoutstanding });
                    this.setState({ loanoutstanding: resdata.msgdata.loanoutstanding });
                    this.setState({ interestrate: resdata.msgdata.interestrate })
                    this.setState({ firstrepaymentdate: resdata.msgdata.firstrepaymentdate })
                    this.setState({ vpa: resdata.msgdata.vpa })
                    this.setState({ dynamicvpa: resdata.msgdata.dynamicvpa })
                    this.setState({ ifsccode: resdata.msgdata.ifsccode })


                    this.setState({ emiamt: resdata.msgdata.emiamt })
                } else {
                    alert("Issue: " + resdata.message);
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }

    loanFundingStat = (loanreq) => {

        this.setState({ loanreqno: loanreq });
        fetch(BASEURL + '/lsp/getloanfundingstatus', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                loanreqno: loanreq
            })
        }).then(response => {
            console.log('Response:', response)
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata);
                if (resdata.status == 'SUCCESS') {
                    sessionStorage.setItem('loanrequestnumber', resdata.msgdata.loanreqno);
                    sessionStorage.setItem('emiamount', resdata.msgdata.emi);
                } else {
                    alert("Issue: " + resdata.message);
                }
            })
    }

    onSelectFunction = (loan, index) => {
        console.log(index)
        const loanList = this.state.loanOfferList;
        loanList[index].showDetails = !loanList[index].showDetails;
        this.setState({ loanOfferList: loanList })
        this.getLoanAccountStatus(loan);
        this.loanFundingStat(loan.loanreqno)
    }

    getBorStatement = (loanaccountno, loanamt, loanstatusid) => {
        console.log(loanaccountno);
        console.log(loanamt);

        sessionStorage.setItem("loanaccountno", loanaccountno);
        sessionStorage.setItem("loanamt", loanamt);
        sessionStorage.setItem("loanstatusid", loanstatusid);

        window.location = "/borAccStatement";

    }
    getLoanClosure(loanaccountno, loanamt, loanstatusid) {
        console.log(loanaccountno);
        console.log(loanamt);

        sessionStorage.setItem("loanaccountno", loanaccountno);
        // sessionStorage.setItem("loanamt", loanamt);
        sessionStorage.setItem("loanstatusid", loanstatusid);

        window.location = "/loanClosureBalance";

    }
    getRepaySchedule = (loanaccountno, loanamt, loanstatusid) => {
        sessionStorage.setItem("loanaccountno", loanaccountno);
        window.location = "/repaySchedule"
    }

    handleChange() {
        if (window.innerWidth <= 360) {
            // $("#sidebar-wrapper").toggle();
            $(".component-to-toggle").toggle();
        } else {
            $('.text').toggle();
            $('#PImage').toggle();
            $('#Pinfo').toggle();
        }
    }
    handleToggle = (loan, index) => {
        if (this.state.toggle === loan) {
            // setToggle(null);
            this.setState({ toggle: null });
            return false
        }
        //    setToggle(id)
        this.setState({ toggle: loan })
        this.getLoanAccountStatus(loan);
        this.loanFundingStat(loan.loanreqno)
    }
    render() {
        console.log(this.state.loanType)
        const { t } = this.props
        const Details = () => (
            <div>
                <div className='row' style={{ fontSize: "14px", marginLeft: "10px" }}>
                    <div className='col-12 col-md-3'>
                        <p className='font-weight-bold'>Product ID</p>
                        <p style={{ marginTop: "-17px" }}>{this.state.productid ? this.state.productid : "-"}</p>
                    </div>
                    <div className='col-12 col-md-3 '>
                        <p className='font-weight-bold'>Loan Account No.</p>
                        <p style={{ marginTop: "-17px" }}>{this.state.loanaccountno ? this.state.loanaccountno : "-"}</p>
                    </div>
                    <div className='col-12 col-md-3 '>
                        <p className='font-weight-bold'>Loan Request No.</p>
                        <p style={{ marginTop: "-17px" }}>{this.state.loanreqno ? this.state.loanreqno : "-"}</p>
                    </div>
                    <div className='col-12 col-md-3 '>
                        <p className='font-weight-bold'>Loan Amount</p>
                        <p style={{ marginTop: "-17px" }}>₹ {this.state.loanamt ? parseFloat(this.state.loanamt).toFixed(2).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") : "-"}</p>
                    </div>
                </div>
                <div className='row' style={{ fontSize: "14px", marginLeft: "10px", marginTop: "-10px" }}>
                    <div className='col-12 col-md-3'>
                        <p className='font-weight-bold'>Loan Disbursed On</p>
                        <p style={{ marginTop: "-17px" }}>{this.state.loandisbursementdate ? this.state.loandisbursementdate.split("-").reverse().join("-") : "-"}</p>
                    </div>
                    <div className='col-12 col-md-3'>
                        <p className='font-weight-bold'>First Repayment Date</p>
                        <p style={{ marginTop: "-17px" }}>{this.state.firstrepaymentdate ? this.state.firstrepaymentdate.split("-").reverse().join("-") : "-"}</p>
                    </div>
                    <div className='col-12 col-md-3'>
                        <p className='font-weight-bold'>Last Repayment Date</p>
                        <p style={{ marginTop: "-17px" }}>{this.state.lastrepaymentdate ? this.state.lastrepaymentdate.split("-").reverse().join("-") : "-"}</p>
                    </div>
                    <div className='col-12 col-md-3'>
                        <p className='font-weight-bold'>ROI</p>
                        {this.state.interestrate ?
                            <p style={{ marginTop: "-17px" }}>{parseFloat(this.state.interestrate).toFixed(2).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")} % P.A.</p>
                            : "-"
                        }
                    </div>
                </div>
                <div className='row' style={{ fontSize: "14px", marginLeft: "10px", marginTop: "-10px" }}>
                    <div className='col-12 col-md-3'>
                        <p className='font-weight-bold'>EMI</p>
                        {this.state.emiamt ?
                            <p style={{ marginTop: "-17px" }}>
                                ₹ {parseFloat(this.state.emiamt).toFixed(2).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
                            </p>
                            : "-"
                        }
                    </div>
                    <div className='col-12 col-md-3'>
                        <p className='font-weight-bold'>EMI Frequency</p>
                        <p style={{ marginTop: "-17px" }}>{this.state.repaymentfrequencydesc ? this.state.repaymentfrequencydesc : "-"}</p>
                    </div>
                    <div className='col-12 col-md-3'>
                        <p className='font-weight-bold'>Amount Overdue</p>
                        {this.state.amtoverdue ?
                            <p style={{ marginTop: "-17px" }}>₹ {parseFloat(this.state.amtoverdue).toFixed(2).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</p>
                            : "-"
                        }
                    </div>
                    <div className='col-12 col-md-3'>
                        <p className='font-weight-bold'>Principal Outstanding</p>
                        {this.state.principaloutstanding ?
                            <p style={{ marginTop: "-17px" }}>₹ {parseFloat(this.state.principaloutstanding).toFixed(2).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</p>
                            : "-"
                        }
                    </div>
                </div>
                <div className='row' style={{ fontSize: "14px", marginLeft: "10px", marginTop: "-10px" }}>
                    <div className='col-12 col-md-3'>
                        <p className='font-weight-bold'>
                            P2P Charges Outstanding
                        </p>
                        {this.state.p2pfeeschargesoutstanding ?
                            <p style={{ marginTop: "-17px" }}>
                                ₹ {parseFloat(this.state.p2pfeeschargesoutstanding).toFixed(2).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
                            </p>
                            : "-"
                        }
                    </div>
                    <div className='col-12 col-md-3'>
                        <p className='font-weight-bold'>Loan Outstanding</p>
                        {
                            this.state.loanoutstanding ?
                                <p style={{ marginTop: "-17px" }}>₹ {parseFloat(this.state.loanoutstanding).toFixed(2).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</p>
                                :
                                "-"
                        }
                    </div>
                    <div className='col-12 col-md-3'>
                        <p className='font-weight-bold'>Virtual Account No.</p>
                        <p style={{ marginTop: "-17px" }}>
                            {this.state.vpa ? this.state.vpa : "-"}
                        </p>
                    </div>
                    <div className='col-12 col-md-3'>
                        <p className='font-weight-bold'>Loan Account UPI ID</p>
                        <p style={{ marginTop: "-17px" }}>
                            {this.state.dynamicvpa ? this.state.dynamicvpa : "-"}
                        </p>
                    </div>
                </div>
                <div className='row' style={{ fontSize: "14px", marginLeft: "10px", marginTop: "-10px" }}>
                    <div className='col-12 col-md-3'>
                        <p className='font-weight-bold'>
                            IFSC Code
                        </p>
                        <p style={{ marginTop: "-17px" }}>
                            {this.state.ifsccode == "" ? "-" : this.state.ifsccode}
                        </p>
                    </div>
                </div>
                {/* <div className='row' style={{ fontSize: "14px" }}>
                    <div className='col-4'>
                        <div className='row' style={{ marginLeft: "10px" }}>
                            <p className='col font-weight-bold'>Product ID :</p>
                            <p className='col'>{this.state.productid}</p>
                        </div>
                        <div className='row' style={{ marginLeft: "10px" }}>
                            <p className='col font-weight-bold'>Loan Account No. : </p>
                            <p className='col'>{this.state.loanaccountno}</p>
                        </div>
                        <div className='row' style={{ marginLeft: "10px" }}>
                            <p className='col font-weight-bold'>Loan Request No. : </p>
                            <p className='col'> {this.state.loanreqno}</p>
                        </div>
                        <div className='row' style={{ marginLeft: "10px" }}>
                            <p className='col font-weight-bold'>Loan Amount : </p>
                            <p className='col'>₹ {parseFloat(this.state.loanamt).toFixed(2).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</p>
                        </div>
                        <div className='row' style={{ marginLeft: "10px" }}>
                            <p className='col font-weight-bold'>Loan Disbursed On : </p>
                            <p className='col'>{this.state.loandisbursementdate.split("-").reverse().join("-")}</p>
                        </div>
                        <div className='row' style={{ marginLeft: "10px" }}>
                            <p className='col font-weight-bold'>ROI : </p>
                            <p className='col'>{parseFloat(this.state.interestrate).toFixed(2).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")} % P.A.</p>
                        </div>
                    </div>
                    <div className='col-4'>
                        <div className='row'>
                            <p className='col-7 font-weight-bold'>First Repayment Date : </p>
                            <p className='col'>{this.state.firstrepaymentdate.split("-").reverse().join("-")}</p>
                        </div>
                        <div className='row'>
                            <p className='col-7 font-weight-bold'>Last Repayment Date : </p>
                            <p className='col'>{this.state.lastrepaymentdate.split("-").reverse().join("-")}</p>
                        </div>
                        <div className='row'>
                            <p className='col-7 font-weight-bold'>EMI : </p>
                            <p className='col'> ₹ {parseFloat(this.state.emiamt).toFixed(2).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</p>
                        </div>
                        <div className='row'>
                            <p className='col-7 font-weight-bold'>EMI Frequency : </p>
                            <p className='col'>{this.state.repaymentfrequencydesc}</p>
                        </div>
                        <div className='row'>
                            <p className='col-7 font-weight-bold'>Amount Overdue : </p>
                            <p className='col'>₹ {parseFloat(this.state.amtoverdue).toFixed(2).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</p>
                        </div>
                        <div className='row'>
                            <p className='col-7 font-weight-bold' style={{}}>Principal Outstanding : </p>
                            <p className='col'>₹ {parseFloat(this.state.principaloutstanding).toFixed(2).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</p>
                        </div>
                    </div>
                    <div className='col-4' style={{ marginLeft: "-10px" }}>
                        <div className='row'>
                            <p className='col font-weight-bold'>P2P Charges Outstanding : </p>
                            <p className='col'> ₹ {parseFloat(this.state.p2pfeeschargesoutstanding).toFixed(2).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</p>
                        </div>
                        <div className='row'>
                            <p className='col font-weight-bold'>Loan Outstanding : </p>
                            <p className='col'>₹ {parseFloat(this.state.loanoutstanding).toFixed(2).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</p>
                        </div>
                        <div className='row'>
                            <p className='col-6 font-weight-bold'>Virtual Account No. :</p>
                            <p className='col-6'>{this.state.vpa}</p>
                        </div>
                        <div className='row'>
                            <p className='col-6 font-weight-bold'>Loan Account UPI ID :</p>
                            <p className='col-6'>{this.state.dynamicvpa}</p>
                        </div>
                        <div className='row'>
                            <p className='col-6 font-weight-bold'>IFSC Code :</p>
                            <p className='col-6'>{this.state.ifsccode == "" ? "-" : this.state.ifsccode}</p>
                        </div>
                    </div>
                </div> */}
                <div className='container'>
                    <div className='row' style={{ marginTop: "-26px" }}>
                        <div className='col-12 text-md-end '>
                            <Link to="/viewAgreement">
                                <button className="btn btn-info mt-2" style={{ backgroundColor: "rgba(5,54,82,1)", marginRight: "5px" }}>View Agreement</button>
                            </Link>
                            <button className="btn btn-info mt-2" style={{ backgroundColor: "rgba(5,54,82,1)", marginRight: "5px" }} onClick={this.getBorStatement.bind(this, this.state.activeLoan.loanaccountno, this.state.activeLoan.loanamt, this.state.activeLoan.loanstatusid)}>View Statement</button>
                            <button className="btn btn-info mt-2" style={{ backgroundColor: "rgba(5,54,82,1)", marginRight: "5px" }} onClick={this.getRepaySchedule.bind(this, this.state.activeLoan.loanaccountno, this.state.activeLoan.loanstatusid)}>Repayment Schedule</button>
                            <button className="btn mt-2" style={{ backgroundColor: "rgba(0,121,190,1)", color: "white", marginRight: "5px" }} onClick={this.getLoanClosure.bind(this, this.state.activeLoan.loanaccountno, this.state.activeLoan.loanstatusid)}>Pay</button>
                        </div>
                    </div>
                </div>

            </div>

        );

        const Details2 = () => (
            <div>
                <div className='row' style={{ fontSize: "14px", marginLeft: "10px" }}>
                    <div className='col-12 col-md-3'>
                        <p className='font-weight-bold'>Product ID</p>
                        <p style={{ marginTop: "-17px" }}>{this.state.activeLoan.productid}</p>
                    </div>
                    <div className='col-12 col-md-3'>
                        <p className='font-weight-bold'>Loan Account No.</p>
                        <p style={{ marginTop: "-17px" }}>{this.state.activeLoan.loanaccountno}</p>
                    </div>
                    <div className='col-12 col-md-3'>
                        <p className='font-weight-bold'>Loan Request No.</p>
                        <p style={{ marginTop: "-17px" }}>{this.state.loanreqno}</p>
                    </div>
                    <div className='col-12 col-md-3'>
                        <p className='font-weight-bold'>Loan Amount</p>
                        <p style={{ marginTop: "-17px" }}>₹ {parseFloat(this.state.activeLoan.loanamt).toFixed(2).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</p>
                    </div>
                </div>
                <div className='row' style={{ fontSize: "14px", marginLeft: "10px", marginTop: "-10px" }}>
                    <div className='col-12 col-md-3'>
                        <p className='font-weight-bold'>EMI</p>
                        <p style={{ marginTop: "-17px" }}>
                            ₹ {parseFloat(this.state.activeLoan.emiamt).toFixed(2).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
                        </p>
                    </div>
                    <div className='col-12 col-md-3'>
                        <p className='font-weight-bold'>EMI Frequency</p>
                        <p style={{ marginTop: "-17px" }}>{this.state.activeLoan.repaymentfrequencydesc}</p>
                    </div>
                    <div className='col-12 col-md-3'>
                        <p className='font-weight-bold'>ROI</p>
                        <p style={{ marginTop: "-17px" }}>{parseFloat(this.state.activeLoan.interestrate).toFixed(2).replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")} % P.A.</p>
                    </div>
                    <div className='col-12 col-md-3'>
                        <p className='font-weight-bold'>Loan Disbursed On</p>
                        <p style={{ marginTop: "-17px" }}>{this.state.activeLoan.loandisbursementdate &&
                            this.state.activeLoan.loandisbursementdate.split("-").reverse().join("-")}</p>
                    </div>
                </div>
                <div className='row' style={{ fontSize: "14px", marginLeft: "10px", marginTop: "-10px" }}>
                    <div className='col-12 col-md-3'>
                        <p className='font-weight-bold'>Loan Closure Date</p>
                        <p style={{ marginTop: "-17px" }}>{this.state.activeLoan.lastrepaymentdate &&
                            this.state.activeLoan.lastrepaymentdate.split("-").reverse().join("-")}</p>
                    </div>
                    <div className='col-12 col-md-3'>
                        <p className='font-weight-bold'>Closed On</p>
                        <p style={{ marginTop: "-17px" }}>{this.state.activeLoan.lasttxndate &&
                            this.state.activeLoan.lasttxndate.split("-").reverse().join("-")}</p>
                    </div>
                </div>
                <div className='container'>
                    <div className='row'>
                        <div className='col-12 text-md-end text-center' style={{ marginBottom: "10px" }}>
                            <Link to="/viewAgreement">
                                <input type="button" className="btn btn-info mr-md-2 mb-2" value="View Agreement" style={{ backgroundColor: "rgba(5,54,82,1)" }} />
                            </Link>
                            <input type="button" className="btn btn-info mr-md-2 mb-2" onClick={this.getBorStatement.bind(this, this.state.activeLoan.loanaccountno, this.state.activeLoan.loanamt, this.state.activeLoan.loanstatusid)} value="View Statement" style={{ backgroundColor: "rgba(5,54,82,1)" }} />
                        </div>
                    </div>
                </div>

            </div>

        );

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
                <div className="component-to-toggle">
                    <BorrowerSidebar />
                </div>
                <div className="main-content" id="page-content-wrapper">
                    <div className="container-fluid row pt-2" style={{ marginBottom: "-11px" }}>
                        <div className="col-1" id="allLoansnav">
                            <button style={{ marginLeft: "25px" }} onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className='col-4' id="allLoansnav2" style={{ marginLeft: "20px", marginTop: "5px" }}>
                            <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                <Link to="/borrowerdashboard">Home</Link> / View All Loans</p>
                        </div>
                        <div className='col'>

                        </div>
                        <div className='col'>

                        </div>
                        <div className='col-3'>

                        </div>
                        <div className="col" id="allLoansnav3">
                            <button style={myStyle}>
                                <Link to="/borrowerdashboard" style={{ marginLeft: "10px" }}><FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} /><span style={{ textDecoration: "none", color: "white" }}>Back</span></Link></button>
                        </div>
                    </div>

                    <hr className="col-11" style={{ marginLeft: "50px", width: "88.6%", backgroundColor: "rgba(4,78,160,1)" }} />
                    <div className='container-fluid row' style={{ paddingLeft: "82px", marginTop: "-26px" }}>
                        <div className='card' style={{ overflow: "auto" }}>
                            <div className='row pt-2'>
                                <div className='col'>
                                    <ul role="tablist" className="nav nav-pills nav-fill mb-3" >
                                        <li className="nav-item"> <a data-toggle="pill" href="#myEarning-details" className="nav-link active detailsTab"
                                            style={{ textAlign: "center", paddingTop: "10px", paddingBottom: "10px" }}>
                                            <FaFileAlt />&nbsp; {t('ViewAllLoans')} </a> </li>
                                    </ul>

                                </div>
                            </div>
                            {/* Select Date */}
                            <div className='row' style={{ marginTop: "-10px" }}>
                                <div className='col-lg-3 col-md-3 col-sm-4 col-6'>
                                    <p style={{ marginBottom: "4px", color: "rgba(5,54,82,1)", fontSize: "12px", fontWeight: "700" }}>Status</p>
                                    <select onChange={this.loanStatus} style={{
                                        border: "1px solid rgb(0, 121, 191)",
                                        // borderRadius: "5px",
                                        // backgroundColor: "whitesmoke",
                                        // width: "250px",
                                        // marginTop: "-10px",
                                        // fontFamily: "Poppins,sans-serif"
                                    }} className="form-select">
                                        <option value="1" defaultValue>Active Loans</option>
                                        <option value="2">Closed Loans</option>
                                    </select>
                                </div>
                                <div className='col-lg-3 col-md-3 col-sm-4 col-6'>
                                    <p style={{ marginBottom: "4px", color: "rgba(5,54,82,1)", fontSize: "12px", fontWeight: "700" }}>From Date*</p>
                                    <input id="Fdate" type="date" className='form-control'
                                        defaultValue={this.state.dfrday} onChange={this.fromdate} style={{
                                            border: "1px solid rgba(40,116,166,1)",
                                            borderRadius: "5px",
                                            // width: "240px",
                                            fontSize: "15px",
                                            color: "rgba(40,116,166,1)",
                                            paddingLeft: "10px"
                                        }} />
                                </div>
                                <div className='col-lg-3 col-md-3 col-sm-4 col-6' >
                                    <p style={{ marginBottom: "4px", color: "rgba(5,54,82,1)", fontSize: "12px", fontWeight: "700" }}>To Date*</p>
                                    <input id="Tdate" type="date" className='form-control'
                                        defaultValue={this.state.dtoday} onChange={this.todate} style={{
                                            border: "1px solid rgba(40,116,166,1)",
                                            borderRadius: "5px",
                                            // width: "240px",
                                            fontSize: "15px",
                                            color: "rgba(40,116,166,1)",
                                            paddingLeft: "10px"
                                        }} />
                                </div>
                                <div className="col-lg-2 col-md-3 col-sm-4 col-6 Fdate" style={{ paddingTop: '22px' }}>
                                    <button type="button" className="btn btn-sm text-white" style={{
                                        backgroundColor: "rgb(0, 121, 191)",
                                        paddingTop: "6px", paddingBottom: "6px",
                                        paddingLeft: "47px", paddingRight: "47px"
                                    }} onClick={this.viewAllLoans2}>{t('Apply')}</button>
                                </div>

                            </div>

                            <div className='row' style={{ marginTop: "5px" }}>
                                <div className='col'>
                                    <p style={{ fontWeight: "700", textAlign: "center", color: "rgba(31,88,126,1)", textDecoration: "underline" }}>{this.state.loanName}</p>
                                    <div className='tab-content'>
                                        <div id="myEarning-details" className="register-form tab-pane fade show active" style={{ cursor: "default" }}>
                                            {this.state.loanOfferList == "" ?
                                                <div className="row mt-2" style={{ marginLeft: "6px" }}>
                                                    <div className="col" style={{ textAlign: "center", color: "#222C70", fontSize: "14px", fontWeight: "500" }}>
                                                        <p>No Requests Available !</p>
                                                    </div>
                                                </div> :
                                                <>
                                                    <Table responsive>
                                                        <Thead>
                                                            <Tr style={{ fontSize: "15px", color: "rgba(5,54,82,1)", paddingLeft: "6px" }}>
                                                                <Th style={{ fontWeight: "600", marginTop: "5px" }}>Loan Account Number</Th>
                                                                <Th style={{ fontWeight: "600", marginTop: "5px" }}>Loan Amount</Th>
                                                                <Th style={{ fontWeight: "600", marginTop: "5px" }}>Tenure</Th>
                                                                <Th style={{ fontWeight: "600", marginTop: "5px" }}>Loan Disbursed on</Th>
                                                                <Th></Th>
                                                            </Tr>
                                                        </Thead>
                                                        <Tbody>
                                                            {
                                                                this.state.loanOfferList.map((loan, index) => {
                                                                    return (
                                                                        <>
                                                                            <Tr key={index} style={{ color: "rgb(5, 54, 82)", backgroundColor: (index % 2 == 0) ? 'rgba(255,255,255,1)' : 'rgba(242,242,242,1)' }}>
                                                                                <Td style={{ fontSize: "15px", fontWeight: "490", textAlign: "left", paddingTop: "3px", paddingBottom: "3px" }}>{loan.loanaccountno}</Td>
                                                                                <Td style={{ fontSize: "15px", fontWeight: "490", textAlign: "left", paddingTop: "3px", paddingBottom: "3px" }}>₹ {loan.loanamt.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</Td>
                                                                                <Td style={{ fontSize: "15px", fontWeight: "490", textAlign: "left", paddingTop: "3px", paddingBottom: "3px" }}>{loan.tenureoffered} {loan.repaymentfrequencydesc}</Td>
                                                                                <Td style={{ fontSize: "15px", fontWeight: "490", textAlign: "left", paddingTop: "3px", paddingBottom: "3px" }}>{loan.loanrequestdate.split("-").reverse().join("-")}</Td>
                                                                                <Td style={{ fontSize: "15px", fontWeight: "490", textAlign: "left", paddingTop: "3px", paddingBottom: "3px", cursor: "pointer" }}>
                                                                                    <button className='btn btn-sm text-white' onClick={() => this.handleToggle(loan, index)} style={{ backgroundColor: "rgb(0, 121, 191)" }}>View</button>
                                                                                </Td>
                                                                            </Tr>
                                                                            {(loan === this.state.toggle) &&
                                                                                <Tr key={`details-${index}`} style={{ border: "1px solid rgba(40,116,166,1)", borderRadius: "5px", backgroundColor: "rgba(255,255,255,1)" }}>
                                                                                    <Td colSpan="5">
                                                                                        {loan.loanaccountstatus == 1 ?
                                                                                            <div className='row mt-2' style={{ color: "rgb(5, 54, 82)", textAlign: "left" }}>
                                                                                                <Details />
                                                                                            </div> :
                                                                                            <div className='row mt-2' style={{ color: "rgb(5, 54, 82)", textAlign: "left" }}>
                                                                                                <Details2 />
                                                                                            </div>}
                                                                                    </Td>
                                                                                </Tr>
                                                                            }
                                                                        </>
                                                                    )
                                                                })
                                                            }
                                                        </Tbody>
                                                    </Table>
                                                    {this.state.loanOfferList.length > 0 &&
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
                                                </>
                                            }
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

export default withTranslation()(ViewAllLoans)