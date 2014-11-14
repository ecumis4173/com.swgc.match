var version = "1.9";


function setDatabase(){
    db = window.openDatabase("swgc", version, "swgc", 1000000);
    db.transaction(createDB, errorCB, successCB);
}
function createDB(tx) {

    tx.executeSql('CREATE TABLE IF NOT EXISTS event (event_id INTEGER PRIMARY KEY AUTOINCREMENT, event_name VARCHAR(55), current_round INTEGER, date BIGINT, fee FLOAT)'); 
    //tx.executeSql('ALTER TABLE event ADD current_round INTEGER');
    tx.executeSql('CREATE TABLE IF NOT EXISTS participant (pid INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR, email VARCHAR, skill INTEGER)');
    tx.executeSql('CREATE TABLE IF NOT EXISTS participant_event (pe_id INTEGER PRIMARY KEY AUTOINCREMENT, pid INTEGER, event_id INTEGER, rounds INTEGER, paid FLOAT, rounds_complete INTEGER)');
    tx.executeSql('CREATE TABLE IF NOT EXISTS rounds (round_id INTEGER PRIMARY KEY AUTOINCREMENT, round_num INTEGER, pe_id INTEGER, event_id INTEGER, complete INTEGER, squad INTEGER, position INTEGER, UNIQUE (round_num, pe_id, event_id, squad, position) )');
    tx.executeSql('CREATE TABLE IF NOT EXISTS shot   (shot_id  INTEGER PRIMARY KEY AUTOINCREMENT, round_id  INTEGER, stand INTEGER, shot     INTEGER, hit INTEGER, UNIQUE (round_id, stand, shot))');
}
function successCB(page) {
    //alert("Db created");
}
function errorCB(err, mSql) {
    alert("Error processing SQL: "+err.code+" "+err.message+" SQL:"+mSql);
}
function queryDB(tx) {
    tx.executeSql(sql, [], querySuccess, errorCB);
}
function executeSql(tx) {
    tx.executeSql(sql);
}
function querySuccess(tx, mResults) {
    // this will be empty since no rows were inserted.
    alert("Insert ID = " + mResults.insertId);
    // this will be 0 since it is a select statement
    alert("Rows Affected = " + mResults.rowAffected);
    // the number of rows returned by the select statement
    alert("Insert ID = " + mResults.rows.length);
    result = mResults;
}
function debugAlert(txt){
    alert(txt);
}
function killDb(){
    db = window.openDatabase("swgc", version, "swgc", 1000000);
    db.transaction(function (tx){
        //tx.executeSql('DROP TABLE event');
        //tx.executeSql('DROP TABLE participant');
        //tx.executeSql('DROP TABLE participant_event');
        tx.executeSql('DROP TABLE rounds');
        tx.executeSql('DROP TABLE shot');
    }
    , errorCB, successCB);
}