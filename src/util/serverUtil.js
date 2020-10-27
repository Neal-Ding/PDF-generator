const defaultTraceId = 'No-TraceId';
let traceId = defaultTraceId;

const serverUtil = {
    getTraceId() {
        return traceId
    },
    setTraceId(newTraceId = defaultTraceId) {
        traceId = newTraceId
    }
};

module.exports = serverUtil;
