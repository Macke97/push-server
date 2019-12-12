const express = require('express');
const port = process.env.PORT || 3000;
const app = express();
const webpush = require('web-push');
const cors = require('cors');

webpush.setVapidDetails(
    'mailto:marcusthelin97@gmail.com',
    'BAggUKgzf_FJukOsfnsoeP8sAt_9Oubo0HJbsae3OOvab9t0yz9_DrXt9Pqha5AsZbzGyEm3P-w5IXhR7H0TCXc',
    'DqWh4Lff0WYm820WTHE4dN9KN-iHaK5evtQCGcXGf10'
);

module.exports.start = () =>
    new Promise((resolve, reject) => {
        try {
            app.use(cors());
            app.use(express.json());

            app.get('/', (req, res) => {
                res.send('WTF HEJ?!');
            });

            app.post('/sendmessage', (req, res) => {
                const {
                    subscription,
                    message: { title, body }
                } = req.body;
                const messageData = JSON.stringify({
                    title,
                    body
                });
                webpush.sendNotification(subscription, messageData);
                res.send('OK');
            });

            app.listen(port, () => {
                resolve(port);
            });
        } catch (error) {
            reject(error);
        }
    });
