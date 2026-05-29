export type Intensity = "mild" | "spicy" | "inferno";

export type TODCard = { t: "truth" | "dare"; fr: string; en: string; level: Intensity };
export type SimpleCard = { fr: string; en: string; level: Intensity };
export type QuizCard = { fr: string; en: string; a: string; level: Intensity };

// ============ TRUTH OR DARE ============  (90 cards)
export const TOD: TODCard[] = [
  // ─── MILD truths ───
  { t:"truth", level:"mild", fr:"Quel est ton souvenir préféré de nous deux ?", en:"What is your favourite memory of us together?" },
  { t:"truth", level:"mild", fr:"Quelle était ta première impression de moi — sois honnête !", en:"What was your honest first impression of me?" },
  { t:"truth", level:"mild", fr:"Quelle chanson te fait immédiatement penser à moi ?", en:"What song instantly makes you think of me?" },
  { t:"truth", level:"mild", fr:"Quel est le compliment de ma part qui te touche le plus ?", en:"Which compliment from me means the most to you?" },
  { t:"truth", level:"mild", fr:"À quel moment as-tu su que tu étais amoureux(se) de moi ?", en:"When did you know you were falling for me?" },
  { t:"truth", level:"mild", fr:"Quelle qualité m'admires-tu le plus en ce moment ?", en:"What quality of mine do you admire most right now?" },
  { t:"truth", level:"mild", fr:"Quel endroit rêves-tu de visiter avec moi ?", en:"What place do you dream of visiting with me?" },
  { t:"truth", level:"mild", fr:"Quelle chose idiote que j'ai dite te fait encore rire ?", en:"What silly thing I said still makes you laugh?" },
  { t:"truth", level:"mild", fr:"Si tu pouvais changer une de mes habitudes, ce serait laquelle ?", en:"If you could change one of my habits, what would it be?" },
  { t:"truth", level:"mild", fr:"Quel petit geste de ma part te fait fondre ?", en:"What small gesture of mine makes you melt?" },
  { t:"truth", level:"mild", fr:"Comment m'imagines-tu dans 10 ans ?", en:"How do you picture me in 10 years?" },
  { t:"truth", level:"mild", fr:"Quelle est la chose la plus romantique que j'ai faite pour toi ?", en:"What's the most romantic thing I've ever done for you?" },

  // ─── SPICY truths ───
  { t:"truth", level:"spicy", fr:"Qu'est-ce qui te plaît le plus dans mon corps ?", en:"What's your favourite part of my body — and why?" },
  { t:"truth", level:"spicy", fr:"Décris la dernière fois que tu as pensé à moi d'une manière pas innocente.", en:"Describe the last time you thought about me not so innocently." },
  { t:"truth", level:"spicy", fr:"Quel vêtement à moi te rend complètement fou/folle ?", en:"Which outfit of mine drives you completely wild?" },
  { t:"truth", level:"spicy", fr:"Quelle est la chose la plus osée que tu aies imaginée avec moi cette semaine ?", en:"What's the boldest thing you've imagined with me this week?" },
  { t:"truth", level:"spicy", fr:"Préfères-tu mes baisers lents et profonds, ou rapides et affamés ?", en:"Do you prefer my kisses slow and deep, or fast and hungry?" },
  { t:"truth", level:"spicy", fr:"Quel endroit de mon corps adores-tu embrasser que je ne soupçonnerais jamais ?", en:"What spot on my body do you secretly love kissing that I'd never guess?" },
  { t:"truth", level:"spicy", fr:"Quand est-ce que tu m'as trouvé(e) le plus sexy sans me le dire ?", en:"When have you found me hottest without telling me?" },
  { t:"truth", level:"spicy", fr:"Quelle est la pensée coquine la plus récente que tu as eue à mon sujet ?", en:"What's the most recent naughty thought you had about me?" },
  { t:"truth", level:"spicy", fr:"Quel endroit sur ton corps veux-tu que j'explore plus souvent ?", en:"What spot on your body do you want me to explore more often?" },
  { t:"truth", level:"spicy", fr:"Quelle partie de ton corps es-tu le plus fier/fière de montrer ?", en:"What part of your body are you most proud to show off?" },
  { t:"truth", level:"spicy", fr:"Quel baiser m'as-tu donné qui t'a rendu(e) faible aux genoux ?", en:"What kiss of mine made your knees go weak?" },
  { t:"truth", level:"spicy", fr:"Quelle est la chose la plus impulsive que tu aies faite par désir ?", en:"What's the most impulsive thing you've done out of desire?" },

  // ─── INFERNO truths 🔥 ───
  { t:"truth", level:"inferno", fr:"Quel fantasme veux-tu vivre avec moi cette nuit ?", en:"What fantasy do you want to live out with me tonight?" },
  { t:"truth", level:"inferno", fr:"Décris-moi en détail ta version parfaite des préliminaires.", en:"Describe in detail your perfect version of foreplay." },
  { t:"truth", level:"inferno", fr:"Où aimerais-tu que je t'embrasse en premier ce soir ?", en:"Where do you want me to kiss you first tonight?" },
  { t:"truth", level:"inferno", fr:"Qu'est-ce que tu n'as jamais osé me demander au lit ?", en:"What have you never dared ask me for in bed?" },
  { t:"truth", level:"inferno", fr:"Préfères-tu dominer ou être complètement à ma merci ?", en:"Do you prefer to take control, or be completely at my mercy?" },
  { t:"truth", level:"inferno", fr:"Quel mot ou phrase chuchoté à l'oreille te fait perdre la tête ?", en:"What word or phrase whispered in your ear makes you lose it?" },
  { t:"truth", level:"inferno", fr:"Quelle est ta position préférée et pourquoi exactement ?", en:"What's your favourite position and exactly why?" },
  { t:"truth", level:"inferno", fr:"Décris le scénario parfait pour ce soir — sans te censurer.", en:"Describe the perfect scenario for tonight — no censoring." },
  { t:"truth", level:"inferno", fr:"Qu'est-ce qui te ferait atteindre les étoiles le plus vite ?", en:"What would make you see stars the fastest right now?" },
  { t:"truth", level:"inferno", fr:"Quel roleplay secret meurs-tu d'envie d'essayer avec moi ?", en:"What secret roleplay are you dying to try with me?" },

  // ─── MILD dares ───
  { t:"dare", level:"mild", fr:"Fais-moi un massage des épaules de 60 secondes — yeux fermés.", en:"Give me a 60-second shoulder massage — eyes closed." },
  { t:"dare", level:"mild", fr:"Regarde-moi dans les yeux pendant 30 secondes sans rire.", en:"Hold eye contact with me for 30 seconds without laughing." },
  { t:"dare", level:"mild", fr:"Dis-moi 5 choses que tu adores chez moi — sans hésiter.", en:"Tell me 5 things you adore about me — no hesitation." },
  { t:"dare", level:"mild", fr:"Slow danse avec moi sur la prochaine chanson, même sans musique.", en:"Slow dance with me to the next song — even without music." },
  { t:"dare", level:"mild", fr:"Embrasse-moi sur le front, la joue, le cou. Dans cet ordre.", en:"Kiss me on the forehead, cheek, then neck. In that order." },
  { t:"dare", level:"mild", fr:"Envoie-moi un texto décrivant ce que tu ressens pour moi — maintenant.", en:"Send me a text describing how you feel about me — right now." },
  { t:"dare", level:"mild", fr:"Imite-moi pendant 30 secondes — que je le sache ou non.", en:"Imitate me for 30 seconds — whether I know it or not." },
  { t:"dare", level:"mild", fr:"Dessine un cœur quelque part sur mon bras avec ton doigt.", en:"Draw a heart somewhere on my arm with your finger." },
  { t:"dare", level:"mild", fr:"Dis-moi quelque chose que tu n'as jamais eu le courage de dire.", en:"Tell me something you've never had the courage to say." },
  { t:"dare", level:"mild", fr:"Prends ma main et garde-la pendant 2 minutes sans la lâcher.", en:"Take my hand and hold it for 2 minutes without letting go." },

  // ─── SPICY dares ───
  { t:"dare", level:"spicy", fr:"Embrasse-moi pendant 20 secondes — sans utiliser les mains.", en:"Kiss me for 20 seconds — no hands allowed." },
  { t:"dare", level:"spicy", fr:"Donne-moi un suçon discret là où personne ne le verra demain.", en:"Leave a hidden mark somewhere no one will see tomorrow." },
  { t:"dare", level:"spicy", fr:"Enlève un vêtement de ton choix. Tu ne peux pas le remettre.", en:"Take off one item of clothing. You can't put it back on." },
  { t:"dare", level:"spicy", fr:"Murmure-moi à l'oreille la chose la plus cochonne qui te passe par la tête.", en:"Whisper in my ear the dirtiest thing on your mind right now." },
  { t:"dare", level:"spicy", fr:"Fais-moi un strip-tease de 30 secondes — choisis ta chanson.", en:"Do a 30-second striptease — pick your song." },
  { t:"dare", level:"spicy", fr:"Embrasse trois endroits de mon corps que tu préfères.", en:"Kiss your three favourite spots on my body." },
  { t:"dare", level:"spicy", fr:"Donne-moi ton meilleur french kiss. Le minuteur tourne : 30 secondes.", en:"Give me your best french kiss. Timer's running: 30 seconds." },
  { t:"dare", level:"spicy", fr:"Décris à voix haute ce que tu veux me faire — sans te censurer.", en:"Describe out loud what you want to do to me — no censoring." },
  { t:"dare", level:"spicy", fr:"Masse-moi les mains ou les pieds pendant 90 secondes.", en:"Massage my hands or feet for 90 seconds." },
  { t:"dare", level:"spicy", fr:"Pose ma main là où tu veux la sentir le plus.", en:"Place my hand where you want to feel it most." },
  { t:"dare", level:"spicy", fr:"Montre-moi ton regard le plus séduisant pendant 15 secondes.", en:"Give me your most seductive look for 15 seconds straight." },
  { t:"dare", level:"spicy", fr:"Écris ton fantasme préféré dans un message et envoie-le-moi.", en:"Write your favourite fantasy in a message and send it to me." },

  // ─── INFERNO dares 🔥 ───
  { t:"dare", level:"inferno", fr:"Bande-moi les yeux et embrasse-moi où tu veux pendant 1 minute.", en:"Blindfold me and kiss me wherever you want for 1 minute." },
  { t:"dare", level:"inferno", fr:"Enlève-moi un vêtement — avec les dents si tu peux.", en:"Take off one item of my clothing — with your teeth if you dare." },
  { t:"dare", level:"inferno", fr:"Choisis une partie de mon corps. Adore-la pendant 60 secondes.", en:"Pick a part of my body. Worship it for 60 seconds." },
  { t:"dare", level:"inferno", fr:"Mets un glaçon dans ta bouche et embrasse-moi dans le cou.", en:"Put an ice cube in your mouth and kiss my neck." },
  { t:"dare", level:"inferno", fr:"Décris à voix haute ce que tu vas me faire après ce jeu.", en:"Describe out loud what you're going to do to me after this game." },
  { t:"dare", level:"inferno", fr:"Assieds-toi sur mes genoux et donne-moi un baiser de 60 secondes.", en:"Sit on my lap and give me a 60-second kiss." },
  { t:"dare", level:"inferno", fr:"Guide ma main là où tu veux la sentir.", en:"Guide my hand exactly where you want to feel it." },
  { t:"dare", level:"inferno", fr:"Déshabille-moi d'un vêtement aussi lentement que possible.", en:"Undress me one item as slowly as you possibly can." },
  { t:"dare", level:"inferno", fr:"Embrasse-moi là où tu n'oses jamais habituellement.", en:"Kiss me where you never usually dare to." },
  { t:"dare", level:"inferno", fr:"Passe 2 minutes à explorer mon corps avec les mains uniquement.", en:"Spend 2 minutes exploring my body with only your hands." },
];

// ============ NEVER HAVE I EVER ============  (60 cards)
export const NHI: SimpleCard[] = [
  // MILD
  { level:"mild", fr:"Je n'ai jamais pleuré devant un film romantique.", en:"I've never cried at a romantic movie." },
  { level:"mild", fr:"Je n'ai jamais fait semblant de dormir pour éviter une conversation.", en:"I've never faked sleep to avoid a conversation." },
  { level:"mild", fr:"Je n'ai jamais cherché un(e) ex sur les réseaux depuis qu'on est ensemble.", en:"I've never stalked an ex on social media since we got together." },
  { level:"mild", fr:"Je n'ai jamais ri tout(e) seul(e) à un message que tu m'as envoyé.", en:"I've never laughed alone at a text you sent me." },
  { level:"mild", fr:"Je n'ai jamais menti sur la raison pour laquelle j'étais en retard.", en:"I've never lied about why I was late." },
  { level:"mild", fr:"Je n'ai jamais relu nos premières conversations pour sourire.", en:"I've never re-read our first conversations just to smile." },
  { level:"mild", fr:"Je n'ai jamais imaginé notre mariage en secret.", en:"I've never secretly pictured our wedding." },
  { level:"mild", fr:"Je n'ai jamais senti ton pull parce que tu me manquais.", en:"I've never smelled your hoodie because I missed you." },
  { level:"mild", fr:"Je n'ai jamais préparé une excuse pour éviter de sortir avec des amis à cause de toi.", en:"I've never made an excuse to stay home with you instead of going out." },
  { level:"mild", fr:"Je n'ai jamais regardé des photos de nous en souriant tout seul(e).", en:"I've never looked at photos of us and smiled to myself." },
  { level:"mild", fr:"Je n'ai jamais commandé ta nourriture préférée juste parce que ça me faisait penser à toi.", en:"I've never ordered your favourite food just because it reminded me of you." },
  { level:"mild", fr:"Je n'ai jamais écrit quelque chose pour toi sans jamais te l'envoyer.", en:"I've never written something for you and never sent it." },
  { level:"mild", fr:"Je n'ai jamais raté exprès un film pour rester avec toi.", en:"I've never deliberately missed something just to stay with you." },
  { level:"mild", fr:"Je n'ai jamais rougi quand quelqu'un a parlé de toi.", en:"I've never blushed when someone mentioned your name." },
  { level:"mild", fr:"Je n'ai jamais repensé à notre première rencontre en souriant.", en:"I've never smiled to myself replaying our first meeting." },

  // SPICY
  { level:"spicy", fr:"Je n'ai jamais flirté avec toi par message en pleine réunion.", en:"I've never sexted you during a meeting." },
  { level:"spicy", fr:"Je n'ai jamais pensé à toi pendant ma douche… en détail.", en:"I've never thought about you in the shower… in detail." },
  { level:"spicy", fr:"Je n'ai jamais eu envie de toi à un moment totalement inapproprié.", en:"I've never wanted you at a completely inappropriate moment." },
  { level:"spicy", fr:"Je n'ai jamais menti en disant que je n'étais 'pas d'humeur'.", en:"I've never lied saying I wasn't 'in the mood'." },
  { level:"spicy", fr:"Je n'ai jamais regardé un(e) inconnu(e) en pensant à toi.", en:"I've never looked at a stranger while thinking of you." },
  { level:"spicy", fr:"Je n'ai jamais sauvegardé une photo de toi parce que tu étais trop sexy.", en:"I've never saved a photo of you because you looked too hot." },
  { level:"spicy", fr:"Je n'ai jamais fantasmé sur toi dans un lieu public.", en:"I've never fantasised about you in a public place." },
  { level:"spicy", fr:"Je n'ai jamais menti en disant que ça avait été 'incroyable'.", en:"I've never lied saying it was 'amazing'." },
  { level:"spicy", fr:"Je n'ai jamais envoyé un message coquin et regretté immédiatement.", en:"I've never sent a naughty message and immediately regretted it." },
  { level:"spicy", fr:"Je n'ai jamais interrompu quelque chose d'important parce que j'avais trop envie de toi.", en:"I've never stopped something important because I wanted you too badly." },
  { level:"spicy", fr:"Je n'ai jamais regardé tes lèvres pendant une conversation sérieuse.", en:"I've never stared at your lips during a serious conversation." },
  { level:"spicy", fr:"Je n'ai jamais imaginé t'embrasser dans un endroit inattendu.", en:"I've never imagined kissing you somewhere unexpected." },
  { level:"spicy", fr:"Je n'ai jamais fait semblant d'écouter parce que je t'admirais trop.", en:"I've never pretended to listen because I was too busy admiring you." },
  { level:"spicy", fr:"Je n'ai jamais inventé une raison de te toucher.", en:"I've never invented a reason just to touch you." },

  // INFERNO
  { level:"inferno", fr:"Je n'ai jamais pensé à toi en étant seul(e)… tu vois ce que je veux dire.", en:"I've never thought of you while alone… you know what I mean." },
  { level:"inferno", fr:"Je n'ai jamais imaginé un scénario interdit avec toi cette semaine.", en:"I've never imagined a forbidden scenario with you this week." },
  { level:"inferno", fr:"Je n'ai jamais voulu te déshabiller à la seconde où tu es entré(e).", en:"I've never wanted to undress you the second you walked in." },
  { level:"inferno", fr:"Je n'ai jamais regardé du contenu pour adultes en pensant à nous.", en:"I've never watched adult content thinking about us." },
  { level:"inferno", fr:"Je n'ai jamais voulu essayer quelque chose de très osé avec toi.", en:"I've never wanted to try something really risqué with you." },
  { level:"inferno", fr:"Je n'ai jamais eu un orgasme rien qu'en pensant à toi.", en:"I've never had an orgasm thinking only of you." },
  { level:"inferno", fr:"Je n'ai jamais menti sur le nombre de fois où j'ai pensé à toi… nu(e).", en:"I've never lied about how many times I've pictured you naked." },
  { level:"inferno", fr:"Je n'ai jamais voulu te faire des choses que je n'ai jamais avouées.", en:"I've never wanted to do things to you I've never confessed." },
  { level:"inferno", fr:"Je n'ai jamais eu du mal à me concentrer à cause d'une pensée sur toi.", en:"I've never struggled to concentrate because of a thought about you." },
  { level:"inferno", fr:"Je n'ai jamais imaginé comment ce serait si on perdait tout contrôle ensemble.", en:"I've never imagined what it'd be like if we completely lost control together." },
  { level:"inferno", fr:"Je n'ai jamais planifié mentalement notre prochaine intimité en détail.", en:"I've never mentally planned our next intimate moment in full detail." },
  { level:"inferno", fr:"Je n'ai jamais eu envie de te surprendre d'une façon très osée.", en:"I've never wanted to surprise you in a very bold way." },
  { level:"inferno", fr:"Je n'ai jamais pensé : 'Ce soir, j'ai vraiment besoin de lui/elle'.", en:"I've never thought: 'Tonight, I really need them.'" },
  { level:"inferno", fr:"Je n'ai jamais rêvé d'une nuit entière où on ne fait que ça.", en:"I've never dreamed of a whole night where that's all we do." },
  { level:"inferno", fr:"Je n'ai jamais voulu filmer un moment intime pour le revoir.", en:"I've never wanted to film an intimate moment just to replay it." },
  { level:"inferno", fr:"Je n'ai jamais compté combien de fois je t'ai voulu(e) cette semaine.", en:"I've never counted how many times I've wanted you this week." },
];

// ============ COUPLE QUIZ ============  (60 cards)
export const QUIZ: QuizCard[] = [
  // MILD
  { level:"mild", fr:"Quel est mon plat réconfortant ?", en:"What's my comfort food?", a:"Pizza, chocolat, glace, pâtes…" },
  { level:"mild", fr:"Quel est mon emoji le plus utilisé ?", en:"What's my most-used emoji?", a:"❤️, 😂, 🥺… Vérifie mon téléphone !" },
  { level:"mild", fr:"Suis-je plutôt du matin ou oiseau de nuit ?", en:"Am I a morning person or a night owl?", a:"Tu devrais le savoir par cœur !" },
  { level:"mild", fr:"Où s'est passé notre tout premier baiser ?", en:"Where was our very first kiss?", a:"Le lieu exact, pas d'à-peu-près !" },
  { level:"mild", fr:"Quelle est ma plus grande peur ?", en:"What's my biggest fear?", a:"Araignées, hauteurs, le noir, la solitude…" },
  { level:"mild", fr:"Si je gagnais à la loterie, quel serait mon premier achat ?", en:"If I won the lottery, my first purchase?", a:"Maison, voyage, voiture, sac…" },
  { level:"mild", fr:"Quelle est ma série préférée à rebinger ?", en:"My favourite show to rebinge?", a:"Tu connais la réponse !" },
  { level:"mild", fr:"Quel est mon parfum de glace fétiche ?", en:"My go-to ice cream flavour?", a:"Vanille, chocolat, pistache, mangue…" },
  { level:"mild", fr:"Quel jour de la semaine est mon préféré et pourquoi ?", en:"What's my favourite day of the week and why?", a:"Vendredi soir ? Dimanche matin ?" },
  { level:"mild", fr:"Quelle est ma façon préférée de me détendre ?", en:"What's my favourite way to unwind?", a:"Bain, musique, sport, Netflix…" },
  { level:"mild", fr:"Quelle est la chose que je fais le matin en premier ?", en:"What's the first thing I do every morning?", a:"Téléphone, café, douche, bisou…" },
  { level:"mild", fr:"Quel est mon film préféré de tous les temps ?", en:"What's my all-time favourite film?", a:"Tu devrais le savoir !" },
  { level:"mild", fr:"Comment est-ce que je préfère fêter mon anniversaire ?", en:"How do I prefer to celebrate my birthday?", a:"Petit dîner, grande fête, week-end…" },
  { level:"mild", fr:"Quel est mon talent caché que peu de gens connaissent ?", en:"What's my hidden talent that few people know?", a:"Chanter, cuisiner, dessiner…" },
  { level:"mild", fr:"Quelle est ma citation ou phrase favorite ?", en:"What's my favourite quote or phrase?", a:"Il doit y en avoir une !" },
  { level:"mild", fr:"Quel animal me représente le mieux ?", en:"What animal represents me best?", a:"Lion, chat, dauphin, renard…" },
  { level:"mild", fr:"Quelle est ma saison préférée et ma raison ?", en:"What's my favourite season and why?", a:"Printemps, été, automne, hiver…" },
  { level:"mild", fr:"Quel est le dernier livre que j'ai lu avec plaisir ?", en:"What's the last book I truly enjoyed?", a:"Pense à ce que j'ai lu récemment…" },

  // SPICY
  { level:"spicy", fr:"Quel est le moment où j'ai le plus envie de toi ?", en:"What time of day do I want you most?", a:"Matin, après-midi, soirée, nuit…" },
  { level:"spicy", fr:"Quelle est ma zone érogène secrète préférée ?", en:"My favourite secret erogenous zone?", a:"Le cou, les hanches, l'intérieur des poignets…" },
  { level:"spicy", fr:"Quel sous-vêtement à toi est mon préféré ?", en:"Which of your underwear is my favourite?", a:"Celui qui me fait fondre — tu sais lequel !" },
  { level:"spicy", fr:"Quelle position préfère-je ?", en:"My favourite position?", a:"Sois honnête… ou démontre !" },
  { level:"spicy", fr:"Quel est mon fantasme préféré ?", en:"My favourite fantasy?", a:"Tu l'as déjà entendu une fois…" },
  { level:"spicy", fr:"Quelle partie de ton corps est mon obsession ?", en:"Which part of your body am I obsessed with?", a:"Regarde où traînent mes yeux…" },
  { level:"spicy", fr:"Quelle musique veux-je jouer pendant nos moments intimes ?", en:"What music do I want during our intimate moments?", a:"Slow, jazz, R&B, silence…" },
  { level:"spicy", fr:"Comment est-ce que je préfère être embrassé(e) ?", en:"How do I prefer to be kissed?", a:"Lentement, fiévreusement, partout…" },
  { level:"spicy", fr:"Quelle tenue sur toi me rend complètement fou/folle ?", en:"What outfit on you drives me completely wild?", a:"Tu l'as sûrement porté devant moi…" },
  { level:"spicy", fr:"À quelle heure suis-je le plus dans l'ambiance le soir ?", en:"What time in the evening am I most in the mood?", a:"22h ? Minuit ? Après le dîner…" },
  { level:"spicy", fr:"Quelle est la chose la plus coquine que j'aie jamais dite ou faite ?", en:"What's the naughtiest thing I've ever said or done?", a:"Rappelle-toi bien !" },
  { level:"spicy", fr:"Quelle odeur sur toi me rend instantanément dingue ?", en:"What scent on you drives me instantly crazy?", a:"Ton parfum, après la douche…" },

  // INFERNO
  { level:"inferno", fr:"Quel mot prononcé pendant l'amour me rend fou/folle ?", en:"What word during sex drives me wild?", a:"Devine bien — sinon, tu bois 🍹" },
  { level:"inferno", fr:"Quel scénario role-play j'ai envie d'essayer en secret ?", en:"What roleplay scenario do I secretly want to try?", a:"Sois audacieux/audacieuse dans ta réponse !" },
  { level:"inferno", fr:"Combien de temps préfère-je que les préliminaires durent ?", en:"How long do I prefer foreplay to last?", a:"Donne une réponse en minutes !" },
  { level:"inferno", fr:"Quel endroit improbable rêve-je d'essayer avec toi ?", en:"What unlikely spot do I dream of trying with you?", a:"Sois créatif/créative…" },
  { level:"inferno", fr:"Qu'est-ce que je n'ai jamais osé te demander au lit ?", en:"What have I never dared ask you for in bed?", a:"Réfléchis bien — il y a forcément quelque chose…" },
  { level:"inferno", fr:"Quelle partie de mon corps adorerais-je que tu passes plus de temps à explorer ?", en:"What part of my body would I love you to spend more time exploring?", a:"Sois honnête et précis(e) !" },
  { level:"inferno", fr:"Si je pouvais contrôler notre prochaine nuit entièrement, à quoi ressemblerait-elle ?", en:"If I could design our next night entirely, what would it look like?", a:"Décris le scénario complet !" },
  { level:"inferno", fr:"Quel accessoire secret serais-je curieux(se) d'essayer avec toi ?", en:"What secret accessory would I be curious to try with you?", a:"Bandeau, plumes, glaçons…" },
  { level:"inferno", fr:"À quel moment ai-je voulu perdre complètement le contrôle avec toi ?", en:"When have I wanted to completely lose control with you?", a:"Rappelle un moment précis !" },
  { level:"inferno", fr:"Quel fantasme de toi me revient en tête le plus souvent ?", en:"What fantasy of yours comes back to me most often?", a:"Sois honnête — ça vaut des points !" },
];

// ============ HOT SEAT 🔥 ============  (45 cards)
export const HOT: SimpleCard[] = [
  { level:"spicy", fr:"Quelle est la chose la plus sexy que j'ai faite cette semaine sans le savoir ?", en:"What's the sexiest thing I did this week without knowing?" },
  { level:"spicy", fr:"Décris-moi ta version idéale d'une nuit avec moi.", en:"Describe your ideal version of a night with me." },
  { level:"spicy", fr:"Quelle tenue veux-tu absolument me voir porter ce soir ?", en:"What outfit do you absolutely want to see me wear tonight?" },
  { level:"spicy", fr:"Quel est le moment le plus chaud qu'on ait jamais partagé ?", en:"What's the hottest moment we've ever shared?" },
  { level:"spicy", fr:"Quelle musique veux-tu en fond la prochaine fois ?", en:"What music do you want playing next time?" },
  { level:"spicy", fr:"Préfères-tu lumière tamisée, bougies, ou complet noir ?", en:"Dim lights, candles, or total darkness?" },
  { level:"spicy", fr:"Quelle partie de mon corps veux-tu que j'affiche davantage ?", en:"What part of my body do you want me to show off more?" },
  { level:"spicy", fr:"Décris la façon dont tu aimes que je t'embrasse.", en:"Describe exactly how you like to be kissed." },
  { level:"spicy", fr:"Quelle chose ai-je faite récemment qui t'a rendu(e) complètement dingue ?", en:"What have I done recently that drove you completely wild?" },
  { level:"spicy", fr:"Qu'est-ce que j'ai en ce moment sur moi que tu voudrais enlever ?", en:"What am I wearing right now that you'd like to take off?" },
  { level:"spicy", fr:"Comment préfères-tu être touché(e) quand on commence ?", en:"How do you prefer to be touched at the very start?" },
  { level:"spicy", fr:"Si tu pouvais me chuchoter une instruction pour ce soir, ce serait quoi ?", en:"If you could whisper me one instruction for tonight, what would it be?" },
  { level:"spicy", fr:"Quel détail physique de moi t'attire le plus en ce moment ?", en:"What physical detail of mine attracts you most right now?" },
  { level:"spicy", fr:"Que veux-tu que je fasse avec mes mains ce soir ?", en:"What do you want me to do with my hands tonight?" },
  { level:"spicy", fr:"Quel moment de notre relation as-tu trouvé le plus excitant ?", en:"What moment in our relationship did you find most exciting?" },

  { level:"inferno", fr:"Quel fantasme veux-tu absolument vivre cette année avec moi ?", en:"What fantasy do you absolutely want to live this year with me?" },
  { level:"inferno", fr:"Décris exactement ce que tu veux que je te fasse — dans 10 secondes.", en:"Describe exactly what you want me to do to you — in 10 seconds." },
  { level:"inferno", fr:"Quel est l'endroit le plus risqué où tu veux le faire avec moi ?", en:"What's the riskiest place you want to do it with me?" },
  { level:"inferno", fr:"Quel toy/accessoire veux-tu qu'on essaie ensemble ?", en:"What toy or accessory do you want us to try together?" },
  { level:"inferno", fr:"Préfères-tu dominer ou que je prenne complètement le contrôle ?", en:"Do you want to dominate, or for me to take complete control?" },
  { level:"inferno", fr:"Décris l'orgasme le plus intense que je t'ai donné.", en:"Describe the most intense orgasm I've ever given you." },
  { level:"inferno", fr:"Si je te bandais les yeux maintenant, que ferais-tu en premier ?", en:"If I blindfolded you right now, what would you do first?" },
  { level:"inferno", fr:"Quel mot dois-je murmurer pour que tu craques instantanément ?", en:"What word do I have to whisper for you to crack instantly?" },
  { level:"inferno", fr:"Quel souvenir intime de nous fait que tu rougis encore ?", en:"What intimate memory of us still makes you blush?" },
  { level:"inferno", fr:"Es-tu prêt(e) à monter ces escaliers dès la fin de cette partie ?", en:"Are you ready to head upstairs the second this game ends?" },
  { level:"inferno", fr:"Qu'est-ce qui garantit à 100% que tu seras à ma merci ?", en:"What is 100% guaranteed to put you completely at my mercy?" },
  { level:"inferno", fr:"Décris la façon dont tu veux être réveillé(e) demain matin.", en:"Describe exactly how you want to wake up tomorrow morning." },
  { level:"inferno", fr:"Si on n'avait qu'une heure — comment tu la passerais avec moi ?", en:"If we only had one hour — how would you spend it with me?" },
  { level:"inferno", fr:"Quelle chose n'as-tu jamais dite tout haut mais rêves d'essayer ?", en:"What have you never said out loud but dream of trying?" },
  { level:"inferno", fr:"Quelle position rêves-tu qu'on explore ce soir ?", en:"What position are you dreaming we explore tonight?" },
];

// ============ POSITIONS 🔥 ============
// No SVG — elegant illustrated cards
export type PositionCard = {
  id: number;
  icon: string;        // large emoji as visual anchor
  fr: string;
  en: string;
  descFr: string;
  descEn: string;
  tipFr: string;
  tipEn: string;
  level: Intensity;
  duration: string;
  difficulty: 1 | 2 | 3;
  keywords: string[];   // illustrated badge chips
};

export const POSITIONS: PositionCard[] = [
  // ── MILD ──
  {
    id:1, level:"mild", duration:"5–10 min", difficulty:1, icon:"🌹",
    fr:"La Missionnaire", en:"Missionary",
    descFr:"Face à face — un partenaire allongé sur le dos, l'autre au-dessus. Contact des yeux, des lèvres, des corps. Intimité maximale.",
    descEn:"Face to face — one lies back, the other on top. Eye contact, skin to skin, maximum intimacy.",
    tipFr:"Glisse un oreiller sous les hanches pour changer l'angle 💋",
    tipEn:"Slide a pillow under the hips to change the angle 💋",
    keywords:["Eye contact","Intimate","Classic"],
  },
  {
    id:2, level:"mild", duration:"10–20 min", difficulty:1, icon:"🫶",
    fr:"La Petite Cuillère", en:"Spooning",
    descFr:"Allongés sur le côté, dos contre ventre. Pénétration par derrière, main libre pour explorer. Parfait pour une nuit lente.",
    descEn:"Side by side — chest to back, entering from behind. Free hand to roam everywhere. Perfect for a slow night.",
    tipFr:"L'angle est plus profond si la jambe du dessus est levée.",
    tipEn:"Deeper angle if the top leg is raised.",
    keywords:["Cosy","Rear entry","Relaxed"],
  },
  {
    id:3, level:"mild", duration:"5–15 min", difficulty:1, icon:"🕯️",
    fr:"Le Lotus", en:"Lotus",
    descFr:"Assis(e) en tailleur, l'autre à cheval dessus face à face. Mouvements lents, ondulations profondes, front contre front.",
    descEn:"One sits cross-legged, the other straddles on top face to face. Slow rocking rhythm, press foreheads together.",
    tipFr:"Gardez le front collé et respirez ensemble.",
    tipEn:"Press foreheads together and breathe in sync.",
    keywords:["Tantric","Face to face","Meditative"],
  },
  {
    id:4, level:"mild", duration:"5–10 min", difficulty:1, icon:"🌙",
    fr:"Sur le Côté", en:"Side by Side",
    descFr:"Deux corps allongés face à face, jambes entrelacées. Doux, lent, romantique. Parfait pour commencer.",
    descEn:"Both lying face to face, legs entwined. Soft, slow, romantic — perfect for starting slow.",
    tipFr:"Les deux partenaires peuvent guider le rythme ensemble.",
    tipEn:"Both partners can guide the rhythm together.",
    keywords:["Gentle","Eye contact","Romantic"],
  },

  // ── SPICY ──
  {
    id:5, level:"spicy", duration:"5–10 min", difficulty:2, icon:"🔥",
    fr:"La Cavalière", en:"Cowgirl",
    descFr:"Tu t'installes au-dessus, tu mènes. Profondeur, vitesse, angle : tout t'appartient. Ton partenaire profite du spectacle.",
    descEn:"You sit on top and take full control. Depth, speed, angle — all yours. Your partner gets the best view.",
    tipFr:"Penche-toi légèrement en avant pour stimuler davantage.",
    tipEn:"Lean slightly forward for extra stimulation.",
    keywords:["She leads","Deep","Eye contact"],
  },
  {
    id:6, level:"spicy", duration:"5–10 min", difficulty:2, icon:"🎯",
    fr:"Cavalière Inversée", en:"Reverse Cowgirl",
    descFr:"Comme la cavalière, mais dos tourné. Angle totalement différent, profondeur maximale. Laisse les hanches parler.",
    descEn:"Like cowgirl but facing away. Totally different angle, maximum depth. Let your hips do the talking.",
    tipFr:"Pose les mains sur les genoux pour t'équilibrer.",
    tipEn:"Place hands on their knees for balance.",
    keywords:["Deep","She leads","View"],
  },
  {
    id:7, level:"spicy", duration:"5–15 min", difficulty:2, icon:"🐆",
    fr:"Par Derrière", en:"Doggy Style",
    descFr:"À quatre pattes, partenaire derrière. Pénétration profonde. Le partenaire contrôle rythme et profondeur.",
    descEn:"On all fours, partner behind. Deep penetration — the partner controls depth and pace.",
    tipFr:"Arque le dos vers le bas pour plus de sensations.",
    tipEn:"Arch your back downward for more sensation.",
    keywords:["Deep","Powerful","Hands free"],
  },
  {
    id:8, level:"spicy", duration:"5–10 min", difficulty:2, icon:"🪑",
    fr:"La Chaise", en:"The Chair",
    descFr:"L'un assis sur une chaise, l'autre à cheval dos tourné. Les mains libres peuvent tout explorer.",
    descEn:"One sits on a chair, the other straddles facing away. Hands are completely free.",
    tipFr:"Tenez les accoudoirs ou les cuisses pour le contrôle.",
    tipEn:"Grip the armrests or thighs for control.",
    keywords:["Seated","Hands free","Fun"],
  },
  {
    id:9, level:"spicy", duration:"5–10 min", difficulty:2, icon:"🌸",
    fr:"Le Papillon", en:"Butterfly",
    descFr:"Allongé(e) au bord du lit, jambes sur les épaules du partenaire debout. Pénétration profonde et angle unique.",
    descEn:"Lie at the edge of the bed, legs on the standing partner's shoulders. Deep and unique angle.",
    tipFr:"Un oreiller sous les hanches amplifie les sensations.",
    tipEn:"A pillow under the hips intensifies sensations.",
    keywords:["Edge of bed","Deep","Eye contact"],
  },
  {
    id:10, level:"spicy", duration:"5–12 min", difficulty:2, icon:"🌀",
    fr:"L'Hélice", en:"The Helix",
    descFr:"Debout, partenaire entré(e) par derrière, les deux font face au même mur. Un bras autour de la taille.",
    descEn:"Standing, partner entering from behind, both facing the same direction. One arm wrapped around the waist.",
    tipFr:"Un miroir en face rend l'expérience encore plus intense.",
    tipEn:"A mirror in front makes the experience far more intense.",
    keywords:["Standing","Rear","Intense"],
  },

  // ── INFERNO ──
  {
    id:11, level:"inferno", duration:"10+ min", difficulty:3, icon:"🌊",
    fr:"Le 69", en:"69",
    descFr:"Deux corps, tête-bêche, se donnent du plaisir simultanément. Plaisir total, reçu et donné en même temps.",
    descEn:"Two bodies, head to foot, pleasuring each other simultaneously. Total pleasure — given and received.",
    tipFr:"La position latérale est plus confortable pour durer longtemps.",
    tipEn:"The side-lying version is more comfortable for lasting longer.",
    keywords:["Mutual","Simultaneous","Intense"],
  },
  {
    id:12, level:"inferno", duration:"5–10 min", difficulty:3, icon:"🧱",
    fr:"Contre le Mur", en:"Against the Wall",
    descFr:"Debout, un(e) dos au mur, partenaire face ou derrière. L'urgence, la spontanéité. Passez à l'acte où vous êtes.",
    descEn:"Standing, one against the wall — partner in front or behind. Raw urgency. Do it right where you stand.",
    tipFr:"Genoux légèrement fléchis pour une meilleure stabilité.",
    tipEn:"Slightly bent knees for better stability.",
    keywords:["Standing","Spontaneous","Urgent"],
  },
  {
    id:13, level:"inferno", duration:"5–10 min", difficulty:3, icon:"🦋",
    fr:"Le Bretzel", en:"Pretzel",
    descFr:"L'un sur le côté, jambe du dessus tenue par le partenaire agenouillé. Pénétration profonde et vue dégagée.",
    descEn:"One lying on side, top leg held up by the kneeling partner. Deep penetration with an intimate view.",
    tipFr:"Le partenaire agenouillé a les deux mains complètement libres.",
    tipEn:"The kneeling partner has both hands completely free.",
    keywords:["Deep","Kneeling","Flexible"],
  },
  {
    id:14, level:"inferno", duration:"5–8 min", difficulty:3, icon:"🎡",
    fr:"La Brouette", en:"Wheelbarrow",
    descFr:"Un(e) en appui sur les mains, jambes tenues par le partenaire debout derrière. Intense, acrobatique, inoubliable.",
    descEn:"One supporting on hands, legs held by the standing partner. Intense, acrobatic, unforgettable.",
    tipFr:"Gardez les bras légèrement fléchis et le core engagé.",
    tipEn:"Keep arms slightly bent and core engaged.",
    keywords:["Advanced","Standing","Acrobatic"],
  },
  {
    id:15, level:"inferno", duration:"3–8 min", difficulty:3, icon:"✂️",
    fr:"Les Ciseaux", en:"Scissors",
    descFr:"Face à face allongés, jambes entrelacées en ciseaux. Friction intime intense, rythme partagé.",
    descEn:"Lying face to face, legs interlaced like scissors. Intense intimate friction, shared rhythm.",
    tipFr:"Tenez le bassin de l'autre pour synchroniser.",
    tipEn:"Hold each other's hips to synchronize movement.",
    keywords:["Friction","Face to face","Mutual"],
  },
];

// ============ WHEEL OF DESIRE 🎰 ============
export const WHEEL = {
  actions: {
    mild:    ["Embrasse","Caresse","Murmure à","Souffle sur","Effleure","Tiens doucement"],
    spicy:   ["Lèche","Mordille","Suce","Marque","Pince doucement","Adore","Trace avec ta langue"],
    inferno: ["Dévore","Lèche lentement","Mords","Domine","Possède","Vénère sans fin","Explore avec ta bouche"],
  },
  actionsEn: {
    mild:    ["Kiss","Caress","Whisper to","Breathe on","Brush against","Hold gently"],
    spicy:   ["Lick","Nibble","Suck","Mark","Pinch softly","Worship","Trace with your tongue"],
    inferno: ["Devour","Lick slowly","Bite","Dominate","Claim","Worship endlessly","Explore with your mouth"],
  },
  parts: {
    mild:    ["mon cou","mes lèvres","ma joue","mon oreille","mes mains","mes cheveux","mon poignet"],
    spicy:   ["ma clavicule","mes hanches","mes cuisses","le creux de mon dos","mes poignets","mon ventre","mon épaule"],
    inferno: ["mon intérieur des cuisses","ma poitrine","mes fesses","là où tu veux","mon point faible","partout","ma nuque"],
  },
  partsEn: {
    mild:    ["my neck","my lips","my cheek","my ear","my hands","my hair","my wrist"],
    spicy:   ["my collarbone","my hips","my thighs","the small of my back","my wrists","my belly","my shoulder"],
    inferno: ["my inner thighs","my chest","my hips","wherever you want","my weak spot","everywhere","my nape"],
  },
  durations: ["10 sec","20 sec","30 sec","1 min","2 min","jusqu'à ce que je supplie"],
  durationsEn: ["10 sec","20 sec","30 sec","1 min","2 min","until I beg"],
};
