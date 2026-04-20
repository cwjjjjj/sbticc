// src/data/mbti/typeImages.ts
// 16 主类型图片。32 亚型（-A / -T）共用对应主类型的图片。
import intj from './images/INTJ.png';
import intp from './images/INTP.png';
import entj from './images/ENTJ.png';
import entp from './images/ENTP.png';
import infj from './images/INFJ.png';
import infp from './images/INFP.png';
import enfj from './images/ENFJ.png';
import enfp from './images/ENFP.png';
import istj from './images/ISTJ.png';
import isfj from './images/ISFJ.png';
import estj from './images/ESTJ.png';
import esfj from './images/ESFJ.png';
import istp from './images/ISTP.png';
import isfp from './images/ISFP.png';
import estp from './images/ESTP.png';
import esfp from './images/ESFP.png';

const BY_MAIN: Record<string, string> = {
  INTJ: intj, INTP: intp, ENTJ: entj, ENTP: entp,
  INFJ: infj, INFP: infp, ENFJ: enfj, ENFP: enfp,
  ISTJ: istj, ISFJ: isfj, ESTJ: estj, ESFJ: esfj,
  ISTP: istp, ISFP: isfp, ESTP: estp, ESFP: esfp,
};

const ALL_CODES = [
  'INTJ-A','INTJ-T','INTP-A','INTP-T','ENTJ-A','ENTJ-T','ENTP-A','ENTP-T',
  'INFJ-A','INFJ-T','INFP-A','INFP-T','ENFJ-A','ENFJ-T','ENFP-A','ENFP-T',
  'ISTJ-A','ISTJ-T','ISFJ-A','ISFJ-T','ESTJ-A','ESTJ-T','ESFJ-A','ESFJ-T',
  'ISTP-A','ISTP-T','ISFP-A','ISFP-T','ESTP-A','ESTP-T','ESFP-A','ESFP-T',
];

export const TYPE_IMAGES: Record<string, string> = (() => {
  const m: Record<string, string> = {};
  ALL_CODES.forEach((code) => {
    const main = code.split('-')[0];
    m[code] = BY_MAIN[main];
  });
  return m;
})();

export const SHARE_IMAGES: Record<string, string> = { ...TYPE_IMAGES };
