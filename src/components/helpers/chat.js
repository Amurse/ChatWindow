import { amurseChatSDK } from "@amurse/chat_sdk";

export let chatSDK;

export const initializeChatSDK = (props) => {
  chatSDK = new amurseChatSDK(props);
}