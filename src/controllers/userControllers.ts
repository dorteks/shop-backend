import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

// fetch all users
module.exports.getUsers = async (_req: any, res: any) => {
  const users = await prisma.user.findMany();
  console.log("retrieved all users");
  return res.json(users);
};

//create user/ register
module.exports.createUser = async (req: any, res: any) => {
  const { firstName, lastName, userName, phone, email, password, avatar } =
    req.body;

  const salt = await bcrypt.genSalt();
  const hashPassword = await bcrypt.hash(req.body.password, salt);
  console.log(hashPassword, "hashPassword");

  const lookupUser = await prisma.user.findUnique({
    where: { email: req.body.email },
  });

  if (lookupUser?.email === req.body.email) {
    console.log("user already exists");
    return undefined;
  }

  const createUser = await prisma.user.create({
    data: {
      firstName,
      lastName,
      userName,
      phone,
      email,
      password: hashPassword,
      avatar,
    },
  });
  if (createUser) {
    try {
      console.log("user data created>>>>", createUser);
      return res.json(createUser);
    } catch (error) {}
  } else {
    return undefined;
  }
};

//login
module.exports.loginUser = async (req: any, res: any) => {
  const user = await prisma.user.findUnique({
    where: { email: req.body.email },
    select: { email: true, password: true },
  });

  if (user === null) {
    return res.send("no user found");
  }
  try {
    const isPasswordCorrect = await bcrypt.compareSync(
      req.body.password,
      user.password
    );
    console.log(req.body.password, "password input");
    console.log(user.password, "original password");

    if (!isPasswordCorrect) {
      return res.send("wrong password or email");
    }
    return res.send("User logged in");
  } catch (error) {
    return res.send("error logging in");
  }
};

// forgot-password
module.exports.forgotPassword = async (req: any, res: any) => {
  const lookupUser = await prisma.user.findUnique({
    where: { email: req.body.email },
    select: { email: true, firstName: true, userName: true, phone: true },
  });

  if (!lookupUser) {
    return res.send("incorrect email");
  } else {
    res.send("check your mail for a password reset link");
  }
};

// set new password
module.exports.passwordReset = async (req: any, res: any) => {
  const { newPassword } = req.body;
  console.log(newPassword, "new password");
  const salt = await bcrypt.genSalt();
  const hashNewPassword = await bcrypt.hash(req.body.newPassword, salt);
  console.log(hashNewPassword);

  try {
    const resetPassword = await prisma.user.update({
      where: { email: req.body.email },
      select: { email: true, userName: true },
      data: {
        password: hashNewPassword,
      },
    });
    if (!resetPassword) {
      return res.send("password reset failed");
    }
    return res.send("password reset successful");
  } catch (error) {
    return res.send("error resetting password");
  }
};

// update user details
module.exports.updateUser = async (req: any, res: any) => {
  const { firstName, lastName, userName, phone, email, avatar } = req.body;

  const lookupUser = await prisma.user.findUnique({
    where: { email: req.body.email },
  });

  if (!lookupUser) {
    return undefined;
  }
  try {
    const updateUser = await prisma.user.update({
      where: { email: req.body.email },
      data: {
        firstName,
        lastName,
        userName,
        phone,
        email,
        avatar,
      },
    });
    console.log(updateUser, "user details updated successfully");
    return res.json(updateUser);
  } catch (error) {
    console.log(error, "could not update user details");
    return res.send("could not update user details");
  }
};

//delete
module.exports.deleteUser = async (req: any, res: any) => {
  const deleteUser = await prisma.user.delete({
    where: { email: req.body.id },
  });
  console.log("user deleted", deleteUser);
  return;
};
