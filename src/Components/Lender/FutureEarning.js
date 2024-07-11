import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { BASEURL } from '../assets/baseURL';
import $ from 'jquery';
import LenderSidebar from '../../SidebarFiles/LenderSidebar';
import { withTranslation } from 'react-i18next';
import { confirmAlert } from "react-confirm-alert";
import { FaEllipsisV, FaListUl } from 'react-icons/fa';
import ReactPaginate from 'react-paginate';
import './FutureEarnings.css';
import batch from '../assets/batch.png';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'
import openIt from '../assets/AdminImg/openit.png'

//updated
export class FutureEarning extends Component {
    constructor(props) {
        super(props)

        this.state = {
            totalinterest: "",
            totalprinciple: "",
            totalemi: "",
            month: "",
            year: "",

            emiProList: [],
            fromdate: "",
            todate: "",
            dtoday: "",
            dfrday: "",

            offset: 0,
            perPage: 5,
            currentPage: 0,
            pageCount: "",

            moreDMonth: "",
            moreDYear: "",
            moreDInt: "",
            moreDPrincipal: "",
            moreDAmt: "",
            emiDetails: [],
            invalidDate: false,
            invalidDate2: false,
            dateError: false
        }
    }
    componentDidMount() {
        if (sessionStorage.getItem('isLogin') == "true") {
            this.emiProjectionLists2()
            this.loadDate();
        } else {
            window.location = '/login'
        }

    }
    fromdate = (event) => {
        //this.setState({ fromdate: event.target.value })
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
    todate = (event) => {
        //this.setState({ todate: event.target.value })
        const toDateValue = event.target.value;
        const fromDateValue = this.state.fromdate;

        this.setState({ todate: toDateValue });


        if (fromDateValue && toDateValue < fromDateValue) {
            this.setState({ dateError: true });
        } else {
            this.setState({ dateError: false });
        }
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
            emiProList: slice
        })
    }
    emiProjectionLists2 = () => {
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
        fetch(BASEURL + '/lms/getlenderemiprojection', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                lenderid: sessionStorage.getItem('userID'),
                fromdate: frday,
                todate: today,
            })
        }).then(response => {
            console.log('Response:', response)
            return response.json();

        })
            .then((resdata) => {
                if (resdata.status == 'SUCCESS') {
                    console.log(resdata);
                    //this.setState({ emiProList: resdata.msgdata })

                    var emiLists = resdata.msgdata;

                    var list = emiLists;
                    list.sort((a, b) => {
                        return new Date(b.txndate).getTime() - new Date(a.txndate).getTime()
                    })
                    console.log(list);
                    this.setState({ emiProList: list })

                    var data = emiLists
                    console.log(data)
                    var slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
                    console.log(slice)

                    this.setState({
                        pageCount: Math.ceil(data.length / this.state.perPage),
                        orgtableData: data,
                        emiProList: slice
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
    }
    emiProjectionLists = (event) => {
        fetch(BASEURL + '/lms/getlenderemiprojection', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                lenderid: sessionStorage.getItem('userID'),
                fromdate: this.state.fromdate,
                todate: this.state.todate,
            })
        }).then(response => {
            console.log('Response:', response)
            return response.json();

        })
            .then((resdata) => {
                if (resdata.status == 'SUCCESS') {
                    console.log(resdata);
                    //this.setState({ emiProList: resdata.msgdata })

                    var emiLists = resdata.msgdata;

                    var list = emiLists;
                    list.sort((a, b) => {
                        return new Date(b.txndate).getTime() - new Date(a.txndate).getTime()
                    })
                    console.log(list);
                    this.setState({ emiProList: list })

                    var data = emiLists
                    console.log(data)
                    var slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
                    console.log(slice)

                    this.setState({
                        pageCount: Math.ceil(data.length / this.state.perPage),
                        orgtableData: data,
                        emiProList: slice
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
    moreDetails = (lists) => {
        $('#launchColl2').click()
        this.setState({ emiDetails: lists.emidetails })
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
                        }} onClick={this.emiProjectionLists}>{t('Apply')}</button>
                    </div>
                </div>
                {/* {this.state.emiProList && this.state.emiProList.length <= 0 ?
                    "" :
                    <>
                        <div class="d-flex flex-row" style={{ fontWeight: "600", fontSize: "14px", color: "rgba(5,54,82,1)" }}>
                            <div class="pt-2 pb-3 pr-1">Show</div>
                            <div class="pt-2 pb-2"><input type='number' name="number" value={this.state.perPage} style={{ width: "39px", height: "18px", paddingLleft: "4px", fontWeight: "600", fontSize: "14px" }} onChange={this.perPage} /></div>
                            <div class="pt-2 pb-3 pl-1">Entries in a page</div>
                        </div>
                        <hr className="col-12" style={{ marginTop: "-10px", width: "96.6%" }} />
                       
                    </>} */}

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
                                        <Tr style={{ fontSize: "15px", color: "rgba(5,54,82,1)", paddingLeft: "6px" }}>
                                            <Th style={{ fontWeight: "600", textAlign: "right", marginTop: "5px" }}>{t('Total Principal')}</Th>
                                            <Th style={{ fontWeight: "600", textAlign: "right", marginTop: "5px" }}>{t('Total EMI')}</Th>
                                            <Th style={{ fontWeight: "600", textAlign: "right", marginTop: "5px" }}>{t('Total Interest')}</Th>
                                            <Th style={{ fontWeight: "600", textAlign: "right", marginTop: "5px" }}>{t('Date')}</Th>
                                            <Th style={{ fontWeight: "600", textAlign: "end", marginTop: "5px" }}></Th>
                                        </Tr>
                                    </Thead>
                                    <Tbody>
                                        {this.state.emiProList.map((lists, index) => (
                                            <Tr key={index} style={{
                                                marginBottom: "-10px", transition: 'none', cursor: 'default', color: "rgba(5,54,82,1)",
                                                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", backgroundColor: (index % 2 === 0) ? 'rgba(255,255,255,1)' : 'rgba(242,242,242,1)'
                                            }}>
                                                <Td style={{ fontWeight: "490", textAlign: "right" }}>₹ {parseFloat(lists.totalprinciple).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</Td>
                                                <Td style={{ fontWeight: "490", textAlign: "right" }}>₹ {parseFloat(lists.totalemi).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</Td>
                                                <Td style={{ fontWeight: "490", textAlign: "right" }}>₹ {parseFloat(lists.totalinterest).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</Td>
                                                <Td style={{ fontWeight: "490", textAlign: "right" }}>{lists.month === "1" ? "Jan" :
                                                    lists.month === "2" ? "Feb" :
                                                        lists.month === "3" ? "Mar" :
                                                            lists.month === "4" ? "Apr" :
                                                                lists.month === "5" ? "May" :
                                                                    lists.month === "6" ? "Jun" :
                                                                        lists.month === "7" ? "Jul" :
                                                                            lists.month === "8" ? "Aug" :
                                                                                lists.month === "9" ? "Sep" :
                                                                                    lists.month === "10" ? "Oct" :
                                                                                        lists.month === "11" ? "Nov" :
                                                                                            lists.month === "12" ? "Dec" : ""}&nbsp;{lists.year}</Td>
                                                <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "right" }}>

                                                    <span className="dropdown">

                                                        <FaEllipsisV style={{ fontSize: "26px" }}
                                                            className="btn dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" />
                                                        &nbsp;
                                                        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton" style={{ marginLeft: "-160px" }}>
                                                            <a className="dropdown-item" onClick={this.moreDetails.bind(this, lists
                                                            )} >EMI Details</a>

                                                        </div>
                                                    </span>

                                                </Td>
                                            </Tr>
                                        ))}
                                    </Tbody>
                                </Table>
                                &nbsp;
                                {this.state.emiProList.length > 0 &&
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

                {/* View More Modal */}
                <button type="button" id='launchColl2' style={{ display: "none" }} class="btn btn-primary" data-toggle="modal" data-target=".bd-example-modal-lg1">Large modal</button>
                <div class="modal fade bd-example-modal-lg1" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
                    <div class="modal-dialog modal-lg">
                        <div class="modal-content">
                            <div className="modal-body">
                                <div className='row'>
                                    <div className='col'>
                                        <p style={{ color: "rgba(5,54,82,1)", fontWeight: "600", paddingLeft: "8px" }}><img src={batch} style={{ width: "26px" }} /> &nbsp;EMI Details</p>
                                        <hr style={{ width: "70px", marginTop: "-6px" }} />
                                    </div>
                                </div>
                                <div className='row mb-2' style={{ marginTop: "-10px" }}>
                                    <div className='col'>
                                        <div className="scrollbar" style={{
                                            height: `${this.state.emiDetails.length <= 3 ? "150px" : "320px"}`,
                                            overflowY: "scroll", scrollbarWidth: "thin"
                                        }}>
                                            <Table>
                                                <Thead>
                                                    <Tr style={{ fontSize: "14px", fontFamily: "'Poppins', sans-serif", color: "rgba(5,54,82,1)", paddingLeft: "6px" }}>
                                                        <Th style={{ fontWeight: "600", textAlign: "start" }}>{t('Loan Account Number')}</Th>
                                                        <Th style={{ fontWeight: "600", textAlign: "start" }}>{t('Principal')}</Th>
                                                        <Th style={{ fontWeight: "600", textAlign: "start" }}>{t('Interest')}</Th>
                                                        <Th style={{ fontWeight: "600", textAlign: "start" }}>{t('Emi')}</Th>
                                                        <Th style={{ fontWeight: "600", textAlign: "start" }}>{t('Emi Date')}</Th>
                                                    </Tr>
                                                </Thead>
                                                <Tbody>
                                                    {
                                                        this.state.emiDetails.map((lists, index) => {
                                                            return (
                                                                <Tr key={index}
                                                                    style={{
                                                                        fontSize: "14px", fontFamily: "'Poppins', sans-serif", color: "rgba(5,54,82,1)",
                                                                        marginBottom: "-10px", transition: 'none', cursor: 'default', backgroundColor: (index % 2 == 0) ? 'rgba(255,255,255,1)' : 'rgba(242,242,242,1)'
                                                                    }}>
                                                                    <Td style={{ fontWeight: "490", textAlign: "start" }}>{lists.loanaccountno}</Td>
                                                                    <Td style={{ fontWeight: "490", textAlign: "start" }}>₹ {parseFloat(lists.principal).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</Td>
                                                                    <Td style={{ fontWeight: "490", textAlign: "start" }}>₹ {parseFloat(lists.interest).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</Td>
                                                                    <Td style={{ fontWeight: "490", textAlign: "start" }}>₹ {parseFloat(lists.emi).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</Td>
                                                                    <Td style={{ fontWeight: "490", textAlign: "start" }}>{lists.emidate}</Td>
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

export default withTranslation()(FutureEarning)