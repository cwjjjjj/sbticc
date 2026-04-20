// src/data/fsi/typeImages.ts
// 16personalities 风卡通头像，Nano Banana 2 生成，1:1 正方形
// 特殊字符映射：!→X, ?→Q, +→P
import copyx from './images/COPYX.webp';
import rebel from './images/REBEL.webp';
import saint from './images/SAINT.webp';
import leave from './images/LEAVE.webp';
import curex from './images/CUREX.webp';
import silnt from './images/SILNT.webp';
import dadyp from './images/DADYP.webp';
import mamyp from './images/MAMYP.webp';
import pickr from './images/PICKR.webp';
import please_img from './images/PLEASE.webp';
import goldp from './images/GOLDP.webp';
import ghost from './images/GHOST.webp';
import sosx from './images/SOSX.webp';
import bankx from './images/BANKX.webp';
import prnsp from './images/PRNSP.webp';
import toolx from './images/TOOLX.webp';
import bragp from './images/BRAGP.webp';
import dualx from './images/DUALX.webp';
import bossy from './images/BOSSY.webp';
import famxq from './images/FAMXQ.webp';

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
