import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import DimList from './DimList';
import OtherTests from './OtherTests';
import { useTestConfig } from '../data/testConfig';
import type { ComputeResultOutput } from '../utils/matching';

const isTestDomain = window.location.hostname.includes('sbticc-test');

interface ResultPageProps {
  result: ComputeResultOutput;
  onShare: () => void;
  onInviteCompare: () => void;
  onRestart: () => void;
  onHome: () => void;
  onDebugReroll?: () => void;
  onDebugForceType?: (code: string) => void;
}

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function ResultPage({
  result,
  onShare,
  onInviteCompare,
  onRestart,
  onHome,
  onDebugReroll,
  onDebugForceType,
}: ResultPageProps) {
  const config = useTestConfig();
  const [debugSelectedType, setDebugSelectedType] = useState('');
  const typeCode = result.finalType.code;
  const typeDef = config.typeLibrary[typeCode] ?? result.finalType;
  const imgSrc = config.typeImages[typeCode];

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

  return (
    <div className="fixed inset-0 z-[200] bg-bg overflow-y-auto">
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
                  onClick={onShare}
                  className="text-xs bg-surface border border-border px-3 py-1.5 rounded-lg hover:border-[#444] transition-colors cursor-pointer"
                >
                  {'🖼️'} 测试分享图
                </button>
                <button
                  onClick={onInviteCompare}
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

          {/* 1. Result top */}
          <motion.div
            variants={staggerItem}
            transition={{ duration: 0.4 }}
            className="flex gap-8 items-center mb-8 flex-col sm:flex-row"
          >
            {/* Poster */}
            <div className="w-[200px] h-[200px] bg-surface border border-border rounded-2xl overflow-hidden flex-shrink-0 flex items-center justify-center">
              {imgSrc ? (
                <img
                  src={imgSrc}
                  alt={typeCode}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="font-mono text-4xl font-bold text-muted">
                  {typeCode}
                </span>
              )}
            </div>

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
            <p className="text-sm text-[#aaa] leading-relaxed">
              {typeDef.desc}
            </p>
          </motion.div>

          {/* 3. Dimensions */}
          <motion.div
            variants={staggerItem}
            transition={{ duration: 0.4 }}
            className="bg-surface border border-border rounded-2xl p-7 mb-5"
          >
            <h3 className="flex items-center gap-2.5 text-base font-bold text-white mb-4">
              <span className="w-[3px] h-4 bg-accent rounded-sm" />
              {config.dimSectionTitle}
            </h3>
            <DimList levels={result.levels} rawScores={result.rawScores} />
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
          <motion.div
            variants={staggerItem}
            transition={{ duration: 0.4 }}
            className="mb-5"
          >
            <OtherTests />
          </motion.div>

          {/* 8. Action buttons */}
          <motion.div
            variants={staggerItem}
            transition={{ duration: 0.4 }}
            className="flex gap-3 flex-wrap mt-7 justify-center"
          >
            <button
              onClick={onShare}
              className="bg-white text-black font-bold py-3.5 px-7 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
            >
              生成分享图
            </button>
            <button
              onClick={onInviteCompare}
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

          {/* Bottom spacer */}
          <div className="h-12" />
        </motion.div>
      </div>
    </div>
  );
}
