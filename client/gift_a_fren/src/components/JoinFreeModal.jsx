import React from "react";
import { useState } from "react";

const JoinFreeModal = ({ amountOfFreeFrens, abi, contractAddress, ethers }) => {
  const [signUpFreeToggle, setSignUpFreeToggle] = useState(false);
  const [freeInputs, setFreeInputs] = useState({});

  const handleFreeChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFreeInputs((values) => ({ ...values, [name]: value }));
    console.log(freeInputs);
  };
  const handleFreeSubmit = (event) => {
    event.preventDefault();
    sendFreeSignUp();
  };

  const sendFreeSignUp = async () => {
    console.log("handleFreeSignUp");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    const data = await contract.freeAddFren(
      freeInputs.freeName,
      freeInputs.freeMessage
    );
    console.log(data);
  };
  return (
    <div className="static ">
      {signUpFreeToggle && (
        <div className="absolute top-0 right-10 bg-gradient-to-t from-slate-200 from-2% via-slate-300 via-15%  to-slate-400 to-40%  px-4 py-5 z-10 border-4 shadow-lg">
          <button
            onClick={() => setSignUpFreeToggle((prevValue) => !prevValue)}
            className="text-black-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5  dark:hover:bg-gray-800 dark:hover:text-white "
          >
            X
          </button>
          <h3 className="text-gray-950 text-center">Join For Free</h3>
          <form onSubmit={handleFreeSubmit}>
            <div className="">
              <div>
                <label htmlFor="name">Name: </label>
              </div>
              <input
                type="text"
                name="freeName"
                value={freeInputs.freeName || ""}
                onChange={handleFreeChange}
                placeholder="anon"
              ></input>
            </div>
            <div className="">
              <div>
                <label htmlFor="message">Message: </label>
              </div>

              <input
                type="text"
                name="freeMessage"
                value={freeInputs.freeMessage || ""}
                onChange={handleFreeChange}
                placeholder="Hi!"
              ></input>
            </div>
            <button
              type="submit"
              className=" mt-2 bg-slate-800 hover:bg-slate-700 text-white font-bold py-2 px-4 border-b-4 border-slate-600 hover:border-slate-500 rounded"
            >
              Join
            </button>
          </form>
        </div>
      )}
      <div className="flex  ">
        <h2 className="flex-auto text-gray-700 text-center bg-slate-200 px-4 py-2 m-2">
          Free Entries Left: {amountOfFreeFrens}
        </h2>
        <button
          onClick={() => setSignUpFreeToggle((prevValue) => !prevValue)}
          className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-2 px-4 border-b-4 border-slate-600 hover:border-slate-500 rounded"
        >
          Join For Free
        </button>
      </div>
    </div>
  );
};

export default JoinFreeModal;
