const http = require('http');

const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const onRequest = (request, response) => {

    const protocol = request.connection.encrypted ? 'https' : 'http';
    const parsedURL = new URL(request.url, `${protocol}://${request.headers.host}`);

    const {pathname} = parsedURL;

    switch(pathname){
        case '/':
        case '/client.html':
            htmlHandler.getIndex(request, response);
            break;
        case '/style.css':
            htmlHandler.getCss(request, response);
            break;
        case '/success':
            jsonHandler.getSuccess(request, response);
            break;
        case '/badRequest':
            jsonHandler.getBadRequest(request, response);
            break;
        case '/unauthorized':
            jsonHandler.getUnauthorized(request, response);
            break;
        case '/forbidden':
            jsonHandler.getForbidden(request, response);
            break;
        case '/internal':
            jsonHandler.getInternal(request, response);
            break;
        case '/notImplemented':
            jsonHandler.getNotImplemented(request, response);
            break;
        default:
            jsonHandler.getNotFound(request, response);
            break;
    }
    
};

http.createServer(onRequest).listen(port, () => {
    console.log(`Listening on 127.0.0.1:${port}`);
});
