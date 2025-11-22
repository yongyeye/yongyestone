
export const translations = {
  zh: {
    title: "脉\n络",
    subtitle: "旧石器数字接口",
    idLabel: "文物编号",
    menu: {
      gallery: "遗迹陈列",
      about: "挖掘档案",
      statement: "石板自述"
    },
    gallery: {
      interpretBtn: "⟡ 解读碑文",
      interpreting: "正在抚摸纹理...",
      modalTitle: "石碑回响",
      footer: "GEN-2.5-FLASH-解读结果"
    },
    about: {
      text: "我们不创造，我们挖掘。这个接口是对记忆的数字考古。如同困在板岩中的化石，这些作品是张力与释放的凝固瞬间。",
      logTitle: "系统归档",
      logs: [
        "序列 01: 初始化完成。",
        "矿脉映射已启动。",
        "Gemini-2.5 链接已建立。"
      ]
    },
    statement: {
      quote: "\"石头不说话，但它记得一切。\"",
      placeholder: "将你的疑问刻入石板...",
      send: "刻录",
      loading: "回响中..."
    },
    intro: {
      sys: "系统初始化",
      core: "岩石核心",
      depth: "深度"
    },
    settings: {
      audio: "声场",
      theme: "材质",
      lang: "语言",
      transition: "幻象",
      effect: "形态",
      effects: {
        fracture: "裂隙",
        rain: "血雨"
      }
    }
  },
  en: {
    title: "VEIN",
    subtitle: "PALEOLITHIC INTERFACE",
    idLabel: "ARTIFACT ID",
    menu: {
      gallery: "EXHIBITS",
      about: "ARCHIVES",
      statement: "MONOLITH"
    },
    gallery: {
      interpretBtn: "⟡ DECIPHER",
      interpreting: "TRACING TEXTURE...",
      modalTitle: "ECHOES",
      footer: "GEN-2.5-FLASH-ANALYSIS"
    },
    about: {
      text: "We do not create; we excavate. This interface is digital archaeology of memory. Like fossils trapped in slate, these works are frozen moments of tension and release.",
      logTitle: "SYSTEM LOGS",
      logs: [
        "SEQ 01: INITIALIZATION COMPLETE.",
        "VEIN MAPPING STARTED.",
        "GEMINI-2.5 UPLINK ESTABLISHED."
      ]
    },
    statement: {
      quote: "\"The stone does not speak, yet it remembers all.\"",
      placeholder: "Carve your query...",
      send: "ENGRAVE",
      loading: "RESONATING..."
    },
    intro: {
      sys: "SYSTEM INIT",
      core: "LITHIC CORE",
      depth: "DEPTH"
    },
    settings: {
      audio: "AUDIO",
      theme: "MAT",
      lang: "LANG",
      transition: "VISION",
      effect: "TYPE",
      effects: {
        fracture: "CRACK",
        rain: "RAIN"
      }
    }
  }
};

export type Language = 'zh' | 'en';
