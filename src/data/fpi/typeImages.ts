// src/data/fpi/typeImages.ts
// 16personalities 风卡通头像，Nano Banana 2 生成，1:1 正方形
// 特殊字符映射：9PIC!→9PICX, CKIN!→CKINX, BABY!→BABYX, FEED?→FEEDQ
import filtr from './images/FILTR.png';
import _9picx from './images/9PICX.png';
import emo_r from './images/EMO-R.png';
import flexr from './images/FLEXR.png';
import ckinx from './images/CKINX.png';
import _3days from './images/3DAYS.png';
import submr from './images/SUBMR.png';
import liker from './images/LIKER.png';
import ghost from './images/GHOST.png';
import copyr from './images/COPYR.png';
import sellr from './images/SELLR.png';
import babyx from './images/BABYX.png';
import furry from './images/FURRY.png';
import mukbg from './images/MUKBG.png';
import trvl9 from './images/TRVL9.png';
import block from './images/BLOCK.png';
import redbk from './images/REDBK.png';
import judge from './images/JUDGE.png';
import qslif from './images/QSLIF.png';
import npc_f from './images/NPC-F.png';
import _0post from './images/0POST.png';
import feedq from './images/FEEDQ.png';

export const TYPE_IMAGES: Record<string, string> = {
  'FILTR': filtr,
  '9PIC!': _9picx,
  'EMO-R': emo_r,
  'FLEXR': flexr,
  'CKIN!': ckinx,
  '3DAYS': _3days,
  'SUBMR': submr,
  'LIKER': liker,
  'GHOST': ghost,
  'COPYR': copyr,
  'SELLR': sellr,
  'BABY!': babyx,
  'FURRY': furry,
  'MUKBG': mukbg,
  'TRVL9': trvl9,
  'BLOCK': block,
  'REDBK': redbk,
  'JUDGE': judge,
  'QSLIF': qslif,
  'NPC-F': npc_f,
  '0POST': _0post,
  'FEED?': feedq,
};

export const SHARE_IMAGES: Record<string, string> = { ...TYPE_IMAGES };
