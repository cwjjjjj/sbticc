import bing from './images/BING.webp';
import ding from './images/DING.webp';
import geng from './images/GENG.webp';
import gui from './images/GUI.webp';
import ji from './images/JI.webp';
import jia from './images/JIA.webp';
import ren from './images/REN.webp';
import wu from './images/WU.webp';
import xin from './images/XIN.webp';
import yi from './images/YI.webp';

export const TYPE_IMAGES: Record<string, string> = {
  BING: bing,
  DING: ding,
  GENG: geng,
  GUI: gui,
  JI: ji,
  JIA: jia,
  REN: ren,
  WU: wu,
  XIN: xin,
  YI: yi,
};

export const SHARE_IMAGES: Record<string, string> = { ...TYPE_IMAGES };
