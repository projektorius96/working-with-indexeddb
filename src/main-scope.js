import V from "./virtual-versioning-map";

const object_store_name = "object_store_name:anatomy";
const keyPathNS = {
    primary_key_one: 'PK1'
}

/** @tutorial{@link https://github.com/hnasr/indexedDB/blob/master/index.html} */
const IDB = indexedDB.open("db_name:academic-library", V.get("v100"));

// DEV_NOTE # runs only when version changes : suitable for initial data (state) mount
IDB.onupgradeneeded = function(e){
    
    /* console.log(`onupgradeneeded: ${e.target.result}`, e.target.result) */// [PASSED]

    let current_store = null;
    let db = e.target.result;
    // DEV_NOTE # if there's no store by given name, then create one ...
    if (!db.objectStoreNames.contains(object_store_name)) {
        /* === */
        current_store = db.createObjectStore(object_store_name, {
            autoIncrement: true
            /* keyPath: keyPathNS.primary_key_one */
        })
        // console.log(`${current_store}=?`, /* e.g. */current_store.keyPath);
        /* === */

    }

    /** @tutorial{@link https://stackoverflow.com/questions/33709976/uncaught-invalidstateerror-failed-to-execute-transaction-on-idbdatabase-a} */
    /* e.target === current_store */ current_store.transaction.addEventListener("complete",  function(e){

        /* console.log("this == e.target", this, e.target); */// PASSED

        console.log("AT THIS POINT .createObjectStore INTERNAL TRANSACTION IS DONE")
        console.log("READY_TO_START_NEW_TRANSACTION");
                
        // Open a transaction
        const transaction = /* e.target. */db.transaction(db.objectStoreNames.item(0), 'readwrite');
        
        // Get the object store by name
        const objectStoreEntry = transaction.objectStore(db.objectStoreNames.item(0));
        const transactionOne = objectStoreEntry.add({
            /* DEV_NOTE__NEXT_LINE # we use signature of === [namespace.expression] : value === , because object value is expression i.e. we accessing using dot (.) syntax */
            // [/* keyPathNS.primary_key_one */objectStoreEntry.keyPath] : "first_book", /* <= DEV_NOTE # "first_book" should be your record identifier attached to its key whereas the key should be the added record's object store identifier */
            
            // DEV_NOTE # add more values key-value pairs if needed as follows 
            "Your" : "Book"

        }/* , 1 */)
            transactionOne.onsuccess = function(e){
                console.log("transactionOne.onsuccess")
            }
            transactionOne.onerror = function(e){
                console.error("transactionOne.onerror")
            }
        objectStoreEntry.add({"Grey's" : "Anatomy"}
        /* , 2 */)
    })
}

// DEV_NOTE # suitable for state changes that, AFAIK, would reflect even without version change !
IDB.onsuccess = function(e){

        // If the onupgradeneeded event exits successfully, the onsuccess handler of the open database request will then be triggered
        /** @tutorial{@link https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB#creating_or_updating_the_version_of_the_database} */
        
        /* DEV_NOTE # explicitly prepare objectStore with mode: 'readonly' just for reading as follows: */
        const transaction =  e.target.result.transaction([object_store_name], 'readonly');
        const objectStore = transaction.objectStore(object_store_name);
        ///* === cRud: READ (~GET) === */
        const request = objectStore.getAll();// DEV_NOTE # instead we could specify the keyPath || Generator key's autoIncrement[ed] value manually the record of interest ;
        /* const request = objectStore.get(1 || 2);  */       
        request.addEventListener("success", (e)=>{
            const { result } =  e.target; console.log(result)
            /* console.log(`keyPathNS.primary_key_one === e.target.source.keyPath :=`, keyPathNS.primary_key_one === current_objectStore.keyPath); */
        })
        request.addEventListener("error", (e)=>{
            console.log("request (error)=?", e)
        })

    ///* === crUd: UPDATE (~PUT) === */
        // /* === DEV_NOTE # OPEN CONSOLE ON USER-AGENT OF CHOICE OPEN INDEXEDDB UNCOMMENT CODE BLOCK BELOW WHIlST OBSERVING INSTANT CHANGES (MIGHT NEED TO REFRESH OBJECT STORE) === */
        // e.target.result.transaction(object_store_name, "readwrite")
        // .objectStore(object_store_name)
        // .put({
        //     "Nice" : "Book"
        // })

}
IDB.onerror = function(e){
    console.log(`onerror: ${e.target.result}`, e.target.result)
}