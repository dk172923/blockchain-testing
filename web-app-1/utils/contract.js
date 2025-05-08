import { ethers } from "ethers";

const CONTRACT_ADDRESS = "0x9f5Bc80b0EaD3BC2CD125bcD40240A6fcd1e270f"; // Update after deployment
const ABI = [
  "function storeHash(bytes32 hash) public",
  "function verifyHash(bytes32 hash) public view returns (bool)",
];

export function getContract(signer) {
  return new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
}