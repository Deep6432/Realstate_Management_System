const User = require('../models/User');

// Login (GET)
exports.loginForm = (req, res) => {
  res.render('properties/login', {
    user: null
  });
};

// Login (POST)
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      req.flash('error', 'Please provide both username and password.');
      return res.redirect('/login');
    }

    const user = await User.findOne({ where: { username } });

    if (!user) {
      req.flash('error', 'Invalid username or password.');
      return res.redirect('/login');
    }

    const isPasswordValid = await user.checkPassword(password);

    if (!isPasswordValid) {
      req.flash('error', 'Invalid username or password.');
      return res.redirect('/login');
    }

    // Set session
    req.session.userId = user.id;
    req.session.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      is_admin: user.is_admin
    };

    req.flash('success', 'Login successful!');
    const nextUrl = req.query.next || '/admin/dashboard';
    res.redirect(nextUrl);
  } catch (error) {
    console.error('Login error:', error);
    req.flash('error', 'An error occurred during login. Please try again.');
    res.redirect('/login');
  }
};

// Logout
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
    }
    res.redirect('/');
  });
};

