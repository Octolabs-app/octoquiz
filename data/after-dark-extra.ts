// ═══════════════════════════════════════════
// AFTER DARK — Extra Game Data
// Would You Rather · Dirty Minds · Spin the Bottle
// 18+ only — Do not import in party game files
// ═══════════════════════════════════════════

export type Intensity = 'mild' | 'spicy' | 'inferno'

// ─── Would You Rather ───────────────────────
export interface WYRCard {
  id: number
  intensity: Intensity
  a: string
  b: string
  a_fr?: string
  b_fr?: string
}

export const WYR_CARDS: WYRCard[] = [
  // MILD
  { id: 1, intensity: 'mild', a: 'Kiss in the rain', b: 'Kiss by candlelight', a_fr: 'Embrasser sous la pluie', b_fr: 'Embrasser à la bougie' },
  { id: 2, intensity: 'mild', a: 'Watch a romantic movie together', b: 'Go on a surprise dinner date', a_fr: 'Regarder un film romantique ensemble', b_fr: 'Aller à un dîner surprise' },
  { id: 3, intensity: 'mild', a: 'Give a full-body massage', b: 'Receive a full-body massage', a_fr: 'Donner un massage corps entier', b_fr: 'Recevoir un massage corps entier' },
  { id: 4, intensity: 'mild', a: 'Write your partner a love letter', b: 'Write a spicy note for them to find later', a_fr: 'Écrire une lettre d\'amour', b_fr: 'Glisser un mot coquin pour plus tard' },
  { id: 5, intensity: 'mild', a: 'Slow dance in the kitchen at midnight', b: 'Watch the sunrise wrapped together in a blanket', a_fr: 'Danser lentement dans la cuisine à minuit', b_fr: 'Regarder le lever du soleil sous un plaid' },
  { id: 6, intensity: 'mild', a: 'Spend a whole day in bed doing nothing', b: 'Have an adventure day trip somewhere new', a_fr: 'Passer une journée entière au lit', b_fr: 'Partir en aventure dans un nouvel endroit' },
  { id: 7, intensity: 'mild', a: 'Cook a romantic dinner together', b: 'Order in and eat in bed', a_fr: 'Cuisiner un dîner romantique ensemble', b_fr: 'Commander et manger au lit' },
  { id: 8, intensity: 'mild', a: 'Kiss every time a commercial comes on', b: 'Kiss every time someone says "love" in the movie', a_fr: 'S\'embrasser à chaque pub', b_fr: 'S\'embrasser à chaque fois qu\'on dit "amour"' },
  { id: 9, intensity: 'mild', a: 'Take a bubble bath together', b: 'Take a hot shower together', a_fr: 'Prendre un bain moussant ensemble', b_fr: 'Prendre une douche chaude ensemble' },
  { id: 10, intensity: 'mild', a: 'Be the big spoon for a month', b: 'Be the little spoon for a month', a_fr: 'Être la grande cuillère pendant un mois', b_fr: 'Être la petite cuillère pendant un mois' },

  // SPICY
  { id: 11, intensity: 'spicy', a: 'Blindfolded touch for 3 minutes', b: 'Whisper fantasies for 3 minutes', a_fr: 'Toucher les yeux bandés 3 min', b_fr: 'Murmurer des fantasmes 3 min' },
  { id: 12, intensity: 'spicy', a: 'Send one flirty voice message right now', b: 'Send one flirty photo right now', a_fr: 'Envoyer un message vocal flirty maintenant', b_fr: 'Envoyer une photo flirty maintenant' },
  { id: 13, intensity: 'spicy', a: 'Role-play strangers meeting at a bar', b: 'Role-play getting caught doing something naughty', a_fr: 'Jeu de rôle : étrangers qui se rencontrent', b_fr: 'Jeu de rôle : se faire surprendre' },
  { id: 14, intensity: 'spicy', a: '5 minutes of only kissing (no hands allowed)', b: '5 minutes of only touching (no kissing allowed)', a_fr: '5 min de bisous seulement (mains interdites)', b_fr: '5 min de caresses seulement (bisous interdits)' },
  { id: 15, intensity: 'spicy', a: 'Strip poker — loser does a dare', b: 'Spin the bottle with just the two of you', a_fr: 'Strip poker — le perdant fait un défi', b_fr: 'Bouteille à deux' },
  { id: 16, intensity: 'spicy', a: 'Let your partner choose your outfit tomorrow', b: 'Let your partner plan the next date entirely', a_fr: 'Laisser l\'autre choisir ta tenue demain', b_fr: 'Laisser l\'autre planifier le prochain rendez-vous' },
  { id: 17, intensity: 'spicy', a: 'Recreate your first time together', b: 'Try something you\'ve never done before tonight', a_fr: 'Recréer votre première fois', b_fr: 'Essayer quelque chose de nouveau ce soir' },
  { id: 18, intensity: 'spicy', a: 'Spend 60 seconds kissing only the neck', b: 'Spend 60 seconds kissing only the lips', a_fr: '60 secondes de bisous dans le cou seulement', b_fr: '60 secondes de bisous sur les lèvres seulement' },
  { id: 19, intensity: 'spicy', a: 'Tease your partner for 10 minutes then stop', b: 'Let your partner tease YOU for 10 minutes', a_fr: 'Taquiner ton partenaire 10 min puis s\'arrêter', b_fr: 'Laisser ton partenaire te taquiner 10 min' },
  { id: 20, intensity: 'spicy', a: 'Describe in detail what you want to do next', b: 'Show (don\'t tell) what you want to do next', a_fr: 'Décrire en détail ce que tu veux faire ensuite', b_fr: 'Montrer (sans dire) ce que tu veux faire' },

  // INFERNO
  { id: 21, intensity: 'inferno', a: 'Do it with the lights on', b: 'Do it with a blindfold on', a_fr: 'Le faire avec la lumière allumée', b_fr: 'Le faire avec un bandeau sur les yeux' },
  { id: 22, intensity: 'inferno', a: 'Take full control for tonight', b: 'Give up all control for tonight', a_fr: 'Prendre le contrôle total ce soir', b_fr: 'Abandonner tout contrôle ce soir' },
  { id: 23, intensity: 'inferno', a: 'Try a new fantasy you\'ve never shared before', b: 'Relive the hottest moment you\'ve ever had', a_fr: 'Essayer un fantasme jamais partagé avant', b_fr: 'Revivre votre moment le plus chaud' },
  { id: 24, intensity: 'inferno', a: 'Do it somewhere unexpected in the house', b: 'Do it at an unexpected time of day', a_fr: 'Le faire dans un endroit inattendu de la maison', b_fr: 'Le faire à une heure inattendue' },
  { id: 25, intensity: 'inferno', a: 'Use a piece of clothing as a prop', b: 'Use something from the kitchen as a prop', a_fr: 'Utiliser un vêtement comme accessoire', b_fr: 'Utiliser quelque chose de la cuisine' },
  { id: 26, intensity: 'inferno', a: 'Film a short teasing clip for each other', b: 'Write the script for your hottest fantasy in detail', a_fr: 'Filmer un clip aguicheur pour l\'autre', b_fr: 'Écrire le scénario de votre fantasme le plus chaud' },
  { id: 27, intensity: 'inferno', a: 'Do something entirely for your partner\'s pleasure only', b: 'Let your partner do entirely what they want with you', a_fr: 'Faire quelque chose uniquement pour le plaisir de l\'autre', b_fr: 'Laisser l\'autre faire ce qu\'il veut de toi' },
  { id: 28, intensity: 'inferno', a: 'Try a Kama Sutra position neither of you has done', b: 'Combine two positions you already know', a_fr: 'Essayer une position Kama Sutra jamais faite', b_fr: 'Combiner deux positions que vous connaissez déjà' },
  { id: 29, intensity: 'inferno', a: 'Roleplay a forbidden scenario together', b: 'Act out a scenario from an erotic story', a_fr: 'Jouer un scénario interdit ensemble', b_fr: 'Rejouer un scénario d\'une histoire érotique' },
  { id: 30, intensity: 'inferno', a: 'Say yes to ANYTHING your partner asks for the next 30 min', b: 'Grant your partner 3 "wild card" wishes with no limits', a_fr: 'Dire oui à TOUT ce que l\'autre demande pendant 30 min', b_fr: 'Accorder 3 vœux "joker" sans limites' },
]

// ─── Dirty Minds Riddles ─────────────────────
export interface RiddleCard {
  id: number
  intensity: Intensity
  riddle: string
  answer: string
  riddle_fr?: string
  answer_fr?: string
  hint?: string
}

export const RIDDLE_CARDS: RiddleCard[] = [
  // MILD (the answer sounds naughty but is innocent)
  { id: 1, intensity: 'mild', riddle: 'I go in dry and come out wet — the longer I\'m in, the stronger I get. What am I?', answer: 'A tea bag', hint: 'You drink me every morning' },
  { id: 2, intensity: 'mild', riddle: 'I\'m spread before I\'m eaten. Your tongue is the first thing to touch me. What am I?', answer: 'Peanut butter', hint: 'You keep me in the kitchen' },
  { id: 3, intensity: 'mild', riddle: 'You put your finger in me to move me around. I have a hole in my middle. What am I?', answer: 'A bowling ball', hint: 'You do this at an alley' },
  { id: 4, intensity: 'mild', riddle: 'I come in at the bottom and go out at the top. I can be twisted, bent, and still work. What am I?', answer: 'A sock', hint: 'You wear me every day' },
  { id: 5, intensity: 'mild', riddle: 'The more you play with me, the harder I get. What am I?', answer: 'A Rubik\'s cube', hint: 'I\'m a colorful puzzle' },
  { id: 6, intensity: 'mild', riddle: 'You grab my head, wiggle me back and forth, and push me in. What am I?', answer: 'A key in a lock', hint: 'I open doors' },
  { id: 7, intensity: 'mild', riddle: 'I have a stiff shaft and my tip penetrates. I come with a quiver. What am I?', answer: 'An arrow', hint: 'Cupid carries me' },
  { id: 8, intensity: 'mild', riddle: 'I\'m full of holes but I still hold water. What am I?', answer: 'A sponge', hint: 'Find me in the kitchen' },
  { id: 9, intensity: 'mild', riddle: 'I go up and down, up and down, all day long. What am I?', answer: 'A rocking chair', hint: 'Grandma loves me' },
  { id: 10, intensity: 'mild', riddle: 'I have two balls and give pleasure to thousands daily. What am I?', answer: 'A pinball machine', hint: 'You\'d find me in an arcade' },

  // SPICY (more suggestive, but still clever wordplay)
  { id: 11, intensity: 'spicy', riddle: 'I come in all sizes, shapes and colors. I go in your mouth, you suck on me, and you might swallow. What am I?', answer: 'A lollipop / candy', hint: 'Kids love me too' },
  { id: 12, intensity: 'spicy', riddle: 'I stand up straight in the morning and droop at night. I\'m covered in hair. What am I?', answer: 'A flower (wilting)', hint: 'Put me in a vase' },
  { id: 13, intensity: 'spicy', riddle: 'The more you stroke me, the better I feel. I get wet when excited. What am I?', answer: 'A cat', hint: 'I purr' },
  { id: 14, intensity: 'spicy', riddle: 'You slide me under sheets and let me work all night. I vibrate and make noise. What am I?', answer: 'A washing machine', hint: 'I clean your clothes' },
  { id: 15, intensity: 'spicy', riddle: 'I\'m long and pink and go into something white and creamy. What am I?', answer: 'A spoon into ice cream', hint: 'Dessert time!' },
  { id: 16, intensity: 'spicy', riddle: 'You pull my head off, you push me inside, you pull me out — I come with balls. What am I?', answer: 'A pool cue', hint: 'I\'m used in billiards' },
  { id: 17, intensity: 'spicy', riddle: 'I\'m big, round, and firm. I bounce when handled. You dribble with me. What am I?', answer: 'A basketball', hint: 'Michael Jordan loved me' },
  { id: 18, intensity: 'spicy', riddle: 'You blow me, I moan. Some people call me their favorite instrument. What am I?', answer: 'A harmonica / trumpet', hint: 'I\'m musical' },
  { id: 19, intensity: 'spicy', riddle: 'I\'m always on top when things are going right. I involve lips touching. What am I?', answer: 'The cherry on a sundae', hint: 'I top ice cream' },
  { id: 20, intensity: 'spicy', riddle: 'People lick me, squeeze me, and sometimes bite me. I\'m a lot of fun at a party. What am I?', answer: 'A lime (for tequila shots)', hint: 'Find me at the bar' },

  // INFERNO (very suggestive riddles with cheeky answers)
  { id: 21, intensity: 'inferno', riddle: 'I go in tight, come out loose. The wetter I am, the better I feel. What am I?', answer: 'A knot / wet rope', hint: 'Sailors use me' },
  { id: 22, intensity: 'inferno', riddle: 'I\'m long, hard in the morning and soft at night. Women fight over me. What am I?', answer: 'The TV remote', hint: 'Point me at the screen' },
  { id: 23, intensity: 'inferno', riddle: 'You touch the inside of my lips gently, I start to moan and vibrate. What am I?', answer: 'A wine glass (crystal singing)', hint: 'I\'m in the kitchen cabinet' },
  { id: 24, intensity: 'inferno', riddle: 'The bigger I am, the more pleasure I bring. You can\'t fit me in your pocket. What am I?', answer: 'A hot tub', hint: 'You might find me in a luxury hotel' },
  { id: 25, intensity: 'inferno', riddle: 'I have a big head, a long body, and I make your eyes water when you put me in your mouth. What am I?', answer: 'A whole onion', hint: 'I\'m a vegetable' },
]

// ─── Spin the Bottle consequences ───────────────
export interface SpinConsequence {
  id: number
  intensity: Intensity
  text: string
  text_fr?: string
  duration?: string // e.g. "30 seconds"
}

export const SPIN_CONSEQUENCES: SpinConsequence[] = [
  // MILD
  { id: 1, intensity: 'mild', text: 'Give a 10-second hug', text_fr: 'Donner un câlin de 10 secondes', duration: '10 sec' },
  { id: 2, intensity: 'mild', text: 'Say 3 genuine compliments about this person', text_fr: 'Dire 3 vrais compliments sur cette personne' },
  { id: 3, intensity: 'mild', text: 'Slow dance together for 30 seconds', text_fr: 'Danser lentement 30 secondes ensemble', duration: '30 sec' },
  { id: 4, intensity: 'mild', text: 'Kiss on the cheek', text_fr: 'Bisou sur la joue' },
  { id: 5, intensity: 'mild', text: 'Hold hands for the next 2 rounds', text_fr: 'Se tenir la main pendant les 2 prochains tours' },
  { id: 6, intensity: 'mild', text: 'Feed each other something sweet', text_fr: 'Se nourrir quelque chose de sucré mutuellement' },
  { id: 7, intensity: 'mild', text: 'Whisper a secret in their ear', text_fr: 'Chuchoter un secret à l\'oreille' },
  { id: 8, intensity: 'mild', text: 'Give them a 1-minute shoulder massage', text_fr: 'Donner un massage des épaules de 1 minute', duration: '1 min' },

  // SPICY
  { id: 9, intensity: 'spicy', text: 'Kiss for 5 seconds', text_fr: 'Embrasser pendant 5 secondes', duration: '5 sec' },
  { id: 10, intensity: 'spicy', text: 'Sit on their lap for the next 2 rounds', text_fr: 'S\'asseoir sur ses genoux pour les 2 prochains tours' },
  { id: 11, intensity: 'spicy', text: 'Whisper your favorite thing about them physically', text_fr: 'Chuchoter votre chose physique préférée chez eux' },
  { id: 12, intensity: 'spicy', text: 'Kiss on the neck for 5 seconds', text_fr: 'Bisou dans le cou 5 secondes', duration: '5 sec' },
  { id: 13, intensity: 'spicy', text: 'Stare deeply into each other\'s eyes for 60 seconds (no laughing!)', text_fr: 'Se regarder dans les yeux 60 secondes (sans rire !)', duration: '60 sec' },
  { id: 14, intensity: 'spicy', text: 'Let them draw a heart somewhere on your body with their finger', text_fr: 'Les laisser tracer un coeur quelque part sur ton corps' },
  { id: 15, intensity: 'spicy', text: 'French kiss for 10 seconds', text_fr: 'Bisou langoureux 10 secondes', duration: '10 sec' },
  { id: 16, intensity: 'spicy', text: 'Carry them to the other side of the room', text_fr: 'Les porter de l\'autre côté de la pièce' },

  // INFERNO
  { id: 17, intensity: 'inferno', text: 'Kiss wherever they choose on their body', text_fr: 'Embrasser où ils choisissent sur leur corps' },
  { id: 18, intensity: 'inferno', text: 'Let them blindfold you and do whatever they want for 60 seconds', text_fr: 'Les laisser te bander les yeux et faire ce qu\'ils veulent 60s', duration: '60 sec' },
  { id: 19, intensity: 'inferno', text: 'Role-play a scene of their choice for 2 minutes', text_fr: 'Jouer un scénario de leur choix pendant 2 minutes', duration: '2 min' },
  { id: 20, intensity: 'inferno', text: 'Give them a steamy 2-minute massage anywhere they want', text_fr: 'Leur donner un massage chaud de 2 min où ils veulent', duration: '2 min' },
]
