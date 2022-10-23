import { message } from 'antd';
import { amurseNPM_axiosChat, amurseNPM_axiosUser} from './helpers/axios/axios'
import Web3 from 'web3';


export function openInNewTab(url) {
  if (!window) return;
  window.open(url, '_blank');
};

export const getAddressKey = () => {
  return Math.floor(Math.random() * 300);
}


export const appMessage = (msg) => {
  return message.info({content: msg, className: 'messageAntd'});
};

export const appError = (msg) => {
  return message.error({content: msg, className: 'messageAntd'});
};

export const disconnectUser = async () => {
  await amurseNPM_axiosUser.post('/api/user/logoutUser');
};

export const formattedWalletAddress = (address) => {
  const first = address.substring(0, 5);
  const addressLength = address.length;
  const second = address.substring(addressLength - 4, addressLength);
  return (`${first}...${second}`);
};


