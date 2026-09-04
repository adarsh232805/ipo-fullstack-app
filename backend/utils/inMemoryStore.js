import bcrypt from "bcryptjs";

// In-memory store for seamless offline/fallback operation
const users = new Map();

// Pre-populate with default demo user & admin
const defaultPasswordHash = bcrypt.hashSync("password123", 10);

const demoUser = {
  _id: "66e5f1b2c4d5e6f7a8b9c001",
  name: "Adarsh Singh",
  email: "demo@ipo.com",
  password: defaultPasswordHash,
  role: "user",
  profilePhoto: "",
  watchlist: ["66e5f1b2c4d5e6f7a8b9c0d1", "66e5f1b2c4d5e6f7a8b9c0d2"],
  profile: {
    phone: "9876543210",
    pan: "ABCDE1234F",
    dob: "2000-01-01"
  },
  notifyGmp: true,
  notifyEmail: true
};

const adminUser = {
  _id: "66e5f1b2c4d5e6f7a8b9c002",
  name: "IPO Admin",
  email: "admin@ipo.com",
  password: defaultPasswordHash,
  role: "admin",
  profilePhoto: "",
  watchlist: [],
  profile: {},
  notifyGmp: true,
  notifyEmail: true
};

users.set(demoUser.email.toLowerCase(), demoUser);
users.set(adminUser.email.toLowerCase(), adminUser);

export const inMemoryStore = {
  getUserByEmail(email) {
    if (!email) return null;
    return users.get(email.toLowerCase()) || null;
  },

  getUserById(id) {
    if (!id) return null;
    for (const u of users.values()) {
      if (u._id.toString() === id.toString()) return u;
    }
    return null;
  },

  createUser({ name, email, password, role = "user" }) {
    const newUser = {
      _id: "user_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
      name,
      email: email.toLowerCase(),
      password,
      role,
      profilePhoto: "",
      watchlist: [],
      profile: {},
      notifyGmp: true,
      notifyEmail: true
    };
    users.set(newUser.email, newUser);
    return newUser;
  },

  updateUser(id, updates) {
    const user = this.getUserById(id);
    if (!user) return null;
    Object.assign(user, updates);
    return user;
  },

  addToWatchlist(userId, ipoId) {
    const user = this.getUserById(userId);
    if (!user) return false;
    if (!user.watchlist.includes(ipoId)) {
      user.watchlist.push(ipoId);
    }
    return true;
  },

  removeFromWatchlist(userId, ipoId) {
    const user = this.getUserById(userId);
    if (!user) return false;
    user.watchlist = user.watchlist.filter(id => id !== ipoId);
    return true;
  },

  getWatchlist(userId) {
    const user = this.getUserById(userId);
    return user ? user.watchlist : [];
  },

  getAllUsers() {
    return Array.from(users.values());
  }
};
