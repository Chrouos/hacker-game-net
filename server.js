/* eslint-disable no-param-reassign */
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const { stringify } = require('querystring');


const app = express();

// path.join => path: express所提供的package(負責解決路徑問題) | 在不同路徑下 斜線是不同的 ex. windos => "\" , linux => "/"
const PLAYER_DATA_FILE = path.join(__dirname, 'server-player-data.json');
const ROOM_DATA_FILE = path.join(__dirname, 'server-room-data.json');
const CHAT_DATA_FILE = path.join(__dirname, 'server-room-chat.json');

app.set('port', (process.env.PORT || 3000)); // 若已經有Port就用前面的 | 若無則用3000
//

// 已經寫好的 middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 設定等一下要回應的 Header
app.use((req, res, next) => {
  // 三個都是設定Catch的作用
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate'); // 'no-cache': 是否為最新的資料
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0'); // cache 什麼時候過期 (0 代表已經過期了)
  next();
});


/* --------------- 連線 start --------------- */
// A fake API token our server validates

const extractToken = (req) => (
  req.query.token
);

const authenticatedRoute = ((req, res, next) => {
  const token = extractToken(req);
  console.log("authenticatedRoute: token = ", token, ", API_TOKEN = ", API_TOKEN);
  // return next();

  // if (token) {
  //   if (token === API_TOKEN) {
  //     return next();
  //   } else {
  //     return res.status(403).json({
  //       success: false,
  //       error: 'Invalid token provided',
  //     });
  //   }
  // } else {
  //   return res.status(403).json({
  //     success: false,
  //     error: 'No token provided. Supply token as query param `token`',
  //   });
  // }
});

// Make things more noticeable in the UI by introducing a fake delay
// to logins
const FAKE_DELAY = 500; // ms
let API_TOKEN = "";
app.post('/login', (req, res) => {

  fs.readFile(PLAYER_DATA_FILE, (err, data) => {

    let loginList = JSON.parse(data); // 解析JSON


    let isSuccess = false;
    console.log("req.body", req.body);

    loginList.map((loginItem) => {
      // 一個一個查找，若要資料內的id和我要刪的id一樣
      if (loginItem.account === req.body.account && loginItem.password === req.body.password) {
        const loginItemToUpdate = loginList.findIndex(loginItem => (loginItem.account === req.body.account && loginItem.password === req.body.password));
        API_TOKEN = loginList[loginItemToUpdate].token;
        isSuccess = true;
        console.log("API_TOKEN", API_TOKEN);
      }
    }); // map

    // 500ms後才會去回應使用者，登入是否成功
    setTimeout(() => (
      res.json({
        success: isSuccess,
        token: API_TOKEN,
      })
    ), FAKE_DELAY);
  });

});

app.post('/loginInsert', (req, res) => {

  fs.readFile(PLAYER_DATA_FILE, (err, data) => {
    const userList = JSON.parse(data);// 解析JSON
    const lastId = userList[userList.length - 1].id + 1;
    var userItem = {
      "id": lastId,
      "name": req.body.name,
      "introduce": req.body.introduce,
      "level": 0,
      "totalGame": 0,
      "winGame": 0,
      "totalGame": 0,
      "account": req.body.account,
      "password": req.body.password,
      "token": Math.random().toString(36)
    }
    console.log("loginInsert:", userItem);

    userList.push(userItem);

    fs.writeFile(PLAYER_DATA_FILE, JSON.stringify(userList, null, 4), () => {
      res.setHeader('Cache-Control', 'no-cache');
      res.json(userItem);
    });

  })
});
/* --------------- 連線 end --------------- */

/* --------------- 玩家清單 start --------------- */
app.get('/players', (req, res) => {
  fs.readFile(PLAYER_DATA_FILE, (err, data) => {
    res.setHeader('Cache-Control', 'no-cache');
    res.json(JSON.parse(data));
  });
});

// 修改玩家
app.post('/playersUpdate', (req, res) => {

  fs.readFile(PLAYER_DATA_FILE, (err, data) => {
    if (data) {
      let playerList = JSON.parse(data); // 解析JSON
      console.log(req.body);
      playerList.map((playerItem) => {

        // 一個一個查找，若要資料內的id和我要刪的id一樣
        if (playerItem.id === req.body.id) {

          const playerItemToUpdate = playerList.findIndex(playerItem => playerItem.id === req.body.id);
          console.log("playersUpdateToUpdate:", playerItemToUpdate);
          playerList[playerItemToUpdate] = req.body;
        }
      }); // map

      fs.writeFile(PLAYER_DATA_FILE, JSON.stringify(playerList, null, 4), () => {
        res.setHeader('Cache-Control', 'no-cache');
        res.json(playerList);
      });
    }
  })

});
/* --------------- 玩家清單 end --------------- */


/* --------------- 房間清單 start --------------- */

// 讀取
app.get('/room', (req, res) => {
  fs.readFile(ROOM_DATA_FILE, (err, data) => {
    res.setHeader('Cache-Control', 'no-cache');
    res.json(JSON.parse(data));
  });
});

// 新增
app.post('/room', (req, res) => {

  fs.readFile(ROOM_DATA_FILE, (err, data) => {
    const roomList = JSON.parse(data);// 解析JSON
    const camp = ['red', 'blue'];
    var whoIsFirst = Math.floor(Math.random() * 2);

    var newRoom = {
      "id": req.body.id,
      "name": req.body.name,
      "createrId": req.body.createrId,
      "player1Id": req.body.player1Id,
      "player1Name": req.body.player1Name,
      "player2Id": req.body.player2Id,
      "player2Name": req.body.player2Name,
      "start": false,
      "password": req.body.password,
      "nowPlayer": camp[whoIsFirst],
      "circle": []
    }

    for (var i = 0; i < 15; i++) {
      var newCircle = {
        id: i,
        owner: null,
        status: null,
        hp: 100,
        temper: null,
      }
      newRoom.circle.push(newCircle);
    }; // 新的圓圈資料，進入房間就新增

    roomList.push(newRoom);

    fs.writeFile(ROOM_DATA_FILE, JSON.stringify(roomList, null, 4), () => {
      res.setHeader('Cache-Control', 'no-cache');
      res.json(roomList);
    });

  })
});


app.post('/room/delete', (req, res) => {

  fs.readFile(ROOM_DATA_FILE, (err, data) => {

    let roomList = JSON.parse(data);
    roomList.map((roomItem) => {
      console.log(roomItem.id, req.body.id);
      // 一個一個查找，若要資料內的id和我要刪的id一樣
      if (String.valueOf(roomItem.id) === String.valueOf(req.body.id)) {
        const roomItemToRemove = roomList.findIndex(roomItem => roomItem.id === req.body.id);
        console.log("toRemove:", roomItemToRemove, "id:", req.body.id);
        roomList.splice(roomItemToRemove, 1);
      }
    }); // map

    fs.writeFile(ROOM_DATA_FILE, JSON.stringify(roomList, null, 4), () => {
      res.setHeader('Cache-Control', 'no-cache');
      res.json(roomList);
    });
  });
});

// 修改房間CIRCLE資訊
app.post('/roomStartUpdate', (req, res) => {

  fs.readFile(ROOM_DATA_FILE, (err, data) => {
    if (data) {
      let roomList = JSON.parse(data); // 解析JSON

      roomList.map((roomItem) => {
        // 一個一個查找，若要資料內的id和我要刪的id一樣
        if (roomItem.id === req.body.id) {
          const roomItemToUpdate = roomList.findIndex(roomItem => roomItem.id === req.body.id);
          console.log("roomStartUpdate:", req.body);
          roomList[roomItemToUpdate] = req.body; // 先找到是哪一間房 -> 將circle進行修改
          // console.log(roomList[roomItemToUpdate]);
        }
      }); // map

      fs.writeFile(ROOM_DATA_FILE, JSON.stringify(roomList, null, 4), () => {
        res.setHeader('Cache-Control', 'no-cache');
        res.json(roomList);
      });
    }
  })

});


/* --------------- 房間 end --------------- */

/* --------------- room Chat ---------------*/

// 讀取
app.get('/roomChat', (req, res) => {
  fs.readFile(CHAT_DATA_FILE, (err, data) => {
    res.setHeader('Cache-Control', 'no-cache');
    res.json(JSON.parse(data));
  });
});

// 新增
app.post('/roomChat', (req, res) => {

  fs.readFile(CHAT_DATA_FILE, (err, data) => {
    const roomChatList = JSON.parse(data);// 解析JSON
    console.log(req.body);
    var newChat = {
      "name": req.body.name,
      "chat": req.body.chat
    }

    roomChatList.push(newChat);

    fs.writeFile(CHAT_DATA_FILE, JSON.stringify(roomChatList, null, 4), () => {
      res.setHeader('Cache-Control', 'no-cache');
      res.json(roomChatList);
    });

  })
});
/* ------------------ */
var os = require('os');
var ifaces = os.networkInterfaces();
Object.keys(ifaces).forEach(function (ifname) {
  var alias = 0;

  ifaces[ifname].forEach(function (iface) {
    if ('IPv4' !== iface.family || iface.internal !== false) {
      // skip over internal (i.e. 127.0.0.1) and non-ipv4 addresses
      return;
    }

    if (alias >= 1) {
      // console.log(ifname + ':' + alias, iface.address);
    } else {
      // this interface has only one ipv4 adress
      console.log(ifname, iface.address);
    }
    ++alias;
  });
});

// app 真正開始執行 用哪個port啟動 (得到現在的port)
app.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`); // eslint-disable-line no-console
});

