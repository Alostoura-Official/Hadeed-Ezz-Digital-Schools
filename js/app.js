/* ================= النطق الصوتي ================= */
let soundOn = localStorage.getItem('mech-sound') !== '0';

function speak(text, lang = 'en-US', rate = 0.85) {
  if (!soundOn) return;
  if (!('speechSynthesis' in window)) { alert('المتصفح لا يدعم النطق'); return; }
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = lang;
  utter.rate = rate;
  utter.pitch = 1;
  utter.volume = 1;
  const voices = window.speechSynthesis.getVoices();
  const preferred = voices.find(v => v.lang === lang)
                 || voices.find(v => v.lang.startsWith(lang.split('-')[0]));
  if (preferred) utter.voice = preferred;
  window.speechSynthesis.speak(utter);
}

function speakSection(si) {
  if (!soundOn) return;
  const words = SECTIONS[si].t;
  let i = 0;
  window.speechSynthesis.cancel();
  function next() {
    if (i >= words.length) return;
    const uEN = new SpeechSynthesisUtterance(words[i][1]);
    uEN.lang = 'en-US'; uEN.rate = 0.85;
    uEN.onend = () => {
      const uIT = new SpeechSynthesisUtterance(words[i][2]);
      uIT.lang = 'it-IT'; uIT.rate = 0.85;
      uIT.onend = () => { i++; setTimeout(next, 500); };
      window.speechSynthesis.speak(uIT);
    };
    window.speechSynthesis.speak(uEN);
  }
  next();
}

function toggleSound() {
  soundOn = !soundOn;
  localStorage.setItem('mech-sound', soundOn ? '1' : '0');
  const btn = $('soundBtn');
  if (btn) btn.textContent = soundOn ? '🔊 الصوت: مفعّل' : '🔇 الصوت: مغلق';
  if (!soundOn && 'speechSynthesis' in window) window.speechSynthesis.cancel();
}

if ('speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
  window.speechSynthesis.getVoices();
}
/* =================================================================
   1) المواد الدراسية الرئيسية
   ================================================================= */
const SUBJECTS = {
  mech:      { name: "ميكاترونكس",       icon: "⚙️", color: "#2563eb" },
  english:   { name: "لغة إنجليزية",      icon: "🇬🇧", color: "#16a34a" },
  italian:   { name: "لغة إيطالية",       icon: "🇮🇹", color: "#009246" },
  arabic:    { name: "لغة عربية",         icon: "📗", color: "#dc2626" },
  math:      { name: "رياضيات",          icon: "🔢", color: "#7c3aed" },
  physics:   { name: "فيزياء",           icon: "⚛️", color: "#0891b2" },
  chemistry: { name: "كيمياء",           icon: "🧪", color: "#ea580c" },
  biology:   { name: "أحياء",            icon: "🧬", color: "#059669" },
  social:    { name: "دراسات اجتماعية",   icon: "🌍", color: "#a16207" },
  other:     { name: "مواد أخرى",         icon: "📁", color: "#64748b" }
};

/* =================================================================
   2) بيانات القاموس
   ================================================================= */
/* بنية كل مصطلح: [الرقم, English, Italiano, نطق إنجليزي, نطق إيطالي, المعنى] */
let SECTIONS = [
{n:"أساسيات الميكاترونكس والتحكم",c:"#2563eb",subj:"mech",t:[
  [1,"Mechatronics","Meccatronica","ميكاترونكس","ميكاترونيكا","الميكاترونكس"],
  [2,"Mechanical","Meccanico","ميكانيكال","ميكانيكو","ميكانيكي"],
  [3,"Electrical","Elettrico","إلكتريكال","إلِتريكو","كهربائي"],
  [4,"Electronics","Elettronica","إلكترونكس","إلترونيكا","إلكترونيات"],
  [5,"Automation","Automazione","أوتوميشن","أوتوماتسيوني","الأتمتة"],
  [6,"Control System","Sistema di controllo","كنترول سيستم","سيستيما دي كونتروللو","نظام تحكم"],
  [7,"Industrial Automation","Automazione industriale","إندستريال أوتوميشن","أوتوماتسيوني إندستريالي","الأتمتة الصناعية"],
  [8,"Machine","Macchina","ماشين","ماكينا","ماكينة / آلة"],
  [9,"Process","Processo","بروسيس","بروتشيسو","عملية تشغيل"],
  [10,"System","Sistema","سيستم","سيستيما","نظام"],
  [11,"Input","Ingresso","إنبوت","إنغريسو","دخل"],
  [12,"Output","Uscita","آوتبوت","أوشيتا","خرج"],
  [13,"Signal","Segnale","سيجنال","سينيالي","إشارة"],
  [14,"Analog","Analogico","أنالوج","أنالوجيكو","تماثلي"],
  [15,"Digital","Digitale","ديجيتال","ديجيتالي","رقمي"],
  [16,"Control","Controllo","كنترول","كونتروللو","تحكم"],
  [17,"Controller","Controllore","كنترولر","كونتروللوري","وحدة تحكم"],
  [18,"Feedback","Retroazione","فيدباك","ريتروازيوني","تغذية راجعة"],
  [19,"Setpoint","Valore impostato","سيت بوينت","فالوري إمبوستاتو","القيمة المطلوبة"],
  [20,"Process Variable","Variabile di processo","بروسيس فاريابل","فاريابيلي دي بروتشيسو","متغير العملية"]
]},
{n:"PLC والبرمجة الصناعية",c:"#ea580c",subj:"mech",t:[
  [21,"PLC","PLC","بي إل سي","بي إل سي","متحكم منطقي مبرمج"],
  [22,"Programmable Logic Controller","Controllore Logico Programmabile","بروجرامابل لوجيك كنترولر","كونتروللوري لوجيكو بروجرامابيلي","المتحكم المنطقي المبرمج"],
  [23,"CPU","CPU","سي بي يو","سي بي يو","وحدة المعالجة"],
  [24,"Input Module","Modulo di ingresso","إنبوت موديول","مودولو دي إنغريسو","وحدة الإدخال"],
  [25,"Output Module","Modulo di uscita","آوتبوت موديول","مودولو دي أوشيتا","وحدة الإخراج"],
  [26,"Digital Input","Ingresso digitale","ديجيتال إنبوت","إنغريسو ديجيتالي","دخل رقمي"],
  [27,"Digital Output","Uscita digitale","ديجيتال آوتبوت","أوشيتا ديجيتالي","خرج رقمي"],
  [28,"Analog Input","Ingresso analogico","أنالوج إنبوت","إنغريسو أنالوجيكو","دخل تماثلي"],
  [29,"Analog Output","Uscita analogica","أنالوج آوتبوت","أوشيتا أنالوجيكا","خرج تماثلي"],
  [30,"Ladder Logic","Logica a scala","لادر لوجيك","لوجيكا آ سكالا","برمجة السلم"],
  [31,"Timer","Timer","تايمر","تايمر","مؤقت"],
  [32,"Counter","Contatore","كاونتر","كونتاتوري","عداد"],
  [33,"Sensor","Sensore","سينسور","سينسوري","حساس"],
  [34,"Proximity Sensor","Sensore di prossimità","بروكسيميتي سينسور","سينسوري دي بروسيميتا","حساس اقتراب"],
  [35,"Limit Switch","Finecorsa","ليميت سويتش","فيني كورسا","مفتاح نهاية مشوار"],
  [36,"Encoder","Encoder","إنكودر","إنكودر","حساس موضع/سرعة"],
  [37,"Motor","Motore","موتور","موتوري","محرك"],
  [38,"VFD","VFD","في إف دي","في إف دي","مغير تردد وسرعة"],
  [39,"HMI","HMI","إتش إم آي","إتش إم آي","واجهة الإنسان والآلة"],
  [40,"SCADA","SCADA","سكادا","سكادا","مراقبة وتحكم"],
  [41,"Pneumatics","Pneumatica","نيوماتكس","بنوماتيكا","أنظمة الهواء المضغوط"],
  [42,"Hydraulics","Idraulica","هيدروليكس","إدراوليكا","الأنظمة الهيدروليكية"],
  [43,"Maintenance","Manutenzione","مينتنانس","مانوتنتسيوني","صيانة"],
  [44,"Safety","Sicurezza","سيفتي","سيكورتسا","سلامة"],
  [45,"Calibration","Taratura","كاليبريشن","تاراتورا","معايرة"],
  [46,"Troubleshooting","Ricerca guasti","تروبل شوتنج","ريتشركا غواستي","اكتشاف الأعطال"],
  [47,"Gearbox","Riduttore","جيربوكس","ريدوتوري","علبة تروس"],
  [48,"Bearing","Cuscinetto","بيرنج","كوشينيتو","محمل"],
  [49,"Emergency Stop","Arresto di emergenza","إمرجنسي ستوب","أريستو دي إميرجنتسا","إيقاف طوارئ"],
  [50,"Control Panel","Pannello di controllo","كنترول بانل","بانيللو دي كونتروللو","لوحة تحكم"]
]},
{n:"الحساسات — Sensori",c:"#64748b",subj:"mech",t:[
  [51,"Sensor","Sensore","سينسور","سينسوري","حساس"],
  [52,"Inductive Sensor","Sensore induttivo","إندكتف سينسور","سينسوري إندوتيفو","حساس حثي"],
  [53,"Capacitive Sensor","Sensore capacitivo","كاباسيتف سينسور","سينسوري كاباتشيتيفو","حساس سعوي"],
  [54,"Photoelectric Sensor","Sensore fotoelettrico","فوتو إليكتريك سينسور","سينسوري فوتوإليتريكو","حساس ضوئي"],
  [55,"Ultrasonic Sensor","Sensore a ultrasuoni","ألترا سونيك سينسور","سينسوري آ أولتراسوني","حساس فوق صوتي"],
  [56,"Temperature Sensor","Sensore di temperatura","تيمبرتشر سينسور","سينسوري دي تيمبراتورا","حساس حرارة"],
  [57,"Pressure Sensor","Sensore di pressione","بريشر سينسور","سينسوري دي بريسيوني","حساس ضغط"],
  [58,"Level Sensor","Sensore di livello","ليفل سينسور","سينسوري دي ليفيللو","حساس مستوى"],
  [59,"Flow Sensor","Sensore di flusso","فلو سينسور","سينسوري دي فلوسو","حساس تدفق"],
  [60,"Thermocouple","Termocoppia","ثيرمو كوبل","تيرموكوبيا","مزدوج حراري"],
  [61,"Load Cell","Cella di carico","لود سيل","تشيلا دي كاريكو","خلية قياس وزن"],
  [62,"Accelerometer","Accelerometro","أكسيليروميتر","أتشيليروميترو","حساس تسارع"],
  [63,"Gyroscope","Giroscopio","جايروسكوب","جيروسكوبيو","حساس دوران"]
]},
{n:"المحركات — Motori",c:"#d97706",subj:"mech",t:[
  [64,"Motor","Motore","موتور","موتوري","محرك"],
  [65,"Electric Motor","Motore elettrico","إليكتريك موتور","موتوري إليتريكو","محرك كهربائي"],
  [66,"AC Motor","Motore AC","إيه سي موتور","موتوري إيه سي","محرك تيار متردد"],
  [67,"DC Motor","Motore DC","دي سي موتور","موتوري دي سي","محرك تيار مستمر"],
  [68,"Induction Motor","Motore a induzione","إندكشن موتور","موتوري آ إندوتسيوني","محرك حثي"],
  [69,"Synchronous Motor","Motore sincrono","سينكرونس موتور","موتوري سينكرونو","محرك تزامني"],
  [70,"Servo Motor","Servomotore","سيرفو موتور","سيرفوموتوري","محرك سيرفو"],
  [71,"Stepper Motor","Motore passo-passo","ستيبر موتور","موتوري باسو-باسو","محرك خطوي"],
  [72,"Brushless Motor","Motore brushless","براشليس موتور","موتوري براشليس","محرك بدون فرش"],
  [73,"Rotor","Rotore","روتور","روتوري","الجزء الدوار"],
  [74,"Stator","Statore","ستيتور","ستاتوري","الجزء الثابت"],
  [75,"Shaft","Albero","شافت","ألبيرو","عمود دوران"],
  [76,"Torque","Coppia","تورك","كوبيا","عزم الدوران"],
  [77,"Speed","Velocità","سبيد","فيلوتشيتا","السرعة"],
  [78,"RPM","Giri al minuto","آر بي إم","جيري آل مينوتو","عدد اللفات/دقيقة"],
  [79,"Motor Starter","Avviatore motore","موتور ستارتر","أفياتوري موتوري","بادئ تشغيل المحرك"],
  [80,"Motor Protection","Protezione motore","موتور بروتكشن","بروتيتسيوني موتوري","حماية المحرك"],
  [81,"Overload","Sovraccarico","أوفرلود","سوفراكاريكو","زيادة الحمل"],
  [82,"Motor Brake","Freno motore","موتور بريك","فرينو موتوري","فرامل المحرك"],
  [83,"Motor Drive","Azionamento motore","موتور درايف","أتسيونامنتو موتوري","وحدة قيادة المحرك"]
]},
{n:"VFD والتحكم في السرعة",c:"#0284c7",subj:"mech",t:[
  [84,"VFD","VFD","في إف دي","في إف دي","مغير تردد وسرعة"],
  [85,"Variable Frequency Drive","Azionamento a frequenza variabile","فاريابل فريكونسي درايف","أتسيونامنتو آ فريكونتسا فاريابيلي","مغير التردد"],
  [86,"Frequency","Frequenza","فريكونسي","فريكونتسا","التردد"],
  [87,"Frequency Converter","Convertitore di frequenza","فريكونسي كونفرتر","كونفرتيتوري دي فريكونتسا","محول تردد"],
  [88,"Inverter","Inverter","إنفيرتر","إنفرتير","عاكس"],
  [89,"Acceleration","Accelerazione","أكسيليريشن","أتشيليرازيوني","تسارع"],
  [90,"Deceleration","Decelerazione","ديسيليريشن","ديتشيليرازيوني","تباطؤ"],
  [91,"Ramp Up","Rampa di accelerazione","رامب أب","رامبا دي أتشيليرازيوني","زمن التسارع"],
  [92,"Ramp Down","Rampa di decelerazione","رامب داون","رامبا دي ديتشيليرازيوني","زمن التباطؤ"],
  [93,"Speed Control","Controllo della velocità","سبيد كنترول","كونتروللو ديلا فيلوتشيتا","التحكم في السرعة"],
  [94,"Variable Speed","Velocità variabile","فاريابل سبيد","فيلوتشيتا فاريابيلي","سرعة متغيرة"],
  [95,"Motor Parameter","Parametro motore","موتور باراميتر","بارامترو موتوري","إعدادات المحرك"],
  [96,"Drive Parameter","Parametro azionamento","درايف باراميتر","بارامترو أتسيونامنتو","إعدادات الدرايف"],
  [97,"Fault","Guasto","فولت","غواستو","عطل"],
  [98,"Alarm","Allarme","ألارم","ألارمي","إنذار"]
]},
{n:"الكهرباء والإلكترونيات",c:"#16a34a",subj:"mech",t:[
  [99,"Voltage","Tensione","فولتج","تينسيوني","جهد كهربائي"],
  [100,"Current","Corrente","كارنت","كورينتي","تيار كهربائي"],
  [101,"Resistance","Resistenza","ريزيستانس","ريزيستنتسا","مقاومة"],
  [102,"Power","Potenza","باور","بوتنتسا","قدرة"],
  [103,"AC","CA","إيه سي","تشي إيه","تيار متردد"],
  [104,"DC","CC","دي سي","تشي تشي","تيار مستمر"],
  [105,"Power Supply","Alimentatore","باور سبلاي","أليمنتاتوري","مصدر تغذية"],
  [106,"Transformer","Trasformatore","ترانسفورمر","تراسفورماتوري","محول"],
  [107,"Rectifier","Raddrizzatore","ريكتيفاير","رادريتساتوري","مقوم"],
  [108,"Diode","Diodo","دايود","ديودو","صمام ثنائي"],
  [109,"Transistor","Transistor","ترانزيستور","ترانزيستور","ترانزستور"],
  [110,"Resistor","Resistore","ريزيستور","ريزيستوري","مقاومة"],
  [111,"Capacitor","Condensatore","كاباسيتور","كوندينساتوري","مكثف"],
  [112,"Inductor","Induttore","إندكتور","إندوتوري","ملف حثي"],
  [113,"Circuit","Circuito","سيركت","تشيركيتو","دائرة كهربائية"],
  [114,"Circuit Breaker","Interruttore automatico","سيركت بريكر","إنتروتوري أوتوماتيكو","قاطع دائرة"],
  [115,"Fuse","Fusibile","فيوز","فوزيبيلي","مصهر"],
  [116,"Relay","Relè","ريلاي","ريليه","مرحل"],
  [117,"Contactor","Contattore","كونتاكتور","كونتاتوري","كونتاكتور"]
]},
{n:"الحماية والتحكم الكهربائي",c:"#1e3a8a",subj:"mech",t:[
  [118,"Overload Relay","Relè di sovraccarico","أوفرلود ريلاي","ريليه دي سوفراكاريكو","ريلاي حماية من زيادة الحمل"],
  [119,"Thermal Overload","Sovraccarico termico","ثيرمال أوفرلود","سوفراكاريكو تيرميكو","حماية حرارية"],
  [120,"Short Circuit","Cortocircuito","شورت سيركت","كورتوتشيركيتو","قصر كهربائي"],
  [121,"Earth Fault","Guasto a terra","إيرث فولت","غواستو آ تيرا","عطل أرضي"],
  [122,"Grounding","Messa a terra","جراوندنج","ميسا آ تيرا","تأريض"],
  [123,"Emergency Stop","Arresto di emergenza","إمرجنسي ستوب","أريستو دي إميرجنتسا","إيقاف طوارئ"],
  [124,"Push Button","Pulsante","بوش باتن","بولسانتي","زر ضغط"],
  [125,"Selector Switch","Selettore","سيلكتور سويتش","سيليتوري","مفتاح اختيار"],
  [126,"Pilot Lamp","Spia luminosa","بايلوت لامب","سبيا لومينوزا","لمبة بيان"],
  [127,"Indicator","Indicatore","إنديكيتور","إنديكاتوري","مؤشر"],
  [128,"Control Panel","Pannello di controllo","كنترول بانل","بانيللو دي كونتروللو","لوحة تحكم"],
  [129,"Electrical Panel","Quadro elettrico","إلكتريكال بانل","كوادرو إليتريكو","لوحة كهرباء"],
  [130,"Terminal Block","Morsettiera","تيرمنال بلوك","مورسيتييرا","ترامل توصيل"]
]},
{n:"HMI و SCADA",c:"#9a3412",subj:"mech",t:[
  [131,"HMI","HMI","إتش إم آي","إتش إم آي","واجهة الإنسان والآلة"],
  [132,"Human Machine Interface","Interfaccia Uomo-Macchina","هيومن ماشين إنترفيس","إنترفاتشا أومو-ماكينا","واجهة الإنسان والآلة"],
  [133,"Touch Screen","Schermo tattile","تاتش سكرين","سكيرمو تاتيلي","شاشة لمس"],
  [134,"SCADA","SCADA","سكادا","سكادا","مراقبة وتحكم وتجميع بيانات"],
  [135,"Monitoring","Monitoraggio","مونيتورنج","مونيتوراجيو","مراقبة"],
  [136,"Visualization","Visualizzazione","فيجوالايزيشن","فيزواليتساتسيوني","عرض مرئي للبيانات"],
  [137,"Dashboard","Cruscotto","داشبورد","كروسكوتو","لوحة معلومات"],
  [138,"Tag","Tag","تاج","تاغ","متغير/عنوان"],
  [139,"Data Logging","Registrazione dati","داتا لوجنج","ريجيستراتسيوني داتي","تسجيل البيانات"],
  [140,"Trend","Andamento","تريند","أندامنتو","منحنى تغير القيمة"]
]},
{n:"النيوماتكس — Pneumatica",c:"#475569",subj:"mech",t:[
  [141,"Pneumatics","Pneumatica","نيوماتكس","بنوماتيكا","أنظمة الهواء المضغوط"],
  [142,"Compressed Air","Aria compressa","كومبرست إير","آريا كومبريسا","هواء مضغوط"],
  [143,"Compressor","Compressore","كمبريسور","كومبريسوري","ضاغط هواء"],
  [144,"Pneumatic Cylinder","Cilindro pneumatico","نيوماتيك سيلندر","تشيليندرو بنوماتيكو","أسطوانة هوائية"],
  [145,"Cylinder","Cilindro","سيلندر","تشيليندرو","أسطوانة"],
  [146,"Piston","Pistone","بيستون","بيستوني","مكبس"],
  [147,"Valve","Valvola","فالف","فالفولا","صمام"],
  [148,"Solenoid Valve","Elettrovalvola","سولينويد فالف","إليتروفالفولا","صمام كهربائي"],
  [149,"Directional Valve","Valvola direzionale","دايركشنال فالف","فالفولا ديريتسيونالي","صمام تحكم اتجاهي"],
  [150,"Pressure Regulator","Regolatore di pressione","بريشر ريجوليتر","ريغولاتوري دي بريسيوني","منظم ضغط"],
  [151,"Filter","Filtro","فلتر","فيلترو","مرشح"],
  [152,"Lubricator","Lubrificatore","لوبركيتر","لوبريفيكاتوري","مزيت"],
  [153,"FRL Unit","Gruppo FRL","إف آر إل يونت","غروببو إف آر إل","فلتر ومنظم ومزيت"],
  [154,"Air Hose","Tubo dell'aria","إير هوز","توبو ديل آريا","خرطوم هواء"],
  [155,"Air Pressure","Pressione dell'aria","إير بريشر","بريساوني ديل آريا","ضغط الهواء"]
]},
{n:"الهيدروليك — Idraulica",c:"#a16207",subj:"mech",t:[
  [156,"Hydraulics","Idraulica","هيدروليكس","إدراوليكا","الأنظمة الهيدروليكية"],
  [157,"Hydraulic Pump","Pompa idraulica","هيدروليك بامب","بومبا إدراوليكا","مضخة هيدروليكية"],
  [158,"Hydraulic Cylinder","Cilindro idraulico","هيدروليك سيلندر","تشيليندرو إدراوليكو","أسطوانة هيدروليكية"],
  [159,"Hydraulic Valve","Valvola idraulica","هيدروليك فالف","فالفولا إدراوليكا","صمام هيدروليكي"],
  [160,"Hydraulic Oil","Olio idraulico","هيدروليك أويل","أوليو إدراوليكو","زيت هيدروليك"],
  [161,"Hydraulic Pressure","Pressione idraulica","هيدروليك بريشر","بريساوني إدراوليكا","ضغط هيدروليكي"],
  [162,"Reservoir","Serbatoio","ريزرفوار","سرباتويو","خزان الزيت"],
  [163,"Pump","Pompa","بامب","بومبا","مضخة"],
  [164,"Flow","Portata","فلو","بورتاتا","معدل التدفق"],
  [165,"Hydraulic Hose","Tubo idraulico","هيدروليك هوز","توبو إدراوليكو","خرطوم هيدروليك"]
]},
{n:"الميكانيكا ونقل الحركة",c:"#0369a1",subj:"mech",t:[
  [166,"Gear","Ingranaggio","جير","إنغراناجيو","ترس"],
  [167,"Gearbox","Riduttore","جيربوكس","ريدوتوري","علبة تروس"],
  [168,"Bearing","Cuscinetto","بيرنج","كوشينيتو","محمل"],
  [169,"Coupling","Giunto","كوبلنج","جيونتو","وصلة"],
  [170,"Belt","Cinghia","بيلت","تشينغيا","سير"],
  [171,"Pulley","Puleggia","بولي","بوليجا","بكرة"],
  [172,"Chain","Catena","تشين","كاتينا","سلسلة"],
  [173,"Sprocket","Pignone","سبروكيت","بينييوني","ترس سلسلة"],
  [174,"Lubrication","Lubrificazione","لوبركيشن","لوبريفيكاتسيوني","تشحيم"],
  [175,"Friction","Attrito","فريكشن","أتريتو","احتكاك"],
  [176,"Force","Forza","فورس","فورتسا","قوة"],
  [177,"Motion","Moto","موشن","موتو","حركة"],
  [178,"Linear Motion","Moto lineare","لينير موشن","موتو لينياري","حركة خطية"],
  [179,"Rotary Motion","Moto rotatorio","روتاري موشن","موتو روتاتوريو","حركة دورانية"]
]},
{n:"الصيانة والسلامة",c:"#15803d",subj:"mech",t:[
  [180,"Maintenance","Manutenzione","مينتنانس","مانوتنتسيوني","صيانة"],
  [181,"Preventive Maintenance","Manutenzione preventiva","بريفنتف مينتنانس","مانوتنتسيوني بريفنتيفا","صيانة وقائية"],
  [182,"Corrective Maintenance","Manutenzione correttiva","كوريكتف مينتنانس","مانوتنتسيوني كوريتيفا","صيانة تصحيحية"],
  [183,"Predictive Maintenance","Manutenzione predittiva","بريدكتف مينتنانس","مانوتنتسيوني بريديتيفا","صيانة تنبؤية"],
  [184,"Troubleshooting","Ricerca guasti","تروبل شوتنج","ريتشركا غواستي","اكتشاف الأعطال وإصلاحها"],
  [185,"Calibration","Taratura","كاليبريشن","تاراتورا","معايرة"],
  [186,"Inspection","Ispezione","إنسبكشن","إسبيتسيوني","فحص"],
  [187,"Safety","Sicurezza","سيفتي","سيكورتسا","سلامة"],
  [188,"Lockout/Tagout","Blocco/Etichettatura","لوك آوت / تاج آوت","بلوكو / إتيكيتاتورا","عزل وتأمين مصدر الطاقة"],
  [189,"PPE","DPI","معدات الوقاية","ديس بوزيتيفي دي بروتيتسيوني إنديفيدوالي","معدات الوقاية الشخصية"]
]},
{n:"لغة إيطالية — أساسيات",c:"#009246",subj:"italian",t:[
  [190,"Hello","Ciao","هالو","تشاو","مرحبا / سلام"],
  [191,"Good morning","Buongiorno","جود مورنينج","بوون جورنو","صباح الخير"],
  [192,"Good evening","Buonasera","جود إيفنينج","بوونا سيرا","مساء الخير"],
  [193,"Goodbye","Arrivederci","جود باي","أريفيديرتشي","إلى اللقاء"],
  [194,"Please","Per favore","بليز","بير فافوري","من فضلك"],
  [195,"Thank you","Grazie","ثانك يو","غراتسيي","شكراً"],
  [196,"Yes","Sì","يس","سي","نعم"],
  [197,"No","No","نو","نو","لا"],
  [198,"Excuse me","Scusi","إكسكيوز مي","سكوزي","عفواً"],
  [199,"How are you?","Come stai?","هاو آر يو","كومي ستاي","كيف حالك؟"],
  [200,"My name is…","Mi chiamo…","ماي نيم إز","مي كيامو","اسمي…"],
  [201,"I am from Egypt","Vengo dall'Egitto","آي آم فروم إيجيبت","فينغو دال إيجيتو","أنا من مصر"],
  [202,"Teacher","Insegnante","تيتشر","إنسينيانتيه","معلّم"],
  [203,"Student","Studente","ستيودنت","ستودينتيه","طالب"],
  [204,"School","Scuola","سكول","سكوولا","مدرسة"],
  [205,"Book","Libro","بوك","ليبرو","كتاب"],
  [206,"Friend","Amico","فريند","أميكو","صديق"],
  [207,"Family","Famiglia","فاميلي","فاميليا","عائلة"],
  [208,"Water","Acqua","ووتر","أكوا","ماء"],
  [209,"Food","Cibo","فوود","تشيبو","طعام"]
]}
];

/* =================================================================
   3) المنهج — مواد ← وحدات ← دروس
   ================================================================= */
let CURRICULUM = {
  italian: [
    { u: "Unità 1 — Grammatica", t: "Articoli e Nomi", subs: [
      { n: "1.1 L'articolo determinativo", i: "🇮🇹", b: [
        { t: "def", term: "Articolo Determinativo — أداة التعريف", x: "في الإيطالية: il, lo, la, l', i, gli, le — تقابل 'الـ' في العربية." },
        { t: "h", x: "القواعد:" },
        { t: "list", x: [
          "il — للمذكر المفرد (il libro — الكتاب)",
          "lo — للمذكر قبل z, s+ساكن, ps, gn (lo studente — الطالب)",
          "la — للمؤنث المفرد (la casa — البيت)",
          "l' — قبل حرف علة (l'amico — الصديق)",
          "i — جمع المذكر (i libri — الكتب)",
          "gli — جمع المذكر قبل حرف علة أو z (gli amici — الأصدقاء)",
          "le — جمع المؤنث (le case — البيوت)"
        ]},
        { t: "note", tag: "ESEMPIO", x: "Il ragazzo legge un libro. — الفتى يقرأ كتاباً." }
      ]},
      { n: "1.2 L'articolo indeterminativo", i: "📘", b: [
        { t: "def", term: "Articolo Indeterminativo — أداة النكرة", x: "في الإيطالية: un, uno, una, un' — تقابل 'واحد/ة' أو بدون أداة في العربية." },
        { t: "list", x: [
          "un — للمذكر (un libro — كتاب)",
          "uno — للمذكر قبل z, s+ساكن, gn (uno studente — طالب)",
          "una — للمؤنث (una casa — بيت)",
          "un' — للمؤنث قبل حرف علة (un'amica — صديقة)"
        ]},
        { t: "note", tag: "ESEMPIO", x: "Ho una penna e un quaderno. — عندي قلم ودفتر." }
      ]},
      { n: "1.3 I nomi — الأسماء", i: "📗", b: [
        { t: "def", term: "Il Nome — الاسم", x: "في الإيطالية كل اسم له جنس (مذكر/مؤنث) وعدد (مفرد/جمع)." },
        { t: "table", h: ["المفرد", "الجمع", "القاعدة"], r: [
          ["libro (كتاب)", "libri", "مذكر ← o ⟶ i"],
          ["casa (بيت)", "case", "مؤنث ← a ⟶ e"],
          ["chiave (مفتاح)", "chiavi", "مؤنث ← e ⟶ i"],
          ["studente (طالب)", "studenti", "مذكر/مؤنث ← e ⟶ i"]
        ]},
        { t: "note", tag: "NOTA", x: "الاستثناءات كثيرة — احفظ الاسم بجنسه من البداية." }
      ]}
    ]},
    { u: "Unità 2 — Lessico", t: "Saluti e Presentazioni", subs: [
      { n: "2.1 I saluti — التحيات", i: "👋", b: [
        { t: "def", term: "I Saluti — التحيات", x: "التعابير الأساسية للتحية في الإيطالية." },
        { t: "list", x: [
          "Ciao — مرحباً / سلام (غير رسمي)",
          "Buongiorno — صباح الخير / نهاراً سعيداً",
          "Buonasera — مساء الخير",
          "Buonanotte — تصبح على خير",
          "Arrivederci — إلى اللقاء (رسمي)",
          "A presto — أراك قريباً",
          "A domani — إلى الغد",
          "Salve — تحية عامة"
        ]},
        { t: "note", tag: "NOTA", x: "Ciao تُستخدم للترحيب والوداع معاً في السياق غير الرسمي." }
      ]},
      { n: "2.2 Presentarsi — تقديم النفس", i: "🙋", b: [
        { t: "def", term: "Presentarsi — التعريف بالنفس", x: "الجمل الأساسية للتعريف بنفسك." },
        { t: "list", x: [
          "Mi chiamo... — اسمي...",
          "Sono... — أنا...",
          "Ho... anni — عمري... سنة",
          "Vengo dall'Egitto — أنا من مصر",
          "Abito al Cairo — أسكن في القاهرة",
          "Piacere! — تشرفنا!",
          "Come ti chiami? — ما اسمك؟"
        ]},
        { t: "note", tag: "DIALOGO", x: "Ciao! Mi chiamo Ahmed. Sono egiziano. Ho 16 anni. Abito al Cairo. Piacere!" }
      ]},
      { n: "2.3 I numeri — الأرقام", i: "🔢", b: [
        { t: "def", term: "I Numeri — الأرقام", x: "الأرقام من 1 إلى 20 بالإيطالية." },
        { t: "table", h: ["الرقم", "Italiano", "النطق"], r: [
          ["1", "uno", "أونو"],
          ["2", "due", "دوويه"],
          ["3", "tre", "تريه"],
          ["4", "quattro", "كواترو"],
          ["5", "cinque", "تشينكويه"],
          ["6", "sei", "سيي"],
          ["7", "sette", "سيتيه"],
          ["8", "otto", "أوتو"],
          ["9", "nove", "نوفيه"],
          ["10", "dieci", "دييتشي"]
        ]}
      ]}
    ]},
    { u: "Unità 3 — Verbi", t: "I Verbi Essenziali", subs: [
      { n: "3.1 Il verbo ESSERE", i: "🔵", b: [
        { t: "def", term: "Essere — يكون", x: "أهم فعل في الإيطالية — يعني 'يكون/يوجد'." },
        { t: "table", h: ["الضمير", "التصريف", "المعنى"], r: [
          ["Io", "sono", "أنا"],
          ["Tu", "sei", "أنت"],
          ["Lui/Lei", "è", "هو/هي"],
          ["Noi", "siamo", "نحن"],
          ["Voi", "siete", "أنتم"],
          ["Loro", "sono", "هم"]
        ]},
        { t: "note", tag: "ESEMPIO", x: "Io sono studente. — أنا طالب." }
      ]},
      { n: "3.2 Il verbo AVERE", i: "🟢", b: [
        { t: "def", term: "Avere — يملك", x: "يعني 'يملك/عنده'، ويُستخدم أيضاً في الأزمنة المركبة." },
        { t: "table", h: ["الضمير", "التصريف", "المعنى"], r: [
          ["Io", "ho", "أنا عندي"],
          ["Tu", "hai", "أنت عندك"],
          ["Lui/Lei", "ha", "هو/هي عنده"],
          ["Noi", "abbiamo", "نحن عندنا"],
          ["Voi", "avete", "أنتم عندكم"],
          ["Loro", "hanno", "هم عندهم"]
        ]},
        { t: "note", tag: "ESEMPIO", x: "Noi abbiamo un libro. — نحن عندنا كتاب." }
      ]},
      { n: "3.3 I verbi regolari -ARE", i: "🟡", b: [
        { t: "def", term: "Verbi in -ARE", x: "أشهر مجموعة أفعال إيطالية (مثل: parlare — يتكلم)." },
        { t: "table", h: ["الضمير", "parlare", "المعنى"], r: [
          ["Io", "parlo", "أنا أتكلم"],
          ["Tu", "parli", "أنت تتكلم"],
          ["Lui/Lei", "parla", "هو/هي يتكلم"],
          ["Noi", "parliamo", "نحن نتكلم"],
          ["Voi", "parlate", "أنتم تتكلمون"],
          ["Loro", "parlano", "هم يتكلمون"]
        ]}
      ]}
    ]},
    { u: "Unità 4 — Frasi Utili", t: "Frasi Quotidiane", subs: [
      { n: "4.1 In classe — في الفصل", i: "🏫", b: [
        { t: "def", term: "Frasi Scolastiche", x: "جمل مفيدة في الفصل الدراسي." },
        { t: "list", x: [
          "Buongiorno, professore! — صباح الخير يا أستاذ!",
          "Posso entrare? — أستطيع الدخول؟",
          "Non capisco. — لا أفهم.",
          "Puoi ripetere? — تعيد من فضلك؟",
          "Come si dice... in italiano? — كيف يُقال... بالإيطالية؟",
          "Che significa? — ماذا يعني؟",
          "Ho una domanda. — عندي سؤال."
        ]}
      ]},
      { n: "4.2 Al bar — في المقهى", i: "☕", b: [
        { t: "def", term: "Al Bar", x: "جمل عند طلب الطعام والشراب." },
        { t: "list", x: [
          "Vorrei un caffè. — أريد قهوة.",
          "Un bicchiere d'acqua, per favore. — كوب ماء، من فضلك.",
          "Il conto, per favore. — الحساب، من فضلك.",
          "Quanto costa? — كم الثمن؟",
          "Buon appetito! — بالهناء والشفاء!"
        ]}
      ]}
    ]}
  ],

  mech: [
    { u: "UNIT 1 — Lesson 1", t: "Occupational Health and Safety", subs: [
      { n: "1.1 What is Occupational Health and Safety?", i: "🦺", b: [
        { t: "p", x: "Warm-up: الحافة الحادة لصفيحة معدن خلف حاجز مناسب — منطقة مسيطر عليها ✅. نفس الحافة مكشوفة في ممر يمر به الناس ⚠️. الخطر نفسه لكن التعرض مختلف!" },
        { t: "def", term: "SAFETY — السلامة", x: "Safety is a condition in which people are not exposed to unacceptable levels of danger." },
        { t: "list", x: ["Physical well-being — السلامة الجسدية","Mental well-being — السلامة النفسية","Social well-being — السلامة الاجتماعية"] },
        { t: "def", term: "OCCUPATIONAL HEALTH — الصحة المهنية", x: "Occupational health is concerned with protecting and supporting physical, mental and social well-being in relation to work." },
        { t: "note", tag: "THINK", x: "Worker finishes a shift without an accident — does this mean the workplace was safe?" }
      ]},
      { n: "1.2 From Hazard to Risk", i: "⚠️", b: [
        { t: "def", term: "HAZARD — الخطر", x: "An inherent property or characteristic that has the potential to cause harm." },
        { t: "def", term: "INCIDENT — حادث كاد يقع", x: "An unplanned event that COULD result in injury but no harm occurred." },
        { t: "def", term: "ACCIDENT — حادثة", x: "An unplanned event that RESULTS in injury or ill health." },
        { t: "def", term: "RISK — المخاطرة", x: "Risk = Likelihood + Severity." },
        { t: "chain", x: ["Hazard","Exposure","Harm"] }
      ]}
    ]},
    { u: "UNIT 1 — Lesson 2", t: "Legal Requirements & Responsibilities", subs: [
      { n: "2.1 From National Law to Workplace Requirements", i: "⚖️", b: [
        { t: "steps", x: ["Primary Legislation","Implementing Regulations","Secondary Legislation"] },
        { t: "chain", x: ["National Law","Regulations","Safe Work"] }
      ]},
      { n: "2.2 Who is Responsible for Workplace Safety?", i: "👥", b: [
        { t: "def", term: "THE EMPLOYER", x: "Holds overall legal responsibility; non-delegable duties." },
        { t: "def", term: "THE SUPERVISOR", x: "Oversees day-to-day work execution." },
        { t: "def", term: "Workers' Safety Representative (RLS)", x: "Represents workers' health and safety concerns." }
      ]}
    ]}
  ],
  english: [
    { u: "Unit 1 — Grammar", t: "Present Tenses", subs: [
      { n: "1.1 Present Simple", i: "📘", b: [
        { t: "def", term: "Present Simple", x: "يُستخدم للحقائق والروتين اليومي: I go to school every day." },
        { t: "list", x: ["Affirmative: Subject + V(s/es)","Negative: Subject + do/does + not + V","Question: Do/Does + Subject + V?"] },
        { t: "note", tag: "EXAMPLE", x: "She studies English every morning." }
      ]},
      { n: "1.2 Present Continuous", i: "📗", b: [
        { t: "def", term: "Present Continuous", x: "يُستخدم للأحداث الجارية الآن: I am studying right now." }
      ]}
    ]}
  ],
  arabic: [
    { u: "الوحدة 1 — النحو", t: "المبتدأ والخبر", subs: [
      { n: "1.1 تعريف المبتدأ والخبر", i: "📗", b: [
        { t: "def", term: "المبتدأ", x: "اسم مرفوع يقع في أول الجملة الاسمية." },
        { t: "def", term: "الخبر", x: "اسم مرفوع يكمل معنى المبتدأ ويُخبر عنه." },
        { t: "note", tag: "مثال", x: "العلمُ نورٌ — العلم: مبتدأ، نور: خبر." }
      ]}
    ]}
  ],
  math: [
    { u: "Unit 1 — Algebra", t: "Equations", subs: [
      { n: "1.1 Linear Equations", i: "🔢", b: [
        { t: "def", term: "Linear Equation", x: "معادلة من الدرجة الأولى على صورة ax + b = 0." },
        { t: "note", tag: "EXAMPLE", x: "2x + 5 = 13 → 2x = 8 → x = 4" }
      ]}
    ]}
  ],
  physics: [
    { u: "Unit 1 — Mechanics", t: "Motion & Forces", subs: [
      { n: "1.1 Speed & Velocity", i: "⚛️", b: [
        { t: "def", term: "Speed", x: "المسافة المقطوعة في وحدة الزمن — كمية قياسية." },
        { t: "def", term: "Velocity", x: "الإزاحة في وحدة الزمن — كمية متجهة." }
      ]}
    ]}
  ],
  chemistry: [
    { u: "Unit 1 — Atomic Structure", t: "Atoms & Elements", subs: [
      { n: "1.1 The Atom", i: "🧪", b: [
        { t: "def", term: "Atom", x: "أصغر وحدة بنائية للمادة تحتفظ بخصائص العنصر." },
        { t: "list", x: ["بروتونات (موجبة)","نيوترونات (متعادلة)","إلكترونات (سالبة)"] }
      ]}
    ]}
  ],
  biology: [
    { u: "Unit 1 — Cell Biology", t: "The Cell", subs: [
      { n: "1.1 Cell Structure", i: "🧬", b: [
        { t: "def", term: "Cell", x: "الوحدة الأساسية لبناء جميع الكائنات الحية." }
      ]}
    ]}
  ],
  social: [
    { u: "الوحدة 1 — الجغرافيا", t: "الموقع والمناخ", subs: [
      { n: "1.1 الموقع الجغرافي", i: "🌍", b: [
        { t: "def", term: "الموقع الجغرافي", x: "الموضع الذي تشغله الدولة على سطح الأرض." }
      ]}
    ]}
  ],
  other: []
};

/* =================================================================
   4) التعريفات
   ================================================================= */
let DEFS = [
["Safety","السلامة","A condition in which people are not exposed to unacceptable levels of danger."],
["Occupational Health","الصحة المهنية","Protecting physical, mental and social well-being in relation to work."],
["Hazard","الخطر","Inherent property with potential to cause harm."],
["Risk","المخاطرة","Likelihood + Severity."],
["Incident","حادث كاد يقع","Unplanned event that COULD result in injury but no harm occurred."],
["Accident","الحادثة","Unplanned event that RESULTED in injury or ill health."],
["Prevention","الوقاية","Measures to anticipate harm and reduce its likelihood."],
["CE Marking","علامة CE","Manufacturer's declaration that EU requirements addressed."]
];

/* =================================================================
   5) بنك الأسئلة
   ================================================================= */
let QB = [
{ les: "LESSON 1 — Foundations", subj: "mech", qs: [
  { k: "tf", n: 1, s: "A hazard is the injury that happens to a worker.", a: false, c: "الخطر مصدر الضرر المحتمل — الإصابة نفسها هي الضرر." },
  { k: "tf", n: 2, s: "Every incident results in an injury.", a: false, c: "الحادث الكاد يقع قد يقع دون أي ضرر فعلي." },
  { k: "d", n: 3, s: "Hazard", a: "خطر: خاصية متأصلة لها القدرة على إحداث ضرر." },
  { k: "w", n: 4, s: "Explain why the absence of an accident does not mean the workplace is safe.", a: "لأن الأخطار قد تبقى كامنة غير مكتشفة." }
]}
];

/* =================================================================
   6) الاختبار السريع
   ================================================================= */
let QUIZ = [
{ q: "Which two responsibilities of the Employer cannot be delegated?", o: ["Conducting risk assessment and appointing Head of Prevention","Supervising daily work","Representing workers"], a: 0, e: "واجبات صاحب العمل غير القابلة للتفويض." },
{ q: "What is the main role of the Supervisor?", o: ["Medical examinations","Oversee correct work execution","Represent worker interests"], a: 1, e: "المشرف يشرف على التنفيذ اليومي." },
{ q: "A worker slips but stays on his feet. This is:", o: ["An accident","An incident","A hazard"], a: 1, e: "لا ضرر فعلي حدث = Incident." }
];

/* ================= أدوات ================= */
const $=id=>document.getElementById(id);
function esc(s){return String(s).replace(/[&<>"]/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[m]))}

/* ================= التبويبات ================= */
function initTabs(){
  document.querySelectorAll(".tab").forEach(b=>b.onclick=()=>{
    document.querySelectorAll(".tab").forEach(x=>x.classList.remove("active"));
    document.querySelectorAll(".pane").forEach(x=>x.classList.remove("show"));
    b.classList.add("active");$(b.dataset.p).classList.add("show");window.scrollTo(0,0);
  });
}

/* ================= القاموس ================= */
function buildDict(){
  const dict=$("dict");dict.innerHTML="";
  SECTIONS.forEach((S,si)=>{
    const sec=document.createElement("section");
    sec.className="sec";sec.style.setProperty("--c",S.c);sec.dataset.si=si;
    sec.dataset.subj=S.subj||"";
    sec.innerHTML=`<div class="sec-h" onclick="this.parentElement.classList.toggle('closed')">
      <h2>🗂️ ${esc(S.n)}</h2>
      <div style="display:flex;align-items:center;gap:6px">
        <button class="btn-speak" onclick="event.stopPropagation();speakSection(${si})" title="نطق القسم بالإنجليزية والإيطالية">🔊 نطق الكل</button>
        <span class="rng">${S.t[0][0]}–${S.t[S.t.length-1][0]}</span>
      </div>
    </div>
    <div class="sec-b"><table><thead><tr>
      <th>#</th>
      <th>English 🇬🇧</th>
      <th>Italiano 🇮🇹</th>
      <th>نطق إنجليزي</th>
      <th>نطق إيطالي</th>
      <th>المعنى</th>
    </tr></thead>
    <tbody>${S.t.map(t=>`<tr data-f="${esc((t[1]+" "+t[2]+" "+t[3]+" "+t[4]+" "+t[5]).toLowerCase())}">
        <td class="num">${t[0]}</td>
        <td class="en" onclick="speak('${esc(t[1].replace(/'/g,"\\'"))}','en-US')" title="اضغط للسماع">${esc(t[1])} <span class="spk">🔊</span></td>
        <td class="it" onclick="speak('${esc(t[2].replace(/'/g,"\\'"))}','it-IT')" title="Clicca per ascoltare">${esc(t[2])} <span class="spk">🔊</span></td>
        <td class="pro">${esc(t[3])}</td>
        <td class="pro-it">${esc(t[4])}</td>
        <td>${esc(t[5])}</td>
      </tr>`).join("")}
    </tbody></table></div>`;
    dict.appendChild(sec);
  });
  buildChips();
}
function buildChips(){
  const chips=$("chips");chips.innerHTML="";
  [{n:"الكل"}].concat(SECTIONS).forEach((S,i)=>{
    const b=document.createElement("button");
    b.className="chip"+(i?"":" active");
    b.textContent=i?S.n:"📚 الكل";
    b.dataset.si=i-1;
    b.onclick=()=>{
      chips.querySelectorAll(".chip").forEach(c=>c.classList.remove("active"));
      b.classList.add("active");f1();
    };
    chips.appendChild(b);
  });
}
function f1(){
  const q=$("q1").value.trim().toLowerCase();
  const act=chips.querySelector(".active");
  const si=act?+act.dataset.si:-1;
  let v=0;
  $("dict").querySelectorAll(".sec").forEach(sec=>{
    let s=0;
    sec.querySelectorAll("tbody tr").forEach(tr=>{
      const ok=(si===-1||si===+sec.dataset.si)&&(!q||tr.dataset.f.includes(q));
      tr.style.display=ok?"":"none";if(ok)s++;
    });
    sec.style.display=s?"":"none";v+=s;
  });
  $("c1").textContent=q?v+" نتيجة":"";
  $("e1").style.display=v?"none":"block";
}

/* ================= الدروس ================= */
function blk(b){
  if(b.t==="h")return `<div class="blk"><h4>${esc(b.x)}</h4></div>`;
  if(b.t==="p")return `<div class="blk"><p>${esc(b.x)}</p></div>`;
  if(b.t==="list")return `<div class="blk"><ul>${b.x.map(i=>`<li>${esc(i)}</li>`).join("")}</ul></div>`;
  if(b.t==="steps")return `<div class="blk"><ol>${b.x.map(i=>`<li>${esc(i)}</li>`).join("")}</ol></div>`;
  if(b.t==="def")return `<div class="blk defbox"><span class="term">📖 ${esc(b.term)}</span><div class="x">${esc(b.x)}</div></div>`;
  if(b.t==="note")return `<div class="blk notebox"><span class="tag">${esc(b.tag)}</span>${esc(b.x)}</div>`;
  if(b.t==="chain")return `<div class="blk chain">${b.x.map((x,i)=>`<b>${esc(x)}</b>${i<b.x.length-1?"<span>←</span>":""}`).join("")}</div>`;
  return "";
}
function buildLessons(){
  const lessons=$("lessons");lessons.innerHTML="";
  Object.keys(SUBJECTS).forEach(subjKey=>{
    const units = CURRICULUM[subjKey] || [];
    if(!units.length) return;
    const subj = SUBJECTS[subjKey];
    const hdr = document.createElement("div");
    hdr.className = "subject-hdr";
    hdr.id = "subj-hdr-"+subjKey;
    hdr.style.setProperty("--sc", subj.color);
    const totalSubs = units.reduce((a,u)=>a+u.subs.length,0);
    hdr.innerHTML = `<span><span class="em">${subj.icon}</span>${esc(subj.name)}</span>
      <span class="badge">${totalSubs} درس</span>`;
    lessons.appendChild(hdr);
    units.forEach((U, ui)=>{
      const u = document.createElement("div");
      u.className = "unit";
      u.innerHTML = `<h2>📘 ${esc(U.u)} — ${esc(U.t)}</h2>`;
      U.subs.forEach((sub, si)=>{
        const s = document.createElement("div");
        s.className = "sub";
        s.style.setProperty("--c2", subj.color);
        const key = subjKey + "-" + ui + "-" + si;
        s.id = "les-" + key;
        s.innerHTML = `<div class="sub-h" onclick="this.parentElement.classList.toggle('closed')">
            <h3>${sub.i} ${esc(sub.n)}</h3>
            <span style="color:var(--muted);font-size:12px">▾</span></div>
            <div class="sub-b">${sub.b.map(blk).join("")}</div>`;
        u.appendChild(s);
      });
      lessons.appendChild(u);
    });
  });
}
function f2(){
  const q=$("q2").value.trim().toLowerCase();let v=0;
  $("lessons").querySelectorAll(".sub").forEach(s=>{
    const ok=!q||s.textContent.toLowerCase().includes(q);
    s.style.display=ok?"":"none";
    if(ok){v++;if(q)s.classList.remove("closed");}
  });
  $("lessons").querySelectorAll(".subject-hdr").forEach(h=>{
    let any=false;let el=h.nextElementSibling;
    while(el && !el.classList.contains("subject-hdr")){
      if(el.querySelector(".sub") && [...el.querySelectorAll(".sub")].some(x=>x.style.display!=="none")){
        any=true;break;
      }
      el=el.nextElementSibling;
    }
    h.style.display=any?"":"none";
  });
  $("c2").textContent=q?v+" درس":"";
  $("e2").style.display=v?"none":"block";
}

/* ================= التعريفات ================= */
function buildDefs(){
  const defs=$("defs");defs.innerHTML="";
  DEFS.forEach(d=>{
    const c=document.createElement("div");
    c.className="dcard";
    c.dataset.f=esc((d[0]+" "+d[2]).toLowerCase());
    c.innerHTML=`<div class="q">${esc(d[0])}<small>${esc(d[1])}</small></div>
      <div class="a">${esc(d[2])}</div>
      <div class="hint">👆 اضغط لكشف التعريف</div>`;
    c.onclick=()=>c.classList.toggle("flip");
    defs.appendChild(c);
  });
}
function f3(){
  const q=$("q3").value.trim().toLowerCase();let v=0;
  $("defs").querySelectorAll(".dcard").forEach(c=>{
    const ok=!q||c.dataset.f.includes(q);c.style.display=ok?"":"none";if(ok)v++;
  });
  $("c3").textContent=q?v+" بطاقة":"";
  $("e3").style.display=v?"none":"block";
}

/* ================= بنك الأسئلة ================= */
const secNames={tf:"A. صح أم خطأ",d:"B. تعريفات",w:"C. إجابات كتابية"};
function buildQBank(){
  const qbank=$("qbank");qbank.innerHTML="";
  QB.forEach((L,li)=>{
    const box=document.createElement("div");
    box.className="qb-les";box.id="qb-"+li;
    let html=`<h2>📝 ${esc(L.les)}</h2>`,last="";
    L.qs.forEach(q=>{
      if(q.k!==last){last=q.k;html+=`<div class="qb-sec"><b>${secNames[q.k]||q.k}</b></div>`;}
      const col={tf:"#2563eb",d:"#16a34a",w:"#ea580c"}[q.k]||"#2563eb";
      if(q.k==="tf"){
        html+=`<div class="qcard" data-f="${esc(q.s.toLowerCase())}" data-c="${esc(q.c)}" data-a="${q.a?1:0}" style="--qc:${col}">
          <div class="qn">سؤال ${q.n}</div><div class="st">${esc(q.s)}</div>
          <div class="tfrow">
            <button class="tfbtn" onclick="tfAns(this,true)">✅ صح</button>
            <button class="tfbtn" onclick="tfAns(this,false)">❌ خطأ</button>
          </div>
          <div class="ansbox"></div></div>`;
      }else{
        html+=`<div class="qcard" data-f="${esc(q.s.toLowerCase())}" style="--qc:${col}">
          <div class="qn">سؤال ${q.n}</div>
          <div class="st">${esc(q.s)}</div>
          <button class="reveal" onclick="toggleAns(this)">👁️ إظهار الإجابة</button>
          <div class="ansbox">✍️ ${esc(q.a)}</div></div>`;
      }
    });
    box.innerHTML=html;qbank.appendChild(box);
  });
}
function toggleAns(btn){
  const ab=btn.nextElementSibling;ab.classList.toggle("show");
  btn.textContent=ab.classList.contains("show")?"🙈 إخفاء الإجابة":"👁️ إظهار الإجابة";
}
function tfAns(btn,pick){
  const card=btn.closest(".qcard"),truth=card.dataset.a==="1";
  card.querySelectorAll(".tfbtn").forEach(b=>b.disabled=true);
  if(pick===truth)btn.classList.add("right");
  else{btn.classList.add("wrong");card.querySelectorAll(".tfbtn")[truth?0:1].classList.add("right");}
  const ab=card.querySelector(".ansbox");
  ab.innerHTML=(truth?"✅ <b>الإجابة الصحيحة: صح</b><br>":"❌ <b>الإجابة الصحيحة: خطأ</b><br>")+esc(card.dataset.c);
  ab.classList.add("show");
}
function f4(){
  const q=$("q4").value.trim().toLowerCase();let v=0;
  $("qbank").querySelectorAll(".qb-les").forEach(box=>{
    let bv=0;
    box.querySelectorAll(".qcard").forEach(c=>{
      const ok=!q||c.dataset.f.includes(q);
      c.style.display=ok?"":"none";if(ok){bv++;v++;}
    });
    box.style.display=bv?"":"none";
  });
  $("c4").textContent=q?v+" سؤال":"";
  $("e4").style.display=v?"none":"block";
}

/* ================= الاختبار السريع ================= */
let QI=[],QX=0,QS=0;
function startQuiz(){
  QI=[...QUIZ.keys()];
  for(let i=QI.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[QI[i],QI[j]]=[QI[j],QI[i]]}
  QX=0;QS=0;showQ();
}
function showQ(){
  const q=QUIZ[QI[QX]],el=$("quiz");
  el.innerHTML=`<div class="pbar"><i style="width:${QX/QUIZ.length*100}%"></i></div>
  <div class="qn">سؤال ${QX+1} من ${QUIZ.length} • ✅ ${QS}</div>
  <div class="qt">${esc(q.q)}</div>
  ${q.o.map((o,i)=>`<button class="opt" onclick="ans(${i})">${esc(o)}</button>`).join("")}
  <div class="exp" id="exp"></div><div class="qrow" id="qrow"></div>`;
}
function ans(i){
  const q=QUIZ[QI[QX]],opts=$("quiz").querySelectorAll(".opt");
  opts.forEach((b,j)=>{b.disabled=true;if(j===q.a)b.classList.add("right");else if(j===i)b.classList.add("wrong")});
  if(i===q.a)QS++;
  const e=$("exp");e.innerHTML=(i===q.a?"✅ <b>إجابة صحيحة!</b> ":"❌ <b>الإجابة الصحيحة موضحة بالأخضر.</b> ")+esc(q.e);
  e.classList.add("show");
  $("qrow").innerHTML=`<button class="qbtn" onclick="nextQ()">${QX+1<QUIZ.length?"التالي ←":"النتيجة 🏁"}</button>`;
}
function nextQ(){
  QX++;
  if(QX<QUIZ.length)showQ();
  else{
    const p=Math.round(QS/QUIZ.length*100);
    const best=Math.max(p,+(localStorage.getItem("mech-best")||0));
    localStorage.setItem("mech-best",best);
    const em=p>=85?"🏆":p>=70?"🎉":p>=50?"👍":"💪";
    $("quiz").innerHTML=`<div class="result"><div class="em">${em}</div>
      <h3>نتيجتك: ${QS} / ${QUIZ.length} (${p}%)</h3>
      <p style="color:var(--muted);font-size:14px">🏅 أفضل نتيجة: <b>${best}%</b></p>
      <div class="qrow" style="margin-top:16px">
        <button class="qbtn" onclick="startQuiz()">🔄 إعادة</button>
      </div></div>`;
  }
}

/* ================= القائمة الجانبية ================= */
function getStudied(){try{return JSON.parse(localStorage.getItem("mech-studied")||"[]")}catch(e){return[]}}
function updProg(){
  const s=getStudied();
  const total=Object.values(CURRICULUM).reduce((a,units)=>a+units.reduce((b,u)=>b+u.subs.length,0),0);
  if(total===0){$("progTxt").textContent="0 / 0";return;}
  $("progTxt").textContent=s.length+" / "+total;
  $("progFill").style.width=(s.length/total*100)+"%";
}
function toggleStudied(k,ev){
  if(ev)ev.stopPropagation();
  const s=getStudied(),i=s.indexOf(k);
  if(i<0)s.push(k);else s.splice(i,1);
  localStorage.setItem("mech-studied",JSON.stringify(s));
  const c=$("chk-"+k);
  if(c){c.textContent=s.includes(k)?"✓":"○";c.classList.toggle("done",s.includes(k));}
  updProg();
}
function buildNav(){
  const navL = $("navSubjects");navL.innerHTML = "";
  Object.keys(SUBJECTS).forEach(subjKey=>{
    const units = CURRICULUM[subjKey] || [];
    if(!units.length) return;
    const subj = SUBJECTS[subjKey];
    const totalSubs = units.reduce((a,u)=>a+u.subs.length,0);
    const subjBtn = document.createElement("button");
    subjBtn.className = "subj-gt";
    subjBtn.style.setProperty("--sc", subj.color);
    subjBtn.innerHTML = `<span>${subj.icon} ${esc(subj.name)}</span>
      <span style="display:flex;align-items:center;gap:4px">
        <span class="cnt">${totalSubs}</span><span class="arw">▾</span>
      </span>`;
    const subjBody = document.createElement("div");
    subjBody.className = "subj-body";
    units.forEach((U, ui)=>{
      const unitBtn = document.createElement("button");
      unitBtn.className = "unit-gt";
      unitBtn.style.setProperty("--sc", subj.color);
      unitBtn.innerHTML = `<span>📘 ${esc(U.u)}</span><span class="arw">▾</span>`;
      const unitBody = document.createElement("div");
      unitBody.className = "unit-body";
      U.subs.forEach((sub, si)=>{
        const key = subjKey + "-" + ui + "-" + si;
        const it = document.createElement("div");
        it.className = "nav-i";
        it.id = "nav-"+key;
        it.style.setProperty("--sc", subj.color);
        it.innerHTML = `<span class="nav-t">${sub.i} ${esc(sub.n)}</span>
          <button class="chk" id="chk-${key}" onclick="toggleStudied('${key}',event)" title="علّم كمذاكَر">○</button>`;
        it.querySelector(".nav-t").onclick = ()=>navGo("p2","les-"+key,"nav-"+key);
        unitBody.appendChild(it);
      });
      unitBtn.onclick = ()=>{
        unitBody.classList.toggle("open");
        unitBtn.querySelector(".arw").textContent = unitBody.classList.contains("open")?"▴":"▾";
      };
      subjBody.appendChild(unitBtn);
      subjBody.appendChild(unitBody);
    });
    subjBtn.onclick = ()=>{
      subjBody.classList.toggle("open");
      subjBtn.querySelector(".arw").textContent = subjBody.classList.contains("open")?"▴":"▾";
    };
    navL.appendChild(subjBtn);
    navL.appendChild(subjBody);
  });
  getStudied().forEach(k=>{const c=$("chk-"+k);if(c){c.textContent="✓";c.classList.add("done");}});
  updProg();
}

/* ================= التنقل ================= */
let activeNav=null;
function navGo(tab,item,navId){
  const tb=document.querySelector('.tab[data-p="'+tab+'"]');
  if(tb)tb.click();
  if(activeNav)activeNav.classList.remove("on");
  if(navId){const n=$(navId);if(n){n.classList.add("on");activeNav=n;}}
  closeSide();
  if(item)setTimeout(()=>{
    document.querySelectorAll("#lessons .sub").forEach(x=>x.classList.add("closed"));
    document.querySelectorAll("#lessons .sub").forEach(x=>x.style.display="");
    document.querySelectorAll("#lessons .subject-hdr").forEach(x=>x.style.display="");
    const el=$(item);
    if(el){
      el.classList.remove("closed");
      el.scrollIntoView({behavior:"smooth",block:"start"});
      el.classList.add("flash");
      setTimeout(()=>el.classList.remove("flash"),1900);
    }
  },120);
}
function openSide(){$("side").classList.add("open");$("sideback").classList.add("show")}
function closeSide(){$("side").classList.remove("open");$("sideback").classList.remove("show")}

/* ================= الوضع الليلي ================= */
function theme(){
  const d=document.documentElement.dataset.theme==="dark";
  document.documentElement.dataset.theme=d?"":"dark";
  $("thBtn").textContent=d?"🌙 وضع ليلي":"☀️ وضع نهاري";
  localStorage.setItem("mech-theme",d?"":"dark");
}

/* ================= زر الصعود ================= */
const goToTopButton=document.getElementById('go-to-top-button');
window.addEventListener('scroll',()=>{
  goToTopButton.style.display=window.scrollY>100?'flex':'none';
});
goToTopButton.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));

/* =================================================================
   نظام PDF — عن طريق روابط GitHub
   ================================================================= */
const LINKS_KEY = 'mech_pdf_links_v1';

function getLinks(){
  try{ return JSON.parse(localStorage.getItem(LINKS_KEY)||'[]'); }
  catch(e){ return []; }
}
function saveLinks(arr){ localStorage.setItem(LINKS_KEY, JSON.stringify(arr)); }
function addLink(link){
  const arr = getLinks();
  link.id = 'lnk_'+Date.now()+'_'+Math.random().toString(36).slice(2,7);
  arr.push(link);
  saveLinks(arr);
  return link.id;
}
function removeLink(id){
  saveLinks(getLinks().filter(x => x.id !== id));
}
function clearAllLinks(){ saveLinks([]); }

async function fetchPdfBuffer(url){
  const resp = await fetch(url);
  if(!resp.ok) throw new Error('HTTP ' + resp.status);
  return await resp.arrayBuffer();
}
async function extractTextFromUrl(url){
  const buf = await fetchPdfBuffer(url);
  const u8 = new Uint8Array(buf);
  const pdf = await pdfjsLib.getDocument({ data: u8 }).promise;
  let fullText = '';
  for(let i=1; i<=pdf.numPages; i++){
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    let lastY = null, line = '';
    const lines = [];
    content.items.forEach(item=>{
      if(lastY !== null && Math.abs(item.transform[5]-lastY) > 5){
        lines.push(line.trim()); line = '';
      }
      line += item.str + ' ';
      lastY = item.transform[5];
    });
    if(line.trim()) lines.push(line.trim());
    fullText += '\n' + lines.join('\n');
  }
  return fullText;
}

/* ================= تحليل النصوص ================= */
function parseDict(text){
  const rows=[];let counter=1;
  text.split('\n').forEach(line=>{
    line=line.trim();
    if(!line||line.length<4)return;
    if(/^[A-Z\s]{3,}$/.test(line)&&line.split(' ').length<4&&!/[a-z]/.test(line))return;
    let parts=line.split(/\s*[|•\t]\s*/);
    if(parts.length<2)parts=line.split(/\s+[-–—:]\s+/);
    if(parts.length>=2){
  const en=parts[0].trim();
  const meaning=parts.slice(1).join(' | ').trim();
  rows.push([counter++, en, en, meaning, meaning, meaning]);
}
  });
  return rows;
}
function parseLessons(text){
  const lessons=[];const lines=text.split('\n');let current=null;
  const titleRe=/^\s*(Unit|UNIT|Lesson|LESSON|Chapter|CHAPTER|الوحدة|الدرس|الباب|الفصل)\s*[\d\-\.:]*/;
  lines.forEach(raw=>{
    const line=raw.trim();if(!line)return;
    if(titleRe.test(line)||(line.length<80&&/^[A-Z][A-Za-z\s\d\-:]{5,}$/.test(line)&&line===line.toUpperCase())){
      if(current)lessons.push(current);
      current={u:'PDF Lesson',t:line,subs:[{n:line,i:'📄',b:[]}]};
    }else if(current){
      current.subs[0].b.push({t:'p',x:line});
    }else{
      current={u:'PDF Lesson',t:'محتوى PDF',subs:[{n:'المحتوى',i:'📄',b:[]}]};
      current.subs[0].b.push({t:'p',x:line});
    }
  });
  if(current)lessons.push(current);
  return lessons;
}
function parseQBank(text){
  const questions=[];const lines=text.split('\n').map(l=>l.trim()).filter(Boolean);
  let i=0,qNum=1;
  while(i<lines.length){
    const line=lines[i];
    if(/^(True|False|صح|خطأ)\s*[:：\-]/i.test(line)||/\?\s*$/.test(line)){
      const q=line;const opts=[];let j=i+1;
      while(j<lines.length&&/^[a-dA-D1-4][\)\.\-:]\s*/.test(lines[j])){
        opts.push(lines[j].replace(/^[a-dA-D1-4][\)\.\-:]\s*/,'').trim());j++;
      }
      let answer='يرجى مراجعة المصدر.';
      const ansMatch=lines.slice(i,j).join(' ').match(/Answer|الإجابة\s*[:：]\s*(.+)/i);
      if(ansMatch)answer=ansMatch[1];
      questions.push({k:'w',n:qNum,s:q,a:answer});
      qNum++;i=j;
    }else i++;
  }
  return questions;
}
function parseDefs(text){
  const defs=[];
  text.split('\n').forEach(line=>{
    line=line.trim();if(!line||line.length<8)return;
    const m=line.match(/^(.{2,60}?)\s*[=:–—]\s*(.{5,})$/);
    if(m)defs.push([m[1].trim(),m[1].trim(),m[2].trim()]);
  });
  return defs;
}

/* ================= إعادة البناء ================= */
async function rebuildFromLinks(){
  const links = getLinks();
  pvFiles = links;
  renderPdfList(links);
  if(!links.length) return false;

  const status = $('pdfStatus');
  status.textContent = '⏳ جارٍ معالجة ' + links.length + ' ملف...';

  SECTIONS = SECTIONS.filter(s => !s._fromPDF);
  Object.keys(CURRICULUM).forEach(k => {
    CURRICULUM[k] = CURRICULUM[k].filter(u => !u._fromPDF);
  });
  DEFS = DEFS.filter(d => !d._fromPDF);
  QB = QB.filter(l => !l._fromPDF);

  let dictCnt=0, lesCnt=0, qCnt=0, defCnt=0;

  for(const f of links){
    try{
      const text = await extractTextFromUrl(f.url);
      const subj = f.subj || 'other';

      if(f.type === 'dict'){
  const raw = parseDict(text);
  // نحوّل كل صف لـ 6 عناصر: [num, EN, IT, نطق EN, نطق IT, معنى]
  const rows = raw.map(r => [r[0], r[1], r[2] || r[1], r[3] || '', r[4] || '', r[5] || r[3] || '']);
  if(rows.length){
    const subjInfo = SUBJECTS[subj] || SUBJECTS.other;
    SECTIONS.push({
      n: '📄 ' + f.name + ' — ' + subjInfo.name,
      c: subjInfo.color, subj, _fromPDF: true, t: rows
    });
    dictCnt += rows.length;
  }
}
      if(f.type === 'lessons'){
        const lessons = parseLessons(text);
        lessons.forEach(L=>{
          L._fromPDF = true;
          L.u = '📄 ' + f.name;
        });
        if(!CURRICULUM[subj]) CURRICULUM[subj] = [];
        CURRICULUM[subj].push(...lessons);
        lesCnt += lessons.length;
      }
      if(f.type === 'qbank'){
        const questions = parseQBank(text);
        if(questions.length){
          QB.push({ les: '📝 ' + f.name, subj, _fromPDF: true, qs: questions });
          qCnt += questions.length;
        }
      }
      if(f.type === 'defs'){
        const defs = parseDefs(text);
        defs.forEach(d => d._fromPDF = true);
        DEFS.push(...defs);
        defCnt += defs.length;
      }
    }catch(err){ console.error('❌', f.name, err); }
  }

  buildDict();buildLessons();buildDefs();buildQBank();buildNav();startQuiz();

  status.innerHTML = `✅ تم تحميل ${links.length} ملف — قاموس: ${dictCnt} • دروس: ${lesCnt} • أسئلة: ${qCnt} • تعريفات: ${defCnt}`;
  return true;
}

function renderPdfList(links){
  const list = $('pdfList');list.innerHTML = '';
  if(!links.length) return;
  const typeNames = {lessons:'📖',dict:'📚',qbank:'📝',defs:'🃏'};
  links.forEach(f=>{
    const subj = SUBJECTS[f.subj] || SUBJECTS.other;
    const el = document.createElement('div');
    el.className = 'pdf-item';
    el.innerHTML = `<span>${typeNames[f.type]||'📄'} <b>${esc(f.name)}</b> 
        <small style="color:${subj.color};font-weight:700">— ${subj.icon} ${esc(subj.name)}</small></span>
      <span style="display:flex;gap:5px">
        <button class="view" onclick="pvOpen('${f.id}')">👁️ عرض</button>
        <button class="del" onclick="removePdf('${f.id}')">🗑️</button>
      </span>`;
    list.appendChild(el);
  });
}
async function removePdf(id){
  if(!confirm('حذف هذا الملف؟')) return;
  removeLink(id);
  await rebuildFromLinks();
}

/* =================================================================
   عارض PDF — من الرابط مباشرة
   ================================================================= */
let pvPdf = null, pvPage = 1, pvId = null, pvFiles = null;

async function pvOpen(id){
  const files = pvFiles || getLinks();
  pvFiles = files;
  const f = files.find(x => x.id === id);
  if(!f){ alert('الملف غير موجود'); return; }

  pvId = id;pvPage = 1;
  $('pvTitle').textContent = f.name;
  $('pdfViewer').classList.add('show');
  $('pdfCanvasWrap').innerHTML = '<div class="pdf-loading">⏳ جارٍ التحميل...</div>';
  $('pdfThumbs').innerHTML = '';
  document.body.style.overflow = 'hidden';

  try{
    console.log('📄 فتح:', f.name, '|', f.url);
    const loadingTask = pdfjsLib.getDocument({
      url: f.url,
      cMapUrl: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/',
      cMapPacked: true
    });
    pvPdf = await loadingTask.promise;
    console.log('✅ صفحات:', pvPdf.numPages);
    $('pvTotal').textContent = pvPdf.numPages;
    await pvRender(1);
    pvBuildThumbs().catch(e => console.warn('thumbs', e));
  }catch(err){
    console.error('❌', err);
    $('pdfCanvasWrap').innerHTML =
      '<div class="pdf-loading">❌ فشل تحميل الملف<br>' +
      '<small style="font-size:12px;opacity:.8;line-height:1.6">' +
      'تأكد أن الرابط من نوع <b>raw.githubusercontent.com</b>' +
      '</small></div>';
  }
}
async function pvRender(n){
  if(!pvPdf) return;
  if(n<1 || n>pvPdf.numPages) return;
  pvPage = n;
  $('pvCur').textContent = n;
  $('pvPrev').disabled = n <= 1;
  $('pvNext').disabled = n >= pvPdf.numPages;

  try{
    const page = await pvPdf.getPage(n);
    const containerW = Math.min(window.innerWidth - 60, 1000);
    const containerH = window.innerHeight - 220;
    const vp1 = page.getViewport({ scale: 1 });
    const scale = Math.min(containerW / vp1.width, containerH / vp1.height, 2.5);
    const vp = page.getViewport({ scale });

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.floor(vp.width * dpr);
    canvas.height = Math.floor(vp.height * dpr);
    canvas.style.width = Math.floor(vp.width) + 'px';
    canvas.style.height = Math.floor(vp.height) + 'px';
    ctx.scale(dpr, dpr);
    await page.render({ canvasContext: ctx, viewport: vp }).promise;

    $('pdfCanvasWrap').innerHTML = '';
    $('pdfCanvasWrap').appendChild(canvas);
    document.querySelectorAll('.pdf-thumb').forEach((t,i)=>{
      t.classList.toggle('on', i+1 === n);
    });
    $('pdfViewer').scrollTop = 0;
  }catch(err){
    console.error('render', err);
    $('pdfCanvasWrap').innerHTML = '<div class="pdf-loading">❌ فشل عرض الصفحة ' + n + '</div>';
  }
}
async function pvBuildThumbs(){
  const wrap = $('pdfThumbs');wrap.innerHTML = '';
  const total = pvPdf.numPages;
  for(let i=1; i<=total; i++){
    try{
      const page = await pvPdf.getPage(i);
      const vp = page.getViewport({ scale: 0.18 });
      const canvas = document.createElement('canvas');
      canvas.width = vp.width;canvas.height = vp.height;
      const ctx = canvas.getContext('2d');
      await page.render({ canvasContext: ctx, viewport: vp }).promise;
      const thumb = document.createElement('div');
      thumb.className = 'pdf-thumb' + (i===pvPage?' on':'');
      thumb.appendChild(canvas);
      thumb.onclick = ()=> pvRender(i);
      wrap.appendChild(thumb);
    }catch(e){ console.warn('thumb '+i, e); }
  }
}
function pvGo(dir){ pvRender(pvPage + dir); }
function pvClose(){
  $('pdfViewer').classList.remove('show');
  document.body.style.overflow = '';
  pvPdf = null;
  $('pdfCanvasWrap').innerHTML = '<div class="pdf-loading">⏳ جارٍ التحميل...</div>';
  $('pdfThumbs').innerHTML = '';
}
document.addEventListener('keydown', e=>{
  if(!$('pdfViewer').classList.contains('show')) return;
  if(e.key === 'ArrowRight' || e.key === 'ArrowDown'){ e.preventDefault(); pvGo(1); }
  if(e.key === 'ArrowLeft'  || e.key === 'ArrowUp'){   e.preventDefault(); pvGo(-1); }
  if(e.key === 'Escape') pvClose();
});
let pvResizeTimer;
window.addEventListener('resize', ()=>{
  if(!pvPdf) return;
  clearTimeout(pvResizeTimer);
  pvResizeTimer = setTimeout(()=> pvRender(pvPage), 250);
});

/* ================= أزرار الإضافة والحذف ================= */
document.getElementById('addPdfBtn').addEventListener('click', async ()=>{
  const subj = $('pdfSubject').value;
  const type = $('pdfType').value;
  let name = $('pdfName').value.trim();
  const url  = $('pdfUrl').value.trim();

  if(!url){ alert('❌ لازم تلصق رابط PDF'); return; }
  if(!/^https?:\/\//i.test(url)){ alert('❌ الرابط لازم يبدأ بـ http'); return; }
  if(url.includes('github.com') && url.includes('/blob/') && !url.includes('raw.githubusercontent')){
    const go = confirm('⚠️ الرابط من نوع blob مش Raw\nلازم تستخدم رابط "Raw"\nهل تكمل؟');
    if(!go) return;
  }
  if(!name){
    const parts = url.split('/');
    name = decodeURIComponent(parts[parts.length-1] || 'ملف').replace(/\.pdf$/i,'');
  }

  $('addPdfBtn').disabled = true;
  $('addPdfBtn').textContent = '⏳...';
  $('pdfStatus').textContent = '⏳ جارٍ التحقق...';

  try{
    const test = await fetch(url, { method: 'HEAD' });
    if(!test.ok) throw new Error('HTTP ' + test.status);
  }catch(e){
    alert('❌ الرابط مش شغال: ' + e.message + '\n\nتأكد:\n1. raw.githubusercontent.com\n2. الملف public');
    $('addPdfBtn').disabled = false;
    $('addPdfBtn').textContent = '➕ إضافة';
    $('pdfStatus').textContent = '❌ فشل التحقق';
    return;
  }

  addLink({ name, url, subj, type });
  $('pdfName').value = '';
  $('pdfUrl').value = '';
  $('addPdfBtn').disabled = false;
  $('addPdfBtn').textContent = '➕ إضافة';
  await rebuildFromLinks();
});

document.getElementById('clearPdf').addEventListener('click', async ()=>{
  if(!confirm('حذف كل الروابط؟')) return;
  clearAllLinks();
  location.reload();
});

/* ================= اختصارات ================= */
document.addEventListener("keydown", e=>{
  if(e.key === "Escape") closeSide();
  if(e.key === "/" && !/input/i.test(document.activeElement.tagName)){
    e.preventDefault();
    const panes = [...document.querySelectorAll(".pane")];
    const i = panes.findIndex(p=>p.classList.contains("show"));
    const map = {0:"q1",1:"q2",2:"q3",3:"q4"};
    const el = $(map[i]); if(el) el.focus();
  }
});

/* ================= التهيئة ================= */
async function init(){
  initTabs();
  buildDict();buildLessons();buildDefs();buildQBank();buildNav();startQuiz();

  if(localStorage.getItem("mech-theme") === "dark"){
    document.documentElement.dataset.theme = "dark";
    $("thBtn").textContent = "☀️ وضع نهاري";
  }

  $("q1").oninput = f1;
  $("q2").oninput = f2;
  $("q3").oninput = f3;
  $("q4").oninput = f4;

  try{ await rebuildFromLinks(); }
  catch(e){ console.warn('خطأ:', e); }
}
init();