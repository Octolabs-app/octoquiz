export type Intensity = "mild" | "spicy" | "inferno";

export type TODCard = {
  t: "truth" | "dare";
  fr: string;
  en: string;
  level: Intensity;
};

export type SimpleCard = { fr: string; en: string; level: Intensity };
export type QuizCard = { fr: string; en: string; a: string; level: Intensity };

// ============ TRUTH OR DARE ============
export const TOD: TODCard[] = [
  // MILD truths
  { t: "truth", level: "mild", fr: "Quel est ton souvenir préféré de nous deux ?", en: "What is your favourite memory of us together?" },
  { t: "truth", level: "mild", fr: "Quelle était ta première impression de moi — sois honnête !", en: "What was your honest first impression of me?" },
  { t: "truth", level: "mild", fr: "Quelle chanson te fait immédiatement penser à moi ?", en: "What song instantly makes you think of me?" },
  { t: "truth", level: "mild", fr: "Quel est le compliment de ma part qui te touche le plus ?", en: "Which compliment from me means the most to you?" },
  { t: "truth", level: "mild", fr: "À quel moment as-tu su que tu étais amoureux(se) de moi ?", en: "When did you know you were falling for me?" },

  // SPICY truths
  { t: "truth", level: "spicy", fr: "Qu'est-ce qui te plaît le plus dans mon corps ?", en: "What's your favourite part of my body — and why?" },
  { t: "truth", level: "spicy", fr: "Décris la dernière fois que tu as pensé à moi… d'une manière pas innocente.", en: "Describe the last time you thought about me… not so innocently." },
  { t: "truth", level: "spicy", fr: "Quel vêtement à moi te rend complètement fou/folle ?", en: "Which outfit of mine drives you completely wild?" },
  { t: "truth", level: "spicy", fr: "Quelle est la chose la plus osée que tu aies imaginée avec moi cette semaine ?", en: "What's the boldest thing you've imagined with me this week?" },
  { t: "truth", level: "spicy", fr: "Préfères-tu mes baisers lents et profonds, ou rapides et affamés ?", en: "Do you prefer my kisses slow and deep, or fast and hungry?" },
  { t: "truth", level: "spicy", fr: "Quel endroit de mon corps adores-tu embrasser que je ne soupçonnerais jamais ?", en: "What spot on my body do you secretly love kissing that I'd never guess?" },
  { t: "truth", level: "spicy", fr: "Quand est-ce que tu m'as trouvé(e) le plus sexy sans me le dire ?", en: "When have you found me hottest without telling me?" },

  // INFERNO truths 🔥
  { t: "truth", level: "inferno", fr: "Quel fantasme veux-tu vivre avec moi cette nuit ?", en: "What fantasy do you want to live out with me tonight?" },
  { t: "truth", level: "inferno", fr: "Décris-moi en détail ta version parfaite des préliminaires.", en: "Describe in detail your perfect version of foreplay." },
  { t: "truth", level: "inferno", fr: "Où aimerais-tu que je t'embrasse en premier ce soir ?", en: "Where do you want me to kiss you first tonight?" },
  { t: "truth", level: "inferno", fr: "Qu'est-ce que tu n'as jamais osé me demander au lit ?", en: "What have you never dared ask me for in bed?" },
  { t: "truth", level: "inferno", fr: "Préfères-tu dominer ou être complètement à ma merci ?", en: "Do you prefer to take control, or be completely at my mercy?" },
  { t: "truth", level: "inferno", fr: "Quel mot ou phrase chuchoté à l'oreille te fait perdre la tête ?", en: "What word or phrase whispered in your ear makes you lose it?" },

  // MILD dares
  { t: "dare", level: "mild", fr: "Fais-moi un massage des épaules de 60 secondes — yeux fermés.", en: "Give me a 60-second shoulder massage — eyes closed." },
  { t: "dare", level: "mild", fr: "Regarde-moi dans les yeux pendant 30 secondes sans rire.", en: "Hold eye contact with me for 30 seconds without laughing." },
  { t: "dare", level: "mild", fr: "Dis-moi 5 choses que tu adores chez moi — sans hésiter.", en: "Tell me 5 things you adore about me — no hesitation." },
  { t: "dare", level: "mild", fr: "Slow danse avec moi sur la prochaine chanson, même sans musique.", en: "Slow dance with me to the next song — even without music." },
  { t: "dare", level: "mild", fr: "Embrasse-moi sur le front, la joue, le cou. Dans cet ordre.", en: "Kiss me on the forehead, cheek, then neck. In that order." },

  // SPICY dares
  { t: "dare", level: "spicy", fr: "Embrasse-moi pendant 20 secondes — sans utiliser les mains.", en: "Kiss me for 20 seconds — no hands allowed." },
  { t: "dare", level: "spicy", fr: "Donne-moi un suçon discret là où personne ne le verra demain.", en: "Leave a hidden mark somewhere no one will see tomorrow." },
  { t: "dare", level: "spicy", fr: "Enlève un vêtement de ton choix. Tu ne peux pas le remettre.", en: "Take off one item of clothing. You can't put it back on." },
  { t: "dare", level: "spicy", fr: "Murmure-moi à l'oreille la chose la plus cochonne qui te passe par la tête.", en: "Whisper in my ear the dirtiest thing on your mind right now." },
  { t: "dare", level: "spicy", fr: "Fais-moi un strip-tease de 30 secondes — choisis ta chanson.", en: "Do a 30-second striptease — pick your song." },
  { t: "dare", level: "spicy", fr: "Embrasse trois endroits de mon corps que tu préfères.", en: "Kiss your three favourite spots on my body." },
  { t: "dare", level: "spicy", fr: "Donne-moi ton meilleur french kiss. Le minuteur tourne : 30 secondes.", en: "Give me your best french kiss. Timer's running: 30 seconds." },

  // INFERNO dares 🔥
  { t: "dare", level: "inferno", fr: "Bande-moi les yeux et embrasse-moi où tu veux pendant 1 minute.", en: "Blindfold me and kiss me wherever you want for 1 minute." },
  { t: "dare", level: "inferno", fr: "Enlève-moi un vêtement — avec les dents si tu peux.", en: "Take off one item of my clothing — with your teeth if you dare." },
  { t: "dare", level: "inferno", fr: "Choisis une partie de mon corps. Adore-la pendant 60 secondes.", en: "Pick a part of my body. Worship it for 60 seconds." },
  { t: "dare", level: "inferno", fr: "Mets une glaçon dans ta bouche et embrasse-moi dans le cou.", en: "Put an ice cube in your mouth and kiss my neck." },
  { t: "dare", level: "inferno", fr: "Décris à voix haute ce que tu vas me faire après ce jeu.", en: "Describe out loud what you're going to do to me after this game." },
  { t: "dare", level: "inferno", fr: "Assieds-toi sur mes genoux et donne-moi un baiser de 60 secondes.", en: "Sit on my lap and give me a 60-second kiss." },
  { t: "dare", level: "inferno", fr: "Guide ma main là où tu veux la sentir.", en: "Guide my hand exactly where you want to feel it." },
];

// ============ NEVER HAVE I EVER ============
export const NHI: SimpleCard[] = [
  { level: "mild", fr: "Je n'ai jamais pleuré devant un film romantique.", en: "I've never cried at a romantic movie." },
  { level: "mild", fr: "Je n'ai jamais fait semblant de dormir pour éviter une conversation.", en: "I've never faked sleep to avoid a conversation." },
  { level: "mild", fr: "Je n'ai jamais cherché un(e) ex sur les réseaux depuis qu'on est ensemble.", en: "I've never stalked an ex on social media since we got together." },
  { level: "mild", fr: "Je n'ai jamais ri tout(e) seul(e) à un message que tu m'as envoyé.", en: "I've never laughed alone at a text you sent me." },
  { level: "mild", fr: "Je n'ai jamais menti sur la raison pour laquelle j'étais en retard.", en: "I've never lied about why I was late." },
  { level: "mild", fr: "Je n'ai jamais relu nos premières conversations pour sourire.", en: "I've never re-read our first conversations just to smile." },
  { level: "mild", fr: "Je n'ai jamais imaginé notre mariage en secret.", en: "I've never secretly pictured our wedding." },
  { level: "mild", fr: "Je n'ai jamais senti ton pull parce que tu me manquais.", en: "I've never smelled your hoodie because I missed you." },

  { level: "spicy", fr: "Je n'ai jamais flirté avec toi par message en pleine réunion.", en: "I've never sexted you during a meeting." },
  { level: "spicy", fr: "Je n'ai jamais pensé à toi pendant ma douche… en détail.", en: "I've never thought about you in the shower… in detail." },
  { level: "spicy", fr: "Je n'ai jamais eu envie de toi à un moment totalement inapproprié.", en: "I've never wanted you at a completely inappropriate moment." },
  { level: "spicy", fr: "Je n'ai jamais menti en disant que je n'étais 'pas d'humeur'.", en: "I've never lied saying I wasn't 'in the mood'." },
  { level: "spicy", fr: "Je n'ai jamais regardé un(e) inconnu(e) en pensant à toi.", en: "I've never looked at a stranger while thinking of you." },
  { level: "spicy", fr: "Je n'ai jamais sauvegardé une photo de toi parce que tu étais trop sexy.", en: "I've never saved a photo of you because you looked too hot." },
  { level: "spicy", fr: "Je n'ai jamais fantasmé sur toi dans un lieu public.", en: "I've never fantasised about you in a public place." },
  { level: "spicy", fr: "Je n'ai jamais menti en disant que ça avait été 'incroyable'.", en: "I've never lied saying it was 'amazing'." },

  { level: "inferno", fr: "Je n'ai jamais pensé à toi en étant seul(e)… tu vois ce que je veux dire.", en: "I've never thought of you while alone… you know what I mean." },
  { level: "inferno", fr: "Je n'ai jamais imaginé un scénario interdit avec toi cette semaine.", en: "I've never imagined a forbidden scenario with you this week." },
  { level: "inferno", fr: "Je n'ai jamais voulu te déshabiller à la seconde où tu es entré(e).", en: "I've never wanted to undress you the second you walked in." },
  { level: "inferno", fr: "Je n'ai jamais regardé du contenu pour adultes en pensant à nous.", en: "I've never watched adult content thinking about us." },
  { level: "inferno", fr: "Je n'ai jamais voulu essayer quelque chose de très osé avec toi.", en: "I've never wanted to try something really risqué with you." },
  { level: "inferno", fr: "Je n'ai jamais eu un orgasme rien qu'en pensant à toi.", en: "I've never had an orgasm thinking only of you." },
  { level: "inferno", fr: "Je n'ai jamais menti sur le nombre de fois où j'ai pensé à toi… nu(e).", en: "I've never lied about how many times I've pictured you… naked." },
  { level: "inferno", fr: "Je n'ai jamais voulu te faire des choses que je n'ai jamais avouées.", en: "I've never wanted to do things to you I've never confessed." },
];

// ============ COUPLE QUIZ ============
export const QUIZ: QuizCard[] = [
  { level: "mild", fr: "Quel est mon plat réconfortant ?", en: "What's my comfort food?", a: "Pizza, chocolat, glace, pâtes…" },
  { level: "mild", fr: "Quel est mon emoji le plus utilisé ?", en: "What's my most-used emoji?", a: "❤️, 😂, 🥺… Vérifie mon téléphone !" },
  { level: "mild", fr: "Suis-je plutôt du matin ou oiseau de nuit ?", en: "Am I a morning person or a night owl?", a: "Tu devrais le savoir par cœur !" },
  { level: "mild", fr: "Où s'est passé notre tout premier baiser ?", en: "Where was our very first kiss?", a: "Le lieu exact, pas d'à-peu-près !" },
  { level: "mild", fr: "Quelle est ma plus grande peur ?", en: "What's my biggest fear?", a: "Araignées, hauteurs, le noir, la solitude…" },
  { level: "mild", fr: "Si je gagnais à la loterie, quel serait mon premier achat ?", en: "If I won the lottery, my first purchase?", a: "Maison, voyage, voiture, sac…" },
  { level: "mild", fr: "Quelle est ma série préférée à rebinger ?", en: "My favourite show to rebinge?", a: "Tu connais la réponse !" },
  { level: "mild", fr: "Quel est mon parfum de glace fétiche ?", en: "My go-to ice cream flavour?", a: "Vanille, chocolat, pistache, mangue…" },

  { level: "spicy", fr: "Quel est le moment où j'ai le plus envie de toi ?", en: "What time of day do I want you most?", a: "Matin, après-midi, soirée, nuit…" },
  { level: "spicy", fr: "Quelle est ma zone érogène secrète préférée ?", en: "My favourite secret erogenous zone?", a: "Le cou, les hanches, l'intérieur des poignets…" },
  { level: "spicy", fr: "Quel sous-vêtement à toi est mon préféré ?", en: "Which of your underwear is my favourite?", a: "Celui qui me fait fondre — tu sais lequel !" },
  { level: "spicy", fr: "Quelle position préfère-je ?", en: "My favourite position?", a: "Sois honnête… ou démontre !" },
  { level: "spicy", fr: "Quel est mon fantasme préféré ?", en: "My favourite fantasy?", a: "Tu l'as déjà entendu une fois…" },
  { level: "spicy", fr: "Quelle partie de ton corps est mon obsession ?", en: "Which part of your body am I obsessed with?", a: "Regarde où traînent mes yeux…" },

  { level: "inferno", fr: "Quel mot prononcé pendant l'amour me rend fou/folle ?", en: "What word during sex drives me wild?", a: "Devine bien — sinon, tu bois 🍹" },
  { level: "inferno", fr: "Quel scénario role-play j'ai envie d'essayer en secret ?", en: "What roleplay scenario do I secretly want to try?", a: "Sois audacieux/audacieuse dans ta réponse !" },
  { level: "inferno", fr: "Combien de temps préfère-je que les préliminaires durent ?", en: "How long do I prefer foreplay to last?", a: "Donne une réponse en minutes !" },
  { level: "inferno", fr: "Quel endroit improbable rêve-je d'essayer avec toi ?", en: "What unlikely spot do I dream of trying with you?", a: "Sois créatif/créative…" },
];

// ============ HOT SEAT 🔥 ============
export const HOT: SimpleCard[] = [
  { level: "spicy", fr: "Quelle est la chose la plus sexy que j'ai faite cette semaine sans le savoir ?", en: "What's the sexiest thing I did this week without knowing?" },
  { level: "spicy", fr: "Décris-moi ta version idéale d'une nuit avec moi.", en: "Describe your ideal version of a night with me." },
  { level: "spicy", fr: "Quelle tenue veux-tu absolument me voir porter ce soir ?", en: "What outfit do you absolutely want to see me wear tonight?" },
  { level: "spicy", fr: "Quel est le moment le plus chaud qu'on ait jamais partagé ?", en: "What's the hottest moment we've ever shared?" },
  { level: "spicy", fr: "Quelle musique veux-tu en fond la prochaine fois ?", en: "What music do you want playing next time?" },
  { level: "spicy", fr: "Préfères-tu lumière tamisée, bougies, ou complet noir ?", en: "Dim lights, candles, or total darkness?" },

  { level: "inferno", fr: "Quel fantasme veux-tu absolument vivre cette année avec moi ?", en: "What fantasy do you absolutely want to live this year with me?" },
  { level: "inferno", fr: "Décris exactement ce que tu veux que je te fasse — dans 10 secondes.", en: "Describe exactly what you want me to do to you — in 10 seconds." },
  { level: "inferno", fr: "Quel est l'endroit le plus risqué où tu veux le faire avec moi ?", en: "What's the riskiest place you want to do it with me?" },
  { level: "inferno", fr: "Quel toy/accessoire veux-tu qu'on essaie ensemble ?", en: "What toy or accessory do you want us to try together?" },
  { level: "inferno", fr: "Préfères-tu dominer ou que je prenne complètement le contrôle ?", en: "Do you want to dominate, or for me to take complete control?" },
  { level: "inferno", fr: "Décris l'orgasme le plus intense que je t'ai donné.", en: "Describe the most intense orgasm I've ever given you." },
  { level: "inferno", fr: "Si je te bandais les yeux maintenant, que ferais-tu en premier ?", en: "If I blindfolded you right now, what would you do first?" },
  { level: "inferno", fr: "Quel mot dois-je murmurer pour que tu craques instantanément ?", en: "What word do I have to whisper for you to crack instantly?" },
  { level: "inferno", fr: "Quel souvenir intime de nous fait que tu rougis encore ?", en: "What intimate memory of us still makes you blush?" },
  { level: "inferno", fr: "Es-tu prêt(e) à monter ces escaliers dès la fin de cette partie ?", en: "Are you ready to head upstairs the second this game ends?" },
];

// ============ POSITIONS 🔥 (Kama Sutra — Real Positions) ============
export type PositionCard = {
  svgId: number;   // links to PosIllustration component
  fr: string;
  en: string;
  descFr: string;
  descEn: string;
  tipFr?: string;
  tipEn?: string;
  level: Intensity;
  duration: string;
  difficulty: 1 | 2 | 3;
  glyph: string;
};

export const POSITIONS: PositionCard[] = [
  // ── MILD ──────────────────────────────────────────────
  {
    svgId: 1, level: "mild", duration: "5–10 min", difficulty: 1, glyph: "🌹",
    fr: "La Missionnaire", en: "Missionary",
    descFr: "Face à face, un partenaire allongé sur le dos, l'autre au-dessus. Contact des yeux, des lèvres, des corps. Intimité maximale.",
    descEn: "Face to face — one lies back, the other on top. Eye contact, skin to skin, maximum intimacy.",
    tipFr: "Glisse un oreiller sous les hanches pour changer l'angle 💋",
    tipEn: "Slide a pillow under the hips to change the angle 💋",
  },
  {
    svgId: 2, level: "mild", duration: "10–20 min", difficulty: 1, glyph: "🫶",
    fr: "La Petite Cuillère", en: "The Spoon",
    descFr: "Allongés sur le côté, dos contre ventre. Pénétration par derrière, main libre pour explorer. Parfait pour la nuit.",
    descEn: "Side by side — chest to back, entering from behind. Free hand to roam everywhere. Perfect for a slow night.",
    tipFr: "L'angle est plus profond si la jambe du dessus est levée.",
    tipEn: "Deeper angle if the top leg is raised.",
  },
  {
    svgId: 3, level: "mild", duration: "5–15 min", difficulty: 1, glyph: "🕯️",
    fr: "Le Lotus", en: "The Lotus",
    descFr: "Assis(e) en tailleur, l'autre à cheval dessus, faces à faces, jambes croisées dans le dos. Mouvements lents, ondulations profondes.",
    descEn: "One sits cross-legged, the other straddles on top, face to face, legs locked around the waist. Slow, rocking rhythm.",
    tipFr: "Gardez le front collé et respirez ensemble.",
    tipEn: "Press foreheads together and breathe in sync.",
  },

  // ── SPICY ─────────────────────────────────────────────
  {
    svgId: 4, level: "spicy", duration: "5–10 min", difficulty: 2, glyph: "🔥",
    fr: "La Cavalière", en: "Cowgirl",
    descFr: "Tu t'installes au-dessus, tu mènes. Profondeur, vitesse, angle : tout te appartient. Ton partenaire profite du spectacle.",
    descEn: "You sit on top and take full control. Depth, speed, angle — all yours. Your partner gets the best view.",
    tipFr: "Penche-toi légèrement en avant pour stimuler davantage.",
    tipEn: "Lean slightly forward for extra stimulation.",
  },
  {
    svgId: 5, level: "spicy", duration: "5–10 min", difficulty: 2, glyph: "🎯",
    fr: "Cavalière Inversée", en: "Reverse Cowgirl",
    descFr: "Comme la cavalière, mais dos tourné. Angle totalement différent, profondeur maximale. Laisse les hanches parler.",
    descEn: "Like cowgirl but facing away. Totally different angle, maximum depth. Let your hips do the talking.",
    tipFr: "Pose les mains sur les genoux de ton partenaire pour t'équilibrer.",
    tipEn: "Place your hands on their knees for balance.",
  },
  {
    svgId: 6, level: "spicy", duration: "5–15 min", difficulty: 2, glyph: "🐆",
    fr: "Par Derrière", en: "Doggy Style",
    descFr: "À quatre pattes, partenaire derrière debout ou agenouillé. Pénétration profonde. Le partenaire contrôle rythme et profondeur.",
    descEn: "On all fours, partner behind kneeling or standing. Deep penetration — the partner controls depth and pace.",
    tipFr: "Arque le dos vers le bas pour plus de sensations.",
    tipEn: "Arch your back downward for more sensation.",
  },
  {
    svgId: 7, level: "spicy", duration: "5–10 min", difficulty: 2, glyph: "🪑",
    fr: "La Chaise", en: "The Chair",
    descFr: "L'un assis sur une chaise, l'autre à cheval dessus, dos tourné. Les mains libres peuvent tout explorer. Changez le rythme à volonté.",
    descEn: "One sits on a chair, the other straddles facing away. Hands are completely free. Change rhythm whenever you want.",
    tipFr: "Tenez les accoudoirs ou les cuisses pour contrôler le mouvement.",
    tipEn: "Grip the armrests or thighs to control movement.",
  },
  {
    svgId: 8, level: "spicy", duration: "5–10 min", difficulty: 2, glyph: "🌸",
    fr: "Le Papillon", en: "The Butterfly",
    descFr: "Allongé(e) au bord du lit, jambes en l'air ou sur les épaules du partenaire debout. Pénétration profonde et angle unique.",
    descEn: "Lie at the edge of the bed, legs raised or resting on the standing partner's shoulders. Deep, unique angle.",
    tipFr: "Un oreiller sous les hanches amplifie les sensations.",
    tipEn: "A pillow under the hips intensifies sensations.",
  },

  // ── INFERNO ───────────────────────────────────────────
  {
    svgId: 9, level: "inferno", duration: "10+ min", difficulty: 3, glyph: "🌊",
    fr: "Le 69", en: "The 69",
    descFr: "Deux corps, tête-bêche, se donnent du plaisir simultanément. Le plaisir total, reçu et donné en même temps.",
    descEn: "Two bodies, head to foot, pleasuring each other simultaneously. Total pleasure — given and received at the same time.",
    tipFr: "La position latérale (côte à côte) est plus confortable pour durer longtemps.",
    tipEn: "The side-lying version is more comfortable for lasting longer.",
  },
  {
    svgId: 10, level: "inferno", duration: "5–10 min", difficulty: 3, glyph: "✂️",
    fr: "Les Ciseaux", en: "Scissors",
    descFr: "Face à face couchés, jambes entrelacées en ciseaux. Friction intime intense, rythme partagé, regard dans les yeux.",
    descEn: "Lying face to face, legs interlaced like scissors. Intense intimate friction, shared rhythm, eyes locked.",
    tipFr: "Tenez le bassin de l'autre pour synchroniser le mouvement.",
    tipEn: "Hold each other's hips to synchronize movement.",
  },
  {
    svgId: 11, level: "inferno", duration: "5–8 min", difficulty: 3, glyph: "🧱",
    fr: "Contre le Mur", en: "Standing Against the Wall",
    descFr: "Debout, un(e) dos au mur, partenaire face ou derrière. L'urgence, la spontanéité. Passez à l'acte où vous êtes.",
    descEn: "Standing, one against the wall — partner in front or behind. Raw urgency. Do it right where you stand.",
    tipFr: "Genoux légèrement fléchis pour une meilleure stabilité.",
    tipEn: "Slightly bent knees for better stability.",
  },
  {
    svgId: 12, level: "inferno", duration: "5–10 min", difficulty: 3, glyph: "🦋",
    fr: "Le Bretzel", en: "The Pretzel",
    descFr: "L'un allongé sur le côté, jambe du dessus tenue par le partenaire agenouillé. Pénétration profonde et vue dégagée.",
    descEn: "One lying on side, top leg held up by the kneeling partner. Deep penetration with a clear, intimate view.",
    tipFr: "Le partenaire agenouillé peut utiliser ses deux mains librement.",
    tipEn: "The kneeling partner has both hands completely free.",
  },
  {
    svgId: 13, level: "inferno", duration: "3–5 min", difficulty: 3, glyph: "🎡",
    fr: "La Brouette", en: "The Wheelbarrow",
    descFr: "Un(e) en appui sur les mains, jambes tenues par le partenaire debout derrière. Intense, acrobatique, inoubliable.",
    descEn: "One supporting on hands, legs held up by the standing partner. Intense, acrobatic, unforgettable.",
    tipFr: "Gardez les bras fléchis et le core engagé pour tenir.",
    tipEn: "Keep arms slightly bent and core engaged to hold it.",
  },
];

// ============ WHEEL OF DESIRE 🎰 ============
export const WHEEL = {
  actions: {
    mild:    ["Embrasse", "Caresse", "Murmure à", "Souffle sur", "Effleure"],
    spicy:   ["Lèche", "Mordille", "Suce", "Suçonne", "Pince doucement", "Adore"],
    inferno: ["Dévore", "Lèche lentement", "Mords", "Domine", "Possède", "Vénère sans fin"],
  },
  actionsEn: {
    mild:    ["Kiss", "Caress", "Whisper to", "Breathe on", "Brush against"],
    spicy:   ["Lick", "Nibble", "Suck", "Mark", "Pinch softly", "Worship"],
    inferno: ["Devour", "Lick slowly", "Bite", "Dominate", "Claim", "Worship endlessly"],
  },
  parts: {
    mild:    ["mon cou", "mes lèvres", "ma joue", "mon oreille", "mes mains", "mes cheveux"],
    spicy:   ["ma clavicule", "mes hanches", "mes cuisses", "le creux de mon dos", "mes poignets", "mon ventre"],
    inferno: ["mon intérieur des cuisses", "ma poitrine", "mes fesses", "là où tu veux", "mon point faible", "partout"],
  },
  partsEn: {
    mild:    ["my neck", "my lips", "my cheek", "my ear", "my hands", "my hair"],
    spicy:   ["my collarbone", "my hips", "my thighs", "the small of my back", "my wrists", "my belly"],
    inferno: ["my inner thighs", "my chest", "my hips", "wherever you want", "my weak spot", "everywhere"],
  },
  durations: ["10 sec", "20 sec", "30 sec", "1 min", "2 min", "jusqu'à ce que je supplie"],
  durationsEn: ["10 sec", "20 sec", "30 sec", "1 min", "2 min", "until I beg"],
};
