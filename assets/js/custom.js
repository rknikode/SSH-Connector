const fs = require('fs')
const path = require('path')
const node_ssh = require('node-ssh')
const ssh = new node_ssh()
const db = require('electron-db');
const moment = require("moment");

let appDir = path.dirname(__dirname);
let dbPath = path.join(appDir,'/db/');

if (!fs.existsSync(`${appDir}/db`)){
  fs.mkdirSync(`${appDir}/db`);
}

if (!fs.existsSync(`${dbPath}/host.json`)) {
 db.createTable('host',dbPath, (succ, msg) => {});
}

// ssh.connect({
//   host: '192.168.121.128',
//   port: 22,
//   username: 'rakesh',
//   password: 'RKnikumbh12345'
// }).then(function() {
//   ssh.execCommand(`test ! -d ./Archive1 && echo "false";`).then(function(result1) {
//     if(result1.stdout == "false") {
//       ssh.execCommand(`mkdir ./Archive1 && echo "Archive1 created"`).then(function(result2) {
//         console.log('STDOUT: ' + result2.stdout);
//         console.log('STDERR: ' + result2.stderr);
//       });
//     }
//   });
// });

const getAllHost = () => {
  db.getRows('host', dbPath,{
    deleted_at: null
  }, async (succ, data) => {
    if(succ) {
      let item = '';
      // <input type="button" class="btn btn-primary opp_button" value="E"/>
      //               <input type="button" class="btn btn-primary opp_button" value="D"/>
      //               <input type="button" class="btn btn-primary opp_button" value="U"/>
      //               <input type="button" class="btn btn-primary opp_button" value="C"/>
      data.map((ele,i)=>{
        item += `<div class="card card-item">
                    <div class="card-body item" id="${ele.id}">
                        <h5 class="card-title">${ele.hostname}</h5>
                        <p class="card-text"><b>Status:</b> <span class="host_status host_status_${ele.status}">${ele.status}</span></p>
                        <p class="card-text"><b>Ip:</b> <span class="host_ip">${ele.host}</span></p>
                        <p class="card-text"><b>Last Archive:</b> <span class="host_archive">${ele.last_archive==null?"Not yet":ele.last_archive}</span></p>
                    </div>
                </div>`;
      });
      $(".content").html(item);
    }
  });
}

$(".item").on("click",(e)=>{
  console.log("Helo here");
  console.log("Id : ",$(this).prop("id"));
});

$("#add_host").on("click",(e)=>{
  let obj = new Object(getFormData());
  
  db.insertTableContent('host',dbPath ,obj , (succ, msg) => {
      if(succ) {
          toast("Host info has been added successfully");
          getAllHost();
          $('#myModal').modal('hide');
      } else {
          toast("Something went wrong");
      }
  });
});

const getFormData = () => {
  return {
    "hostname" : getValue("add","hostname"),
    "host" : getValue("add","hostval"),
    "port" : getValue("add","port"),
    "username" : getValue("add","username"),
    "password" : getValue("add","password"),
    "status" : "offline",
    "last_archive": null,
    "created_at" : date(),
    "updated_at" : null,
    "deleted_at" : null
  };
}

const getValue = (operation,selector) => {
  return $(`#${operation}_${selector}`).val();
}

$("#open_add_host").on("click",(e)=>{
  resetForm();
});

const resetForm = () => {
  $("#add_hostname").val("");
  $("#add_hostval").val("");
  $("#add_port").val("");
  $("#add_username").val("");
  $("#add_password").val("");
}

const toast = (msg) => {
  let x = document.getElementById("toast");
  x.innerText = msg;
  x.className = "show";
  setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}

const date = () => {
  return moment().format('MM-DD-YYYY HH:MM:SS');
}

getAllHost();
