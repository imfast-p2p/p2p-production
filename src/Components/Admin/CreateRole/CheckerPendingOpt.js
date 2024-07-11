import React, { Component } from 'react';
import dashboardIcon from '../../assets/icon_dashboard.png';
import { FaAngleLeft, FaUserTimes, FaTimesCircle, FaFilter, FaCheckCircle } from "react-icons/fa";
import { Link } from 'react-router-dom';
import Loader from '../../Loader/Loader';
import { withTranslation } from 'react-i18next';
import AdminSidebar from '../AdminSidebar';
import SystemUserSidebar from '../../SystemUser/SystemUserSidebar'
import { confirmAlert } from "react-confirm-alert";
import { BASEURL } from '../../assets/baseURL';
import openIt from '../../assets/AdminImg/openit.png'
import ReactPaginate from 'react-paginate';
import '../../Borrower/Pagination.css';
import addRole from '../../assets/addRole.png';
import $ from 'jquery';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table';
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css';
import batch from '../../assets/batch.png';
import a1 from '../../assets/AdminImg/approve.png'
import a2 from '../../assets/AdminImg/notapprove.png';

var jsonData;
class CheckerpendingOpt extends Component {
    constructor() {
        super();
        this.state = {
            offset: 0,
            checkerPendingOpt: [],
            orgtableData: [],
            perPage: 6,
            currentPage: 0,
            pageCount: "",

            filterStatus: "0",
            checkerStatus: "",
            checkerRefno: "",
            resData: {},
            checkerData: {},

            pmType: "",
            roleToUser: "",
            moreDetails: {},
            operationType: "",

            checkerPendingOptPermissions: [],

            allClientsList: [],
            permissionList: [],
            allPermissionLists: [],
            roleList: [],
            roleID: "",
            workflowmasterActivities: [],
            workflowDetailList: [],
            wfHierarchyData: {},
            wfEditHierarchyData: {},

            createWfActivitiesList: [],
            editActivitiesList: [],
            identifyFlag: true,
            showLoader: false
        }
        this.list0ref = React.createRef();
        this.list2ref = React.createRef();
    }
    componentDidMount() {
        if (sessionStorage.getItem('isLogin') == "true" && sessionStorage.getItem('status') == 'Success') {
            if (sessionStorage.getItem('userType') === "0") {
                if (sessionStorage.getItem('sAdmin') === "1" && sessionStorage.getItem('pmDefault') === "1") {
                    this.setState({ pmType: "superAdmin" })
                } else if (sessionStorage.getItem('pmDefault') === "0") {
                    this.setState({ pmType: "pmAdmin" })
                } else {
                    this.setState({ pmType: "0" })
                }
            } else if (sessionStorage.getItem('userType') === "1") {
                if (sessionStorage.getItem('pmDefault') === "0") {
                    this.setState({ pmType: "pmSystemUser" }); // Update state using setState
                } else {
                    this.setState({ pmType: "platformSysUser" }); // Update state using setState
                }
            }
            var storedArrayStringJSON = sessionStorage.getItem("rolePermData")
            var storedArray = JSON.parse(storedArrayStringJSON);
            console.log(storedArray);
            if (storedArray) {
                storedArray.forEach(element => {
                    if (element.rolename === "USR_ROLE_MGMT_CHECKER") {
                        console.log(element.permissions);
                        this.setState({ checkerPendingOptPermissions: element.permissions })
                        console.log(this.state.checkerPendingOptPermissions)
                        //GET_CHKR_PEN_OPT_LST
                        this.getCheckerPendingOpt()
                    }
                });
            }
        } else {
            window.location = '/login'
        }
        this.getCheckerPendingOpt()
        // this.getCheckerPendingOpt()
        // var role = "ASSIGN_ROLE_TO_USR";
        // var role = "ASSIGN_ROLE_TO_USR_CHKR";
        // this.setState({ roleToUser: role })

        // ASSIGN_ROLE_TO_USR->maker
        // ASSIGN_ROLE_TO_USR_CHKR->Checker
    }
    handlePageClick = (event) => {
        const selectedPage = event.selected;
        const offset = selectedPage * this.state.perPage;
        this.setState({
            currentPage: selectedPage,
            offset: offset
        }, () => {
            this.loadMoreData();
        })
    }
    loadMoreData = () => {
        const data = this.state.orgtableData;
        const slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
        this.setState({
            pageCount: Math.ceil(data.length / this.state.perPage),
            checkerPendingOpt: slice
        })
    }
    checkerStatus = (event) => {
        this.setState({ checkerStatus: event.target.value })
    }
    filterStatus = (event) => {
        this.setState({ filterStatus: event.target.value })
    }
    getCheckerPendingOpt = () => {
        fetch(BASEURL + `/usrmgmt/getcheckerpendingoptnlist?checkerstatus=` + parseInt(this.state.filterStatus), {
            method: 'GET',
            headers: {
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            }
        }).then((Response) => {
            return Response.json();
        }).then((resdata) => {
            console.log(resdata);
            if (resdata.status === "Success" || resdata.status === "SUCCESS") {
                console.log(resdata.msgdata);
                var list = resdata.msgdata;
                if (list) {
                    list.sort((a, b) => {
                        return new Date(b.createdon).getTime() - new Date(a.createdon).getTime()
                    })
                    console.log(list);
                    this.setState({ checkerPendingOpt: list })

                    var data = list
                    console.log(data)
                    var slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
                    console.log(slice)

                    this.setState({
                        pageCount: Math.ceil(data.length / this.state.perPage),
                        orgtableData: data,
                        checkerPendingOpt: slice
                    })
                }
            } else {
                this.setState({
                    checkerPendingOpt: [],
                    orgtableData: []
                })
                confirmAlert({
                    message: resdata.message,
                    buttons: [
                        {
                            label: "OK",
                            onClick: () => {

                            },
                        },
                    ],
                    closeOnClickOutside: false,
                });
            }
        })
    }
    checkerPendingDetails = (user) => {
        console.log(user);
        this.setState({ checkerRefno: user.referenceno });
        this.setState({ operationType: user.operationtype }, () => {
            console.log(user.operationtype, this.state.operationType);
            this.getDataAssignedByMaker(user.referenceno)
        })
        this.setState({ moreDetails: user })
        //$('#checkerModal').click();
    }
    getDataAssignedByMaker = (referenceno) => {
        console.log(this.state.operationType)
        fetch(BASEURL + `/usrmgmt/checker/getoperationdetails?referenceno=` + parseInt(referenceno), {
            method: 'GET',
            headers: {
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            }
        }).then((Response) => {
            return Response.json();
        }).then((resdata) => {
            console.log(resdata);
            if (resdata.status == "Success" || "SUCCESS") {
                var resdata;
                if (this.state.operationType === "1") {
                    // resdata = {
                    //     "status": "Success",
                    //     "code": "0000",
                    //     "msg": "Respective message",
                    //     "msgdata": {
                    //         "rolename": "BORROWER",
                    //         "description": "Abc club",
                    //         "clients": [1],
                    //         "permissions": [1, 2, 3, 5]
                    //     }
                    // }
                    this.setState({ checkerData: resdata.msgdata })
                    this.getAllClients(resdata.msgdata);
                } else if (this.state.operationType === "2") {
                    // resdata = {
                    //     "status": "Success",
                    //     "code": "0000",
                    //     "msg": "Respective message",
                    //     "msgdata": {
                    //         "rolename": "BORROWER",
                    //         "description": "Abc club",
                    //         "clients": [1],
                    //         "permissions": [1, 2, 3]
                    //     }
                    // }
                    this.setState({ checkerData: resdata.msgdata })
                    this.getAllClients(resdata.msgdata);
                } else if (this.state.operationType === "3") {
                    // resdata = {
                    //     "status": "Success",
                    //     "code": "0000",
                    //     "msg": "Respective message",
                    //     "msgdata": {
                    //         "username": "SITA",
                    //         "roles": [
                    //             {
                    //                 "rolename": "VRFD_EVL",
                    //                 "roleid": 10
                    //             }
                    //         ]
                    //     }
                    // }
                    this.setState({ checkerData: resdata.msgdata })
                    this.getAllRoles(resdata.msgdata)
                } else if (this.state.operationType === "4") {
                    // resdata = {
                    //     "status": "Success",
                    //     "code": "0000",
                    //     "msg": "Respective message",
                    //     "msgdata": {
                    //         "productid": "A",
                    //         "activitylist": [
                    //             {
                    //                 "activityid": "ABC",
                    //                 "activitystatus": "1"
                    //             },
                    //             {
                    //                 "activityid": "XYZ",
                    //                 "activitystatus": "2"
                    //             },
                    //         ]
                    //     }
                    // }
                    this.setState({ checkerData: resdata.msgdata })
                    this.workflowActivityList(resdata.msgdata)
                } else if (this.state.operationType === "5") {
                    // resdata = {
                    //     "status": "Success",
                    //     "code": "0000",
                    //     "msg": "Respective message",
                    //     "msgdata": {
                    //         "workflowid": "",
                    //         "comments": "Edited",
                    //         "activitylist": [
                    //             {
                    //                 "activityid": "ABC",
                    //                 "activitystatus": "1"
                    //             },
                    //             {
                    //                 "activityid": "XYZ",
                    //                 "activitystatus": "2"
                    //             },
                    //         ]
                    //     }
                    // }
                    this.setState({ checkerData: resdata.msgdata })
                    if (resdata.msgdata.wfdata) {
                        this.editWorkflow(resdata.msgdata.wfdata.workflowid)
                    } else {
                        this.editWorkflow(resdata.msgdata.workflowid)
                    }
                }
                console.log(resdata);
            } else {
                confirmAlert({
                    message: resdata.message,
                    buttons: [
                        {
                            label: "OK",
                            onClick: () => {

                            },
                        },
                    ],
                    closeOnClickOutside: false,
                });
            }
        })
    }
    //Checker Create Role
    getAllClients = (resJson) => {
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

                jsonData = resJson;
                console.log(jsonData)
                // Find the matched client object
                const matchedClient = this.state.allClientsList.find(item => item.clientid === jsonData.clients[0].toString());

                // Extract the clientname if a match is found
                const matchedClientName = matchedClient ? matchedClient.clientname : null;
                const matchedClientID = matchedClient ? matchedClient.clientid : null;
                console.log("Matched clientname:", matchedClientName);

                jsonData.clients = [matchedClientName];
                this.setState({ checkerData: jsonData });
                this.getAllPermissions(matchedClientID)
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
                console.log(jsonData)
                // Find the matched client object
                const matchedClient = this.state.permissionList.find(item => item.permissionid === jsonData.permissions.includes(item.permissionid));
                const matchedPermissions = jsonData.permissions.map(permissionId =>
                    this.state.permissionList.find(permission => permission.permissionid === permissionId.toString())
                );
                // Extract the permission names from the matched permissions
                const matchedPermissionNames = matchedPermissions.map(permission => (permission ? permission.permissiondesc : null));
                console.log("Matched permission names:", matchedPermissionNames);
                jsonData.permissions = matchedPermissionNames.filter(Boolean); // Filter out any null values
                this.setState({ checkerData: jsonData });
                $('#checkerModal').click();
            } else {

            }
        })
    }
    //assignRole
    getAllRoles = (msgData) => {
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
                    //this.setState({ roleList: resdata.msgdata })

                    console.log(msgData);
                    var roleID = ""
                    msgData.roles.map((element, index) => {
                        roleID = element.roleid;
                    })
                    console.log(roleID);
                    this.getAssignedRoles()
                    $('#checkerModal').click();
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
    getAssignedRoles = () => {
        fetch(BASEURL + '/usrmgmt/getassigneduserroles?memmid=' + this.state.moreDetails.memmid, {
            headers: {
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            }
        }).then((Response) => {
            return Response.json();
        })
            .then((resdata) => {
                if (resdata.status == 'Success') {
                    console.log(resdata);
                    this.setState({ roleList: resdata.data.userroles })
                }
                else {
                    this.setState({ roleList: [] })
                }
            })
            .catch((error) => {
                console.log(error)
            })
    }
    //createWorkflow
    workflowActivityList = (msgData) => {
        fetch(BASEURL + "/lms/getworkflowactivitylist", {
            method: "GET",
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
                if (resdata.status == "SUCCESS" || resdata.status == "Success") {
                    //updated
                    var workflowActivities = resdata.msgdata;
                    // this.setState({ workflowmasterActivities: resdata.msgdata });
                    console.log(workflowActivities)
                    console.log(msgData)
                    var msgData2;
                    if (msgData.wfdata) {
                        msgData2 = msgData.wfdata;
                    } else if (!msgData.wfdata) {
                        msgData2 = msgData;
                    }
                    console.log(msgData2);
                    const result = workflowActivities.filter(msg => {
                        const matchingActivity = msgData2.activitylist.find(act => act.activityid === msg.activityid);
                        return matchingActivity;
                    }).map(msg => ({
                        "activityid": msg.activityid,
                        "activityname": msg.activity,
                        "activitystatus": msgData2.activitylist.find(act => act.activityid === msg.activityid).activitystatus
                    }));
                    console.log(result);
                    const borProf = result.map((profile) => {
                        if (profile.activityid) {
                            profile.checked = true;
                        }
                        else {
                            profile.checked = false;
                        }
                        return profile;
                    })
                    this.setState({ workflowmasterActivities: borProf })
                    console.log(borProf);
                    msgData2.activitylist = borProf;
                    if (msgData.wfhierarchydata) {
                        this.setState({ checkerData: msgData2 }, () => {
                            $('#checkerModal').click();
                        });
                    } else {
                        this.setState({
                            checkerData: msgData2,
                            wfHierarchyData: {}
                        }, () => {
                            $('#checkerModal').click();
                        });
                    }
                    console.log(msgData2)

                    console.log(msgData, msgData.wfhierarchydata)
                    if (msgData.wfhierarchydata) {
                        var wfHierarchydata = msgData.wfhierarchydata;
                        var matchingActivity2 = borProf.find(activity => activity.activityid === wfHierarchydata.activityid);
                        if (matchingActivity2) {
                            wfHierarchydata.activityname = matchingActivity2.activityname;
                            console.log("Matching activity found and updated wfHierarchydata:", wfHierarchydata);
                        }
                        console.log(wfHierarchydata);
                        this.setState({
                            wfHierarchyData: wfHierarchydata,
                            identifyFlag: true
                        }, () => {
                            this.getOfficeHierarchy(wfHierarchydata)
                            $('#checkerModal').click();
                        });
                    }
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
                                    },
                                },
                            ],
                        });
                    }
                }
            })
            .catch(err => {
                console.log(err.message)
            })
    }
    //editWorkflow
    editWorkflow = (workflowid) => {
        console.log(workflowid);
        fetch(BASEURL + "/lms/getworkflowdetails?workflowid=" + workflowid, {
            method: "GET",
            headers: {
                Authorization: "Bearer " + sessionStorage.getItem("token"),
            },
        }).then((response) => {
            console.log("Response:", response);
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata);
                if (resdata.status == "SUCCESS") {
                    this.setState({ workflowDetailList: resdata.msgdata.workflowdetails })

                    var workflowDetailList = resdata.msgdata.workflowdetails;
                    console.log(workflowDetailList);
                    var msgData = this.state.checkerData;
                    var msgData2;
                    console.log(msgData2)
                    if (msgData.wfdata) {
                        msgData2 = msgData.wfdata;
                    } else if (!msgData.wfdata) {
                        msgData2 = msgData;
                    }
                    console.log(msgData2);
                    console.log(this.state.checkerData);
                    // const result = workflowDetailList.filter(msg => {
                    //     const matchingActivity = this.state.checkerData.activitylist.find(act => act.activityid === msg.activityid);
                    //     return matchingActivity;
                    // }).map(msg => ({
                    //     "activityid": msg.activityid,
                    //     "activityname": msg.activity,
                    //     "activitystatus": this.state.checkerData.activitylist.find(act => act.activityid === msg.activityid).activitystatus
                    // }));
                    // console.log(result);
                    const result = workflowDetailList.map(msg => {
                        const matchingActivity = msgData2.activitylist.find(act => act.activityid === msg.activityid);
                        return {
                            "activityid": msg.activityid,
                            "activityname": msg.activity,
                            "activitystatus": matchingActivity ? matchingActivity.activitystatus : msg.status
                        };
                    });
                    console.log(result);
                    const workflowDetails = result.map((profile) => {
                        profile.disabled = true;
                        if (profile.status == 1) {
                            profile.checked = true;
                        }
                        else {
                            profile.checked = false;
                        }
                        return profile;
                    })
                    console.log(workflowDetails);
                    msgData2.activitylist = workflowDetails;
                    if (msgData.wfhierarchydata) {
                        this.setState({ checkerData: msgData2 }, () => {
                            $('#checkerModal').click();
                        });
                    } else {
                        this.setState({
                            checkerData: msgData2,
                            wfEditHierarchyData: {}
                        }, () => {
                            $('#checkerModal').click();
                        });
                    }
                    console.log(msgData2, this.state.checkerData)

                    console.log(msgData, msgData.wfhierarchydata)
                    if (msgData.wfhierarchydata) {
                        var wfHierarchydata = msgData.wfhierarchydata;
                        var matchingActivity2 = workflowDetails.find(activity => activity.activityid === wfHierarchydata.activityid);
                        if (matchingActivity2) {
                            wfHierarchydata.activityname = matchingActivity2.activityname;
                            console.log("Matching activity found and updated wfHierarchydata:", wfHierarchydata);
                        }
                        console.log(wfHierarchydata);
                        this.setState({
                            wfEditHierarchyData: wfHierarchydata,
                            identifyFlag: false
                        }, () => {
                            this.getOfficeHierarchy(wfHierarchydata)
                            $('#checkerModal').click();
                        });
                    }
                } else {

                }
            })
            .catch(err => {
                console.log(err.message)
            })
    }
    getOfficeHierarchy = (wfHierarchydata) => {
        fetch(BASEURL + '/usrmgmt/getofficehierarchy?type=1', {
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
                    console.log(resdata);
                    const updatedwkflowList2 = wfHierarchydata.hierarchy.map((staff) => {
                        const matchingStaffType1 = resdata.msgdata.find((master) => master.level === staff.officelevel);
                        return {
                            ...staff,
                            officetype: matchingStaffType1 ? matchingStaffType1.officetype : ''
                        };
                    });
                    console.log(updatedwkflowList2)
                    this.getStaffhierarchy(updatedwkflowList2)
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
                        this.setState({ resMsg: resdata.message })
                        this.setState({
                            officemasterList: [],
                        }, () => {
                            console.log(resdata.message)
                        });
                    }
                }
            })
            .catch((error) => {
                console.log(error);
                alert("Error: " + error.message);
            });
    }
    getStaffhierarchy = (wfEdHierarchydata) => {
        var url = `/usrmgmt/getofficehierarchy?type=2`;
        this.setState({ showLoader: true })
        fetch(BASEURL + url, {
            method: "GET",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            }
        }).then((response) => {
            console.log("Response:", response);
            return response.json();
        })
            .then((resdata) => {
                console.log(resdata);
                if (resdata.status == "Success" || resdata.status == "SUCCESS") {
                    this.setState({ showLoader: false })
                    const updatedwkflowList = wfEdHierarchydata.map((staff) => {
                        const matchingStaffType1 = resdata.msgdata.find((master) => master.level === staff.stafflevel);
                        return {
                            ...staff,
                            stafftype: matchingStaffType1 ? matchingStaffType1.stafftype : ''
                        };
                    });
                    if (this.state.identifyFlag === true) {
                        this.setState({ createWfActivitiesList: updatedwkflowList })
                    } else {
                        this.setState({ editActivitiesList: updatedwkflowList });
                    }
                    console.log(updatedwkflowList)
                } else {
                    if (resdata.code === '0102') {
                        this.setState({ showLoader: false })
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
                        this.setState({ showLoader: false })
                        this.setState({ resMsg: resdata.message })
                        $("#commonModal").click();
                        this.setState({
                            staffMasterList: [],
                        }, () => {
                            console.log(resdata.message)
                        });
                    }
                }
            })
            .catch(err => {
                console.log(err.message)
            })
    }

    setOperationsStatus = () => {
        var result;
        if (this.state.chckReason === "") {
            result = JSON.stringify({
                referenceno: this.state.checkerRefno,
                status: this.state.checkerStatus,
            })
        } else if (this.state.chckReason !== "") {
            result = JSON.stringify({
                referenceno: this.state.checkerRefno,
                status: this.state.checkerStatus,
                comments: this.state.chckReason,
            })
        }
        console.log(result);
        $(this.list0ref.current).val('');
        $(this.list2ref.current).val('');
        this.setState({
            checkerRefno: '',
            checkerStatus: '',
            chckReason: ''
        })
        fetch(BASEURL + '/usrmgmt/checker/setoperationstatus', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: result
        }).then((Response) => {
            return Response.json();
        })
            .then((resdata) => {
                console.log(resdata);
                if (resdata.status === "Success") {
                    $("#exampleModal123").modal('hide');
                    // this.setState({ showLoader: true })
                    $(this.list0ref.current).val('');
                    $(this.list2ref.current).val('');
                    confirmAlert({
                        message: resdata.message,
                        buttons: [
                            {
                                label: "OK",
                                onClick: () => {
                                    this.getCheckerPendingOpt()
                                    this.setState({
                                        checkerRefno: '',
                                        checkerStatus: '',
                                        chckReason: ''
                                    })
                                },
                            },
                        ],
                    });
                } else {
                    $("#exampleModal123").modal('hide');
                    $(this.list0ref.current).val('');
                    $(this.list2ref.current).val('');
                    confirmAlert({
                        message: resdata.message,
                        buttons: [
                            {
                                label: "OK",
                                onClick: () => {
                                    this.setState({
                                        checkerRefno: '',
                                        checkerStatus: '',
                                        chckReason: ''
                                    })
                                },
                            },
                        ],
                    });
                }
            });
    }
    checkFilter = () => {
        $('#checkFilter').click();
    }
    closeCircle = () => {
        $(this.list0ref.current).val('');
        $(this.list2ref.current).val('');
        this.setState({
            checkerRefno: '',
            checkerStatus: '',
            chckReason: ''
        })
    }
    chckReason = (event) => {
        this.setState({ chckReason: event.target.value })
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
        const { pmType, checkerPendingOptPermissions, operationType } = this.state;
        console.log()
        return (
            <div className="container-dashboard d-flex flex-row" id="wrapper" style={{ marginTop: "-7px", backgroundColor: '#F4F7FC' }}>
                {
                    this.state.showLoader && <Loader />
                }
                {sessionStorage.getItem('userType') === "0" ?
                    <AdminSidebar partnerName={this.state.partnerName} />
                    :
                    sessionStorage.getItem('userType') === "1" ?
                        <SystemUserSidebar /> : ""
                }
                <div className="main-content" id="page-content-wrapper">
                    <div className="container-fluid row pt-2" style={{ marginBottom: "-11px" }}>
                        <div className="col-1" >
                            <button style={{ marginLeft: "25px" }} onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className='col-5' style={{ marginLeft: "20px", marginTop: "5px" }}>
                            <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                {pmType === "platformSysUser" ?
                                    <Link to="/sysUserDashboard">Home</Link> :
                                    pmType === "0" ?
                                        <Link to="/landing">Home</Link> :
                                        <Link to="/landing">Home</Link>
                                } / Pending Operation Lists</p>
                        </div>
                        <div className='col'>

                        </div>
                        <div className='col'>

                        </div>
                        <div className='col-3'>

                        </div>
                        <div className="col">
                            <button style={myStyle}>
                                <Link to="/landing" style={{ marginLeft: "10px" }}><FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} /><span style={{ textDecoration: "none", color: "white" }}>Back</span></Link></button>
                        </div>
                    </div>
                    <hr className="col-11" style={{ marginLeft: "50px", width: "88.6%", backgroundColor: "rgba(4,78,160,1)" }} />
                    <div className='container-fluid row' style={{ paddingLeft: "82px", marginTop: "-20px" }}>
                        <div className='card pt-3 pb-2'>
                            <>
                                <div style={{ cursor: "default", color: "#222C70" }} >
                                    <div className='row'>
                                        <div className='col' style={{ textAlign: "center", fontSize: "16px", fontWeight: "500" }}>
                                            <p>Pending Operation Lists</p>
                                        </div>
                                    </div>
                                    <div className='row mb-2'>
                                        <div className='col-lg-3 col-md-3 col-sm-4 col-6 Fdate' style={{ fontSize: "15px" }}>
                                            <p htmlFor="date" style={{
                                                fontWeight: "600",
                                                fontSize: "13px", marginLeft: "0px", color: "rgba(5,54,82,1)",
                                                marginBottom: "5px",
                                            }}
                                            ><FaFilter />&nbsp;{t('Select Status')}</p>
                                            <select className='form-select' style={{ border: "1px solid rgb(40, 116, 166)", color: "rgb(40, 116, 166)" }}
                                                onChange={this.filterStatus}>
                                                <option defaultValue>Select</option>
                                                <option value="1">Approved</option>
                                                <option value="0">Pending</option>
                                                <option value="2">Rejected</option>
                                            </select>
                                        </div>
                                        <div className="col-lg-2 col-md-3 col-sm-4 col-6 Fdate" style={{ paddingTop: '23px' }}>
                                            <button type="button" className="btn btn-sm text-white" style={{
                                                backgroundColor: "rgb(0, 121, 191)",
                                                paddingTop: "8px", paddingBottom: "8px",
                                                paddingLeft: "47px", paddingRight: "47px"
                                            }}
                                                id=''
                                                onClick={this.getCheckerPendingOpt}>{t('Apply')}</button>
                                        </div>
                                    </div>
                                    {this.state.checkerPendingOpt && (<>
                                        <Table>
                                            <Thead>
                                                <Tr className='pl-4 font-weight-normal' style={{ fontSize: "15px", fontFamily: "'Poppins', sans-serif", color: "rgba(5,54,82,1)", paddingLeft: "6px" }}>
                                                    <Th style={{ fontWeight: "600", textAlign: "start", marginTop: "5px" }}>{t("Maker Name")}</Th>
                                                    <Th style={{ fontWeight: "600", textAlign: "start", marginTop: "5px" }}>{t("Created On")}</Th>
                                                    {/* <Th style={{ fontWeight: "600", textAlign: "start", marginTop: "5px" }}>{t("Assigned To")}</Th> */}
                                                    <Th style={{ fontWeight: "600", textAlign: "start", marginTop: "5px" }}>{t("Operation Type")}</Th>
                                                    {/* <Th style={{ fontWeight: "600", textAlign: "start", marginTop: "5px" }}>{t("Checker Name")}</Th> */}
                                                    <Th style={{ fontWeight: "600", textAlign: "start", marginTop: "5px" }}>{t("Status")}</Th>
                                                </Tr>
                                            </Thead>
                                            <Tbody>
                                                {this.state.checkerPendingOpt && this.state.checkerPendingOpt.map((user, index) => {
                                                    return (
                                                        <Tr key={index}
                                                            style={{
                                                                fontSize: "15px", fontFamily: "'Poppins', sans-serif", color: "rgb(5, 54, 82)",
                                                                transition: 'none', cursor: 'default', backgroundColor: (index % 2 == 0) ? 'rgba(255,255,255,1)' : 'rgba(242,242,242,1)'
                                                            }}>
                                                            <Td style={{ fontWeight: "490", textAlign: "start", paddingTop: "12px" }}> {user.makername}</Td>
                                                            <Td style={{ fontWeight: "490", textAlign: "start", paddingTop: "12px" }}>{user.createdon}</Td>
                                                            {/* <Td style={{ fontWeight: "490", textAlign: "start", paddingTop: "12px" }}>{user.aasignedto}</Td> */}
                                                            <Td style={{ fontWeight: "490", textAlign: "start", paddingTop: "12px" }}>
                                                                {user.operationtype === "1" ? "User Create Role"
                                                                    : user.operationtype === "2" ? "User Update Role"
                                                                        : user.operationtype === "3" ? "Assign Role To User"
                                                                            : user.operationtype === "4" ? "Create Workflow"
                                                                                : user.operationtype === "5" ? "Edit Workflow" : ""
                                                                }
                                                            </Td>
                                                            {/* <Td style={{ fontWeight: "490", textAlign: "start", paddingTop: "12px" }}>{user.checkername ? user.checkername : "-"}</Td> */}
                                                            {user.checkerstatus === "0" && <Td style={{ color: "rgb(199, 188, 34)", textAlign: "start", fontWeight: "490", paddingTop: "12px" }}><img src={a2} style={{ height: "19px" }} />&nbsp;Pending</Td>}
                                                            {user.checkerstatus === "1" && <Td style={{ color: "rgb(29, 143, 63)", textAlign: "start", fontWeight: "490", paddingTop: "12px" }}><img src={a1} style={{ height: "19px" }} />&nbsp;Approved</Td>}
                                                            {user.checkerstatus === "2" && <Td style={{ color: "rgb(219, 101, 37)", textAlign: "start", fontWeight: "490", paddingTop: "12px" }}><FaUserTimes />&nbsp;Rejected</Td>}
                                                            <Td style={{ fontWeight: "490", paddingTop: "12px" }}>
                                                                <span class="btn-group dropleft">
                                                                    <img src={openIt} style={{ height: "35px" }}
                                                                        class="btn dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" />
                                                                    &nbsp;

                                                                    <div class="dropdown-menu" aria-labelledby="dropdownMenuButton" style={{ marginLeft: "-114px" }}>
                                                                        <a class="dropdown-item" onClick={this.checkerPendingDetails.bind(this, user)}>Operation Details</a>
                                                                    </div>
                                                                </span>
                                                            </Td>
                                                        </Tr>
                                                    )
                                                })
                                                }
                                            </Tbody>
                                        </Table>
                                        <div className="row mt-1">
                                            <div className='col'></div>
                                            <div className='col'>
                                                <div className='card border-0'>
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
                                    </>
                                    )
                                    }
                                </div>
                            </>
                        </div>
                    </div>
                    {/* checker Modal */}
                    <button type="button" id="checkerModal" class="btn btn-primary" data-toggle="modal" data-target="#exampleModal123" style={{ display: "none" }}>
                        Fac Evl Modal
                    </button>
                    <div class="modal fade" id="exampleModal123" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" data-backdrop="static">
                        <div class="modal-dialog" role="document">
                            <div class="modal-content">
                                <div class="modal-body">
                                    <div className='row mb-2'>
                                        <div className='col-10'>
                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "600", paddingLeft: "8px" }}><img src={batch} style={{ width: "26px" }} /> &nbsp;Operation Details</p>
                                            <hr style={{ width: "70px", marginTop: "-12px" }} />
                                        </div>
                                        <div className="col-2">
                                            <FaTimesCircle type="button" class="close" data-dismiss="modal" aria-label="Close" style={{ color: "rgb(5, 54, 82)", fontSize: "18px" }} onClick={this.closeCircle} />
                                        </div>
                                    </div>
                                    <div className="mb-2" style={{ border: "1.5px dashed rgb(81,164,219)", borderRadius: "5px", marginTop: "-10px", }}>
                                        <div className="row">
                                            <div className="col" style={{ padding: "5px 35px", fontSize: "14px" }}>
                                                <div className="row">
                                                    <div className='col-sm-3 col-md-3 col-lg-4'>
                                                        <p className="mb-0 font-weight-bold" style={{ color: "#222C70", fontWeight: "450" }}>Maker Name</p>
                                                    </div>
                                                    <div className='col-sm-1 col-md-1 col-lg-1'>
                                                        <p className="mb-0 font-weight-bold" style={{ color: "#222C70" }}>:</p>
                                                    </div>
                                                    <div className='col-sm-6 col-md-6 col-lg-6'>
                                                        <p className="mb-0" style={{ color: "#222C70" }}>{this.state.moreDetails.makername}</p>
                                                    </div>
                                                </div>
                                                {this.state.moreDetails.operationtype &&
                                                    <div className="row">
                                                        <div className='col-sm-3 col-md-3 col-lg-4'>
                                                            <p className="mb-0 font-weight-bold" style={{ color: "#222C70", fontWeight: "450" }}>Operation Type</p>
                                                        </div>
                                                        <div className='col-sm-1 col-md-1 col-lg-1'>
                                                            <p className="mb-0 font-weight-bold" style={{ color: "#222C70" }}>:</p>
                                                        </div>
                                                        <div className='col-sm-6 col-md-6 col-lg-6'>
                                                            <p className="mb-0" style={{ color: "#222C70" }}>
                                                                {this.state.moreDetails.operationtype === "1" ? "User Create Role"
                                                                    : this.state.moreDetails.operationtype === "2" ? "User Update Role"
                                                                        : this.state.moreDetails.operationtype === "3" ? "Assign Role To User"
                                                                            : this.state.moreDetails.operationtype === "4" ? "Create Workflow"
                                                                                : this.state.moreDetails.operationtype === "5" ? "Edit Workflow" : ""
                                                                }</p>
                                                        </div>
                                                    </div>
                                                }
                                                {this.state.moreDetails.checkername &&
                                                    <div className="row">
                                                        <div className='col-sm-3 col-md-3 col-lg-4'>
                                                            <p className="mb-0 font-weight-bold" style={{ color: "#222C70", fontWeight: "450" }}>Checker Name</p>
                                                        </div>
                                                        <div className='col-sm-1 col-md-1 col-lg-1'>
                                                            <p className="mb-0 font-weight-bold" style={{ color: "#222C70" }}>:</p>
                                                        </div>
                                                        <div className='col-sm-6 col-md-6 col-lg-6'>
                                                            <p className="mb-0" style={{ color: "#222C70" }}>{this.state.moreDetails.checkername ? this.state.moreDetails.checkername : "-"}</p>
                                                        </div>
                                                    </div>
                                                }
                                                {this.state.moreDetails.checkedon &&
                                                    <div className="row">
                                                        <div className='col-sm-3 col-md-3 col-lg-4'>
                                                            <p className="mb-0 font-weight-bold" style={{ color: "#222C70", fontWeight: "450" }}>Checked On</p>
                                                        </div>
                                                        <div className='col-sm-1 col-md-1 col-lg-1'>
                                                            <p className="mb-0 font-weight-bold" style={{ color: "#222C70" }}>:</p>
                                                        </div>
                                                        <div className='col-sm-6 col-md-6 col-lg-6'>
                                                            <p className="mb-0" style={{ color: "#222C70" }}>{this.state.moreDetails.checkedon ? this.state.moreDetails.checkedon : "-"}</p>
                                                        </div>
                                                    </div>
                                                }
                                                {this.state.moreDetails.checkercomments &&
                                                    <div className="row">
                                                        <div className='col-sm-3 col-md-3 col-lg-4'>
                                                            <p className="mb-0 font-weight-bold" style={{ color: "#222C70", fontWeight: "450", width: "max-content" }}>Checker Comments</p>
                                                        </div>
                                                        <div className='col-sm-1 col-md-1 col-lg-1'>
                                                            <p className="mb-0 font-weight-bold" style={{ color: "#222C70" }}>:</p>
                                                        </div>
                                                        <div className='col-sm-6 col-md-6 col-lg-6'>
                                                            <p className="mb-0" style={{ color: "#222C70" }}>{this.state.moreDetails.checkercomments ? this.state.moreDetails.checkercomments : "-"}</p>
                                                        </div>
                                                    </div>
                                                }
                                                <div className="row">
                                                    <div className='col-sm-3 col-md-3 col-lg-4'>
                                                        <p className="mb-0 font-weight-bold" style={{ color: "#222C70", fontWeight: "450", width: "max-content" }}>Status</p>
                                                    </div>
                                                    <div className='col-sm-1 col-md-1 col-lg-1'>
                                                        <p className="mb-0 font-weight-bold" style={{ color: "#222C70" }}>:</p>
                                                    </div>
                                                    <div className='col-sm-6 col-md-6 col-lg-6'>
                                                        <p className="mb-0" style={{ color: "#222C70", marginLeft: "10px" }}>
                                                            {this.state.moreDetails.checkerstatus === "0" && <Td style={{ color: "rgb(199, 188, 34)", textAlign: "start", fontWeight: "490" }}><img src={a2} style={{ height: "19px" }} />&nbsp;Pending</Td>}
                                                            {this.state.moreDetails.checkerstatus === "1" && <Td style={{ color: "rgb(29, 143, 63)", textAlign: "start", fontWeight: "490" }}><img src={a1} style={{ height: "19px" }} />&nbsp;Approved</Td>}
                                                            {this.state.moreDetails.checkerstatus === "2" && <Td style={{ color: "rgb(219, 101, 37)", textAlign: "start", fontWeight: "490" }}><FaUserTimes />&nbsp;Rejected</Td>}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <>
                                            {operationType === "1" ? <>
                                                {this.state.checkerData && this.state.checkerData.permissions &&
                                                    <div className="row">
                                                        <div className="col" style={{ padding: "5px 35px", fontSize: "14px" }}>
                                                            <div className="row">
                                                                <div className='col-sm-3 col-md-3 col-lg-4'>
                                                                    <p className="mb-0 font-weight-bold" style={{ color: "#222C70", fontWeight: "450" }}>Role Name</p>
                                                                </div>
                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                    <p className="mb-0 font-weight-bold" style={{ color: "#222C70" }}>:</p>
                                                                </div>
                                                                <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                    <p className="mb-0" style={{ color: "#222C70" }}>{this.state.checkerData.rolename}</p>
                                                                </div>
                                                            </div>
                                                            <div className="row">
                                                                <div className='col-sm-3 col-md-3 col-lg-4'>
                                                                    <p className="mb-0 font-weight-bold" style={{ color: "#222C70", fontWeight: "450" }}>Description</p>
                                                                </div>
                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                    <p className="mb-0 font-weight-bold" style={{ color: "#222C70" }}>:</p>
                                                                </div>
                                                                <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                    <p className="mb-0" style={{ color: "#222C70" }}>{this.state.checkerData.description}</p>
                                                                </div>
                                                            </div>
                                                            <div className="row">
                                                                <div className='col-sm-3 col-md-3 col-lg-4'>
                                                                    <p className="mb-0 font-weight-bold" style={{ color: "#222C70", fontWeight: "450" }}>Client Name</p>
                                                                </div>
                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                    <p className="mb-0 font-weight-bold" style={{ color: "#222C70" }}>:</p>
                                                                </div>
                                                                <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                    <p className="mb-0" style={{ color: "#222C70" }}>{this.state.checkerData.clients}</p>
                                                                </div>
                                                            </div>
                                                            <div className="row">
                                                                <div className='col-sm-3 col-md-3 col-lg-4'>
                                                                    <p className="mb-0 font-weight-bold" style={{ color: "#222C70", fontWeight: "450" }}>Permissions</p>
                                                                </div>
                                                                <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                    <p className="mb-0 font-weight-bold" style={{ color: "#222C70" }}>:</p>
                                                                </div>
                                                                <div className='col-sm-7 col-md-7 col-lg-7'>
                                                                    {this.state.checkerData.permissions.map((permission, index) => (
                                                                        <p key={index} className="mb-0" style={{ color: "#222C70" }}>{permission}<span style={{ color: "green" }}>{`${"(Added)"}`}</span></p>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                }
                                            </>
                                                : operationType === "2" ?
                                                    <>
                                                        {this.state.checkerData && this.state.checkerData.permissions &&
                                                            <div className="row">
                                                                <div className="col" style={{ padding: "5px 35px", fontSize: "14px" }}>
                                                                    <div className="row">
                                                                        <div className='col-sm-3 col-md-3 col-lg-4'>
                                                                            <p className="mb-0 font-weight-bold" style={{ color: "#222C70", fontWeight: "450" }}>Role Name</p>
                                                                        </div>
                                                                        <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                            <p className="mb-0 font-weight-bold" style={{ color: "#222C70" }}>:</p>
                                                                        </div>
                                                                        <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                            <p className="mb-0" style={{ color: "#222C70" }}>{this.state.checkerData.rolename}</p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="row">
                                                                        <div className='col-sm-3 col-md-3 col-lg-4'>
                                                                            <p className="mb-0 font-weight-bold" style={{ color: "#222C70", fontWeight: "450" }}>Description</p>
                                                                        </div>
                                                                        <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                            <p className="mb-0 font-weight-bold" style={{ color: "#222C70" }}>:</p>
                                                                        </div>
                                                                        <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                            <p className="mb-0" style={{ color: "#222C70" }}>{this.state.checkerData.description}</p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="row">
                                                                        <div className='col-sm-3 col-md-3 col-lg-4'>
                                                                            <p className="mb-0 font-weight-bold" style={{ color: "#222C70", fontWeight: "450" }}>Client Name</p>
                                                                        </div>
                                                                        <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                            <p className="mb-0 font-weight-bold" style={{ color: "#222C70" }}>:</p>
                                                                        </div>
                                                                        <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                            <p className="mb-0" style={{ color: "#222C70" }}>{this.state.checkerData.clients}</p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="row">
                                                                        <div className='col-sm-3 col-md-3 col-lg-4'>
                                                                            <p className="mb-0 font-weight-bold" style={{ color: "#222C70", fontWeight: "450" }}>Permissions</p>
                                                                        </div>
                                                                        <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                            <p className="mb-0 font-weight-bold" style={{ color: "#222C70" }}>:</p>
                                                                        </div>
                                                                        <div className='col-sm-7 col-md-7 col-lg-7'>
                                                                            {this.state.checkerData.permissions.map((permission, index) => (
                                                                                <p key={index} className="mb-0" style={{ color: "#222C70" }}>{permission}<span style={{ color: "green" }}>{`${"(Added)"}`}</span></p>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        }
                                                    </>
                                                    : operationType === "3" ?
                                                        <>
                                                            {this.state.checkerData && this.state.checkerData.roles &&
                                                                <div className="row">
                                                                    <div className="col" style={{ padding: "5px 35px", fontSize: "14px" }}>
                                                                        <div className="row">
                                                                            <div className='col-sm-3 col-md-3 col-lg-4'>
                                                                                <p className="mb-0 font-weight-bold" style={{ color: "#222C70", fontWeight: "450" }}>Username</p>
                                                                            </div>
                                                                            <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                                <p className="mb-0 font-weight-bold" style={{ color: "#222C70" }}>:</p>
                                                                            </div>
                                                                            <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                                <p className="mb-0" style={{ color: "#222C70" }}>{this.state.checkerData.username}</p>
                                                                            </div>
                                                                        </div>
                                                                        <div className='row scrollbar' style={{ height: "150px" }}>
                                                                            <div className='col-6'>
                                                                                <p className="mb-0 font-weight-bold" style={{ color: "#222C70", fontWeight: "450" }}>Available Roles</p>
                                                                                {this.state.roleList && this.state.roleList.map((roles, index) => (
                                                                                    <p key={index} className="mb-0" style={{ color: "#222C70" }}>
                                                                                        {roles.roledesc}
                                                                                    </p>
                                                                                ))}
                                                                            </div>
                                                                            <div className='col-6'>
                                                                                <p className="mb-0 font-weight-bold" style={{ color: "#222C70", fontWeight: "450" }}>Assign/ Unassign Roles</p>
                                                                                {this.state.checkerData.roles.map((role, index) => (
                                                                                    <p key={index} className="mb-0" style={{ color: "#222C70" }}>{role.rolename}</p>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            }
                                                        </>
                                                        : operationType === "4" ?
                                                            <>
                                                                {this.state.checkerData && this.state.checkerData.activitylist &&
                                                                    <>
                                                                        <div className="row">
                                                                            <div className="col" style={{ padding: "5px 35px", fontSize: "14px" }}>
                                                                                <div className="row">
                                                                                    <div className='col-sm-3 col-md-3 col-lg-4'>
                                                                                        <p className="mb-0 font-weight-bold" style={{ color: "#222C70", fontWeight: "450" }}>Product ID</p>
                                                                                    </div>
                                                                                    <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                                        <p className="mb-0 font-weight-bold" style={{ color: "#222C70" }}>:</p>
                                                                                    </div>
                                                                                    <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                                        <p className="mb-0" style={{ color: "#222C70" }}>{this.state.checkerData.productid}</p>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="row scrollbar" style={{ height: "150px" }} >
                                                                                    <div className='col-6'>
                                                                                        <p className="mb-0 font-weight-bold" style={{ color: "#222C70", fontWeight: "450" }}>Activities</p>
                                                                                        {this.state.checkerData.activitylist.map((activity, index) => (
                                                                                            <p key={index} className="mb-0" style={{ color: "#222C70" }}>
                                                                                                {activity.activitystatus === "0" ?
                                                                                                    <FaTimesCircle style={{ color: "grey" }} />
                                                                                                    : activity.activitystatus === "1" ?
                                                                                                        <FaCheckCircle style={{ color: "green" }} /> : ""}
                                                                                                &nbsp;
                                                                                                {activity.activityname}</p>
                                                                                        ))}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        {this.state.wfHierarchyData && this.state.wfHierarchyData.hierarchy && this.state.wfHierarchyData.hierarchy.length > 0 &&
                                                                            <>
                                                                                <div className='scrollbar1 mb-2'>
                                                                                    <div style={{
                                                                                        whiteSpace: "nowrap"
                                                                                    }} >
                                                                                        <div className='row font-weight-normal'
                                                                                            style={{
                                                                                                fontWeight: "800",
                                                                                                fontSize: "14px",
                                                                                                color: "rgba(5,54,82,1)",
                                                                                            }}>
                                                                                            <p style={{ fontSize: "14px", color: "rgba(5,54,82,1)", fontWeight: "600", marginLeft: "16px" }}>{t('Activity Name')}: <span style={{ fontWeight: "400" }}>{this.state.wfHierarchyData.activityname + `(Hierarchy)`}</span></p>
                                                                                            <div className='col' style={{ marginTop: "-10px", marginBottom: "10px" }} >
                                                                                                <div className='row font-weight-normal' style={{ fontWeight: "800", fontSize: "14px", color: "rgba(5,54,82,1)" }}>
                                                                                                    <div className='col-4' style={{ textAlign: "" }}>
                                                                                                        <p style={{ fontWeight: "600", marginLeft: "16px" }}>{t('Order No.')}</p>
                                                                                                    </div>
                                                                                                    <div className='col-4' style={{ textAlign: "" }}>
                                                                                                        <p style={{ fontWeight: "600" }}>{t('Office Level')}</p>
                                                                                                    </div>
                                                                                                    <div className='col-4' style={{ textAlign: "" }}>
                                                                                                        <p style={{ fontWeight: "600", marginLeft: "-7px" }}>{t('Staff Level')}</p>
                                                                                                    </div>
                                                                                                </div>
                                                                                                <hr className="col-11" style={{ marginLeft: "40px", width: "88.6%", marginTop: "-10px", marginBottom: "-10px" }} />

                                                                                                {this.state.wfHierarchyData && this.state.wfHierarchyData.hierarchy && this.state.createWfActivitiesList.length > 0 &&
                                                                                                    this.state.createWfActivitiesList.map((activities, index) => {
                                                                                                        return (
                                                                                                            <div className='col card border-0' key={index} style={{ marginBottom: "-11.5px", transition: 'none', overflow: "visible", color: "rgb(5, 54, 82)", cursor: 'default', backgroundColor: (index % 2 == 0) ? 'rgba(255,255,255,1)' : 'rgba(242,242,242,1)' }}>
                                                                                                                <div className="row item-list align-items-center">
                                                                                                                    <div className="col-lg-4 col-md-5 col-sm-8">
                                                                                                                        <p style={{ fontSize: "14px", fontWeight: "490", marginBottom: "5px", marginTop: "5px" }}>{activities.ordernumber}</p>
                                                                                                                    </div >
                                                                                                                    <div className="col-lg-4 col-md-5 col-sm-8">
                                                                                                                        <p style={{ fontSize: "14px", fontWeight: "490", marginBottom: "5px", marginTop: "5px", marginLeft: "-4px" }}>{activities.officetype}</p>
                                                                                                                    </div>
                                                                                                                    <div className="col-lg-4 col-md-5 col-sm-8">
                                                                                                                        <p style={{ fontSize: "14px", fontWeight: "490", marginBottom: "5px", marginTop: "5px", wordWrap: "" }}>{activities.stafftype}</p>
                                                                                                                    </div>
                                                                                                                </div >
                                                                                                            </div>
                                                                                                        )
                                                                                                    })
                                                                                                }
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </>
                                                                        }
                                                                    </>
                                                                }
                                                            </>
                                                            : operationType === "5" ?
                                                                <>
                                                                    {this.state.checkerData && this.state.checkerData.activitylist &&
                                                                        <>
                                                                            <div className="row">
                                                                                <div className="col" style={{ padding: "5px 35px", fontSize: "14px" }}>
                                                                                    <div className="row">
                                                                                        <div className='col-sm-3 col-md-3 col-lg-4'>
                                                                                            <p className="mb-0 font-weight-bold" style={{ color: "#222C70", fontWeight: "450" }}>Workflow ID</p>
                                                                                        </div>
                                                                                        <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                                            <p className="mb-0 font-weight-bold" style={{ color: "#222C70" }}>:</p>
                                                                                        </div>
                                                                                        <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                                            <p className="mb-0" style={{ color: "#222C70" }}>{this.state.checkerData.workflowid}</p>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="row">
                                                                                        <div className='col-sm-3 col-md-3 col-lg-4'>
                                                                                            <p className="mb-0 font-weight-bold" style={{ color: "#222C70", fontWeight: "450" }}>Comments</p>
                                                                                        </div>
                                                                                        <div className='col-sm-1 col-md-1 col-lg-1'>
                                                                                            <p className="mb-0 font-weight-bold" style={{ color: "#222C70" }}>:</p>
                                                                                        </div>
                                                                                        <div className='col-sm-6 col-md-6 col-lg-6'>
                                                                                            <p className="mb-0" style={{ color: "#222C70" }}>{this.state.checkerData.comments}</p>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className='row scrollbar' style={{ height: "150px" }}>
                                                                                        <div className='col-6'>
                                                                                            <p className="mb-0 font-weight-bold" style={{ color: "#222C70", fontWeight: "450" }}>Exisiting Activities</p>
                                                                                            {this.state.workflowDetailList && this.state.workflowDetailList.map((activity, index) => (
                                                                                                <p key={index} className="mb-0" style={{ color: "#222C70" }}>
                                                                                                    {activity.status === "0" ?
                                                                                                        <FaTimesCircle style={{ color: "grey" }} />
                                                                                                        : activity.status === "1" ?
                                                                                                            <FaCheckCircle style={{ color: "green" }} /> : ""}
                                                                                                    &nbsp;{activity.activity}
                                                                                                </p>
                                                                                            ))}
                                                                                        </div>
                                                                                        <div className='col-6'>
                                                                                            <p className="mb-0 font-weight-bold" style={{ color: "#222C70", fontWeight: "450" }}>Updated Activities</p>
                                                                                            {this.state.checkerData && this.state.checkerData.activitylist.map((activity, index) => (
                                                                                                <p key={index} className="mb-0" style={{ color: "#222C70" }}>
                                                                                                    {activity.activitystatus === "0" ?
                                                                                                        <FaTimesCircle style={{ color: "grey" }} />
                                                                                                        : activity.activitystatus === "1" ?
                                                                                                            <FaCheckCircle style={{ color: "green" }} /> : ""}
                                                                                                    &nbsp;{activity.activityname}
                                                                                                </p>
                                                                                            ))}
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            {this.state.wfEditHierarchyData && this.state.wfEditHierarchyData.hierarchy && this.state.wfEditHierarchyData.hierarchy.length > 0 &&
                                                                                <>
                                                                                    <div className='scrollbar1 mb-2'>
                                                                                        <div style={{
                                                                                            whiteSpace: "nowrap"
                                                                                        }} >
                                                                                            <div className='row font-weight-normal'
                                                                                                style={{
                                                                                                    fontWeight: "800",
                                                                                                    fontSize: "14px",
                                                                                                    color: "rgba(5,54,82,1)",
                                                                                                }}>
                                                                                                <p style={{ fontSize: "14px", color: "rgba(5,54,82,1)", fontWeight: "600", marginLeft: "16px" }}>{t('Activity Name')}: <span style={{ fontWeight: "400" }}>{this.state.wfEditHierarchyData.activityname + `(Hierarchy)`}</span></p>
                                                                                                <div className='col' style={{ marginTop: "-10px", marginBottom: "10px" }} >
                                                                                                    <div className='row font-weight-normal' style={{ fontWeight: "800", fontSize: "14px", color: "rgba(5,54,82,1)" }}>
                                                                                                        <div className='col-4' style={{ textAlign: "" }}>
                                                                                                            <p style={{ fontWeight: "600", marginLeft: "16px" }}>{t('Order No.')}</p>
                                                                                                        </div>
                                                                                                        <div className='col-4' style={{ textAlign: "" }}>
                                                                                                            <p style={{ fontWeight: "600" }}>{t('Office Level')}</p>
                                                                                                        </div>
                                                                                                        <div className='col-4' style={{ textAlign: "" }}>
                                                                                                            <p style={{ fontWeight: "600", marginLeft: "-7px" }}>{t('Staff Level')}</p>
                                                                                                        </div>
                                                                                                    </div>
                                                                                                    <hr className="col-11" style={{ marginLeft: "40px", width: "88.6%", marginTop: "-10px", marginBottom: "-10px" }} />

                                                                                                    {this.state.wfEditHierarchyData && this.state.wfEditHierarchyData.hierarchy && this.state.editActivitiesList.length > 0 &&
                                                                                                        this.state.editActivitiesList.map((activities, index) => {
                                                                                                            return (
                                                                                                                <div className='col card border-0' key={index} style={{ marginBottom: "-11.5px", transition: 'none', overflow: "visible", color: "rgb(5, 54, 82)", cursor: 'default', backgroundColor: (index % 2 == 0) ? 'rgba(255,255,255,1)' : 'rgba(242,242,242,1)' }}>
                                                                                                                    <div className="row item-list align-items-center">
                                                                                                                        <div className="col-lg-4 col-md-5 col-sm-8">
                                                                                                                            <p style={{ fontSize: "14px", fontWeight: "490", marginBottom: "5px", marginTop: "5px" }}>{activities.ordernumber}</p>
                                                                                                                        </div >
                                                                                                                        <div className="col-lg-4 col-md-5 col-sm-8">
                                                                                                                            <p style={{ fontSize: "14px", fontWeight: "490", marginBottom: "5px", marginTop: "5px", marginLeft: "-4px" }}>{activities.officetype}</p>
                                                                                                                        </div>
                                                                                                                        <div className="col-lg-4 col-md-5 col-sm-8">
                                                                                                                            <p style={{ fontSize: "14px", fontWeight: "490", marginBottom: "5px", marginTop: "5px", wordWrap: "" }}>{activities.stafftype}</p>
                                                                                                                        </div>
                                                                                                                    </div >
                                                                                                                </div>
                                                                                                            )
                                                                                                        })
                                                                                                    }
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </>
                                                                            }
                                                                        </>
                                                                    }
                                                                </>
                                                                : ""
                                            }

                                        </>
                                    </div>
                                    {/* Accordion Design */}
                                    {this.state.moreDetails.checkerstatus === "0" || this.state.moreDetails.checkerstatus === "2" ?
                                        <div class="accordion accordion-flush" id="accordionFlushExample">
                                            <div className="row mb-2">
                                                <div className="col">
                                                    <div class="accordion-item" style={{ border: "1.5px solid rgb(199, 171, 16)", borderRadius: "5px" }}>
                                                        <div class="accordion-header" id="flush-headingchk1">
                                                            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" style={{ color: "rgb(199, 171, 16)" }}
                                                                data-bs-target="#flush-collapsechk1" aria-expanded="false" aria-controls="flush-collapsechk1">
                                                                Update Status
                                                            </button>
                                                        </div>
                                                        <div id="flush-collapsechk1" class="accordion-collapse collapse" aria-labelledby="flush-headingchk1" data-bs-parent="#accordionFlushExample">
                                                            <div class="accordion-body">
                                                                <div className="form-row">
                                                                    <div className="form-group col-6" style={{ fontSize: "14px" }}>
                                                                        <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Status *')}</p>
                                                                        <select className='form-select' ref={this.list0ref} onChange={this.checkerStatus} style={{ backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}>
                                                                            <option defaultChecked>Select</option>
                                                                            <option value="1">Approve</option>
                                                                            <option value="2">Reject</option>
                                                                        </select>
                                                                    </div>
                                                                    <div className="form-group col-6" style={{ fontSize: "14px" }}>
                                                                        <p htmlFor="Name" style={{ color: "#222C70", fontFamily: "Poppins,sans-serif", fontWeight: "bold" }}>{t('Comments *')}</p>
                                                                        <textarea type="text" ref={this.list2ref} style={{ backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }} className="form-control" onChange={this.chckReason}
                                                                            placeholder="Enter Comments" rows={3} cols={30} maxLength={255}>
                                                                        </textarea>
                                                                    </div>
                                                                </div>

                                                                <>
                                                                    <div className="form-row">
                                                                        <div className="col" style={{ textAlign: "end" }}>
                                                                            <button type="button"
                                                                                className="btn btn-sm text-white"
                                                                                onClick={this.setOperationsStatus}
                                                                                style={{
                                                                                    backgroundColor: "rgb(199, 171, 16)",
                                                                                    paddingLeft: "10px", paddingRight: "10px"
                                                                                }}
                                                                            >Submit</button>
                                                                        </div>
                                                                    </div>
                                                                </>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                        : ""}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        )
    }
}
export default withTranslation()(CheckerpendingOpt)