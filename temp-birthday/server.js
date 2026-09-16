const http = require('http');
const fs = require('fs');
const path = require('path');

const MIME = {'.html':'text/html','.js':'text/javascript','.css':'text/css',
               '.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp',
               '.mp3':'audio/mpeg','.svg':'image/svg+xml','.woff2':'font/woff2'};

http.createServer((req, res) => {
  const u = new URL(req.url, 'http://x');

  // Mock API
  if (u.pathname.startsWith('/wp-json/om/v1/')) {
    res.setHeader('Content-Type','application/json');
    const ep = u.pathname.replace('/wp-json/om/v1/','');
    if (ep === 'create')        return res.end(JSON.stringify({ok:true, shortCode:'TESTCODE'}));
    if (ep === 'upload-photo')  return res.end(JSON.stringify({ok:true, url:'/wp-content/uploads/mock.jpg'}));
    if (ep === 'upload-voice')  return res.end(JSON.stringify({ok:true, url:'/wp-content/uploads/mock.mp3'}));
    if (ep === 'create-order')  return res.end(JSON.stringify({ok:true, order_id:'order_test_1', amount:4900}));
    if (ep === 'checkout')      return res.end(JSON.stringify({ok:true, payment_session_id:'sess_test'}));
    if (ep === 'verify')        return res.end(JSON.stringify({ok:true, paid:true, shortCode:'TESTCODE'}));
    if (ep === 'visit')         return res.end(JSON.stringify({ok:true}));
    if (ep === 'gift-shared')   return res.end(JSON.stringify({ok:true}));
    if (ep === 'order-status')  return res.end(JSON.stringify({status:'paid'}));
    if (ep.startsWith('get/'))  return res.end(JSON.stringify({ok:true, gift:{name:'Test', letter:'hi'}}));
    return res.end(JSON.stringify({error:'unknown'}));
  }

  // Static files
  let p = u.pathname === '/' ? '/index.html' : u.pathname;
  const file = path.join(__dirname, p);
  if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    res.statusCode = 404; return res.end('not found');
  }
  res.setHeader('Content-Type', MIME[path.extname(file)] || 'application/octet-stream');
  fs.createReadStream(file).pipe(res);
}).listen(8000, () => console.log('http://localhost:8000'));
