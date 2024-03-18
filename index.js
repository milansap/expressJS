const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(cors());
const port = 5001;

//register get

app.get("/register", async (req, res) => {
  const reg = await prisma.register.findMany();
  console.log(reg);
  res.json(reg);
});

app.post("/register", async (req, res) => {
  const request = req.body;

  const already = await prisma.register.findUnique({
    where: {
      name: request.name,
      email: request.email,
      password: request.password,
    },
  });

  if (already) {
    res.status(400).json("please use another email");
  } else {
    try {
      const daataa = await prisma.register.create({
        data: {
          name: request.name,
          email: request.email,
          password: request.password,
        },
      });
      console.log(daataa);
      res.json(daataa);
    } catch (error) {
      console.log(error);
      res.status(500).send("internal error");
    }
  }
});

//login page

//dataTable
app.get("/prisma", async (req, res) => {
  const a = await prisma.user.findMany();
  res.json(a);
});

app.post("/prisma", async (req, res) => {
  const request = req.body;
  const alreadyData = await prisma.user.findUnique({
    where: { name: request.name, email: request.email },
  });
  if (alreadyData) {
    res.status(400).json("please use another email");
  } else {
    try {
      const daataa = await prisma.user.create({
        data: { name: request.name, email: request.email },
      });

      res.json(daataa);
    } catch (error) {
      console.log(error);
      res.status(500).send("internal error");
    }
  }
});

// Delete a user
app.delete("/prisma/:id", async (req, res) => {
  const userId = parseInt(req.params.id);

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json("User not found.");
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    res.json("User deleted successfully.");
  } catch (error) {
    res.status(500).json({ error: error });
  }
});
// Check if a user exists by ID
app.get("/prisma/:id", async (req, res) => {
  const userId = parseInt(req.params.id);

  // try {
  //   const user = await prisma.user.findUniqueOrThrow({
  //     where: { id: userId },
  //   });
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (user) {
      res.json({ exists: true, user });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//edit
app.put("/prisma/:id", async (req, res) => {
  const userId = parseInt(req.params.id);

  const newdata = req.body;
  try {
    const updateuser = await prisma.user.update({
      where: { id: userId },
      data: newdata,
    });
    res.status(200).json(updateuser);
  } catch (err) {
    console.log(err);
  }
});

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

//react-hook-form
app.post("/msg/reactHook", (req, res) => {
  const emailValidate = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const form = req.body;
  console.log(form);
  if (
    req.body.fullName &&
    req.body.address &&
    req.body.year &&
    req.body.gender &&
    req.body.email &&
    req.body.phone &&
    req.body.course &&
    req.body.feed &&
    req.body.date
  ) {
    if (emailValidate.test(req.body.email)) {
      res.send(form);
    } else res.status(422).send("enter correct email");
  } else res.status(401).send("fill all field!!");
});

//loader data or dataTable
const table = [
  {
    name: "John",
    age: 30,
    contact: "john@example.com",
    address: "123 Main St",
  },
  { name: "Jane", age: 25, contact: "jane@example.com", address: "456 Elm St" },
  { name: "Bob", age: 35, contact: "bob@example.com", address: "789 Oak St" },
  {
    name: "Alice",
    age: 28,
    contact: "alice@example.com",
    address: "321 Pine St",
  },
  {
    name: "Charlie",
    age: 32,
    contact: "charlie@example.com",
    address: "654 Birch St",
  },
  { name: "Eve", age: 40, contact: "eve@example.com", address: "987 Cedar St" },
  {
    name: "Grace",
    age: 22,
    contact: "grace@example.com",
    address: "135 Walnut St",
  },
  {
    name: "Hank",
    age: 45,
    contact: "hank@example.com",
    address: "246 Maple St",
  },
  {
    name: "Ivy",
    age: 27,
    contact: "ivy@example.com",
    address: "579 Cherry St",
  },
  {
    name: "Kate",
    age: 33,
    contact: "kate@example.com",
    address: "864 Sycamore St",
  },
  { name: "Mike", age: 29, contact: "mike@example.com", address: "975 Ash St" },
  {
    name: "Nancy",
    age: 37,
    contact: "nancy@example.com",
    address: "468 Poplar St",
  },
  {
    name: "Oscar",
    age: 31,
    contact: "oscar@example.com",
    address: "753 Cedar St",
  },
  { name: "Pam", age: 26, contact: "pam@example.com", address: "642 Elm St" },
  {
    name: "Quinn",
    age: 34,
    contact: "quinn@example.com",
    address: "519 Oak St",
  },
];

app.get("/msg/dataTable", (req, res) => {
  res.send(table);
});

//tailwind dataTable
const dataOfTable = [
  {
    name: "John Doe",
    age: 30,
    contact: "john@example.com",
    address: "123 Main St",
    action: "View Details",
  },
  {
    name: "Jane Smith",
    age: 25,
    contact: "jane@example.com",
    address: "456 Elm St",
    action: "View Details",
  },
  {
    name: "Bob Johnson",
    age: 35,
    contact: "bob@example.com",
    address: "789 Oak St",
    action: "View Details",
  },
  {
    name: "Alice Williams",
    age: 28,
    contact: "alice@example.com",
    address: "321 Pine St",
    action: "View Details",
  },
  {
    name: "Eve Brown",
    age: 22,
    contact: "eve@example.com",
    address: "654 Birch St",
    action: "View Details",
  },
  {
    name: "Charlie Davis",
    age: 40,
    contact: "charlie@example.com",
    address: "987 Cedar St",
    action: "View Details",
  },
  {
    name: "David Wilson",
    age: 33,
    contact: "david@example.com",
    address: "741 Maple St",
    action: "View Details",
  },
  {
    name: "Grace Miller",
    age: 29,
    contact: "grace@example.com",
    address: "852 Spruce St",
    action: "View Details",
  },
  {
    name: "Fiona Moore",
    age: 26,
    contact: "fiona@example.com",
    address: "963 Ash St",
    action: "View Details",
  },
  {
    name: "Hank Taylor",
    age: 31,
    contact: "hank@example.com",
    address: "159 Walnut St",
    action: "View Details",
  },
  {
    name: "Ivy Clark",
    age: 27,
    contact: "ivy@example.com",
    address: "357 Oakwood St",
    action: "View Details",
  },
  {
    name: "Kevin Adams",
    age: 34,
    contact: "kevin@example.com",
    address: "258 Elmwood St",
    action: "View Details",
  },
  {
    name: "Lily Parker",
    age: 32,
    contact: "lily@example.com",
    address: "654 Oakdale St",
    action: "View Details",
  },
  {
    name: "Mike Wright",
    age: 38,
    contact: "mike@example.com",
    address: "951 Maplewood St",
    action: "View Details",
  },
  {
    name: "Nina Lewis",
    age: 24,
    contact: "nina@example.com",
    address: "753 Cedarwood St",
    action: "View Details",
  },
  {
    name: "Oliver Hill",
    age: 37,
    contact: "oliver@example.com",
    address: "357 Pinecone St",
    action: "View Details",
  },
  {
    name: "Penny Scott",
    age: 23,
    contact: "penny@example.com",
    address: "852 Birchtree St",
    action: "View Details",
  },
  {
    name: "Quincy King",
    age: 36,
    contact: "quincy@example.com",
    address: "159 Oakhill St",
    action: "View Details",
  },
  {
    name: "Rachel Green",
    age: 39,
    contact: "rachel@example.com",
    address: "753 Maplehill St",
    action: "View Details",
  },
  {
    name: "Sam Baker",
    age: 21,
    contact: "sam@example.com",
    address: "357 Sprucehill St",
    action: "View Details",
  },
];

app.get("/msg/tailwindData", (req, res) => {
  res.send(dataOfTable);
});

//material data table
const dataOfMaterial = [
  {
    name: {
      firstName: "John",
      lastName: "Doe",
    },
    address: "261 Erdman Ford",
    city: "East Daphne",
    state: "Kentucky",
    action: "Edit",
  },
  {
    name: {
      firstName: "Jane",
      lastName: "Doe",
    },
    address: "769 Dominic Grove",
    city: "Columbus",
    state: "Ohio",
    action: "Delete",
  },
  {
    name: {
      firstName: "Joe",
      lastName: "Doe",
    },
    address: "566 Brakus Inlet",
    city: "South Linda",
    state: "West Virginia",
    action: "View Details",
  },
  {
    name: {
      firstName: "Kevin",
      lastName: "Vandy",
    },
    address: "722 Emie Stream",
    city: "Lincoln",
    state: "Nebraska",
    action: "Edit",
  },
  {
    name: {
      firstName: "Joshua",
      lastName: "Rolluffs",
    },
    address: "32188 Larkin Turnpike",
    city: "Charleston",
    state: "South Carolina",
    action: "Delete",
  },
  {
    name: {
      firstName: "Alice",
      lastName: "Smith",
    },
    address: "123 Main St",
    city: "Springfield",
    state: "Illinois",
    action: "View Details",
  },
  {
    name: {
      firstName: "Bob",
      lastName: "Johnson",
    },
    address: "456 Elm St",
    city: "Riverside",
    state: "California",
    action: "Edit",
  },
  {
    name: {
      firstName: "Charlie",
      lastName: "Brown",
    },
    address: "789 Oak St",
    city: "Oakland",
    state: "California",
    action: "Delete",
  },
  {
    name: {
      firstName: "Daisy",
      lastName: "Johnson",
    },
    address: "101 Pine St",
    city: "Portland",
    state: "Oregon",
    action: "View Details",
  },
  {
    name: {
      firstName: "Ella",
      lastName: "Smith",
    },
    address: "202 Maple St",
    city: "Seattle",
    state: "Washington",
    action: "Edit",
  },
  {
    name: {
      firstName: "John",

      lastName: "Doe",
    },

    address: "261 Erdman Ford",

    city: "East Daphne",

    state: "Kentucky",
  },

  {
    name: {
      firstName: "Jane",

      lastName: "Doe",
    },

    address: "769 Dominic Grove",

    city: "Columbus",

    state: "Ohio",
  },

  {
    name: {
      firstName: "Joe",

      lastName: "Doe",
    },

    address: "566 Brakus Inlet",

    city: "South Linda",

    state: "West Virginia",
  },

  {
    name: {
      firstName: "Kevin",

      lastName: "Vandy",
    },

    address: "722 Emie Stream",

    city: "Lincoln",

    state: "Nebraska",
  },

  {
    name: {
      firstName: "Joshua",

      lastName: "Rolluffs",
    },

    address: "32188 Larkin Turnpike",

    city: "Charleston",

    state: "South Carolina",
  },
];

app.get("/msg/materialDataTable", (req, res) => {
  res.send(dataOfMaterial);
});

app.listen(port, () => {
  console.log(`listening to port $(port)`);
});
