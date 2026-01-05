// Authentication middleware
const requireAuth = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  }
  req.flash('error', 'Please login to access this page.');
  res.redirect('/login');
};

const requireGuest = (req, res, next) => {
  if (req.session && req.session.userId) {
    return res.redirect('/admin/dashboard');
  }
  next();
};

module.exports = { requireAuth, requireGuest };

