const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

router.get("/new", (req, res) => {
  res.send("new one");
});

router.get("/register", async (req, res) => {
  const reg = await prisma.register.findMany();
  console.log(reg);
  res.json(reg);
});

router.post("/register", async (req, res) => {
  const request = req.body;

  const already = await prisma.register.findUnique({
    where: {
      email: request.email,
    },
  });

  if (already) {
    res.status(400).json("please use another email");
  } else {
    try {
      const Enpassword = await bcrypt.hash(request.password, 10);
      const resDaataa = await prisma.register.create({
        data: {
          name: request.name,
          email: request.email,
          password: Enpassword,
        },
      });
      console.log(resDaataa);

      res.json(resDaataa);
    } catch (error) {
      console.log(error);
      res.status(500).send("something  error");
    }
  }
});

//login page
const cookiemsg = {
  msg: "Login Successfully",
  token: "SupersecretToken",
};

router.post("/loginCookie", async (req, res) => {
  const cookieData = req.body;

  console.log(cookieData);
  try {
    const isUser = await prisma.register.findUnique({
      where: { email: cookieData.email },
    });
    console.log(cookieData.password, isUser.password);
    if (isUser) {
      if (isUser.password === cookieData.password) {
        res.send(cookiemsg);
      } else res.status(401).json("password incorrect");
    } else res.status(404).json("User not found!");
  } catch (err) {
    res.status(500).json("something went wrong");
  }
});

//dataTable
router.get("/prisma", async (req, res) => {
  const a = await prisma.user.findMany();
  res.json(a);
});

router.post("/prisma", async (req, res) => {
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
router.delete("/prisma/:id", async (req, res) => {
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
router.get("/prisma/:id", async (req, res) => {
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
router.put("/prisma/:id", async (req, res) => {
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

module.exports = router;
