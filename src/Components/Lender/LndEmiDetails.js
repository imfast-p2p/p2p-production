import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { BASEURL } from '../assets/baseURL';
import $ from 'jquery';
import LenderSidebar from '../../SidebarFiles/LenderSidebar';
import { withTranslation } from 'react-i18next';
import { confirmAlert } from "react-confirm-alert";
import { FaAngleDown, FaMoneyBill, FaAngleDoubleDown, FaRegFileAlt, FaAngleLeft } from 'react-icons/fa';
import dashboardIcon from '../assets/icon_dashboard.png';
import ReactPaginate from 'react-paginate';
import './LndEmiDetails.css';
//updated
export class LndEmiDetails extends Component {
    constructor(props) {
        super(props)

        this.state = {
            emiProdList: JSON.parse(sessionStorage.getItem('emiDetails')),

            offset: 0,
            perPage: 5,
            currentPage: 0,
            pageCount: "",
        }
    }
    componentDidMount() {
        if (sessionStorage.getItem('isLogin') == "true") {
            var data = this.state.emiProdList
            console.log(data)
            var slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
            console.log(slice)

            this.setState({
                pageCount: Math.ceil(data.length / this.state.perPage),
                orgtableData: data,
                emiProdList: slice
            })
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
            emiProdList: slice
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
            <div className="container-dashboard d-flex flex-row" id="wrapper" style={{ marginTop: "-10px",backgroundColor:"#f4f7fc" }}>
                <LenderSidebar />
                <div className="main-content" id="page-content-wrapper">
                    <div className="container-fluid row pt-2">
                        <div className="col-1" id='lndemiRes1'>
                            <button style={{ marginLeft: "25px" }} onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className='col-4' id='lndemiRes2' style={{ marginLeft: "20px", marginTop: "5px" }}>
                            <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                <Link to="/lenderdashboard">Home</Link> / <Link to="/MyEarnings">My Earnings</Link> / View EMI Details</p>
                        </div>
                        <div className='col'>

                        </div>
                        <div className='col'>

                        </div>
                        <div className='col-3'>

                        </div>
                        <div className="col" id='lndemiRes3'>
                            <button style={{ color: "white", height: "25px", width: "65px", border: "none", backgroundColor: "rgba(5,54,82,1)", borderRadius: "5px", marginLeft: "14px" }}>
                                <Link to="/MyEarnings"><FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} /><span style={{ textDecoration: "none", color: "white" }}>Back</span></Link></button>
                        </div>
                    </div>

                    <hr className="col-11" style={{ marginLeft: "50px", width: "88.6%", backgroundColor: "rgba(4,78,160,1)" }} />
                    <div className='row '>
                        <div className="col">
                            <p className="d-flex justify-content-center" style={{ fontSize: "20px", fontWeight: "bold", color: "rgba(5,54,82,1)" }}>{t('View EMI Details')}</p>
                        </div>
                    </div>

                    {/* New Design */}
                    <div class="d-flex flex-row" style={{ marginLeft: "50px", fontWeight: "600", fontSize: "14px", color: "rgba(5,54,82,1)" }}>
                        <div class="pt-2 pb-3 pr-1">Show</div>
                        <div class="pt-2 pb-2"><input type='number' name="number" value={this.state.perPage} style={{ width: "39px", height: "18px", paddingLleft: "4px", fontWeight: "600", fontSize: "14px" }} /></div>
                        <div class="pt-2 pb-3 pl-1">Entries in a page</div>
                    </div>

                    <div className='row font-weight-normal' style={{ fontWeight: "800", fontSize: "15px", width: "95%", marginLeft: "30px", color: "rgba(5,54,82,1)" }}>
                        <div className='col-3'>
                            <p style={{ fontWeight: "600", paddingLeft: "20px" }}>{t('Loan Account Number')}</p>
                        </div>
                        <div className='col-2'>
                            <p style={{ fontWeight: "600", marginLeft: "15px" }}>{t('EMI')}</p>
                        </div>
                        <div className='col-2'>
                            <p style={{ fontWeight: "600" }}>{t('EMI Date')}</p>
                        </div>
                        <div className='col-2'>
                            <p style={{ fontWeight: "600" }}>{t('Interest')}</p>
                        </div>
                        <div className='col-3' style={{ textAlign: "center" }}>
                            <p style={{ fontWeight: "600" }}>{t('Principal Amount')}</p>
                        </div>
                    </div>
                    <hr className="col-11" style={{ marginLeft: "50px", width: "88.6%", marginTop: "-10px" }} />
                    <div className="">
                        {
                            this.state.emiProdList.map((loans, index) => {
                                return (
                                    <div className='col' key={index}>
                                        <div className='card border-0' style={{ marginBottom: "-10px", transition: 'none', cursor: 'default', color: "rgb(5, 54, 82)", width: "95%", marginLeft: "30px", backgroundColor: (index % 2 == 0) ? 'rgba(255,255,255,1)' : 'rgba(242,242,242,1)' }}>
                                            <div className="row item-list align-items-center">
                                                <div className="col-3">
                                                    <p className="" style={{paddingLeft:"20px",fontSize: "17px", fontWeight: "490", paddingTop: "12px" }}>{loans.loanaccountno}</p>
                                                </div >
                                                <div className="col-2">
                                                    <p style={{paddingLeft:"16px", fontSize: "17px", fontWeight: "490", paddingTop: "12px" }}>₹ {parseFloat(loans.emi).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</p>
                                                </div >
                                                <div className="col-2">
                                                    <p style={{ fontSize: "17px", fontWeight: "490", paddingTop: "12px" }}>{loans.emidate}</p>
                                                </div>
                                                <div className="col-2">
                                                    <p className="" style={{ fontSize: "17px", fontWeight: "490", paddingTop: "12px" }}>{loans.interest}</p>
                                                </div>
                                                <div className="col-3" style={{ textAlign: "center" }}>
                                                    <p className="" style={{ fontSize: "17px", fontWeight: "490", paddingTop: "12px" }}>₹ {parseFloat(loans.principal).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</p>
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
                    {/* <div className="row">
                        {
                            this.state.emiProdList.map((emi, index) => {
                                return (
                                    <div key={index}>
                                        <div className="col">
                                            <div className="card item-list" style={{ cursor: "default", marginBottom: "-5px" }}>
                                                <div className="card-header border-0">
                                                    <div className="row item-list align-items-center">
                                                        <div className="col">
                                                            <p>{t('Loan Account Number')}</p>
                                                            <h6>{emi.loanaccountno}</h6>
                                                        </div >
                                                        <div className="col">
                                                            <p>{t('Emi Amount')}</p>
                                                            <h6>₹{parseFloat(emi.emi).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</h6>
                                                        </div>
                                                        <div className="col">
                                                            <p>{t('Emi Date')}</p>
                                                            <h6>{emi.emidate}</h6>
                                                        </div>
                                                        <div className="col">
                                                            <p>{t('Interest')}</p>
                                                            <h6>{emi.interest}</h6>
                                                        </div >
                                                        <div className="col">
                                                            <p>{t('Principal Amount')}</p>
                                                            <h6>₹{parseFloat(emi.principal).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</h6>
                                                        </div >
                                                    </div >
                                                </div>
                                            </div>
                                        </div>
                                    </div >
                                )
                            })
                        }
                    </div> */}
                </div>
            </div>
        )
    }
}

export default withTranslation()(LndEmiDetails)












