import React, { Component } from 'react';
import $ from 'jquery';
import { BASEURL } from '../../../assets/baseURL';
import SystemUserSidebar from '../../SystemUserSidebar';
import { withTranslation } from 'react-i18next';
import { FaPlus } from "react-icons/fa";
import { FaCheckCircle, FaTimesCircle, FaAngleLeft, FaThumbsUp, FaRegUser, FaEdit, FaMapMarkerAlt, FaHouseUser, FaUserEdit } from "react-icons/fa";
import dashboardIcon from '../../../assets/icon_dashboard.png';
import { Link } from 'react-router-dom';
import Multiselect from 'multiselect-react-dropdown';
import * as FaIcons from "react-icons/fa";
import { confirmAlert } from "react-confirm-alert";

var fundisActive = "0";
export class SetProductDefFund extends Component {
    constructor(props) {
        super(props)

        this.state = {
            productid: sessionStorage.getItem("productID"),
            maxfundingcommit: "",
            minfundingcommit: "",
            minautofundingcommit: "",
            fundinginmultiplesof: "",
            maxfundinginvestor: "",
            autoinvestlimit: "",

            maxfundCommflag: false,
            minfundCommflag: false,
            autoinvestflag: false,
        }
    }
    componentDidMount() {
        if(sessionStorage.getItem("defFund")){
            fundisActive = sessionStorage.getItem("defFund");
        }
        this.getProductDefFundinginfo()
    }
    getProductDefFundinginfo = () => {
        fetch(BASEURL + `/lms/getproductdeffundinginfo?productid=` + sessionStorage.getItem('productID') +
            '&productname=' + sessionStorage.getItem("prodName") + '&isactive=' + fundisActive, {
            method: 'GET',
            headers: {
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            }
        })
            .then(response => {
                console.log('Response:', response)
                return response.json();
            })
            .then((resdata) => {
                console.log(resdata)
                if (resdata.status === 'SUCCESS') {
                    console.log(resdata.msgdata)
                    this.setState({ maxfundinginvestor: resdata.msgdata.maxfundinginvestor })
                    this.setState({ autoinvestlimit: resdata.msgdata.autoinvestlimit })
                    this.setState({ maxfundingcommit: resdata.msgdata.maxfundingcommit })
                    this.setState({ minfundingcommit: resdata.msgdata.minfundingcommit })
                    this.setState({ minautofundingcommit: resdata.msgdata.minautofundingcommit })
                    this.setState({ fundinginmultiplesof: resdata.msgdata.fundinginmultiplesof })
                } else {
                    //alert("Issue: " + resdata.message);
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
                        // confirmAlert({
                        //     message: resdata.message,
                        //     buttons: [
                        //         {
                        //             label: "OK",
                        //             onClick: () => {
                        //             },
                        //         },
                        //     ],
                        // });
                    }
                }
            })
    }
    prodId = (event) => {
        this.setState({ productid: event.target.value })
    }
    maxfundingcommit = (event) => {
        // var maxfund = /\b((100)|[1-9]\d?)\b/;
        // var eventmInput = event.target.value;
        // if (maxfund.test(eventmInput)) {
        //     console.log("passed")
        //     this.setState({ maxfundCommflag: false })
        //     this.setState({ maxfundingcommit: event.target.value })
        // } else {
        //     this.setState({ maxfundCommflag: true })
        //     document.getElementById('maxFund').value = ""
        // }
        this.setState({ maxfundingcommit: event.target.value })

    }
    minfundingcommit = (event) => {
        this.setState({ minfundingcommit: event.target.value })
    }
    minautofundingcommit = (event) => {
        this.setState({ minautofundingcommit: event.target.value })
    }
    fundinginmultiplesof = (event) => {
        this.setState({ fundinginmultiplesof: event.target.value })
    }
    maxfundinginvestor = (event) => {
        this.setState({ maxfundinginvestor: event.target.value })
    }
    autoinvestlimit = (event) => {
        this.setState({ autoinvestlimit: event.target.value })
    }

    setProductDefFund = () => {
        var pID = this.state.productid;
        var one = this.state.maxfundingcommit
        var tw = this.state.minfundingcommit;
        var th = this.state.minautofundingcommit;
        var fo = this.state.fundinginmultiplesof;
        var fiv = this.state.maxfundinginvestor;
        var six = this.state.autoinvestlimit;

        if (pID == "" ||
            one == "" ||
            tw == "" ||
            th == "" ||
            fo == "" ||
            fiv == "" ||
            six == "") {
            confirmAlert({
                message: "Invalid inputs.",
                buttons: [
                    {
                        label: "OK",
                        onClick: () => {

                        },
                    },
                ],
            });
        } else {
            fetch(BASEURL + `/lms/setproductdeffundinginfo`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer " + sessionStorage.getItem('token')
                },
                body: JSON.stringify({
                    productid: this.state.productid,
                    maxfundingcommit: this.state.maxfundingcommit,
                    minfundingcommit: this.state.minfundingcommit,
                    minautofundingcommit: this.state.minautofundingcommit,
                    fundinginmultiplesof: this.state.fundinginmultiplesof,
                    maxfundinginvestor: this.state.maxfundinginvestor,
                    autoinvestlimit: this.state.autoinvestlimit,
                    productname: sessionStorage.getItem("prodName"),
                    isedited: "1"
                })
            }).then(response => {
                console.log(response)
                return response.json();
            })
                .then((resdata) => {
                    console.log(resdata)
                    if (resdata.status == 'Success') {
                        console.log(resdata.msgdata)
                        // alert(resdata.message);
                        // window.location = "/productAttribute";
                        confirmAlert({
                            message: resdata.message,
                            buttons: [
                                {
                                    label: "OK",
                                    onClick: () => {
                                        window.location = '/productAttribute';
                                    },
                                },
                            ],
                        });
                    } else {
                        confirmAlert({
                            message: resdata.message,
                            buttons: [
                                {
                                    label: "OK",
                                    onClick: () => {
                                        // window.location.reload();
                                    },
                                },
                            ],
                        });
                    }
                })
                .catch(err => {
                    console.log(err.message)
                })
        }
    }
    cancelProductDefFund = () => {
        window.location.reload();
    }


    handleChange() {
        $('.text').toggle();
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
            <div className="container-dashboard d-flex flex-row" id="wrapper" style={{ backgroundColor: "#f4f7fc" }}>
                <SystemUserSidebar />
                <div className="pl-3 pr-3 main-content" id="page-content-wrapper">
                    <div className="container-fluid row pt-2">
                        <div className="col-1" id="prodFundRef1">
                            <button style={{ marginLeft: "25px" }} onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className='col-8' id="prodFundRef2" style={{ marginLeft: "20px", marginTop: "5px" }}>
                            <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                <Link to="/sysUserDashboard">Home</Link> / <Link to="/productDefinition">Product List</Link> / <Link to="/productAttribute">Product Attribute</Link> / Set Product Definition Funding </p>
                        </div>
                        <div className='col'>

                        </div>

                        <div className="col" id="prodFundRef3">
                            <button style={myStyle}>
                                <Link to="/productAttribute" style={{ marginLeft: "10px" }}><FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} /><span style={{ textDecoration: "none", color: "white" }}>Back</span></Link></button>
                        </div>

                    </div>
                    <hr className="col-11" style={{ marginLeft: "50px", width: "88.6%", backgroundColor: "rgba(4,78,160,1)", marginTop: "0px" }} />

                    <div className="tab-content">
                        <div className="register-form tab-pane fade show active">
                            <div className='' >
                                <div className="card" style={{ cursor: 'default', marginLeft: "50px", width: "92%", overflow: "visible" }}>
                                    <div className="card-header border-1 bg-white">
                                        <div className='row' style={{ paddingLeft: "3px" }}>
                                            <div className='col-6' id='headingRef'>
                                                <div className="two__image" style={{ paddingLeft: "10px" }}>
                                                    <p className="text-white" style={{ paddingBottom: "6px", fontWeight: "600" }}>Set Product Definition Funding</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-4">
                                                <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Product ID *')}</p>
                                                <input type="text" className="form-control" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px", textTransform: 'uppercase' }}
                                                    id="inputAddress" placeholder={t('Enter Product ID')} value={this.state.productid} readOnly
                                                />
                                            </div>
                                            <div className="form-group col-md-4">
                                                <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Maximum Funding Commit *')}</p>
                                                <input type="number" className="form-control" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}
                                                    id="maxFund" placeholder={t('Enter Percentage(1-100)')} onChange={this.maxfundingcommit} value={this.state.maxfundingcommit}
                                                />
                     
                                            </div>
                                            <div className="form-group col-md-4">
                                                <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Minimum Funding Commit *')}</p>
                                                <input type="number" className="form-control" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}
                                                    id="minFund" placeholder={t('Enter Percentage(1-100)')} onChange={this.minfundingcommit} value={this.state.minfundingcommit}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-4">
                                                <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Minimum Auto-Funding Commit *')}</p>
                                                <input type="number" className="form-control" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}
                                                    id="minAutoFund" placeholder={t('Enter Amount')} onChange={this.minautofundingcommit} value={this.state.minautofundingcommit}
                                                />
                                            </div>
                                            <div className="form-group col-md-4">
                                                <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Funding In Multiples Of *')}</p>
                                                <input type="number" className="form-control" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}
                                                    id="inputAddress" placeholder={t('Enter amount in multiples of')} onChange={this.fundinginmultiplesof} value={this.state.fundinginmultiplesof}
                                                />
                                            </div>
                                            <div className="form-group col-md-4">
                                                <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Maximum Funding Investor *')}</p>
                                                <input type="number" className="form-control" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}
                                                    id="inputAddress" placeholder={t('Enter Amount')} onChange={this.maxfundinginvestor} value={this.state.maxfundinginvestor}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-4">
                                                <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Auto Invest Limit *')}</p>
                                                <input type="number" className="form-control" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}
                                                    id="autoInvest" placeholder={t('Enter Percentage(1-100)')} onChange={this.autoinvestlimit} value={this.state.autoinvestlimit}
                                                />
                                                {/* {(this.state.autoinvestflag) ? <span className='text-danger'>Invalid Value</span> : ''} */}
                                            </div>
                                        </div>
                                        <hr />
                                        <div className="form-row" style={{ textAlign: "center" }}>
                                            <div className="form-group col">
                                                <button type="button" className="btn mr-2 text-white btn-sm" style={{ backgroundColor: "rgb(136, 189, 72)", width: "90px" }}
                                                    onClick={this.setProductDefFund}  >Submit</button>
                                                <button type="button" className="btn text-white btn-sm" style={{ backgroundColor: "#0079BF", width: "90px" }}
                                                    onClick={this.cancelProductDefFund}>{t('Cancel')}</button>
                                            </div>
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

export default withTranslation()(SetProductDefFund)