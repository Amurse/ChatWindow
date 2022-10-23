import { Button } from 'antd';
import React, { useState } from 'react';
import './App.css';
import './components/styles.css'

import ChatWindow from './components/index';

const devToken = "lPZWvkJgs9ivGrh6NefXvYS7wrUpSxtTiUqMDtBxVOvwgULnTWaqrkoQaidm";
function App() {

  const handleAccounts = async () => {
    if (!window) return;
    await window.ethereum.request({method: 'eth_requestAccounts'});
  };

  const [address, setAddress] = useState('');
  const [refreshChat, setRefreshChat] = useState(true);
  const refresh = () => setRefreshChat(!refreshChat)


  return ( 
    <div>
      <Button type="primary" onClick={handleAccounts}>Connect</Button>
      <Button onClick={() => {
        setAddress('0x698FbAACA64944376e2CDC4CAD86eaa91362cF54')
        refresh();
      }}>Set Address</Button>
      {/* <FloatingMessageArea receiverToken={devToken} interCom={false} customAddress={address} refresh={refreshChat} tag={'Test Messages'} dev={true} /> */}
      <ChatWindow
        receiverToken={`${devToken}`}
        interCom={false}
        customAddress={address}
        refresh={refreshChat}
        dev={true}
        tag={"ME: Here is my calendar link"}
        errHandler={(err) => console.log(err)}
        msgHandler={(msg) => console.log(msg)}
      />
    </div>
 
  );
}

export default App;
