import { abi, contractAddress } from "../constants/constants";
import { ethers } from "../constants/ethers-5.6.esm.min.js";
import { useState, useEffect } from "react";
const Header = () => {
  const [amountOfFrens, setAmountOfFrens] = useState(0);
  const [amountOfEthGifted, setAmountOfEthGifted] = useState(0);
  const [amountOfFrensGifted, setAmountOfFrensGifted] = useState(0);

  const getAmountOfFrens = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    const data = await contract.amountofFrens();
    setAmountOfFrens(data.toNumber());
  };

  const getAmountOfEthGifted = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    const data = await contract.amountOfEthGifted();
    const formattedData = ethers.utils.formatEther(data);
    setAmountOfEthGifted(formattedData);
  };

  const getAmountOfFrensGifted = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    const data = await contract.amountOfFrensGifted();
    setAmountOfFrensGifted(data.toNumber());
  };

  useEffect(() => {
    getAmountOfFrens();
    getAmountOfEthGifted();
    getAmountOfFrensGifted();
  }, []);

  return (
    <div className="grid grid-rows-1 grid-flow-col text-center">
      <h4>Amount of Frens: {amountOfFrens}</h4>
      <h4>Gifts Sent: {amountOfFrensGifted}</h4>
      <h4>EthGifted: {amountOfEthGifted}</h4>
    </div>
  );
};

export default Header;
