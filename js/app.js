/* ================= النطق الصوتي ================= */
let soundOn = localStorage.getItem('mech-sound') !== '0';
let currentSpokenEl = null;  // ⬅️ جديد: العنصر اللي بيتكلم حالياً

function speak(text, lang = 'en-US', rate = 0.85, el = null) {
  if (!soundOn) return;
  if (!('speechSynthesis' in window)) { alert('المتصفح لا يدعم النطق'); return; }
  
  // شيل التظليل من الكلمة القديمة
  if (currentSpokenEl) {
    currentSpokenEl.classList.remove('speaking');
    currentSpokenEl = null;
  }
  
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
  
  // ⬅️ جديد: ظلل الكلمة الجديدة
  if (el) {
    el.classList.add('speaking');
    currentSpokenEl = el;
  }
  
  // ⬅️ جديد: شيل التظليل لما النطق يخلص
  utter.onend = () => {
    if (currentSpokenEl) {
      currentSpokenEl.classList.remove('speaking');
      currentSpokenEl = null;
    }
  };
  
  // ⬅️ جديد: لو حصل خطأ، شيل التظليل برضه
  utter.onerror = () => {
    if (currentSpokenEl) {
      currentSpokenEl.classList.remove('speaking');
      currentSpokenEl = null;
    }
  };
  
  window.speechSynthesis.speak(utter);
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
const DEFS=[
["Safety","السلامة","A condition in which people are not exposed to unacceptable levels of danger."],
["Occupational Health","الصحة المهنية","Protecting and supporting physical, mental and social well-being in relation to the work performed and its conditions."],
["Hazard","الخطر","Inherent property of an object, substance, activity or situation with potential to cause harm — exists even with no exposure."],
["Risk","المخاطرة","Likelihood + Severity: احتمالية أن يُحدث الخطر ضررًا فعلًا في ظروف معينة."],
["Incident","حادث كاد يقع","Unplanned event that COULD result in injury/damage but no actual harm occurred."],
["Accident","الحادثة","Unplanned event that actually RESULTED in injury or ill health."],
["Exposure","التعرض","The condition/event through which a person comes into contact with a hazard."],
["Harm","الضرر","Injury, ill health, damage or loss resulting from exposure to a hazard."],
["Prevention","الوقاية","Measures, procedures and organisational arrangements to anticipate harm and reduce its likelihood — act BEFORE it occurs."],
["Non-compliance","عدم الامتثال","When an applicable requirement, instruction or authorized safety arrangement is not being followed."],
["Corrective Action","إجراء تصحيحي","Eliminates or controls an unacceptable condition."],
["Improvement Action","إجراء تحسيني","Reduces risk further when the existing arrangement is already acceptable."],
["CE Marking","علامة CE","Manufacturer's declaration that applicable EU requirements have been addressed and conformity assessment completed — NOT a quality mark."],
["EHSRs","المتطلبات الأساسية","Minimum health and safety outcomes that a product covered by a directive must satisfy."],
["Technical Standard","معيار فني","Documented technical specification/method via recognized standardization — voluntary by default."],
["Technical Regulation","لائحة فنية","Legally binding requirement imposed by law."],
["Machinery Directive","توجيه الآلات 2006/42/EC","EU directive for machinery with connected components, at least one moving part and non-human drive system."],
["Ex Marking (ATEX)","وسم البيئة الانفجارية","Special requirements for equipment in explosive atmospheres — NOT explosion-proof in every situation."],
["Partly Completed Machinery","آلة غير مكتملة","Subassembly for incorporation into other machinery — needs Declaration of Incorporation."],
["Health Surveillance","الرقابة الصحية","Medical exams/tests by the Occupational Health Doctor to monitor worker fitness."]];


/* =================================================================
   5) بنك الأسئلة
   ================================================================= */
const QB=[
{les:"LESSON 1 — Foundations of Occupational Health and Safety",qs:[
{k:"tf",n:1,s:"A hazard is the injury that happens to a worker.",a:false,c:"الخطر (Hazard) هو مصدر الضرر المحتمل — الإصابة نفسها هي الضرر (Harm)."},
{k:"tf",n:2,s:"Every incident results in an injury or ill health.",a:false,c:"الحادث الكاد يقع (Incident) قد يقع دون أي ضرر فعلي — الضرر الفعلي يجعله Accident."},
{k:"tf",n:3,s:"The same hazard can remain while the level of risk changes.",a:true,c:"صحيح: الخطر ثابت لكن الاحتمالية/الخطورة تتغير فتتغير المخاطرة."},
{k:"tf",n:4,s:"An accident is an unplanned event that may or may not cause harm.",a:false,c:"هذا وصف الـ Incident. الـ Accident حادث غير مخطط نتج عنه فعلًا إصابة أو ضرر."},
{k:"tf",n:5,s:"Exposure describes how a person comes into contact with a hazard.",a:true,c:"صحيح — هذا تعريف التعرض."},
{k:"tf",n:6,s:"Prevention should begin only after an accident has occurred.",a:false,c:"الوقاية تعني التصرف قبل وقوع الضرر (Act before harm occurs)."},
{k:"tf",n:7,s:"Occupational health includes physical, mental and social well-being.",a:true,c:"صحيح — ثلاثة أبعاد للصحة المهنية."},
{k:"tf",n:8,s:"If no accident has happened yet, the workplace is automatically safe and healthy.",a:false,c:"الخطر قد يظل كامنًا غير مكتشف؛ عدم وقوع حادث لا يعني أن المكان آمن."},
{k:"d",n:9,s:"Hazard",a:"خطر: خاصية متأصلة في جسم أو مادة أو نشاط أو وضع له القدرة على إحداث ضرر للأشخاص أو الممتلكات أو البيئة؛ يمكن أن يوجد حتى دون تعرض حالي."},
{k:"d",n:10,s:"Exposure",a:"تعرض: الحالة أو الحدث الذي يصل من خلاله الشخص إلى الخطر أو يتأثر به."},
{k:"d",n:11,s:"Harm",a:"ضرر: الإصابة أو سوء الصحة أو الضرر أو الخسارة الناتجة عن التعرض للخطر."},
{k:"d",n:12,s:"Risk",a:"مخاطرة: احتمالية أن يُحدث الخطر ضررًا فعلًا في ظروف معينة = Likelihood + Severity."},
{k:"d",n:13,s:"Incident",a:"حادث كاد يقع: حدث غير مخطط كان قد يسبب ضررًا لكن لم يحدث ضرر فعلي."},
{k:"d",n:14,s:"Accident",a:"حادثة: حدث غير مخطط نتج عنه فعلًا إصابة أو سوء صحة أو ضرر."},
{k:"d",n:15,s:"Prevention",a:"وقاية: إجراءات وتنظيمات لاستباق حدث ضار وتقليل احتمالية وقوعه قبل حدوثه."},
{k:"w",n:16,s:"Explain why the absence of an accident does not automatically mean that a workplace is healthy and safe.",a:"لأن الأخطار قد تبقى كامنة غير مكتشفة (ضجيج، أبخرة، إجهاد نفسي) وقد تظهر أضرار صحية طويلة الأمد دون أي حادث مفاجئ؛ فغياب الحادث لا يعني غياب الخطر."},
{k:"w",n:17,s:"What is the main difference between an Incident and an Accident?",a:"Incident: قد يسبب ضررًا لكنه لم يسببه فعليًا. Accident: نتج عنه فعلًا إصابة أو ضرر. الفرق الجوهري = وقوع الضرر فعليًا."},
{k:"w",n:18,s:"Why must prevention begin before work starts?",a:"لأن الضرر يحدث مرة واحدة؛ الوقاية تعمل قبل التعرض لإلغاء أو تقليل الاحتمالية — وبعد وقوع الحادث يكون الضرر قد حدث بالفعل ولا يمكن التراجع عنه."},
{k:"w",n:19,s:"List the three ideas you must separate when describing a workplace condition: Hazard, Exposure and Harm.",a:"Hazard: ما الذي يمكن أن يسبب الضرر؟ | Exposure: كيف يصل الشخص إلى الخطر؟ | Harm: ما الإصابة أو الضرر الناتج؟"},
{k:"c",n:20,s:"Compare Hazard and Risk.",a:"Hazard = إمكانية التسبب في ضرر (خاصية ثابتة). Risk = احتمالية + خطورة الضرر في ظروف معينة (متغيرة). مثال: شطبة حادة (Hazard) / ملامستها أثناء مناولة قرب ممر مزدحم (Risk)."},
{k:"c",n:21,s:"Compare Incident and Accident with one industrial example for each.",a:"Incident: عامل يزلق على أرض مبللة لكنه لا يسقط — لا ضرر. Accident: يزلق ويسقط ويكسر ذراعه — ضرر فعلي."},
{k:"sc",n:22,pre:"Scenario 1 — في ورشة صفيحة معدن، شطبة حادة بروز في ممر سير، عامل مرّ ولمسها بيده وتعرض لجرح عميق احتاج خياطة.",s:"Identify: (a) Hazard (b) Exposure (c) Harm (d) Incident or Accident? Why?",a:"(a) الشطبة المعدنية الحادة (b) ملامسة الحافة باليد أثناء المرور (c) جرح عميق يحتاج خياطة (d) Accident — لأن الضرر وقع فعلًا."},
{k:"sc",n:23,pre:"Scenario 2 — انسكاب زيت على الأرضية، عامل مر وازلّق لكنه استعاد توازنه دون سقوط أو إصابة.",s:"Identify: (a) Hazard (b) Exposure (c) Harm (if any) (d) Incident or Accident? Why?",a:"(a) انسكاب الزيت على الأرضية (b) عبور المنطقة / الانزلاق (c) لا يوجد ضرر (d) Incident — لم يقع أي إصابة."},
{k:"sc",n:24,pre:"Scenario 3 — سلم غير مثبت، تحرك والعامل سقط من نحو مترين وكسر ذراعه.",s:"Identify: (a) Hazard (b) Exposure (c) Harm (d) Incident or Accident? Why?",a:"(a) سلم غير مثبت / العمل على ارتفاع (b) السقوط من نحو 2 متر (c) كسر في الذراع (d) Accident — إصابة فعلية."},
{k:"sc",n:25,pre:"Scenario 4 — Same Hazard, Different Risk: مذيب صناعي — الحالة A حاوية مغلقة مخزنة في مكان جيد التهوية، الحالة B حاوية مفتوحة بتهوية سيئة بدون ضوابط.",s:"(a) Is the chemical hazard different? (b) What has changed? (c) Where is exposure more likely? (d) Where is the risk greater? (e) Suggest one preventive action.",a:"(a) لا — نفس الخطر الكيميائي (b) تغيرت الظروف: مفتوح + تهوية سيئة + لا ضوابط (c) في B (d) في B — احتمالية وخطورة أعلى (e) إبقاء الحاوية مغلقة وتخزينها في مكان جيد التهوية مع حصر الوصول."},
{k:"sc",n:26,pre:"Scenario 5 — مادة أكالة مخزنة على رف مرتفع، انزلق الوعاء ورشّ السائل على ذراع العامل فأحدث حرقًا كيميائيًا.",s:"Identify: (a) Hazard (b) Exposure (c) Harm (d) Incident or Accident?",a:"(a) مادة أكالة مخزنة على ارتفاع (b) رشاش السائل على الذراع (c) حرق كيميائي (d) Accident."}]},
{les:"LESSON 2 — National Safety Legislation and Workplace Responsibilities",qs:[
{k:"tf",n:27,s:"Being a learner or student means you do not need to follow workplace safety requirements.",a:false,c:"كل الموجودين في الموقع — بمن فيهم المتدربون والطلاب — ملزمون بمتطلبات السلامة."},
{k:"tf",n:28,s:"The employer can fully delegate the workplace risk assessment to any manager.",a:false,c:"تقييم المخاطر (وتعيين رئيس خدمة الوقاية) من الواجبات غير القابلة للتفويض."},
{k:"tf",n:29,s:"The supervisor represents workers' interests on health and safety matters.",a:false,c:"تمثيل العمال مهمة الـ RLS؛ المشرف يشرف على التنفيذ اليومي للعمل."},
{k:"tf",n:30,s:"Occupational insurance systems may cover occupational diseases as well as sudden accidents.",a:true,c:"صحيح — التأمين قد يغطي الأمراض المهنية بجانب الحوادث المفاجئة."},
{k:"tf",n:31,s:"If you notice an unsafe condition, you should immediately take over the employer's responsibilities and correct it yourself.",a:false,c:"تبلغ عبر القناة المصرح بها ولا تتحمل مسؤوليات صاحب العمل أو المتخصصين."},
{k:"tf",n:32,s:"Specific training is the same as general information about workplace hazards.",a:false,c:"التدريب المحدد تعليمات عملية مصرح بها للمهام والمعدات عالية الخطورة — مختلف عن المعلومات العامة."},
{k:"tf",n:33,s:"Non-compliance occurs when an applicable safety requirement or authorised instruction is not followed.",a:true,c:"صحيح — هذا تعريف عدم الامتثال."},
{k:"d",n:34,s:"Primary legislation / Primary law",a:"قوانين أساسية يصدرها البرلمان الوطني وتضع المبادئ والمتطلبات القانونية العامة."},
{k:"d",n:35,s:"Implementing regulation or decree",a:"لوائح أو قرارات حكومية/وزارية تحوّل المبادئ إلى متطلبات فنية وتشغيلية ملزمة."},
{k:"d",n:36,s:"Employer (in the occupational safety system)",a:"يتحمل المسؤولية القانونية الشاملة عن السلامة؛ واجباته غير القابلة للتفويض: إجراء/توثيق تقييم المخاطر + تعيين رئيس خدمة الوقاية والحماية."},
{k:"d",n:37,s:"Supervisor",a:"يشرف على التنفيذ اليومي الصحيح للعمل ويتأكد من اتباع تعليمات السلامة بدقة؛ جهة الاتصال الأولى عند عدم الوضوح أو الظروف غير الآمنة."},
{k:"d",n:38,s:"Workers' Safety Representative",a:"يمثل مخاوف العمال في الصحة والسلامة ويشارك في مشاورات تقييم المخاطر — مختلف عن المشرف."},
{k:"d",n:39,s:"Occupational disease",a:"مرض ناتج عن تعرض متكرر لظروف عمل ضارة (وليس حادثًا مفاجئًا)."},
{k:"d",n:40,s:"Non-compliance",a:"عدم اتباع متطلب أو تعليمة أو ترتيب سلامة معمول به ومصرح به."},
{k:"w",n:41,s:"Explain the sequence from national law to safe work in the workplace.",a:"National Law ← Implementing Regulations ← Workplace Safety Arrangements ← Safe Procedures & Instructions ← Safe Work (الممارسة اليومية الآمنة)."},
{k:"w",n:42,s:"Name two responsibilities of the employer that cannot be delegated.",a:"① إجراء تقييم المخاطر وتوثيقه ② تعيين رئيس خدمة الوقاية والحماية."},
{k:"w",n:43,s:"What is the difference between Information, Training and Specific training? Give one example of each.",a:"Information = ما يجب أن أعرفه (جهات الطوارئ، المخاطر العامة). Training = ما يجب أن أفهمه (مفاهيم الخطر، الحقوق والواجبات). Specific Training = ما يجب أن أُصرَّح به لأدائه (تشغيل ماكينة CNC، مناولة يدوية، مواد كيميائية خطرة)."},
{k:"w",n:44,s:"Why must reporting of accidents and occupational diseases follow formal authorised routes?",a:"لأن الإبلاغ التزام قانوني بمدد محددة (48 ساعة / 24 ساعة / 5 أيام عمل) عبر قنوات مصرح بها تضمن التوثيق والمساءلة والتغطية التأمينية."},
{k:"c",n:45,s:"Compare the roles of the Supervisor and the Workers' Safety Representative.",a:"Supervisor يشرف على كيفية تنفيذ العمل فعليًا ويضمن اتباع التعليمات؛ RLS يمثل العمال ويشارك في مشاورات تقييم المخاطر ولا يصدر تعليمات عمل مباشرة."},
{k:"c",n:46,s:"Compare the roles of the Employer and the Manager in the safety system.",a:"Employer يملك المسؤولية القانونية الشاملة ويؤسس النظام (تقييم المخاطر، تعيين RSPP)؛ Manager يترجم المتطلبات إلى ممارسة بالتخطيط وتوفير الموارد وتنظيم العمل."},
{k:"c",n:47,s:"Compare a workplace accident and an occupational disease.",a:"الحادث: حدث مفاجئ غير مخطط يؤدي إلى إصابة فورية. المرض المهني: مرض يتراكم تدريجيًا من التعرض المتكرر لظروف عمل ضارة."},
{k:"sc",n:48,pre:"Scenario 6 — عامل جديد تلقى تعريفًا عامًا فقط؛ المشرف كلّفه بتشغيل ماكينة لم يتلقَّ لها تدريبًا محددًا، وضغط الإنتاج مرتفع.",s:"(a) Should the worker begin? (b) Who is responsible for organising safe work? (c) What preparation is missing? (d) What should the worker do?",a:"(a) لا — لا يملك التدريب المحدد والكفاءة المطلوبة (b) صاحب العمل / المدير / المشرف مسؤولون عن التنظيم والإشراف (c) الناقص = Specific Training (d) يرفض البدء ويستشير المشرف حتى يكتمل التدريب."},
{k:"sc",n:49,pre:"Scenario 7 — فني لاحظ حالة غير آمنة معروفة لم تُصحَّح منذ أيام، وتعليمة العمل الآمن المصرح بها لا يتبعها بعض العمال.",s:"(a) Is this non-compliance? (b) Correct action regarding authority? (c) Report to whom first?",a:"(a) نعم — حالة غير آمنة معروفة لم تُصحح + تعليمة مصرح بها لا تُتبع (b) لا يصلحها بنفسه — يفحص ويسجل ويبلغ عبر القناة المصرح بها ضمن صلاحياته (c) المشرف أولًا."},
{k:"sc",n:50,pre:"Scenario 8 — عامل أصيب بمرض ربطه طبيب الصحة المهنية بالتعرض المتكرر لمادة ضارة. زميله يقول: «التأمين يغطي الحوادث المفاجئة فقط».",s:"(a) Is the colleague correct? (b) What is the correct term?",a:"(a) خطأ — أنظمة التأمين قد تغطي الأمراض المهنية أيضًا (b) المسمى الصحيح: Occupational Disease (مرض مهني)."}]},
{les:"LESSON 3 — European Directives and Technical Safety Standards",qs:[
{k:"tf",n:51,s:"Product markings and technical information on machinery are only decorative.",a:false,c:"إنها معلومات سلامة أساسية تحدد الاحتياطات المطلوبة ومسؤوليات المستخدم."},
{k:"tf",n:52,s:"The CE marking alone guarantees that a machine is safe for every possible task.",a:false,c:"CE إقرار مطابقة فقط — يلزم أيضًا تدريب وإجراءات وضوابط محلية وملاءمة المهمة."},
{k:"tf",n:53,s:"A technician is expected to recognise important safety information and report anything missing, unclear or inconsistent.",a:true,c:"صحيح — هذا جوهر دور الفني: inspect — record — report."},
{k:"tf",n:54,s:"Partly completed machinery is treated exactly the same as a complete machine ready for independent use.",a:false,c:"تحتاج Declaration of Incorporation وتُدمج في آلة أخرى — ليست جاهزة للاستخدام المستقل."},
{k:"tf",n:55,s:"An Ex marking means the equipment is explosion-proof in every situation without further checks.",a:false,c:"تعني وجود متطلبات خاصة للمناطق الانفجارية؛ يلزم اتباع تصنيف المنطقة وتعليمات المنتج وإجراءات الموقع."},
{k:"tf",n:56,s:"If the model number on the operating instructions is different from the model number on the machine, you should ignore the difference.",a:false,c:"سجّل الفارق وأبلغ للتحقق المصرح به — لا تتجاهل ولا تفترض."},
{k:"tf",n:57,s:"The Machinery Directive applies to machinery that has a drive system other than direct human or animal effort.",a:true,c:"صحيح — آلات بمكونات متصلة وجزء متحرك ونظام إدارة غير جهد بشري/حيواني."},
{k:"d",n:58,s:"CE marking",a:"علامة يضعها المنتِج لإقرار استيفاء متطلبات الاتحاد الأوروبي المنطبقة وإتمام إجراءات تقييم المطابقة — ليست علامة جودة."},
{k:"d",n:59,s:"European Directive (product safety)",a:"تشريع أوروبي يضع متطلبات أساسية إلزامية (EHSRs) يجب أن تحققها المنتجات قبل طرحها في السوق."},
{k:"d",n:60,s:"Partly completed machinery",a:"مجموعة فرعية تُدمج فقط داخل آلات أخرى؛ تُرفق بتعليمات تجميع وإقرار دمج (Declaration of Incorporation)."},
{k:"d",n:61,s:"Declaration of Conformity",a:"وثيقة المنتِج تقر بمطابقة الآلة المكتملة للتوجيهات المنطبقة — مصاحبة لعلامة CE."},
{k:"d",n:62,s:"Ex marking (ATEX context)",a:"وسم إضافي لمعدات المناطق ذات الأجواء الانفجارية — يعني تطبيق متطلبات خاصة، ولا يعني مقاومة انفجار مطلقة."},
{k:"d",n:63,s:"Technical standard",a:"مواصفة فنية موثقة أو طريقة تقييم وُضعت عبر عملية معيارية معترف بها — طوعية افتراضيًا وتصبح إلزامية عند الإحالة إليها قانونًا أو في لوائح أو اشتراطات ملزمة."},
{k:"w",n:64,s:"List at least four types of information you may find on industrial machinery that help you work safely.",a:"① بيانات التعريف (الاسم/الموديل/الرقم المسلسل) ② علامات المطابقة (CE) ③ حدود التشغيل (الحمل/السرعة/الضغط/الحرارة) ④ علامات التحذير والسلامة ⑤ تعليمات المنتِج والدليل."},
{k:"w",n:65,s:"Why is it important that the model number on the instructions matches the machine?",a:"لضمان أن التعليمات تخص هذه الآلة بالذات؛ اختلاف الموديل يعني وجوب التحقق من الانطباق عبر مصدر مصرح به قبل الاعتماد عليها."},
{k:"w",n:66,s:"What should a technician do if safety markings, labels or instructions are missing, unclear or inconsistent?",a:"يسجل الملاحظات ويبلغ عبر القناة المصرح بها — لا يستخدم المعدة ولا يفترض المطابقة حتى يتم التحقق المصرح به."},
{k:"w",n:67,s:"Explain the difference between a Declaration of Conformity and a Declaration of Incorporation.",a:"Conformity: لآلة مكتملة جاهزة للاستخدام المستقل. Incorporation: لآلة غير مكتملة تُدمج في آلة أخرى، وتصاحبها تعليمات تجميع."},
{k:"c",n:68,s:"Compare a complete machine and partly completed machinery. How do their documents differ?",a:"المكتملة: CE + Declaration of Conformity. غير المكتملة: Declaration of Incorporation + Assembly instructions — ولا يجوز استخدامها مستقلة."},
{k:"c",n:69,s:"Compare the meaning of the CE marking and the Ex marking.",a:"CE: إقرار مطابقة مع متطلبات الاتحاد — لا يضمن الجودة ولا الأمان لكل مهمة. Ex: متطلبات خاصة للأجواء الانفجارية — لا يعني حماية مطلقة في كل المواقف."},
{k:"sc",n:70,pre:"Scenario 9 — ماكينة عليها: اسم المنتِج، موديل، رقم مسلسل، CE، بيانات كهربائية، رمز تحذير. التعليمات المتوفرة موديلها مختلف قليلًا عن الموديل على الماكينة.",s:"(a) What to check first? (b) What does CE tell you? (c) Does CE alone mean safe for every task? (d) Why is the model difference important? (e) Assume instructions suitable?",a:"(a) بيانات التعريف ومطابقتها مع التعليمات (b) إقرار المنتِج باستيفاء متطلبات الاتحاد وإتمام تقييم المطابقة (c) لا (d) قد لا تنطبق التعليمات على هذه الآلة تحديدًا (e) لا — سجّل وأبلغ للتحقق المصرح به."},
{k:"sc",n:71,pre:"Scenario 10 — وصل مكوّن (صمام سيرفو / وحدة طاقة هيدروليكية) بإقرار دمج وتعليمات تجميع. زميلك: «عنده أوراق CE يبقى نستخدمه كماكينة مستقلة».",s:"(a) Is the colleague correct? (b) What type of equipment is this? (c) What documents should accompany it?",a:"(a) لا — لا يجوز استخدامه كآلة مستقلة (b) على الأرجح Partly Completed Machinery (c) Declaration of Incorporation + Assembly instructions."},
{k:"sc",n:72,pre:"Scenario 11 — معدّة في منطقة انفجارية محتملة عليها CE و Ex معًا. عامل: «علامة Ex تعني مقاومة انفجار في كل مكان — لا نحتاج أي فحوصات إضافية».",s:"(a) Is the worker correct? (b) What must still be followed? (c) What if unsure about suitability for the zone?",a:"(a) لا (b) معلومات المعدة + تصنيف المنطقة المصرح به + تعليمات المنتِج + إجراءات الموقع + ضوابط المهمة (c) يُبلغ ويستشير المشرف ويتحقق من الانطباق قبل الاستخدام."}]}];


/* =================================================================
   6) الاختبار السريع
   ================================================================= */
const QUIZ=[
{q:"Which two responsibilities of the Employer cannot be delegated?",o:["Conducting the risk assessment and appointing the Head of Prevention","Supervising daily work and buying safety equipment","Conducting health examinations and representing workers"],a:0,e:"واجبات صاحب العمل غير القابلة للتفويض: إجراء/توثيق تقييم المخاطر + تعيين رئيس خدمة الوقاية والحماية."},
{q:"What is the main role of the Supervisor (Preposto)?",o:["To carry out medical examinations on workers","To oversee the correct execution of work and ensure instructions are followed","To represent worker interests during safety meetings"],a:1,e:"المشرف يشرف على التنفيذ اليومي الصحيح للعمل وضمان اتباع التعليمات."},
{q:"How does the Workers' Safety Representative (RLS) differ from a Supervisor?",o:["The RLS gives direct work instructions to technicians","The RLS oversees daily production speed","The RLS represents worker safety concerns, while the Supervisor oversees work execution"],a:2,e:"RLS يمثل مخاوف العمال في السلامة، بينما المشرف يشرف على تنفيذ العمل."},
{q:"Who performs Health Surveillance in the company?",o:["The Manager","The Occupational Health Doctor","The Head of the Prevention Service"],a:1,e:"الرقابة الصحية يقوم بها طبيب الصحة المهنية."},
{q:"What is the primary purpose of Council Directive 89/391/EEC (Framework Directive)?",o:["To regulate the pricing of industrial goods in Europe","To establish a general framework for protecting workers' health and safety at work","To eliminate the need for CE marking on industrial machines"],a:1,e:"توجيه الإطار يضع إطارًا عامًا لحماية صحة العامل وسلامته في العمل."},
{q:"Who holds primary responsibility under EU Product-Safety Directives?",o:["The Supervisor on the factory floor","The Occupational Health Doctor","The Manufacturer and economic operators placing the product on the market"],a:2,e:"مسؤولية سلامة المنتج تقع على المنتِج والمشغلين الاقتصاديين."},
{q:"What is the relationship between a Product Directive and a Harmonised Standard (e.g., EN ISO 12100)?",o:["Directives specify WHAT safety outcomes are required; standards provide technical methods on HOW to achieve them","Directives apply to workers; standards apply only to employers","Standards replace the legal requirement of the directive"],a:0,e:"التوجيه يحدد «ماذا» والمعيار المنسق يحدد «كيف»."},
{q:"Does buying a CE-marked machine mean no further safety measures are needed?",o:["Yes, CE marking guarantees no training is required","No, workplace safety controls, operator training and safe work procedures are still required","Yes, liability transfers fully to the manufacturer"],a:1,e:"CE لا يلغي واجب صاحب العمل: التدريب والإجراءات والضوابط المحلية ما زالت مطلوبة."},
{q:"Which organization focuses on electrical/electronic standards at the INTERNATIONAL level?",o:["CEN","IEC","ETSI"],a:1,e:"IEC = International Electrotechnical Commission."},
{q:"What makes a Technical Regulation different from a Technical Standard?",o:["Standards are always mandatory laws","Regulations are legally binding whereas standards are voluntary unless referenced by law","Regulations are published only by national companies"],a:1,e:"اللائحة ملزمة قانونًا، المعيار طوعي افتراضيًا."},
{q:"Which machinery standard type deals with safety DEVICES such as Emergency Stop (EN ISO 13850)?",o:["Type A","Type B1","Type B2","Type C"],a:2,e:"Type B2 = أجهزة السلامة المحددة."},
{q:"If a Type C standard conflicts with a Type A standard for a specific machine, which takes precedence?",o:["The Type A standard","The Type C standard","The employer chooses whichever is easier"],a:1,e:"قاعدة الأولوية: Type C يتفوق على A وB عند التعارض."},
{q:"A flame-over-circle pictogram on a chemical label indicates:",o:["Flammable","Oxidizing","Pressurized gas","Acute toxicity"],a:1,e:"لهب فوق دائرة = مؤكسد Oxidizing."},
{q:"A worker slips on a wet floor but stays on his feet. This is:",o:["An accident","An incident","A hazard"],a:1,e:"لا ضرر فعلي حدث = Incident. لو كسر ذراعه = Accident."},
{q:"Machine label: ST-450 Serial 74218. Instructions: ST-450 Serial 74281. What should you do?",o:["Assume the instructions belong to the machine","Record and report the discrepancy for authorized verification before relying on the instructions","Use the machine without checking"],a:1,e:"الموديل متطابق لكن الرقم المسلسل لا — سجّل وأبلغ."},
{q:"Non-compliance occurs when…",o:["An applicable requirement or authorised instruction is not being followed","An accident has already happened","A worker wears the wrong uniform color"],a:0,e:"عدم الامتثال = عدم اتباع متطلب أو تعليمة مصرح بها معمول به."}];


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
        <button class="btn-speak" onclick="event.stopPropagation();speakSection(${si})" 
        title="ينطق الكلمة إنجليزي ثم إيطالي بالتتابع">
  🔊 نطق الكل
</button>
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
        <td class="en" onclick="speak('${esc(t[1].replace(/'/g,"\\'"))}','en-US',0.85,this)" title="اضغط للسماع">${esc(t[1])} <span class="spk">🔊</span></td>
        <td class="it" onclick="speak('${esc(t[2].replace(/'/g,"\\'"))}','it-IT',0.85,this)" title="Clicca per ascoltare">${esc(t[2])} <span class="spk">🔊</span></td>
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
/* ================= تسجيل Service Worker (PWA) ================= */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js')
      .then(reg => {
        console.log('✅ Service Worker مسجل بنجاح:', reg.scope);
        
        // الاستماع لتحديثات SW
        reg.addEventListener('updatefound', () => {
          const newSW = reg.installing;
          if (!newSW) return;
          
          newSW.addEventListener('statechange', () => {
            if (newSW.state === 'installed' && navigator.serviceWorker.controller) {
              // فيه نسخة جديدة — اسأل المستخدم
              if (confirm('🎉 فيه نسخة جديدة من الموقع!\nهل تريد تحديث الصفحة الآن؟')) {
                newSW.postMessage({ type: 'SKIP_WAITING' });
                window.location.reload();
              }
            }
          });
        });
      })
      .catch(err => console.warn('⚠️ فشل تسجيل Service Worker:', err));
  });
}

// لما الـ SW الجديد ياخد السيطرة، اعمل reload
let refreshing = false;
navigator.serviceWorker?.addEventListener('controllerchange', () => {
  if (refreshing) return;
  refreshing = true;
  window.location.reload();
});
