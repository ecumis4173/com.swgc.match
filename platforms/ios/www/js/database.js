// Wait for PhoneGap to load
//
var db
document.addEventListener("deviceready", onDeviceReady, false);


// PhoneGap is ready
function onDeviceReady() {
    db = window.openDatabase("swgc", "1.0", "swgc", 1000000);
    populateDB(db);
}
function populateDB(tx) {
    //tx.executeSql('CREATE TABLE IF NOT EXISTS DEMO (id unique, data)');
    //tx.executeSql('INSERT INTO DEMO (id, data) VALUES (2, "Second row")');
    
    tx.executeSql('CREATE TABLE IF NOT EXISTS club (club_id INTEGER PRIMARY KEY, club_name VARCHAR(255), club_zip VARCHAR(5))');
    tx.executeSql('CREATE TABLE IF NOT EXISTS event (event_id INTEGER PRIMARY KEY AUTOINCREMENT, event_name VARCHAR(255), date, feeFLOAT(6,2), round INTEGER, max_hits INTEGER)');
    
    tx.executeSql('CREATE TABLE IF NOT EXISTS participant (pid INTEGER PRIMARY KEY AUTOINCREMENT, pid_cloud INTEGER, name VARCHAR(255), emailCARCHAR(255))');
    
    tx.executeSql('CREATE TABLE IF NOT EXISTS participant_event (pid INTEGER, event_id INTEGER, rounds INTEGER,'
                + 'fee_per_round FLOAT(6,2), paid FLOAT(6,2), rounds_complete INTEGER, order INTEGER, PRIMARY KEY (pid, event_id))');
    
    tx.executeSql('CREATE TABLE IF NOT EXISTS participant_score (pid INTEGER, event_id INTEGER, round INTEGER, hits INTEGER, PRIMARY KEY (pid, event_id))');
    
}
function errorCB(err) {
    alert("Error processing SQL: "+err.code);
}
function successCB() {
    alert("success!");
}
function queryDB(tx) {
    tx.executeSql('SELECT * FROM DEMO', [], querySuccess, errorCB);
}
function querySuccess(tx, results) {
    // this will be empty since no rows were inserted.
    console.log("Insert ID = " + results.insertId);
    // this will be 0 since it is a select statement
    console.log("Rows Affected = " + results.rowAffected);
    // the number of rows returned by the select statement
    console.log("Insert ID = " + results.rows.length);
}
function errorCB(err) {
    alert("Error processing SQL: "+err.code);
}