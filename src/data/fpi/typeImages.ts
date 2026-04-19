// src/data/fpi/typeImages.ts
// 16personalities 风卡通头像，Nano Banana 2 生成，1:1 正方形
// 特殊字符映射：9PIC!→9PICX, CKIN!→CKINX, BABY!→BABYX, FEED?→FEEDQ
import filtr from './images/FILTR.webp';
import _9picx from './images/9PICX.webp';
import emo_r from './images/EMO-R.webp';
import flexr from './images/FLEXR.webp';
import ckinx from './images/CKINX.webp';
import _3days from './images/3DAYS.webp';
import submr from './images/SUBMR.webp';
import liker from './images/LIKER.webp';
import ghost from './images/GHOST.webp';
import copyr from './images/COPYR.webp';
import sellr from './images/SELLR.webp';
import babyx from './images/BABYX.webp';
import furry from './images/FURRY.webp';
import mukbg from './images/MUKBG.webp';
import trvl9 from './images/TRVL9.webp';
import block from './images/BLOCK.webp';
import redbk from './images/REDBK.webp';
import judge from './images/JUDGE.webp';
import qslif from './images/QSLIF.webp';
import npc_f from './images/NPC-F.webp';
import _0post from './images/0POST.webp';
import feedq from './images/FEEDQ.webp';

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
