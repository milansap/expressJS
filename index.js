const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const cors = require("cors");
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(cors());
const port = 5001;

const myData = {
  name: "Milan",
  Email: "sapkota1milan1@gmail.com",
  Address: "Panauti-8,kavre",
  status: "Active",
  position: "FrontEnd Dev",
};

const apiData = {
  Condition: "Nicee",
  status: "Active",
};
const country = {
  name: "Nepal",
  status: "Active",
  CapitalCity: "Kathmandu",
  position: "Poorest Country",
};
const services = {
  name: "Providing Apis",
  status: "Active",
};
const usa = {
  name: "United States America",
  status: "Active",
  position: "No.1 Country for developing Cars",
};
const dataRequest = {
  name: "Apis ",
  status: "Active",
  position: "BackEnd Developer",
};

app.get("/msg", (req, res) => {
  res.send(myData);
});
app.get("/msg/apiData", (req, res) => {
  res.send(apiData);
});
app.get("/msg/country", (req, res) => {
  res.send(country);
});
app.get("/msg/services", (req, res) => {
  res.send(services);
});
app.get("/msg/usa", (req, res) => {
  res.send(usa);
});
app.get("/msg/dataRequest", (req, res) => {
  res.send(dataRequest);
});

app.post("/msg/postData", (req, res) => {
  const data = req.body;
  console.log(data);
  res.send("successful");
});
//sign up page
const successSignUp = {
  msg: "Signed Up  Successfully",
  token: "SupersecretToken",
};
app.post("/msg/sign-post", (req, res) => {
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
  const data1 = req.body;

  if (
    req.body.username &&
    req.body.email &&
    req.body.password &&
    req.body.confirm
  ) {
    if (req.body.username != "millu") {
      if (req.body.email != "sapkota111milan@gmail.com") {
        if (passwordRegex.test(req.body.password)) {
          if (req.body.confirm === req.body.password) {
            res.send(successSignUp);
          } else res.status(422).send("please enter same password");
        } else res.status(422).send("please enter valid password!!");
      } else res.status(409).send("Email already Used!!!");
    } else res.status(409).send("username already used!");
  } else res.status(404).send("Please fill all field!!!");
});

//login page
const success = {
  msg: "Logged in  Successfully",
  token: "secretToken",
};
app.post("/msg/login", (req, res) => {
  const m = req.body;
  if (req.body.email && req.body.password) {
    if (req.body.email === "Milan@gmail.com") {
      if (req.body.password === "milan404") {
        res.send(success);
      } else res.status(401).send("invalid password!!!");
    } else res.status(404).send("user Doesn't exist!!!");
  } else res.status(422).send("email or password missing");
});
//contact page

app.post("/msg/contact", (req, res) => {
  const cont = req.body;
  console.log(cont);
  res.send("Feedback Sent");
});
//dynamic routing
const dynamicData = [
  {
    name: "M1",
    roll: "1",
  },
  {
    name: "M2",
    roll: "2",
  },
  {
    name: "M3",
    roll: "3",
  },
  {},
];

app.get("/dynRoute/:id", (req, res) => {
  const id = req.params.id;
  if (isNaN(id)) {
    res.status(422).send("Unprocessible entity");
  } else {
    if (1 <= id && id <= dynamicData.length) {
      res.send(dynamicData[id - 1]);
    } else res.status(404).send("Array out of range");
  }
});
//dynamci Routing for premium page

const premiumDyn = [
  {
    title: "Bill Gates",

    Description: `Born: William Henry Gates III October 28, 1955 (age 68) Seattle,
        Washington, U.S.,
      Education: Harvard University (dropped out)`,
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Bill_Gates_-_2023_-_P062021-967902_%28cropped%29.jpg/220px-Bill_Gates_-_2023_-_P062021-967902_%28cropped%29.jpg",
  },
  {
    title: " Spotify Song",
    Price: "$13",
    image: "https://picsum.photos/seed/picsum/200/300",
  },
];
app.get("/about/pre/:name", (req, res) => {
  const id = req.params.name;

  res.send(premiumDyn[id - 1]);
});

//2nd
const supportDyn = [
  {
    title: "Premium For Spotify Song asjdhasdkjashasjk daidnasd asdihasid",
    Price: "$123654654",
    image: "https://picsum.photos/seed/picsum/200/300",
  },
  {
    title: "Spotify Song",
    Price: "$13",
    image: "img2.jpg",
  },
  {
    title: "Samsung Music",
    Price: "$19",
    image: "img3.jpg",
  },
];
app.get("/about/sup/:name", (req, res) => {
  const i = req.params.name;
  res.send(supportDyn[i - 1]);
});

app.listen(port, () => {
  console.log(`listening to port $(port)`);
});
