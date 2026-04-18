// src/data/fsi/typeImages.ts
// 16personalities 风卡通头像，Nano Banana 2 生成，1:1 正方形
// 特殊字符映射：!→X, ?→Q, +→P
import copyx from './images/COPYX.png';
import rebel from './images/REBEL.png';
import saint from './images/SAINT.png';
import leave from './images/LEAVE.png';
import curex from './images/CUREX.png';
import silnt from './images/SILNT.png';
import dadyp from './images/DADYP.png';
import mamyp from './images/MAMYP.png';
import pickr from './images/PICKR.png';
import please_img from './images/PLEASE.png';
import goldp from './images/GOLDP.png';
import ghost from './images/GHOST.png';
import sosx from './images/SOSX.png';
import bankx from './images/BANKX.png';
import prnsp from './images/PRNSP.png';
import toolx from './images/TOOLX.png';
import bragp from './images/BRAGP.png';
import dualx from './images/DUALX.png';
import bossy from './images/BOSSY.png';
import famxq from './images/FAMXQ.png';

export const TYPE_IMAGES: Record<string, string> = {
  'COPYX': copyx,
  'REBEL': rebel,
  'SAINT': saint,
  'LEAVE': leave,
  'CURE!': curex,
  'SILNT': silnt,
  'DADY+': dadyp,
  'MAMY+': mamyp,
  'PICKR': pickr,
  'PLEASE': please_img,
  'GOLD+': goldp,
  'GHOST': ghost,
  'SOS!': sosx,
  'BANK!': bankx,
  'PRNS+': prnsp,
  'TOOLX': toolx,
  'BRAG+': bragp,
  'DUAL!': dualx,
  'BOSSY': bossy,
  'FAMX?': famxq,
};

export const SHARE_IMAGES: Record<string, string> = { ...TYPE_IMAGES };
