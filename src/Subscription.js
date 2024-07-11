import { BASEURL } from "./Components/assets/baseURL";

const convertedVapidKey = urlBase64ToUint8Array(
  sessionStorage.getItem("publicKey")
);
//const webPush = require("web-push");

function urlBase64ToUint8Array(base64String) {
  if(base64String!=null){
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  // eslint-disable-next-line
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}else{
  console.log("key is empty");
}
}

// function sendSubscription(subscription) {
//   return fetch(
//     ,
//     {
//       method: "POST",
//       body: JSON.stringify(subscription),
//       headers: {
//         "Content-Type": "application/json",
//       },
//     }
//   );
// }
function sendSubscription(subscription) {
  const urlDash = BASEURL + "/usrmgmt/setnotificationsubobj";
  fetch(urlDash, {
    method: "post",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + sessionStorage.getItem("token"),
    },
    body: JSON.stringify({
      notificationsubobjinfo: subscription,
    }),
  })
    .then((response) => {
      console.log("Response:", response);
      return response.json();
    }) //updated
    .then((resdata) => {
      if (resdata.status == "Success") {
        console.log(resdata);
      } else {
        alert("Issue: " + resdata.message);
      }
    })
    .catch((error) => {
      console.log(error);
    });
}
//conditional render
let clicked = true;

export function subscribeUser() {
  if (clicked) {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready
        .then(function(registration) {
          if (!registration.pushManager) {
            console.log("Push manager unavailable.");
            return;
          }

          registration.pushManager
            .getSubscription()
            .then(function(existedSubscription) {
              if (existedSubscription === null) {
                console.log("No subscription detected, make a request.");
                registration.pushManager
                  .subscribe({
                    applicationServerKey: convertedVapidKey,
                    userVisibleOnly: true,
                  })
                  .then(function(newSubscription) {
                    console.log("New subscription added.", newSubscription);
                    sessionStorage.setItem("subs", newSubscription);

                    sendSubscription(newSubscription);
                  })
                  .catch(function(e) {
                    if (Notification.permission !== "granted") {
                      console.log("Permission was not granted.");
                    } else {
                      console.error(
                        "An error ocurred during the subscription process.",
                        e
                      );
                    }
                  });
              } else {
                console.log(
                  "Existed subscription detected.",
                  existedSubscription
                );
                sessionStorage.setItem("subs", existedSubscription);

                sendSubscription(existedSubscription);
              }
            });
        })
        .catch(function(e) {
          console.error(
            "An error ocurred during Service Worker registration.",
            e
          );
        });
    }
  } else {
    console.log("Can not reachable to the service worker");
  }
}

export function displayNotification() {
  if (Notification.permission == "granted") {
    navigator.serviceWorker.getRegistration().then(function(reg) {
      reg.showNotification("Hello world!");
    });
  }
}
