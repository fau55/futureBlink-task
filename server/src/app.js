const express = require('express');
const Agenda = require('agenda');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const app = express();
require('dotenv').config();
app.use(express.json());
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const secretKey = process.env.JWT_SECRET_KEY;
const mongoose = require('mongoose');
// Models 
const User = require('./Models/user.js')
const Template = require('./Models/template.js');


// Headers issue
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
//Headers issue end

// connecting Database
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000,  // Set a higher timeout in milliseconds
})
    .then(() => console.log('Connected to MongoDB successfully'))
    .catch((error) => console.error('Error connecting to MongoDB:', error.message));
const agenda = new Agenda({ db: { address: process.env.MONGODB_URL } });


// nodemailer congifuration
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }
});

// Api Endpoints

app.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: 'User already exists!' });
        }

        // Hash password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        await newUser.save();
        res.status(201).json({ msg: 'User registered successfully!' });
    } catch (error) {
        res.status(500).json({ msg: 'Error registering user', error: error.message });
    }
})

app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ msg: 'User does not exist' });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ msg: 'Incorrect password' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, username: user.username, email: user.email },
            secretKey,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            msg: 'Login successful',
            token,
            user: {
                username: user.username,
                email: user.email,
            },
        });
    } catch (error) {
        res.status(500).json({ msg: 'Error logging in', error: error.message });
    }
}
)
// api endpoint to get all template
app.get('/template/get-all', (req, res) => {
    Template.find().then((data) => {
        res.status(200).json({
            msg: 'all templates fetched!!',
            templates: data
        })

    })
})
// api endpoint to add templates 
app.post('/template/add', (req, res) => {
    try {
        const { title, subject, body } = req.body;
        const newTemplate = new Template({
            title,
            subject,
            body
        });
        newTemplate.save().then(() => {
            res.status(200).json({
                msg: 'template Added'
            })
        })
    } catch (error) {
        res.status(500).json({ msg: 'Error adding template', error: error.message });
    }
})
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


app.listen(process.env.PORT, () => {
    console.log('Server running on port', process.env.PORT);
});
