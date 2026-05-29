// ═══════════════════════════════════════════
// AFTER DARK — Extra Game Data  (18+ only)
// ═══════════════════════════════════════════

export type Intensity = 'mild' | 'spicy' | 'inferno'

// ─── Would You Rather ─── (60 cards)
export interface WYRCard { id:number; intensity:Intensity; a:string; b:string; a_fr?:string; b_fr?:string }

export const WYR_CARDS: WYRCard[] = [
  // MILD
  { id:1,  intensity:'mild', a:'Kiss in the rain', b:'Kiss by candlelight', a_fr:'Embrasser sous la pluie', b_fr:'Embrasser à la bougie' },
  { id:2,  intensity:'mild', a:'Watch a romantic movie together', b:'Go on a surprise dinner date', a_fr:'Regarder un film romantique', b_fr:'Dîner surprise' },
  { id:3,  intensity:'mild', a:'Give a full-body massage', b:'Receive a full-body massage', a_fr:'Donner un massage corps entier', b_fr:'Recevoir un massage corps entier' },
  { id:4,  intensity:'mild', a:'Write your partner a love letter', b:'Write a spicy note for them to find later', a_fr:'Écrire une lettre d\'amour', b_fr:'Glisser un mot coquin pour plus tard' },
  { id:5,  intensity:'mild', a:'Slow dance in the kitchen at midnight', b:'Watch the sunrise wrapped together', a_fr:'Danser dans la cuisine à minuit', b_fr:'Regarder le lever du soleil ensemble' },
  { id:6,  intensity:'mild', a:'Spend a whole day in bed', b:'Have an adventure day trip', a_fr:'Journée entière au lit', b_fr:'Excursion aventure' },
  { id:7,  intensity:'mild', a:'Cook a romantic dinner together', b:'Order in and eat in bed', a_fr:'Cuisiner un dîner romantique', b_fr:'Commander et manger au lit' },
  { id:8,  intensity:'mild', a:'Kiss every time a commercial comes on', b:'Kiss every time someone says "love" in the movie', a_fr:'S\'embrasser à chaque pub', b_fr:'S\'embrasser à chaque "amour"' },
  { id:9,  intensity:'mild', a:'Take a bubble bath together', b:'Take a hot shower together', a_fr:'Bain moussant ensemble', b_fr:'Douche chaude ensemble' },
  { id:10, intensity:'mild', a:'Be the big spoon for a month', b:'Be the little spoon for a month', a_fr:'Grande cuillère un mois', b_fr:'Petite cuillère un mois' },
  { id:11, intensity:'mild', a:'Go to a couples spa for a day', b:'Have a spa day at home', a_fr:'Spa en couple pour la journée', b_fr:'Spa fait maison' },
  { id:12, intensity:'mild', a:'Recreate your first date exactly', b:'Plan a completely new date you\'ve never done', a_fr:'Recréer votre premier rendez-vous', b_fr:'Planifier quelque chose de totalement nouveau' },
  { id:13, intensity:'mild', a:'Send each other love notes all week', b:'Do one big romantic gesture', a_fr:'Se envoyer des mots doux toute la semaine', b_fr:'Faire un grand geste romantique' },
  { id:14, intensity:'mild', a:'Pick your partner\'s outfit for a week', b:'Let your partner pick your hairstyle', a_fr:'Choisir la tenue de l\'autre une semaine', b_fr:'Laisser l\'autre choisir ta coiffure' },
  { id:15, intensity:'mild', a:'Fall asleep to a movie every night', b:'Read to each other before bed', a_fr:'S\'endormir devant un film', b_fr:'Se lire des histoires avant de dormir' },
  { id:16, intensity:'mild', a:'Go stargazing together', b:'Go skinny dipping somewhere private', a_fr:'Observer les étoiles ensemble', b_fr:'Se baigner nu quelque part en privé' },
  { id:17, intensity:'mild', a:'Get matching tattoos', b:'Get matching piercings', a_fr:'Tatouages assortis', b_fr:'Piercings assortis' },
  { id:18, intensity:'mild', a:'Spend a week with no phones', b:'Spend a week saying "I love you" 10x a day', a_fr:'Une semaine sans téléphone', b_fr:'Dire "je t\'aime" 10x par jour' },

  // SPICY
  { id:19, intensity:'spicy', a:'Blindfolded touch for 3 minutes', b:'Whisper fantasies for 3 minutes', a_fr:'Toucher les yeux bandés 3 min', b_fr:'Murmurer des fantasmes 3 min' },
  { id:20, intensity:'spicy', a:'Send one flirty voice message right now', b:'Send one flirty photo right now', a_fr:'Message vocal flirty maintenant', b_fr:'Photo flirty maintenant' },
  { id:21, intensity:'spicy', a:'Role-play strangers meeting at a bar', b:'Role-play getting caught doing something naughty', a_fr:'Étrangers qui se rencontrent', b_fr:'Se faire surprendre' },
  { id:22, intensity:'spicy', a:'5 minutes of only kissing (no hands)', b:'5 minutes of only touching (no kissing)', a_fr:'5 min bisous seulement', b_fr:'5 min caresses seulement' },
  { id:23, intensity:'spicy', a:'Strip poker — loser does a dare', b:'Spin the bottle with just the two of you', a_fr:'Strip poker', b_fr:'Bouteille à deux' },
  { id:24, intensity:'spicy', a:'Let your partner choose your outfit tomorrow', b:'Let your partner plan the next date entirely', a_fr:'L\'autre choisit ta tenue demain', b_fr:'L\'autre planifie le prochain rendez-vous' },
  { id:25, intensity:'spicy', a:'Recreate your first time together', b:'Try something you\'ve never done before tonight', a_fr:'Recréer votre première fois', b_fr:'Essayer quelque chose de nouveau ce soir' },
  { id:26, intensity:'spicy', a:'Spend 60 seconds kissing only the neck', b:'Spend 60 seconds kissing only the lips', a_fr:'60 sec bisous dans le cou', b_fr:'60 sec bisous sur les lèvres' },
  { id:27, intensity:'spicy', a:'Tease your partner for 10 minutes then stop', b:'Let your partner tease YOU for 10 minutes', a_fr:'Taquiner 10 min puis s\'arrêter', b_fr:'Laisser l\'autre te taquiner 10 min' },
  { id:28, intensity:'spicy', a:'Describe in detail what you want to do next', b:'Show (don\'t tell) what you want to do next', a_fr:'Décrire ce que tu veux faire', b_fr:'Montrer sans dire' },
  { id:29, intensity:'spicy', a:'Leave a love bite somewhere hidden', b:'Write a message on their skin with your finger', a_fr:'Laisser une marque cachée', b_fr:'Écrire sur sa peau avec le doigt' },
  { id:30, intensity:'spicy', a:'Kiss with an ice cube in your mouth', b:'Kiss straight after eating something sweet', a_fr:'Embrasser avec un glaçon', b_fr:'Embrasser après quelque chose de sucré' },
  { id:31, intensity:'spicy', a:'Spend an hour with no words — touch only', b:'Spend an hour where only you can ask for things', a_fr:'Une heure sans mots', b_fr:'Une heure où seul(e) toi peux demander' },
  { id:32, intensity:'spicy', a:'Slow dance in underwear in the living room', b:'Shower together with the lights off', a_fr:'Danser en sous-vêtements', b_fr:'Douche ensemble dans le noir' },
  { id:33, intensity:'spicy', a:'Give a 10-minute massage and then stop', b:'Be given a 10-minute massage and stay still', a_fr:'Donner un massage 10 min', b_fr:'Recevoir un massage immobile' },
  { id:34, intensity:'spicy', a:'Watch an erotic film scene together', b:'Read an erotic story aloud to each other', a_fr:'Regarder une scène ensemble', b_fr:'Se lire une histoire érotique à voix haute' },

  // INFERNO
  { id:35, intensity:'inferno', a:'Do it with the lights on', b:'Do it with a blindfold on', a_fr:'Lumière allumée', b_fr:'Les yeux bandés' },
  { id:36, intensity:'inferno', a:'Take full control for tonight', b:'Give up all control for tonight', a_fr:'Contrôle total ce soir', b_fr:'Abandonner tout contrôle' },
  { id:37, intensity:'inferno', a:'Try a new fantasy you\'ve never shared before', b:'Relive the hottest moment you\'ve ever had', a_fr:'Fantasme jamais partagé', b_fr:'Revivre votre moment le plus chaud' },
  { id:38, intensity:'inferno', a:'Do it somewhere unexpected in the house', b:'Do it at an unexpected time of day', a_fr:'Endroit inattendu de la maison', b_fr:'Heure inattendue' },
  { id:39, intensity:'inferno', a:'Use a piece of clothing as a prop', b:'Use something from the kitchen as a prop', a_fr:'Vêtement comme accessoire', b_fr:'Quelque chose de la cuisine' },
  { id:40, intensity:'inferno', a:'Film a short teasing clip for each other', b:'Write the script for your hottest fantasy', a_fr:'Filmer un clip aguicheur', b_fr:'Écrire le scénario de votre fantasme' },
  { id:41, intensity:'inferno', a:'Do something entirely for your partner\'s pleasure only', b:'Let your partner do entirely what they want with you', a_fr:'Tout pour le plaisir de l\'autre', b_fr:'Laisser l\'autre faire ce qu\'il veut' },
  { id:42, intensity:'inferno', a:'Try a Kama Sutra position neither of you has done', b:'Combine two positions you already know', a_fr:'Position jamais faite', b_fr:'Combiner deux positions connues' },
  { id:43, intensity:'inferno', a:'Roleplay a forbidden scenario together', b:'Act out a scene from an erotic story', a_fr:'Scénario interdit', b_fr:'Scène d\'une histoire érotique' },
  { id:44, intensity:'inferno', a:'Say yes to ANYTHING for the next 30 min', b:'Grant 3 "wild card" wishes with no limits', a_fr:'Oui à TOUT pendant 30 min', b_fr:'3 vœux sans limites' },
  { id:45, intensity:'inferno', a:'Do it against a wall for the whole time', b:'Do it starting on the floor and ending in bed', a_fr:'Contre un mur tout le temps', b_fr:'Sol puis lit' },
  { id:46, intensity:'inferno', a:'Start with a 3-minute blindfolded sensory session first', b:'Start with your partner choosing every move', a_fr:'Session sensorielle yeux bandés d\'abord', b_fr:'L\'autre choisit chaque geste' },
  { id:47, intensity:'inferno', a:'Do it completely silently (no sounds allowed)', b:'Do it with specific music you both choose now', a_fr:'Complètement en silence', b_fr:'Sur une musique choisie maintenant' },
  { id:48, intensity:'inferno', a:'Let your partner choose 3 positions to try tonight', b:'You choose 3 things you\'ve never done', a_fr:'L\'autre choisit 3 positions ce soir', b_fr:'Tu choisis 3 choses jamais faites' },
]

// ─── Dirty Minds Riddles ─── (50 cards)
export interface RiddleCard { id:number; intensity:Intensity; riddle:string; answer:string; riddle_fr?:string; answer_fr?:string; hint?:string }

export const RIDDLE_CARDS: RiddleCard[] = [
  // MILD
  { id:1,  intensity:'mild', riddle:"I go in dry and come out wet — the longer I'm in, the stronger I get. What am I?", answer:"A tea bag", hint:"You drink me every morning" },
  { id:2,  intensity:'mild', riddle:"I'm spread before I'm eaten. Your tongue is the first thing to touch me. What am I?", answer:"Peanut butter", hint:"You keep me in the kitchen" },
  { id:3,  intensity:'mild', riddle:"You put your finger in me to move me around. I have a hole in my middle. What am I?", answer:"A bowling ball", hint:"You do this at an alley" },
  { id:4,  intensity:'mild', riddle:"I come in at the bottom and go out at the top. What am I?", answer:"A sock", hint:"You wear me every day" },
  { id:5,  intensity:'mild', riddle:"The more you play with me, the harder I get. What am I?", answer:"A Rubik's cube", hint:"I'm a colorful puzzle" },
  { id:6,  intensity:'mild', riddle:"You grab my head, wiggle me back and forth, and push me in. What am I?", answer:"A key in a lock", hint:"I open doors" },
  { id:7,  intensity:'mild', riddle:"I have a stiff shaft, my tip penetrates, and I come with a quiver. What am I?", answer:"An arrow", hint:"Cupid carries me" },
  { id:8,  intensity:'mild', riddle:"I'm full of holes but I still hold water. What am I?", answer:"A sponge", hint:"Find me in the kitchen" },
  { id:9,  intensity:'mild', riddle:"I go up and down all day long. What am I?", answer:"A rocking chair", hint:"Grandma loves me" },
  { id:10, intensity:'mild', riddle:"I have two balls and give pleasure to thousands daily. What am I?", answer:"A pinball machine", hint:"You'd find me in an arcade" },
  { id:11, intensity:'mild', riddle:"I'm long, hard, and everyone wants to try me once. What am I?", answer:"A roller coaster", hint:"You'll find me at an amusement park" },
  { id:12, intensity:'mild', riddle:"You stroke me to make me roar, but when I'm cold I won't start. What am I?", answer:"A car engine", hint:"I'm in your garage" },
  { id:13, intensity:'mild', riddle:"I get bigger when you push me in and out. What am I?", answer:"A pump (bicycle pump)", hint:"I fill with air" },
  { id:14, intensity:'mild', riddle:"I rise when hot, shrink when cold, and go in your mouth. What am I?", answer:"Bread dough / food", hint:"You bake me" },
  { id:15, intensity:'mild', riddle:"People love to touch my face and rub me. I help you find where you are. What am I?", answer:"A touchscreen GPS", hint:"I live in cars" },

  // SPICY
  { id:16, intensity:'spicy', riddle:"I come in all sizes and go in your mouth. You suck on me and might swallow. What am I?", answer:"A lollipop", hint:"Kids love me too" },
  { id:17, intensity:'spicy', riddle:"I stand up straight in the morning and droop at night. I'm covered in petals. What am I?", answer:"A flower", hint:"Put me in a vase" },
  { id:18, intensity:'spicy', riddle:"The more you stroke me, the better I feel. I get wet when excited. What am I?", answer:"A cat", hint:"I purr" },
  { id:19, intensity:'spicy', riddle:"You slide me under sheets and let me work all night. I vibrate and make noise. What am I?", answer:"A washing machine", hint:"I clean your clothes" },
  { id:20, intensity:'spicy', riddle:"I'm long and pink and go into something white and creamy. What am I?", answer:"A spoon into ice cream", hint:"Dessert time!" },
  { id:21, intensity:'spicy', riddle:"You pull my head off, push me in, pull me out. I come with balls. What am I?", answer:"A pool cue", hint:"I'm used in billiards" },
  { id:22, intensity:'spicy', riddle:"I'm big, round, and firm. I bounce when handled. You dribble with me. What am I?", answer:"A basketball", hint:"Michael Jordan loved me" },
  { id:23, intensity:'spicy', riddle:"You blow me, I moan. Some call me their favorite instrument. What am I?", answer:"A harmonica", hint:"I'm musical" },
  { id:24, intensity:'spicy', riddle:"I'm always on top when things are going right and I involve lips touching. What am I?", answer:"The cherry on a sundae", hint:"I top ice cream" },
  { id:25, intensity:'spicy', riddle:"People lick me, squeeze me, and sometimes bite me at parties. What am I?", answer:"A lime (for tequila shots)", hint:"Find me at the bar" },
  { id:26, intensity:'spicy', riddle:"You use your fingers to make me produce beautiful music. What am I?", answer:"A piano / guitar", hint:"I'm a stringed instrument" },
  { id:27, intensity:'spicy', riddle:"You push me in, I expand. Pull me out, I contract. What am I?", answer:"A syringe / accordion", hint:"I deal with air or liquid" },
  { id:28, intensity:'spicy', riddle:"The more you pound me, the better the result. What am I?", answer:"Bread dough / steak", hint:"You do this in the kitchen" },
  { id:29, intensity:'spicy', riddle:"I love to be stroked in long strokes. The faster you go, the louder the sound. What am I?", answer:"A violin bow on strings", hint:"I'm in an orchestra" },
  { id:30, intensity:'spicy', riddle:"I'm often tied up but I'm worth holding. People fight over me. What am I?", answer:"The score in a tied game", hint:"Sports-related" },

  // INFERNO
  { id:31, intensity:'inferno', riddle:"I go in tight and come out loose. The wetter I am, the better I feel. What am I?", answer:"A knot / wet rope", hint:"Sailors use me" },
  { id:32, intensity:'inferno', riddle:"I'm long, hard in the morning and soft at night. Everyone fights over me. What am I?", answer:"The TV remote", hint:"Point me at the screen" },
  { id:33, intensity:'inferno', riddle:"You touch the inside of my lips gently and I start to moan and vibrate. What am I?", answer:"A crystal wine glass", hint:"In your kitchen cabinet" },
  { id:34, intensity:'inferno', riddle:"The bigger I am, the more pleasure I bring. You can't fit me in your pocket. What am I?", answer:"A hot tub", hint:"Luxury hotel" },
  { id:35, intensity:'inferno', riddle:"I have a big head, long body, and make your eyes water when you put me in your mouth. What am I?", answer:"A whole onion", hint:"I'm a vegetable" },
  { id:36, intensity:'inferno', riddle:"I'm smooth, round, and you can't stop once you start. What am I?", answer:"A ball of yarn", hint:"Grandma uses me" },
  { id:37, intensity:'inferno', riddle:"When I'm inside you, you feel a burning sensation. What am I?", answer:"A hot drink / spicy food", hint:"Eat or drink me" },
  { id:38, intensity:'inferno', riddle:"You put two fingers in me and make a wish. What am I?", answer:"A fortune cookie (breaking it)", hint:"Chinese restaurant" },
  { id:39, intensity:'inferno', riddle:"I throb, pulse, and make you scream. What am I?", answer:"A bass speaker / subwoofer", hint:"Part of your sound system" },
  { id:40, intensity:'inferno', riddle:"People in long relationships get to know me very well. What am I?", answer:"A routine / habit", hint:"It's not physical" },
  { id:41, intensity:'inferno', riddle:"I'm wet, warm, and everyone wants me between two buns. What am I?", answer:"A hot dog", hint:"Summer BBQ essential" },
  { id:42, intensity:'inferno', riddle:"The longer you keep me inside, the more intense the release. What am I?", answer:"A pressure cooker", hint:"In the kitchen" },
  { id:43, intensity:'inferno', riddle:"I start slow and end with an explosion. What am I?", answer:"A sneeze (or firework)", hint:"You can't control me" },
  { id:44, intensity:'inferno', riddle:"You have to be very flexible to do me right, and it gets better with practice. What am I?", answer:"Yoga", hint:"Do me on a mat" },
  { id:45, intensity:'inferno', riddle:"I'm hard to find, but when you do, everything changes. What am I?", answer:"A G-spot… or a good parking spot", hint:"Could be either!" },
]

// ─── Spin the Bottle consequences ─── (40 cards)
export interface SpinConsequence { id:number; intensity:Intensity; text:string; text_fr?:string; duration?:string }

export const SPIN_CONSEQUENCES: SpinConsequence[] = [
  // MILD
  { id:1,  intensity:'mild', text:'Give a 10-second hug', text_fr:'Câlin de 10 secondes', duration:'10 sec' },
  { id:2,  intensity:'mild', text:'Say 3 genuine compliments about this person', text_fr:'3 vrais compliments sur cette personne' },
  { id:3,  intensity:'mild', text:'Slow dance together for 30 seconds', text_fr:'Danser lentement 30 secondes', duration:'30 sec' },
  { id:4,  intensity:'mild', text:'Kiss on the cheek', text_fr:'Bisou sur la joue' },
  { id:5,  intensity:'mild', text:'Hold hands for the next 2 rounds', text_fr:'Se tenir la main pendant 2 tours' },
  { id:6,  intensity:'mild', text:'Feed each other something sweet', text_fr:'Se nourrir mutuellement de quelque chose de sucré' },
  { id:7,  intensity:'mild', text:'Whisper a secret in their ear', text_fr:'Chuchoter un secret à l\'oreille' },
  { id:8,  intensity:'mild', text:'Give a 1-minute shoulder massage', text_fr:'Massage des épaules 1 minute', duration:'1 min' },
  { id:9,  intensity:'mild', text:'Serenade them with 15 seconds of your favourite song', text_fr:'Chanter 15 secondes de ta chanson préférée', duration:'15 sec' },
  { id:10, intensity:'mild', text:'Draw a portrait of them in 30 seconds (no looking!)', text_fr:'Dessiner leur portrait en 30 secondes', duration:'30 sec' },

  // SPICY
  { id:11, intensity:'spicy', text:'Kiss for 5 seconds', text_fr:'Embrasser 5 secondes', duration:'5 sec' },
  { id:12, intensity:'spicy', text:'Sit on their lap for the next 2 rounds', text_fr:'S\'asseoir sur leurs genoux pour 2 tours' },
  { id:13, intensity:'spicy', text:'Whisper your favourite thing about them physically', text_fr:'Chuchoter ta chose physique préférée chez eux' },
  { id:14, intensity:'spicy', text:'Kiss on the neck for 5 seconds', text_fr:'Bisou dans le cou 5 secondes', duration:'5 sec' },
  { id:15, intensity:'spicy', text:'Stare into each other\'s eyes for 60 seconds (no laughing!)', text_fr:'Se regarder dans les yeux 60 secondes', duration:'60 sec' },
  { id:16, intensity:'spicy', text:'Let them draw a heart on your body with their finger', text_fr:'Les laisser tracer un cœur sur ton corps' },
  { id:17, intensity:'spicy', text:'French kiss for 10 seconds', text_fr:'Bisou langoureux 10 secondes', duration:'10 sec' },
  { id:18, intensity:'spicy', text:'Carry them across the room', text_fr:'Les porter de l\'autre côté de la pièce' },
  { id:19, intensity:'spicy', text:'Let them write something on your arm with their finger — guess what it says', text_fr:'Laisser l\'autre écrire sur ton bras — devine quoi' },
  { id:20, intensity:'spicy', text:'Whisper your deepest compliment for this person', text_fr:'Chuchoter ton compliment le plus profond' },
  { id:21, intensity:'spicy', text:'Close your eyes — they touch 3 places on your face gently', text_fr:'Fermer les yeux — toucher 3 endroits du visage' },
  { id:22, intensity:'spicy', text:'Bite their earlobe gently for 3 seconds', text_fr:'Mordiller doucement leur lobe 3 secondes', duration:'3 sec' },
  { id:23, intensity:'spicy', text:'They choose which item of yours you remove', text_fr:'Ils choisissent quel vêtement tu enlèves' },
  { id:24, intensity:'spicy', text:'Massage their hands for 45 seconds — no skipping', text_fr:'Masser leurs mains 45 secondes', duration:'45 sec' },

  // INFERNO
  { id:25, intensity:'inferno', text:'Kiss wherever they choose on their body', text_fr:'Embrasser où ils choisissent sur leur corps' },
  { id:26, intensity:'inferno', text:'Let them blindfold you and do whatever they want for 60 seconds', text_fr:'Yeux bandés — ils font ce qu\'ils veulent 60s', duration:'60 sec' },
  { id:27, intensity:'inferno', text:'Role-play a scene of their choice for 2 minutes', text_fr:'Scénario de leur choix 2 minutes', duration:'2 min' },
  { id:28, intensity:'inferno', text:'Give a steamy 2-minute massage anywhere they want', text_fr:'Massage chaud 2 min où ils veulent', duration:'2 min' },
  { id:29, intensity:'inferno', text:'Trace a path from their shoulder to their hip with your finger, very slowly', text_fr:'Tracer un chemin épaule–hanche très lentement' },
  { id:30, intensity:'inferno', text:'Whisper the most daring thing you\'ve ever fantasised about them', text_fr:'Murmurer le fantasme le plus osé que tu aies eu sur eux' },
  { id:31, intensity:'inferno', text:'Remove one item of their clothing as slowly as possible', text_fr:'Retirer un vêtement aussi lentement que possible' },
  { id:32, intensity:'inferno', text:'Kiss them for 20 seconds — no hands, lips only', text_fr:'Embrasser 20 secondes — mains interdites', duration:'20 sec' },
  { id:33, intensity:'inferno', text:'Let them choose where you leave a mark', text_fr:'Les laisser choisir où tu laisses une marque' },
  { id:34, intensity:'inferno', text:'They get to command you for the next full round', text_fr:'Ils te commandent pour le prochain tour complet' },
]

// ─── Dare Jar ─── (50 cards)
export interface DareJarCard { id:number; intensity:Intensity; dare:string; dare_fr?:string; icon?:string }

export const DARE_JAR_CARDS: DareJarCard[] = [
  // MILD
  { id:1,  intensity:'mild', icon:'💆', dare:'Give your partner a 30-second shoulder massage with eyes closed', dare_fr:'Masse les épaules 30s les yeux fermés' },
  { id:2,  intensity:'mild', icon:'📸', dare:'Take the most flattering candid photo of your partner right now', dare_fr:'Prends le meilleur photo candid de ton partenaire' },
  { id:3,  intensity:'mild', icon:'🎵', dare:"Sing the chorus of your partner's favourite song to them right now", dare_fr:'Chante le refrain de sa chanson préférée' },
  { id:4,  intensity:'mild', icon:'✍️', dare:"Write your partner's name on their back with your finger — they guess", dare_fr:'Écris son prénom dans son dos — il/elle devine' },
  { id:5,  intensity:'mild', icon:'💃', dare:'Dance together for the next song that plays, no matter what it is', dare_fr:'Dansez pour la prochaine chanson, quelle qu\'elle soit' },
  { id:6,  intensity:'mild', icon:'🍓', dare:'Feed each other a piece of fruit without using hands', dare_fr:'Nourrissez-vous d\'un fruit sans les mains' },
  { id:7,  intensity:'mild', icon:'👀', dare:"Stare into each other's eyes for 60 seconds without laughing", dare_fr:'Regard dans les yeux 60s sans rire' },
  { id:8,  intensity:'mild', icon:'🤗', dare:'Hold a hug for 30 seconds without saying a word', dare_fr:'Câlin 30s sans parler' },
  { id:9,  intensity:'mild', icon:'💌', dare:'Text your partner the most loving message you can think of right now', dare_fr:'Envoyer le message le plus tendre possible maintenant' },
  { id:10, intensity:'mild', icon:'🎨', dare:"Draw your partner's portrait in 1 minute — show them after", dare_fr:'Dessiner le portrait de l\'autre en 1 minute' },
  { id:11, intensity:'mild', icon:'🌹', dare:'Give your partner three genuine compliments in a row without stopping', dare_fr:'3 vrais compliments d\'affilée sans s\'arrêter' },
  { id:12, intensity:'mild', icon:'🌙', dare:'Describe your favourite memory of you two in detail', dare_fr:'Décris ton souvenir préféré de vous deux en détail' },
  { id:13, intensity:'mild', icon:'☕', dare:'Make your partner their favourite drink, served with a kiss', dare_fr:'Préparer sa boisson préférée avec un bisou' },
  { id:14, intensity:'mild', icon:'🎁', dare:'Give your partner something small from the room as a surprise gift', dare_fr:'Offrir quelque chose de la pièce comme cadeau surprise' },

  // SPICY
  { id:15, intensity:'spicy', icon:'💋', dare:"Kiss your partner's neck for 10 seconds", dare_fr:'Embrasse le cou 10 secondes' },
  { id:16, intensity:'spicy', icon:'🙈', dare:'Blindfold your partner and surprise them with 3 different touches', dare_fr:'Yeux bandés — 3 touches surprises' },
  { id:17, intensity:'spicy', icon:'🎭', dare:'Remove one item of clothing from your partner using only your teeth', dare_fr:'Retirer un vêtement avec les dents seulement' },
  { id:18, intensity:'spicy', icon:'🍫', dare:"Drip something cold on your partner's wrist and lick it off", dare_fr:'Verser quelque chose de froid sur le poignet et lécher' },
  { id:19, intensity:'spicy', icon:'🌹', dare:'Give your partner a 3-minute back massage — they rate it out of 10', dare_fr:'Massage du dos 3 min — noté sur 10' },
  { id:20, intensity:'spicy', icon:'🔥', dare:'Whisper exactly what you want to do to your partner tonight', dare_fr:'Murmurer exactement ce que tu veux faire ce soir' },
  { id:21, intensity:'spicy', icon:'💅', dare:"Trace a slow path with your finger from their shoulder to their knee — they can't move", dare_fr:'Tracer un chemin lent épaule–genou sans bouger' },
  { id:22, intensity:'spicy', icon:'👄', dare:'Give your partner a 20-second kiss — they decide where', dare_fr:'Bisou 20s — ils choisissent où' },
  { id:23, intensity:'spicy', icon:'🎯', dare:"Tell your partner the one thing they do that you find irresistible", dare_fr:'Dire la chose irresistible qu\'ils font' },
  { id:24, intensity:'spicy', icon:'🌊', dare:'Run an ice cube along the back of their hand, wrist, and inner elbow', dare_fr:'Glaçon sur la main, poignet, intérieur du coude' },
  { id:25, intensity:'spicy', icon:'🕯️', dare:'Slow dance pressed close together for a full 2 minutes — no talking', dare_fr:'Slow collé 2 min sans parler' },
  { id:26, intensity:'spicy', icon:'✨', dare:"Say out loud the three things about your partner's body you love most", dare_fr:'Dire à voix haute les 3 choses du corps que tu adores' },
  { id:27, intensity:'spicy', icon:'😈', dare:'Sit in your partner\'s lap and describe exactly how you feel about them right now', dare_fr:'S\'asseoir sur ses genoux et décrire ses sentiments' },
  { id:28, intensity:'spicy', icon:'👂', dare:"Whisper something naughty in your partner's ear that you've never said before", dare_fr:'Murmurer quelque chose de coquin jamais dit avant' },

  // INFERNO
  { id:29, intensity:'inferno', icon:'🌋', dare:"Take an ice cube and trace it from your partner's shoulder to their hip slowly", dare_fr:'Glaçon de l\'épaule à la hanche lentement' },
  { id:30, intensity:'inferno', icon:'😈', dare:"Re-enact your hottest memory together — right now", dare_fr:'Rejouer votre souvenir le plus torride maintenant' },
  { id:31, intensity:'inferno', icon:'🎲', dare:"Your partner picks a spot — you kiss it for 20 seconds", dare_fr:'L\'autre choisit un endroit — tu l\'embrasses 20s' },
  { id:32, intensity:'inferno', icon:'🕯️', dare:'Sensual slow dance with lights off for the next full song', dare_fr:'Slow sensuel dans le noir pour la prochaine chanson' },
  { id:33, intensity:'inferno', icon:'🔐', dare:"Your partner blindfolds you — they get 2 minutes to do whatever they want", dare_fr:'Yeux bandés — 2 min pour faire ce qu\'ils veulent' },
  { id:34, intensity:'inferno', icon:'🌹', dare:"Remove your partner's top slowly — taking at least 1 full minute", dare_fr:'Retirer le haut en au moins 1 minute complète' },
  { id:35, intensity:'inferno', icon:'🎯', dare:"Describe your partner's body in full detail — what you love most about it", dare_fr:'Décrire le corps de l\'autre en détail — ce que tu adores' },
  { id:36, intensity:'inferno', icon:'💋', dare:"Kiss your partner from their collar to their ear without stopping — take 30 full seconds", dare_fr:'Embrasser du col à l\'oreille sans s\'arrêter — 30s' },
  { id:37, intensity:'inferno', icon:'🌊', dare:"Use only your hands on your partner for 3 full minutes — everywhere they want", dare_fr:'Mains seulement 3 min — partout où ils veulent' },
  { id:38, intensity:'inferno', icon:'🔥', dare:"Say your most secret desire out loud — right now, no backing down", dare_fr:'Dire ton désir le plus secret à voix haute — maintenant' },
  { id:39, intensity:'inferno', icon:'🦋', dare:"Undress your partner completely — as slowly as they can handle", dare_fr:'Déshabiller complètement l\'autre aussi lentement que possible' },
  { id:40, intensity:'inferno', icon:'👑', dare:"Your partner gives you one command for the next 5 minutes — you obey", dare_fr:'L\'autre te donne un ordre pour 5 min — tu obéis' },
]

// ─── Fantasy Cards 💭 ─── (NEW GAME — 45 cards)
export interface FantasyCard { id:number; intensity:Intensity; prompt:string; prompt_fr?:string; category:string }

export const FANTASY_CARDS: FantasyCard[] = [
  // MILD – relationship dreams & wishes
  { id:1,  intensity:'mild', category:'Dream Date', prompt:"Describe the perfect romantic weekend getaway with me — details only.", prompt_fr:"Décris le week-end romantique parfait avec moi — les détails uniquement." },
  { id:2,  intensity:'mild', category:'Dream Date', prompt:"If we could teleport anywhere right now for one night, where and why?", prompt_fr:"Si on pouvait se téléporter n'importe où maintenant pour une nuit, où et pourquoi ?" },
  { id:3,  intensity:'mild', category:'Bucket List', prompt:"Name one experience you want us to have together before this year ends.", prompt_fr:"Nomme une expérience qu'on doit vivre ensemble avant la fin de l'année." },
  { id:4,  intensity:'mild', category:'Bucket List', prompt:"What adventure do you want us to try that neither of us has done?", prompt_fr:"Quelle aventure veux-tu qu'on essaie ensemble qu'aucun de nous n'a faite ?" },
  { id:5,  intensity:'mild', category:'Future', prompt:"Describe your ideal version of us in 5 years.", prompt_fr:"Décris notre version idéale dans 5 ans." },
  { id:6,  intensity:'mild', category:'Future', prompt:"What tradition do you want us to start together this year?", prompt_fr:"Quelle tradition veux-tu qu'on commence cette année ?" },
  { id:7,  intensity:'mild', category:'Desire', prompt:"What do you wish I did more of — be completely honest.", prompt_fr:"Qu'est-ce que tu aimerais que je fasse plus souvent — sois honnête." },
  { id:8,  intensity:'mild', category:'Desire', prompt:"What experience have you always wanted us to have but never asked for?", prompt_fr:"Quelle expérience as-tu toujours voulu partager sans jamais demander ?" },
  { id:9,  intensity:'mild', category:'Intimacy', prompt:"What non-physical thing makes you feel closest to me?", prompt_fr:"Quelle chose non-physique te fait te sentir le plus proche de moi ?" },
  { id:10, intensity:'mild', category:'Intimacy', prompt:"What moment between us felt most magical to you?", prompt_fr:"Quel moment entre nous t'a semblé le plus magique ?" },
  { id:11, intensity:'mild', category:'Dream Date', prompt:"Design your perfect lazy Sunday with me — hour by hour.", prompt_fr:"Conçois ton dimanche paresseux parfait avec moi — heure par heure." },
  { id:12, intensity:'mild', category:'Bucket List', prompt:"What's one thing you want to see me experience for the first time?", prompt_fr:"Quelle chose veux-tu que je vive pour la première fois ?" },
  { id:13, intensity:'mild', category:'Future', prompt:"What small daily ritual would make our relationship feel more special?", prompt_fr:"Quel petit rituel quotidien rendrait notre relation plus spéciale ?" },
  { id:14, intensity:'mild', category:'Desire', prompt:"Tell me one thing I do that makes you feel most loved.", prompt_fr:"Dis-moi une chose que je fais qui te fait te sentir le plus aimé(e)." },
  { id:15, intensity:'mild', category:'Intimacy', prompt:"Describe the version of me you find most irresistible — be specific.", prompt_fr:"Décris la version de moi que tu trouves la plus irrésistible — sois précis(e)." },

  // SPICY – intimate wishes
  { id:16, intensity:'spicy', category:'Desire', prompt:"Describe exactly how you'd like tonight to unfold.", prompt_fr:"Décris exactement comment tu voudrais que ce soir se déroule." },
  { id:17, intensity:'spicy', category:'Fantasy', prompt:"What scenario have you imagined but never suggested to me?", prompt_fr:"Quel scénario as-tu imaginé mais n'as jamais suggéré ?" },
  { id:18, intensity:'spicy', category:'Fantasy', prompt:"Describe your version of the perfect seduction — start to finish.", prompt_fr:"Décris ta version de la séduction parfaite — du début à la fin." },
  { id:19, intensity:'spicy', category:'Desire', prompt:"What's one thing you want me to do more often in bed?", prompt_fr:"Quelle chose veux-tu que je fasse plus souvent au lit ?" },
  { id:20, intensity:'spicy', category:'Location', prompt:"Name a place in this house you've always wanted to try — and why.", prompt_fr:"Nomme un endroit de cette maison que tu as toujours voulu essayer — et pourquoi." },
  { id:21, intensity:'spicy', category:'Location', prompt:"Describe the most exciting place outside the house you'd want to sneak away to.", prompt_fr:"L'endroit le plus excitant hors de la maison où tu voudrais t'échapper." },
  { id:22, intensity:'spicy', category:'Roleplay', prompt:"Describe a roleplay scenario you've always wanted to try with me.", prompt_fr:"Décris un scénario de roleplay que tu as toujours voulu essayer avec moi." },
  { id:23, intensity:'spicy', category:'Roleplay', prompt:"If we could be completely different people for one night, who would you want us to be?", prompt_fr:"Si on pouvait être des personnes différentes pour une nuit, qui voudrais-tu qu'on soit ?" },
  { id:24, intensity:'spicy', category:'Fantasy', prompt:"Describe your ideal version of our next intimate moment — don't hold back.", prompt_fr:"Décris ta version idéale de notre prochain moment intime — sans retenue." },
  { id:25, intensity:'spicy', category:'Desire', prompt:"What part of your body do you wish I paid more attention to?", prompt_fr:"Quelle partie de ton corps souhaites-tu que je remarque davantage ?" },
  { id:26, intensity:'spicy', category:'Fantasy', prompt:"Describe a 'movie scene' moment you want us to recreate.", prompt_fr:"Décris une scène de film que tu veux qu'on recrée." },
  { id:27, intensity:'spicy', category:'Intimacy', prompt:"What mood or atmosphere makes you feel most desired?", prompt_fr:"Quelle ambiance te fait te sentir le plus désiré(e) ?" },
  { id:28, intensity:'spicy', category:'Desire', prompt:"What's something I've done exactly once that you want me to do again?", prompt_fr:"Quelque chose que j'ai fait une seule fois et que tu veux que je refasse ?" },
  { id:29, intensity:'spicy', category:'Roleplay', prompt:"Describe a fantasy that starts outside — what happens?", prompt_fr:"Décris un fantasme qui commence à l'extérieur — que se passe-t-il ?" },
  { id:30, intensity:'spicy', category:'Location', prompt:"Name one time you wanted me right then and there but held back.", prompt_fr:"Nomme un moment où tu m'as voulu(e) sur le coup mais t'es retenu(e)." },

  // INFERNO – explicit desires
  { id:31, intensity:'inferno', category:'Fantasy', prompt:"Describe your most explicit fantasy involving me — every detail.", prompt_fr:"Décris ton fantasme le plus explicite impliquant moi — chaque détail." },
  { id:32, intensity:'inferno', category:'Control', prompt:"If you had complete control of me for one night, what would you do?", prompt_fr:"Si tu avais le contrôle total sur moi une nuit, que ferais-tu ?" },
  { id:33, intensity:'inferno', category:'Control', prompt:"Describe exactly how you'd want me completely at your mercy.", prompt_fr:"Décris exactement comment tu voudrais que je sois à ta merci." },
  { id:34, intensity:'inferno', category:'Roleplay', prompt:"Describe the most forbidden roleplay scenario you've ever imagined with me.", prompt_fr:"Décris le scénario de roleplay le plus interdit que tu aies imaginé." },
  { id:35, intensity:'inferno', category:'Taboo', prompt:"What's one thing you've wanted to try but thought I might say no to?", prompt_fr:"Quelque chose que tu as voulu essayer mais pensais que je refuserais ?" },
  { id:36, intensity:'inferno', category:'Taboo', prompt:"What's the wildest location you've fantasised about us being together?", prompt_fr:"L'endroit le plus fou où tu as fantasmé qu'on soit ensemble ?" },
  { id:37, intensity:'inferno', category:'Fantasy', prompt:"Describe an entire evening with me starting with what you'd have me wear.", prompt_fr:"Décris une soirée entière avec moi en commençant par ce que tu me ferais porter." },
  { id:38, intensity:'inferno', category:'Control', prompt:"If I gave you one wish tonight with zero limits — what would it be?", prompt_fr:"Si je t'accordais un vœu ce soir sans aucune limite — lequel ?" },
  { id:39, intensity:'inferno', category:'Taboo', prompt:"Name something you've always wanted to say to me in bed but never dared.", prompt_fr:"Quelque chose que tu as toujours voulu me dire au lit mais n'as jamais osé." },
  { id:40, intensity:'inferno', category:'Fantasy', prompt:"Describe the one scenario guaranteed to make both of us lose all control.", prompt_fr:"Le scénario garanti pour nous faire perdre tout contrôle à tous les deux." },
  { id:41, intensity:'inferno', category:'Control', prompt:"Describe how you'd want me to wake you up on a lazy morning — in explicit detail.", prompt_fr:"Décris comment tu voudrais être réveillé(e) — en détail explicite." },
  { id:42, intensity:'inferno', category:'Taboo', prompt:"What's a boundary you'd want us to push together that we never have?", prompt_fr:"Quelle limite voudrais-tu qu'on repousse ensemble sans jamais l'avoir fait ?" },
  { id:43, intensity:'inferno', category:'Fantasy', prompt:"If tonight had no rules — describe it from beginning to end.", prompt_fr:"Si ce soir n'avait aucune règle — décris-le du début à la fin." },
  { id:44, intensity:'inferno', category:'Control', prompt:"What's the most dominating or submissive thing you've ever wanted to experience?", prompt_fr:"La chose la plus dominante ou soumise que tu aies jamais voulu vivre ?" },
  { id:45, intensity:'inferno', category:'Roleplay', prompt:"Create a complete character and scenario — and act it out for 3 minutes starting now.", prompt_fr:"Crée un personnage et un scénario — joue-le 3 minutes maintenant." },
]

// ─── Roleplay Scenarios 🎭 ─── (NEW GAME — 36 cards)
export interface RoleplayCard { id:number; intensity:Intensity; scene:string; scene_fr?:string; setup:string; setup_fr?:string; tag:string }

export const ROLEPLAY_CARDS: RoleplayCard[] = [
  // MILD
  { id:1,  intensity:'mild', tag:'Strangers', scene:'Strangers at a coffee shop', scene_fr:'Étrangers dans un café', setup:"You've never met. One of you 'accidentally' sits at the wrong table. Flirt your way to a second coffee.", setup_fr:"Vous ne vous connaissez pas. L'un s'assoit par erreur à la mauvaise table. Flirtez." },
  { id:2,  intensity:'mild', tag:'First Date', scene:'First date gone wonderfully wrong', scene_fr:'Premier rendez-vous qui tourne bien', setup:"Everything that could go wrong does — but the chemistry is undeniable. Both of you keep laughing.", setup_fr:"Tout tourne mal — mais la chimie est indéniable. Vous riez tout le temps." },
  { id:3,  intensity:'mild', tag:'Travel', scene:'Long flight, same row', scene_fr:'Long vol, même rangée', setup:"You're stuck next to each other for 10 hours. One of you is nervous about flying. The other talks them through it.", setup_fr:"10h à côté l'un de l'autre. L'un a peur de l'avion. L'autre l'aide." },
  { id:4,  intensity:'mild', tag:'Romance', scene:'Famous artist & model', scene_fr:'Artiste célèbre & modèle', setup:"One of you is a famous painter, the other the new model. The 3-hour session turns into an unexpected connection.", setup_fr:"Un(e) peintre célèbre, un(e) nouveau modèle. 3h qui deviennent une connexion inattendue." },
  { id:5,  intensity:'mild', tag:'Adventure', scene:'Lost hikers', scene_fr:'Randonneurs perdus', setup:"You're both lost in the woods with one map and one flashlight. Work together to find camp — and warmth.", setup_fr:"Perdus dans les bois avec une carte et une lampe. Trouvez le camp ensemble." },
  { id:6,  intensity:'mild', tag:'Classic', scene:'Old-school pen pals finally meeting', scene_fr:'Correspondants qui se rencontrent enfin', setup:"You've written letters for 2 years but never met. This is the moment. You already know everything — except how this feels.", setup_fr:"2 ans de lettres, jamais rencontrés. Ce moment est enfin là." },

  // SPICY
  { id:7,  intensity:'spicy', tag:'Forbidden', scene:'Boss & new employee', scene_fr:'Patron(ne) & nouvel employé(e)', setup:"It's the first day. The attraction is impossible to ignore. The office is empty after hours.", setup_fr:"Premier jour. L'attraction est impossible à ignorer. Le bureau est vide après les heures." },
  { id:8,  intensity:'spicy', tag:'Spy', scene:'Rival spies on the same mission', scene_fr:'Espions rivaux sur la même mission', setup:"You've been told to seduce information out of each other. Neither of you planned to actually fall for it.", setup_fr:"Séduire des informations de l'autre. Aucun n'avait prévu de vraiment tomber dedans." },
  { id:9,  intensity:'spicy', tag:'Classic', scene:'Masquerade ball', scene_fr:'Bal masqué', setup:"Neither of you knows who the other is. You dance, you talk, the masks stay on. Until they don't.", setup_fr:"Aucun ne sait qui est l'autre. Masques jusqu'au bout. Jusqu'à ce qu'ils tombent." },
  { id:10, intensity:'spicy', tag:'Fantasy', scene:'Royalty & the guard', scene_fr:'Royauté & le garde', setup:"The Prince/Princess is bored of court. The guard has been ordered not to speak. One rule gets broken tonight.", setup_fr:"Le/la prince(sse) s'ennuie. Le garde ne doit pas parler. Une règle sera brisée ce soir." },
  { id:11, intensity:'spicy', tag:'Classic', scene:'Yoga teacher & student', scene_fr:'Professeur de yoga & élève', setup:"It's a one-on-one private lesson. The poses require hands-on guidance. Focus is increasingly difficult.", setup_fr:"Cours particulier. Les poses nécessitent des corrections manuelles. La concentration est de plus en plus difficile." },
  { id:12, intensity:'spicy', tag:'Forbidden', scene:'Roommates who finally admit it', scene_fr:'Colocataires qui avouent enfin', setup:"You've been dancing around this for months. One late night, one too many drinks, and someone finally says it.", setup_fr:"Des mois à tourner autour. Une nuit, quelques verres, et quelqu'un le dit enfin." },
  { id:13, intensity:'spicy', tag:'Adventure', scene:'Shipwreck survivors', scene_fr:'Survivants d\'un naufrage', setup:"You washed ashore together — strangers. There's one shelter and one blanket. Survival is closer than you think.", setup_fr:"Échoués ensemble — inconnus. Un abri, une couverture. La survie rapproche." },
  { id:14, intensity:'spicy', tag:'Classic', scene:'Doctor & celebrity patient', scene_fr:'Docteur & patient(e) célèbre', setup:"A famous patient comes in after hours. The check-up gets more thorough than expected.", setup_fr:"Un(e) patient(e) célèbre vient après l'heure. L'examen devient plus approfondi que prévu." },
  { id:15, intensity:'spicy', tag:'Fantasy', scene:'Genie & the wish-maker', scene_fr:'Génie & le souhaiteur', setup:"One person gets three wishes. The genie grants everything — but with consequences that get more interesting each time.", setup_fr:"Trois vœux. Le génie exauce tout — avec des conséquences de plus en plus intéressantes." },
  { id:16, intensity:'spicy', tag:'Forbidden', scene:'Personal trainer & client', scene_fr:'Coach personnel & client(e)', setup:"End of the last session. The results are incredible. The thank-you goes further than a handshake.", setup_fr:"Fin de la dernière séance. Les résultats sont incroyables. Le merci dépasse la poignée de main." },

  // INFERNO
  { id:17, intensity:'inferno', tag:'Dominant', scene:'Interrogation room', scene_fr:'Salle d\'interrogatoire', setup:"One is the detective who always gets a confession. The other refuses to talk — at first. Use whatever means necessary.", setup_fr:"Le/la détective qui obtient toujours des aveux. L'autre refuse de parler — au début." },
  { id:18, intensity:'inferno', tag:'Dominant', scene:'Billionaire & the stranger they can\'t resist', scene_fr:'Milliardaire & l\'étranger(ère) irrésistible', setup:"Money buys everything. Except this one. Tonight, the rules of power get rewritten.", setup_fr:"L'argent achète tout. Sauf celui/celle-là. Ce soir, les règles du pouvoir changent." },
  { id:19, intensity:'inferno', tag:'Fantasy', scene:'Vampire & willing victim', scene_fr:'Vampire & victime consentante', setup:"You've been drawn to each other across lifetimes. Tonight the eternal game of predator and prey plays out.", setup_fr:"Attirés l'un vers l'autre à travers les âges. Ce soir, le jeu prédateur/proie se déroule." },
  { id:20, intensity:'inferno', tag:'Forbidden', scene:'Celebrity & the superfan', scene_fr:'Célébrité & le super fan', setup:"The fan gets backstage access. The celebrity has never met someone like this. The meet-and-greet overruns by hours.", setup_fr:"Le fan passe backstage. La célébrité n'a jamais rencontré quelqu'un comme ça." },
  { id:21, intensity:'inferno', tag:'Dominant', scene:'The Auction', scene_fr:'L\'Enchère', setup:"One of you is being offered at a secret auction. The other wins. What does the winner want?", setup_fr:"L'un est proposé à une enchère secrète. L'autre remporte. Que veut le gagnant ?" },
  { id:22, intensity:'inferno', tag:'Fantasy', scene:'Fallen angel & the one who tempted them', scene_fr:'Ange déchu & celui/celle qui l\'a tenté(e)', setup:"An angel who chose to fall — for you. Heaven's rules no longer apply. Nothing is forbidden.", setup_fr:"Un ange qui a choisi de tomber — pour toi. Les règles du ciel ne s'appliquent plus." },
  { id:23, intensity:'inferno', tag:'Dominant', scene:'The Experiment', scene_fr:'L\'Expérience', setup:"One is the scientist running a sensory experiment. The other is the willing subject. Blindfold required.", setup_fr:"Un(e) scientifique, une expérience sensorielle, un(e) sujet consentant. Bandeau obligatoire." },
  { id:24, intensity:'inferno', tag:'Forbidden', scene:'Forbidden hotel corridor', scene_fr:'Couloir d\'hôtel interdit', setup:"You're both staying at the same hotel. A wrong turn at 2 AM. One door is open. You're both sure you closed it.", setup_fr:"Même hôtel. Mauvais couloir à 2h du matin. Une porte ouverte. Vous étiez sûrs de l'avoir fermée." },
  { id:25, intensity:'inferno', tag:'Fantasy', scene:'Incubus/Succubus & their chosen one', scene_fr:'Incube/Succube & l\'élu(e)', setup:"A dream entity that only comes to the one person they want most. Tonight you let the dream become real.", setup_fr:"Une entité onirique venue pour l'unique personne désirée. Ce soir le rêve devient réel." },
  { id:26, intensity:'inferno', tag:'Dominant', scene:'The Wager', scene_fr:'Le Pari', setup:"A high-stakes bet between rivals. The loser does whatever the winner says for the rest of the night.", setup_fr:"Un pari à forts enjeux entre rivaux. Le perdant fait tout ce que le gagnant dit pour le reste de la nuit." },
]
