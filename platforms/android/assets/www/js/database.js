// Wait for PhoneGap to load
//
db;
sql;

function populateDB(tx) {
    tx.executeSql('CREATE TABLE IF NOT EXISTS club (club_id INTEGER PRIMARY KEY, club_name VARCHAR(255), club_zip VARCHAR(5))');
    tx.executeSql('INSERT INTO club (club_id, club_name, club_zip) VALUES (1, "Sir Walter Gun Club", 27761)');  //TEMPORARY
    
    tx.executeSql('CREATE TABLE IF NOT EXISTS event (event_id INTEGER PRIMARY KEY AUTOINCREMENT, event_name VARCHAR(255), date BIGINT, 
                  +'fee FLOAT, round INTEGER, shots INTEGER, shots_per_stand INTEGER, shots_per_round INTEGER)');
    
    tx.executeSql('CREATE TABLE IF NOT EXISTS participant (pid INTEGER PRIMARY KEY AUTOINCREMENT, pid_cloud INTEGER, name VARCHAR(255), email VARCHAR(255))');
    
    tx.executeSql('CREATE TABLE IF NOT EXISTS participant_event (pe_id INTEGER PRIMARY KEY AUTOINCREMENT, pid INTEGER, event_id INTEGER, rounds INTEGER, 
                  +'fee_per_round FLOAT, paid FLOAT, rounds_complete INTEGER, order_participants INTEGER)');
    tx.executeSql('CREATE TABLE IF NOT EXISTS shot (shot_id INTEGER PRIMARY KEY AUTOINCREMENT, pid INTEGER, event_id INTEGER, round INTEGER, shot INTEGER, hit INTEGER)');
}
function errorCB(err, sql) {
    debugAlert("Error processing SQL: "+err.code);
}
function successCB() {
    debugAlert("success!");
}
function queryDB(tx) {
    tx.executeSql(sql, [], querySuccess, errorCB);
}
function querySuccess(tx, results) {
    // this will be empty since no rows were inserted.
    alert("Insert ID = " + results.insertId);
    // this will be 0 since it is a select statement
    alert("Rows Affected = " + results.rowAffected);
    // the number of rows returned by the select statement
    alert("Insert ID = " + results.rows.length);
}
function debugAlert(txt){
    alert(txt);
}

