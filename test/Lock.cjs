const { expect } = require("chai");

describe("Token contract", function () {
  it("Deployment should assign the total supply of tokens to the owner", async function () {
    const [owner] = await ethers.getSigners();
    const crx = await ethers.deployContract("CriminalRecords");
    console.log(crx.criminalRecords);
  });
});