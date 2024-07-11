import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import { BASEURL } from '../assets/baseURL';
import LenderSidebar from '../../SidebarFiles/LenderSidebar';
import { withTranslation } from 'react-i18next';
import BootstrapSwitchButton from 'bootstrap-switch-button-react'
import { FaAngleDown, FaMoneyBill, FaAngleDoubleDown, FaFileAlt, FaAngleLeft } from 'react-icons/fa';
import dashboardIcon from '../assets/icon_dashboard.png';
import './AutoInvestment.css';
import ReactPaginate from 'react-paginate';
import { confirmAlert } from 'react-confirm-alert';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'

export class AutoInvestment extends Component {
    constructor(props) {
        super(props)
        //updated
        this.state = {
            LAPreference: [],
            lenderid: "LND-ENXPM0103Z",
            preferenceno: "2",
            minimumamt: "",
            maximumamt: "",
            totalamt: "",
            startdate: "2021-10-22",
            enddate: "2021-10-24",
            preference: "",
            enable: "1",
            dtoday: "",
            dfrday: "",
            dateError: false,

            setPreference: ""

        }
        this.minimumamt = this.minimumamt.bind(this);
        this.maximumamt = this.maximumamt.bind(this);
        this.totalamt = this.totalamt.bind(this);
        this.startdate = this.startdate.bind(this);
        this.enddate = this.enddate.bind(this);
        this.preference = this.preference.bind(this);
        this.getLAPreference = this.getLAPreference.bind(this);
        this.setLAPreference = this.setLAPreference.bind(this);

    }

    minimumamt(event) {
        this.setState({ minimumamt: event.target.value })
    }
    maximumamt(event) {
        this.setState({ maximumamt: event.target.value })
    }
    totalamt(event) {
        this.setState({ totalamt: event.target.value })
    }
    startdate(event) {
        this.setState({ startdate: event.target.value })
        const fromDateValue = event.target.value;
        const toDateValue = this.state.enddate;


        this.setState({ startdate: fromDateValue });

        if (toDateValue && fromDateValue > toDateValue) {
            this.setState({ dateError: true });
        } else {
            this.setState({ dateError: false });
        }
    }
    enddate(event) {
        this.setState({ enddate: event.target.value })
        const toDateValue = event.target.value;
        const fromDateValue = this.state.startdate;

        this.setState({ enddate: toDateValue });


        if (fromDateValue && toDateValue < fromDateValue) {
            this.setState({ dateError: true });
        } else {
            this.setState({ dateError: false });
        }
    }
    preference(event) {
        this.setState({ preference: event.target.value })
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
        frday = yyyy + '-' + mm + '-' + dd;
        this.setState({ dtoday: frday });
        this.setState({ enddate: frday })
        this.setState({ dfrday: today });
        this.setState({ startdate: today })

    }

    componentDidMount() {
        if (sessionStorage.getItem('isLogin') == "true") {
            this.getLAPreference();
            this.loadDate();
        } else {
            window.location = '/login'
        }

    }

    getLAPreference() {
        fetch(BASEURL + '/lms/getlenderautoinvestpreference', {
            method: 'get',
            headers: {
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            }
        }).then((Response) => {
            return Response.json();
        })
            .then((resdata) => {
                if (resdata.status == 'SUCCESS') {
                    console.log(resdata);

                    this.setState({ LAPreference: resdata.msgdata })
                    // alert(resdata.message)
                }
                else {
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
                                        window.location.reload();
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

    setLAPreference() {
        fetch(BASEURL + '/lms/setlenderautoinvestpreference', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                lenderid: sessionStorage.getItem('userID'),
                preferenceno: this.state.preference,
                minimumamt: this.state.minimumamt,
                maximumamt: this.state.maximumamt,
                totalamt: this.state.totalamt,
                startdate: this.state.startdate,
                enddate: this.state.enddate,
                enable: "1"
            })
        }).then((Response) => {
            return Response.json();
        })
            .then((resdata) => {
                if (resdata.status == 'Success') {
                    alert(resdata.message);
                }
                else {
                    alert(resdata.message);
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }
    setLAPreferenceStatus = (preferenceno, enablestatus) => {
        console.log(preferenceno, enablestatus)
        var enableStatus = "";

        if (enablestatus === "1") {
            this.setState({ enable: "0" })
            enableStatus = "0";
            console.log(this.state.enable)
        } else if (enablestatus === "0") {
            this.setState({ enable: "1" })
            enableStatus = "1";

            console.log(this.state.enable)
        }


        fetch(BASEURL + '/lms/setlenderautoinveststatus', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                preferenceno: preferenceno,
                enable: enableStatus
            })
        }).then((Response) => {
            return Response.json();
        })
            .then((resdata) => {
                this.getLAPreference();

                if (resdata.status == 'Success') {
                    confirmAlert({
                        message: resdata.message,
                        buttons: [{
                            label: "Okay",
                            onClick: () => {
                            }
                        }
                        ]
                    })
                    // alert(resdata.message);
                }
                else {
                    confirmAlert({
                        message: resdata.message,
                        buttons: [{
                            label: "Okay",
                            onClick: () => {
                            }
                        }
                        ]
                    })
                    // alert(resdata.message);
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }

    handleChange() {
        $('.text').toggle();
        $('#PImage').toggle();
        $('#Pinfo').toggle();
    }

    render() {
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
        const { t } = this.props
        return (
            <div className="container-dashboard d-flex flex-row" style={{ marginTop: "-10px", backgroundColor: "#F4F7FC" }}>
                <LenderSidebar />
                <div className="main-content" >
                    <div className="container-fluid row pt-2">
                        <div className="col-1" id='AutonavRes1'>
                            <button style={{ marginLeft: "25px" }} onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className='col-4' id='AutonavRes2' style={{ marginLeft: "20px", marginTop: "5px" }}>
                            <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                <Link to="/lenderdashboard">Home</Link> /Auto Investment</p>
                        </div>
                        <div className='col'>

                        </div>
                        <div className='col'>

                        </div>
                        <div className='col-3'>

                        </div>
                        <div className="col" id='AutonavRes3'>
                        <button style={myStyle}>
                        <Link to="/lenderdashboard" style={{ marginLeft: "10px" }}><FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} /><span style={{ textDecoration: "none", color: "white" }}>Back</span></Link></button>
                        </div>
                    </div>


                    <hr className="col-11" style={{ marginLeft: "50px", width: "88.6%", backgroundColor: "rgba(4,78,160,1)", marginTop:"-5px" }} />

                    <div className='container-fluid row' style={{ paddingLeft: "82px", marginTop: "-26px" }}>
                        <div className='card' style={{ overflow: "auto" }}>
                            <div className='row pt-2'>
                                <div className='col'>
                                    <ul role="tablist" className="nav nav-pills nav-fill mb-3" >
                                        <li className="nav-item"> <a data-toggle="pill" href="#myEarning-details" className="nav-link active detailsTab"
                                            style={{ textAlign: "center", paddingTop: "10px", paddingBottom: "10px", cursor: "default" }}>
                                            <FaFileAlt />&nbsp; {t('AutoInvestment')} </a> </li>
                                    </ul>

                                </div>
                            </div>
                            <div className='row'>
                                <table className="" style={{ marginLeft: "5px", marginTop:"-15px" }}>
                                    <thead>
                                        <tr>
                                            <div id="one" style={{ color: "rgba(5,54,82,1)" }}>
                                                <th scope="col-1" className="p-0" >
                                                    <div className="form-group m-2">
                                                        <p htmlFor="date" style={{
                                                            fontWeight: "600",
                                                            fontSize: "13px", marginLeft: "0px", color: "rgba(5,54,82,1)",
                                                            marginBottom: "5px"
                                                        }}>{t('Start Date*')}</p>
                                                        {/* <label htmlFor="type" style={{ fontSize: "14px", marginLeft: "1px" }}>{t('Start Date*')}</label> */}
                                                        <div>
                                                            <input
                                                                type="date"
                                                                name="start"
                                                                onChange={this.startdate} defaultValue={this.state.dfrday}
                                                                style={{
                                                                    border: "1px solid rgba(40,116,166,1)",
                                                                    width: "130px",
                                                                    fontSize: "14px",
                                                                    height: "35px",
                                                                    borderRadius: "5px"
                                                                }}
                                                            />
                                                           
                                                        </div>
                                                    </div>
                                                </th>
                                                <th scope="col-1" className="p-0">
                                                    <div className="form-group m-2">
                                                        <p htmlFor="date" style={{
                                                            fontWeight: "600",
                                                            fontSize: "13px", marginLeft: "0px", color: "rgba(5,54,82,1)",
                                                            marginBottom: "5px"
                                                        }}>{t('End Date*')}</p>
                                                        {/* <label htmlFor="sort" style={{ fontSize: "14px", marginLeft: "1px" }}>{t('End Date*')}</label> */}
                                                        <div>
                                                            <input
                                                                type="date"
                                                                name="start"
                                                                onChange={this.enddate} defaultValue={this.state.dtoday}
                                                                style={{
                                                                    border: "1px solid rgba(40,116,166,1)",
                                                                    width: "130px",
                                                                    fontSize: "14px",
                                                                    height: "35px",
                                                                    borderRadius: "5px"
                                                                }}
                                                            />
                                                        </div>

                                                    </div>
                                                </th>
                                                <th scope="col-1" className="p-0 ">
                                                    <div className="form-group m-2">
                                                   
                                                        <p htmlFor="date" style={{
                                                            fontWeight: "600",
                                                            fontSize: "13px", marginLeft: "0px", color: "rgba(5,54,82,1)",
                                                            marginBottom: "5px"
                                                        }}>{t('Minimum Amount*')}</p>
                                                        {/* <label htmlFor="sort" style={{ fontSize: "14px", marginLeft: "1px" }}>{t('Minimum Amount*')}</label> */}
                                                        <div>
                                                            <input id="pan" type="number" onChange={this.minimumamt} className="" placeholder="Min Amount"
                                                                style={{
                                                                    border: "1px solid rgba(40,116,166,1)",
                                                                    width: "130px",
                                                                    fontSize: "14px",
                                                                    height: "35px",
                                                                    borderRadius: "5px"
                                                                }} />
                                                        </div>

                                                    </div>
                                                </th>
                                                <th scope="col-1" className="p-0">
                                                    <div className="form-group m-2">
                                                    <p htmlFor="date" style={{
                                                            fontWeight: "600",
                                                            fontSize: "13px", marginLeft: "0px", color: "rgba(5,54,82,1)",
                                                            marginBottom: "5px"
                                                        }}>{t('Maximum Amount*')}</p>
                                                        {/* <label htmlFor="risk" id='wraplabel1' style={{ fontSize: "14px", marginLeft: "1px" }}>{t('Maximum Amount*')}</label> */}
                                                        <div>
                                                            <input id="pan" type="number" onChange={this.maximumamt} className="" placeholder="Max Amount"
                                                                style={{
                                                                    border: "1px solid rgba(40,116,166,1)",
                                                                    width: "130px",
                                                                    fontSize: "14px",
                                                                    height: "35px",
                                                                    borderRadius: "5px"
                                                                }} />
                                                        </div>
                                                    </div>
                                                </th>

                                                <th scope="col-1" className="p-0">
                                                    <div className="form-group m-2">
                                                    <p htmlFor="date" style={{
                                                            fontWeight: "600",
                                                            fontSize: "13px", marginLeft: "0px", color: "rgba(5,54,82,1)",
                                                            marginBottom: "5px"
                                                        }}>{t('Total Amount*')}</p>
                                                        {/* <label htmlFor="prod" style={{ fontSize: "14px", marginLeft: "1px" }}>{t('Total Amount*')}</label> */}
                                                        <div>
                                                            <input id="pan" type="number" onChange={this.totalamt} className="" placeholder="Total Amount"
                                                                style={{
                                                                    border: "1px solid rgba(40,116,166,1)",
                                                                    width: "130px",
                                                                    fontSize: "14px",
                                                                    height: "35px",
                                                                    borderRadius: "5px"
                                                                }} />
                                                        </div>

                                                    </div>
                                                </th>
                                                <th scope="col-1" className="p-0">
                                                    <div className="form-group m-2">
                                                    <p htmlFor="date" style={{
                                                            fontWeight: "600",
                                                            fontSize: "13px", marginLeft: "0px", color: "rgba(5,54,82,1)",
                                                            marginBottom: "5px"
                                                        }}>{t('Preference Type*')}</p>
                                                        {/* <label htmlFor="sort" style={{ fontSize: "14px", marginLeft: "1px" }}>{t('Preference Type*')}</label> */}
                                                        <select className="form-select" onChange={this.preference} style={{ border: "1px solid rgba(40,116,166,1)", width: '130px', fontSize: "14px" }}>
                                                            <option>{t('Select Preference')}</option>
                                                            <option value="1">{t('1')}</option>
                                                            <option value="2">{t('2')}</option>
                                                            <option value="3">{t('3')}</option>
                                                        </select>
                                                    </div>
                                                </th>

                                                {/* <th scope="col-1" className="p-0 " style={{ marginTop: "10px", marginLeft: "9px", marginBottom: "5px" }}> */}
                                                    {this.state.dateError && <p style={{ color: "red", fontSize: "12px" }}>To Date cannot be less than From Date</p>}
                                                {/* </th> */}
                                                <div className='row'>
                                                    <th scope="col-1" className="p-0 " style={{ marginTop: "10px", marginLeft: "22px", marginBottom: "5px" }}>
                                                        <button type="button" style={{ width: '130px', backgroundColor: "rgba(40,116,166,1)", color: "white" }} disabled={this.state.dateError === true ? true : false} className="btn pl-3 pr-3" onClick={this.setLAPreference}>{t('Apply')}</button>
                                                    </th>
                                                </div>

                                            </div>
                                        </tr>
                                    </thead>
                                </table>
                            </div>
                            <div className='row' style={{ marginTop: "5px" }}>
                                <div className='col'>
                                    <div className='tab-content'>
                                        <div id="myEarning-details" className="register-form tab-pane fade show active" style={{ cursor: "default" }}>
                                            {this.state.LAPreference == "" ?
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
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('Start Date')}</Th>
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('End Date')}</Th>
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('Total Investment')}</Th>
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('Balance To Invest')}</Th>
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('Status')}</Th>

                                                                </Tr>
                                                            </Thead>
                                                            <Tbody>
                                                                {this.state.LAPreference.map((LPreference, index) => (
                                                                    <Tr key={index} style={{
                                                                        marginBottom: "-10px", transition: 'none', cursor: 'default', color: "rgba(5,54,82,1)",
                                                                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", backgroundColor: (index % 2 === 0) ? 'rgba(255,255,255,1)' : 'rgba(242,242,242,1)'
                                                                    }}>
                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}>{LPreference.startdate}</Td>
                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}>{LPreference.enddate}</Td>
                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}>₹ {parseFloat(LPreference.maxtotalinvest).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</Td>
                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}>₹ {parseFloat(LPreference.balanceautoinvest).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</Td>
                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left" }}
                                                                            onClick={this.setLAPreferenceStatus.bind(this, LPreference.preferenceno, LPreference.enablestatus)}>
                                                                            <BootstrapSwitchButton
                                                                                checked={LPreference.enablestatus == 1 ? true : false}
                                                                                onlabel='Active'
                                                                                offlabel='Inactive'
                                                                                onstyle="primary"
                                                                                offstyle="secondary"
                                                                                width={90}
                                                                                height={20}
                                                                                borderRadius={30}

                                                                            />


                                                                        </Td>
                                                                    </Tr>
                                                                ))}
                                                            </Tbody>
                                                        </Table>
                                                        &nbsp;
                                                        {this.state.LAPreference.length > 1 &&
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
                                                </>}
                                        </div>
                                    </div>
                                </div>
                            </div>


                        </div>
                    </div>

                    {/* Inputs */}
                    {/* <div className='row' style={{ width: "91.5%", marginLeft: "10px" }}>
                        <table className="card" id='filterCard' style={{ marginLeft: "40px" }}>
                            <thead>
                                <tr>
                                    <div id="one" style={{ color: "rgba(5,54,82,1)" }}>
                                        <th scope="col-1" className="p-0" >
                                            <div className="form-group m-2">
                                                <label htmlFor="type" style={{ fontSize: "14px", marginLeft: "1px" }}>{t('Start Date*')}</label>
                                                <div>
                                                    <input
                                                        type="date"
                                                        name="start"
                                                        onChange={this.startdate} defaultValue={this.state.dfrday}
                                                        style={{
                                                            border: "1px solid rgba(40,116,166,1)",
                                                            width: "130px",
                                                            fontSize: "14px",
                                                            height: "35px",
                                                            borderRadius: "5px"
                                                        }}
                                                    />

                                                </div>
                                            </div>
                                        </th>
                                        <th scope="col-1" className="p-0">
                                            <div className="form-group m-2">
                                                <label htmlFor="sort" style={{ fontSize: "14px", marginLeft: "1px" }}>{t('End Date*')}</label>
                                                <div>
                                                    <input
                                                        type="date"
                                                        name="start"
                                                        onChange={this.enddate} defaultValue={this.state.dtoday}
                                                        style={{
                                                            border: "1px solid rgba(40,116,166,1)",
                                                            width: "130px",
                                                            fontSize: "14px",
                                                            height: "35px",
                                                            borderRadius: "5px"
                                                        }}
                                                    />
                                                </div>

                                            </div>
                                        </th>
                                        <th scope="col-1" className="p-0 ">
                                            <div className="form-group m-2">
                                                <label htmlFor="sort" style={{ fontSize: "14px", marginLeft: "1px" }}>{t('Minimum Amount*')}</label>
                                                <div>
                                                    <input id="pan" type="number" onChange={this.minimumamt} className="" placeholder="Min Amount"
                                                        style={{
                                                            border: "1px solid rgba(40,116,166,1)",
                                                            width: "130px",
                                                            fontSize: "14px",
                                                            height: "35px",
                                                            borderRadius: "5px"
                                                        }} />
                                                </div>

                                            </div>
                                        </th>
                                        <th scope="col-1" className="p-0">
                                            <div className="form-group m-2">
                                                <label htmlFor="risk" id='wraplabel1' style={{ fontSize: "14px", marginLeft: "1px" }}>{t('Maximum Amount*')}</label>
                                                <div>
                                                    <input id="pan" type="number" onChange={this.maximumamt} className="" placeholder="Max Amount"
                                                        style={{
                                                            border: "1px solid rgba(40,116,166,1)",
                                                            width: "130px",
                                                            fontSize: "14px",
                                                            height: "35px",
                                                            borderRadius: "5px"
                                                        }} />
                                                </div>
                                            </div>
                                        </th>

                                        <th scope="col-1" className="p-0">
                                            <div className="form-group m-2">
                                                <label htmlFor="prod" style={{ fontSize: "14px", marginLeft: "1px" }}>{t('Total Amount*')}</label>
                                                <div>
                                                    <input id="pan" type="number" onChange={this.totalamt} className="" placeholder="Total Amount"
                                                        style={{
                                                            border: "1px solid rgba(40,116,166,1)",
                                                            width: "130px",
                                                            fontSize: "14px",
                                                            height: "35px",
                                                            borderRadius: "5px"
                                                        }} />
                                                </div>

                                            </div>
                                        </th>
                                        <th scope="col-1" className="p-0">
                                            <div className="form-group m-2">
                                                <label htmlFor="sort" style={{ fontSize: "14px", marginLeft: "1px" }}>{t('Preference Type*')}</label>
                                                <select className="form-select" onChange={this.preference} style={{ border: "1px solid rgba(40,116,166,1)", width: '130px', fontSize: "14px" }}>
                                                    <option>{t('Select Preference')}</option>
                                                    <option value="1">{t('1')}</option>
                                                    <option value="2">{t('2')}</option>
                                                    <option value="3">{t('3')}</option>
                                                </select>
                                            </div>
                                        </th>

                                        <th scope="col-1" className="p-0 " style={{ marginTop: "10px", marginLeft: "9px", marginBottom: "5px" }}>
                                            {this.state.dateError && <p className="text-danger">To Date cannot be less than From Date</p>}
                                        </th>
                                        <div className='row'>
                                            <th scope="col-1" className="p-0 " style={{ marginTop: "10px", marginLeft: "9px", marginBottom: "5px" }}>
                                                <button type="button" style={{ width: '130px', backgroundColor: "rgba(40,116,166,1)", color: "white" }} disabled={this.state.dateError === true ? true : false} className="btn pl-3 pr-3" onClick={this.setLAPreference}>{t('Apply')}</button>
                                            </th>
                                        </div>

                                    </div>
                                </tr>
                            </thead>
                        </table>
                    </div> */}
                    {/* Lists */}
                    {/* <div className="row" id='AutoCard' style={{ width: "91.5%", marginLeft: "25px" }}>

                        {
                            this.state.LAPreference == "" ? "" :
                                <div className="card" style={{ cursor: "default" }}>
                                    <Table style={{ marginTop: "20px", marginBottom: "20px" }}>

                                        <Thead>

                                            <Tr>
                                                <Th style={{ color: "rgba(5,54,82,1)", font: "18px", fontWeight: "bold" }}>Start Date</Th>
                                                <Th style={{ color: "rgba(5,54,82,1)", font: "18px", fontWeight: "bold" }}>End Date</Th>
                                                <Th style={{ color: "rgba(5,54,82,1)", font: "18px", fontWeight: "bold" }}>Total Investment</Th>
                                                <Th style={{ color: "rgba(5,54,82,1)", font: "18px", fontWeight: "bold" }}>Balance To Invest</Th>
                                                <Th style={{ color: "rgba(5,54,82,1)", font: "18px", fontWeight: "bold" }}>Status</Th>
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {
                                                this.state.LAPreference.map((LPreference, index) => {
                                                    return (
                                                        <Tr key={index}
                                                            style={{ marginTop: "-20px", borderLeft: (LPreference.enablestatus == 1) ? "6px solid rgb(0, 121, 191)" : "6px solid #6c757d", backgroundColor: (index % 2 == 0) ? 'rgba(255,255,255,1)' : 'rgba(242,242,242,1)' }}>
                                                            <Td style={{ color: "rgba(5,54,82,1)", font: "18px", textAlign: "left", paddingTop: "10px" }}>{LPreference.startdate}</Td>
                                                            <Td style={{ color: "rgba(5,54,82,1)", font: "18px", textAlign: "left", paddingTop: "10px" }}>{LPreference.enddate}</Td>
                                                            <Td style={{ color: "rgba(5,54,82,1)", font: "18px", textAlign: "left", paddingTop: "10px" }}>₹ {parseFloat(LPreference.maxtotalinvest).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</Td>
                                                            <Td style={{ color: "rgba(5,54,82,1)", font: "18px", textAlign: "left", paddingTop: "10px" }}>₹ {parseFloat(LPreference.balanceautoinvest).toFixed(2).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}</Td>
                                                            <Td style={{ paddingTop: "6px" }} onClick={this.setLAPreferenceStatus.bind(this, LPreference.preferenceno, LPreference.enablestatus)}>
                                                                <BootstrapSwitchButton
                                                                    checked={LPreference.enablestatus == 1 ? true : false}
                                                                    onlabel='Active'
                                                                    offlabel='Inactive'
                                                                    onstyle="primary"
                                                                    offstyle="secondary"
                                                                    width={90}
                                                                    height={20}
                                                                    borderRadius={30}

                                                                />
                                                            </Td>
                                                        </Tr>
                                                    )
                                                })
                                            }
                                        </Tbody>
                                    </Table>
                                </div>
                        }

                    </div> */}

                </div>
            </div>
        )
    }
}

export default withTranslation()(AutoInvestment)
