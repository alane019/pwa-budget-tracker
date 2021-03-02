/* 

Summary: 
 - Initiates request for a new indexedDB instance called "budget"
 - "on upgrade needed"... creates object store called "pending", which auto-increments
 - "on success" the event target result is assigned to the db variable. 
        - If browser client's "navigator" is "onLine", checkDatabase method is invoked.
 - "on error" -- log err to console
 - Delcare function: saveRecord
 - Declare function: checkDatabase (handler function for listener set on line below)
 - Set an event listener that runs checkDatabase function if window client is "online"
    - most browsers will be online if host is connected to network, and browser is NOT in "offline mode"
*/

let db;
// this creates a new indexedDB request for a database called "budget"

const request = indexedDB.open("budget", 1);

request.onupgradeneeded = function(event) {
    // this creates an object store called "pending", with autoIncrementing activated 
    const db = event.target.result; 
    db.createObjectStore("pending", { autoIncrement: true});
};

request.onsuccess = function(event) {
    // result of event's target is assigned to db
    db = event.target.result; 
    // Invokes "checkDatabase()" if browser client's navigator is "onLine"  
    if(navigator.onLine) {
        checkDatabase();
    }
};

request.onerror = function(event) {
    //if error, logged to console 
    console.log(" \n  Error found @ request.onerror " 
    + " \n   Error message:    " + event.target.errorCode);
}



// Delcare function: saveRecord
 

// Declare function: checkDatabase ( handler function for event listener set below)

//  Set an event listener that runs checkDatabase function if window client is "online"