// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract CriminalRecords {
    address public owner;
    string[] criminalIds;

    struct Criminal {
        string criminalId;
        string personalInfo;
        string[] mugshots;
    }

    mapping(string => Criminal) public criminalRecords;
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the contract owner can perform this operation");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function registerCriminal(string memory _criminalId, string memory _personalInfo, string[] memory _mugshots) public onlyOwner {
        require(bytes(criminalRecords[_criminalId].criminalId).length == 0, "Criminal is already registered");
        criminalRecords[_criminalId] = Criminal(_criminalId, _personalInfo, _mugshots);
        criminalIds.push(_criminalId);
    }

    function viewCriminal(string memory _criminalId) public view returns (string memory, string memory, string[] memory) {
        Criminal memory selectedCriminal = criminalRecords[_criminalId];
        require(bytes(selectedCriminal.criminalId).length > 0, "Criminal not found");
        return (selectedCriminal.criminalId, selectedCriminal.personalInfo, selectedCriminal.mugshots);
    }

    function getCriminalIds() public view returns(string[] memory){
        return criminalIds;
    }
}
