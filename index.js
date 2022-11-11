if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'dev';
}
require('./src/server')().then((resp) => {
    console.log(resp);
    console.log('Server stared !');
});

console.log('server started!!!');