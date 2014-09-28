var sql; 

function goToPage(page) {
    window.location.href=page;
}
function addEvent(redirect) {
    var name = document.getElementById("eventName").value;
    var date = document.getElementById("date").value;
    var fee = document.getElementById("fee").value;
    sql = "INSERT INTO event (event_name, date, fee) VALUES ('"+name+"','"+date+"','"+fee+"')";
    db = window.openDatabase("swgc", "1.0", "swgc", 1000000);
    db.transaction(executeSql, errorCB, successCB);
}
function getEvents(){
    sql = "SELECT * FROM event";
    db = window.openDatabase("swgc", "1.0", "swgc", 1000000);
    db.transaction(executeSql, errorCB, successCB);
}
function executeSql(tx) {
    tx.executeSql(sql);
}
function errorCB(err, sql) {
    debugAlert("Error processing SQL: "+err.code+" "+err.message);
}
function successCB() {
    debugAlert("success!");
}
function debugAlert(txt){
    alert(txt);
}