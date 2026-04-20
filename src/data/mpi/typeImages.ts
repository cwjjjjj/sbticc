// src/data/mpi/typeImages.ts
// 16personalities 风卡通头像，Nano Banana 2 生成，1:1 正方形
// 特殊字符映射：LIVE!→LIVEX, FOMO+→FOMOP, ZERO$→ZEROS
import livex from './images/LIVEX.webp';
import _2hand from './images/2HAND.webp';
import haulx from './images/HAULX.webp';
import cheap from './images/CHEAP.webp';
import goldn from './images/GOLDN.webp';
import setup from './images/SETUP.webp';
import nuboy from './images/NUBOY.webp';
import luxur from './images/LUXUR.webp';
import bilib from './images/BILIB.webp';
import fomop from './images/FOMOP.webp';
import giftr from './images/GIFTR.webp';
import retrn from './images/RETRN.webp';
import steal from './images/STEAL.webp';
import premm from './images/PREMM.webp';
import flipr from './images/FLIPR.webp';
import insta from './images/INSTA.webp';
import char0 from './images/CHAR0.webp';
import bossx from './images/BOSSX.webp';
import zeros from './images/ZEROS.webp';
import mixdr from './images/MIXDR.webp';

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
