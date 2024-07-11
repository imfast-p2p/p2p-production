import React, { Component } from 'react';
import $ from 'jquery';
import { BASEURL } from '../../assets/baseURL';
import AdminSidebar from '../AdminSidebar';
import { withTranslation } from 'react-i18next';
import { FaAngleLeft } from "react-icons/fa";
import dashboardIcon from '../../assets/icon_dashboard.png';
import { Link } from 'react-router-dom';

export class AuthorizeProduct extends Component {

    constructor(props) {
        super(props)

        this.state = {
            productid: sessionStorage.getItem("productID"),
            authprodtype: "",
            authpurp: "",
            authcur: "",
            authmem: "",
            authamt: "",
            authint: "",
            authrpf: "",
            authgrace: "",
            authfund: "",
            authprod: "",
            bllfeeamt: "",
            blefeeamt: "",
            latepaymentpenalty: "",
            borlatepaymentfrequency: "",
            borlatepaymentmaxcap: "",
            elcfeefixedpercentage: "0",
            elcfeemaxcap: "",
            faccommissionamt: "0",
            evlcommissionfixedpercentage: "0.005",
            evlcommissionmaxcap: "100",
            validfromdate: "",
        }
    }
    componentDidMount() {

    }
    productid = (event) => {
        this.setState({ productid: event.target.value.toLocaleUpperCase() })
    }
    authprodtype = (event) => {
        this.setState({ authprodtype: event.target.value })
    }
    authpurp = (event) => {
        this.setState({ authpurp: event.target.value })
    }
    authcur = (event) => {
        this.setState({ authcur: event.target.value })
    }
    authmem = (event) => {
        this.setState({ authmem: event.target.value })
    }
    authamt = (event) => {
        this.setState({ authamt: event.target.value })
    }
    authint = (event) => {
        this.setState({ authint: event.target.value })
    }
    authrpf = (event) => {
        this.setState({ authrpf: event.target.value })
    }
    authgrace = (event) => {
        this.setState({ authgrace: event.target.value })
    }
    authfund = (event) => {
        this.setState({ authfund: event.target.value })
    }
    authprod = (event) => {
        this.setState({ authprod: event.target.value })
    }
    bllfeeamt = (event) => {
        this.setState({ bllfeeamt: event.target.value })
    }
    blefeeamt = (event) => {
        this.setState({ blefeeamt: event.target.value })
    }
    latepaymentpenalty = (event) => {
        this.setState({ latepaymentpenalty: event.target.value })
    }
    borlatepaymentfrequency = (event) => {
        this.setState({ borlatepaymentfrequency: event.target.value })
    }
    borlatepaymentmaxcap = (event) => {
        this.setState({ borlatepaymentmaxcap: event.target.value })
    }
    elcfeefixedpercentage = (event) => {
        this.setState({ elcfeefixedpercentage: event.target.value })
    }
    elcfeemaxcap = (event) => {
        this.setState({ elcfeemaxcap: event.target.value })
    }
    faccommissionamt = (event) => {
        this.setState({ faccommissionamt: event.target.value })
    }
    evlcommissionfixedpercentage = (event) => {
        this.setState({ evlcommissionfixedpercentage: event.target.value })
    }
    evlcommissionmaxcap = (event) => {
        this.setState({ evlcommissionmaxcap: event.target.value })
    }
    validfromdate = (event) => {
        this.setState({ validfromdate: event.target.value })
    }
    AuthorizeProduct = () => {
        fetch(BASEURL + '/lms/authorizeproductlaunch', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                productid: this.state.productid,
                authprodtype: this.state.authprodtype,
                authpurp: this.state.authpurp,
                authcur: this.state.authcur,
                authmem: this.state.authmem,
                authamt: this.state.authamt,
                authint: this.state.authint,
                authrpf: this.state.authrpf,
                authgrace: this.state.authgrace,
                authfund: this.state.authfund,
                authprod: this.state.authprod,
                bllfeeamt: this.state.bllfeeamt,
                blefeeamt: this.state.blefeeamt,
                latepaymentpenalty: this.state.latepaymentpenalty,
                borlatepaymentfrequency: this.state.borlatepaymentfrequency,
                borlatepaymentmaxcap: this.state.borlatepaymentmaxcap,
                elcfeefixedpercentage: this.state.elcfeefixedpercentage,
                elcfeemaxcap: this.state.elcfeemaxcap,
                faccommissionamt: this.state.faccommissionamt,
                evlcommissionfixedpercentage: this.state.evlcommissionfixedpercentage,
                evlcommissionmaxcap: this.state.evlcommissionmaxcap,
                validfromdate: this.state.validfromdate
            })
        }).then(response => {
            return response.json();
        })//updated
            .then((resdata) => {
                console.log(resdata)
                if (resdata.status == 'Success') {
                    alert(resdata.message)
                } else {
                    alert(resdata.message);
                    //window.location.reload()
                }

            })
    }
    cancelAuthorizeProduct = () => {
        window.location.reload()
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
            <div className="container-dashboard d-flex flex-row" id="wrapper" style={{ backgroundColor: "#F4F7FC"}}>
                <AdminSidebar />
                <div className="pl-3 pr-3 main-content" id="page-content-wrapper">
                    <div className="container-fluid row pt-2">
                        <div className="col-1" id="">
                            <button style={{ marginLeft: "25px" }} onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className='col-8' id="" style={{ marginLeft: "20px", marginTop: "5px" }}>
                            <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                <Link to="/landing">Home</Link> / <Link to="/productDefinitions">Product List</Link> / Authorize Product Launch</p>
                        </div>
                        <div className='col'>

                        </div>

                        <div className="col" id="">
                            <button style={myStyle}>
                                <Link to="/productDefinitions" style={{ marginLeft: "10px" }}><FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} /><span style={{ textDecoration: "none", color: "white" }}>Back</span></Link></button>
                        </div>

                    </div>
                    <hr className="col-11" style={{ marginLeft: "50px", width: "88.6%", backgroundColor: "rgba(4,78,160,1)", marginTop: "0px" }} />
        
                    <div className="card" style={{ cursor: "default", width: "92%", marginLeft: "45px" }}>
                        <div className="card-header border-1 bg-white">
                            <div className='row' style={{ paddingLeft: "3px" }}>
                                <div className='col-5' id='headingRef'>
                                    <div className="two__image" style={{ paddingLeft: "10px" }}>
                                        <p className="text-white" style={{ paddingBottom: "6px", fontWeight: "600" }}>Authorize Product Launch</p>
                                    </div>
                                </div>
                            </div>
                            {/* 1st Row */}
                            <div className="form-row">
                                <div className="form-group col-md-4">
                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Product ID')}</p>
                                    <input type="text" className="form-control" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}
                                        id="inputAddress" placeholder={t('Enter Product ID')} onChange={this.firstname}
                                    />
                                </div>
                                <div className="form-group col-md-4">
                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Authorize Product Type')}</p>
                                    <select id="inputState" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }} className="form-select" onChange={this.authprodtype} >
                                        <option defaultValue>Select</option>
                                        <option value="1">Authorize</option>
                                        <option value="0">Not Authorize</option>
                                    </select>


                                </div>
                                <div className="form-group col-md-4">
                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Authorize Purpose')}</p>
                                    <select id="inputState" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }} className="form-select" onChange={this.authpurp}>
                                        <option defaultValue>Select</option>
                                        <option value="1">Authorize</option>
                                        <option value="0">Not Authorize</option>
                                    </select>

                                </div>
                            </div>
                            {/* ----------------<2nd row>----------- */}
                            <div className="form-row">
                                <div className="form-group col-md-4">
                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Authorize Currency')}</p>
                                    <select id="inputState" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }} className="form-select" onChange={this.authcur} >
                                        <option defaultValue>Select</option>
                                        <option value="1">Authorize</option>
                                        <option value="0">Not Authorize</option>
                                    </select>

                                </div>
                                <div className="form-group col-md-4">
                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Authorize Member Group')}</p>
                                    <select id="inputState" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }} className="form-select" onChange={this.authmem} >
                                        <option defaultValue>Select</option>
                                        <option value="1">Authorize</option>
                                        <option value="0">Not Authorize</option>
                                    </select>


                                </div>
                                <div className="form-group col-md-4">
                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Authorize Amount')}</p>
                                    <select id="inputState" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }} className="form-select" onChange={this.authamt}>
                                        <option defaultValue>Select</option>
                                        <option value="1">Authorize</option>
                                        <option value="0">Not Authorize</option>
                                    </select>

                                </div>
                            </div>
                            {/* 3rd Row */}
                            <div className="form-row">
                                <div className="form-group col-md-4">
                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Authorize Interest')}</p>
                                    <select id="inputState" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }} className="form-select" onChange={this.authint} >
                                        <option defaultValue>Select</option>
                                        <option value="1">Authorize</option>
                                        <option value="0">Not Authorize</option>
                                    </select>

                                </div>
                                <div className="form-group col-md-4">
                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Authorize Repayment Frequency')}</p>
                                    <select id="inputState" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }} className="form-select" onChange={this.authrpf} >
                                        <option defaultValue>Select</option>
                                        <option value="1">Authorize</option>
                                        <option value="0">Not Authorize</option>
                                    </select>


                                </div>
                                <div className="form-group col-md-4">
                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Authorize Grace')}</p>
                                    <select id="inputState" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }} className="form-select" onChange={this.authgrace}>
                                        <option defaultValue>Select</option>
                                        <option value="1">Authorize</option>
                                        <option value="0">Not Authorize</option>
                                    </select>

                                </div>
                            </div>
                            {/* 4th Row */}
                            <div className="form-row">
                                <div className="form-group col-md-4">
                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Authorize Funding')}</p>
                                    <select id="inputState" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }} className="form-select" onChange={this.authfund} >
                                        <option defaultValue>Select</option>
                                        <option value="1">Authorize</option>
                                        <option value="0">Not Authorize</option>
                                    </select>

                                </div>
                                <div className="form-group col-md-4">
                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Authorize Product')}</p>
                                    <select id="inputState" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }} className="form-select" onChange={this.authprod}>
                                        <option defaultValue>Select</option>
                                        <option value="1">Authorize</option>
                                        <option value="0">Not Authorize</option>
                                    </select>


                                </div>
                                <div className="form-group col-md-4">
                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Borrower Loan Listing Fee Amount')}</p>
                                    <input type="text" className="form-control" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}
                                        id="inputAddress" placeholder={t('Amount')} onChange={this.bllfeeamt}
                                    />

                                </div>
                            </div>
                            {/*5th Row */}
                            <div className="form-row">
                                <div className="form-group col-md-4">
                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Borrower Late Fee Payment Capacity')}</p>
                                    <input type="text" className="form-control" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}
                                        id="inputAddress" onChange={this.blefeeamt} placeholder="Payment Capacity"
                                    />
                                </div>
                                <div className="form-group col-md-4">
                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Late Payment Penalty')}</p>
                                    <input type="text" className="form-control" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}
                                        id="inputAddress" onChange={this.latepaymentpenalty} placeholder="Late Payment Penalty"
                                    />


                                </div>
                                <div className="form-group col-md-4">
                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Borrower Late Payment Frequency')}</p>
                                    <input type="text" className="form-control" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}
                                        id="inputAddress" onChange={this.borlatepaymentfrequency} placeholder="Payment Frequency"
                                    />
                                </div>
                            </div>
                            {/* 6th Row */}
                            <div className="form-row">
                                <div className="form-group col-md-4">
                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Borrower Late Payment Max Capacity')}</p>
                                    <input type="text" className="form-control" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}
                                        id="inputAddress" onChange={this.borlatepaymentmaxcap} placeholder="Payment Capacity"
                                    />
                                </div>
                                <div className="form-group col-md-4">
                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('ELC Fee Fixed Percentage')}</p>
                                    <input type="text" className="form-control" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}
                                        id="inputAddress" onChange={this.elcfeefixedpercentage} placeholder="ELC Fee Fixed Percentage" value={this.state.elcfeefixedpercentage} />


                                </div>
                                <div className="form-group col-md-4">
                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('ELC Fee Max Capacity')}</p>
                                    <input type="text" className="form-control" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}
                                        id="inputAddress" onChange={this.elcfeemaxcap} placeholder="ELC Fee Capacity"
                                    />
                                </div>
                            </div>
                            {/* 7th Row */}
                            <div className="form-row">
                                <div className="form-group col-md-4">
                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Facilitator Comm. Amount')}</p>
                                    <input type="text" className="form-control" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}
                                        id="inputAddress" onChange={this.faccommissionamt} placeholder="Facilitator Commission" value={this.state.faccommissionamt}
                                    />
                                </div>
                                <div className="form-group col-md-4">
                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Evaluator Comm. Fixed Percentage')}</p>
                                    <input type="text" className="form-control" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}
                                        id="inputAddress" onChange={this.evlcommissionfixedpercentage} placeholder="Evaluator Commission" value={this.state.evlcommissionfixedpercentage}
                                    />

                                </div>
                                <div className="form-group col-md-4">
                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Evaluator Comm. Maximum Capacity')}</p>
                                    <input type="text" className="form-control" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}
                                        id="inputAddress" onChange={this.evlcommissionmaxcap} placeholder="Evaluator Commission" value={this.state.evlcommissionmaxcap}
                                    />
                                </div>

                            </div>
                            {/* 8th row */}
                            <div className="form-row">
                                <div className="form-group col-md-4">
                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Valid From Date')}</p>
                                    <input type="date" className="form-control" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}
                                        id="inputAddress" onChange={this.validfromdate}
                                    />

                                </div>
                                <div className="form-group col-md-4">
                                </div>
                                <div className="form-group col-md-4">
                                </div>
                            </div>

                            <hr />

                            <div className="form-row">
                                <div className="form-group col pt-2" style={{ textAlign: "center" }}>
                                    <button className='btn btn-sm text-white' onClick={this.AuthorizeProduct}
                                        style={{ backgroundColor: "rgb(136, 189, 72)" }}>Submit</button> &nbsp;
                                    <button className='btn btn-sm text-white' onClick={this.cancelAuthorizeProduct}
                                        style={{ backgroundColor: "#0079BF" }}>Cancel</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        )
    }
}

export default withTranslation()(AuthorizeProduct)