import React, {useEffect, useState} from 'react';
import {Input} from 'antd';
import {SendOutlined} from '@ant-design/icons';
import {pusher} from '../Pusher';
import FloatMessageArea from './FloatMessageArea';
import { appError } from '../helpers';
import { chatSDK } from '../helpers/chat';

const MessagePage = (props) => {
  const { user, chat, setChatData, interCom, tag } = props;
  const [message, setMessage] = useState();
  
  const fetchConversation = async () => {
    let convo = await chatSDK.getConversation({ address: user.address, receiverAddress: chat.receiverAddress, signature: user.signature }, (err)=>{console.log(err)});
    if (convo) setChatData({ userConversation: convo });
  }  

  const addChatMessage = (data) => {
    const {message} = data;
    const messages = chat.userConversation?.messages;
    messages.push(message);
    setChatData({...chat, userConversation: {...chat.userConversation, messages: messages}});
  };

  const fetchMessages = async () => {
    if (!chat.userConversation?._id) {
      appError('something went wrong')
      return;
    }
    const messages = (await chatSDK.getMessages({ convoId: chat.userConversation?._id }));
    const userConvo = { ...chat.userConversation, messages: messages }
    let newChat = chat;
    newChat.userConversation = userConvo;
    setChatData(newChat);
  };

  // EXISTING MESSAGES
  useEffect(() => {
    if (!chat.userConversation?._id) {
      fetchConversation();
    };
    // eslint-disable-next-line
  }, [chat.receiverAddress]);

  useEffect(() => {
    if (chat.userConversation && chat.userConversation._id) {
      fetchMessages();
    }
   
  }, [chat.userConversation && chat.userConversation._id])

  // PUSHER - NEW MESSAGES
  const [newMessage, setNewMessage] = useState({});
  useEffect(() => {
    newMessage.message && newMessage.message._id &&
      addChatMessage(newMessage);
    // eslint-disable-next-line
  }, [newMessage]);

  useEffect(() => {
    if (chat.userConversation?._id) {
      const channel = pusher.subscribe(
          chat.userConversation._id);
      channel.bind('new-message', (response) => setNewMessage(response.data));
    }
    return () => {
      chat.userConversation?._id &&
        pusher.unsubscribe(chat.userConversation?._id);
    };
  }, [chat.userConversation && chat.userConversation._id]);
  // ______________________________________________________________________


  const returnToMain = () => setChatData({ receiverAddress: '', userConversation: {} });

  const header = () => {
    return (
      <div className='amurse_flex'>
        {!interCom && <div onClick={returnToMain}
          className='amurse_hover mainPageHeader amurse_blue amurse_bold'>
           Return
        </div>}
      </div>
    );
  };

  const submitMessage = async () => {
    if (!message) console.log('No Message Content');
    await chatSDK.createMessage({
      address: user.address, text: message,
      owner: user._id,
      convoId: chat.userConversation?._id,
      convoIndex: chat.userConversation.index || 0,
      subject: tag,
    });
    setMessage('');
  };

  const MessageInput = () => {
    return (
      <div className='floatCreateMessage'>
        <Input
          value={message}
          onChange={(e)=>setMessage(e.target.value)}
          onPressEnter={submitMessage}
          maxLength={500}
          block="true"
          suffix={<SendOutlined
  
            className='amurse_hover' onClick={() => message && submitMessage()}
            style={{ color: message? 'var(--amurse_blue)' : 'amurse_gray'}} />}
          placeholder="Enter message..."
        />
      </div>
    );
  };

  return (
    <div className='floatMessagePage amurse_flex amurse_flexCol'>
      {header()}
      <FloatMessageArea chat={chat} user={user}/>
      {MessageInput()}
    </div>

  );
};

export default MessagePage;
