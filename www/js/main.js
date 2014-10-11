function goToPage(page, param) {
    if(param)
        window.location.href=page+getId(param);
    else
        window.location.href=page;
}
function addEvent(redirect) {
    var name = document.getElementById("eventName").value;
    var date = document.getElementById("date").value;
    var fee = document.getElementById("fee").value;
    if(getId('id') > 0)
        sql = "UPDATE event event_name='"+name+"', date='"+date+"', fee='"+fee+"' WHERE event_id='"+getId('id')+"'";
    else
        sql = "INSERT INTO event (event_name, date, fee) VALUES ('"+name+"','"+date+"','"+fee+"')";
    db = window.openDatabase("swgc", version, "swgc", 1000000);
    db.transaction(
        function (tx){
            tx.executeSql(sql, [], 
                function (tx, results){
                    goToPage('event.html?id='+results.insertId);
                }
            )
        }
    ,errorCB);
}
function addPerson() {
    var name = document.getElementById("name").value;
    var date = document.getElementById("email").value;
    var fee = document.getElementById("skill").value;
    sql = "INSERT INTO participant (name, email, skill) VALUES ('"+name+"','"+email+"','"+skill+"')";
    db = window.openDatabase("swgc", version, "swgc", 1000000);
    db.transaction(
        function (tx){
            tx.executeSql(sql, [],
                function (tx, results){
                    var pid = results.insertId;
                    registerUser(pid);
                }
        )}
    , errorCB);
       
}
function registerUser(pid){
    sql = "INSERT INTO participant_event (pid, event_id) VALUES ('"+pid+"','"+getId('id')+"')";
    db.transaction(
        function (tx){
            tx.executeSql(sql, [],
                function (tx, result){
                    var pe_id = result.insertId;
                    goToPage('registration.html?id='+getId('id')+'&pe='+pe_id)
            }
        )}
    , errorCB);
}

function getEvents(){
    var sql = "SELECT * FROM event ORDER BY date DESC";
    var result;
    db = window.openDatabase("swgc", version, "swgc", 1000000);
    db.transaction(
        function (tx){
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
function getEvent(id){
    var sql = "SELECT * FROM event WHERE event_id='"+id+"'";
    var result;
    db = window.openDatabase("swgc", version, "swgc", 1000000);
    db.transaction(
        function (tx){
            tx.executeSql(sql, [], 
                function (tx, result){
                    for (var i=0; i<result.rows.length; i++){ 
                        var row=result.rows.item(i);
                        //alert(" " + row['event_id']+" " + row['event_name']+" " + row['date']+" ");
                        document.getElementById("eventName").value=row['event_name'];
                        document.getElementById("date").value=row['date'];
                        document.getElementById("fee").value=row['fee'];
                        document.getElementById("fee").value=row['fee'];
                        
                    } 
                }            
            , errorCB);
        });
}
function getParticipants(){
    var sql = "SELECT * FROM participant_event pe JOIN participant p ON p.pid=pe.pid ORDER BY p.name";
    var result;
    db = window.openDatabase("swgc", version, "swgc", 1000000);
    db.transaction(
        function (tx,errorCB){
            tx.executeSql(sql, [], 
                function (tx, result){
                    for (var i=0; i<result.rows.length; i++){ 
                        var row=result.rows.item(i);
                        var stringout = "<div onClick=goToPage('registration.html?id="+row['pe_id']+"')>" + row['name']+"</div>"; 
                        document.getElementById("participantList").innerHTML = document.getElementById("participantList").innerHTML +stringout;
                    } 
                }            
            , errorCB);
        });
}
function getAllParticipants(){
    var sql = "SELECT * FROM participant p "+
              "WHERE p.pid NOT IN (SELECT pid FROM participant_event WHERE event_id='"+getId('id')+"') ORDER BY p.name ";
    var result;
    db = window.openDatabase("swgc", version, "swgc", 1000000);
    db.transaction(
        function (tx,errorCB){
            tx.executeSql(sql, [], 
                function (tx, result){
                    for (var i=0; i<result.rows.length; i++){ 
                        var row=result.rows.item(i);
                        var stringout = "<div onClick=registerUser('"+row['pid']+"')>"+row['name']+"</div>"; 
                        document.getElementById("allParticipantsList").innerHTML = document.getElementById("allParticipantsList").innerHTML +stringout;
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
function getId(param) {
    var $_GET = {};
    document.location.search.replace(/\??(?:([^=]+)=([^&]*)&?)/g, function () {
        function decode(s) {
            return decodeURIComponent(s.split("+").join(" "));
        }
        $_GET[decode(arguments[1])] = decode(arguments[2]);
    });
   return $_GET[param];
}