import makeRequest from './makeRequest';
import { IFileInfo } from './public/types';

const sendMessage = ({ channelID, userId, image, audio, text, file }: {
  channelID: string;
  userId: string;
  image?: string;
  audio?: string;
  text?: string;
  file?: IFileInfo;
}) => {
  return makeRequest('chat/message', {
    method: 'POST',
    body: {
      channel: channelID,
      sender: userId,
      message: text,
      image,
      audio,
      file
    }
  });
};

export default sendMessage;
