import { useI18n } from "../i18n";

const COPY = {
  en: {
    kicker: "HorizonX Vision · Emerging Horizon",
    title: "From digital business to autonomous business.",
    lead: "We build the systems, intelligence and AI workforce businesses need today — while preparing the infrastructure for a future where intelligent software and physical systems work together.",
    now: "NOW", nowTitle: "Digital Intelligence", nowBody: "Connected platforms, business data, XBrain, automation and AI agents.",
    next: "NEXT", nextTitle: "Autonomous Operations", nextBody: "Multi-agent workflows, AI workforce management and increasingly autonomous execution.",
    future: "FUTURE", futureTitle: "Physical AI", futureBody: "Robotics, smart machines and physical automation — integrated only where they create measurable business value.",
    note: "Physical AI is a future development direction for HorizonX. We are building the intelligence and integration layer first — not presenting robotics as a current off-the-shelf service."
  },
  ar: {
    kicker: "رؤية HorizonX · الأفق القادم",
    title: "من الأعمال الرقمية إلى الأعمال ذاتية التشغيل.",
    lead: "نبني اليوم الأنظمة والذكاء وفرق العمل المدعومة بالذكاء الاصطناعي، ونهيئ البنية التحتية لمستقبل تعمل فيه البرمجيات الذكية والأنظمة المادية معًا.",
    now: "الآن", nowTitle: "الذكاء الرقمي", nowBody: "منصات مترابطة، بيانات الأعمال، XBrain، الأتمتة ووكلاء الذكاء الاصطناعي.",
    next: "التالي", nextTitle: "العمليات ذاتية التشغيل", nextBody: "سير عمل متعدد الوكلاء، إدارة قوة عمل رقمية وتنفيذ أكثر استقلالية.",
    future: "المستقبل", futureTitle: "الذكاء الاصطناعي المادي", futureBody: "روبوتات، آلات ذكية وأتمتة مادية — فقط عندما تحقق قيمة تجارية قابلة للقياس.",
    note: "الذكاء الاصطناعي المادي اتجاه تطوير مستقبلي لـ HorizonX. نبني أولًا طبقة الذكاء والتكامل، ولا نعرض الروبوتات حاليًا كخدمة جاهزة."
  }
} as const;

export function FutureVision() {
  const { locale } = useI18n();
  const c = locale === "ar" ? COPY.ar : COPY.en;
  const stages = [
    [c.now, c.nowTitle, c.nowBody],
    [c.next, c.nextTitle, c.nextBody],
    [c.future, c.futureTitle, c.futureBody],
  ];

  return (
    <section className="future-vision" id="vision" aria-labelledby="future-vision-title">
      <div className="hx-container future-vision__inner">
        <p className="hx-kicker">{c.kicker}</p>
        <h2 id="future-vision-title" className="future-vision__title">{c.title}</h2>
        <p className="future-vision__lead">{c.lead}</p>

        <div className="future-vision__stages">
          {stages.map(([label, title, body], i) => (
            <article className="future-vision__stage" key={label}>
              <span className="future-vision__num">0{i + 1}</span>
              <span className="future-vision__label">{label}</span>
              <h3>{title}</h3>
              <p>{body}</p>
            </article>
          ))}
        </div>

        <div className="future-vision__stack" aria-label="HorizonX autonomy stack">
          <span>BUSINESS DATA</span><b>→</b><span>XBRAIN</span><b>→</b><span>AI WORKFORCE</span><b>→</b><span>PHYSICAL AI</span>
        </div>
        <p className="future-vision__note">{c.note}</p>
      </div>
    </section>
  );
}
