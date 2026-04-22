import { useMemo, useState, useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { motion } from 'framer-motion';
import DimList from './DimList';
import DescriptionBlock from './DescriptionBlock';
import OtherTests from './OtherTests';
import TypeCard from './TypeCard';
import { useTestConfig } from '../data/testConfig';
import type { ComputeResultOutput } from '../utils/matching';
import GSTIHeroBadge from './GSTIHeroBadge';
import type { Gender } from '../data/testConfig';
import RevealOverlay from './RevealOverlay';
import RarityBadge from './RarityBadge';
import HookMatrix from './HookMatrix';
import RelatedArticles from './RelatedArticles';
import { useRarity } from '../hooks/useRarity';
import type { ShareCardRarity } from '../utils/shareCard';
import { trackEvent } from '../hooks/useAnalytics';

const isTestDomain = window.location.hostname.includes('sbticc-test');

interface ResultPageProps {
  result: ComputeResultOutput;
  isPaid?: boolean;
  onShare: (rarity?: ShareCardRarity) => void;
  onInviteCompare: (rarity?: ShareCardRarity) => void;
  onRestart: () => void;
  onHome: () => void;
  onStartPayment?: () => void;
  onAlreadyPaid?: () => void;
  onDebugReroll?: () => void;
  onDebugForceType?: (code: string) => void;
  gender?: Gender;
  /** Optional test-specific badge shown above the main type title (e.g. FPI feed stickers). */
  testBadge?: ReactNode;
  /** Optional test-specific footer rendered after action buttons (e.g. FSI support block). */
  testFooter?: ReactNode;
}

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function ResultPage({
  result,
  isPaid = true,
  onShare,
  onInviteCompare,
  onRestart,
  onHome,
  onStartPayment = () => undefined,
  onAlreadyPaid = () => undefined,
  onDebugReroll,
  onDebugForceType,
  gender,
  testBadge,
  testFooter,
}: ResultPageProps) {
  const config = useTestConfig();
  const [debugSelectedType, setDebugSelectedType] = useState('');
  const [revealed, setRevealed] = useState(false);
  const typeCode = result.finalType.code;
  const typeDef = config.typeLibrary[typeCode] ?? result.finalType;
  const rarity = useRarity(config.id, typeCode);

  // Fire result_view exactly once per mount
  const resultViewFired = useRef(false);
  useEffect(() => {
    if (resultViewFired.current) return;
    resultViewFired.current = true;
    trackEvent('result_view', { testId: config.id, typeCode });
  }, [config.id, typeCode]);

  // Snapshot for share card (only pass when loaded + has data).
  const shareRarity: ShareCardRarity | undefined =
    rarity.loaded && !rarity.error && rarity.totalTests > 0
      ? { percentile: rarity.percentile, tier: rarity.tier }
      : undefined;
  const handleShareClick = () => onShare(shareRarity);
  const handleInviteClick = () => onInviteCompare(shareRarity);

  // Count how many of the 10 tests the user has completed locally (for ContinueJourneyCard).
  const localHistoryCount = useMemo(() => {
    const keys = [
      'sbti_history', 'love_history', 'work_history', 'values_history',
      'cyber_history', 'desire_history', 'gsti_history', 'fpi_history',
      'fsi_history', 'mpi_history', 'emti_history',
    ];
    let n = 0;
    for (const k of keys) {
      try {
        const raw = localStorage.getItem(k);
        if (raw) {
          const arr = JSON.parse(raw);
          if (Array.isArray(arr) && arr.length > 0) n++;
        }
      } catch {}
    }
    return n;
  }, []);

  // Find soulmates and rivals for this type
  const { soulmates, rivals } = useMemo(() => {
    const sm: { code: string; cn: string; say: string }[] = [];
    const rv: { code: string; cn: string; say: string }[] = [];

    Object.entries(config.compatibility).forEach(([key, entry]) => {
      const [a, b] = key.split('+');
      let otherCode: string | null = null;
      if (a === typeCode) otherCode = b;
      else if (b === typeCode) otherCode = a;
      if (!otherCode) return;

      const otherDef = config.typeLibrary[otherCode];
      if (!otherDef) return;

      const item = { code: otherCode, cn: otherDef.cn, say: entry.say };
      if (entry.type === 'soulmate') sm.push(item);
      else if (entry.type === 'rival') rv.push(item);
    });

    return { soulmates: sm, rivals: rv };
  }, [typeCode, config]);

  const hasCompat = soulmates.length > 0 || rivals.length > 0;

  const funNote = result.special
    ? '本测试仅供娱乐。隐藏人格和傻乐兜底都属于作者故意埋的损招，别太认真，也别太不认真。'
    : '本测试仅供娱乐，别拿它当诊断、面试、相亲的依据。如果你觉得准，那是巧合；如果不准，那也是巧合。';
  const shareHook = config.id === 'dogti'
    ? {
        title: `我是${typeDef.cn}`,
        desc: '把结果发给朋友，看看他们是哪种狗狗人格。',
        primary: '生成狗狗人格图',
        secondary: '拉朋友一起测',
      }
    : config.id === 'cati'
      ? {
          title: `我是${typeDef.cn}`,
          desc: '把结果发给朋友，看看他们是哪种猫猫人格。',
          primary: '生成猫猫人格图',
          secondary: '拉朋友一起测',
        }
      : {
          title: `我的结果是 ${typeCode}`,
          desc: '把结果发出去，让朋友也测一次，看看你们是不是同一种人。',
          primary: '生成分享图',
          secondary: '邀请好友对比',
        };
  const petCrossTest = config.id === 'dogti'
    ? {
        href: '/cati?src=result_pet_cross',
        emoji: '🐈',
        title: '再测你的猫猫人格',
        desc: '狗狗气质看完了，再看看你内心那只猫。',
      }
    : config.id === 'cati'
      ? {
          href: '/dogti?src=result_pet_cross',
          emoji: '🐕',
          title: '再测你的狗狗人格',
          desc: '猫猫气质看完了，再看看你外放时像哪只狗。',
        }
      : null;

  return (
    <div className="fixed inset-0 z-[200] bg-bg overflow-y-auto">
      {!revealed && (
        <RevealOverlay
          rarity={rarity}
          typeCn={typeDef.cn}
          typeCode={typeCode}
          onComplete={() => setRevealed(true)}
        />
      )}
      <div className="max-w-[680px] mx-auto px-4 py-8">
        <motion.div
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.1 }}
        >
          {/* Debug toolbar — only visible on test domains */}
          {isTestDomain && (
            <motion.div
              variants={staggerItem}
              transition={{ duration: 0.4 }}
              className="bg-surface-2 border border-border rounded-xl p-4 mb-6"
            >
              <p className="text-xs font-mono text-muted mb-3">
                DEBUG TOOLBAR (test domain only)
              </p>
              <div className="flex gap-2 flex-wrap mb-3">
                <button
                  onClick={onDebugReroll}
                  className="text-xs bg-surface border border-border px-3 py-1.5 rounded-lg hover:border-[#444] transition-colors cursor-pointer"
                >
                  {'🎲'} 换一个人格
                </button>
                <button
                  onClick={handleShareClick}
                  className="text-xs bg-surface border border-border px-3 py-1.5 rounded-lg hover:border-[#444] transition-colors cursor-pointer"
                >
                  {'🖼️'} 测试分享图
                </button>
                <button
                  onClick={handleInviteClick}
                  className="text-xs bg-surface border border-border px-3 py-1.5 rounded-lg hover:border-[#444] transition-colors cursor-pointer"
                >
                  {'📨'} 测试邀请图
                </button>
              </div>
              <div className="flex gap-2 items-center">
                <select
                  value={debugSelectedType}
                  onChange={(e) => setDebugSelectedType(e.target.value)}
                  className="text-xs bg-surface border border-border px-2 py-1.5 rounded-lg text-white cursor-pointer"
                >
                  <option value="">选择人格...</option>
                  {Object.entries(config.typeLibrary).map(([code, def]) => (
                    <option key={code} value={code}>
                      {code} — {def.cn}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => {
                    if (debugSelectedType && onDebugForceType) {
                      onDebugForceType(debugSelectedType);
                    }
                  }}
                  disabled={!debugSelectedType}
                  className="text-xs bg-accent/20 text-accent px-3 py-1.5 rounded-lg hover:bg-accent/30 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  生成该人格
                </button>
              </div>
            </motion.div>
          )}

          {/* FPI 专属贴纸（如果传入） — 与 GSTIHeroBadge 并列，但只渲染一个 */}
          {testBadge && !config.genderLocked && testBadge}

          {/* GSTI HeroBadge（现有代码，保持不变） */}
          {config.genderLocked && gender && (
            <GSTIHeroBadge
              gender={gender}
              typeCode={result.finalType.code}
              typeCn={result.finalType.cn}
            />
          )}

          {/* 1. Result top */}
          <motion.div
            variants={staggerItem}
            transition={{ duration: 0.4 }}
            className="flex gap-8 items-center mb-8 flex-col sm:flex-row"
          >
            {/* Poster */}
            <TypeCard typeCode={typeCode} size="lg" />

            {/* Info */}
            <div className="text-center sm:text-left">
              <p className="font-mono text-xs text-accent tracking-widest mb-2">
                {result.modeKicker}
              </p>
              <h1 className="font-mono text-5xl font-extrabold text-white tracking-tight">
                {typeCode}
              </h1>
              <p className="text-xl text-[#999] mt-1">{typeDef.cn}</p>
              <span className="inline-block mt-3 px-3.5 py-1.5 rounded-lg text-sm font-bold bg-accent/10 text-accent font-mono">
                {result.badge}
              </span>
            </div>
          </motion.div>

          {/* Rarity badge — live percentile from /api/ranking */}
          <motion.div
            variants={staggerItem}
            transition={{ duration: 0.4 }}
            className="flex justify-center sm:justify-start mb-6"
          >
            <RarityBadge rarity={rarity} />
          </motion.div>

          {/* Share hook */}
          <motion.div
            variants={staggerItem}
            transition={{ duration: 0.4 }}
            className="bg-accent/[0.08] border border-accent/25 rounded-2xl p-5 mb-5"
          >
            <p className="text-xs font-mono text-accent tracking-widest mb-2">
              SHARE THIS RESULT
            </p>
            <h3 className="text-xl font-extrabold text-white mb-2">
              {shareHook.title}
            </h3>
            <p className="text-sm text-muted leading-relaxed mb-4">
              {shareHook.desc}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleShareClick}
                className="bg-white text-black font-bold py-3 px-5 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
              >
                {shareHook.primary}
              </button>
              <button
                onClick={handleInviteClick}
                className="bg-surface text-white border border-border py-3 px-5 rounded-xl hover:border-accent/50 transition-colors cursor-pointer"
              >
                {shareHook.secondary}
              </button>
            </div>
          </motion.div>

          {/* 2. Description */}
          <motion.div
            variants={staggerItem}
            transition={{ duration: 0.4 }}
            className="bg-surface border border-border rounded-2xl p-7 mb-5"
          >
            <h3 className="flex items-center gap-2.5 text-base font-bold text-white mb-4">
              <span className="w-[3px] h-4 bg-accent rounded-sm" />
              该人格的简单解读
            </h3>
            <DescriptionBlock desc={typeDef.desc} />
          </motion.div>

          {/* 3. Dimensions */}
          <motion.div
            variants={staggerItem}
            transition={{ duration: 0.4 }}
            className="bg-surface border border-border rounded-2xl p-7 mb-5 relative overflow-hidden"
          >
            <h3 className="flex items-center gap-2.5 text-base font-bold text-white mb-4">
              <span className="w-[3px] h-4 bg-accent rounded-sm" />
              {config.dimSectionTitle}
            </h3>
            <DimList levels={result.levels} rawScores={result.rawScores} />

            {/* Paywall Overlay */}
            {!isPaid && (
              <div className="absolute inset-0 z-10 flex items-center justify-center p-6">
                <div className="absolute inset-0 bg-bg/40 backdrop-blur-md" />
                <div className="relative z-20 bg-surface border border-border rounded-2xl p-6 text-center max-w-[280px] shadow-2xl">
                  <div className="text-3xl mb-3">🔒</div>
                  <h4 className="text-lg font-bold text-white mb-2">解锁深度报告</h4>
                  <p className="text-xs text-muted mb-6 leading-relaxed">
                    维度详细解析 + 去广告 + 无水印高清分享图
                  </p>
                  <button
                    onClick={onStartPayment}
                    className="w-full bg-accent text-white font-bold py-2.5 rounded-xl text-sm mb-3 hover:bg-accent/90 transition-colors cursor-pointer"
                  >
                    ¥1.99 / $0.99 解锁
                  </button>
                  <button
                    onClick={onAlreadyPaid}
                    className="w-full bg-surface-2 text-muted py-2 rounded-xl text-xs hover:text-white transition-colors cursor-pointer"
                  >
                    我已支付
                  </button>
                </div>
              </div>
            )}
          </motion.div>

          {/* 4. Compatibility */}
          {hasCompat && (
            <motion.div
              variants={staggerItem}
              transition={{ duration: 0.4 }}
              className="bg-surface border border-border rounded-2xl p-7 mb-5"
            >
              <h3 className="flex items-center gap-2.5 text-base font-bold text-white mb-4">
                <span className="w-[3px] h-4 bg-accent rounded-sm" />
                你的相性关系
              </h3>

              {soulmates.map((s) => (
                <div
                  key={s.code}
                  className="bg-accent/[0.06] border border-accent/[0.15] rounded-xl p-3 mb-2.5"
                >
                  <span className="text-sm text-gray-300">
                    💕 {s.code}（{s.cn}）— {s.say}
                  </span>
                </div>
              ))}

              {rivals.map((r) => (
                <div
                  key={r.code}
                  className="bg-warm/[0.06] border border-warm/[0.15] rounded-xl p-3 mb-2.5"
                >
                  <span className="text-sm text-gray-300">
                    ⚔️ {r.code}（{r.cn}）— {r.say}
                  </span>
                </div>
              ))}
            </motion.div>
          )}

          {/* 5. Fun note */}
          <motion.div
            variants={staggerItem}
            transition={{ duration: 0.4 }}
            className="bg-surface border border-border rounded-2xl p-7 mb-5"
          >
            <p className="text-sm text-[#888] leading-relaxed">{funNote}</p>
          </motion.div>

          {/* 6. Author box */}
          <motion.div
            variants={staggerItem}
            transition={{ duration: 0.4 }}
            className="bg-surface border border-border rounded-2xl p-7 mb-5"
          >
            <details>
              <summary className="cursor-pointer text-sm font-semibold text-[#999] hover:text-white transition-colors">
                作者的话
              </summary>
              <div className="mt-4 text-sm text-[#888] leading-relaxed space-y-3">
                <p>
                  我们写这些测试的时候没有穿白大褂，也没有引用任何论文。这不是科学，这是一面哈哈镜——照出来的你可能变形了，但轮廓是真的。
                </p>
                <p>
                  如果你觉得"这说的就是我"，恭喜，你对自己的了解比你以为的多。如果你觉得完全不准，也恭喜——要么你段位太高我们够不着，要么你还没准备好面对那个版本的自己。
                </p>
                <p>
                  人格没有高低贵贱。那些让你觉得被冒犯的描述，恰恰是最值得想一想的部分。
                </p>
                <p>
                  最后，感谢你花几分钟认真回答这些奇怪的问题。在一个所有人都在刷短视频的时代，愿意停下来想想自己是谁的人，本身就很酷。
                </p>
              </div>
            </details>
          </motion.div>

          {/* 7. WeChat contact */}
          <motion.div
            variants={staggerItem}
            transition={{ duration: 0.4 }}
            className="bg-surface border border-border rounded-2xl p-7 mb-5 text-center"
          >
            <h3 className="flex items-center gap-2.5 text-base font-bold text-white mb-4 justify-center">
              <span className="w-[3px] h-4 bg-accent rounded-sm" />
              想聊聊？
            </h3>
            <p className="text-sm text-[#888] mb-4">
              扫码添加作者微信，交流测试心得或提出建议
            </p>
            <div className="flex justify-center">
              <img
                src="/images/wechat-qr.png"
                alt="微信二维码"
                className="w-[180px] h-[180px] rounded-xl"
              />
            </div>
          </motion.div>

          {/* 8. Other tests */}
          {petCrossTest && (
            <motion.div
              variants={staggerItem}
              transition={{ duration: 0.4 }}
              className="mb-5"
            >
              <a
                href={petCrossTest.href}
                className="flex items-center gap-4 bg-surface border border-accent/30 rounded-2xl p-5 hover:border-accent/60 transition-colors"
              >
                <span className="text-4xl leading-none">{petCrossTest.emoji}</span>
                <span className="min-w-0">
                  <span className="block text-base font-bold text-white">{petCrossTest.title}</span>
                  <span className="block text-sm text-muted mt-1">{petCrossTest.desc}</span>
                </span>
                <span className="ml-auto text-accent font-mono text-sm">GO</span>
              </a>
            </motion.div>
          )}

          {/* 8. Other tests */}
          <motion.div
            variants={staggerItem}
            transition={{ duration: 0.4 }}
            className="mb-5"
          >
            <OtherTests />
          </motion.div>

          {/* 7.5 Hook Matrix — invite compare + recommend tests + journey progress */}
          <motion.div variants={staggerItem} transition={{ duration: 0.4 }}>
            <HookMatrix
              testId={config.id}
              localHistoryCount={localHistoryCount}
              onInviteCompare={handleInviteClick}
            />
          </motion.div>

          {/* 7.6 Related articles — bridges test flow to article system */}
          <motion.div variants={staggerItem} transition={{ duration: 0.4 }}>
            <RelatedArticles testId={config.id} />
          </motion.div>

          {/* 8. Action buttons */}
          <motion.div
            variants={staggerItem}
            transition={{ duration: 0.4 }}
            className="flex gap-3 flex-wrap mt-7 justify-center"
          >
            <button
              onClick={handleShareClick}
              className="bg-white text-black font-bold py-3.5 px-7 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
            >
              生成分享图
            </button>
            <button
              onClick={handleInviteClick}
              className="bg-white text-black font-bold py-3.5 px-7 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
            >
              邀请好友对比
            </button>
            <button
              onClick={onRestart}
              className="bg-surface text-white border border-border py-3.5 px-7 rounded-xl hover:border-[#444] transition-colors cursor-pointer"
            >
              重新测试
            </button>
            <button
              onClick={onHome}
              className="bg-surface text-white border border-border py-3.5 px-7 rounded-xl hover:border-[#444] transition-colors cursor-pointer"
            >
              回到首页
            </button>
          </motion.div>

          {config.genderLocked && (
            <motion.div
              variants={staggerItem}
              transition={{ duration: 0.4 }}
              className="mt-8 px-5 py-4 bg-surface/40 border border-border/50 rounded-lg text-center"
            >
              <p className="text-xs text-muted leading-relaxed">
                这只是个反串梗，你的人格不由任何测试决定，也不由任何性别标签决定。
              </p>
            </motion.div>
          )}

          {/* FSI 专属页脚（如心理支持兜底） — 只渲染当上游传入且非 genderLocked 测试 */}
          {testFooter && !config.genderLocked && testFooter}

          {/* Bottom spacer */}
          <div className="h-12" />
        </motion.div>
      </div>
    </div>
  );
}
