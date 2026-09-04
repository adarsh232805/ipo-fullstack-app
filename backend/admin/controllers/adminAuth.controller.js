import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../../models/User.js";

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    /* 1️⃣ Find admin user */
    const admin = await User.findOne({
      email: email.toLowerCase(),
      role: "admin"
    });

    if (!admin) {
      return res.status(401).json({ message: "Invalid admin credentials" });
    }

    /* 2️⃣ Compare password */
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid admin credentials" });
    }

    /* 3️⃣ Create JWT */
    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    /* 4️⃣ Success */
    res.json({
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email
      }
    });
  } catch (err) {
    console.error("Admin login error:", err);
    res.status(500).json({ message: "Admin login failed" });
  }
};
