// ==UserScript==
// @name         isOnline v2 LOCAL
// @namespace    http://isonline.cf/
// @version      0.1.0
// @description  Know who is online on Scratch!
// @author       @World_Languages & @chooper100
// @match        https://scratch.mit.edu/*
// @icon         https://raw.githubusercontent.com/WorldLanguages/isOnlinev2/master/green%20cat.png
// ==/UserScript==

console.log("isOnline log: Userscript started");
var stop = 0;
try {var localuser = Scratch.INIT_DATA.LOGGED_IN_USER.model.username;} catch(err) {var localuser = document.getElementsByClassName("profile-name")[0].innerHTML;iOlog("NEW Local username: " + localuser);}

if (window.location.href.startsWith("https://scratch.mit.edu/verify")) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", ' http://staging.scratchtools.tk/isonline/api/v1/' + localuser + '/' + location.hash.substring(1) + "/test/", true);
    xmlhttp.send();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState === 4 && xmlhttp.responseText.includes("true")) {
            localStorage.setItem("iOuser", Scratch.INIT_DATA.LOGGED_IN_USER.model.username);
            localStorage.setItem("iOkey", location.hash.substring(1));
            document.write("Succesfully validated isOnline account. You can close this tab.");}
        else {
            document.documentElement.innerHTML = "Error. Could not verify isOnline account";}}}


if (localStorage.getItem("iOuser") === null) {
    stop = "User didn't validate any account. Stopped script."; try { window.addEventListener('load', function () {
        document.getElementsByClassName("confirm-email banner")[0].style.display = "block";
        document.getElementsByClassName("confirm-email banner")[0].innerHTML = "<span>Whoops! Looks like you didn't validate your account on isOnline. isOnline won't work until you <a href='https://scratchtools.tk/isonline/register' target='blank' >validate your account</a>.</span> It takes ~15 seconds.";});} catch(err){}
}

if (localuser != localStorage.getItem("iOuser") && window.location.href.includes("users") && localStorage.getItem("iOuser") !== null) {
    stop = "User validated another account. Stopped script.";
    window.addEventListener('load', function () {
        document.getElementsByClassName("confirm-email banner")[0].style.display = "block";
        document.getElementsByClassName("confirm-email banner")[0].style.color = "black";
        document.getElementsByClassName("confirm-email banner")[0].innerHTML = "<span>Whoops! Looks like you didn't validate isOnline on the account you are using now, so it's not working. If needed, login to " + localStorage.getItem("iOuser") + ", or unregister it by " + " " + "<a href='https://scratchtools.tk/isonline/register' target='blank'>registering " + localuser + " instead</a>.</span>";});
}



if (stop === 0) {







    var url = window.location.href;
    var user = window.location.href.substring(30,100).substring(0, window.location.href.substring(30,100).indexOf('/'));
    var key = localStorage.getItem("iOkey");
    iOlog("Profile: " + user);
    iOlog("Local username: " + localuser);

    if (localStorage.getItem("iOlastAbs") === null) {localStorage.setItem("iOlastAbs", 0);}

    setTimeout(function () {
        absent();
        setInterval(absent, 10000);
    }, 240000);




    window.addEventListener('load', function () {

        iOlog("Detected that page finished loading");

        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", 'http://staging.scratchtools.tk/isonline/api/v1/' + localuser + '/' + key + '/set/online', true);
        xmlhttp.send();
        localStorage.setItem("iOlastOn", time());
        iOlog("Sent online request");






        if (url.substring(24,29) == 'users' && (url.match(/\//g) || []).length == 5 ) {
            iOlog("Detected user is in a profile");

            document.getElementsByClassName("location")[0].innerHTML = document.getElementsByClassName("location")[0].innerHTML + ' | <p style="display:inline" id="iOstatus">Loading status...</p>';

            if (localuser.toUpperCase() == user.toUpperCase()) {
                iOlog("Detected user is their own profile");
                isOnline();}
            else {
                status();}}


        /*if (url == "https://scratch.mit.edu/accounts/settings/") {
            document.getElementById("main-content").innerHTML = document.getElementById("main-content").innerHTML + '<br><br><h4>isOnline settings</h4> <br><label>iO code</label><input type="text" id="isOnlinecode"> <br> <button type="ll">Change code</button> <br><br><br><br>';}*/

    });







} else {iOlog(stop);}





















//FUNCTIONS

function status() {

    iOlog("Started status scan");

    var xmlhttp = new XMLHttpRequest();

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {

            var response  = xmlhttp.responseText;
            var parsedData = JSON.parse(response);
            var timestamp = parsedData.timestamp;
            var status = parsedData.status;

            if (status == "online") {
                if (time() - timestamp < 300) {isOnline();} else{isOffline();}}

            if (status == "absent") {
                if (time() - timestamp < 180) {isAbsent();} else{isOffline();}}

        }

        if (xmlhttp.readyState === 4 && xmlhttp.status === 404) {noiO(); isuser=0;}


    }

    xmlhttp.open("GET", ' http://staging.scratchtools.tk/isonline/api/v1/' + localuser + '/' + key + "/get/" + user, true);
    xmlhttp.send();

}












function absent() {
    if (time()-localStorage.getItem("iOlastOn") > 240 && time()-localStorage.getItem("iOlastAbs") > 120) {
        var xmlhttp = new XMLHttpRequest();
        xmlhttp.open("GET", 'http://staging.scratchtools.tk/isonline/api/v1/' + localuser + '/' + key + '/set/absent', true);
        xmlhttp.send();
        localStorage.setItem("iOlastAbs", time());
        iOlog("Sent absent request");
    }}






function isOnline() {
    iOlog("Detected that the user is online");
    document.getElementById("iOstatus").innerHTML = '<h4><font color="green">Online</font></h4>';}

function isOffline() {
    iOlog("Detected that the user is offline");
    document.getElementById("iOstatus").innerHTML = '<h4><font color="red">Offline</font></h4>';}

function isAbsent() {
    iOlog("Detected that the user is absent");
    document.getElementById("iOstatus").innerHTML = '<h4><font color="Orange">Absent</font></h4>';}

function noiO() {
    iOlog("Detected that the user didn't install isOnline");
    document.getElementById("iOstatus").innerHTML = '<span title="This user has to install isOnline in order to show their status">Not iO user</span>';}





function iOlog(x) {
    console.log("isOnline log @ " + new Date().toLocaleTimeString() + ": " + x);}



function time() {
    return Math.floor(Date.now() / 1000);}