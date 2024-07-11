import React, { Component } from 'react';
import { BASEURL } from '../../assets/baseURL';
import FacilitatorSidebar from '../../../SidebarFiles/FacilitatorSidebar';
import $ from 'jquery';
import { Link } from 'react-router-dom';
import { FaUsers, FaAngleLeft, FaRegFileAlt, FaRegFolder, } from 'react-icons/fa';
import dashboardIcon from '../../assets/icon_dashboard.png';
import { withTranslation } from 'react-i18next';
import ReactPaginate from 'react-paginate';
import '../../Borrower/Pagination.css'
import { confirmAlert } from "react-confirm-alert";
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
export class AssistRepaySchedule extends Component {
    //updated
    constructor(props) {
        super(props)

        this.state = {
            EmiSchedule: [],

            offset: 0,
            loanOfferList: [],
            orgtableData: [],
            perPage: 10,
            currentPage: 0,
            pageCount: "",
        }

    }
    componentDidMount() {
        if (sessionStorage.getItem('isLogin') == "true") {

            this.getRepaymentSchedule()
        } else {
            window.location = '/login'
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
            EmiSchedule: slice
        })
    }
    getRepaymentSchedule = () => {
        fetch(BASEURL + '/lms/getrepaymentschedule?loanaccountno=' + sessionStorage.getItem("loanaccountno"), {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },

        }).then((Response) => Response.json())
            .then((resdata) => {
                if (resdata.status == 'SUCCESS') {
                    this.setState({ EmiSchedule: resdata.msgdata })

                    var data = resdata.msgdata
                    console.log(data)
                    var slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
                    console.log(slice)

                    this.setState({
                        pageCount: Math.ceil(data.length / this.state.perPage),
                        orgtableData: data,
                        EmiSchedule: slice
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
            <div className="container-dashboard d-flex flex-row" id="wrapper" style={{ marginTop: "-7px", backgroundColor: "#f4f7fc" }}>
                <FacilitatorSidebar />
                <div className="main-content" id="page-content-wrapper">
                    <div className="container-fluid row pt-2">
                        <div className="col-1" id='evanavRes1'>
                            <button style={{ marginLeft: "25px" }} onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className='col-7' id='evanavRes2' style={{ marginLeft: "20px", marginTop: "5px" }}>
                            <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                <Link to="/facilitatorDashboard">Home</Link> / <Link to="/customer">Customer Support</Link> / Repayment Schedule</p>
                        </div>
                        <div className='col'>

                        </div>
                        <div className='col'>

                        </div>
                        <div className="col" id='evanavRes3'>
                            <button style={myStyle}>
                                <Link to="/customer"><FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} /><span style={{ textDecoration: "none", color: "white" }}>Back</span></Link></button>
                        </div>
                    </div>
                    <hr className="col-11" style={{ marginLeft: "50px", width: "88.6%", backgroundColor: "rgba(4,78,160,1)", marginTop: "0px" }} />
                    <div className='row '>
                        <div className="col">
                            <p className="d-flex justify-content-center" style={{ fontSize: "20px", fontWeight: "bold", color: "#222c70", fontFamily: "Poppins,sans-serif" }}>{t('Repayment Schedule')}</p>
                        </div>
                    </div>
                    <div className='row' style={{ marginTop: "-15px" }}>
                        <div className="col">
                            <div className='card' style={{ width: "92%", marginLeft: "50px", marginBottom: "10px", cursor: "default", paddingBottom: "20px", fontFamily: "Poppins,sans-serif" }}>
                                <div className='row'>
                                    <div className='col'></div>
                                    <div className='col'>
                                        <div className='card' style={{ textAlign: "center", cursor: "default", backgroundColor: "#0074bf" }}>
                                            <p className='text-white' style={{ marginBottom: "0px" }}>Account Number: {sessionStorage.getItem("loanaccountno")}</p>
                                        </div>
                                    </div>
                                    <div className='col'></div>
                                </div>
                                {this.state.EmiSchedule == "" ?
                                    <div className="row mt-2" style={{ marginLeft: "6px" }}>
                                        <div className="col text-center" style={{ color: "#222C70", fontSize: "14px", fontWeight: "500" }}>
                                            <p>No lists available.</p>
                                        </div>
                                    </div> :
                                    <>
                                        <div style={{ whiteSpace: "nowrap", padding: "10px" }} id='secondAuditScroll'>
                                            <Table responsive>
                                                <Thead>
                                                    <Tr style={{ fontSize: "15px", color: "rgba(5,54,82,1)", paddingLeft: "6px" }}>
                                                        <Th style={{ fontWeight: "600", marginTop: "5px", textAlign: "right" }}>{t('Interest')}</Th>
                                                        <Th style={{ fontWeight: "600", marginTop: "5px", textAlign: "right" }}>{t('Principal')}</Th>
                                                        <Th style={{ fontWeight: "600", marginTop: "5px", textAlign: "right" }}>{t("Amount")}</Th>
                                                        <Th style={{ fontWeight: "600", marginTop: "5px", textAlign: "right" }}>{t("Opening Balance")}</Th>
                                                        <Th style={{ fontWeight: "600", marginTop: "5px", textAlign: "right" }}>{t("Outstanding Balance")}</Th>
                                                        <Th style={{ fontWeight: "600", marginTop: "5px", textAlign: "right" }}>{t("Repayment Date")}</Th>
                                                    </Tr>
                                                </Thead>
                                                <Tbody>
                                                    {this.state.EmiSchedule.map((loan, index) => (
                                                        <Tr key={index} style={{
                                                            color: "rgba(5,54,82,1)",
                                                            marginBottom: "-10px", transition: 'none', cursor: 'default',
                                                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", backgroundColor: (index % 2 === 0) ? 'rgba(255,255,255,1)' : 'rgba(242,242,242,1)'
                                                        }}>
                                                            <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "right" }}>
                                                                ₹{parseFloat(loan.towardsinterest).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
                                                            </Td>
                                                            <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "right" }}>
                                                                ₹{parseFloat(loan.towardsprincipal).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
                                                            </Td>
                                                            <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "right" }}>
                                                                ₹{parseFloat(loan.amtpaid).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
                                                            </Td>
                                                            <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "right" }}>
                                                                ₹{parseFloat(loan.openingbal).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
                                                            </Td>
                                                            <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "right" }}>
                                                                ₹{parseFloat(loan.closingbal).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
                                                            </Td>
                                                            <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "right" }}>{loan.emidate && loan.emidate.split("-").reverse().join("-")}</Td>
                                                        </Tr>
                                                    ))}
                                                </Tbody>
                                            </Table>
                                            &nbsp;
                                            {this.state.EmiSchedule.length > 1 &&
                                                <div className="row justify-content-end">
                                                    <div className='col-auto'>
                                                        <div className='card border-0'>
                                                            <div style={{ marginLeft: "16px" }}>
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
                                    </>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withTranslation()(AssistRepaySchedule)
