iOlog("isOnline started");

isOwnAccount = false;
stop = 0;

/* Discuss button */if (localStorage.getItem("iOdiscuss") == "1") {try {try {nav = document.getElementsByClassName("site-nav")[0].innerHTML;document.getElementsByClassName("site-nav")[0].innerHTML = nav.replace('<li class="last">', '<li><a href="/discuss">Discuss</a></li><li class="last">');} catch (err) {document.getElementsByClassName("link tips")[0].outerHTML += '<li class="link about"><a href="/discuss"><span>Discuss</span></a></li>';}} catch (err) {}}if (window.location.href.substring(30,100).substring(0, window.location.href.substring(30,100).indexOf('/')).toLowerCase() == "discussbutton") {document.getElementsByClassName("box slider-carousel-container prevent-select")[2].remove(); document.getElementsByClassName("box slider-carousel-container prevent-select")[1].remove(); document.getElementsByClassName("box slider-carousel-container prevent-select")[0].remove();document.getElementsByClassName("group")[0].innerText="isOnline extra option";stop = "Discuss button page";if (localStorage.getItem("iOdiscuss") != "1") {document.getElementsByClassName("location")[0].innerHTML += " | <a id='discussbutton'>Enable</a>";document.getElementById("discussbutton").onclick = function() {localStorage.setItem("iOdiscuss", "1");location.reload();};} else {document.getElementsByClassName("location")[0].innerHTML += " | <a id='discussbutton'>Disable</a>";document.getElementById("discussbutton").onclick = function() {localStorage.removeItem("iOdiscuss");location.reload();};}}

chrome.storage.sync.get(["iOaccounts","iOfriendlist","iOfriendsenabled"], function (data) {
    registeredUsers = JSON.stringify(data) === "{}" ? [] : JSON.parse(data.iOaccounts);
    friendList = data.iOfriendlist;
    friendListEnabled = data.iOfriendsenabled==1;
    try{chrome.runtime.sendMessage({setuninstallurl: registeredUsers[0]});}catch(err){}
    start();
});

if(location.href == "https://scratch.mit.edu/isonline-extension/update") {
    document.documentElement.innerHTML = "<!DOCTYPE html><html><head><style>body{background: #f0f0f0;margin: 0;}#vcenter{position: absolute;top: 50%;width: 100%;margin-top: -100px;}h1{text-align: center;font-family: trebuchet ms, courier new, sans-serif;font-size: 2em;}#loader,#loader:before,#loader:after{border-radius: 50%;width: 2.5em;height: 2.5em;-webkit-animation-fill-mode: both;animation-fill-mode: both;-webkit-animation: load7 1.8s infinite ease-in-out;animation: load7 1.8s infinite ease-in-out;}#loader{color: #098e8b;font-size: 10px;margin: 80px auto;position: relative;text-indent: -9999em;-webkit-transform: translateZ(0);-ms-transform: translateZ(0);transform: translateZ(0);-webkit-animation-delay: -0.16s;animation-delay: -0.16s;}#loader:before,#loader:after{content: '';position: absolute;top: 0;}#loader:before{left: -3.5em;-webkit-animation-delay: -0.32s;animation-delay: -0.32s;}#loader:after{left: 3.5em;}@-webkit-keyframes load7{0%,80%,100%{box-shadow: 0 2.5em 0 -1.3em;}40%{box-shadow: 0 2.5em 0 0;}}@keyframes load7{0%,80%,100%{box-shadow: 0 2.5em 0 -1.3em;}40%{box-shadow: 0 2.5em 0 0;}}</style></head><body><div id='vcenter'><h1 id='header'>Redirecting to isOnline update page... <br>(please don't close this tab)</h1><div id='loader'></div></div></body></html>";
    if (localStorage.getItem("iOaccounts") !== null) {
        LSaccounts = JSON.parse(localStorage.getItem("iOaccounts"));
        transition(0);
    } else{
        window.location="https://isonlineupdate.blogspot.com";}
} // Update

/* Easter egg */      if(location.href.toLowerCase().startsWith("https://scratch.mit.edu/search/") && /\?q=the(%20|\+)best\1extension/i.test(location.search)) window.location = "https://scratch.mit.edu/users/isOnlineV2/";

function main() {

    /* Data for helping page*/ if(location.href.toLowerCase().startsWith("https://scratch.mit.edu/isonline-extension/helpdata")) {stop="On data page";document.documentElement.innerHTML = "<center><h2><b>ONLY give this information to the official isOnline account, @isOnlineV2.</b></h2></center><br><br><small>" + JSON.stringify(localStorage)+ " / " + JSON.stringify(registeredUsers)+ " / " + navigator.userAgent + " / Version: "+JSON.stringify(chrome.runtime.getManifest().version) + "</small>";}

    /* Redirect to verification */ if(location.href.toLowerCase().startsWith("https://scratch.mit.edu/isonline-extension/register")) {window.location = "https://scratchtools.tk/isonline/register/#"+localuser;}

    if (window.location.href.startsWith("https://scratch.mit.edu/isonline-extension/verify")) {
        stop = "On verification page";
        validateAccount();} // Account validation

    if (registeredUsers.length === 0) {
        stop = "User didn't validate any account.";
        isError();
        didntValidate();}

    if (registeredUsers.findIndex(user => user.name === localuser) === -1 && registeredUsers.length !== 0) {
        stop = "User validated another account.";
        try{document.getElementsByClassName("location")[0].innerHTML += ' | <small><a href="https://scratchtools.tk/isonline/register/" target="_blank">'+chrome.i18n.getMessage("validateprofilelink")+'</small>';}catch(err){}
        unvalidatedAcc();}

    try{key = registeredUsers.find(user => user.name === localuser).key;
        if (key == "changed") {keyWasChanged("y");stop="Key was changed";}}catch(err){}

    if(stop!==0){console.error("isOnline was stopped: "+stop);return;}

    url = window.location.href;
    user = window.location.href.substring(30,100).substring(0, window.location.href.substring(30,100).indexOf('/'));
    iOlog("Profile: " + user);
    iOlog("Local username: " + localuser);

    if (time()-localStorage.getItem("iOlastOn") > 10 && localstatus() == "online") {setOnline();}

    /* Manage statuses */ window.addEventListener('load',function(){update();setInterval(update, 3000);});

    if (url.substring(24,29) == 'users' && (url.match(/\//g) || []).length == 5) {
        iOlog("Detected user is in a profile");
        /* Add status box next to location */ document.getElementsByClassName("location")[0].innerHTML += ' | <span style="display:inline" id="iOstatus"></span>';
        if (localuser.toUpperCase() == user.toUpperCase()) {iOlog("Detected user is their own profile");isOwn();} else {
            iOcrown();
            if(time()-localStorage.getItem("iOlastprofile")>3){status();}else{
                document.getElementById("iOstatus").innerHTML = "<a id='clickforstatus'>"+chrome.i18n.getMessage("clickforstatus")+"</a>";
                document.getElementById("clickforstatus").onclick = status;}
            localStorage.setItem("iOlastprofile", time());
        }
    }

} // main function







function update() {
    if (stop !== 0 || window.location.href.startsWith("https://scratch.mit.edu/isonline-extension")) {return;}
    if (localstatus() == "online") {
        updateStatus("");
        if (time()-localStorage.getItem("iOlastOn") > 240 && time()-localStorage.getItem("iOlastAbs") > 120) {
            absentrequest = new XMLHttpRequest();
            absentrequest.open("POST", 'https://scratchtools.tk/isonline/api/v1/' + localuser + '/' + key + '/set/absent', true);
            absentrequest.send();
            checkResponse(absentrequest);
            localStorage.setItem("iOlastAbs", time());
            iOlog("Sent away request");}}
    if (localstatus() == "absent"){
        updateStatus("orange");
        if (time()-localStorage.getItem("iOlastAbs") > 120) {
            absentrequest = new XMLHttpRequest();
            absentrequest.open("POST", 'https://scratchtools.tk/isonline/api/v1/' + localuser + '/' + key + '/set/absent', true);
            absentrequest.send();
            checkResponse(absentrequest);
            localStorage.setItem("iOlastAbs", time());
            iOlog("Sent away request");}}
    if (localstatus() == "offline") {
        updateStatus("gray");}
}



function status() {

    if(stop!==0){return;}

    iOlog("Started status scan");

    document.getElementById("iOstatus").innerHTML=chrome.i18n.getMessage("loadingstatus");

    try{
        var a = document.getElementsByClassName("activity-stream")[0].getElementsByClassName("time")[0].innerText;
        var b=["0 minutes ago", "1 minute ago", "2 minutes ago", "3 minutes ago", "4 minutes ago", "5 minutes ago"];
        if(b.includes(a) && !friendListEnabled){probablyOnline();}
        if(b.includes(a) && !friendListEnabled){return;}
    }catch(err){}

    getstatus = new XMLHttpRequest();getstatus.open("GET", ' https://scratchtools.tk/isonline/api/v1/' + localuser + '/' + key + "/get/" + user, true);getstatus.send();

    getstatus.onreadystatechange = function() {
        if (getstatus.readyState === 4) {
            if (getstatus.status === 200) {

                response  = getstatus.responseText;
                timestamp = JSON.parse(response).timestamp;
                var status = JSON.parse(response).status;

                if (status == "online") {
                    if (time() - timestamp < 300) {isOnline();friendListButtons();} else{isOffline();friendListButtons();}}

                if (status == "absent") {
                    if (time() - timestamp < 180) {isAbsent();friendListButtons();} else{isOffline();friendListButtons();}}

                if (time()-timestamp>604800) {
                    if (typeof a !== 'undefined'){if (!(a.includes("week") || a.includes("month") || a.includes("year"))){isUnknown();}}}

            } // if 200

            if (getstatus.status === 404) {noiO();}

            if (getstatus.status === 403) {
                isError();
                var status = JSON.parse(getstatus.responseText).status;
                if (status=="incorrect key") {stop = "Key was changed";keyWasChanged("n");}
                if (status=="bot") {stop = "User is a bot";isBot();}
            }

            if (getstatus.status === 500) {isError();}


        }}; // on ready

}

function isOwn(){
    iOcrown();
    opt = [{"name": chrome.i18n.getMessage("onlineauto"),   "value" : "online",  "color": "green"},
           {"name": chrome.i18n.getMessage("absent"),       "value" : "absent",  "color": "orange"},
           {"name": chrome.i18n.getMessage("offlineghost"), "value" : "offline", "color": "gray"}];
    isOwnAccount = true;
    document.getElementById("iOstatus").innerHTML = '<img id="iostatusimage" src="https://scratchtools.tk/isonline/assets/' + (localstatus() === "ghost" ? "offline" : localstatus()) + '.svg" height="12" width="12">';
    document.getElementById("iOstatus").innerHTML += " <select id='ioselect' style='font-weight: color: " + opt.find(k => localstatus() === k.value).color + "; width: 132px; padding:0px; font-size:13px; height:23px; margin:0px;'>" + opt.map(k => "<option style='color:" + k.color + ";' " + (k.value === localstatus() ? "selected" : "") +">" + k.name + "</option>") + "</select>" + " <small><div id=\"ownstatushelp\" style=\"display:inline\" title=\""+chrome.i18n.getMessage("ownstatushelp")+"\">ℹ️<\/div><\/small>";
    document.getElementById("ioselect").addEventListener("change", changed);
}

function isOnline() {
    iOlog("Detected that the user is online");
    document.getElementById("iOstatus").innerHTML = '<img src="https://scratchtools.tk/isonline/assets/online.svg" height="12" width="12"> <span id="iOstatustext" style="color:green">' + chrome.i18n.getMessage("online") + '</span>' ;}

function probablyOnline() {
    iOlog("Detected that the user is probably online");
    document.getElementById("iOstatus").innerHTML = '<img src="https://scratchtools.tk/isonline/assets/online.svg" height="12" width="12"> <span id="iOstatustext" style="color:green">' + chrome.i18n.getMessage("probablyonline") + '</span>' + " <small><div id=\"statushelp\" style=\"display:inline\" title=\""+chrome.i18n.getMessage("probablyonlinehelp")+"\">ℹ️<\/div><\/small>";}

function isOffline() {
    iOlog("Detected that the user is offline");
    document.getElementById("iOstatus").innerHTML = '<img src="https://scratchtools.tk/isonline/assets/offline.svg" height="12" width="12"> <span id="iOstatustext" style="color:red">' + chrome.i18n.getMessage("offline") + '</span>' ;}

function isAbsent() {
    iOlog("Detected that the user is away");
    document.getElementById("iOstatus").innerHTML = '<img src="https://scratchtools.tk/isonline/assets/absent.svg" height="12" width="12"> <span id="iOstatustext" style="color:orange">' + chrome.i18n.getMessage("absent") + '</span>'+ " <small><div id=\"statushelp\" style=\"display:inline\" title=\""+chrome.i18n.getMessage("absenthelp")+"\">ℹ️<\/div><\/small>";}

function isUnknown() {
    iOlog("Detected that the user status is unknown");
    document.getElementById("iOstatus").innerHTML = chrome.i18n.getMessage("unknown") + " <small><div id=\"statushelp\" style=\"display:inline\" title=\""+chrome.i18n.getMessage("unknownhelp")+"\">ℹ️<\/div><\/small>";}

function noiO() {
    iOlog("Detected that the user didn't install isOnline");
    document.getElementById("iOstatus").innerHTML = chrome.i18n.getMessage("notiouser") + " <small><div id=\"statushelp\" style=\"display:inline\" title=\""+chrome.i18n.getMessage("noiohelp")+"\">ℹ️<\/div><\/small>";}

function isError() { try{
    if (location.href.toLowerCase() == "https://scratch.mit.edu/users/discussbutton/") {return;}
    try { document.getElementById("iOstatus").innerHTML = '<span title="Error: ' + stop + '">' + chrome.i18n.getMessage("error") + '</span>';} catch(err){
        document.getElementsByClassName("location")[0].innerHTML += ' | <span title="Error: ' + stop + '">' + chrome.i18n.getMessage("error") + '</span>';}}catch(err){}}

function didntValidate() {
    if(window.location.href=="https://scratch.mit.edu/projects/149841742/"){return;}
    try{ document.getElementById("alert-view").innerHTML="<div class='alert fade in alert-success' style='display: block;'><span class='close' onclick='document.getElementById(\"alert-view\").style.display=\"none\";'>×</span>" + chrome.i18n.getMessage("didnotvalidate") + "</div>";}catch(err){}}

function unvalidatedAcc() {
    if (location.href.toLowerCase() == "https://scratch.mit.edu/users/discussbutton/") {return;}
    if (time()-localStorage.getItem("iObanner") < 86400) {return;}
    if(window.location.href.includes("users")){
        document.getElementById("alert-view").innerHTML="<div class='alert fade in alert-success' style='display: block;'><span class='close' onclick='document.getElementById(\"alert-view\").style.display=\"none\";localStorage.setItem(\"iObanner\"," + time() + ")'>×</span>" + chrome.i18n.getMessage("unvalidatedacc") + "</div>";}}

function keyWasChanged(stored) {
    if (stored == "n") {
        indx = registeredUsers.findIndex(k => k.name === localuser);
        chrome.storage.sync.set({"iOaccounts" : JSON.stringify(registeredUsers.slice(0, indx).concat({
            "name": localuser,
            "key": "changed"
        }).concat(registeredUsers.slice(indx + 1)))});}
    try{
        console.error("isOnline was stopped: Key was changed");
        document.getElementById("alert-view").innerHTML="<div class='alert fade in alert-success' style='display: block;'><span class='close' onclick='document.getElementById(\"alert-view\").style.display=\"none\";'>×</span>" + chrome.i18n.getMessage("keywaschanged") + "</div>";}catch(err){}}

function isBot() { try{
    console.error("isOnline was stopped: User has been marked as a bot");
    document.getElementById("alert-view").innerHTML="<div class='alert fade in alert-success' style='display: block;'><span class='close' onclick='document.getElementById(\"alert-view\").style.display=\"none\";'>×</span>" + chrome.i18n.getMessage("isbot") + "</div>";}catch(err){}}

function iOlog(x) {
    console.log("isOnline log @ " + new Date().toLocaleTimeString() + ": " + x);}

function setOnline() {
    iOlog("Sent online request");
    onlinerequest = new XMLHttpRequest();
    onlinerequest.open("POST", 'https://scratchtools.tk/isonline/api/v1/' + localuser + '/' + key + '/set/online', true);
    onlinerequest.send();
    checkResponse(onlinerequest);
    localStorage.setItem("iOlastOn", time());}

function updateStatus(color) {
	chrome.runtime.sendMessage({color});
    try {document.getElementsByClassName("user-name dropdown-toggle")[0].style.backgroundColor=color;}
    catch(err) {document.getElementsByClassName("link right account-nav")[0].style.backgroundColor=color;}
    color = color === "" ? "green" : color;
    if(isOwnAccount && document.getElementById("ioselect").style.color !== color){
        document.getElementById("ioselect").selectedIndex = opt.findIndex(k => k.color === color);
        document.getElementById("ioselect").style.color = color;
        document.getElementById("iostatusimage").src = "https://scratchtools.tk/isonline/assets/" + opt.find(k => k.color === color).value + ".svg";}
}

function localstatus(){if(localStorage.getItem("iOstatus")!==null){return localStorage.getItem("iOstatus");}else{return "online";}}

function time() {return Math.floor(Date.now() / 1000);}

function iOcrown() { try { if (document.getElementsByClassName("overview")[0].innerHTML.toLowerCase().includes("isonline.tk") || document.getElementsByClassName("overview")[1].innerHTML.toLowerCase().includes("isonline.tk")) { document.getElementsByClassName("header-text")[0].innerHTML = document.getElementsByClassName("header-text")[0].innerHTML.replace('</h2>', ' <a href="https://scratch.mit.edu/projects/158291459/" target="_blank" title="isOnline crown - click for more info" style="text-decoration: none;">👑</a></h2>').replace('<h2>', '<h2 style="color:orange;text-shadow:none;">'); } } catch (err) { try { if (document.getElementById("user-details").innerHTML.toLowerCase().includes("isonline.tk")) { document.getElementsByClassName("header-text")[0].innerHTML = document.getElementsByClassName("header-text")[0].innerHTML.replace('</h2>', ' <a href="https://scratch.mit.edu/projects/158291459/" target="_blank" title="isOnline crown - click for more info" style="text-decoration: none;">👑</a></h2>').replace('<h2>', '<h2 style="color:orange;">'); } } catch (err) {} } }

function changed() {document.getElementById("ioselect").style.color=opt[document.getElementById("ioselect").selectedIndex].color;localStorage.setItem("iOstatus", opt[document.getElementById("ioselect").selectedIndex].value);document.getElementById("iostatusimage").src="https://scratchtools.tk/isonline/assets/" +opt[document.getElementById("ioselect").selectedIndex].value+".svg";update();}

function checkResponse(request) {
    request.onreadystatechange = function() {if (request.readyState === 4){
        if (request.status !== 200) {
            result = JSON.parse(request.responseText).result;
            if (result=="incorrect key") {stop = "Key was changed";isError();keyWasChanged("n");}
            if (result=="bot") {stop = "User is a bot";isError();isBot();}
        }}};}

function validateAccount(){
    document.documentElement.innerHTML = "<!DOCTYPE html><html><head><style>body{background: #f0f0f0;margin: 0;}#vcenter{position: absolute;top: 50%;width: 100%;margin-top: -100px;}h1{text-align: center;font-family: trebuchet ms, courier new, sans-serif;font-size: 2em;}#loader,#loader:before,#loader:after{border-radius: 50%;width: 2.5em;height: 2.5em;-webkit-animation-fill-mode: both;animation-fill-mode: both;-webkit-animation: load7 1.8s infinite ease-in-out;animation: load7 1.8s infinite ease-in-out;}#loader{color: #098e8b;font-size: 10px;margin: 80px auto;position: relative;text-indent: -9999em;-webkit-transform: translateZ(0);-ms-transform: translateZ(0);transform: translateZ(0);-webkit-animation-delay: -0.16s;animation-delay: -0.16s;}#loader:before,#loader:after{content: '';position: absolute;top: 0;}#loader:before{left: -3.5em;-webkit-animation-delay: -0.32s;animation-delay: -0.32s;}#loader:after{left: 3.5em;}@-webkit-keyframes load7{0%,80%,100%{box-shadow: 0 2.5em 0 -1.3em;}40%{box-shadow: 0 2.5em 0 0;}}@keyframes load7{0%,80%,100%{box-shadow: 0 2.5em 0 -1.3em;}40%{box-shadow: 0 2.5em 0 0;}}</style></head><body><div id='vcenter'><h1 id='header'>" + chrome.i18n.getMessage("validating") + "...</h1><div id='loader'></div></div></body></html>";
    test = new XMLHttpRequest();
    test.open("GET", ' https://scratchtools.tk/isonline/api/v1/' + localuser + '/' + location.hash.substring(1) + "/test/", true);
    test.send();
    test.onreadystatechange = function() {
        if (test.readyState === 4 && test.status === 200 && test.responseText == '{"valid":true}') {
            if ((indx = registeredUsers.findIndex(k => k.name === localuser)) === -1) {
                chrome.storage.sync.set({"iOaccounts" : JSON.stringify((registeredUsers === null ? [] : registeredUsers).concat({
                    "name": localuser,
                    "key": location.hash.substring(1)
                }))});
            } else {
                chrome.storage.sync.set({"iOaccounts" : JSON.stringify(registeredUsers.slice(0, indx).concat({
                    "name": localuser,
                    "key": location.hash.substring(1)
                }).concat(registeredUsers.slice(indx + 1)))});
            }
            document.getElementById("loader").style.display = "none";
            document.getElementById("header").innerHTML = "<center><h3 style='color:green'>" + chrome.i18n.getMessage("success") + "</h3></center>";
        } else {
            document.getElementById("loader").style.display = "none";
            document.getElementById("header").innerHTML = "<center><h3 style='color:red'>"+chrome.i18n.getMessage("verifyerror")+"</h3></center>";
        }
    };
}

function transition(currentaccount) {

    i = currentaccount;
    ls = localStorage.getItem("iOaccounts");

    if(i>LSaccounts.length-1){
        try{
            localStorage.removeItem("iOaccounts");
            localStorage.removeItem("iO.version");
            localStorage.removeItem("iO.was.installed");}catch(err){}
        chrome.storage.sync.set({iOaccounts : ls}, function(){window.location="https://isonlineupdate.blogspot.com";});
    }
    if(i>LSaccounts.length-1){return;}

    thename = LSaccounts[i].name;
    thekey = LSaccounts[i].key;

    if(thekey.length==16 || thekey == "changed"){transition(i+1);}
    else{
        regenerate = new XMLHttpRequest();
        regenerate.open("POST", "https://scratchtools.tk/isonline/api/v1/"+thename+"/"+thekey+"/regenerate", true);
        regenerate.send();
        indx = LSaccounts.findIndex(k => k.name === thename);
        regenerate.onreadystatechange = function() {
            if (regenerate.readyState === 4 && regenerate.status === 200) {
                localStorage.setItem("iOaccounts", JSON.stringify(LSaccounts.slice(0, indx).concat({
                    "name": thename,
                    "key": JSON.parse(regenerate.responseText).key
                }).concat(LSaccounts.slice(indx + 1))));
                transition(i+1);
            }
            if (regenerate.readyState === 4 && regenerate.status !== 200) {
                response = JSON.parse(regenerate.responseText).status;
                if(response=="incorrect key"){
                    localStorage.setItem("iOaccounts", JSON.stringify(LSaccounts.slice(0, indx).concat({
                        "name": thename,
                        "key": "changed"
                    }).concat(LSaccounts.slice(indx + 1))));
                    transition(i+1);
                }
                else {
                    transition(i+1);}
            }
        };
    }
} // Transition end

function start() {
    if(location.href == "https://scratch.mit.edu/isonline-extension/update"){return;}
    if(document.getElementById("project-create")===null) {scratchwwwgetuser();}
    else{
        userget = document.createElement('a');
        userget.id="iOgetuser";
        document.getElementsByTagName('body')[0].appendChild(userget);
        document.getElementById("iOgetuser").style.display = 'none';

        usergetscript = document.createElement('script');
        usergetscript.id="iOgetuserscript";
        document.getElementsByTagName('body')[0].appendChild(usergetscript);
        document.getElementById("iOgetuserscript").innerHTML='document.getElementById("iOgetuser").innerText=Scratch.INIT_DATA.LOGGED_IN_USER.model.username;';

        localuser = document.getElementById("iOgetuser").innerText;
        document.getElementById("iOgetuser").remove();
        if(localuser===""){console.error("isOnline was stopped: logged out.");}else{main();}
    }
}

function scratchwwwgetuser() {
    if(document.getElementsByClassName("profile-name")[0] === undefined) {
        if(document.getElementsByClassName("link right login-item")[0]!==undefined) {
            console.error("isOnline was stopped: logged out.");} else {
                setTimeout(scratchwwwgetuser, 100);}
    } else {
        localuser = document.getElementsByClassName("profile-name")[0].innerText;
        main();}
}

function friendListButtons() {
	console.log(friendListEnabled);
    if (!friendListEnabled){return;}
	try {x = friendList.findIndex(item => user.toLowerCase() === item.toLowerCase());}catch(err){x=-2;}
	console.log(x);
    if(x===-2 || x===-1) {
        document.getElementById("iOstatus").innerHTML += ' <a id="addfriend"><small>+ friends</small></a>';
        document.getElementById("addfriend").onclick = function(){
            chrome.runtime.sendMessage({addfriend: user}, function (response){
				console.log(response);
                if(response.result=="ok") {document.getElementById("addfriend").remove();}
            });
        };
    }
    if(x!==-1 && x!==-2) {
        document.getElementById("iOstatus").innerHTML += ' <a id="removefriend"><small>x friends</small></a>';
        document.getElementById("removefriend").onclick = function(){
            chrome.runtime.sendMessage({removefriend: user}, function (response){
				console.log(response);
                if(response.result=="ok") {document.getElementById("removefriend").remove();}
            });
        };
    }

}
