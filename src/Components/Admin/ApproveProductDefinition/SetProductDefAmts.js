import React, { Component } from 'react';
import $ from 'jquery';
import { BASEURL } from '../../assets/baseURL';
import AdminSidebar from '../AdminSidebar';
import { withTranslation } from 'react-i18next';
import { FaPlus } from "react-icons/fa";
import { FaCheckCircle, FaTimesCircle, FaAngleLeft, FaThumbsUp, FaRegUser, FaEdit, FaMapMarkerAlt, FaHouseUser, FaUserEdit } from "react-icons/fa";
import dashboardIcon from '../../assets/icon_dashboard.png';
import { Link } from 'react-router-dom';
import Multiselect from 'multiselect-react-dropdown';
import * as FaIcons from "react-icons/fa";

export class SetProductDefAmts extends Component {

    constructor(props) {
        super(props)

        this.state = {
            productid: "",
            defloanamt: "",
            maxloanamt: "",
            minloanamt: "",
            loanamtmultiple: "",
            multipledisbursals: "",
            topup: "",
        }

    }

    prodId = (event) => {
        this.setState({ productid: event.target.value.toLocaleUpperCase() })
    }
    defloanamt = (event) => {
        this.setState({ defloanamt: event.target.value })
    }
    maximumloanAmt = (event) => {
        this.setState({ maxloanamt: event.target.value })
    }
    minimumloanamt = (event) => {
        this.setState({ minloanamt: event.target.value })
    }
    loanAmtmultiple = (event) => {
        this.setState({ loanamtmultiple: event.target.value })
    }
    multipledisbursals = (event) => {
        this.setState({ multipledisbursals: event.target.value })
    }
    topup = (event) => {
        this.setState({ topup: event.target.value })
    }
    setProductDefAmt = () => {
        fetch(BASEURL + `/lms/setproductdefamtinfo`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                productid: this.state.productid,
                defloanamt: this.state.defloanamt,
                maxloanamt: this.state.maxloanamt,
                minloanamt: this.state.minloanamt,
                loanamtmultiple: this.state.loanamtmultiple,
                multipledisbursals: this.state.multipledisbursals,
                topup: this.state.topup
            })
        }).then(response => {
            console.log(response)
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata)
                if (resdata.status == 'Success') {
                    console.log(resdata.msgdata)
                    alert(resdata.message);
                    window.location = "/productAttributes";
                } else {
                    alert("Issue: " + resdata.message);
                    window.location.reload();
                }
            })
            .catch(err => {
                console.log(err.message)
            })
    }
    cancelProductDefAmt = () => {
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
            <div className="container-dashboard d-flex flex-row" id="wrapper" style={{backgroundColor:"#f4f7fc"}}>
                <AdminSidebar />
                <div className="pl-3 pr-3 main-content" id="page-content-wrapper">
                    <div className="container-fluid row pt-2">
                        <div className="col-1" id="prodAmtRef1">
                            <button style={{ marginLeft: "25px" }} onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className='col-8' id="prodAmtRef2" style={{ marginLeft: "20px", marginTop: "5px" }}>
                            <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                <Link to="/landing">Home</Link> / <Link to="/productAttributes">Product List</Link> / <Link to="/productAttributes">Product Attribute</Link> / Set Product Definition Amount </p>
                        </div>
                        <div className='col'>

                        </div>

                        <div className="col" id="prodAmtRef3">
                            <button style={myStyle}>
                                <Link to="/productAttributes" style={{ marginLeft: "10px" }}><FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} /><span style={{ textDecoration: "none", color: "white" }}>Back</span></Link></button>
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
                                                    <p className="text-white" style={{ paddingBottom: "6px", fontWeight: "600" }}>Set Product Definition Amount</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-4">
                                                <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Product ID')}</p>
                                                <input type="text" className="form-control" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px", textTransform: 'uppercase' }}
                                                    id="inputAddress" placeholder={t('Enter Product ID')} onChange={this.prodId}
                                                />
                                            </div>
                                            <div className="form-group col-md-4">
                                                <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Default Loan Amount')}</p>
                                                <input type="number" className="form-control" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}
                                                    id="inputAddress" placeholder={t('Enter Loan Amount')} onChange={this.defloanamt}
                                                />
                                            </div>
                                            <div className="form-group col-md-4">
                                                <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Maximum Loan Amount')}</p>
                                                <input type="number" className="form-control" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}
                                                    id="inputAddress" placeholder={t('Maximum Loan Amount')} onChange={this.maximumloanAmt}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-4">
                                                <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Minimum Loan Amount')}</p>
                                                <input type="number" className="form-control" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}
                                                    id="inputAddress" placeholder={t('Minimum Loan Amount')} onChange={this.minimumloanamt}
                                                />
                                            </div>
                                            <div className="form-group col-md-4">
                                                <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Loan Amount Multiple')}</p>
                                                <input type="number" className="form-control" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}
                                                    id="inputAddress" placeholder={t('Loan Amount Multiple')} onChange={this.loanAmtmultiple}
                                                />
                                            </div>
                                            <div className="form-group col-md-4">
                                                <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Multiple Disbursals')}</p>
                                                <select id="inputState" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }} className="form-select" onChange={this.multipledisbursals} >
                                                    <option defaultValue>Select</option>
                                                    <option value="1">Yes</option>
                                                    <option value="0">No</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-4">
                                                <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Topup')}</p>
                                                <select id="inputState" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }} className="form-select" onChange={this.topup} >
                                                    <option defaultValue>Select</option>
                                                    <option value="1">Topup Not Allowed</option>
                                                    <option value="0">Topup Allowed</option>
                                                </select>

                                            </div>
                                        </div>
                                        <hr />
                                        <div className="form-row" style={{ textAlign: "center" }}>
                                            <div className="form-group col">
                                                <button type="button" className="btn mr-2 text-white btn-sm" style={{ backgroundColor: "rgb(136, 189, 72)", width: "90px" }}
                                                    onClick={this.setProductDefAmt}  >Submit</button>
                                                <button type="button" className="btn text-white btn-sm" style={{ backgroundColor: "#0079BF", width: "90px" }}
                                                    onClick={this.cancelProductDefAmt}>{t('Cancel')}</button>
                                            </div>
                                        </div>
                                        {/* <div className='form-group'>
                                            

                                            <div className="row item-list align-items-center">
                                                <div className="group col">
                                                    <div className='row'>
                                                        <div className='col-4'>
                                                            <p htmlFor="s" className="label" style={{ fontWeight: "bold", color: "rgba(5,54,82,1)" }} >{t('Product ID')} </p>
                                                        </div>
                                                        <div className='col-8'>
                                                            <input type='text' className='form-control border border-secondary' style={{ textTransform: 'uppercase' }} placeholder={t('Product ID')} onChange={this.prodId} />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="group col">
                                                    <div className='row'>
                                                        <div className='col-4'>
                                                            <p htmlFor="s" className="label" style={{ fontWeight: "bold", color: "rgba(5,54,82,1)" }} >{t('Default Loan Amount')} </p>
                                                        </div>
                                                        <div className='col-8'>
                                                            <input type='number' className='form-control border border-secondary' placeholder={t('Default Loan Amount')} onChange={this.defloanamt} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            &nbsp;
                                            
                                            <div className="row item-list align-items-center">
                                                <div className="group col">
                                                    <div className='row'>
                                                        <div className='col-4'>
                                                            <p htmlFor="s" className="label" style={{ fontWeight: "bold", color: "rgba(5,54,82,1)" }} >{t('Maximum Loan Amount')} </p>
                                                        </div>
                                                        <div className='col-8'>
                                                            <input type='number' className='form-control border border-secondary' placeholder={t('Maximum Loan Amount')} onChange={this.maximumloanAmt} />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="group col">
                                                    <div className='row'>
                                                        <div className='col-4'>
                                                            <p htmlFor="s" className="label" style={{ fontWeight: "bold", color: "rgba(5,54,82,1)" }} >{t('Minimum Loan Amount')} </p>
                                                        </div>
                                                        <div className='col-8'>
                                                            <input type='number' className='form-control border border-secondary' placeholder={t('Minimum Loan Amount')} onChange={this.minimumloanamt} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="row item-list align-items-center">
                                                <div className="group col">
                                                    <div className='row'>
                                                        <div className='col-4'>
                                                            <p htmlFor="s" className="label" style={{ fontWeight: "bold", color: "rgba(5,54,82,1)" }} >{t('Loan Amount Multiple')} </p>
                                                        </div>
                                                        <div className='col-8'>
                                                            <input type='number' className='form-control border border-secondary' placeholder='Loan Amount Multiple' onChange={this.loanAmtmultiple} />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="group col">
                                                    <div className='row'>
                                                        <div className='col-4'>
                                                            <p htmlFor="s" className="label" style={{ fontWeight: "bold", color: "rgba(5,54,82,1)" }} >{t('Multiple Disbursals')} </p>
                                                        </div>
                                                        <div className='col-8'>
                                                            <select className="form-select border border-secondary" onChange={this.multipledisbursals} style={{ marginTop: "-5px", color: "RGBA(5,54,82,1)" }} >
                                                                <option defaultValue>------------------Select------------------</option>
                                                                <option value="1">Yes</option>
                                                                <option value="0">No</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>

                                           
                                            <div className="row item-list align-items-center">
                                                <div className="group col">
                                                    <div className='row'>
                                                        <div className='col-4'>
                                                            <p htmlFor="s" className="label" style={{ fontWeight: "bold", color: "rgba(5,54,82,1)" }} >{t('Topup')} </p>
                                                        </div>
                                                        <div className='col-8'>
                                                            <select className="form-select border border-secondary" onChange={this.topup} style={{ marginTop: "-5px", color: "RGBA(5,54,82,1)" }} >
                                                                <option defaultValue>------------------Select------------------</option>
                                                                <option value="1">Topup Not Allowed</option>
                                                                <option value="0">Topup Allowed</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="group col">
                                                    <div className='row'>
                                                        <div className='col-4'>

                                                        </div>
                                                        <div className='col-8'>

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            
                                            <div className='row'>
                                                <div className="group pt-2" style={{ textAlign: "end" }}>
                                                    <button className='btn btn-success' style={{ width: "100px" }} onClick={this.setProductDefAmt}>Submit</button> &nbsp;
                                                    <button className='btn btn-info' style={{ width: "100px" }} onClick={this.cancelProductDefAmt}>Cancel</button>
                                                </div>
                                            </div>
                                        </div> */}
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

export default withTranslation()(SetProductDefAmts)