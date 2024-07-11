import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { EditText } from 'react-edit-text';
import { BASEURL } from '../assets/baseURL';
import AdminSidebar from './AdminSidebar';
import $ from 'jquery';
import { FaAngleLeft } from "react-icons/fa";
import dashboardIcon from '../assets/icon_dashboard.png';
import addUser from '../assets/addUser.png';
import editRole from '../assets/editRole.png';
import { confirmAlert } from 'react-confirm-alert';

export class GetPermissions extends Component {

    constructor(props) {
        super(props)


        this.state = {
            permissionList: [],
            roleid: "2",
            rolename: sessionStorage.getItem("roleName"),
            roledesc: sessionStorage.getItem("roleDesc"),
            permissions: [],
            showResults: [],
            selectedGroup: "",
            roleDetails: []
        }
        this.allPermissions = this.allPermissions.bind(this);
        this.checkPermission = this.checkPermission.bind(this);
        this.updateRole = this.updateRole.bind(this);
        this.getRoleDetails = this.getRoleDetails.bind(this);
        this.deleteRole = this.deleteRole.bind(this);
    }

    componentDidMount() {
        this.allPermissions();
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

    allPermissions() {
        fetch(BASEURL + '/usrmgmt/usergetallpermissions', {
            headers: {
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            }
        })

            .then((Response) => {
                return Response.json();
            })
            .then((resdata) => {
                if (resdata.status == 'Success') {
                    console.log(resdata);
                    this.setState({ permissionList: resdata.msgdata });
                    this.getRoleDetails();
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
                console.log(error)
            })
    }

    permissionNameList(showResults, groupname) {
        $(".permiOptions").show();
        this.setState({ selectedGroup: groupname });

        const userRolePermission = this.state.roleDetails.permissions
        for (let i = 0; i < userRolePermission.length; i++) {
            for (let j = 0; j < showResults.length; j++) {
                if (userRolePermission[i].id === showResults[j].id) {
                    showResults[j].checked = true;
                    console.log(userRolePermission[i].id);
                }
            }
        }

        this.setState({ showResults: showResults });
    }

    checkPermission(event, index) {
        console.log(event.target.checked);
        console.log(event.target.value);

        const userShowDetails = this.state.showResults;
        userShowDetails[index].checked = event.target.checked;
        this.setState({ showResults: userShowDetails });
        const p_id = this.state.permissions;
        if (event.target.checked == true) {
            p_id.push(event.target.value);
        } else {
            const index = p_id.indexOf(event.target.value);
            p_id.splice(index, 1);
        }
        console.log(p_id);
        this.setState({ permissions: p_id })
    }

    updateRole() {
        fetch(BASEURL + '/usrmgmt/userupdaterole', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                roleid: parseInt(sessionStorage.getItem("roleId")),
                rolename: this.state.rolename,
                roledesc: this.state.roledesc,
                permissions: this.state.permissions
            })
        }).then(response => {
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata)
                if (resdata.status === 'Success') {
                    alert("User role updated");
                } else {
                    alert("Issue: " + resdata.message);
                }
            })
    }

    getRoleDetails() {
        fetch(BASEURL + '/usrmgmt/usergetroledetails', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                // roleid: this.state.roleid,
                // rolename: this.state.rolename
                rolename: sessionStorage.getItem("roleName"),
                roleid: parseInt(sessionStorage.getItem("roleId"))
            })
        }).then(response => {
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata)
                if (resdata.status === 'Success') {
                    this.setState({ roleDetails: resdata.msgdata })
                } else {
                    alert("Issue: " + resdata.message);
                }
            })
    }

    deleteRole = () => {
        const popup = window.confirm("Are you sure, you want to delete this user");

        if (popup == true) {
            fetch(BASEURL + '/usrmgmt/userdeleterole', {
                method: 'post',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer " + sessionStorage.getItem('token')
                },
                body: JSON.stringify({
                    rolename: this.state.rolename,
                    roleid: parseInt(this.state.roleid)
                })
            }).then(response => {
                return response.json();
            })
                .then((resdata) => {
                    console.log(resdata)
                    if (resdata.status === 'Success') {
                        alert("User role deleted successfully");
                        window.location = "/defineRole";
                    } else {
                        alert("Issue: " + resdata.message);
                    }
                })
        }


    }
    roledesc = (e) => {
        this.setState({ roledesc: e.target.value })
    }
    rolename = (e) => {
        this.setState({ rolename: e.target.value })
    }
    eidtUser = (e) => {
        $('#updateRoleModal').click();
    }
    cancelRole = () => {
        const popup = window.confirm("Are you sure, to cancel the role updation.");
        if (popup == true) {
            window.location = "/defineRole"
        }
    }

    handleChange() {
        $('.text').toggle();
    }

    render() {

        const name = sessionStorage.getItem("roleName");
        const desc = sessionStorage.getItem("roleDesc");
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

        return (
            <div className="container-dashboard d-flex flex-row" id="wrapper">
                <AdminSidebar />

                <div className="main-content bg-light" id="page-content-wrapper">
                    <div className="container-fluid row pt-2" style={{ marginBottom: "-11px" }}>
                        <div className="col-1" id="borAccRes1">
                            <button style={{ marginLeft: "25px" }} onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className='col-6' id="borAccRes2" style={{ marginLeft: "20px", marginTop: "5px" }}>
                            <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                <Link to="/landing">Home</Link> / <Link to="/defineRole">Role Management</Link> / View Configurations</p>
                        </div>
                        <div className='col'>

                        </div>
                        <div className='col-3'>

                        </div>
                        <div className="col" id="BnavRes3">
                            <button style={myStyle}>
                                <Link to="/defineRole" style={{ marginLeft: "10px" }}><FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} /><span style={{ textDecoration: "none", color: "white" }}>Back</span></Link></button>
                        </div>
                    </div>
                    <hr className="col-11" style={{ marginLeft: "50px", width: "88.6%", backgroundColor: "rgba(4,78,160,1)" }} />

                    <div className='container-fluid row' style={{ paddingLeft: "82px", marginTop: "-20px" }}>
                        <div className='card pt-3'>
                            <div style={{ cursor: "default", color: "#222C70" }} >
                                <div className='row'>
                                    <div className='col-4'>
                                        <p className="font-weight-bold" style={{ marginBottom: "1px" }}>Role Name</p>
                                        <p>{name}</p>
                                    </div>
                                    <div className='col-7'>
                                        <p className="font-weight-bold" style={{ marginBottom: "1px" }}>Description</p>
                                        <p>{desc}</p>
                                    </div>
                                    <div className='col-1'>
                                        <img src={addUser} width="30px" style={{ cursor: "pointer" }} onClick={this.eidtUser} />
                                    </div>
                                </div>
                                <hr style={hrStyle} />

                                <div className='row'>
                                    <div className='col-5' id='headingCust' style={{ marginLeft: "-14px" }}>
                                        <div className="two__image" style={{ paddingLeft: "10px" }}>
                                            <p className="text-white" style={{ paddingBottom: "6px", fontWeight: "600" }}>Select Your Permissions</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="row" style={{ marginTop: "-10px" }}>
                                    <div className="card" id="" style={{ borderRadius: "10px", cursor: "default", marginLeft: "1px" }}>
                                        <div className="row">
                                            {this.state.permissionList.map((permission, index) => {
                                                return (
                                                    <div className="col-4" key={index}>
                                                        <div className="card" style={{
                                                            borderRadius: "5px",
                                                            cursor: "default", paddingTop: "5px", paddingBottom: "10px"
                                                        }}>
                                                            <div className='form-check mt-2'>
                                                                <input className='form-check-input' type='radio'
                                                                    name="example1" id="exampleRadios1" checked={this.state.checked}
                                                                    onClick={this.permissionNameList.bind(this, permission.permissions, permission.groupname)}
                                                                    style={{ marginLeft: "1px", color: "rgba(5,54,82,1)", cursor: "pointer" }} /><span style={{
                                                                        marginLeft: "15px", color: "rgb(40, 116, 166)",
                                                                        fontWeight: "500", fontSize: "15px", fontStyle: "Poppins"
                                                                    }}
                                                                    >&nbsp;&nbsp;{permission.groupname}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                                <div className="row permiOptions" style={{ marginTop: "-10px", display: "none" }}>
                                    <div className="card" id="" style={{ borderRadius: "10px", cursor: "default", marginLeft: "1px" }}>
                                        <div>
                                            <input type="checkbox" id="selectall" className="css-checkbox " name="selectall"
                                                style={{ marginLeft: "10px", color: "rgba(5,54,82,1)", cursor: "pointer" }} />
                                            <span style={{ marginLeft: "15px", color: "rgb(40, 116, 166)", fontWeight: "bolder", fontSize: "13px", fontStyle: "Poppins" }}>&nbsp;Select All Options</span>
                                        </div>
                                        <div className="row ml-3 mr-3">
                                            {
                                                this.state.showResults?.map((permission, index) => {
                                                    return (
                                                        <div className="col-4" key={index}>
                                                            <div className="card" id='checkboX' style={{ borderRadius: "15px", cursor: "default" }}>
                                                                <div className='form-check mt-2'>
                                                                    <div className='row'>
                                                                        <div className='col-2'>
                                                                            <input className='checkboxall' id='' name='check' type='checkbox' checked={permission.checked} onChange={(e) => { this.checkPermission(e, index) }} value={permission.id}
                                                                                style={{ marginLeft: "1px", color: "rgba(5,54,82,1)", cursor: "pointer" }} />
                                                                        </div>
                                                                        <div className='col-8' style={{
                                                                            color: "rgb(40, 116, 166)",
                                                                            fontWeight: "500", fontSize: "15px", fontStyle: "Poppins"
                                                                        }}>
                                                                            <span>{permission.name}</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })
                                            }
                                        </div>
                                    </div>
                                </div>
                                <hr style={{ marginTop: "1px", backgroundColor: "#0079BF" }} />
                                <div className='row mb-2 permiOptions' style={{ display: "none" }}>
                                    <div className='col' style={{ textAlign: "end" }}>
                                        <button className="btn btn-sm text-white" onClick={this.updateRole} style={{ backgroundColor: "rgb(136, 189, 72)" }}>Submit</button>
                                        &nbsp;
                                        <button className='btn btn-sm text-white' onClick={this.cancelRole} style={{ backgroundColor: "#0079BF" }}>Cancel</button>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* Update Role Modal */}
                    <button type="button" id='updateRoleModal' style={{ display: "none" }} class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter">
                        Update Role Modal
                    </button>
                    <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered" role="document">
                            <div class="modal-content">
                                <div class="modal-body">
                                    <div className='row'>
                                        <div className='col' style={{}}>
                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold", paddingLeft: "10px" }}><img src={editRole} width="25px" />Edit Role</p>
                                            <hr style={{ width: "50px", marginTop: "-10px" }} />
                                            <div className='row mb-2'>
                                                <div className='col' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                    <p style={{ fontWeight: "500" }}>Name</p>
                                                    <input type="text" class="form-control" onChange={this.rolename} value={this.state.rolename}
                                                        placeholder="Name" style={{ height: "38px", color: "rgb(5, 54, 82)", marginTop: "-10px" }} />
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className='col' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                    <p style={{ fontWeight: "500" }}>Description</p>
                                                    <textarea type="text" class="form-control" onChange={this.roledesc}
                                                        value={this.state.roledesc} rows={3} cols={30} maxLength={255}
                                                        placeholder="Description" style={{ color: "rgb(5, 54, 82)", marginTop: "-10px" }}>

                                                    </textarea>

                                                </div>
                                            </div>
                                            <hr style={{ backgroundColor: "rgba(5,54,82,1)" }} />
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col' style={{ textAlign: "center" }}>
                                            <button type="button" class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "rgb(136, 189, 72)" }}>Edit</button>&nbsp;
                                            <button type="button" class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "#0079BF" }}>Close</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>



                    {/* <div className="bg-light p-5">
                        <div className="row">
                            <div className="col">
                                <h6>Name:  {name}</h6>
                                <h6>Description: <EditText name="textbox1" defaultValue={desc} /></h6>
                            </div>
                            <div className="col">
                                <button className="btn btn-info float-right" onClick={this.deleteRole}>Delete</button>
                            </div>
                        </div>
                        <hr />
                        <div className="row">
                            <div className="col border-right">
                                <h5>Permissions: {this.state.selectedGroup}</h5>
                                <div>
                                    {
                                        this.state.permissionList.map((permission, index) => {
                                            return (
                                                <div key={index}>
                                                    <h6>
                                                        <a onClick={this.permissionNameList.bind(this, permission.permissions, permission.groupname)} href='#'>{permission.groupname}</a>
                                                    </h6>

                                                </div>
                                            );
                                        })
                                    }
                                </div>
                            </div>
                            <div className="col">
                                {
                                    this.state.showResults?.map((permission, index) => {
                                        return (
                                            <div key={index}>
                                                <ul>
                                                    <li>
                                                        <div className="form-check">
                                                            <input className="form-check-input" type="checkbox" checked={permission.checked} onChange={(e) => { this.checkPermission(e, index) }} value={permission.id} />
                                                            <label className="form-check-label" htmlFor="flexCheckChecked">{permission.name}</label>
                                                        </div>
                                                    </li>
                                                </ul>
                                            </div>
                                        );
                                    })
                                }
                            </div>

                        </div>
                        <div className="row">
                            <div className="col">
                                <Link to="/defineRole">
                                    <button className="btn btn-info float-right">Cancel</button>
                                </Link>
                            </div>
                            <div className="col">
                                <button className="btn btn-success" onClick={this.updateRole}>Submit</button>
                            </div>
                        </div>
                    </div> */}
                </div>
            </div>
        )
    }
}

export default GetPermissions
