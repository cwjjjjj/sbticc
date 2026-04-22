import type { Question } from '../testConfig';

const scale = [
  { label: '完全不像我', value: 1 },
  { label: '有一点像', value: 2 },
  { label: '挺像的', value: 3 },
  { label: '这就是我本人', value: 4 },
] as const;

export const questions: Question[] = [
  // WOOD
  { id: 'emti_wood_01', dim: 'WOOD', text: '被人压着安排人生路线时，我第一反应是想自己开一条路。', options: [...scale] },
  { id: 'emti_wood_02', dim: 'WOOD', text: '一个新机会摆在面前，我会先兴奋地想“这里面能长出什么”。', options: [...scale] },
  { id: 'emti_wood_03', dim: 'WOOD', text: '我不太能忍受长期停滞，哪怕表面安稳，心里也会觉得自己快枯了。', options: [...scale] },
  { id: 'emti_wood_04', dim: 'WOOD', text: '别人说“不现实”，我反而会更想证明这件事可以被我做出来。', options: [...scale] },

  // FIRE
  { id: 'emti_fire_01', dim: 'FIRE', text: '我在一群人里很难完全隐形，哪怕没刻意表现，也容易被注意到。', options: [...scale] },
  { id: 'emti_fire_02', dim: 'FIRE', text: '喜欢一件事或一个人时，我的热情很难装得云淡风轻。', options: [...scale] },
  { id: 'emti_fire_03', dim: 'FIRE', text: '我说话有感染力，讲到兴头上能把旁边的人也点着。', options: [...scale] },
  { id: 'emti_fire_04', dim: 'FIRE', text: '冷场时我会下意识想把气氛救起来，不然空气太尴尬。', options: [...scale] },

  // EARTH
  { id: 'emti_earth_01', dim: 'EARTH', text: '身边人出事时，我经常是那个先想“怎么收拾局面”的人。', options: [...scale] },
  { id: 'emti_earth_02', dim: 'EARTH', text: '我做决定会考虑成本、后果、长期稳定，不太迷信一时上头。', options: [...scale] },
  { id: 'emti_earth_03', dim: 'EARTH', text: '别人说我靠谱，不是夸张，是他们真的经常把烂摊子递给我。', options: [...scale] },
  { id: 'emti_earth_04', dim: 'EARTH', text: '我对“过日子”这件事有本能敏感度，钱、时间、人情账都要算清。', options: [...scale] },

  // METAL
  { id: 'emti_metal_01', dim: 'METAL', text: '我对质感、细节、分寸很敏感，粗糙东西会让我当场降温。', options: [...scale] },
  { id: 'emti_metal_02', dim: 'METAL', text: '我可以礼貌，但我的边界不是摆设，越界的人会被我记住。', options: [...scale] },
  { id: 'emti_metal_03', dim: 'METAL', text: '我欣赏干净利落的人和事，拖泥带水会消耗我的耐心。', options: [...scale] },
  { id: 'emti_metal_04', dim: 'METAL', text: '出门见人这件事，我不一定浓妆，但一定不能“随便到丢脸”。', options: [...scale] },

  // WATER
  { id: 'emti_water_01', dim: 'WATER', text: '我很会读空气，很多话别人没说完，我已经知道后面是什么。', options: [...scale] },
  { id: 'emti_water_02', dim: 'WATER', text: '遇到冲突我不一定当场硬刚，我更擅长绕开、观察、找破口。', options: [...scale] },
  { id: 'emti_water_03', dim: 'WATER', text: '我脑子里经常同时跑好几条暗线：这个人为什么这样，那件事后面是什么。', options: [...scale] },
  { id: 'emti_water_04', dim: 'WATER', text: '我不怕复杂关系，甚至有点擅长在复杂关系里找到自己的位置。', options: [...scale] },

  // YIN / YANG, high = yin
  {
    id: 'emti_yin_01',
    dim: 'YIN',
    text: '我的能量更像：',
    options: [
      { label: '直接推门进去，先把局面打开', value: 1 },
      { label: '看准门缝再进，不浪费动作', value: 2 },
      { label: '先在门外听一会儿，确认里面的气流', value: 3 },
      { label: '我不推门，我让门自己开', value: 4 },
    ],
  },
  {
    id: 'emti_yin_02',
    dim: 'YIN',
    text: '真正想要某件东西时，我更常见的方式是：',
    options: [
      { label: '直接说，直接争，直接拿', value: 1 },
      { label: '表达意图，然后看对方反应', value: 2 },
      { label: '先铺垫，让对方意识到我想要', value: 3 },
      { label: '不明说，但会慢慢把局势推到我这边', value: 4 },
    ],
  },
  {
    id: 'emti_yin_03',
    dim: 'YIN',
    text: '别人第一次见你，通常会觉得你：',
    options: [
      { label: '有压迫感，存在感直接怼脸', value: 1 },
      { label: '比较明亮，容易接近', value: 2 },
      { label: '有距离感，需要多看几眼', value: 3 },
      { label: '很难读懂，像隔着一层雾', value: 4 },
    ],
  },
  {
    id: 'emti_yin_04',
    dim: 'YIN',
    text: '处理情绪时，我更像：',
    options: [
      { label: '当场摊开，不喜欢憋着', value: 1 },
      { label: '会说，但尽量说得体面', value: 2 },
      { label: '先收起来，等自己整理明白', value: 3 },
      { label: '藏很深，连我自己都要过几天才摸到', value: 4 },
    ],
  },
  {
    id: 'emti_yin_05',
    dim: 'YIN',
    text: '你更讨厌别人说你：',
    options: [
      { label: '没冲劲，太软', value: 1 },
      { label: '不够直接，想太多', value: 2 },
      { label: '太外放，没留白', value: 3 },
      { label: '太好懂，没层次', value: 4 },
    ],
  },
];

export const specialQuestions: Question[] = [];
