const mongoose = require("mongoose");

module.exports = (paramName = "id") => (req, res, next) => {
  const id = req.params[paramName];
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ message: "ID không hợp lệ" });
  }
  next();
};
