const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const createUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "name, email and password are required",
      });
    }

    const existinguser = await User.find({ email });

    if (existinguser) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    return res.status(201).json({
      success: true,
      message: "user created successfully",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid Email or password",
      });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if(!validPassword){
        return res.status(401).json({
        success: false,
        message: "Invalid Email or password",
      });
    }

    const token = jwt.sign(
        {
            id:user._id,
            email:user.email,
        },
        process.env.JWT_SECRET
        ,{
         expiresIn: process.env.JWT_EXPIRES_IN
        }
    );

    return res.status(200).json({
        success:true,
        message:"Login Successful",
        token
    });

  } catch (error) {
    next(error);
  }
};

const getUsers = async(req, res, next) =>{
    try {
        const users = await User.findOne().select("-password");

        return res.status(200).json({
            success:true,
            data:users,
        });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    createUser,
    login,
    getUsers,
}
