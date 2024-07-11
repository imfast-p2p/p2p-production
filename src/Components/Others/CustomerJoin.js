import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "@botaiml/videoflo-webcomponent/videoflo-webcomponent.js";
import "@botaiml/videoflo-webcomponent/videoflo-webcomponent.css";
//updated
import { Provider, useDispatch, useSelector } from "react-redux";
import { createStore } from "redux";
import { reducer as rootReducer } from "redux-form";
import style from "../SystemUser/videoFlo.module.css";
import { BASEURL } from "../assets/baseURL";

// const AppWrapper = () => {
//     const store = createStore(rootReducer);

//     return (
//         <Provider store={store}>
//             <CustomerJoin />
//         </Provider>
//     )
// }
const CustomerJoin = () => {
  const videoFlo = useSelector((state) => state.videoFlo);
  const dispatcher = useDispatch();
  const store = createStore(rootReducer);
  const videofloRef = useRef(null);

  const token = sessionStorage.getItem("kycToken");
  const sessionId = sessionStorage.getItem("sessionId");
  const participantId = sessionStorage.getItem("participantId");
  //const url = "https://demo-api.videoflo.net/api"

  const getVideoSessionUrl = () => {
    const sessionId = sessionStorage.getItem("sessionId");
    const participantId = sessionStorage.getItem("participantId");
    const token = sessionStorage.getItem("kycToken");
    const role = "cust";
    const accessToken = sessionStorage.getItem("token");
    const device = "web";

    const url = BASEURL + `/VkycBoot/videoSession?sessionId=${sessionId}&participantId=${participantId}&token=${token}&accessToken=${accessToken}&role=${role}&device=${device}`;
    //const url = `https://ilpuat.finfotech.co.in:8096/VkycBoot/joinSession?sessionId=${sessionId}&participantId=${participantId}&token=${token}&accessToken=${accessToken}&role=${role}`;
    //const url = `https://ilpuat.finfotech.co.in:8096/VkycBoot/joinSession?sessionId=${sessionId}&participantId=${participantId}&token=${token}`;
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

    if (typeof get === 'string') {
      get.includes('webpack')
      if (get.includes('webpack')) {
        console.log("executed")
      }
    } else {
      console.log("else case")

      parsedJs = JSON.parse(e.data)
      console.log(parsedJs)

      if (parsedJs.type == "error") {
        console.log("error !!!!!!!!11");
        var iframe = document.getElementById("testiframe");
        iframe.src = "about:blank";
        // window.location="/"

        if (sessionStorage.getItem("userType") == 3) {
          window.location = "/borrowerDetails";
        } else {
          window.location = "/lenderDetails";
        }
      } else if (parsedJs.type == "leaveSession") {
        console.log("session left !!!!!!!!11");
        var iframe = document.getElementById("testiframe");
        iframe.src = "about:blank";
        if (sessionStorage.getItem("userType") == 3) {
          console.log("inside Session Left")
          //change
          sessionStorage.setItem("borKycFlag", true)
          window.location = "/borrowerDetails";

        } else if (sessionStorage.getItem("userType") == 2) {
          console.log("Outside Session Left")
          //change
          sessionStorage.setItem("lndKycFlag", true)
          window.location = "/lenderDetails";

        } else if (sessionStorage.getItem("userType") == 4) {
          console.log("Outside Session Left")
          //change
          sessionStorage.setItem("facKycFlag", true)
          window.location = "/facDetails";
        } else if (sessionStorage.getItem("userType") == 5) {
          console.log("Outside Session Left")
          //change
          sessionStorage.setItem("evlKycFlag", true)
          window.location = "/evaluatorDetails";
        } else {
          console.log("Outside Session Left")
          window.location = "/login";
        }
      }
    }

    // else if(typeof Data==='string'){
    //   Data.includes('webpack')
    //   if(Data.includes('webpack')){
    //     console.log('single data executed..')
    //   }
    // }

    // switch (e.data.type) {
    //   case "error": {
    //     //dispatcher({ type: DELETE_VIDEOFLO_SESSION });
    //     console.log("error !!!!!!!!11");
    //     var iframe = document.getElementById("testiframe");
    //     iframe.src = "about:blank";
    //     if (sessionStorage.getItem("userType") == 3) {
    //       window.location = "/borrowerDetails";
    //     } else {
    //       window.location = "/lenderDetails";
    //     }
    //   }
    //   case "leaveSession": {
    //     //dispatcher({ type: DELETE_VIDEOFLO_SESSION });
    //     console.log("session left !!!!!!!!11");
    //     var iframe = document.getElementById("testiframe");
    //     iframe.src = "about:blank";
    //     //videofloRef.current = "";
    //     //console.log("came to leave session --- videofloRef" + videofloRef);
    //     // setTimeout(() => {
    //     //     window.history.back();
    //     // }, 3000);

    //     if (sessionStorage.getItem("userType") == 3) {
    //       console.log("inside Session Left")
    //       window.location = "/borrowerDetails";

    //     } else {
    //       console.log("Outside Session Left")
    //       window.location = "/lenderDetails";
    //     }
    //   }
    //   default: {
    //     break;
    //   }
    // }
  };

  // useEffect(() => {
  //     //  videofloRef.current.initializeTemplate();
  //     if (sessionId) {
  //         console.log(`New Video session created for ${sessionId}`);
  //         videofloRef.current.apiUrl = url;
  //         videofloRef.current.sessionId = sessionId;
  //         videofloRef.current.participantId =
  //             participantId;
  //         videofloRef.current.token = token;
  //         //Adding events to videoflo-webcomponent
  //         videofloRef.current.addEventListener("error", (e) => {
  //             // dispatcher({ type: "" });
  //             videofloRef.current = "";
  //             console.log(videofloRef.current);
  //             // window.history.back();
  //             window.location = '/borrowerDetails';
  //         });
  //         videofloRef.current.addEventListener("leaveSession", (e) => {
  //             // dispatcher({ type: "" });
  //             videofloRef.current = "";
  //             console.log("came to leave session --- videofloRef" + videofloRef);
  //             // setTimeout(() => {
  //             //     window.history.back();
  //             // }, 3000);
  //             window.location = '/borrowerDetails';
  //         });
  //     }
  // }, [sessionId]);

  useEffect(() => {
    //  videofloRef.current.initializeTemplate();
    if (sessionId) {
      console.log(sessionId);
      videofloRef.current.src = getVideoSessionUrl();
      window.addEventListener("message", handleVideofloEvents);

      console.log(videofloRef.current.src);

    }
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
    // <div className="container-dashboard" id="wrapper">

    //     <div className="main-content bg-light" id="page-content-wrapper">
    //         <div className="container-fluid row">
    //             <div className="col">
    //             </div>
    //             <div className="col">
    //                 <h4 className="pl-4">Join As Customer</h4>
    //             </div>
    //             <div className="col"></div>
    //         </div>
    //         <hr />

    //         <div className="border border-primary m-5" style={{ width: "90vw", height: "70vh" }}>
    //             {sessionId && <videoflo-webcomponent ref={videofloRef}></videoflo-webcomponent>}
    //         </div>
    //     </div>
    // </div>
    // {/* </Provider> */}
  );
};

export default CustomerJoin;