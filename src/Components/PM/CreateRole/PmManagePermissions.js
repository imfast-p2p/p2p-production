import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { BASEURL } from '../../assets/baseURL';
import AdminSidebar from '../../Admin/AdminSidebar';
import $, { event } from 'jquery';
import { withTranslation } from 'react-i18next';
import { FaAngleLeft, FaAngleDoubleRight } from 'react-icons/fa';
import dashboardIcon from '../../assets/icon_dashboard.png';
import editRole from '../../assets/editRole.png';
import { confirmAlert } from 'react-confirm-alert';
import batch from '../../assets/batch.png';

var userGrpName;
var clientGrpName;

let selectedPermissions;
let selectedPermissions2;
class PmManagePermission extends Component {
    constructor(props) {
        super(props)
        this.state = {
            borrowerid: "",
            isMobileOrEmail: false,

            roleList: [
                {
                    "nonmodifiable": 1,
                    "roledesc": "basic borrower opn",
                    "usergroupdesc": "borrower user operations",
                    "roleid": 1,
                    "rolename": "BSC_BOR",
                    "usergroupid": 1,
                    "usergroupname": "BORROWER"
                },
                {
                    "nonmodifiable": 1,
                    "roledesc": "basic lender opn",
                    "usergroupdesc": "lender user operations",
                    "roleid": 2,
                    "rolename": "BSC_LND",
                    "usergroupid": 2,
                    "usergroupname": "LENDER"
                },
                {
                    "nonmodifiable": 1,
                    "roledesc": "basic facilitator opn",
                    "usergroupdesc": "facilitator operations",
                    "roleid": 3,
                    "rolename": "BSC_FAC",
                    "usergroupid": 3,
                    "usergroupname": "FACILITATOR"
                },
                {
                    "nonmodifiable": 1,
                    "roledesc": "basic evaluator opn",
                    "usergroupdesc": "evaluator operations",
                    "roleid": 4,
                    "rolename": "BSC_EVL",
                    "usergroupid": 4,
                    "usergroupname": "EVALUATOR"
                },
                {
                    "nonmodifiable": 1,
                    "roledesc": "Update Product Info",
                    "usergroupdesc": "System user operations",
                    "roleid": 5,
                    "rolename": "UPDATE_PROD_INFO",
                    "usergroupid": 5,
                    "usergroupname": "System User"
                },
                {
                    "nonmodifiable": 1,
                    "roledesc": "Approve Product Info",
                    "usergroupdesc": "System user operations",
                    "roleid": 6,
                    "rolename": "APPROVE_PROD_INFO",
                    "usergroupid": 5,
                    "usergroupname": "System User"
                },
                {
                    "nonmodifiable": 1,
                    "roledesc": "Read Product Info",
                    "usergroupdesc": "System user operations",
                    "roleid": 7,
                    "rolename": "READ_PRODUCT_INFO",
                    "usergroupid": 5,
                    "usergroupname": "System User"
                },
                {
                    "nonmodifiable": 1,
                    "roledesc": "verified borrower opn",
                    "usergroupdesc": "borrower user operations",
                    "roleid": 8,
                    "rolename": "VRFD_BOR",
                    "usergroupid": 1,
                    "usergroupname": "BORROWER"
                },
                {
                    "nonmodifiable": 1,
                    "roledesc": "verified facilitator opn",
                    "usergroupdesc": "facilitator operations",
                    "roleid": 9,
                    "rolename": "VRFD_FAC",
                    "usergroupid": 3,
                    "usergroupname": "FACILITATOR"
                },
                {
                    "nonmodifiable": 1,
                    "roledesc": "read role info",
                    "usergroupdesc": "System user operations",
                    "roleid": 22,
                    "rolename": "READ_ROLE_INFO",
                    "usergroupid": 5,
                    "usergroupname": "System User"
                }
            ],
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

            selectedPermissions: [],
            selectedPermissions2: [],
        }
    }
    componentDidMount() {
        $('#right').prop('disabled', true);
        $('#left').prop('disabled', true);

        this.getAllclients();
        this.getAllPermissions()
        this.getAssociatedPermissions()
    }
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
        this.setState({
            allClientsList: [
                {
                    "clientdesc": "borrower user operations",
                    "clientid": "1",
                    "clientname": "BORROWER",
                    "utype": 3,
                    "status": "1"
                },
                {
                    "clientdesc": "lender user operations",
                    "clientid": "2",
                    "clientname": "LENDER",
                    "utype": 2,
                    "status": "1"
                },
                {
                    "clientdesc": "facilitator operations",
                    "clientid": "3",
                    "clientname": "FACILITATOR",
                    "utype": 4,
                    "status": "1"
                },
                {
                    "clientdesc": "evaluator operations",
                    "clientid": "4",
                    "clientname": "EVALUATOR",
                    "utype": 5,
                    "status": "1"
                },
                {
                    "clientdesc": "admin client operations",
                    "clientid": "6",
                    "clientname": "admin-cli",
                    "utype": 0,
                    "status": "1"
                },
                {
                    "clientdesc": "login client operations",
                    "clientid": "7",
                    "clientname": "login-cli",
                    "utype": 0,
                    "status": "1"
                },
                {
                    "clientdesc": "Test",
                    "clientid": "14",
                    "clientname": "test",
                    "utype": 1,
                    "status": "1"
                },
                {
                    "clientdesc": "System user operations",
                    "clientid": "5",
                    "clientname": "System User",
                    "utype": 1,
                    "status": "1"
                },
                {
                    "clientdesc": "System user ",
                    "clientid": "15",
                    "clientname": "Client_System_User",
                    "utype": 1,
                    "status": "1"
                }
            ]
        });
        this.state.allClientsList
            .filter((event) => event.clientname === userGrpName)
            .map((Client, index) => {
                this.setState({
                    clients: Client.clientid,
                    clientGrpName: Client.clientname
                });
            });
        console.log(this.state.clientGrpName)
    }
    getAllPermissions = (e) => {
        this.setState({
            permissionList: [
                {
                    "permissionid": "1",
                    "permissionname": "BORR_RAISE_LOAN_REQ",
                    "permissiondesc": "to raise loan request",
                    "status": "1"
                },
                {
                    "permissionid": "2",
                    "permissionname": "LOAN_REQ_STATUS",
                    "permissiondesc": "to get loan request status",
                    "status": "1"
                },
                {
                    "permissionid": "3",
                    "permissionname": "ACCEPT_LOAN_OFFER",
                    "permissiondesc": "to accept loan offer",
                    "status": "1"
                },
                {
                    "permissionid": "4",
                    "permissionname": "TRIGGER_LOAN_ACCEPT_REQ",
                    "permissiondesc": "to trigger loan accept request",
                    "status": "1"
                },
                {
                    "permissionid": "5",
                    "permissionname": "VERIFY_LOAN_ACCEPT_REQ",
                    "permissiondesc": "to verify loan accept request",
                    "status": "1"
                },
                {
                    "permissionid": "6",
                    "permissionname": "WITHDRAW_LOAN_REQ",
                    "permissiondesc": "to withdraw loan request",
                    "status": "1"
                },
                {
                    "permissionid": "7",
                    "permissionname": "REQ_LOAN_PROCESSING",
                    "permissiondesc": "request loan processing",
                    "status": "1"
                },
                {
                    "permissionid": "11",
                    "permissionname": "UPLOAD_LOAN_COLLATERAL_DOC",
                    "permissiondesc": "to upload loan collateral doc",
                    "status": "1"
                },
                {
                    "permissionid": "12",
                    "permissionname": "DEL_COLLATERAL_DOC",
                    "permissiondesc": "to delete collateral doc",
                    "status": "1"
                },
                {
                    "permissionid": "13",
                    "permissionname": "SET_REF_DETAILS",
                    "permissiondesc": "to set reference details",
                    "status": "1"
                },
                {
                    "permissionid": "19",
                    "permissionname": "GET_FAC_EVL_LIST",
                    "permissiondesc": "to get fac and eval list",
                    "status": "1"
                },
                {
                    "permissionid": "25",
                    "permissionname": "GET_LOAN_OFFERS",
                    "permissiondesc": "to get loan offers",
                    "status": "1"
                }
            ]
        })
    }
    getAssociatedPermissions = () => {
        this.setState({
            associatePermissionList: [
                {
                    "permissionid": "139",
                    "permissionname": "SET_ACCOUNT_DETAILS",
                    "permissiondesc": "set account details",
                    "status": "1"
                },
                {
                    "permissionid": "138",
                    "permissionname": "SET_PERSNL_DETAILS",
                    "permissiondesc": "set personal details",
                    "status": "1"
                },
                {
                    "permissionid": "5",
                    "permissionname": "VERIFY_LOAN_ACCEPT_REQ",
                    "permissiondesc": "to verify loan accept request",
                    "status": "1"
                },
                {
                    "permissionid": "142",
                    "permissionname": "UPLOAD_PHOTO",
                    "permissiondesc": "upload photo",
                    "status": "1"
                },
                {
                    "permissionid": "267",
                    "permissionname": "GET_TALUK_LIST",
                    "permissiondesc": "get taluk list",
                    "status": "1"
                },
                {
                    "permissionid": "250",
                    "permissionname": "GET_LOAN_ELIGIBILITY",
                    "permissiondesc": "to get loan eligibility",
                    "status": "1"
                }
            ]
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

    }

    handleCheckboxChange = (event, index, permissionId) => {
        const checked = event.target.checked;
        console.log(checked);

        this.setState(prevState => {
            selectedPermissions = [...prevState.selectedPermissions];
            if (checked) {
                // If checked, add the permissionId to the array
                selectedPermissions.push(permissionId);
            } else {
                // If unchecked, remove the permissionId from the array
                selectedPermissions = selectedPermissions.filter(id => id !== permissionId);
            }
            console.log(selectedPermissions)
            return { selectedPermissions };
        });
        console.log(selectedPermissions)
    };

    handleCheckboxChange2 = (event, index, permissionId) => {
        const checked = event.target.checked;
        console.log(checked);

        this.setState(prevState => {
            selectedPermissions2 = [...prevState.selectedPermissions2];
            if (checked) {
                // If checked, add the permissionId to the array
                selectedPermissions2.push(permissionId);
            } else {
                // If unchecked, remove the permissionId from the array
                selectedPermissions2 = selectedPermissions2.filter(id => id !== permissionId);
            }
            console.log(selectedPermissions2)
            return { selectedPermissions2 };
        });
        console.log(selectedPermissions2)
    };
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
                                <Link to="/landing">Home</Link> / Manage Permissions</p>
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
                                                    <select className='form-select' style={{ marginTop: "-15px" }}>
                                                        <option defaultValue>Select</option>

                                                    </select>
                                                </div>
                                                <div className='mb-2'>
                                                    <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold", fontSize: "15px" }}>Select Client</p>
                                                    <select className='form-select' style={{ marginTop: "-15px" }}>

                                                    </select>
                                                </div>
                                            </span>
                                            <hr style={{ backgroundColor: "rgba(5,54,82,1)" }} />
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col' style={{ textAlign: "end" }}>
                                            <button type="button" class="btn text-white btn-sm" data-dismiss="modal"
                                                style={{ backgroundColor: "rgb(136, 189, 72)" }} >Submit</button>
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
                            {/* <div className='row'>
                                <div className='col-5'>
                                    <p className="font-weight-bold" style={{ marginBottom: "1px", fontFamily: "Poppins,sans-serif", color: "#222c70" }}>Name</p>
                                    <p style={{ fontFamily: "Poppins,sans-serif", color: "#222c70" }}></p>
                                </div>
                                <div className='col' style={{ textAlign: "end" }}>
                                    <button className='btn btn-sm text-white' style={{ backgroundColor: "rgb(0, 121, 191)" }} >Select Role <FaAngleDoubleRight /></button>
                                </div>
                            </div>
                            <hr style={hrStyle} /> */}
                            <div className='row' style={{ paddingLeft: "3px" }}>
                                <div className='col-5' id='headingRef'>
                                    <div className="two__image" style={{ paddingLeft: "10px" }}>
                                        <p className="text-white" style={{ paddingBottom: "6px", fontWeight: "600" }}>System User Role Assignment</p>
                                    </div>
                                </div>
                            </div>

                            <div className='form-row'>
                                <div className='col-6'>
                                    <p style={{ fontWeight: "500", fontFamily: "Poppins,sans-serif", color: "#222c70" }}>Available Permissions</p>

                                    <div scroll={true} className="scrollbar" style={{ height: "100px", marginTop: "-15px" }}>
                                        {
                                            this.state.permissionList.map((role, index) => (
                                                <div class="form-check" style={{
                                                    backgroundColor: this.state.selectedPermissions.includes(role.permissionid)
                                                        ? 'rgb(0, 121, 191)'
                                                        : 'white',
                                                }}>
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        id={`flexCheckDefault_${index}`}
                                                        value={role.permissionid}
                                                        style={{ display: "none" }}
                                                        checked={this.state.selectedPermissions.includes(role.permissionid)}
                                                        onChange={(e) => { this.handleCheckboxChange(e, index, role.permissionid) }}
                                                    />
                                                    <label class="form-check-label" htmlFor={`flexCheckDefault_${index}`} style={{
                                                        fontFamily: "Poppins,sans-serif",
                                                        fontSize: "15px", fontWeight: "400",
                                                        color: this.state.selectedPermissions.includes(role.permissionid)
                                                            ? 'white'
                                                            : '',
                                                    }} >
                                                        {role.permissionname}
                                                    </label>
                                                </div>
                                            ))
                                        }
                                    </div>
                                    <button className='btn btn-sm text-dark' id="right" value=">" style={{ backgroundColor: "rgb(235, 236, 237)", fontWeight: "500" }} onClick={this.assignPermissionsToUser}>{t('Add Selected >>')}</button>
                                </div>
                                <div className='col-6'>
                                    <p style={{ fontWeight: "500", fontFamily: "Poppins,sans-serif", color: "#222c70" }}>Current Permissions</p>

                                    <div scroll={true} className="scrollbar" style={{ height: "100px", marginTop: "-15px" }}>

                                        {
                                            this.state.associatePermissionList.map((role, index) => (
                                                <div class="form-check" style={{
                                                    backgroundColor: this.state.selectedPermissions2.includes(role.permissionid)
                                                        ? 'rgb(0, 121, 191)'
                                                        : 'white',
                                                }}>
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        id={`flexCheckDefault_${index}`}
                                                        value={role.permissionid}
                                                        style={{ display: "none" }}
                                                        checked={this.state.selectedPermissions2.includes(role.permissionid)}
                                                        onChange={(e) => { this.handleCheckboxChange2(e, index, role.permissionid) }}
                                                    />
                                                    <label class="form-check-label" htmlFor={`flexCheckDefault_${index}`} style={{
                                                        fontFamily: "Poppins,sans-serif",
                                                        fontSize: "15px", fontWeight: "400",
                                                        color: this.state.selectedPermissions2.includes(role.permissionid)
                                                            ? 'white'
                                                            : '',
                                                    }} >
                                                        {role.permissionname}
                                                    </label>
                                                </div>
                                            ))
                                        }
                                    </div>
                                    <button className='btn btn-sm text-dark' id="left" value="<<" style={{ backgroundColor: "rgb(235, 236, 237)", fontWeight: "500" }} onClick={this.unAssignPermissionsUser}>{t('<< Remove Selected')}</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        )
    }
}

export default withTranslation()(PmManagePermission)