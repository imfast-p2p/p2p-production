import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { BASEURL } from '../assets/baseURL';
import $ from 'jquery';
import LenderSidebar from '../../SidebarFiles/LenderSidebar';
import { withTranslation } from 'react-i18next';
import { FaAngleLeft } from 'react-icons/fa';
import dashboardIcon from '../assets/icon_dashboard.png';
import ReactPaginate from 'react-paginate';
import MyEarning from './MyEarning';
import FutureEarning from './FutureEarning';
import './MyEarnings.css';
//updated
export class ViewAllLoans extends Component {

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
            <div className="container-dashboard d-flex flex-row" style={{ marginTop: "-10px", backgroundColor: "#F4F7FC" }}>
                <LenderSidebar />
                <div className="main-content" style={{ width: "100%" }}>
                    <div className="container-fluid row pt-2">
                        <div className="col-1" id='myEarningsRes1'>
                            <button style={{ marginLeft: "25px" }} onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className='col-4' id='myEarningsRes2' style={{ marginLeft: "20px", marginTop: "5px" }}>
                            <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                <Link to="/lenderdashboard">Home</Link>/ My Earnings</p>
                        </div>
                        <div className='col'>

                        </div>
                        <div className='col'>

                        </div>
                        <div className='col-3'>

                        </div>
                        <div className="col" id='myEarningsRes3'>
                            <button style={myStyle}>
                                <Link to="/lenderdashboard" style={{ marginLeft: "10px" }}><FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} /><span style={{ textDecoration: "none", color: "white" }}>Back</span></Link></button>
                        </div>
                    </div>
                    <hr className="col-11" style={{ marginLeft: "50px", width: "88.6%", backgroundColor: "rgba(4,78,160,1)", marginTop: "-5px" }} />

                    <div className='row' style={{ marginTop: "-10px" }}>
                        <div className="col">
                            <p className="d-flex justify-content-center" style={{ fontSize: "20px", fontWeight: "bold", color: "rgba(5,54,82,1)" }}>{t('My Earnings')}</p>
                        </div>
                    </div>
                    <div className="container-fluid row" style={{ paddingLeft: "86px", marginTop: "-20px" }}>
                        <div className='card' style={{ overflow: "auto" }}>
                            <div className='row pt-2'>
                                <div className='col'>
                                    <ul role="tablist" className="nav nav-pills nav-fill mb-3" >
                                        <li className="nav-item"> <a data-toggle="pill" href="#myEarning-details" className="nav-link active detailsTab"
                                            style={{ textAlign: "center", paddingTop: "10px", paddingBottom: "10px" }}> {t('My Earning Details')} </a> </li>
                                        <li className="nav-item"> <a data-toggle="pill" href="#futureEarning-details" className="nav-link detailsTab"
                                            style={{ textAlign: "center", paddingTop: "10px", paddingBottom: "10px" }} onClick={this.getAddressDetails}> {t('Future Earning Details')} </a> </li>
                                    </ul>

                                </div>
                            </div>
                            <div className='row' style={{ marginTop: "-10px" }}>
                                <div className='col'>
                                    <div className='tab-content'>
                                        <div id="myEarning-details" className=" register-form tab-pane fade show active" style={{ cursor: "default" }}>
                                            <MyEarning />
                                        </div>
                                        <div id="futureEarning-details" className=" register-form tab-pane fade" style={{ cursor: "default" }}>
                                            <FutureEarning />
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












