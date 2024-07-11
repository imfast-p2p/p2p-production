import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import * as AiIcons from "react-icons/ai";
import * as HiIcons from "react-icons/hi";
import * as CgIcons from "react-icons/cg";
import * as VscIcons from "react-icons/vsc";
import * as FaIcons from "react-icons/fa";
import { withTranslation } from 'react-i18next';
import home from '../assets/AdminImg/homeassistant.svg';
import prConfig from '../assets/AdminImg/ProductConfiguration.svg';
import facEvl from '../assets/AdminImg/FacilitatorEvaluator.svg';
import suspTxn from '../assets/AdminImg/AdminTransactions.svg';
import vkc from '../assets/AdminImg/KYCVerification.svg';
import prod from '../assets/AdminImg/product.svg';
import a4 from '../assets/AdminImg/CustomerSupport.svg';
import a9 from '../assets/AdminImg/ProductConfiguration.svg';
import $ from 'jquery';
import ViewallLoans from '../assets/img/ViewAllLoans2.svg';
import getAssociatedPermissions from '../CommonFunction.js';
import Tooltip from "@material-ui/core/Tooltip";
import { confirmAlert } from 'react-confirm-alert';
import { BASEURL } from '../assets/baseURL';
import a7 from '../assets/AdminImg/BulkRegistration.svg';
class SystemUserSidebar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            pmType: "",
            userType: "",
            partnerName: "",
            workFlowReadPermissions: false,
            checkerPendingOptPermissions: false,
            rolemgmtPermissions: false,
            supplierPermissions: false,
            jEPermissions: false,
            pmPerformancePermissions: false,
            monitorViewPermissions: false,
            rolePermissions: []
        }
    }
    componentDidMount() {
        this.setState({ userType: sessionStorage.getItem("userType") })

        if (sessionStorage.getItem('pmDefault') === "0") {
            this.setState({ pmType: "pmSystemUser" }); // Update state using setState
        } else {
            this.setState({ pmType: "platformSysUser" }); // Update state using setState
        }

        var isRoles = sessionStorage.getItem('isRoles');
        console.log(isRoles)

        const storedPartnerName = sessionStorage.getItem('partnerName');
        if (storedPartnerName) {
            this.setState({ partnerName: storedPartnerName });
        } else {
            this.getAllPartners();
        }
    }
    componentDidUpdate(prevProps, prevState) {
        // Check if rolePermissions props have changed
        var storedArrayStringJSON = sessionStorage.getItem("rolePermData");
        var storedArray = JSON.parse(storedArrayStringJSON);
        console.log(storedArray);

        // Check if storedArray exists and is not empty
        if (storedArray && storedArray.length > 0) {
            storedArray.forEach(element => {
                if (element.rolename === "WF_READ_INFO" && !prevState.workFlowReadPermissions) {
                    console.log(element.permissions);
                    this.setState({ workFlowReadPermissions: true }, () => {
                        console.log(this.state.workFlowReadPermissions);
                    });
                }
                // WF_UPDATE_INFO_CHECKER
                if (element.rolename === "VIEW_OPTNS_CHECKER" && !prevState.checkerPendingOptPermissions) {
                    console.log(element.permissions);
                    this.setState({ checkerPendingOptPermissions: true }, () => {
                        console.log(this.state.checkerPendingOptPermissions);
                    });
                }
                if (element.rolename === "USR_ROLE_MGMT_MAKER" && !prevState.rolemgmtPermissions) {
                    console.log(element.permissions);
                    this.setState({ rolemgmtPermissions: true }, () => {
                        console.log(this.state.rolemgmtPermissions);
                    });
                }
                if (element.rolename === "SUPPLIER_DETAILS" && !prevState.supplierPermissions) {
                    console.log(element.permissions);
                    this.setState({ supplierPermissions: true }, () => {
                        console.log(this.state.supplierPermissions);
                    });
                }
                if (element.rolename === "JE_DETAILS" && !prevState.jEPermissions) {
                    console.log(element.permissions);
                    this.setState({ jEPermissions: true }, () => {
                        console.log(this.state.jEPermissions);
                    });
                }
                if (element.rolename === "PM_PERFORMANCE" && !prevState.pmPerformancePermissions) {
                    console.log(element.permissions);
                    this.setState({ pmPerformancePermissions: true }, () => {
                        console.log(this.state.pmPerformancePermissions);
                    });
                }
                if (element.rolename === "MONITORING_OPTN_VIEW" && !prevState.monitorViewPermissions) {
                    console.log(element.permissions);
                    this.setState({ monitorViewPermissions: true }, () => {
                        console.log(this.state.monitorViewPermissions);
                    });
                }
            });
        } else {
            // If storedArray is not available yet, wait and check again
            setTimeout(() => {
                this.componentDidUpdate(prevProps, prevState);
            }, 1000); // Adjust the timeout value as needed
        }
    }

    getAllPartners = () => {
        fetch(BASEURL + '/usrmgmt/getallpartners', {
            headers: {
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            }
        }).then((Response) => {
            return Response.json();
        })
            .then((resdata) => {
                if (resdata.status == 'Success' || 'SUCCESS' || 'success') {
                    console.log(resdata);
                    // 
                    if (resdata.msgdata) {
                        resdata.msgdata.forEach(element => {
                            this.setState({ partnerName: element.partnername })
                            sessionStorage.setItem('partnerName', element.partnername);
                        });
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
            .catch((error) => {
                console.log(error)
            })
    }
    roleMgmt = () => {
        if (this.state.userType === "1") {
            $(".roles").show()
        }
        else {
            $(".pmroles").show()
        }
    }
    prdtCreaClick = () => {
        $(".prdDef").show();
    }
    rgrievanceMgmt = () => {
        $(".grivMgm").show()
    }
    render() {
        const { t } = this.props;
        const { pmType, workFlowReadPermissions,
            checkerPendingOptPermissions,
            rolemgmtPermissions,
            jEPermissions,
            pmPerformancePermissions,
            monitorViewPermissions,
            supplierPermissions } = this.state;
        console.log(pmType)
        return (
            <nav className="sidenav navbar navbar-vertical p-2 pt-4 fixed-left  navbar-expand-xs navbar-light d-block" id="sidebar-wrapper"
                style={{ backgroundColor: "#F7FCFF", marginBottom: "3px" }}>
                <div className="navbar-inner-admin" style={{ display: "block ruby" }}>
                    <div className="menu navbar-collapseOnSelect" expand="lg" id="sidenav-collapse-main">
                        <li className="nav-item" id="Pinfo" style={{ width: "170px", marginTop: "20px", marginBottom: "30px" }}>
                            {pmType === "platformSysUser" ?
                                <Tooltip title="Platform System User" >
                                    <p className="d-flex justify-content-center font-weight-bold text-dark" style={{ color: "white", marginTop: "-10px" }}>
                                        <FaIcons.FaUserAlt style={{ marginTop: "4px", width: "12px" }} />
                                        &nbsp;<span style={{ fontSize: "12px", wordWrap: "break-word", marginTop: "5px" }}>{sessionStorage.getItem("userID")}</span></p>
                                </Tooltip> :
                                pmType === "pmSystemUser" ?
                                    <Tooltip title={this.state.partnerName ? this.state.partnerName : sessionStorage.getItem("userID")} >
                                        <p className="d-flex justify-content-center font-weight-bold text-dark" style={{ color: "white", marginTop: "-10px" }}>
                                            <FaIcons.FaUserAlt style={{ marginTop: "4px", width: "12px" }} />
                                            &nbsp;<span style={{ fontSize: "12px", wordWrap: "break-word", marginTop: "5px" }}>
                                                {this.state.partnerName ? this.state.partnerName.substring(0, 6) + "..." :
                                                    sessionStorage.getItem("userID").substring(0, 6) + "..."}</span></p>
                                    </Tooltip> :
                                    ""
                            }
                        </li>

                        <div className="scrollbar" style={{
                            height: "67vh",
                            overflowY: 'auto',
                            scrollbarWidth: "thin",
                            marginTop: "-25px"
                        }}>
                            {pmType === "platformSysUser" ?
                                (<ul className="navbar-nav">
                                    <li className="" id='nav-items'>
                                        <Link to="/sysUserDashboard" style={{ textDecoration: "none" }}>
                                            <a className="nav-link" href="#" style={{ height: "35px" }}>
                                                <img src={home} style={{ paddingLeft: "12px" }} />
                                                <p className="text text-dark" style={{ paddingLeft: "10px" }}>{t('Dashboard')}</p>
                                            </a>
                                        </Link>
                                    </li>
                                    <div className='mb-2'></div>
                                    <li className="" id='nav-items'>
                                        <Link to="/facEvlList" style={{ textDecoration: "none" }}>
                                            <a className="nav-link" href="#" style={{ height: "35px" }}>
                                                <img src={facEvl} style={{ paddingLeft: "12px" }} />
                                                <p className="text text-dark" style={{ paddingLeft: "10px" }}>Facilitator/Evaluator List</p>
                                            </a>
                                        </Link>
                                    </li>
                                    <div className='mb-2'></div>
                                    <li className="" id='nav-items'>
                                        <Link to="/pendingEntityList" style={{ textDecoration: "none" }}>
                                            <a className="nav-link" style={{ height: "35px" }}>
                                                <FaIcons.FaListUl style={{ color: "#222c70", fontSize: "23px" }} />
                                                <p className="text text-dark" style={{ paddingLeft: "10px" }}>{t('Entity List')}</p>
                                            </a>
                                        </Link>
                                    </li>
                                    <div className='mb-2'></div>
                                    <li className="grievanceMgmtClick" id='nav-items' onClick={this.rgrievanceMgmt}>
                                        <a className="nav-link" href="#" style={{ height: "35px" }}>
                                            <img src={a4} style={{ paddingLeft: "14px" }} />
                                            <p className="text text-dark" style={{ paddingLeft: "12px", width: "186px" }}>{t('Grievance Management')}</p>
                                        </a>
                                    </li>
                                    <li style={{ paddingLeft: "20px", display: "none" }} id='nav-items' className="grivMgm">
                                        <Link to="/sysCusSupport" style={{ textDecoration: "none" }}>
                                            <a className="nav-link">
                                                <FaIcons.FaListAlt style={{ color: "#222c70" }} />&nbsp;
                                                <p className="text text-dark" style={{ marginTop: "-5px" }}>{t('Grievance Support')}</p>
                                            </a>
                                        </Link>
                                    </li>
                                    <li style={{ paddingLeft: "20px", display: "none" }} id='nav-items' className="grivMgm">
                                        <Link to="/grievanceReport" style={{ textDecoration: "none" }}>
                                            <a className="nav-link">
                                                <FaIcons.FaListAlt style={{ color: "#222c70" }} />&nbsp;
                                                <p className="text text-dark" style={{ marginTop: "-5px" }}>{t('Grievance Report')}</p>
                                            </a>
                                        </Link>
                                    </li>
                                    {rolemgmtPermissions === true ?
                                        <>
                                            <div className='mb-2'></div>
                                            <li className="roleMgmtClick" id='nav-items' onClick={this.roleMgmt}>
                                                <a className="nav-link" href="#" style={{ height: "35px" }}>
                                                    <FaIcons.FaSlidersH style={{ color: "#222c70", marginLeft: "4px", marginTop: "5px" }} />&nbsp;
                                                    <p className="text text-dark" style={{ paddingLeft: "15px" }}>{t('Role Management')}</p>
                                                </a>
                                            </li>
                                            <li style={{ paddingLeft: "20px", display: "none" }} id='nav-items' className="roles">
                                                <Link to="/manageClients" style={{ textDecoration: "none" }}>
                                                    <a className="nav-link">
                                                        <FaIcons.FaPeopleCarry style={{ color: "#222c70" }} />&nbsp;
                                                        <p className="text text-dark pr-5" style={{ marginTop: "-5px" }}>{t('Manage Clients')}</p>
                                                    </a>
                                                </Link>
                                            </li>
                                            <li style={{ paddingLeft: "20px", marginTop: "-10px", display: "none" }} id='nav-items' className="roles">
                                                <Link to="/assignRole" style={{ textDecoration: "none" }}>
                                                    <a className="nav-link" style={{ cursor: "pointer" }}>
                                                        <FaIcons.FaUserCheck style={{ color: "#222c70" }} />&nbsp;
                                                        <p className="text text-dark pr-5" style={{ marginTop: "-5px" }}>{t('Manage Roles')}</p>
                                                    </a>
                                                </Link>
                                            </li>
                                            <li style={{ paddingLeft: "20px", marginTop: "-10px", display: "none" }} id='nav-items' className="roles">
                                                <Link to="/defineRole" style={{ textDecoration: "none" }}>
                                                    <a className="nav-link">
                                                        <FaIcons.FaListAlt style={{ color: "#222c70" }} />&nbsp;
                                                        <p className="text text-dark pr-5" style={{ marginTop: "-5px" }}>{t('View All Roles')}</p>
                                                    </a>
                                                </Link>
                                            </li>
                                            <li style={{ paddingLeft: "20px", marginTop: "-10px", display: "none" }} id='nav-items' className="roles">
                                                <Link to="/managePermissions" style={{ textDecoration: "none" }}>
                                                    <a className="nav-link">
                                                        <FaIcons.FaUserEdit style={{ color: "#222c70" }} />&nbsp;
                                                        <p className="text text-dark pr-5" style={{ marginTop: "-5px", width: "max-content" }}>{t('Manage Permissions')}</p>
                                                    </a>
                                                </Link>
                                            </li>
                                        </> : ""}

                                    {checkerPendingOptPermissions === true ?
                                        <>
                                            <div className='mb-2'></div>
                                            <li className="" id='nav-items'>
                                                <Link to="/checkerPendingList" style={{ textDecoration: "none" }}>
                                                    <a className="nav-link" href="#" style={{ height: "35px" }}>
                                                        <FaIcons.FaClipboard style={{ color: "#222c70", marginLeft: "4px", marginTop: "5px" }} />&nbsp;
                                                        <p className="text text-dark" style={{ paddingLeft: "12px" }}>{t('Pending Operations')}</p>
                                                    </a>
                                                </Link>
                                            </li>
                                        </> : ""
                                    }
                                    <div className='mb-2'></div>
                                    <li className="" id='nav-items'>
                                        <Link to="/reconcilationList" style={{ textDecoration: "none" }}>
                                            <a className="nav-link" style={{ height: "35px" }}>
                                                <FaIcons.FaRegFileAlt style={{ color: "#222c70", fontSize: "23px" }} />
                                                <p className="text text-dark" style={{ paddingLeft: "13px" }}>{t('Payment Reconciliation')}</p>
                                            </a>
                                        </Link>
                                    </li>
                                    <div className='mb-2'></div>
                                    <li className="" id='nav-items'>
                                        <Link to="/suspenceTransaction" style={{ textDecoration: "none" }}>
                                            <a className="nav-link" style={{ height: "35px" }}>
                                                <img src={suspTxn} style={{ paddingLeft: "12px" }} />
                                                <p className="text text-dark" style={{ paddingLeft: "10px" }}>{t('Suspense Transaction')}</p>
                                            </a>
                                        </Link>
                                    </li>
                                    <div className='mb-2'></div>
                                    <li className="" id='nav-items'>
                                        <Link to="/kycVerification" style={{ textDecoration: "none" }}>
                                            <a className="nav-link" style={{ height: "35px" }}>
                                                <img src={vkc} style={{ paddingLeft: "13px" }} />
                                                <p className="text text-dark" style={{ paddingLeft: "10px" }}>{t('VKYC Verification')}</p>
                                            </a>
                                        </Link>
                                    </li>
                                    <div className='mb-2'></div>
                                    <li className="prodCreationClick" id='nav-items'>
                                        <Link to="/productDefinition" style={{ textDecoration: "none" }}>
                                            <a className="nav-link" style={{ height: "35px" }}>
                                                <img src={prConfig} style={{ paddingLeft: "8px" }} />
                                                <p className="text text-dark" style={{ paddingLeft: "14px" }}>{t('Product List')}</p>
                                            </a>
                                        </Link>
                                    </li>
                                    {workFlowReadPermissions === true ?
                                        <>
                                            <div className='mb-2'></div>
                                            <li className="prodCreationClick" id='nav-items'>
                                                <Link to="/getWorkflow" style={{ textDecoration: "none" }}>
                                                    <a className="nav-link" style={{ height: "35px" }}>
                                                        <FaIcons.FaRegIdCard style={{ color: "#222c70", fontSize: "23px" }} />
                                                        <p className="text text-dark" style={{ paddingLeft: "14px" }}>{t('Workflow List')}</p>
                                                    </a>
                                                </Link>
                                            </li>
                                        </> : ""
                                    }
                                    <div className='mb-2'></div>
                                    <li className="" id='nav-items'>
                                        <Link to="/wkflowhierarchy" style={{ textDecoration: "none" }}>
                                            <a className="nav-link" style={{ height: "35px" }}>
                                                <FaIcons.FaIndent style={{ color: "#222c70", fontSize: "23px" }} />
                                                <p className="text text-dark" style={{ paddingLeft: "14px" }}>{t('Approver Hierarchy')}</p>
                                            </a>
                                        </Link>
                                    </li>
                                    {supplierPermissions === true ?
                                        <>
                                            <div className='mb-2'></div>
                                            <li className="prodCreationClick" id='nav-items'>
                                                <Link to="/supplierList" style={{ textDecoration: "none" }}>
                                                    <a className="nav-link" style={{ height: "35px" }}>
                                                        <FaIcons.FaListUl style={{ color: "#222c70", fontSize: "23px" }} />
                                                        <p className="text text-dark" style={{ paddingLeft: "14px" }}>{t('Supplier List')}</p>
                                                    </a>
                                                </Link>
                                            </li>
                                        </> : ""
                                    }
                                    <div className='mb-2'></div>
                                    <li className="" id='nav-items'>
                                        <Link to="/sysRejectedLoans" style={{ textDecoration: "none" }}>
                                            <a className="nav-link" style={{ height: "35px" }}>
                                                <img src={ViewallLoans} style={{ paddingLeft: "8px" }} />
                                                <p className="text text-dark" style={{ paddingLeft: "17px" }}>{t('Loan Requests Review')}</p>
                                            </a>
                                        </Link>
                                    </li>
                                    <div className='mb-2'></div>
                                    <li className="" id='nav-items'>
                                        <Link to="/platformPsign" style={{ textDecoration: "none" }}>
                                            <a className="nav-link" style={{ height: "35px" }}>
                                                <FaIcons.FaRegListAlt style={{ marginTop: "5px", color: "#222c70" }} />
                                                <p className="text text-dark" style={{ paddingLeft: "17px" }}>{t('Platform Signing')}</p>
                                            </a>
                                        </Link>
                                    </li>
                                    <div className='mb-2'></div>
                                    <li className="" id='nav-items'>
                                        <Link to="/ovdPendingStatus" style={{ textDecoration: "none" }}>
                                            <a className="nav-link" style={{ height: "35px" }}>
                                                <FaIcons.FaClipboardList style={{ marginTop: "5px", color: "#222c70" }} />
                                                <p className="text text-dark" style={{ paddingLeft: "17px" }}>{t('Document Verification')}</p>
                                            </a>
                                        </Link>
                                    </li>
                                    <div className='mb-2'></div>
                                    <li className="" id='nav-items'>
                                        <Link to="/glAccountBlc" style={{ textDecoration: "none" }}>
                                            <a className="nav-link" style={{ height: "35px" }}>
                                                <FaIcons.FaMoneyCheck style={{ marginTop: "5px", color: "#222c70" }} />
                                                <p className="text text-dark" style={{ paddingLeft: "17px" }}>{t('GL Account Balance List')}</p>
                                            </a>
                                        </Link>
                                    </li>
                                    <div className='mb-2'></div>
                                    <li className="" id='nav-items'>
                                        <Link to="/facReassign" style={{ textDecoration: "none" }}>
                                            <a className="nav-link" style={{ height: "35px" }}>
                                                <FaIcons.FaTasks style={{ marginTop: "5px", color: "#222c70" }} />
                                                <p className="text text-dark" style={{ paddingLeft: "17px" }}>{t('Loan Assignment')}</p>
                                            </a>
                                        </Link>
                                    </li>
                                    <div className='mb-2'></div>
                                    <li className="" id='nav-items'>
                                        <Link to="/jlgverify" style={{ textDecoration: "none" }}>
                                            <a className="nav-link" href="#" style={{ height: "38px" }}>
                                                <FaIcons.FaListUl style={{ color: "#222C70", marginTop: "2px" }} />
                                                <p className="text text-dark" style={{ paddingLeft: "19px", marginTop: "-3px" }}>{t('JLG Group List')}</p>
                                            </a>
                                        </Link>
                                    </li>
                                    <div className='mb-2'></div>
                                    <li className="" id='nav-items'>
                                        <Link to="/preEvlVerify" style={{ textDecoration: "none" }}>
                                            <a className="nav-link" href="#" style={{ height: "38px" }}>
                                                <FaIcons.FaPollH style={{ color: "#222C70", marginTop: "2px" }} />
                                                <p className="text text-dark" style={{ paddingLeft: "19px", marginTop: "-3px", width: "max-content" }}>{t('Loan Request Verification')}</p>
                                            </a>
                                        </Link>
                                    </li>
                                    <div className='mb-2'></div>
                                    <li className="" id='nav-items'>
                                        <Link to="/kycSessionList" style={{ textDecoration: "none" }}>
                                            <a className="nav-link" href="#" style={{ height: "38px" }}>
                                                <FaIcons.FaFileVideo style={{ color: "#222C70", marginTop: "2px" }} />
                                                <p className="text text-dark" style={{ paddingLeft: "19px", marginTop: "-3px" }}>{t('VKYC Session Audit')}</p>
                                            </a>
                                        </Link>
                                    </li>
                                    <div className='mb-2'></div>
                                    <li className="" id='nav-items'>
                                        <Link to="/BulkUploadUsers" style={{ textDecoration: "none" }}>
                                            <a className="nav-link" href="#" style={{ height: "35px" }}>
                                                <img src={a7} style={{ paddingLeft: "8px" }} />
                                                <p className="text text-dark" style={{ paddingLeft: "17px" }}>{t('Bulk Registration')}</p>
                                            </a>
                                        </Link>
                                    </li>
                                    {pmPerformancePermissions === true ?
                                        <>
                                            <div className='mb-2'></div>
                                            <li className="" id='nav-items'>
                                                <Link to="/pmPerformance" style={{ textDecoration: "none" }}>
                                                    <a className="nav-link" href="#" style={{ height: "35px" }}>
                                                        <img src={a4} style={{ paddingLeft: "8px" }} />
                                                        <p className="text text-dark" style={{ paddingLeft: "17px" }}>{t('Partner Performance')}</p>
                                                    </a>
                                                </Link>
                                            </li>
                                        </> : ""}
                                    <div className='mb-2'></div>
                                    <li className="" id='nav-items'>
                                        <Link to="/disbursementApproval" style={{ textDecoration: "none" }}>
                                            <a className="nav-link" href="#" style={{ height: "35px" }}>
                                                <FaIcons.FaShoppingCart style={{ color: "#222C70", marginTop: "5px" }} />
                                                <p className="text text-dark" style={{ paddingLeft: "17px" }}>{t('Disbursement Approval')}</p>
                                            </a>
                                        </Link>
                                    </li>
                                    {monitorViewPermissions === true &&
                                        <>
                                            <div className='mb-2'></div>
                                            <li className="" id='nav-items'>
                                                <Link to="/schedulerMonitoring" style={{ textDecoration: "none" }}>
                                                    <a className="nav-link" href="#" style={{ height: "35px" }}>
                                                        <FaIcons.FaVoteYea style={{ color: "#222C70", marginTop: "5px" }} />
                                                        <p className="text text-dark" style={{ paddingLeft: "17px" }}>{t('Scheduler Monitoring')}</p>
                                                    </a>
                                                </Link>
                                            </li>
                                        </>}
                                    {jEPermissions === true ?
                                        <>
                                            <div className='mb-2'></div>
                                            <li className="" id='nav-items'>
                                                <Link to="/journalEntries" style={{ textDecoration: "none" }}>
                                                    <a className="nav-link" href="#" style={{ height: "35px" }}>
                                                        <FaIcons.FaElementor style={{ color: "#222C70", marginTop: "5px" }} />
                                                        <p className="text text-dark" style={{ paddingLeft: "17px" }}>{t('Journal Entries')}</p>
                                                    </a>
                                                </Link>
                                            </li>
                                        </> : ""
                                    }
                                </ul>) :
                                pmType === "pmSystemUser" ?
                                    (<ul className="navbar-nav">
                                        <li className="" id='nav-items'>
                                            <Link to="/sysUserDashboard" style={{ textDecoration: "none" }}>
                                                <a className="nav-link" href="#" style={{ height: "35px" }}>
                                                    <img src={home} style={{ paddingLeft: "12px" }} />
                                                    <p className="text text-dark" style={{ paddingLeft: "10px" }}>{t('Dashboard')}</p>
                                                </a>
                                            </Link>
                                        </li>
                                        {rolemgmtPermissions === true ?
                                            <>
                                                <div className='mb-2'></div>
                                                <li className="roleMgmtClick" id='nav-items' onClick={this.roleMgmt}>
                                                    <a className="nav-link" href="#" style={{ height: "35px" }}>
                                                        <FaIcons.FaSlidersH style={{ color: "#222c70", marginLeft: "4px", marginTop: "5px" }} />&nbsp;
                                                        <p className="text text-dark" style={{ paddingLeft: "12px" }}>{t('Role Management')}</p>
                                                    </a>
                                                </li>
                                                <li style={{ paddingLeft: "20px", display: "none" }} id='nav-items' className="roles">
                                                    <Link to="/manageClients" style={{ textDecoration: "none" }}>
                                                        <a className="nav-link">
                                                            <FaIcons.FaPeopleCarry style={{ color: "#222c70" }} />&nbsp;
                                                            <p className="text text-dark pr-5" style={{ marginTop: "-5px" }}>{t('Manage Clients')}</p>
                                                        </a>
                                                    </Link>
                                                </li>
                                                <li style={{ paddingLeft: "20px", marginTop: "-10px", display: "none" }} id='nav-items' className="roles">
                                                    <Link to="/assignRole" style={{ textDecoration: "none" }}>
                                                        <a className="nav-link" style={{ cursor: "pointer" }}>
                                                            <FaIcons.FaUserCheck style={{ color: "#222c70" }} />&nbsp;
                                                            <p className="text text-dark pr-5" style={{ marginTop: "-5px" }}>{t('Manage Roles')}</p>
                                                        </a>
                                                    </Link>
                                                </li>
                                                <li style={{ paddingLeft: "20px", marginTop: "-10px", display: "none" }} id='nav-items' className="roles">
                                                    <Link to="/defineRole" style={{ textDecoration: "none" }}>
                                                        <a className="nav-link">
                                                            <FaIcons.FaListAlt style={{ color: "#222c70" }} />&nbsp;
                                                            <p className="text text-dark pr-5" style={{ marginTop: "-5px" }}>{t('View All Roles')}</p>
                                                        </a>
                                                    </Link>
                                                </li>
                                                <li style={{ paddingLeft: "20px", marginTop: "-10px", display: "none" }} id='nav-items' className="roles">
                                                    <Link to="/managePermissions" style={{ textDecoration: "none" }}>
                                                        <a className="nav-link">
                                                            <FaIcons.FaUserEdit style={{ color: "#222c70" }} />&nbsp;
                                                            <p className="text text-dark pr-5" style={{ marginTop: "-5px", width: "max-content" }}>{t('Manage Permissions')}</p>
                                                        </a>
                                                    </Link>
                                                </li>
                                            </> : ""}
                                        <div className='mb-2'></div>
                                        <li className="" id='nav-items'>
                                            <Link to="/facEvlList" style={{ textDecoration: "none" }}>
                                                <a className="nav-link" href="#" style={{ height: "35px" }}>
                                                    <img src={facEvl} style={{ paddingLeft: "12px" }} />
                                                    <p className="text text-dark" style={{ paddingLeft: "9px" }}>Facilitator List</p>
                                                </a>
                                            </Link>
                                        </li>
                                        {workFlowReadPermissions === true ?
                                            <>
                                                <div className='mb-2'></div>
                                                <li className="prodCreationClick" id='nav-items'>
                                                    <Link to="/getWorkflow" style={{ textDecoration: "none" }}>
                                                        <a className="nav-link" style={{ height: "35px" }}>
                                                            <FaIcons.FaRegIdCard style={{ color: "#222c70", fontSize: "23px" }} />
                                                            <p className="text text-dark" style={{ paddingLeft: "12px" }}>{t('Workflow List')}</p>
                                                        </a>
                                                    </Link>
                                                </li>
                                            </> : ""
                                        }
                                        <div className='mb-2'></div>
                                        <li className="prodCreationClick" id='nav-items'>
                                            <Link to="/productDefinition" style={{ textDecoration: "none" }}>
                                                <a className="nav-link" style={{ height: "35px" }}>
                                                    <img src={prConfig} style={{ paddingLeft: "8px" }} />
                                                    <p className="text text-dark" style={{ paddingLeft: "14px" }}>{t('Product List')}</p>
                                                </a>
                                            </Link>
                                        </li>
                                        {/* <div className='mb-2'></div>
                                        <li className="" id='nav-items'>
                                            <Link to="/loanMonitoring" style={{ textDecoration: "none" }}>
                                                <a className="nav-link" style={{ height: "35px" }}>
                                                    <img src={ViewallLoans} style={{ paddingLeft: "8px" }} />
                                                    <p className="text text-dark" style={{ paddingLeft: "17px" }}>Loan Monitoring</p>
                                                </a>
                                            </Link>
                                        </li> */}
                                        {checkerPendingOptPermissions === true ?
                                            <>
                                                <div className='mb-2'></div>
                                                <li className="" id='nav-items'>
                                                    <Link to="/checkerPendingList" style={{ textDecoration: "none" }}>
                                                        <a className="nav-link" href="#" style={{ height: "35px" }}>
                                                            <FaIcons.FaClipboard style={{ color: "#222c70", marginLeft: "4px", marginTop: "5px" }} />&nbsp;
                                                            <p className="text text-dark" style={{ paddingLeft: "11px" }}>{t('Pending Operations')}</p>
                                                        </a>
                                                    </Link>
                                                </li>
                                            </> : ""
                                        }
                                        <div className='mb-2'></div>
                                        <li className="" id='nav-items'>
                                            <Link to="/platformPsign" style={{ textDecoration: "none" }}>
                                                <a className="nav-link" style={{ height: "35px" }}>
                                                    <FaIcons.FaRegListAlt style={{ marginTop: "5px", color: "#222c70" }} />
                                                    <p className="text text-dark" style={{ paddingLeft: "19px" }}>{t('Platform Signing')}</p>
                                                </a>
                                            </Link>
                                        </li>
                                        <div className='mb-2'></div>
                                        <li className="grievanceMgmtClick" id='nav-items' onClick={this.rgrievanceMgmt}>
                                            <a className="nav-link" href="#" style={{ height: "35px" }}>
                                                <img src={a4} style={{ paddingLeft: "14px" }} />
                                                <p className="text text-dark" style={{ paddingLeft: "13px", width: "186px" }}>{t('Grievance Management')}</p>
                                            </a>
                                        </li>
                                        <li style={{ paddingLeft: "20px", display: "none" }} id='nav-items' className="grivMgm">
                                            <Link to="/sysCusSupport" style={{ textDecoration: "none" }}>
                                                <a className="nav-link">
                                                    <FaIcons.FaListAlt style={{ color: "#222c70" }} />&nbsp;
                                                    <p className="text text-dark" style={{ marginTop: "-5px" }}>{t('Grievance Support')}</p>
                                                </a>
                                            </Link>
                                        </li>
                                        <li style={{ paddingLeft: "20px", display: "none" }} id='nav-items' className="grivMgm">
                                            <Link to="/grievanceReport" style={{ textDecoration: "none" }}>
                                                <a className="nav-link">
                                                    <FaIcons.FaListAlt style={{ color: "#222c70" }} />&nbsp;
                                                    <p className="text text-dark" style={{ marginTop: "-5px" }}>{t('Grievance Report')}</p>
                                                </a>
                                            </Link>
                                        </li>
                                        <div className='mb-2'></div>
                                        <li className="" id='nav-items'>
                                            <Link to="/ovdPendingStatus" style={{ textDecoration: "none" }}>
                                                <a className="nav-link" style={{ height: "35px" }}>
                                                    <FaIcons.FaClipboardList style={{ marginTop: "5px", color: "#222c70" }} />
                                                    <p className="text text-dark" style={{ paddingLeft: "21px", width: "max-content" }}>{t('Document Verification')}</p>
                                                </a>
                                            </Link>
                                        </li>
                                        <div className='mb-2'></div>
                                        <li className="" id='nav-items'>
                                            <Link to="/kycVerification" style={{ textDecoration: "none" }}>
                                                <a className="nav-link" style={{ height: "35px" }}>
                                                    <img src={vkc} style={{ paddingLeft: "13px" }} />
                                                    <p className="text text-dark" style={{ paddingLeft: "15px" }}>{t('VKYC Verification')}</p>
                                                </a>
                                            </Link>
                                        </li>
                                        <div className='mb-2'></div>
                                        <li className="" id='nav-items'>
                                            <Link to="/kycSessionList" style={{ textDecoration: "none" }}>
                                                <a className="nav-link" href="#" style={{ height: "38px" }}>
                                                    <FaIcons.FaFileVideo style={{ color: "#222C70", marginTop: "2px" }} />
                                                    <p className="text text-dark" style={{ paddingLeft: "23px", marginTop: "-3px" }}>{t('VKYC Session Audit')}</p>
                                                </a>
                                            </Link>
                                        </li>
                                        {supplierPermissions === true ?
                                            <>
                                                <div className='mb-2'></div>
                                                <li className="prodCreationClick" id='nav-items'>
                                                    <Link to="/supplierList" style={{ textDecoration: "none" }}>
                                                        <a className="nav-link" style={{ height: "35px" }}>
                                                            <FaIcons.FaListUl style={{ color: "#222c70", fontSize: "23px" }} />
                                                            <p className="text text-dark" style={{ paddingLeft: "14px" }}>{t('Supplier List')}</p>
                                                        </a>
                                                    </Link>
                                                </li>
                                            </> : ""
                                        }
                                        <li className="" id='nav-items'>
                                            <Link to="/facReassign" style={{ textDecoration: "none" }}>
                                                <a className="nav-link" style={{ height: "35px" }}>
                                                    <FaIcons.FaTasks style={{ marginTop: "5px", color: "#222c70" }} />
                                                    <p className="text text-dark" style={{ paddingLeft: "24px" }}>{t('Loan Assignment')}</p>
                                                </a>
                                            </Link>
                                        </li>
                                        <div className='mb-2'></div>
                                        <li className="" id='nav-items'>
                                            <Link to="/jlgverify" style={{ textDecoration: "none" }}>
                                                <a className="nav-link" href="#" style={{ height: "38px" }}>
                                                    <FaIcons.FaListUl style={{ color: "#222C70", marginTop: "2px" }} />
                                                    <p className="text text-dark" style={{ paddingLeft: "25px", marginTop: "-3px" }}>{t('JLG Group List')}</p>
                                                </a>
                                            </Link>
                                        </li>
                                        <li className="" id='nav-items'>
                                            <Link to="/sysRejectedLoans" style={{ textDecoration: "none" }}>
                                                <a className="nav-link" style={{ height: "35px" }}>
                                                    <img src={ViewallLoans} style={{ paddingLeft: "8px" }} />
                                                    <p className="text text-dark" style={{ paddingLeft: "20px" }}>{t('Loan Requests Review')}</p>
                                                </a>
                                            </Link>
                                        </li>
                                        <div className='mb-2'></div>
                                        <li className="" id='nav-items'>
                                            <Link to="/preEvlVerify" style={{ textDecoration: "none" }}>
                                                <a className="nav-link" href="#" style={{ height: "38px" }}>
                                                    <FaIcons.FaPollH style={{ color: "#222C70", marginTop: "2px" }} />
                                                    <p className="text text-dark" style={{ paddingLeft: "25px", marginTop: "-3px", width: "max-content" }}>{t('Loan Request Verification')}</p>
                                                </a>
                                            </Link>
                                        </li>
                                        <li className="" id='nav-items'>
                                            <Link to="/disbursementApproval" style={{ textDecoration: "none" }}>
                                                <a className="nav-link" href="#" style={{ height: "35px" }}>
                                                    <FaIcons.FaShoppingCart style={{ color: "#222C70", marginTop: "5px" }} />
                                                    <p className="text text-dark" style={{ paddingLeft: "25px" }}>{t('Disbursement Approval')}</p>
                                                </a>
                                            </Link>
                                        </li>
                                        <div className='mb-2'></div>
                                        <li className="" id='nav-items'>
                                            <Link to="/wkflowhierarchy" style={{ textDecoration: "none" }}>
                                                <a className="nav-link" style={{ height: "35px" }}>
                                                    <FaIcons.FaIndent style={{ color: "#222c70", fontSize: "23px" }} />
                                                    <p className="text text-dark" style={{ paddingLeft: "20px" }}>{t('Approver Hierarchy')}</p>
                                                </a>
                                            </Link>
                                        </li>
                                        <div className='mb-2'></div>
                                        <li className="" id='nav-items'>
                                            <Link to="/reconcilationList" style={{ textDecoration: "none" }}>
                                                <a className="nav-link" style={{ height: "35px" }}>
                                                    <FaIcons.FaRegFileAlt style={{ color: "#222c70", fontSize: "23px" }} />
                                                    <p className="text text-dark" style={{ paddingLeft: "20px" }}>{t('Payment Reconciliation')}</p>
                                                </a>
                                            </Link>
                                        </li>
                                        <div className='mb-2'></div>
                                        <li className="" id='nav-items'>
                                            <Link to="/suspenceTransaction" style={{ textDecoration: "none" }}>
                                                <a className="nav-link" style={{ height: "35px" }}>
                                                    <img src={suspTxn} style={{ paddingLeft: "12px" }} />
                                                    <p className="text text-dark" style={{ paddingLeft: "19px" }}>{t('Suspense Transaction')}</p>
                                                </a>
                                            </Link>
                                        </li>
                                        <div className='mb-2'></div>
                                        <li className="" id='nav-items'>
                                            <Link to="/glAccountBlc" style={{ textDecoration: "none" }}>
                                                <a className="nav-link" style={{ height: "35px" }}>
                                                    <FaIcons.FaMoneyCheck style={{ marginTop: "5px", color: "#222c70" }} />
                                                    <p className="text text-dark" style={{ paddingLeft: "29px" }}>{t('GL Account Balance List')}</p>
                                                </a>
                                            </Link>
                                        </li>
                                        {pmPerformancePermissions === true ?
                                            <>
                                                <div className='mb-2'></div>
                                                <li className="" id='nav-items'>
                                                    <Link to="/pmPerformance" style={{ textDecoration: "none" }}>
                                                        <a className="nav-link" href="#" style={{ height: "35px" }}>
                                                            <img src={a4} style={{ paddingLeft: "8px" }} />
                                                            <p className="text text-dark" style={{ paddingLeft: "17px" }}>{t('Partner Performance')}</p>
                                                        </a>
                                                    </Link>
                                                </li>
                                            </> : ""}
                                        <div className='mb-2'></div>
                                        <li className="" id='nav-items'>
                                            <Link to="/BulkUploadUsers" style={{ textDecoration: "none" }}>
                                                <a className="nav-link" href="#" style={{ height: "35px" }}>
                                                    <img src={a7} style={{ paddingLeft: "8px" }} />
                                                    <p className="text text-dark" style={{ paddingLeft: "28px" }}>{t('Bulk Registration')}</p>
                                                </a>
                                            </Link>
                                        </li>
                                        {monitorViewPermissions === true &&
                                            <>
                                                <div className='mb-2'></div>
                                                <li className="" id='nav-items'>
                                                    <Link to="/schedulerMonitoring" style={{ textDecoration: "none" }}>
                                                        <a className="nav-link" href="#" style={{ height: "35px" }}>
                                                            <FaIcons.FaVoteYea style={{ color: "#222C70", marginTop: "5px" }} />
                                                            <p className="text text-dark" style={{ paddingLeft: "17px" }}>{t('Scheduler Monitoring')}</p>
                                                        </a>
                                                    </Link>
                                                </li>
                                            </>}
                                    </ul>) :
                                    ""
                            }
                        </div>

                    </div>
                </div>
            </nav>
        )
    }
}

export default withTranslation()(SystemUserSidebar)


