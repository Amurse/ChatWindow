import { MetaMask } from '@amurse/signer_sdk';


export const signMessageMetamask = async (message, userAddress) => {
  let sign = await MetaMask.signMessage(message, userAddress);
  return sign;
}


