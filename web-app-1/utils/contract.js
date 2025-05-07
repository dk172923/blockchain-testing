import { ethers } from "ethers";

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Update after deployment
const ABI = [
  "function storeHash(bytes32 hash) public",
  "function verifyHash(bytes32 hash) public view returns (bool)",
];

export function getContract(signer) {
  return new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
}