import React, { Component } from 'react';
import $ from 'jquery';
import { BASEURL } from '../../assets/baseURL';
import SystemUserSidebar from '../SystemUserSidebar';
import { withTranslation } from 'react-i18next';
import { FaPlus } from "react-icons/fa";
import { FaAngleLeft, FaFolderPlus } from "react-icons/fa";
import dashboardIcon from '../../assets/icon_dashboard.png';
import { Link } from 'react-router-dom';
import Multiselect from 'multiselect-react-dropdown';
import './ProductCreation.css';
import editRole from '../../assets/editRole.png';
import { confirmAlert } from 'react-confirm-alert';

export class ProductCreation extends Component {

    constructor(props) {
        super(props)

        this.state = {
            productLists: [],
            purposeGroupLists: [],
            loanpurposeLists: [],
            memberGroupLists: [],
            newList: [],
            listo: [],

            productid: "",
            producttype: "VENDOR",
            productshortcode: "",
            productname: "",
            productdesc: "",
            membergroup: "",
            maxborloan: "",
            validtodate: "",
            loanpurposeid: [],
            newList1: [],
            currencycode: "INR",
            collateralneeded: "0",
            minimumlvr: "100",
            loantxnstrategyid: "0",
            addborrowerloan: "0",
            glcode: "9",
            stmtNeeded: "0",
            disbToSupplier:"0",
            purposegroup: "",
            infoList: [],
            infoList1: [],
            selectedValue: "",
            options: [],

            //set product type
            prodtype: "",
            prodtypename: "",
            prodtypedesc: "",

            //set purpose group
            loanpurposegroup: "",
            loanpurposegrpdesc: "",
            attributeid: "",
            loansize: "",

            //set loan purpose
            loanpurposegrp: "",
            loanpurpose: "",

            //set member group
            membergrp: "",
            membergrpdesc: "",
            membergrpcategory: "",
            vneed: "",
            vtype: "",

            invalidDate: "",

            loanPurposeGroupList: []
        }
    }
    componentDidMount() {
        this.getProductType()
        this.getLoanPurpose()
        this.getMemberGroup()
        $('#PCSubmitBtn').prop('disabled', true)
    }
    productid = (event) => {
        this.setState({ productid: event.target.value.toLocaleUpperCase() })
        console.log(this.state.productid)
    }
    producttype = (event) => {
        this.setState({ producttype: event.target.value })
    }
    productshortcode = (event) => {
        this.setState({ productshortcode: event.target.value.toLocaleUpperCase() })
    }
    productname = (event) => {
        this.setState({ productname: event.target.value })
    }
    productdesc = (event) => {
        this.setState({ productdesc: event.target.value })
    }
    membergroup = (event) => {
        this.setState({ membergroup: event.target.value })
        console.log(this.state.membergroup)
    }
    maxborloan = (event) => {
        this.setState({ maxborloan: event.target.value })
    }
    validtodate = (event) => {
        var UserDate = event.target.value;
        var ToDate = new Date();
        var finalDate = ToDate.toISOString().split('T')[0]
        console.log(finalDate)
        console.log(UserDate)

        if (UserDate < finalDate) {
            console.log("failed")
            $('#PCSubmitBtn').prop('disabled', true)
            this.setState({ invalidDate: true })
        } else {
            console.log("passed")
            this.setState({ invalidDate: false })
            $('#PCSubmitBtn').prop('disabled', false)
            this.setState({ validtodate: event.target.value })
        }

        console.log(this.state.validtodate)
    }
    collateralneeded = (event) => {
        this.setState({ collateralneeded: event.target.value })
    }
    purposegroup = (event) => {
        this.setState({ purposegroup: event.target.value })
        let datalist = [];
        let datalist1 = [];
        console.log(this.state.purposegroup)
        this.state.loanpurposeLists.forEach(element => {
            if (element.loanpurposegrp === event.target.value) {
                element.loanpurposeinfo.forEach(ele => {
                    var datajs = { name: ele.loanpurpose, id: ele.loanpurposeid }
                    datalist.push(datajs);
                    // datalist.push(ele.loanpurposeid);
                    // datalist1.push(ele.loanpurpose);

                });

                this.setState({
                    infoList: datalist, options: datalist
                    //infoList1:datalist1
                })
                console.log(datalist)
            }

        })

    }
    memberloanPurpose = (event) => {
        console.log(event)
        // var loanpurposeid = event.target.value;
        // this.state.loanpurposeid.push(loanpurposeid);
        this.setState({ loanpurposeid: event })
        // console.log(this.state.loanpurposeid)

    }
    getProductType = () => {
        fetch(BASEURL + '/lms/getproducttype', {
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
                    this.setState({ productLists: resdata.msgdata })
                } else {
                    //alert("Issue: " + resdata.message);
                }
            })
    }
    getLoanPurpose = () => {
        fetch(BASEURL + '/lms/getloanpurpose', {
            method: 'GET',
            headers: {
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            }
        })
            .then(response => {
                console.log(response)
                return response.json();
            })
            .then((resdata) => {
                console.log(resdata)
                if (resdata.status === 'SUCCESS') {
                    console.log(resdata.msgdata)
                    this.setState({ loanpurposeLists: resdata.msgdata })
                } else {
                    //alert("Issue: " + resdata.message);
                }
            }).catch(err => {
                console.log(err.message)
            })
    }
    getLoanPurposeGroup = () => {
        fetch(BASEURL + '/lms/getloanpurposegroup', {
            method: 'GET',
            headers: {
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            }
        })
            .then(response => {
                console.log(response)
                return response.json();
            })
            .then((resdata) => {
                console.log(resdata)
                if (resdata.status == 'SUCCESS') {
                    console.log(resdata.msgdata)
                    this.setState({ loanPurposeGroupList: resdata.msgdata })
                } else {
                    //alert("Issue: " + resdata.message);
                }
            }).catch(err => {
                console.log(err.message)
            })
    }
    getMemberGroup = () => {
        fetch(BASEURL + '/lms/getmembergroup', {
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
                    this.setState({ memberGroupLists: resdata.msgdata })
                } else {
                    //alert("Issue: " + resdata.message);
                }
            })
    }
    stmtNeeded = (event) => {
        const newValue = event.target.checked ? 1 : 0;
        console.log(event.target.checked, newValue)
        this.setState({ stmtNeeded: newValue })
    }
    disbToSupp=(event)=>{
        const newValue = event.target.checked ? 1 : 0;
        console.log(event.target.checked, newValue)
        this.setState({ disbToSupplier: newValue })
    }
    createProduct = () => {
        let loanpurposeid = [];
        this.state.loanpurposeid.forEach(ele => {
            loanpurposeid.push(parseInt(ele.id));
        })
        console.log(loanpurposeid);
        fetch(BASEURL + '/lms/setproductdefproductinfo', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                productid: this.state.productid,
                producttype: this.state.producttype,
                productshortcode: this.state.productshortcode,
                productname: this.state.productname,
                productdesc: this.state.productdesc,
                membergroup: this.state.membergroup,
                maxborloan: this.state.maxborloan,
                validtodate: this.state.validtodate,
                loanpurposeid: loanpurposeid,
                currencycode: this.state.currencycode,

                collateralneeded: this.state.collateralneeded,
                minimumlvr: this.state.minimumlvr,
                loantxnstrategyid: this.state.loantxnstrategyid,
                addborrowerloan: this.state.addborrowerloan,
                glcode: this.state.glcode,
                stmtrequired: this.state.stmtNeeded,
                disbursetosupplier:this.state.disbToSupplier
            })
        }).then(response => {
            return response.json();
        })//updated
            .then((resdata) => {
                console.log(resdata)
                if (resdata.status == 'Success') {
                    confirmAlert({
                        message: "Product creation successful.",
                        buttons: [
                            {
                                label: "Okay",
                                onClick: () => {
                                    window.location = "/productDefinition"
                                }
                            }
                        ]
                    })

                } else {
                    confirmAlert({
                        message: resdata.message,
                        buttons: [
                            {
                                label: "Okay",
                                onClick: () => {

                                },
                            },
                        ],
                    });
                }

            })

    }
    cancelproduct = () => {
        window.location.reload();
    }

    // set Product Type
    prodtypename = (event) => {
        this.setState({ prodtypename: event.target.value.toLocaleUpperCase() })
    }
    prodtype = (event) => {
        this.setState({ prodtype: event.target.value })
    }
    prodtypedesc = (event) => {
        this.setState({ prodtypedesc: event.target.value })
    }

    setproductType = () => {
        fetch(BASEURL + '/lms/setproducttype', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                prodtype: this.state.prodtype,
                prodtypename: this.state.prodtypename,
                prodtypedesc: this.state.prodtypedesc
            })
        }).then(response => {
            console.log(response)
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata)
                if (resdata.status == 'Success') {
                    console.log(resdata.msgdata)
                    alert(resdata.message)
                    this.getProductType();
                } else {
                    alert(resdata.message);
                }
            })
            .catch(err => {
                console.log(err.message)
            })
    }
    // set purpose group
    loanpurposegroup = (event) => {
        this.setState({ loanpurposegroup: event.target.value.toLocaleUpperCase() })
    }
    loanpurposegrpdesc = (event) => {
        this.setState({ loanpurposegrpdesc: event.target.value })
    }
    attributeid = (event) => {
        this.setState({ attributeid: event.target.value.toLocaleUpperCase() })
    }
    loansize = (event) => {
        this.setState({ loansize: event.target.value.toLocaleUpperCase() })
    }
    setLoanPurposeGroup = () => {
        fetch(BASEURL + '/lms/setloanpurposegroup', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                loanpurposegroup: this.state.loanpurposegroup,
                loanpurposegrpdesc: this.state.loanpurposegrpdesc,
                attributeid: this.state.attributeid,
                loansize: this.state.loansize,
            })
        }).then(response => {
            console.log(response)
            return response.json();
        })
            .then(resdata => {
                if (resdata.status == 'Success') {
                    console.log(resdata.msgdata)
                    // alert(resdata.message);
                    $("#exampleModalCenter2").modal('hide');
                    confirmAlert({
                        message: resdata.message + ", Please create a loan purpose for the purpose group.",
                        buttons: [
                            {
                                label: "OK",
                                onClick: () => {
                                    this.getLoanPurpose();
                                    this.getLoanPurposeGroup()
                                    $("#setLoanGroup").click();
                                },
                            },
                        ],
                    });

                } else {
                    alert("Issue: " + resdata.message);
                }
            })
            .catch(err => {
                console.log(err.message)
            })
    }

    //Set Loan Purpose
    loanpurposegrp = (event) => {
        this.setState({ loanpurposegrp: event.target.value })
    }
    loanpurpose = (event) => {
        this.setState({ loanpurpose: event.target.value })
    }

    setLoanPurpose = () => {
        fetch(BASEURL + '/lms/setloanpurpose', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                loanpurpose: this.state.loanpurpose,
                loanpurposegrp: this.state.loanpurposegrp,
            })
        }).then(response => {
            console.log(response)
            return response.json();
        })
            .then(resdata => {
                if (resdata.status.toLowerCase() === ('success')) {
                    console.log(resdata.msgdata)
                    // alert(resdata.message);
                    $("#exampleModalCenter3").modal('hide');
                    confirmAlert({
                        message: resdata.message,
                        buttons: [
                            {
                                label: "OK",
                                onClick: () => {
                                    this.getLoanPurpose();
                                },
                            },
                        ],
                    });
                } else {
                    alert(resdata.message);
                }
            })
            .catch(err => {
                console.log(err.message)
            })
    }

    //set member group
    membergrp = (event) => {
        this.setState({ membergrp: event.target.value.toLocaleUpperCase() })
    }
    membergrpdesc = (event) => {
        this.setState({ membergrpdesc: event.target.value })
    }
    membergrpcategory = (event) => {
        this.setState({ membergrpcategory: event.target.value })
    }
    vneed = (event) => {
        this.setState({ vneed: event.target.value })
    }
    vtype = (event) => {
        this.setState({ vtype: event.target.value })
    }
    setMemberGroup = () => {
        fetch(BASEURL + '/lms/setmembergroup', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                membergrp: this.state.membergrp,
                membergrpdesc: this.state.membergrpdesc,
                membergrpcategory: this.state.membergrpcategory,
                vneed: this.state.vneed,
                vtype: this.state.vtype
            })
        }).then(response => {
            console.log(response)
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata)
                if (resdata.status === 'Success') {
                    console.log(resdata.msgdata)
                    alert(resdata.message)

                } else {
                    alert(resdata.message);
                }
            })
            .catch(err => {
                console.log(err.message)
            })
    }
    cancelSetMembergroup = () => {
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
            <div className="container-dashboard d-flex flex-row" id="wrapper" style={{ backgroundColor: "#F4F7FC" }}>
                <SystemUserSidebar />
                <div className="pl-3 pr-3 main-content" id="page-content-wrapper">
                    <div className="container-fluid row pt-2">
                        <div className="col-1" id="">
                            <button style={{ marginLeft: "25px" }} onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className='col-4' id="" style={{ marginLeft: "20px", marginTop: "5px" }}>
                            <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                <Link to="/sysUserDashboard">Home</Link> / <Link to="/productDefinition">Product List</Link> / Product Creation </p>
                        </div>
                        <div className='col'>

                        </div>
                        <div className='col'>

                        </div>
                        <div className='col-3'>

                        </div>
                        <div className="col" id="">
                            <button style={myStyle}>
                                <Link to="/sysUserDashboard" style={{ marginLeft: "10px" }}><FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} /><span style={{ textDecoration: "none", color: "white" }}>Back</span></Link></button>
                        </div>
                    </div>
                    <hr className="col-11" style={{ marginLeft: "50px", width: "88.6%", backgroundColor: "rgba(4,78,160,1)", marginTop: "0px" }} />
                    <div className="card" style={{ cursor: "default", width: "92%", marginLeft: "45px" }}>
                        <div className="card-header border-1 bg-white">
                            <div className='row' style={{ paddingLeft: "3px" }}>
                                <div className='col-4' id='headingRef'>
                                    <div className="two__image" style={{ paddingLeft: "10px" }}>
                                        <p className="text-white" style={{ paddingBottom: "6px", fontWeight: "600" }}>Product Creation</p>
                                    </div>
                                </div>
                            </div>
                            {/* 1st Row */}
                            <div className="form-row">
                                <div className="form-group col-md-4">
                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Product ID *')}</p>
                                    <input type="text" className="form-control" maxLength={6} style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px", textTransform: 'uppercase' }}
                                        id="inputAddress" placeholder={t('Enter Product ID')} onChange={this.productid}
                                    />
                                </div>
                                <div className="form-group col-md-4">
                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Product Name *')}</p>
                                    <input type="text" className="form-control" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}
                                        id="inputAddress" placeholder={t('Enter Product Name')} onChange={this.productname}
                                    />


                                </div>
                                <div className="form-group col-md-4">
                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Product Code *')}</p>
                                    <input type="text" className="form-control" maxLength={4} style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px", textTransform: 'uppercase' }}
                                        id="inputAddress" placeholder={t('Enter Product Code')} onChange={this.productshortcode}
                                    />
                                </div>
                            </div>
                            {/* ----------------<2nd row>----------- */}
                            <div className="form-row">
                                <div className="form-group col-md-4">
                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Product Type *')}</p>
                                    <select id="inputState" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }} className="form-select" onChange={this.producttype}>
                                        <option defaultValue>Select</option>
                                        {
                                            this.state.productLists.map((productlist, subIndex) => {
                                                return (
                                                    <option key={subIndex} value={productlist.producttype}>{productlist.producttypename}</option>
                                                )
                                            })
                                        }
                                    </select>
                                </div>
                                <div className="form-group col-md-4">
                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Purpose Group *')}</p>
                                    <select id="" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }} className="form-select" onChange={this.purposegroup}>
                                        <option defaultValue>Select</option>
                                        {
                                            this.state.loanpurposeLists.map((plists, index) => {
                                                return (

                                                    <option key={index} value={plists.loanpurposegrp}>{plists.loanpurposegrp}</option>
                                                )
                                            })
                                        }

                                    </select>
                                </div>
                                <div className="form-group col-md-4">
                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold", marginBottom: "2px" }}>{t('Loan Purpose *')}</p>
                                    <Multiselect
                                        onRemove={this.memberloanPurpose.bind(this)}
                                        onSelect={this.memberloanPurpose.bind(this)}
                                        options={this.state.options}
                                        selectedValues={this.state.selectedValue}
                                        displayValue="name"
                                        showCheckbox />
                                </div>
                            </div>
                            {/* 3rd Row */}
                            <div className="form-row">
                                <div className="form-group col-md-4">
                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Member Group *')}
                                    </p>
                                    <select id="inputState" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }} className="form-select" onChange={this.membergroup}>
                                        <option defaultValue>Select</option>
                                        {this.state.memberGroupLists.map((memberlists, index) => {
                                            return (
                                                <>
                                                    {memberlists.membergrpcategoryinfo.map((sub, subindex) => {
                                                        return (
                                                            <option key={subindex} value={sub.membergrpid}>{sub.membergrpid}</option>
                                                        )
                                                    })}
                                                </>
                                            )
                                        })}
                                    </select>
                                </div>
                                <div className="form-group col-md-4">
                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Valid Upto *')}</p>
                                    <input type="date" className="form-control" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}
                                        id="inputAddress" onChange={this.validtodate}
                                    />
                                    {(this.state.invalidDate) ? <span className='text-danger'>The Date must be Bigger or Equal to today date</span> : ''}
                                </div>
                                <div className="form-group col-md-4">
                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Loans Per Borrower *')}</p>
                                    <input type="text" className="form-control" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}
                                        id="inputAddress" placeholder={t('Loans Per Borrower')} onChange={this.maxborloan}
                                    />
                                </div>
                            </div>
                            {/* 4th Row */}
                            <div className="form-row">
                                <div className="form-group col-md-4">
                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Product Description *')}</p>
                                    <textarea type="text" style={{ backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }} className="form-control" onChange={this.productdesc}
                                        placeholder="Product Description" rows={3} cols={30} maxLength={255}>
                                    </textarea>
                                </div>
                                {/* <div className="form-group col-md-4">
                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Collateral')}</p>
                                    <select id="inputState" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }} className="form-select" onChange={this.collateralneeded}>
                                        <option value="0" defaultValue>No</option>
                                        <option value="1">Yes</option>
                                    </select>
                                </div> */}
                                <div className="form-group col-md-4">
                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold", marginBottom: "5px" }}>{t('Bank Statement Required')}</p>
                                    <div class="form-check form-switch">
                                        <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault" onChange={this.stmtNeeded} />
                                        <label class="form-check-label" for="flexSwitchCheckDefault">
                                            {/* <span class="yes">Yes</span>
                                            <span class="no">No</span>
                                            {this.state.isChecked ? 'Yes' : 'No'} */}
                                        </label>
                                    </div>
                                </div>
                                <div className="form-group col-md-4">
                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold", marginBottom: "5px" }}>{t('Disburse To Supplier')}</p>
                                    <div class="form-check form-switch">
                                        <input class="form-check-input" type="checkbox" role="switch" id="flexSwitchCheckDefault2" onChange={this.disbToSupp} />
                                        <label class="form-check-label" for="flexSwitchCheckDefault2">
                                            {/* <span class="yes">Yes</span>
                                            <span class="no">No</span>
                                            {this.state.isChecked ? 'Yes' : 'No'} */}
                                        </label>
                                    </div>
                                </div>
                            </div>
                            <hr />
                            <div className="form-row">
                                <div className="form-group col pt-2" style={{ textAlign: "center" }}>
                                    <button className='btn btn-sm text-white' onClick={this.createProduct} id="PCSubmitBtn"
                                        style={{ backgroundColor: "rgb(136, 189, 72)" }}>Submit</button> &nbsp;
                                    <button className='btn btn-sm text-white' onClick={this.cancelproduct}
                                        style={{ backgroundColor: "#0079BF" }}>Cancel</button>
                                </div>
                            </div>
                        </div>
                    </div>


                </div>
            </div>
        )
    }
}

export default withTranslation()(ProductCreation)