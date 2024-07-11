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

export class SetProductDefInterests extends Component {

    constructor(props) {
        super(props)

        this.state = {
            productid: "",
            interesttype: "VARIABLE",
            variableintbase: "Risk",
            interestcalmethod: "0",
            interestdiff: "0.00",
            interestrateperiod: "0",
            interestaccrualperiod: "0",
            interestmethod: "0",
            interestpostingfrequency: "",
            allowpartialperiodintcalc: "",
            penalintrate: "",
            overduegraceamt: "",
            teaserintrateallowed: "0",
            teaserinterestrate: "0",
        }

    }

    componentDidMount() {

    }
    productid = (event) => {
        this.setState({ productid: event.target.value })
    }
    interesttype = (event) => {
        this.setState({ interesttype: event.target.value })
    }
    variableintbase = (event) => {
        this.setState({ variableintbase: event.target.value })
    }
    interestcalmethod = (event) => {
        this.setState({ interestcalmethod: event.target.value })
    }
    interestdiff = (event) => {
        this.setState({ interestdiff: event.target.value })
    }
    interestrateperiod = (event) => {
        this.setState({ interestrateperiod: event.target.value })
    }
    interestaccrualperiod = (event) => {
        this.setState({ interestaccrualperiod: event.target.value })
    }
    interestmethod = (event) => {
        this.setState({ interestmethod: event.target.value })
    }
    interestpostingfrequency = (event) => {
        this.setState({ interestpostingfrequency: event.target.value })
    }
    allowpartialperiodintcalc = (event) => {
        this.setState({ allowpartialperiodintcalc: event.target.value })
    }
    penalintrate = (event) => {
        this.setState({ penalintrate: event.target.value })
    }
    overduegraceamt = (event) => {
        this.setState({ overduegraceamt: event.target.value })
    }
    teaserintrateallowed = (event) => {
        this.setState({ teaserintrateallowed: event.target.value })
    }
    teaserinterestrate = (event) => {
        this.setState({ teaserinterestrate: event.target.value })
    }

    SetProductDefInterest = () => {
        fetch(BASEURL + `/lms/setproductdefinterestinfo`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                productid: this.state.productid,
                interesttype: this.state.interesttype,
                variableintbase: this.state.variableintbase,
                interestcalmethod: this.state.interestcalmethod,
                interestdiff: this.state.interestdiff,
                interestrateperiod: this.state.interestrateperiod,
                interestaccrualperiod: this.state.interestaccrualperiod,
                interestmethod: this.state.interestmethod,
                interestpostingfrequency: this.state.interestpostingfrequency,
                allowpartialperiodintcalc: this.state.allowpartialperiodintcalc,
                penalintrate: this.state.penalintrate,
                overduegraceamt: this.state.overduegraceamt,
                teaserintrateallowed: this.state.teaserintrateallowed,
                teaserinterestrate: this.state.teaserinterestrate,

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

    cancelProductDefInterest = () => {
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
                        <div className="col-1" id="prodIntRef1">
                            <button style={{ marginLeft: "25px" }} onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className='col-8' id="prodIntRef2" style={{ marginLeft: "20px", marginTop: "5px" }}>
                            <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                <Link to="/landing">Home</Link> / <Link to="/productDefinitions">Product List</Link> / <Link to="/productAttributes">Product Attribute</Link> / Set Product Definition Interest </p>
                        </div>
                        <div className='col'>

                        </div>

                        <div className="col" id="prodIntRef3">
                            <button style={myStyle}>
                                <Link to="/productAttributes" style={{ marginLeft: "10px" }}><FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} /><span style={{ textDecoration: "none", color: "white" }}>Back</span></Link></button>
                        </div>

                    </div>
                    <hr className="col-11" style={{ marginLeft: "50px", width: "88.6%", backgroundColor: "rgba(4,78,160,1)" }} />
                    <div className='row '>
                        <div className="col">
                            <p className="d-flex justify-content-center" style={{ fontSize: "20px", fontWeight: "bold" }}>{t('Set Product Definition Interest')}</p>
                        </div>
                    </div>

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
                                                    id="inputAddress" placeholder={t('Enter Product ID')} onChange={this.productid}
                                                />
                                            </div>
                                            <div className="form-group col-md-4">
                                                <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Interest Type')}</p>
                                                <select className="form-select" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }} onChange={this.interesttype} >
                                                    <option defaultValue>Select</option>
                                                    <option value="VARIABLE">VARIABLE</option>
                                                </select>
                                            </div>
                                            <div className="form-group col-md-4">
                                                <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Variable interest base')}</p>
                                                <select className="form-select" onChange={this.variableintbase} style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }} >
                                                    <option defaultValue>Select</option>
                                                    <option value="Risk">Risk</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-4">
                                                <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Interest cal method')}</p>
                                                <select className="form-select" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }} onChange={this.interestcalmethod}>
                                                    <option defaultValue>Select</option>
                                                    <option value="0">0</option>
                                                </select>
                                            </div>
                                            <div className="form-group col-md-4">
                                                <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Interest difference')}</p>
                                                <input type="number" className="form-control" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}
                                                    id="inputAddress" placeholder={t('Interest difference')} value={this.state.interestdiff} onChange={this.interestdiff}
                                                />
                                            </div>
                                            <div className="form-group col-md-4">
                                                <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Interest rate period')}</p>
                                                <input type="number" className="form-control" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}
                                                    id="inputAddress" placeholder={t('Interest rate period')} value={this.state.interestrateperiod} onChange={this.interestrateperiod}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-4">
                                                <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Interest accrual period')}</p>
                                                <input type="number" className="form-control" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}
                                                    id="inputAddress" placeholder={t('Interest accrual period')} value={this.state.interestaccrualperiod} onChange={this.interestaccrualperiod}
                                                />
                                            </div>
                                            <div className="form-group col-md-4">
                                                <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Interest method')}</p>
                                                <input type="number" className="form-control" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}
                                                    id="inputAddress" placeholder={t('Interest method')} value={this.state.interestmethod} onChange={this.interestmethod}
                                                />
                                            </div>
                                            <div className="form-group col-md-4">
                                                <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Interest posting frequency')}</p>
                                                <input type="number" className="form-control" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}
                                                    id="inputAddress" placeholder={t('Interest posting frequency')} onChange={this.interestpostingfrequency}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-4">
                                                <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Allow partial period interest')}</p>
                                                <select id="inputState" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }} className="form-select" onChange={this.topup} >
                                                    <option defaultValue>Select</option>
                                                    <option value="1">Allow</option>
                                                    <option value="0">Not Allowed</option>
                                                </select>
                                            </div>
                                            <div className="form-group col-md-4">
                                                <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Penal interest rate')}</p>
                                                <input type="number" className="form-control" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}
                                                    id="inputAddress" placeholder={t('Penal interest rate')} onChange={this.penalintrate}
                                                />
                                            </div>
                                            <div className="form-group col-md-4">
                                                <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Overdue grace amount')}</p>
                                                <input type="number" className="form-control" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}
                                                    id="inputAddress" placeholder={t('Overdue grace amount')} onChange={this.overduegraceamt}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-row">

                                            <div className="form-group col-md-4">
                                                <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Teaser interest rate allowed')}</p>
                                                <input type="number" className="form-control" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}
                                                    id="inputAddress" placeholder={t('Teaser interest rate allowed')} value={this.state.teaserintrateallowed} onChange={this.teaserintrateallowed}
                                                />
                                            </div>
                                            <div className="form-group col-md-4">
                                                <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Teaser interest rate')}</p>
                                                <input type="number" className="form-control" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}
                                                    id="inputAddress" placeholder={t('Teaser interest rate')} value={this.state.teaserinterestrate} onChange={this.teaserinterestrate}
                                                />
                                            </div>
                                        </div>

                                        <hr />
                                        <div className="form-row" style={{ textAlign: "center" }}>
                                            <div className="form-group col">
                                                <button type="button" className="btn mr-2 text-white btn-sm" style={{ backgroundColor: "rgb(136, 189, 72)", width: "90px" }}
                                                    onClick={this.SetProductDefInterest}  >Submit</button>
                                                <button type="button" className="btn text-white btn-sm" style={{ backgroundColor: "#0079BF", width: "90px" }}
                                                    onClick={this.cancelProductDefInterest}>{t('Cancel')}</button>
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
                                                            <p htmlFor="s" className="label" style={{ fontWeight: "bold", color: "rgba(5,54,82,1)" }} >{t('Interest type')} </p>
                                                        </div>
                                                        <div className='col-8'>
                                                            <select className="form-select border border-secondary" onChange={this.interesttype} style={{ marginTop: "-5px", color: "RGBA(5,54,82,1)" }} >
                                                                <option defaultValue>------------------Select------------------</option>
                                                                <option value="VARIABLE">VARIABLE</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            &nbsp;
                                           
                                            <div className="row item-list align-items-center">
                                                <div className="group col">
                                                    <div className='row'>
                                                        <div className='col-4'>
                                                            <p htmlFor="s" className="label" style={{ fontWeight: "bold", color: "rgba(5,54,82,1)" }} >{t('Variable interest base')} </p>
                                                        </div>
                                                        <div className='col-8'>
                                                            <select className="form-select border border-secondary" onChange={this.variableintbase} style={{ marginTop: "-5px", color: "RGBA(5,54,82,1)" }} >
                                                                <option defaultValue>------------------Select------------------</option>
                                                                <option value="Risk">Risk</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="group col">
                                                    <div className='row'>
                                                        <div className='col-4'>
                                                            <p htmlFor="s" className="label" style={{ fontWeight: "bold", color: "rgba(5,54,82,1)" }} >{t('Interest cal method')} </p>
                                                        </div>
                                                        <div className='col-8'>
                                                            <select className="form-select border border-secondary" onChange={this.interestcalmethod} style={{ marginTop: "-5px", color: "RGBA(5,54,82,1)" }} >
                                                                <option defaultValue>------------------Select------------------</option>
                                                                <option value="0">0</option>
                                                            </select>

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="row item-list align-items-center">
                                                <div className="group col">
                                                    <div className='row'>
                                                        <div className='col-4'>
                                                            <p htmlFor="s" className="label" style={{ fontWeight: "bold", color: "rgba(5,54,82,1)" }} >{t('Interest difference')} </p>
                                                        </div>
                                                        <div className='col-8'>
                                                            <input type='number' className='form-control border border-secondary' placeholder='Grace days on arrears'
                                                                value={this.state.interestdiff} onChange={this.interestdiff} />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="group col">
                                                    <div className='row'>
                                                        <div className='col-4'>
                                                            <p htmlFor="s" className="label" style={{ fontWeight: "bold", color: "rgba(5,54,82,1)" }} >{t('Interest rate period')} </p>
                                                        </div>
                                                        <div className='col-8'>
                                                            <input type='number' className='form-control border border-secondary' placeholder='Interest rate period'
                                                                value={this.state.interestrateperiod} onChange={this.interestrateperiod} />
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>

                                            
                                            <div className="row item-list align-items-center">
                                                <div className="group col">
                                                    <div className='row'>
                                                        <div className='col-4'>
                                                            <p htmlFor="s" className="label" style={{ fontWeight: "bold", color: "rgba(5,54,82,1)" }} >{t('Interest accrual period')} </p>
                                                        </div>
                                                        <div className='col-8'>
                                                            <input type='number' className='form-control border border-secondary' placeholder='Interest accrual period'
                                                                value={this.state.interestaccrualperiod} onChange={this.interestaccrualperiod} />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="group col">
                                                    <div className='row'>
                                                        <div className='col-4'>
                                                            <p htmlFor="s" className="label" style={{ fontWeight: "bold", color: "rgba(5,54,82,1)" }} >{t('Interest method')} </p>
                                                        </div>
                                                        <div className='col-8'>
                                                            <input type='number' className='form-control border border-secondary' placeholder='Interest method'
                                                                value={this.state.interestmethod} onChange={this.interestmethod} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                           
                                            <div className="row item-list align-items-center">
                                                <div className="group col">
                                                    <div className='row'>
                                                        <div className='col-4'>
                                                            <p htmlFor="s" className="label" style={{ fontWeight: "bold", color: "rgba(5,54,82,1)" }} >{t('Interest posting frequency')} </p>
                                                        </div>
                                                        <div className='col-8'>
                                                            <input type='number' className='form-control border border-secondary' placeholder='Interest posting frequency' onChange={this.interestpostingfrequency} />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="group col">
                                                    <div className='row'>
                                                        <div className='col-4'>
                                                            <p htmlFor="s" className="label" style={{ fontWeight: "bold", color: "rgba(5,54,82,1)" }} >{t('Allow partial period interest')} </p>
                                                        </div>
                                                        <div className='col-8'>
                                                            <select className="form-select border border-secondary" onChange={this.allowpartialperiodintcalc} style={{ marginTop: "-5px", color: "RGBA(5,54,82,1)" }} >
                                                                <option defaultValue>------------------Select------------------</option>
                                                                <option value="1">Allow</option>
                                                                <option value="0">Not Allowed</option>
                                                            </select>

                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="row item-list align-items-center">
                                                <div className="group col">
                                                    <div className='row'>
                                                        <div className='col-4'>
                                                            <p htmlFor="s" className="label" style={{ fontWeight: "bold", color: "rgba(5,54,82,1)" }} >{t('Penal interest rate')} </p>
                                                        </div>
                                                        <div className='col-8'>
                                                            <input type='number' className='form-control border border-secondary' placeholder='Penal interest rate' onChange={this.penalintrate} />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="group col">
                                                    <div className='row'>
                                                        <div className='col-4'>
                                                            <p htmlFor="s" className="label" style={{ fontWeight: "bold", color: "rgba(5,54,82,1)" }} >{t('Overdue grace amount')} </p>
                                                        </div>
                                                        <div className='col-8'>
                                                            <input type='number' className='form-control border border-secondary' placeholder='Overdue grace amount' onChange={this.overduegraceamt} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="row item-list align-items-center">
                                                <div className="group col">
                                                    <div className='row'>
                                                        <div className='col-4'>
                                                            <p htmlFor="s" className="label" style={{ fontWeight: "bold", color: "rgba(5,54,82,1)" }} >{t('Teaser interest rate allowed')} </p>
                                                        </div>
                                                        <div className='col-8'>
                                                            <input type='number' className='form-control border border-secondary' placeholder='Teaser interest rate allowed'
                                                                value={this.state.teaserintrateallowed} onChange={this.teaserintrateallowed} />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="group col">
                                                    <div className='row'>
                                                        <div className='col-4'>
                                                            <p htmlFor="s" className="label" style={{ fontWeight: "bold", color: "rgba(5,54,82,1)" }} >{t('Teaser interest rate')} </p>
                                                        </div>
                                                        <div className='col-8'>
                                                            <input type='number' className='form-control border border-secondary' placeholder='Teaser interest rate'
                                                                value={this.state.teaserinterestrate} onChange={this.teaserinterestrate} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            
                                            <div className='row'>
                                                <div className="group pt-2" style={{ textAlign: "end" }}>
                                                    <button className='btn btn-success' style={{ width: "100px" }} onClick={this.SetProductDefInterest}>Submit</button> &nbsp;
                                                    <button className='btn btn-info' style={{ width: "100px" }} onClick={this.cancelProductDefInterest}>Cancel</button>
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

export default withTranslation()(SetProductDefInterests)