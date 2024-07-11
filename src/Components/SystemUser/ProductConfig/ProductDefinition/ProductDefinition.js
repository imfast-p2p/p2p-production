import React, { Component } from 'react';
import $ from 'jquery';
import { BASEURL } from '../../../assets/baseURL';
import SystemUserSidebar from '../../SystemUserSidebar';
import { withTranslation } from 'react-i18next';
import { FaPlus } from "react-icons/fa";
import { FaCheckCircle, FaTimesCircle, FaAngleLeft, FaThumbsUp, FaRegUser, FaEdit, FaMapMarkerAlt, FaHouseUser, FaUserEdit, FaFolderPlus, FaCalendar } from "react-icons/fa";
import dashboardIcon from '../../../assets/icon_dashboard.png';
import { Link } from 'react-router-dom';
import Multiselect from 'multiselect-react-dropdown';
import './ProductDefinition.css';
import openIt from '../../../assets/AdminImg/openit.png'
import us from '../../../assets/AdminImg/pro.png';
import editRole from '../../../assets/editRole.png';
import ReactPaginate from 'react-paginate';
import '../../../Borrower/Pagination.css';
import { confirmAlert } from "react-confirm-alert";
import pic3 from '../../../assets/AdminImg/picture.png';
import sysUser from '../../../assets/All.png';

export class ProductDefinition extends Component {
    constructor(props) {
        super(props)
        this.state = {
            makerPermissons: [],
            makerRoleName: "",

            productDefLists: [],
            productid: "",
            prodName: "",
            prodActive: "",
            productStatus: "",

            offset: 0,
            perPage: 5,
            currentPage: 0,
            pageCount: "",

            offset2: 0,
            currentPage2: 0,
            pageCount2: "",
            produList: [],
            orgtableData2: [],

            loanPurposeGroupList: [],
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
            rolePermissons: [],
            commonMakerCheckerName: ""
        }
    }
    componentDidMount() {
        // this.getproductDefProductInfo();
        var storedArrayStringJSON = sessionStorage.getItem("rolePermData")
        var storedArray = JSON.parse(storedArrayStringJSON);
        console.log(storedArray);
        if (storedArray) {
            storedArray.forEach(element => {
                if (element.rolename === "UPDATE_PROD_INFO") {
                    console.log(element.permissions);
                    this.setState({
                        makerPermissons: element.permissions,
                        makerRoleName: element.rolename,
                        commonMakerCheckerName: element.rolename
                    })
                }
                if (element.rolename === "APPROVE_PROD_INFO") {
                    console.log(element.permissions);
                    this.setState({ commonMakerCheckerName: element.rolename })
                }
            });
        }
        if (sessionStorage.getItem("approvePrdtFlag")) {
            sessionStorage.removeItem("approvePrdtFlag")
        }
        if (sessionStorage.getItem("editFlag")) {
            sessionStorage.removeItem("editFlag")
        }
        this.getLoanProductlist();
    }
    getLoanProductlist = () => {
        fetch(BASEURL + "/lsp/getloanproductlist", {
            method: "GET",
            headers: {
                Authorization: "Bearer " + sessionStorage.getItem("token"),
            },
        })
            .then((response) => {
                console.log("Response:", response);
                return response.json();
            })
            .then((resdata) => {
                console.log(resdata);
                if (resdata.status == "SUCCESS") {
                    this.setState({ produList: resdata.msgdata });

                    var data = resdata.msgdata
                    console.log(data)
                    var slice = data.slice(this.state.offset2, this.state.offset2 + this.state.perPage)
                    console.log(slice)

                    this.setState({
                        pageCount2: Math.ceil(data.length / this.state.perPage),
                        orgtableData2: data,
                        produList: slice
                    })
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
            .catch(err => {
                console.log(err.message)
            })
    }
    handlePageClick2 = (event) => {
        const selectedPage = event.selected;
        const offset = selectedPage * this.state.perPage;
        this.setState({
            currentPage2: selectedPage,
            offset2: offset
        }, () => {
            this.loadMoreData2();
        })
    }
    loadMoreData2 = () => {
        const data = this.state.orgtableData2;
        const slice = data.slice(this.state.offset2, this.state.offset2 + this.state.perPage)
        this.setState({
            pageCount2: Math.ceil(data.length / this.state.perPage),
            produList: slice
        })
    }

    handlePageClick = (event) => {
        const selectedPage = event.selected;
        const offset = selectedPage * this.state.perPage;
        this.setState({
            currentPage: selectedPage,
            offset: offset
        }, () => {
            this.loadMoreData();
        })
    }
    loadMoreData = () => {
        const data = this.state.orgtableData;
        const slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
        this.setState({
            pageCount: Math.ceil(data.length / this.state.perPage),
            productDefLists: slice
        })
    }
    prodIDSearch = (e) => {
        this.setState({ productid: e.target.value });
        console.log(e.target.value)
    }
    prodName = (e) => {
        this.setState({ prodName: e.target.value })
        console.log(this.state.prodName)
    }
    prodActive = (e) => {
        this.setState({ prodActive: e.target.value })
        console.log(this.state.prodActive)
    }
    getproductDefProductInfo = (approvPrdtFlag) => {
        let prodID = "productid=" + this.state.productid;
        let prodName = "&productname=" + this.state.prodName;
        let isActive = "&isactive=" + this.state.prodActive;

        let url = BASEURL + '/lms/getproductdefproductinfo?';
        let params = (this.state.productid ? prodID : "") + (this.state.prodName ? prodName : "")
            + (this.state.prodActive ? isActive : "")
        fetch(url + params, {
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

                    var list = resdata.msgdata;
                    console.log(list);
                    this.setState({ productDefLists: list })

                    var data = resdata.msgdata
                    console.log(data)
                    var slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
                    console.log(slice)

                    this.setState({
                        pageCount: Math.ceil(data.length / this.state.perPage),
                        orgtableData: data,
                        productDefLists: slice
                    })

                    if (approvPrdtFlag === "approvePrdtFlag" && this.state.commonMakerCheckerName === "APPROVE_PROD_INFO") {
                        console.log(approvPrdtFlag)
                        sessionStorage.setItem("approvePrdtFlag", "true")
                    }
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

    productAttribute = (productid, productname, productdesc, currencycode, membergroup, statusid, proddefinfo, disbursetosupplier) => {
        sessionStorage.setItem("productID", productid);
        // sessionStorage.setItem("SysproductAuth", authorized);
        sessionStorage.setItem("prodName", productname);
        sessionStorage.setItem("prodDesc", productdesc)
        sessionStorage.setItem("currencyCode", currencycode);
        sessionStorage.setItem("memberGrp", membergroup);
        sessionStorage.setItem("isActive", statusid)
        sessionStorage.setItem("isdisbursed", disbursetosupplier)

        let stringDefInfo = JSON.stringify(proddefinfo);
        sessionStorage.setItem("prodDefInfo", stringDefInfo);
        console.log(proddefinfo)
        console.log(stringDefInfo)
        sessionStorage.getItem("prodDefInfo");
        window.location = "/productAttribute";
    }
    productAttributeActive = (prodid,
        prodname,
        proddesc,
        statusid,
        disbursetosupplier) => {
        sessionStorage.setItem("productID", prodid);
        // sessionStorage.setItem("SysproductAuth", authorized);
        sessionStorage.setItem("prodName", prodname);
        sessionStorage.setItem("prodDesc", proddesc)
        sessionStorage.setItem("isActive", statusid)
        sessionStorage.setItem("isdisbursed", disbursetosupplier)
        this.getParticularproduct(prodid, prodname)

    }
    // viewProductAttributeActive = (lists) => {
    //     console.log(lists.prodid,
    //         lists.prodname,
    //         lists.proddesc,
    //         lists.statusid)
    //     sessionStorage.setItem("productID", prodid);
    //     sessionStorage.setItem("prodName", prodname);
    //     sessionStorage.setItem("prodDesc", proddesc)
    //     sessionStorage.setItem("isActive", statusid)
    //     this.getParticularproduct(prodid, prodname)
    // }
    getParticularproduct = (prodid, prodname) => {
        fetch(BASEURL + '/lms/getproductdefproductinfo?productid=' + prodid + "&productname=" + prodname + "&isactive=1", {
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
                    console.log(resdata.msgdata);
                    var arrayList = resdata.msgdata;
                    let stringDefInfo;
                    arrayList.map((list, index) => {
                        return (
                            sessionStorage.setItem("currencyCode", list.currencycode),
                            sessionStorage.setItem("memberGrp", list.membergroup),

                            stringDefInfo = JSON.stringify(list.proddefinfo),
                            sessionStorage.setItem("prodDefInfo", stringDefInfo)
                        )
                    })

                    console.log(stringDefInfo)
                    window.location = "/productAttribute";
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
    deletePendingProduct = (productid, productname) => {
        fetch(BASEURL + `/lms/deletependingproduct`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                productid: productid,
                productname: productname,
            })
        }).then(response => {
            console.log(response)
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata)
                if (resdata.status == 'Success') {
                    console.log(resdata.msgdata);
                    confirmAlert({
                        message: resdata.message,
                        buttons: [
                            {
                                label: "Okay",
                                onClick: () => {
                                    this.getproductDefProductInfo();
                                },
                            },
                        ],
                    });

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
            .catch(err => {
                console.log(err.message)
            })
    }
    productStatus = (e) => {
        this.setState({ productStatus: e.target.value })
    }
    enableDisableActiveproduct = (prodid, prodname) => {
        this.setState({ productid: prodid });
        this.setState({ prodName: prodname });
        $("#enableDisableModal").click();
    }
    SubmitenableDisableActiveproduct = () => {
        fetch(BASEURL + `/lms/enabledisableactiveproduct`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                productid: this.state.productid,
                productname: this.state.prodName,
                status: this.state.productStatus
            })
        }).then(response => {
            console.log(response)
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata)
                if (resdata.status == 'Success') {
                    console.log(resdata.msgdata)
                    confirmAlert({
                        message: resdata.message,
                        buttons: [
                            {
                                label: "Okay",
                                onClick: () => {
                                    this.getLoanProductlist();
                                },
                            },
                        ],
                    });
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
            .catch(err => {
                console.log(err.message)
            })
    }

    // New
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
                    // alert(resdata.message)
                    confirmAlert({
                        message: resdata.message,
                        buttons: [
                            {
                                label: "Okay",
                                onClick: () => {
                                    window.location.reload();
                                },
                            },
                        ],
                    });
                } else {
                    // alert(resdata.message);
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
                                    window.location.reload()
                                    this.getLoanPurpose();
                                    this.getLoanPurposeGroup()
                                    // $("#setLoanGroup").click();
                                },
                            },
                        ],
                    });

                } else {
                    // alert("Issue: " + resdata.message);
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
                                    // this.getLoanPurpose();
                                },
                            },
                        ],
                    });
                } else {
                    // alert(resdata.message);
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
                    // alert(resdata.message)
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
                } else {
                    // alert(resdata.message);
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
        const { makerRoleName, makerPermissons, commonMakerCheckerName } = this.state;
        return (
            <div className="container-dashboard d-flex flex-row" id="wrapper" style={{ backgroundColor: "#f4f7fc" }}>
                <SystemUserSidebar />
                <div className="pl-3 pr-3 main-content" id="page-content-wrapper">
                    <div className="container-fluid row pt-2">
                        <div className="col-1" id="ProductDefRes1">
                            <button style={{ marginLeft: "25px" }} onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className='col-4' id="ProductDefRes2" style={{ marginLeft: "20px", marginTop: "5px" }}>
                            <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                <Link to="/sysUserDashboard">Home</Link> / Product List </p>
                        </div>
                        <div className='col'>

                        </div>
                        <div className='col'>

                        </div>
                        <div className='col-3'>

                        </div>
                        <div className="col" id="ProductDefRes3">
                            <button style={myStyle}>
                                <Link to="/sysUserDashboard" style={{ marginLeft: "10px" }}><FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} /><span style={{ textDecoration: "none", color: "white" }}>Back</span></Link></button>
                        </div>

                    </div>
                    <hr className="col-11" style={{ marginLeft: "50px", width: "88.6%", backgroundColor: "rgba(4,78,160,1)" }} />
                    {/* New Design */}
                    <div className='container-fluid row' style={{ paddingLeft: "86px", marginTop: "-20px" }}>
                        <div className='card' style={{ cursor: "default" }}>
                            <div className='row pt-2 pl-2 pr-2'>
                                <div className='col'>
                                    <ul role="tablist" className="nav nav-pills nav-fill mb-3" >
                                        <li className="nav-item"><a data-toggle="pill" id="myNavLink" href="#activeproducts" className="nav-link active"
                                            style={{ textAlign: "center", paddingTop: "10px", paddingBottom: "10px", fontWeight: "bold" }}><img src={sysUser} style={{ width: "20px" }} /> &nbsp; {t('Products')} </a> </li>
                                        <li className="nav-item" onClick={() => this.getproductDefProductInfo("approvePrdtFlag")}><a data-toggle="pill" id="myNavLink" href="#Inactiveproducts" className="nav-link"
                                            style={{ textAlign: "center", paddingTop: "10px", paddingBottom: "10px", fontWeight: "bold" }}><img src={pic3} style={{ width: "30px" }} /> &nbsp;
                                            {commonMakerCheckerName === "UPDATE_PROD_INFO" ?
                                                "Draft Products" : commonMakerCheckerName === "APPROVE_PROD_INFO" ? "Pending Product Approval" : ""}
                                        </a> </li>
                                        {makerRoleName === "UPDATE_PROD_INFO" ?
                                            <li className="nav-item"><a data-toggle="pill" id="myNavLink" href="#createMasters" className="nav-link"
                                                style={{ textAlign: "center", paddingTop: "10px", paddingBottom: "10px", fontWeight: "bold" }}>
                                                <FaCalendar style={{ color: "rgb(40, 116, 166)" }} />
                                                &nbsp;{t('Create Masters')} </a>
                                            </li>
                                            :
                                            ""
                                        }
                                    </ul>
                                </div>
                            </div>
                            <div className="tab-content h-100">
                                <div class="tab-pane fade show active " id="activeproducts" role="tabpanel" style={{ marginBottom: "20px" }}>
                                    <div className='' id="" >
                                        <div style={{
                                            whiteSpace: "nowrap"
                                        }} id=''>
                                            <div className='row font-weight-normal'
                                                style={{
                                                    marginLeft: "10px",
                                                    fontWeight: "800",
                                                    fontSize: "15px",
                                                    color: "rgba(5,54,82,1)",
                                                }}>
                                                <div className='col-3'>
                                                    <p style={{ fontWeight: "600" }}>{t('Product ID')}</p>
                                                </div>
                                                <div className='col-4'>
                                                    <p style={{ fontWeight: "600" }}>{t('Product Name')}</p>
                                                </div>
                                                <div className='col-2'>
                                                    <p style={{ fontWeight: "600" }}>{t('Status')}</p>
                                                </div>
                                                <div className='col-3' style={{ textAlign: "end", marginLeft: "-10px" }}>
                                                    <Link to="/productCreation" style={{ textDecoration: "none" }}>
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm text-white"
                                                            style={{
                                                                backgroundColor: "#0079bf",
                                                                marginTop: "-10px"
                                                            }}
                                                        >
                                                            &nbsp;<img src={us} style={{ width: "20px" }} />&nbsp;
                                                            {t("Create Product")}
                                                        </button>
                                                    </Link>
                                                </div>
                                            </div>
                                            <hr className="col-12" style={{ marginLeft: "10px", width: "94%", marginTop: "-7px", backgroundColor: "rgba(4,78,160,1)" }} />

                                            {/* Lists */}
                                            {
                                                this.state.produList.map((lists, index) => {
                                                    return (
                                                        <div className='col' key={index}>
                                                            <div className='card border-0' style={{ marginBottom: "-14.7px", transition: 'none', overflow: "visible", color: "rgb(5, 54, 82)", cursor: 'default', backgroundColor: (index % 2 == 0) ? 'rgba(255,255,255,1)' : 'rgba(242,242,242,1)' }}>
                                                                <div className="row item-list align-items-center">
                                                                    <div className="col-3" style={{ paddingLeft: "20px" }}>
                                                                        <p className="ml-2 p-0" style={{ fontSize: "15px", fontWeight: "490", marginBottom: "-3px" }}>{lists.prodid}</p>
                                                                    </div >
                                                                    <div className="col-4">
                                                                        <p style={{ fontSize: "15px", fontWeight: "490", marginLeft: "12px", marginBottom: "-3px" }}>{lists.prodname}</p>
                                                                    </div >
                                                                    <div className="col-2">
                                                                        {lists.statusid == "0" ? <p style={{ color: "rgb(199, 188, 34)", fontWeight: "600", marginLeft: "13px", marginBottom: "-3px" }}>Inactive</p> : <p style={{ color: "rgb(29, 143, 63)", fontWeight: "600", marginLeft: "13px", marginBottom: "-3px" }}>Active</p>}
                                                                    </div>
                                                                    <div className="col-3" style={{ textAlign: "end" }}>
                                                                        <p class="dropup">
                                                                            <img src={openIt} style={{ height: "35px", marginBottom: "-10px" }}
                                                                                class="btn dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" />
                                                                            &nbsp;
                                                                            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton" style={{ marginLeft: "-69px" }}>
                                                                                {/* <a class="dropdown-item" onClick={this.viewProductAttributeActive.bind(this, lists)}>View Product Attributes</a> */}
                                                                                <a class="dropdown-item" onClick={this.productAttributeActive.bind(this, lists.prodid,
                                                                                    lists.prodname, lists.proddesc, lists.statusid, lists.disbursetosupplier)}>
                                                                                    View Product Attributes
                                                                                </a>
                                                                                <a class="dropdown-item" onClick={this.enableDisableActiveproduct.bind(this, lists.prodid, lists.prodname)}>Enable/ Disable Product</a>
                                                                            </div>
                                                                        </p>
                                                                    </div>
                                                                </div >
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            }
                                            &nbsp;
                                            <div className="row" style={{ marginTop: "-10px" }}>
                                                <div className='col'></div>
                                                <div className='col' style={{ marginRight: "15px" }}>
                                                    <div className='card border-0' style={{ height: "40px" }}>
                                                        <ReactPaginate
                                                            previousLabel={"<"}
                                                            nextLabel={">"}
                                                            breakLabel={"..."}
                                                            breakClassName={"break-me"}
                                                            pageCount={this.state.pageCount2}
                                                            onPageChange={this.handlePageClick2}
                                                            containerClassName={"pagination Customer"}
                                                            subContainerClassName={"pages pagination"}
                                                            activeClassName={"active"}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="tab-pane fade show" id="Inactiveproducts" role="tabpanel" style={{ marginBottom: "20px" }}>
                                    {/* <div className='row' style={{ marginTop: "-20px", paddingLeft: "10px", paddingRight: "10px" }}>
                                        <div className='col'>
                                            <div className="card" style={{ cursor: 'default', borderRadius: "7px", padding: "10px" }}>
                                                <div className='row mb-3'>
                                                    <div className='col-3'>
                                                        <p style={{
                                                            fontWeight: "600",
                                                            fontSize: "13px", marginLeft: "0px", color: "rgba(5,54,82,1)",
                                                            marginBottom: "5px"
                                                        }}>{t('Product ID')}</p>
                                                        <input className='form-control' type='text' placeholder='Enter Product ID'
                                                            style={{ height: "34px", color: "rgb(0, 121, 191)", border: "1.5px solid rgb(0, 121, 191)" }} onChange={this.prodIDSearch} />
                                                    </div>
                                                    <div className='col-3'>
                                                        <p style={{
                                                            fontWeight: "600",
                                                            fontSize: "13px", marginLeft: "0px", color: "rgba(5,54,82,1)",
                                                            marginBottom: "5px"
                                                        }}>{t('Product Name')}</p>
                                                        <input className='form-control' type='text' placeholder='Enter Product Name'
                                                            style={{ height: "34px", color: "rgb(0, 121, 191)", border: "1.5px solid rgb(0, 121, 191)" }} onChange={this.prodName} />
                                                    </div>
                                                    <div className='col-3'>
                                                        <p style={{
                                                            fontWeight: "600",
                                                            fontSize: "13px", marginLeft: "0px", color: "rgba(5,54,82,1)",
                                                            marginBottom: "5px"
                                                        }}>{t('Active Status')}</p>
                                                        <select className='form-select' style={{ height: "34px", color: "rgb(0, 121, 191)", border: "1.5px solid rgb(0, 121, 191)" }} onChange={this.prodActive}>
                                                            <option defaultValue>{t('Select')}</option>
                                                            <option value="0">{t('Inactive')}</option>
                                                            <option value="1">{t('Active')}</option>
                                                        </select>
                                                    </div>
                                                    <div className='col-3'>
                                                        <button type="button" className="btn btn-sm text-white" style={{
                                                            backgroundColor: "rgb(0, 121, 191)",
                                                            paddingLeft: "40px", paddingRight: "40px", marginTop: "25px"
                                                        }}
                                                            onClick={this.getproductDefProductInfo}>{t('Apply')}</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div> */}
                                    <div className='' id="" >
                                        <div style={{
                                            whiteSpace: "nowrap"
                                        }} id=''>
                                            <div className='row font-weight-normal'
                                                style={{
                                                    marginLeft: "10px",
                                                    fontWeight: "800",
                                                    fontSize: "15px",
                                                    color: "rgba(5,54,82,1)",
                                                }}>
                                                <div className='col-3'>
                                                    <p style={{ fontWeight: "600" }}>{t('Product ID')}</p>
                                                </div>
                                                <div className='col-4'>
                                                    <p style={{ fontWeight: "600" }}>{t('Product Name')}</p>
                                                </div>
                                                <div className='col-2'>
                                                    <p style={{ fontWeight: "600" }}>{t('Status')}</p>
                                                </div>
                                                <div className='col-3' style={{ textAlign: "end", marginLeft: "-10px" }}>
                                                    <Link to="/productCreation" style={{ textDecoration: "none" }}>
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm text-white"
                                                            style={{
                                                                backgroundColor: "#0079bf",
                                                                marginTop: "-10px"
                                                            }}
                                                        >
                                                            &nbsp;<img src={us} style={{ width: "20px" }} />&nbsp;
                                                            {t("Create Product")}
                                                        </button>
                                                    </Link>
                                                </div>
                                            </div>
                                            <hr className="col-12" style={{ marginLeft: "10px", width: "94%", marginTop: "-7px", backgroundColor: "rgba(4,78,160,1)" }} />

                                            {/* Lists */}
                                            {
                                                this.state.productDefLists.map((lists, index) => {
                                                    return (
                                                        <div className='col' key={index}>
                                                            <div className='card border-0' style={{ marginBottom: "-14.7px", transition: 'none', overflow: "visible", color: "rgb(5, 54, 82)", cursor: 'default', backgroundColor: (index % 2 == 0) ? 'rgba(255,255,255,1)' : 'rgba(242,242,242,1)' }}>
                                                                <div className="row item-list align-items-center">
                                                                    <div className="col-3" style={{ paddingLeft: "20px" }}>
                                                                        <p className="ml-2 p-0" style={{ fontSize: "15px", fontWeight: "490", marginBottom: "-3px" }}>{lists.productid}</p>
                                                                    </div >
                                                                    <div className="col-4">
                                                                        <p style={{ fontSize: "15px", fontWeight: "490", marginLeft: "12px", marginBottom: "-3px" }}>{lists.productname}</p>
                                                                    </div >
                                                                    <div className="col-2">
                                                                        {lists.statusid == "0" ? <p style={{ color: "rgb(199, 188, 34)", fontWeight: "600", marginLeft: "13px", marginBottom: "-3px" }}>Inactive</p> : <p style={{ color: "rgb(29, 143, 63)", fontWeight: "600", marginLeft: "13px", marginBottom: "-3px" }}>Active</p>}
                                                                    </div>
                                                                    <div className="col-3" style={{ textAlign: "end" }}>
                                                                        <p class="dropup">
                                                                            <img src={openIt} style={{ height: "35px", marginBottom: "-10px" }}
                                                                                class="btn dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" />
                                                                            &nbsp;
                                                                            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton" style={{ marginLeft: "-69px" }}>
                                                                                <a class="dropdown-item" onClick={this.productAttribute.bind(this, lists.productid,
                                                                                    lists.productname, lists.productdesc, lists.currencycode, lists.membergroup, lists.statusid, lists.proddefinfo, lists.disbursetosupplier)}>
                                                                                    {commonMakerCheckerName === "UPDATE_PROD_INFO" ?
                                                                                        "View/ Edit Product Attributes" :
                                                                                        commonMakerCheckerName === "APPROVE_PROD_INFO" ? "View/ Approve Product Attributes" : ""}
                                                                                </a>
                                                                                <a class="dropdown-item" onClick={this.deletePendingProduct.bind(this, lists.productid, lists.productname)}>Delete Product</a>
                                                                            </div>
                                                                        </p>
                                                                    </div>
                                                                </div >
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            }
                                            &nbsp;
                                            <div className="row" style={{ marginTop: "-10px" }}>
                                                <div className='col'></div>
                                                <div className='col' style={{ marginRight: "15px" }}>
                                                    <div className='card border-0' style={{ height: "40px" }}>
                                                        <ReactPaginate
                                                            previousLabel={"<"}
                                                            nextLabel={">"}
                                                            breakLabel={"..."}
                                                            breakClassName={"break-me"}
                                                            pageCount={this.state.pageCount}
                                                            onPageChange={this.handlePageClick}
                                                            containerClassName={"pagination Customer"}
                                                            subContainerClassName={"pages pagination"}
                                                            activeClassName={"active"}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* <div className='row font-weight-normal' style={{ fontWeight: "800", fontSize: "15px", color: "rgba(5,54,82,1)", marginLeft: "10px" }}>
                                        <div className='col-2'>
                                            <p style={{ fontWeight: "600" }}>{t('Product ID')}</p>
                                        </div>
                                        <div className='col-2' style={{ textAlign: "center" }}>
                                            <p style={{ fontWeight: "600" }}>{t('Product Name')}</p>
                                        </div>
                                        <div className='col-3' style={{ textAlign: "end" }}>
                                            <p style={{ fontWeight: "600" }}>{t('Product Description')}</p>
                                        </div>
                                        <div className='col-2' style={{ textAlign: "end" }}>
                                            <p style={{ marginRight: "-20px", fontWeight: "600" }}>{t('Active Status')}</p>
                                        </div>
                                        <div className='col-3' style={{ textAlign: "center" }}>
                                            <Link to="/productCreation" style={{ textDecoration: "none" }}>
                                                <button
                                                    type="button"
                                                    className="btn btn-sm text-white"
                                                    style={{
                                                        backgroundColor: "#0079bf",
                                                        marginTop: "-10px"
                                                    }}
                                                >
                                                    &nbsp;<img src={us} style={{ width: "20px" }} />&nbsp;
                                                    {t("Create Product")}
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                    <hr className="col-12" style={{ marginLeft: "13px", width: "94%", marginTop: "-10px" }} />
                                    <div className="">
                                        {
                                            this.state.productDefLists.map((lists, index) => {
                                                return (
                                                    <div className='col' key={index}>
                                                        <div className='card border-0'
                                                            style={{ marginBottom: "-10px", transition: 'none', overflow: "visible", cursor: "default", backgroundColor: (index % 2 == 0) ? 'rgba(255,255,255,1)' : 'rgba(242,242,242,1)' }}>
                                                            <div className="card-header" style={{ paddingRight: "21px", paddingTop: "10px", paddingBottom: "6px", color: "rgb(5, 54, 82)" }}>
                                                                <div className="row item-list align-items-center">
                                                                    <div class="col-2">
                                                                        <p>{lists.productid}</p>
                                                                    </div>
                                                                    <div class="col-2" >
                                                                        <p style={{ marginLeft: "10px" }}>{lists.productname}</p>
                                                                    </div>
                                                                    <div class="col-4" style={{ textAlign: "center" }}>
                                                                        <p>{lists.productdesc}</p>
                                                                    </div>
                                                                    <div className='col-2' >
                                                                        {lists.statusid == "0" ? <p style={{ color: "rgb(199, 188, 34)", fontWeight: "600", marginLeft: "20px" }}>Inactive</p> : <p style={{ color: "rgb(29, 143, 63)", fontWeight: "600", marginLeft: "20px" }}>Active</p>}
                                                                    </div>
                                                                    <div class="col-2" style={{ textAlign: "end" }}>
                                                                        <p class="dropup">
                                                                            <img src={openIt} style={{ height: "35px" }}
                                                                                class="btn dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" />
                                                                            &nbsp;
                                                                            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton" style={{ marginLeft: "-160px" }}>
                                                                                <a class="dropdown-item" onClick={this.productAttribute.bind(this, lists.productid,
                                                                                    lists.productname, lists.productdesc, lists.currencycode, lists.membergroup, lists.statusid, lists.proddefinfo)}>Edit Product Attributes</a>
                                                                                <a class="dropdown-item" onClick={this.deletePendingProduct.bind(this, lists.productid, lists.productname)}>Delete Product</a>
                                                                            </div>
                                                                        </p>
                                                                    </div>
                                                                </div >
                                                            </div >
                                                        </div>
                                                    </div>
                                                )
                                            }
                                            )
                                        }


                                    </div>
                                    <div className="row">
                                        <div className='col'></div>
                                        <div className='col' style={{ marginRight: "15px" }}>
                                            <div className='card border-0' style={{ height: "40px" }}>
                                                <ReactPaginate
                                                    previousLabel={"<"}
                                                    nextLabel={">"}
                                                    breakLabel={"..."}
                                                    breakClassName={"break-me"}
                                                    pageCount={this.state.pageCount}
                                                    onPageChange={this.handlePageClick}
                                                    containerClassName={"pagination Customer"}
                                                    subContainerClassName={"pages pagination"}
                                                    activeClassName={"active"}
                                                />
                                            </div>
                                        </div>
                                    </div> */}
                                </div>
                                <div class="tab-pane fade show" id="createMasters" role="tabpanel" style={{ marginBottom: "20px" }}>

                                    <div className='row' style={{ marginTop: "-20px" }}>
                                        <div class="col-md-4 mb-3">
                                            <ul class="nav nav-pills flex-column" id="myTab1" role="tablist" style={{ textAlign: "center", fontSize: "18px", fontFamily: "Poppins,sans-serif" }}>
                                                <li class="nav-item">
                                                    <a class="nav-link active" id="prodType-tab" data-toggle="tab"
                                                        href="#profile" role="tab" aria-controls="profile" aria-selected="false" value="3" style={{ textAlign: "start" }}>Create Product Type</a>
                                                </li>
                                                {makerPermissons.map((permission, index) => {
                                                    if (permission.permissionname === "SET_LOAN_PURPOSE_GROUP" && permission.status === "1") {
                                                        return (
                                                            <li class="nav-item" style={{ marginTop: "-30px" }}>
                                                                <a class="nav-link" id="loanPurposeGp-tab" data-toggle="tab"
                                                                    href="#profile2" role="tab" aria-controls="profile" aria-selected="false" value="3" style={{ textAlign: "start" }}>Create Loan Purpose Group</a>
                                                            </li>
                                                        )
                                                    }
                                                })}
                                                {makerPermissons.map((permission, index) => {
                                                    if (permission.permissionname === "SET_LOAN_PURPOSE" && permission.status === "1") {
                                                        return (
                                                            <li class="nav-item" style={{ marginTop: "-30px" }} onClick={this.getLoanPurposeGroup}>
                                                                <a class="nav-link" id="loanPurpose-tab" data-toggle="tab"
                                                                    href="#profile3" role="tab" aria-controls="profile" aria-selected="false" value="3" style={{ textAlign: "start" }}>Create Loan Purpose</a>
                                                            </li>
                                                        )
                                                    }
                                                })}
                                                {makerPermissons.map((permission, index) => {
                                                    if (permission.permissionname === "SET_MEMBER_GROUP" && permission.status === "1") {
                                                        return (
                                                            <li class="nav-item" style={{ marginTop: "-30px" }}>
                                                                <a class="nav-link" id="memberGroup-tab" data-toggle="tab"
                                                                    href="#profile4" role="tab" aria-controls="profile" aria-selected="false" value="3" style={{ textAlign: "start" }}>Create Member Group</a>
                                                            </li>
                                                        )
                                                    }
                                                })}
                                            </ul>
                                        </div>
                                        <div class="col-md-8" style={{ marginTop: "5px" }}>
                                            <div class="tab-content" id="myTabContent" style={{ marginLeft: "-20px" }}>
                                                <div class="tab-pane fade show active" id="profile" role="tabpanel" aria-labelledby="prodType-tab">
                                                    <div className="card" style={{ cursor: "default" }}>
                                                        <div className="card-header border-1 bg-white">
                                                            <div className="form-row">
                                                                <div className="form-group col-md-6">
                                                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Product Name *')}</p>
                                                                    <input type="text" class="form-control" onChange={this.prodtypename}
                                                                        placeholder="Product Name" style={{
                                                                            height: "37px", marginTop: "-10px",
                                                                            textTransform: 'uppercase'
                                                                        }} />
                                                                </div>
                                                                <div className="form-group col-md-6">
                                                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Product Type *')}</p>
                                                                    <input type="text" class="form-control" maxLength={6} onChange={this.prodtype}
                                                                        placeholder="Product Type" style={{ height: "37px", marginTop: "-10px" }} />
                                                                </div>
                                                            </div>
                                                            <div className="form-row">
                                                                <div className="form-group col">
                                                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Product Description *')}</p>
                                                                    <textarea type="text" class="form-control" onChange={this.prodtypedesc} rows={3} cols={30} maxLength={255}
                                                                        placeholder="Product Description" style={{ marginTop: "-10px" }}>
                                                                    </textarea>
                                                                </div>
                                                            </div>
                                                            <hr />

                                                            <div className="form-row" style={{ textAlign: "center" }}>
                                                                <div className="form-group col">
                                                                    {makerPermissons.map((permission, index) => {
                                                                        if (permission.permissionname === "SET_PRODUCT_TYPE" && permission.status === "1") {
                                                                            return (
                                                                                <button type="button" className="btn mr-2 text-white" style={{ backgroundColor: "rgb(136, 189, 72)" }}
                                                                                    onClick={this.setproductType}>Submit</button>
                                                                            )
                                                                        }
                                                                    })}
                                                                    <button type="button" className="btn text-white" style={{ backgroundColor: "#0079BF" }}
                                                                    >{t('Cancel')}</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="tab-pane fade show" id="profile2" role="tabpanel" aria-labelledby="loanPurposeGp-tab">
                                                    <div className="card" style={{ cursor: "default" }}>
                                                        <div className="card-header border-1 bg-white">
                                                            <div className="form-row">
                                                                <div className="form-group col-md-6">
                                                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Loan Purpose Group *')}</p>
                                                                    <input type="text" class="form-control" maxLength={6} onChange={this.loanpurposegroup}
                                                                        placeholder="Enter Purpose Group" style={{
                                                                            height: "38px", color: "rgb(5, 54, 82)", marginTop: "-10px",
                                                                            textTransform: 'uppercase'
                                                                        }} />
                                                                </div>
                                                                <div className="form-group col-md-6">
                                                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Loan Purpose Group Description *')}</p>
                                                                    <input type="text" class="form-control" onChange={this.loanpurposegrpdesc}
                                                                        placeholder="Loan Purpose Group Description" style={{ height: "38px", color: "rgb(5, 54, 82)", marginTop: "-10px" }} />
                                                                </div>
                                                            </div>
                                                            <div className="form-row">
                                                                <div className="form-group col-md-6">
                                                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Attribute ID *')}</p>
                                                                    <select className='form-select' style={{
                                                                        height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px",
                                                                        color: "rgba(5,54,82,1)"
                                                                    }} onChange={this.attributeid}>
                                                                        <option defaultValue>Select</option>
                                                                        <option value="A">A</option>
                                                                    </select>
                                                                </div>
                                                                <div className="form-group col-md-6">
                                                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Loan Size *')}</p>
                                                                    <select className='form-select' style={{
                                                                        height: "37px", backgroundColor: "rgb(247, 248, 250)",
                                                                        marginTop: "-10px", color: "rgba(5,54,82,1)"
                                                                    }} onChange={this.loansize}>
                                                                        <option defaultValue>Select</option>
                                                                        <option value="SMALL">SMALL</option>
                                                                        <option value="VERY SMALL">VERY SMALL</option>
                                                                        <option value="MEDIUM">MEDIUM</option>
                                                                        <option value="LARGE">LARGE</option>
                                                                        <option value="VERY LARGE">VERY LARGE</option>
                                                                    </select>
                                                                </div>
                                                            </div>

                                                            <hr />
                                                            <div className="form-row" style={{ textAlign: "center" }}>
                                                                <div className="form-group col">
                                                                    <button type="button" className="btn mr-2 text-white" style={{ backgroundColor: "rgb(136, 189, 72)" }}
                                                                        onClick={this.setLoanPurposeGroup}>Submit</button>
                                                                    <button type="button" className="btn text-white" style={{ backgroundColor: "#0079BF" }}
                                                                    >{t('Cancel')}</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="tab-pane fade show" id="profile3" role="tabpanel" aria-labelledby="loanPurpose-tab">
                                                    <div className="card" style={{ cursor: "default" }}>
                                                        <div className="card-header border-1 bg-white">
                                                            <div className="form-row">
                                                                <div className="form-group col-md-6">
                                                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Loan Purpose Group *')}</p>
                                                                    <select className='form-select' style={{
                                                                        height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px",
                                                                        color: "rgba(5,54,82,1)"
                                                                    }} onChange={this.loanpurposegrp}>
                                                                        <option defaultValue>Select</option>
                                                                        {this.state.loanPurposeGroupList.map((purpose, index) => (
                                                                            <option key={index} value={purpose.loanpurgrp} >{purpose.loanpurgrp} </option>
                                                                        ))
                                                                        }
                                                                    </select>
                                                                </div>
                                                                <div className="form-group col-md-6">
                                                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Loan Purpose *')}</p>
                                                                    <textarea type="text" class="form-control" onChange={this.loanpurpose} rows={3} cols={30} maxLength={255}
                                                                        placeholder="Loan Purpose" style={{ color: "rgb(5, 54, 82)", marginTop: "-10px" }}>
                                                                    </textarea>
                                                                </div>
                                                            </div>
                                                            <hr />
                                                            <div className="form-row" style={{ textAlign: "center" }}>
                                                                <div className="form-group col">
                                                                    <button type="button" className="btn mr-2 text-white" style={{ backgroundColor: "rgb(136, 189, 72)" }}
                                                                        onClick={this.setLoanPurpose}>Submit</button>
                                                                    <button type="button" className="btn text-white" style={{ backgroundColor: "#0079BF" }}
                                                                    >{t('Cancel')}</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="tab-pane fade show" id="profile4" role="tabpanel" aria-labelledby="memberGroup-tab">
                                                    <div className="card" style={{ cursor: "default" }}>
                                                        <div className="card-header border-1 bg-white">
                                                            <div className="form-row">
                                                                <div className="form-group col-md-6">
                                                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Member Group *')}</p>
                                                                    <input type="text" class="form-control" maxLength={6} onChange={this.membergrp}
                                                                        placeholder="Member Group" style={{
                                                                            height: "38px", color: "rgb(5, 54, 82)", marginTop: "-10px",
                                                                            textTransform: 'uppercase'
                                                                        }} />
                                                                </div>
                                                                <div className="form-group col-md-6">
                                                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Group Category *')}</p>
                                                                    <input type="text" class="form-control" onChange={this.membergrpcategory}
                                                                        placeholder="Group Category" style={{ height: "38px", color: "rgb(5, 54, 82)", marginTop: "-10px" }} />
                                                                </div>
                                                            </div>
                                                            <div className="form-row">
                                                                <div className="form-group col-6">
                                                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Verification Needed *')}</p>
                                                                    <select className="form-select border border-secondary" onChange={this.vneed} style={{ marginTop: "-10px", color: "RGBA(5,54,82,1)", height: "37px" }} >
                                                                        <option defaultValue>Select</option>
                                                                        <option value="1">Yes</option>
                                                                        <option value="0">No</option>
                                                                    </select>
                                                                </div>
                                                                <div className="form-group col-6">
                                                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Verification Type *')}</p>
                                                                    <input type="text" class="form-control" onChange={this.vtype}
                                                                        placeholder="Verification Type" style={{ height: "38px", color: "rgb(5, 54, 82)", marginTop: "-10px" }} />
                                                                </div>
                                                            </div>
                                                            <div className="form-row">
                                                                <div className="form-group col">
                                                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Group Description *')}</p>
                                                                    <textarea type="text" class="form-control" onChange={this.membergrpdesc} rows={3} cols={30} maxLength={255}
                                                                        placeholder="Group Description" style={{ color: "rgb(5, 54, 82)", marginTop: "-10px" }}>
                                                                    </textarea>
                                                                </div>
                                                            </div>
                                                            <hr />

                                                            <div className="form-row" style={{ textAlign: "center" }}>
                                                                <div className="form-group col">
                                                                    <button type="button" className="btn mr-2 text-white" style={{ backgroundColor: "rgb(136, 189, 72)" }}
                                                                        onClick={this.setMemberGroup}>Submit</button>
                                                                    <button type="button" className="btn text-white" style={{ backgroundColor: "#0079BF" }}
                                                                    >{t('Cancel')}</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/*enableDisableModal*/}
                    <button type="button" id='enableDisableModal' style={{ display: "none" }} class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter">
                        Enable Disable modal
                    </button>
                    <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered" role="document">
                            <div class="modal-content">
                                <div class="modal-body">
                                    <div className='row'>
                                        <div className='col' style={{}}>
                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold", paddingLeft: "10px" }}><img src={editRole} width="25px" />Enable/Disable Product</p>
                                            <hr style={{ width: "50px", marginTop: "-10px" }} />

                                            <div className='row mb-2'>
                                                <div className='col' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                    <p style={{ fontWeight: "500" }}>Product ID</p>
                                                    <input className='form-control' type="text" autoComplete="off" style={{
                                                        height: "37px", backgroundColor: "rgb(247, 248, 250)",
                                                        marginTop: "-10px", textTransform: 'uppercase'
                                                    }} readOnly value={this.state.productid} />
                                                </div>
                                            </div>
                                            <div className='row mb-2'>
                                                <div className='col' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                    <p style={{ fontWeight: "500" }}>Product Name</p>
                                                    <input className='form-control' type="text" autoComplete="off" style={{
                                                        height: "37px", backgroundColor: "rgb(247, 248, 250)",
                                                        marginTop: "-10px"
                                                    }} readOnly value={this.state.prodName} />
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className='col' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                    <p style={{ fontWeight: "500" }}>Status</p>
                                                    <select className='form-select' onChange={this.productStatus} style={{ marginTop: "-10px" }}>
                                                        <option defaultValue>Select Status</option>
                                                        <option value="1">Enable</option>
                                                        <option value="0">Disable</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <hr style={{ backgroundColor: "rgba(5,54,82,1)" }} />
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col' style={{ textAlign: "center" }}>
                                            <button type="button" class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.SubmitenableDisableActiveproduct}>Submit</button>&nbsp;
                                            <button type="button" class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "#0079bf" }} >Cancel</button>
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

export default withTranslation()(ProductDefinition)