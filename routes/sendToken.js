var express = require("express");
const fs = require("fs");
const Web3 = require("web3");
var router = express.Router();

const abi = JSON.parse(fs.readFileSync("./abi/Token.json"));
const privateKey =
  "0xe6b3f1ec92e9742465a48cf128d3046b26573bf97d9a34d18ede3fe472eea6c4";
let web3;
let listToken;
/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.post("/", async function (req, res) {
  const { token, address, network } = req.body;
  try {
    switch (network) {
      case "Ethereum":
        web3 = new Web3(
          "https://goerli.infura.io/v3/72d875693c6043dd95e9dcfd9ca81fad"
        );
        listToken = getListToken("./assets/goerli.txt");
        console.log(address, listToken[token]);
        await sendToken(address, listToken[token]);
        break;
      case "Polygon":
        web3 = new Web3("https://polygon-testnet.public.blastapi.io");
        listToken = getListToken("./assets/mumbai.txt");
        await sendToken(address, listToken[token]);
        break;
    }
    res.send({
      msg: "success",
    });
  } catch (error) {
    res.send({
      msg: error,
    });
  }
});

async function sendToken(reciver, contractAddr) {
  const tokenInstance = new web3.eth.Contract(abi, contractAddr);
  console.log(tokenInstance);
  const data = await web3.eth.accounts.signTransaction(
    {
      to: contractAddr,
      gas: 100000,
      data: tokenInstance.methods
        .transfer(reciver, "1000000000000000000000")
        .encodeABI(),
    },
    privateKey
  );
  console.log(data);
  await web3.eth
    .sendSignedTransaction(data.rawTransaction)
    .on("receipt", console.log);
}

function getListToken(filePath) {
  let obj = {};
  const file = fs.readFileSync(filePath).toString();
  const lines = file.split("\n");
  for (var i = 0; i < lines.length; i++) {
    obj[lines[i].split(" ")[0]] = lines[i].split(" ")[1].trim();
  }
  return obj;
}

module.exports = router;
