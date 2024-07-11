//import { Cookies } from "universal-cookie";
//this.importScripts("universal-cookie/es6");
// this.importScripts("localforage.min.js");
// import localforage from "localforage.min.js";

// const asyncsessionStorage = {

//   setItem: async function(key, value) {
//     await null;
//     return sessionStorage.setItem(key, value);
//   },
//   getItem: async function(key) {
//     await null;
//     return sessionStorage.getItem(key);
//   },
// };
var idbSupported = false;
var db;

this.addEventListener("push", (event) => {
  const data = event.data.json();
  console.log(data);
  const type = data.notification_type;
  const body = data.notification_body;

  if ("indexedDB" in self) {
    idbSupported = true;
  } else {
    console.log("Indexed db not supported");
  }
  if (idbSupported) {
    var openRequest = indexedDB.open("test", 1);
    openRequest.onupgradeneeded = function(e) {
      console.log("Upgrading...");
      var thisDB = e.target.result;
      if (!thisDB.objectStoreNames.contains("messages")) {
        thisDB.createObjectStore(
          "messages",
          { keyPath: "id", autoIncrement: true }
        );
      }
    };
    openRequest.onsuccess = function(e) {
      console.log("Success!");
      db = e.target.result;
      // let transaction = db.transaction("messages");
      // let store = transaction.objectStore("messages");

      // store.put({ notification_type: type, notification_body: body });
      const noti = { type: type, body: body };
      let tx = db.transaction("messages", "readwrite");
      let messages = tx.objectStore("messages").add(noti);

     
    };
    openRequest.onerror = function(e) {
      console.log("Error");
      console.dir(e);
    };
  }

  //window.sessionStorage.setItem("key", "value");
  //sessionStorage.setItem("notification_type", "" + data.notification_type);

  // const cookies = new Cookies();
  // cookies.set("notification_type", data.notification_type);
  // console.log("cookie_date" + cookies.get("notification_type"));
  // this.localforage
  //   .setItem("notification_type", data.notification_type)
  //   .then(function() {
  //     return this.localforage.getItem("key");
  //   })
  //   .then(function(value) {
  //     console.log(value);
  //   })
  //   .catch(function(err) {
  //     console.log(err);
  //     // we got an error
  //   });

  // this.localforage
  //   .setItem("notification_body", data.notification_body)
  //   .then(function() {
  //     return this.localforage.getItem("key");
  //   })
  //   .then(function(value) {
  //     console.log(value);
  //   })
  //   .catch(function(err) {
  //     console.log(err);
  //   });

  //console.log("data", sessionStorage.getItem("notification_type"));
  // console.log("consumed_data", data.notification_type);
  // console.log("consumed_data", data.notification_body);

  // event.waitUntil(
  //   this.registration.showNotification(data.title, {
  //     body: data.description,
  //     icon: data.icon,
  //   })
  // );
});



// this.addEventListener("push", function (event) {
//   console.log("Push message", event);

//   var data = event.data.text();
//   console.log("Push data: " + data);

//   // if (isJson(data)) {
//   //   //var title = data.title;
//   //   var message = data.message;
//   // } else {
//   //   //var title = "Push Message";
//   //   //var message = data;
//   // }

//   // return this.registration.showNotification(title, {
//   //   body: message,
//   // });
// });

// var isJson = function (str) {
//   try {
//     JSON.parse(str);
//   } catch (e) {
//     return false;
//   }
//   return true;
// };
