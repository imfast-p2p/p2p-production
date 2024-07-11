import React, { Component } from 'react';
import dashboardIcon from '../../assets/icon_dashboard.png';
import { FaAngleLeft, FaEllipsisV, FaUserPlus, FaSearch } from "react-icons/fa";
import { Link } from 'react-router-dom';
import Loader from '../../Loader/Loader';
import { withTranslation } from 'react-i18next';
import AdminSidebar from '../AdminSidebar';
import { confirmAlert } from "react-confirm-alert";
import { BASEURL } from '../../assets/baseURL';
import openIt from '../../assets/AdminImg/openit.png'
import ReactPaginate from 'react-paginate';
import '../../Borrower/Pagination.css';
import addRole from '../../assets/addRole.png';
import $ from 'jquery';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import SystemUserSidebar from '../../SystemUser/SystemUserSidebar';
var input, filter, ul, li, a, i, txtValue, show;

var pmType = "";
class ManageClients extends Component {
    constructor() {
        super();
        this.state = {
            clientname: "",
            status: "1",
            usertype: "",
            description: "",

            offset: 0,
            allClientsList: [],
            orgallClientsList: [],
            orgtableData: [],
            perPage: 10,
            currentPage: 0,
            pageCount: "",

            permissionname: "",
            client: "",
            roledesc: "",
            showResults: [],
            permissionNameList: [],

            getAllPermissions: [],
            clientName: "",
            allClientsList2: []
        }
        this.myFunction = this.myFunction.bind(this);
        this.handlePageClick = this.handlePageClick.bind(this);
        this.loadMoreData = this.loadMoreData.bind(this);
    }
    componentDidMount() {
        if (sessionStorage.getItem('isLogin') == "true" && sessionStorage.getItem('status') == 'Success') {
            this.getAllClients()
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
    }
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
        const data = this.state.orgallClientsList;
        const slice = data.slice(this.state.offset, this.state.offset + this.state.perPage);
        this.setState({
            allClientsList: slice,
            pageCount: Math.ceil(data.length / this.state.perPage)
        });
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
                this.setState({ allClientsList: resdata.data,
                    orgallClientsList: resdata.data
                 });

                this.setState({ allClientsList2: resdata.data })
                var data = resdata.data
                console.log(data)
                var slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
                console.log(slice)

                this.setState({
                    pageCount: Math.ceil(data.length / this.state.perPage),
                    orgtableData: data,
                    allClientsList: slice
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
   
    addClient = (e) => {
        $("#createClientModal").click()
    }
    //add Client
    addClientRole = (clientid) => {
        $("#addClientModal").click()
        this.setState({ client: clientid })
        console.log(clientid)
        console.log(this.state.client)
    }
    permissionName = (e) => {
        this.setState({ permissionname: e.target.value })
    }
    roleDesc = (e) => {
        this.setState({ roledesc: e.target.value })
    }
    createClientRole = () => {
        fetch(BASEURL + '/usrmgmt/createpermission', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                permissionname: this.state.permissionname,
                description: this.state.roledesc,
                client: [this.state.client]
            })
        }).then(response => {
            return response.json();
        }).then((resdata) => {
            console.log(resdata);
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
        })
    }
    //remove client
    removeClientRole = (clientname, clientid) => {
        $("#removeClientModal").click()
        this.setState({ clientName: clientname })
        this.setState({ client: clientid })
        console.log(clientid)
        console.log(clientname)
        console.log(this.state.client)
        fetch(BASEURL + `/usrmgmt/usergetallpermissions?clientid=` + clientid, {
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
                console.log(resdata.msgdata);
                this.setState({ getAllPermissions: resdata.msgdata });
            } else {
                alert(resdata.message)
            }
        })
    }
    submitDeletePermission = (permissionname) => {
        fetch(BASEURL + '/usrmgmt/submitdeletepermissionfromclient', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                permissionname: permissionname,
                client: this.state.client,
            })
        }).then(response => {
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata)
                if (resdata.status === 'Success') {
                    //alert(resdata.message)
                    var data = resdata.data;
                    console.log(data);

                    this.confirmDeletePermission(data)
                } else {
                    alert(resdata.message)
                }
            })
    }
    confirmDeletePermission = (data) => {
        fetch(BASEURL + '/usrmgmt/confirmdeletepermissionfromclient', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                permissioninfo: data,
            })
        }).then(response => {
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata)
                if (resdata.status === 'Success') {
                    alert(resdata.message)
                    window.location.reload()
                } else {
                    alert(resdata.message);
                }
            })
    }
    viewClientRole = (clientid) => {
        fetch(BASEURL + `/usrmgmt/usergetallpermissions?clientid=` + clientid, {
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
                this.setState({ getAllPermissions: resdata.msgdata });
                $("#viewClientModal").click();
            } else {
                alert(resdata.message)
            }
        })
    }
    clientName = (e) => {
        this.setState({ clientname: e.target.value })
    }
    // status = (e) => {
    //     this.setState({ status: e.target.value })
    // }
    userType = (e) => {
        this.setState({ usertype: e.target.value })
    }
    description = (e) => {
        this.setState({ description: e.target.value })
        console.log(e.target.value)
    }
    createClient = () => {
        fetch(BASEURL + '/usrmgmt/createclient', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                clientname: this.state.clientname,
                status: this.state.status,
                utype: this.state.usertype,
                description: this.state.description
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
            })
    }
    setUpdatepermissions = (clientname, clientid) => {
        this.setState({ clientName: clientname })
        fetch(BASEURL + `/usrmgmt/usergetallpermissions?clientid=` + clientid, {
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
                this.setState({ getAllPermissions: resdata.msgdata });
                this.setState({ client: clientid })
                $("#updateCPermissionModal").click();
            } else {
                alert(resdata.message)
            }
        })
    }
    checkPermission(event, index) {
        console.log(event.target.checked);
        console.log(event.target.value);

        const checkBoxDetails = this.state.getAllPermissions;
        checkBoxDetails[index].checked = event.target.checked;
        this.setState({ showResults: checkBoxDetails });
        const checkBoxChecked = this.state.permissionNameList;
        if (event.target.checked == true) {
            checkBoxChecked.push(parseInt(event.target.value));
        } else {
            const index = checkBoxChecked.indexOf(parseInt(event.target.value));
            checkBoxChecked.splice(index, 1);
        }
        console.log(checkBoxChecked)
        this.setState({ permissionNameList: checkBoxChecked })
    }
    clientNameFinal = (e) => {
        this.setState({ client: e.target.value })
    }
    updateClientPermission = () => {
        fetch(BASEURL + '/usrmgmt/updateclientpermission', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                permission: this.state.permissionNameList,
                client: parseInt(this.state.client)
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
    myFunction(e) {
        e.preventDefault();
        let filter = e.target.value;
        let filteredList = this.state.orgallClientsList.filter(clients => {
            return clients.clientname.includes(filter);
        });
        this.setState({
            allClientsList: filteredList.slice(0, this.state.perPage),
            pageCount: Math.ceil(filteredList.length / this.state.perPage),
            currentPage: 0,
            offset: 0
        });
        // e.preventDefault();
        // let filter = e.target.value.toUpperCase();
        // let ul = document.getElementById("myUL");
        // let li = ul.getElementsByTagName("tr");

        // for (let i = 0; i < li.length; i++) {
        //     let a = li[i].getElementsByTagName("td")[0]; // Adjusted to get the first td
        //     if (a) {
        //         let txtValue = a.textContent || a.innerText;
        //         if (txtValue.toUpperCase().indexOf(filter) > -1) {
        //             li[i].style.display = "";
        //         } else {
        //             li[i].style.display = "none";
        //         }
        //     }
        // }
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
            <div className="container-dashboard d-flex flex-row" id="wrapper" style={{ marginTop: "-7px", backgroundColor: '#F4F7FC' }}>
                {
                    this.state.showLoader && <Loader />
                }
                {sessionStorage.getItem('userType') === "0" ?
                    <AdminSidebar />
                    :
                    sessionStorage.getItem('userType') === "1" ?
                        <SystemUserSidebar /> : ""
                }
                <div className="main-content" id="page-content-wrapper">
                    <div className="container-fluid row pt-2" style={{ marginBottom: "-11px" }}>
                        <div className="col-1" >
                            <button style={{ marginLeft: "25px" }} onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className='col-4' style={{ marginLeft: "40px", marginTop: "5px" }}>
                            <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                            {sessionStorage.getItem('userType') === "0" ?
                                    <Link to="/landing">Home</Link>
                                    :
                                    sessionStorage.getItem('userType') === "1" ?
                                        <Link to="/sysUserDashboard">Home</Link> : ""
                                } / Manage Clients</p>
                        </div>
                        <div className='col'>

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
                    <hr className="col-11" style={{ marginLeft: "50px", width: "88.6%", backgroundColor: "rgba(4,78,160,1)", marginTop: "5px" }} />


                    <div className='container-fluid row' style={{ paddingLeft: "82px", marginTop: "-25px" }}>
                        <div className='card' style={{ overflow: "auto" }}>
                            <div className='row pt-2'>
                                <div className='col'>
                                    <ul role="tablist" className="nav nav-pills nav-fill mb-3" >
                                        <li className="nav-item"> <a data-toggle="pill" href="#myEarning-details" className="nav-link active detailsTab"
                                            style={{ textAlign: "center", paddingTop: "10px", paddingBottom: "10px", cursor: "default" }}>
                                            &nbsp; {t('View All Clients')} </a> </li>
                                    </ul>

                                </div>
                            </div>

                            <div className='row mb-2'>
                                <div className='col-12 col-md-10 mb-2 mb-md-0'>
                                    <div className='row example'>
                                        <div className='col-12 col-md-10 mb-2 mb-md-0'>
                                            <input type="text" className="form-control" placeholder="Search by Client Name" style={{ height: "38px", color: "rgb(5, 54, 82)" }} name="search" autoComplete='off' onKeyUp={this.myFunction} />
                                        </div>
                                        <div className='col-12 col-md-2'>
                                            <button style={myStyle3}>
                                                <FaSearch style={{ fontSize: "15px" }} />&nbsp;<span style={{ textDecoration: "none", color: "white", fontSize: "15px" }}>Search</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-12 col-md-2'>
                                    <button style={myStyle2} onClick={this.addClient}>
                                        <FaUserPlus style={{ fontSize: "18px" }} />&nbsp;<span style={{ textDecoration: "none", color: "white", fontSize: "15px" }}>Create Clients</span>
                                    </button>
                                </div>
                            </div>


                            <div className='row' style={{ marginTop: "-10px" }}>
                                <div className='col'>
                                    <div className='tab-content'>
                                        <div id="myEarning-details" className="register-form tab-pane fade show active" style={{ cursor: "default" }}>
                                            {this.state.allClientsList == "" ?
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
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('Client Name')}</Th>
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('Status')}</Th>
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('Description')}</Th>
                                                                    <Th style={{ fontWeight: "600", marginTop: "5px" }}></Th>
                                                                </Tr>
                                                            </Thead>
                                                            <Tbody id="myUL">
                                                                {this.state.allClientsList.map((clients, index) => (
                                                                    <Tr key={index} style={{
                                                                        marginBottom: "-10px", transition: 'none', cursor: 'default', color: "rgba(5,54,82,1)",
                                                                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", backgroundColor: (index % 2 === 0) ? 'rgba(255,255,255,1)' : 'rgba(242,242,242,1)'
                                                                    }}>
                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}>{clients.clientname}</Td>
                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}>{clients.status == 1 ? "Active" : "InActive"}</Td>
                                                                        <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}>{clients.clientdesc}</Td>
                                                                        <Td> <span className="dropdown">

                                                                            <FaEllipsisV style={{ fontSize: "26px" }}
                                                                                className="btn dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" />
                                                                            &nbsp;
                                                                            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton" style={{ marginLeft: "-160px" }}>
                                                                                <a class="dropdown-item" onClick={this.addClientRole.bind(this, clients.utype, clients.clientid)}>Create Permission</a>
                                                                                <a class="dropdown-item" onClick={this.removeClientRole.bind(this, clients.clientname, clients.clientid)}>Remove Permission</a>
                                                                                <a class="dropdown-item" onClick={this.viewClientRole.bind(this, clients.clientid)}>View Permission</a>
                                                                                <a class="dropdown-item" onClick={this.setUpdatepermissions.bind(this, clients.clientname, clients.clientid)}>Update Permissions</a>
                                                                            </div>
                                                                        </span>
                                                                        </Td>
                                                                    </Tr>
                                                                ))}
                                                            </Tbody>
                                                        </Table>
                                                        &nbsp;
                                                        {this.state.allClientsList.length > 1 &&
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

                    {/* Create Client Modal */}
                    <button type="button" id='createClientModal' style={{ display: "none" }} class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter">
                        Create Client Modal
                    </button>
                    <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" data-backdrop="static">
                        <div class="modal-dialog modal-dialog-centered" role="document">
                            <div class="modal-content">
                                <div class="modal-body">
                                    <div className='row'>
                                        <div className='col'>
                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold", paddingLeft: "10px" }}><img src={addRole} width="25px" />Create Client</p>
                                            <hr style={{ width: "50px", marginTop: "-10px" }} />
                                            <div className='row mb-2'>
                                                <div className='col' style={{ color: "rgba(5,54,82,1)" }}>
                                                    <p style={{ fontWeight: "500" }}>Client Name</p>
                                                    <input type="text" class="form-control" onChange={this.clientName} placeholder="Name" style={{ height: "38px", color: "rgb(5, 54, 82)", marginTop: "-10px", textTransform: "uppercase" }} />
                                                </div>
                                                <div className='col' style={{ color: "rgba(5,54,82,1)" }}>
                                                    <p style={{ fontWeight: "500" }}>User Type</p>
                                                    <select className='form-select' onChange={this.userType} style={{ marginTop: "-10px", color: "rgb(5,54,82)" }}>
                                                        <option defaultValue>Select</option>
                                                        <option value="2">Lender</option>
                                                        <option value="3">Borrower</option>
                                                        <option value="4">Facilitator</option>
                                                        <option value="5">Evaluator</option>
                                                        <option value="1">System User</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className='row'>
                                                {/* <div className='col' style={{ color: "rgba(5,54,82,1)" }}>
                                                    <p style={{ fontWeight: "500" }}>Status</p>
                                                    <select className='form-select'>
                                                        <option defaultValue>Select</option>
                                                        <option value="1">Active</option>
                                                        
                                                    </select>
                                                </div> */}
                                                <div className='col' style={{ color: "rgba(5,54,82,1)" }}>
                                                    <p style={{ fontWeight: "500" }}>Description</p>
                                                    <textarea type="text" class="form-control" onChange={this.description}
                                                        rows={3} cols={30} maxLength={255}
                                                        placeholder="Description" style={{ color: "rgb(5, 54, 82)", marginTop: "-10px" }}>
                                                    </textarea>
                                                </div>
                                            </div>
                                            <hr style={{ backgroundColor: "rgba(5,54,82,1)" }} />
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col' style={{ textAlign: "end" }}>
                                            <button type="button" class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.createClient}>Submit</button>&nbsp;
                                            <button type="button" class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "#0079BF" }}>Close</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Add Client Modal */}
                    <button type="button" id='addClientModal' style={{ display: "none" }} class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter2">
                        Add Client Modal
                    </button>
                    <div class="modal fade" id="exampleModalCenter2" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" data-backdrop="static">
                        <div class="modal-dialog modal-dialog-centered" role="document">
                            <div class="modal-content">
                                <div class="modal-body">
                                    <div className='row'>
                                        <div className='col'>
                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold", paddingLeft: "10px" }}><img src={addRole} width="25px" />Add Client Permission</p>
                                            <hr style={{ width: "50px", marginTop: "-10px" }} />
                                            <div className='row mb-2'>
                                                <div className='col' style={{ color: "rgba(5,54,82,1)" }}>
                                                    <p style={{ fontWeight: "500" }}>Permission Name</p>
                                                    <input type="text" class="form-control" onChange={this.permissionName} placeholder="Permission Name" style={{ height: "38px", color: "rgb(5, 54, 82)", marginTop: "-10px", textTransform: "uppercase" }} />
                                                </div>

                                            </div>
                                            <div className='row'>
                                                <div className='col' style={{ color: "rgba(5,54,82,1)" }}>
                                                    <p style={{ fontWeight: "500" }}>Description</p>
                                                    <textarea type="text" class="form-control" onChange={this.roleDesc}
                                                        rows={3} cols={30} maxLength={255}
                                                        placeholder="Description" style={{ color: "rgb(5, 54, 82)", marginTop: "-10px" }}>
                                                    </textarea>
                                                </div>
                                            </div>
                                            <hr style={{ backgroundColor: "rgba(5,54,82,1)" }} />
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col' style={{ textAlign: "end" }}>
                                            <button type="button" class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.createClientRole}>Submit</button>&nbsp;
                                            <button type="button" class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "#0079BF" }}>Close</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Remove Client Modal */}
                    <button type="button" id='removeClientModal' style={{ display: "none" }} class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter3">
                        Remove Client Modal
                    </button>
                    <div class="modal fade" id="exampleModalCenter3" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" data-backdrop="static">
                        <div class="modal-dialog modal-dialog-centered" role="document">
                            <div class="modal-content">
                                <div class="modal-body">
                                    <div className='row'>
                                        <div className='col'>
                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold", paddingLeft: "10px" }}><img src={addRole} width="25px" />Remove Client Permission</p>
                                            <hr style={{ width: "50px", marginTop: "-10px" }} />
                                            <div className='row mb-2'>
                                                <div className='col' style={{ color: "rgba(5,54,82,1)" }}>
                                                    <p style={{ fontWeight: "500" }}>Client Name</p>
                                                    <input type="text" class="form-control" placeholder="Client Name" value={this.state.clientName}
                                                        style={{ height: "38px", color: "rgb(5, 54, 82)", marginTop: "-10px", textTransform: "uppercase" }} readOnly />
                                                </div>

                                            </div>
                                            <div className='row'>
                                                <div className='col' style={{ color: "rgba(5,54,82,1)" }}>
                                                    {/* <p style={{ fontWeight: "500" }}>Permissions</p> */}
                                                    <div className="scrollbar" style={{height:"450px", overflowY:"auto"}}>
                                                    <Table>
                                                        <Thead>
                                                            <Tr className='pl-4 font-weight-normal' style={{ fontSize: "15px", fontFamily: "'Poppins', sans-serif", color: "rgba(5,54,82,1)", paddingLeft: "6px" }}>
                                                                <Th style={{ fontWeight: "600", textAlign: "left", marginTop: "5px" }}>{t('Permissions')}</Th>
                                                            </Tr>
                                                        </Thead>

                                                        <Tbody>
                                                            {
                                                                this.state.getAllPermissions.map((permissions, index) => {
                                                                    return (

                                                                        <Tr key={index}
                                                                            style={{
                                                                                fontSize: "15px", fontFamily: "'Poppins', sans-serif", color: "rgb(5, 54, 82)",
                                                                                transition: 'none', cursor: 'default', backgroundColor: (index % 2 == 0) ? 'rgba(255,255,255,1)' : 'rgba(242,242,242,1)'
                                                                            }}>
                                                                            <Td style={{ fontWeight: "490", textAlign: "left", paddingTop: "12px" }}>{permissions.permissionname}</Td>
                                                                            <Td style={{ fontWeight: "490", textAlign: "left", paddingTop: "12px" }}><span className="dropdown">

                                                                                <FaEllipsisV style={{ fontSize: "26px" }}
                                                                                    className="btn dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" />
                                                                                &nbsp;
                                                                                <div className="dropdown-menu" aria-labelledby="dropdownMenuButton" style={{ marginLeft: "-160px" }}>
                                                                                    <a class="dropdown-item" onClick={this.submitDeletePermission.bind(this, permissions.permissionname)}>Remove Role</a>

                                                                                </div>
                                                                            </span></Td>
                                                                        </Tr>
                                                                    )
                                                                })
                                                            }
                                                        </Tbody>
                                                    </Table>
                                                    </div>
                                                    
                                                </div>
                                            </div>
                                            <hr style={{ backgroundColor: "rgba(5,54,82,1)" }} />
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col' style={{ textAlign: "end" }}>
                                            <button type="button" class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "#0079BF" }}>Close</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* View All Client Modal */}
                    <button type="button" id='viewClientModal' style={{ display: "none" }} class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter4">
                        View All Client Modal
                    </button>
                    <div class="modal fade" id="exampleModalCenter4" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" data-backdrop="static">
                        <div class="modal-dialog modal-dialog-centered" role="document">
                            <div class="modal-content">
                                <div class="modal-body">
                                    <div className='row'>
                                        <div className='col'>
                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold", paddingLeft: "10px" }}><img src={addRole} width="25px" />View Client Permission</p>
                                            <hr style={{ width: "50px", marginTop: "-10px" }} />
                                            <div className="scrollbar" style={{height:"450px", overflowY:"auto"}}>
                                            <Table >
                                                <Thead>
                                                    <Tr className='pl-4 font-weight-normal' style={{ fontSize: "15px", fontFamily: "'Poppins', sans-serif", color: "rgba(5,54,82,1)", paddingLeft: "6px" }}>
                                                        <Th style={{ fontWeight: "600", textAlign: "left", marginTop: "5px" }}>{t('Permissions')}</Th>
                                                        <Th style={{ fontWeight: "600", textAlign: "left", marginTop: "5px" }}>{t('Description')}</Th>
                                                    </Tr>
                                                </Thead>
                                                <Tbody>
                                                    {
                                                        this.state.getAllPermissions.map((permissions, index) => {
                                                            return (

                                                                <Tr key={index}
                                                                    style={{
                                                                        fontSize: "14px", fontFamily: "'Poppins', sans-serif", color: "rgb(5, 54, 82)",
                                                                        transition: 'none', cursor: 'default', backgroundColor: (index % 2 == 0) ? 'rgba(255,255,255,1)' : 'rgba(242,242,242,1)'
                                                                    }}>
                                                                    <Td style={{ fontWeight: "490", textAlign: "left", paddingTop: "12px" }}>{permissions.permissionname}</Td>
                                                                    <Td style={{ fontWeight: "490", textAlign: "left", paddingTop: "12px" }}>{permissions.permissiondesc}</Td>
                                                                </Tr>
                                                            )
                                                        })
                                                    }
                                                </Tbody>
                                            </Table>
                                            </div>

                                            <hr style={{ backgroundColor: "rgba(5,54,82,1)" }} />
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col' style={{ textAlign: "end" }}>
                                            <button type="button" class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "#0079BF" }}>Close</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Update Client permission Modal */}
                    <button type="button" id='updateCPermissionModal' style={{ display: "none" }} class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter5">
                        Update Client permission Modal
                    </button>
                    <div class="modal fade" id="exampleModalCenter5" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" data-backdrop="static">
                        <div class="modal-dialog modal-dialog-centered" role="document">
                            <div class="modal-content">
                                <div class="modal-body">
                                    <div className='row'>
                                        <div className='col'>
                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold", paddingLeft: "10px" }}><img src={addRole} width="25px" />Update Permissions</p>
                                            <hr style={{ width: "50px", marginTop: "-10px" }} />
                                            <div className='row'>
                                                <div className='col'>
                                                    <p>{this.state.clientName}</p>
                                                </div>
                                            </div>
                                            <div className='row mb-2' style={{ marginTop: "-10px" }}>
                                                <div className='col' style={{ color: "rgba(5,54,82,1)" }}>
                                                    <p style={{ fontWeight: "500" }}>Client Name</p>
                                                    {/* <input type="text" class="form-control" placeholder="Client Name" value={this.state.clientName}
                                                        style={{ height: "38px", color: "rgb(5, 54, 82)", marginTop: "-10px", textTransform: "uppercase" }} readOnly /> */}
                                                    <select className='form-select' onChange={this.clientNameFinal} style={{ marginTop: "-15px" }}>
                                                        {!this.state.allClientsList2 && (
                                                            <option defaultValue="" style={{ textAlign: "center" }}>
                                                                --Select--
                                                            </option>
                                                        )}
                                                        {
                                                            this.state.allClientsList2.map((clients, index) => (
                                                                <option key={index} value={clients.clientid}>{clients.clientname}</option>
                                                            ))
                                                        }
                                                    </select>

                                                </div>
                                            </div>
                                            <div className='row'>
                                                <div className='col' style={{ color: "rgba(5,54,82,1)" }}>
                                                    <p style={{ fontWeight: "500" }}>Permissions</p>
                                                    <div className='row scrollbar' style={{ marginTop: "-21px", height: "300px" }}>

                                                        {this.state.getAllPermissions.map((permissions, index) => {
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
                                        <div className='col' style={{ textAlign: "end" }}>
                                            <button type="button" class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.updateClientPermission}>Submit</button>&nbsp;
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
export default withTranslation()(ManageClients)