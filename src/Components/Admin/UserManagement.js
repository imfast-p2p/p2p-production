import React, { Component } from "react";
import { BASEURL } from "../assets/baseURL";
import AdminSidebar from "./AdminSidebar";
import $ from "jquery";
import { Link } from "react-router-dom";
import { withTranslation } from "react-i18next";
import pic3 from '../assets/AdminImg/picture.png';
import sysUser from '../assets/All.png';
import us from '../assets/AdminImg/pro.png';
import a1 from '../assets/AdminImg/approve.png'
import a2 from '../assets/AdminImg/notapprove.png';
import a3 from '../assets/AdminImg/reject.png';
import a4 from '../assets/AdminImg/delete.png';
import batch from '../assets/batch.png';
import openIt from '../assets/AdminImg/openit.png';
import editRole from '../assets/editRole.png';
import dashboardIcon from '../assets/icon_dashboard.png';
import {
    FaAngleLeft, FaEye, FaTimesCircle, FaUserTimes, FaEdit, FaFileInvoice,
    FaFileSignature,
    FaListUl
} from 'react-icons/fa';
import ReactPaginate from 'react-paginate';
import '../Borrower/Pagination.css'
import { confirmAlert } from 'react-confirm-alert';

var input, filter, ul, li, a, i, txtValue, show;
export class UserManagement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userList: [],
            facList: [],
            evalList: [],

            userid: "",
            username: "",
            city: "",
            district: "",
            pincode: "",
            registredon: "",
            usertype: "",

            offset1: 0,
            orgtableData1: [],
            perPage1: 5,
            currentPage1: 0,
            pageCount1: "",

            offset2: 0,
            orgtableData2: [],
            perPage2: 5,
            currentPage2: 0,
            pageCount2: "",

            offset3: 0,
            orgtableData3: [],
            perPage3: 5,
            currentPage3: 0,
            pageCount3: "",

            offset4: 0,
            orgtableData4: [],
            perPage4: 5,
            currentPage4: 0,
            pageCount4: "",

            roleList: [],
            rolename: "BASIC ADMIN",
            roledesc: "Adminstrator role",
            permissions: [],
            clients: [],
            roleid: "2",
            roleInfo: "",
            showResults: [],

            permissionList: [],
            allClientsList: [],

            utype: "",
            reason: "",
            status: "",
            mobile: "",

            pmSystemUserFlag: false,
            pmAddress: "",
            pmName: "",
            pmMobilno: "",
            pmEmail: "",
            pmGender: "",
            pmDOB: "",
            pmId: "",
            pmstate: "",
            pmdistrict: "",
            pmcity: "",

            empStatus: "",
            pmType: "",
            pmStatus: "",

            makerPermissions: [],
            readPermissions: [],

            officeLevel: '',
            staffHierarchy: '',
            officename: '',
            staffname: '',
        };
        this.allUsers = this.allUsers.bind(this);
        this.getFacilitators = this.getFacilitators.bind(this);
        this.getEvaluators = this.getEvaluators.bind(this);
    }
    componentDidMount() {
        this.allUsers();
        // this.getFacilitators();
        // this.getEvaluators();
        if (sessionStorage.getItem('sAdmin') === "1" && sessionStorage.getItem('pmDefault') === "1") {
            //Super Admin
            this.setState({ pmType: "superAdmin" })
        } else if (sessionStorage.getItem('pmDefault') === "0") {
            this.setState({ pmType: "pmAdmin" })
        } else {
            this.setState({ pmType: "0" })
        }

        var storedArrayStringJSON = sessionStorage.getItem("rolePermData")
        var storedArray = JSON.parse(storedArrayStringJSON);
        console.log(storedArray);
        if (storedArray) {
            storedArray.forEach(element => {
                if (element.rolename === "USR_ROLE_MGMT_MAKER") {
                    console.log(element.permissions);
                    this.setState({ makerPermissions: element.permissions })
                }
                if (element.rolename === "VRFD_SYS_USR") {
                    console.log(element.permissions);
                    this.setState({ readPermissions: element.permissions })
                    //USR_GET_ALL_ROLES
                }
            });
        }
    }
    handlePageClick1 = (event) => {
        const selectedPage = event.selected;
        const offset = selectedPage * this.state.perPage1;
        this.setState({
            currentPage1: selectedPage,
            offset1: offset
        }, () => {
            this.loadMoreData1();
        })
    }
    loadMoreData1 = () => {
        const data = this.state.orgtableData1;
        const slice = data.slice(this.state.offset1, this.state.offset1 + this.state.perPage1)
        this.setState({
            pageCount1: Math.ceil(data.length / this.state.perPage1),
            facList: slice
        })
    }
    handlePageClick2 = (event) => {
        const selectedPage = event.selected;
        const offset = selectedPage * this.state.perPage2;
        this.setState({
            currentPage2: selectedPage,
            offset2: offset
        }, () => {
            this.loadMoreData2();
        })
    }
    loadMoreData2 = () => {
        const data = this.state.orgtableData2;
        const slice = data.slice(this.state.offset2, this.state.offset2 + this.state.perPage2)
        this.setState({
            pageCount2: Math.ceil(data.length / this.state.perPage2),
            evalList: slice
        })
    }
    handlePageClick3 = (event) => {
        const selectedPage = event.selected;
        const offset = selectedPage * this.state.perPage3;
        this.setState({
            currentPage3: selectedPage,
            offset3: offset
        }, () => {
            this.loadMoreData3();
        })
    }
    loadMoreData3 = () => {
        const data = this.state.orgtableData3;
        const slice = data.slice(this.state.offset3, this.state.offset3 + this.state.perPage3)
        this.setState({
            pageCount3: Math.ceil(data.length / this.state.perPage3),
            userList: slice
        })
        console.log("executed" + this.state.userList)
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
                if (resdata.code === "Success" || "SUCCESS" || "success") {
                    console.log(resdata);
                    var list = resdata.msgdata;
                    list.sort((a, b) => {
                        return new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
                    })
                    console.log(list);
                    this.setState({ userList: list });

                    var data = resdata.msgdata
                    console.log(data)
                    var slice = data.slice(this.state.offset3, this.state.offset3 + this.state.perPage3)
                    console.log(slice)

                    this.setState({
                        pageCount3: Math.ceil(data.length / this.state.perPage3),
                        orgtableData3: data,
                        userList: slice
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
            })
    }
    getFacilitators() {
        fetch(BASEURL + "/usrmgmt/getfacevallist?utype=4", {
            method: "get",
            headers: {
                Authorization: "Bearer " + sessionStorage.getItem("token"),
            },
        })
            .then((response) => {
                console.log("Response:", response);
                console.log(response)
                return response.json();
            })
            .then((resdata) => {
                console.log(resdata);
                if (resdata.status === "Success") {
                    this.setState({ facList: resdata.msgdata });

                    var data = resdata.msgdata
                    console.log(data)
                    var slice = data.slice(this.state.offset1, this.state.offset1 + this.state.perPage1)
                    console.log(slice)

                    this.setState({
                        pageCount1: Math.ceil(data.length / this.state.perPage1),
                        orgtableData1: data,
                        facList: slice
                    })
                } else {
                    alert("Issue: " + resdata.message);
                }
            })
            .catch(err => {
                console.log(err.message)
            })
    }
    getEvaluators() {
        fetch(BASEURL + "/usrmgmt/getfacevallist?utype=5", {
            method: "get",
            headers: {
                Authorization: "Bearer " + sessionStorage.getItem("token"),
            },
        })
            .then((response) => {
                console.log("Response:", response);
                return response.json();
            })
            .then((resdata) => {
                console.log(resdata);
                if (resdata.status === "Success") {
                    this.setState({ evalList: resdata.msgdata });

                    var data = resdata.msgdata
                    console.log(data)
                    var slice = data.slice(this.state.offset2, this.state.offset2 + this.state.perPage2)
                    console.log(slice)

                    this.setState({
                        pageCount2: Math.ceil(data.length / this.state.perPage2),
                        orgtableData2: data,
                        evalList: slice
                    })
                } else {
                    alert("Issue: " + resdata.message);
                }
            })
            .catch(err => {
                console.log(err.message)
            })
    }
    userDetails = (userid, username, city, district, pincode, usertype, status, mobileno) => {
        console.log(userid,
            username,
            city,
            district,
            pincode,
            usertype,
            status,
            mobileno);
        this.setState({
            userid: userid,
            username: username,
            city: city,
            district: district,
            pincode: pincode,
            usertype: usertype,
            status: status,
            mobile: mobileno
        })
        console.log(this.state.mobile)
        this.setState({ pmSystemUserFlag: false })
        $('#facEvlModal').click();
    }
    // Block, unblock & delete User
    utype = (event) => {
        this.setState({ utype: event.target.value });
    }
    reason = (event) => {
        this.setState({ reason: event.target.value });
    }
    blockUser = () => {
        fetch(BASEURL + "/usrmgmt/blockuser", {
            method: "post",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: "Bearer " + sessionStorage.getItem("token"),
            },
            body: JSON.stringify({
                utype: this.state.usertype,
                userid: this.state.userid,
                reason: this.state.reason,
            }),
        })
            .then((response) => {
                console.log("Response:", response);
                return response.json();
            })
            .then((resdata) => {
                console.log(resdata);
                if (resdata.status === "Success") {
                    $("#exampleModal").modal('hide');
                    $("#exampleModal12").modal('hide');

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
                    alert(resdata.message);
                }
            });
    }
    unblockUser = () => {
        // const popup = window.confirm(
        //     "Are you sure you want to unblock this user ?"
        // );
        // if (popup == true) {
        fetch(BASEURL + "/usrmgmt/unblockuser", {
            method: "post",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: "Bearer " + sessionStorage.getItem("token"),
            },
            body: JSON.stringify({
                userid: this.state.userid,
                utype: this.state.usertype,
                reason: this.state.reason,
            }),
        })
            .then((response) => {
                console.log("Response:", response);
                return response.json();
            })
            .then((resdata) => {
                console.log(resdata);
                if (resdata.status === "Success") {
                    $("#exampleModal").modal('hide');
                    $("#exampleModal12").modal('hide');

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
                    alert("Issue: " + resdata.message);
                    window.location.reload();
                }
            });
        // } else {
        //     return false;
        // }
    }
    deleteUser = () => {
        const popup = window.confirm("Are you sure you want to delete this user ?");
        if (popup == true) {
            fetch(BASEURL + "/usrmgmt/deleteuser", {
                method: "post",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + sessionStorage.getItem("token"),
                },
                body: JSON.stringify({
                    userid: this.state.userid,
                    utype: this.state.usertype,
                    reason: this.state.reason,
                }),
            })
                .then((response) => {
                    console.log("Response:", response);
                    return response.json();
                })
                .then((resdata) => {
                    console.log(resdata);
                    if (resdata.status === "Success") {
                        $("#exampleModal").modal('hide');
                        confirmAlert({
                            message: resdata.message,
                            buttons: [
                                {
                                    label: "OK",
                                    onClick: () => {
                                        window.location.reload()
                                    },
                                },
                            ],
                        });
                    } else {
                        alert(resdata.message);
                    }
                });
        } else {
            return false;
        }
    }
    sysUserDetails = (userId, firstName, lastName, empEmail, mobileNumber, dob) => {
        console.log(userId);
        console.log(firstName);
        console.log(lastName);

        sessionStorage.setItem("SysID", userId);
        sessionStorage.setItem("fName", firstName);
        sessionStorage.setItem("lName", lastName);
        sessionStorage.setItem("empEmailID", empEmail);
        sessionStorage.setItem("mobileno", mobileNumber);
        sessionStorage.setItem("dob", dob)
        sessionStorage.setItem('pmSysBorID', mobileNumber)

        window.location = "/assignRole";
    }
    createUser = () => {
        window.location = "/createUser"
    }
    // Role Related
    handlePageClick4 = (event) => {
        const selectedPage = event.selected;
        const offset = selectedPage * this.state.perPage4;
        this.setState({
            currentPage4: selectedPage,
            offset4: offset
        }, () => {
            this.loadMoreData4();
        })
    }
    loadMoreData4 = () => {
        const data = this.state.orgtableData4;
        const slice = data.slice(this.state.offset4, this.state.offset4 + this.state.perPage4)
        this.setState({
            pageCount4: Math.ceil(data.length / this.state.perPage4),
            roleList: slice
        })
    }
    myFunction = (e) => {
        e.preventDefault()
        input = document.getElementById("myInput");
        filter = e.target.value.toUpperCase();
        ul = document.getElementById("myUL");
        li = ul.getElementsByTagName("div");
        show = document.getElementsByClassName("showUI")
        console.log(show)
        for (i = 0; i < li.length; i++) {
            a = li[i].getElementsByTagName("p")[0];
            if (a) {
                txtValue = a.textContent || a.innerText;
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    li[i].style.display = "";
                } else {
                    li[i].style.display = "none";
                }
            }

        }
    }
    allRoles = () => {
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
                    this.setState({ roleList: resdata.msgdata })

                    var data = resdata.msgdata
                    console.log(data)
                    var slice = data.slice(this.state.offset4, this.state.offset4 + this.state.perPage4)
                    console.log(slice)

                    this.setState({
                        pageCount4: Math.ceil(data.length / this.state.perPage4),
                        orgtableData4: data,
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
    viewMoreDetails = (user,
    ) => {
        this.setState({
            userid: user.userId,
            pmAddress: user.residenceAddress,
            pmName: user.firstName,
            pmMobilno: user.mobileNumber,
            pmEmail: user.empEmail,
            pmGender: user.gender,
            pmDOB: user.dob,
            pmStatus: user.empStatusId,
            pmId: user.id,
            pmstate: user.state,
            pmdistrict: user.district,
            pmcity: user.city
        })
        console.log(user.id)
        $('#facEvlModal').click();
        this.setState({ pmSystemUserFlag: true })

        fetch(BASEURL + '/usrmgmt/getdetailsofsystemuser?systemuserid=' + user.userId, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            }
        })
            .then((Response) => {
                return Response.json();
            })
            .then((resdata) => {
                if (resdata.status == 'Success' || 'SUCCESS' || 'success') {
                    console.log(resdata.msgdata);
                    //call office hier with office level
                    console.log(resdata.msgdata.officeLevel)
                    if (resdata.msgdata.officeLevel) {
                        this.setState({ officeLevel: resdata.msgdata.officeLevel })
                        this.getOffHier("1", this.state.officeLevel)
                    }
                    // call office hier with staff level
                    console.log(resdata.msgdata.staffHierarchy)
                    if (resdata.msgdata.staffHierarchy) {
                        this.setState({ staffHierarchy: resdata.msgdata.staffHierarchy })
                        this.getOffHier("2", this.state.staffHierarchy)
                    }
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
    getOffHier = (type, level) => {
        fetch(BASEURL + '/usrmgmt/getofficehierarchy?type=' + type + '&level=' + level, {
            method: 'GET',
            headers: {
                'Authorization': "Bearer " + sessionStorage.getItem('token'),
                'Content-Type': 'application/json'
            },
        })
            .then((response) => {
                return response.json();
            })
            .then((resdata) => {
                if (resdata.status === 'Success') {
                    console.log(resdata.msgdata);
                    var officeType = resdata.msgdata;
                    officeType.forEach(element => {
                        if (element.officetype) {
                            console.log("officetype", element.officetype);
                            this.setState({
                                officename: element.officetype
                            })
                        }
                        if (element.stafftype) {
                            console.log("stafftype", element.stafftype);
                            this.setState({
                                staffname: element.stafftype
                            })
                        }
                    });
                } else {
                    alert("Issue: " + resdata.message);
                }
            })
            .catch((error) => {
                console.log(error);
                alert("Error: " + error.message);
            });
    }
    deleteSysUser = () => {
        $("#exampleModal12").modal('hide');
        confirmAlert({
            message: "Are you sure you want to delete ?",
            buttons: [
                {
                    label: "Okay",
                    onClick: () => {
                        this.finalDelete()
                    }
                },
                {
                    label: "Cancel",
                    onClick: () => {

                    }
                }
            ],
            closeOnClickOutside: false,
        });
    }
    finalDelete = (user) => {
        let userID = "systemuserid=" + this.state.userid;
        let reason = "&reason=" + this.state.reason;
        let url = BASEURL + '/usrmgmt/deletesystemuser?';
        let params = (this.state.userid ? userID : "") + (this.state.reason ? reason : "")

        fetch(url + params, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
        }).then(response => {
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata)
                if (resdata.status == 'Success' || 'SUCCESS' || 'success') {
                    console.log(resdata);
                    confirmAlert({
                        message: resdata.message,
                        buttons: [
                            {
                                label: "OK",
                                onClick: () => {
                                    window.location.reload()
                                },
                            },
                        ],
                    });
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
    editSysUserProfile = (user,
        userId,
        firstName,
        gender,
        empEmail,
        mobileNumber,
        dob,
        residenceAddress) => {
        var userDataString = JSON.stringify(user);
        sessionStorage.setItem("editSysDetails", userDataString);
        window.location = "/updateSysProfile";
    }
    blockUnblockSU = (user) => {
        var strNum = user.userTypeCvId
        var result = strNum.toString();

        this.setState({
            userid: user.userId,
            usertype: result,
            status: user.empStatusId
        })
        console.log(this.state.usertype, user.userTypeCvId, user.empStatusId)

        console.log(user.userId,
            user.usertype)
        $("#suBlockModal").click();
    }
    EmpStatusClick = (event) => {
        this.setState({ empStatus: event.target.value }, () => {
            console.log(this.state.empStatus)
        })
    }
    updateSysStatus = () => {
        console.log(this.state.empStatus)
        fetch(BASEURL + '/usrmgmt/updatesystemuserstatus?empStatus=' + this.state.empStatus + "&systemuserid=" + this.state.userid, {
            method: "post",
            headers: {
                'Accept': "application/json",
                'Content-Type': "application/json",
                'Authorization': "Bearer " + sessionStorage.getItem("token"),
            }
        })
            .then((Response) => {
                return Response.json();
            })
            .then((resdata) => {
                if (resdata.status == 'Success' || 'SUCCESS' || 'success') {
                    console.log(resdata);
                    confirmAlert({
                        message: resdata.message,
                        buttons: [
                            {
                                label: "OK",
                                onClick: () => {
                                    this.allUsers()
                                },
                            },
                        ],
                        closeOnClickOutside: false,
                    });
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

    handleChange() {
        $(".text").toggle();
        $("#Pinfo").toggle();
    }

    render() {
        const { t } = this.props;
        const myStyle = {
            color: "white",
            textAlign: "center",
            textDecoration: "none",
            display: "inline-block",
            margin: "4px 2px",
            cursor: "pointer",
            fontSize: "12px",
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
        const { pmType, makerPermissions, readPermissions } = this.state;
        console.log(this.state.roleList, this.state.pmSystemUserFlag, this.state.pmStatus, this.state.userList)
        return (
            <div className="container-dashboard d-flex flex-row" id="wrapper" style={{ backgroundColor: "#F4F7FC" }}>
                <AdminSidebar />

                <div className="pl-3 pr-3 main-content "
                    id="page-content-wrapper">
                    <div className="container-fluid row pt-2">
                        <div className="col-1" id='facnavRes1'>
                            <button style={{ marginLeft: "25px" }} onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className='col-4' id='facnavRes2' style={{ marginLeft: "20px", marginTop: "5px" }}>
                            <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                <Link to="/landing">Home</Link> /
                                {pmType === "pmAdmin" ?
                                    "User Management" : "User Management"}
                            </p>
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

                    <div className='container-fluid row' style={{ paddingLeft: "86px", marginTop: "-20px" }}>
                        <div className='card' style={{ cursor: "default", overflow: "visible" }}>
                            <div className='row pt-2 pl-2 pr-2'>
                                <div className='col'>
                                    <ul role="tablist" className="nav nav-pills nav-fill mb-3" >
                                        <li className="nav-item" onClick={this.allUsers}><a data-toggle="pill" id="myNavLink" href="#system-users" className="nav-link active"
                                            style={{ textAlign: "center", paddingTop: "10px", paddingBottom: "10px", fontWeight: "bold" }} ><img src={sysUser} style={{ width: "20px" }} /> &nbsp; {t('System User')} </a> </li>
                                        <li className="nav-item" onClick={this.getFacilitators}><a data-toggle="pill" id="myNavLink" href="#facilitators" className="nav-link"
                                            style={{ textAlign: "center", paddingTop: "10px", paddingBottom: "10px", fontWeight: "bold" }}><FaFileInvoice style={{ width: "30px" }} /> &nbsp;{t('Facilitator')} </a> </li>
                                        {pmType === "0" ?
                                            <li className="nav-item" onClick={this.getEvaluators}><a data-toggle="pill" id="myNavLink" href="#evaluators" className="nav-link"
                                                style={{ textAlign: "center", paddingTop: "10px", paddingBottom: "10px", fontWeight: "bold" }}><FaFileSignature style={{ width: "30px" }} /> &nbsp;{t('Evaluator')} </a> </li>
                                            : ""
                                        }
                                        {pmType === "0" ?
                                            <li className="nav-item" onClick={this.allRoles}><a data-toggle="pill" id="myNavLink" href="#allRoles" className="nav-link"
                                                style={{ textAlign: "center", paddingTop: "10px", paddingBottom: "10px", fontWeight: "bold" }}><FaListUl style={{ width: "30px" }} /> &nbsp;{t('View All Roles')} </a> </li>
                                            : ""
                                        }
                                    </ul>
                                </div>
                            </div>
                            <div className="tab-content h-100">
                                <div id="system-users" className=" tab-pane fade show active" style={{ marginBottom: "20px" }}>
                                    <div className="row">
                                        <div className="col-4"></div>
                                        <div className="col-4 ">
                                            {this.state.userList == "" ?
                                                <div className="row mt-2" style={{ marginLeft: "6px" }}>
                                                    <div className="col" style={{ textAlign: "center", color: "#222C70", fontSize: "14px", fontWeight: "500" }}>
                                                        <p>No Data Available !</p>
                                                        <p>Click On "Create User" to add User in the System</p>
                                                    </div>
                                                </div> : null
                                            }
                                        </div>
                                        <div className="col-4 pr-4" style={{ textAlign: "end" }}>
                                            {/* <button
                                                    type="button"
                                                    className="btn btn-sm text-white"
                                                    onClick={this.createUser}
                                                    style={{
                                                        backgroundColor: "#0079bf",
                                                        paddingLeft: "10px", paddingRight: "10px"
                                                    }}
                                                >
                                                    &nbsp;<img src={us} style={{ width: "20px" }} />&nbsp;
                                                    {t("CreateUser")}
                                                </button> */}
                                        </div>
                                    </div>
                                    <div className="row" style={{ display: "" }}>
                                        <span>
                                            <div className="row pl-4 align-items-center mt-3 sysUsers">
                                                <div className="col-3">
                                                    <p style={{ fontWeight: "500", color: "rgb(5, 54, 82)" }}>
                                                        {t("User Name")}
                                                    </p>
                                                </div>
                                                <div className="col-2">
                                                    <p style={{ fontWeight: "500", color: "rgb(5, 54, 82)", width: "max-content" }}>
                                                        {t("Mobile Number")}
                                                    </p>
                                                </div>
                                                <div className="col-3">
                                                    <p style={{ fontWeight: "500", color: "rgb(5, 54, 82)" }}>
                                                        {t("Email ID")}
                                                    </p>
                                                </div>
                                                <div className="col-2" style={{ textAlign: "end" }}>
                                                    <p style={{ fontWeight: "500", color: "rgb(5, 54, 82)", marginRight: "6px" }}>
                                                        {t("Status")}
                                                    </p>
                                                </div>
                                                <div className="col-2" style={{ textAlign: "end", marginLeft: "-15px" }}>
                                                    {pmType === "SuperAdmin" ?
                                                        "" :
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm text-white"
                                                            onClick={this.createUser}
                                                            style={{
                                                                backgroundColor: "#0079bf",
                                                                paddingLeft: "10px", paddingRight: "10px"
                                                            }}
                                                        >
                                                            &nbsp;<img src={us} style={{ width: "20px" }} />&nbsp;
                                                            {t("CreateUser")}
                                                        </button>
                                                    }

                                                </div>

                                            </div>
                                            <hr style={{ width: "96%", marginLeft: "17px", marginTop: "0px", backgroundColor: "rgb(5, 54, 82)" }} />

                                            {this.state.userList && this.state.userList.length > 0 ? (
                                                this.state.userList.map((user, index) => (
                                                    <div className='col' key={index}>
                                                        <div className='card border-0' style={{ marginBottom: "-15px", color: "rgb(5, 54, 82)", overflow: "visible", transition: 'none', cursor: 'default', backgroundColor: (index % 2 == 0) ? 'rgba(255,255,255,1)' : 'rgba(242,242,242,1)' }}>
                                                            <div className="row item-list align-items-center">
                                                                <div className="col-3">
                                                                    <p className="ml-2" style={{ fontSize: "15px", fontWeight: "490", paddingTop: "12px" }}>{user.firstName}</p>
                                                                </div >
                                                                <div className="col-2">
                                                                    <p style={{ fontSize: "15px", fontWeight: "490", marginLeft: "11px", paddingTop: "12px" }}>{user.mobileNumber}</p>
                                                                </div >
                                                                <div className="col-4">
                                                                    <p style={{ fontSize: "15px", fontWeight: "490", marginLeft: "11px", paddingTop: "12px" }}>{user.empEmail}</p>
                                                                </div>
                                                                <div className="col-2">
                                                                    <p style={{ fontSize: "15px", fontWeight: "490", marginLeft: "11px", paddingTop: "12px" }}>
                                                                        {user.empStatusId === 1 && <p style={{ color: "rgb(29, 143, 63)", fontWeight: "600", marginLeft: "10px" }}><img src={a1} style={{ height: "19px" }} />&nbsp;Active</p>}
                                                                        {user.empStatusId === 2 && <p style={{ color: "rgb(199, 188, 34)", fontWeight: "600", marginLeft: "10px" }}><img src={a2} style={{ height: "19px" }} />&nbsp;InActive</p>}
                                                                        {user.empStatusId === 3 && <p style={{ color: "rgb(23, 142, 207)", fontWeight: "600", marginLeft: "10px" }}><img src={a4} style={{ height: "19px" }} />&nbsp;Deleted</p>}
                                                                        {user.empStatusId === 4 && <p style={{ color: "rgb(219, 101, 37)", fontWeight: "600" }}><FaUserTimes />&nbsp;Blocked</p>}
                                                                    </p>
                                                                </div>
                                                                <div className="col-1" style={{ textAlign: "center" }}>
                                                                    {user.empStatusId === 3 ?
                                                                        <p class="btn-group dropleft" title="Service Unavailable">
                                                                            <img src={openIt} style={{ height: "23px", marginBottom: "-10px", paddingLeft: "4px" }}
                                                                            />
                                                                        </p> :
                                                                        <p class="btn-group dropleft">
                                                                            <img src={openIt} style={{ height: "35px", marginBottom: "-10px" }}
                                                                                class="btn dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" />
                                                                            &nbsp;

                                                                            <div class="dropdown-menu" aria-labelledby="dropdownMenuButton" style={{ marginLeft: "-114px" }}>
                                                                                <a class="dropdown-item" onClick={this.editSysUserProfile.bind(this, user, user.userId, user.firstName, user.gender, user.empEmail, user.mobileNumber, user.dob, user.residenceAddress)}>Edit</a>
                                                                                <a class="dropdown-item" onClick={this.viewMoreDetails.bind(this, user, user.userId, user.firstName, user.gender, user.empEmail, user.mobileNumber, user.dob, user.residenceAddress, user.empStatusId, user.userId)}>User Detail</a>
                                                                                {user.empStatusId !== 4 &&
                                                                                    <>
                                                                                        <a class="dropdown-item" onClick={this.sysUserDetails.bind(this, user.userId, user.firstName, user.lastName, user.empEmail, user.mobileNumber, user.dob)}>
                                                                                            Role Assignment
                                                                                        </a>
                                                                                    </>
                                                                                }
                                                                                {/* {pmType === "pmAdmin" || pmType === "0" ?
                                                                                    <>
                                                                                        {readPermissions.map((permission, index) => {
                                                                                            if (permission.permissionname === "USR_GET_ALL_ROLES" && permission.status === "1") {
                                                                                                return (
                                                                                                    <a class="dropdown-item" onClick={this.sysUserDetails.bind(this, user.userId, user.firstName, user.lastName, user.empEmail, user.mobileNumber, user.dob)}>
                                                                                                        Role Assignment
                                                                                                    </a>)
                                                                                            }
                                                                                        })}
                                                                                    </>
                                                                                    : ""
                                                                                } */}
                                                                                <a class="dropdown-item" onClick={this.blockUnblockSU.bind(this, user)}>Block/ Unblock</a>
                                                                            </div>
                                                                        </p>
                                                                    }
                                                                </div>
                                                            </div >
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div>No users found</div>
                                            )}
                                        </span>
                                        <div className="row float-right">
                                            <div className='col'></div>
                                            <div className='col' style={{ marginLeft: "15px" }}>
                                                <div className='card border-0' style={{ height: "40px" }}>
                                                    <ReactPaginate
                                                        previousLabel={"<"}
                                                        nextLabel={">"}
                                                        breakLabel={"..."}
                                                        breakClassName={"break-me"}
                                                        pageCount={this.state.pageCount3}
                                                        onPageChange={this.handlePageClick3}
                                                        containerClassName={"pagination Customer"}
                                                        subContainerClassName={"pages pagination"}
                                                        activeClassName={"active"}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                                <div class="tab-pane fade" id="facilitators" role="tabpanel" style={{ marginBottom: "20px" }}>
                                    <div className='row font-weight-normal' style={{ fontWeight: "800", fontSize: "15px", color: "rgba(5,54,82,1)", marginLeft: "10px" }}>
                                        <div className='col-3' style={{}}>
                                            <p style={{ fontWeight: "600" }}>{t('User ID')}</p>
                                        </div>
                                        <div className='col-3'>
                                            <p style={{ fontWeight: "600" }}>{t('User Name')}</p>
                                        </div>
                                        <div className='col-3'>
                                            <p style={{ fontWeight: "600" }}>{t('User Detail')}</p>
                                        </div>
                                        <div className='col-3'>
                                            <p style={{ fontWeight: "600" }}>{t('Status')}</p>
                                        </div>

                                    </div>

                                    <hr className="col-12" style={{ marginLeft: "13px", width: "94%", marginTop: "-10px" }} />
                                    {this.state.facList == "" ?
                                        <div className="row mt-2" style={{ marginLeft: "6px" }}>
                                            <div className="col" style={{ textAlign: "center", color: "#222C70", fontSize: "14px", fontWeight: "500" }}>
                                                <p>No Data Available !</p>
                                            </div>
                                        </div> :
                                        <>
                                            <div className="">
                                                {this.state.facList.map((user, index) => {
                                                    return (
                                                        <div className='col' key={index}>
                                                            <div className='card' style={{ marginBottom: "-16px", transition: 'none', cursor: 'default', backgroundColor: (index % 2 == 0) ? 'rgba(255,255,255,1)' : 'rgba(242,242,242,1)' }}>
                                                                <div className="row item-list align-items-center">
                                                                    <div className="col-3">
                                                                        <p className="" style={{ paddingLeft: "10px", marginTop: "12px", fontSize: "16px", color: "rgba(5,54,82,1)", fontWeight: "490" }}>{user.userid}</p>
                                                                    </div >
                                                                    <div className="col-3">
                                                                        <p className="" style={{ paddingLeft: "10px", marginTop: "12px", fontSize: "16px", color: "rgba(5,54,82,1)", fontWeight: "490", width: "max-content" }}>{user.username !== "" ? user.username : "-"}</p>
                                                                    </div >
                                                                    <div className="col-3" style={{ cursor: "pointer", textAlign: "start" }}>
                                                                        {user.status === '3' ?
                                                                            <FaEdit style={{ fontSize: "20px", color: "rgba(0,121,190,1)", marginLeft: "17px" }} disabled /> :
                                                                            <FaEdit style={{ fontSize: "20px", color: "rgba(0,121,190,1)", marginLeft: "17px" }} onClick={this.userDetails.bind(
                                                                                this,
                                                                                user.userid,
                                                                                user.username,
                                                                                user.city,
                                                                                user.district,
                                                                                user.pincode,
                                                                                user.usertype,
                                                                                user.status,
                                                                                user.mobileno
                                                                            )} />
                                                                        }

                                                                    </div>
                                                                    <div className="col-3">
                                                                        <p className="" style={{ paddingLeft: "20px", marginTop: "12px", fontSize: "16px", color: "rgba(5,54,82,1)", fontWeight: "490" }}>
                                                                            {user.status === '0' && <p style={{ color: "rgb(199, 188, 34)", fontWeight: "600" }}><img src={a2} style={{ height: "19px" }} />&nbsp;Not Approved</p>}
                                                                            {user.status === '1' && <p style={{ color: "rgb(29, 143, 63)", fontWeight: "600" }}><img src={a1} style={{ height: "19px" }} />&nbsp;Approved</p>}
                                                                            {user.status === '2' && <p style={{ color: "rgb(27, 18, 199)", fontWeight: "600" }}><img src={a3} style={{ height: "19px" }} />&nbsp;Rejected</p>}
                                                                            {user.status === '3' && <p style={{ color: "rgb(23, 142, 207)", fontWeight: "600" }}><img src={a4} style={{ height: "19px" }} />&nbsp;Deleted</p>}
                                                                            {user.status === '4' && <p style={{ color: "rgb(219, 101, 37)", fontWeight: "600" }}><FaUserTimes />&nbsp;Blocked</p>}
                                                                            {user.status === '-1' && <p style={{ color: "rgb(199, 188, 34)", fontWeight: "600" }}><img src={a2} style={{ height: "19px" }} />&nbsp;Not Approved</p>}
                                                                        </p>
                                                                    </div >
                                                                </div>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                            <div className="row">
                                                <div className='col'></div>
                                                <div className='col' style={{ marginRight: "15px" }}>
                                                    <div className='card border-0' style={{ height: "40px" }}>
                                                        <ReactPaginate
                                                            previousLabel={"<"}
                                                            nextLabel={">"}
                                                            breakLabel={"..."}
                                                            breakClassName={"break-me"}
                                                            pageCount={this.state.pageCount1}
                                                            onPageChange={this.handlePageClick1}
                                                            containerClassName={"pagination Customer"}
                                                            subContainerClassName={"pages pagination"}
                                                            activeClassName={"active"}
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                        </>}

                                </div>
                                <div class="tab-pane fade" id="evaluators" role="tabpanel" style={{ marginBottom: "20px" }}>
                                    <div className='row font-weight-normal' style={{ fontWeight: "800", fontSize: "15px", color: "rgba(5,54,82,1)", marginLeft: "10px" }}>
                                        <div className='col-3' style={{}}>
                                            <p style={{ fontWeight: "600" }}>{t('User ID')}</p>
                                        </div>
                                        <div className='col-3'>
                                            <p style={{ fontWeight: "600" }}>{t('User Name')}</p>
                                        </div>
                                        <div className='col-3'>
                                            <p style={{ fontWeight: "600" }}>{t('User Detail')}</p>
                                        </div>
                                        <div className='col-3'>
                                            <p style={{ fontWeight: "600" }}>{t('Status')}</p>
                                        </div>

                                    </div>

                                    <hr className="col-12" style={{ marginLeft: "13px", width: "94%", marginTop: "-10px" }} />
                                    {
                                        this.state.evalList == "" ?
                                            <div className="row mt-2" style={{ marginLeft: "6px" }}>
                                                <div className="col" style={{ textAlign: "center", color: "#222C70", fontSize: "14px", fontWeight: "500" }}>
                                                    <p>No Data Available !</p>
                                                </div>
                                            </div> :
                                            <>
                                                <div className="" >
                                                    {this.state.evalList.map((user, index) => {
                                                        return (
                                                            <div className="col" key={index}>
                                                                <div className='card' style={{ marginBottom: "-16px", transition: 'none', cursor: 'default', backgroundColor: (index % 2 == 0) ? 'rgba(255,255,255,1)' : 'rgba(242,242,242,1)' }}>
                                                                    <div className="row item-list align-items-center">
                                                                        <div className="col-3">
                                                                            <p className="" style={{ paddingLeft: "10px", marginTop: "12px", fontSize: "16px", color: "rgba(5,54,82,1)", fontWeight: "490" }}>{user.userid}</p>
                                                                        </div >
                                                                        <div className="col-3">
                                                                            <p className="" style={{ paddingLeft: "10px", marginTop: "12px", fontSize: "16px", color: "rgba(5,54,82,1)", fontWeight: "490", width: "max-content" }}>{user.username}</p>
                                                                        </div >
                                                                        <div className="col-3" style={{ cursor: "pointer", textAlign: "start" }}>
                                                                            {user.status === '3' ?
                                                                                <FaEdit style={{ fontSize: "20px", color: "rgba(0,121,190,1)", marginLeft: "17px" }} disabled />
                                                                                :
                                                                                <FaEdit style={{ fontSize: "20px", color: "rgba(0,121,190,1)", marginLeft: "17px" }} onClick={this.userDetails.bind(
                                                                                    this,
                                                                                    user.userid,
                                                                                    user.username,
                                                                                    user.city,
                                                                                    user.district,
                                                                                    user.pincode,
                                                                                    user.usertype,
                                                                                    user.status,
                                                                                    user.mobileno
                                                                                )} />
                                                                            }

                                                                        </div>
                                                                        <div className="col-3">
                                                                            <p className="" style={{ paddingLeft: "20px", marginTop: "12px", fontSize: "16px", color: "rgba(5,54,82,1)", fontWeight: "490" }}>
                                                                                {user.status === '0' && <p style={{ color: "rgb(199, 188, 34)", fontWeight: "600" }}><img src={a2} style={{ height: "19px" }} />&nbsp;Not Approved</p>}
                                                                                {user.status === '1' && <p style={{ color: "rgb(29, 143, 63)", fontWeight: "600" }}><img src={a1} style={{ height: "19px" }} />&nbsp;Approved</p>}
                                                                                {user.status === '2' && <p style={{ color: "rgb(27, 18, 199)", fontWeight: "600" }}><img src={a3} style={{ height: "19px" }} />&nbsp;Rejected</p>}
                                                                                {user.status === '3' && <p style={{ color: "rgb(23, 142, 207)", fontWeight: "600" }}><img src={a4} style={{ height: "19px" }} />&nbsp;Deleted</p>}
                                                                                {user.status === '4' && <p style={{ color: "rgb(219, 101, 37)", fontWeight: "600" }}><FaUserTimes />&nbsp;Blocked</p>}
                                                                                {user.status === '-1' && <p style={{ color: "rgb(199, 188, 34)", fontWeight: "600" }}><img src={a2} style={{ height: "19px" }} />&nbsp;Not Approved</p>}
                                                                            </p>
                                                                        </div >
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>

                                                <div className="row" style={{ paddingRight: "12px" }}>
                                                    <div className='col'></div>
                                                    <div className='col'>
                                                        <div className='card border-0' style={{ height: "40px" }}>
                                                            <ReactPaginate
                                                                previousLabel={"<"}
                                                                nextLabel={">"}
                                                                breakLabel={"..."}
                                                                breakClassName={"break-me"}
                                                                pageCount={this.state.pageCount2}
                                                                onPageChange={this.handlePageClick2}
                                                                containerClassName={"pagination Customer"}
                                                                subContainerClassName={"pages pagination"}
                                                                activeClassName={"active"}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                    }

                                </div>
                                <div className="tab-pane face" id="allRoles" role="tabpanel">
                                    <div style={{ cursor: "default", color: "#222C70" }} >
                                        <div className='row'>
                                            <div className='col' style={{ textAlign: "center", fontSize: "15px", fontWeight: "500" }}>
                                                <p>Define or Modify Roles & Associated Permissions</p>
                                            </div>
                                        </div>

                                        <div className="row pl-4 align-items-center sysUsers">
                                            <div className="col-3">
                                                <p style={{ fontWeight: "500", color: "rgb(5, 54, 82)" }}>
                                                    Role Name
                                                </p>
                                            </div>
                                            <div className="col-6">
                                                <p style={{ fontWeight: "500", color: "rgb(5, 54, 82)", marginLeft: "-20px" }}>
                                                    Description
                                                </p>
                                            </div>
                                        </div>
                                        <hr style={{ marginTop: "-5px" }} />
                                        <div className='row' style={{ marginTop: "-21px" }} id="myUL">
                                            <div className='col'>
                                                {this.state.roleList && this.state.roleList.length === 0 ?
                                                    "" : <>
                                                        {
                                                            this.state.roleList.map((role, index) => {
                                                                return (
                                                                    <div className='card' key={index} style={{ marginBottom: "-10px", transition: 'none', overflow: "visible", cursor: 'default', backgroundColor: (index % 2 == 0) ? 'rgba(255,255,255,1)' : 'rgba(242,242,242,1)' }}>
                                                                        <div className="row item-list align-items-center">
                                                                            <div className="col-3">
                                                                                <p className="" style={{ paddingLeft: "20px", marginTop: "12px", fontSize: "16px", color: "rgba(5,54,82,1)", fontWeight: "490" }}>
                                                                                    {role.rolename}
                                                                                </p>
                                                                            </div >
                                                                            <div className="col-6">
                                                                                <h6 className="" style={{ marginTop: "4px", fontSize: "16px", color: "rgba(5,54,82,1)", fontWeight: "490" }}>{role.roledesc}</h6>
                                                                            </div>
                                                                            <div className="col-3" style={{ textAlign: "center" }}>
                                                                                <span class="dropup">
                                                                                    <img src={openIt} style={{ height: "35px" }}
                                                                                        class="btn dropdown-toggle dropdown-toggle-split" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" />
                                                                                    &nbsp;
                                                                                    <div class="dropdown-menu" aria-labelledby="dropdownMenuButton" style={{ marginLeft: "-160px" }}>
                                                                                        <a class="dropdown-item" onClick={this.getUpdateStatus.bind(this, role.roleid, role.rolename, role.roledesc)}>Add Permission</a>
                                                                                        <a class="dropdown-item" onClick={this.deleteRole.bind(this, role.roleid, role.rolename)}>Delete Role</a>
                                                                                    </div>
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            })
                                                        }
                                                    </>
                                                }

                                            </div>
                                        </div>
                                        <div className="row float-right">
                                            <div className='col'></div>
                                            <div className='col'>
                                                <div className='card border-0' style={{ height: "40px" }}>
                                                    <ReactPaginate
                                                        previousLabel={"<"}
                                                        nextLabel={">"}
                                                        breakLabel={"..."}
                                                        breakClassName={"break-me"}
                                                        pageCount={this.state.pageCount4}
                                                        onPageChange={this.handlePageClick4}
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
                    </div>

                    {/* FacEvl Modal */}
                    <button type="button" id="facEvlModal" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal" style={{ display: "none" }}>
                        Fac Evl Modal
                    </button>
                    <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="static">
                        <div class="modal-dialog" role="document">
                            <div class="modal-content">
                                <div class="modal-body">
                                    <div className='row mb-2'>
                                        <div className='col-10'>
                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "600", paddingLeft: "8px" }}><img src={batch} style={{ width: "26px" }} /> &nbsp;User Detail</p>
                                            <hr style={{ width: "70px", marginTop: "-12px" }} />
                                        </div>
                                        <div className="col-2">
                                            <FaTimesCircle type="button" class="close" data-dismiss="modal" aria-label="Close" style={{ color: "rgb(5, 54, 82)", fontSize: "18px" }} />
                                        </div>
                                    </div>
                                    <div className="mb-2" style={{ border: "1.5px dashed rgb(81,164,219)", borderRadius: "5px", marginTop: "-10px", }}>
                                        <div className="row">
                                            {this.state.pmSystemUserFlag == false ?
                                                <div className="col" style={{ padding: "5px 35px", fontSize: "14px" }}>
                                                    <div className="row">
                                                        <div className='col-sm-3 col-md-3 col-lg-4'>
                                                            <p className="mb-0 font-weight-bold" style={{ color: "#222C70", fontWeight: "450" }}>User ID</p>
                                                        </div>
                                                        <div className='col-sm-1 col-md-1 col-lg-1'>
                                                            <p className="mb-0 font-weight-bold" style={{ color: "#222C70" }}>:</p>
                                                        </div>
                                                        <div className='col-sm-6 col-md-6 col-lg-6'>
                                                            <p className="mb-0" style={{ color: "#222C70" }}>{this.state.userid == "" ? "-" : this.state.userid}</p>
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className='col-sm-3 col-md-3 col-lg-4'>
                                                            <p className="mb-0 font-weight-bold" style={{ color: "#222C70", fontWeight: "450" }}>User Name</p>
                                                        </div>
                                                        <div className='col-sm-1 col-md-1 col-lg-1'>
                                                            <p className="mb-0 font-weight-bold" style={{ color: "#222C70" }}>:</p>
                                                        </div>
                                                        <div className='col-sm-6 col-md-6 col-lg-6'>
                                                            <p className="mb-0" style={{ color: "#222C70" }}>{this.state.username == "" ? "-" : this.state.username}</p>
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
                                                            <p className="mb-0" style={{ color: "#222C70" }}>{this.state.city == "" ? "-" : this.state.city}</p>
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className='col-sm-3 col-md-3 col-lg-4'>
                                                            <p className="mb-0 font-weight-bold" style={{ color: "#222C70", fontWeight: "450" }}>District</p>
                                                        </div>
                                                        <div className='col-sm-1 col-md-1 col-lg-1'>
                                                            <p className="mb-0 font-weight-bold" style={{ color: "#222C70" }}>:</p>
                                                        </div>
                                                        <div className='col-sm-6 col-md-6 col-lg-6'>
                                                            <p className="mb-0" style={{ color: "#222C70" }}>{this.state.district == "" ? "-" : this.state.district}</p>
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
                                                            <p className="mb-0" style={{ color: "#222C70" }}>{this.state.pincode == "" ? "-" : this.state.pincode}</p>
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
                                                            <p className="mb-0" style={{ color: "#222C70" }}>{this.state.mobile == "" ? "-" : this.state.mobile}</p>
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
                                                            <p className="mb-0">{this.state.status == 1 ? <span style={{ color: "rgb(29, 143, 63)" }}>Approved</span> :
                                                                <span>{this.state.status == 0 ? <span style={{ color: "rgb(199, 188, 34)" }}>Not Approved</span> : <span>{this.state.status == 2 ? <span style={{ color: "rgb(27, 18, 199)" }}>Rejected</span> :
                                                                    <span>{this.state.status == 3 ? <span style={{ color: "rgb(23, 142, 207)" }}>Deleted</span> : <span>{this.state.status == 4 ? <span style={{ color: "rgb(219, 101, 37)" }}>Blocked</span> :
                                                                        <span style={{ color: "rgb(199, 188, 34)" }}>Not Approved</span>
                                                                    }</span>}</span>}</span>}</span>}</p>
                                                        </div>
                                                    </div>
                                                </div> :
                                                <div className="col" style={{ padding: "5px 35px", fontSize: "14px" }}>
                                                    <div className="row">
                                                        <div className='col-sm-3 col-md-3 col-lg-4'>
                                                            <p className="mb-0 font-weight-bold" style={{ color: "#222C70", fontWeight: "450" }}>User Name</p>
                                                        </div>
                                                        <div className='col-sm-1 col-md-1 col-lg-1'>
                                                            <p className="mb-0 font-weight-bold" style={{ color: "#222C70" }}>:</p>
                                                        </div>
                                                        <div className='col-sm-6 col-md-6 col-lg-6'>
                                                            <p className="mb-0" style={{ color: "#222C70" }}>{this.state.pmName == "" ? "-" : this.state.pmName}</p>
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
                                                            <p className="mb-0" style={{ color: "#222C70" }}>{this.state.pmMobilno == "" ? "-" : this.state.pmMobilno}</p>
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
                                                            <p className="mb-0" style={{ color: "#222C70" }}>{this.state.pmEmail == "" ? "-" : this.state.pmEmail}</p>
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className='col-sm-3 col-md-3 col-lg-4'>
                                                            <p className="mb-0 font-weight-bold" style={{ color: "#222C70", fontWeight: "450" }}>Gender</p>
                                                        </div>
                                                        <div className='col-sm-1 col-md-1 col-lg-1'>
                                                            <p className="mb-0 font-weight-bold" style={{ color: "#222C70" }}>:</p>
                                                        </div>
                                                        <div className='col-sm-6 col-md-6 col-lg-6'>
                                                            <p className="mb-0" style={{ color: "#222C70" }}>{this.state.pmGender == "M" ? "Male" : this.state.pmGender === "F" ? "Female" : ""}</p>
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className='col-sm-3 col-md-3 col-lg-4'>
                                                            <p className="mb-0 font-weight-bold" style={{ color: "#222C70", fontWeight: "450" }}>Date Of Birth</p>
                                                        </div>
                                                        <div className='col-sm-1 col-md-1 col-lg-1'>
                                                            <p className="mb-0 font-weight-bold" style={{ color: "#222C70" }}>:</p>
                                                        </div>
                                                        <div className='col-sm-6 col-md-6 col-lg-6'>
                                                            <p className="mb-0" style={{ color: "#222C70" }}>{this.state.pmDOB}</p>
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className='col-sm-3 col-md-3 col-lg-4'>
                                                            <p className="mb-0 font-weight-bold" style={{ color: "#222C70", fontWeight: "450" }}>Address</p>
                                                        </div>
                                                        <div className='col-sm-1 col-md-1 col-lg-1'>
                                                            <p className="mb-0 font-weight-bold" style={{ color: "#222C70" }}>:</p>
                                                        </div>
                                                        <div className='col-sm-6 col-md-6 col-lg-6'>
                                                            <p className="mb-0" style={{ color: "#222C70" }}>{this.state.pmAddress}</p>
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className='col-sm-3 col-md-3 col-lg-4'>
                                                            <p className="mb-0 font-weight-bold" style={{ color: "#222C70", fontWeight: "450" }}>State</p>
                                                        </div>
                                                        <div className='col-sm-1 col-md-1 col-lg-1'>
                                                            <p className="mb-0 font-weight-bold" style={{ color: "#222C70" }}>:</p>
                                                        </div>
                                                        <div className='col-sm-6 col-md-6 col-lg-6'>
                                                            <p className="mb-0" style={{ color: "#222C70" }}>{this.state.pmstate}</p>
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className='col-sm-3 col-md-3 col-lg-4'>
                                                            <p className="mb-0 font-weight-bold" style={{ color: "#222C70", fontWeight: "450" }}>District</p>
                                                        </div>
                                                        <div className='col-sm-1 col-md-1 col-lg-1'>
                                                            <p className="mb-0 font-weight-bold" style={{ color: "#222C70" }}>:</p>
                                                        </div>
                                                        <div className='col-sm-6 col-md-6 col-lg-6'>
                                                            <p className="mb-0" style={{ color: "#222C70" }}>{this.state.pmdistrict}</p>
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
                                                            <p className="mb-0" style={{ color: "#222C70" }}>{this.state.pmcity}</p>
                                                        </div>
                                                    </div>
                                                    {this.state.officename ?
                                                        <div className="row">
                                                            <div className='col-sm-3 col-md-3 col-lg-4'>
                                                                <p className="mb-0 font-weight-bold" style={{ color: "#222C70", fontWeight: "450" }}>Office Name</p>
                                                            </div>
                                                            <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                <p className="mb-0 font-weight-bold" style={{ color: "#222C70" }}>:</p>
                                                            </div>
                                                            <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                <p className="mb-0" style={{ color: "#222C70" }}>{this.state.officename}</p>
                                                            </div>
                                                        </div> : ""}
                                                    {this.state.staffname ?
                                                        <div className="row">
                                                            <div className='col-sm-3 col-md-3 col-lg-4'>
                                                                <p className="mb-0 font-weight-bold" style={{ color: "#222C70", fontWeight: "450" }}>Staff Name</p>
                                                            </div>
                                                            <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                <p className="mb-0 font-weight-bold" style={{ color: "#222C70" }}>:</p>
                                                            </div>
                                                            <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                <p className="mb-0" style={{ color: "#222C70" }}>{this.state.staffname}</p>
                                                            </div>
                                                        </div> : ""}
                                                </div>
                                            }
                                        </div>

                                    </div>
                                    {/* Accordion Design */}
                                    {this.state.pmSystemUserFlag == false ?
                                        <div class="accordion accordion-flush" id="accordionFlushExample">
                                            {this.state.status === '4' ?
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
                                                                    {/* <div className="form-row" style={{ marginTop: "-8px" }}>
                                                                <div className="form-group col-md-4" style={{ fontSize: "14px" }}>
                                                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('User Type')}</p>
                                                                    <select style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }} className="form-select" onChange={this.utype} >
                                                                        <option defaultValue>Select</option>
                                                                        <option value="4">Facilitator</option>
                                                                        <option value="5">Evaluator</option>
                                                                    </select>
                                                                </div>
                                                                <div className="form-group col-md-4">
                                                                </div>
                                                            </div> */}
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
                                                        <div class="accordion-item" style={{ border: "1.5px solid rgb(82, 181, 227)", borderRadius: "5px" }}>
                                                            <div class="accordion-header" id="flush-headingOne">
                                                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" style={{ color: "rgb(82, 181, 227)" }}
                                                                    data-bs-target="#flush-collapseOne" aria-expanded="false" aria-controls="flush-collapseOne">
                                                                    Block User
                                                                </button>
                                                            </div>
                                                            <div id="flush-collapseOne" class="accordion-collapse collapse" aria-labelledby="flush-headingOne" data-bs-parent="#accordionFlushExample">
                                                                <div class="accordion-body">
                                                                    {/* <div className="form-row" style={{ marginTop: "-8px" }}>
                                                                <div className="form-group col-md-4" style={{ fontSize: "14px" }}>
                                                                    <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('User Type')}</p>
                                                                    <select style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }} className="form-select" onChange={this.utype} >
                                                                        <option defaultValue>Select</option>
                                                                        <option value="4">Facilitator</option>
                                                                        <option value="5">Evaluator</option>
                                                                    </select>
                                                                </div>
                                                                <div className="form-group col-md-4">
                                                                </div>
                                                            </div> */}
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
                                                                                    backgroundColor: "rgb(82, 181, 227)",
                                                                                    paddingLeft: "10px", paddingRight: "10px"
                                                                                }}
                                                                            >Block</button>
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
                                                    <div class="accordion-item" style={{ border: "1.5px solid rgb(235, 119, 42)", borderRadius: "5px" }}>
                                                        <div class="accordion-header" id="flush-headingThree">
                                                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" style={{ color: "rgb(235, 119, 42)" }}
                                                                data-bs-target="#flush-collapseThree" aria-expanded="false" aria-controls="flush-collapseThree">
                                                                Remove User
                                                            </button>
                                                        </div>
                                                        <div id="flush-collapseThree" class="accordion-collapse collapse" aria-labelledby="flush-headingThree" data-bs-parent="#accordionFlushExample">
                                                            <div class="accordion-body">
                                                                {/* <div className="form-row" style={{ marginTop: "-8px" }}>
                                                            <div className="form-group col-md-4" style={{ fontSize: "14px" }}>
                                                                <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('User Type')}</p>
                                                                <select style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }} className="form-select" onChange={this.utype} >
                                                                    <option defaultValue>Select</option>
                                                                    <option value="4">Facilitator</option>
                                                                    <option value="5">Evaluator</option>
                                                                </select>
                                                            </div>
                                                            <div className="form-group col-md-4">
                                                            </div>
                                                        </div> */}
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
                                                                                backgroundColor: "rgb(219, 87, 31)",
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

                                        </div> : ""}
                                    {this.state.pmSystemUserFlag == true ?
                                        <div className="row">
                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "600", marginLeft: "3px" }}>Update System User Status</p>
                                            <div className="col-8" style={{ marginTop: "-10px" }}>
                                                <select className="form-select" onChange={this.EmpStatusClick}>
                                                    <option defaultChecked>Select Status</option>
                                                    {this.state.pmStatus === 1 ? <option value="0">InActive</option> :
                                                        this.state.pmStatus === 2 ? <option value="1">Active</option> : ""}
                                                </select>
                                            </div>
                                            <div className="col-4" style={{ marginTop: "-10px" }}>
                                                <button className="btn btn-primary" data-dismiss="modal"
                                                    style={{ paddingLeft: "42px", paddingRight: "42px", backgroundColor: "rgb(136, 189, 72)" }} onClick={this.updateSysStatus}>Submit</button>
                                            </div>
                                        </div> : ""}
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Block/Unblock SU */}
                    <button type="button" id="suBlockModal" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal12" style={{ display: "none" }}>
                        SU Modal
                    </button>
                    <div class="modal fade" id="exampleModal12" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="static">
                        <div class="modal-dialog" role="document">
                            <div class="modal-content">
                                <div class="modal-body">
                                    <div className='row mb-2'>
                                        <div className='col-10'>
                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "600", paddingLeft: "8px" }}><img src={batch} style={{ width: "26px" }} /> &nbsp;Block/ Unblock</p>
                                            <hr style={{ width: "70px", marginTop: "-12px" }} />
                                        </div>
                                        <div className="col-2">
                                            <FaTimesCircle type="button" class="close" data-dismiss="modal" aria-label="Close" style={{ color: "rgb(5, 54, 82)", fontSize: "18px" }} />
                                        </div>
                                    </div>
                                    <div className="mb-2" style={{ marginTop: "-10px", }}>
                                        <div className="row">
                                            <div class="accordion accordion-flush" id="accordionFlushExample1">
                                                {this.state.status === 4 ?
                                                    <div className="row mb-2">
                                                        <div className="col">
                                                            <div class="accordion-item" style={{ border: "1.5px solid rgb(199, 171, 16)", borderRadius: "5px" }}>
                                                                <div class="accordion-header" id="flush-headingFour">
                                                                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" style={{ color: "rgb(199, 171, 16)" }}
                                                                        data-bs-target="#flush-collapseFour" aria-expanded="false" aria-controls="flush-collapseFour">
                                                                        Unblock User
                                                                    </button>
                                                                </div>
                                                                <div id="flush-collapseFour" class="accordion-collapse collapse" aria-labelledby="flush-headingFour" data-bs-parent="#accordionFlushExample1">
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
                                                            <div class="accordion-item" style={{ border: "1.5px solid rgb(82, 181, 227)", borderRadius: "5px" }}>
                                                                <div class="accordion-header" id="flush-headingFive">
                                                                    <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" style={{ color: "rgb(82, 181, 227)" }}
                                                                        data-bs-target="#flush-collapseFive" aria-expanded="false" aria-controls="flush-collapseFive">
                                                                        Block User
                                                                    </button>
                                                                </div>
                                                                <div id="flush-collapseFive" class="accordion-collapse collapse" aria-labelledby="flush-headingFive" data-bs-parent="#accordionFlushExample1">
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
                                                                                        backgroundColor: "rgb(82, 181, 227)",
                                                                                        paddingLeft: "10px", paddingRight: "10px"
                                                                                    }}
                                                                                >Block</button>
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
                                                        <div class="accordion-item" style={{ border: "1.5px solid rgb(235, 119, 42)", borderRadius: "5px" }}>
                                                            <div class="accordion-header" id="flush-headingSix">
                                                                <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" style={{ color: "rgb(235, 119, 42)" }}
                                                                    data-bs-target="#flush-collapseSix" aria-expanded="false" aria-controls="flush-collapseSix">
                                                                    Remove User
                                                                </button>
                                                            </div>
                                                            <div id="flush-collapseSix" class="accordion-collapse collapse" aria-labelledby="flush-headingSix" data-bs-parent="#accordionFlushExample1">
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
                                                                                onClick={this.deleteSysUser}
                                                                                style={{
                                                                                    backgroundColor: "rgb(235, 119, 42)",
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

                                            </div>
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
                    {/* Update Role Modal */}
                    <button type="button" id='UpdateuserRoleModal' style={{ display: "none" }} class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter4">
                        Update Role Modal
                    </button>
                    <div class="modal fade" id="exampleModalCenter4" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered" role="document">
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
                                            <button type="button" class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.userUpdateRole}>Submit</button>&nbsp;
                                            <button type="button" class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "#0079BF" }}>Cancel</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withTranslation()(UserManagement);