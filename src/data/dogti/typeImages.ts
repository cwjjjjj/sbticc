import alaskan from './images/alaskan.png';
import beagle from './images/beagle.png';
import bichon from './images/bichon.png';
import bordercollie from './images/bordercollie.png';
import chow from './images/chow.png';
import corgi from './images/corgi.png';
import dachshund from './images/dachshund.png';
import doberman from './images/doberman.png';
import germanshepherd from './images/germanshepherd.png';
import goldenretriever from './images/goldenretriever.png';
import husky from './images/husky.png';
import labrador from './images/labrador.png';
import maltese from './images/maltese.png';
import poodle from './images/poodle.png';
import samoyed from './images/samoyed.png';
import shiba from './images/shiba.png';

const BY_DOG: Record<string, string> = {
  alaskan, beagle, bichon, bordercollie, chow, corgi, dachshund,
  doberman, germanshepherd, goldenretriever, husky, labrador,
  maltese, poodle, samoyed, shiba,
};

// MBTI 码 → 狗狗品种标识
const CODE_TO_DOG: Record<string, string> = {
  INTJ: 'shiba',
  INTP: 'alaskan',
  ENTJ: 'doberman',
  ENTP: 'bordercollie',
  INFJ: 'samoyed',
  INFP: 'maltese',
  ENFJ: 'goldenretriever',
  ENFP: 'beagle',
  ISTJ: 'corgi',
  ISFJ: 'bichon',
  ESTJ: 'germanshepherd',
  ESFJ: 'labrador',
  ISTP: 'chow',
  ISFP: 'dachshund',
  ESTP: 'husky',
  ESFP: 'poodle',
};

export const TYPE_IMAGES: Record<string, string> = (() => {
  const out: Record<string, string> = {};
  Object.entries(CODE_TO_DOG).forEach(([code, dog]) => {
    out[code] = BY_DOG[dog];
  });
  return out;
})();

// 分享卡用同一套图
export const SHARE_IMAGES: Record<string, string> = { ...TYPE_IMAGES };
