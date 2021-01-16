const isAuth = async (req, res, next) => {
  try {
    user = res.locals.user;
    if (!user) throw new Error("Unauthenticated");
    return next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthenticated" });
  }
};

module.exports = isAuth;
