import { useState } from "react";

const Navbar = () => {
  const [isConnected, setIsConnected] = useState(false);

  async function connect() {
    if (typeof window.ethereum !== "undefined") {
      try {
        await ethereum.request({ method: "eth_requestAccounts" });
      } catch (error) {
        console.log(error);
      }

      setIsConnected(true);
    }
  }
  return (
    <div className=" bg-gray-800 px-4 py-3 drop-shadow-sm flex justify-between">
      <h1 className="text-gray-300">Gift A Fren</h1>
      <button
        onClick={connect}
        className="text-gray-300 bg-gray-600 hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5  dark:hover:bg-gray-700 dark:hover:text-white "
      >
        {isConnected ? "Connected" : "Connect"}
      </button>
    </div>
  );
};

export default Navbar;
