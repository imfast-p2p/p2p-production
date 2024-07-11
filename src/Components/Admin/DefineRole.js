import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './DefineRole.css';
import { BASEURL } from '../assets/baseURL';
import AdminSidebar from './AdminSidebar';
import $ from 'jquery';
import { FaSearch, FaUserPlus, FaEllipsisV } from "react-icons/fa";
import dashboardIcon from '../assets/icon_dashboard.png'
import Rolemg from '../assets/Rolemg.png';
import deletUser from '../assets/deleteUser.png';
import addRole from '../assets/addRole.png';
import Tooltip from "@material-ui/core/Tooltip";
import ReactPaginate from 'react-paginate';
import '../Borrower/Pagination.css';
import { FaAngleLeft, FaAngleDoubleRight } from 'react-icons/fa';
import openIt from '../assets/AdminImg/openit.png';
import editRole from '../assets/editRole.png';
import { confirmAlert } from 'react-confirm-alert';
import SystemUserSidebar from '../SystemUser/SystemUserSidebar';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';

var input, filter, ul, li, a, i, txtValue, show;
var pmType = "";
class DefineRole extends Component {

    constructor(props) {
        super(props)
        this.state = {
            roleList: [],
            orgroleList:[],

            offset: 0,
            loanOfferList: [],
            orgtableData: [],
            perPage: 10,
            currentPage: 0,
            pageCount: "",

            groupid: 5,
            rolename: "BASIC ADMIN",
            roledesc: "Adminstrator role",
            permissions: [],
            clients: [],
            roleid: "2",
            roleInfo: "",
            showResults: [],

            permissionList: [],
            allClientsList: [],
            associatePermissionList: []
        }
        this.allRoles = this.allRoles.bind(this);
        this.myFunction = this.myFunction.bind(this);
        this.handlePageClick = this.handlePageClick.bind(this);
        this.loadMoreData = this.loadMoreData.bind(this);
    }


    componentDidMount() {


        if (sessionStorage.getItem('isLogin') == "true" && sessionStorage.getItem('status') == 'Success') {
            this.allRoles();
            sessionStorage.setItem("allRoles", this.allRoles());
            if (sessionStorage.getItem('sAdmin') === "1" && sessionStorage.getItem('pmDefault') === "1") {
                //Super Admin
                pmType = "superAdmin";
                $("#AssignModal").click()
            } else if (sessionStorage.getItem('pmDefault') === "0") {
                pmType = "pmAdmin";
                if (sessionStorage.getItem('pmSysBorID') !== "") {
                }
                
            } else {
                pmType = "platformAdmin";
                
            }
                
        } else {
            window.location = '/login'
        }
        // this.allRoles();
        // sessionStorage.setItem("allRoles", this.allRoles());
    }
    // handlePageClick = (event) => {

    //     const selectedPage = event.selected;
    //     const offset = selectedPage * this.state.perPage;
    //     this.setState({
    //         currentPage: selectedPage,
    //         offset: offset
    //     }, () => {
    //         this.loadMoreData();
    //     })
    // }
    // loadMoreData = () => {
    //     const data = this.state.orgtableData;
    //     const slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
    //     this.setState({
    //         pageCount: Math.ceil(data.length / this.state.perPage),
    //         roleList: slice
    //     })
    // }
    handlePageClick(event) {
        const selectedPage = event.selected;
        const offset = selectedPage * this.state.perPage;
        this.setState({
            currentPage: selectedPage,
            offset: offset
        }, () => {
            this.loadMoreData();
        });
    }

    loadMoreData() {
        const data = this.state.orgroleList;
        const slice = data.slice(this.state.offset, this.state.offset + this.state.perPage);
        this.setState({
            roleList: slice,
            pageCount: Math.ceil(data.length / this.state.perPage)
        });
    }

    allRoles() {
        fetch(BASEURL + '/usrmgmt/usergetallroles', {
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
                    this.setState({ roleList: resdata.msgdata,
                        orgroleList: resdata.msgdata
                     })

                    var data = resdata.msgdata
                    console.log(data)
                    var slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
                    console.log(slice)

                    this.setState({
                        pageCount: Math.ceil(data.length / this.state.perPage),
                        orgtableData: data,
                        roleList: slice
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

    // getPermission(roleid, rolename, roledesc) {
    //     console.log(roleid);
    //     console.log(rolename);
    //     console.log(roledesc);
    //     sessionStorage.setItem("roleId", roleid);
    //     sessionStorage.setItem("roleName", rolename);
    //     sessionStorage.setItem("roleDesc", roledesc);
    //     window.location = "/getPermissions";

    // }
    addRole = () => {
        //$('#addRoleModal').click();
        window.location = ("/createRole")
    }
    rolename = (event) => {
        this.setState({ rolename: event.target.value })
    }

    roledesc = (event) => {
        this.setState({ roledesc: event.target.value })
    }

    createRole = () => {
        fetch(BASEURL + '/usrmgmt/usercreaterole', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                groupid: parseInt(this.state.groupid),
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
                    alert("User role created successfully")
                } else {
                    alert("Issue: " + resdata.message);
                }
            })
    }
    deleteRole = (roleid, rolename) => {
        fetch(BASEURL + '/usrmgmt/submitdeleterole', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                rolename: rolename,
            })
        }).then(response => {
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata)
                if (resdata.status === 'Success') {
                    this.setState({ roleInfo: resdata.data })
                    confirmAlert({
                        message: resdata.message,
                        buttons: [
                            {
                                label: "Okay",
                                onClick: () => {
                                    this.confirmDelete();
                                }
                            },
                            {
                                label: "Cancel",
                                onClick: () => {

                                }
                            }
                        ]
                    })
                } else {
                    alert("Issue: " + resdata.message);
                }
            })
    }
    confirmDelete = () => {
        fetch(BASEURL + '/usrmgmt/confirmdeleterole', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                roleinfo: this.state.roleInfo,
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

                                }
                            }
                        ]
                    })
                    //alert(resdata.message);
                } else {
                    alert(resdata.message);
                }
            })
    }
    getAllclients = (roleid, rolename, roledesc) => {
        this.setState({ roleid: roleid })
        this.setState({ rolename: rolename })
        this.setState({ roledesc: roledesc })

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
                $("#unAssignPermissionsModal").click();
            } else {
                //alert(resdata.message)
            }
        })
    }
    getAllPermissions = (e) => {
        this.setState({ clients: e.target.value })
        fetch(BASEURL + `/usrmgmt/usergetallpermissions?clientid=` + parseInt(e.target.value), {
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
            } else {
                //alert(resdata.message)
            }
        })
    }
    checkPermission = (event, index) => {
        // this.setState({ permissions: event.target.value })
        console.log(event.target.checked);
        console.log(event.target.value);

        const checkBoxDetails = this.state.permissionList;
        checkBoxDetails[index].checked = event.target.checked;
        this.setState({ showResults: checkBoxDetails });
        const checkBoxChecked = this.state.permissions;
        if (event.target.checked == true) {
            checkBoxChecked.push(parseInt(event.target.value));
        } else {
            const index = checkBoxChecked.indexOf(parseInt(event.target.value));
            checkBoxChecked.splice(index, 1);
        }
        console.log(checkBoxChecked)
        this.setState({ permissions: checkBoxChecked })
    }
    SubmitunAssignPermissions = () => {
        fetch(BASEURL + '/usrmgmt/unassignpermissionfromrole', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                rolename: this.state.rolename,
                description: this.state.roledesc,
                clients: [parseInt(this.state.clients)],
                permissions: this.state.permissions
            })
        }).then(response => {
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata)
                if (resdata.status === 'Success') {
                    alert(resdata.message)
                } else {
                    alert(resdata.message);
                }
            })
    }
    getUpdateStatus = (roleid, rolename, roledesc) => {
        this.setState({ roleid: roleid })
        this.setState({ rolename: rolename })
        this.setState({ roledesc: roledesc })

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
                $("#UpdateuserRoleModal").click();
            } else {
                //alert(resdata.message)
            }
        })
    }
    userUpdateRole = () => {
        fetch(BASEURL + '/usrmgmt/userupdaterole', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                rolename: this.state.rolename,
                description: this.state.roledesc,
                clients: [parseInt(this.state.clients)],
                permissions: this.state.permissions
            })
        }).then(response => {
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata)
                if (resdata.status === 'Success') {
                    alert(resdata.message)
                } else {
                    alert(resdata.message);
                }
            })
    }
    getAssociatedPermissions = (roleid, rolename) => {
        this.setState({ rolename: rolename })
        fetch(BASEURL + '/usrmgmt/getassociatedpermissions?roleid=' + roleid, {
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
                $("#viewPermissionsModal").click();
            } else {
                //alert(resdata.message)
            }
        })
    }
    // myFunction(e) {
    //     e.preventDefault();
    //     let filter = e.target.value.toUpperCase();
    //     let ul = document.getElementById("myUL");
    //     let li = ul.getElementsByTagName("tr");

    //     for (let i = 0; i < li.length; i++) {
    //         let a = li[i].getElementsByTagName("td")[0]; // Adjusted to get the first td
    //         if (a) {
    //             let txtValue = a.textContent || a.innerText;
    //             if (txtValue.toUpperCase().indexOf(filter) > -1) {
    //                 li[i].style.display = "";
    //             } else {
    //                 li[i].style.display = "none";
    //             }
    //         }
    //     }
    // }
    myFunction(e) {
        e.preventDefault();
        let filter = e.target.value.toUpperCase();
        let filteredList = this.state.orgroleList.filter(role => {
            return role.rolename.toUpperCase().includes(filter);
        });
        this.setState({
            roleList: filteredList.slice(0, this.state.perPage),
            pageCount: Math.ceil(filteredList.length / this.state.perPage),
            currentPage: 0,
            offset: 0
        });
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
        const myStyle2 = {
            color: "white",
            textAlign: "center",
            textDecoration: "none",
            display: "inline-block",
            cursor: "pointer",
            fontSize: "12px",
            // height: "25px",
            width: "130px",
            border: "none",
            backgroundColor: "rgb(0, 121, 191)",
            borderRadius: "5px",
            padding: "7px 0px"
        }
        const myStyle3 = {
            color: "white",
            textAlign: "center",
            textDecoration: "none",
            display: "inline-block",
            cursor: "pointer",
            fontSize: "12px",
            // height: "25px",
            width: "130px",
            border: "none",
            backgroundColor: "rgba(5,54,82,1)",
            borderRadius: "5px",
            padding: "7px 0px"
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
                    <div className="container-fluid row pt-2" style={{ marginBottom: "-11px" }}>
                        <div className="col-1" id="borAccRes1">
                            <button style={{ marginLeft: "25px" }} onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className='col-4' id="borAccRes2" style={{ marginLeft: "20px", marginTop: "5px" }}>
                            <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                {sessionStorage.getItem('userType') === "0" ?
                                    <Link to="/landing">Home</Link>
                                    :
                                    sessionStorage.getItem('userType') === "1" ?
                                        <Link to="/sysUserDashboard">Home</Link> : ""
                                }
                                / Role Management</p>
                        </div>
                        <div className='col'>

                        </div>
                        <div className='col-3'>

                        </div>
                        <div className="col">
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
                    <hr className="col-11" style={{ marginLeft: "50px", width: "88.6%", backgroundColor: "rgba(4,78,160,1)", marginTop:"-10px" }} />


                    <div className='container-fluid row' style={{ paddingLeft: "82px", marginTop: "-25px" }}>
                        <div className='card' style={{ overflow: "auto" }}>
                            <div className='row pt-2'>
                                <div className='col'>
                                    <ul role="tablist" className="nav nav-pills nav-fill mb-3" >
                                        <li className="nav-item"> <a data-toggle="pill" href="#myEarning-details" className="nav-link active detailsTab"
                                            style={{ textAlign: "center", paddingTop: "10px", paddingBottom: "10px", cursor: "default" }}>
                                            {/* {t('Define or Modify Roles & Associated Permissions')} */}
                                            Define or Modify Roles & Associated Permissions
                                        </a> </li>
                                    </ul>

                                </div>
                            </div>

                            <div className='row mb-2'>
                                <div className='col-12 col-md-10 mb-2 mb-md-0'>
                                    <div className="row example">
                                        <div className='col-12 col-md-10 mb-2 mb-md-0'>
                                            <input type="text" className="form-control" placeholder="Search by Role Name" style={{ height: "38px", color: "rgb(5, 54, 82)" }} name="search" autoComplete='off' onKeyUp={this.myFunction} />
                                        </div>
                                        <div className='col-12 col-md-2' >
                                            <button style={myStyle3}>
                                                <FaSearch style={{ fontSize: "15px" }} />&nbsp;<span style={{ textDecoration: "none", color: "white", fontSize: "15px" }}>Search</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-12 col-md-2'>
                                    <button style={myStyle2} onClick={this.addRole}>
                                        <FaUserPlus style={{ fontSize: "18px" }} />&nbsp;<span style={{ textDecoration: "none", color: "white", fontSize: "15px" }}>Create Role</span>
                                    </button>
                                </div>
                            </div>



                            <div className='row' style={{ marginTop: "-10px" }}>
                                <div className='col'>
                                    <div className='tab-content'>
                                        <div id="myEarning-details" className="register-form tab-pane fade show active" style={{ cursor: "default" }}>
                                            {this.state.roleList == "" ?
                                                <div className="row mt-2" style={{ marginLeft: "6px" }}>
                                                    <div className="col text-center" style={{ color: "#222C70", fontSize: "14px", fontWeight: "500" }}>
                                                        <p>No lists available.</p>
                                                    </div>
                                                </div> :
                                                <>
                                                    <div style={{ whiteSpace: "nowrap" }} id='secondAuditScroll1'>
                                                        <Table responsive>
                                                            <Thead>
                                                                <Tr style={{ fontSize: "15px", color: "rgba(5,54,82,1)", paddingLeft: "6px" }}>
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px" }}>Role Name</Th>
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px" }}>Description</Th>
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px" }}></Th>
                                                                </Tr>
                                                            </Thead>
                                                            <Tbody id="myUL">
                                                                {this.state.roleList.map((role, index) => (
                                                                    <Tr key={index} style={{
                                                                        marginBottom: "-10px", transition: 'none', cursor: 'default', color: "rgba(5,54,82,1)",
                                                                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", backgroundColor: (index % 2 === 0) ? 'rgba(255,255,255,1)' : 'rgba(242,242,242,1)'
                                                                    }}>
                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}> {role.rolename}</Td>
                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}>{role.roledesc}</Td>
                                                                        <Td> <span className="dropdown">

                                                                            <FaEllipsisV style={{ fontSize: "26px" }}
                                                                                className="btn dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" />
                                                                            &nbsp;
                                                                            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton" style={{ marginLeft: "-160px" }}>
                                                                                <a class="dropdown-item" onClick={this.getAssociatedPermissions.bind(this, role.roleid, role.rolename)}>View Permission</a>
                                                                                <a class="dropdown-item" onClick={this.getUpdateStatus.bind(this, role.roleid, role.rolename, role.roledesc)}>Add Permission</a>
                                                                                <a class="dropdown-item" onClick={this.deleteRole.bind(this, role.roleid, role.rolename)}>Delete Role</a>

                                                                                {/* <a class="dropdown-item" onClick={this.getAllclients.bind(this, role.roleid, role.rolename, role.roledesc)}>UnAssign Permission</a> */}
                                                                                {/* <a class="dropdown-item" onClick={this.getPermission.bind(this, role.roleid, role.rolename, role.roledesc)}>Add Permission</a> */}
                                                                            </div>
                                                                        </span>
                                                                        </Td>
                                                                    </Tr>
                                                                ))}
                                                            </Tbody>
                                                        </Table>
                                                        &nbsp;
                                                        {this.state.roleList.length > 1 &&
                                                            <div className="row justify-content-end">
                                                                <div className='col-auto'>
                                                                    <div className='card border-0' style={{ height: "40px" }}>
                                                                        <div style={{ marginTop: "-25px", marginLeft: "16px" }}>
                                                                            <ReactPaginate
                                                                                previousLabel={"<"}
                                                                                nextLabel={">"}
                                                                                breakLabel={"..."}
                                                                                breakClassName={"break-me"}
                                                                                pageCount={this.state.pageCount}
                                                                                onPageChange={this.handlePageClick}
                                                                                containerClassName={"pagination"}
                                                                                subContainerClassName={"pages pagination"}
                                                                                activeClassName={"active"}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>}
                                                    </div>
                                                </>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                    {/* Add Role Modal */}
                    <button type="button" id='addRoleModal' style={{ display: "none" }} class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter">
                        Add Role Modal
                    </button>
                    <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered" role="document">
                            <div class="modal-content">
                                <div class="modal-body">
                                    <div className='row'>
                                        <div className='col'>
                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold", paddingLeft: "10px" }}><img src={addRole} width="25px" />Add Role</p>
                                            <hr style={{ width: "50px", marginTop: "-10px" }} />
                                            <div className='row mb-2'>
                                                <div className='col' style={{ color: "rgba(5,54,82,1)" }}>
                                                    <p style={{ fontWeight: "500" }}>Name</p>
                                                    <input type="text" class="form-control" onChange={this.rolename} placeholder="Name" style={{ height: "38px", color: "rgb(5, 54, 82)", marginTop: "-10px" }} />
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className='col' style={{ color: "rgba(5,54,82,1)" }}>
                                                    <p style={{ fontWeight: "500" }}>Description</p>
                                                    <textarea type="text" class="form-control" onChange={this.roledesc}
                                                        rows={3} cols={30} maxLength={255}
                                                        placeholder="Description" style={{ color: "rgb(5, 54, 82)", marginTop: "-10px" }}>

                                                    </textarea>
                                                </div>
                                            </div>
                                            <hr style={{ backgroundColor: "rgba(5,54,82,1)" }} />
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col' style={{ textAlign: "center" }}>
                                            <button type="button" class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "rgb(0, 121, 191)" }} onClick={this.createRole}>Submit</button>&nbsp;
                                            <button type="button" class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "red" }}>Close</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Add Permission Modal */}
                    <button type="button" id='AddPermissionsModal' style={{ display: "none" }} class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter2">
                        Add Permissions Modal
                    </button>
                    <div class="modal fade" id="exampleModalCenter2" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered" role="document">
                            <div class="modal-content">
                                <div class="modal-body">
                                    <div className='row'>
                                        <div className='col' style={{}}>
                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold", paddingLeft: "10px" }}><img src={editRole} width="25px" />Unassign Role</p>
                                            <hr style={{ width: "50px", marginTop: "-10px" }} />
                                            <div className='row mb-2'>
                                                <div className='col' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                    <p style={{ fontWeight: "500" }}>{this.state.rolename}</p>

                                                    <p style={{ fontWeight: "500" }}>Clients</p>
                                                    <select className='form-select' onChange={this.getAllPermissions} style={{ marginTop: "-13px", color: "rgba(5,54,82,1)" }}>
                                                        <option defaultValue>Select</option>
                                                        {this.state.allClientsList.map((roleLists, index) => (
                                                            <option key={index} value={roleLists.clientid} >{roleLists.clientname} </option>
                                                        ))
                                                        }
                                                    </select>
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className='col' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                    <p style={{ fontWeight: "500" }}>Permissions</p>

                                                    <select className='form-select' onChange={this.checkPermission} style={{ marginTop: "-13px", color: "rgba(5,54,82,1)" }}>
                                                        <option defaultValue>Select</option>
                                                        {
                                                            this.state.permissionList.map((permissions, index) => {
                                                                return (
                                                                    <option key={index} value={permissions.permissionid}>{permissions.permissionname}</option>
                                                                )
                                                            })
                                                        }
                                                    </select>
                                                </div>
                                            </div>
                                            <hr style={{ backgroundColor: "rgba(5,54,82,1)" }} />
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col' style={{ textAlign: "center" }}>
                                            <button type="button" class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.userUpdateRole}>Submit</button>&nbsp;
                                            <button type="button" class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "#0079BF" }}>Cancel</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* UnAssign Permissions Modal */}
                    <button type="button" id='unAssignPermissionsModal' style={{ display: "none" }} class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter3">
                        UnAssign Permissions Modal
                    </button>
                    <div class="modal fade" id="exampleModalCenter3" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered" role="document">
                            <div class="modal-content">
                                <div class="modal-body">
                                    <div className='row'>
                                        <div className='col' style={{}}>
                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold", paddingLeft: "10px" }}><img src={editRole} width="25px" />Unassign Role</p>
                                            <hr style={{ width: "50px", marginTop: "-10px" }} />
                                            <div className='row mb-2'>
                                                <div className='col' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                    <p style={{ fontWeight: "500" }}>{this.state.rolename}</p>

                                                    <p style={{ fontWeight: "500" }}>Clients</p>
                                                    <select className='form-select' onChange={this.getAllPermissions} style={{ marginTop: "-13px", color: "rgba(5,54,82,1)" }}>
                                                        <option defaultValue>Select</option>
                                                        {this.state.allClientsList.map((roleLists, index) => (
                                                            <option key={index} value={roleLists.clientid} >{roleLists.clientname} </option>
                                                        ))
                                                        }
                                                    </select>
                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className='col' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                    <p style={{ fontWeight: "500" }}>Permissions</p>
                                                    <div className='row' style={{ marginTop: "-10px" }}>
                                                        {this.state.permissionList.map((permissions, index) => {
                                                            return (
                                                                <div className="col-6" key={index}>
                                                                    <div className="card" style={{ borderRadius: "15px", cursor: "default" }}>
                                                                        <div className='form-check mt-2'>
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
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                            <hr style={{ backgroundColor: "rgba(5,54,82,1)" }} />
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col' style={{ textAlign: "center" }}>
                                            <button type="button" class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.SubmitunAssignPermissions}>Submit</button>&nbsp;
                                            <button type="button" class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "#0079BF" }}>Cancel</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Update Role Modal */}
                    <button type="button" id='UpdateuserRoleModal' style={{ display: "none" }} class="btn btn-primary" data-toggle="modal" data-target=".bd-example-modal-lg">
                        Update Role Modal
                    </button>
                    <div class="modal fade bd-example-modal-lg" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
                        <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
                            <div class="modal-content">
                                <div class="modal-body">
                                    <div className='row'>
                                        <div className='col' style={{}}>
                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold", paddingLeft: "10px" }}><img src={editRole} width="25px" />Add Permission</p>
                                            <hr style={{ width: "50px", marginTop: "-10px" }} />
                                            <div className='row mb-2'>
                                                <div className='col' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                    <p style={{ fontWeight: "500" }}>{this.state.rolename}</p>

                                                    <p style={{ fontWeight: "500" }}>Clients</p>
                                                    <select className='form-select' onChange={this.getAllPermissions} style={{ marginTop: "-13px", color: "rgba(5,54,82,1)" }}>
                                                        <option defaultValue>Select</option>
                                                        {this.state.allClientsList.map((roleLists, index) => (
                                                            <option key={index} value={roleLists.clientid} >{roleLists.clientname} </option>
                                                        ))
                                                        }
                                                    </select>
                                                </div>
                                            </div>
                                            <div className='row'>
                                                {this.state.permissionList.length > 0 &&
                                                    <div className='col' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                        <p style={{ fontWeight: "500" }}>Permissions</p>
                                                        <div className='row scrollbar' style={{ marginTop: "-10px", height: "200px" }}>
                                                            {this.state.permissionList.map((permissions, index) => {
                                                                return (
                                                                    <div className="col-4" key={index}>
                                                                        <div className="card" style={{ borderRadius: "15px", cursor: "default" }}>
                                                                            <div className='form-check mt-2'>
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
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>
                                                    </div>
                                                }
                                            </div>
                                            <hr style={{ backgroundColor: "rgba(5,54,82,1)" }} />
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col' style={{ textAlign: "center" }}>
                                            <button type="button" class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.userUpdateRole}>Submit</button>&nbsp;
                                            <button type="button" class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "#0079BF" }}>Cancel</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* View Permissions Modal */}
                    <button type="button" id='viewPermissionsModal' style={{ display: "none" }} class="btn btn-primary" data-toggle="modal" data-target=".bd-example-modal-lg2">
                        View permissions Modal
                    </button>
                    <div class="modal fade bd-example-modal-lg2" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true">
                        <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
                            <div class="modal-content">
                                <div class="modal-body">
                                    <div className='row'>
                                        <div className='col' style={{}}>
                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold", paddingLeft: "10px" }}><img src={editRole} width="25px" />View Permissions</p>
                                            <hr style={{ width: "50px", marginTop: "-10px" }} />
                                            <div className='row mb-2'>
                                                <div className='col' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                    <p style={{ fontWeight: "500" }}>{this.state.rolename}</p>
                                                </div>
                                            </div>
                                            <div className='row'>
                                                {this.state.associatePermissionList &&
                                                    <div className='col' style={{ color: "rgba(5,54,82,1)", fontSize: "14px" }}>
                                                        <p style={{ fontWeight: "500" }}>Permissions</p>
                                                        <div className='row scrollbar' style={{ marginTop: "-10px", height: "200px" }}>
                                                            {this.state.associatePermissionList.map((assocPermission, index) => {
                                                                return (
                                                                    <div className="col-4" key={index}>
                                                                        <div className="card" style={{ borderRadius: "15px", cursor: "default" }}>
                                                                            <div className='form-check mt-2'>
                                                                                <div className='row'>
                                                                                    <div className='col' style={{
                                                                                        color: "rgb(40, 116, 166)",
                                                                                        fontWeight: "500", fontSize: "15px", fontStyle: "Poppins"
                                                                                    }}>
                                                                                        <span>{assocPermission.permissionname}</span>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>
                                                    </div>
                                                }
                                            </div>
                                            <hr style={{ backgroundColor: "rgba(5,54,82,1)" }} />
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col' style={{ textAlign: "center" }}>
                                            <button type="button" class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "#0079BF" }}>Cancel</button>
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

export default DefineRole