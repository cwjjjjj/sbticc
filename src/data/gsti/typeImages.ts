// src/data/gsti/typeImages.ts
// 16personalities 风卡通头像，Nano Banana 2 生成，1:1 正方形
import m_gold from './images/M_GOLD.webp';
import m_huby from './images/M_HUBY.webp';
import m_gtea from './images/M_GTEA.webp';
import m_whit from './images/M_WHIT.webp';
import m_fbro from './images/M_FBRO.webp';
import m_sain from './images/M_SAIN.webp';
import m_malk from './images/M_MALK.webp';
import m_team from './images/M_TEAM.webp';
import m_baby from './images/M_BABY.webp';
import m_ctrl from './images/M_CTRL.webp';
import m_moon from './images/M_MOON.webp';
import m_prnc from './images/M_PRNC.webp';
import m_dram from './images/M_DRAM.webp';
import m_soft from './images/M_SOFT.webp';
import m_phnx from './images/M_PHNX.webp';
import m_fanc from './images/M_FANC.webp';
import m_hotg from './images/M_HOTG.webp';
import m_schm from './images/M_SCHM.webp';
import m_wlot from './images/M_WLOT.webp';
import m_hook from './images/M_HOOK.webp';
import f_phnx from './images/F_PHNX.webp';
import f_mgir from './images/F_MGIR.webp';
import f_pcon from './images/F_PCON.webp';
import f_lick from './images/F_LICK.webp';
import f_ocea from './images/F_OCEA.webp';
import f_tool from './images/F_TOOL.webp';
import f_dady from './images/F_DADY.webp';
import f_iron from './images/F_IRON.webp';
import f_roug from './images/F_ROUG.webp';
import f_strg from './images/F_STRG.webp';
import f_nice from './images/F_NICE.webp';
import f_back from './images/F_BACK.webp';
import f_acgr from './images/F_ACGR.webp';
import f_wild from './images/F_WILD.webp';
import f_dark from './images/F_DARK.webp';
import f_boss from './images/F_BOSS.webp';
import f_kbgr from './images/F_KBGR.webp';
import f_dadg from './images/F_DADG.webp';
import f_part from './images/F_PART.webp';
import f_bric from './images/F_BRIC.webp';
import undef from './images/UNDEF.webp';
import hwdp from './images/HWDP.webp';

export const TYPE_IMAGES: Record<string, string> = {
  M_GOLD: m_gold, M_HUBY: m_huby, M_GTEA: m_gtea, M_WHIT: m_whit, M_FBRO: m_fbro,
  M_SAIN: m_sain, M_MALK: m_malk, M_TEAM: m_team, M_BABY: m_baby, M_CTRL: m_ctrl,
  M_MOON: m_moon, M_PRNC: m_prnc, M_DRAM: m_dram, M_SOFT: m_soft, M_PHNX: m_phnx,
  M_FANC: m_fanc, M_HOTG: m_hotg, M_SCHM: m_schm, M_WLOT: m_wlot, M_HOOK: m_hook,
  F_PHNX: f_phnx, F_MGIR: f_mgir, F_PCON: f_pcon, F_LICK: f_lick, F_OCEA: f_ocea,
  F_TOOL: f_tool, F_DADY: f_dady, F_IRON: f_iron, F_ROUG: f_roug, F_STRG: f_strg,
  F_NICE: f_nice, F_BACK: f_back, F_ACGR: f_acgr, F_WILD: f_wild, F_DARK: f_dark,
  F_BOSS: f_boss, F_KBGR: f_kbgr, F_DADG: f_dadg, F_PART: f_part, F_BRIC: f_bric,
  UNDEF: undef, HWDP: hwdp,
};

export const SHARE_IMAGES: Record<string, string> = { ...TYPE_IMAGES };
