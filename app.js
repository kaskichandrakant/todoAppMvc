let fs = require('fs');
const http = require('http');
const WebApp = require('./webapp');
const appUtility = require('./appUtility.js');
let logRequest = appUtility.logRequest;
let getHeader = appUtility.getHeader;
let isFile = appUtility.isFile;
let getFileData = appUtility.getFileData;
let TodoApp = require('./appModules/todoApp.js')
let todoApp = new TodoApp();
todoApp.addAccount('santosh');
let validUsers = todoApp.getAllAccounts();

validUsers.push(todoApp.allAccount)
let serveStaticFile = function(req, res) {
  let path = req.url;
  if (path == '/' || path == '/login') {
    res.redirect('/login.html');
  }
  let filePath = './public' + path;
  if (fs.existsSync(filePath) && isFile(filePath)) {
    let data = getFileData('./public' + path);
    res.statusCode = 200;
    res.setHeader('Content-Type', getHeader(path));
    res.write(data);
    res.end();
    return;
  }
}

let serveFile = function(req, res) {
  if (req.method == "GET" && !req.url.startsWith('/Gu')) {
    serveStaticFile(req, res);
  }
}
let postLogin = (req, res) => {
  let user = validUsers.find((u) => u.userName == req.body.userName);
  if (!user) {
    res.setHeader('Set-Cookie', `logInFailed=true`);
    res.redirect('/login');
    return;
  }
  let sessionid = new Date().getTime();
  res.setHeader('Set-Cookie', `sessionid=${sessionid}`);
  user.sessionid = sessionid;
  res.redirect('/home');
};
let loadUser = (req, res) => {
  let sessionid = req.cookies.sessionid;
  let user = validUsers.find(u => u.sessionid == sessionid);
  if (sessionid && user) {
    req.user = user;
  }
};
let serveHomePage = (req, res) => {
  let data = getFileData('./public/home.html')
  data=data.replace(/TODOTITLES/,createTodoTitleAnchors(req));
  let userName = req.user.userName;
  res.write(data.replace('user', userName));
  res.end();
}
let redirectLoggedInUserToHome = (req, res) => {
  if (req.urlIsOneOf(['/', '/login']) && req.user) res.redirect('/home');
}
let getLogout = (req, res) => {
  res.setHeader('Set-Cookie', [`loginFailed=false,Expires=${new Date(1).toUTCString()}`, `sessionid=0,Expires=${new Date(1).toUTCString()}`]);
  delete req.user.sessionid;
  res.redirect('/login');
}
let getAllTodoId = function(todos) {
  return Object.keys(todos);
}
let createTodoTitleAnchors=(req)=>{
  let anchors='';
  let allTodos=todoApp.getAllTodoLists(req.user.userName)
  let allTodoIds=getAllTodoId(allTodos);
  allTodoIds.forEach((ele)=>{
    anchors+=`<li><a id=${ele} href=viewTodo>${allTodos[ele].title}</a><li>`
  })
  return anchors;
}

let addTodoList = (req, res) => {
  let data = getFileData('./public/addTodo.html');
  res.write(data);
  res.end();
}
let postAddTodo = (req, res) => {
  let title = req.body.title;
  let description = req.body.description;
  let userName = req.user.userName;
  todoApp.addTodoList(userName, title, description);
  res.redirect('/home')
}

// let createTodoElement=(todoTitle)=> {
//   var node = document.createElement("A");
//   var textnode = document.createTextNode(todoTitle);
//   node.appendChild(textnode);
//   document.getElementById("allTodoLists").appendChild(node);
// }

let app = WebApp.create();
app.use(serveFile);
app.post('/login', postLogin);
app.use(loadUser);
app.get('/home', serveHomePage);
app.use(redirectLoggedInUserToHome);
app.get('/addTodoList', addTodoList)
app.post('/addTodoList', postAddTodo)
app.get('/logout', getLogout);



module.exports = app;
