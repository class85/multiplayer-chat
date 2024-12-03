const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const path = require('path');

// 服务静态文件
app.use(express.static(path.join(__dirname, '/')));

// 存储消息历史
let messageHistory = [];

// Socket.IO连接处理
io.on('connection', (socket) => {
    console.log('用户连接');
    
    // 发送消息历史给新连接的用户
    socket.emit('message history', messageHistory);
    
    // 处理新消息
    socket.on('chat message', (msg) => {
        messageHistory.push(msg);
        // 限制消息历史记录数量，防止内存占用过大
        if (messageHistory.length > 100) {
            messageHistory.shift();
        }
        // 广播消息给所有客户端
        io.emit('chat message', msg);
    });

    socket.on('disconnect', () => {
        console.log('用户断开连接');
    });
});

// 启动服务器
const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 