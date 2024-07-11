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

export class SetProductDefGraces extends Component {

    constructor(props) {
        super(props)

        this.state = {
            productid: "",
            gracedaysprincpayment: "",
            gracedaysintpayment: "",
            arrearstoleranceamount: "",
            gracedaysonarrears: "",
            overduedaysbeforenpa: "",
            gracedayspenalinterest: "",
            latepenaltyfrequency: "",
            elcdaysgrace: "",
        }

    }


    componentDidMount() {

    }
    productid = (event) => {
        this.setState({ productid: event.target.value })
    }
    gracedaysprincpayment = (event) => {
        this.setState({ gracedaysprincpayment: event.target.value })
    }
    gracedaysintpayment = (event) => {
        this.setState({ gracedaysintpayment: event.target.value })
    }
    arrearstoleranceamount = (event) => {
        this.setState({ arrearstoleranceamount: event.target.value })
    }
    gracedaysonarrears = (event) => {
        this.setState({ gracedaysonarrears: event.target.value })
    }
    overduedaysbeforenpa = (event) => {
        this.setState({ overduedaysbeforenpa: event.target.value })
    }
    gracedayspenalinterest = (event) => {
        this.setState({ gracedayspenalinterest: event.target.value })
    }
    latepenaltyfrequency = (event) => {
        this.setState({ latepenaltyfrequency: event.target.value })
    }
    elcdaysgrace = (event) => {
        this.setState({ elcdaysgrace: event.target.value })
    }

    setProductDefGrace = () => {
        fetch(BASEURL + `/lms/setproductdefgraceinfo`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                productid: this.state.productid,
                gracedaysprincpayment: this.state.gracedaysprincpayment,
                gracedaysintpayment: this.state.gracedaysintpayment,
                arrearstoleranceamount: this.state.arrearstoleranceamount,
                gracedaysonarrears: this.state.gracedaysonarrears,
                overduedaysbeforenpa: this.state.overduedaysbeforenpa,
                gracedayspenalinterest: this.state.gracedayspenalinterest,
                latepenaltyfrequency: this.state.latepenaltyfrequency,
                elcdaysgrace: this.state.elcdaysgrace,

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
                    // window.location.reload();
                }
            })
            .catch(err => {
                console.log(err.message)
            })
    }

    cancelProductDefGrace = () => {
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
                        <div className="col-1" id="prodGraceRef1">
                            <button style={{ marginLeft: "25px" }} onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className='col-8' id="prodGraceRef2" style={{ marginLeft: "20px", marginTop: "5px" }}>
                            <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                <Link to="/landing">Home</Link> / <Link to="/productDefinitions">Product List</Link> / <Link to="/productAttributes">Product Attribute</Link> / Set Product Definition Grace </p>
                        </div>
                        <div className='col'>

                        </div>

                        <div className="col" id="prodGraceRef3">
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
                                                    <p className="text-white" style={{ paddingBottom: "6px", fontWeight: "600" }}>Set Product Definition Grace</p>
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
                                                <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Grace days principal payment')}</p>
                                                <input type="number" className="form-control" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}
                                                    id="inputAddress" placeholder={t('Grace days principal payment')} onChange={this.gracedaysprincpayment}
                                                />
                                            </div>
                                            <div className="form-group col-md-4">
                                                <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Grace days interest payment')}</p>
                                                <input type="number" className="form-control" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}
                                                    id="inputAddress" placeholder={t('Grace days interest payment')} onChange={this.gracedaysintpayment}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-4">
                                                <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Arrears tolerance amount')}</p>
                                                <input type="number" className="form-control" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}
                                                    id="inputAddress" placeholder={t('Arrears tolerance amount')} onChange={this.arrearstoleranceamount}
                                                />
                                            </div>
                                            <div className="form-group col-md-4">
                                                <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Grace days on arrears')}</p>
                                                <input type="number" className="form-control" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}
                                                    id="inputAddress" placeholder={t('Grace days on arrears')} onChange={this.gracedaysonarrears}
                                                />
                                            </div>
                                            <div className="form-group col-md-4">
                                                <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Overdue days before npa')}</p>
                                                <input type="number" className="form-control" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}
                                                    id="inputAddress" placeholder={t('Overdue days before npa')} onChange={this.overduedaysbeforenpa}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-4">
                                                <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Grace days penal interest')}</p>
                                                <input type="number" className="form-control" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}
                                                    id="inputAddress" placeholder={t('Grace days penal interest')} onChange={this.gracedayspenalinterest}
                                                />
                                            </div>
                                            <div className="form-group col-md-4">
                                                <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Late penalty frequency')}</p>
                                                <input type="number" className="form-control" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}
                                                    id="inputAddress" placeholder={t('Late penalty frequency')} onChange={this.latepenaltyfrequency}
                                                />
                                            </div>
                                        </div>
                                        <div className="form-row">
                                            <div className="form-group col-md-4">
                                                <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Elc days grace')}</p>
                                                <input type="number" className="form-control" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}
                                                    id="inputAddress" placeholder={t('Elc days grace')} onChange={this.elcdaysgrace}
                                                />
                                            </div>
                                        </div>
                                        <hr />
                                        <div className="form-row" style={{ textAlign: "center" }}>
                                            <div className="form-group col">
                                                <button type="button" className="btn mr-2 text-white btn-sm" style={{ backgroundColor: "rgb(136, 189, 72)", width: "90px" }}
                                                    onClick={this.setProductDefGrace}  >Submit</button>
                                                <button type="button" className="btn text-white btn-sm" style={{ backgroundColor: "#0079BF", width: "90px" }}
                                                    onClick={this.cancelProductDefGrace}>{t('Cancel')}</button>
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
                                                            <p htmlFor="s" className="label" style={{ fontWeight: "bold", color: "rgba(5,54,82,1)" }} >{t('Grace days principal payment')} </p>
                                                        </div>
                                                        <div className='col-8'>
                                                            <input type='number' className='form-control border border-secondary' placeholder={t('Grace days principal payment')} onChange={this.gracedaysprincpayment} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            &nbsp;

                                            <div className="row item-list align-items-center">
                                                <div className="group col">
                                                    <div className='row'>
                                                        <div className='col-4'>
                                                            <p htmlFor="s" className="label" style={{ fontWeight: "bold", color: "rgba(5,54,82,1)" }} >{t('Grace days interest payment')} </p>
                                                        </div>
                                                        <div className='col-8'>
                                                            <input type='number' className='form-control border border-secondary' placeholder={t('Grace days interest payment')} onChange={this.gracedaysintpayment} />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="group col">
                                                    <div className='row'>
                                                        <div className='col-4'>
                                                            <p htmlFor="s" className="label" style={{ fontWeight: "bold", color: "rgba(5,54,82,1)" }} >{t('Arrears tolerance amount')} </p>
                                                        </div>
                                                        <div className='col-8'>
                                                            <input type='number' className='form-control border border-secondary' placeholder={t('Arrears tolerance amount')} onChange={this.arrearstoleranceamount} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="row item-list align-items-center">
                                                <div className="group col">
                                                    <div className='row'>
                                                        <div className='col-4'>
                                                            <p htmlFor="s" className="label" style={{ fontWeight: "bold", color: "rgba(5,54,82,1)" }} >{t('Grace days on arrears')} </p>
                                                        </div>
                                                        <div className='col-8'>
                                                            <input type='number' className='form-control border border-secondary' placeholder='Grace days on arrears' onChange={this.gracedaysonarrears} />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="group col">
                                                    <div className='row'>
                                                        <div className='col-4'>
                                                            <p htmlFor="s" className="label" style={{ fontWeight: "bold", color: "rgba(5,54,82,1)" }} >{t('Overdue days before npa')} </p>
                                                        </div>
                                                        <div className='col-8'>
                                                            <input type='number' className='form-control border border-secondary' placeholder='Overdue days before npa' onChange={this.overduedaysbeforenpa} />
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>

                                            <div className="row item-list align-items-center">
                                                <div className="group col">
                                                    <div className='row'>
                                                        <div className='col-4'>
                                                            <p htmlFor="s" className="label" style={{ fontWeight: "bold", color: "rgba(5,54,82,1)" }} >{t('Grace days penal interest')} </p>
                                                        </div>
                                                        <div className='col-8'>
                                                            <input type='number' className='form-control border border-secondary' placeholder='Grace days penal interest' onChange={this.gracedayspenalinterest} />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="group col">
                                                    <div className='row'>
                                                        <div className='col-4'>
                                                            <p htmlFor="s" className="label" style={{ fontWeight: "bold", color: "rgba(5,54,82,1)" }} >{t('Late pnealty frequency')} </p>
                                                        </div>
                                                        <div className='col-8'>
                                                            <input type='number' className='form-control border border-secondary' placeholder='Late pnealty frequency' onChange={this.latepenaltyfrequency} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="row item-list align-items-center">
                                                <div className="group col">
                                                    <div className='row'>
                                                        <div className='col-4'>
                                                            <p htmlFor="s" className="label" style={{ fontWeight: "bold", color: "rgba(5,54,82,1)" }} >{t('Elc days grace')} </p>
                                                        </div>
                                                        <div className='col-8'>
                                                            <input type='number' className='form-control border border-secondary' placeholder='Elc days grace' onChange={this.elcdaysgrace} />
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
                                                    <button className='btn btn-success' style={{ width: "100px" }} onClick={this.setProductDefGrace}>Submit</button> &nbsp;
                                                    <button className='btn btn-info' style={{ width: "100px" }} onClick={this.cancelProductDefGrace}>Cancel</button>
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

export default withTranslation()(SetProductDefGraces)