const express = require('express');
const cors = require('cors');
const BodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const ObjectId =  require('mongodb').ObjectId
require('dotenv').config();

const app = express();
app.use(cors());
app.use(BodyParser.json())
const uri = process.env.DB_PATH;
let client = new MongoClient(uri, {useNewUrlParser : true ,  useUnifiedTopology: true });

/************************ 
    Routes -- Get method 
*************************/

// Root Route
app.get('/' , (req,res) => res.send("Welcome to Doctors Portal  Backed"))

// Get all Appointments 
app.get('/appointments', (req, res) => {
    client = new MongoClient(uri, {useNewUrlParser : true,  useUnifiedTopology: true });
    client.connect(conErr => {
        const collection = client.db('doctorsPortal').collection('appointments');
        collection.find().toArray((err , documents) => {
            err ? res.status(500).send(err) : res.send(documents)
        })
    })
    client.close();

})

// Get all Booked Appointments 
app.get('/bookedAppointments', (req, res) => {
    client = new MongoClient(uri, {useNewUrlParser : true,  useUnifiedTopology: true });
    client.connect(conErr => {
        const collection = client.db('doctorsPortal').collection('bookedAppointments');
        collection.find().toArray((err , documents) => {
            err ? res.status(500).send(err) : res.send(documents)
        })
    })
    client.close();

})

/************************ 
    Routes -- Post method 
*************************/
// Insert Appointment Booking 
app.post('/makeBooking' , (req,res) => {
    const data = req.body;
    console.log(data);
    client = new MongoClient(uri, {useNewUrlParser : true,  useUnifiedTopology: true });
    client.connect(conErr => {
        console.log(conErr);
        const collection = client.db('doctorsPortal').collection('bookedAppointments');
        collection.insertOne(data, (err , result) => {
            err ? res.status(500).send({message : err}) : res.send(result.ops[0])
            console.log(err);
        })
    })
    client.close();

})

// Updating Booking Status
app.post('/updateBookingStatus', (req, res) => {
    const ap = req.body;
    console.log(ap);
    client = new MongoClient(uri, {useNewUrlParser : true,  useUnifiedTopology: true });

    client.connect(err => {
        const collection = client.db('doctorsPortal').collection('bookedAppointments');
        collection.updateOne(
            { _id:ObjectId(ap.id) }, 
            {
            $set: {  "status" : ap.status },
            $currentDate: { "lastModified": true }
            },
          (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send({ message: err })
            }
            else {
                res.send(result);
                console.log(result);
            }
            client.close();
        })
    });
})

// Updating Prescription
app.post('/updatePrescription', (req, res) => {
    const ap = req.body;
    console.log(ap);
    client = new MongoClient(uri, {useNewUrlParser : true,  useUnifiedTopology: true });

    client.connect(err => {
        const collection = client.db('doctorsPortal').collection('bookedAppointments');
        collection.updateOne(
            { _id:ObjectId(ap.id) }, 
            {
            $set: {  "prescription" : ap.prescription },
            $currentDate: { "lastModified": true }
            },
          (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send({ message: err })
            }
            else {
                res.send(result);
                console.log(result);
            }
            client.close();
        })
    });
})


// Updating Appointment Visiting Status
app.post('/updateVisitingStatus', (req, res) => {
    const ap = req.body;
    client = new MongoClient(uri, {useNewUrlParser : true,  useUnifiedTopology: true });

    client.connect(err => {
        const collection = client.db('doctorsPortal').collection('bookedAppointments');
        collection.updateOne(
            { _id:ObjectId(ap.id) }, 
            {
            $set: {  "visitingStatus" : ap.visitingStatus },
            $currentDate: { "lastModified": true }
            },
          (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send({ message: err })
            }
            else {
                res.send(result);
                console.log(result);
            }
            client.close();
        })
    });
})



// Updating Appointment Date/Time

app.post('/updateAppointmentTime', (req, res) => {
    const ap = req.body;
    console.log(ap);
    client = new MongoClient(uri, {useNewUrlParser : true,  useUnifiedTopology: true });

    client.connect(err => {
        const collection = client.db('doctorsPortal').collection('bookedAppointments');
        collection.updateOne(
            { _id:ObjectId(ap.id) }, 
            {
            $set: {  "date" : ap.date,  "time" : ap.time},
            $currentDate: { "lastModified": true }
            },
          (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).send({ message: err })
            }
            else {
                res.send(result);
                console.log(result);
            }
            client.close();
        })
    });
})


// Dummy Route to insert Appointment Data at once
/** 
app.post('/insertAppointment' , (req,res) => {
    const data = req.body;
    console.log(data);
    client = new MongoClient(uri, {useNewUrlParser : true,  useUnifiedTopology: true });
    client.connect(conErr => {
        console.log(conErr);
        const collection = client.db('doctorsPortal').collection('appointments');
        collection.insertOne(data, (err , result) => {
            err ? res.status(500).send({message : err}) : res.send(result.ops[0])
            console.log(err);
        })
    client.close();

    })
})
*/


const port = process.env.PORT || 3200;
app.listen(port, err => err ? console.log("Filed to Listen on Port" , port) : console.log("Listing for Port" , port));