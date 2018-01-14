let fs = require('fs');
const http = require('http');
const WebApp = require('./webapp');
const appUtility = require('./appUtility.js');
let logRequest = appUtility.logRequest;
let getHeader = appUtility.getHeader;
let isFile = appUtility.isFile;
let getFileData = appUtility.getFileData;
const dataBase = require('./data/data.json');
const User = require('./appModules/user.js');
let user=new User('./data/data.json');
user.loadAllUsers();
user.addTodoList('santosh','SOMETHING','nothing')
user.addTask('santosh','SOMETHING','do somthing')
user.addTask('santosh','SOMETHING','do somthing else')
fs.writeFileSync('./data/dataBase.json', JSON.stringify(dataBase));
console.log(user.getUserInfo('santosh'));

let serveStaticFile = function(req, res) {
  let path = req.url;
  if (path == '/'||path=='/login') {
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
  let user = validUsers.find(u => u.name == req.body.userName);
  userN = req.body.userName;
  if (!user) {
    res.setHeader('Set-Cookie', `logInFailed=true`);
    res.redirect('/login.html');
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


let app=WebApp.create();
app.use(serveFile);
app.use(loadUser);
app.post('/login',postLogin);






module.exports = app;
