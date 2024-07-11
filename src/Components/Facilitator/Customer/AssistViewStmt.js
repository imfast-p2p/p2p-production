import React, { Component } from 'react';
import { BASEURL } from '../../assets/baseURL';
import FacilitatorSidebar from '../../../SidebarFiles/FacilitatorSidebar';
import $ from 'jquery';
import { Link } from 'react-router-dom';
import Loader from '../../Loader/Loader';
import { FaAngleLeft } from "react-icons/fa";
import dashboardIcon from '../../assets/icon_dashboard.png'
import { withTranslation } from 'react-i18next';
import ReactPaginate from 'react-paginate';
import '../../Borrower/Pagination.css'
import '../../Borrower/BorAccStatement.css'
import { confirmAlert } from "react-confirm-alert";
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
class AssistViewStmt extends Component {
    constructor(props) {
        super(props)
        this.state = {
            loanaccountno: "ICASH00000003",
            fromdate: "",
            todate: "",
            borStatement: [],
            dtoday: "",
            dfrday: "",
            showLoader: false,

            offset: 0,
            orgtableData: [],
            perPage: 5,
            currentPage: 0,
            pageCount: "",
        }
        this.fromdate = this.fromdate.bind(this);
        this.todate = this.todate.bind(this);
        this.borrowerStatement = this.borrowerStatement.bind(this);
    }

    componentDidMount() {
        if (sessionStorage.getItem('isLogin') == "true") {
            this.setState({ showLoader: true })
            console.log(sessionStorage.getItem('token'));;
            this.loadDate();
            this.loadborrowerStatement();
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
            borStatement: slice
        })
    }

    fromdate(event) {
        this.setState({ fromdate: event.target.value })
    }
    todate(event) {
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
    loadborrowerStatement = (event) => {
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

        fetch(BASEURL + '/lsp/getloanaccountstmt', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                loanaccountno: sessionStorage.getItem("loanaccountno"),
                startdate: frday,
                enddate: today
            })
        }).then(response => {
            console.log('Response:', response)
            return response.json();

        })
            .then((resdata) => {
                if (resdata.status == 'SUCCESS') {
                    this.setState({ showLoader: false })
                    var list = resdata.msgdata;
                    // list.sort((a, b) =>{
                    //     return(new Date(b.txnref,b.txndate).getTime()-new Date(a.txnref,a.txndate).getTime()) 
                    // })
                    list.reverse()
                    console.log(list);
                    this.setState({ borStatement: list })

                    var data = resdata.msgdata
                    console.log(data)
                    var slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
                    console.log(slice)

                    this.setState({
                        pageCount: Math.ceil(data.length / this.state.perPage),
                        orgtableData: data,
                        borStatement: slice
                    })
                } else {
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
            })
    }

    borrowerStatement(event) {
        fetch(BASEURL + '/lsp/getloanaccountstmt', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                loanaccountno: sessionStorage.getItem("loanaccountno"),
                startdate: this.state.fromdate,
                enddate: this.state.todate
            })
        }).then(response => {
            console.log('Response:', response)
            return response.json();

        })
            .then((resdata) => {
                if (resdata.status == 'SUCCESS') {
                    var list = resdata.msgdata;
                    // list.sort((a, b) =>{
                    //     return(new Date(b.txnref,b.txndate).getTime()-new Date(a.txnref,a.txndate).getTime()) 
                    // })
                    list.reverse()
                    console.log(list);
                    this.setState({ borStatement: list })

                    var data = resdata.msgdata
                    console.log(data)
                    var slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
                    console.log(slice)

                    this.setState({
                        pageCount: Math.ceil(data.length / this.state.perPage),
                        orgtableData: data,
                        borStatement: slice
                    })
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

        const loanaccountno = sessionStorage.getItem("loanaccountno");
        const loanamt = sessionStorage.getItem("loanamt");
        const loanstatusid = sessionStorage.getItem("loanstatusid");

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
            <div className="container-dashboard d-flex flex-row" id="wrapper" style={{ marginTop: "-7px",backgroundColor:"#f4f7fc" }}>
                {
                    this.state.showLoader && <Loader />
                }
                <FacilitatorSidebar />
                <div className="main-content" id="page-content-wrapper">
                    <div className="container-fluid row pt-2" style={{ marginBottom: "-11px" }}>
                        <div className="col-1" id="borAccRes1">
                            <button style={{ marginLeft: "25px" }} onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className='col-6' id="borAccRes2" style={{ marginLeft: "20px", marginTop: "5px" }}>
                            <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                <Link to="/facilitatorDashboard">Home</Link> / <Link to="/customer">Customer Support</Link> / Account Statement</p>
                        </div>
                        <div className='col'>

                        </div>
                        <div className='col-3'>

                        </div>
                        <div className="col" id="borAccRes3">
                            <button style={myStyle}>
                                <Link to="/customer" style={{ marginLeft: "10px" }}><FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} /><span style={{ textDecoration: "none", color: "white" }}>Back</span></Link></button>
                        </div>
                    </div>
                    <hr className="col-11" style={{ marginLeft: "50px", width: "88.6%", backgroundColor: "rgba(4,78,160,1)" }} />
                    <div className='row '>
                        <div className="col">
                            <p className="d-flex justify-content-center" style={{ fontSize: "20px", fontWeight: "bold" }}>{t('Account Statement')}</p>
                        </div>
                    </div>

                    <div className="" style={{ marginTop: "-20px" }}>
                        <div className="form-group row m-2" style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                            <div className='col-4'>
                                <p className="pl-4"><span style={{ fontWeight: "600" }}>Account Number:</span> {loanaccountno}</p>
                            </div>
                            <div className='col-4'>
                                <p className="pl-4"><span style={{ fontWeight: "600" }}>Loan Amount:</span> ₹{parseFloat(loanamt).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</p>
                            </div>
                        </div>
                    </div>
                    <hr className="col-11" style={{ marginLeft: "50px", width: "88.6%", backgroundColor: "rgba(4,78,160,1)", marginTop: "-21px" }} />
                    <div className='row' style={{ paddingLeft: "50px" }}>
                        <div className='col-3' id='borAccdate1'>
                            <label htmlFor="date" className="label" style={{ fontFamily: "Poppins,sans-serif", fontSize: "14px", marginLeft: "0px", color: "rgba(5,54,82,1)" }}>{t('From Date *')}</label><br />
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
                        <div className='col-3' style={{ fontSize: "15px" }} id='borAccdate2'>
                            <label htmlFor="date" className="label" style={{ fontFamily: "Poppins,sans-serif", fontSize: "14px", marginLeft: "0px", color: "rgba(5,54,82,1)" }}>{t('To Date *')}</label><br />
                            <input id="borAccTdate" type="date"
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
                        <div className='col-2' style={{ paddingTop: '30px' }} id='borAccdate3'>
                            <button type="button" className="btn btn-sm text-white" style={{ backgroundColor: "rgba(0,121,190,1)", width: "100px", }} onClick={this.borrowerStatement}>{t('Apply')}</button>
                        </div>

                    </div>
                    <div class="d-flex flex-row" style={{ marginLeft: "50px", fontWeight: "600", fontSize: "14px", color: "rgba(5,54,82,1)" }}>
                        <div class="pt-2 pb-3 pr-1">Show</div>
                        <div class="pt-2 pb-2"><input type='number' name="number" value={this.state.perPage} style={{ width: "39px", height: "18px", paddingLleft: "4px", fontWeight: "600", fontSize: "14px" }} onChange={this.perPage} /></div>
                        <div class="pt-2 pb-3 pl-1">Entries in a page</div>
                    </div>
                    <div className='row pl-4 font-weight-normal' style={{ marginLeft: "15px", width: "96%", fontSize: "15px", color: "rgba(5,54,82,1)" }}>
                        {this.state.borStatement == "" ?
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
                                                <Th style={{ fontWeight: "600", marginTop: "5px", textAlign: "left" }}>{t('Date')}</Th>
                                                <Th style={{ fontWeight: "600", marginTop: "5px", textAlign: "left" }}>{t('Transaction Reference')}</Th>
                                                <Th style={{ fontWeight: "600", marginTop: "5px", textAlign: "right" }}>{t("Debit")}</Th>
                                                <Th style={{ fontWeight: "600", marginTop: "5px", textAlign: "right" }}>{t("Credit")}</Th>
                                                <Th style={{ fontWeight: "600", marginTop: "5px", textAlign: "right" }}>{t("Outstanding Balance")}</Th>
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {this.state.borStatement.map((loans, index) => (
                                                <Tr key={index} style={{
                                                    color: "rgba(5,54,82,1)",
                                                    marginBottom: "-10px", transition: 'none', cursor: 'default',
                                                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", backgroundColor: (index % 2 === 0) ? 'rgba(255,255,255,1)' : 'rgba(242,242,242,1)'
                                                }}>
                                                    <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left" }}>{loans.txndate.split("-").reverse().join("-")}</Td>
                                                    <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left" }}>{loans.txnref}</Td>
                                                    <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "right" }}>₹ {parseFloat(loans.debitamt).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</Td>
                                                    <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "right" }}>
                                                        ₹{parseFloat(loans.creditamt).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
                                                    </Td>
                                                    <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "right" }}>
                                                        {loans.closingbalance == "" ? "-" : "₹" + parseFloat(loans.closingbalance).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
                                                    </Td>
                                                </Tr>
                                            ))}
                                        </Tbody>
                                    </Table>
                                    &nbsp;
                                    {this.state.borStatement.length > 1 &&
                                        <div className="row float-right">
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
                                        </div>}
                                </div>
                            </>}
                    </div>
                </div>
            </div>
        )
    }
}
//updated

export default withTranslation()(AssistViewStmt)
