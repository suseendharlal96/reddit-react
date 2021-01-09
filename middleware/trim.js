const trim = (req, res) => {
  const exceptions = ["password"];
  Object.entries(req.body).map(([key, value]) => {
    if (!exceptions.includes(key) && typeof value === "string") {
      value = value.trim();
    }
  });
};
module.exports = trim;
