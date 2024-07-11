import React, { Component } from "react";
import $ from "jquery";
import { BASEURL } from "../assets/baseURL";
import SystemUserSidebar from "./SystemUserSidebar";
import { withTranslation } from "react-i18next";
import { FaSearch, FaAngleLeft, FaUserPlus } from "react-icons/fa";
import dashboardIcon from '../assets/icon_dashboard.png'
import { Link } from 'react-router-dom';
import accept from '../assets/accept.png';
import ReactPaginate from 'react-paginate';
import '../Borrower/Pagination.css'
import { confirmAlert } from "react-confirm-alert";
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'
import Tooltip from "@material-ui/core/Tooltip";

var input, filter, ul, li, a, i, txtValue;
var Interval;
export class KycVerification extends Component {
  constructor(props) {
    super(props);

    this.state = {
      reqNos: [],
      acceptReqs: "",
      utype: "",
      reqNo: "",
      memmid: "",
      pos: "",

      offset: 0,
      orgtableData: [],
      perPage: 10,
      currentPage: 0,
      pageCount: "",

    };
    this.getKYCReqs = this.getKYCReqs.bind(this);
    this.acceptKYCReqs = this.acceptKYCReqs.bind(this);
  }

  componentDidMount() {
    this.getKYCReqs();
  }
  // componentWillUnmount(){
  //   clearInterval(Interval);
  // }
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
      reqNos: slice
    })
  }
  getKYCReqs(event) {
    fetch(BASEURL + "/vf/getvkycrequests", {
      method: "get",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "Bearer " + sessionStorage.getItem("token"),
      },
    })
      .then((Response) => Response.json())
      .then((resdata) => {
        if (resdata.status == "SUCCESS") {
          console.log(resdata);

          var list = resdata.msgdata;
          list.sort((a, b) => {
            return new Date(b.requestedon).getTime() - new Date(a.requestedon).getTime()
          })
          console.log(list);
          this.setState({ reqNos: list })

          var data = list
          console.log(data)
          var slice = data.slice(this.state.offset, this.state.offset + this.state.perPage)
          console.log(slice)

          this.setState({
            pageCount: Math.ceil(data.length / this.state.perPage),
            orgtableData: data,
            reqNos: slice
          })
          // Interval = setInterval(() => { this.getKYCReqs() }, 10000);
          // setTimeout(() => {
          //   this.getKYCReqs();
          // }, 10000);
          // this.setState({ utype: this.state.Id.utype });
          // this.setState({ reqNo: this.state.Id.vkycreqno });
          console.log(this.state.reqNos);
          // this.acceptKYCReqs();
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
      });
  }

  acceptKYCReqs(vkycreqno, utype, pos) {
    this.state.memmid = this.state.reqNos[pos].memmid;
    console.log("MemmId: " + this.state.memmid);

    sessionStorage.setItem("memmID", this.state.memmid);

    // console.log("timer");
    fetch(
      BASEURL +
      "/vf/acceptvkycrequest?vkycreqno=" +
      vkycreqno +
      "&utype=" +
      utype,
      {
        method: "get",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + sessionStorage.getItem("token"),
        },
      }
    )
      .then((Response) => Response.json())
      .then((resdata) => {
        if (resdata.status == "SUCCESS") {
          // clearInterval(Interval);
          console.log(resdata);
          this.setState({ acceptReqs: resdata.msgdata });
          alert(resdata.message);
          sessionStorage.setItem("kycToken", this.state.acceptReqs.accessToken);
          sessionStorage.setItem("sessionId", this.state.acceptReqs.sessionId);
          sessionStorage.setItem(
            "participantId",
            this.state.acceptReqs.participantId
          );
          window.location = "/agentJoin";
        } else {
          //alert("Issue: " + resdata.message);
        }
      });
  }
  myFunction = (e) => {
    e.preventDefault();
    const filter = e.target.value.toUpperCase();
    const tableRows = document.querySelectorAll("#myTableBody tr");
    tableRows.forEach(row => {
      const nameColumn = row.querySelector("td:nth-child(1)");
      if (nameColumn) {
        const txtValue = nameColumn.textContent || nameColumn.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          row.style.display = ""; // Show the row if it matches the search query
        } else {
          row.style.display = "none"; // Hide the row if it doesn't match
        }
      }
    });
  };
  handleChange() {
    $('.text').toggle();
    $('#PImage').toggle();
    $('#Pinfo').toggle();
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
      width: "185px",
      border: "none",
      backgroundColor: "rgba(5,54,82,1)",
      borderRadius: "5px",
      padding: "7px 0px"
    }
    return (
      <div className="container-dashboard d-flex flex-row" id="wrapper" style={{ backgroundColor: "#F4F7FC" }}>
        <SystemUserSidebar />
        <div className="main-content" id="page-content-wrapper">
          <div className="container-fluid row pt-2">
            <div className="col-1" id="kyCNav1">
              <button style={{ marginLeft: "25px" }} onClick={() => { this.handleChange() }} className="btn navbar-light navbar-toggler" id="menu-toggle"><span className="navbar-toggler-icon"></span></button>
            </div>
            <div className='col-4' id="kyCNav2" style={{ marginLeft: "20px", marginTop: "5px" }}>
              <p><img src={dashboardIcon} style={{ height: "13px", paddingRight: "5px" }} />
                <Link to="/sysUserDashboard">Home</Link> / KYC Verification </p>
            </div>
            <div className='col'>

            </div>
            <div className='col'>

            </div>
            <div className='col-3'>

            </div>
            <div className="col" id="kyCNav3">
              <button style={myStyle}>
                <Link to="/sysUserDashboard" style={{ marginLeft: "10px" }}><FaAngleLeft style={{ marginLeft: "-15px", color: "white", textDecoration: "none" }} /><span style={{ textDecoration: "none", color: "white" }}>Back</span></Link></button>
            </div>
          </div>
          <hr className="col-11" style={{ marginLeft: "50px", width: "88.6%", backgroundColor: "rgba(4,78,160,1)", marginTop: "0px" }} />

          {/* <div className='container-fluid row' style={{ paddingLeft: "82px", marginTop: "-20px", marginTop: "0px" }}>
            <div className='card pt-3' style={{ marginTop: "-10px" }}>
              <div style={{ cursor: "default", color: "#222C70", marginBottom: "20px" }} >
                <div className='row'>
                  <div className='col' style={{ textAlign: "center", fontSize: "15px", fontWeight: "500" }}>
                    <p>KYC Verification</p>
                  </div>
                </div>
                <div className='row mb-3'>
                  <div className='col-12' style={{ paddingRight: "45px" }}>
                    <div className="row example">
                      <div className='col-10'>
                        <input type="text" class="form-control" placeholder="Search by User Name" style={{ height: "38px", color: "rgb(5, 54, 82)" }} name="search" autoComplete='off' onKeyUp={this.myFunction} />
                      </div>
                      <div className='col-2' style={{ marginLeft: "-30px" }}>
                        <button style={myStyle2}>
                          <FaSearch style={{ fontSize: "15px" }} />&nbsp;<span style={{ textDecoration: "none", color: "white", fontSize: "15px" }}>Search</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {this.state.reqNos == "" ?
                  <div className="row mt-2" style={{ marginLeft: "6px" }}>
                    <div className="col" style={{ textAlign: "center", color: "#222C70", fontSize: "14px", fontWeight: "500" }}>
                      <p>No Requests Available !</p>
                    </div>
                  </div> :
                  <>
                    <Table>
                      <Thead>
                        <Tr style={{ fontFamily: "'Poppins', sans-serif", fontSize: "15px", color: "rgba(5,54,82,1)", paddingLeft: "6px" }}>
                          <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('User ID')}</Th>
                          <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('Customer Name')}</Th>
                          <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('Mobile No.')}</Th>
                          <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('Vkyc Request Number')}</Th>
                          <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('Requested On')}</Th>
                          <Th style={{ fontWeight: "600", marginTop: "5px" }}></Th>
                        </Tr>
                      </Thead>


                      <Tbody id="myTableBody">
                        {this.state.reqNos == "" ?
                          <p>No requests available!</p> :
                          <>
                            {this.state.reqNos.map((reqno, index) => {
                              return (
                                <Tr key={index}
                                  style={{
                                    fontSize: "15px", color: "rgba(5,54,82,1)", fontFamily: "'Poppins', sans-serif",
                                    marginBottom: "-10px", transition: 'none', cursor: 'default', backgroundColor: (index % 2 == 0) ? 'rgba(255,255,255,1)' : 'rgba(242,242,242,1)'
                                  }} >
                                  <Td style={{ fontWeight: "490", textAlign: "left", paddingTop: "12px" }}>
                                    <Tooltip title={reqno.name}>
                                      <span>
                                        {typeof reqno.name === 'string'
                                          ? reqno.name.substring(0, 10) + ".."
                                          : ''}
                                      </span>
                                    </Tooltip>
                                  </Td>
                                
                                  <Td style={{ fontWeight: "490", textAlign: "left", paddingTop: "12px" }}>{reqno.customername}
                                  </Td>
                                  <Td style={{ fontWeight: "490", textAlign: "left", paddingTop: "12px" }}>{reqno.mobileno}</Td>
                                  <Td style={{ fontWeight: "490", textAlign: "left", paddingTop: "12px" }}>
                                    <Tooltip title={reqno.vkycreqno}>
                                      <span>
                                        {typeof reqno.vkycreqno === 'string'
                                          ? reqno.vkycreqno.substring(0, 19) + ".."
                                          : ''}
                                      </span>
                                    </Tooltip>
                                  </Td>
                                  <Td style={{ fontWeight: "490", textAlign: "left", paddingTop: "12px" }}>{reqno.requestedon}</Td>
                                  <Td style={{ fontWeight: "490", textAlign: "left", paddingTop: "12px" }}><button className="btn btn-sm" onClick={this.acceptKYCReqs.bind(
                                    this,
                                    reqno.vkycreqno,
                                    reqno.utype,
                                    index
                                  )}
                                    style={{ color: "#0079bf", border: "1.5px solid #0079bf", fontWeight: "600" }}>Accept</button></Td>
                                </Tr>
                              )
                            })
                            }
                          </>

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

                }
              </div>
            </div>
          </div> */}

          <div className='container-fluid row' style={{ paddingLeft: "82px", marginTop: "-26px" }}>
            <div className='card' style={{ overflow: "auto" }}>
              <div className='row pt-2'>
                <div className='col'>
                  <ul role="tablist" className="nav nav-pills nav-fill mb-3" >
                    <li className="nav-item"> <a data-toggle="pill" href="#myEarning-details" className="nav-link active detailsTab"
                      style={{ textAlign: "center", paddingTop: "10px", paddingBottom: "10px" }}>
                      {t('KYC Verification')} </a> </li>
                  </ul>

                </div>
              </div>
              <div className='row mb-3'>
                <div className='col-12' style={{ paddingRight: "15px" }}>
                  <div className="row example">
                    <div className='col-md-8 col-sm-9 col-xs-8'>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Search by User Name"
                        style={{ height: "38px", color: "rgb(5, 54, 82)" }}
                        name="search"
                        autoComplete='off'
                        onKeyUp={this.myFunction}
                      />
                    </div>
                    <div className='col-md-2 col-sm-3 col-xs-4'>
                      <button style={myStyle2}>
                        <FaSearch style={{ fontSize: "15px" }} />&nbsp;
                        <span style={{ textDecoration: "none", color: "white", fontSize: "15px" }}>Search</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className='row' style={{ marginTop: "-10px" }}>
                <div className='col'>
                  <div className='tab-content'>
                    <div id="myEarning-details" className="register-form tab-pane fade show active" style={{ cursor: "default" }}>
                      {this.state.reqNos == "" ?
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
                                  <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('User ID')}</Th>
                                  <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('Customer Name')}</Th>
                                  <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('Mobile No.')}</Th>
                                  <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('Vkyc Request Number')}</Th>
                                  <Th style={{ fontWeight: "600", marginTop: "5px" }}>{t('Requested On')}</Th>
                                  <Th style={{ fontWeight: "600", marginTop: "5px" }}></Th>
                                </Tr>
                              </Thead>
                              <Tbody id="myTableBody">
                                {this.state.reqNos.map((reqno, index) => (
                                  <Tr key={index} style={{
                                    marginBottom: "-10px", transition: 'none', cursor: 'default', color: "rgba(5,54,82,1)",
                                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", backgroundColor: (index % 2 === 0) ? 'rgba(255,255,255,1)' : 'rgba(242,242,242,1)'
                                  }}>
                                    <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}>{reqno.name}
                                      {/* <Tooltip title={reqno.name}>
                                      <span>
                                        {typeof reqno.name === 'string'
                                          ? reqno.name.substring(0, 10) + ".."
                                          : ''}
                                      </span>
                                    </Tooltip> */}
                                    </Td>
                                    <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}>{reqno.customername}</Td>
                                    <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}>{reqno.mobileno}</Td>
                                    <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}><Tooltip title={reqno.vkycreqno}>
                                      <span>
                                        {typeof reqno.vkycreqno === 'string'
                                          ? reqno.vkycreqno.substring(0, 19) + ".."
                                          : ''}
                                      </span>
                                    </Tooltip></Td>
                                    <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "left", }}>
                                      {(() => {
                                        const date = new Date(reqno.requestedon);
                                        const day = String(date.getDate()).padStart(2, '0');
                                        const month = String(date.getMonth() + 1).padStart(2, '0');
                                        const year = date.getFullYear();
                                        const hours = String(date.getHours()).padStart(2, '0');
                                        const minutes = String(date.getMinutes()).padStart(2, '0');
                                        const seconds = String(date.getSeconds()).padStart(2, '0');
                                        return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
                                      })()}
                                    </Td>

                                    <Td style={{ fontSize: "14px", fontWeight: "490", textAlign: "right", }}>
                                      <button className="btn btn-sm" onClick={this.acceptKYCReqs.bind(
                                        this,
                                        reqno.vkycreqno,
                                        reqno.utype,
                                        index
                                      )}
                                        style={{ color: "#0079bf", border: "1.5px solid #0079bf", fontWeight: "600" }}>Accept</button>
                                    </Td>
                                  </Tr>
                                ))}
                              </Tbody>
                            </Table>
                            &nbsp;
                            {this.state.reqNos.length > 0 &&
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

        </div>
      </div>
    );
  }
}

export default withTranslation()(KycVerification);