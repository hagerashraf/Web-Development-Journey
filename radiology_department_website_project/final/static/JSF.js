var signed = false;

async function send_data(route,data){
  var fullRoute = "http://localhost:5000" + route;
  var response = await fetch(fullRoute,{
      method: 'POST',
      mode: "no-cors",
      cache: 'no-cache',
      credentials: 'same-origin',
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      headers: {
          'content-type' : 'application/json',
          'Accept': 'application/json'
      },
      body: JSON.stringify(data)
  })
  return await response.json()
}


/**
* @param {string} route The route we want to connect to
*/
async function get_data(route){
  var fullRoute = "http://localhost:5000" + route;
  var response = await fetch(fullRoute,{
      method: 'GET',
      mode: "no-cors",
      cache: 'no-cache',
      credentials: 'same-origin',
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      headers: {
          'content-type' : 'application/json',
          'Accept': 'application/json'
      },
  })
  return await response.json()
}

/**
* @param {string} str The route we want to connect to
*/
function error(str){
  return (str==="error")
}

function signUpHit(){
  var container = document.getElementById('container');
  container.classList.add("right-panel-active")
}

function signInHit(){
  var container = document.getElementById('container');
  container.classList.remove("right-panel-active")
  var error_message = document.getElementById("error_message");
  clear_error()
  error_message.style.color = "#E02F22"
}

function show(){
	var dialog = document.getElementById("container");
  var bg = document.getElementById("modal_bg");
	dialog.style.display = "flex";
  bg.style.display = "flex";
  bg.classList.add("show")
  dialog.classList.add('show')
  document.documentElement.scrollTop = 0;
}
function hide(){
	var dialog = document.getElementById("container");
  var bg = document.getElementById("modal_bg");
	dialog.style.display = "none";
  bg.style.display = "none";
  dialog.classList.remove('show')
  bg.classList.remove('show')
}

function clear_error() {
  var error_message = document.getElementById("error_message")
  if (error_message.innerHTML === "no such id"){
    var id = document.getElementById("id_signup");
    id.classList.remove("no_such_id")
  } else {
    var password = document.getElementById("password_signup");
    var confirm_password = document.getElementById("confirm_password");
    password.classList.remove("password_didnot_match") 
    confirm_password.classList.remove("password_didnot_match")
  }
  error_message.style.display = "none";
  error_message.innerHTML = ""

}

async function signUp() {
  var error_message = document.getElementById("error_message")
  var username = document.getElementById("userName");
  var id = document.getElementById("id_signup");
  var data = await send_data("/ID_Check",{"ID":id});
  if (!error(data)){

    var password = document.getElementById("password_signup");
    var confirm_password = document.getElementById("confirm_password");

    if(password === confirm_password){
      var account = {"user_name":username.value,"ID":id,"password":password.value}
      send_data("/save_acc",account)
      error_message.innerHTML = "congratulations! now sign in"
      error_message.style.color = "#48c6ef"
    } else {
      password.classList.add("password_didnot_match")
      confirm_password.classList.add("password_didnot_match")
      error_message.style.display = "flex";
      error_message.innerHTML = "no such id";
    }

  } else {
    id.classList.add("no_such_id")
    error_message.style.display = "flex";
    error_message.innerHTML = "no such id";
  }

}

async function signIn() {
  var id = document.getElementById("id_signin");
  var password = document.getElementById("password_signin");
  var account = {"ID":id.value,"password":password.value};
  var data = await send_data("/sign_in",account);
  if (data === undefined || data.length === 0){
    var error_message = document.getElementById("error_message_signin");
    error_message.style.display = "flex";
  } else {
    sessionStorage.setItem('userName',data);
    sessinStrorage.setItem('id',id);
    checkSignedIn();
  }
}

function clear_error_signIn() {
  var error_message = document.getElementById("error_message_signin");
  error_message.style.display = "none";
}

function checkSignedIn() {
  var userName = sessionStorage.getItem('userName');
  if (!(userName === null)){
    signed = true;
    var userName_tag = document.getElementById("userName_tag");
    var signIn = document.getElementById("signin")
    signIn.style.display = "none";
    userName_tag.style.display = "flex";
    userName_tag.innerHTML = userName;
  }
}

async function show_results() {
  var p_id = document.getElementById("input_p_id");
  var test_id = document.getElementById("input_test_id");
  var data = {"Test_ID":test_id,"P_ID":p_id};
  var returned_data = await send_data("/show_results",data);
  sessionStorage.setItem('p_id',p_id);
  sessionStorage.setItem('test_id',test_id);
  sessionStorage.setItem('test_report',returned_data[0]);
  sessionStorage.setItem('img_src',returned_data[1]);
}

function load() {
  checkSignedIn();
  var p_id = sessionStorage.getItem('p_id');
  var test_id = sessionStorage.getItem('test_id');
  var test_report = sessionStorage.getItem('test_report');
  var img_src = sessionStorage.getItem('img_src');
  document.getElementById("label_p_id").innerHTML = p_id;
  document.getElementById("label_test_id").innerHTML = test_id;
  document.getElementById("label_test_report").innerHTML = test_report;
  document.getElementById("report_img").setAttribute("src",img_src); 

}

