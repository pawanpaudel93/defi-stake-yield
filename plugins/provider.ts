import { ethers } from "ethers";
declare let window: any;
export const provider = (typeof window !== 'undefined' && window.ethereum !== 'undefined') ? new ethers.providers.Web3Provider(window.ethereum) : new ethers.providers.InfuraProvider(process.env.NETWORK, process.env.INFURA_PROJECT_ID);
