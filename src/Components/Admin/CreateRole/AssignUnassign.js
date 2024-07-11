import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { BASEURL } from '../../assets/baseURL';
import AdminSidebar from '../AdminSidebar';
import $ from 'jquery';
import { withTranslation } from 'react-i18next';
import { FaAngleLeft, FaAngleDoubleRight } from 'react-icons/fa';
import dashboardIcon from '../../assets/icon_dashboard.png';
import editRole from '../../assets/editRole.png';
import { confirmAlert } from 'react-confirm-alert';
import batch from '../../assets/batch.png';
import SystemUserSidebar from '../../SystemUser/SystemUserSidebar';
import { BsInfoCircle } from "react-icons/bs";

let selectedPermissions;
let selectedPermissions2;

var pmType = "";
class AssignUnassign extends Component {
    constructor(props) {
        super(props)
        this.state = {
            borrowerid: "",
            isMobileOrEmail: false,

            roleList: [],
            assignedroleList: [],
            memmid: "",
            userType: "",
            roleID: "",
            roleName: "",

            selectedPermissions: [],
            selectedPermissions2: [],
            sysID: "",
            sysUserID: "",

            makerPermissions: [],
            makerPermissions2: [],
            invalidMnum: false,
        }
    }
    componentDidMount() {
        if (sessionStorage.getItem('isLogin') == "true" && sessionStorage.getItem('status') == 'Success') {
            if (sessionStorage.getItem('sAdmin') === "1" && sessionStorage.getItem('pmDefault') === "1") {
                //Super Admin
                pmType = "superAdmin";
                $("#AssignModal").click()
            } else if (sessionStorage.getItem('pmDefault') === "0") {
                pmType = "pmAdmin";
                if (sessionStorage.getItem('pmSysBorID') !== "") {
                }
                console.log(sessionStorage.getItem('pmSysBorID'))
                var sysNumber = sessionStorage.getItem('pmSysBorID');
                var sysUserName = sessionStorage.getItem('fName');
                var sysUserId = sessionStorage.getItem("SysID");
                console.log(sysNumber)
                this.setState({
                    borrowerid: sysNumber,
                    sysID: sysUserName,
                    sysUserID: sysUserId
                }, () => {
                    console.log(this.state.borrowerid, this.state.sysID);
                    this.getAllRoles();
                    this.getAssignedRoles();
                });
                console.log(this.state.borrowerid)
            } else {
                pmType = "platformAdmin";
                //$("#AssignModal").click()
                var sysNumber = sessionStorage.getItem('pmSysBorID');
                var sysUserName = sessionStorage.getItem('fName');
                var sysUserId = sessionStorage.getItem("SysID");
                console.log(sysNumber)
                this.setState({
                    borrowerid: sysNumber,
                    sysID: sysUserName,
                    sysUserID: sysUserId
                }, () => {
                    console.log(this.state.borrowerid, this.state.sysID);
                    this.getAllRoles();
                    this.getAssignedRoles();
                });
                console.log(this.state.borrowerid)
            }

            // if (pmType === "pmAdmin") {
            //     if (sessionStorage.getItem('pmSysBorID') !== "") {
            //     }
            //     console.log(sessionStorage.getItem('pmSysBorID'))
            //     var sysNumber = sessionStorage.getItem('pmSysBorID');
            //     var sysUserName = sessionStorage.getItem('fName')
            //     console.log(sysNumber)
            //     this.setState({
            //         borrowerid: sysNumber,
            //         sysID: sysUserName
            //     }, () => {
            //         console.log(this.state.borrowerid, this.state.sysID);
            //         this.getAssignedRoles();
            //     });
            //     console.log(this.state.borrowerid)
            // }

            //this.getAssignedRoles();
            // $('#right').prop('disabled', true);
            // $('#left').prop('disabled', true);

            // $(function () {
            //     function moveItems(origin, dest) {
            //         $(origin).find(':selected').appendTo(dest);
            //     }
            //     $('#left').click(function () {
            //         moveItems('#hidden', '#visible');
            //     });

            //     $('#right').click(function () {
            //         moveItems('#visible', '#hidden');
            //     });
            // })
            var storedArrayStringJSON = sessionStorage.getItem("rolePermData")
            var storedArray = JSON.parse(storedArrayStringJSON);
            console.log(storedArray);
            if (storedArray) {
                storedArray.forEach(element => {
                    if (element.rolename === "USR_ROLE_MGMT_MAKER") {
                        console.log(element.permissions);
                        this.setState({ makerPermissions: element.permissions })
                    }
                    if (element.rolename === "VRFD_SYS_APPROVER") {
                        console.log(element.permissions);
                        this.setState({ makerPermissions2: element.permissions })
                    }
                });
            }
        } else {
            window.location = '/login'
        }

    }
    callNextRole = () => {
        $("#AssignModal").click();
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
    // getUserBasicInfo = () => {
    //     fetch(BASEURL + '/lsp/getuserbasicinfo', {
    //         method: 'post',
    //         headers: {
    //             'Accept': 'application/json',
    //             'Content-Type': 'application/json',
    //             'Authorization': "Bearer " + sessionStorage.getItem('token')
    //         },
    //         body: JSON.stringify({
    //             userid: this.state.borrowerid,
    //             usertype: "3"
    //         })
    //     }).then(response => {
    //         return response.json();
    //     })
    //         .then((resdata) => {
    //             console.log(resdata)
    //             if (resdata.status === 'Success') {
    //                 confirmAlert({
    //                     message: resdata.message,
    //                     buttons: [
    //                         {
    //                             label: "OK",
    //                             onClick: () => {

    //                             },
    //                         },
    //                     ],
    //                     closeOnClickOutside: false,
    //                 });
    //             } else {
    //                 alert("Issue: " + resdata.message);
    //             }
    //         })
    //         .catch(error => console.log(error)
    //         );
    // }
    assignborMobile = (event) => {
        this.setState({ borrowerid: event.target.value })
        var eventInput = event.target.value;
        var mobileValid = /^[6-9]\d{9}$/;
        if (mobileValid.test(eventInput)) {
            console.log("passed");
            this.setState({
                invalidMnum: false,
                borrowerid: eventInput
            });
            $("#MobSubmitBtn").prop('disabled', false);
        } else {
            this.setState({ invalidMnum: true });
            $("#MobSubmitBtn").prop('disabled', true);
        }
    }

    getAllRoles = () => {
        fetch(BASEURL + '/usrmgmt/usergetallroles', {
            headers: {
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            }
        }).then((Response) => {
            return Response.json();
        })
            .then((resdata) => {
                if (resdata.status == 'Success') {
                    console.log(resdata);
                    this.setState({ roleList: resdata.msgdata })
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
                        // confirmAlert({
                        //     message: resdata.message,
                        //     buttons: [
                        //         {
                        //             label: "OK",
                        //             onClick: () => {
                        //                 // window.location.reload();
                        //             },
                        //         },
                        //     ],
                        // });
                    }
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }
    getAssignedRoles = () => {
        console.log(this.state.borrowerid)
        fetch(BASEURL + '/usrmgmt/getassigneduserroles?mobileno=' + this.state.borrowerid, {
            headers: {
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            }
        }).then((Response) => {
            return Response.json();
        })
            .then((resdata) => {
                if (resdata.status == 'Success') {
                    console.log(resdata);
                    this.setState({
                        assignedroleList: resdata.data.userroles,
                        borrIdforRole: resdata.data.username
                    }, () => {
                        if (this.state.roleList) {
                            const filteredArray1 = this.state.roleList.filter(item1 =>
                                !resdata.data.userroles.some(item2 => item1.roleid == item2.roleid)
                            );
                            console.log(filteredArray1);
                            this.setState({ roleList: filteredArray1 });
                        }
                    });
                }
                else {
                    // alert("Issue: " + resdata.message);
                    this.setState({ assignedroleList: [] })
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }
    assignRoleToUser = () => {
        var ResultData;
        if (pmType === "superAdmin" || pmType === "pmAdmin") {
            // this.state.borrIdforRole;
            ResultData = JSON.stringify({
                username: this.state.sysUserID,
                roles: [
                    {
                        rolename: this.state.borrIdforRole,
                        roleid: this.state.roleID
                    }
                ]
            })
        } else {
            ResultData = JSON.stringify({
                username: this.state.sysUserID,
                roles: [
                    {
                        rolename: this.state.roleName,
                        roleid: this.state.roleID
                    }
                ]
            })
        }
        fetch(BASEURL + '/usrmgmt/assignroletouser', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: ResultData
        }).then((Response) => {
            return Response.json();
        })
            .then((resdata) => {
                if (resdata.status == 'Success') {
                    console.log(resdata);
                    confirmAlert({
                        message: resdata.message,
                        buttons: [
                            {
                                label: "Okay",
                                onClick: () => {
                                    this.getAllRoles();
                                    this.getAssignedRoles();
                                },
                            },
                        ],
                    });
                }
                else {
                    confirmAlert({
                        message: resdata.message,
                        buttons: [
                            {
                                label: "Okay",
                                onClick: () => { },
                            },
                        ],
                    });
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }
    assignRole = (e) => {
        $('#right').prop('disabled', false);
        console.log(e.target.value);
        this.setState({ roleID: e.target.value })
        console.log(this.state.roleID)
        console.log(this.state.roleList)
        this.state.roleList.filter((event) => event.roleid == e.target.value).map((Role, index) => {
            this.setState({ roleID: parseInt(Role.roleid) })
            this.setState({ roleName: Role.rolename })
            console.log(Role.roleid)
            console.log(Role.rolename)
        })
        console.log(this.state.roleID)
    }
    unAssignRole = (e) => {
        $('#left').prop('disabled', false);
        console.log(e.target.value);
        this.setState({ roleID: e.target.value })
        console.log(this.state.roleID)
        console.log(this.state.assignedroleList)
        this.state.assignedroleList.filter((event) => event.roleid == e.target.value).map((Role, index) => {
            this.setState({ roleID: parseInt(Role.roleid) })
            this.setState({ roleName: Role.rolename })
            console.log(Role.roleid)
            console.log(Role.rolename)
        })
        console.log(this.state.roleID)
    }
    unAssignRoleFromUser = () => {
        fetch(BASEURL + '/usrmgmt/deleterolefromuser', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                username: this.state.sysUserID,
                roles: [
                    {
                        rolename: this.state.roleName,
                        roleid: this.state.roleID
                    }
                ]
            })
        }).then((Response) => {
            return Response.json();
        })
            .then((resdata) => {
                if (resdata.status == 'Success') {
                    console.log(resdata);
                    confirmAlert({
                        message: resdata.message,
                        buttons: [
                            {
                                label: "Okay",
                                onClick: () => {
                                    this.getAllRoles();
                                    this.getAssignedRoles();
                                },
                            },
                        ],
                    });
                }
                else {
                    confirmAlert({
                        message: resdata.message,
                        buttons: [
                            {
                                label: "Okay",
                                onClick: () => { },
                            },
                        ],
                    });
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }


    // PM Assign
    handleCheckboxChange = (event, index, roleid) => {
        const checked = event.target.checked;
        console.log(checked);

        this.setState(prevState => {
            selectedPermissions = [...prevState.selectedPermissions];
            if (checked) {
                // If checked, add the permissionId to the array
                selectedPermissions.push(roleid);
            } else {
                // If unchecked, remove the permissionId from the array
                selectedPermissions = selectedPermissions.filter(id => id !== roleid);
            }
            console.log(selectedPermissions)
            return { selectedPermissions };
        });
        console.log(selectedPermissions)
    };

    handleCheckboxChange2 = (event, index, roleid) => {
        const checked = event.target.checked;
        console.log(checked);

        this.setState(prevState => {
            selectedPermissions2 = [...prevState.selectedPermissions2];
            if (checked) {
                // If checked, add the permissionId to the array
                selectedPermissions2.push(roleid);
            } else {
                // If unchecked, remove the permissionId from the array
                selectedPermissions2 = selectedPermissions2.filter(id => id !== roleid);
            }
            console.log(selectedPermissions2)
            return { selectedPermissions2 };
        });
        console.log(selectedPermissions2)
    };
    assignPMRoles = (e) => {
        const { selectedPermissions, roleList, assignedroleList } = this.state
        var mutualArray = [];

        console.log(selectedPermissions);
        roleList.forEach(item1 => {
            // Check if roleId from the first array matches any value in the second array
            if (selectedPermissions.includes(item1.roleid)) {
                mutualArray.push(item1);  // Push the matched item
            }
        });
        var mergedArray = assignedroleList.concat(mutualArray);
        console.log(mergedArray);

        var uniqueJsonArray = mergedArray.filter((obj, index, self) =>
            index === self.findIndex((t) => (
                t.roleid === obj.roleid
            ))
        );
        this.setState({ assignedroleList: uniqueJsonArray })
        console.log(uniqueJsonArray, assignedroleList)
    }
    unAssignPMRoles = (e) => {

    }

    allUsers() {
        fetch(BASEURL + "/usrmgmt/getallsystemusers", {
            method: "get",
            headers: {
                Authorization: "Bearer " + sessionStorage.getItem("token"),
            },
        })
            .then((Response) => {
                return Response.json();
            })
            .then((resdata) => {
                if (resdata.code == "Success") {
                    console.log(resdata);
                    this.setState({ userList: resdata.msgdata });
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
            })
            .catch((error) => {
                console.log(error);
            });
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
        var hrStyle = {
            border: "none",
            borderTop: "2px dashed #0079BF",
            color: "#fff",
            backgroundColor: "#fff",
            height: "1px",
            marginTop: "-4px"
        }
        const { makerPermissions, makerPermissions2 } = this.state;
        return (
            <div className="container-dashboard d-flex flex-row" id="wrapper" style={{ backgroundColor: "#F4F7FC" }}>
                {sessionStorage.getItem('userType') === "0" ?
                    <AdminSidebar />
                    :
                    sessionStorage.getItem('userType') === "1" ?
                        <SystemUserSidebar /> : ""
                }
                <div className="main-content" id="page-content-wrapper">
                    <div className="container-fluid row pt-2">
                        <div className="col-1" id='facnavRes1'>
                            <button style={{ marginLeft: "25px" }} onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className='col-5' id='facnavRes2' style={{ marginLeft: "20px", marginTop: "5px" }}>
                            <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                {sessionStorage.getItem('userType') === "0" ?
                                    <Link to="/landing">Home</Link>
                                    :
                                    sessionStorage.getItem('userType') === "1" ?
                                        <Link to="/sysUserDashboard">Home</Link> : ""
                                } / {pmType === "pmAdmin" || pmType === "superAdmin" ?
                                    (<><Link to="/userManagement">User Management</Link> / Assign Roles</>) :
                                    "Assign Roles"}</p>
                        </div>
                        <div className='col'>

                        </div>
                        <div className='col'>

                        </div>
                        <div className='col-3'>

                        </div>
                        <div className="col" id='facnavRes3'>
                            {pmType === "pmAdmin" || pmType === "superAdmin" ?
                                <button style={myStyle}>
                                    <Link to="/userManagement"><FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} />
                                        <span style={{ textDecoration: "none", color: "white" }}>Back</span></Link>
                                </button> :
                                <button style={myStyle}>
                                    <Link to="/sysUserDashboard"><FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} />
                                        <span style={{ textDecoration: "none", color: "white" }}>Back</span></Link>
                                </button>
                            }
                        </div>
                    </div>
                    <hr className="col-11" style={{ marginLeft: "50px", width: "88.6%", backgroundColor: "rgba(4,78,160,1)", marginTop: "0px" }} />

                    {/* Assign Modal */}
                    <button id='AssignModal' style={{ display: "none" }} type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter">
                    </button>
                    <div className="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" data-backdrop="static">
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content" style={{ width: "300px", marginLeft: "100px" }}>
                                <div className="modal-body">
                                    <div className='row'>
                                        <div className='col'>
                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold" }}><img src={batch} width="25px" />
                                                Enter Mobile Number</p>
                                            <hr style={{ width: "50px", marginTop: "-10px" }} />
                                            <span>
                                                <div className='mb-2'>
                                                    <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold", fontSize: "15px" }}>Mobile Number</p>
                                                    <input className='form-control' type='number' placeholder='Enter Mobile Number' onChange={this.assignborMobile}

                                                        autoComplete='off' style={{ marginTop: "-15px" }} />

                                                    {(this.state.invalidMnum) ? <span className='text-danger' style={{ fontSize: "12px" }}><BsInfoCircle />Invalid Mobile Number</span> : ''}

                                                </div>

                                            </span>

                                            <hr style={{ backgroundColor: "rgba(5,54,82,1)" }} />

                                        </div>

                                    </div>

                                    <div className='row'>

                                        <div className='col' style={{ textAlign: "end" }}>

                                            <button type="button" id="MobSubmitBtn" class="btn text-white btn-sm" data-dismiss="modal"

                                                style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.getAssignedRoles}>Submit</button>
                                            &nbsp;
                                            <button type="button" class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "#0079BF" }}>Cancel</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {pmType === "superAdmin" || pmType === "pmAdmin" ?
                        <div className="card" style={{ cursor: "default", width: "92%", marginLeft: "45px", marginTop: "-10px" }}>
                            <div className="card-header border-1 bg-white">
                                <div className='row' style={{ paddingLeft: "3px" }}>
                                    <div className='col-4' id='headingRef'>
                                        <div className="two__image" style={{ paddingLeft: "10px" }}>
                                            <p className="text-white" style={{ paddingBottom: "6px", fontWeight: "600" }}>Assign Role</p>
                                        </div>
                                    </div>
                                </div>
                                <hr style={hrStyle} />
                                <div className='row'>
                                    <div className='col-5'>
                                        <p className="" style={{ marginBottom: "1px", fontFamily: "Poppins,sans-serif", color: "#222c70", fontWeight: "600" }}>
                                            Name : <span style={{ fontFamily: "Poppins,sans-serif", color: "#222c70", fontWeight: "500" }}>{this.state.borrIdforRole}</span>
                                        </p>

                                    </div>
                                    <div className='col' style={{ textAlign: "end" }}>
                                        <button className='btn btn-sm text-white' style={{ backgroundColor: "rgb(0, 121, 191)" }} onClick={this.callNextRole}>Enter Mobile Number <FaAngleDoubleRight /></button>
                                    </div>
                                </div>
                                <div className='form-row'>
                                    <div className='col-6'>
                                        <p style={{ fontWeight: "500", fontFamily: "Poppins,sans-serif", color: "#222c70" }}>Assign</p>
                                        <select id="visible" multiple scroll={true} className="scrollbar form-select" style={{ height: "180px", marginTop: "-15px" }} onChange={this.assignRole}>
                                            {
                                                this.state.roleList.map((role, index) => (
                                                    <option id='optionVal' key={index} style={{ color: "GrayText", background: "none", fontFamily: "Poppins,sans-serif", color: "#222c70" }} value={role.roleid}>{role.rolename}</option>
                                                ))
                                            }
                                        </select>
                                        <button className='btn btn-sm text-dark' id="right" value=">" style={{ backgroundColor: "rgb(235, 236, 237)", fontWeight: "500" }} onClick={this.assignRoleToUser}>{t('Add Selected >>')}</button>
                                    </div>
                                    <div className='col-6'>
                                        <p style={{ fontWeight: "500", fontFamily: "Poppins,sans-serif", color: "#222c70" }}>Unassign</p>
                                        <select name="cars" id="hidden" multiple scroll={true} className="scrollbar form-select" style={{ height: "180px", marginTop: "-15px" }} onChange={this.unAssignRole}>
                                            {
                                                this.state.assignedroleList.map((assignRole, index) => (
                                                    <option id='optionVal' key={index} style={{ color: "GrayText", background: "none", fontFamily: "Poppins,sans-serif", color: "#222c70" }} value={assignRole.roleid}>{assignRole.rolename}</option>
                                                ))
                                            }
                                        </select>
                                        <button className='btn btn-sm text-dark' id="left" value="<<" style={{ backgroundColor: "rgb(235, 236, 237)", fontWeight: "500" }} onClick={this.unAssignRoleFromUser}>{t('<< Remove Selected')}</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        :
                        <div className="card" style={{ cursor: "default", width: "92%", marginLeft: "45px", marginTop: "-10px" }}>
                            <div className="card-header border-1 bg-white">
                                <div className='row' style={{ paddingLeft: "3px" }}>
                                    <div className='col-5' id='headingRef'>
                                        <div className="two__image" style={{ paddingLeft: "10px" }}>
                                            <p className="text-white" style={{ paddingBottom: "6px", fontWeight: "600" }}>System User Role Assignment</p>
                                        </div>
                                    </div>
                                </div>
                                <div className='row'>
                                    <div className='col-5'>
                                        {this.state.borrIdforRole &&
                                            <p className="" style={{ marginBottom: "1px", fontFamily: "Poppins,sans-serif", color: "#222c70", fontWeight: "600" }}>
                                                Name : <span style={{ fontFamily: "Poppins,sans-serif", color: "#222c70", fontWeight: "500" }}>{this.state.borrIdforRole}</span>
                                            </p>}
                                    </div>
                                    {sessionStorage.getItem('userType') === "1" &&
                                        <div className='col' style={{ textAlign: "end" }}>
                                            <button className='btn btn-sm text-white' style={{ backgroundColor: "rgb(0, 121, 191)" }} onClick={this.callNextRole}>Enter Mobile Number <FaAngleDoubleRight /></button>
                                        </div>
                                    }
                                </div>

                                {/* <div className='form-row'>
                                    <div className='col-6'>
                                        <p style={{ fontWeight: "500", fontFamily: "Poppins,sans-serif", color: "#222c70" }}>Available Role</p>
                                        <div scroll={true} className="scrollbar" style={{ height: "100px", marginTop: "-15px", border: "1px solid black" }}>
                                            {
                                                this.state.roleList.map((role, index) => (
                                                    <div class="form-check" style={{
                                                        backgroundColor: this.state.selectedPermissions.includes(role.roleid)
                                                            ? 'rgb(0, 121, 191)'
                                                            : 'white',
                                                    }}>
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            id={`flexCheckDefault_${index}`}
                                                            value={role.roleid}
                                                            style={{ display: "none" }}
                                                            checked={this.state.selectedPermissions.includes(role.roleid)}
                                                            onChange={(e) => { this.handleCheckboxChange(e, index, role.roleid) }}
                                                        />
                                                        <label class="form-check-label" htmlFor={`flexCheckDefault_${index}`} style={{
                                                            fontFamily: "Poppins,sans-serif",
                                                            fontSize: "15px", fontWeight: "400",
                                                            color: this.state.selectedPermissions.includes(role.roleid)
                                                                ? 'white'
                                                                : '',
                                                        }} >
                                                            {role.rolename}
                                                        </label>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                        <button className='btn btn-sm text-dark' id="right" value=">>" style={{ backgroundColor: "rgb(235, 236, 237)", fontWeight: "500" }} onClick={this.assignPMRoles}>{t('Assign >>')}</button>
                                    </div>
                                    <div className='col-6'>
                                        <p style={{ fontWeight: "500", fontFamily: "Poppins,sans-serif", color: "#222c70" }}>Current Role</p>
                                        <div scroll={true} className="scrollbar" style={{ height: "100px", marginTop: "-15px", border: "1px solid black" }}>
                                            {
                                                this.state.assignedroleList.map((role, index) => (
                                                    <div class="form-check" style={{
                                                        backgroundColor: this.state.selectedPermissions2.includes(role.roleid)
                                                            ? 'rgb(0, 121, 191)'
                                                            : 'white',
                                                    }}>
                                                        <input
                                                            className="form-check-input"
                                                            type="checkbox"
                                                            id={`flexCheckDefault2_${index}`}
                                                            value={role.roleid}
                                                            style={{ display: "none" }}
                                                            checked={this.state.selectedPermissions2.includes(role.roleid)}
                                                            onChange={(e) => { this.handleCheckboxChange2(e, index, role.roleid) }}
                                                        />
                                                        <label class="form-check-label" htmlFor={`flexCheckDefault2_${index}`} style={{
                                                            fontFamily: "Poppins,sans-serif",
                                                            fontSize: "15px", fontWeight: "400",
                                                            color: this.state.selectedPermissions2.includes(role.roleid)
                                                                ? 'white'
                                                                : '',
                                                        }} >
                                                            {role.rolename}
                                                        </label>
                                                    </div>
                                                ))
                                            }
                                        </div>
                                        <button className='btn btn-sm text-dark' id="left" value="<<" style={{ backgroundColor: "rgb(235, 236, 237)", fontWeight: "500" }} onClick={this.unAssignPMRoles}>{t('<< Unassign')}</button>
                                    </div>
                                </div> */}
                                <div className='form-row'>
                                    <div className='col-6'>
                                        <p style={{ fontWeight: "500", fontFamily: "Poppins,sans-serif", color: "#222c70" }}>Available Role</p>
                                        <select id="visible" multiple scroll={true} className="scrollbar form-select" style={{ height: "180px", marginTop: "-15px" }} onChange={this.assignRole}>
                                            {
                                                this.state.roleList.map((role, index) => (
                                                    <option id='optionVal' key={index} style={{ color: "GrayText", background: "none", fontFamily: "Poppins,sans-serif", color: "#222c70" }} value={role.roleid}>{role.rolename}</option>
                                                ))
                                            }
                                        </select>
                                        {makerPermissions.map((permission, index) => {
                                            if (permission.permissionname === "ASSIGN_ROLE_TO_USR" && permission.status === "1") {
                                                return (
                                                    <button className='btn btn-sm text-dark' id="right" value=">" style={{ backgroundColor: "rgb(235, 236, 237)", fontWeight: "500" }} onClick={this.assignRoleToUser}>{t('Assign >>')}</button>
                                                )
                                            }
                                        })}
                                    </div>
                                    <div className='col-6'>
                                        <p style={{ fontWeight: "500", fontFamily: "Poppins,sans-serif", color: "#222c70" }}>Current Role</p>
                                        <select name="cars" id="hidden" multiple scroll={true} className="scrollbar form-select" style={{ height: "180px", marginTop: "-15px" }} onChange={this.unAssignRole}>
                                            {
                                                this.state.assignedroleList.map((assignRole, index) => (
                                                    <option id='optionVal' key={index} style={{ color: "GrayText", background: "none", fontFamily: "Poppins,sans-serif", color: "#222c70" }} value={assignRole.roleid}>{assignRole.rolename}</option>
                                                ))
                                            }
                                        </select>
                                        <button className='btn btn-sm text-dark' id="left" value="<<" style={{ backgroundColor: "rgb(235, 236, 237)", fontWeight: "500" }} onClick={this.unAssignRoleFromUser}>{t('<< Unassign')}</button>
                                        {/* {makerPermissions2.map((permission, index) => {
                                            if (permission.permissionname === "DELETE_ROLE_FROM_USR" && permission.status === "1") {
                                                return (
                                                    <button className='btn btn-sm text-dark' id="left" value="<<" style={{ backgroundColor: "rgb(235, 236, 237)", fontWeight: "500" }} onClick={this.unAssignRoleFromUser}>{t('<< Unassign')}</button>
                                                )
                                            }
                                        })} */}
                                    </div>
                                </div>
                            </div>
                        </div>}

                </div>
            </div >
        )
    }
}

export default withTranslation()(AssignUnassign)