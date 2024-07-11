import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import $ from 'jquery';
import { BASEURL } from '../assets/baseURL';
import FacilitatorSidebar from '../../SidebarFiles/FacilitatorSidebar';
import { withTranslation } from 'react-i18next';
import { FaAngleLeft, FaUserCheck, FaSearch, FaThLarge, FaBars, FaList, FaRegCreditCard } from 'react-icons/fa';
import dashboardIcon from '../assets/icon_dashboard.png';
import v1 from '../assets/All.png';
import v2 from '../assets/verfied.png';
import v3 from '../assets/notVerified.png';
import profileBatch from '../assets/borProfile.png';
import verified from '../assets/verification.png';
import Tooltip from "@material-ui/core/Tooltip";
import ReactPaginate from 'react-paginate';
import '../Borrower/Pagination.css';
import { confirmAlert } from "react-confirm-alert";
import Loader from '../Loader/Loader';
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { Button, ButtonGroup } from 'react-bootstrap';
// import ToggleButton from '@material-ui/lab/ToggleButton';
// import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';


var verificationStatusValue = 0;
export class BorrowerProfileVerification extends Component {
    constructor(props) {
        super(props)
        const savedView = sessionStorage.getItem('selectedView') || 'card';
        this.state = {
            borProfDetails: [],
            borProfData: [],
            attributetypeid: "",
            attributevalue: "",
            loanreqno: "",
            remark: "",
            verificationStatus: "0",

            offset: 0,
            loanOfferList: [],
            orgtableData: [],
            perPage: 9,
            currentPage: 0,
            pageCount: "",
            showLoader: false,
            searchTerm: '',
            filteredData: [],
            // viewFlagcard: false,
            // view: savedView,
            viewFlagcard: savedView === 'card',
            viewType: savedView,

        }
        this.getBorProfileInfo = this.getBorProfileInfo.bind(this);
        this.status = this.status.bind(this);

        // this.getBorProfile = this.getBorProfile.bind(this);
    }

    status = () => {
        verificationStatusValue = ""
        this.getBorProfileInfo();
    }
    status1 = () => {
        verificationStatusValue = 0
        this.getBorProfileInfo();

    }
    status2 = () => {
        verificationStatusValue = 1
        this.getBorProfileInfo();
    }
    componentDidMount() {
        this.getBorProfileInfo();
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
            filteredData: slice,
            borProfDetails: slice
        })
    }

    getBorProfileInfo() {
        this.setState({ showLoader: true })
        console.log(verificationStatusValue);
        fetch(BASEURL + `/lsp/getborprofileinfo?verificationstatus=${verificationStatusValue}`, {
            headers: {
                'Authorization': "Bearer " + sessionStorage.getItem('token')
            }
        })
            .then((Response) => {
                return Response.json();
            })
            .then((resdata) => {
                if (resdata.status == 'SUCCESS') {
                    this.setState({ showLoader: false })
                    console.log(resdata);
                    var list = resdata.msgdata;
                    list.reverse()
                    this.setState({ borProfDetails: list, filteredData: list })

                    //this.setState({ borProfDetails: resdata.msgdata });
                    this.setState({ loanreqno: resdata.msgdata[0].loanreqno });
                    this.setState({ remark: resdata.msgdata.remark })
                    console.log(this.state.remark)

                    console.log(this.state.borProfDetails)
                    var data = resdata.msgdata
                    console.log(data)
                    var slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
                    console.log(slice)

                    this.setState({
                        pageCount: Math.ceil(data.length / this.state.perPage),
                        orgtableData: data,
                        filteredData: slice,
                        borProfDetails: slice
                    })
                } else {
                    this.setState({ showLoader: false })
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
            .catch((error) => {
                console.log(error)
            })
    }

    // getBorProfile() {
    //     fetch(BASEURL + '/lsp/getborprofileinfo', {
    //         headers: {
    //             'Authorization': "Bearer " + sessionStorage.getItem('token')
    //         }
    //     })
    //         .then((Response) => {
    //             return Response.json();
    //         })
    //         .then((resdata) => {
    //             if (resdata.status == 'SUCCESS') {
    //                 console.log(resdata);
    //                 this.setState({ borProfData: resdata.msgdata });
    //             } else {
    //                 alert("Issue: " + resdata.message);
    //             }
    //         })
    // }

    verifyProfile(loanreqno, bormemmid, name) {
        console.log(loanreqno);
        sessionStorage.setItem("loanReqno", loanreqno);
        sessionStorage.setItem('Memmid', bormemmid);
        sessionStorage.setItem('borName', name)
        window.location = "/verifyBorProfile";
    }
    // searchInput() {
    //     const myTable = document.getElementById("myTable");
    //     console.log("before search");
    //     if (!myTable) return;
    //     console.log("inside search");

    //     const filter = document.getElementById("myInput").value.toUpperCase();
    //     const tr = myTable.getElementsByTagName("tr");

    //     for (let i = 1; i < tr.length; i++) { // Start at 1 to skip the header row
    //       const td = tr[i].getElementsByTagName("td")[0]; // Search in the first column
    //       if (td) {
    //         const textValue = td.textContent || td.innerHTML;
    //         tr[i].style.display = textValue.toUpperCase().indexOf(filter) > -1 ? "" : "none";
    //       }
    //     }
    //   }
    handleSearchChange = (event) => {
        const searchTerm = event.target.value;
        this.setState({ searchTerm }, () => {
            if (searchTerm === '') {
                // If search term is empty, reset filteredData to the original list
                this.setState({ filteredData: this.state.borProfDetails });
            }
        });
    };

    searchInput = () => {
        const { searchTerm, borProfDetails } = this.state;
        const filtered = borProfDetails.filter(profile =>
            profile.loanreqno.toLowerCase().includes(searchTerm.toLowerCase())
        );
        this.setState({ filteredData: filtered });
    };
    // handleSelect = (eventKey) => {
    //     this.setState({ view: eventKey });
    //     console.log("Selected view:", eventKey); // Handle view change logic here
    //     if (eventKey === "card") {
    //         this.setState({ viewFlagcard: true })
    //     }
    //     else if (eventKey === "list") {
    //         this.setState({ viewFlagcard: false })
    //     }
    // };

    handleViewChange = (event, newView) => {
        this.setState({ viewType: newView, viewFlagcard: newView === 'card' });
        sessionStorage.setItem('selectedView', newView);
        console.log("Selected view:", newView);
    };
    handleChange() {
        $('.text').toggle();
        $('#PImage').toggle();
        $('#Pinfo').toggle();
    }
    //updated
    render() {
        // const { view } = this.state;
        const { viewType } = this.state;
        const { t } = this.props
        const { searchTerm, filteredData } = this.state;
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
            width: "170px",
            border: "none",
            backgroundColor: "rgba(5,54,82,1)",
            borderRadius: "5px",
            padding: "7px 0px"
        }
        return <div className="container-dashboard d-flex flex-row" id="wrapper" style={{ marginTop: "-7px" }}>
            {
                this.state.showLoader && <Loader />
            }
            <FacilitatorSidebar />
            <div className="main-content bg-light" id="page-content-wrapper">
                <div className="container-fluid row pt-2">
                    <div className="col-1" id='facnavRes1'>
                        <button style={{ marginLeft: "25px" }} onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
                    </div>
                    <div className='col-4' id='facnavRes2' style={{ marginLeft: "20px", marginTop: "5px" }}>
                        <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                            <Link to="/facilitatorDashboard">Home</Link> / Due Diligence</p>
                    </div>
                    <div className='col'>

                    </div>
                    <div className='col'>

                    </div>
                    <div className='col-3'>

                    </div>
                    <div className="col" id='facnavRes3'>
                        <button style={myStyle}>
                            <Link to="/facilitatorDashboard"><FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} /><span style={{ textDecoration: "none", color: "white" }}>Back</span></Link></button>
                    </div>
                </div>

                <hr className="col-11" style={{ marginLeft: "50px", width: "88.6%", backgroundColor: "rgba(4,78,160,1)", marginTop: "0px" }} />
                {/* New Design */}
                <div className='container-fluid row' style={{ paddingLeft: "86px", marginTop: "-20px" }}>
                    <div className='card' style={{overflow:"auto"}}>
                        <div className='row pt-2 pl-2 pr-2'>
                            <div className='col'>
                                <ul role="tablist" className="nav nav-pills nav-fill mb-3" >
                                    <li className="nav-item" onClick={this.status}> <a data-toggle="pill" id="myNavLink" href="#myEarning-details" className="nav-link "
                                        style={{ textAlign: "center", paddingTop: "5px", paddingBottom: "5px" }} ><img src={v1} style={{ width: "20px" }} /> &nbsp; {t('All')} </a> </li>
                                    <li className="nav-item" onClick={this.status1}> <a data-toggle="pill" id="myNavLink" href="#futureEarning-details" className="nav-link active"
                                        style={{ textAlign: "center", paddingTop: "5px", paddingBottom: "5px", fontWeight: "bold" }}><img src={v3} style={{ width: "30px" }} /> &nbsp;{t(' Not Verified')} </a> </li>
                                    <li className="nav-item" onClick={this.status2}> <a data-toggle="pill" id="myNavLink" href="#futureEarning-details" className="nav-link"
                                        style={{ textAlign: "center", paddingTop: "5px", paddingBottom: "5px", fontWeight: "bold" }}><img src={v2} style={{ width: "30px" }} /> &nbsp;{t(' Verified')} </a> </li>
                                </ul>
                            </div>
                        </div>

                        <div className='pl-2 pr-2' style={{ marginTop: "-8px" }}>
                            <div className="row example">
                                <div className='col-md-7 col-sm-7 mb-2'>
                                    <input
                                        type="text"
                                        id="myInput"
                                        className="form-control"
                                        value={searchTerm}
                                        placeholder="Search with request number"
                                        style={{ height: "38px", color: "rgb(5, 54, 82)" }}
                                        name="search"
                                        autoComplete='off'
                                        onChange={this.handleSearchChange}
                                    />
                                </div>
                                <div className='col-md-2 col-sm-6 mb-2' style={{ marginLeft: "-15px" }}>
                                    <button style={myStyle2} onClick={this.searchInput}>
                                        <FaSearch style={{ fontSize: "15px" }} />&nbsp;<span style={{ textDecoration: "none", color: "white", fontSize: "15px" }}>Search</span>

                                    </button>
                                </div>
                                <div className='col-md-2 col-sm-6' style={{ marginLeft: "20px" }}>

                                    <ButtonGroup
                                        value={this.state.viewType}
                                        onChange={this.handleViewChange}
                                        aria-label="view type"
                                    >
                                        <Button
                                            variant={this.state.viewType === 'list' ? 'primary' : 'outline-primary'}
                                            onClick={() => this.handleViewChange(null, 'list')}
                                            active={this.state.viewType === 'list'}
                                            aria-label="list view"
                                        >
                                            <FaList /> List
                                        </Button>
                                        <Button
                                            variant={this.state.viewType === 'card' ? 'primary' : 'outline-primary'}
                                            onClick={() => this.handleViewChange(null, 'card')}
                                            active={this.state.viewType === 'card'}
                                            aria-label="card view"
                                        >
                                            <FaThLarge /> Card
                                        </Button>
                                    </ButtonGroup>

                                </div>
                            </div>

                            <div style={{ whiteSpace: "nowrap", marginTop: "5px" }} id='secondAuditScroll1'>
                                {this.state.viewFlagcard === true ?
                                    <div className='row' id='myTable' style={{ marginTop: "-15px" }}>
                                        {
                                            this.state.filteredData.map((profile, index) => {
                                                return (
                                                    <div className='col-md-4 col-sm-6 col-12 mb-3' key={index}>
                                                        <div className='card p-3' style={{ border: "2px solid rgba(0,121,190,1)", marginBottom: "1px", cursor: "default" }}>
                                                            <div className='row' style={{ fontSize: "14px", marginTop: "-10px" }}>
                                                                <div className='col-2' style={{ marginLeft: "10px" }}>
                                                                    <img src={profileBatch} width="30px" />

                                                                </div>
                                                                <div className='col d-flex' style={{ color: "#222C70", marginLeft: "-20px", marginTop: "5px" }}>
                                                                    <p className="font-weight-bold" style={{ marginBottom: "1px" }}>Borrower Name : </p>
                                                                    
                                                                    <Tooltip title={profile.name}>
                                                                        <p style={{ fontSize: "14px", color: "rgba(5,54,82,1)" }}>
                                                                            &nbsp;{(profile.name).substring(0, 10) + ""}
                                                                        </p>
                                                                    </Tooltip>
                                                                </div>
                                                            </div>
                                                            <hr style={{ backgroundColor: "rgba(4,78,160,1)", marginTop: "-3px" }} />
                                                            <div className='row' style={{ fontSize: "14px", marginTop: "-4px", color: "#222C70" }}>
                                                                <div className='col-md-6'>
                                                                    <p className="font-weight-bold" style={{ marginBottom: "1px", marginTop: "-5px" }}>Requested On</p>
                                                                    <p>{profile.loanreqdate}
                                                                    </p>
                                                                    <p className="font-weight-bold" style={{ marginBottom: "1px", marginTop: "-12px" }}>Product ID</p>
                                                                    <Tooltip title={profile.productid}>
                                                                        <p style={{ fontSize: "14px", color: "rgba(5,54,82,1)" }}>
                                                                            {(profile.productid).substring(0, 10) + ""}
                                                                        </p>
                                                                    </Tooltip>
                                                                    <p className="font-weight-bold" style={{ marginBottom: "1px", marginTop: "-12px" }}>Loan Amount</p>
                                                                    <Tooltip title={profile.loanamtreq}>
                                                                        <p style={{ fontSize: "14px", color: "rgba(5,54,82,1)" }}>

                                                                            ₹ {(profile.loanamtreq).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",").substring(0, 10) + "    "}
                                                                        </p>
                                                                    </Tooltip>
                                                                </div>
                                                                <div className='col-md-6'>
                                                                    <p className="font-weight-bold" style={{ marginBottom: "1px", marginTop: "-5px" }}>Request No.</p>
                                                                    <p>{profile.loanreqno}</p>
                                                                    <p className="font-weight-bold" style={{ marginBottom: "1px", marginTop: "-12px" }}>Tenure</p>
                                                                    <p>{profile.tenurereq}&nbsp;{profile.repaymentfrequencydesc == "Day(s)" ?
                                                                        <span>(Days)</span> : <span>{profile.repaymentfrequencydesc == "Month(s)" ? <span>(Months)</span> :
                                                                            <span>{profile.repaymentfrequencydesc == "Quarter(s)" ? <span>(Quarters)</span> : <span>(Weeks)</span>}</span>}</span>
                                                                    }
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <hr style={{ backgroundColor: "rgba(4,78,160,1)", marginTop: "-3px" }} />
                                                            <div className='row' style={{ marginTop: "-10px", marginBottom: "-10px" }}>
                                                                <div className='col' style={{ textAlign: "end" }}>
                                                                    {profile.verifiedstatus == 0 ?
                                                                        <button className="btn text-white btn-sm" style={{ backgroundColor: "rgb(0, 121, 191)" }}
                                                                            onClick={this.verifyProfile.bind(this, profile.loanreqno, profile.bormemmid, profile.name)}><FaUserCheck />&nbsp;Verify</button>
                                                                        : <button className='btn btn-sm' style={{ border: "1px solid rgb(0, 121, 191)", color: "rgb(0, 121, 191)", cursor: "default" }}>&nbsp;<img src={verified} width="25px" />&nbsp;Verified</button>}
                                                                </div>

                                                            </div>

                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                    :
                                    <Table responsive id="myTable">
                                        <Thead>
                                            <Tr style={{ fontSize: "15px", color: "rgba(5,54,82,1)", paddingLeft: "6px" }}>
                                                <Th style={{ fontWeight: "600", marginTop: "5px" }}>Borrower Name</Th>
                                                <Th style={{ fontWeight: "600", marginTop: "5px" }}>Requested On</Th>
                                                <Th style={{ fontWeight: "600", marginTop: "5px" }}>Product ID</Th>
                                                <Th style={{ fontWeight: "600", marginTop: "5px" }}>Loan Amount</Th>
                                                <Th style={{ fontWeight: "600", marginTop: "5px" }}>Request No.</Th>
                                                <Th style={{ fontWeight: "600", marginTop: "5px" }}>Tenure</Th>
                                            </Tr>
                                        </Thead>
                                        <Tbody>
                                            {filteredData.map((profile, index) => (
                                                <Tr key={index} style={{
                                                    transition: 'none',
                                                    cursor: 'default',
                                                    boxShadow: "0 4px 8px rgba(24 18 18 / 48%)",
                                                    backgroundColor: (index % 2 === 0) ? 'rgba(255,255,255,1)' : 'rgba(242,242,242,1)',
                                                    // height: "30px"
                                                }}>
                                                    <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", padding: "4px" }}>
                                                        {profile.name}
                                                    </Td>
                                                    <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", padding: "4px" }}>{profile.loanreqdate}</Td>
                                                    <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", padding: "4px" }}>
                                                        <Tooltip title={profile.productid}>
                                                            <span>{profile.productid.substring(0, 10)}</span>
                                                        </Tooltip>
                                                    </Td>
                                                    <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", padding: "4px" }}>
                                                        <Tooltip title={profile.loanamtreq}>
                                                            <span>₹ {profile.loanamtreq.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",").substring(0, 10)}</span>
                                                        </Tooltip>
                                                    </Td>
                                                    <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", padding: "4px" }}>{profile.loanreqno}</Td>
                                                    <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", padding: "4px" }}>
                                                        {profile.tenurereq} {profile.repaymentfrequencydesc === "Day(s)" ? "(Days)" :
                                                            profile.repaymentfrequencydesc === "Month(s)" ? "(Months)" :
                                                                profile.repaymentfrequencydesc === "Quarter(s)" ? "(Quarters)" : "(Weeks)"}
                                                    </Td>
                                                    <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "right", padding: "4px" }}>
                                                        {profile.verifiedstatus == 0 ?
                                                            <button className="btn text-white btn-sm" style={{ backgroundColor: "rgb(0, 121, 191)" }}
                                                                onClick={this.verifyProfile.bind(this, profile.loanreqno, profile.bormemmid, profile.name)}><FaUserCheck />&nbsp;Verify</button>
                                                            : <button className='btn btn-sm' style={{ border: "1px solid rgb(0, 121, 191)", color: "rgb(0, 121, 191)", cursor: "default" }}>&nbsp;<img src={verified} width="25px" />&nbsp;Verified</button>}
                                                    </Td>
                                                </Tr>
                                            ))}
                                        </Tbody>
                                    </Table>
                                }

                                {verificationStatusValue == "" ?
                                    <div className="row float-right">
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
                                    </div> : <span>{verificationStatusValue == 0 ?
                                        <div className="row float-right">
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
                                        </div> : <span>{verificationStatusValue == 1 ?
                                            <div className="row float-right">
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
                                            </div> : null}</span>}</span>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }
}

export default withTranslation()(BorrowerProfileVerification);