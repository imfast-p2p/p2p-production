import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { BASEURL } from '../assets/baseURL';
import SimpleReactValidator from 'simple-react-validator';
import AdminSidebar from '../Admin/AdminSidebar';
import $, { event } from 'jquery';
import '../Admin/CreateUser.css';
import { withTranslation } from 'react-i18next';
import { VscTypeHierarchySub } from 'react-icons/vsc';
import { FaAngleLeft } from 'react-icons/fa';
import { BsInfoCircle } from "react-icons/bs";
import dashboardIcon from '../assets/icon_dashboard.png';
import { confirmAlert } from "react-confirm-alert";

var today;
class CreatePartner extends Component {
    constructor(props) {
        super(props)
        this.state = {
            partnerName: "",
            displayName: "",
            pannumber: "",
            email: " ",
            mobileno: "",
            contactPerson: "",
            address1: "",
            address2: "",
            address3: "",
            cin: "",
            stateCode: "",
            city: "",
            countryCode: "",
            dateofinCorporation: "",
            districtCode: "",
            gstn: "",

            district: " ",
            state1: " ",
            pincode: "",

            stateList: [],
            districtList: [],
            roleList: [],
            isCinValid: true,
            isGstinValid: true,
            selectedDate: '',
            showError: false,

            invalidPartnerName: false,
            invalidDispName: false,
            invalidEmail: false,
            invalidMnum: false,
            invalidCnPerson: false,
            invalidCity: false,
        }
    }
    componentDidMount() {
        this.getStateList();
        $(".pannumber").change(function () {
            var inputvalues = $(this).val();
            var regex = /[A-Z]{3}[P]{1}[A-Z]{1}[0-9]{4}[A-Z]{1}$/;
            if (!regex.test(inputvalues)) {
                $(".pannumber").val("");
                alert('Invalid PAN')
                return regex.test(inputvalues);
            }
        });
    }
    partnerName = (event) => {
        var username = event.target.value;
        var isValid = true;
        this.setState({ partnerName: username });
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
                partnerName: username,
                invalidPartnerName: false
            });
            $("#systemUserCtBtn").prop('disabled', false);
        } else {
            this.setState({
                invalidPartnerName: true
            });
            $("#systemUserCtBtn").prop('disabled', true);
        }
    }
    displayName = (event) => {
        var username = event.target.value;
        var isValid = true;
        this.setState({ displayName: username });
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
                displayName: username,
                invalidDispName: false
            });
            $("#systemUserCtBtn").prop('disabled', false);
        } else {
            this.setState({
                invalidDispName: true
            });
            $("#systemUserCtBtn").prop('disabled', true);
        }
    }
    contactPerson = (event) => {
        var username = event.target.value;
        var isValid = true;
        this.setState({ contactPerson: username });
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
                contactPerson: username,
                invalidCnPerson: false
            });
            $("#systemUserCtBtn").prop('disabled', false);
        } else {
            this.setState({
                invalidCnPerson: true
            });
            $("#systemUserCtBtn").prop('disabled', true);
        }
    }
    address1 = (event) => {
        this.setState({ address1: event.target.value });
    }
    address2 = (event) => {
        this.setState({ address2: event.target.value });
    }
    address3 = (event) => {
        this.setState({ address3: event.target.value });
    }
    pannumber = (event) => {
        this.setState({ pannumber: event.target.value.toUpperCase() })
        console.log(this.state.pannumber)
    }
    mobilenumber = (event) => {
        this.setState({ mobileno: event.target.value })
        var eventInput = event.target.value;
        var mobileValid = /^[6-9]\d{9}$/;
        if (mobileValid.test(eventInput)) {
            console.log("passed");
            this.setState({
                invalidMnum: false,
                mobileno: eventInput
            });
            $("#systemUserCtBtn").prop('disabled', false);
        } else {
            this.setState({ invalidMnum: true });
            $("#systemUserCtBtn").prop('disabled', true);
        }
    }
    email = (event) => {
        this.setState({ email: event.target.value })
        var emailCheck = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        var eventInput = event.target.value;
        if (emailCheck.test(eventInput)) {
            console.log("passed");
            this.setState({
                invalidEmail: false,
                email: event.target.value
            })
            $("#systemUserCtBtn").prop('disabled', false);
        } else {
            console.log('failed');
            this.setState({ invalidEmail: true })
            $("#systemUserCtBtn").prop('disabled', true);
        }
    }
    state1 = (event) => {
        console.log(event.target.value)
        this.setState({ stateCode: event.target.value })
        this.state.stateList
            .filter((e) => e.statecode == event.target.value)
            .map(() => {
                this.getDistrictList(event.target.value);
            })
    }
    district = (event) => {
        console.log(event.target.value)
        this.setState({ districtCode: event.target.value })
    }
    pincode = (event) => {
        this.setState({ pincode: event.target.value })
    }
    city = (event) => {
        var username = event.target.value;
        var isValid = true;
        this.setState({ city: username });
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
                city: username,
                invalidCity: false
            });
            $("#systemUserCtBtn").prop('disabled', false);
        } else {
            this.setState({
                invalidCity: true
            });
            $("#systemUserCtBtn").prop('disabled', true);
        }
    }
    cin = (e) => {
        // this.setState({ cin: event.target.value })
        const newCin = e.target.value;
        this.setState({ cin: newCin });

        // CIN regex pattern
        const cinPattern = /^[A-Z]{1}[0-9]{5}[A-Z]{2}[0-9]{4}[A-Z]{3}[0-9]{6}$/;
        const cinValid = cinPattern.test(newCin)
        console.log(cinValid)
        if (cinValid) {
            this.setState({ isCinValid: cinValid });
        }
        else {
            this.setState({ isCinValid: cinValid });
        }
    }
    dateofinCorporation = (event) => {
        this.setState({ dateofinCorporation: event.target.value })
        const selectedDate = event.target.value;
        console.log(selectedDate)
        const currentDate = new Date().toISOString().split('T')[0];

        if (selectedDate > currentDate) {
            this.setState({ selectedDate: '', showError: true });
        } else {
            this.setState({ selectedDate, showError: false });
        }
    }
    gstn = (e) => {
        const newGstin = e.target.value;
        this.setState({ gstn: newGstin });

        // GSTIN regex pattern
        const gstinPattern = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
        const gstinValid = gstinPattern.test(newGstin)
        console.log(gstinValid)
        if (gstinValid) {
            this.setState({ isGstinValid: gstinValid });
        }
        else {
            this.setState({ isGstinValid: gstinValid });
        }
    }
    getStateList = (event) => {
        fetch(BASEURL + '/usrmgmt/getstatelist', {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            }
        }).then((Response) => Response.json())
            .then((resdata) => {
                if (resdata.status === 'Success') {
                    console.log(resdata);
                    this.setState({ stateList: resdata.msgdata })
                    this.state.stateList.map((statelist) => {
                        return statelist.statename;
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
    }
    getDistrictList = (statecod) => {
        this.setState({ state1: statecod })
        fetch(BASEURL + '/usrmgmt/getdistrictlist?statecode=' + statecod, {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            }
        }).then((Response) => Response.json())
            .then((resdata) => {
                if (resdata.status === 'Success') {
                    console.log(resdata);
                    this.setState({ districtList: resdata.msgdata.distlist })
                }
                else {
                    this.setState({
                        districtList: [],
                        districtCode: ""
                    })
                }
            })
    }
    createUser = () => {
        var jsonObject = {
            partnername: this.state.partnerName,
            displayname: this.state.displayName,
            contactmobileno: this.state.mobileno,
            contactperson: this.state.contactPerson,
            address1: this.state.address1,
            cin: this.state.cin,
            statecode: this.state.stateCode,
            districtcode: this.state.districtCode,
            city: this.state.city,
            countrycode: "IND",
            dateofincorporation: this.state.dateofinCorporation,
            emailid: this.state.email,
            gstn: this.state.gstn,
            pincode: this.state.pincode,
        };

        // Check if address2 is present before including it
        if (this.state.address2) {
            jsonObject.address2 = this.state.address2;
        }

        // Check if address3 is present before including it
        if (this.state.address3) {
            jsonObject.address3 = this.state.address3;
        }

        // Check if pan is present before including it
        if (this.state.pannumber) {
            jsonObject.pan = this.state.pannumber;
        }

        // Convert the JSON object to a string
        var jsonString = JSON.stringify(jsonObject);
        fetch(BASEURL + '/usrmgmt/createpartner', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: jsonString
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
                                    window.location = '/landing';
                                },
                            },
                        ],
                        closeOnClickOutside: false,
                    });
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
                                        // window.location.reload();
                                    },
                                },
                            ],
                        });
                    }
                }
            }).catch((error) => {
                console.log(error)
            })
    }
    handleChange() {
        $('.text').toggle();
        $("#Pinfo").toggle();
    }
    cancelCreate = () => {
        window.location.reload();
    }
    test = (i) => {
        this.setState.roleid = this.state.roleList[i].roleid;
        console.log(this.state.roleid)
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
                <AdminSidebar />
                <div className="main-content" id="page-content-wrapper">
                    <div className="container-fluid row pt-2">
                        <div className="col-1" id='facnavRes1'>
                            <button style={{ marginLeft: "25px" }} onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className='col-5' id='facnavRes2' style={{ marginLeft: "20px", marginTop: "5px" }}>
                            <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                <Link to="/landing">Home</Link> / <Link to="/pmManagement">Partner Management</Link> / Create Partner</p>
                        </div>
                        <div className='col'>

                        </div>
                        <div className='col'>

                        </div>
                        <div className='col-3'>

                        </div>
                        <div className="col" id='facnavRes3'>
                            <button style={myStyle}>
                                <Link to="/pmManagement"><FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} /><span style={{ textDecoration: "none", color: "white" }}>Back</span></Link></button>
                        </div>
                    </div>
                    <hr className="col-11" style={{ marginLeft: "50px", width: "88.6%", backgroundColor: "rgba(4,78,160,1)", marginTop: "0px" }} />
                    <div className="card" style={{ cursor: "default", width: "92%", marginLeft: "45px", marginTop: "-10px" }}>
                        <div className="card-header border-1 bg-white">
                            <div className='row' style={{ paddingLeft: "3px" }}>
                                <div className='col-4' id='headingRef'>
                                    <div className="two__image" style={{ paddingLeft: "10px" }}>
                                        <p className="text-white" style={{ paddingBottom: "6px", fontWeight: "600" }}>Create Partner</p>
                                    </div>
                                </div>
                            </div>
                            <div className="form-row" style={{ marginTop: "-10px" }}>
                                <div className="form-group col-md-4">
                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Partner Name *')}</p>
                                    <input type="text" className="form-control" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-16px" }}
                                        id="" placeholder={t('Enter Partner Name')} onChange={this.partnerName}
                                    />
                                    {(this.state.invalidPartnerName) ? <span className='text-danger' style={{ fontSize: "12px" }}><BsInfoCircle />Invalid Name</span> : ''}
                                </div>
                                <div className="form-group col-md-4">
                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Display Name *')}</p>
                                    <input type="text" className="form-control" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-16px" }}
                                        id="" placeholder={t('Enter Display Name')} onChange={this.displayName}
                                    />
                                    {(this.state.invalidDispName) ? <span className='text-danger' style={{ fontSize: "12px" }}><BsInfoCircle />Invalid Name</span> : ''}
                                </div>
                                <div className="form-group col-md-4">
                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Email ID *')}</p>
                                    <input type="email" className="form-control" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-16px" }}
                                        id="" placeholder={t('Enter Email ID')} onChange={this.email} />
                                    {(this.state.invalidEmail) ? <span className='text-danger' style={{ fontSize: "12px" }}><BsInfoCircle />Invalid Email ID</span> : ''}
                                </div>
                            </div>
                            <div className="form-row" style={{ marginTop: "-10px" }}>
                                <div className="form-group col-md-4">
                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Contact Number *')}</p>
                                    <input type="number" className="form-control" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-16px" }}
                                        id="" placeholder={t('Enter Mobile Number')} onChange={this.mobilenumber}
                                    />
                                    {(this.state.invalidMnum) ? <span className='text-danger' style={{ fontSize: "12px" }}><BsInfoCircle />Invalid Mobile Number</span> : ''}
                                </div>
                                <div className="form-group col-md-4">
                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Contact Person *')}</p>
                                    <input type="text" className="form-control" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-16px" }}
                                        id="" placeholder={t('Enter Contact Person')} onChange={this.contactPerson}
                                    />
                                    {(this.state.invalidCnPerson) ? <span className='text-danger' style={{ fontSize: "12px" }}><BsInfoCircle />Invalid Contact Person Name</span> : ''}
                                </div>
                                <div className="form-group col-md-4">
                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Address1 *')}</p>
                                    <input type="text" className="form-control" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-16px" }}
                                        id="" placeholder={t('Enter Address')} onChange={this.address1}
                                    />
                                </div>
                            </div>
                            <div className="form-row" style={{ marginTop: "-10px" }}>
                                <div className="form-group col-md-4">
                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Address2')}</p>
                                    <input type="text" className="form-control" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-16px" }}
                                        id="" placeholder={t('Enter Address')} onChange={this.address2}
                                    />
                                </div>
                                <div className="form-group col-md-4">
                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Address3')}</p>
                                    <input type="text" className="form-control" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-16px" }}
                                        id="" placeholder={t('Enter Address')} onChange={this.address3}
                                    />
                                </div>
                                <div className="form-group col-md-4">
                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('State *')}</p>
                                    <select id="" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-16px" }} className="form-select" onClick={this.state1} >
                                        <option defaultValue>Select State</option>
                                        {this.state.stateList.map((states, index) => (
                                            <option key={index} value={states.statecode} style={{ color: "GrayText" }}>{states.statename} </option>
                                        ))
                                        }
                                    </select>
                                </div>
                            </div>
                            <div className="form-row" style={{ marginTop: "-10px" }}>
                                <div className="form-group col-md-4">
                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('District *')}</p>
                                    <select id="" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-16px" }} className="form-select" onChange={this.district}>
                                        <option defaultValue>Select District</option>
                                        {this.state.districtList.map((districts, index) => {
                                            return (
                                                <option key={index} value={districts.distid} style={{ color: "GrayText" }}>{districts.distname}</option>
                                            )
                                        })
                                        }
                                    </select>
                                </div>
                                <div className="form-group col-md-4">
                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('City *')}</p>
                                    <input type="text" className="form-control" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-16px" }}
                                        id="" placeholder={t('Enter City')} onChange={this.city}
                                    />
                                    {(this.state.invalidCity) ? <span className='text-danger' style={{ fontSize: "12px" }}><BsInfoCircle />Invalid City</span> : ''}
                                </div>
                                <div className="form-group col-md-4">
                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('PIN Code *')}</p>
                                    <input type="number" className="form-control" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-16px" }}
                                        id="" placeholder={t('Enter PIN Code')} onChange={this.pincode}
                                        onInput={(e) => {
                                            e.target.value = Math.max(0, parseInt(e.target.value || 0, 10)).toString().slice(0, 6)
                                        }}
                                    />
                                </div>
                            </div>
                            <div className='form-row' style={{ marginTop: "-10px" }}>
                                <div className="col-md-4">
                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('PAN')}</p>
                                    <input type="text" className="form-control pannumber" minLength={10}
                                        maxLength={10} autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-16px" }}
                                        id="" placeholder={t('Enter PAN')} onChange={this.pannumber}
                                    />
                                </div>
                                <div className="form-group col-md-4">
                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('CIN *')}</p>
                                    <input type="text" className="form-control" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-16px" }}
                                        id="" placeholder={t('Enter CIN')} onChange={this.cin}
                                    />
                                    {!this.state.isCinValid && <span className='text-danger' style={{ fontSize: "12px" }}><BsInfoCircle />{t('Invalid CIN format')}</span>}
                                </div>
                                <div className="form-group col-md-4">
                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Date *')}</p>
                                    <input type="date" className="form-control" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-16px" }}
                                        id="" onChange={this.dateofinCorporation}
                                    />
                                    {this.state.showError && <span className='text-danger' style={{ fontSize: "12px" }}><BsInfoCircle />Future dates are not allowed</span>}
                                </div>

                            </div>
                            <div className='form-row' style={{ marginTop: "-10px" }}>
                                <div className="form-group col-md-4">
                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('GSTIN *')}</p>
                                    <input type="text" className="form-control" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-16px" }}
                                        id="" placeholder={t('Enter GSTIN')} onChange={this.gstn}
                                    />
                                    {!this.state.isGstinValid && <span className='text-danger' style={{ fontSize: "12px" }}><BsInfoCircle />{t('Invalid GSTIN format')}</span>}
                                </div>
                            </div>
                            <hr style={{ marginTop: "-2px" }} />
                            <div className="form-row" style={{ textAlign: "center" }}>
                                <div className="form-group col">
                                    <button type="button" className="btn mr-2 text-white btn-sm" id='systemUserCtBtn' style={{ backgroundColor: "rgb(136, 189, 72)", width: "90px" }}
                                        onClick={this.createUser}  >Create</button>
                                    <button type="button" className="btn text-white btn-sm" style={{ backgroundColor: "#0079BF", width: "90px" }}
                                        onClick={this.cancelCreate}>{t('Cancel')}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        )
    }
}

export default withTranslation()(CreatePartner)