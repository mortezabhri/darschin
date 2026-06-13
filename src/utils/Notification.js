function requestPermission() {
     return Notification.requestPermission();
}

function getPermission () {
       return Notification.permission
}

function showNotif(title , body) {
       if (Notification.permission === "granted") {
              navigator.serviceWorker.getRegistration().then(reg => {
                     if (reg) {
                            reg.showNotification(title, {
                                   body: body, 
                                   vibrate: [200, 100, 200],
                                   dir : "rtl",
                                   icon: "/darschin/favicon/android-chrome-192x192.png"
                            });
                     } else {
                            console.log("service worker not found!")
                     }
              });
       }
}

export {
       requestPermission,
       getPermission,
       showNotif
}