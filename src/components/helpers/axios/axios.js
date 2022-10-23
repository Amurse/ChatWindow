import axiosGenerator from '@amurse/axios_sdk';


const {
  axiosChat, axiosUser, axiosAccess
} = axiosGenerator({
  dev: process && process.env && process.env.REACT_APP_AMURSE_DEVELOPMENT
});

export const amurseNPM_axiosChat = axiosChat
export const amurseNPM_axiosUser = axiosUser;
export const amurseNPM_axiosAccess = axiosAccess;