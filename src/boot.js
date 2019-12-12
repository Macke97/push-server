const { server } = require('./lib');

console.time('Starting server took');
server.start().then(port => {
    console.log('Started on', port);
    console.timeEnd('Starting server took');
});
