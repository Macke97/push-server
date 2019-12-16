require('dotenv').config();
const express = require('express');
const port = process.env.PORT || 3000;
const app = express();
const webpush = require('web-push');
const cors = require('cors');

const { jwtAuth, passAuth } = require('./middlewares');

const { SUBJECT, VAPID_PUBLIC, VAPID_PRIVATE } = process.env;

module.exports.start = () =>
    new Promise((resolve, reject) => {
        if (!SUBJECT || !VAPID_PUBLIC || !VAPID_PRIVATE) {
            reject(
                new Error('Please provide SUBJECT, VAPID_PUBLIC and VAPID_PRIVATE env variables')
            );
        }
        webpush.setVapidDetails(SUBJECT, VAPID_PUBLIC, VAPID_PRIVATE);

        try {
            app.use(cors());
            app.use(express.json());

            app.use(jwtAuth);
            app.use('/gettoken', passAuth);

            app.all('/status', (req, res) => {
                res.send('Service is up and running.');
            });

            app.get('/publickey', (req, res) => {
                res.send(VAPID_PUBLIC);
            });

            app.post('/sendmessage', async (req, res) => {
                const {
                    subscription,
                    message: { title, body }
                } = req.body;
                const messageData = JSON.stringify({
                    title,
                    body
                });

                try {
                    await webpush.sendNotification(subscription, messageData);
                    res.send('Message sent!');
                } catch (error) {
                    console.error('Send message error:', error);
                    res.status(500).send('Something went wrong.');
                }
            });

            app.use((err, req, res, next) => {
                console.error(err);
                return res.status(err.statusCode).send(err.message);
            });

            app.listen(port, () => {
                resolve(port);
            });
        } catch (error) {
            reject(error);
        }
    });
