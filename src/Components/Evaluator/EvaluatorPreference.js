import React, { Component } from 'react';
import $ from 'jquery';
import { BASEURL } from '../assets/baseURL';
import { Link } from 'react-router-dom';
import EvaluatorSidebar from '../../SidebarFiles/EvaluatorSidebar';
import dashboardIcon from '../assets/icon_dashboard.png';
import { FaUsers, FaAngleLeft, FaUserCircle, FaRegFileAlt, FaRegFile } from 'react-icons/fa';
import { withTranslation } from 'react-i18next';
import { confirmAlert } from "react-confirm-alert";

class EvaluatorPreference extends Component {
    constructor(props) {
        super(props)

        this.state = {
            loansize: [],
            evalPreference: [],
            evlpreferences: [],
            Aoptions: [],
            prodTypes: [],
            selectedProduct: "",
            finalRequest: [],

        }
        this.setEvalPreference = this.setEvalPreference.bind(this);
        this.getEvalPreference = this.getEvalPreference.bind(this);
        this.getProductTypes = this.getProductTypes.bind(this);
        this.getLoanSize = this.getLoanSize.bind(this);
        this.checkOptions = this.checkOptions.bind(this);
    }

    componentDidMount() {
        this.getProductTypes();
        this.getEvalPreference();

        $("#selectall").click(function () {
            if (this.checked) {
                $('.checkboxall').each(function () {
                    $(".checkboxall").prop('checked', true);
                })
            } else {
                $('.checkboxall').each(function () {
                    $(".checkboxall").prop('checked', false);
                })
            }
        });
    }

    setEvalPreference() {

        const allPreference = JSON.parse(JSON.stringify(this.state.finalRequest));

        fetch(BASEURL + '/lms/setevlpreferences', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                evlpreferences: allPreference

            })
        }).then((Response) => {
            return Response.json();
        })
            .then((resdata) => {
                if (resdata.status == 'Success') {
                    alert(resdata.message);
                    window.location.reload();
                }
                else {
                    alert(resdata.message);
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }

    getEvalPreference() {
        fetch(BASEURL + '/lms/getevalpreferences', {
            method: 'get',
            headers: {
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            }

        }).then(response => {
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata)
                if (resdata.status === 'SUCCESS') {
                    this.setState({ evalPreference: resdata.msgdata });
                    // this.updateSelected();
                } else {
                    alert("Issue: " + resdata.message);
                }
            })
    }

    getProductTypes() {
        fetch(BASEURL + '/lms/getloanproducttypes', {
            method: 'get',
            headers: {
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            }

        }).then(response => {
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata)
                if (resdata.status === 'SUCCESS') {
                    this.setState({ prodTypes: resdata.msgdata });
                    // this.updateSelected();
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

    getLoanSize(selectedProduct) {
        // this.setState({ loansize: [] })
        $('#card2').show();
        $('.evlhide').show();
        this.setState({ selectedProduct: selectedProduct.producttype })
        fetch(BASEURL + '/lms/getloansizes', {
            method: 'get',
            headers: {
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            }

        }).then(response => {
            return response.json();
        })
            .then((resdata) => {

                if (resdata.status === 'SUCCESS') {
                    let p_value = this.state.finalRequest;
                    resdata.msgdata.map((loansize) => {
                        loansize.checked = false;
                        this.state.evalPreference.map((preference) => {
                            if (preference.producttype === selectedProduct.producttype && preference.lonesize === loansize.loansize) {
                                loansize.checked = preference.status === "1" ? true : false;
                                if (loansize.checked) {
                                    p_value = this.getUpdatedRequest(p_value, loansize.checked, loansize);
                                }

                            }
                        })
                    })
                    console.log(p_value);
                    this.setState({ finalRequest: p_value });
                    console.log(resdata.msgdata);
                    this.setState({ loansize: resdata.msgdata });
                } else {
                    alert("Issue: " + resdata.message);
                }
            })
    }
    //updated
    checkOptions(event, index, selectedSize) {
        console.log(event.target.checked);
        console.log(event.target.value);
        const loans = this.state.loansize;
        loans[index].checked = event.target.checked;
        this.setState({ loansize: loans })
        let p_value = this.state.finalRequest;
        p_value = this.getUpdatedRequest(p_value, event.target.checked, selectedSize);
        console.log(p_value);
        this.setState({ finalRequest: p_value })
    }

    getUpdatedRequest(p_value, checked, selectedSize) {
        if (checked) {
            if (p_value.length) {
                if (p_value.find((type) => {
                    return type.producttype === this.state.selectedProduct;
                })) {
                    //if product already present
                    p_value.map((p_type) => {
                        if (p_type.producttype === this.state.selectedProduct) {
                            p_type.loansize.push(selectedSize.loansize);
                        }
                    });
                } else {
                    p_value.push({
                        producttype: this.state.selectedProduct,
                        loansize: [selectedSize.loansize]
                    });
                }
            } else {
                p_value.push({
                    producttype: this.state.selectedProduct,
                    loansize: [selectedSize.loansize]
                })
            }
        } else {
            //if unchecked
            p_value.map((p_type) => {
                if (p_type.producttype === this.state.selectedProduct) {
                    const position = p_type.loansize.indexOf(selectedSize.loansize);
                    p_type.loansize.splice(position, 1);
                }
            });
        }
        return p_value;
    }
    cancelEvlPref = () => {
        window.location = "/evaluatorDashboard";
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
            <div className="container-dashboard d-flex flex-row" id="wrapper" style={{ marginTop: "-7px", backgroundColor: "#F7FCFF" }}>
                <EvaluatorSidebar />
                <div className="main-content" id="page-content-wrapper">
                    <div className="container-fluid row pt-2">
                        <div className="col-1">
                            <button style={{ marginLeft: "25px" }} onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className='col-4' style={{ marginLeft: "20px", marginTop: "5px" }}>
                            <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                <Link to="/">Home</Link> / Evaluator Preferences</p>
                        </div>
                        <div className='col'>

                        </div>
                        <div className='col'>

                        </div>
                        <div className='col-3'>

                        </div>
                        <div className="col">
                            <button style={myStyle}>
                                <Link to="/"><FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} /><span style={{ textDecoration: "none", color: "white" }}>Back</span></Link></button>
                        </div>
                    </div>
                    <hr className="col-11" style={{ marginLeft: "50px", width: "88.6%", backgroundColor: "rgba(4,78,160,1)" }} />

                    <div className='row' style={{ paddingLeft: "60px" }}>
                        <div className='col-4' id='headinglndpref'>
                            <div className="two__image" style={{ paddingLeft: "20px", marginLeft: "-10px" }}>
                                <p className="text-white" style={{ paddingBottom: "6px", fontWeight: "600" }}>Select Your Preference</p>
                            </div>
                        </div>
                    </div>
                    {/* New Design */}
                    <div className="row">
                        <div className="col-11">
                            <p className="ml-5" style={{ color: "rgba(5,54,82,1)", fontWeight: "600" }}>Select Your Loan Category</p>
                            <div className='card ml-5'>
                                <div className='row pl-2 pr-2 pb-2'>
                                    {this.state.prodTypes.map((Preference, index) => {
                                        return (
                                            <div className='col-4' key={index}>
                                                <div className='card pl-3' id='evlPrefCard' style={{ height: "50px", border: "1px solid rgba(0,121,190,1)", marginBottom: "1px", cursor: "default" }}>
                                                    <div className='form-check mt-2'>
                                                        <input className='form-check-input' type='radio'
                                                            name="exampleRadios1" id="exampleRadios1"
                                                            onChange={this.getLoanSize.bind(this, Preference)} key={index}
                                                            style={{ color: "rgba(5,54,82,1)" }} /><span style={{ paddingLeft: "10px", color: "#222C70" }}>{Preference.producttype}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })
                                    }
                                </div>
                            </div>

                        </div>
                    </div>

                    <div className="row pr-5" style={{ paddingLeft: "80px" }}>
                        <div className="card" id='card2' style={{ display: "none", cursor: "default" }}>
                            {/* <div>
                                <input type="checkbox" id="selectall" className="css-checkbox " name="selectall"
                                    style={{ marginLeft: "10px", color: "rgba(5,54,82,1)", cursor: "pointer" }} />
                                <span style={{ marginLeft: "15px", color: "rgb(40, 116, 166)", fontWeight: "bolder", fontSize: "13px", fontStyle: "Poppins" }}>&nbsp;Select All Options</span>
                            </div> */}
                            <div className="row mr-3">
                                {
                                    this.state.loansize.map((Loansizes, index) => {
                                        return (
                                            <div className="col-2" key={index}>
                                                <div className="card" id='checkboX' style={{ borderRadius: "15px", height: "40px", cursor: "default" }}>
                                                    <div className='form-check mt-2'>
                                                        <input className='checkboxall' id='checky' name='check' type='checkbox' checked={Loansizes.checked} onChange={(e) => { this.checkOptions(e, index, Loansizes) }}
                                                            style={{ marginLeft: "1px", color: "rgba(5,54,82,1)", cursor: "pointer" }} />
                                                        <span style={{ marginLeft: "15px", color: "rgb(40, 116, 166)", fontWeight: "bold", fontSize: "12px", fontStyle: "Poppins" }}>&nbsp;{Loansizes.loansize}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }
                                    )}
                            </div>
                        </div>
                    </div>
                    <hr className="col-11 evlhide" style={{ marginLeft: "50px", width: "88.6%", backgroundColor: "rgba(4,78,160,1)", display: "none" }} />
                    <div className="row pr-5 evlhide" style={{ paddingLeft: "80px", display: "none" }}>
                        <div className='col' style={{ textAlign: "end" }}>
                            <button className="btn btn-sm text-white" onClick={this.setEvalPreference} style={{ backgroundColor: "rgb(136, 189, 72)" }}>Submit</button> &nbsp;
                            <button className="btn btn-sm text-white" onClick={this.cancelEvlPref} style={{ backgroundColor: "rgb(0, 121, 191)" }}>Cancel</button>
                        </div>
                    </div>
                    {/* <div className="card border-0 register-form tab-pane fade show active " id="user-details" style={{ padding: '30px', marginLeft: '5px' }}>
                        <div className="row">
                            <div className="col border-right">
                                {
                                    this.state.prodTypes.map((Preference, index) => {

                                        return (
                                            <div key={index}>
                                                <div className="card item-list" onClick={this.getLoanSize.bind(this, Preference)}>
                                                    <div className="card-header border-0 autoInv">

                                                        <h6 >{Preference.producttype}</h6>

                                                    </div >
                                                </div >
                                            </div>
                                        );
                                    })
                                }
                            </div>
                            <div className="col border-right">
                                {
                                    this.state.loansize.map((Loansizes, index) => {
                                        return (
                                            <div key={index}>
                                                <div className="card item-list">
                                                    <div className="card-header border-0 autoInv">
                                                        <input className="form-check-input" type="checkbox" checked={Loansizes.checked} onChange={(e) => { this.checkOptions(e, index, Loansizes) }} />
                                                        <h6 >{Loansizes.loansize}</h6>
                                                    </div >
                                                </div >
                                            </div>
                                        );
                                    })
                                }
                            </div>
                        </div>
                        <br />
                        <div className="row position-absolute bottom-0 end-0 mr-3 mb-2">
                            <div className="col">
                                <button className="btn btn-info float-right">Cancel</button>
                            </div>
                            <div className="col">
                                <button className="btn btn-success" onClick={this.setEvalPreference}>Submit</button>
                            </div>
                        </div>
                    </div> */}
                </div>
            </div>


        )
    }
}

export default withTranslation()(EvaluatorPreference);
