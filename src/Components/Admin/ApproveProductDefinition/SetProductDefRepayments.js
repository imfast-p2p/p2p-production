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

export class SetProductDefRepayments extends Component {

    constructor(props) {
        super(props)

        this.state = {
            productid: "",
            repaymentfrequency: "",
            syncwithdisbursedate: "1",
            noofrepaymentsdefault: "3",
            minnoofrepayments: "",
            maxnoofrepayments: "",
            mindaysbeforefirstinst: "",
            allowvarinstallments: "",
            epimultiple: "1",
            partialprepaymentallowed: "",
            fullprepaymentallowed: ""
        }

    }

    componentDidMount() {

    }
    productid = (event) => {
        this.setState({ productid: event.target.value })
    }
    repaymentfrequency = (event) => {
        this.setState({ repaymentfrequency: event.target.value })
    }
    syncwithdisbursedate = (event) => {
        this.setState({ syncwithdisbursedate: event.target.value })
    }
    noofrepaymentsdefault = (event) => {
        this.setState({ noofrepaymentsdefault: event.target.value })
    }
    minnoofrepayments = (event) => {
        this.setState({ minnoofrepayments: event.target.value })
    }
    maxnoofrepayments = (event) => {
        this.setState({ maxnoofrepayments: event.target.value })
    }
    mindaysbeforefirstinst = (event) => {
        this.setState({ mindaysbeforefirstinst: event.target.value })
    }
    allowvarinstallments = (event) => {
        this.setState({ allowvarinstallments: event.target.value })
    }
    epimultiple = (event) => {
        this.setState({ epimultiple: event.target.value })
    }
    partialprepaymentallowed = (event) => {
        this.setState({ partialprepaymentallowed: event.target.value })
    }
    fullprepaymentallowed = (event) => {
        this.setState({ fullprepaymentallowed: event.target.value })
    }

    SetProductDefRepay = () => {
        fetch(BASEURL + `/lms/setproductdefrepaymentinfo`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                productid: this.state.productid,
                repaymentfrequency: this.state.repaymentfrequency,
                syncwithdisbursedate: this.state.syncwithdisbursedate,
                noofrepaymentsdefault: this.state.noofrepaymentsdefault,
                minnoofrepayments: this.state.minnoofrepayments,
                maxnoofrepayments: this.state.maxnoofrepayments,
                mindaysbeforefirstinst: this.state.mindaysbeforefirstinst,
                allowvarinstallments: this.state.allowvarinstallments,
                epimultiple: this.state.epimultiple,
                partialprepaymentallowed: this.state.partialprepaymentallowed,
                fullprepaymentallowed: this.state.fullprepaymentallowed,

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
                    window.location = '/productAttributes';
                } else {
                    alert("Issue: " + resdata.message);
                    window.location.reload();
                }
            })
            .catch(err => {
                console.log(err.message)
            })
    }

    cancelProductDefRepay = () => {
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
        const Style1 = {
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
            marginLeft: "14px",
            float: "right"
        }

        return (
            <div className="container-dashboard d-flex flex-row" id="wrapper"  style={{backgroundColor:"#f4f7fc"}}>
                <AdminSidebar />
                <div className="pl-3 pr-3 main-content" id="page-content-wrapper">
                    <div className="container-fluid row pt-2">
                        <div className="col-1" id="prodRepayRef1">
                            <button style={{ marginLeft: "25px" }} onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className='col-8' id="prodRepayRef2" style={{ marginLeft: "20px", marginTop: "5px" }}>
                            <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                <Link to="/landing">Home</Link> / <Link to="/productDefinitions">Product List</Link> / <Link to="/productAttributes">Product Attribute</Link> / Set Product Definition Repayment </p>
                        </div>
                        <div className='col'>

                        </div>

                        <div className="col" id="prodRepayRef3">
                            <button style={myStyle}>
                                <Link to="/productAttributes" style={{ marginLeft: "10px" }}><FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} /><span style={{ textDecoration: "none", color: "white" }}>Back</span></Link></button>
                        </div>

                    </div>
                    <hr className="col-11" style={{ marginLeft: "50px", width: "88.6%", backgroundColor: "rgba(4,78,160,1)" }} />

                    <div className="tab-content">
                        <div className="register-form tab-pane fade show active">
                            <div className='' >
                                <div className="card" style={{ cursor: 'default', marginLeft: "50px", width: "92%", overflow: "visible" }}>
                                    <div className="card-header border-1 bg-white">
                                        <div className='row' style={{ paddingLeft: "3px" }}>
                                            <div className='col-6' id='headingRef'>
                                                <div className="two__image" style={{ paddingLeft: "10px" }}>
                                                    <p className="text-white" style={{ paddingBottom: "6px", fontWeight: "600" }}>Set Product Definition Repayment</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-4">
                                                <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Product ID')}</p>
                                                <input type="text" className="form-control" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px", textTransform: 'uppercase' }}
                                                    id="inputAddress" placeholder={t('Enter Product ID')} onChange={this.productid}
                                                />
                                            </div>
                                            <div className="form-group col-md-4">
                                                <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Repayment frequency')}</p>
                                                <input type="text" className="form-control" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}
                                                    id="inputAddress" placeholder={t('Repayment frequency')} onChange={this.repaymentfrequency}
                                                />
                                            </div>
                                            <div className="form-group col-md-4">
                                                <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Sync with disburse date')}</p>
                                                <select className="form-select" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }} onChange={this.syncwithdisbursedate}>
                                                    <option defaultValue>Select</option>
                                                    <option value="1">1</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-4">
                                                <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('No of repayments default')}</p>
                                                <input type="number" className="form-control" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}
                                                    id="inputAddress" value={this.state.noofrepaymentsdefault} placeholder={t('No of repayments default')} onChange={this.noofrepaymentsdefault}
                                                />
                                            </div>
                                            <div className="form-group col-md-4">
                                                <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Min no of repayments')}</p>
                                                <input type="number" className="form-control" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}
                                                    id="inputAddress" placeholder='Min no of repayments' onChange={this.minnoofrepayments}
                                                />
                                            </div>
                                            <div className="form-group col-md-4">
                                                <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Max no of repayments')}</p>
                                                <input type="number" className="form-control" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}
                                                    id="inputAddress" placeholder='Max no of repayments' onChange={this.maxnoofrepayments}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-4">
                                                <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Min days before first installment')}</p>
                                                <input type="number" className="form-control" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}
                                                    id="inputAddress" placeholder='Min days before first installment' onChange={this.mindaysbeforefirstinst}
                                                />
                                            </div>
                                            <div className="form-group col-md-4">
                                                <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Allow variable installments')}</p>
                                                < select className="form-select" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }} onChange={this.allowvarinstallments}>
                                                    <option defaultValue>Select</option>
                                                    <option value="1">Allow variable installments</option>
                                                    <option value="0">Not Allow variable installments</option>
                                                </select>
                                            </div>
                                            <div className="form-group col-md-4">
                                                <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Epi multiple')}</p>
                                                < select className="form-select" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }} onChange={this.epimultiple} >
                                                    <option defaultValue>Select</option>
                                                    <option value="1">1</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-4">
                                                <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Partial pre payment allowed')}</p>
                                                < select className="form-select" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }} onChange={this.partialprepaymentallowed} >
                                                    <option defaultValue>Select</option>
                                                    <option value="1">Allow partial prepayments</option>
                                                    <option value="0">Not allow partial prepayments</option>
                                                </select>
                                            </div>
                                            <div className="form-group col-md-4">
                                                <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Full pre payment allowed')}</p>
                                                < select className="form-select" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }} onChange={this.fullprepaymentallowed}>
                                                    <option defaultValue>Select</option>
                                                    <option value="1">Allow partial prepayments</option>
                                                    <option value="0">Not allow full prepayments</option>
                                                </select>
                                            </div>
                                            
                                        </div>
                                        <hr />
                                        <div className="form-row" style={{ textAlign: "center" }}>
                                            <div className="form-group col">
                                                <button type="button" className="btn mr-2 text-white btn-sm" style={{ backgroundColor: "rgb(136, 189, 72)", width: "90px" }}
                                                    onClick={this.SetProductDefRepay}  >Submit</button>
                                                <button type="button" className="btn text-white btn-sm" style={{ backgroundColor: "#0079BF", width: "90px" }}
                                                    onClick={this.cancelProductDefRepay}>{t('Cancel')}</button>
                                            </div>
                                        </div>
                                    </div>
                                        {/* <div className="card-header border-0">
                                            <div className='form-group'>

                                                <div className="row item-list align-items-center">
                                                    <div className="group col">
                                                        <div className='row'>
                                                            <div className='col-4'>
                                                                <p htmlFor="s" className="label" style={{ fontWeight: "bold", color: "rgba(5,54,82,1)" }} >{t('Product ID')} </p>
                                                            </div>
                                                            <div className='col-8'>
                                                                <input type='text' className='form-control border border-secondary' style={{ textTransform: 'uppercase' }} placeholder={t('Product ID')} onChange={this.productid} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="group col">
                                                        <div className='row'>
                                                            <div className='col-4'>
                                                                <p htmlFor="s" className="label" style={{ fontWeight: "bold", color: "rgba(5,54,82,1)" }} >{t('Repayment frequency')} </p>
                                                            </div>
                                                            <div className='col-8'>
                                                                <input type='text' className='form-control border border-secondary' placeholder={t('Repayment frequency')} onChange={this.repaymentfrequency} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                &nbsp;

                                                <div className="row item-list align-items-center">
                                                    <div className="group col">
                                                        <div className='row'>
                                                            <div className='col-4'>
                                                                <p htmlFor="s" className="label" style={{ fontWeight: "bold", color: "rgba(5,54,82,1)" }} >{t('Sync with disburse date')} </p>
                                                            </div>
                                                            <div className='col-8'>
                                                                <select className="form-select border border-secondary" onChange={this.syncwithdisbursedate} style={{ marginTop: "-5px", color: "RGBA(5,54,82,1)" }} >
                                                                    <option defaultValue>------------------Select------------------</option>
                                                                    <option value="1">1</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="group col">
                                                        <div className='row'>
                                                            <div className='col-4'>
                                                                <p htmlFor="s" className="label" style={{ fontWeight: "bold", color: "rgba(5,54,82,1)" }} >{t('No of repayments default')} </p>
                                                            </div>
                                                            <div className='col-8'>
                                                                <input type='number' className='form-control border border-secondary'
                                                                    value={this.state.noofrepaymentsdefault} placeholder={t('No of repayments default')} onChange={this.noofrepaymentsdefault} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="row item-list align-items-center">
                                                    <div className="group col">
                                                        <div className='row'>
                                                            <div className='col-4'>
                                                                <p htmlFor="s" className="label" style={{ fontWeight: "bold", color: "rgba(5,54,82,1)" }} >{t('Min no of repayments')} </p>
                                                            </div>
                                                            <div className='col-8'>
                                                                <input type='number' className='form-control border border-secondary' placeholder='Min no of repayments'
                                                                    onChange={this.minnoofrepayments} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="group col">
                                                        <div className='row'>
                                                            <div className='col-4'>
                                                                <p htmlFor="s" className="label" style={{ fontWeight: "bold", color: "rgba(5,54,82,1)" }} >{t('Max no of repayments')} </p>
                                                            </div>
                                                            <div className='col-8'>
                                                                <input type='number' className='form-control border border-secondary' placeholder='Max no of repayments'
                                                                    onChange={this.maxnoofrepayments} />
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>


                                                <div className="row item-list align-items-center">
                                                    <div className="group col">
                                                        <div className='row'>
                                                            <div className='col-4'>
                                                                <p htmlFor="s" className="label" style={{ fontWeight: "bold", color: "rgba(5,54,82,1)" }} >{t('Min days before first installment')} </p>
                                                            </div>
                                                            <div className='col-8'>
                                                                <input type='number' className='form-control border border-secondary' placeholder='Min days before first installment'
                                                                    onChange={this.mindaysbeforefirstinst} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="group col">
                                                        <div className='row'>
                                                            <div className='col-4'>
                                                                <p htmlFor="s" className="label" style={{ fontWeight: "bold", color: "rgba(5,54,82,1)" }} >{t('Allow variable installments')} </p>
                                                            </div>
                                                            <div className='col-8'>
                                                                <select className="form-select border border-secondary" onChange={this.allowvarinstallments} style={{ marginTop: "-5px", color: "RGBA(5,54,82,1)" }} >
                                                                    <option defaultValue>------------------Select------------------</option>
                                                                    <option value="1">Allow variable installments</option>
                                                                    <option value="0">Not Allow variable installments</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="row item-list align-items-center">
                                                    <div className="group col">
                                                        <div className='row'>
                                                            <div className='col-4'>
                                                                <p htmlFor="s" className="label" style={{ fontWeight: "bold", color: "rgba(5,54,82,1)" }} >{t('Epi multiple')} </p>
                                                            </div>
                                                            <div className='col-8'>
                                                                <select className="form-select border border-secondary" onChange={this.epimultiple} style={{ marginTop: "-5px", color: "RGBA(5,54,82,1)" }} >
                                                                    <option defaultValue>------------------Select------------------</option>
                                                                    <option value="1">1</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="group col">
                                                        <div className='row'>
                                                            <div className='col-4'>
                                                                <p htmlFor="s" className="label" style={{ fontWeight: "bold", color: "rgba(5,54,82,1)" }} >{t('Partial pre payment allowed')} </p>
                                                            </div>
                                                            <div className='col-8'>
                                                                <select className="form-select border border-secondary" onChange={this.partialprepaymentallowed} style={{ marginTop: "-5px", color: "RGBA(5,54,82,1)" }} >
                                                                    <option defaultValue>------------------Select------------------</option>
                                                                    <option value="1">Allow partial prepayments</option>
                                                                    <option value="0">Not allow partial prepayments</option>
                                                                </select>

                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="row item-list align-items-center">
                                                    <div className="group col">
                                                        <div className='row'>
                                                            <div className='col-4'>
                                                                <p htmlFor="s" className="label" style={{ fontWeight: "bold", color: "rgba(5,54,82,1)" }} >{t('Full pre payment allowed')} </p>
                                                            </div>
                                                            <div className='col-8'>
                                                                <select className="form-select border border-secondary" onChange={this.fullprepaymentallowed} style={{ marginTop: "-5px", color: "RGBA(5,54,82,1)" }} >
                                                                    <option defaultValue>------------------Select------------------</option>
                                                                    <option value="1">Allow partial prepayments</option>
                                                                    <option value="0">Not allow full prepayments</option>
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
                                                        <button className='btn btn-success' style={{ width: "100px" }} onClick={this.SetProductDefRepay}>Submit</button> &nbsp;
                                                        <button className='btn btn-info' style={{ width: "100px" }} onClick={this.cancelProductDefRepay}>Cancel</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div> */}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        )
    }
}

export default withTranslation()(SetProductDefRepayments)