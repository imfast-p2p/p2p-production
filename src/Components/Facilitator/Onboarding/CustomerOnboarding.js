import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import { BASEURL } from '../../assets/baseURL';
import FacilitatorSidebar from '../../../SidebarFiles/FacilitatorSidebar';
import { withTranslation } from 'react-i18next';
import SimpleReactValidator from 'simple-react-validator';
import { FaAngleDoubleDown, FaAngleLeft, FaRegFileAlt, FaUserPlus, FaRegTrashAlt, FaUserFriends, FaUserCheck } from 'react-icons/fa';
import dashboardIcon from '../../assets/icon_dashboard.png';
import './customerOnboard.css'
import cusOB2 from '../../assets/cusb2.png';
import regImg from '../../assets/Registration.png';
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import batch from '../../assets/batch.png';
import editRole from '../../assets/editRole.png';
import Loader from '../../Loader/Loader';

var dataList = [];
var globalStateList;
var groupOccupationName;
export class CustomerOnboarding extends Component {
    constructor(props) {
        super(props)
        //updated
        this.state = {
            name: "",
            gender: "",
            dob: "",
            mobilenumber: "",
            email: "",
            pannumber: "",
            utype: 2,

            //member Form Data
            createdGrpName: "",
            createdGrpDesc: "",
            grpFullName: "",
            grpMobNo: "",
            grpEmailID: "",
            grpPinCode: "",
            grpStateCode: "",
            membergrpcategory: [],

            borrowerid: "",
            stateList: [],
            districtList: [],
            district: '',
            distid: '',
            state1: '',
            statecode: '',
            groupOccupation: [],
            occupation: "",
            stateName: "",
            districtName: "",
            showLoader: false,

            limitJson: [],
            talukList: [],
            talukName: "",
            memberNumber: "",

            invalidJlgname: false,
        }
        this.validator = new SimpleReactValidator();

    }
    componentDidMount() {
        $("#onBoardDigi").click(function () {
            $("#onbdigiSubmit").click()
        })

        $(".addMemberForm").hide();
        $("#memberLists").show();
    }
    mobileno = (event) => {
        this.setState({ mobilenumber: event.target.value })
    }
    userRegType = (event) => {
        if (event.target.value == "DIGI") {
            $("#digiAlertModal").click()
            // confirmAlert({
            //     message: "Make sure that Aadhar and PAN are linked to your DigiLocker account.",
            //     buttons: [
            //         {
            //             label: "Agree",
            //             onClick: () => {

            //             }
            //         },
            //         {
            //             label: "Cancel",
            //             onClick: () => {

            //             }
            //         }
            //     ]
            // })
        }
        else if (event.target.value == "REGNOW") {
            window.location = "/onboardRegister";
        } else if (event.target.value == "OFKYC") {
            window.location = "/onboardOfflineAadhar";
        } else if (event.target.value == "AAQR") {
            window.location = "/onboardAadharQR";
        }
    }
    routeDigilockerPage = (e) => {
        $("#digiModal").click();
    }
    onEmailMobileLogin = () => {
        if (!isNaN(this.state.borrowerid)) {
            // mobile number
            this.setState({ isMobileOrEmail: true });
            // this.setState({ user: "" });
        } else if (this.state.borrowerid.indexOf('@') > -1) {
            // email
            this.setState({ isMobileOrEmail: true });
            // this.setState({ user: "" });
        } else {
            // pan
            this.setState({ isMobileOrEmail: false });
        }
        console.log(this.state.user);
    }
    getPrefix() {
        let userPrefix = "";
        if (!this.state.isMobileOrEmail) {
            userPrefix = this.state.user;
        } else if (this.state.borrowerid[0] == 0) {
            userPrefix = this.state.user;
        } else if (this.state.borrowerid[0] in [6, 7, 8, 9]) {
            userPrefix = ""
        }
        return userPrefix;
    }
    borrowerid = (event) => {
        this.setState({ borrowerid: event.target.value })
    }
    groupOccupation = (e) => {
        this.setState({ occupation: e.target.value });
        groupOccupationName = e.target.value;
    }
    verifyBorrProfile = () => {
        this.setState({ showLoader: true })
        fetch(BASEURL + '/lsp/getuserbasicinfo', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                userid: this.getPrefix() + this.state.borrowerid,
                usertype: "3"
            })
        }).then(response => {
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata)
                if (resdata.status === 'SUCCESS') {
                    this.setState({ showLoader: false })

                    var occupationJSON = resdata.msgdata.occupations
                    console.log(occupationJSON)
                    var isOccupationInList = occupationJSON.includes(groupOccupationName);

                    var isStatusVerified = resdata.msgdata.statusid;
                    var isVkycVerified = resdata.msgdata.kycstatus;
                    var isStateMatch = resdata.msgdata.state;
                    var isDistrictMatch = resdata.msgdata.district;
                    var isTalukMatch = resdata.msgdata.taluk;

                    console.log(this.state.stateName, this.state.talukName);
                    // if (isStatusVerified !== "1") {
                    //     console.log("status not verified");
                    //     this.setState({ resMsg: "Group member status is not verified." })
                    //     $("#commonModal").click()
                    // } else if (isVkycVerified !== "1") {
                    //     console.log("KYC not verified");
                    //     this.setState({ resMsg: "Group member KYC is not verified." })
                    //     $("#commonModal").click();
                    // } else 
                    if (isStateMatch !== this.state.stateName) {
                        console.log("State not Matching");
                        this.setState({ resMsg: "Group member state is not matching with group state, please select respective state." })
                        $("#commonModal").click();
                    } else if (isDistrictMatch !== this.state.districtName) {
                        console.log("District not Matching");
                        this.setState({ resMsg: "Group member district is not matching with group district, please select respective district." })
                        $("#commonModal").click();
                    } else if (isTalukMatch !== this.state.talukName) {
                        console.log("Taluk not Matching");
                        this.setState({ resMsg: "Group member taluk is not matching with group taluk, please select respective taluk." })
                        $("#commonModal").click();
                    }
                    else if (isOccupationInList) {
                        console.log("True");
                        var firstJson = {};
                        firstJson = {
                            fullname: resdata.msgdata.borrowername,
                            borid: resdata.msgdata.borrowerid,
                            mmid: parseInt(resdata.msgdata.mmid),
                            kycstatus: resdata.msgdata.kycstatus,
                        }
                        console.log(firstJson);
                        dataList.push(firstJson)
                        console.log(dataList)
                        this.setState({ membergrpcategory: dataList })
                    } else {
                        console.log("false");
                        this.setState({ resMsg: "Group member occupation is not matching with group occupation, please select respective occupation." })
                        $("#commonModal").click()
                    }

                } else {
                    this.setState({ showLoader: false })
                    this.setState({ resMsg: resdata.message })
                    $("#commonModal").click()
                }
            })
            .catch(error => console.log(error)
            );

    }
    deleteMember = (index) => {
        var updatedCategories = dataList.filter((_, i) => i !== index);
        dataList = updatedCategories;
        this.setState({ membergrpcategory: updatedCategories });
        console.log(this.state.membergrpcategory)
    }
    creategroupName = (e) => {
        // this.setState({ createdGrpName: e.target.value });
        var username = e.target.value;
        var isValid = true;
        this.setState({ createdGrpName: username });
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
                createdGrpName: username,
                invalidJlgname: false
            });
        } else {
            this.setState({
                invalidJlgname: true
            });
        }
    }
    creategroupDescription = (e) => {
        this.setState({ createdGrpDesc: e.target.value })
    }
    addMember = (e) => {
        $(".addMemberForm").show();
        $("#memberLists").hide();

    }
    cancelCreateMember = () => {
        $(".addMemberForm").hide();
        $("#memberLists").show();

        document.getElementById('fullName').value = '';
        document.getElementById('mobNo').value = '';
        document.getElementById('emailID').value = '';
        document.getElementById('pinCode').value = '';
        document.getElementById('stateCode').value = 'Select';
    }
    state1 = (event) => {
        this.setState({ state1: event.target.value })
        this.state.stateList
            .filter((e) => e.statecode == event.target.value)
            .map((stateValue) => {
                this.setState({ stateName: stateValue.statename })
                this.getDistrictList(event.target.value);
            })
    }
    district = (event) => {
        this.setState({ district: event.target.value });
        this.getTalukList(event.target.value)
        this.state.districtList
            .filter((e) => e.distid == event.target.value)
            .map((districtvalue) => {
                this.setState({ districtName: districtvalue.distname })
            })
    }
    statecode = (event) => {
        this.setState({ statecode: event.target.value })
    }
    pincode = (event) => {
        this.setState({ pincode: event.target.value })
    }
    getStateList = (data) => {
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
                    this.setState({ stateList: resdata.msgdata })
                }
            })
    }
    getDistrictList = (StateCode) => {
        fetch(BASEURL + '/usrmgmt/getdistrictlist?statecode=' + StateCode, {
            method: 'get',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            }
        }).then((Response) => Response.json())
            .then((resdata) => {
                if (resdata.status === 'Success') {
                    this.setState({
                        districtList: resdata.msgdata.distlist,
                        talukList: [],
                        talukName: ""
                    })
                }
                else {
                    alert(resdata.message);
                    this.setState({
                        districtList: [],
                        talukList: [],
                        talukName: ""
                    })
                }
            })
    }
    getTalukList = (districtCode) => {
        fetch(BASEURL + '/usrmgmt/gettaluklist?districtid=' + districtCode, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            }
        }).then((Response) => Response.json())
            .then((resdata) => {
                if (resdata.status === 'Success') {
                    this.setState({ talukList: resdata.msgdata.taluklist })
                }
                else {
                    this.setState({
                        resMsg: resdata.message,
                        talukList: [],
                        talukName: ""
                    })
                    $("#commonModal").click()
                }
            })
    }
    talukName = (event) => {
        this.setState({ talukName: event.target.value });
    }
    previewInputs = () => {
        let count = this.state.membergrpcategory.length;
        if (count < 4) {
            this.setState({ resMsg: "Members can not be less than 4, please add atleast 4 members." })
            $("#commonModal").click()

        } else {
            $("#viewMoremodal").click();
        }
        // $("#viewMoremodal").click();
    }
    setJlGReg = () => {
        // let mmidArray = this.state.membergrpcategory.filter(item =>
        //     item.hasOwnProperty('mmid')).map(item => ({ "memmid": item.mmid }));
        // console.log(mmidArray);
        $("#exampleModalCenter1").hide();
        this.setState({ showLoader: true })
        let mmidArray = this.state.membergrpcategory
            .filter(item => item.hasOwnProperty('mmid'))
            .map(item => {
                let tempMmid = item.mmid.toString();
                return { memmid: parseInt(tempMmid, 10) };
            });

        console.log(mmidArray);
        fetch(BASEURL + '/usrmgmt/jlg/groupregistration', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                groupname: this.state.createdGrpName,
                groupdesc: this.state.createdGrpDesc,
                groupoccupation: this.state.occupation,
                state: this.state.stateName,
                district: this.state.districtName,
                memberslist: mmidArray,
                taluk: this.state.talukName
            })
        }).then(response => {
            console.log(response)
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata)
                if (resdata.status === 'Success') {
                    console.log(resdata.msgdata);
                    this.setState({ showLoader: false })

                    this.setState({ resMsg: resdata.message })
                    $("#commonModal").click()

                } else if (resdata.status === "Failure") {
                    this.setState({ showLoader: false })
                    this.setState({ resMsg: resdata.message });

                    // var resdata = {
                    //     "memmid": 15765,
                    //     "registeredgroups": [
                    //         "Imfast",
                    //         "Imspl"
                    //     ],
                    //     "mobileno": "8423489934",
                    //     "message": "Registration failed. User reached a maximum limit for registraions.",
                    //     "status": "Failure",
                    //     "statusCode": "1111"
                    // }
                    var demoLimit = resdata.msgdata;
                    console.log(demoLimit);
                    this.setState({ limitJson: demoLimit.registeredgroups });
                    this.setState({ memberNumber: demoLimit.mobileno })
                    // var limit=resdata.msgdata;

                    $("#commonModal").click()

                }
            })
            .catch(err => {
                console.log(err.message)
            })
    }
    getGroupInfo = () => {
        fetch(BASEURL + '/configuration/getgroupinfo', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                groupnames: ["JLG"]

            })
        }).then((Response) => Response.json())
            .then((resdata) => {
                if (resdata.status.includes("Success")) {
                    console.log(resdata.data);
                    var jlg = resdata.data;
                    var jlgArray = jlg.JLG;
                    console.log(jlgArray);
                    jlgArray.filter((data, index) => {
                        console.log(data.attributeoptions);
                        this.setState({ groupOccupation: data.attributeoptions });
                    })
                }
                else {
                    alert(resdata.message);
                }
            })
    }
    reloadPage = () => {
        var msg = this.state.resMsg
        if (msg.includes("successfull")) {
            window.location.reload();
        } else if (msg.includes("Group registration initiated")) {
            window.location = "/facilitatorDashboard";
        }
    }
    clearInputs = () => {
        window.location.reload();
    }
    handleChange() {
        $('.text').toggle();
        $('#PImage').toggle();
        $('#Pinfo').toggle();
    }

    render() {
        const digiURL = BASEURL + "/verification/digilocker/makedigilockercall";
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
        let count = this.state.membergrpcategory.length;
        console.log(this.state.membergrpcategory);

        return (
            <div className="container-dashboard d-flex flex-row" id="wrapper" style={{ marginTop: "-7px", backgroundColor: "#f4f7fc" }}>
                {
                    this.state.showLoader && <Loader />
                }
                <FacilitatorSidebar />
                <div className="main-content" id="page-content-wrapper">
                    <div className="container-fluid row pt-2">
                        <div className="col-1" id='facnavRes1'>
                            <button style={{ marginLeft: "25px" }} onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className='col-4' id='facnavRes2' style={{ marginLeft: "20px", marginTop: "5px" }}>
                            <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                <Link to="/facilitatorDashboard">Home</Link> / Group Registration</p>
                        </div>
                        <div className='col'>

                        </div>
                        <div className='col'>

                        </div>
                        <div className='col-3'>

                        </div>
                        <div className="col" id='facnavRes3'>
                            <button style={myStyle}>
                                <Link to="/facilitatorDashboard"><FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} /><span style={{ textDecoration: "none", color: "white" }}>Back</span></Link></button>
                        </div>
                    </div>
                    <hr className="col-11" style={{ marginLeft: "50px", marginTop: "-10px", width: "88.6%", backgroundColor: "rgba(4,78,160,1)" }} />

                    {/* new Design */}
                    <div className='row' style={{ paddingLeft: "50px" }}>
                        <div className='col-4' id='headingCust'>
                            <div className="two__image" style={{ paddingLeft: "10px" }}>
                                <p className="text-white" style={{ paddingBottom: "6px", fontWeight: "600", fontSize: "15px" }}>Group Registration</p>
                            </div>
                        </div>
                    </div>
                    <div class="container" style={{ width: "94%" }}>
                        <div class="row">
                            <div class="col-md-4 mb-3">
                                <ul class="nav nav-pills flex-column" id="myTab" role="tablist" style={{ textAlign: "center", fontSize: "18px", fontFamily: "Poppins,sans-serif" }}>
                                    {/* <li class="nav-item mb-2" onClick={this.usertype2}>
                                        <a class="nav-link active" id="register-tab" data-toggle="tab"
                                            href="#profile" role="tab" aria-controls="profile" aria-selected="false" value="3"><img src={cusOB2} style={{ width: "30px" }} />Registration</a>
                                    </li> */}
                                    <li class="nav-item mb-2">
                                        <a class="nav-link active" id="jlgregister-tab" data-toggle="tab"
                                            href="#profile2" role="tab" aria-controls="profile2" aria-selected="false" value="3" style={{ fontSize: "15px" }}><FaUserFriends style={{ width: "30px" }} />JLG Registration</a>
                                    </li>
                                </ul>
                            </div>
                            <div class="col-md-8">
                                <div class="tab-content" id="myTabContent" style={{ marginTop: "-15px", marginLeft: "-20px" }}>
                                    <div class="tab-pane fade show" id="profile" role="tabpanel" aria-labelledby="register-tab">
                                        <div className="card" style={{ cursor: "default" }}>
                                            <div className="card-header border-1 bg-white">
                                                <div className='mb-3' style={{ display: "flex", flexDirection: "row", alignItems: "center", paddingTop: "15px", }}>
                                                    <div style={{ flex: 1, height: "3px", backgroundColor: "#004d99", }} />
                                                    <div>
                                                        <h4 className="heading1" style={{ color: "#222C70" }}>
                                                            Choose Registration Option
                                                        </h4>
                                                    </div>
                                                    <div style={{ flex: 1, height: "3px", backgroundColor: "#004d99", }} />
                                                </div>

                                                <div className='row mb-4' onClick={this.userRegType} style={{ color: "#222C70", fontWeight: "bold" }}>
                                                    <div className="col-6">
                                                        <div className="form-check" title='Service unavailable'>
                                                            <p className="form-check-label mr-4">
                                                                <input type="radio" className="form-check-input" style={{ cursor: "pointer" }} name="optradio" value="OFKYC" disabled />
                                                                <span style={{ color: 'gray' }}>
                                                                    {t("With Offline Aadhaar")}
                                                                </span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="col-6">
                                                        <div className="form-check">
                                                            <p className="form-check-label mr-1">
                                                                <input type="radio" className="form-check-input" style={{ cursor: "pointer" }} name="optradio" value="AAQR" />{t("With Aadhaar QR")}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='row mb-4' onClick={this.userRegType} style={{ color: "#222C70", fontWeight: "bold" }}>
                                                    <div className="col-6">
                                                        <div className="form-check">
                                                            <p className="form-check-label mr-4">
                                                                <input type="radio" className="form-check-input" style={{ cursor: "pointer" }} name="optradio" value="DIGI" />{t("With DigiLocker")}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="col-6">
                                                        <div className="form-check">
                                                            <p className="form-check-label mr-4">
                                                                <input type="radio" className="form-check-input" style={{ cursor: "pointer" }} name="optradio" value="REGNOW" />{t("Register Now, Verify Later")}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className='row mb-2' style={{ marginTop: "-20px" }}>
                                                    <div className='col' style={{ textAlign: "center" }}>
                                                        <div className="form-check">
                                                            <img src={regImg} width="25%" height="25%" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="tab-pane fade show active" id="profile2" role="tabpanel" aria-labelledby="jlgregister-tab">
                                        <div className="card" style={{ cursor: "default" }}>
                                            <div className="card-header border-1 bg-white">
                                                <div className='mb-2' style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
                                                    <div style={{ flex: 1, height: "3px", backgroundColor: "#004d99", }} />
                                                    <div>
                                                        <h4 className="heading1" style={{ color: "#222C70", fontSize: "15px" }}>
                                                            JLG Registration
                                                        </h4>
                                                    </div>
                                                    <div style={{ flex: 1, height: "3px", backgroundColor: "#004d99", }} />
                                                </div>
                                                <div className='row'>
                                                    <div className='col' style={{}}>
                                                        <div className='row mb-2'>
                                                            <div className='col-sm-3 col-md-4 col-lg-6' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                                <p style={{ fontWeight: "500" }}>Group Name</p>
                                                                <input type="text" class="form-control" onChange={this.creategroupName}
                                                                    placeholder="Group Name" style={{
                                                                        height: "38px", color: "rgb(5, 54, 82)", marginTop: "-13px",
                                                                        backgroundColor: "whitesmoke"
                                                                    }} />
                                                                {(this.state.invalidJlgname) ? <span className='text-danger'>Invalid Group Name</span> : ''}
                                                            </div>
                                                            <div className='col-sm-3 col-md-4 col-lg-6' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                                <p style={{ fontWeight: "500" }}>Group Description</p>
                                                                <input type="text" class="form-control" onChange={this.creategroupDescription}
                                                                    placeholder="Group Description" style={{
                                                                        height: "38px", color: "rgb(5, 54, 82)", marginTop: "-13px",
                                                                        backgroundColor: "whitesmoke"
                                                                    }} />
                                                            </div>
                                                        </div>
                                                        <div className='row mb-2'>
                                                            <div className='col-sm-3 col-md-4 col-lg-6' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                                <p style={{ fontWeight: "500" }}>State</p>
                                                                <select className='form-select'
                                                                    style={{
                                                                        height: "38px", color: "rgb(5, 54, 82)", marginTop: "-13px",
                                                                        backgroundColor: "whitesmoke"
                                                                    }}
                                                                    onClick={this.getStateList}
                                                                    onChange={this.state1}
                                                                >
                                                                    <option defaultValue>Select State</option>
                                                                    {this.state.stateList.map((states, index) => (
                                                                        <option key={index} value={states.statecode} style={{ color: "GrayText" }}>{states.statename} </option>
                                                                    ))
                                                                    }
                                                                </select>
                                                            </div>
                                                            <div className='col-sm-3 col-md-4 col-lg-6' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                                <p style={{ fontWeight: "500" }}>District</p>
                                                                <select className='form-select'
                                                                    style={{
                                                                        height: "38px", color: "rgb(5, 54, 82)", marginTop: "-13px",
                                                                        backgroundColor: "whitesmoke"
                                                                    }}
                                                                    onChange={this.district}
                                                                >
                                                                    <option defaultValue>Select District</option>
                                                                    {this.state.districtList.map((districts, index) => {
                                                                        return (
                                                                            <option key={index} value={districts.distid} style={{ color: "GrayText" }}>{districts.distname}</option>
                                                                        )
                                                                    })
                                                                    }
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <div className='row mb-2'>
                                                            <div className='col-sm-3 col-md-4 col-lg-6' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                                <p style={{ fontWeight: "500" }}>Taluk</p>
                                                                <select className='form-select'
                                                                    style={{
                                                                        height: "38px", color: "rgb(5, 54, 82)", marginTop: "-13px",
                                                                        backgroundColor: "whitesmoke"
                                                                    }}
                                                                    onChange={this.talukName}
                                                                >
                                                                    <option defaultValue>Select Taluk</option>
                                                                    {this.state.talukList.map((taluk, index) => (
                                                                        <option key={index} value={taluk.talukname} style={{ color: "GrayText" }}>{taluk.talukname} </option>
                                                                    ))
                                                                    }
                                                                </select>
                                                            </div>
                                                            <div className='col-sm-3 col-md-4 col-lg-6' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                                <p style={{ fontWeight: "500" }}>Group Occupation</p>
                                                                <select className='form-select'
                                                                    style={{
                                                                        height: "38px", color: "rgb(5, 54, 82)", marginTop: "-13px",
                                                                        backgroundColor: "whitesmoke"
                                                                    }}
                                                                    onClick={this.getGroupInfo}
                                                                    onChange={this.groupOccupation}
                                                                >
                                                                    <option defaultValue>Select Occupation</option> :
                                                                    {this.state.groupOccupation.map((group, index) => (
                                                                        <option key={index} value={group.attributevalue} style={{ color: "GrayText" }}>{group.attributevalue} </option>
                                                                    ))
                                                                    }
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <div className='row mb-2'>
                                                            <div className='col-sm-3 col-md-4 col-lg-6' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                                <div className='row'>
                                                                    <div className="col-sm-3 col-md-4 col-lg-8 beforeVerID">
                                                                        <div className="">
                                                                            <p style={{ fontWeight: "500", color: "rgba(5,54,82,1)", fontSize: "14px", marginBottom: "2px" }}>Add Group Members</p>
                                                                            <input id="rValue" type="text" onPaste={this.onEmailMobileLogin}
                                                                                onKeyPress={this.onEmailMobileLogin}
                                                                                onChange={this.borrowerid} class="form-control"
                                                                                placeholder={t('Enter Mobile Number')} aria-label="Username"
                                                                                aria-describedby="basic-addon1" value={this.state.borrowerid}
                                                                                style={{ backgroundColor: "whitesmoke" }} />
                                                                        </div>
                                                                    </div>
                                                                    <div className='col-sm-3 col-md-3 col-lg-4 beforeVerID'>
                                                                        <button className='btn text-white' onClick={this.verifyBorrProfile} style={{
                                                                            backgroundColor: "rgb(0, 121, 191)", marginTop: "23px"
                                                                        }}><FaUserPlus style={{ marginTop: "-3px" }} />&nbsp;Add</button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Members */}

                                                        {
                                                            this.state.membergrpcategory.length > 0 ?
                                                                <>
                                                                    <div className='row mt-2'>
                                                                        <div className='col' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                                            <p style={{ fontWeight: "500" }}>
                                                                                {count > 0 &&
                                                                                    <span style={{ fontWeight: "500" }}>Total Group Members: <span style={{ fontWeight: "400" }}>{count}</span></span>
                                                                                }
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                    <div className='' id='memberLists' style={{ marginTop: "-10px" }}>
                                                                        <div className='row' style={{ color: "rgba(5,54,82,1)", fontSize: "15px" }}>
                                                                            <div className='col-3'>
                                                                                <p style={{ fontWeight: "600", marginLeft: "10px" }}>{t('Name')}</p>
                                                                            </div>
                                                                            <div className='col-3'>
                                                                                <p style={{ fontWeight: "600" }}>{t('Borrower ID')}</p>
                                                                            </div>
                                                                            <div className='col-3'>
                                                                                <p style={{ fontWeight: "600" }}>{t('Member ID')}</p>
                                                                            </div>
                                                                            <div className='col-3'>
                                                                                <p style={{ fontWeight: "600", marginLeft: "-13px" }}>{t('KYC Status')}</p>
                                                                            </div>

                                                                        </div>
                                                                        <hr className="col-12" style={{ width: "96%", marginTop: "-10px" }} />

                                                                        <div className="" style={{ marginTop: "-15px" }}>
                                                                            {
                                                                                this.state.membergrpcategory.map((lists, index) => {
                                                                                    return (
                                                                                        <div key={index}>
                                                                                            <div className='card border-0' style={{ cursor: 'default', color: "rgba(5,54,82,1)", marginBottom: '5px', marginTop: '1px', backgroundColor: (index % 2 == 0) ? 'rgba(255,255,255,1)' : 'rgba(242,242,242,1)' }}>
                                                                                                <div className="row item-list align-items-center" style={{ paddingLeft: "5px", paddingRight: "5px" }}>
                                                                                                    <div className='col-3'>
                                                                                                        <p style={{ marginBottom: "5px", marginLeft: "5px" }}>{lists.fullname}</p>
                                                                                                    </div>
                                                                                                    <div className='col-3'>
                                                                                                        <p style={{ marginBottom: "5px", marginLeft: "-5px" }}>{lists.borid}</p>
                                                                                                    </div>
                                                                                                    <div className='col-3'>
                                                                                                        <p style={{ marginBottom: "5px" }}>{lists.mmid}</p>
                                                                                                    </div>
                                                                                                    <div className='col-3'>
                                                                                                        <p style={{ marginBottom: "5px", marginLeft: "-8px" }}>{lists.kycstatus == "1" ? "Verified" :
                                                                                                            <span>{lists.kycstatus == "0" ? "Not Verified" : ""}</span>}
                                                                                                            &nbsp;
                                                                                                            <FaRegTrashAlt style={{ color: "chocolate", cursor: "pointer", marginTop: "-6px", marginLeft: "40px" }}
                                                                                                                title='Delete Member'
                                                                                                                onClick={this.deleteMember.bind(this, index)} /></p>
                                                                                                    </div>
                                                                                                </div >
                                                                                            </div>
                                                                                        </div>
                                                                                    )
                                                                                }
                                                                                )
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                </>

                                                                :
                                                                <div className="empty-message"></div>
                                                        }
                                                        <hr style={{ backgroundColor: "rgba(5,54,82,1)" }} />
                                                    </div>
                                                </div>

                                                <div className='row'>
                                                    <div className='col' style={{ textAlign: "center" }}>
                                                        <button type="button" class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "rgb(136, 189, 72)" }}
                                                            disabled={this.state.membergrpcategory.length <= 0} onClick={this.previewInputs}>Submit</button>&nbsp;
                                                        <button type="button" class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "#0079BF" }} onClick={this.clearInputs}>Cancel</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* DigiLocker Modal */}
                            <button type="button" id='digiModal' style={{ display: "none" }} class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter">
                                launch digiModal
                            </button>
                            <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" data-backdrop="static">
                                <div class="modal-dialog modal-dialog-centered" role="document" style={{ width: "300px" }}>
                                    <div class="modal-content">
                                        <div class="modal-body">
                                            <div className='row'>
                                                <div className='col'>
                                                    <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold" }}><img src={batch} width="25px" />&nbsp;Registration with DigiLocker</p>
                                                    <hr style={{ width: "50px", marginTop: "-10px" }} />
                                                    <div>
                                                        <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold", fontSize: "15px" }}>Mobile Number</p>
                                                        <input className='form-control' type='number' placeholder='Enter Mobile Number' onChange={this.mobileno}
                                                            autoComplete='off' style={{ marginTop: "-10px" }} />
                                                    </div>
                                                    <form name="DigiForm" id="DigiForm" action={digiURL} method="GET" >
                                                        <input type="radio" className="form-check-input" name="u_type" value={this.state.utype} style={{ display: "none" }} defaultChecked />
                                                        <input type="number" className="input" name="mobile_no" id="mobile_no" placeholder="Enter Mobile Number" style={{ display: "none" }} value={this.state.mobilenumber} />
                                                        <input type="submit" name="submit" value="Verify with DigiLocker *" id="onbdigiSubmit" className="btn pl-3 pr-3 pb-2 ml-3 mt-4 mb-2" style={{ backgroundColor: "rgba(0,121,190,1)", color: "white", display: "none" }} />
                                                    </form>
                                                    <hr style={{ backgroundColor: "rgba(5,54,82,1)" }} />
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className='col' style={{ textAlign: "end" }}>
                                                    <button type="button" class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "rgb(136, 189, 72)" }} id="onBoardDigi">Submit</button>
                                                    &nbsp;
                                                    <button type="button" class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "#0079BF" }}>Cancel</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/*  Modal */}
                            <button id='digiAlertModal' style={{ display: "none" }} type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter2">
                            </button>
                            <div className="modal fade" id="exampleModalCenter2" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" data-backdrop="static">
                                <div className="modal-dialog modal-dialog-centered" role="document">
                                    <div className="modal-content" style={{ width: "300px", marginLeft: "100px" }}>
                                        <div className="modal-body">
                                            <div className='row'>
                                                <div className='col'>

                                                    <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold" }}>
                                                        Make sure that Aadhar and PAN are linked to your Digilocker account.
                                                    </p>
                                                    <hr style={{ backgroundColor: "rgba(5,54,82,1)" }} />
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className='col' style={{ textAlign: "center" }}>
                                                    <button type="button" class="btn text-white btn-sm" data-dismiss="modal"
                                                        style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.routeDigilockerPage}>Agree</button>
                                                    &nbsp;
                                                    <button type="button" class="btn text-white btn-sm" data-dismiss="modal"
                                                        style={{ backgroundColor: "#0079bf" }}>Cancel</button>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/*  Common Alert */}
                            <button id='commonModal' style={{ display: "none" }} type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter21">
                            </button>
                            <div className="modal fade" id="exampleModalCenter21" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" data-backdrop="static">
                                <div className="modal-dialog modal-dialog-centered" role="document">
                                    <div className="modal-content" style={{ width: "300px", marginLeft: "100px" }}>
                                        <div className="modal-body">
                                            <div className='row'>
                                                <div className='col'>
                                                    <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold" }}>
                                                        {this.state.resMsg}
                                                    </p>

                                                    {/* {!this.state.limitJson || Object.keys(this.state.limitJson).length === 0 ?
                                                        <>
                                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold", marginBottom: "10px" }}>
                                                                Mobile Number: <span style={{ fontWeight: "400" }}>{this.state.memberNumber}</span>
                                                            </p>

                                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold", marginBottom: "1px" }}>Registered Groups:</p>
                                                            <p style={{ color: "rgba(5,54,82,1)" }}>
                                                                {this.state.limitJson.map((list, index) => {
                                                                    return (
                                                                        <p>{`${index + 1})`}&nbsp;{list}</p>
                                                                    )
                                                                })}
                                                            </p>
                                                        </> : ""} */}
                                                    <hr style={{ backgroundColor: "rgba(5,54,82,1)" }} />
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className='col' style={{ textAlign: "center" }}>
                                                    <button type="button" class="btn text-white btn-sm" data-dismiss="modal"
                                                        style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.reloadPage}>Okay</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* View More Modal */}
                            <button type="button" id='viewMoremodal' style={{ display: "none" }} class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter1">
                                View More modal
                            </button>
                            <div class="modal fade" id="exampleModalCenter1" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                                <div class="modal-dialog modal-dialog-centered" role="document">
                                    <div class="modal-content">
                                        <div class="modal-body">
                                            <div className='row'>
                                                <div className='col'>
                                                    <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold" }}><img src={batch} width="25px" />&nbsp;JLG Group Preview</p>
                                                    <hr style={{ width: "50px", marginTop: "-10px", backgroundColor: "rgb(0, 121, 191)" }} />

                                                    <div className='row' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                        <div className='col-sm-5 col-md-5 col-lg-5'>
                                                            <p className="mb-0 font-weight-bold">Group Name</p>
                                                        </div>
                                                        <div className='col-sm-1 col-md-1 col-lg-1'>
                                                            <p className="mb-0 font-weight-bold">:</p>
                                                        </div>
                                                        <div className='col-sm-6 col-md-6 col-lg-6'>
                                                            <p className="mb-0" style={{ wordWrap: 'break-word' }}>{this.state.createdGrpName}</p>
                                                        </div>
                                                    </div>
                                                    <div className='row' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                        <div className='col-sm-5 col-md-5 col-lg-5'>
                                                            <p className="mb-0 font-weight-bold">Group Description</p>
                                                        </div>
                                                        <div className='col-sm-1 col-md-1 col-lg-1'>
                                                            <p className="mb-0 font-weight-bold">:</p>
                                                        </div>
                                                        <div className='col-sm-6 col-md-6 col-lg-6'>
                                                            <p className="mb-0" style={{ wordWrap: 'break-word' }}>{this.state.createdGrpDesc}</p>
                                                        </div>
                                                    </div>
                                                    <div className='row' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                        <div className='col-sm-5 col-md-5 col-lg-5'>
                                                            <p className="mb-0 font-weight-bold">Group Occupation</p>
                                                        </div>
                                                        <div className='col-sm-1 col-md-1 col-lg-1'>
                                                            <p className="mb-0 font-weight-bold">:</p>
                                                        </div>
                                                        <div className='col-sm-6 col-md-6 col-lg-6'>
                                                            <p className="mb-0" style={{ wordWrap: 'break-word' }}>{this.state.occupation}</p>
                                                        </div>
                                                    </div>
                                                    <div className='row' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                        <div className='col-sm-5 col-md-5 col-lg-5'>
                                                            <p className="mb-0 font-weight-bold">State</p>
                                                        </div>
                                                        <div className='col-sm-1 col-md-1 col-lg-1'>
                                                            <p className="mb-0 font-weight-bold">:</p>
                                                        </div>
                                                        <div className='col-sm-6 col-md-6 col-lg-6'>
                                                            <p className="mb-0" style={{ wordWrap: 'break-word' }}>{this.state.stateName}</p>
                                                        </div>
                                                    </div>
                                                    <div className='row' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                        <div className='col-sm-5 col-md-5 col-lg-5'>
                                                            <p className="mb-0 font-weight-bold">District</p>
                                                        </div>
                                                        <div className='col-sm-1 col-md-1 col-lg-1'>
                                                            <p className="mb-0 font-weight-bold">:</p>
                                                        </div>
                                                        <div className='col-sm-6 col-md-6 col-lg-6'>
                                                            <p className="" style={{ wordWrap: 'break-word' }}>{this.state.districtName}</p>
                                                        </div>
                                                    </div>
                                                    <div className='row' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                        <div className='col-sm-5 col-md-5 col-lg-5'>
                                                            <p className="mb-0 font-weight-bold">Group Members</p>
                                                        </div>
                                                        <div className='col-sm-1 col-md-1 col-lg-1'>
                                                            <p className="mb-0 font-weight-bold">:</p>
                                                        </div>
                                                        <div className='col-sm-6 col-md-6 col-lg-6'>
                                                            {
                                                                this.state.membergrpcategory.map((lists, index) => {
                                                                    return (
                                                                        <p style={{ wordWrap: 'break-word' }}>{`${index + 1})`}&nbsp;{lists.fullname}&nbsp;<FaUserCheck style={{ color: "green" }} /></p>
                                                                    )
                                                                }
                                                                )
                                                            }
                                                        </div>
                                                    </div>
                                                    <hr style={{ backgroundColor: "rgba(5,54,82,1)" }} />
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className='col' style={{ textAlign: "center" }}>
                                                    <button type="button" id='okSubmit' class="btn text-white btn-sm" onClick={this.setJlGReg}
                                                        data-dismiss="modal" style={{ backgroundColor: "rgb(136, 189, 72)" }}>Submit</button>
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
        )
    }
}

export default withTranslation()(CustomerOnboarding)
