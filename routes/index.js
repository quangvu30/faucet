var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", {
    title: "Faucet",
    data: [
      "WETH",
      "USDT",
      "BUSD",
      "USDC",
      "DAI",
      "UMAD",
      "EOS",
      "BTC",
      "SOL",
      "TRON",
    ],
    networks: ["Ethereum", "Polygon"],
  });
});

module.exports = router;
