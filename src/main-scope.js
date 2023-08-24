import V from "./virtual-versioning-map";

const object_store_name = "Don't you cry";
const keyPathNS = {
    primary_key_one: 'PK1'
}

/** @tutorial{@link https://github.com/hnasr/indexedDB/blob/master/index.html} */
const IDB = indexedDB.open("library", V.get("v100"));

// DEV_NOTE # runs only when version changes : suitable for initial data (state) mount
IDB.onupgradeneeded = function(e){
    
    /* console.log(`onupgradeneeded: ${e.target.result}`, e.target.result) */// [PASSED]

    let current_store = null;
    let db = e.target.result;
    // DEV_NOTE # if there's no store by given name, then create one ...
    if (!db.objectStoreNames.contains(object_store_name)) {
        /* === */
        current_store = db.createObjectStore(object_store_name, {
            keyPath: keyPathNS.primary_key_one
        })
        // console.log(`${current_store}=?`, /* e.g. */current_store.keyPath);
        /* === */

    }

    /** @tutorial{@link https://stackoverflow.com/questions/33709976/uncaught-invalidstateerror-failed-to-execute-transaction-on-idbdatabase-a} */
    /* e.target === current_store */ current_store.transaction.addEventListener("complete",  function(e){

        /* console.log("this == e.target", this, e.target); */// PASSED

        console.log("AT THIS POINT .createObjectStore INTERNAL TRANSACTION IS DONE")
        console.log("READY_TO_START_NEW_TRANSACTION");
        // DEV_NOTE # Within a goal of avoiding global pollution, we can use just "db.transaction" as reference rather than explicit "e.target.db.transaction" the later helps if you have no variable
        
        // db
        // .transaction(db.objectStoreNames.item(0), "readwrite")
        // .objectStore(db.objectStoreNames.item(0))
        // .add({
        //     /* DEV_NOTE__NEXT_LINE # we use signature of === [namespace.expression] : value === , because object value is expression i.e. we accessing using dot (.) syntax */
        // [/* keyPathNS.primary_key_one */objectStoreEntry.keyPath] : "first_book",
        // "Cass" : "Green"
        // }/* , "my_first_book" */)
        
        // Open a transaction
        const transaction = /* e.target. */db.transaction(db.objectStoreNames.item(0), 'readwrite');
        
        // Get the object store by name
        const objectStoreEntry = transaction.objectStore(db.objectStoreNames.item(0));
        objectStoreEntry.add({
            /* DEV_NOTE__NEXT_LINE # we use signature of === [namespace.expression] : value === , because object value is expression i.e. we accessing using dot (.) syntax */
            [/* keyPathNS.primary_key_one */objectStoreEntry.keyPath] : "first_book", /* <= DEV_NOTE # "first_book" should be your record identificator attached to its key whereas the key should be the added record's object store identificator */
            
            /* // DEV_NOTE # add more values key-value pairs if needed as follows 
            "Cass" : "Green" */

        }/* , "my_first_book" */)

    })
}

// DEV_NOTE # suitable for state changes that, AFAIK, would reflect even without version change !
IDB.onsuccess = function(e){
        
        // If the onupgradeneeded event exits successfully, the onsuccess handler of the open database request will then be triggered
        /** @tutorial{@link https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB#creating_or_updating_the_version_of_the_database} */
        
        /* DEV_NOTE # explicitly prepare objectStore with mode: 'readonly' just for reading as follows: */
        const transaction =  e.target.result.transaction([object_store_name], 'readonly');
        const objectStore = transaction.objectStore(object_store_name);
        const request = objectStore.get(/* "my_" +  */"first_book");
        // const { name, keyPath } = request.source; console.log(name, keyPath);
        
    ///* === cRud: READ (~GET) === */
        // request.addEventListener("success", (e)=>{
        //     const requested_data =  e.target.result;
        //     const current_objectStore =  e.target.source;
        //     console.log("requested_data (/GET)=?", requested_data)
        //     console.log("request (success)=?", current_objectStore.keyPath)
        //     /* console.log(`keyPathNS.primary_key_one === e.target.source.keyPath :=`, keyPathNS.primary_key_one === current_objectStore.keyPath); */
        // })
        // request.addEventListener("error", (e)=>{
        //     console.log("request (error)=?", e)
        // })

    ///* === crUd: UPDATE (~PUT) === */
        ///* === DEV_NOTE # OPEN CONSOLE ON USER-AGENT OF CHOICE OPEN INDEXEDDB UNCOMMENT CODE BLOCK BELOW WHIlST OBSERVING INSTANT CHANGES (MIGHT NEED TO REFRESH OBJECT STORE) === */
        // e.target.result.transaction(object_store_name, "readwrite")
        // .objectStore(object_store_name)
        // .put({
        //     [keyPathNS.primary_key_one] : "first_book",
        //     "Nice" : "Book"
        // })

}
IDB.onerror = function(e){
    console.log(`onerror: ${e.target.result}`, e.target.result)
}