import makeRequest from './makeRequest';

const sendMessage = ({ channelID, userId, image, audio, text }) => {
  return makeRequest('chat/message', {
    method: 'POST',
    body: {
      channel: channelID,
      sender: userId,
      message: text,
      image,
      audio
    }
  });
};

export default sendMessage;
