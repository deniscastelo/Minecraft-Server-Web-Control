var io = io.connect();

io.on('server_log', function(data) {
  var buffer = '';


    buffer += data;
    var lines = buffer.split("\n");
    var len = lines.length - 1;
    for (var i = 0; i < len; ++i) {
      console.log(lines[i]);
      $('#log-mine-server').append('<li class="log-info">'+ lines[i] + '</li>');
    }
    buffer = lines[lines.length - 1];


});

io.on('server_err_log', function(data) {
  var buffer = '';


    buffer += data;
    var lines = buffer.split("\n");
    var len = lines.length - 1;
    for (var i = 0; i < len; ++i) {
      console.log(lines[i]);
      $('#log-mine-server').append('<li class="log-error">'+ lines[i] + '</li>');
    }
    buffer = lines[lines.length - 1];


});

io.on('server_stoping', function(){
  $('#log-mine-server').append('<li class="log-alert">Server desligado.</li>');
});

$(function() {
  $('#start').on('click', function() {
    io.emit('start_server');
  });

  $('#stop').on('click', function() {
    io.emit('stop_server');
    $('#log-mine-server').append('<li class="log-alert">Server desligado.</li>');
  });

  $('#commands').on('keyup',function(key) {
    if (key.keyCode == 13){
      console.log(key);
      var command = $(this).val();
      io.emit('command', command);
      $(this).val('');
    }

  });
});



function onData(data) {
  buffer += data;
  var lines = buffer.split("\n");
  var len = lines.length - 1;
  for (var i = 0; i < len; ++i) {
    console.log(lines[i]);
    //$('#log-mine-server').append('<li>'+ lines[i] + '</li>');
  }
  buffer = lines[lines.length - 1];
}
