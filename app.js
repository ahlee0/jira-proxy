const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const axios = require("axios");
const app = express();
const port = process.env.PORT || 3001;

app.get("/", (req, res) => res.type('html').send("Welcome to the JIRA proxy server!"));

const jiraProxy = createProxyMiddleware('/jira', {
  target: 'https://jira.tools.tax.service.gov.uk',
  pathRewrite: { '^/jira': '/rest/api/2/filter' },
  changeOrigin: true,
  secure: false,
  timeout: 60000, // 60 seconds
  proxyTimeout: 60000, // 60 seconds
  onProxyReq(proxyReq, req, res) {
    // Add any required headers here, such as an API key or authentication
    proxyReq.setHeader('Authorization', req.headers.authorization);
  },
  logLevel: 'debug',
  onProxyRes(proxyRes, req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
  },
  onError(err, req, res) {
    console.error('Proxy error:', err);
    res.status(500).json({ error: 'Proxy error: ' + err.message });
  },
});

app.use(jiraProxy);

app.listen(port, () => console.log(`Example app listening on port ${port}!`));