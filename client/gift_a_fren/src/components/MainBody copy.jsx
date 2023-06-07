import { useState, useEffect } from "react";
import { abi, contractAddress } from "../constants/constants";
import { ethers } from "../constants/ethers-5.6.esm.min.js";

// figure out how to send eth
const MainBody = () => {
  const [bronzeFrensRandomArray, setBronzeFrensRandomArray] = useState([]);
  const [bronzeFrens, setBronzeFrens] = useState([]);
  const [silverFrens, setSilverFrens] = useState([]);
  const [goldFrens, setGoldFrens] = useState([]);
  const [arrayLength, setArrayLength] = useState(0);
  const [isDataReady, setIsDataReady] = useState(false);
  // free join variables
  const [freeInputs, setFreeInputs] = useState({});
  const [signUpFreeToggle, setSignUpFreeToggle] = useState(false);
  const [amountOfFreeFrens, setAmountOfFreeFrens] = useState(0);

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

  // regular join variables
  const [inputs, setInputs] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [toAddress, setToAddress] = useState("");

  const getFrenDataArray = async () => {
    console.log(isDataReady);
    if (isDataReady) {
      return;
    }
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    // to pull out all the data from the frens array use a for loop
    // you call the contract getArrayLength function to get the length of the array then iterate
    const newArrayLength = await contract.getArrayLength();
    console.log("new array length ", newArrayLength.toNumber());
    setArrayLength(newArrayLength.toNumber());
    console.log(arrayLength);
    const data = await contract.getArray();
    // make sure to wait so the data loads properly.

    separateFrens(data);
  };
  // separates the frens into the bronze,silver, and gold category
  const separateFrens = async (data) => {
    let bronzeData = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i][4] == 0) {
        console.log("bronze", data[i]);
        setBronzeFrens((prevValue) => [...prevValue, data[i]]);
        bronzeData.push(data[i]);
      } else if (data[i][4] == 1) {
        console.log("silver", data[i]);
        setSilverFrens((prevValue) => [...prevValue, data[i]]);
      } else if (data[i][4] == 2) {
        console.log("gold", data[i]);
        setGoldFrens((prevValue) => [...prevValue, data[i]]);
      }
    }
    showNewFrens(bronzeData);
    setIsDataReady(true);
  };

  const showNewFrens = (_bronzeData) => {
    if (!isDataReady) {
      setBronzeFrensRandomArray([]);
      for (let i = 0; i < 5; i++) {
        let randomValue = Math.floor(Math.random() * _bronzeData.length);
        setBronzeFrensRandomArray((prevValue) => [
          ...prevValue,
          _bronzeData[randomValue],
        ]);
      }
      console.log("Before Rand BronzeFrensArray : ", bronzeFrensRandomArray);
    }
    setTimeout(() => {
      setBronzeFrensRandomArray([]);
      for (let i = 0; i < 5; i++) {
        let randomValue = Math.floor(Math.random() * _bronzeData.length);

        setBronzeFrensRandomArray((prevValue) => [
          ...prevValue,
          _bronzeData[randomValue],
        ]);
      }
      console.log("BronzeFrensArray : ", _bronzeData);
      showNewFrens(_bronzeData);
    }, 15000);
  };

  const getAmountOfFreeFrens = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    const data = await contract.amountOfFreeFrens();
    setAmountOfFreeFrens(data.toNumber());
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

  const handleCardClick = (address) => {
    setShowModal(true);
    setToAddress(address);
  };

  const handleInputChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleSubmit = (event) => {
    // make sure to check if the eth amount is actually a number
    // make sure to add values for name and message if they don't put anything
    event.preventDefault();
    console.log(inputs);
    sendGift();
  };

  const sendGift = async () => {
    console.log("handleSendGift");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    const data = await contract.addFren(
      inputs.name,
      inputs.message,
      toAddress,
      { value: ethers.utils.parseEther(inputs.ethValue) }
    );
    console.log(data);
  };

  useEffect(() => {
    getAmountOfFreeFrens();
    getFrenDataArray();
  }, []);

  return (
    <div>
      <>
        {showModal && (
          <div className="">
            <h4>Send To: {toAddress}</h4>
            <form onSubmit={handleSubmit}>
              <label>Amount to send:</label>
              <input
                className="bg-blue-200"
                type="string"
                name="ethValue"
                value={inputs.ethValue || ""}
                placeholder="Eth Amount"
                onChange={handleInputChange}
              />
              <label>Enter Your Name:</label>
              <input
                className="bg-blue-200"
                type="text"
                name="name"
                value={inputs.name || ""}
                placeholder="anon"
                onChange={handleInputChange}
              />
              <label>Enter Your Message:</label>
              <input
                className="bg-blue-200"
                type="text"
                name="message"
                value={inputs.message || ""}
                placeholder="Hi!"
                onChange={handleInputChange}
              />
              <button
                type="submit"
                className=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-2"
              >
                Gift
              </button>
            </form>
          </div>
        )}
      </>

      <div className="static">
        {signUpFreeToggle && (
          <div className="absolute top-0 right-10 bg-gray-400 px-4 py-5">
            <button
              onClick={() => setSignUpFreeToggle((prevValue) => !prevValue)}
              className="text-black-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
            >
              X
            </button>
            <h3 className="text-gray-700 text-center">Join For Free</h3>
            <form onSubmit={handleFreeSubmit}>
              <div className="">
                <label htmlFor="name">Name: </label>
                <input
                  type="text"
                  name="freeName"
                  value={freeInputs.freeName || ""}
                  onChange={handleFreeChange}
                  placeholder="anon"
                ></input>
              </div>
              <div className="">
                <label htmlFor="message">Message: </label>
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
                className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
              >
                Join
              </button>
            </form>
          </div>
        )}
      </div>

      <div className="flex ">
        <h2 className="flex-auto text-gray-700 text-center bg-gray-200 px-4 py-2 m-2">
          Free Entries Left: {amountOfFreeFrens}
        </h2>
        <button
          onClick={() => setSignUpFreeToggle((prevValue) => !prevValue)}
          className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded"
        >
          Join For Free
        </button>
      </div>
      <div className="bg-gradient-to-r h-96 bg-gradient-to-r from-yellow-400 to-yellow-300">
        <h4 className="border-solid border-2 border-yellow-50 bg-gradient-to-r from-yellow-400 to-yellow-300">
          Gold
        </h4>
        <div className="grid grid-rows-1 grid-flow-col">
          {goldFrens.map((item) => {
            return (
              <div
                key={item[2]}
                onClick={() => handleCardClick(item[2])}
                className=" bg-gray-200 px-4 py-2 border border-sky-500 border-opacity-100 mx-2"
              >
                <h3 className="">Name: {item[0]}</h3>
                <h5>Message: {item[1]}</h5>
                <h6 className="text-blue-700 ">Address: {item[2]}</h6>
                <h6>Eth Gifted: {ethers.utils.formatEther(item[3])} ETH</h6>
              </div>
            );
          })}
        </div>
        <div></div>
      </div>
      <div className="bg-gradient-to-r h-72 bg-gradient-to-r from-gray-400 to-gray-300">
        <h4 className="border-solid border-2 border-grey-50 bg-gradient-to-r from-gray-400 to-gray-300">
          Silver
        </h4>
        <div className="grid grid-rows-1 grid-flow-col">
          {silverFrens.map((item) => {
            return (
              <div
                key={item[2]}
                onClick={() => handleCardClick(item[2])}
                className=" bg-gray-200 px-4 py-2 border border-sky-500 border-opacity-100 mx-2"
              >
                <h3 className="">Name: {item[0]}</h3>
                <h5>Message: {item[1]}</h5>
                <h6 className="text-blue-700 ">Address: {item[2]}</h6>
                <h6>Eth Gifted: {ethers.utils.formatEther(item[3])} ETH</h6>
              </div>
            );
          })}
        </div>
      </div>
      <div className="bg-gradient-to-r  from-yellow-700 to-yellow-600">
        <h4 className="border-solid border-2 border-grey-50 bg-gradient-to-r from-yellow-800 to-yellow-700">
          Bronze
        </h4>
        <div className="grid grid-rows-1 grid-flow-col">
          {bronzeFrensRandomArray.map((item, index) => {
            return (
              <div
                key={index}
                onClick={() => handleCardClick(item[2])}
                className="animate-bronze max-w-x bg-gray-200 px-4 py-2 border border-sky-500 border-opacity-100 mx-2"
              >
                <h3 className="">Name: {item[0]}</h3>
                <h5>Message: {item[1]}</h5>
                <h6 className="text-blue-700 ">
                  Address:{" "}
                  {`${item[2].slice(0, 5)}...${item[2].slice(
                    item[2].length - 4
                  )}`}
                </h6>
                <h6>Eth Gifted: {ethers.utils.formatEther(item[3])} ETH</h6>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MainBody;
