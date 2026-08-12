(() => {
  const slide = (title, html, note) => ({ title, html, note });

  const zhSlides = [
    slide('从 AI 工具使用者到 AI 智能体创设者', `
      <div class="cover-logos">
        <img class="cocorobo-logo" src="./assets/cocorobo-white.svg" alt="CocoRobo">
        <div class="event-lockup" aria-label="为 UNESCO 2026 数字学习周准备">
          <span>为此活动准备</span><strong>UNESCO</strong><small>2026 数字学习周</small>
        </div>
      </div>
      <div class="cover-copy">
        <p class="kicker">教师 AI 能力 · 边界学习</p>
        <h1>从 AI 工具使用者<br>到 <em>AI 智能体创设者</em></h1>
        <p class="lead">教师如何创设并治理教学 AI 智能体，同时在 AI 介导的课堂中始终掌握教学决策权。</p>
        <a class="cover-url" href="https://cocorobo.hk/unesco2026/teacher/" target="_blank" rel="noopener">cocorobo.hk/unesco2026/teacher/ ↗</a>
      </div>
      <div class="cover-meta"><span>辛海洋 · CocoRobo 有限公司</span><span>深圳 · 2026</span></div>`,
      '以一个问题开场：当 AI 开始在课堂中行动、评价、引导和生成时，谁继续对教学负责？这是一项由 CocoRobo 主导的研究—实践项目，本次汇报旨在交流讨论；活动标识不代表 UNESCO 对本项目的认可或背书。[来源] 辅助页面“概览”；PDF 第 1–3 页。'),

    slide('问题已不再是教师是否使用 AI', `
      <div>
        <p class="kicker navy">核心问题</p>
        <h2>问题已不再是教师是否<em>使用</em> AI。</h2>
      </div>
      <div class="question-panel">
        <span>当 AI 能够行动、评价、引导和生成时——</span>
        <p>教师如何继续掌握教学决策权？</p>
      </div>`,
      '核心挑战并不是能否接触 AI，而是教学主导权：教师需要决定 AI 如何参与学习。[来源] PDF 第 1 页；辅助页面开篇部分。'),

    slide('成熟的教师 AI 能力，意味着治理 AI 如何参与', `
      <p class="kicker">我们的回答</p>
      <h2>成熟的教师 AI 能力，并不意味着更频繁地使用 AI。</h2>
      <p class="answer-line">它意味着能够配置：<strong>AI 何时介入</strong>、<strong>何时应受约束</strong>、<strong>何时收回控制权</strong>，以及<strong>何时应保持缺席</strong>。</p>
      <div class="boundary-spectrum" aria-label="四类边界决策">
        <span>介入</span><i></i><span>约束</span><i></i><span>收回</span><i></i><span>缺席</span>
      </div>`,
      '我们将这种能力称为边界学习。它把教师专业发展从工具操作，转向负责任地配置 AI 如何参与学习。边界学习目前仍是进行中的综合框架，并非经过充分验证的因果理论。[来源] PDF 第 27–29 页；辅助页面“边界学习框架”。'),

    slide('一个项目，两类不同的证据', `
      <p class="kicker navy">事实 · 如实呈现分母</p>
      <h2>一个项目，两类不同的证据。</h2>
      <div class="fact-stage">
        <div class="big-fact reach"><strong>1,000+</strong><span>触达教师</span><small>覆盖深圳四个区及合作学校</small></div>
        <div class="fact-divider"><span>≠</span></div>
        <div class="big-fact evidence"><strong>3</strong><span>个研究群体</span><small>坪山区的系统性研究证据</small></div>
      </div>
      <div class="fact-strip"><b>12 个月</b><span>2025 年 4 月 → 2026 年 4 月</span><b>4 + 1</b><span>4 篇已录用会议论文 + 1 篇进行中的期刊论文</span></div>`,
      '不要把 1,000+ 当作研究样本量；它代表的是实施触达范围。系统性证据来自坪山区的三个研究群体；来源在此没有报告每个群体的精确样本量。[来源] PDF 第 2、4、8–9 页；辅助页面“项目速览”与“实施覆盖和研究证据”。'),

    slide('坪山让实施能力差距清晰可见', `
      <p class="kicker">桥接型场域</p>
      <h2>坪山让实施能力差距清晰可见。</h2>
      <div class="bridge-statement">
        <span>城市层面强劲的 AI 推进动能</span><b>+</b><span>区级实施能力不均衡</span><b>=</b><span>教师能动性必须主动建设，不能被预设</span>
      </div>
      <p class="caption">坪山区教师专业学习活动</p>`,
      '本项目将坪山视为深圳内部的桥接型场域：强劲的城市级 AI 推进动能，与不均衡的区级实施能力在此相遇。这是项目对情境的界定；来源并未提供各区之间的比较统计数据。[来源] PDF 第 5–7 页；辅助页面公开项目照片。'),

    slide('每个群体都推动了下一轮改变', `
      <p class="kicker navy">持续推进的项目</p>
      <h2>每个群体都推动了下一轮改变。</h2>
      <div class="timeline">
        <article><time>2025 年 4 月</time><span>01</span><h3>基础</h3><p>工具素养、提示词与首批教学 AI 智能体</p></article>
        <div class="timeline-arrow">→</div>
        <article><time>2025 年 9 月</time><span>02</span><h3>扩展</h3><p>学科共同体、多智能体工作流与种子教师</p></article>
        <div class="timeline-arrow">→</div>
        <article><time>2026 年 4 月</time><span>03</span><h3>系统化</h3><p>设计痕迹、持续投入与边界学习</p></article>
      </div>
      <p class="timeline-footer">培训 → 创设 → 研究 → 再设计</p>`,
      '这是一个持续 12 个月、包含三个群体的项目，并非三年项目。每一轮都为下一轮的平台设计、教师培训和研究问题提供依据。[来源] PDF 第 4–5 页。证据校正：PDF 第 21 页写有“三年项目”，但这与带有明确日期的 12 个月时间线冲突；本幻灯片采用有日期支撑的时间线。'),

    slide('变革的基本单元是一套学习基础设施', `
      <p class="kicker">不是一次性工作坊</p>
      <h2>变革的基本单元，是一套学习基础设施。</h2>
      <div class="rings" aria-label="相互嵌套的实施层级">
        <div class="ring ring-1"><span>区级</span></div>
        <div class="ring ring-2"><span>学校</span></div>
        <div class="ring ring-3"><span>学科共同体</span></div>
        <div class="ring ring-4"><strong>课堂</strong><small>教师创设的智能体</small></div>
      </div>
      <p class="ring-note">政策对齐 · 种子教师 · 学科研讨 · 课堂案例</p>`,
      '区级工作坊、校本种子教师项目、学科共同体和课堂实践相互嵌套。教师反复经历学习、创设、测试、展示和再设计。[来源] PDF 第 14–18 页；辅助页面“多层级实施”和“迭代设计”。'),

    slide('边界学习体现在日常课堂决策中', `
      <p class="kicker navy">实践中的边界</p>
      <h2>边界学习体现在日常课堂决策中。</h2>
      <div class="case-grid">
        <article><div class="case-photo biology"></div><span>生物探究</span><h3>为探索搭建支架</h3><p>AI 支持诊断与设计优化——但不直接给出最终答案。</p><small>人的边界：探究与判断</small></article>
        <article><div class="case-photo english"></div><span>英语口语测评</span><h3>扩展评价能力</h3><p>多智能体工作流支持练习与反馈，评价标准仍由教师掌握。</p><small>人的边界：标准与最终判断</small></article>
        <article><div class="case-photo it"></div><span>信息技术</span><h3>守护思考</h3><p>教师设计学习支架，同时明确防范认知外包。</p><small>人的边界：学生的认知投入</small></article>
      </div>`,
      '这些是公开活动报道中的实施案例，不是因果评估。生物：福田荔园小学研讨活动。英语：坪山区人机协同育人研讨活动，参与者包括 300 多名教师和 AI 教育骨干。信息技术：宝安区教师培训。[来源] PDF 第 10–12 页；辅助页面课堂案例及其公开报道链接。'),

    slide('实施规模与系统性证据回答不同问题', `
      <p class="kicker">事实的硬度</p>
      <h2>实施规模与系统性证据，回答的是不同问题。</h2>
      <div class="evidence-columns">
        <article><span>实施覆盖</span><h3>这套做法能推广吗？</h3><ul><li>深圳四个区 + 合作学校</li><li>区级、校级与学科级实施形式</li><li>教师创设的课堂案例</li></ul></article>
        <article><span>研究证据</span><h3>我们能分析什么？</h3><ul><li>坪山区三个系统研究群体</li><li>平台日志、问卷与智能体作品</li><li>展示、访谈与主题分析</li></ul></article>
      </div>
      <p class="evidence-warning">两者中的任何一层，都不能单独证明学生学习成效提升。</p>`,
      '实施触达为可扩展性判断提供依据；研究材料则支持对教师学习与参与方式的分析。来源没有报告对照组、效应量或学生学习结果估计，因此本幻灯片不对学生成绩作任何因果主张。[来源] PDF 第 8–9、20–24 页。'),

    slide('五项研究构成递进的证据链', `
      <p class="kicker navy">研究纲领</p>
      <h2>五项研究构成递进的证据链。</h2>
      <div class="study-chain">
        <article><b>01</b><span>能否</span><p>教师能否创设有意义的教学 AI 智能体？</p><small>AERA · 已录用</small></article>
        <article><b>02</b><span>参与</span><p>培训后，教师实际上如何参与？</p><small>AERA · 已录用</small></article>
        <article><b>03</b><span>设计</span><p>AI-TPACK 在实践中体现在哪里？</p><small>ISLS · 已录用</small></article>
        <article><b>04</b><span>持续</span><p>创设为何持续——又为何停止？</p><small>ISLS · 已录用</small></article>
        <article class="ongoing"><b>05</b><span>治理</span><p>什么促成成熟的边界判断？</p><small>期刊论文 · 进行中</small></article>
      </div>`,
      '前四项研究均为已录用的会议论文。边界学习是另一篇进行中的期刊论文，并在此明确标注其发表状态。[来源] PDF 第 19–21、25–27 页；辅助页面“五项相互衔接的研究”与“研究成果”。'),

    slide('创设智能体，让隐性的教学判断显性化', `
      <div class="finding-number">01</div>
      <div>
        <p class="kicker">发现 · 在创设中学习</p>
        <h2>创设智能体，让隐性的教学判断显性化。</h2>
        <p class="lead">教师把隐性的教学判断转化为可运行的作品——再对它进行测试、修改，并为其设计作出论证。</p>
        <div class="making-loop"><span>设计</span><i>→</i><span>测试</span><i>→</i><span>诊断</span><i>→</i><span>重新配置</span></div>
      </div>`,
      '建构主义／ICAP／TPACK 研究提出，创设教学 AI 智能体可以成为一种“在创设中学习”的方式。由此带来的启示是：教师专业发展应围绕创设、测试和反思来组织，而不应只依赖讲授和提示词演示。[来源] PDF 第 20、22 页；PDF 第 25 页所列 AERA 2026 海报论文。'),

    slide('培训不会自动催生积极的创设者', `
      <div class="finding-number">02</div>
      <div>
        <p class="kicker dark-text">发现 · 参与生态</p>
        <h2>培训不会自动催生积极的创设者。</h2>
        <div class="participant-types">
          <span><b>积极创设者</b>创设并修改</span><span><b>浏览者</b>观察与探索</span><span><b>低参与者</b>很少参与</span>
        </div>
        <p class="bottom-claim">后续支持、同伴案例、时间和共同体都不可或缺。</p>
      </div>`,
      '平台互动呈现出不同的参与模式。不能把一次工作坊视为教师会持续创设的证据。[来源] PDF 第 20、22–23 页；PDF 第 25 页所列 AERA 2026 圆桌论文。'),

    slide('能力显于设计痕迹，持续则有赖系统支持', `
      <p class="kicker navy">发现 · 设计 + 可持续性</p>
      <h2>能力显于设计痕迹，持续则有赖系统支持。</h2>
      <div class="trace-grid">
        <div class="trace-left"><span>工作流配置</span><span>智能体架构</span><span>测试模式</span><span>设计修改</span><strong>可观察的 AI-TPACK</strong></div>
        <div class="trace-right"><strong>持续创设</strong><div><span>自主性</span><span>胜任感</span><span>关系感</span><span>学校支持</span></div><small>单靠能力建设还不够。</small></div>
      </div>`,
      'AI-TPACK 不仅可以通过自我报告来分析，也可以从智能体作品和工作流痕迹中观察。持续投入受到自主性、胜任感、关系感以及学校层面矛盾张力的共同影响。[来源] PDF 第 20–24 页；ISLS 预印本：arXiv:2605.13906 与 arXiv:2605.12934。'),

    slide('边界学习包含四种相互关联的能力', `
      <p class="kicker">前沿</p>
      <h2>边界学习包含四种相互关联的能力。</h2>
      <div class="capacity-map">
        <article><b>01</b><h3>识别任务边界</h3><p>哪些任务需要 AI——哪些需要思维挣扎、对话或人的判断？</p></article>
        <article><b>02</b><h3>诊断模型边界</h3><p>失败是由提示词、工作流、模型局限，还是任务不匹配造成？</p></article>
        <article><b>03</b><h3>界定教学责任</h3><p>哪些决策仍应保留给教师、学生或同伴？</p></article>
        <article><b>04</b><h3>结构化配置边界</h3><p>将判断转化为角色、约束、时机与非介入区。</p></article>
      </div>`,
      '该框架综合了四种能力：任务边界识别、模型边界诊断、教学责任界定和结构化配置。它是通过跨群体综合逐步形成的工作框架。[来源] PDF 第 27–29 页。'),

    slide('学习需要生产性摩擦', `
      <p class="kicker">设计伦理</p>
      <h2>学习需要生产性摩擦。</h2>
      <div class="friction-table">
        <div><span>AI 过早给出完整答案</span><strong>延迟反馈；要求学生先作答</strong></div>
        <div><span>AI 生成的讲稿取代学生声音</span><strong>先进行同伴评价，再使用 AI 修改</strong></div>
        <div><span>AI 生成的量规变得僵化</span><strong>由教师重新掌握标准与最终判断</strong></div>
        <div><span>AI 介入终止了讨论</span><strong>约束或关闭 AI，让对话重新发生</strong></div>
      </div>
      <p class="friction-tagline">目标不是无摩擦课堂，而是在恰当的位置保留恰当的摩擦。</p>`,
      '当教师延迟、约束、收回或移除 AI 的参与时，边界决策就变得具体。这保护了有助于学习的认知挑战，而不是一味追求顺滑自动化。[来源] PDF 第 29–30 页。'),

    slide('教师 AI 政策应从采用走向自主创设', `
      <p class="kicker navy">教育系统可以怎么做</p>
      <h2>教师 AI 政策应从采用走向自主创设。</h2>
      <ol class="actions-list">
        <li><b>围绕创设来设计专业学习。</b><span>教师亲自创设、测试、诊断和修改——而不只是观看演示。</span></li>
        <li><b>评价作品与设计痕迹。</b><span>除自我报告外，也考察工作流、智能体架构和修改历史。</span></li>
        <li><b>把支持嵌入学校。</b><span>保障时间、自主性、胜任感、同伴共同体和持续跟进。</span></li>
        <li><b>让“不使用”成为正当选择。</b><span>人的监督也包括延迟、约束或排除 AI 的权力。</span></li>
      </ol>
      <p class="alignment-note">与 UNESCO 以人为本的 AI 议程相一致；这是本项目的分析性映射，并非 UNESCO 认证。</p>`,
      '这些启示把本项目与 UNESCO《教师人工智能能力框架》（2024）、《生成式 AI 在教育与研究中的应用指南》（2023）、《人工智能伦理问题建议书》（2021）以及 2026 数字学习周主题联系起来。这种对齐是本项目所作的分析性映射，并不代表 UNESCO 的认可或背书。[来源] PDF 第 30–36 页；上述 UNESCO 官方文件与数字学习周 2026 官方页面。'),

    slide('证据支持什么，尚不支持什么', `
      <p class="kicker">证据边界</p>
      <h2>证据支持什么——尚不支持什么。</h2>
      <div class="record-grid">
        <article><h3>已有支持</h3><ul><li>为期 12 个月、包含三个群体的项目</li><li>实施触达 1,000+ 名教师</li><li>关于教师创设与参与的多源证据</li><li>4 篇已录用会议论文</li><li>香港大学 FREC 伦理审批 EAE26002</li></ul></article>
        <article><h3>尚未作出主张</h3><ul><li>将 1,000+ 视为研究样本量</li><li>学生学习成效的因果提升</li><li>在所有情境中普遍适用</li><li>将边界学习视为已获验证的成熟理论</li><li>UNESCO 对本项目的认可或背书</li></ul></article>
      </div>
      <p class="record-footer">进行中的综合：<em>重新分配教学控制权：教师创设教学智能体中的路径依赖性边界学习……</em></p>`,
      '可在问答环节用本页说明证据边界。研究数据均基于知情同意，并聚焦教师专业学习；分析与报告尽量减少可识别个人身份的信息。[来源] PDF 第 25–33 页；辅助页面“伦理”“我们不主张什么”与“研究成果”。'),

    slide('能动性，而非自动化', `
      <div class="closing-copy">
        <img class="closing-logo" src="./assets/cocorobo-white.svg" alt="CocoRobo">
        <p class="kicker">最后的检验</p>
        <h2>能动性，<br>而非自动化。</h2>
        <p class="closing-line">教师能否决定 AI 何时向前一步——以及何时退后一步？</p>
        <div class="contact"><b>辛海洋</b><span>创始人兼 CEO · CocoRobo 有限公司</span><a href="mailto:tony@cocorobo.cc">tony@cocorobo.cc</a></div>
      </div>
      <div class="qr-panel">
        <a href="https://cocorobo.hk/unesco2026/teacher/" target="_blank" rel="noopener" aria-label="打开辅助页面"><img src="./assets/supporting-page-qr.svg" alt="辅助页面二维码"></a>
        <b>完整证据、研究与框架</b><span>cocorobo.hk/unesco2026/teacher/</span>
      </div>`,
      '回到开场的问题。政策前沿并不是让 AI 使用最大化，而是提升教师作出负责任边界决策的能力。邀请听众扫描二维码，查看多语言辅助页面、完整研究成果和来源链接。[来源] PDF 第 36–38 页；辅助页面。')
  ];

  const frSlides = [
    slide('Des utilisateurs d’outils d’IA aux créateurs d’agents d’IA', `
      <div class="cover-logos">
        <img class="cocorobo-logo" src="./assets/cocorobo-white.svg" alt="CocoRobo">
        <div class="event-lockup" aria-label="Préparé pour la Semaine de l’apprentissage numérique 2026 de l’UNESCO">
          <span>PRÉPARÉ POUR</span><strong>UNESCO</strong><small>SEMAINE DE L’APPRENTISSAGE NUMÉRIQUE 2026</small>
        </div>
      </div>
      <div class="cover-copy">
        <p class="kicker">COMPÉTENCES EN IA DES ENSEIGNANTS · APPRENTISSAGE DES FRONTIÈRES</p>
        <h1>Des utilisateurs d’outils d’IA<br>aux <em>créateurs d’agents d’IA</em></h1>
        <p class="lead">Comment les enseignants peuvent créer et gouverner des agents pédagogiques d’IA tout en gardant la maîtrise des décisions dans les classes où l’IA intervient.</p>
        <a class="cover-url" href="https://cocorobo.hk/unesco2026/teacher/" target="_blank" rel="noopener">cocorobo.hk/unesco2026/teacher/ ↗</a>
      </div>
      <div class="cover-meta"><span>Haiyang Xin · CocoRobo Ltd.</span><span>Shenzhen · 2026</span></div>`,
      'Ouvrir par une question : lorsque l’IA commence à agir, évaluer, guider et générer dans la classe, qui reste responsable de la pédagogie ? Ce programme de recherche-pratique piloté par CocoRobo est présenté pour discussion ; la mention de l’événement n’implique aucune approbation de l’UNESCO. [Sources] Page d’accompagnement, section « Overview » ; PDF, p. 1–3.'),

    slide('La question n’est plus de savoir si les enseignants utilisent l’IA', `
      <div><p class="kicker navy">LA QUESTION</p><h2>La question n’est plus de savoir si les enseignants <em>utilisent</em> l’IA.</h2></div>
      <div class="question-panel"><span>Quand l’IA peut agir, évaluer, guider et générer—</span><p>comment les enseignants gardent-ils la maîtrise des décisions pédagogiques ?</p></div>`,
      'L’enjeu central n’est pas l’accès à l’IA, mais l’autorité pédagogique : les enseignants doivent décider de la manière dont l’IA participe à l’apprentissage. [Sources] PDF, p. 1 ; page d’accompagnement, section d’ouverture.'),

    slide('La maturité en IA consiste à gouverner sa participation', `
      <p class="kicker">NOTRE RÉPONSE</p>
      <h2>La maturité des compétences enseignantes en IA ne se mesure pas à la fréquence d’usage.</h2>
      <p class="answer-line">Elle consiste à configurer <strong>quand l’IA doit agir</strong>, <strong>quand elle doit être contrainte</strong>, <strong>quand il faut reprendre la main</strong> et <strong>quand elle doit rester absente</strong>.</p>
      <div class="boundary-spectrum" aria-label="Quatre décisions sur les frontières"><span>AGIR</span><i></i><span>CONTRAINDRE</span><i></i><span>REPRENDRE</span><i></i><span>ABSENTE</span></div>`,
      'Nous appelons cela l’apprentissage des frontières. Cette approche déplace le développement professionnel de la maîtrise des outils vers une configuration responsable de la participation de l’IA. L’apprentissage des frontières reste une synthèse en cours, et non une théorie causale pleinement validée. [Sources] PDF, p. 27–29 ; page d’accompagnement, cadre « Boundary Learning ».'),

    slide('Un programme, deux registres de données probantes', `
      <p class="kicker navy">FAITS · NE CONFONDONS PAS LES DÉNOMINATEURS</p>
      <h2>Un programme. Deux registres de données probantes.</h2>
      <div class="fact-stage">
        <div class="big-fact reach"><strong>1 000+</strong><span>enseignants concernés</span><small>Mise en œuvre dans quatre districts de Shenzhen et des écoles partenaires</small></div>
        <div class="fact-divider"><span>≠</span></div>
        <div class="big-fact evidence"><strong>3</strong><span>cohortes étudiées</span><small>Données de recherche systématiques issues du district de Pingshan</small></div>
      </div>
      <div class="fact-strip"><b>12 mois</b><span>avril 2025 → avril 2026</span><b>4 + 1</b><span>quatre communications acceptées + un manuscrit de revue en cours</span></div>`,
      'Ne présentez pas les 1 000+ enseignants comme la taille de l’échantillon de recherche : ce chiffre décrit la portée de la mise en œuvre. Les données systématiques proviennent de trois cohortes de Pingshan ; la source ne précise pas ici l’effectif de chaque cohorte. [Sources] PDF, p. 2, 4 et 8–9 ; page d’accompagnement, sections « At a glance » et « Evidence ».'),

    slide('Pingshan rend visibles des capacités inégales', `
      <p class="kicker">UN CONTEXTE CHARNIÈRE</p>
      <h2>Pingshan rend visible l’écart de mise en œuvre.</h2>
      <div class="bridge-statement"><span>Forte dynamique de l’IA à l’échelle de la ville</span><b>+</b><span>Capacités inégales à l’échelle du district</span><b>=</b><span>Le pouvoir d’agir enseignant se construit, il ne se présume pas</span></div>
      <p class="caption">Activité de développement professionnel des enseignants dans le district de Pingshan</p>`,
      'Le projet présente Pingshan comme un contexte charnière au sein de Shenzhen : une forte dynamique urbaine autour de l’IA y rencontre des capacités de mise en œuvre inégales à l’échelle du district. Il s’agit du cadrage contextuel du projet ; la source ne fournit pas de statistiques comparatives entre districts. [Sources] PDF, p. 5–7 ; photographie publique du projet sur la page d’accompagnement.'),

    slide('Chaque cohorte a transformé la suivante', `
      <p class="kicker navy">UN PROGRAMME INSCRIT DANS LA DURÉE</p>
      <h2>Chaque cohorte a transformé la suivante.</h2>
      <div class="timeline">
        <article><time>AVR. 2025</time><span>01</span><h3>Fondations</h3><p>Maîtrise des outils, prompts et premiers agents pédagogiques d’IA</p></article>
        <div class="timeline-arrow">→</div>
        <article><time>SEPT. 2025</time><span>02</span><h3>Extension</h3><p>Collectifs disciplinaires, workflows multi-agents et enseignants relais</p></article>
        <div class="timeline-arrow">→</div>
        <article><time>AVR. 2026</time><span>03</span><h3>Systématisation</h3><p>Traces de conception, engagement durable et apprentissage des frontières</p></article>
      </div>
      <p class="timeline-footer">FORMER → CRÉER → ÉTUDIER → REPENSER</p>`,
      'Il s’agissait d’un programme de 12 mois et de trois cohortes, non d’un programme de trois ans. Chaque cycle a nourri la conception de la plateforme, la formation des enseignants et les questions de recherche du cycle suivant. [Sources] PDF, p. 4–5. Correction de cohérence : la p. 21 évoque un « programme de trois ans », en contradiction avec la chronologie datée de 12 mois ; cette présentation retient la chronologie datée.'),

    slide('L’unité de changement était une infrastructure d’apprentissage', `
      <p class="kicker">PAS UN ATELIER PONCTUEL</p>
      <h2>Le changement s’est construit à l’échelle d’une infrastructure d’apprentissage.</h2>
      <div class="rings" aria-label="Niveaux de mise en œuvre imbriqués">
        <div class="ring ring-1"><span>DISTRICT</span></div><div class="ring ring-2"><span>ÉCOLE</span></div><div class="ring ring-3"><span>COLLECTIF DISCIPLINAIRE</span></div><div class="ring ring-4"><strong>CLASSE</strong><small>agents créés par les enseignants</small></div>
      </div>
      <p class="ring-note">Alignement des politiques · enseignants relais · séminaires disciplinaires · cas de classe</p>`,
      'Les ateliers de district, les programmes d’enseignants relais dans les écoles, les collectifs disciplinaires et les pratiques de classe étaient imbriqués. Les enseignants ont parcouru à plusieurs reprises des cycles d’apprentissage, de création, de test, de présentation et de reconception. [Sources] PDF, p. 14–18 ; page d’accompagnement, sections « Multi-level implementation » et « Iterative design ».'),

    slide('L’apprentissage des frontières dans les décisions de classe', `
      <p class="kicker navy">LES FRONTIÈRES EN PRATIQUE</p>
      <h2>L’apprentissage des frontières s’est manifesté dans des décisions ordinaires de classe.</h2>
      <div class="case-grid">
        <article><div class="case-photo biology"></div><span>INVESTIGATION EN BIOLOGIE</span><h3>Étayer l’exploration</h3><p>L’IA a soutenu le diagnostic et l’amélioration du dispositif, sans fournir la réponse finale.</p><small>Frontière humaine : investigation et jugement</small></article>
        <article><div class="case-photo english"></div><span>ÉVALUATION DE L’ORAL</span><h3>Accroître l’accompagnement</h3><p>Des workflows multi-agents ont soutenu l’entraînement et le retour, tandis que les enseignants gardaient la maîtrise des critères.</p><small>Frontière humaine : critères et jugement final</small></article>
        <article><div class="case-photo it"></div><span>INFORMATIQUE</span><h3>Préserver la réflexion</h3><p>Les enseignants ont conçu des étayages en veillant explicitement à ne pas déléguer la pensée à l’IA.</p><small>Frontière humaine : travail cognitif de l’élève</small></article>
      </div>`,
      'Ces exemples de mise en œuvre proviennent de comptes rendus publics d’activités ; ce ne sont pas des évaluations causales. Biologie : séminaire de la Futian Liyuan Primary School. Anglais : séminaire de Pingshan sur la coéducation humain-IA, avec plus de 300 enseignants et responsables de l’éducation à l’IA. Informatique : formation d’enseignants à Bao’an. [Sources] PDF, p. 10–12 ; cas de classe et comptes rendus publics liés depuis la page d’accompagnement.'),

    slide('Portée et données probantes répondent à des questions différentes', `
      <p class="kicker">LA RIGUEUR DES FAITS</p>
      <h2>La portée et les données systématiques répondent à des questions différentes.</h2>
      <div class="evidence-columns">
        <article><span>PORTÉE DE LA MISE EN ŒUVRE</span><h3>Cette approche peut-elle se diffuser ?</h3><ul><li>Quatre districts de Shenzhen et des écoles partenaires</li><li>Formats à l’échelle du district, de l’école et des disciplines</li><li>Cas de classe créés par les enseignants</li></ul></article>
        <article><span>DONNÉES DE RECHERCHE</span><h3>Que pouvons-nous analyser ?</h3><ul><li>Trois cohortes de Pingshan étudiées systématiquement</li><li>Journaux de plateforme, enquêtes et artefacts d’agents</li><li>Présentations, entretiens et analyse thématique</li></ul></article>
      </div>
      <p class="evidence-warning">Pris séparément, aucun de ces deux niveaux ne démontre des gains d’apprentissage chez les élèves.</p>`,
      'La portée de la mise en œuvre étaye une possibilité de diffusion ; les matériaux de recherche permettent d’analyser l’apprentissage et la participation des enseignants. La source ne présente ni groupe témoin, ni taille d’effet, ni estimation des résultats des élèves. Cette présentation n’avance donc aucune conclusion causale sur la réussite des élèves. [Sources] PDF, p. 8–9 et 20–24.'),

    slide('Cinq études forment une chaîne progressive de données probantes', `
      <p class="kicker navy">LE PROGRAMME DE RECHERCHE</p>
      <h2>Cinq études forment une chaîne progressive de données probantes.</h2>
      <div class="study-chain">
        <article><b>01</b><span>CRÉER</span><p>Les enseignants peuvent-ils créer des agents pédagogiques d’IA pertinents ?</p><small>AERA · accepté</small></article>
        <article><b>02</b><span>PARTICIPER</span><p>Comment s’engagent-ils réellement après la formation ?</p><small>AERA · accepté</small></article>
        <article><b>03</b><span>CONCEVOIR</span><p>Où l’AI-TPACK devient-il visible dans la pratique ?</p><small>ISLS · accepté</small></article>
        <article><b>04</b><span>DURER</span><p>Pourquoi la création se poursuit-elle — ou s’arrête-t-elle ?</p><small>ISLS · accepté</small></article>
        <article class="ongoing"><b>05</b><span>GOUVERNER</span><p>Qu’est-ce qui permet de poser des frontières avec discernement ?</p><small>Revue · en cours</small></article>
      </div>`,
      'Les quatre premières études correspondent à des communications acceptées dans des conférences. L’apprentissage des frontières fait l’objet d’un manuscrit distinct pour revue, toujours en cours, et est volontairement présenté comme tel. [Sources] PDF, p. 19–21 et 25–27 ; page d’accompagnement, sections « Five Connected Studies » et « Research Outputs ».'),

    slide('Créer des agents explicite la pédagogie tacite', `
      <div class="finding-number">01</div><div>
        <p class="kicker">RÉSULTAT · APPRENDRE EN CRÉANT</p><h2>Créer des agents rend explicite la pédagogie tacite.</h2>
        <p class="lead">Les enseignants transforment un jugement pédagogique implicite en artefact exécutable, puis le testent, le révisent et le défendent.</p>
        <div class="making-loop"><span>CONCEVOIR</span><i>→</i><span>TESTER</span><i>→</i><span>DIAGNOSTIQUER</span><i>→</i><span>RECONFIGURER</span></div>
      </div>`,
      'L’étude articulant constructionnisme, ICAP et TPACK soutient que la création d’agents pédagogiques d’IA peut constituer un apprentissage par la création. Elle invite à organiser le développement professionnel autour de la création, du test et de la réflexion, et non autour des seuls cours et démonstrations de prompts. [Sources] PDF, p. 20 et 22 ; référence au poster AERA 2026, PDF p. 25.'),

    slide('La formation ne garantit pas des créateurs actifs', `
      <div class="finding-number">02</div><div>
        <p class="kicker dark-text">RÉSULTAT · ÉCOLOGIE DE LA PARTICIPATION</p><h2>Une formation ne produit pas automatiquement des créateurs actifs.</h2>
        <div class="participant-types"><span><b>CRÉATEURS ACTIFS</b>créent et révisent</span><span><b>EXPLORATEURS</b>observent et explorent</span><span><b>FAIBLE ENGAGEMENT</b>participent rarement</span></div>
        <p class="bottom-claim">Le suivi, les exemples de pairs, le temps et la communauté comptent.</p>
      </div>`,
      'Les interactions sur la plateforme se regroupaient en profils de participation distincts. Un atelier ponctuel ne peut pas être considéré comme la preuve d’une création durable. [Sources] PDF, p. 20 et 22–23 ; référence à la table ronde AERA 2026, PDF p. 25.'),

    slide('La compétence se lit dans les traces de conception', `
      <p class="kicker navy">RÉSULTATS · CONCEPTION + PÉRENNITÉ</p>
      <h2>La compétence se lit dans les traces de conception — et ne devient durable qu’avec un soutien du système.</h2>
      <div class="trace-grid">
        <div class="trace-left"><span>CONFIGURATION DES FLUX DE TRAVAIL</span><span>ARCHITECTURE DES AGENTS</span><span>MODES DE TEST</span><span>RÉVISIONS DE CONCEPTION</span><strong>AI-TPACK OBSERVABLE</strong></div>
        <div class="trace-right"><strong>CRÉATION DURABLE</strong><div><span>AUTONOMIE</span><span>COMPÉTENCE</span><span>APPARTENANCE</span><span>SOUTIEN DE L’ÉCOLE</span></div><small>Le seul renforcement des capacités ne suffit pas.</small></div>
      </div>`,
      'L’AI-TPACK peut être analysé à travers les artefacts et les traces des flux de travail, et pas seulement par autoévaluation. L’engagement durable est influencé par l’autonomie, la compétence, le sentiment d’appartenance et les contradictions au niveau de l’établissement. [Sources] PDF, p. 20–24 ; prépublications ISLS : arXiv:2605.13906 et arXiv:2605.12934.'),

    slide('L’apprentissage des frontières relie quatre capacités', `
      <p class="kicker">LA FRONTIÈRE</p><h2>L’apprentissage des frontières relie quatre capacités.</h2>
      <div class="capacity-map">
        <article><b>01</b><h3>Reconnaître la frontière de la tâche</h3><p>Quelles tâches appellent l’IA — et lesquelles exigent effort, dialogue ou jugement humain ?</p></article>
        <article><b>02</b><h3>Diagnostiquer la frontière du modèle</h3><p>L’échec vient-il du prompt, du flux de travail, des limites du modèle ou d’une inadéquation à la tâche ?</p></article>
        <article><b>03</b><h3>Délimiter les responsabilités</h3><p>Quelles décisions restent aux enseignants, aux élèves ou aux pairs ?</p></article>
        <article><b>04</b><h3>Configurer la frontière</h3><p>Traduire le jugement en rôles, contraintes, temporalité et zones de non-intervention.</p></article>
      </div>`,
      'Le cadre articule quatre capacités : reconnaître la frontière de la tâche, diagnostiquer celle du modèle, délimiter les responsabilités pédagogiques et configurer la participation de manière structurée. Il s’agit d’un cadre de travail issu d’une synthèse entre cohortes. [Sources] PDF, p. 27–29.'),

    slide('Apprendre exige des frictions productives', `
      <p class="kicker">ÉTHIQUE DE CONCEPTION</p><h2>Apprendre exige des frictions productives.</h2>
      <div class="friction-table">
        <div><span>L’IA donne trop tôt des réponses complètes</span><strong>Différer le retour ; exiger d’abord une tentative</strong></div>
        <div><span>Les scripts générés par l’IA remplacent la voix de l’élève</span><strong>Exiger une critique par les pairs avant toute révision avec l’IA</strong></div>
        <div><span>Le barème de l’IA devient rigide</span><strong>Rendre aux enseignants la maîtrise des critères et du jugement final</strong></div>
        <div><span>L’intervention de l’IA met fin à la discussion</span><strong>Contraindre ou désactiver l’IA pour relancer le dialogue</strong></div>
      </div><p class="friction-tagline">L’objectif n’est pas une classe sans friction, mais la bonne friction, au bon endroit.</p>`,
      'Les décisions de frontière deviennent concrètes lorsque les enseignants retardent, contraignent, reprennent ou retirent la participation de l’IA. Elles protègent un défi cognitif productif au lieu d’optimiser une automatisation sans heurts. [Sources] PDF, p. 29–30.'),

    slide('Passer de l’adoption à la conception par les enseignants', `
      <p class="kicker navy">CE QUE LES SYSTÈMES ÉDUCATIFS PEUVENT FAIRE</p><h2>Faire évoluer les politiques : de l’adoption à la conception par les enseignants.</h2>
      <ol class="actions-list">
        <li><b>Centrer le développement professionnel sur la création.</b><span>Les enseignants créent, testent, diagnostiquent et révisent — ils ne se contentent pas de regarder des démonstrations.</span></li>
        <li><b>Évaluer les artefacts et les traces.</b><span>Examiner les flux de travail, les architectures d’agents et les historiques de révision, en complément des autoévaluations.</span></li>
        <li><b>Ancrer le soutien dans les établissements.</b><span>Préserver le temps, l’autonomie, la compétence, la communauté de pairs et le suivi.</span></li>
        <li><b>Faire du non-usage une décision légitime.</b><span>La supervision humaine comprend le pouvoir de retarder, contraindre ou exclure l’IA.</span></li>
      </ol>
      <p class="alignment-note">Mis en regard de l’approche de l’UNESCO centrée sur l’humain ; rapprochement analytique du projet, non certification de l’UNESCO.</p>`,
      'Ces implications mettent le programme en regard du Référentiel de compétences en IA pour les enseignants, des Orientations pour l’intelligence artificielle générative dans l’éducation et la recherche de 2023, de la Recommandation sur l’éthique de l’intelligence artificielle de 2021 et du thème de la Semaine de l’apprentissage numérique 2026. Ce rapprochement est notre analyse, non une approbation. [Sources] PDF, p. 30–36 ; documents officiels de l’UNESCO cités ci-dessus.'),

    slide('Ce que les données étayent et ce qu’elles n’étayent pas', `
      <p class="kicker">ÉTAT DES DONNÉES PROBANTES</p><h2>Ce que les données permettent d’affirmer — et ce qu’elles ne permettent pas.</h2>
      <div class="record-grid">
        <article><h3>ÉTAYÉ</h3><ul><li>Programme de 12 mois et trois cohortes</li><li>Plus de 1 000 enseignants concernés par la mise en œuvre</li><li>Sources multiples sur la création et la participation enseignantes</li><li>Quatre communications acceptées dans des conférences</li><li>Approbation éthique HKU FREC EAE26002</li></ul></article>
        <article><h3>NON REVENDIQUÉ À CE STADE</h3><ul><li>Plus de 1 000 participants comme échantillon de recherche</li><li>Gains d’apprentissage causés chez les élèves</li><li>Transférabilité universelle entre contextes</li><li>Apprentissage des frontières comme théorie mature et validée</li><li>Approbation du projet par l’UNESCO</li></ul></article>
      </div>
      <p class="record-footer">Synthèse en cours : <em>Redistribuer le contrôle pédagogique : l’apprentissage des frontières dépendant du parcours…</em></p>`,
      'Utilisez cette diapositive pour cadrer les données probantes lors des questions-réponses. Les données de recherche ont été recueillies avec consentement et portaient sur le développement professionnel des enseignants ; les informations permettant d’identifier les personnes ont été réduites au minimum dans l’analyse et la restitution. [Sources] PDF, p. 25–33 ; page d’accompagnement, sections « Ethics », « What We Do Not Claim » et « Research Outputs ».'),

    slide('Le pouvoir d’agir enseignant, pas l’automatisation', `
      <div class="closing-copy">
        <img class="closing-logo" src="./assets/cocorobo-white.svg" alt="CocoRobo"><p class="kicker">LE TEST FINAL</p>
        <h2>Le pouvoir d’agir enseignant,<br>pas l’automatisation.</h2>
        <p class="closing-line">Les enseignants peuvent-ils décider quand l’IA doit intervenir — et quand elle doit s’effacer ?</p>
        <div class="contact"><b>Haiyang Xin</b><span>Fondateur et PDG · CocoRobo Ltd.</span><a href="mailto:tony@cocorobo.cc">tony@cocorobo.cc</a></div>
      </div>
      <div class="qr-panel"><a href="https://cocorobo.hk/unesco2026/teacher/" target="_blank" rel="noopener" aria-label="Ouvrir la page d’accompagnement"><img src="./assets/supporting-page-qr.svg" alt="Code QR vers la page d’accompagnement"></a><b>Dossier complet : données, études et cadre</b><span>cocorobo.hk/unesco2026/teacher/</span></div>`,
      'Revenir à la question d’ouverture. La prochaine frontière des politiques éducatives n’est pas de maximiser l’usage de l’IA, mais d’accroître la capacité des enseignants à prendre des décisions responsables sur les frontières. Inviter le public à scanner le code QR pour consulter la page d’accompagnement multilingue, l’ensemble des publications de recherche et les liens vers les sources. [Sources] PDF, p. 36–38 ; page d’accompagnement.')
  ];

  window.deckTranslations = {
    en: {
      meta: {
        lang: 'en',
        title: 'From AI Tool Users to AI Agent Creators',
        description: 'How teachers learned to create and govern pedagogical AI agents while protecting human agency and student thinking.',
        ogDescription: 'Boundary Learning for teacher agency in AI-mediated classrooms.'
      },
      ui: { support: 'Supporting page ↗', overview: 'Overview', fullscreen: 'Fullscreen', notes: 'Notes', select: 'Select a slide', close: 'Close ×', speakerNotes: 'Speaker notes', keyboard: 'Keyboard', keyboardHelp: '← / → navigate · Space next · O overview · F fullscreen · N notes · Home / End first / last', closePlain: 'Close', emptyNote: 'This slide has no notes.' },
      slides: []
    },
    zh: {
      meta: {
        lang: 'zh-CN',
        title: '从 AI 工具使用者到 AI 智能体创设者',
        description: '教师如何学习创设并治理教学 AI 智能体，同时保护人的能动性与学生思考。',
        ogDescription: '面向 AI 介导课堂中教师能动性的边界学习。'
      },
      ui: { support: '辅助页面 ↗', overview: '总览', fullscreen: '全屏', notes: '讲者备注', select: '选择幻灯片', close: '关闭 ×', speakerNotes: '讲者备注', keyboard: '键盘快捷键', keyboardHelp: '← / → 切换幻灯片 · 空格键下一页 · O 打开总览 · F 全屏 · N 讲者备注 · Home / End 跳至首张 / 末张', closePlain: '关闭', emptyNote: '本页没有备注。' },
      slides: zhSlides
    },
    fr: {
      meta: {
        lang: 'fr',
        title: 'Des utilisateurs d’outils d’IA aux créateurs d’agents d’IA',
        description: 'Comment des enseignants ont appris à créer et gouverner des agents pédagogiques d’IA tout en préservant le pouvoir d’agir humain et la réflexion des élèves.',
        ogDescription: 'L’apprentissage des frontières au service du pouvoir d’agir enseignant dans les classes où l’IA intervient.'
      },
      ui: { support: 'Page d’accompagnement ↗', overview: 'Vue d’ensemble', fullscreen: 'Plein écran', notes: 'Notes', select: 'Choisir une diapositive', close: 'Fermer ×', speakerNotes: 'Notes de l’orateur', keyboard: 'Raccourcis clavier', keyboardHelp: '← / → naviguer · Espace diapositive suivante · O vue d’ensemble · F plein écran · N notes · Home / End première / dernière', closePlain: 'Fermer', emptyNote: 'Aucune note pour cette diapositive.' },
      slides: frSlides
    }
  };
})();
