const User = require("../models/User");
const bcrypt = require("bcrypt");
const auth = require("../auth");

module.exports.registerUser = async (req, res) => {
  const {
    firstName,
    lastName,
    contactEmail,
    contactPhone,
    contactAddress,
    password,
    birthDate,
    isAdmin,
  } = req.body;
  try {
    const user = await User.findOne({ contactEmail });

    if (user) {
      res.send("Email already exists");
    } else {
      const newUser = new User({
        firstName,
        lastName,
        contactEmail,
        contactPhone,
        contactAddress,
        password: bcrypt.hashSync(password, 10),
        birthDate,
        isAdmin,
      });

      const saveUser = await newUser.save();

      if (saveUser) {
        res.send({ saveUser });
      } else {
        res.send({ messaeg: "Error saving user" });
      }
    }
  } catch (error) {
    res.send("Error " + error);
  }
};

module.exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    if (users) {
      res.send({ users });
    } else {
      res.send("error fetching data");
    }
  } catch (error) {
    res.send("Error " + error);
  }
};

module.exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const {
      firstName,
      lastName,
      contactEmail,
      contactPhone,
      contactAddress,
      password,
      birthDate,
      isAdmin,
    } = user;

    if (user) {
      res.send({
        result: {
          id: req.user.id,
          firstName,
          lastName,
          contactEmail,
          contactPhone,
          contactAddress,
          password,
          birthDate,
          isAdmin,
        },
      });
    } else {
      res.send({ message: "Error fetching user" });
    }
    console.log(user.id);
  } catch (error) {
    res.send("Error " + error);
  }
};

module.exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete({ _id: req.params.id });

    if (user) {
      res.send("Deleted user successfully!");
    } else {
      res.send("Error finding user to delete");
    }
  } catch (error) {
    console.error("Something went wrong: " + error);
  }
};

module.exports.updateUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      contactEmail,
      contactPhone,
      password,
      birthDate,
      isAdmin,
    } = req.body;

    const updateUser = await User.findByIdAndUpdate(
      { _id: req.params.id },
      {
        firstName,
        lastName,
        contactEmail,
        contactPhone,
        password,
        birthDate,
        isAdmin,
      },
      { new: true }
    );

    res.send({ updateUser });
  } catch (error) {
    console.error("Something went wrong: " + error);
  }
};

module.exports.loginUser = async (req, res) => {
  const { contactEmail, password } = req.body;
  try {
    const user = await User.findOne({ contactEmail: contactEmail });

    if (user) {
      const isPasswordCorrect = bcrypt.compareSync(password, user.password);
      if (isPasswordCorrect) {
        return res.send({
          message: "Successfully Logged in",
          auth: auth.createAccessToken(user),
        });
      } else {
        res.send({ message: "Error creating auth token" });
      }
    } else {
      res.send({ message: "Error Else" });
    }
  } catch (error) {
    res.send({ message: "Error " + error });
  }
};

module.exports.updateAdmin = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    console.log(user.isAdmin);

    if (user.isAdmin) {
      const adminStatus = await User.findByIdAndUpdate(
        req.params.id,
        {
          isAdmin: true,
        },
        {
          new: true,
        }
      );
      if (adminStatus.isAdmin == true) {
        res.send("User has been successfully updated to admin");
      } else if (adminStatus.isAdmin == false) {
        res.send("Error updating to admin");
      }
    } else {
      res.send("Error forbidden action");
    }
  } catch (error) {
    res.send({ message: error });
  }
};
