var signed = false;

async function send_data(route,data){
  var fullRoute = "http://localhost:5000" + route;
  var response = await fetch(fullRoute,{
      method: 'POST',
      mode: "cors",
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

function send_img(route,img){
  var data = new FormData()
  data.append('files', img) // maybe it should be '{target}_cand'
  data.append('name', img.name)
  console.log(data.get('files'))
  var fullRoute = "http://localhost:5000" + route;
  fetch(fullRoute,{
      method: 'POST',
      body: data
  })
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
  var data = await send_data("/ID_Check",{"ID":id.value});
  console.log(data)
  if (!error(data)){

    var password = document.getElementById("password_signup");
    var confirm_password = document.getElementById("confirm_password");
    if(password.value === confirm_password.value){
      var account = {"user_name":username.value,"ID":id.value,"password":password.value}
      send_data("/save_acc",account)
      error_message.style.display = "flex";
      error_message.innerHTML = "congratulations! now sign in"
      error_message.style.color = "#48c6ef"
    } else {
      password.classList.add("password_didnot_match")
      confirm_password.classList.add("password_didnot_match")
      error_message.style.display = "flex";
      error_message.innerHTML = "password doesn't much";
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

  console.log(id.value)
  console.log(password.value)

  var data = await send_data("/sign_in",account);

  console.log(data)

  if (data === undefined || data.length === 0){
    var error_message = document.getElementById("error_message_signin");
    error_message.style.display = "flex";
  } else {
    sessionStorage.setItem('userName',data);
    sessionStorage.setItem('id',id);
    checkSignedIn();
    hide();
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
    var userName_tag = document.getElementById("userName_holder");
    var signIn = document.getElementById("signin")
    signIn.style.display = "none";
    userName_tag.style.display = "flex";
    userName_tag.innerHTML = userName;
  }
}

async function show_results() {
  var p_id = document.getElementById("input_p_id");
  var test_id = document.getElementById("input_test_id");
  console.log(p_id.value)
  console.log(test_id.value)
  var data = {"Test_ID":test_id.value,"P_ID":p_id.value};
  var returned_data = await send_data("/show_results",data);
  console.log(returned_data[0][0])
  console.log(returned_data[0][1])
  sessionStorage.setItem('p_id',p_id.value);
  sessionStorage.setItem('test_id',test_id.value);
  sessionStorage.setItem('test_report',returned_data[0][0]);
  sessionStorage.setItem('img_src',returned_data[0][1]);
  window.location = "./show.html"
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

function add_result() {
  var p_id = document.getElementById('p_id');
  var test_id = document.getElementById('test_id');
  var test_report = document.getElementById('test_report');
  var img_loc = document.getElementById('test_report').files[0];
  var result_data = {"p_id":p_id.value,"test_id":test_id.value,"test_report":test_report.value,"img_loc":img_loc};
  send_data("/add_result",result_data);
  send_img("/add_img",img_loc)
  window.location = "./result.html"
}


function move_to_services() {
  document.getElementById("services").scrollIntoView();
}