import abyssinian from './images/abyssinian.png';
import americanshorthair from './images/americanshorthair.png';
import bengal from './images/bengal.png';
import britishshorthair from './images/britishshorthair.png';
import exoticshorthair from './images/exoticshorthair.png';
import goldenchinchilla from './images/goldenchinchilla.png';
import liHua from './images/liHua.png';
import maine from './images/maine.png';
import orangetabby from './images/orangetabby.png';
import persian from './images/persian.png';
import ragdoll from './images/ragdoll.png';
import russianblue from './images/russianblue.png';
import scottishfold from './images/scottishfold.png';
import siamese from './images/siamese.png';
import silvertabby from './images/silvertabby.png';
import tuxedo from './images/tuxedo.png';

const BY_CAT: Record<string, string> = {
  abyssinian, americanshorthair, bengal, britishshorthair, exoticshorthair,
  goldenchinchilla, liHua, maine, orangetabby, persian, ragdoll, russianblue,
  scottishfold, siamese, silvertabby, tuxedo,
};

// MBTI 码 → 猫咪品种标识（与 content.ts 的 cat 字段一致）
const CODE_TO_CAT: Record<string, string> = {
  ENTJ: 'maine',
  ENTP: 'bengal',
  ENFJ: 'ragdoll',
  ENFP: 'abyssinian',
  ESTJ: 'russianblue',
  ESTP: 'siamese',
  ESFJ: 'goldenchinchilla',
  ESFP: 'persian',
  INTJ: 'britishshorthair',
  INTP: 'scottishfold',
  INFJ: 'tuxedo',
  INFP: 'silvertabby',
  ISTJ: 'americanshorthair',
  ISTP: 'liHua',
  ISFJ: 'orangetabby',
  ISFP: 'exoticshorthair',
};

export const TYPE_IMAGES: Record<string, string> = (() => {
  const out: Record<string, string> = {};
  Object.entries(CODE_TO_CAT).forEach(([code, cat]) => {
    out[code] = BY_CAT[cat];
  });
  return out;
})();

export const SHARE_IMAGES: Record<string, string> = { ...TYPE_IMAGES };
