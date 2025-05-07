import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { supabase } from "../utils/supabase";
import { getContract } from "../utils/contract";

export default function Home() {
  const [contract, setContract] = useState(null);
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const init = async () => {
      try {
        const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
        const signer = await provider.getSigner();
        const _contract = getContract(signer);
        setContract(_contract);

        const { data, error } = await supabase.from("records").select("*");
        if (error) throw error;
        setRecords(data || []);
      } catch (err) {
        console.error("Initialization error:", err);
        setResult("⚠️ Failed to initialize app");
      }
    };
    init();
  }, []);

  const handleSave = async () => {
    if (!input || !contract) {
      setResult("⚠️ Input or contract not ready");
      return;
    }
    try {
      const hash = ethers.keccak256(ethers.toUtf8Bytes(input));
      const tx = await contract.storeHash(hash);
      await tx.wait();

      const { error } = await supabase.from("records").insert([{ data: input, hash }]);
      if (error) throw error;

      setRecords([...records, { data: input, hash }]);
      setInput("");
      setResult("✅ Record saved and hashed");
    } catch (err) {
      console.error("Save error:", err);
      setResult("⚠️ Error saving record: " + err.message);
    }
  };

  const handleVerify = async (data, hash) => {
    if (!contract) {
      setResult("⚠️ Contract not ready");
      return;
    }
    try {
      const computedHash = ethers.keccak256(ethers.toUtf8Bytes(data));
      const isValid = await contract.verifyHash(computedHash);
      setResult(isValid ? "✅ Valid Record" : "❌ Invalid Record");
    } catch (err) {
      console.error("Verify error:", err);
      setResult("⚠️ Error verifying record: " + err.message);
    }
  };

  return (
    <div>
      <div>
        <h1>Record Verifier DApp</h1>
        <div>
          <input
            placeholder="Enter record data"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button onClick={handleSave}>Save</button>
        </div>
        {result && <p>{result}</p>}
        <h2>Saved Records</h2>
        <ul>
          {records.map((record, index) => (
            <li key={index}>
              {record.data} <button onClick={() => handleVerify(record.data, record.hash)}>Verify</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}