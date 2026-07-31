// Central content library for all language pairs
// Each scenario has cards for both French (fr) and German (de)

export type Lang = 'fr' | 'de'

export interface FlashCard {
  id: string
  target: string        // word/phrase in target language
  native: string        // English meaning
  pronun: string        // pronunciation guide
  ex: string            // example sentence in target language
  trans: string         // example translation
  diff: 'Basic' | 'Intermediate' | 'Advanced'
  grad: string          // card front gradient
  band: string          // card back band gradient
  glow: string          // ambient glow color
}

export interface PhrasePack {
  [pack: string]: Array<{ target: string; native: string; emergency: boolean }>
}

// ─────────────────────────────────────────────────────────────────
// FLASHCARDS — keyed by scenarioId + lang
// ─────────────────────────────────────────────────────────────────

const GRADIENTS = [
  { grad: 'linear-gradient(145deg,#2563EB,#1E40AF)', band: 'linear-gradient(135deg,#2563EB,#1D4ED8)', glow: 'rgba(37,99,235,0.20)' },
  { grad: 'linear-gradient(145deg,#059669,#047857)', band: 'linear-gradient(135deg,#059669,#065F46)', glow: 'rgba(5,150,105,0.20)' },
  { grad: 'linear-gradient(145deg,#D97706,#B45309)', band: 'linear-gradient(135deg,#D97706,#92400E)', glow: 'rgba(217,119,6,0.20)' },
  { grad: 'linear-gradient(145deg,#7C3AED,#6D28D9)', band: 'linear-gradient(135deg,#7C3AED,#5B21B6)', glow: 'rgba(124,58,237,0.20)' },
  { grad: 'linear-gradient(145deg,#DB2777,#BE185D)', band: 'linear-gradient(135deg,#DB2777,#9D174D)', glow: 'rgba(219,39,119,0.20)' },
  { grad: 'linear-gradient(145deg,#0891B2,#0E7490)', band: 'linear-gradient(135deg,#0891B2,#155E75)', glow: 'rgba(8,145,178,0.20)' },
  { grad: 'linear-gradient(145deg,#16A34A,#15803D)', band: 'linear-gradient(135deg,#16A34A,#166534)', glow: 'rgba(22,163,74,0.20)' },
  { grad: 'linear-gradient(145deg,#EA580C,#C2410C)', band: 'linear-gradient(135deg,#EA580C,#9A3412)', glow: 'rgba(234,88,12,0.20)' },
]

function g(i: number) { return GRADIENTS[i % GRADIENTS.length] }

// ── FRENCH flashcards by scenario ───────────────────────────────
const FR_CARDS: Record<string, FlashCard[]> = {
  'preset-daycare': [
    { id:'f1', target:'Bonjour', native:'Hello', pronun:'bon-zhoor', ex:"Bonjour, comment s'est passée sa journée?", trans:"Hello, how was her day?", diff:'Basic', ...g(0) },
    { id:'f2', target:'La garderie', native:'The daycare', pronun:'la gar-duh-ree', ex:'Ma fille adore sa garderie.', trans:'My daughter loves her daycare.', diff:'Basic', ...g(1) },
    { id:'f3', target:'Manger', native:'To eat', pronun:'mahn-zhay', ex:"A-t-il bien mangé aujourd'hui?", trans:'Did he eat well today?', diff:'Basic', ...g(2) },
    { id:'f4', target:'La sieste', native:'The nap', pronun:'la syest', ex:'A-t-elle fait sa sieste?', trans:'Did she have her nap?', diff:'Basic', ...g(3) },
    { id:'f5', target:'Les allergies', native:'Allergies', pronun:'lay-zal-air-zhee', ex:'Mon enfant a des allergies alimentaires.', trans:'My child has food allergies.', diff:'Intermediate', ...g(4) },
    { id:'f6', target:'La fièvre', native:'Fever', pronun:'la fyev-ruh', ex:'Elle avait de la fièvre ce matin.', trans:'She had a fever this morning.', diff:'Intermediate', ...g(5) },
    { id:'f7', target:'Le comportement', native:'Behaviour', pronun:'luh kohm-por-tuh-mahn', ex:'Son comportement était très bien.', trans:'His behaviour was very good.', diff:'Intermediate', ...g(6) },
    { id:'f8', target:'À demain', native:'See you tomorrow', pronun:'ah duh-mahn', ex:'Merci, à demain!', trans:'Thank you, see you tomorrow!', diff:'Basic', ...g(7) },
  ],
  'preset-medical': [
    { id:'f1', target:"J'ai mal", native:'It hurts / I have pain', pronun:'zhay mal', ex:"J'ai mal à la tête.", trans:'I have a headache.', diff:'Basic', ...g(0) },
    { id:'f2', target:'Le médecin', native:'The doctor', pronun:'luh may-duh-sahn', ex:"J'ai un rendez-vous avec le médecin.", trans:'I have an appointment with the doctor.', diff:'Basic', ...g(1) },
    { id:'f3', target:'Une ordonnance', native:'A prescription', pronun:'ewn or-doh-nahns', ex:"J'ai besoin d'une ordonnance.", trans:'I need a prescription.', diff:'Intermediate', ...g(2) },
    { id:'f4', target:'Allergique', native:'Allergic', pronun:'al-air-zheek', ex:'Je suis allergique à la pénicilline.', trans:'I am allergic to penicillin.', diff:'Intermediate', ...g(3) },
    { id:'f5', target:'Les médicaments', native:'Medications', pronun:'lay may-dee-kah-mahn', ex:'Je prends ces médicaments.', trans:'I take these medications.', diff:'Intermediate', ...g(4) },
    { id:'f6', target:'Une urgence', native:'An emergency', pronun:'ewn ewrzh-ahns', ex:"C'est une urgence.", trans:'This is an emergency.', diff:'Advanced', ...g(5) },
  ],
  'preset-work': [
    { id:'f1', target:'Enchanté(e)', native:'Nice to meet you', pronun:'ahn-shahn-tay', ex:'Enchanté de vous rencontrer!', trans:'Nice to meet you!', diff:'Basic', ...g(0) },
    { id:'f2', target:'La réunion', native:'The meeting', pronun:'la ray-ew-nyohn', ex:'À quelle heure est la réunion?', trans:'What time is the meeting?', diff:'Basic', ...g(1) },
    { id:'f3', target:'Je ne comprends pas', native:"I don't understand", pronun:'zhuh nuh kohm-prahn pah', ex:"Je ne comprends pas encore très bien.", trans:"I don't understand very well yet.", diff:'Basic', ...g(2) },
    { id:'f4', target:'Pourriez-vous expliquer', native:'Could you explain', pronun:'poor-yay-voo ex-plee-kay', ex:"Pourriez-vous m'expliquer ça?", trans:'Could you explain that to me?', diff:'Intermediate', ...g(3) },
    { id:'f5', target:'Merci pour votre patience', native:'Thank you for your patience', pronun:'mair-see poor vot-ruh pay-syahns', ex:'Merci pour votre patience!', trans:'Thank you for your patience!', diff:'Intermediate', ...g(4) },
    { id:'f6', target:'Bonne fin de journée', native:'Have a good rest of day', pronun:'bun fahn duh zhoor-nay', ex:'Bonne fin de journée à tous!', trans:'Have a good rest of the day, everyone!', diff:'Basic', ...g(5) },
  ],
  'preset-restaurant': [
    { id:'f1', target:'Une table pour deux', native:'A table for two', pronun:'ewn tab-luh poor duh', ex:'Bonjour, une table pour deux?', trans:'Hello, a table for two?', diff:'Basic', ...g(0) },
    { id:'f2', target:'Le menu', native:'The menu', pronun:'luh muh-new', ex:"Est-ce qu'on peut voir le menu?", trans:'Can we see the menu?', diff:'Basic', ...g(1) },
    { id:'f3', target:'Je voudrais', native:'I would like', pronun:'zhuh voo-dray', ex:'Je voudrais commander.', trans:'I would like to order.', diff:'Basic', ...g(2) },
    { id:'f4', target:"L'addition", native:'The bill', pronun:'lah-dee-syohn', ex:"L'addition, s'il vous plaît.", trans:'The bill, please.', diff:'Basic', ...g(3) },
    { id:'f5', target:'Végétarien(ne)', native:'Vegetarian', pronun:'vay-zhay-tar-yahn', ex:'Je suis végétarien(ne).', trans:'I am vegetarian.', diff:'Intermediate', ...g(4) },
    { id:'f6', target:"C'est délicieux", native:"It's delicious", pronun:'say day-lee-syuh', ex:"C'est vraiment délicieux!", trans:"It's really delicious!", diff:'Basic', ...g(5) },
  ],
  'preset-grocery': [
    { id:'f1', target:'Où se trouve', native:'Where is', pronun:'oo suh troov', ex:'Où se trouve le pain?', trans:'Where is the bread?', diff:'Basic', ...g(0) },
    { id:'f2', target:'Combien coûte', native:'How much does it cost', pronun:'kohm-byahn koot', ex:'Combien coûte ce fromage?', trans:'How much does this cheese cost?', diff:'Basic', ...g(1) },
    { id:'f3', target:'Le sac', native:'The bag', pronun:'luh sak', ex:'Avez-vous des sacs?', trans:'Do you have bags?', diff:'Basic', ...g(2) },
    { id:'f4', target:'La caisse', native:'The checkout', pronun:'la kess', ex:'Où est la caisse?', trans:'Where is the checkout?', diff:'Basic', ...g(3) },
    { id:'f5', target:'Bio / Biologique', native:'Organic', pronun:'bee-oh', ex:'Avez-vous des produits bio?', trans:'Do you have organic products?', diff:'Intermediate', ...g(4) },
  ],
}

// ── GERMAN flashcards by scenario ───────────────────────────────
const DE_CARDS: Record<string, FlashCard[]> = {
  'preset-daycare': [
    { id:'d1', target:'Guten Tag', native:'Good day / Hello', pronun:'goo-ten tahg', ex:'Guten Tag! Wie war sein Tag?', trans:'Good day! How was his day?', diff:'Basic', ...g(0) },
    { id:'d2', target:'Die Kita', native:'The daycare', pronun:'dee kee-tah', ex:'Mein Kind liebt die Kita.', trans:'My child loves the daycare.', diff:'Basic', ...g(1) },
    { id:'d3', target:'Essen', native:'To eat / food', pronun:'ess-en', ex:'Hat er heute gut gegessen?', trans:'Did he eat well today?', diff:'Basic', ...g(2) },
    { id:'d4', target:'Der Mittagsschlaf', native:'The nap', pronun:'dair mit-tahgs-shlahf', ex:'Hat sie ihren Mittagsschlaf gemacht?', trans:'Did she take her nap?', diff:'Intermediate', ...g(3) },
    { id:'d5', target:'Die Allergie', native:'The allergy', pronun:'dee al-air-gee', ex:'Mein Kind hat eine Nussallergie.', trans:'My child has a nut allergy.', diff:'Intermediate', ...g(4) },
    { id:'d6', target:'Das Fieber', native:'The fever', pronun:'das fee-ber', ex:'Sie hatte heute Morgen Fieber.', trans:'She had a fever this morning.', diff:'Intermediate', ...g(5) },
    { id:'d7', target:'Bis morgen', native:'See you tomorrow', pronun:'bis mor-gen', ex:'Danke, bis morgen!', trans:'Thank you, see you tomorrow!', diff:'Basic', ...g(6) },
    { id:'d8', target:'Das Verhalten', native:'The behaviour', pronun:'das fair-hal-ten', ex:'Sein Verhalten war sehr gut.', trans:'His behaviour was very good.', diff:'Advanced', ...g(7) },
  ],
  'preset-medical': [
    { id:'d1', target:'Es tut weh', native:'It hurts', pronun:'es toot vay', ex:'Mein Kopf tut weh.', trans:'My head hurts.', diff:'Basic', ...g(0) },
    { id:'d2', target:'Der Arzt', native:'The doctor', pronun:'dair artst', ex:'Ich habe einen Termin beim Arzt.', trans:'I have an appointment with the doctor.', diff:'Basic', ...g(1) },
    { id:'d3', target:'Das Rezept', native:'The prescription', pronun:'das reh-tsept', ex:'Ich brauche ein Rezept.', trans:'I need a prescription.', diff:'Intermediate', ...g(2) },
    { id:'d4', target:'Allergisch', native:'Allergic', pronun:'al-air-gish', ex:'Ich bin allergisch gegen Penicillin.', trans:'I am allergic to penicillin.', diff:'Intermediate', ...g(3) },
    { id:'d5', target:'Die Medikamente', native:'The medications', pronun:'dee meh-dee-kah-men-teh', ex:'Ich nehme diese Medikamente.', trans:'I take these medications.', diff:'Intermediate', ...g(4) },
    { id:'d6', target:'Der Notfall', native:'The emergency', pronun:'dair not-fal', ex:'Das ist ein Notfall!', trans:'This is an emergency!', diff:'Advanced', ...g(5) },
  ],
  'preset-work': [
    { id:'d1', target:'Freut mich', native:'Nice to meet you', pronun:'froyt mikh', ex:'Freut mich, Sie kennenzulernen!', trans:'Nice to meet you!', diff:'Basic', ...g(0) },
    { id:'d2', target:'Das Meeting', native:'The meeting', pronun:'das mee-ting', ex:'Wann beginnt das Meeting?', trans:'When does the meeting start?', diff:'Basic', ...g(1) },
    { id:'d3', target:'Ich verstehe nicht', native:"I don't understand", pronun:'ikh fair-shtay-eh nikht', ex:'Entschuldigung, ich verstehe nicht.', trans:'Excuse me, I do not understand.', diff:'Basic', ...g(2) },
    { id:'d4', target:'Können Sie erklären', native:'Can you explain', pronun:'koen-en zee air-klai-ren', ex:'Können Sie das bitte erklären?', trans:'Can you please explain that?', diff:'Intermediate', ...g(3) },
    { id:'d5', target:'Danke für Ihre Geduld', native:'Thank you for your patience', pronun:'dan-keh fuer ee-reh geh-doolt', ex:'Danke für Ihre Geduld!', trans:'Thank you for your patience!', diff:'Intermediate', ...g(4) },
    { id:'d6', target:'Schönen Feierabend', native:'Have a good evening (after work)', pronun:'shoen-en fy-er-ah-bend', ex:'Schönen Feierabend zusammen!', trans:'Have a good evening, everyone!', diff:'Basic', ...g(5) },
  ],
  'preset-restaurant': [
    { id:'d1', target:'Einen Tisch für zwei', native:'A table for two', pronun:'eye-nen tish fuer tsvay', ex:'Guten Abend, einen Tisch für zwei?', trans:'Good evening, a table for two?', diff:'Basic', ...g(0) },
    { id:'d2', target:'Die Speisekarte', native:'The menu', pronun:'dee shpy-zeh-kar-teh', ex:'Dürfen wir die Speisekarte sehen?', trans:'May we see the menu?', diff:'Basic', ...g(1) },
    { id:'d3', target:'Ich hätte gern', native:'I would like', pronun:'ikh het-teh gairn', ex:'Ich hätte gern das Schnitzel.', trans:'I would like the schnitzel.', diff:'Basic', ...g(2) },
    { id:'d4', target:'Die Rechnung', native:'The bill', pronun:'dee rech-nung', ex:'Die Rechnung, bitte.', trans:'The bill, please.', diff:'Basic', ...g(3) },
    { id:'d5', target:'Vegetarisch', native:'Vegetarian', pronun:'veh-geh-tah-rish', ex:'Ich bin vegetarisch.', trans:'I am vegetarian.', diff:'Intermediate', ...g(4) },
    { id:'d6', target:'Es schmeckt ausgezeichnet', native:'It tastes excellent', pronun:'es shmekt ous-geh-tsykh-net', ex:'Es schmeckt wirklich ausgezeichnet!', trans:'It really tastes excellent!', diff:'Intermediate', ...g(5) },
  ],
  'preset-grocery': [
    { id:'d1', target:'Wo finde ich', native:'Where do I find', pronun:'voh fin-deh ikh', ex:'Wo finde ich das Brot?', trans:'Where do I find the bread?', diff:'Basic', ...g(0) },
    { id:'d2', target:'Was kostet das', native:'How much does it cost', pronun:'vas kos-tet das', ex:'Was kostet dieser Käse?', trans:'How much does this cheese cost?', diff:'Basic', ...g(1) },
    { id:'d3', target:'Die Tüte', native:'The bag', pronun:'dee tew-teh', ex:'Haben Sie Tüten?', trans:'Do you have bags?', diff:'Basic', ...g(2) },
    { id:'d4', target:'Die Kasse', native:'The checkout', pronun:'dee kah-seh', ex:'Wo ist die Kasse?', trans:'Where is the checkout?', diff:'Basic', ...g(3) },
    { id:'d5', target:'Bio', native:'Organic', pronun:'bee-oh', ex:'Haben Sie Bio-Produkte?', trans:'Do you have organic products?', diff:'Intermediate', ...g(4) },
  ],
}

// ─────────────────────────────────────────────────────────────────
// PHRASE PACKS — for Buddy Mode
// ─────────────────────────────────────────────────────────────────

const FR_PACKS: PhrasePack = {
  daycare: [
    { target:"Bonjour, je viens chercher mon enfant.", native:"Hello, I'm here to pick up my child.", emergency:false },
    { target:"Comment s'est passée sa journée aujourd'hui?", native:"How was his/her day today?", emergency:false },
    { target:"A-t-il/elle bien mangé?", native:"Did he/she eat well?", emergency:false },
    { target:"A-t-il/elle fait sa sieste?", native:"Did he/she have a nap?", emergency:false },
    { target:"Y a-t-il quelque chose d'important à savoir?", native:"Is there anything important I should know?", emergency:false },
    { target:"À quelle heure dois-je le/la déposer demain?", native:"What time should I drop him/her off tomorrow?", emergency:false },
    { target:"Merci beaucoup, bonne soirée!", native:"Thank you very much, have a good evening!", emergency:false },
    { target:"Mon enfant a des allergies — c'est très important.", native:"My child has allergies — this is very important.", emergency:true },
    { target:"Appelez-moi immédiatement s'il y a un problème.", native:"Call me immediately if there is a problem.", emergency:true },
    { target:"Mon enfant ne se sent pas bien aujourd'hui.", native:"My child is not feeling well today.", emergency:true },
  ],
  medical: [
    { target:"Bonjour, j'ai un rendez-vous.", native:"Hello, I have an appointment.", emergency:false },
    { target:"Je ne parle pas très bien français.", native:"I don't speak French very well.", emergency:false },
    { target:"Pouvez-vous parler plus lentement, s'il vous plaît?", native:"Can you speak more slowly, please?", emergency:false },
    { target:"J'ai mal ici depuis quelques jours.", native:"It has been hurting here for a few days.", emergency:false },
    { target:"Je prends ces médicaments.", native:"I am taking these medications.", emergency:false },
    { target:"Je suis allergique à la pénicilline.", native:"I am allergic to penicillin.", emergency:true },
    { target:"C'est une urgence. Appelez le 911.", native:"This is an emergency. Call 911.", emergency:true },
  ],
  work: [
    { target:"Bonjour, je suis nouveau/nouvelle ici.", native:"Hello, I am new here.", emergency:false },
    { target:"Enchanté(e) de vous rencontrer.", native:"Nice to meet you.", emergency:false },
    { target:"Pourriez-vous m'expliquer ça, s'il vous plaît?", native:"Could you explain that to me, please?", emergency:false },
    { target:"Je ne comprends pas encore tout, mais j'apprends.", native:"I don't understand everything yet, but I'm learning.", emergency:false },
    { target:"À quelle heure commence la réunion?", native:"What time does the meeting start?", emergency:false },
    { target:"Merci pour votre patience.", native:"Thank you for your patience.", emergency:false },
  ],
  food: [
    { target:"Bonjour, une table pour deux, s'il vous plaît.", native:"Hello, a table for two, please.", emergency:false },
    { target:"Qu'est-ce que vous recommandez aujourd'hui?", native:"What do you recommend today?", emergency:false },
    { target:"Je suis végétarien(ne).", native:"I am vegetarian.", emergency:false },
    { target:"L'addition, s'il vous plaît.", native:"The bill, please.", emergency:false },
    { target:"Ça contient des arachides?", native:"Does this contain peanuts?", emergency:true },
  ],
  transport: [
    { target:"Excusez-moi, où est l'arrêt d'autobus?", native:"Excuse me, where is the bus stop?", emergency:false },
    { target:"Est-ce que ce bus va au centre-ville?", native:"Does this bus go downtown?", emergency:false },
    { target:"Pouvez-vous m'aider? Je suis perdu(e).", native:"Can you help me? I am lost.", emergency:false },
    { target:"Combien ça coûte pour aller à...?", native:"How much does it cost to get to...?", emergency:false },
    { target:"Pouvez-vous me dire quand descendre?", native:"Can you tell me when to get off?", emergency:false },
  ],
}

const DE_PACKS: PhrasePack = {
  daycare: [
    { target:"Guten Tag, ich hole mein Kind ab.", native:"Good day, I'm here to pick up my child.", emergency:false },
    { target:"Wie war sein/ihr Tag heute?", native:"How was his/her day today?", emergency:false },
    { target:"Hat er/sie gut gegessen?", native:"Did he/she eat well?", emergency:false },
    { target:"Hat er/sie seinen/ihren Mittagsschlaf gemacht?", native:"Did he/she have a nap?", emergency:false },
    { target:"Gibt es etwas Wichtiges, das ich wissen sollte?", native:"Is there anything important I should know?", emergency:false },
    { target:"Um wie viel Uhr soll ich ihn/sie morgen bringen?", native:"What time should I drop him/her off tomorrow?", emergency:false },
    { target:"Vielen Dank, auf Wiedersehen!", native:"Thank you very much, goodbye!", emergency:false },
    { target:"Mein Kind hat Allergien — das ist sehr wichtig.", native:"My child has allergies — this is very important.", emergency:true },
    { target:"Bitte rufen Sie mich sofort an, wenn es ein Problem gibt.", native:"Please call me immediately if there is a problem.", emergency:true },
    { target:"Meinem Kind geht es heute nicht gut.", native:"My child is not feeling well today.", emergency:true },
  ],
  medical: [
    { target:"Guten Tag, ich habe einen Termin.", native:"Good day, I have an appointment.", emergency:false },
    { target:"Ich spreche nicht sehr gut Deutsch.", native:"I don't speak German very well.", emergency:false },
    { target:"Können Sie bitte langsamer sprechen?", native:"Can you please speak more slowly?", emergency:false },
    { target:"Hier tut es seit ein paar Tagen weh.", native:"It has been hurting here for a few days.", emergency:false },
    { target:"Ich nehme diese Medikamente.", native:"I am taking these medications.", emergency:false },
    { target:"Ich bin allergisch gegen Penicillin.", native:"I am allergic to penicillin.", emergency:true },
    { target:"Das ist ein Notfall. Rufen Sie den Notruf an!", native:"This is an emergency. Call emergency services!", emergency:true },
  ],
  work: [
    { target:"Guten Tag, ich bin neu hier.", native:"Good day, I am new here.", emergency:false },
    { target:"Freut mich, Sie kennenzulernen.", native:"Nice to meet you.", emergency:false },
    { target:"Können Sie mir das bitte erklären?", native:"Could you please explain that to me?", emergency:false },
    { target:"Ich verstehe noch nicht alles, aber ich lerne.", native:"I don't understand everything yet, but I'm learning.", emergency:false },
    { target:"Wann beginnt das Meeting?", native:"When does the meeting start?", emergency:false },
    { target:"Danke für Ihre Geduld.", native:"Thank you for your patience.", emergency:false },
  ],
  food: [
    { target:"Guten Abend, einen Tisch für zwei, bitte.", native:"Good evening, a table for two, please.", emergency:false },
    { target:"Was empfehlen Sie heute?", native:"What do you recommend today?", emergency:false },
    { target:"Ich bin Vegetarier/Vegetarierin.", native:"I am vegetarian.", emergency:false },
    { target:"Die Rechnung, bitte.", native:"The bill, please.", emergency:false },
    { target:"Enthält das Erdnüsse?", native:"Does this contain peanuts?", emergency:true },
  ],
  transport: [
    { target:"Entschuldigung, wo ist die Bushaltestelle?", native:"Excuse me, where is the bus stop?", emergency:false },
    { target:"Fährt dieser Bus ins Stadtzentrum?", native:"Does this bus go to the city centre?", emergency:false },
    { target:"Können Sie mir helfen? Ich habe mich verlaufen.", native:"Can you help me? I have gotten lost.", emergency:false },
    { target:"Was kostet eine Fahrt nach...?", native:"How much does a trip to... cost?", emergency:false },
    { target:"Können Sie mir sagen, wann ich aussteigen muss?", native:"Can you tell me when I need to get off?", emergency:false },
  ],
}

// ─────────────────────────────────────────────────────────────────
// PRESET SCENARIOS — shared, used in both languages
// ─────────────────────────────────────────────────────────────────

export const PRESET_SCENARIOS = [
  { id:'preset-daycare',    title:'Daycare Pickup',       category:'daycare',   emoji:'👶', desc:'Talk to childcare staff about your child' },
  { id:'preset-ptmeeting',  title:'Parent-Teacher Meeting', category:'daycare', emoji:'🏫', desc:'Discuss your child\'s progress at school' },
  { id:'preset-medical',    title:'Doctor\'s Appointment', category:'medical',  emoji:'🏥', desc:'Navigate a medical visit with confidence' },
  { id:'preset-pharmacy',   title:'Pharmacy Visit',       category:'medical',   emoji:'💊', desc:'Pick up prescriptions and ask about meds' },
  { id:'preset-work',       title:'First Day at Work',    category:'work',      emoji:'💼', desc:'Introduce yourself and navigate the workplace' },
  { id:'preset-coworkers',  title:'Meeting Coworkers',    category:'work',      emoji:'🤝', desc:'Small talk and getting to know your team' },
  { id:'preset-restaurant', title:'Restaurant Ordering',  category:'food',      emoji:'🍽️', desc:'Order food and handle special requests' },
  { id:'preset-grocery',    title:'Grocery Shopping',     category:'food',      emoji:'🛒', desc:'Navigate a supermarket confidently' },
  { id:'preset-neighbours', title:'Chatting with Neighbours', category:'social',emoji:'🏠', desc:'Build relationships with people nearby' },
  { id:'preset-transit',    title:'Public Transit',       category:'transport', emoji:'🚌', desc:'Take the bus or train without stress' },
  { id:'preset-directions', title:'Asking for Directions', category:'transport',emoji:'📍', desc:'Find your way around a new city' },
  { id:'preset-bank',       title:'Bank Appointment',     category:'services',  emoji:'🏦', desc:'Handle financial transactions confidently' },
  { id:'preset-airport',    title:'Airport & Travel',     category:'transport', emoji:'✈️', desc:'Navigate airports and check-in desks' },
  { id:'preset-birthday',   title:'Birthday Party',       category:'social',    emoji:'🎉', desc:'Join and enjoy social celebrations' },
]

// ─────────────────────────────────────────────────────────────────
// PUBLIC API
// ─────────────────────────────────────────────────────────────────

export function getFlashCards(scenarioId: string, lang: Lang): FlashCard[] {
  const map = lang === 'de' ? DE_CARDS : FR_CARDS
  return map[scenarioId] ?? map['preset-daycare']
}

export function getPhrasePacks(lang: Lang): PhrasePack {
  return lang === 'de' ? DE_PACKS : FR_PACKS
}

export function getLangLabel(lang: Lang) {
  return lang === 'de'
    ? { name: 'German', native: 'Deutsch', flag: '🇩🇪', tts: 'de-DE' }
    : { name: 'French', native: 'Québécois French', flag: '🍁', tts: 'fr-CA' }
}

export function getStoredLang(): Lang {
  if (typeof window === 'undefined') return 'fr'
  return (localStorage.getItem('allo_learn') as Lang) ?? 'fr'
}
