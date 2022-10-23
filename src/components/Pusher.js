import React, {useEffect, useState} from 'react';
import Pusher from 'pusher-js';

export let pusher;


const PusherLoader = (props) => {
  const { setPusherMounted } = props;

  // DISCONNECT********************************************
  useEffect(() => {
    setPusherMounted(true);
    pusher = new Pusher("97f25cbcbd8b4a017e8c", {cluster: 'us2'});
    return () => {
      setPusherMounted(false);
      if (pusher.connection.state !== 'disconnected') {
        pusher.unbind_all();
        pusher.disconnect();
      }
      
    };

  }, []);

  return <span></span>;
};

export default PusherLoader;
