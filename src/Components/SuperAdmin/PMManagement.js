import React, { Component } from 'react';
import $ from 'jquery';
import { BASEURL } from '../assets/baseURL';
import { withTranslation } from 'react-i18next';
import {
    FaCheckCircle, FaTimesCircle, FaAngleLeft,
    FaThumbsUp, FaRegUser, FaEdit, FaMapMarkerAlt,
    FaHouseUser, FaUserEdit, FaFolderPlus, FaCalendar
} from "react-icons/fa";
import { Link } from 'react-router-dom';
import openIt from './../assets/AdminImg/openit.png'
import batch from '../assets/batch.png';
import AdminSidebar from '../Admin/AdminSidebar';
import ReactPaginate from 'react-paginate';
import './../Borrower/Pagination.css';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'
import { confirmAlert } from "react-confirm-alert";
import SimpleReactValidator from 'simple-react-validator';
import { BsArrowRepeat, BsInfoCircle } from "react-icons/bs";
import us from '../assets/AdminImg/pro.png';
var jsonDataArray = [];
var today;
export class PMManagement extends Component {
    constructor(props) {
        super(props)
        this.state = {
            pannumber: '',
            userid: " ",
            usergroup: 6,
            roleid: 1,
            emptypeid: '',
            empstatusid: '',
            companyid: 0,
            firstname: " ",
            middlename: " ",
            lastname: " ",
            gender: " ",
            dob: "",
            mobilenumber: " ",
            email: " ",
            maritalstatus: 1,
            residenceaddress: " ",
            district: " ",
            state1: " ",
            pincode: "",
            city: "",

            stateList: [],
            districtList: [],
            roleList: [],

            additionaldata: {
                "key1": "xxxxxxxxxx",
                "key2": "yyyyyyyy",
                "key3": 1010
            },

            pmid: "",
            pmname: "",
            status: "",

            offset: 0,
            perPage: 5,
            currentPage: 0,
            pageCount: "",
            orgtableData: [],

            offset2: 0,
            currentPage2: 0,
            pageCount2: "",
            produList: [],
            orgtableData2: [],

            jsonArray: [],

            partnerLists: [],
            partnerID: "",

            pmContactno: "",
            pmCountryCode: "",
            pmEmailID: "",
            pmPincode: "",
            pmStateCode: "",
            pmTncStatus: "",
            pmAddedOn: "",
            contactPerson: "",
            serviceLists: [],
            pmAdminLists: [],

            invalidUsername: false,
            invalidMiddlename: false,
            invalidLastname: false,
            invalidMnum: false,
            invalidEmail: false,

            checkAdminFlag: false
        }
        this.validator = new SimpleReactValidator();
        this.list0ref = React.createRef();
    }
    componentDidMount() {
        $(".pannumber").change(function () {
            var inputvalues = $(this).val();
            var regex = /[A-Z]{3}[P]{1}[A-Z]{1}[0-9]{4}[A-Z]{1}$/;
            if (!regex.test(inputvalues)) {
                $(".pannumber").val("");
                alert('Invalid PAN')
                return regex.test(inputvalues);
            }
        });
        this.getData();
        this.getAllPartners();

        $('.pmAdminReset').click(function () {
            // Clear inputs based on their IDs
            $('.commonInputs').val('');
            $('#inputState').prop('selectedIndex', 0);
        });
        $("#pmAdminRegister").prop('disabled', true);
        $("#pmAdminUpdate").prop('disabled', true);
    }
    getData = () => {
        fetch(BASEURL + '/usrmgmt/getallpartners', {
            headers: {
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            }
        }).then((Response) => {
            return Response.json();
        })
            .then((resdata) => {
                if (resdata.status == 'Success' || 'SUCCESS' || 'success') {
                    console.log(resdata);
                    // this.setState({ partnerLists: resdata.msgdata })
                    var data = resdata.msgdata
                    console.log(data)
                    var slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
                    console.log(slice)

                    this.setState({
                        pageCount: Math.ceil(data.length / this.state.perPage),
                        orgtableData: data,
                        jsonArray: slice
                    })
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
                                        // window.location.reload();
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
    getAllPartners = () => {
        fetch(BASEURL + '/usrmgmt/getallpartners', {
            headers: {
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            }
        }).then((Response) => {
            return Response.json();
        })
            .then((resdata) => {
                if (resdata.status == 'Success' || 'SUCCESS' || 'success') {
                    console.log(resdata);
                    this.setState({ partnerLists: resdata.msgdata })
                    // var data = resdata.msgdata
                    // console.log(data)
                    // var slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
                    // console.log(slice)

                    // this.setState({
                    //     pageCount: Math.ceil(data.length / this.state.perPage),
                    //     orgtableData: data,
                    //     jsonArray: slice
                    // })
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
                                        // window.location.reload();
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
    partnerID = (event) => {
        this.setState({ partnerID: event.target.value }, () => {
            console.log(this.state.partnerID);
        });
        console.log(this.state.partnerID);
        this.getPMAdminLists(event.target.value);
    }
    userDetails = (lists,
        contactmobileno,
        country,
        emailid,
        pincode,
        statecodealpha,
        tncsigned,
        partnername,
        addedon,
        status,
        city,
        contactperson) => {
        this.setState({
            pmname: partnername,
            pmContactno: contactmobileno,
            pmCountryCode: country,
            pmEmailID: emailid,
            pmPincode: pincode,
            pmStateCode: statecodealpha,
            pmTncStatus: tncsigned,
            pmAddedOn: addedon,
            city: city,
            status: status,
            serviceLists: lists.services,
            contactPerson: contactperson
        })
        $('#pmModal').click();
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
            jsonArray: slice
        })
    }
    //Create PM
    firstname = (event) => {
        var username = event.target.value;
        var isValid = true;
        this.setState({ firstname: username });
        for (var i = 0; i < username.length; i++) {
            var charCode = username.charCodeAt(i);

            if (!(charCode >= 65 && charCode <= 90) && // A-Z
                !(charCode >= 97 && charCode <= 122) && // a-z
                !(charCode >= 48 && charCode <= 57) && // 0-9
                charCode !== 32) { // space
                isValid = false;
                break;
            }
        }
        if (isValid) {
            this.setState({
                firstname: username,
                invalidUsername: false
            });
            $("#pmAdminRegister").prop('disabled', false);
            $("#pmAdminUpdate").prop('disabled', false);
        } else {
            this.setState({
                invalidUsername: true
            });
            $("#pmAdminRegister").prop('disabled', true);
            $("#pmAdminUpdate").prop('disabled', true);
        }
    }
    middlename = (event) => {
        this.setState({ middlename: event.target.value })
        var username = event.target.value;
        var isValid = true;
        this.setState({ middlename: username });
        for (var i = 0; i < username.length; i++) {
            var charCode = username.charCodeAt(i);

            if (!(charCode >= 65 && charCode <= 90) && // A-Z
                !(charCode >= 97 && charCode <= 122) && // a-z
                !(charCode >= 48 && charCode <= 57) && // 0-9
                charCode !== 32) { // space
                isValid = false;
                break;
            }
        }
        if (isValid) {
            this.setState({
                middlename: username,
                invalidMiddlename: false
            });
            $("#pmAdminRegister").prop('disabled', false);
            $("#pmAdminUpdate").prop('disabled', false);
        } else {
            this.setState({
                invalidMiddlename: true
            });
            $("#pmAdminRegister").prop('disabled', true);
            $("#pmAdminUpdate").prop('disabled', true);
        }
    }
    lastname = (event) => {
        var username = event.target.value;
        var isValid = true;
        this.setState({ lastname: username });
        for (var i = 0; i < username.length; i++) {
            var charCode = username.charCodeAt(i);

            if (!(charCode >= 65 && charCode <= 90) && // A-Z
                !(charCode >= 97 && charCode <= 122) && // a-z
                !(charCode >= 48 && charCode <= 57) && // 0-9
                charCode !== 32) { // space
                isValid = false;
                break;
            }
        }
        if (isValid) {
            this.setState({
                lastname: username,
                invalidLastname: false
            });
            $("#pmAdminRegister").prop('disabled', false);
            $("#pmAdminUpdate").prop('disabled', false);
        } else {
            this.setState({
                invalidLastname: true
            });
            $("#pmAdminRegister").prop('disabled', true);
            $("#pmAdminUpdate").prop('disabled', true);
        }
    }
    mobilenumber = (event) => {
        this.setState({ mobilenumber: event.target.value })
        var eventInput = event.target.value;
        var mobileValid = /^[6-9]\d{9}$/;

        if (mobileValid.test(eventInput)) {
            console.log("passed");
            this.setState({ invalidMnum: false });
            this.setState({ mobilenumber: eventInput });
            $("#pmAdminRegister").prop('disabled', false);
            $("#pmAdminUpdate").prop('disabled', false);
        } else {
            this.setState({ invalidMnum: true });
            $("#pmAdminRegister").prop('disabled', true);
            $("#pmAdminUpdate").prop('disabled', true);
        }
    }
    email = (event) => {
        this.setState({ email: event.target.value })
        var emailCheck = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        var eventInput = event.target.value;
        if (emailCheck.test(eventInput)) {
            console.log("passed");
            this.setState({ invalidEmail: false })
            this.setState({ email: event.target.value })
            $("#pmAdminRegister").prop('disabled', false);
            $("#pmAdminUpdate").prop('disabled', false);
        } else {
            console.log('failed');
            this.setState({ invalidEmail: true })
            $("#pmAdminRegister").prop('disabled', true);
            $("#pmAdminUpdate").prop('disabled', true);
        }
    }
    employeeID = (event) => {
        console.log(event.target.value)
        this.setState({ empstatusid: event.target.value })
    }
    createUser = () => {
        // empstatusid: parseInt(this.state.empstatusid),
        // let resultant = {
        //     userid: this.state.userid,
        //     firstname: this.state.firstname,
        //     lastname: this.state.lastname,
        //     mobilenumber: this.state.mobilenumber,
        //     email: this.state.email,
        //     pmid: this.state.partnerID,
        // };
        // if (this.state.middlename) {
        //     resultant.middlename = this.state.middlename;
        // }
        const { firstname, lastname, mobilenumber, email, partnerID, middlename } = this.state;
        if (!firstname || !lastname || !mobilenumber || !email || !partnerID) {
            confirmAlert({
                message: "Please fill all the fields",
                buttons: [
                    {
                        label: "OK",
                        onClick: () => {
                        },
                    },
                ],
            });
            return;
        }
        let userData = {
            userid: firstname,
            firstname: firstname,
            lastname: lastname,
            mobilenumber: mobilenumber,
            email: email,
            pmid: partnerID,
        };
        if (middlename) {
            userData.middlename = middlename;
        }
        fetch(BASEURL + '/usrmgmt/adminregistration', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify(userData)
        })
            .then(response => {
                return response.json();
            })
            .then((resdata) => {
                console.log(resdata)
                if (resdata.status === 'Success') {
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
            }).catch((error) => {
                console.log(error)
            })
    }
    canceluser = () => {
        this.setState({
            firstname: '',
            middlename: '',
            lastname: '',
            mobilenumber: '',
            email: '',
            partnerID: '',
            empstatusid: '',
            checkAdminFlag: false,
            invalidUsername: false,
            invalidMiddlename: false,
            invalidLastname: false,
            invalidMnum: false,
            invalidEmail: false,
        })
        $(this.list0ref.current).val('');
    }
    getPMAdminLists = (pmid) => {
        // var pmAdminLists = {
        //     "msgdata": [
        //         {
        //             "emailid": "ayushikhare2011@gmail.com",
        //             "empstatusid": "1",
        //             "firstname": "Ayushi",
        //             "mobilenumber": "7999517080",
        //             "pmid": "1"
        //         }]
        // }
        // pmAdminLists.msgdata.forEach(element => {
        //     this.setState({ email: element.emailid })
        //     this.setState({ empstatusid: element.empstatusid })
        //     this.setState({ firstname: element.firstname })
        //     this.setState({ mobilenumber: element.mobilenumber })
        // })
        // //if success
        // this.setState({ checkAdminFlag: true })

        fetch(BASEURL + '/usrmgmt/getpmadminlist?pmid=' + pmid, {
            headers: {
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            }
        }).then((Response) => {
            return Response.json();
        })
            .then((resdata) => {
                if (resdata.status === 'Success' || resdata.status === 'SUCCESS' || resdata.status === 'success') {
                    console.log(resdata.msgdata);
                    this.setState({ checkAdminFlag: true })
                    resdata.msgdata.forEach(element => {
                        this.setState({ email: element.emailid })
                        this.setState({ empstatusid: element.empstatusid })
                        this.setState({ firstname: element.firstname })
                        this.setState({ mobilenumber: element.mobilenumber })
                    })
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
                        this.setState({ checkAdminFlag: false })
                        this.setState({
                            firstname: '',
                            middlename: '',
                            lastname: '',
                            mobilenumber: '',
                            email: '',
                            empstatusid: '',
                            checkAdminFlag: false
                        })
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
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }

    handleChange() {
        $('.text').toggle();
        $("#Pinfo").toggle();
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
        const { checkAdminFlag } = this.state;
        return (
            <div className="container-dashboard d-flex flex-row" id="wrapper" style={{ backgroundColor: "#F4F7FC" }}>
                <AdminSidebar />
                <div className="pl-3 pr-3 main-content" style={{ width: "100%" }}>
                    <div className="container-fluid row pt-2">
                        <div className="col-1" id="ProductDefRes1">
                            <button style={{ marginLeft: "25px" }} onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className='col-4' id="ProductDefRes2" style={{ marginLeft: "40px", marginTop: "5px" }}>
                            <p><img style={{ height: "13px", paddingRight: "5px" }} />
                                <Link to="/landing">Home</Link> / Partner Management </p>
                        </div>
                        <div className='col'>

                        </div>
                        <div className='col'>

                        </div>
                        <div className='col-3'>

                        </div>
                        <div className="col" id="ProductDefRes3">
                            <button style={myStyle}>
                                <Link to="/landing" style={{ marginLeft: "10px" }}><FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} /><span style={{ textDecoration: "none", color: "white" }}>Back</span></Link></button>
                        </div>

                    </div>
                    <hr className="col-11" style={{ marginLeft: "50px", width: "88.6%", backgroundColor: "rgba(4,78,160,1)", marginTop: "-5px" }} />
                    {/* New Design */}
                    <div className='container-fluid row' style={{ paddingLeft: "86px", marginTop: "-20px" }}>
                        <div className='card' style={{ cursor: "default" }}>
                            <div className='row pt-2'>
                                <div className='col'>
                                    <ul role="tablist" className="nav nav-pills nav-fill mb-3" >
                                        {/* <li className="nav-item"><a data-toggle="pill" id="myNavLink" href="#activeproducts" className="nav-link active"
                                            style={{ textAlign: "center", paddingTop: "10px", paddingBottom: "10px", fontWeight: "bold" }} >
                                            <img style={{ width: "20px" }} /> &nbsp; {t('Add PM Admin')} </a>
                                        </li> */}
                                        <li className="nav-item" ><a data-toggle="pill" id="myNavLink" href="#Inactiveproducts" className="nav-link active"
                                            style={{ textAlign: "center", paddingTop: "10px", paddingBottom: "10px", fontWeight: "bold" }}><img style={{ width: "30px" }} /> &nbsp;{t('Partner Management')} </a> </li>
                                        <li className="nav-item"><a data-toggle="pill" id="myNavLink" href="#activeproducts" className="nav-link"
                                            style={{ textAlign: "center", paddingTop: "10px", paddingBottom: "10px", fontWeight: "bold" }} ><img style={{ width: "20px" }} /> &nbsp; {t('PM Admin')} </a> </li>

                                    </ul>
                                </div>
                            </div>
                            <div className="tab-content h-100">
                                <div class="tab-pane fade show" id="activeproducts" role="tabpanel" style={{ marginBottom: "20px" }}>
                                    {/* <div className="card-header border-1 bg-white" style={{ marginTop: "-15px" }}> */}
                                    <div className='row' style={{ paddingLeft: "3px" }}>
                                        <div className='col-5' id='headingRef'>
                                            <div className="two__image" style={{ paddingLeft: "10px" }}>
                                                <p className="text-white" style={{ paddingBottom: "6px", fontWeight: "600" }}>Add/ View PM Admin</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form-row" style={{ marginTop: "-10px" }}>
                                        {this.state.partnerLists && this.state.partnerLists.length > 0 ?
                                            <div className="col-md-4">
                                                <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('PM Name *')}</p>
                                                <select id="inputState" ref={this.list0ref} style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-16px" }}
                                                    className="form-select commonInputs" onChange={this.partnerID}>
                                                    <option defaultValue>Select PM </option>
                                                    {
                                                        this.state.partnerLists.map((partner, index) => (
                                                            <option id='optionVal' key={index} value={partner.partnerid}>{partner.partnername}</option>
                                                        ))
                                                    }
                                                </select>
                                            </div>
                                            : ""}
                                        <div className="form-group col-md-4">
                                            <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('First Name *')}</p>
                                            <input type="text" className="form-control commonInputs" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-16px" }}
                                                id="inputAddress" placeholder={t('Enter First Name')} onChange={this.firstname} value={this.state.firstname}
                                            />
                                            {(this.state.invalidUsername) ? <span className='text-danger' style={{ fontSize: "12px" }}><BsInfoCircle />Invalid First Name</span> : ''}
                                        </div>
                                        <div className="form-group col-md-4">
                                            <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Middle Name *')}</p>
                                            <input type="text" className="form-control" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-16px" }}
                                                id="inputAddress"
                                                value={this.state.middlename}
                                                onChange={this.middlename}
                                            />
                                            {(this.state.invalidMiddlename) ? <span className='text-danger' style={{ fontSize: "12px" }}><BsInfoCircle />Invalid Middle Name</span> : ''}
                                        </div>
                                    </div>
                                    <div className="form-row" style={{ marginTop: "-10px" }}>
                                        <div className="form-group col-md-4">
                                            <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Last Name *')}</p>
                                            <input type="text" className="form-control" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-16px" }}
                                                id="inputAddress"
                                                value={this.state.lastname}
                                                onChange={this.lastname}
                                            />
                                            {(this.state.invalidLastname) ? <span className='text-danger' style={{ fontSize: "12px" }}><BsInfoCircle />Invalid Last Name</span> : ''}
                                        </div>

                                        <div className="form-group col-md-4">
                                            <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Email ID *')}</p>
                                            <input type="email" className="form-control commonInputs" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-16px" }}
                                                id="inputAddress"
                                                // placeholder={t('Enter Email ID')}
                                                onChange={this.email} value={this.state.email} />
                                            {(this.state.invalidEmail) ? <span className='text-danger' style={{ fontSize: "12px" }}><BsInfoCircle />Invalid Email ID</span> : ''}
                                        </div>
                                        <div className="form-group col-md-4">
                                            <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Contact Number *')}</p>
                                            <input type="text" className="form-control commonInputs" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-16px" }}
                                                id="inputAddress"
                                                //  placeholder={t('Enter Mobile Number')} 
                                                onChange={this.mobilenumber} value={this.state.mobilenumber}
                                            />
                                            {(this.state.invalidMnum) ? <span className='text-danger' style={{ fontSize: "12px" }}><BsInfoCircle />Invalid Mobile Number</span> : ''}
                                        </div>
                                    </div>
                                    {/* <div className="form-row" style={{ marginTop: "-10px" }}>
                                        <div className="form-group col-md-4">
                                            <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Employee ID *')}</p>
                                            <input type="text" className="form-control commonInputs" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-16px" }}
                                                id="inputAddress"
                                                onChange={this.employeeID} value={this.state.empstatusid} />
                                            {(this.state.firstname) ? <span className='text-danger'>Invalid Employee I</span> : ''}
                                        </div>
                                    </div> */}
                                    {/* Note: */}
                                    {checkAdminFlag === false ? "" :
                                        <p style={{ fontSize: "14px", fontFamily: "'Poppins', sans-serif", color: "rgba(5,54,82,1)", textAlign: "center" }}><BsInfoCircle />The PM Admin is already registered, please select another PM.</p>
                                    }

                                    <hr />
                                    {checkAdminFlag === false ?
                                        <div className="form-row" style={{ marginTop: "-25px" }}>
                                            <div className="form-group col" style={{ textAlign: "center" }}>
                                                <button className='btn btn-sm text-white' onClick={this.createUser} id="pmAdminRegister"
                                                    style={{ backgroundColor: "rgb(136, 189, 72)" }}><FaThumbsUp />Register</button> &nbsp;
                                                <button className='btn btn-sm text-white pmAdminReset' onClick={this.canceluser}
                                                    style={{ backgroundColor: "#0079BF" }}><BsArrowRepeat />&nbsp;Reset</button>
                                            </div>
                                        </div> :
                                        <div className="form-row" style={{ marginTop: "-25px" }}>
                                            <div className="form-group col" style={{ textAlign: "center" }}>
                                                <button className='btn btn-sm text-white' onClick={this.createUser} id="pmAdminUpdate"
                                                    disabled
                                                    style={{ backgroundColor: "rgb(136, 189, 72)" }}><FaThumbsUp />Update</button> &nbsp;
                                                <button className='btn btn-sm text-white pmAdminReset' onClick={this.canceluser}
                                                    style={{ backgroundColor: "#0079BF" }}><BsArrowRepeat />&nbsp;Reset</button>
                                            </div>
                                        </div>
                                    }

                                    {/* </div> */}
                                </div>
                                <div class="tab-pane fade show active" id="Inactiveproducts" role="tabpanel" style={{ marginBottom: "20px" }}>
                                    <div className='row' style={{ paddingLeft: "3px" }}>
                                        <div className='col-5' id='headingRef'>
                                            <div className="two__image" style={{ paddingLeft: "10px" }}>
                                                <p className="text-white" style={{ paddingBottom: "6px", fontWeight: "600" }}>Partners List</p>
                                            </div>
                                        </div>
                                        <div className='col-7' style={{ textAlign: "end" }}>
                                            <Link to="/createPartner">
                                                <button
                                                    type="button"
                                                    className="btn btn-sm text-white"
                                                    onClick={this.createPartner}
                                                    style={{
                                                        backgroundColor: "#0079bf",
                                                        paddingLeft: "10px", paddingRight: "10px"
                                                    }}
                                                >
                                                    &nbsp;<img src={us} style={{ width: "20px" }} />&nbsp;
                                                    {t("Create Partner")}
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                    <Table>
                                        <Thead>
                                            <Tr style={{ fontFamily: "'Poppins', sans-serif", fontSize: "15px", color: "rgba(5,54,82,1)", paddingLeft: "6px" }}>
                                                <Th style={{ textAlign: "left", marginTop: "5px" }}>{t('Partner Name')}</Th>
                                                <Th style={{ textAlign: "left", marginTop: "5px" }}>{t('Added On')}</Th>
                                                <Th style={{ textAlign: "left", marginTop: "5px" }}>{t('Status')}</Th>
                                                <Th style={{ textAlign: "end", marginTop: "5px" }}>
                                                    {/* <button
                                                        type="button"
                                                        className="btn btn-sm text-white"
                                                        onClick={this.createPartner}
                                                        style={{
                                                            backgroundColor: "#0079bf",
                                                            paddingLeft: "10px", paddingRight: "10px"
                                                        }}
                                                    >
                                                        &nbsp;&nbsp;
                                                        {t("CreateUser")}
                                                    </button> */}
                                                </Th>
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {
                                                this.state.jsonArray.map((lists, index) => {
                                                    return (
                                                        <Tr key={index}
                                                            style={{
                                                                fontSize: "15px", color: "rgba(5,54,82,1)", fontFamily: "'Poppins', sans-serif",
                                                                marginBottom: "-10px", transition: 'none', cursor: 'default', backgroundColor: (index % 2 == 0) ? 'rgba(255,255,255,1)' : 'rgba(242,242,242,1)'
                                                            }} >

                                                            <Td style={{ fontSize: "15px", textAlign: "left", fontWeight: "490", paddingTop: "12px" }}>{lists.partnername}</Td>
                                                            <Td style={{ fontSize: "15px", textAlign: "left", fontWeight: "490", paddingTop: "12px" }}>{lists.addedon}</Td>
                                                            <Td style={{ fontSize: "15px", textAlign: "left", fontWeight: "490", paddingTop: "12px" }}>{lists.status === "1" ? "Active" : lists.status === "0" ? "Not Active" : ""}</Td>
                                                            <Td style={{ fontSize: "12px", textAlign: "left", fontWeight: "490", paddingTop: "12px" }}><span class="dropup">
                                                                <img src={openIt} style={{ height: "25px", cursor: "pointer", marginTop: "-10px" }}
                                                                    onClick={this.userDetails.bind(this, lists, lists.contactmobileno, lists.country,
                                                                        lists.emailid, lists.pincode, lists.statecodealpha, lists.tncsigned,
                                                                        lists.partnername, lists.addedon, lists.status, lists.city, lists.contactperson
                                                                    )} />
                                                            </span></Td>
                                                        </Tr>
                                                    )
                                                })
                                            }
                                        </Tbody>
                                    </Table>
                                    <div className="row mt-1">
                                        <div className='col'></div>
                                        <div className='col'>
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
                        </div>
                    </div>

                    {/* PM Management Modal */}
                    <button type="button" id="pmModal" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal" style={{ display: "none" }}>
                        PM Modal
                    </button>
                    <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="static">
                        <div class="modal-dialog" role="document">
                            <div class="modal-content">
                                <div class="modal-body">
                                    <div className='row mb-2'>
                                        <div className='col-10'>
                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "600", paddingLeft: "8px" }}><img src={batch} style={{ width: "26px" }} /> &nbsp;Partner Details</p>
                                            <hr style={{ width: "70px", marginTop: "-12px" }} />
                                        </div>
                                        <div className="col-2">
                                            <FaTimesCircle type="button" class="close" data-dismiss="modal" aria-label="Close" style={{ color: "rgb(5, 54, 82)", fontSize: "18px" }} />
                                        </div>
                                    </div>
                                    <div className="mb-2" style={{ border: "1.5px dashed rgb(81,164,219)", borderRadius: "5px", marginTop: "-10px", }}>
                                        <div className="row" >
                                            <div className="col" style={{ padding: "5px 35px", fontSize: "14px" }} >
                                                <div className="row">
                                                    <div className='col-sm-3 col-md-3 col-lg-4'>
                                                        <p className="mb-0 font-weight-bold" style={{ color: "#222C70", fontWeight: "450" }}>Partner Name</p>
                                                    </div>
                                                    <div className='col-sm-1 col-md-1 col-lg-1'>
                                                        <p className="mb-0 font-weight-bold" style={{ color: "#222C70" }}>:</p>
                                                    </div>
                                                    <div className='col-sm-6 col-md-6 col-lg-6'>
                                                        <p className="mb-0" style={{ color: "#222C70" }}>{this.state.pmname}</p>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className='col-sm-3 col-md-3 col-lg-4'>
                                                        <p className="mb-0 font-weight-bold" style={{ color: "#222C70", fontWeight: "450" }}>Added On</p>
                                                    </div>
                                                    <div className='col-sm-1 col-md-1 col-lg-1'>
                                                        <p className="mb-0 font-weight-bold" style={{ color: "#222C70" }}>:</p>
                                                    </div>
                                                    <div className='col-sm-6 col-md-6 col-lg-6'>
                                                        <p className="mb-0" style={{ color: "#222C70" }}>{this.state.pmAddedOn}</p>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className='col-sm-3 col-md-3 col-lg-4'>
                                                        <p className="mb-0 font-weight-bold" style={{ color: "#222C70", fontWeight: "450" }}>Country Code</p>
                                                    </div>
                                                    <div className='col-sm-1 col-md-1 col-lg-1'>
                                                        <p className="mb-0 font-weight-bold" style={{ color: "#222C70" }}>:</p>
                                                    </div>
                                                    <div className='col-sm-6 col-md-6 col-lg-6'>
                                                        <p className="mb-0" style={{ color: "#222C70" }}>{this.state.pmCountryCode}</p>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className='col-sm-3 col-md-3 col-lg-4'>
                                                        <p className="mb-0 font-weight-bold" style={{ color: "#222C70", fontWeight: "450" }}>State Code</p>
                                                    </div>
                                                    <div className='col-sm-1 col-md-1 col-lg-1'>
                                                        <p className="mb-0 font-weight-bold" style={{ color: "#222C70" }}>:</p>
                                                    </div>
                                                    <div className='col-sm-6 col-md-6 col-lg-6'>
                                                        <p className="mb-0" style={{ color: "#222C70" }}>{this.state.pmStateCode}</p>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className='col-sm-3 col-md-3 col-lg-4'>
                                                        <p className="mb-0 font-weight-bold" style={{ color: "#222C70", fontWeight: "450" }}>City</p>
                                                    </div>
                                                    <div className='col-sm-1 col-md-1 col-lg-1'>
                                                        <p className="mb-0 font-weight-bold" style={{ color: "#222C70" }}>:</p>
                                                    </div>
                                                    <div className='col-sm-6 col-md-6 col-lg-6'>
                                                        <p className="mb-0" style={{ color: "#222C70" }}>
                                                            {this.state.city}

                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className='col-sm-3 col-md-3 col-lg-4'>
                                                        <p className="mb-0 font-weight-bold" style={{ color: "#222C70", fontWeight: "450" }}>PIN Code</p>
                                                    </div>
                                                    <div className='col-sm-1 col-md-1 col-lg-1'>
                                                        <p className="mb-0 font-weight-bold" style={{ color: "#222C70" }}>:</p>
                                                    </div>
                                                    <div className='col-sm-6 col-md-6 col-lg-6'>
                                                        <p className="mb-0" style={{ color: "#222C70" }}>{this.state.pmPincode}</p>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className='col-sm-3 col-md-3 col-lg-4'>
                                                        <p className="mb-0 font-weight-bold" style={{ color: "#222C70", fontWeight: "450" }}>TnC Signed</p>
                                                    </div>
                                                    <div className='col-sm-1 col-md-1 col-lg-1'>
                                                        <p className="mb-0 font-weight-bold" style={{ color: "#222C70" }}>:</p>
                                                    </div>
                                                    <div className='col-sm-6 col-md-6 col-lg-6'>
                                                        <p className="mb-0" style={{ color: "#222C70" }}>{this.state.pmTncStatus == "1" ? "Signed" : "Not Signed"}</p>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className='col-sm-3 col-md-3 col-lg-4'>
                                                        <p className="mb-0 font-weight-bold" style={{ color: "#222C70", fontWeight: "450" }}>Status</p>
                                                    </div>
                                                    <div className='col-sm-1 col-md-1 col-lg-1'>
                                                        <p className="mb-0 font-weight-bold" style={{ color: "#222C70" }}>:</p>
                                                    </div>
                                                    <div className='col-sm-6 col-md-6 col-lg-6'>
                                                        <p className="mb-0" style={{ color: "#222C70" }}>
                                                            {this.state.status === "1" ? "Active" : "Not Active"}

                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {this.state.serviceLists && this.state.serviceLists.length > 0 ? (
                                        <>
                                            <p className='mt-2' style={{ fontWeight: "500", color: "#222C70" }}>Registered Services</p>
                                            <div className="mb-2" style={{ border: "1.5px dashed rgb(81,164,219)", borderRadius: "5px", marginTop: "-10px", }}>
                                                <div className="row" style={{ padding: "2px 20px" }}>
                                                    {
                                                        this.state.serviceLists.map((lists, index) => {
                                                            return (
                                                                <div className="col-6" style={{ fontSize: "14px" }} >
                                                                    <p style={{ wordWrap: 'break-word', color: "#222C70" }}>{`${index + 1})`}&nbsp;{lists.servicedescription}</p>
                                                                </div>
                                                            )
                                                        }
                                                        )
                                                    }
                                                </div>
                                            </div>
                                        </>) :
                                        ""
                                    }

                                    <div className="mb-2 mt-2" style={{ border: "1.5px dashed rgb(81,164,219)", borderRadius: "5px", marginTop: "-10px", }}>
                                        <div className="row" >
                                            <div className="col" style={{ padding: "5px 35px", fontSize: "14px" }} >
                                                <div className="row">
                                                    <div className='col-sm-3 col-md-3 col-lg-4'>
                                                        <p className="mb-0 font-weight-bold" style={{ color: "#222C70", fontWeight: "450" }}>Contact Person</p>
                                                    </div>
                                                    <div className='col-sm-1 col-md-1 col-lg-1'>
                                                        <p className="mb-0 font-weight-bold" style={{ color: "#222C70" }}>:</p>
                                                    </div>
                                                    <div className='col-sm-6 col-md-6 col-lg-6'>
                                                        <p className="mb-0" style={{ color: "#222C70" }}>{this.state.contactPerson}</p>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className='col-sm-3 col-md-3 col-lg-4'>
                                                        <p className="mb-0 font-weight-bold" style={{ color: "#222C70", fontWeight: "450" }}>Mobile Number</p>
                                                    </div>
                                                    <div className='col-sm-1 col-md-1 col-lg-1'>
                                                        <p className="mb-0 font-weight-bold" style={{ color: "#222C70" }}>:</p>
                                                    </div>
                                                    <div className='col-sm-6 col-md-6 col-lg-6'>
                                                        <p className="mb-0" style={{ color: "#222C70" }}>{this.state.pmContactno}</p>
                                                    </div>
                                                </div>
                                                <div className="row">
                                                    <div className='col-sm-3 col-md-3 col-lg-4'>
                                                        <p className="mb-0 font-weight-bold" style={{ color: "#222C70", fontWeight: "450" }}>Email ID</p>
                                                    </div>
                                                    <div className='col-sm-1 col-md-1 col-lg-1'>
                                                        <p className="mb-0 font-weight-bold" style={{ color: "#222C70" }}>:</p>
                                                    </div>
                                                    <div className='col-sm-6 col-md-6 col-lg-6'>
                                                        <p className="mb-0" style={{ color: "#222C70" }}>{this.state.pmEmailID}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Accordion Design */}
                                    {/* <div class="accordion accordion-flush" id="accordionFlushExample">
                                        {this.state.status == '5' ?
                                            <div className="row mb-2">
                                                <div className="col">
                                                    <div class="accordion-item" style={{ border: "1.5px solid rgb(199, 171, 16)", borderRadius: "5px" }}>
                                                        <div class="accordion-header" id="flush-headingTwo">
                                                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" style={{ color: "rgb(199, 171, 16)" }}
                                                                data-bs-target="#flush-collapseTwo" aria-expanded="false" aria-controls="flush-collapseTwo">
                                                                Unblock User
                                                            </button>
                                                        </div>
                                                        <div id="flush-collapseTwo" class="accordion-collapse collapse" aria-labelledby="flush-headingTwo" data-bs-parent="#accordionFlushExample">
                                                            <div class="accordion-body">

                                                                <div className="form-row">
                                                                    <div className="form-group col-12" style={{ fontSize: "14px" }}>
                                                                        <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Reason')}</p>
                                                                        <textarea type="text" style={{ backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }} className="form-control" onChange={this.reason}
                                                                            placeholder="Enter Your Reason" rows={3} cols={30} maxLength={255}>

                                                                        </textarea>
                                                                    </div>
                                                                </div>
                                                                <div className="form-row">
                                                                    <div className="col" style={{ textAlign: "end" }}>
                                                                        <button type="button"
                                                                            className="btn btn-sm text-white"
                                                                            onClick={this.unblockUser}
                                                                            style={{
                                                                                backgroundColor: "rgb(199, 171, 16)",
                                                                                paddingLeft: "10px", paddingRight: "10px"
                                                                            }}
                                                                        >Unblock</button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div> :
                                            <div className="row mb-2">
                                                <div className="col">
                                                    <div class="accordion-item" style={{ border: "1.5px solid rgb(219, 87, 31)", borderRadius: "5px" }}>
                                                        <div class="accordion-header" id="flush-headingOne">
                                                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" style={{ color: "rgb(219, 87, 31)" }}
                                                                data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
                                                                Suspend User
                                                            </button>
                                                        </div>
                                                        <div id="flush-collapseOne" class="accordion-collapse collapse" aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample">
                                                            <div class="accordion-body">

                                                                <div className="form-row">
                                                                    <div className="form-group col-12" style={{ fontSize: "14px" }}>
                                                                        <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Reason')}</p>
                                                                        <textarea type="text" style={{ backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }} className="form-control" onChange={this.reason}
                                                                            placeholder="Enter Your Reason" rows={3} cols={30} maxLength={255}>

                                                                        </textarea>
                                                                    </div>
                                                                </div>
                                                                <div className="form-row">
                                                                    <div className="col" style={{ textAlign: "end" }}>
                                                                        <button type="button"
                                                                            className="btn btn-sm text-white"
                                                                            onClick={this.blockUser}
                                                                            style={{
                                                                                backgroundColor: "rgb(219, 87, 31)",
                                                                                paddingLeft: "10px", paddingRight: "10px"
                                                                            }}
                                                                        >Suspend</button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        }


                                        <div className="row mb-2">
                                            <div className="col">
                                                <div class="accordion-item" style={{ border: "1.5px solid rgb(82, 181, 227)", borderRadius: "5px" }}>
                                                    <div class="accordion-header" id="flush-headingThree">
                                                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" style={{ color: "rgb(82, 181, 227)" }}
                                                            data-bs-target="#flush-collapseThree" aria-expanded="false" aria-controls="flush-collapseThree">
                                                            Remove User
                                                        </button>
                                                    </div>
                                                    <div id="flush-collapseThree" class="accordion-collapse collapse" aria-labelledby="flush-headingThree" data-bs-parent="#accordionFlushExample">
                                                        <div class="accordion-body">

                                                            <div className="form-row">
                                                                <div className="form-group col-12" style={{ fontSize: "14px" }}>
                                                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Reason')}</p>
                                                                    <textarea type="text" style={{ backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }} className="form-control" onChange={this.reason}
                                                                        placeholder="Enter Your Reason" rows={3} cols={30} maxLength={255}>

                                                                    </textarea>
                                                                </div>
                                                            </div>
                                                            <div className="form-row">
                                                                <div className="col" style={{ textAlign: "end" }}>
                                                                    <button type="button"
                                                                        className="btn btn-sm text-white"
                                                                        onClick={this.deleteUser}
                                                                        style={{
                                                                            backgroundColor: "rgb(82, 181, 227)",
                                                                            paddingLeft: "10px", paddingRight: "10px"
                                                                        }}
                                                                    >Remove</button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
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

export default withTranslation()(PMManagement);