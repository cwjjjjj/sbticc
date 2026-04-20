import { motion } from 'framer-motion';

/**
 * 结果页底部深色兜底模块（spec §9.2）。
 * 每个 FSI 结果页都必须渲染这块——它不是可选配置。
 *
 * 视觉：深色背景 + 温和图标 + 不过大（避免像"精神病警告"）。
 * 文案一字不改，是 spec 明文要求。
 */
export default function FSIResultSupportBlock() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="mt-8 rounded-xl border border-border/60 bg-[#1a1a1a] p-5 text-left"
      aria-label="心理支持入口"
    >
      <p className="text-sm text-white font-semibold mb-3 flex items-center gap-2">
        <span aria-hidden>·</span>
        这只是一次测试，不是诊断。
      </p>
      <p className="text-xs text-muted leading-relaxed mb-4">
        如果你最近感到持续低落、无法自理或有自伤念头，请务必联系专业帮助：
      </p>
      <ul className="text-xs text-muted leading-relaxed space-y-2 mb-4">
        <li>
          <span className="text-white font-medium">北京心理危机研究与干预中心</span>
          ：
          <a href="tel:01082951332" className="text-amber-300 underline underline-offset-2 hover:text-amber-200">
            010-82951332
          </a>
        </li>
        <li>
          <span className="text-white font-medium">全国心理援助热线</span>
          ：
          <a href="tel:4001619995" className="text-amber-300 underline underline-offset-2 hover:text-amber-200">
            400-161-9995
          </a>
        </li>
        <li>
          <span className="text-white font-medium">简单心理 / 壹心理</span>
          ：可预约在线咨询
        </li>
      </ul>
      <p className="text-xs text-muted leading-relaxed italic">
        你值得一个真实的支持系统——不只是一个测试结果。
      </p>
    </motion.section>
  );
}
