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
                        var stringout = "<div onClick=goToPage('event.html?id="+row['event_id']+"')>" + row['event_id']+" " + row['event_name']+" " + row['date'] + "</div>"; 
                        document.getElementById("eventList").innerHTML = document.getElementById("eventList").innerHTML +stringout;
                    } 
                }            
            , errorCB);
        });
}
function getParticipants(){
    var sql = "SELECT * FROM participant_event pe JOIN participant p ON p.pid=pe.pid ORDER BY p.name";
    var result;
    db = window.openDatabase("swgc", "1.0", "swgc", 1000000);
    db.transaction(
        function (tx,errorCB){
            tx.executeSql(sql, [], 
                function (tx, result){
                    for (var i=0; i<result.rows.length; i++){ 
                        var row=result.rows.item(i);
                        //alert(" " + row['event_id']+" " + row['event_name']+" " + row['date']+" ");
                        var stringout = "<div onClick=goToPage('registration.html?id="+row['pe_id']+"')>" + row['name']+"</div>"; 
                        document.getElementById("participantEventList").innerHTML = document.getElementById("participantEventList").innerHTML +stringout;
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
function getId() {
    var $_GET = {};
    document.location.search.replace(/\??(?:([^=]+)=([^&]*)&?)/g, function () {
        function decode(s) {
            return decodeURIComponent(s.split("+").join(" "));
        }
        $_GET[decode(arguments[1])] = decode(arguments[2]);
    });
   return $_GET["id"];
}