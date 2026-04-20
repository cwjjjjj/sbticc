import { useMemo } from 'react';
import { motion } from 'framer-motion';
import RadarChart from './RadarChart';
import { useTestConfig } from '../data/testConfig';
import { levelNum } from '../utils/matching';

interface PersonData {
  code: string;
  levels: Record<string, string>;
  similarity: number;
}

interface ComparePageProps {
  myData: PersonData;
  theirData: PersonData;
  onStartTest: () => void;
  onShareCompare: () => void;
}

function computeCosineSimilarity(
  levelsA: Record<string, string>,
  levelsB: Record<string, string>,
  dimensionOrder: string[],
): number {
  const vecA = dimensionOrder.map(d => levelNum(levelsA[d]));
  const vecB = dimensionOrder.map(d => levelNum(levelsB[d]));

  let dotProduct = 0;
  let magA = 0;
  let magB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    magA += vecA[i] * vecA[i];
    magB += vecB[i] * vecB[i];
  }
  const denom = Math.sqrt(magA) * Math.sqrt(magB);
  if (denom === 0) return 0;
  return Math.round((dotProduct / denom) * 100);
}

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

function MbtiLetterCompare({ myCode, theirCode }: { myCode: string; theirCode: string }) {
  const myLetters = myCode.replace('-', '').split('');   // ['I','N','T','J','A']
  const theirLetters = theirCode.replace('-', '').split('');
  const labels = ['E/I', 'S/N', 'T/F', 'J/P', 'A/T'];
  return (
    <div className="grid grid-cols-5 gap-2">
      {labels.map((label, i) => {
        const same = myLetters[i] === theirLetters[i];
        return (
          <div key={i} className="bg-surface border border-border rounded-xl p-3 text-center">
            <p className="text-xs text-muted mb-1">{label}</p>
            <div className="flex flex-col gap-1">
              <span className={`font-mono font-extrabold text-xl ${same ? 'text-green-400' : 'text-white'}`}>
                {myLetters[i]}
              </span>
              <span className="text-xs text-muted">vs</span>
              <span className={`font-mono font-extrabold text-xl ${same ? 'text-green-400' : 'text-accent'}`}>
                {theirLetters[i]}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

const BADGE_STYLES: Record<string, string> = {
  soulmate: 'bg-accent/10 text-accent border-accent/20',
  rival: 'bg-warm/10 text-warm border-warm/20',
  mirror: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  normal: 'bg-surface-2 text-muted border-border',
};

const BADGE_LABELS: Record<string, string> = {
  soulmate: '灵魂伴侣',
  rival: '天生宿敌',
  mirror: '镜像人格',
  normal: '普通关系',
};

export default function ComparePage({
  myData,
  theirData,
  onStartTest,
  onShareCompare,
}: ComparePageProps) {
  const config = useTestConfig();
  const myType = config.typeLibrary[myData.code];
  const theirType = config.typeLibrary[theirData.code];

  const labelsArr = useMemo(
    () =>
      config.dimensionOrder.map(d => {
        const info = config.dimensionMeta[d];
        // Remove prefix like "S1 " to get short name
        return info ? info.name.replace(/^[A-Za-z]+\d+\s*/, '') : d;
      }),
    [config],
  );

  const dataA = useMemo(
    () => config.dimensionOrder.map(d => levelNum(myData.levels[d])),
    [myData.levels, config],
  );

  const dataB = useMemo(
    () => config.dimensionOrder.map(d => levelNum(theirData.levels[d])),
    [theirData.levels, config],
  );

  const similarity = useMemo(
    () => computeCosineSimilarity(myData.levels, theirData.levels, config.dimensionOrder),
    [myData.levels, theirData.levels, config],
  );

  const compat = useMemo(
    () => config.getCompatibility(myData.code, theirData.code),
    [myData.code, theirData.code, config],
  );

  const badgeStyle = BADGE_STYLES[compat.type] || BADGE_STYLES.normal;
  const badgeLabel = BADGE_LABELS[compat.type] || '普通关系';

  return (
    <div className="fixed inset-0 z-[200] bg-bg overflow-y-auto">
      <div className="max-w-[720px] mx-auto px-4 py-8">
        <motion.div
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.1 }}
        >
          {/* Title */}
          <motion.h2
            variants={fadeIn}
            transition={{ duration: 0.4 }}
            className="text-center font-extrabold text-xl text-white mb-5"
          >
            人格对比
          </motion.h2>

          {/* Container card */}
          <motion.div
            variants={fadeIn}
            transition={{ duration: 0.4 }}
            className="bg-surface border border-border rounded-2xl p-6"
          >
            {/* VS layout */}
            <div className="flex justify-center items-center gap-10 max-sm:gap-5 mb-6">
              {/* Person A */}
              <div className="text-center">
                <div className="w-[100px] h-[100px] bg-surface-2 border-2 border-border rounded-2xl overflow-hidden mx-auto">
                  {config.typeImages[myData.code] ? (
                    <img
                      src={config.typeImages[myData.code]}
                      alt={myData.code}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-mono text-lg font-bold text-muted">
                      {myData.code}
                    </div>
                  )}
                </div>
                <p className="font-mono text-xl font-extrabold text-white mt-3">
                  {myData.code}
                </p>
                <p className="text-sm text-muted mt-1">
                  {myType?.cn || ''}
                </p>
              </div>

              {/* VS */}
              <span className="font-mono text-2xl font-extrabold text-accent">
                VS
              </span>

              {/* Person B */}
              <div className="text-center">
                <div className="w-[100px] h-[100px] bg-surface-2 border-2 border-border rounded-2xl overflow-hidden mx-auto">
                  {config.typeImages[theirData.code] ? (
                    <img
                      src={config.typeImages[theirData.code]}
                      alt={theirData.code}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-mono text-lg font-bold text-muted">
                      {theirData.code}
                    </div>
                  )}
                </div>
                <p className="font-mono text-xl font-extrabold text-white mt-3">
                  {theirData.code}
                </p>
                <p className="text-sm text-muted mt-1">
                  {theirType?.cn || ''}
                </p>
              </div>
            </div>

            {/* Radar chart / MBTI letter compare */}
            <div className="flex justify-center my-4">
              {config.id === 'mbti' ? (
                <MbtiLetterCompare myCode={myData.code} theirCode={theirData.code} />
              ) : (
                <RadarChart labelsArr={labelsArr} dataA={dataA} dataB={dataB} />
              )}
            </div>

            {/* Similarity */}
            <div className="text-center mt-8">
              <p className="text-sm text-muted">两人相似度</p>
              <p className="font-mono text-6xl font-extrabold text-white mt-1">
                {similarity}%
              </p>
            </div>

            {/* Compatibility */}
            <div className="mt-6">
              <div
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-bold mx-auto ${badgeStyle}`}
                style={{ display: 'flex', justifyContent: 'center' }}
              >
                <span>{badgeLabel}</span>
              </div>
              <p className="text-sm text-[#999] text-center mt-4">
                {compat.say}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-center mt-6 flex-wrap">
              <button
                onClick={onShareCompare}
                className="bg-white text-black font-bold py-3 px-6 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
              >
                生成对比分享图
              </button>
              <button
                onClick={onStartTest}
                className="bg-surface-2 text-white border border-border py-3 px-6 rounded-xl hover:border-[#444] transition-colors cursor-pointer"
              >
                我也要测
              </button>
            </div>
          </motion.div>

          {/* Bottom spacer */}
          <div className="h-12" />
        </motion.div>
      </div>
    </div>
  );
}
