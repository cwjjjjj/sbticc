// src/data/gsti/typeImages.ts
// 16personalities 风卡通头像，Nano Banana 2 生成，1:1 正方形
import m_gold from './images/M_GOLD.png';
import m_huby from './images/M_HUBY.png';
import m_gtea from './images/M_GTEA.png';
import m_whit from './images/M_WHIT.png';
import m_fbro from './images/M_FBRO.png';
import m_sain from './images/M_SAIN.png';
import m_malk from './images/M_MALK.png';
import m_team from './images/M_TEAM.png';
import m_baby from './images/M_BABY.png';
import m_ctrl from './images/M_CTRL.png';
import m_moon from './images/M_MOON.png';
import m_prnc from './images/M_PRNC.png';
import m_dram from './images/M_DRAM.png';
import m_soft from './images/M_SOFT.png';
import m_phnx from './images/M_PHNX.png';
import m_fanc from './images/M_FANC.png';
import m_hotg from './images/M_HOTG.png';
import m_schm from './images/M_SCHM.png';
import m_wlot from './images/M_WLOT.png';
import m_hook from './images/M_HOOK.png';
import f_phnx from './images/F_PHNX.png';
import f_mgir from './images/F_MGIR.png';
import f_pcon from './images/F_PCON.png';
import f_lick from './images/F_LICK.png';
import f_ocea from './images/F_OCEA.png';
import f_tool from './images/F_TOOL.png';
import f_dady from './images/F_DADY.png';
import f_iron from './images/F_IRON.png';
import f_roug from './images/F_ROUG.png';
import f_strg from './images/F_STRG.png';
import f_nice from './images/F_NICE.png';
import f_back from './images/F_BACK.png';
import f_acgr from './images/F_ACGR.png';
import f_wild from './images/F_WILD.png';
import f_dark from './images/F_DARK.png';
import f_boss from './images/F_BOSS.png';
import f_kbgr from './images/F_KBGR.png';
import f_dadg from './images/F_DADG.png';
import f_part from './images/F_PART.png';
import f_bric from './images/F_BRIC.png';
import undef from './images/UNDEF.png';
import hwdp from './images/HWDP.png';

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
