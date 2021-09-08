const { createProxyMiddleware } = require('http-proxy-middleware');


let bOutputPath = false

module.exports = (app) => {
    const portProxy = 8000;
    const socketProxy = createProxyMiddleware('/api', {
        target: `http://localhost:${portProxy}`,
        changeOrigin: true,
        followRedirects: true,
        ws: false,
        logLevel: 'error',  // 'info',
        // followRedirects: true,
        pathRewrite: function (path, req) {
            let pathNew = path.replace('/api', '')
            if (bOutputPath === true) {
                console.log(`[HMR-Alex] Proxying path "${pathNew.slice(0, 15)}"`,
                    `[${req.method}]\t"${req.url.replace("/api", "").slice(0, 15)}"\t `)
                //  `Cookie:"${req.headers?.cookie.slice(0,25).replace("s%3A"," ")}"`);
                // console.log(`\tpath new: ${pathNew}`);
            }
            return pathNew
        },
        // onProxyRes: relayResponseHeaders,
        // onProxyReq: relayRequestHeaders,

    });

    const socketProxyWsNew = createProxyMiddleware('/wsapi', {
        target: `http://localhost:${portProxy}`,
        changeOrigin: true,
        ws: true,
        logLevel: 'error', //'info',
        followRedirects: true,
        pathRewrite: function (path, req) {
            let pathNew = path.replace('/wsapi', '')

            if (bOutputPath === true) {
                console.log(`[HMR-Alex] Proxying path "${pathNew.slice(0, 10)}"`,
                    `[${req.method}]\t"${req.url.replace("/wsapi", "").slice(0, 10)}"\t `)
            }
            //  `Cookie:"${req.headers?.cookie.slice(0,25).replace("s%3A"," ")}"`);
            // console.log(`\tpath new: ${pathNew}`);
            return pathNew
        },
        // onProxyRes: relayResponseHeaders,
        // onProxyReq: relayRequestHeaders,

    });

    app.use(socketProxy);
    app.use(socketProxyWsNew);


};