const express = require('express');
const db = require("./models");
var bodyParser = require('body-parser');
const Role = db.role;

const app = express();
var cors = require('cors');
const { request } = require('express');
const { getLateSubmissionList } = require('./controller/user.controller');
//const { users, books } = require('./models');

app.use(cors());
app.use(express.urlencoded({ extended: true }))
app.use(express.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
// parse application/json
app.use(bodyParser.json());



const dbURI = 'mongodb+srv://Shivam:Shivam@shivamcluster.zu4cj.mongodb.net/Library?retryWrites=true&w=majority';
db.mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
	.then((result) => {
		console.log('connected to db');
		// initial();
		// getLateSubmissionList();
	})
	.catch((err) => console.log(err));

function initial() {
	Role.estimatedDocumentCount((err, count) => {
		if (!err && count === 0) {
			new Role({
				name: "user"
			}).save(err => {
				if (err) {
					console.log("error", err);
				}

				console.log("added 'user' to roles collection");
			});

			new Role({
				name: "admin"
			}).save(err => {
				if (err) {
					console.log("error", err);
				}

				console.log("added 'admin' to roles collection");
			});
		}
	})
}

app.get("/", (req, res) => {
	res.json({ message: "Welcome To Library Managerment System" })
})

require('./routes/book.routes')(app);
require('./routes/auth.routes')(app);
require('./routes/user.routes')(app);

app.listen(3000, () => {
	console.log(`Library app listening at http://localhost:3000`)
});
