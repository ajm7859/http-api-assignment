const query = require('querystring');

const getResponseType = (request) => {
    const accept = request.headers.accept;

    if(accept && accept.includes('text/xml')){
        return 'xml';
    }
    return 'json';
};

const respondJSON = (request, response, status, obj) => {
    const content = JSON.stringify(obj);

    response.writeHead(status, {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(content, 'utf8'),
    });

    if(request.method !== 'HEAD' && status !== 204){
        response.write(content);
    }
    response.end();
};

const respondXML = (request, response, status, xmlString) => {
    response.writeHead(status, {
        'Content-Type': 'application/xml',
        'Content-Length': Buffer.byteLength(xmlString, 'utf8'),
    });

    if(request.method !== 'HEAD' && status !== 204){
        response.write(xmlString);
    }
    response.end();
};

// three helper functions
const buildXMLSuccess = (message) => {
    return `<response><message>${message}</message></response>`
};

const buildXMLError = (message, id) => {
    return `<response><message>${message}</message><id>${id}</id></response>`
};

const getParams = (request) => {
    const urlParts = request.url.split('?');
    return query.parse(urlParts[1]);
};

const getSuccess = (request, response) => {
    const type = getResponseType(request);
    const message = 'This is a successful response';

    if(type === 'xml'){
        return respondXML(request, response, 200, buildXMLSuccess(message));
    }
    return respondJSON(request, response, 200, {message});
};

const getBadRequest = (request, response, parsedURL) => {
    const type = getResponseType(request);
    const params = getParams(request);

    if(params.valid !== 'true'){
        const message = 'Missing valid query parameter set to true';
        const id = 'badRequest';

        if(type === 'xml'){
            return respondXML(request, response, 400, buildXMLError(message, id));
        }
        return respondJSON(request, response, 400, {message, id});
    }

    const message = 'This request has the required parameters.';

    if(type === 'xml'){
        return respondXML(request, response, 200, buildXMLSuccess(message));
    }
    return respondJSON(request, response, 200, {message});
};

const getUnauthorized = (request, response) => {
    const type = getResponseType(request);
    const params = getParams(request);

    if(params.loggedIn !== 'yes'){
        const message = 'Missing loggedIn query parameter set to yes';
        const id = 'unauthorized';

        if(type === 'xml'){
            return respondXML(request, response, 401, buildXMLError(message, id));
        }
        return respondJSON(request, response, 401, {message, id});
    }
    const message = 'You have successfully viewed the content.';

    if(type === 'xml'){
        return respondXML(request, response, 200, buildXMLSuccess(message));
    }
    return respondJSON(request, response, 200, {message});
};

const getForbidden = (request, response) => {
    const type = getResponseType(request);
    const message = 'You do not have access to this content.';
    const id = 'forbidden';

    if(type === 'xml'){
        return respondXML(request, response, 403, buildXMLError(message, id));
    }
    return respondJSON(request, response, 403, {message, id});
};

const getInternal = (request, response) => {
    const type = getResponseType(request);
    const message = 'Internal server error. Something went wrong.';
    const id = 'internalError';

    if(type === 'xml'){
        return respondXML(request, response, 500, buildXMLError(message, id));
    }
    return respondJSON(request, response, 500, {message, id});
};

const getNotImplemented = (request, response) => {
    const type = getResponseType(request);
    const message = 'A get request for this page has not been implemented yet. Check again later for updated content.';
    const id = 'notImplemented';

    if(type === 'xml'){
        return respondXML(request, response, 501, buildXMLError(message, id));
    }
    return respondJSON(request, response, 501, {message, id});
};

const getNotFound = (request, response) => {
    const type = getResponseType(request);
    const message = 'The page you are looking for was not found.';
    const id = 'notFound';

    if(type === 'xml'){
        return respondXML(request, response, 404, buildXMLError(message, id));
    }
    return respondJSON(request, response, 404, {message, id});
};

module.exports = {
    getSuccess,
    getBadRequest,
    getUnauthorized,
    getForbidden,
    getInternal,
    getNotImplemented,
    getNotFound,
};