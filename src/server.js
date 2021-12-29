const express = require("express");
// wiki: https://expressjs.com/en/4x/api.html
const Sentry = require('@sentry/node');
const Tracing = require("@sentry/tracing");
const bodyParser = require('body-parser');
const mime = require('mime');
const CONFIG = require("./config/server.config");
const logger = require("./util/log");
const serverUtil = require('./util/serverUtil');
const wrapApp = require('./app');
// todo: auto gen openapi document
let app = express();
// const { pipeline } = require('stream');


app.set('x-powered-by', false);

Sentry.init({
    dsn: CONFIG.sentry_DSN,
    integrations: [
        // enable HTTP calls tracing
        new Sentry.Integrations.Http({tracing: true}),
        // enable Express.js middleware tracing
        new Tracing.Integrations.Express({app}),
    ],
    tracesSampleRate: 1.0,
});

// RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance
app.use(Sentry.Handlers.requestHandler());
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());

app.use(bodyParser.json({limit: '50mb'}));

// The request handler must be the first middleware on the app
app.all("*", (req, res, next) => {
    serverUtil.setTraceId(req.header['NTES-TRACEID']);
    if (req.headers["content-type"] === mime.getType('json')) {
        logger.info(`${req.method} ${req.path} Request Body: ${JSON.stringify(req.body)}`);
    } else {
        logger.info(`${req.method} ${req.path}`);
    }
    next();
});

wrapApp(app);
// The error handler must be before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler());

// Optional fallthrough error handler
app.use((err, req, res) => {
// The error id is attached to `res.sentry` to be returned
// and optionally displayed to the user for support.
    res.statusCode = 500;
    logger.error(err.stack);
    res.end(`Service Error: ${err.message}`);
});
logger.info("Server Init");

app.listen(CONFIG.port);

logger.info("Server Started");
