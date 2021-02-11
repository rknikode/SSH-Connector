let Client = require('ssh2').Client;
 
let conn = new Client();
conn.on('ready', function() {
  console.log('Client :: ready');
  conn.exec('ls', function(err, stream) {
    // console.log("Result : ",stream);
    stream.on("data",function(data){
      console.log("Data : ",data);
    });
    
  });

  conn.exec('uptime', function(err, stream) {
    if (err) throw err;
    stream.on('close', function(code, signal) {
      console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
      conn.end();
    }).on('data', function(data) {
      console.log('STDOUT: ' + data);
    }).stderr.on('data', function(data) {
      console.log('STDERR: ' + data);
    });
  });
}).connect({
  host: '192.168.121.128',
  port: 22,
  username: 'rakesh',
  password: 'RKnikumbh12345'
});