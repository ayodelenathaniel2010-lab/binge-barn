// To show an official YouTube trailer, add trailer:"VIDEO_ID" to an anime (the part after v= in the YouTube link).
// Each anime also gets a "video" file. Sample open-licence films (with sound) are used as placeholders.
// To use your own licensed clip, add video:"your-file.mp4" to that anime below.
const PREVIEW_SECONDS = 30; // how much guests can watch before signing up

const ANIME = [
  { id:"frieren", title:"Frieren: Beyond Journey's End", year:2023, rating:9.3, genres:["Fantasy","Adventure","Drama"], a:"#7a0c0c", b:"#14090a", desc:"After the hero's party defeats the Demon King, the elf mage Frieren sets out to understand the people she left behind." },
  { id:"fmab", title:"Fullmetal Alchemist: Brotherhood", year:2009, rating:9.1, genres:["Action","Adventure","Fantasy"], a:"#a11a1a", b:"#0d0d12", desc:"Two brothers use alchemy to search for the Philosopher's Stone and restore what they lost." },
  { id:"steinsgate", title:"Steins;Gate", year:2011, rating:9.1, genres:["Sci-Fi","Thriller"], a:"#5c1020", b:"#0a0a0a", desc:"A self-proclaimed mad scientist discovers a way to send messages to the past, with dangerous results." },
  { id:"hxh", title:"Hunter x Hunter", year:2011, rating:9.0, genres:["Action","Adventure","Fantasy"], a:"#8c2a0f", b:"#120805", desc:"Gon sets out to become a Hunter and find the father he has never met." },
  { id:"aot", title:"Attack on Titan", year:2013, rating:9.0, genres:["Action","Drama","Fantasy"], a:"#6b0f2e", b:"#0b0608", desc:"Humanity lives behind giant walls to survive man-eating Titans, until the walls are breached." },
  { id:"gintama", title:"Gintama", year:2006, rating:8.9, genres:["Comedy","Action","Sci-Fi"], a:"#992214", b:"#0c0c0c", desc:"A lazy samurai takes odd jobs in an Edo overrun by aliens." },
  { id:"bebop", title:"Cowboy Bebop", year:1998, rating:8.8, genres:["Sci-Fi","Action","Drama"], a:"#7d1111", b:"#10060a", desc:"A crew of bounty hunters chases criminals across the solar system." },
  { id:"jjk", title:"Jujutsu Kaisen", year:2020, rating:8.7, genres:["Action","Supernatural"], a:"#b3201a", b:"#0a0a0a", desc:"A high schooler swallows a cursed object and joins a school of sorcerers." },
  { id:"demonslayer", title:"Demon Slayer", year:2019, rating:8.4, genres:["Action","Supernatural"], a:"#8a1530", b:"#0d0709", desc:"Tanjiro becomes a demon slayer to cure his sister and avenge his family." },
  { id:"onepiece", title:"One Piece", year:1999, rating:8.7, genres:["Adventure","Action","Comedy"], a:"#a32a0c", b:"#0b0705", desc:"Luffy and his pirate crew sail the Grand Line in search of the legendary treasure." },
  { id:"chainsawman", title:"Chainsaw Man", year:2022, rating:8.5, genres:["Action","Supernatural"], a:"#6e0d17", b:"#0a0a0c", desc:"A broke young man merges with a chainsaw devil and becomes a devil hunter." },
  { id:"spyxfamily", title:"Spy x Family", year:2022, rating:8.6, genres:["Comedy","Action"], a:"#9c1c3a", b:"#0c0608", desc:"A spy, an assassin and a telepath pose as a family for the sake of a mission." },
  { id:"vinland", title:"Vinland Saga", year:2019, rating:8.7, genres:["Action","Adventure","Drama"], a:"#781010", b:"#0e0e0e", desc:"A young Viking warrior searches for meaning in an age of war and revenge." },
  { id:"mha", title:"My Hero Academia", year:2016, rating:8.0, genres:["Action","Superhero"], a:"#a8301c", b:"#100806", desc:"In a world of superpowers, a powerless boy inherits the greatest hero's ability." },
  { id:"naruto", title:"Naruto Shippuden", year:2007, rating:8.3, genres:["Action","Adventure"], a:"#8f1a1a", b:"#0a0a0a", desc:"Naruto returns from training to face the Akatsuki and protect his village." },
  { id:"codegeass", title:"Code Geass", year:2006, rating:8.7, genres:["Sci-Fi","Drama","Action"], a:"#701030", b:"#0b0608", desc:"An exiled prince gains the power to command anyone and starts a rebellion." },
  { id:"bleach", title:"Bleach", year:2004, rating:8.0, genres:["Action","Supernatural"], a:"#b02a14", b:"#0d0705", desc:"A teenager becomes a Soul Reaper and defends the living from hollows." },
  { id:"deathnote", title:"Death Note", year:2006, rating:8.6, genres:["Thriller","Supernatural"], a:"#7a1414", b:"#0c0c0e", desc:"A student finds a notebook that kills anyone whose name is written in it." },
  { id:"violet", title:"Violet Evergarden", year:2018, rating:8.5, genres:["Drama","Fantasy"], a:"#9a1f2f", b:"#0a0608", desc:"A former soldier becomes a letter writer to learn the meaning of 'I love you'." },
  { id:"dbz", title:"Dragon Ball Z", year:1989, rating:8.2, genres:["Action","Adventure"], a:"#851808", b:"#0f0805", desc:"Goku and his friends defend Earth against powerful alien invaders." },
  { id:"eva", title:"Neon Genesis Evangelion", year:1995, rating:8.3, genres:["Sci-Fi", "Drama", "Action"], a:"#8a1a1a", b:"#0a0a0a", desc:"Teenagers pilot giant machines to defend Tokyo-3 from mysterious beings called Angels." },
  { id:"onepunchman", title:"One Punch Man", year:2015, rating:8.5, genres:["Action", "Comedy", "Superhero"], a:"#a3200f", b:"#0d0705", desc:"A hero who beats every enemy with a single punch is bored by how easy it all is." },
  { id:"mobpsycho", title:"Mob Psycho 100", year:2016, rating:8.5, genres:["Comedy", "Action", "Supernatural"], a:"#701030", b:"#0b0608", desc:"A shy boy with immense psychic power tries to live a normal life." },
  { id:"haikyu", title:"Haikyu!!", year:2014, rating:8.4, genres:["Sports", "Comedy", "Drama"], a:"#b02a1a", b:"#100806", desc:"A short boy with big dreams joins his high school volleyball team." },
  { id:"yourname", title:"Your Name", year:2016, rating:8.8, genres:["Romance", "Drama", "Supernatural"], a:"#6b0f2e", b:"#0a0a0c", desc:"Two strangers who swap bodies in their dreams try to find each other." },
  { id:"tokyoghoul", title:"Tokyo Ghoul", year:2014, rating:7.8, genres:["Action", "Horror", "Supernatural"], a:"#992214", b:"#0c0c0c", desc:"After a deadly encounter, a student becomes half ghoul and must live in both worlds." },
  { id:"sao", title:"Sword Art Online", year:2012, rating:7.2, genres:["Action", "Adventure", "Fantasy"], a:"#7d1111", b:"#10060a", desc:"Players trapped in a virtual reality game must clear it to escape." },
  { id:"fairytail", title:"Fairy Tail", year:2009, rating:7.6, genres:["Action", "Adventure", "Fantasy"], a:"#a11a30", b:"#0b0608", desc:"A young wizard joins a rowdy guild and takes on dangerous quests." },
  { id:"blackclover", title:"Black Clover", year:2017, rating:8.1, genres:["Action", "Adventure", "Fantasy"], a:"#8c2a0f", b:"#0f0805", desc:"Born without magic in a world full of it, Asta aims to become the Wizard King." },
  { id:"tpn", title:"The Promised Neverland", year:2019, rating:8.5, genres:["Thriller", "Mystery", "Drama"], a:"#5c1020", b:"#0a0a0a", desc:"Orphans at an idyllic home discover the truth behind it and plan an escape." },
  { id:"drstone", title:"Dr. Stone", year:2019, rating:8.3, genres:["Sci-Fi", "Adventure", "Comedy"], a:"#8a1a1a", b:"#0a0a0a", desc:"After humanity is turned to stone, a gifted scientist wakes up to rebuild civilization." },
  { id:"fireforce", title:"Fire Force", year:2019, rating:7.7, genres:["Action", "Supernatural", "Sci-Fi"], a:"#a3200f", b:"#0d0705", desc:"A special fire brigade fights people who burst into flames." },
  { id:"rezero", title:"Re:Zero", year:2016, rating:8.2, genres:["Fantasy", "Drama", "Thriller"], a:"#701030", b:"#0b0608", desc:"A boy summoned to another world discovers he returns to life after every death." },
  { id:"mushoku", title:"Mushoku Tensei: Jobless Reincarnation", year:2021, rating:8.3, genres:["Fantasy", "Adventure", "Drama"], a:"#b02a1a", b:"#100806", desc:"A man reborn in a world of magic vows to live this life to the fullest." },
  { id:"sololeveling", title:"Solo Leveling", year:2024, rating:8.2, genres:["Action", "Fantasy", "Adventure"], a:"#6b0f2e", b:"#0a0a0c", desc:"The weakest hunter gains a mysterious power that lets him level up." },
  { id:"dandadan", title:"Dandadan", year:2024, rating:8.5, genres:["Action", "Comedy", "Supernatural"], a:"#992214", b:"#0c0c0c", desc:"A girl who believes in ghosts and a boy who believes in aliens both turn out to be right." },
  { id:"kaguya", title:"Kaguya-sama: Love Is War", year:2019, rating:8.4, genres:["Comedy", "Romance"], a:"#7d1111", b:"#10060a", desc:"Two brilliant students refuse to confess first and scheme to make the other one do it." },
  { id:"bocchi", title:"Bocchi the Rock!", year:2022, rating:8.8, genres:["Comedy", "Music"], a:"#a11a30", b:"#0b0608", desc:"A painfully shy girl dreams of playing guitar in a band." },
  { id:"psychopass", title:"Psycho-Pass", year:2012, rating:8.3, genres:["Sci-Fi", "Thriller", "Action"], a:"#8c2a0f", b:"#0f0805", desc:"In a future where crime is predicted, an inspector begins to question the system." },
  { id:"monster", title:"Monster", year:2004, rating:8.7, genres:["Thriller", "Mystery", "Drama"], a:"#5c1020", b:"#0a0a0a", desc:"A brilliant surgeon hunts the patient he once saved, who grew up to be a killer." },
  { id:"naruto2002", title:"Naruto", year:2002, rating:8.0, genres:["Action", "Adventure"], a:"#b02a1a", b:"#100806", desc:"A young outcast ninja dreams of becoming the leader of his village." },
  { id:"tokyorevengers", title:"Tokyo Revengers", year:2021, rating:7.8, genres:["Action", "Drama", "Supernatural"], a:"#6b0f2e", b:"#0a0a0c", desc:"A man travels back in time to save his girlfriend by taking down a gang." },
  { id:"bluelock", title:"Blue Lock", year:2022, rating:8.2, genres:["Sports", "Drama"], a:"#992214", b:"#0c0c0c", desc:"Hundreds of strikers compete in a brutal program to create Japan's best forward." },
  { id:"oshinoko", title:"Oshi no Ko", year:2023, rating:8.6, genres:["Drama", "Supernatural", "Mystery"], a:"#7d1111", b:"#10060a", desc:"A doctor is reborn as the child of his favorite idol and uncovers the dark side of showbiz." },
  { id:"fruitsbasket", title:"Fruits Basket", year:2019, rating:8.6, genres:["Romance", "Drama", "Supernatural"], a:"#a11a30", b:"#0b0608", desc:"A girl discovers the Sohma family's secret: they turn into animals of the zodiac." },
  { id:"clannad", title:"Clannad: After Story", year:2008, rating:8.9, genres:["Drama", "Romance", "Supernatural"], a:"#8c2a0f", b:"#0f0805", desc:"A couple's life after school brings joy, hardship and growing up." },
  { id:"toradora", title:"Toradora!", year:2008, rating:8.1, genres:["Romance", "Comedy", "Drama"], a:"#5c1020", b:"#0a0a0a", desc:"Two unlikely classmates team up to win over the people they like." },
  { id:"gto", title:"Great Teacher Onizuka", year:1999, rating:8.7, genres:["Comedy", "Drama"], a:"#8a1a1a", b:"#0a0a0a", desc:"A former gang member becomes a teacher and wins over his toughest students." },
  { id:"slamdunk", title:"Slam Dunk", year:1993, rating:8.6, genres:["Sports", "Comedy"], a:"#a3200f", b:"#0d0705", desc:"A delinquent joins his school's basketball team to impress a girl and finds a real passion." },
  { id:"ippo", title:"Hajime no Ippo", year:2000, rating:8.7, genres:["Sports", "Action"], a:"#701030", b:"#0b0608", desc:"A bullied teenager discovers boxing and fights his way up the ranks." },
  { id:"gurren", title:"Gurren Lagann", year:2007, rating:8.6, genres:["Action", "Sci-Fi", "Adventure"], a:"#b02a1a", b:"#100806", desc:"Two friends dig their way out of an underground village and take on the world." },
  { id:"fatezero", title:"Fate/Zero", year:2011, rating:8.3, genres:["Action", "Fantasy"], a:"#6b0f2e", b:"#0a0a0c", desc:"Seven mages and their summoned heroes fight in a deadly war for a wish-granting Grail." },
  { id:"blacklagoon", title:"Black Lagoon", year:2006, rating:8.0, genres:["Action", "Thriller"], a:"#992214", b:"#0c0c0c", desc:"An office worker is kidnapped by pirates and joins their crew in Southeast Asia." },
  { id:"hellsing", title:"Hellsing Ultimate", year:2006, rating:8.4, genres:["Action", "Horror", "Supernatural"], a:"#7d1111", b:"#10060a", desc:"A vampire serves an organization that protects England from the undead." },
  { id:"berserk", title:"Berserk", year:1997, rating:8.6, genres:["Action", "Fantasy", "Horror"], a:"#a11a30", b:"#0b0608", desc:"A lone mercenary with a giant sword fights his way through a brutal medieval world." },
  { id:"madeinabyss", title:"Made in Abyss", year:2017, rating:8.7, genres:["Adventure", "Fantasy", "Mystery"], a:"#8c2a0f", b:"#0f0805", desc:"A young girl descends into a vast, dangerous pit to find her mother." },
  { id:"rankingofkings", title:"Ranking of Kings", year:2021, rating:8.6, genres:["Fantasy", "Adventure"], a:"#5c1020", b:"#0a0a0a", desc:"A deaf, powerless prince dreams of becoming the world's greatest king." },
  { id:"edgerunners", title:"Cyberpunk: Edgerunners", year:2022, rating:8.6, genres:["Sci-Fi", "Action", "Drama"], a:"#8a1a1a", b:"#0a0a0a", desc:"A street kid in Night City becomes an edgerunner, a mercenary outlaw." },
  { id:"lycoris", title:"Lycoris Recoil", year:2022, rating:8.2, genres:["Action", "Thriller", "Comedy"], a:"#a3200f", b:"#0d0705", desc:"Two young agents of a secret organization run a cafe between missions." },
  { id:"kaiju8", title:"Kaiju No. 8", year:2024, rating:8.2, genres:["Action", "Sci-Fi"], a:"#701030", b:"#0b0608", desc:"A man gains the power to turn into a monster while fighting monsters." },
  { id:"bleachtybw", title:"Bleach: Thousand-Year Blood War", year:2022, rating:8.9, genres:["Action", "Fantasy", "Supernatural"], a:"#701030", b:"#0b0608", added:true, desc:"The Soul Reapers face a devastating invasion in the final arc of Ichigo's story." },
  { id:"akame", title:"Akame ga Kill!", year:2014, rating:7.4, genres:["Action", "Fantasy", "Drama"], a:"#a11a30", b:"#0b0608", added:true, desc:"A young swordsman joins an assassin group to take down a corrupt empire." },
  { id:"ansatsu", title:"Assassination Classroom", year:2015, rating:8.1, genres:["Action", "Comedy"], a:"#8a1a1a", b:"#0a0a0a", added:true, desc:"Students must assassinate their powerful, tentacled teacher before he destroys the Earth." },
  { id:"souleater", title:"Soul Eater", year:2008, rating:7.8, genres:["Action", "Fantasy", "Supernatural"], a:"#992214", b:"#0c0c0c", added:true, desc:"Weapon partners train at a death god's academy to collect souls and fight witches." },
  { id:"fma2003", title:"Fullmetal Alchemist (2003)", year:2003, rating:8.1, genres:["Action", "Adventure", "Fantasy"], a:"#9a1f2f", b:"#0a0608", added:true, desc:"Two brothers search for the Philosopher's Stone after a failed alchemy ritual." },
  { id:"trigun", title:"Trigun", year:1998, rating:8.2, genres:["Action", "Sci-Fi", "Adventure"], a:"#b02a1a", b:"#100806", added:true, desc:"A gentle gunman with a huge bounty tries to avoid bloodshed on a desert planet." },
  { id:"champloo", title:"Samurai Champloo", year:2004, rating:8.5, genres:["Action", "Adventure"], a:"#8c2a0f", b:"#0f0805", added:true, desc:"A runaway waitress and two rival swordsmen search for a mysterious samurai." },
  { id:"kenshin", title:"Rurouni Kenshin", year:1996, rating:8.3, genres:["Action", "Adventure"], a:"#a3200f", b:"#0d0705", added:true, desc:"A wandering swordsman who vowed never to kill protects the weak in Meiji-era Japan." },
  { id:"yuyuhakusho", title:"Yu Yu Hakusho", year:1992, rating:8.5, genres:["Action", "Supernatural"], a:"#7d1111", b:"#10060a", added:true, desc:"A delinquent returns from the dead to become a Spirit Detective." },
  { id:"jojo", title:"JoJo's Bizarre Adventure", year:2012, rating:8.5, genres:["Action", "Adventure", "Supernatural"], a:"#781010", b:"#0e0e0e", added:true, desc:"The Joestar family battles supernatural enemies across generations." },
  { id:"gitssac", title:"Ghost in the Shell: Stand Alone Complex", year:2002, rating:8.4, genres:["Sci-Fi", "Action", "Thriller"], a:"#6b0f2e", b:"#0a0a0c", added:true, desc:"A cyborg task force investigates crime and conspiracy in a connected future." },
  { id:"akira", title:"Akira", year:1988, rating:8.0, genres:["Sci-Fi", "Action"], a:"#5c1020", b:"#0a0a0a", added:true, desc:"In neo-Tokyo, a biker gang member gains terrifying psychic powers." },
  { id:"mononoke", title:"Princess Mononoke", year:1997, rating:8.7, genres:["Fantasy", "Adventure", "Drama"], a:"#701030", b:"#0b0608", added:true, desc:"A cursed prince gets caught between forest gods and an iron-making town." },
  { id:"spiritedaway", title:"Spirited Away", year:2001, rating:8.8, genres:["Fantasy", "Adventure"], a:"#a11a30", b:"#0b0608", added:true, desc:"A girl wanders into a spirit world and must work at a bathhouse to save her parents." },
  { id:"howl", title:"Howl's Moving Castle", year:2004, rating:8.7, genres:["Fantasy", "Romance", "Adventure"], a:"#8a1a1a", b:"#0a0a0a", added:true, desc:"A young woman cursed with old age meets a mysterious wizard and his moving castle." },
  { id:"fireflies", title:"Grave of the Fireflies", year:1988, rating:8.5, genres:["Drama"], a:"#992214", b:"#0c0c0c", added:true, desc:"Two siblings struggle to survive in Japan near the end of World War II." },
  { id:"weathering", title:"Weathering With You", year:2019, rating:8.1, genres:["Romance", "Drama", "Fantasy"], a:"#9a1f2f", b:"#0a0608", added:true, desc:"A runaway teen meets a girl who can control the weather in rainy Tokyo." },
  { id:"silentvoice", title:"A Silent Voice", year:2016, rating:8.9, genres:["Drama", "Romance"], a:"#b02a1a", b:"#100806", added:true, desc:"A former bully tries to make amends with the deaf girl he once tormented." },
  { id:"perfectblue", title:"Perfect Blue", year:1997, rating:8.4, genres:["Thriller", "Horror", "Mystery"], a:"#8c2a0f", b:"#0f0805", added:true, desc:"A pop idol turned actress is stalked as the line between reality and illusion blurs." },
  { id:"parasyte", title:"Parasyte: The Maxim", year:2014, rating:8.3, genres:["Action", "Horror", "Sci-Fi"], a:"#a3200f", b:"#0d0705", added:true, desc:"A teenager's right hand is taken over by an alien parasite, and the two must work together." },
  { id:"erased", title:"Erased", year:2016, rating:8.3, genres:["Mystery", "Thriller", "Supernatural"], a:"#7d1111", b:"#10060a", added:true, desc:"A man who can rewind time tries to prevent a childhood tragedy." },
  { id:"steinsgate0", title:"Steins;Gate 0", year:2018, rating:8.5, genres:["Sci-Fi", "Thriller"], a:"#781010", b:"#0e0e0e", added:true, desc:"Okabe struggles with the consequences of failing to save his friend across timelines." },
  { id:"oddtaxi", title:"Odd Taxi", year:2021, rating:8.6, genres:["Mystery", "Drama", "Comedy"], a:"#6b0f2e", b:"#0a0a0c", added:true, desc:"A walrus taxi driver gets drawn into a missing-girl case in Tokyo." },
  { id:"kuroko", title:"Kuroko's Basketball", year:2012, rating:8.2, genres:["Sports", "Comedy"], a:"#5c1020", b:"#0a0a0a", added:true, desc:"A phantom sixth man joins a rising high school team to beat the Generation of Miracles." },
  { id:"yourlie", title:"Your Lie in April", year:2014, rating:8.6, genres:["Drama", "Romance", "Music"], a:"#701030", b:"#0b0608", added:true, desc:"A pianist who lost his sense of music meets a free-spirited violinist." },
  { id:"angelbeats", title:"Angel Beats!", year:2010, rating:8.0, genres:["Drama", "Supernatural", "Comedy"], a:"#a11a30", b:"#0b0608", added:true, desc:"Students in the afterlife fight an angel to defy their fates." },
  { id:"anohana", title:"Anohana", year:2011, rating:8.3, genres:["Drama", "Supernatural"], a:"#8a1a1a", b:"#0a0a0a", added:true, desc:"Childhood friends reunite after the death of one of their group." },
  { id:"mushishi", title:"Mushishi", year:2005, rating:8.6, genres:["Fantasy", "Mystery", "Supernatural"], a:"#992214", b:"#0c0c0c", added:true, desc:"A traveler studies strange life forms called Mushi across rural Japan." },
  { id:"spicewolf", title:"Spice and Wolf", year:2008, rating:8.3, genres:["Romance", "Adventure", "Fantasy"], a:"#9a1f2f", b:"#0a0608", added:true, desc:"A traveling merchant and a wolf deity trade across medieval lands." },
  { id:"overlord", title:"Overlord", year:2015, rating:7.9, genres:["Fantasy", "Action", "Adventure"], a:"#b02a1a", b:"#100806", added:true, desc:"A player trapped in his favorite game as a skeletal overlord builds his own empire." },
  { id:"slime", title:"That Time I Got Reincarnated as a Slime", year:2018, rating:8.1, genres:["Fantasy", "Action", "Comedy"], a:"#8c2a0f", b:"#0f0805", added:true, desc:"A man reborn as a slime in a fantasy world builds a nation of monsters." },
  { id:"ngnl", title:"No Game No Life", year:2014, rating:8.1, genres:["Fantasy", "Comedy", "Adventure"], a:"#a3200f", b:"#0d0705", added:true, desc:"Two genius siblings are summoned to a world where every conflict is settled by games." },
  { id:"konosuba", title:"KonoSuba", year:2016, rating:8.1, genres:["Comedy", "Fantasy", "Adventure"], a:"#7d1111", b:"#10060a", added:true, desc:"A teenager is reborn in a fantasy world with a useless goddess and a dysfunctional party." },
  { id:"sevensins", title:"The Seven Deadly Sins", year:2014, rating:7.7, genres:["Action", "Adventure", "Fantasy"], a:"#781010", b:"#0e0e0e", added:true, desc:"A princess seeks the legendary knights known as the Seven Deadly Sins." },
  { id:"noragami", title:"Noragami", year:2014, rating:7.9, genres:["Action", "Supernatural", "Fantasy"], a:"#6b0f2e", b:"#0a0a0c", added:true, desc:"A minor god with no shrine takes odd jobs to earn worshippers." },
  { id:"blueexorcist", title:"Blue Exorcist", year:2011, rating:7.6, genres:["Action", "Fantasy", "Supernatural"], a:"#5c1020", b:"#0a0a0a", added:true, desc:"The son of Satan trains to become an exorcist to defeat his father." },
  { id:"dororo", title:"Dororo", year:2019, rating:8.3, genres:["Action", "Supernatural", "Drama"], a:"#701030", b:"#0b0608", added:true, desc:"A samurai's son missing 48 body parts hunts the demons who took them." },
  { id:"killlakill", title:"Kill la Kill", year:2013, rating:8.1, genres:["Action", "Comedy", "Sci-Fi"], a:"#a11a30", b:"#0b0608", added:true, desc:"A transfer student with a giant scissor blade takes on her school's tyrannical council." },
  { id:"lain", title:"Serial Experiments Lain", year:1998, rating:8.1, genres:["Sci-Fi", "Thriller", "Mystery"], a:"#8a1a1a", b:"#0a0a0a", added:true, desc:"A shy girl becomes entangled with a virtual world called the Wired." },
  { id:"horimiya", title:"Horimiya", year:2021, rating:8.2, genres:["Romance", "Comedy", "Drama"], a:"#992214", b:"#0c0c0c", added:true, desc:"Two classmates discover each other's hidden sides outside of school." },
  { id:"bunnygirl", title:"Rascal Does Not Dream of Bunny Girl Senpai", year:2018, rating:8.2, genres:["Romance", "Drama", "Supernatural"], a:"#9a1f2f", b:"#0a0608", added:true, desc:"A student meets a girl in a bunny outfit who is affected by a strange phenomenon." },
  { id:"mydressup", title:"My Dress-Up Darling", year:2022, rating:8.2, genres:["Romance", "Comedy"], a:"#b02a1a", b:"#100806", added:true, desc:"A shy boy who makes dolls teams up with a cosplay-loving classmate." },
  { id:"nichijou", title:"Nichijou", year:2011, rating:8.7, genres:["Comedy"], a:"#8c2a0f", b:"#0f0805", added:true, desc:"Ordinary school days turn absurd for a group of friends." },
  { id:"cellsatwork", title:"Cells at Work!", year:2018, rating:8.0, genres:["Comedy", "Adventure"], a:"#a3200f", b:"#0d0705", added:true, desc:"Cells inside the human body work tirelessly to keep it healthy." },
  { id:"vivy", title:"Vivy: Fluorite Eye's Song", year:2021, rating:8.4, genres:["Sci-Fi", "Drama", "Action"], a:"#7d1111", b:"#10060a", added:true, desc:"An AI singer is sent on a mission to change history and stop an AI war." },
  { id:"hellsparadise", title:"Hell's Paradise", year:2023, rating:8.1, genres:["Action", "Adventure", "Supernatural"], a:"#781010", b:"#0e0e0e", added:true, desc:"A condemned ninja seeks a legendary island that promises freedom." },
  { id:"dungeonmeshi", title:"Delicious in Dungeon", year:2024, rating:8.6, genres:["Fantasy", "Adventure", "Comedy"], a:"#6b0f2e", b:"#0a0a0c", added:true, desc:"Adventurers cook and eat the monsters they defeat in a deep dungeon." },
  { id:"apothecary", title:"The Apothecary Diaries", year:2023, rating:8.9, genres:["Drama", "Mystery"], a:"#5c1020", b:"#0a0a0a", added:true, desc:"A skilled apothecary solves mysteries in the emperor's court." },
  { id:"hyouka", title:"Hyouka", year:2012, rating:8.1, genres:["Mystery", "Drama", "Romance"], a:"#701030", b:"#0b0608", added:true, desc:"An apathetic student is pulled into solving everyday mysteries by his club." },
  { id:"baccano", title:"Baccano!", year:2007, rating:8.4, genres:["Action", "Mystery", "Supernatural"], a:"#a11a30", b:"#0b0608", added:true, desc:"Immortals, gangsters and thieves cross paths on a train in 1930s America." },
  { id:"chihayafuru", title:"Chihayafuru", year:2011, rating:8.3, genres:["Sports", "Drama", "Romance"], a:"#8a1a1a", b:"#0a0a0a", added:true, desc:"A girl dedicates herself to competitive karuta, a Japanese card game." },
  { id:"barakamon", title:"Barakamon", year:2014, rating:8.4, genres:["Comedy", "Drama"], a:"#992214", b:"#0c0c0c", added:true, desc:"A calligrapher exiled to a remote island is changed by the villagers." },
  { id:"pingpong", title:"Ping Pong the Animation", year:2014, rating:8.6, genres:["Sports", "Drama"], a:"#9a1f2f", b:"#0a0608", added:true, desc:"Two childhood friends push each other to the top of competitive table tennis." },
  { id:"goldenkamuy", title:"Golden Kamuy", year:2018, rating:8.1, genres:["Action", "Adventure"], a:"#b02a1a", b:"#100806", added:true, desc:"A veteran and an Ainu girl hunt for hidden gold in Hokkaido." },
  { id:"lustrous", title:"Land of the Lustrous", year:2017, rating:8.1, genres:["Fantasy", "Drama"], a:"#8c2a0f", b:"#0f0805", added:true, desc:"Gem beings fight an enemy that wants to turn them into decorations." },
  { id:"deathparade", title:"Death Parade", year:2015, rating:8.2, genres:["Thriller", "Supernatural", "Mystery"], a:"#a3200f", b:"#0d0705", added:true, desc:"People who die enter a bar where they play games that decide their fate." },
  { id:"bakemonogatari", title:"Bakemonogatari", year:2009, rating:8.3, genres:["Supernatural", "Mystery", "Romance"], a:"#7d1111", b:"#10060a", added:true, desc:"A student who survived a vampire attack helps girls haunted by oddities." },
  { id:"cote", title:"Classroom of the Elite", year:2017, rating:7.8, genres:["Drama", "Thriller"], a:"#781010", b:"#0e0e0e", added:true, desc:"Students at an elite school compete in a ruthless merit-based system." },
  { id:"nana", title:"Nana", year:2006, rating:8.4, genres:["Drama", "Romance", "Music"], a:"#6b0f2e", b:"#0a0a0c", added:true, desc:"Two young women named Nana move to Tokyo and become friends." },
  { id:"planetes", title:"Planetes", year:2003, rating:8.2, genres:["Sci-Fi", "Drama"], a:"#5c1020", b:"#0a0a0a", added:true, desc:"Debris collectors in space dream of bigger things while a terror threat grows." }
];

const SAMPLE_BASE = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/";
const SAMPLES = ["Sintel.mp4", "TearsOfSteel.mp4", "BigBuckBunny.mp4", "ElephantsDream.mp4"];
ANIME.forEach((x, i) => { if (!x.video) x.video = SAMPLE_BASE + SAMPLES[i % SAMPLES.length]; });

// Posters and official trailers are looked up automatically (Jikan API, MyAnimeList data)
// and cached in the browser. You can override with trailer:"VIDEO_ID" or poster:"image.jpg" above.
const MAL = { frieren:52991, fmab:5114, steinsgate:9253, hxh:11061, aot:16498, gintama:918, bebop:1, jjk:40748, demonslayer:38000, onepiece:21, chainsawman:44511, spyxfamily:50265, vinland:37521, mha:31964, naruto:1735, codegeass:1575, bleach:269, deathnote:1535, violet:33352, dbz:813, eva:30, onepunchman:30276, mobpsycho:32182, haikyu:20583, yourname:32281, tokyoghoul:22319, sao:11757, fairytail:6702, blackclover:34572, tpn:37779, drstone:38691, fireforce:38671, rezero:31240, mushoku:39535, sololeveling:52299, dandadan:57334, kaguya:37999, bocchi:47917, psychopass:13601, monster:19, naruto2002:20, tokyorevengers:42249, bluelock:49596, oshinoko:52034, fruitsbasket:38480, clannad:4181, toradora:4224, gto:245, slamdunk:170, ippo:263, gurren:2001, fatezero:10087, blacklagoon:889, hellsing:777, berserk:33, madeinabyss:34599, rankingofkings:40834, edgerunners:42310, lycoris:50709, kaiju8:52588, bleachtybw:41467, akame:22199, ansatsu:24833, souleater:3588, fma2003:121, trigun:6, champloo:205, kenshin:45, yuyuhakusho:392, jojo:14719, gitssac:467, akira:47, mononoke:164, spiritedaway:199, howl:431, fireflies:578, weathering:38826, silentvoice:28851, perfectblue:437, parasyte:22535, erased:31043, steinsgate0:30484, oddtaxi:41468, kuroko:11771, yourlie:23273, angelbeats:6547, anohana:9989, mushishi:457, spicewolf:2966, overlord:29803, slime:37430, ngnl:19815, konosuba:30831, sevensins:23755, noragami:20507, blueexorcist:9919, dororo:37520, killlakill:18679, lain:339, horimiya:42897, bunnygirl:37450, mydressup:48736, nichijou:10165, cellsatwork:37141, vivy:46095, hellsparadise:46569, dungeonmeshi:52701, apothecary:54492, hyouka:12189, baccano:2251, chihayafuru:10800, barakamon:22789, pingpong:22135, goldenkamuy:36028, lustrous:35557, deathparade:28223, bakemonogatari:5081, cote:35507, nana:877, planetes:329 };
function metaCache() { try { return JSON.parse(localStorage.getItem("bb_meta")) || {}; } catch (e) { return {}; } }
ANIME.forEach((x) => {
  const c = metaCache()[x.id] || {};
  x.trailer = x.trailer || c.t || "";
  x.poster = x.poster || c.p || "";
});

// Put each anime's poster on its card(s)
function applyPosters() {
  document.querySelectorAll("a.card[href*='id=']").forEach((el) => {
    const m = /id=(\w+)/.exec(el.getAttribute("href"));
    const a = m && ANIME.find((x) => x.id === m[1]);
    if (a && a.poster && el.dataset.poster !== a.poster) {
      el.style.setProperty("--img", 'url("' + a.poster + '")');
      el.classList.add("has-poster");
      el.dataset.poster = a.poster;
    }
  });
  document.dispatchEvent(new Event("posters-updated"));
  if (typeof observeCards === "function" && typeof cardObserver !== "undefined") observeCards();
}

const inflight = {};
function resolveTrailer(a) {
  if (a.trailer && a.poster) return Promise.resolve(a.trailer);
  if (!MAL[a.id]) return Promise.resolve(a.trailer || "");
  if (inflight[a.id]) return inflight[a.id];
  inflight[a.id] = (async () => {
    try {
      const data = await jikan("/anime/" + MAL[a.id]);
      if (data) {
        const t = (data.trailer && data.trailer.youtube_id) || "";
        const img = (data.images && data.images.jpg) || {};
        const p = img.large_image_url || img.image_url || "";
        if (t) a.trailer = a.trailer || t;
        if (p) a.poster = a.poster || p;
        try {
          const c = metaCache();
          c[a.id] = { t: a.trailer, p: a.poster };
          localStorage.setItem("bb_meta", JSON.stringify(c));
        } catch (e) {}
        applyPosters();
      }
    } catch (e) {}
    delete inflight[a.id];
    return a.trailer || "";
  })();
  return inflight[a.id];
}

async function preloadTrailers() {
  if (window.__preloading) return;
  window.__preloading = true;
  for (const a of ANIME) {
    if (!a.trailer || !a.poster) { await resolveTrailer(a); await new Promise((r) => setTimeout(r, 380)); }
  }
}


// Fetch posters and trailers only for cards near the screen (keeps us within the API's rate limit)
const cardObserver = ("IntersectionObserver" in window) ? new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (!en.isIntersecting) return;
    cardObserver.unobserve(en.target);
    const m = /id=(\w+)/.exec(en.target.getAttribute("href") || "");
    const a = m && ANIME.find((x) => x.id === m[1]);
    if (a && (!a.poster || !a.trailer)) resolveTrailer(a);
  });
}, { rootMargin: "300px" }) : null;
function observeCards() {
  if (!cardObserver) return;
  document.querySelectorAll("a.card[href*='id=']:not([data-obs])").forEach((el) => { el.dataset.obs = "1"; cardObserver.observe(el); });
}
applyPosters();
observeCards();

// ---- Shared helpers: rate-limited Jikan requests, trailer fallbacks, YouTube error detection ----
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let jikanQueue = Promise.resolve();
async function jikanOnce(path) {
  for (let i = 0; i < 4; i++) {
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), 9000);
    try {
      const res = await fetch("https://api.jikan.moe/v4" + path, { signal: ctl.signal });
      clearTimeout(timer);
      if (res.status === 429 || res.status >= 500) { await sleep(2000); continue; }
      if (!res.ok) return null;
      const json = await res.json();
      return json.data === undefined ? null : json.data;
    } catch (e) { clearTimeout(timer); await sleep(600); }
  }
  return null;
}
function jikan(path) {
  const p = jikanQueue.then(() => jikanOnce(path));
  jikanQueue = p.then(() => sleep(350), () => sleep(350));
  return p;
}

// Other official trailers/promos for the same anime, used when the first one cannot be embedded
async function trailerAlts(a) {
  if (a._alts) return a._alts;
  if (!MAL[a.id]) return [];
  const data = await jikan("/anime/" + MAL[a.id] + "/videos");
  const ids = [];
  ((data && data.promo) || []).forEach((p) => {
    const y = p.trailer && p.trailer.youtube_id;
    if (y && !ids.includes(y)) ids.push(y);
  });
  a._alts = ids;
  return ids;
}
function setWorkingTrailer(a, id) {
  a.trailer = id;
  try {
    const c = metaCache();
    c[a.id] = Object.assign({}, c[a.id], { t: id, p: a.poster });
    localStorage.setItem("bb_meta", JSON.stringify(c));
  } catch (e) {}
}

// Listen to a YouTube iframe for playback errors (blocked embeds) and for successful play
function watchYT(f, onError, onPlaying) {
  let played = false;
  const handler = (e) => {
    if (!f.contentWindow || e.source !== f.contentWindow) return;
    let m = e.data;
    if (typeof m === "string") { try { m = JSON.parse(m); } catch (x) { return; } }
    if (!m) return;
    if (m.event === "onError") { window.removeEventListener("message", handler); if (onError) onError(m.info); }
    else if ((m.event === "onStateChange" && m.info === 1) || (m.event === "infoDelivery" && m.info && m.info.playerState === 1)) {
      if (!played) { played = true; if (onPlaying) onPlaying(); }
    }
  };
  window.addEventListener("message", handler);
  f.addEventListener("load", () => {
    try { f.contentWindow.postMessage(JSON.stringify({ event: "listening", id: 1, channel: "widget" }), "*"); } catch (x) {}
  });
}
