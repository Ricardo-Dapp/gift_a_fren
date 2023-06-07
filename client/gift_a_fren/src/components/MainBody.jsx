import { useState, useEffect } from "react";
import { abi, contractAddress } from "../constants/constants";
import { ethers } from "../constants/ethers-5.6.esm.min.js";
import JoinFreeModal from "./JoinFreeModal";

// figure out how to send eth
const MainBody = () => {
  const [bronzeFrensRandomArray, setBronzeFrensRandomArray] = useState([]);
  const [silverFrensRandomArray, setSilverFrensRandomArray] = useState([]);
  const [goldFrensRandomArray, setGoldFrensRandomArray] = useState([]);
  const [isDataReady, setIsDataReady] = useState(false);
  const [isBronzeData, setIsBronzeData] = useState(false);
  const [isSilverData, setIsSilverData] = useState(false);
  const [isGoldData, setIsGoldData] = useState(false);
  // free join variables
  const [amountOfFreeFrens, setAmountOfFreeFrens] = useState(0);

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
    const data = await contract.getArray();
    separateFrens(data);
  };
  // separates the frens into the bronze,silver, and gold category
  const separateFrens = async (data) => {
    let bronzeData = [];
    let silverData = [];
    let goldData = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i][4] == 0) {
        //console.log("bronze", data[i]);
        //setBronzeFrens((prevValue) => [...prevValue, data[i]]);
        bronzeData.push(data[i]);
      } else if (data[i][4] == 1) {
        console.log("silver", data[i]);
        //setSilverFrens((prevValue) => [...prevValue, data[i]]);
        silverData.push(data[i]);
      } else if (data[i][4] == 2) {
        console.log("gold", data[i]);
        //setGoldFrens((prevValue) => [...prevValue, data[i]]);
        goldData.push(data[i]);
      }
    }
    showNewFrens(bronzeData, silverData, goldData);
    setIsDataReady(true);
  };

  const showNewFrens = (_bronzeData, _silverData, _goldData) => {
    if (!isDataReady) {
      setBronzeFrensRandomArray([]);
      setSilverFrensRandomArray([]);
      setGoldFrensRandomArray([]);
      for (let i = 0; i < 5; i++) {
        let randomValue = Math.floor(Math.random() * _bronzeData.length);
        setBronzeFrensRandomArray((prevValue) => [
          ...prevValue,
          _bronzeData[randomValue],
        ]);
      }

      for (let i = 0; i < 4; i++) {
        let randomValue = Math.floor(Math.random() * _silverData.length);
        setSilverFrensRandomArray((prevValue) => [
          ...prevValue,
          _silverData[randomValue],
        ]);
      }
      for (let i = 0; i < 3; i++) {
        let randomValue = Math.floor(Math.random() * _goldData.length);
        setGoldFrensRandomArray((prevValue) => [
          ...prevValue,
          _goldData[randomValue],
        ]);
      }

      // console.log("Before Rand BronzeFrensArray : ", bronzeFrensRandomArray);
    }
    setTimeout(() => {
      setBronzeFrensRandomArray([]);
      setSilverFrensRandomArray([]);
      setGoldFrensRandomArray([]);
      for (let i = 0; i < 5; i++) {
        let randomValue = Math.floor(Math.random() * _bronzeData.length);

        setBronzeFrensRandomArray((prevValue) => [
          ...prevValue,
          _bronzeData[randomValue],
        ]);
      }
      for (let i = 0; i < 3; i++) {
        let randomValue = Math.floor(Math.random() * _silverData.length);
        setSilverFrensRandomArray((prevValue) => [
          ...prevValue,
          _silverData[randomValue],
        ]);
      }
      for (let i = 0; i < 3; i++) {
        let randomValue = Math.floor(Math.random() * _goldData.length);
        setGoldFrensRandomArray((prevValue) => [
          ...prevValue,
          _goldData[randomValue],
        ]);
      }
      if (_bronzeData.length > 0) {
        setIsBronzeData(true);
      }
      if (_silverData.length > 0) {
        setIsSilverData(true);
      }
      if (_goldData.length > 0) {
        setIsGoldData(true);
      }
      showNewFrens(_bronzeData, _silverData, _goldData);
    }, 15000);
  };

  const getAmountOfFreeFrens = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    const data = await contract.amountOfFreeFrens();
    setAmountOfFreeFrens(data.toNumber());
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
          <div className="text-center">
            <h4>Send To: {toAddress}</h4>
            <form onSubmit={handleSubmit}>
              <label>Amount to send:</label>
              <input
                className="bg-slate-200 mx-1"
                type="string"
                name="ethValue"
                value={inputs.ethValue || ""}
                placeholder="Eth Amount"
                onChange={handleInputChange}
              />
              <label>Enter Your Name:</label>
              <input
                className="bg-slate-200 mx-1"
                type="text"
                name="name"
                value={inputs.name || ""}
                placeholder="anon"
                onChange={handleInputChange}
              />
              <label>Enter Your Message:</label>
              <input
                className="bg-slate-200 mx-1"
                type="text"
                name="message"
                value={inputs.message || ""}
                placeholder="Hi!"
                onChange={handleInputChange}
              />
              <button
                type="submit"
                className="bg-slate-800 hover:bg-slate-700 text-white font-bold py-2 px-4 mx-2 my-2 first-letter:border-b-4 border-slate-600 hover:border-slate-500 rounded"
              >
                Gift
              </button>
            </form>
          </div>
        )}
      </>

      <JoinFreeModal
        amountOfFreeFrens={amountOfFreeFrens}
        abi={abi}
        contractAddress={contractAddress}
        ethers={ethers}
      />

      <div className=" h-96 bg-gradient-to-b from-slate-950 to-yellow-600 mt-2 overflow-hidden">
        <h4 className="text-yellow-300 border-solid border-2 border-yellow-200 bg-gradient-to-b from-slate-700 to-slate-800  ">
          Gold
        </h4>

        <div className="grid grid-rows-1 grid-flow-col w-xl h-5/6">
          {isGoldData &&
            goldFrensRandomArray.map((item, index) => {
              return (
                <div
                  key={index}
                  onClick={() => handleCardClick(item[2])}
                  className=" animate-bronze text-center self-center bg-gradient-to-tr from-yellow-50 from-2% via-yellow-300 via-25%  to-yellow-500 to-40% mt-2  shadow-lg shadow-yellow-50/50 px-4 py-2 border-b-8 border-2 border-yellow-100 rounded-3xl  mx-2"
                >
                  <h3 className="text-3xl text-gray-50">Name: {item[0]}</h3>
                  <h5 className="text-lg text-gray-50">Message: {item[1]}</h5>
                  <h6 className="text-gray-50 ">
                    Address:{" "}
                    {`${item[2].slice(0, 5)}...${item[2].slice(
                      item[2].length - 4
                    )}`}
                  </h6>
                  <h6 className="text-gray-50 ">
                    Eth Gifted: {ethers.utils.formatEther(item[3])} ETH
                  </h6>
                </div>
              );
            })}
        </div>
      </div>
      <div className="overflow-hidden h-80 bg-gradient-to-b from-slate-950 to-gray-600  ">
        <h4 className="text-gray-300 border-solid border-2 border-gray-200 bg-gradient-to-b from-slate-700 to-slate-800">
          Silver
        </h4>
        <div className="grid grid-rows-1 grid-flow-col max-w-lg h-5/6">
          {isSilverData &&
            silverFrensRandomArray.map((item, index) => {
              return (
                <div
                  key={index}
                  onClick={() => handleCardClick(item[2])}
                  className=" animate-gold text-center self-center bg-gradient-to-tr from-gray-200 from-2% via-gray-300 via-25%  to-gray-400 to-40% mt-2  shadow-lg shadow-gray-50/50 px-4 py-2 border-b-8 border-2 border-gray-100 rounded-3xl  mx-2"
                >
                  <h3 className="text-gray-50">Name: {item[0]}</h3>
                  <h5 className="text-gray-50">Message: {item[1]}</h5>
                  <h6 className="text-gray-50 ">Address: {item[2]}</h6>
                  <h6 className="text-gray-50">
                    Eth Gifted: {ethers.utils.formatEther(item[3])} ETH
                  </h6>
                </div>
              );
            })}
        </div>
      </div>
      <div className=" h-54 bg-gradient-to-b from-slate-900 to-yellow-950 overflow-hidden">
        <h4 className="text-amber-400 border-solid border-2 border-amber-500 bg-gradient-to-b from-slate-700 to-slate-800">
          Bronze
        </h4>
        <div className="grid grid-rows-1 grid-flow-col max-w-md h-54">
          {isBronzeData &&
            bronzeFrensRandomArray.map((item, index) => {
              return (
                <div
                  key={index}
                  onClick={() => handleCardClick(item[2])}
                  className="animate-bronze text-center self-center bg-gradient-to-tr from-amber-100 from-2% via-amber-500 via-25%  to-amber-600 to-40% mt-2  shadow-lg shadow-amber-200/50 px-4 py-2 border-b-8 border-2 border-amber-100 rounded-3xl mx-2 "
                >
                  <h3 className="text-white">Name: {item[0]}</h3>
                  <h5 className="text-white">Message: {item[1]}</h5>
                  <h6 className="text-white ">
                    Address:{" "}
                    {`${item[2].slice(0, 5)}...${item[2].slice(
                      item[2].length - 4
                    )}`}
                  </h6>
                  <h6 className="text-white">
                    Eth Gifted: {ethers.utils.formatEther(item[3])} ETH
                  </h6>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default MainBody;
