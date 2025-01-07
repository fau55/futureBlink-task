const express = require('express');
const Agenda = require('agenda');
const nodemailer = require('nodemailer');
import bodyParser from 'body-parser'
const app = express();
import "dotenv/config";
app.use(express.json());

// cors issue
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    next();
});
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

//cors issue end
const agenda = new Agenda({ db: { address: 'mongodb://localhost:27017/agendaDb' } });

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,  
        pass: process.env.EMAIL_PASS, 
      }
});

agenda.define('send email', async (job) => {
    const { to, subject, body } = job.attrs.data;
    await transporter.sendMail({
        from: 'your-email@gmail.com',
        to,
        subject,
        text: body,
    });
});

app.post('/schedule-email', async (req, res) => {
    const { email, subject, body, delay } = req.body;
    await agenda.start();
    await agenda.schedule(delay, 'send email', { to: email, subject, body });
    res.send('Email scheduled successfully');
});

app.listen(5000, () => {
    console.log('Server running on port 5000');
});
