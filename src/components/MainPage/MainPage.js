import React, {useEffect, useState} from 'react';
import {Input} from 'antd';
import {SearchOutlined} from '@ant-design/icons';
import ConversationCard from './ConversationCard';
import { appMessage } from '../helpers';
import { validateAddressEthereum } from '../Connect/ConnectWallet';
import { pusher } from '../Pusher';
import { chatSDK } from '../helpers/chat';

const MainPage = (props) => {
  const { user, setChatData } = props;
  const [conversations, setConversations] = useState([]);
  const [newAddress, setNewAddress] = useState('');

  // PUSHER
  //  DATA NEEDED
  const shiftFloatConversation = (updatedConvo) => {
    let conversation = updatedConvo; 
    let convos = [...conversations];
    let convoIndex = convos.findIndex(_convo => _convo._id === conversation._id);
    if (convos[convoIndex]) {
      // keep additional info of the chat and only over-write certain parts
      conversation = { ...conversations[convoIndex], ...conversation };
      convos.splice(convoIndex, 1);
        
    }
    convos.unshift(conversation);
    setConversations(convos);
  
  };
  
  const addNewConversation =  (newConvo) => {
    let convos = [...conversations];
    convos.unshift(newConvo);
    setConversations(convos)
  }

  // Conversations and Messages live time
  const [updatedConversation, setUpdatedConversation] = useState({});
  const [newConversation, setNewConversation] = useState({});

  useEffect(() => {
    if (newConversation._id) addNewConversation(newConversation);
    // eslint-disable-next-line
    }, [newConversation])

  useEffect(() => {
    if (updatedConversation._id) shiftFloatConversation(updatedConversation);
    // eslint-disable-next-line
    }, [updatedConversation])


  useEffect(() => {
    if (user.address) {
      const channel = pusher.subscribe(user.address);
      channel.bind('new-conversation', (response) => setNewConversation(response.data));
      channel.bind('update-conversation', (response) => setUpdatedConversation(response.data));
    }

    return () => {
      pusher.unsubscribe(user.address);
    };
  }, [user.address]);

  const fetchConversations = async () => {
    //get wallet conversations
    let convos = await chatSDK.getConversations({ address: user.address, signature: user.signature }, (err) => {console.log(err)})
    //set wallet conversations
    if (convos) setConversations(convos);
  }

  useEffect(() => {
    fetchConversations();
  }, []);

  const NoConversations = () => (
    <div className='amurse_blue amurse_bold amurse_textMed'>
            No Conversations
    </div>
  );

  const searchConversation = async () => {
    if (!validateAddressEthereum(newAddress)) appMessage('Invalid Address');
    let convo = await chatSDK.getConversation({ address: user.address, receiverAddress: newAddress, signature: user.signature }, (err)=>{console.log(err)});
    if(convo) setChatData({ receiverAddress: newAddress, userConversation: convo });
  }




  return (
    <div className='floatMessage amurse_padding8'>

      <div className='addressInput'>
        <Input
          block="true"
          maxLength={500}
          disabled={!user._id}
          onChange={(e)=>setNewAddress(e.target.value)}
          suffix={<SearchOutlined className='amurse_hover' style={{ color: newAddress? 'var(--amurse_blue)': 'amurse_gray' }} onClick={searchConversation} />}
          placeholder="ETH address..."
          onPressEnter={searchConversation}
        />


      </div>
      <div className='amurse_recentConvos' style={{height: '70vh', marginTop: '8px'}}>
        {
          conversations[0] ? conversations.map((convo, index) =>
            convo && convo._id && <ConversationCard key={index} index={index} convo={convo} setChatData={setChatData} userAddress={user.address} />)
        : <NoConversations />
          }
      </div>
      
    </div>
  );
};

export default MainPage;
