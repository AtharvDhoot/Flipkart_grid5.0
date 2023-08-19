async function ChatBot(req, res, next) {
  const input = req.input;

  try {
    console.log("Here");
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
  return null;
}

module.exports = {
  ChatBot,
};
