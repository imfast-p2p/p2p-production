import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import style from "./videoFlo.module.css";
// import Popup from "reactjs-popup";
import "@botaiml/videoflo-webcomponent/videoflo-webcomponent.js";
import "@botaiml/videoflo-webcomponent/videoflo-webcomponent.css";

// import { VideofloModule } from '@botaiml/videoflo-webcomponent';

import { Provider, useDispatch, useSelector } from "react-redux";
import { createStore } from "redux";
import { reducer as rootReducer } from "redux-form";
import { BASEURL } from "../assets/baseURL";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import { NavItem } from "react-bootstrap";
const AppWrapper = () => {
  const store = createStore(rootReducer);

  return (
    <Provider store={store}>
      <CustomerJoin />
    </Provider>
  );
};
const CustomerJoin = () => {
  const videoFlo = useSelector((state) => state.videoFlo);
  const dispatcher = useDispatch();
  const store = createStore(rootReducer);
  const videofloRef = useRef(null);

  const token = sessionStorage.getItem("kycToken");
  const sessionId = sessionStorage.getItem("sessionId");
  const participantId = sessionStorage.getItem("participantId");
  //const url = "https://demo-api.videoflo.net/api";
  //alert("participantId" + participantId);
  const [pname, setPName] = useState("");
  const [pgender, setPGender] = useState("");
  const [pdob, setPDob] = useState("");
  const [pemail, setPEmail] = useState("");
  const [pmobile, setPMobile] = useState("");
  const [getattributes, setGetAttributes] = useState("");
  const [getpan, setpPan] = useState("");
  const [addressDetails, setAddressDetails] = useState("");
  const [paddress1, setPAddress1] = useState("");
  const [paddress2, setPAddress2] = useState("");
  const [pdistrict, setPDistrict] = useState("");
  const [pcity, setPCity] = useState("");
  const [pstate1, setPState1] = useState("");
  const [ppincode, setPPincode] = useState("");
  const add = "#473,6th main, bhuvaneshwari nagar,T.dasarahalli,bengaluru 560057";


  const getVideoSessionUrl = () => {
    const sessionId = sessionStorage.getItem("sessionId");
    const participantId = sessionStorage.getItem("participantId");
    const token = sessionStorage.getItem("kycToken");
    const accessToken = sessionStorage.getItem("token");
    const address = sessionStorage.getItem("Paddress");
    const name = sessionStorage.getItem("Pname");
    const mobile = sessionStorage.getItem("Pmobile");
    const email = sessionStorage.getItem("Pemail");
    const gender = sessionStorage.getItem("Pgender");
    const memmID = sessionStorage.getItem("memmID");
    const pan = sessionStorage.getItem("Ppan");
    const dob = sessionStorage.getItem("Pdob");
    const role = "agent";
    //console.log("mobile :"+mobile+" "+"pan : "+pan+" "+"gender"+gender)
    const device = "web";

    const url = BASEURL + `/VkycBoot/videoSession?sessionId=${sessionId}&participantId=${participantId}&token=${token}&accessToken=${accessToken}&memmId=${memmID}&role=${role}&device=${device}`;
    //const url = `https://ilpuat.finfotech.co.in:8096/VkycBoot/iFrameBot?sessionId=${sessionId}&participantId=${participantId}&token=${token}&accessToken=${accessToken}&memmId=${memmID}&role=${role}`;
    //const url = `https://ilpuat.finfotech.co.in:8096/VkycBoot/iFrameBot?sessionId=${sessionId}&participantId=${participantId}&token=${token}&accessToken=${accessToken}&memmId=${memmID}&role=${role}`;
    return url;

  };

  const handleVideofloEvents = (e) => {
    console.log(e);
    console.log(e.data);
    var Data = e.data;
    console.log(Data);
    console.log(Data.type)

    var parsedJs;
    let get = e.data.type;

    if(typeof get==='string'){
      get.includes('webpack')
      if(get.includes('webpack')){
        console.log("executed")
      }
    }else{
      console.log("else case")
      // false;
      parsedJs = JSON.parse(e.data)
      console.log(parsedJs)

      if (parsedJs.type == "error") {
        console.log("error !!!!!!!!11");
        var iframe = document.getElementById("testiframe");
        iframe.src = "about:blank";
        // window.location="/"
      } else if (parsedJs.type == "leaveSession") {
        console.log("session left !!!!!!!!11");
        var iframe = document.getElementById("testiframe");
        iframe.src = "about:blank";
        window.location = "/kycVerification";
      }
    }

  };


  useEffect(() => {
    console.log(sessionId);

    if (sessionId) {
      console.log(sessionId);
      videofloRef.current.src = getVideoSessionUrl();
      window.addEventListener("message", handleVideofloEvents);

      console.log(videofloRef.current.src);
      
    }

    //  videofloRef.current.initializeTemplate();

  }, [sessionId]);

  return (
    <>
      <div
        id="videoflo-wrapper"
        className={`${style.videofloWrapper} ${style.active} ${style.fullsscreen}`}

      >
        {sessionId && (
          <iframe
            id="testiframe"
            ref={videofloRef}
            allowFullScreen
            allow="camera;microphone;geolocation"
          ></iframe>
        )}
      </div>
    </>
    // <Provider store={store}>
    //   <div className="container-dashboard d-flex flex-row" id="wrapper">
    //     <div className="main-content bg-light" id="page-content-wrapper">
    //       <div className="container-fluid row">
    //         <div className="col"></div>
    //         <div className="col">
    //           <h4 className="pl-4">Agent Join</h4>
    //         </div>
    //         <div className="col"></div>
    //       </div>
    //       <hr />
    //       <div className="row">
    //         <div className="col-sm-3 col-md-3 col-lg-3">
    //           <a
    //             style={{ marginLeft: "70px", marginTop: "2px" }}
    //             //onClick={getPersonalDetails}
    //             class="btn btn-primary"
    //             data-toggle="collapse"
    //             href="#multiCollapseExample1"
    //             role="button"
    //             aria-expanded="false"
    //             aria-controls="multiCollapseExample1"
    //           >
    //             Verify Personal Details
    //           </a>
    //         </div>
    //         <div className="col-sm-3 col-md-3 col-lg-3">
    //           <button
    //             style={{ marginTop: "2px" }}
    //             //onClick={getAddressDetails}
    //             class="btn btn-primary"
    //             type="button"
    //             data-toggle="collapse"
    //             data-target="#multiCollapseExample2"
    //             aria-expanded="false"
    //             aria-controls="multiCollapseExample2"
    //           >
    //             Verify Address details
    //           </button>
    //         </div>
    //         <div className="col-sm-6 col-md-6 col-lg-6"></div>
    //       </div>
    //       <div className="row">
    //         <div
    //           className="col-sm-6 col-md-6 col-lg-6 collapse multi-collapse "
    //           style={{ float: "right" }}
    //           id="multiCollapseExample1"
    //         >
    //           <div
    //             className="card header overflow-auto"
    //             style={{ height: "100px" }}
    //           >
    //             <h2>Personal Details</h2>
    //             <div className="row">
    //               <div className="col">
    //                 <p>Name</p>
    //                 <h6>{pname}</h6>
    //               </div>
    //               <div className="col">
    //                 <p>Email</p>
    //                 <h6>{pemail}</h6>
    //               </div>
    //               <div className="col">
    //                 <p>Contact</p>
    //                 <h6>{pmobile}</h6>
    //               </div>
    //             </div>
    //             <div className="row">
    //               <div className="col">
    //                 <p>Gender</p>
    //                 <h6>{pgender}</h6>
    //               </div>
    //               <div className="col">
    //                 <p>DOB</p>
    //                 <h6>{pdob.split(" ")[0]}</h6>
    //               </div>
    //               <div className="col">
    //                 <p>PAN</p>
    //                 <h6>{getpan}</h6>
    //               </div>
    //             </div>
    //           </div>
    //         </div>
    //         <div
    //           className="col-sm-6 col-md-6 col-lg-6 collapse multi-collapse"
    //           id="multiCollapseExample2"
    //         >
    //           <div
    //             class="card header overflow-auto"
    //             style={{ height: "100px" }}
    //           >
    //             <div className="row">
    //               <h2>Address Details</h2>
    //               <div className="col">
    //                 <p>Address Line 1</p>
    //                 <h6>{paddress1}</h6>
    //               </div>
    //               <div className="col">
    //                 <p>Address Line 2</p>
    //                 <h6>{paddress2}</h6>
    //               </div>
    //               <div className="col">
    //                 <p>City</p>
    //                 <h6>{pcity}</h6>
    //               </div>
    //             </div>
    //             <div className="row">
    //               <div className="col">
    //                 <p>District</p>
    //                 <h6>{pdistrict}</h6>
    //               </div>
    //               <div className="col">
    //                 <p>State</p>
    //                 <h6>{pstate1}</h6>
    //               </div>
    //               <div className="col">
    //                 <p>PIN Code</p>
    //                 <h6>{ppincode}</h6>
    //               </div>
    //             </div>
    //           </div>
    //         </div>
    //       </div>

    //       <hr />
    //       <div className="row">
    //         <div className="col"></div>
    //         <button variant="contained" color="primary">
    //           {/* {videoFlo.fullSizeDisplay ? "Resuze Size" : "FullScreen"} */}
    //         </button>
    //         <div className="col">
    //           <div
    //             className="border border-primary m-5"
    //             style={{ marginLeft: "50px", width: "50vw", height: "50vh" }}
    //           >
    //             {/* <videoflo-webcomponent
    //                                 apiUrl="https://demo-api.videoflo.net/api/"
    //                                 sessionId={sessionId}
    //                                 participantId={participantId}
    //                                 token={token}
    //                                 error="onVideofloError"
    //                                 leaveSession="onVideofloLeaveSession">
    //                             </videoflo-webcomponent> */}

    //             <videoflo-webcomponent
    //               ref={videofloRef}
    //             ></videoflo-webcomponent>
    //           </div>
    //         </div>
    //         <div className="col"></div>
    //       </div>

    //       {/* <div>
    //                 <Link to="/customHTML">
    //                     <button className='btn btn-success'>Go to another page</button>
    //                 </Link>

    //             </div> */}
    //     </div>
    //   </div>
    // </Provider>
  );
};

export default AppWrapper;