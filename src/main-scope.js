import V from "./virtual-versioning-map";

const current_readings = 'Math-book';
const namespaces = {
    primary_key_one: 'PK1'
}

/** @tutorial{@link https://github.com/hnasr/indexedDB/blob/master/index.html} */
let IDB = indexedDB.open("library", V.get("v100"));

// DEV_NOTE # runs only when version changes : suitable for initial data (state) mount
IDB.onupgradeneeded = function(e){
    console.log(`onupgradeneeded: ${e.target.result}`, e.target.result)

    let current_store = null;
    let db = e.target.result;
    if (!db.objectStoreNames.contains(current_readings)) { // if there's no "books" store
        
        /* === */
        current_store = db.createObjectStore(current_readings, {
            keyPath: namespaces.primary_key_one
        })
        // console.log(`${current_store}=?`, /* e.g. */current_store.keyPath);
        /* === */

    }

        /** @tutorial{@link https://stackoverflow.com/questions/33709976/uncaught-invalidstateerror-failed-to-execute-transaction-on-idbdatabase-a} */
        /* e.target === current_store */ current_store.transaction.addEventListener("complete",  function(e){
            console.log("createObjectStore internal transaction is done")
            console.log("READY_TO_START_NEW_TRANSACTION");
            // DEV_NOTE # Within a goal of avoiding global pollution, we can use just "db.transaction" as reference rather than explicit "e.target.db.transaction" the later helps if you have no variable
            /* e.target. */db
            .transaction(current_readings, "readwrite")
            .objectStore(current_readings)
            .add({
                [namespaces.primary_key_one] : "first_book",
                "Hello" : "Init"
            })
        })
}

// DEV_NOTE # suitable for state changes that, AFAIK, would reflect even without version change !
IDB.onsuccess = function(e){
    // If the onupgradeneeded event exits successfully, the onsuccess handler of the open database request will then be triggered
    /** @tutorial{@link https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB#creating_or_updating_the_version_of_the_database} */
    console.log(`onsuccess: ${e.target.result}`, e.target.result)
    /*
        console.log(`e.target == this :=`, e.target == this);
        console.log(`current_database_name := ${this.result.name}`) 
    */
    const transaction =  e.target.result.transaction([current_readings]);
    const objectStore = transaction.objectStore(current_readings);
    const request = objectStore.get("first_book");
    request.addEventListener("success", (e)=>{
        const requested_data =  e.target.result;
        const current_objectStore =  e.target.source;
        console.log("requested_data (/GET)=?", requested_data)
        console.log("request (success)=?", current_objectStore.keyPath)
        /* console.log(`namespaces.primary_key_one === e.target.source.keyPath :=`, namespaces.primary_key_one === current_objectStore.keyPath); */
    })
    request.addEventListener("error", (e)=>{
        console.log("request (error)=?", e)
    })



    // // === DEV_NOTE # OPEN CONSOLE ON USER-AGENT OF CHOICE OPEN INDEXEDDB UNCOMMENT CODE BLOCK BELOW WHIlST OBSERVING INSTANT CHANGES (MIGHT NEED TO REFRESH OBJECT STORE) ===
    /* e.target.result.transaction(current_readings, "readwrite")
    .objectStore(current_readings)
    .put({
        [namespaces.primary_key_one] : "first_book",
        "Hello" : "World"
    }) */
}
IDB.onerror = function(e){
    console.log(`onerror: ${e.target.result}`, e.target.result)
}