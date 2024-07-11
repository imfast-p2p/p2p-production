import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { BASEURL } from '../../assets/baseURL';
import AdminSidebar from '../AdminSidebar';
import $, { event } from 'jquery';
import { withTranslation } from 'react-i18next';
import { FaAngleLeft, FaAngleDoubleRight } from 'react-icons/fa';
import dashboardIcon from '../../assets/icon_dashboard.png';
import editRole from '../../assets/editRole.png';
import { confirmAlert } from 'react-confirm-alert';
import batch from '../../assets/batch.png';
import SystemUserSidebar from '../../SystemUser/SystemUserSidebar';
var userGrpName;
var clientGrpName;
var pmType = "";
class ManagePermission extends Component {
    constructor(props) {
        super(props)
        this.state = {
            borrowerid: "",
            isMobileOrEmail: false,

            roleList: [],
            memmid: "",
            userType: "",
            roleID: "",
            roleName: "",

            allClientsList: [],
            permissionList: [],
            RoleName: "",
            roledesc: "",
            permissionID: "",
            assignedroleList: [],
            associatePermissionList: [],
            permissionName: "",

            userGrpName: "",
            clientGrpName: "",

            makerPermissions: []
        }
    }
    componentDidMount() {
        if (sessionStorage.getItem('isLogin') == "true" && sessionStorage.getItem('status') == 'Success') {
            this.getAllRoles();
            $("#managePermissionsModal").click()

            //this.getAssignedRoles();
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
            $('#right').prop('disabled', true);
            $('#left').prop('disabled', true);

            var storedArrayStringJSON = sessionStorage.getItem("rolePermData")
            var storedArray = JSON.parse(storedArrayStringJSON);
            console.log(storedArray);
            if (storedArray) {
                storedArray.forEach(element => {
                    if (element.rolename === "VRFD_SYS_APPROVER") {
                        console.log(element.permissions);
                        this.setState({ makerPermissions: element.permissions })
                    }
                });
            }
        } else {
            window.location = '/login'
        }
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
                    $("#exampleModalCenter").hide()
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
    // roleName = (e) => {
    //     this.state.roleList.filter((event) => event.roleid == e.target.value).map((Role, index) => {
    //         this.setState({ RoleName: Role.rolename });
    //         this.setState({ roledesc: Role.roledesc });
    //         this.setState({ roleID: Role.roleid })
    //         this.setState({ userGrpID: Role.usergroupid });
    //         console.log(Role.usergroupname);
    //         this.setState({ userGrpName: Role.usergroupname })
    //         userGrpName = Role.usergroupname;
    //         console.log(userGrpName)
    //     })

    //     // Check if allClientsList is empty before fetching it again
    //     if (!this.state.allClientsList.length) {
    //         this.getAllclients();
    //     }
    //     this.state.allClientsList
    //         .filter((event) => event.clientname == userGrpName)
    //         .map((Client, index) => {
    //             this.setState({ clients: Client.clientid })
    //             this.setState({ clientGrpName: Client.clientname })
    //             clientGrpName = Client.clientname
    //             console.log(clientGrpName)
    //         })
    // }
    roleName = (e) => {
        this.state.roleList.filter((event) => event.roleid == e.target.value).map((Role, index) => {
            this.setState({
                RoleName: Role.rolename,
                roledesc: Role.roledesc,
                roleID: Role.roleid,
                userGrpID: Role.usergroupid,
                userGrpName: Role.usergroupname
            }, () => {
                userGrpName = Role.usergroupname;
                console.log(userGrpName);

                // Check if allClientsList is empty before fetching it again
                // if (!this.state.allClientsList.length) {
                //     this.getAllclients(userGrpName);
                // }
                this.getAllclients(userGrpName);

            });
        });
    };

    getAllclients = (userGrpName) => {
        fetch(BASEURL + '/usrmgmt/getallclients', {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            }
        }).then((Response) => {
            return Response.json();
        }).then((resdata) => {
            console.log(resdata);
            if (resdata.status == "Success") {
                console.log(resdata.data);
                this.setState({ allClientsList: resdata.data });

                this.state.allClientsList
                    .filter((event) => event.clientname === userGrpName)
                    .map((Client, index) => {
                        this.setState({
                            clients: Client.clientid,
                            clientGrpName: Client.clientname
                        });
                    });
                console.log(this.state.clientGrpName)
            } else {
                //alert(resdata.message)
            }
        })
    }
    getAllPermissions = (e) => {
        fetch(BASEURL + `/usrmgmt/usergetallpermissions?clientid=` + parseInt(this.state.clients), {
            method: 'GET',
            headers: {
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            }
        }).then((Response) => {
            return Response.json();
        }).then((resdata) => {
            console.log(resdata);
            if (resdata.status == "Success") {
                console.log(resdata.msgdata);
                this.setState({ permissionList: resdata.msgdata });

                this.getAssociatedPermissions();
            } else {
                //alert(resdata.message)
            }
        })
    }
    getAssociatedPermissions = () => {
        fetch(BASEURL + '/usrmgmt/getassociatedpermissions?roleid=' + this.state.roleID, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            }
        }).then((Response) => {
            return Response.json();
        }).then((resdata) => {
            console.log(resdata);
            if (resdata.status == "Success") {
                console.log(resdata.data);
                this.setState({ associatePermissionList: resdata.msgdata });
            } else {
                //alert(resdata.message)
            }
        })
    }
    clientName = (e) => {
        this.setState({ clients: e.target.value })
    }
    assignPermission = (e) => {
        $('#right').prop('disabled', false);
        console.log(e.target.value);
        this.setState({ permissionID: e.target.value })
        console.log(this.state.permissionList)
        this.state.permissionList.filter((event) => event.permissionid == e.target.value).map((Role, index) => {
            this.setState({ permissionID: parseInt(Role.permissionid) })
        })
    }
    associatePermission = (e) => {
        $('#left').prop('disabled', false);
        console.log(e.target.value);
        console.log(this.state.associatePermissionList)
        this.state.associatePermissionList.filter((event) => event.permissionid == e.target.value).map((assocP, index) => {
            this.setState({ permissionID: parseInt(assocP.permissionid) })
            this.setState({ permissionName: assocP.permissionname })
        })
    }
    assignPermissionsToUser = () => {
        console.log("Permission Assigned")
        fetch(BASEURL + '/usrmgmt/userupdaterole', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                rolename: this.state.RoleName,
                description: this.state.roledesc,
                clients: [parseInt(this.state.clients)],
                permissions: [parseInt(this.state.permissionID)]
            })
        }).then(response => {
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata)
                if (resdata.status === 'Success') {
                    confirmAlert({
                        message: resdata.message,
                        buttons: [
                            {
                                label: "Okay",
                                onClick: () => {
                                    this.getAllPermissions()
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
    }
    unAssignPermissionsUser = () => {
        console.log("Permission unAssigned")
        fetch(BASEURL + '/usrmgmt/unassignpermissionfromrole', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                rolename: this.state.RoleName,
                description: this.state.roledesc,
                clients: [parseInt(this.state.clients)],
                permissions: [parseInt(this.state.permissionID)]
            })
        }).then(response => {
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata)
                if (resdata.status === 'Success') {
                    confirmAlert({
                        message: resdata.message,
                        buttons: [
                            {
                                label: "Okay",
                                onClick: () => {
                                    this.getAllPermissions()
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
                                onClick: () => { },
                            },
                        ],
                    });
                }
            })
    }
    callNextRole = () => {
        $("#managePermissionsModal").click();
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
        const { makerPermissions } = this.state;
        console.log(this.state.userGrpName, this.state.clientGrpName,
            userGrpName)
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
                                }/ Manage Permissions</p>
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

                    {/* managePermissions Modal */}
                    <button id='managePermissionsModal' style={{ display: "none" }} type="button" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter">
                    </button>
                    <div className="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" data-backdrop="static">
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content" style={{ width: "300px", marginLeft: "100px" }}>
                                <div className="modal-body">
                                    <div className='row'>
                                        <div className='col'>
                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold" }}><img src={batch} width="25px" />Select</p>
                                            <hr style={{ width: "50px", marginTop: "-10px" }} />
                                            <span>
                                                <div className='mb-2'>
                                                    <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold", fontSize: "15px" }}>Select Role</p>
                                                    <select className='form-select' onChange={this.roleName} style={{ marginTop: "-15px" }}>
                                                        <option defaultValue>Select</option>
                                                        {this.state.roleList.map((roleLists, index) => (
                                                            <option key={index} value={roleLists.roleid} >{roleLists.rolename} </option>
                                                        ))
                                                        }
                                                    </select>
                                                </div>
                                                <div className='mb-2'>
                                                    <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold", fontSize: "15px" }}>Select Client</p>
                                                    <select className='form-select' onChange={this.clientName} style={{ marginTop: "-15px" }}>
                                                        {this.state.clientGrpName === userGrpName ?
                                                            <>
                                                                {this.state.userGrpName ?
                                                                    <>
                                                                        <option defaultValue>{this.state.userGrpName}</option>
                                                                    </>
                                                                    : <>
                                                                        <option defaultValue>Select</option>
                                                                    </>}
                                                            </> :
                                                            <>
                                                                {/* {this.state.allClientsList.map((clientLists, index) => (
                                                                    <option key={index} value={clientLists.clientid} >{clientLists.clientname} </option>
                                                                ))
                                                                } */}
                                                            </>
                                                        }
                                                    </select>
                                                </div>
                                            </span>
                                            <hr style={{ backgroundColor: "rgba(5,54,82,1)" }} />
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col' style={{ textAlign: "end" }}>
                                            <button type="button" class="btn text-white btn-sm" data-dismiss="modal"
                                                style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.getAllPermissions}>Submit</button>
                                            &nbsp;
                                            <button type="button" class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "#0079BF" }}>Cancel</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="card" style={{ cursor: "default", width: "92%", marginLeft: "45px", marginTop: "-10px" }}>
                        <div className="card-header border-1 bg-white">
                            <div className='row'>
                                <div className='col-5'>
                                    <p className="font-weight-bold" style={{ marginBottom: "1px", fontFamily: "Poppins,sans-serif", color: "#222c70" }}>Name</p>
                                    <p style={{ fontFamily: "Poppins,sans-serif", color: "#222c70" }}>{this.state.RoleName}</p>
                                </div>
                                <div className='col' style={{ textAlign: "end" }}>
                                    <button className='btn btn-sm text-white' style={{ backgroundColor: "rgb(0, 121, 191)" }} onClick={this.callNextRole}>Select Role <FaAngleDoubleRight /></button>
                                </div>
                            </div>
                            <hr style={hrStyle} />
                            <div className='row' style={{ paddingLeft: "3px" }}>
                                <div className='col-4' id='headingRef'>
                                    <div className="two__image" style={{ paddingLeft: "10px" }}>
                                        <p className="text-white" style={{ paddingBottom: "6px", fontWeight: "600" }}>Manage Permissions</p>
                                    </div>
                                </div>
                            </div>

                            <div className='form-row'>
                                <div className='col-6'>
                                    <p style={{ fontWeight: "500", fontFamily: "Poppins,sans-serif", color: "#222c70" }}>Available Permissions</p>
                                    <select id="visible" multiple scroll={true} className="scrollbar form-select" style={{ height: "180px", marginTop: "-15px" }} onChange={this.assignPermission}>
                                        {
                                            this.state.permissionList.map((role, index) => (
                                                <option id='optionVal' key={index} style={{ color: "GrayText", background: "none", fontFamily: "Poppins,sans-serif", color: "#222c70" }} value={role.permissionid}>{role.permissionname}</option>
                                            ))
                                        }
                                    </select>
                                    {makerPermissions.map((permission, index) => {
                                        if (permission.permissionname === "USR_UPDATE_ROLE" && permission.status === "1") {
                                            return (
                                                <button className='btn btn-sm text-dark' id="right" value=">" style={{ backgroundColor: "rgb(235, 236, 237)", fontWeight: "500" }} onClick={this.assignPermissionsToUser}>{t('Add Selected >>')}</button>
                                            )
                                        }
                                    })}
                                </div>
                                <div className='col-6'>
                                    <p style={{ fontWeight: "500", fontFamily: "Poppins,sans-serif", color: "#222c70" }}>Current Permissions</p>
                                    <select name="cars" id="hidden" multiple scroll={true} className="scrollbar form-select" style={{ height: "180px", marginTop: "-15px" }} onChange={this.associatePermission}>
                                        {
                                            this.state.associatePermissionList.map((assocPermission, index) => (
                                                <option id='optionVal' key={index} style={{ color: "GrayText", background: "none", fontFamily: "Poppins,sans-serif", color: "#222c70" }} value={assocPermission.permissionid}>{assocPermission.permissionname}</option>
                                            ))
                                        }
                                    </select>
                                    <button className='btn btn-sm text-dark' id="left" value="<<" style={{ backgroundColor: "rgb(235, 236, 237)", fontWeight: "500" }} onClick={this.unAssignPermissionsUser}>{t('<< Remove Selected')}</button>

                                    {/* {makerPermissions.map((permission, index) => {
                                        if (permission.permissionname === "UNASSIGN_PERMN_FROM_ROLE" && permission.status === "1") {
                                            return (
                                                <button className='btn btn-sm text-dark' id="left" value="<<" style={{ backgroundColor: "rgb(235, 236, 237)", fontWeight: "500" }} onClick={this.unAssignPermissionsUser}>{t('<< Remove Selected')}</button>
                                            )
                                        }
                                    })} */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        )
    }
}

export default withTranslation()(ManagePermission)