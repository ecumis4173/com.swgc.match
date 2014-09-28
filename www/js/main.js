function goToPage(page) {
    window.location.href=page;
}
function addEvent(redirect) {
    var name = document.getElementById("eventName").value;
    var date = document.getElementById("date").value;
    var fee = document.getElementById("fee").value;
    sql = "INSERT INTO event (event_name, date, fee) VALUES ('"+name+"','"+date+"','"+fee+"')";
    db = window.openDatabase("swgc", "1.0", "swgc", 1000000);
    db.transaction(executeSql, errorCB, goToPage('index.html'));
}
function getEvents(){
    var sql = "SELECT * FROM event ORDER BY date DESC";
    var result;
    db = window.openDatabase("swgc", "1.0", "swgc", 1000000);
    db.transaction(
        function (tx,errorCB){
            tx.executeSql(sql, [], 
                function (tx, result){
                    for (var i=0; i<result.rows.length; i++){ 
                        var row=result.rows.item(i);
                        //alert(" " + row['event_id']+" " + row['event_name']+" " + row['date']+" ");
                        var stringout = "<div onClick=goToPage('event.html')>" + row['event_id']+" " + row['event_name']+" " + row['date'] + "</div>"; 
                        document.getElementById("eventList").innerHTML = document.getElementById("eventList").innerHTML +stringout;
                    } 
                }            
            , errorCB);
        });
}
function queryDB(tx,errorCB){
    tx.executeSql(sql, [], resultSet, errorCB);
}

function debugAlert(txt){
    alert(txt);
}