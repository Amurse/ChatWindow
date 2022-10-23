import {AmurseConnectMetamask} from '@amurse/connect_sdk';

const allowedChains = [1, 137, 43114, 56, 42161, 10, 25, 250, 100, 1313161554, 42220, 1285, 9001, 1666600000];
const MetaMask = new AmurseConnectMetamask({allowedNetworks: allowedChains})

//validate ethreum address
export const validateAddressEthereum = async (address) => {
  const valid = await MetaMask.validateAddress(address);
  return valid;
}

// if metamask already connected, return updated account
export const connectSilentlyMetamask = async (setUserData, errorHandler) => {
  let connectedAccount = await MetaMask.connectSilently(errorHandler);
  if (connectedAccount) {
    setUserData && setUserData({ address: connectedAccount });
    return connectedAccount;
  }
  return null;
}

export const bindChanges = (setUserData, setChatData) => {
  MetaMask.bindChanges({ accounts: true, chain: true }, (data) => {
    setUserData({ address: '' });
    setChatData({ open: false });
    connectSilentlyMetamask(setUserData, (msg) => {console.log(msg)})
  })
}
