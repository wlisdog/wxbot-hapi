import onMessageInit from './message/index.js';

const onMessage = message => {
  if (message.self()) return;
  onMessageInit(message);
};

export default onMessage;
