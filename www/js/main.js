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
    var sql = "INSERT INTO event (event_name, date, fee, current_round) VALUES ('"+name+"','"+date+"','"+fee+"','1')";
    if(getId('id') > 0)
        sql = "UPDATE event SET event_name='"+name+"', date='"+date+"', fee='"+fee+"' WHERE event_id='"+getId('id')+"'";  
    //alert(sql);
    db = window.openDatabase("swgc", version, "swgc", 1000000);
    //alert(sql);
    db.transaction(
        function (tx){
            tx.executeSql(sql, [], 
                function (tx, results){
                    var id = getId('id')
                    if(getId('id') == null || getId('id') == 0)
                        id = results.insertId;
                    goToPage('event.html?id='+id);
                }
            )
        }
    ,errorCB);
}
function addPerson(page) {
    var name = document.getElementById("name").value;
    var email = document.getElementById("email").value;
	try{
		var pid = document.getElementById("pid").value;
	} catch (e){}
	var e = document.getElementById("skill");
	var skill = e.options[e.selectedIndex].value;
	sql = "INSERT INTO participant (name, email, skill) VALUES ('"+name+"','"+email+"','"+skill+"')";
	if(getId('pe') > 0)
		sql = "UPDATE participant SET name='"+name+"', email='"+email+"', skill='"+skill+"' WHERE pid="+pid;
	
	
    db = window.openDatabase("swgc", version, "swgc", 1000000);
    db.transaction(
        function (tx){
            tx.executeSql(sql, [],
                function (tx, results){
					if(redirect == true)
						goToPage('participants.html?id=', 'id');
					else {
						try{
							var pid = results.insertId;
							registerUser(pid);
						} catch(e){
							getRegistration(getId('pe'))
						}
					}
                }
        )}
    , errorCB);
       
}
function rmRegistration(){
    sql = "DELETE FROM participant_event WHERE pe_id='"+getId('pe')+"'";
    //alert(sql);
    db.transaction(
        function (tx){
            tx.executeSql(sql, [],
                function (tx, result){
                    goToPage('participants.html?id='+getId('id'))
            }
        )}
    , errorCB);
}
function registerUser(pid){
    sql = "INSERT INTO participant_event (pid, event_id, rounds) VALUES ('"+pid+"','"+getId('id')+"','1')";
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
function getRegistration(pe_id){
    sql = "SELECT name, rounds, fee, paid, skill, p.pid, email "+
              "FROM participant_event pe "+
              "JOIN participant p ON p.pid=pe.pid "+
              "JOIN event e ON e.event_id=pe.event_id "+
              "WHERE pe.pe_id='"+pe_id+"'";
    var result;
    db = window.openDatabase("swgc", version, "swgc", 1000000);
    db.transaction(
        function (tx){
            tx.executeSql(sql, [], 
                function (tx, result){
                    for (var i=0; i<result.rows.length; i++){ 
                        var row=result.rows.item(i);
                        document.getElementById("name").value=row['name'];
						document.getElementById("email").value=row['email'];
                        var rounds = 1;
                        if(row['rounds'] > 1)
                            rounds = row['rounds'];
                        document.getElementById("rounds").value=rounds;
                        var subtotal = rounds*row['fee'];
                        document.getElementById("subtotal").innerHTML=subtotal;
                        var paid = 0;
                        if(row['paid'] > 0)
                            paid = row['paid'];
                        document.getElementById("paid").innerHTML=paid;
                        var balance = subtotal - paid;
                        document.getElementById("balance").innerHTML=balance;
						document.getElementById("skill").value=row['skill'];
						//var skill = e.options[e.selectedIndex].value=row['skill'];
						document.getElementById("pid").value=row['pid'];
                    } 
                }            
            , errorCB);
        });
}
function reCalc(page){
    //update rounds
    var rounds = document.getElementById("rounds").value;
    var paid = document.getElementById("paid").value;
    sql = "UPDATE participant_event SET rounds='"+rounds+"', paid='"+paid+"' WHERE pe_id='"+getId('pe')+"'";
    db = window.openDatabase("swgc", version, "swgc", 1000000);
    db.transaction(
        function (tx){
            tx.executeSql(sql, [], 
                function (tx, result){
                    //update page
					addPerson(page);
                }
            )
        });
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
                        var stringout = "<div id=e"+i+" onClick=goToPage('event.html?id="+row['event_id']+"')>"+row['event_id']+" " + row['event_name']+" " + row['date'] + "</a></div>"; 
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
    var sql = "SELECT * FROM participant_event pe JOIN participant p ON p.pid=pe.pid WHERE pe.event_id='"+getId('id')+"' ORDER BY p.name";
    var result;
    db = window.openDatabase("swgc", version, "swgc", 1000000);
    db.transaction(
        function (tx,errorCB){
            tx.executeSql(sql, [], 
                function (tx, result){
                    for (var i=0; i<result.rows.length; i++){ 
                        var row=result.rows.item(i);
                        var stringout = "<div onClick=goToPage('registration.html?id="+getId('id')+"&pe="+row['pe_id']+"')>" + row['name']+"</div>";
                        document.getElementById("participantList").innerHTML = document.getElementById("participantList").innerHTML +stringout;
                    } 
                }            
            , errorCB);
        });
}
function delParticipant(pe_id){
    var sql = "DELETE FROM participant_event WHERE pe_id='"+pe_id+"'";
    var result;
    db = window.openDatabase("swgc", version, "swgc", 1000000);
    db.transaction(
        function (tx,errorCB){
            tx.executeSql(sql, [], 
                function (tx, result){
                     document.getElementById("participantList").innerHTML="";
                    getParticipants();
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