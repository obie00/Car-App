window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

//prefixes of window.IDB objects
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange

if (!window.indexedDB) {
    window.alert("Your browser doesn't support a stable version of IndexedDB.")
}
// Initialize Firebase
var config = {
    apiKey: "AIzaSyB0iNp1b38oYRIEnH-f1sjE0R3FqReDdO0",
    authDomain: "it202final-c6a39.firebaseapp.com",
    databaseURL: "https://it202final-c6a39.firebaseio.com",
    storageBucket: "it202final-c6a39.appspot.com",
    messagingSenderId: "51509260967"
};
firebase.initializeApp(config);


form.addEventListener('submit', function(event) {
    event.preventDefault(); //prevent form from doing page reload
    console.log("form submitted"); //show in the log that we submitted
    //append the posted data to the fire database
});

var provider = new firebase.auth.GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/plus.login');

login.addEventListener('click', function(event) {

    firebase.auth().signInWithPopup(provider).then(function(result) {
        // This gives you a Google Access Token. You can use it to access the Google API.
        var token = result.credential.accessToken;
        // The signed-in user info.
        var user = result.user;
        console.log("Authenticated successfully with payload:", user);
        username.value = user.displayName;
        username.disabled = true;

        form.style.display = "block";
        login.style.display = "none";
        // ...
    }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
    });

});


if ('serviceWorker' in navigator) {
    navigator.serviceWorker
        .register('./service-worker.js')
        .then(function() {
            console.log('Service Worker Registered');
        });
}

const cardata = [];
var db;
var request = window.indexedDB.open("newDatabase", 1);

request.onerror = function(event) {
    console.log("error: ");
};

request.onsuccess = function(event) {
    db = request.result;
    console.log("success: " + db);
};

request.onupgradeneeded = function(event) {
    var db = event.target.result;
    var objectStore = db.createObjectStore("employee", {
        keyPath: "id"
    });

    for (var i in cardata) {
        objectStore.add(cardata[i]);
    }
}

function read() {
    var transaction = db.transaction(["employee"]);
    var objectStore = transaction.objectStore("employee");
    var request = objectStore.get("00-03");

    request.onerror = function(event) {
        //alert("Unable to retrieve daa from database!");
    };

    request.onsuccess = function(event) {
        // Do something with the request.result!
        if (request.result) {
            //alert("car: " + request.result.car + ", model: " + request.result.model + ", year: " + request.result.year);
        }

        else {
            //alert("Kenny couldn't be found in your database!");
        }
    };
}



$("#Enter").click(function add() {
        var x = document.getElementById("car2").value;
        var y = document.getElementById("Model2").value;
        var z = document.getElementById("year2").value;
        var request = db.transaction(["employee"], "readwrite")
            .objectStore("employee")
            .add({
                id: x + y + z,
                car: x,
                model: y,
                year: z
            });

        request.onsuccess = function(event) {
            //alert(x + y + z + " has been added to your database.");
        };
        request.onerror = function(event) {
            //alert("Unable to add data\r\n" + x + y + z + " is aready exist in your database! ");
        };
});

        function readAll() {
        var htmlread = "";
        var objectStore = db.transaction("employee").objectStore("employee");

        objectStore.openCursor().onsuccess = function(event) {
            var cursor = event.target.result;

            if (cursor) {
                console.log("car for id ");
                //alert("car for id " + cursor.key + " is " + cursor.value.car + ", model: " + cursor.value.model + ", year: " + cursor.value.year);
                cursor.continue();
                if (cursor.value.car != "" && cursor.value.model != "" && cursor.value.year != "") {
                    htmlread += "<br>" + "car: " + cursor.value.car + ", model: " + cursor.value.model + ", year: " + cursor.value.year + "<br>";
                }
            }
            else {
                //alert("No more entries!");
                $("#indexDB").append(htmlread);
            }
        };
    }


    function remove() {
        var x = document.getElementById("car2").value;
        var request = db.transaction(["employee"], "readwrite")
            .objectStore("employee")
            .delete("FIAT124 Spider2017");

        request.onsuccess = function(event) {
            //alert("Kenny's entry has been removed from your database.");
        };
    }
