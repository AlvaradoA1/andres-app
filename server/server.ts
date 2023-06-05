
import bodyParser from 'body-parser';
import express from 'express';


const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const messages: any[] = [];


const getMessages = (request: any, response: any) => { response.json(messages); }

const postMessages = (request: any, response: any) => {
    console.log('start')
    messages.push(request.body)
    response.status(201)
    response.json(request.body)
    console.log('end')
    return
}

// user
app.get('/api/messages', getMessages);

// messages
app.post('/api/messages', postMessages);


// tslint:disable-next-line:no-console
app.listen(port, () => console.log(`Listening on port ${port}`));