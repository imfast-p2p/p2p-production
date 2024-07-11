import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { BASEURL } from '../assets/baseURL';
import LenderSidebar from '../../SidebarFiles/LenderSidebar';
import $ from 'jquery';
import { withTranslation } from 'react-i18next';
import ReactPaginate from 'react-paginate';
import { FaEllipsisV } from 'react-icons/fa';
import dashboardIcon from '../assets/icon_dashboard.png';
import { confirmAlert } from "react-confirm-alert";
import './MyEarning.css';
import batch from '../assets/batch.png';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'
import openIt from '../assets/AdminImg/openit.png'

export class MyEarning extends Component {
    //updated
    constructor(props) {
        super(props)
        this.state = {
            earningList: [],
            lenderid: "",
            loanstatus: "",
            fromdate: "",
            todate: "",
            dtoday: "",
            dfrday: "",

            offset: 0,
            perPage: 10,
            orgtableData: [],
            currentPage: 0,
            pageCount: "",

            moreDMonth: "",
            moreDYear: "",
            moreDInt: "",
            moreDPrincipal: "",
            moreDAmt: "",
            earningDetails: [],
            invalidDate: false,
            invalidDate2: false,
            dateError: false
        }
        this.myEarning = this.myEarning.bind(this);
        this.fromdate = this.fromdate.bind(this);
        this.todate = this.todate.bind(this);
    }
    componentDidMount() {
        if (sessionStorage.getItem('isLogin') == "true") {
            console.log(sessionStorage.getItem('token'));
            console.log(sessionStorage.getItem('userID'))
            this.loadDate();
            this.loadmyEarning();
        } else {
            window.location = '/login'
        }
    }
    perPage = (event) => {
        this.setState({ perPage: event.target.value })
    }
    fromdate(event) {
        // this.setState({ fromdate: event.target.value })
        const fromDateValue = event.target.value;
        const toDateValue = this.state.todate;
        this.setState({ fromdate: fromDateValue });

        // Check if "From Date" is less than "To Date" and update state accordingly
        if (toDateValue && fromDateValue > toDateValue) {
            this.setState({ dateError: true });
        } else {
            this.setState({ dateError: false });
        }
    }
    todate(event) {
        // this.setState({ todate: event.target.value })
        const toDateValue = event.target.value;
        const fromDateValue = this.state.fromdate;

        this.setState({ todate: toDateValue });


        if (fromDateValue && toDateValue < fromDateValue) {
            this.setState({ dateError: true });
        } else {
            this.setState({ dateError: false });
        }
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
    loadmyEarning = (event) => {
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
        fetch(BASEURL + '/lms/getlenderearnings', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                lenderid: sessionStorage.getItem('userID'),
                fromdate: frday,
                todate: today
            })
        }).then((Response) => {

            console.log(Response);
            return Response.json();
        })
            .then((resdata) => {
                if (resdata.status === 'SUCCESS') {
                    console.log(resdata);
                    // this.setState({ earningList: resdata.msgdata })

                    var earningLists = resdata.msgdata;

                    var list = earningLists;
                    list.sort((a, b) => {
                        return new Date(b.txndate).getTime() - new Date(a.txndate).getTime()
                    })
                    console.log(list);
                    this.setState({ earningList: list })

                    var data = earningLists
                    console.log(data)
                    var slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
                    console.log(slice)

                    this.setState({
                        pageCount: Math.ceil(data.length / this.state.perPage),
                        orgtableData: data,
                        earningList: slice
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
                                    },
                                },
                            ],
                        });
                    }
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }
    myEarning(event) {
        fetch(BASEURL + '/lms/getlenderearnings', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                lenderid: sessionStorage.getItem('userID'),
                fromdate: this.state.fromdate,
                todate: this.state.todate
            })
        }).then((Response) => {

            console.log(Response);
            return Response.json();
        })
            .then((resdata) => {
                if (resdata.status === 'SUCCESS') {
                    console.log(resdata);
                    //this.setState({ earningList: resdata.msgdata })

                    var earningLists = resdata.msgdata;
                    var list = earningLists;
                    list.sort((a, b) => {
                        return new Date(b.txndate).getTime() - new Date(a.txndate).getTime()
                    })
                    console.log(list);
                    this.setState({ earningList: list })

                    var data = earningLists
                    console.log(data)
                    var slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
                    console.log(slice)

                    this.setState({
                        pageCount: Math.ceil(data.length / this.state.perPage),
                        orgtableData: data,
                        earningList: slice
                    })
                } else {
                    alert("Issue: " + resdata.message);
                }
            })
            .catch((error) => {
                console.log(error)
            })
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
            earningList: slice
        })
    }
    moreDetails = (earning) => {
        $('#launchColl').click()
        this.setState({ earningDetails: earning.earningdetails })
    }
    handleChange() {
        $('.text').toggle();
        $('#PImage').toggle();
        $('#Pinfo').toggle();
    }
    render() {
        const { t } = this.props
        return (
            <>
                <div className='row'>
                    <div className='col-lg-3 col-md-3 col-sm-4 col-6 Fdate'>
                        <p htmlFor="date" style={{
                            fontWeight: "600",
                            fontSize: "13px", marginLeft: "0px", color: "rgba(5,54,82,1)",
                            marginBottom: "5px"
                        }}>{t('From Date *')}</p>
                        <input id="Fdate" type="date"
                            defaultValue={this.state.dfrday} onChange={this.fromdate} style={{
                                border: "1px solid rgba(40,116,166,1)",
                                borderRadius: "5px",
                                width: "200px",
                                height: "35px",
                                fontSize: "15px",
                                color: "rgba(40,116,166,1)",

                            }} />
                        {this.state.dateError && <p className="text-danger">To Date cannot be less than From Date</p>}
                    </div>
                    <div className='col-lg-3 col-md-3 col-sm-4 col-6 Fdate' style={{ fontSize: "15px" }}>
                        <p htmlFor="date" style={{
                            fontWeight: "600",
                            fontSize: "13px", marginLeft: "0px", color: "rgba(5,54,82,1)",
                            marginBottom: "5px"
                        }}>{t('To Date *')}</p>
                        <input id="Tdate" type="date"
                            defaultValue={this.state.dtoday} onChange={this.todate} style={{
                                border: "1px solid rgba(40,116,166,1)",
                                borderRadius: "5px",
                                width: "200px",
                                height: "35px",
                                fontSize: "15px",
                                color: "rgba(40,116,166,1)",


                            }} />
                    </div>
                    <div className="col-lg-2 col-md-3 col-sm-4 col-6 Fdate" style={{ paddingTop: '23px' }}>
                        <button type="button" className="btn btn-sm text-white" style={{
                            backgroundColor: "rgb(0, 121, 191)",
                            paddingTop: "6px", paddingBottom: "6px",
                            paddingLeft: "47px", paddingRight: "47px"
                        }}
                            onClick={this.myEarning}>{t('Apply')}</button>
                </div>
            </div >

            {/* {
                this.state.earningList && this.state.earningList.length <= 0 ?
                    "" :
                    <>
                        <div class="d-flex flex-row" style={{ fontWeight: "600", fontSize: "14px", color: "rgba(5,54,82,1)" }}>
                            <div class="pt-2 pb-3 pr-1">Show</div>
                            <div class="pt-2 pb-2"><input type='number' name="number" value={this.state.perPage} style={{ width: "39px", height: "18px", paddingLleft: "4px", fontWeight: "600", fontSize: "14px" }} onChange={this.perPage} /></div>
                            <div class="pt-2 pb-3 pl-1">Entries in a page</div>
                        </div>
                        <hr className="col-12" style={{ marginTop: "-10px", width: "96.6%" }} />
                    </>
            } */}

        {
            this.state.earningList == "" ?
            <div className="row mt-2" style={{ marginLeft: "6px" }}>
                <div className="col text-center" style={{ color: "#222C70", fontSize: "14px", fontWeight: "500" }}>
                    <p>No lists available.</p>
                </div>
            </div> :
            <>
                <div style={{ whiteSpace: "nowrap" }} id='secondAuditScroll1'>
                    <Table responsive>
                        <Thead>
                            <Tr style={{ fontSize: "14px", color: "rgba(5,54,82,1)", paddingLeft: "6px" }}>
                                <Th style={{ fontWeight: "600", textAlign: "right", marginTop: "5px" }}>{t('Total Amount')}</Th>
                                <Th style={{ fontWeight: "600", textAlign: "right", marginTop: "5px" }}>{t('Total Principal')}</Th>
                                <Th style={{ fontWeight: "600", textAlign: "right", marginTop: "5px" }}>{t('Total Interest')}</Th>
                                <Th style={{ fontWeight: "600", textAlign: "right", marginTop: "5px" }}>{t('Date')}</Th>
                                <Th style={{ fontWeight: "600", textAlign: "end", marginTop: "5px" }}></Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {this.state.earningList.map((earning, index) => (
                                <Tr key={index} style={{
                                    marginBottom: "-10px", transition: 'none', cursor: 'default', color: "rgba(5,54,82,1)",
                                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", backgroundColor: (index % 2 === 0) ? 'rgba(255,255,255,1)' : 'rgba(242,242,242,1)'
                                }}>
                                    <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "right" }}>₹ {parseFloat(earning.totalamt).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</Td>
                                    <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "right" }}>₹ {parseFloat(earning.totalprincipal).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</Td>
                                    <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "right" }}>₹ {parseFloat(earning.totalinterest).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</Td>
                                    <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "right" }}>{earning.month === "1" ? "Jan" :
                                        earning.month === "2" ? "Feb" :
                                            earning.month === "3" ? "Mar" :
                                                earning.month === "4" ? "Apr" :
                                                    earning.month === "5" ? "May" :
                                                        earning.month === "6" ? "Jun" :
                                                            earning.month === "7" ? "Jul" :
                                                                earning.month === "8" ? "Aug" :
                                                                    earning.month === "9" ? "Sep" :
                                                                        earning.month === "10" ? "Oct" :
                                                                            earning.month === "11" ? "Nov" :
                                                                                earning.month === "12" ? "Dec" : ""}&nbsp;{earning.year}</Td>
                                    <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "right" }}>

                                        <span className="dropdown">

                                            <FaEllipsisV style={{ fontSize: "26px" }}
                                                className="btn dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" />
                                            &nbsp;
                                            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton" style={{ marginLeft: "-160px" }}>
                                                <a className="dropdown-item" onClick={this.moreDetails.bind(this, earning
                                                )} >Earning Details</a>

                                            </div>
                                        </span>

                                    </Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                    &nbsp;
                    {this.state.earningList.length > 0 &&
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

        {/* View More details */ }
                <button type="button" id='launchColl' style={{ display: "none" }} class="btn btn-primary" data-toggle="modal" data-target=".bd-example-modal-lg">Large modal</button>
                <div class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-lg">
                        <div class="modal-content">
                            <div className="modal-body">
                                <div className='row'>
                                    <div className='col'>
                                        <p style={{ color: "rgba(5,54,82,1)", fontWeight: "600", paddingLeft: "8px" }}><img src={batch} style={{ width: "26px" }} /> &nbsp;Earning Details</p>
                                        <hr style={{ width: "70px", marginTop: "-6px" }} />
                                    </div>
                                </div>

                                <div className='row mb-2' style={{ marginTop: "-10px" }}>
                                    <div className='col'>
                                        <div className="scrollbar" style={{
                                            height: `${this.state.earningDetails.length <= 3 ? "150px" : "320px"}`,
                                            overflowY: "scroll", scrollbarWidth: "thin"
                                        }}>
                                            <Table>
                                                <Thead>
                                                    <Tr style={{ fontFamily: "'Poppins', sans-serif", fontSize: "15px", color: "rgba(5,54,82,1)", paddingLeft: "6px" }}>
                                                        <Th style={{ fontWeight: "600", textAlign: "start" }}>{t('Loan Account Number')}</Th>
                                                        <Th style={{ fontWeight: "600", textAlign: "right" }}>{t('Total Amount')}</Th>
                                                        <Th style={{ fontWeight: "600", textAlign: "right" }}>{t('Principal Amount')}</Th>
                                                        <Th style={{ fontWeight: "600", textAlign: "right" }}>{t('B2L Charges')}</Th>
                                                        <Th style={{ fontWeight: "600", textAlign: "right" }}>{t('Interest')}</Th>
                                                        <Th style={{ fontWeight: "600", textAlign: "start" }}>{t('Transaction Date')}</Th>
                                                    </Tr>
                                                </Thead>
                                                <Tbody>
                                                    {this.state.earningDetails.map((earning, index) => {
                                                        return (
                                                            <Tr key={index}
                                                                style={{
                                                                    fontSize: "15px", color: "rgba(5,54,82,1)", fontFamily: "'Poppins', sans-serif",
                                                                    marginBottom: "-10px", transition: 'none', cursor: 'default', backgroundColor: (index % 2 == 0) ? 'rgba(255,255,255,1)' : 'rgba(242,242,242,1)'
                                                                }}>
                                                                <Td style={{ fontWeight: "490", textAlign: "start" }}>{earning.loanaccoutno}</Td>
                                                                <Td style={{ fontWeight: "490", textAlign: "right" }}>₹ {parseFloat(earning.totalAmount).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</Td>
                                                                <Td style={{ fontWeight: "490", textAlign: "right" }}>₹ {parseFloat(earning.principal).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</Td>
                                                                <Td style={{ fontWeight: "490", textAlign: "right" }}>₹ {parseFloat(earning.b2lcharges).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</Td>
                                                                <Td style={{ fontWeight: "490", textAlign: "right" }}>₹ {parseFloat(earning.interest).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</Td>
                                                                <Td style={{ fontWeight: "490", textAlign: "start" }}>{earning.txndate}</Td>
                                                            </Tr>
                                                        )
                                                    })
                                                    }
                                                </Tbody>
                                            </Table>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            <div className='pt-2 pb-2' style={{ textAlign: "center", paddingRight: "15px" }}>
                                <button type="button" class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "#0079BF" }}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

export default withTranslation()(MyEarning)