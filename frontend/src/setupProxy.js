//C:\Users\sdedu\Desktop\Sortic\frontend\src\setupProxy.js
const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function(app) {
  console.log('[setupProxy.js] loaded');
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'http://localhost:8080',
            changeOrigin: true,
            secure: false,
            cookieDomainRewrite: 'localhost',
            onProxyReq: (proxyReq, req) => {
                console.log('Proxy Request:', {
                    method: req.method,
                    path: req.path,
                    headers: req.headers
                });
            },
            onProxyRes: (proxyRes, req) => {
                console.log('Proxy Response:', {
                    statusCode: proxyRes.statusCode,
                    headers: proxyRes.headers
                });
            },
            onError: (err, req, res) => {
                console.error('Proxy Error:', err);
                res.status(500).send('Proxy Error');
            }
        })
    );
};
