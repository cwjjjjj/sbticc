// src/data/mpi/typeImages.ts
// 16personalities 风卡通头像，Nano Banana 2 生成，1:1 正方形
// 特殊字符映射：LIVE!→LIVEX, FOMO+→FOMOP, ZERO$→ZEROS
import livex from './images/LIVEX.png';
import _2hand from './images/2HAND.png';
import haulx from './images/HAULX.png';
import cheap from './images/CHEAP.png';
import goldn from './images/GOLDN.png';
import setup from './images/SETUP.png';
import nuboy from './images/NUBOY.png';
import luxur from './images/LUXUR.png';
import bilib from './images/BILIB.png';
import fomop from './images/FOMOP.png';
import giftr from './images/GIFTR.png';
import retrn from './images/RETRN.png';
import steal from './images/STEAL.png';
import premm from './images/PREMM.png';
import flipr from './images/FLIPR.png';
import insta from './images/INSTA.png';
import char0 from './images/CHAR0.png';
import bossx from './images/BOSSX.png';
import zeros from './images/ZEROS.png';
import mixdr from './images/MIXDR.png';

export const TYPE_IMAGES: Record<string, string> = {
  'LIVE!': livex,
  '2HAND': _2hand,
  'HAULX': haulx,
  'CHEAP': cheap,
  'GOLDN': goldn,
  'SETUP': setup,
  'NUBOY': nuboy,
  'LUXUR': luxur,
  'BILIB': bilib,
  'FOMO+': fomop,
  'GIFTR': giftr,
  'RETRN': retrn,
  'STEAL': steal,
  'PREMM': premm,
  'FLIPR': flipr,
  'INSTA': insta,
  'CHAR0': char0,
  'BOSSX': bossx,
  'ZERO$': zeros,
  'MIXDR': mixdr,
};

export const SHARE_IMAGES: Record<string, string> = { ...TYPE_IMAGES };
