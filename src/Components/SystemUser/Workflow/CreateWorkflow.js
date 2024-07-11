import React, { Component } from 'react';
import $ from 'jquery';
import { BASEURL } from '../../assets/baseURL';
import SystemUserSidebar from '../SystemUserSidebar';
import { withTranslation } from 'react-i18next';
import { FaPlus } from "react-icons/fa";
import { FaAngleLeft, FaRegSave } from "react-icons/fa";
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
import batch from '../../assets/batch.png';
var dataList = [];
export class CreateWorkflow extends Component {
    constructor(props) {
        super(props)
        this.state = {
            workflowmasterActivities: [],
            registrationActivities: [],
            productDefLists: [],
            productid: "",
            prodName: "",
            prodActive: "",
            productStatus: "",

            offset: 0,
            perPage: 5,
            currentPage: 0,
            pageCount: "",

            offset2: 0,
            currentPage2: 0,
            pageCount2: "",
            produList: [],
            orgtableData2: [],
            workFlowUpdatePermissions: [],

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
            order: 1,
            newHierarchy: {},
            officeType: '',
            officeName: [],
            staffName: [],
            staffType: '',
            postData: [],
            referenceno: '',
            workflowname: "",
            maxOfficeLevel: 0,
            maxStaffLevel: 0,
        }
        this.selectRef1 = React.createRef();
        this.selectRef2 = React.createRef();
    }
    componentDidMount() {
        // $("#customSwitch1").click(function () {
        //     if ($(this).is(":checked")) {
        //         $(".preference").show();
        //         $(".submitBtn").show();
        //     } else {
        //         $(".preference").hide();
        //         $(".submitBtn").hide();

        //     }
        // })
        //this.dummyWorkflActList();
        this.workflowActivityList();
        this.getLoanProductlist();
        this.getRegActivities();
        var storedArrayStringJSON = sessionStorage.getItem("rolePermData")
        var storedArray = JSON.parse(storedArrayStringJSON);
        console.log(storedArray);
        if (storedArray) {
            storedArray.forEach(element => {
                if (element.rolename === "WF_UPDATE_INFO") {
                    console.log(element.permissions);
                    this.setState({ workFlowUpdatePermissions: element.permissions });
                    console.log(this.state.workFlowUpdatePermissions);
                }
            });
        }
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
                if (resdata.status == "SUCCESS") {
                    this.setState({ produList: resdata.msgdata });
                } else {

                }
            })
            .catch(err => {
                console.log(err.message)
            })
    }
    productLists = (e) => {
        this.setState({ productid: e.target.value })
    }
    getRegActivities = () => {
        var regActivties = [
            {
                "activityid": "LN01",
                "activity": "Onboarding applic",
                "categoryid": "LNCYCLE",
                "categorydesc": "Loan processing cycle"
            },
            {
                "activityid": "LN02",
                "activity": "Document Upload",
                "categoryid": "LNCYCLE",
                "categorydesc": "Loan processing cycle"
            },
            {
                "activityid": "LN03",
                "activity": "In person verification",
                "categoryid": "LNCYCLE",
                "categorydesc": "Loan processing cycle"
            },
            {
                "activityid": "LN07",
                "activity": "Digilocker verification",
                "categoryid": "LNCYCLE",
                "categorydesc": "Loan processing cycle"
            },
            {
                "activityid": "LN09",
                "activity": "VKYC verification",
                "categoryid": "LNCYCLE",
                "categorydesc": "Loan processing cycle"
            },
            {
                "activityid": "LN09",
                "activity": "Terms & Condition signing",
                "categoryid": "LNCYCLE",
                "categorydesc": "Loan processing cycle"
            },
        ]
        console.log(regActivties);
        const borProf = regActivties.map((profile) => {
            if (profile.activityid) {
                profile.checked = true;
            } else {
                profile.checked = false;
            }
            return profile;
        })
        this.setState({ registrationActivities: borProf });
        console.log(this.state.registrationActivities)
    }
    workflowActivityList = () => {
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
                if (resdata.status == "SUCCESS") {
                    var workflowActivities = resdata.msgdata;
                    // this.setState({ workflowmasterActivities: resdata.msgdata });
                    console.log(workflowActivities)

                    const borProf = workflowActivities.map((profile) => {
                        if (profile.activityid) {
                            profile.checked = true;
                        }
                        else {
                            profile.checked = false;
                        }
                        return profile;
                    })
                    this.setState({ workflowmasterActivities: borProf })


                    borProf.forEach(element => {
                        console.log(element);
                        if (element.activityid === "LN111") {
                            console.log(element)
                            this.setState({
                                actid: element.activityid,
                                actname: element.activity
                            }, () => {
                                console.log(element.activityid, element.activity)
                            })

                        }
                    });
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
    checkActivity = (event, index) => {
        const userShowDetails = this.state.workflowmasterActivities;
        userShowDetails[index].checked = event.target.checked;

        console.log(userShowDetails);
        console.log(event.target.value)
        this.setState({ workflowmasterActivities: userShowDetails });

        dataList[index] = event.target.value;
        console.log(dataList);
    }
    checkRegActivity = (event, index) => {
        console.log(event.target.value)
    }
    categoryList = (e) => {
        console.log(e.target.value);
        if (e.target.value == "LNC") {
            $("#loanCycleActivity").show();
            $("#registrationActivity").hide();
            $(".submitBtn").show();

            $("#prodIDField").show();
            $("#type").hide();
        } else if (e.target.value == "REG") {
            $("#loanCycleActivity").hide();
            $("#registrationActivity").show();
            $(".submitBtn").show();

            $("#prodIDField").hide();
            $("#type").show();
        }
        else {
            $("#loanCycleActivity").hide();
            $("#registrationActivity").hide();
            $(".submitBtn").hide();
        }
    }
    Type = (e) => {
        console.log(e.target.value);
        // RETL
        // ENT
    }
    wkflwName = (e) => {
        this.setState({ workflowname: e.target.value },
            () => {
                console.log(this.state.workflowname)
            })
    }
    createWorkflow = () => {
        var options = this.state.workflowmasterActivities;
        options = options.map((attribute, index) => {
            return {
                activityid: attribute.activityid,
                activitystatus: attribute.checked ? "1" : "0"
            }
        }).filter((obj) => obj.activitystatus !== "")
        console.log(options)
        options.forEach(element => {
            if (element.activityid === "LN111") {
                console.log(element, element.activitystatus);
                if (element.activitystatus === "1") {
                    this.setState({
                        activityStatus: element.activitystatus,
                        // actid:element.activityid,
                        // actname:element.activity
                    }, console.log(this.state.activityStatus))
                }
            }
        });
        fetch(BASEURL + '/lms/createworkflow', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify({
                productid: this.state.productid,
                activitylist: options,
                workflowname: this.state.workflowname
            })
        }).then((Response) => {
            console.log(Response);
            return Response.json();
        })
            .then((resdata) => {
                if (resdata.status === 'Success' || resdata.status === 'SUCCESS') {
                    console.log(resdata);
                    console.log(resdata.msgdata.referenceno)
                    this.setState({
                        referenceno: resdata.msgdata.referenceno
                    })
                    //alert(resdata.message);
                    console.log(this.state.activityStatus)
                    if (this.state.activityStatus === "1") {
                        $("#ApproverModal").click();

                        $("#submitBtn").click(() => {
                            confirmAlert({
                                message: resdata.message,
                                buttons: [
                                    {
                                        label: "Okay",
                                        onClick: () => {
                                            window.location = "/getWorkflow";
                                        },
                                    },
                                ],
                                closeOnClickOutside: false,
                            });
                        });
                    }

                    else {
                        confirmAlert({
                            message: resdata.message,
                            buttons: [
                                {
                                    label: "Okay",
                                    onClick: () => {
                                        window.location = "/getWorkflow";
                                    },
                                },
                            ],
                            closeOnClickOutside: false,
                        });
                    }

                }
                else {
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
        let order = this.state.order
        // order++;
        const selectedValue = e.target.value;
        const [staffLevel, staffType] = selectedValue.split(',');
        // const staffLevel = e.target.value;
        const { officeid, officelevel } = this.state.staffList;
        // var array = this.state.officeName;
        console.log(this.state.officeName)
        var array1 = this.state.officeName;
        console.log(array1);
        if (this.state.officeName.length > 1) {
            array1 = this.state.officeName.slice(-1);
            console.log(array1);
        }

        const newHier = {
            officelevel: officelevel,
            stafflevel: staffLevel,
            order: order,
            staffType: staffType,
            officeNames: array1,
            // staffNames: this.state.staffName
        };
        // const postingData = {
        //     officelevel: officelevel,
        //     stafflevel: staffLevel,
        //     ordernumber: order.toString(),
        // };
        this.setState({
            order: order,
            newHierarchy: newHier,
            // postData: [...this.state.postData, postingData],
        });
        document.getElementById('addApprover').style.display = 'none';
        document.getElementById('saveBtn').style.display = 'block';
        if (this.state.order > "1") {
            document.getElementById('levelList').style.display = 'block';
        }

    }
    saveHierarchy = () => {
        const newHier = this.state.newHierarchy;
        const postingData = this.state.postData;
        console.log(postingData);
        console.log(this.state.hierarchy);
        console.log(this.state.newHierarchy);

        // Ensure officeLevel and staffLevel are numeric and valid in the new hierarchy
        const validOfficeLevel = Number(newHier.officelevel);
        const validStaffLevel = Number(newHier.stafflevel);

        // Check if the officeLevel and staffLevel are valid numbers
        if (isNaN(validOfficeLevel) || isNaN(validStaffLevel)) {
            console.error('Invalid officeLevel or staffLevel in newHierarchy:', newHier);
            return;
        }

        // Find the max office and staff levels in the new hierarchy
        const maxOfficeLevel = validOfficeLevel;
        const maxStaffLevel = validStaffLevel;

        console.log('Max Office Level:', maxOfficeLevel);
        console.log('Max Staff Level:', maxStaffLevel);

        // Check if the new hierarchy level already exists
        console.log(this.state.hierarchy)
        const hierarchyExists = this.state.hierarchy.some(
            (hier) => {
                console.log('Existing officeLevel:', hier.officelevel);
                console.log('New officeLevel:', newHier.officelevel);
                console.log('Existing staffLevel:', hier.stafflevel);
                console.log('New staffLevel:', newHier.stafflevel);

                return hier.officelevel === newHier.officelevel && hier.stafflevel === newHier.stafflevel;
            }
        );
        console.log(hierarchyExists)
        if (hierarchyExists) {
            alert('This hierarchy level already exists.');
            console.log('This hierarchy level already exists.')
            $(this.selectRef1.current).val('');
            $(this.selectRef2.current).val('');
            return;
        }

        // Add the new hierarchy if it passes the checks
        this.setState(prevState => {
            const updatedHierarchy = [...prevState.hierarchy, newHier];

            // Update order only if hierarchy is successfully added
            const updatedOrder = hierarchyExists ? prevState.order : prevState.order + 1;

            return {
                hierarchy: updatedHierarchy,
                maxOfficeLevel: maxOfficeLevel,
                maxStaffLevel: maxStaffLevel,
                order: updatedOrder, // Update order state conditionally
            };
        }, () => {
            console.log(this.state.hierarchy);
        });

        // Update visibility of UI elements
        document.getElementById('addApprover').style.display = 'block';
        document.getElementById('saveBtn').style.display = 'none';
        document.getElementById('levelList').style.display = 'block';
        document.getElementById('hierarchyRow').style.display = 'none';
        console.log(this.state.hierarchy);
    }



    AddhierRow = () => {
        $(this.selectRef1.current).val('');
        $(this.selectRef2.current).val('');
        document.getElementById('addApprover').style.display = 'none';
        document.getElementById('hierarchyRow').style.display = 'block';
        document.getElementById('list2').style.display = 'none';
    }
    submitHier = () => {
        console.log(this.state.hierarchy)
        const postData1 = this.state.hierarchy.map(item => ({
            officelevel: item.officelevel,
            stafflevel: item.stafflevel,
            ordernumber: item.order.toString()
        }));

        // Logging the extracted data
        console.log(postData1);

        $('#exampleModalCenter2990').modal('hide')
        console.log(typeof (this.state.postData))
        var body = {
            activityid: this.state.actid,
            referenceno: this.state.referenceno,
            hierarchy: postData1
        }
        console.log(body)
        fetch(BASEURL + '/lms/setwfapproverhierarchy', {
            method: 'post',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            },
            body: JSON.stringify(body)
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
                                    window.location = "/getWorkflow"
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
    resetHier = () => {
        this.setState({
            hierarchy: [],
            order: 1
        })
        document.getElementById('levelList').style.display = 'none';
        document.getElementById('hierarchyRow').style.display = 'block';
        document.getElementById('addApprover').style.display = 'none';
        document.getElementById('list2').style.display = 'none';
        $(this.selectRef1.current).val('');
        $(this.selectRef2.current).val('');
    }
    handleChange() {
        $('.text').toggle();
        $('#PImage').toggle();
        $('#Pinfo').toggle();
    }

    render() {
        const { officeHieList, staffList, maxOfficeLevel, maxStaffLevel, hierarchy } = this.state;

        console.log('Office Hierarchy List', officeHieList);
        console.log('Max Office Level for Filtering', maxOfficeLevel);
        console.log('Staff List', staffList);
        console.log('Max Staff Level for Filtering', maxStaffLevel);

        // Conditionally filter lists based on whether the hierarchy list is empty
        const filteredOfficeHieList = hierarchy.length > 0 ?
            officeHieList.filter(list => list.level >= maxOfficeLevel) :
            officeHieList;

        const filteredStaffList = hierarchy.length > 0 && staffList.staffhierachy ?
            staffList.staffhierachy.filter(ele => ele.stafflevel >= maxStaffLevel) :
            staffList.staffhierachy || [];

        console.log('Filtered Office Hierarchy List:', filteredOfficeHieList);
        console.log('Filtered Staff List:', filteredStaffList);
        console.log(this.state.officeName)
        console.log(this.state.staffName)
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
            <div className="container-dashboard d-flex flex-row" id="wrapper" style={{ backgroundColor: "#f4f7fc" }}>
                <SystemUserSidebar />
                <div className="pl-3 pr-3 main-content" id="page-content-wrapper">
                    <div className="container-fluid row pt-2">
                        <div className="col-1" id="ProductDefRes1">
                            <button style={{ marginLeft: "25px" }} onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                        </div>
                        <div className='col-5' id="ProductDefRes2" style={{ marginLeft: "20px", marginTop: "5px" }}>
                            <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                                <Link to="/sysUserDashboard">Home</Link> / <Link to="/getWorkflow">Workflow Lists</Link> / Create Workflow</p>
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

                    <div className="card" style={{ cursor: "default", width: "92%", marginLeft: "45px", marginTop: "-10px" }}>
                        <div className="card-header border-1 bg-white">
                            <div className='row' style={{ paddingLeft: "3px" }}>
                                <div className='col-5' id='headingRef'>
                                    <div className="two__image" style={{ paddingLeft: "10px" }}>
                                        <p className="text-white" style={{ paddingBottom: "6px", fontWeight: "600" }}>Create Workflow *</p>
                                    </div>
                                </div>
                            </div>
                            <div className='row mb-3'>
                                <div className='col-4'>
                                    <p style={{ color: "rgb(5, 54, 82)", fontWeight: "500" }}>Category *</p>
                                    <select className='form-select' style={{ marginTop: "-10px" }} onChange={this.categoryList}>
                                        <option defaultValue>Select</option>
                                        <option value="LNC">Loan cycle</option>
                                        <option value="REG">Registration</option>
                                    </select>
                                </div>
                                <div className='col-4' id='prodIDField'>
                                    <p style={{ color: "rgb(5, 54, 82)", fontWeight: "500" }}>Product Name *</p>
                                    <select className='form-select' style={{ marginTop: "-10px" }} onChange={this.productLists}>
                                        <option defaultValue>Select</option>
                                        {
                                            this.state.produList.map((lists, index) => {
                                                return (
                                                    <option key={index} value={lists.prodid}>{lists.prodname}</option>
                                                )
                                            })
                                        }

                                    </select>
                                </div>
                                <div className='col-4' >
                                    <p style={{ color: "rgb(5, 54, 82)", fontWeight: "500" }}>Workflow Name</p>
                                    <input type="text" className="form-control" autoComplete="off" style={{ height: "37px", backgroundColor: "rgb(247, 248, 250)", marginTop: "-10px" }}
                                        id="inputAddress" maxLength={29} placeholder={t('Enter Workflow Name')} onChange={this.wkflwName}
                                    />
                                </div>
                                <div className='col-4' id='type' style={{ display: "none" }}>
                                    <p style={{ color: "rgb(5, 54, 82)", fontWeight: "500" }}>Type</p>
                                    <select className='form-select' style={{ marginTop: "-10px" }} onChange={this.Type}>
                                        <option defaultValue>Select</option>
                                        <option value="RETL">Retail</option>
                                        <option value="ENT">Entity</option>
                                    </select>
                                </div>

                            </div>

                            <div className="card preference" id="loanCycleActivity" style={{ borderRadius: "10px", cursor: "default", display: "none" }}>
                                <div className='row ml-3'>
                                    <p style={{ color: "rgb(5, 54, 82)", fontWeight: "600" }}>*Workflow will carry with same sequence.</p>
                                </div>
                                <div className="row mr-3">
                                    {
                                        this.state.workflowmasterActivities.map((list, index) => {
                                            return (
                                                <div className="col-lg-3 col-md-4 col-sm-6 col-12" key={index}>
                                                    <div className='form-check mt-2' id='checkboX'>
                                                        <div className='row'>
                                                            <div className='col-1'>
                                                                <input
                                                                    className='checkall'
                                                                    id=''
                                                                    name='check'
                                                                    type='checkbox'
                                                                    checked={list.checked}
                                                                    style={{ marginLeft: "1px", color: "rgba(5,54,82,1)", cursor: "pointer" }}
                                                                    onChange={(e) => { this.checkActivity(e, index) }}
                                                                />
                                                            </div>
                                                            <div className='col-10' style={{
                                                                color: "rgb(40, 116, 166)",
                                                                fontWeight: "500", fontSize: "15px", fontStyle: "Poppins"
                                                            }}>
                                                                <span><span>{list.ismandatory === 1 ? " *" : ""}</span>{list.activity}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                            )
                                        })
                                    }
                                </div>
                            </div>

                            <div className="card preference" id="registrationActivity" style={{ borderRadius: "10px", cursor: "default", display: "none" }}>
                                <div className="row mr-3">
                                    {
                                        this.state.registrationActivities.map((lists, index) => {
                                            return (
                                                <div className="col-3" key={index}>
                                                    <div className='form-check mt-2' id='checkboX'>
                                                        <div className='row'>
                                                            <div className='col-2'>
                                                                <input className='checkall' id='' name='check' type='checkbox' checked={lists.checked} onChange={(e) => { this.checkRegActivity(e, index) }} value={lists.activityid}
                                                                    style={{ marginLeft: "1px", color: "rgba(5,54,82,1)", cursor: "pointer" }} />
                                                            </div>
                                                            <div className='col-10' style={{
                                                                color: "rgb(40, 116, 166)",
                                                                fontWeight: "500", fontSize: "15px", fontStyle: "Poppins"
                                                            }}>
                                                                <span>{lists.activity}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>

                            <hr className='submitBtn' style={{ marginTop: "1px", backgroundColor: "rgba(5,54,82,1)", display: "none" }} />
                            <div className="form-row submitBtn" style={{ textAlign: "end", display: "none" }}>
                                <div className="form-group col">
                                    <button type="button" className="btn mr-2 text-white btn-sm"
                                        style={{ backgroundColor: "rgb(136, 189, 72)", width: "90px" }} onClick={this.createWorkflow}>Create</button>
                                    <button type="button" className="btn text-white btn-sm" style={{ backgroundColor: "#0079BF", width: "90px" }}
                                    >{t('Cancel')}</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Staff Users */}
                    <button type="button" id="ApproverModal" class="btn btn-primary" data-toggle="modal" data-target="#exampleModalCenter2990" style={{ display: "none" }}>
                        Staff Users
                    </button>
                    <div class="modal fade" data-backdrop="static" id="exampleModalCenter2990" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                        <div class="modal-dialog modal-dialog-centered" role="document">
                            <div class="modal-content">
                                <div class="modal-body" style={{ cursor: "default" }}>
                                    <div className='row mb-2'>
                                        <div className='col'>
                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "500" }}>&nbsp;<img src={batch} width="25px" />Set Approver Levels</p>
                                            <hr style={{ width: "15px", marginTop: "-10px", backgroundColor: "rgb(34, 44, 112)" }} />
                                        </div>
                                    </div>
                                    <div className='row' style={{ marginTop: "-10px" }}>
                                        <div className='col'>
                                            <p style={{ color: "rgba(5,54,82,1)", fontWeight: "500" }}>&nbsp;Activity Name</p>
                                            <input className='form-control' style={{ marginTop: "-13px" }} value={this.state.actname} readOnly />
                                        </div>
                                    </div>
                                    <div id="levelList" style={{ display: "none" }}>
                                        <div className='scrollbar1' id="auditScroll" style={{ marginTop: "10px", marginLeft: "-22px" }}>
                                            <div style={{
                                                whiteSpace: "nowrap"
                                            }} id='secondAuditScroll'>
                                                <div className='row item-list font-weight-normal align-items-center'
                                                    style={{
                                                        // marginLeft: "25px",
                                                        fontWeight: "800",
                                                        fontSize: "15px",
                                                        color: "rgba(5,54,82,1)",
                                                        width: "95%"
                                                    }}>
                                                    <div className='col-lg-2 col-md-5 col-sm-8'>
                                                        <p style={{ marginLeft: "40px", fontWeight: "600" }}>{t('Level')}</p>
                                                    </div>
                                                    <div className='col-lg-3 col-md-5 col-sm-8'>
                                                        <p style={{ fontWeight: "600", marginLeft: "23px" }}>{t('Office Type')}</p>
                                                    </div>
                                                    <div className='col-lg-3 col-md-5 col-sm-8'>
                                                        <p style={{ fontWeight: "600", marginLeft: "26px" }}>{t('Staff Type')}</p>
                                                    </div>

                                                </div>
                                                <hr className="col-11" style={{ marginLeft: "20px", width: "88.6%", marginTop: "-10px", backgroundColor: "rgba(4,78,160,1)" }} />

                                                {/* Lists */}
                                                <div className="scrollbar1" style={{
                                                    height: "60px",
                                                    // overflowY: 'auto',
                                                    marginTop: "-16px",
                                                    marginLeft: "-22px",
                                                    overflowY: "scroll", scrollbarWidth: "thin",
                                                }}>
                                                    {this.state.hierarchy.map((lists, index) => {
                                                        return (
                                                            <div className='col'
                                                                key={index}
                                                            >
                                                                <div className='card border-0' style={{
                                                                    marginBottom: "-15.5px", transition: 'none', color: "rgb(5, 54, 82)", cursor: 'default', width: "95%", marginLeft: "30px",
                                                                    backgroundColor: (index % 2 == 0) ? 'rgba(255,255,255,1)' : 'rgba(242,242,242,1)'
                                                                }}>
                                                                    <div className="row item-list align-items-center">
                                                                        <div className="col-lg-2 col-md-5 col-sm-8" style={{ paddingLeft: "11px" }}>
                                                                            <p className="ml-4 p-0" style={{ fontSize: "15px", fontWeight: "490", marginBottom: "-3px", textWrap: "wrap" }}>{lists.order}</p>
                                                                        </div >
                                                                        <div className="col-lg-3 col-md-5 col-sm-8">
                                                                            <p className="" style={{ fontSize: "15px", fontWeight: "490", marginBottom: "-3px", textWrap: "wrap" }}>{lists.officeNames}</p>
                                                                        </div >
                                                                        <div className="col-lg-3 col-md-5 col-sm-8">
                                                                            <p style={{ fontSize: "15px", fontWeight: "490", marginBottom: "-3px" }}>
                                                                                {lists.staffType}
                                                                            </p>
                                                                        </div>
                                                                    </div >
                                                                </div>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                    {/* } */}


                                    <div className='container' id="hierarchyRow" style={{ marginTop: "10px" }}>
                                        <div className='row' >
                                            <div className='col' id="list1">
                                                <p style={{ color: "rgba(5,54,82,1)", fontWeight: "500" }}>&nbsp;Office Level *</p>
                                                <select ref={this.selectRef1} className='form-select' style={{ marginTop: "-13px", marginLeft: "-15px" }}
                                                    onClick={this.OffHier1}
                                                    onChange={this.officehie}
                                                >
                                                    <option defaultValue>Select</option>
                                                    {filteredOfficeHieList.map((list, index) => (
                                                        <option key={index} value={`${list.level},${list.officetype}`} style={{ color: "GrayText" }}>{list.officetype} </option>
                                                    ))
                                                    }
                                                </select>
                                            </div>
                                            <div className='col' id="list2" style={{ display: "none" }}>
                                                <p style={{ color: "rgba(5,54,82,1)", fontWeight: "500" }}>&nbsp;Staff Level *</p>
                                                <select ref={this.selectRef2} className='form-select' style={{ marginTop: "-13px" }}
                                                    onChange={this.staffList1}
                                                >
                                                    <option defaultValue>Select</option>
                                                    {filteredStaffList && filteredStaffList.map((ele, index) => (
                                                        <option key={index} style={{ color: "GrayText" }} value={`${ele.stafflevel},${ele.hierarchyname}`}>{ele.hierarchyname}</option>
                                                    ))}
                                                </select>

                                            </div>
                                        </div>
                                    </div>
                                    <div className='row' id="saveBtn" style={{ marginTop: "15px", marginLeft: "10px", display: "none" }}>
                                        <div className='col d-flex justify-content-end align-items-center'>
                                            <p className="mb-0 mr-2">This is approver level {this.state.order}</p>
                                            <button className='btn btn-sm' style={{ backgroundColor: "rgb(136, 189, 72)", color: "white" }}
                                                onClick={this.saveHierarchy}
                                            ><FaRegSave style={{ marginTop: "-4px" }} />&nbsp;<span>Save</span></button>
                                        </div>
                                    </div>

                                    <div className='row' style={{ marginTop: "10px", display: "none", cursor: "pointer", }} id="addApprover">
                                        <div className='col d-flex align-items-center' style={{ justifyContent: "center" }} onClick={this.AddhierRow}>
                                            <FaIcons.FaUserPlus style={{ marginRight: "5px" }} />
                                            <p style={{ margin: "0" }}>Add another approver</p>

                                        </div>
                                    </div>
                                </div>
                                <div class="modal-footer">
                                    <div className='row'>
                                        <div className='col' style={{ paddingTop: "20px", textAlign: "end" }}>
                                            <button className='btn btn-sm text-white' id="submitBtn" style={{ backgroundColor: "rgb(136, 189, 72)" }} onClick={this.submitHier} >Submit</button>
                                            &nbsp;
                                            <button className='btn btn-sm text-white' style={{ backgroundColor: "#0079BF" }} data-dismiss="modal" onClick={this.resetHier}>Cancel</button>
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

export default withTranslation()(CreateWorkflow)