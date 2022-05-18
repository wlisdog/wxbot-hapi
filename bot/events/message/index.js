import { onFunctionList } from './FunctionList/index.js';
import { onEmojiToImageFlag, onEmojiToImage } from './EmojiToImage/index.js';
import { onRoomComeAndGo } from './ComeAndGo/index.js';
import { onXiLiuDog, onXiLiuDogClose } from './XiLiuDog/index.js'

/**
 * 初始化消息方法
 * @param message {Class} 消息实例
 */
export default async function onMessageInit(message) {
  await onRoomComeAndGo(message);
  await onEmojiToImageFlag(message);
  await onEmojiToImage(message);
  await onFunctionList(message);
  await onXiLiuDog(message);
  await onXiLiuDogClose(message);
}
