const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function(app) {
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'http://localhost:8080',
            changeOrigin: true,
            secure: false,
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