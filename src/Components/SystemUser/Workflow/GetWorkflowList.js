import React, { Component } from 'react';
import $ from 'jquery';
import { BASEURL } from '../../assets/baseURL';
import SystemUserSidebar from '../SystemUserSidebar';
import { withTranslation } from 'react-i18next';
import { FaPlus } from "react-icons/fa";
import { FaAngleLeft, FaEdit, FaRegEdit, FaRegTrashAlt, FaRegSave } from "react-icons/fa";
import dashboardIcon from '../../assets/icon_dashboard.png';
import { Link } from 'react-router-dom';
import Multiselect from 'multiselect-react-dropdown';
import '../ProductConfig/ProductDefinition/ProductDefinition.css';
import openIt from '../../assets/AdminImg/openit.png'
import us from '../../assets/AdminImg/pro.png';
import editRole from '../../assets/editRole.png';
import ReactPaginate from 'react-paginate';
import '../../Borrower/Pagination.css';
import { confirmAlert } from "react-confirm-alert";
import pic3 from '../../assets/AdminImg/picture.png';
import sysUser from '../../assets/All.png';
import * as FaIcons from "react-icons/fa"
import Tooltip from "@material-ui/core/Tooltip";
// import './GetWorkflow.css';

var dataList = [];
var jsonForm;
var matchingList = [];
var secondArray = [];
var activitylist1 = [];
var enableDisableFlag = "";
let postactivityid2;
let enableStatusFlag;
export class GetWorkflowList extends Component {

    constructor(props) {
        super(props)

        this.state = {
            workflowMasterList: [],
            workflowDetailList: [],

            workflowLists: [],
            productid: "",
            prodName: "",
            prodActive: "",
            productStatus: "",

            offset: 0,
            perPage: 5,
            currentPage: 0,
            pageCount: "",

            workflowId: "",
            wkFID: "",
            produList: [],
            encryptData: "",
            editWkflowMsg: "",
            editedencryptData: "",
            editProdList: [],

            editWkflwActFlag: "0",

            wfReadPerms: [],
            wfUpdPerms: [],
            approverHierarchyList: [],
            activityid: '',
            activityDetails: true,
            open: true,
            editFlag: false,
            officeHieCalled: false,
            officeHieList: [],
            staffList: [],
            officeid: '',
            officelevel: '',
            stafflevel: '',
            actid: '',
            actname: '',
            activityStatus: '',
            hierarchy: [],
            order: '',
            newHierarchy: {},
            officeType: '',
            officeName: [],
            staffName: [],
            staffType: '',
            postData: [],
            referenceno: '',
            orderList: [
                "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"
            ],
            finalpostData: [],
            postactivityid: "",
            postactivityid2: "",
            updatedHierarchy: [],
            addApproverFlag: false,
            activitystatus1: "",
            setWFApproverFlag: false,
            maxApproverLevel: "",
            maxOfficeLevel: "",
            maxStaffLevel: ""

        }
        this.hierarchyRowRef = React.createRef();
        this.list0ref = React.createRef();
        this.list1ref = React.createRef();
        this.list2ref = React.createRef();
    }
    componentDidMount() {
        this.getWorkflowLists();
        // this.getApproverHierarchy();
        this.getOffHier()

        sessionStorage.getItem("rolePermData");
        var rolePermsData = sessionStorage.getItem("rolePermData");
        var parseRolePerms = JSON.parse(rolePermsData);
        console.log(parseRolePerms)

        if (parseRolePerms) {
            console.log(parseRolePerms)
            var permArray = [];
            parseRolePerms.forEach(element => {
                if (element.rolename === "WF_READ_INFO") {
                    console.log(element.permissions)
                    this.setState({ wfReadPerms: element.permissions })

                }
                if (element.rolename === "WF_UPDATE_INFO_MAKER") {
                    console.log(element.permissions)
                    this.setState({ wfUpdPerms: element.permissions })
                }

            })
        }
    }

    getWorkflowLists = () => {
        fetch(BASEURL + "/lms/getworkflowlist", {
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
                if (resdata.status.toLowerCase() === ('success')) {
                    // this.setState({ workflowMasterList: resdata.msgdata });
                    // console.log(this.state.workflowMasterList);

                    var workflowMasterList = resdata.msgdata;
                    console.log(workflowMasterList)
                    const workflowDetails = workflowMasterList.map((profile) => {
                        profile.workflowlist.map((sublists, subindex) => {
                            if (sublists.productid) {
                                sublists.checked = true;
                            }
                            else {
                                sublists.checked = false;
                            }
                            return sublists;
                        })
                        return profile;
                    })
                    this.setState({ workflowMasterList: workflowDetails })
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
    moreDetails = (workflowid, workflowname) => {
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
                    // this.setState({ workflowDetailList: resdata.msgdata.workflowdetails });
                    // console.log(this.state.workflowDetailList);
                    var workflowDetailList = resdata.msgdata.workflowdetails;
                    this.setState({
                        wkFID: resdata.msgdata.workflowid,
                        wkFName: workflowname
                    });
                    console.log(workflowDetailList);
                    workflowDetailList.forEach(element => {
                        if (element.activityid === "LN111") {
                            this.setState({
                                activityid: element.activityid,
                                activitystatus1: element.status

                            })
                        }
                    })

                    const workflowDetails = workflowDetailList.map((profile) => {
                        profile.disabled = true;
                        if (profile.status == 1) {
                            profile.checked = true;
                        }
                        else {
                            profile.checked = false;
                        }
                        return profile;
                    })
                    this.setState({ workflowDetailList: workflowDetails })
                    enableDisableFlag = "0";
                    this.setState({ activityDetails: true }, () => {
                        $("#moreDetailsModal").click();
                        // document.getElementById('activityDetailscontent').style.display = 'block';
                        // document.getElementById('approverHierContent').style.display = 'hide';
                    })

                    $(".consentforEdit").prop('disabled', true)

                } else {

                }
            })
            .catch(err => {
                console.log(err.message)
            })
    }
    checkActivityStatus = (event, index, activityid) => {
        console.log(event.target.value);
        const options = this.state.workflowDetailList;
        options[index].checked = event.target.checked;
        this.setState({ workflowDetailList: options });

        matchingList = this.state.workflowDetailList.filter((attribute) => attribute.activityid === activityid).map((pdt, index) => {
            secondArray.push(pdt);
            console.log(secondArray);
            console.log(pdt);
            console.log(pdt.activityid, pdt.status);
            console.log(pdt.checked);

            if (pdt.activityid === 'LN111') {
                if (pdt.checked) {
                    enableStatusFlag = true;
                    postactivityid2 = pdt.activityid;
                }
            }
            console.log(enableStatusFlag)
            if (enableStatusFlag) {
                this.setState({ postactivityid2 }, () => {
                    console.log(this.state.postactivityid2);
                });
                console.log(enableStatusFlag);
            } else {
                this.setState({ postactivityid2: null });
            }

        });




        $(".consentforEdit").prop('disabled', false)
    }
    consentForEdit = () => {
        $(".bd-example-modal-lg").modal("hide");
        $("#consentEditWorkflowModal").click();
        $(".editWorkflowAct").prop('disabled', true);
    }
    editWorflowActivity = () => {
        console.log(secondArray);
        if (secondArray.length == 0) {
            activitylist1 = [{
                activityid: this.state.postactivityid,
                activitystatus: this.state.activitystatus1
            }]

        }
        else {
            activitylist1 = secondArray.map((attribute, index) => {
                return {
                    activityid: attribute.activityid,
                    activitystatus: attribute.checked ? "1" : "0"
                }
            }).filter((obj) => obj.activitystatus !== "")
        }
        fetch(BASEURL + '/lms/editworkflowactivity', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                workflowid: this.state.wkFID,
                comments: this.state.editComment,
                activitylist: activitylist1
            })

        }).then((Response) => {
            console.log(Response);
            return Response.json();
        })
            .then((resdata) => {
                if (resdata.status.toLowerCase() === ('success')) {
                    console.log(resdata);
                    $("#exampleModalCenter91").modal("hide");
                    //get referenceno
                    console.log(resdata.msgdata.referenceno)
                    console.log(resdata.msgdata.workflowid)
                    this.setState({
                        referenceno: resdata.msgdata.referenceno
                    })
                    confirmAlert({
                        message: resdata.message,
                        buttons: [
                            {
                                label: "Okay",
                                onClick: () => {
                                    if (this.state.setWFApproverFlag) {
                                        this.setWorkFlowHier()
                                    }

                                    this.setState({ editWkflwActFlag: "0" })
                                },
                            },
                        ],
                        closeOnClickOutside: false,
                    });
                }
                else {
                    $("#exampleModalCenter91").modal("hide");
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

    editComments = (e) => {
        this.setState({ editComment: e.target.value })
        $(".editWorkflowAct").prop('disabled', false);
    }
    cancelsubmitWorkflow = () => {
        this.setState({ editWkflwActFlag: "0" })
    }
    submitEditWorkflow = () => {
        fetch(BASEURL + '/lms/editworkflowactivity', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                encrypteddata: this.state.editedencryptData
            })
        }).then((Response) => {
            console.log(Response);
            return Response.json();
        })
            .then((resdata) => {
                if (resdata.status.toLowerCase() === ('success')) {
                    console.log(resdata);
                    //$(".bd-example-modal-lg").modal("hide");
                    $("#exampleModalCenter91").modal("hide");
                    //get reference
                    console.log(resdata.msgdata.referenceno)
                    this.setState({
                        referenceno: resdata.msgdata.referenceno
                    })
                    confirmAlert({
                        message: resdata.message,
                        buttons: [
                            {
                                label: "Okay",
                                onClick: () => {

                                    this.setState({ editWkflwActFlag: "0" })
                                },
                            },
                        ],
                        closeOnClickOutside: false,
                    });

                }
                else {
                    alert(resdata.message);
                }
            }).catch((error) => {
                console.log(error)
            })
    }

    assignWorkflow = () => {
        //console.log(workflowid);
        this.getLoanProductlist(this.state.wkFID)
    }
    getLoanProductlist = () => {
        fetch(BASEURL + "/lsp/getloanproductlist", {
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
                if (resdata.status.toLowerCase() === ('success')) {
                    this.setState({ produList: resdata.msgdata });
                    $(".bd-example-modal-lg").modal('hide');
                    $("#assignWorkflowModal").click();
                } else {

                }
            })
            .catch(err => {
                console.log(err.message)
            })
    }
    workFlowId = (e) => {
        console.log(e.target.value)
        this.setState({ wkFID: e.target.value }, () => {
            console.log(this.state.wkFID);
            // this.setState({wkFID:e.target.value})
        });

    }
    assignProdID = (e) => {
        this.setState({ assignProdID: e.target.value });
    }
    submitAssignWkflow = () => {
        console.log(this.state.wkFID)
        fetch(BASEURL + '/lms/assignworkflow', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                productid: this.state.assignProdID,
                workflowid: this.state.wkFID
            })
        }).then((Response) => {
            console.log(Response);
            return Response.json();
        })
            .then((resdata) => {
                if (resdata.status.toLowerCase() === ('success')) {
                    console.log(resdata);
                    $("#exampleModalCenter").modal('hide');
                    if (resdata.message.includes("Do you want to reassign?")) {
                        var encryData = resdata.msgdata.encrypteddata;
                        console.log(encryData);
                        this.setState({ encryptData: encryData })
                        $("#exampleModalCenter").modal('hide');
                        confirmAlert({
                            message: resdata.message,
                            buttons: [
                                {
                                    label: "Okay",
                                    onClick: () => {
                                        this.submitReAssignWkflow()
                                    },
                                },
                            ],
                        });
                    } else {
                        alert(resdata.message);
                        // this.setState({ wkFID: '',assignProdID:'' })
                    }
                }
                else {
                    alert(resdata.message)
                }
            }).catch((error) => {
                console.log(error)
            })
    }
    submitReAssignWkflow = () => {
        fetch(BASEURL + '/lms/assignworkflow', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                encrypteddata: this.state.encryptData
            })
        }).then((Response) => {
            console.log(Response);
            return Response.json();
        })
            .then((resdata) => {
                if (resdata.status.toLowerCase() === ('success')) {
                    console.log(resdata);
                    $("#exampleModalCenter21").modal('hide');
                    confirmAlert({
                        message: resdata.message,
                        buttons: [
                            {
                                label: "Okay",
                                onClick: () => {
                                    this.getWorkflowLists();
                                },
                            },
                        ],
                    });
                    // this.setState({ wkFID: '',assignProdID:'' })
                }
                else {
                    alert(resdata.message)
                }
            }).catch((error) => {
                console.log(error)
            })
    }
    enableWkflwEdit = () => {
        if (enableDisableFlag == "0") {
            var workflowDetails = this.state.workflowDetailList.map((profile) => {
                profile.disabled = false;
                if (profile.status == 1) {
                    profile.checked = true;
                }
                else {
                    profile.checked = false;
                }
                return profile;
            })
            this.setState({ workflowDetailList: workflowDetails });
            enableDisableFlag = "1";
        } else if (enableDisableFlag == "1") {
            var workflowDetails = this.state.workflowDetailList.map((profile) => {
                profile.disabled = true;
                if (profile.status == 1) {
                    profile.checked = true;
                }
                else {
                    profile.checked = false;
                }
                return profile;
            })
            this.setState({ workflowDetailList: workflowDetails });
            enableDisableFlag = "0";
        }

    }
    getApproverHierarchy = () => {
        this.setState({ activityDetails: false });

        const workflowDetailList = this.state.workflowDetailList;
        let shouldCallApi = false;

        // Check the condition
        for (let i = 0; i < workflowDetailList.length; i++) {
            const workflow = workflowDetailList[i];
            if (workflow.status === "1" && workflow.activityid === "LN111") {
                shouldCallApi = true;
                break;
            }
        }

        // Call the API only if the condition is met
        if (shouldCallApi) {
            fetch(BASEURL + '/lms/getwfapproverhierarchy', {
                method: 'POST',
                headers: {
                    'Authorization': "Bearer " + sessionStorage.getItem('token'),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    activityid: this.state.activityid,
                    workflowid: this.state.wkFID
                })
            })
                .then(response => response.json())
                .then(resdata => {
                    if (resdata.status === 'Success' || resdata.status === 'SUCCESS') {
                        console.log('Approver Hierarchy Response:', resdata);
                        const maxOfficeLevel = Math.max(...resdata.msgdata.hierarchy.map(item => item.officelevel));
                        const maxStaffLevel = Math.max(...resdata.msgdata.hierarchy.map(item => item.stafflevel));
                        console.log('Max Office Level:', maxOfficeLevel);
                        console.log('Max Staff Level:', maxStaffLevel);
                        this.setState({
                            approverHierarchyList: resdata.msgdata.hierarchy,
                            postactivityid: resdata.msgdata.activityid,
                            maxOfficeLevel: maxOfficeLevel,
                            maxStaffLevel: maxStaffLevel
                        }, () => {
                            console.log('Post Activity ID:', resdata.msgdata.activityid);
                            console.log('Max Office Level in State:', this.state.maxOfficeLevel);
                            console.log('Max Staff Level in State:', this.state.maxStaffLevel);
                        });
                    } else {
                        alert("Issue: " + resdata.message);
                    }
                })
                .catch(error => {
                    console.log(error);
                    alert("Error: " + error.message);
                });
        }
    }


    backToActivityDetails = () => {
        this.setState({ activityDetails: true })
        // setTimeout(() => {
        //         this.setState({ activityDetails: true });
        //     }, 1000);
        // this.setState((prevState) => ({
        //     open: !prevState.open,
        //   }), () => {
        //     setTimeout(() => {
        //       this.setState((prevState) => ({
        //         activityDetails: !prevState.activityDetails,
        //       }), () => {
        //         this.setState({
        //           open: true,
        //         });
        //       });
        //     },600 ); // Duration of collapse animation
        //   });
    }
    editApproverHierarchy = () => {
        this.setState({
            // editFlag: true,
            addApproverFlag: true
        })
        // document.getElementById('addApprover').style.display = 'block';
    }
    delHierLevel = (index) => {
        console.log(index);
        console.log("inside delete");

        // Filter out the item at the specified index
        const newList = this.state.approverHierarchyList.filter((item, i) => i !== index);

        // Update the ordernumber for each item in the new list
        const updatedList = newList.map((item, i) => {
            return { ...item, ordernumber: i + 1 };
        });

        // Calculate the max office and staff levels
        const maxOfficeLevel = Math.max(...updatedList.map(item => item.officelevel));
        const maxStaffLevel = Math.max(...updatedList.map(item => item.stafflevel));

        // Set the state with the updated list and max levels
        this.setState({
            approverHierarchyList: updatedList,
            maxOfficeLevel: maxOfficeLevel,
            maxStaffLevel: maxStaffLevel
        }, () => {
            console.log(this.state.approverHierarchyList);
            console.log(`Max Office Level: ${this.state.maxOfficeLevel}`);
            console.log(`Max Staff Level: ${this.state.maxStaffLevel}`);
        });
    }


    orderlist = (e) => {
        const ordervalue = e.target.value;
        this.setState({ order: ordervalue }, () => {
            console.log(ordervalue)
        })

        document.getElementById('list1').style.display = 'block';
    }
    OffHier1 = () => {
        if (!this.state.officeHieCalled) {
            this.getOffHier()
                .then(responseData => {
                    console.log("Response data:", responseData);
                    this.setState({
                        officeHieList: responseData,
                        officeHieCalled: true
                    });
                })
                .catch(error => {
                    console.error("Error:", error);
                });
        }
    }
    getOffHier = () => {
        return new Promise((resolve, reject) => {
            fetch(BASEURL + '/usrmgmt/getofficehierarchy?type=1', {
                method: 'GET',
                headers: {
                    'Authorization': "Bearer " + sessionStorage.getItem('token'),
                    'Content-Type': 'application/json'
                },
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then((resdata) => {
                    if (resdata.status === 'Success') {
                        resolve(resdata.msgdata);
                    } else {
                        reject(new Error("Issue: " + resdata.message));
                    }
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    officehie = (e) => {
        // const officeLevel = e.target.value;
        document.getElementById('list2').style.display = 'block';
        const selectedValue = e.target.value;
        const [officeLevel, officeType] = selectedValue.split(',');

        this.setState(prevState => ({
            officeName: [...prevState.officeName, officeType],
            officeType: officeType,
        }), () => {
            console.log("Updated officeNames:", this.state.officeName);
        });
        // Update the selected office level in the state
        this.getStaffList(officeLevel)
    }
    getStaffList = (officeLevel) => {
        console.log(officeLevel)
        const body = JSON.stringify({
            officelevel: officeLevel,
        });

        fetch(BASEURL + '/usrmgmt/getstaffhierarchy', {
            method: 'POST',
            headers: {
                'Authorization': "Bearer " + sessionStorage.getItem('token'),
                'Content-Type': 'application/json'
            },
            body: body
        })
            .then((response) => {
                return response.json();
            })
            .then((resdata) => {
                if (resdata.status === 'Success') {
                    console.log(resdata);
                    this.setState({ staffList: resdata.msgdata });
                } else {
                    alert("Issue: " + resdata.message);
                }
            })
            .catch((error) => {
                console.log(error);
                alert("Error: " + error.message);
            });
    }
    staffList1 = (e) => {
        const selectedValue = e.target.value;
        const [staffLevel, staffType] = selectedValue.split(',');
        // const staffLevel = e.target.value;
        const { officeid, officelevel } = this.state.staffList;

        var array = this.state.officeName;
        if (this.state.officeName.length > 1) {
            array = this.state.officeName.slice(-1);
            console.log(array);
        }
        const newHier = {
            officelevel: officelevel,
            stafflevel: staffLevel,
            ordernumber: this.state.order.toString(),
            stafftype: staffType,
            officetype: array,
            // staffNames: this.state.staffName
        };
        console.log(newHier)
        const postingData = {
            officelevel: officelevel,
            stafflevel: staffLevel,
            ordernumber: this.state.order.toString(),
        };
        this.setState({
            // order: order,
            newHierarchy: newHier,
            postData: [...this.state.postData, postingData],

        }, () => {
            console.log(this.state.newHierarchy)
        });
        document.getElementById('addApprover').style.display = 'none';
        document.getElementById('saveButton1').style.display = 'block';

    }

    saveHierarchy = () => {
        console.log("saveHierarchy called");
        this.setState({
            activityDetails: false,
            // editFlag: false
        });
        this.saveHier2()
    };

    saveHier2 = () => {
        const newHier = this.state.newHierarchy;
        const { ordernumber, officetype, stafftype, stafflevel, officelevel } = newHier;
        const newApprover = { ordernumber, officetype, stafftype, stafflevel, officelevel };

        console.log('Post Data:', this.state.postData);
        console.log('New Hierarchy:', newHier);
        console.log('New Approver:', newApprover);

        let existingItemFound = false;

        this.setState(prevState => {
            let updatedApproverHierarchyList = [...prevState.approverHierarchyList];

            // Check if an item with the same stafflevel and officelevel already exists
            existingItemFound = updatedApproverHierarchyList.some((item, index) => {
                const isStafflevelEqual = item.stafflevel === stafflevel;
                const isOfficelevelEqual = item.officelevel === officelevel;

                console.log(`Iteration ${index}`);
                console.log(`Comparing with new item: ordernumber: ${ordernumber}, stafflevel: ${stafflevel}, officelevel: ${officelevel}`);
                console.log(`Existing item: ordernumber: ${item.ordernumber}, stafflevel: ${item.stafflevel}, officelevel: ${item.officelevel}`);
                console.log(`isStafflevelEqual: ${isStafflevelEqual}`);
                console.log(`isOfficelevelEqual: ${isOfficelevelEqual}`);

                if (isStafflevelEqual && isOfficelevelEqual) {
                    console.log(`Existing item found at index: ${index}`);
                    return true; // Exit iteration early
                }
                return false;
            });

            if (existingItemFound) {
                return null; // Exit setState early
            }

            // Find the correct position to insert the new item to maintain order
            let insertIndex = updatedApproverHierarchyList.findIndex(item => {
                if (item.officelevel > officelevel) {
                    return true;
                } else if (item.officelevel === officelevel && item.stafflevel > stafflevel) {
                    return true;
                }
                return false;
            });

            if (insertIndex === -1) {
                // If no valid insert position is found, add to the end
                updatedApproverHierarchyList.push(newApprover);
            } else {
                // Insert the new item at the correct position
                updatedApproverHierarchyList.splice(insertIndex, 0, newApprover);
            }

            // Reorder the list based on ordernumber to maintain uniqueness and order
            for (let i = 0; i < updatedApproverHierarchyList.length; i++) {
                updatedApproverHierarchyList[i].ordernumber = i + 1;
            }

            // Recalculate maxOfficeLevel and maxStaffLevel
            const maxOfficeLevel = Math.max(...updatedApproverHierarchyList.map(item => item.officelevel));
            const maxStaffLevel = Math.max(...updatedApproverHierarchyList.map(item => item.stafflevel));

            return {
                approverHierarchyList: updatedApproverHierarchyList,
                maxOfficeLevel: maxOfficeLevel,
                maxStaffLevel: maxStaffLevel
            };
        }, () => {
            if (existingItemFound) {
                console.log("Hierarchy already exists for this ordernumber with the same stafflevel and officelevel.");
                alert("The hierarchy you are trying to add already exists.");
                console.log(this.state.approverHierarchyList);
            } else {
                console.log('Updated Approver Hierarchy List:', this.state.approverHierarchyList);

                this.setState(prevState => ({
                    hierarchy: [...prevState.hierarchy, newHier]
                }), () => {
                    console.log('Hierarchy:', this.state.hierarchy);
                });
            }
        });

        // Update UI elements after processing
        document.getElementById('addApprover').style.display = 'block';
        document.getElementById('saveButton1').style.display = 'none';
        document.getElementById('hierarchyRow').style.display = 'none';
        document.getElementById('list1').style.display = 'none';

        console.log('Edit Flag:', this.state.editFlag);
    };


    AddhierRow = () => {
        $(this.list0ref.current).val('');
        $(this.list1ref.current).val('');
        $(this.list2ref.current).val('');
        document.getElementById('addApprover').style.display = 'none';
        document.getElementById('hierarchyRow').style.display = 'block';
        document.getElementById('list1').style.display = 'block';
        document.getElementById('list2').style.display = 'none';
        console.log(this.state.editFlag);
    }
    submitHier = () => {
        this.setState({
            activityDetails: true,
            // editFlag: false,
            addApproverFlag: false,
            setWFApproverFlag: true
        }, () => {
            console.log(this.state.addApproverFlag)
        })
        console.log(typeof (this.state.postData))
        const finalPostData = this.state.approverHierarchyList.map(({ officelevel, stafflevel, ordernumber }) => ({
            officelevel,
            stafflevel,
            ordernumber: String(ordernumber)
        }));
        console.log(finalPostData)
        this.setState(prevState => ({
            finalPostData: [...prevState.finalpostData, this.state.postData],
        }), () => {
            console.log(finalPostData)
            this.setState({ updatedHierarchy: finalPostData })
        })
        console.log(this.state.postactivityid)
        console.log(this.state.postactivityid2)
        var activityid1;
        if (this.state.postactivityid) {
            activityid1 = this.state.postactivityid
        } else if (this.state.postactivityid2) {
            activityid1 = this.state.postactivityid2
        }
        var body = {
            activityid: activityid1,
            referenceno: this.state.referenceno,
            hierarchy: finalPostData
        }
        console.log(body)
    }
    setWorkFlowHier = () => {
        var activityid1;
        if (this.state.postactivityid) {
            activityid1 = this.state.postactivityid
        } else if (this.state.postactivityid2) {
            activityid1 = this.state.postactivityid2
        }
        var body1 = {
            activityid: activityid1,
            referenceno: this.state.referenceno,
            hierarchy: this.state.updatedHierarchy
        }
        console.log(body1)
        fetch(BASEURL + '/lms/setwfapproverhierarchy', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify(body1)
        })
            .then(response => {
                return response.json();
            })
            .then((resdata) => {
                console.log(resdata)
                if (resdata.status === 'Success') {
                    confirmAlert({
                        message: resdata.message,
                        buttons: [
                            {
                                label: "OK",
                                onClick: () => {
                                    // window.location = "/createOffice"
                                },
                            },
                        ],
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
            }).catch((error) => {
                console.log(error)
            })
    }
    handleChange() {
        $('.text').toggle();
        $('#PImage').toggle();
        $('#Pinfo').toggle();
    }
    resetModalState = () => {
        this.setState({
            activityDetails: false,
            workflowDetailList: [],
            approverHierarchyList: [],
            addApproverFlag: false,
        });
        enableStatusFlag = false;
    };
    resetModalState1 = () => {
        enableStatusFlag = false;
        console.log(enableStatusFlag)
    };


    render() {
        const { t } = this.props
        const { officeHieList, staffList, maxOfficeLevel, maxStaffLevel } = this.state;

        console.log('Office Hierarchy List', officeHieList);
        console.log('Max Office Level for Filtering', maxOfficeLevel);
        console.log('Staff List', staffList);
        console.log('Max Staff Level for Filtering', maxStaffLevel);

        const filteredOfficeHieList = officeHieList.filter(list => list.level >= maxOfficeLevel);
        const filteredStaffList = staffList.staffhierachy && staffList.staffhierachy.filter(ele => ele.stafflevel >= maxStaffLevel);

        console.log('Filtered Office Hierarchy List:', filteredOfficeHieList);
        console.log('Filtered Staff List:', filteredStaffList);
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
            <div className="container-dashboard d-flex flex-row" id="wrapper" style={{ backgroundColor: "#f4f7fc" }}>
                <SystemUserSidebar />
                <div className="pl-3 pr-3 main-content" id="page-content-wrapper">
                    <div className="container-fluid row pt-2">
                        <div className="col-1" id="ProductDefRes1">
                            <button style={{ marginLeft: "25px" }} onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className='col-4' id="ProductDefRes2" style={{ marginLeft: "20px", marginTop: "5px" }}>
                            <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                <Link to="/sysUserDashboard">Home</Link> / Workflow Lists</p>
                        </div>
                        <div className='col'>

                        </div>
                        <div className='col'>

                        </div>
                        <div className='col-3'>

                        </div>
                        <div className="col" id="ProductDefRes3">
                            <button style={myStyle}>
                                <Link to="/sysUserDashboard" style={{ marginLeft: "10px" }}><FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} /><span style={{ textDecoration: "none", color: "white" }}>Back</span></Link></button>
                        </div>

                    </div>
                    <hr className="col-11" style={{ marginLeft: "50px", width: "88.6%", backgroundColor: "rgba(4,78,160,1)" }} />
                    {/* New Design */}
                    <div className='container-fluid row' style={{ paddingLeft: "86px", marginTop: "-20px" }}>
                        <div className='card' style={{ cursor: "default" }}>
                            <div className='row pt-2 pl-2 pr-2'>
                                <div className='col'>
                                    <ul role="tablist" className="nav nav-pills nav-fill mb-3" >
                                        <li className="nav-item"><a data-toggle="pill" id="myNavLink" href="#activeproducts" className="nav-link active"
                                            style={{ textAlign: "center", paddingTop: "10px", paddingBottom: "10px", fontWeight: "bold" }} ><img src={sysUser} style={{ width: "20px" }} /> &nbsp; {t('Workflow Lists')} </a> </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="tab-content h-100">
                                <div class="tab-pane fade show active " id="activeproducts" role="tabpanel" style={{ marginBottom: "20px" }}>
                                    {this.state.wfUpdPerms !== "" && this.state.wfUpdPerms.length > 0 ?
                                        this.state.wfUpdPerms.map((permission, index) => {
                                            if (permission.permissionname === "CREATE_WORKFLOW" && permission.status === "1") {
                                                return (
                                                    <div className='row font-weight-normal' style={{ fontWeight: "800", fontSize: "15px", color: "rgba(5,54,82,1)", marginLeft: "10px" }} key={index}>
                                                        <div className='col' style={{ marginRight: "10px" }}>
                                                            <Link to="/createWorkflow" style={{ textDecoration: "none" }}>
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-sm text-white"
                                                                    style={{
                                                                        backgroundColor: "#0079bf",
                                                                        marginTop: "-10px",
                                                                        float: "right"
                                                                    }}
                                                                >
                                                                    &nbsp;<img src={us} style={{ width: "20px" }} />&nbsp;
                                                                    {t("Create Workflow")}
                                                                </button>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                )
                                            }
                                            else {
                                                return null;
                                            }
                                        }
                                        )

                                        : ""}
                                    {/* <hr className="col-12" style={{ marginLeft: "13px", width: "94%", marginTop: "-10px" }} /> */}

                                    <div className="row pl-2 pr-2">
                                        {this.state.workflowMasterList.map((lists, index) => {
                                            return (
                                                <div className='col-4'>
                                                    <div className='card p-3' style={{ border: "2px solid rgba(0,121,190,1)", marginBottom: "1px", cursor: "default", overflow: "visible" }}>
                                                        <div className='row mb-3' style={{ fontSize: "14px", marginTop: "-4px", color: "#222C70" }}>
                                                            <div className='col-12'>
                                                                <Tooltip title={lists.workflowname} >
                                                                    <p style={{ marginBottom: "1px" }}><span className="font-weight-bold">Workflow Name:</span>
                                                                        &nbsp;
                                                                        <span>{lists.workflowname.substring(0, 15) + ".."}</span>
                                                                    </p>
                                                                </Tooltip>
                                                            </div>
                                                            {/* <div className='col-4'>
                                                                <FaAngleDoubleRight onClick={this.viewProducts} style={{ cursor: "pointer" }} />
                                                            </div> */}
                                                        </div>
                                                        {this.state.wfReadPerms !== "" && this.state.wfReadPerms.length > 0 ?
                                                            this.state.wfReadPerms.map((permission, index) => {
                                                                if (permission.permissionname === "GET_WORKFLOW_DETAILS" && permission.status === "1") {
                                                                    return (
                                                                        <div className='row' key={index}>
                                                                            <div className='col' style={{ textAlign: "center" }}>
                                                                                <button
                                                                                    type="button"
                                                                                    className="btn btn-sm text-white"
                                                                                    style={{
                                                                                        backgroundColor: "#0079bf"
                                                                                    }}

                                                                                    onClick={this.moreDetails.bind(this, lists.workflowid, lists.workflowname)}
                                                                                >
                                                                                    Activity Details
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    )

                                                                }
                                                                else {
                                                                    return null;
                                                                }
                                                            })


                                                            : ""}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>


                                </div>

                            </div>
                        </div>
                    </div>

                    {/*moreDetailsModal*/}
                    <button type="button" id='moreDetailsModal' style={{ display: "none" }} class="btn btn-primary" data-toggle="modal" data-target=".bd-example-modal-lg">
                        More Details Modal
                    </button>
                    <div class="modal fade bd-example-modal-lg" id="examplemodal" tabindex="-1" role="dialog" aria-labelledby="myLargeModalLabel" aria-hidden="true" data-backdrop="static">
                        <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
                            {this.state.activityDetails ?
                                <div className="modal-content" id="activityDetailscontent">
                                    <div class="modal-body">

                                        <div className='row'>
                                            <div className='col'>
                                                <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold" }}><img src={editRole} width="25px" />Activity Details</p>
                                                <hr style={{ width: "50px", marginTop: "-10px", backgroundColor: "rgb(0, 121, 191)" }} />

                                                <div className='row ml-4'>
                                                    <div className='col' style={{ marginTop: "-10px" }}>
                                                        <p style={{ color: "rgba(5,54,82,1)", fontWeight: "600" }}>Workflow Name: <span style={{ fontWeight: "400" }}>{this.state.wkFName}{`(${this.state.wkFID})`}</span></p>
                                                    </div>
                                                </div>

                                                <div className='row mb-2 ml-4 mr-4'>
                                                    <div className='row' style={{ marginTop: "-10px" }}>
                                                        <div className='col'>
                                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "600", marginBottom: "5px" }}>Existing products</p>
                                                        </div>
                                                        {this.state.wfUpdPerms !== "" && this.state.wfUpdPerms.length > 0 ?
                                                            this.state.wfUpdPerms.map((permission, index) => {
                                                                if (permission.permissionname === "ASSIGN_WORKFLOW" && permission.status === "1") {
                                                                    return (
                                                                        <div className='col' style={{ textAlign: "end" }} key={index}>
                                                                            <p className='assignWkflw' style={{ cursor: "pointer", fontWeight: "500", fontSize: "14px" }} onClick={this.assignWorkflow}>
                                                                                <FaRegEdit />&nbsp;Assign Workflow</p>

                                                                        </div>

                                                                    )
                                                                }
                                                                else {
                                                                    return null;
                                                                }
                                                            })

                                                            : ""}

                                                    </div>

                                                    {this.state.workflowMasterList.map((lists, index) => {
                                                        return (
                                                            <>
                                                                {
                                                                    lists.workflowid == this.state.wkFID ?
                                                                        <>
                                                                            {lists.workflowlist.map((sublists, subindex) => {
                                                                                return (
                                                                                    <div className='col-3' key={subindex}>
                                                                                        <div style={{ border: "1.5px solid rgb(0, 121, 191)", marginBottom: "10px", borderRadius: "3px", paddingLeft: "5px" }}>
                                                                                            <div className='row' style={{ marginTop: "5px", fontSize: "14px", color: "#222C70" }}>
                                                                                                <div className='col-9'>
                                                                                                    <div class="form-check">
                                                                                                        <input class="form-check-input" type="checkbox"
                                                                                                            id="flexCheckDefault" value={sublists.productid} style={{ cursor: "pointer" }} checked={sublists.checked} />
                                                                                                        <label class="form-check-label" for="flexCheckDefault" style={{
                                                                                                            fontFamily: "Poppins,sans-serif",
                                                                                                            fontSize: "15px", fontWeight: "400"
                                                                                                        }} >
                                                                                                            {sublists.productid}
                                                                                                        </label>
                                                                                                    </div>
                                                                                                </div>

                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                )
                                                                            })}</> : ""
                                                                }
                                                            </>
                                                        )
                                                    })
                                                    }
                                                </div>

                                                <div className='row font-weight-normal' style={{ fontWeight: "800", fontSize: "15px", color: "rgba(5,54,82,1)" }}>
                                                    <div className='col-5' style={{ textAlign: "center" }}>
                                                        <p style={{ fontWeight: "600", marginLeft: "40px" }}>{t('Activity Name')}</p>
                                                    </div>
                                                    <div className='col-3' style={{ textAlign: "center" }}>
                                                        <p style={{ fontWeight: "600" }}>{t('Status')}</p>
                                                    </div>
                                                    <div className='col-3' style={{ textAlign: "center" }}>
                                                        <p style={{ fontWeight: "600" }}>{t('Enable/Disable')}</p>
                                                    </div>
                                                    <div className='col-1' style={{ marginTop: "-3px", marginLeft: "-40px" }}>
                                                        <FaEdit id="enableDisableWkflw" style={{ cursor: "pointer" }} onClick={this.enableWkflwEdit} />
                                                    </div>
                                                </div>
                                                <hr className="col-11" style={{ marginLeft: "40px", width: "88.6%", marginTop: "-10px" }} />

                                                {/* Lists */}
                                                <div className="">
                                                    {this.state.workflowDetailList.map((workflow, index) => {
                                                        return (
                                                            <div className='col' key={index}>
                                                                <div className='card border-0' style={{ marginBottom: "-10px", transition: 'none', color: "rgb(5, 54, 82)", cursor: 'default', width: "95%", height: "30px", marginLeft: "30px", backgroundColor: (index % 2 == 0) ? 'rgba(255,255,255,1)' : 'rgba(242,242,242,1)' }}>
                                                                    <div className="row item-list align-items-center">
                                                                        <div className="col-5">
                                                                            <p style={{ fontSize: "17px", fontWeight: "490", paddingTop: "2px", marginLeft: "20px" }}>{workflow.activity}</p>
                                                                        </div >
                                                                        <div className="col-3" style={{ textAlign: "center" }}>
                                                                            <p style={{ fontSize: "17px", fontWeight: "490", paddingTop: "2px" }}>{workflow.status == 1 ? "Enabled" : "Disabled"}</p>
                                                                        </div>
                                                                        <div className="col-3" style={{ textAlign: "center" }}>
                                                                            <input className='' id='' name='check' type='checkbox' checked={workflow.checked} onChange={(e) => { this.checkActivityStatus(e, index, workflow.activityid) }} value={workflow.status}
                                                                                style={{ marginLeft: "1px", color: "rgba(5,54,82,1)", cursor: "pointer" }}
                                                                                disabled={workflow.disabled}
                                                                            />
                                                                        </div>
                                                                        {/* {workflow.activityid === "LN111" ? */}
                                                                        {(workflow.status === "1" && workflow.activityid === "LN111") || (workflow.status === "0" && workflow.activityid === "LN111" && enableStatusFlag === true) ?

                                                                            <div className="col-1" style={{ textAlign: "center" }}>
                                                                                {/* <p style={{ fontSize: "17px", fontWeight: "490", paddingTop: "12px" }}>{workflow.status == 1 ? "Enabled" : "Disabled"}</p> */}
                                                                                <p style={{ fontSize: "17px", fontWeight: "490", paddingTop: "2px" }}

                                                                                    onClick={this.getApproverHierarchy}>
                                                                                    <FaIcons.FaChevronRight style={{ marginRight: "5px" }} /></p>
                                                                            </div>
                                                                            : ""}
                                                                    </div >
                                                                </div>
                                                            </div>
                                                        )
                                                    })
                                                    }
                                                </div>

                                                <hr style={{ backgroundColor: "rgba(5,54,82,1)" }} />
                                                <div className='row'>
                                                    <div className='col' style={{ textAlign: "end" }}>
                                                        <button className='btn btn-sm text-white consentforEdit' style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.consentForEdit}>Submit</button>
                                                        &nbsp;
                                                        <button type="button" id='disagree' class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "#0079bf" }} onClick={this.resetModalState1}>Cancel</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                :

                                <div className="modal-content" id="approverHierContent">
                                    <div class="modal-body">
                                        <div className='row'>
                                            <div className='col' >
                                                <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold" }}><img src={editRole} width="25px" />Hierarchy Details</p>
                                            </div>
                                            <div className='col' style={{ textAlign: "end" }}>
                                                <button onClick={this.backToActivityDetails} style={myStyle}>
                                                    <FaAngleLeft style={{ color: "white", textDecoration: "none" }} /><span style={{ textDecoration: "none", color: "white" }}>Back</span></button>
                                            </div>

                                        </div>

                                        <hr style={{ width: "50px", marginTop: "-10px", backgroundColor: "rgb(0, 121, 191)" }} />

                                        <div className='row'>
                                            <div className='col' >
                                                <p style={{ color: "rgba(5,54,82,1)", fontWeight: "600", marginLeft: "15px" }}>Workflow Name: <span style={{ fontWeight: "400" }}>{this.state.wkFName}{`(${this.state.wkFID})`}</span></p>
                                            </div>

                                            <div className='col' style={{ textAlign: "end" }}>
                                                <button type="button" id='' class="btn text-white btn-sm" style={{ backgroundColor: "#0079bf" }} onClick={this.editApproverHierarchy}>
                                                    {this.state.approverHierarchyList.length > 0 ? 'Edit' : 'Add'}
                                                </button>
                                            </div>
                                        </div>
                                        {this.state.approverHierarchyList.length > 0 ?
                                            <div className='scrollbar11' id="auditScroll1" style={{ marginTop: "-10px" }}>
                                                <div style={{
                                                    whiteSpace: "nowrap"
                                                }} id='secondAuditScroll'>
                                                    <div className='row font-weight-normal'
                                                        style={{
                                                            fontWeight: "800",
                                                            fontSize: "15px",
                                                            color: "rgba(5,54,82,1)",
                                                        }}>

                                                        <div className='col-2' style={{ textAlign: "" }}>
                                                            <p style={{ fontWeight: "600", marginLeft: "16px" }}>{t('Order No.')}</p>
                                                        </div>
                                                        <div className='col-3' style={{ marginLeft: "9px" }} >
                                                            <p style={{ fontWeight: "600" }}>{t('Office Type')}</p>
                                                        </div>
                                                        <div className='col-3' style={{ marginLeft: "-9px" }} >
                                                            <p style={{ fontWeight: "600" }}>{t('Staff Type')}</p>
                                                        </div>
                                                        <div className='col-3' style={{ textAlign: "" }}>

                                                        </div>
                                                    </div>
                                                    <hr className="col-11" style={{ marginLeft: "40px", width: "88.6%", marginTop: "-10px" }} />

                                                    {/* Lists */}
                                                    {this.state.approverHierarchyList.map((list, index) => {
                                                        return (
                                                            <div className='col card border-0' key={index} style={{ marginBottom: "-11.5px", transition: 'none', overflow: "visible", color: "rgb(5, 54, 82)", cursor: 'default', backgroundColor: (index % 2 == 0) ? 'rgba(255,255,255,1)' : 'rgba(242,242,242,1)' }}>
                                                                <div className="row item-list align-items-center">
                                                                    <div className="col-lg-2 col-md-5 col-sm-8">
                                                                        <p style={{ fontSize: "17px", fontWeight: "490", marginBottom: "-3px" }}>{list.ordernumber}</p>
                                                                    </div >
                                                                    <div className="col-lg-3 col-md-5 col-sm-8" >
                                                                        <p style={{ fontSize: "17px", fontWeight: "490", marginBottom: "-3px" }}>{list.officetype}</p>
                                                                    </div>
                                                                    <div className="col-lg-3 col-md-5 col-sm-8" >
                                                                        <p style={{ fontSize: "17px", fontWeight: "490", marginBottom: "-3px" }}>{list.stafftype}</p>
                                                                    </div>
                                                                    {this.state.addApproverFlag && (
                                                                        <div className="col-lg-3 col-md-5 col-sm-8" style={{ textAlign: "end" }} onClick={() => this.delHierLevel(index)}>
                                                                            <FaRegTrashAlt style={{ color: "red" }} />
                                                                        </div>
                                                                    )}


                                                                </div >
                                                            </div>
                                                        )
                                                    })
                                                    }

                                                    <hr style={{ backgroundColor: "rgba(5,54,82,1)" }} />
                                                </div>
                                            </div>
                                            : <div>
                                                {this.state.addApproverFlag === false &&
                                                    <p style={{ textAlign: "center" }}>Hierarchy does not exist please create a new one</p>
                                                }
                                            </div>
                                        }
                                        {this.state.addApproverFlag && (
                                            <div className='' id='editWfHierDetails'>
                                                <div className='container' ref={this.hierarchyRowRef}
                                                    id="hierarchyRow"
                                                    style={{ marginTop: "10px" }}>

                                                    <div className='row' >
                                                        {/* <div className='col-3' id="list0" style={{ display: "none" }}>
                                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "500" }}>&nbsp;Order No. *</p>
                                                            <select className='form-select' style={{ marginTop: "-13px" }}
                                                                // onClick={this.OffHier1}
                                                                onChange={this.orderlist} ref={this.list0ref}
                                                            >
                                                                <option defaultValue>Select</option>
                                                                {this.state.orderList.map((list, index) => (
                                                                    <option key={index} value={list} style={{ color: "GrayText" }}>{list} </option>
                                                                ))
                                                                }
                                                            </select>
                                                        </div> */}
                                                        <div className='col-3' id="list1" style={{ display: "none" }}>
                                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "500" }}>&nbsp;Office Level *</p>
                                                            <select className='form-select' style={{ marginTop: "-13px" }}
                                                                onClick={this.OffHier1}
                                                                onChange={this.officehie} ref={this.list1ref}
                                                            >
                                                                <option defaultValue>Select</option>
                                                                {filteredOfficeHieList.map((list, index) => (
                                                                    <option key={index} value={`${list.level},${list.officetype}`} style={{ color: "GrayText" }}>{list.officetype}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                        <div className='col' id="list2" style={{ display: "none" }}>
                                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "500" }}>&nbsp;Staff Level *</p>
                                                            <select className='form-select' style={{ marginTop: "-13px" }}
                                                                onChange={this.staffList1} ref={this.list2ref}
                                                            >
                                                                <option defaultValue>Select</option>
                                                                {filteredStaffList && filteredStaffList.map((ele, index) => (
                                                                    <option key={index} style={{ color: "GrayText" }} value={`${ele.stafflevel},${ele.hierarchyname}`}>{ele.hierarchyname}</option>
                                                                ))}
                                                            </select>

                                                        </div>
                                                    </div>

                                                </div>
                                                <div className='row' id="saveButton1" style={{ marginTop: "15px", marginLeft: "10px", display: "none" }}>
                                                    <div className='col d-flex justify-content-end align-items-center'>
                                                        {/* <p className="mb-0 mr-2">This is approver level {this.state.order}</p> */}
                                                        <button className='btn btn-sm' style={{ backgroundColor: "rgb(136, 189, 72)", color: "white" }}
                                                            onClick={this.saveHierarchy}
                                                        ><FaRegSave style={{ marginTop: "-4px" }} />&nbsp;<span>Save</span></button>
                                                    </div>
                                                </div>


                                            </div>
                                        )}
                                        {this.state.addApproverFlag && (
                                            <div className='row' style={{ marginTop: "10px", cursor: "pointer", }} id="addApprover">
                                                <div className='col d-flex align-items-center' style={{ justifyContent: "center" }} onClick={this.AddhierRow}>
                                                    <FaIcons.FaUserPlus style={{ marginRight: "5px" }} />
                                                    <p style={{ margin: "0" }}>
                                                        {this.state.approverHierarchyList.length > 0 ? 'Add another approver' : 'Add approver'}
                                                    </p>

                                                </div>
                                            </div>
                                        )}

                                        <div className='row'>
                                            <div className='col' style={{ textAlign: "center", marginTop: "20px" }}>
                                                <p style={{ color: "rgb(5, 54, 82)", fontSize: "16px" }}>
                                                    {this.state.approverHierarchyList.length > 0 && 'Note: If you want to edit any existing hierarchy please delete the existing hierarchy and create a new one.'}
                                                </p>
                                                <button className='btn btn-sm text-white' id="submitBtn" style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.submitHier}>Submit</button>
                                                &nbsp;
                                                <button type="button" id='disagree' class="btn text-white btn-sm" data-dismiss="modal" style={{ backgroundColor: "#0079bf" }} onClick={this.resetModalState}>Close</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                    {/* consentEditWorkflow */}
                    <button type="button" id="consentEditWorkflowModal" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter91" style={{ display: "none" }}>
                        Consent Work Flow modal
                    </button>
                    <div class="modal fade" data-backdrop="static" id="exampleModalCenter91" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered" role="document">
                            <div class="modal-content">
                                <div class="modal-body">
                                    <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold" }}><img src={editRole} width="25px" />Edit Workflow Activities</p>
                                    <hr style={{ width: "50px", marginTop: "-10px", backgroundColor: "rgb(0, 121, 191)" }} />

                                    {this.state.editWkflwActFlag == 0 ?
                                        <div>
                                            <div className='row mb-2'>
                                                <div className='col'>
                                                    <p style={{ color: "rgb(5, 54, 82)", fontWeight: "500" }}>
                                                        Would you like to edit the workflow activities?
                                                    </p>
                                                </div>
                                            </div>
                                            <div className='row mb-2'>
                                                <div className='col'>
                                                    <p style={{ color: "rgb(5, 54, 82)", fontWeight: "500" }}>Comments</p>
                                                    <textarea type="text" className="form-control" placeholder='Enter Coments' style={{ marginTop: "-10px" }} onChange={this.editComments}></textarea>
                                                </div>
                                            </div>
                                        </div> :
                                        <div>
                                            <div className='row mb-2'>
                                                <div className='col'>
                                                    <p style={{ color: "rgb(5, 54, 82)", fontWeight: "500" }}>{this.state.editWkflowMsg}</p>
                                                </div>
                                            </div>
                                            <div className='row' style={{ marginBottom: "-10px" }}>
                                                <div className='col'>
                                                    <p style={{ color: "rgb(5, 54, 82)", fontWeight: "500" }}>Product List</p>
                                                </div>
                                            </div>
                                            <div className='row'>
                                                {this.state.editProdList.map((prdList, index) => {
                                                    return (
                                                        <div className='col-3' key={index}>
                                                            <div style={{ height: "50px", border: "1.5px solid rgb(0, 121, 191)", marginBottom: "10px", borderRadius: "3px", padding: "5px" }}>
                                                                <div className='row' style={{ marginTop: "5px", fontSize: "14px", color: "#222C70" }}>
                                                                    <div className='col-9'>
                                                                        <div class="">
                                                                            <label class="form-check-label" style={{
                                                                                fontFamily: "Poppins,sans-serif",
                                                                                fontSize: "15px", fontWeight: "400"
                                                                            }} >
                                                                                {prdList}
                                                                            </label>
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
                                {this.state.editWkflwActFlag == 0 ?
                                    <div class="modal-footer">
                                        <div className='row'>
                                            <div className='col' style={{ paddingTop: "20px", textAlign: "end" }}>
                                                <button className='btn btn-sm text-white editWorkflowAct' style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.editWorflowActivity}>Agree</button>
                                                &nbsp;
                                                <button className='btn btn-sm text-white' data-dismiss="modal" style={{ backgroundColor: "#0079BF" }}>Cancel</button>
                                            </div>
                                        </div>
                                    </div> :
                                    <div class="modal-footer">
                                        <div className='row'>
                                            <div className='col' style={{ paddingTop: "20px", textAlign: "end" }}>
                                                <button className='btn btn-sm text-white' style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.submitEditWorkflow}>Submit</button>
                                                &nbsp;
                                                <button className='btn btn-sm text-white' data-dismiss="modal" style={{ backgroundColor: "#0079BF" }} onClick={this.cancelsubmitWorkflow}>Cancel</button>
                                            </div>
                                        </div>
                                    </div>

                                }
                            </div>
                        </div>
                    </div>

                    {/* viewProductsModal */}
                    <button type="button" id="viewProductsModal" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter12" style={{ display: "none" }}>
                        View Products modal
                    </button>
                    <div class="modal fade" id="exampleModalCenter12" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered" role="document">
                            <div class="modal-content">
                                <div class="modal-body">
                                    <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold" }}><img src={editRole} width="25px" />Products</p>
                                    <hr style={{ width: "50px", marginTop: "-10px", backgroundColor: "rgb(0, 121, 191)" }} />
                                    {this.state.workflowMasterList.map((lists, index) => {
                                        return (
                                            <div className='row mb-2'>
                                                {lists.workflowlist.map((sublists, subindex) => {
                                                    return (
                                                        <div className='col-6' key={index}>
                                                            <div style={{ height: "50px", border: "1.5px solid rgb(0, 121, 191)", marginBottom: "10px", borderRadius: "3px", padding: "5px" }}>
                                                                <div className='row' style={{ marginTop: "5px", fontSize: "14px", color: "#222C70" }}>
                                                                    <div className='col-8'>
                                                                        <p className='font-weight-bold'>Product ID: <span style={{ fontWeight: "400" }}>{sublists.productid}</span></p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        )
                                    })
                                    }
                                </div>
                                <div class="modal-footer">
                                    <div className='row'>
                                        <div className='col' style={{ paddingTop: "20px", textAlign: "end" }}>
                                            <button className='btn btn-sm text-white' data-dismiss="modal" style={{ backgroundColor: "#0079BF" }}>Close</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* assignWorkflowModal */}
                    <button type="button" id="assignWorkflowModal" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter" style={{ display: "none" }}>
                        Assign Work Flow modal
                    </button>
                    <div class="modal fade" data-backdrop="static" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered" role="document">
                            <div class="modal-content">

                                <div class="modal-body">
                                    <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold" }}><img src={editRole} width="25px" />Assign Workflow</p>
                                    <hr style={{ width: "50px", marginTop: "-10px", backgroundColor: "rgb(0, 121, 191)" }} />
                                    <div className='row mb-2'>
                                        <div className='col'>
                                            <p style={{ color: "rgb(5, 54, 82)", fontWeight: "500" }}>Workflow Name</p>
                                            <select className='form-select' style={{ marginTop: "-10px" }} onChange={this.workFlowId}>
                                                <option>Select Workflow Name</option>
                                                {this.state.workflowMasterList.map((lists, index) => {
                                                    return (
                                                        <option value={lists.workflowid}>{lists.workflowname}</option>
                                                    )
                                                })
                                                }
                                            </select>
                                            {/* <input className='form-control' style={{ marginTop: "-10px" }} value={this.state.wkFID}
                                                onChange={this.workFlowId} /> */}
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='col'>
                                            <p style={{ color: "rgb(5, 54, 82)", fontWeight: "500" }}>Product Name</p>
                                            <select className='form-select' style={{ marginTop: "-10px" }} onChange={this.assignProdID}>
                                                <option>Select Product</option>
                                                {
                                                    this.state.produList.map((lists, index) => {
                                                        return (
                                                            <option key={index} value={lists.prodid}>{lists.prodname}</option>
                                                        )
                                                    })
                                                }
                                            </select>
                                        </div>
                                    </div>

                                </div>
                                <div class="modal-footer">
                                    <div className='row'>
                                        <div className='col' style={{ paddingTop: "20px", textAlign: "end" }}>
                                            <button className='btn btn-sm text-white' style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.submitAssignWkflow}>Submit</button>
                                            &nbsp;
                                            <button className='btn btn-sm text-white' data-dismiss="modal" style={{ backgroundColor: "#0079BF" }}>Cancel</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* ReassignWorkflowModal */}
                    <button type="button" id="reAssignWorkflowModal" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter21" style={{ display: "none" }}>
                        Reassign Work Flow modal
                    </button>
                    <div class="modal fade" data-backdrop="static" id="exampleModalCenter21" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered" role="document">
                            <div class="modal-content">

                                <div class="modal-body">
                                    <p style={{ color: "rgba(5,54,82,1)", fontWeight: "bold" }}><img src={editRole} width="25px" />ReAssign Workflow</p>
                                    <hr style={{ width: "50px", marginTop: "-10px", backgroundColor: "rgb(0, 121, 191)" }} />
                                    <div className='row mb-2'>
                                        <div className='col'>
                                            <p style={{ color: "rgb(5, 54, 82)", fontWeight: "500" }}>Workflow Name</p>
                                            <input className='form-control' style={{ marginTop: "-10px" }} value={this.state.wkFName}
                                                readOnly />
                                        </div>
                                    </div>
                                    <div className='row mb-2'>
                                        <div className='col'>
                                            <p style={{ color: "rgb(5, 54, 82)", fontWeight: "500" }}>Product Name</p>
                                            <input className='form-control' style={{ marginTop: "-10px" }} value={this.state.assignProdID}
                                                readOnly />
                                        </div>
                                    </div>

                                </div>
                                <div class="modal-footer">
                                    <div className='row'>
                                        <div className='col' style={{ paddingTop: "20px", textAlign: "end" }}>
                                            <button className='btn btn-sm text-white' style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.submitReAssignWkflow}>Submit</button>
                                            &nbsp;
                                            <button className='btn btn-sm text-white' data-dismiss="modal" style={{ backgroundColor: "#0079BF" }}>Cancel</button>
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

export default withTranslation()(GetWorkflowList)