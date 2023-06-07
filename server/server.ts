
import bodyParser from 'body-parser';
import express from 'express';


const app = express();
const port =  5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const messages: any[] = [];


const getMessages = (request: any, response: any) => { response.json(messages); }

const postMessages = (request: any, response: any) => {
    const action = request.query.action;

    if (action === 'deleteAll') {
        messages.length = 0;
        response.status(200).json({ message: 'All messages deleted successfully' });
      } else {
    
    console.log('start')
    messages.push(request.body)
    response.status(201)
    response.json(request.body)
    console.log('end')
    return}
}

const deleteMessage = (request: any, response:any) => {
    const messageId = request.params.id;
    const messageIndex = messages.findIndex((message) => message.id === messageId);
    messages.splice(messageIndex, 1);
    response.status(200).json({ message: 'Message deleted successfully' });
} ;

const deleteAll= (request:any ,response:any) => {
    messages.splice(0,messages.length);
    response.status(200).json({ message: 'Messages deleted successfully' });
}

const updateMessage= (request: any, response:any) => {
    const messageId = request.params.id;
    const messageIndex = messages.findIndex((message) => message.id === messageId);
    messages.splice(messageIndex, 1, request.body);
    response.status(200).json({ message: 'Message deleted successfully' });

};

// user
app.get('/api/messages', getMessages);

// messages
app.post('/api/messages', postMessages);

app.delete('/api/messages/:id', deleteMessage);

app.delete('/api/messages', deleteAll);

app.put('/api/messages/:id', updateMessage);

// tslint:disable-next-line:no-console
app.listen(port, () => console.log(`Listening on port ${port}`));