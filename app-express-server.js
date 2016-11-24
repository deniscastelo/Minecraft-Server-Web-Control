//Modulos
var express = require('express');
var app = express();
//var mcserver = require('./mcserver');
var http = require('http').createServer(app);
var io = require('socket.io').listen(http);
var childProcess = require('child_process');

//Variaveis
var mcServer = null;





//Funções

console.log('Iniciando o servidor...');

app.set('view engine', 'jade');

app.use(express.static('public'));

app.get('/', function (req, res) {
  res.render('index', {title: 'Infinity Server Control'});
});

io.on('connection', function(socket) {
  console.log('Usuario conectado: ', socket.id);
  socket.on('disconnect', function(){
    console.log('Usuario desconectado: ', socket.id);
  });

  socket.on('start_server', function(){

    startMcServer();

    mcServer.stdout.on('data', function(data){
			io.sockets.emit('server_log', "" + data);
    });

    mcServer.stderr.on('data', function (data) {
				io.sockets.emit('server_err_log', "Erro: "+data);
		});

  });

  socket.on('stop_server', function(){
    stopMcServer();
    socket.broadcast.emit('server_stoping');
  });

  socket.on('restart_server', function(){
    restartMcServer();
  });

  socket.on('command', function(cmd) {
		if (mcServer) {
			io.sockets.emit('console', "Player Command: " + cmd);
			mcServer.stdin.write(cmd + "\r");
		} else {
			socket.emit('fail', cmd);
		}
	});

});



http.listen(3000, function(){
  console.log('Server rodando em: localhost:3000');
});

//Minecraft Control

function startMcServer() {
  if (mcServer === null) {
    mcServer = childProcess.spawn('java', ['-Xmx1024M', '-Xms1024M', '-jar', 'mcserver1-11.jar', 'nogui' ], {
      //stdio: 'pipe',
      cwd: __dirname + '/mcjar'
    });
  }
}

function stopMcServer(){
  if (mcServer !== null){
    mcServer.kill();
    mcServer = null;
  }
}

function restartMcServer () {

  if (mcServer !== null){
    stopMcServer();
    startMcServer();
  }

}
