// ==========================================================================
// BUNYOD PLATFORMASI - HAYOT TIZIMI & YO'NALISH PASPORTI
// USTOZ ZUFAR SHOSALIMOV METODOLOGIYASI VA AMALIY INTERAKTIV VOSITALAR
// ==========================================================================

import { i18nManager } from './i18n.js';
import { authManager } from './auth.js';

export const navigationQuestionsData = {
  uz: [
    {
      id: "where_am_i",
      number: "01",
      question: "Qayerdaman?",
      tag: "Haqiqatni Qabul Qilish",
      summary: "Tezlikdan avval hozirgi real koordinatani aniqlash lozim.",
      detail: "Ko'pincha inson o'zining asl holatini (moliyaviy, ruhiy, oilaviy, sog'liq) tan olishdan qo'rqadi yoki illyuziyaga beriladi. Navigatsiya faqat aniq boshlang'ich nuqta belgilangandagina ishlaydi. Hech qanday bo'yoqsiz: hozir hayotingizning qaysi nuqtasidasiz?",
      prompt: "O'z holatingizni bezamasdan, real vaziyatingizni yozing..."
    },
    {
      id: "where_to",
      number: "02",
      question: "Qayerga ketyapman?",
      tag: "Aniq Mo'ljal",
      summary: "Maqsad mavhum bo'lsa, har qanday shamol adashtiradi.",
      detail: "«Yaxshi yashash», «ko'proq pul topish» — bu maqsad emas, istak. Ketyapgan manzilingiz aniqmi? Bir yildan, besh yildan so'ng kim bo'lishingiz va qayerda turishingiz haqida tiniq tasavvur bormi?",
      prompt: "Ko'zlayotgan aniq manzilingiz va erishmoqchi bo'lgan holatingiz..."
    },
    {
      id: "why_there",
      number: "03",
      question: "Nega aynan o'sha yerga ketyapman?",
      tag: "Asl Niyat & Qadriyat",
      summary: "Bu manzil haqiqatda siznikimi yoki jamiyat kiritgan sun'iy xohishmi?",
      detail: "Ko'p insonlar boshqalarning orzusiga qarab yuguradi. Mashhurlik, qimmat mashina yoki ma'lum maqom ortidan quvib, oxirida ichki bo'shliqqa duch keladi. Nega bu manzil siz uchun muhim? U sizning qaysi chuqur qadriyatingizga javob beradi?",
      prompt: "Bu manzilni tanlashingizning tub, samimiy sababi nima?..."
    },
    {
      id: "which_path",
      number: "04",
      question: "Qaysi yo'ldan ketyapman?",
      tag: "Vosita va Metodologiya",
      summary: "Noto'g'ri yo'l orqali to'g'ri manzilga yetib bo'lmaydi.",
      detail: "Hozir tanlagan kasbingiz, biznes modelingiz, o'rganayotgan bilimlaringiz va kundalik usullaringiz sizni o'sha ko'zlangan manzilga olib boradimi? Vosita maqsadga xizmat qilyaptimi yoki maqsad vositaning quliga aylanganmi?",
      prompt: "Hozir foydalanayotgan usul va yo'llaringiz tahlili..."
    },
    {
      id: "is_approaching",
      number: "05",
      question: "Hozirgi harakatim meni manzilga yaqinlashtiryaptimi?",
      tag: "Amaliy Tekshiruv",
      summary: "Ko'p harakat qilish — to'g'ri harakat qilish degani emas.",
      detail: "Bandlik har doim ham unumdorlik degani emas. Bugungi qilgan amallaringiz, qabul qilgan qarorlaringiz sizni manzilga bir qadam bo'lsa-da yaqinlashtirdimi, yoki shunchaki bir joyda aylanib, charchayapsizmi?",
      prompt: "Bugungi va so'nggi haftadagi harakatlaringiz samaradorligi..."
    }
  ],
  uz_cyrl: [
    {
      id: "where_am_i",
      number: "01",
      question: "Қаердаман?",
      tag: "Ҳақиқатни Қабул Қилиш",
      summary: "Тезликдан аввал ҳозирги реал координатани аниқлаш лозим.",
      detail: "Кўпинча инсон ўзининг асл ҳолатини (молиявий, руҳий, оилавий, соғлиқ) тан олишдан қўрқади ёки иллюзияга берилади. Навигация фақат аниқ бошланғич нуқта белгилангандагина ишлайди. Ҳеч қандай бўёқсиз: ҳозир ҳаётингизнинг қайси нуқтасидасиз?",
      prompt: "Ўз ҳолатингизни безамасдан, реал вазиятингизни ёзинг..."
    },
    {
      id: "where_to",
      number: "02",
      question: "Қаерга кетяпман?",
      tag: "Аниқ Мўлжал",
      summary: "Мақсад мавҳум бўлса, ҳар қандай шамол адаштиради.",
      detail: "«Яхши яшаш», «кўпроқ пул топиш» — бу мақсад эмас, истак. Кетяпган манзилингиз аниқми? Бир йилдан, беш йилдан сўнг ким бўлишингиз ва қаерда туришингиз ҳақида тиниқ тасаввур борми?",
      prompt: "Кўзлаётган аниқ манзилингиз ва эришмоқчи бўлган ҳолатингиз..."
    },
    {
      id: "why_there",
      number: "03",
      question: "Нега айнан ўша ерга кетяпман?",
      tag: "Асл Ният & Қадрият",
      summary: "Бу манзил ҳақиқатда сизникими ёки жамият киритган сунъий хоҳишми?",
      detail: "Кўп инсонлар бошқаларнинг орзусига қараб югуради. Машҳурлик, қиммат машина ёки маълум мақом ортидан қувиб, охирида ички бўшлиққа дуч келади. Нега бу манзил сиз учун муҳим? У сизнинг қайси чуқур қадриятингизга жавоб беради?",
      prompt: "Бу манзилни танлашингизнинг туб, самимий сабаби нима?..."
    },
    {
      id: "which_path",
      number: "04",
      question: "Қайси йўлдан кетяпман?",
      tag: "Восита ва Методология",
      summary: "Нотўғри йўл орқали тўғри манзилга етиб бўлмайди.",
      detail: "Ҳозир танлаган касбингиз, бизнес моделингиз, ўрганаётган билимларингиз ва кундалик усулларингиз сизни ўша кўзланган манзилга олиб борадими? Восита мақсадга хизмат қиляптими ёки мақсад воситанинг қулига айланганми?",
      prompt: "Ҳозир фойдаланаётган усул ва йўлларингиз таҳлили..."
    },
    {
      id: "is_approaching",
      number: "05",
      question: "Ҳозирги ҳаракатим мени манзилга яқинлаштиряптими?",
      tag: "Амалий Текширув",
      summary: "Кўп ҳаракат қилиш — тўғри ҳаракат қилиш дегани эмас.",
      detail: "Бандлик ҳар доим ҳам унумдорлик дегани эмас. Бугунги қилган амалларингиз, қабул қилган қарорларингиз сизни манзилга бир қадам бўлса-да яқинлаштирдими, ёки шунчаки бир жойда айланиб, чарчаяпсизми?",
      prompt: "Бугунги ва сўнгги ҳафтадаги ҳаракатларингиз самарадорлиги..."
    }
  ],
  ru: [
    {
      id: "where_am_i",
      number: "01",
      question: "Где я нахожусь?",
      tag: "Принятие Реальности",
      summary: "Прежде чем ускоряться, нужно определить точную текущую координату.",
      detail: "Часто человек боится признать свое истинное положение (финансы, психика, семья, здоровье) или пребывает в иллюзиях. Навигация работает только при честно заданной исходной точке.",
      prompt: "Без прикрас опишите свое реальное текущее положение..."
    },
    {
      id: "where_to",
      number: "02",
      question: "Куда я иду?",
      tag: "Четкий Ориентир",
      summary: "Если цель размыта, любой ветер собьет с пути.",
      detail: "«Хорошо жить» или «зарабатывать больше» — это желание, а не цель. Ясна ли ваша конечная точка через год, через пять лет?",
      prompt: "Опишите вашу точную цель и состояние, к которому вы стремитесь..."
    },
    {
      id: "why_there",
      number: "03",
      question: "Почему именно туда?",
      tag: "Истинный Мотив и Ценности",
      summary: "Эта цель действительно ваша или навязана извне?",
      detail: "Многие гонятся за чужими мечтами и статусом, сталкиваясь в конце с пустотой. Почему эта цель важна именно для вас?",
      prompt: "Какова глубинная и искренняя причина выбора этого направления?..."
    },
    {
      id: "which_path",
      number: "04",
      question: "Каким путем я иду?",
      tag: "Инструменты и Методы",
      summary: "Неверный путь не приведет к верной цели.",
      detail: "Служат ли выбранная профессия, модель и ежедневные привычки достижению цели, или вы стали заложником процесса?",
      prompt: "Проанализируйте свои текущие инструменты и ежедневный маршрут..."
    },
    {
      id: "is_approaching",
      number: "05",
      question: "Приближают ли меня текущие действия к цели?",
      tag: "Практический Аудит",
      summary: "Много суеты не означает верное движение.",
      detail: "Занятость не равна продуктивности. Приближают ли сегодняшние шаги к цели хотя бы на миллиметр?",
      prompt: "Оцените реальную пользу ваших последних решений и действий..."
    }
  ],
  en: [
    {
      id: "where_am_i",
      number: "01",
      question: "Where am I?",
      tag: "Facing Reality",
      summary: "Before speeding up, you must identify your exact current coordinate.",
      detail: "Often people avoid confronting their true reality (financial, emotional, relational, health) or live in illusions. Navigation only works with an honest starting point.",
      prompt: "Describe your real current state without sugarcoating..."
    },
    {
      id: "where_to",
      number: "02",
      question: "Where am I going?",
      tag: "Clear Destination",
      summary: "When the destination is vague, any wind blows you off course.",
      detail: "«Living well» or «making money» is a wish, not a destination. Do you have a vivid, precise vision of where you are headed?",
      prompt: "Define your clear target destination and desired state..."
    },
    {
      id: "why_there",
      number: "03",
      question: "Why specifically there?",
      tag: "Authentic Values",
      summary: "Is this truly your authentic goal, or an externally imposed desire?",
      detail: "Many pursue society's script only to end up in internal void. Why does this destination matter to your core values?",
      prompt: "What is your deepest, honest motivation for heading there?..."
    },
    {
      id: "which_path",
      number: "04",
      question: "Which path am I taking?",
      tag: "Vehicles & Methodology",
      summary: "The wrong path cannot lead to the right destination.",
      detail: "Do your daily vehicle, skill set, and routines actually lead to your destination, or has the vehicle become a trap?",
      prompt: "Audit your current tools, workflows, and chosen trajectory..."
    },
    {
      id: "is_approaching",
      number: "05",
      question: "Are my current actions bringing me closer?",
      tag: "Action Audit",
      summary: "High activity does not equal correct progress.",
      detail: "Busyness is not effectiveness. Did your choices and actions today bring you genuinely closer to your goal?",
      prompt: "Assess how your daily actions match your ultimate objective..."
    }
  ]
};

export const personasData = {
  uz: [
    {
      id: "entrepreneur",
      icon: "briefcase",
      title: "Tadbirkor",
      quote: "O'zini va biznesini boshqarayotgan inson",
      desc: "Biznesdagi har qanday turg'unlik yoki inqiroz avvalo tadbirkorning ichki tartibi, tafakkuri va energiyasi yetishmasligidan kelib chiqadi. Tizim yaratish — insonning o'zini boshqara olishidan boshlanadi."
    },
    {
      id: "leader",
      icon: "shield",
      title: "Rahbar",
      quote: "Qaror qabul qiluvchi va insonlarga ta'sir o'tkazuvchi shaxs",
      desc: "Liderlik — lavozim emas, balki ichki barqarorlik va adolatli qaror qabul qilish san'atidir. O'z hissiyotlarini idora eta olmagan rahbar butun jamoani stress va xatoga boshlaydi."
    },
    {
      id: "parent",
      icon: "heart",
      title: "Ota-Ona",
      quote: "Keksa va yosh avlod poydevorini quruvchi",
      desc: "Farzand so'zlardan emas, balki ota-onaning holatidan, odatlaridan va o'zaro munosabatlaridan o'rnak oladi. Tarbiya — o'z ustingda ishlash orqali namuna bo'lishdir."
    },
    {
      id: "teacher",
      icon: "book",
      title: "O'qituvchi / Ustoz",
      quote: "O'zining va boshqalarning tafakkuri bilan ishlovchi",
      desc: "Boshqalarga yo'l ko'rsatishdan avval o'zining ichki kompasini to'g'rilagan, bilganini xulqiga aylantirgan va ta'limni shunchaki ma'lumot emas, tirik hayotga aylantiruvchi inson."
    },
    {
      id: "expert",
      icon: "award",
      title: "Mutaxassis",
      quote: "O'z qobiliyatini haqiqiy qiymatga aylantiruvchi",
      desc: "Bilm va texnik mahoratning o'zi yetarli emas. Qobiliyatni insonlarga manfaatli qiymatga aylantirish, qadriyatli aloqalar qurish va professional o'sish uchun yaxlit tizim lozim."
    },
    {
      id: "youth",
      icon: "compass",
      title: "Yosh Inson",
      quote: "Hayot yo'nalishini va ilk katta tanlovlarini qilayotgan shaxs",
      desc: "Boshqalarning ta'siri va ijtimoiy tarmoqlar shovqinida o'z yo'lini yo'qotmay, qadriyatlarga tayangan holda mustahkam poydevor qurish davri."
    },
    {
      id: "veteran",
      icon: "mountain",
      title: "Tajribali Inson",
      quote: "Bosib o'tgan yo'lini tahlil qilib, yangi ma'no izlovchi",
      desc: "Katta marralarga erishgach yoki yillar davomida to'plangan tajribadan so'ng: «Endi nima? Mening qoldiradigan merosim nima?» degan savolga javob topish bosqichi."
    }
  ],
  uz_cyrl: [
    {
      id: "entrepreneur",
      icon: "briefcase",
      title: "Тадбиркор",
      quote: "Ўзини ва бизнесини бошқараётган инсон",
      desc: "Бизнесдаги ҳар қандай турғунлик ёки инқироз аввало тадбиркорнинг ички тартиби, тафаккури ва энергияси етишмаслигидан келиб чиқади. Тизим яратиш — инсоннинг ўзини бошқара олишидан бошланади."
    },
    {
      id: "leader",
      icon: "shield",
      title: "Раҳбар",
      quote: "Қарор қабул қилувчи ва инсонларга таъсир ўтказувчи шахс",
      desc: "Лидерлик — лавозим эмас, балки ички барқарорлик ва адолатли қарор қабул қилиш санъатидир. Ўз ҳиссиётларини идора эта олмаган раҳбар бутун жамоани стресс ва хатога бошлайди."
    },
    {
      id: "parent",
      icon: "heart",
      title: "Ота-Она",
      quote: "Кекса ва ёш авлод пойдеворини қурувчи",
      desc: "Фарзанд сўзлардан эмас, балки ота-онанинг ҳолатидан, одатларидан ва ўзаро муносабатларидан ўрнак олади. Тарбия — ўз устингда ишлаш орқали намуна бўлишдир."
    },
    {
      id: "teacher",
      icon: "book",
      title: "Ўқитувчи / Устоз",
      quote: "Ўзининг ва бошқаларнинг тафаккури билан ишловчи",
      desc: "Бошқаларга йўл кўрсатишдан аввал ўзининг ички компасини тўғрилаган, билганини хулқига айлантирган ва таълимни шунчаки маълумот эмас, тирик ҳаётга айлантирувчи инсон."
    },
    {
      id: "expert",
      icon: "award",
      title: "Мутахассис",
      quote: "Ўз қобилиятини ҳақиқий қийматга айлантирувчи",
      desc: "Билим ва техник маҳоратнинг ўзи етарли эмас. Қобилиятни инсонларга манфаатли қийматга айлантириш, қадриятли алоқалар қуриш ва профессионал ўсиш учун яхлит тизим лозим."
    },
    {
      id: "youth",
      icon: "compass",
      title: "Ёш Инсон",
      quote: "Ҳаёт йўналишини ва илк катта танловларини қилаётган шахс",
      desc: "Бошқаларнинг таъсири ва ижтимоий тармоқлар шовқинида ўз йўлини йўқотмай, қадриятларга таянган ҳолда мустаҳкам пойдевор қуриш даври."
    },
    {
      id: "veteran",
      icon: "mountain",
      title: "Тажрибали Инсон",
      quote: "Босиб ўтган йўлини таҳлил қилиб, янги маъно изловчи",
      desc: "Катта марраларга эришгач ёки йиллар давомида тўпланган тажрибадан сўнг: «Энди нима? Менинг қолдирадиган меросим нима?» деган саволга жавоб топиш босқичи."
    }
  ],
  ru: [
    {
      id: "entrepreneur",
      icon: "briefcase",
      title: "Предприниматель",
      quote: "Человек, управляющий собой и бизнесом",
      desc: "Любой кризис в бизнесе коренится в дефиците внутренней дисциплины, мышления и энергии лидера. Создание системы начинается с самоуправления."
    },
    {
      id: "leader",
      icon: "shield",
      title: "Руководитель",
      quote: "Принимающий решения и влияющий на людей",
      desc: "Лидерство — это не должность, а эмоциональная устойчивость и мудрость решений."
    },
    {
      id: "parent",
      icon: "heart",
      title: "Родитель",
      quote: "Закладывающий фундамент будущего поколения",
      desc: "Дети учатся не на словах, а на реальных состояниях и реакциях родителей. Воспитание — это трансформация себя."
    },
    {
      id: "teacher",
      icon: "book",
      title: "Учитель / Наставник",
      quote: "Работающий с мышлением людей",
      desc: "Тот, кто сначала настроил свой компас, воплотил знание в действие и делает образование живой практикой."
    },
    {
      id: "expert",
      icon: "award",
      title: "Специалист",
      quote: "Превращающий способности в ценность",
      desc: "Одних знаний мало — нужна система перевода навыков в практическую пользу и ценность для общества."
    },
    {
      id: "youth",
      icon: "compass",
      title: "Молодой человек",
      quote: "Выбирающий жизненный ориентир",
      desc: "Время отсекать внешний шум и строить жизнь на фундаменте фундаментальных ценностей."
    },
    {
      id: "veteran",
      icon: "mountain",
      title: "Опытный практик",
      quote: "Осмысливающий пройденный путь",
      desc: "Поиск ответа на глубинный вопрос: «Что дальше? В чем мое истинное наследие?»"
    }
  ],
  en: [
    {
      id: "entrepreneur",
      icon: "briefcase",
      title: "Entrepreneur",
      quote: "Governing oneself and the business",
      desc: "Stagnation in business often traces back to the founder's mental clarity, energy, and inner discipline. Building systems starts with self-mastery."
    },
    {
      id: "leader",
      icon: "shield",
      title: "Leader",
      quote: "Decision maker impacting human lives",
      desc: "Leadership is not a title; it is internal stability and the integrity of decisions."
    },
    {
      id: "parent",
      icon: "heart",
      title: "Parent",
      quote: "Building the foundation for next generations",
      desc: "Children learn not from speeches, but from the emotional state and integrity of their parents."
    },
    {
      id: "teacher",
      icon: "book",
      title: "Educator / Mentor",
      quote: "Cultivating thought and worldview",
      desc: "One who aligns their inner compass first, turning truth into character and knowledge into living wisdom."
    },
    {
      id: "expert",
      icon: "award",
      title: "Professional",
      quote: "Transforming talent into tangible value",
      desc: "Raw expertise is never enough. A holistic system is needed to channel talents into societal contribution."
    },
    {
      id: "youth",
      icon: "compass",
      title: "Young Aspirant",
      quote: "Choosing lifelong trajectories and values",
      desc: "Filtering out algorithmic noise to anchor decisions in enduring principles and deep character."
    },
    {
      id: "veteran",
      icon: "mountain",
      title: "Experienced Sage",
      quote: "Refining meaning and lasting legacy",
      desc: "Moving beyond achievement toward contribution: «What is the lasting legacy I leave behind?»"
    }
  ]
};

class PassportManager {
  constructor() {
    this.currentQuestionIndex = 0;
    this.selectedPersonaIndex = 0;
    this.savedReflections = {};
  }

  init() {
    this.loadSavedReflections();
    this.renderNavigationStepper();
    this.renderPersonas();
    this.bindEvents();

    i18nManager.onLanguageChange(() => {
      this.renderNavigationStepper();
      this.renderPersonas();
    });
  }

  loadSavedReflections() {
    try {
      const stored = localStorage.getItem('bunyod_nav_reflections');
      if (stored) {
        this.savedReflections = JSON.parse(stored);
      }
    } catch (e) {
      this.savedReflections = {};
    }
  }

  saveReflection(questionId, text) {
    this.savedReflections[questionId] = {
      text,
      updatedAt: new Date().toISOString()
    };
    try {
      localStorage.setItem('bunyod_nav_reflections', JSON.stringify(this.savedReflections));
      authManager.addXP(25);
    } catch (e) {
      console.warn("Storage error", e);
    }
  }

  renderNavigationStepper() {
    const lang = i18nManager.getLang();
    const questions = navigationQuestionsData[lang] || navigationQuestionsData.uz;
    const navTabsContainer = document.getElementById('passportNavTabs');
    const navContentContainer = document.getElementById('passportNavContent');

    if (!navTabsContainer || !navContentContainer) return;

    // Tabs
    navTabsContainer.innerHTML = questions.map((q, idx) => `
      <button class="passport-nav-pill ${idx === this.currentQuestionIndex ? 'active' : ''}" data-idx="${idx}">
        <span class="pill-number">${q.number}</span>
        <span class="pill-title">${q.question}</span>
      </button>
    `).join('');

    // Active Card
    const currentQ = questions[this.currentQuestionIndex] || questions[0];
    const savedText = (this.savedReflections[currentQ.id] && this.savedReflections[currentQ.id].text) || '';

    navContentContainer.innerHTML = `
      <div class="nav-question-stage card-minimal">
        <div class="nav-q-header">
          <div class="nav-q-badge">
            <span class="q-tag-num">${currentQ.number}</span>
            <span class="q-tag-text">${currentQ.tag}</span>
          </div>
          <h3 class="nav-q-title">${currentQ.question}</h3>
          <p class="nav-q-summary">${currentQ.summary}</p>
        </div>

        <div class="nav-q-body">
          <div class="nav-q-detail">
            ${currentQ.detail}
          </div>

          <div class="nav-q-reflection-box">
            <label class="reflection-label">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
              <span>Shaxsiy Refleksiya va Qayd:</span>
            </label>
            <textarea id="navReflectionInput" class="notes-textarea" rows="3" placeholder="${currentQ.prompt}">${savedText}</textarea>
            
            <div class="reflection-footer-actions">
              <button class="btn-gold-elegant" id="saveReflectionBtn" style="padding: 9px 20px; font-size: 13.5px;">
                Saqlash (+25 XP)
              </button>
              <span id="reflectionSaveNotice" class="save-feedback-text"></span>
            </div>
          </div>
        </div>
      </div>
    `;

    // Bind save button
    const saveBtn = document.getElementById('saveReflectionBtn');
    const inputArea = document.getElementById('navReflectionInput');
    const notice = document.getElementById('reflectionSaveNotice');

    if (saveBtn && inputArea) {
      saveBtn.addEventListener('click', () => {
        const val = inputArea.value.trim();
        this.saveReflection(currentQ.id, val);
        if (notice) {
          notice.textContent = "✓ Muvaffaqiyatli saqlandi!";
          notice.style.color = "var(--nature-green)";
          setTimeout(() => { notice.textContent = ""; }, 3000);
        }
      });
    }

    // Bind tab clicks
    navTabsContainer.querySelectorAll('.passport-nav-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        this.currentQuestionIndex = parseInt(btn.dataset.idx, 10);
        this.renderNavigationStepper();
      });
    });
  }

  renderPersonas() {
    const lang = i18nManager.getLang();
    const personas = personasData[lang] || personasData.uz;
    const personaTabs = document.getElementById('passportPersonaTabs');
    const personaCard = document.getElementById('passportPersonaCard');

    if (!personaTabs || !personaCard) return;

    personaTabs.innerHTML = personas.map((p, idx) => `
      <button class="persona-tab-btn ${idx === this.selectedPersonaIndex ? 'active' : ''}" data-idx="${idx}">
        <span>${p.title}</span>
      </button>
    `).join('');

    const currentP = personas[this.selectedPersonaIndex] || personas[0];

    personaCard.innerHTML = `
      <div class="persona-insight-card">
        <div class="persona-insight-top">
          <div class="persona-badge-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          </div>
          <div>
            <h4 class="persona-card-title">${currentP.title}</h4>
            <p class="persona-card-quote">«${currentP.quote}»</p>
          </div>
        </div>
        <p class="persona-card-desc">${currentP.desc}</p>
      </div>
    `;

    personaTabs.querySelectorAll('.persona-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.selectedPersonaIndex = parseInt(btn.dataset.idx, 10);
        this.renderPersonas();
      });
    });
  }

  bindEvents() {
    // Interactive matrix symptom clicks
    document.querySelectorAll('.symptom-root-item').forEach(item => {
      item.addEventListener('click', () => {
        item.classList.toggle('expanded');
      });
    });
  }
}

export const passportManager = new PassportManager();
