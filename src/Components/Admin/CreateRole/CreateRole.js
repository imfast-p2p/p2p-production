import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { BASEURL } from '../../assets/baseURL';
import AdminSidebar from '../AdminSidebar';
import $ from 'jquery';
import { withTranslation } from 'react-i18next';
import { FaAngleLeft } from 'react-icons/fa';
import dashboardIcon from '../../assets/icon_dashboard.png';
import addRoles from '../../assets/addRole.png';
import './createRole.css';
import editRole from '../../assets/editRole.png';
import { confirmAlert } from 'react-confirm-alert';
import SystemUserSidebar from '../../SystemUser/SystemUserSidebar';
var roleData;
var unAssignData;
class CreateRole extends Component {
    constructor(props) {
        super(props)
        this.state = {
            role: false,
            allClientsList: [],
            permissionList: [],
            productid: "",
            data: "",

            rolename: "",
            description: "",
            clients: [],
            permissions: [],
            showResults: []
        }
    }
    componentDidMount() {
        if (sessionStorage.getItem('isLogin') == "true" && sessionStorage.getItem('status') == 'Success') {
            roleData = sessionStorage.getItem("assignRoleFlag")
            unAssignData = sessionStorage.getItem("unassignRoleFlag");
            console.log(roleData);
            console.log(unAssignData);
            if (roleData == "true") {
                $("#assignRoleModal").click();
            } else if (unAssignData == "1") {
                $("#assignRoleModal").click();
            }
            $("#customSwitch1").click(function () {

                if ($(this).is(":checked")) {
                    $(".preference").show();
                    //this.getAllClients()
                } else {
                    $(".preference").hide();
                    $(".permiOptions").hide();
                }
            })
            // $(".preference").click(function () {
            //     $(".permiOptions").show();
            // })

            $('[data-dismiss=modal]').on('click', function (e) {
                sessionStorage.removeItem("assignRoleFlag")
                sessionStorage.removeItem("unassignRoleFlag")
            })
            // $("#selectall").click(function () {
            //     if (this.checked) {
            //         $('.checkall').each(function () {
            //             $(".checkall").prop('checked', true);
            //         })
            //     } else {
            //         $('.checkall').each(function () {
            //             $(".checkall").prop('checked', false);
            //         })
            //     }
            // });
            this.getAllClients();
        } else {
            window.location = '/login'
        }

    }
    roleName = (e) => {
        this.setState({ rolename: e.target.value })
    }
    roleDescription = (e) => {
        this.setState({ description: e.target.value })
    }
    getAllClients = () => {
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
    }
    getProductID = (event) => {
        this.setState({ productid: event.target.value })
        console.log(this.state.productid)
        console.log(event.target.value)
        console.log(this.state.allClientsList)
        this.state.allClientsList.filter((e) => e.clientid == event.target.value).map((prdt, index) => {
            this.setState({ clients: parseInt(prdt.clientid) })
            // this.setState({ rolename: prdt.clientname })
            this.getAllPermissions(event.target.value)
            console.log(this.state.clients)
            console.log(prdt.clientid)
        })
        console.log(this.state.clients)
    }
    getAllPermissions = (clientId) => {
        fetch(BASEURL + `/usrmgmt/usergetallpermissions?clientid=` + clientId, {
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
                $(".permiOptions").show();
            } else {
                $(".permiOptions").hide();
                // confirmAlert({
                //     message: resdata.message,
                //     buttons: [
                //         {
                //             label: "Ok",
                //             onClick: () => {
                //                 $(".permiOptions").hide();
                //             }
                //         }
                //     ]
                // })
            }
        })
    }
    checkPermission(event, index) {
        console.log(event.target.checked);
        console.log(event.target.value);

        const userShowDetails = this.state.permissionList;
        userShowDetails[index].checked = event.target.checked;
        this.setState({ showResults: userShowDetails });
        const p_id = this.state.permissions;
        if (event.target.checked == true) {
            p_id.push(parseInt(event.target.value));
        } else {
            const index = p_id.indexOf(parseInt(event.target.value));
            p_id.splice(index, 1);
        }
        console.log(p_id);
        this.setState({ permissions: p_id })
    }
    userCreateRole = () => {
        fetch(BASEURL + '/usrmgmt/usercreaterole', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                rolename: this.state.rolename,
                description: this.state.description,
                clients: [this.state.clients],
                permissions: this.state.permissions
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
                                    window.location.reload()
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
                                label: "Okay",
                                onClick: () => {
                                },
                            },
                        ],
                        closeOnClickOutside: false,
                    });
                }
            }).catch((error) => {
                console.log(error)
            })
    }
    assignRole = () => {
        sessionStorage.removeItem("assignRoleFlag")
    }
    UnassignRole = () => {
        sessionStorage.removeItem("unassignRoleFlag")
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
                                } / <Link to="/defineRole">View All Roles</Link> / Create Role</p>
                        </div>
                        <div className='col'>

                        </div>
                        <div className='col'>

                        </div>
                        <div className='col-3'>

                        </div>
                        <div className="col" id='facnavRes3'>
                            <button style={myStyle}>
                                <Link to="/landing"><FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} /><span style={{ textDecoration: "none", color: "white" }}>Back</span></Link></button>
                        </div>
                    </div>
                    <hr className="col-11" style={{ marginLeft: "50px", width: "88.6%", backgroundColor: "rgba(4,78,160,1)", marginTop: "0px" }} />
                    <div className="card" style={{ cursor: "default", width: "92%", marginLeft: "45px", marginTop: "-10px" }}>
                        <div className="card-header border-1 bg-white">
                            <div className='row' style={{ paddingLeft: "3px" }}>
                                <div className='col-4' id='headingRef'>
                                    <div className="two__image" style={{ paddingLeft: "10px" }}>
                                        <p className="text-white" style={{ paddingBottom: "6px", fontWeight: "600" }}>Create Role</p>
                                    </div>
                                </div>
                            </div>
                            <div className="form-row" style={{ marginTop: "-10px" }}>
                                <div className="form-group col-md-4">
                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Role Name *')}</p>
                                    <input type="text" className="form-control" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-16px", textTransform: 'uppercase' }}
                                        id="inputAddress" placeholder={t('Enter Role Name')} onChange={this.roleName}
                                    />
                                </div>
                                <div className="form-group col-md-4">
                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Role Description *')}</p>
                                    <input type="text" className="form-control" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-16px" }}
                                        id="inputAddress" placeholder={t('Enter Role Description')} onChange={this.roleDescription}
                                    />
                                </div>
                                <div className="form-group col-md-4">
                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Add Permissions')}</p>
                                    <label class="switch" style={{ marginTop: "-15px" }}>
                                        <input type="checkbox" id="customSwitch1" />
                                        <span class="slider round spanSlider"></span>
                                    </label>
                                    {/* <div class="custom-control custom-switch">
                                        <input type="checkbox" class="custom-control-input" id="customSwitch1" />
                                        <label class="custom-control-label" for="customSwitch1"></label>
                                    </div> */}
                                    {/* <div class="col-sm-5">
                                        <button type="button" class="btn btn-sm btn-secondary btn-toggle" data-toggle="button" aria-pressed="false" autocomplete="off">
                                            <div class="handle"></div>
                                        </button>
                                    </div> */}
                                </div>
                            </div>
                            <div className='preference' style={{ display: "none" }}>
                                <div className='row' style={{ paddingLeft: "3px" }}>
                                    <div className='col-5' id='headingRef' >
                                        <div className="two__image" style={{ paddingLeft: "10px" }}>
                                            <p className="text-white" style={{ paddingBottom: "6px", fontWeight: "600" }}>Select Client</p>
                                        </div>
                                    </div>

                                </div>

                                <div className="form-row" style={{ marginTop: "-10px" }}>
                                    <div className='col-3'>
                                        <select className="form-select" onClick={this.getProductID}>
                                            <option defaultValue>Select</option>
                                            {this.state.allClientsList.map((roleLists, index) => (
                                                <option key={index} value={roleLists.clientid} >{roleLists.clientname} </option>
                                            ))
                                            }
                                        </select>

                                    </div>
                                    {/* <div className="card" id="" style={{ borderRadius: "10px", cursor: "default", marginLeft: "10px", paddingLeft: "5px", paddingRight: "5px" }}>
                                        <div className="row">
                                            {this.state.allClientsList.map((roleLists, index) => {
                                                return (
                                                    <div className="col-3" key={index}>
                                                        <div className="card" style={{ borderRadius: "5px", cursor: "default", paddingTop: "5px", paddingBottom: "10px" }}>
                                                            <div className='form-check mt-2'>
                                                                <input className='form-check-input' type='radio' name="example1" id="exampleRadios1"
                                                                    // checked={this.state.checked}
                                                                    // onClick={this.getAllPermissions.bind(this, roleLists.clientid)}
                                                                    style={{ marginLeft: "1px", color: "rgba(5,54,82,1)", cursor: "pointer" }} /><span style={{
                                                                        marginLeft: "15px", color: "rgb(40, 116, 166)",
                                                                        fontWeight: "500", fontSize: "15px", fontStyle: "Poppins"
                                                                    }}>&nbsp;&nbsp;{roleLists.clientname}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>

                                    </div> */}
                                </div>
                            </div>

                            <div className="row permiOptions" style={{ marginTop: "-10px", display: "none", marginRight: "10px" }}>
                                <div className="card" id="" style={{ borderRadius: "10px", cursor: "default", marginLeft: "10px" }}>
                                    {/* <div>
                                        <input type="checkbox" id="selectall" className="css-checkbox " name="selectall"
                                            style={{ marginLeft: "10px", color: "rgba(5,54,82,1)", cursor: "pointer" }} />
                                        <span style={{ marginLeft: "15px", color: "rgb(40, 116, 166)", fontWeight: "bolder", fontSize: "13px", fontStyle: "Poppins" }}>&nbsp;Select All Options</span>
                                    </div> */}
                                    <div className="row mr-3">
                                        {
                                            this.state.permissionList.map((permissions, index) => {
                                                return (
                                                    <div className="col-4" key={index}>
                                                        <div className='form-check mt-2' id='checkboX'>
                                                            <div className='row'>
                                                                <div className='col-2'>
                                                                    <input className='checkall' id='' name='check' type='checkbox' checked={permissions.checked} onChange={(e) => { this.checkPermission(e, index) }} value={permissions.permissionid}
                                                                        style={{ marginLeft: "1px", color: "rgba(5,54,82,1)", cursor: "pointer" }} />
                                                                </div>
                                                                <div className='col-8' style={{
                                                                    color: "rgb(40, 116, 166)",
                                                                    fontWeight: "500", fontSize: "15px", fontStyle: "Poppins"
                                                                }}>
                                                                    <span>{permissions.permissionname}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }

                                    </div>
                                </div>
                            </div>
                            <hr style={{ marginTop: "1px", backgroundColor: "rgba(5,54,82,1)" }} />
                            <div className="form-row" style={{ textAlign: "end" }}>
                                <div className="form-group col">
                                    <button type="button" className="btn mr-2 text-white btn-sm" style={{ backgroundColor: "rgb(136, 189, 72)", width: "90px" }}
                                        onClick={this.userCreateRole}
                                    >Create</button>
                                    <button type="button" className="btn text-white btn-sm" style={{ backgroundColor: "#0079BF", width: "90px" }}
                                    >{t('Cancel')}</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Assign/unAssign Role Modal */}
                    <button type="button" id='assignRoleModal' style={{ display: "none" }} class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter">
                        Assign/unAssign Role
                    </button>
                    <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" data-backdrop="static">
                        <div class="modal-dialog modal-dialog-centered" role="document">
                            <div class="modal-content">
                                <div class="modal-body">
                                    <div className='row'>
                                        <div className='col' style={{}}>
                                            {roleData == "true" ?
                                                <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold", paddingLeft: "10px" }}><img src={editRole} width="25px" />Assign Role</p> :
                                                <span>{unAssignData == 1 ?
                                                    <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold", paddingLeft: "10px" }}><img src={editRole} width="25px" />UnAssign Role</p> : null
                                                }</span>}

                                            <hr style={{ width: "50px", marginTop: "-10px" }} />

                                            <div className='row mb-2'>
                                                <div className='col' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                    <p style={{ fontWeight: "500" }}>Username/ Mobile Number</p>
                                                    {roleData == "true" ?
                                                        <input type="text" class="form-control"
                                                            placeholder="Name" style={{ height: "38px", color: "rgb(5, 54, 82)", marginTop: "-10px" }} onChange={this.assignUsername} /> :
                                                        <span>{unAssignData == 1 ?
                                                            <input type="text" class="form-control"
                                                                placeholder="Name" style={{ height: "38px", color: "rgb(5, 54, 82)", marginTop: "-10px" }} onChange={this.unAssignUsername} /> : null}</span>}

                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className='col' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                    <p style={{ fontWeight: "500", marginBottom: "5px" }}>Roles</p>
                                                    {roleData == "true" ?
                                                        <select className='form-select'>
                                                            <option>Select</option>
                                                            <option>Assign Data</option>
                                                        </select> :
                                                        <span>{unAssignData == 1 ?
                                                            <select className='form-select'>
                                                                <option>Select</option>
                                                                <option>UnAssign Data</option>
                                                            </select> : null}</span>}
                                                </div>
                                            </div>
                                            <hr style={{ backgroundColor: "rgba(5,54,82,1)" }} />
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col' style={{ textAlign: "center" }}>
                                            {roleData == "true" ?
                                                <button type="button" class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.assignRole}>Assign</button> :
                                                <span>{unAssignData == 1 ?
                                                    <button type="button" class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.UnassignRole}>UnAssign</button> : null}</span>}
                                            &nbsp;
                                            <button type="button" class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "#0079BF" }}>Close</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        )
    }
}

export default withTranslation()(CreateRole)