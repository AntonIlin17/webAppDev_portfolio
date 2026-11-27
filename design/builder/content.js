/* Catalogue for the portfolio builder: the content, every slot and its variants,
   and the ten starting versions. Codes (HER-2, INK-6 ...) are the labels shown on
   the page and in the build sheet. */
(function(){
'use strict';
const elements=[{"id": "dahlia", "name": "Dahlia", "cat": "Botanical", "note": "A hundred folded petals. One impossible little sun."}, {"id": "calla", "name": "Calla Lily", "cat": "Botanical", "note": "A quiet curl of light. Softness, carved into space."}, {"id": "orchid", "name": "Orchid", "cat": "Botanical", "note": "An extravagant gesture. Nature with no restraint."}, {"id": "fern", "name": "Fern Spiral", "cat": "Botanical", "note": "Before a leaf becomes a leaf. A spiral holding its breath."}, {"id": "monstera", "name": "Monstera", "cat": "Botanical", "note": "Light slips through the gaps. A living piece of architecture."}, {"id": "seedpod", "name": "Lotus Pod", "cat": "Botanical", "note": "A small lunar landscape. Every hollow holds a story."}, {"id": "nautilus", "name": "Nautilus", "cat": "Ocean", "note": "A perfect retreat into itself. The mathematics of a shell."}, {"id": "jellyfish", "name": "Jellyfish", "cat": "Ocean", "note": "A bell made of almost nothing. Tentacles drawing in the dark."}, {"id": "betta", "name": "Betta Fish", "cat": "Ocean", "note": "A creature wearing a storm. Silk, caught mid-flight."}, {"id": "seahorse", "name": "Seahorse", "cat": "Ocean", "note": "Armor with a gentle curve. A tiny sculptural question mark."}, {"id": "octopus", "name": "Octopus", "cat": "Ocean", "note": "Eight ways to move. One beautiful tangle."}, {"id": "coral", "name": "Coral Fan", "cat": "Ocean", "note": "A forest made for water. Every branch a little echo."}, {"id": "moth", "name": "Luna Moth", "cat": "Natural", "note": "A night garden on two wings. Fragile, intricate, strange."}, {"id": "beetle", "name": "Stag Beetle", "cat": "Natural", "note": "A miniature suit of armor. Polished by evolution."}, {"id": "snail", "name": "Spiral Snail", "cat": "Natural", "note": "A slow thought in a spiral. Carrying a world along."}, {"id": "feather", "name": "Feather", "cat": "Natural", "note": "Almost weightless. Every fine line knows where to go."}, {"id": "mushroom", "name": "Oyster Cluster", "cat": "Natural", "note": "Architecture without an architect. Gills, folds, and quiet repetition."}, {"id": "pinecone", "name": "Pine Cone", "cat": "Natural", "note": "A thousand little roofs. Order hidden in the forest."}, {"id": "quartz", "name": "Quartz Cluster", "cat": "Mineral", "note": "Light learns to stand still. Facets inside facets."}, {"id": "ammonite", "name": "Ammonite Fossil", "cat": "Mineral", "note": "An ancient ocean, curled into stone."}, {"id": "geode", "name": "Crystal Geode", "cat": "Mineral", "note": "An ordinary exterior. An extraordinary interior."}, {"id": "meteorite", "name": "Meteorite", "cat": "Mineral", "note": "A fragment of elsewhere. Time written into every hollow."}, {"id": "bismuth", "name": "Bismuth Crystal", "cat": "Mineral", "note": "A city of staircases. Metal building its own maze."}, {"id": "desertrose", "name": "Desert Rose", "cat": "Mineral", "note": "Stone pretending to be a flower. A desert that learned to bloom."}, {"id": "bust", "name": "Marble Muse", "cat": "Sculpture", "note": "A face caught in a daydream. Marble with a little life in it."}, {"id": "hand", "name": "Reaching Hand", "cat": "Sculpture", "note": "An unfinished gesture. The space between reaching and holding."}, {"id": "ribbon", "name": "Ribbon Knot", "cat": "Sculpture", "note": "A line that forgot to end. Twisting back into itself."}, {"id": "cloth", "name": "Silk Flight", "cat": "Sculpture", "note": "A frozen second of flight. Gravity, briefly negotiated."}, {"id": "origami", "name": "Paper Crane", "cat": "Sculpture", "note": "One sheet, another life. Geometry with wings."}, {"id": "gyroscope", "name": "Gyroscope", "cat": "Sculpture", "note": "Perfectly balanced restlessness. Rings inside rings."}, {"id": "rose", "name": "Rose Spiral", "cat": "Botanical", "note": "One unfurling rose with broad spiraling velvet petals and one leaf, off-axis top view"}, {"id": "poppy", "name": "Poppy Veil", "cat": "Botanical", "note": "One open poppy bloom with papery translucent petals, dense stamen crown and curved stem"}, {"id": "ginkgo", "name": "Ginkgo Fan", "cat": "Botanical", "note": "A single fan-shaped ginkgo leaf curled like a sail, fine radial veins and a long curved petiole"}, {"id": "artichoke", "name": "Artichoke Crown", "cat": "Botanical", "note": "One globe artichoke with overlapping pointed bracts and short stem, oblique view"}, {"id": "magnolia", "name": "Magnolia", "cat": "Botanical", "note": "One magnolia bloom with thick sweeping waxy petals arranged in an open cup"}, {"id": "maple", "name": "Maple Flight", "cat": "Botanical", "note": "A joined pair of winged maple seeds twisting in space, thin translucent veined wings"}, {"id": "stingray", "name": "Manta Glide", "cat": "Ocean", "note": "One manta ray with sweeping wings and thin curved tail, oblique underside view"}, {"id": "urchin", "name": "Sea Urchin", "cat": "Ocean", "note": "One sea urchin with sharply resolved radial spines, strong round form"}, {"id": "starfish", "name": "Brittle Star", "cat": "Ocean", "note": "One brittle star with five long curling articulated arms and central disk"}, {"id": "clam", "name": "Pearl Cradle", "cat": "Ocean", "note": "One open scallop shell with deeply ribbed fan-shaped halves and a lustrous pearl inside"}, {"id": "cuttlefish", "name": "Cuttlefish", "cat": "Ocean", "note": "One cuttlefish with curled arms and undulating delicate fin skirt, detailed body"}, {"id": "anemone", "name": "Sea Anemone", "cat": "Ocean", "note": "One sea anemone with dozens of curving tentacles and sculptural radial center"}, {"id": "dragonfly", "name": "Dragonfly", "cat": "Natural", "note": "One dragonfly with four intricate translucent wings spread, visible veins and slim segmented abdomen"}, {"id": "hummingbird", "name": "Hummingbird", "cat": "Natural", "note": "One hovering hummingbird with wings lifted and tail fanned, detailed feathers"}, {"id": "ram", "name": "Ram Spiral", "cat": "Natural", "note": "One ram skull with two spectacular curling horns, bone texture and horn ridges"}, {"id": "acorn", "name": "Acorn Pair", "cat": "Natural", "note": "A joined pair of acorns on a tiny woody stem with textured cups and smooth nuts"}, {"id": "frostleaf", "name": "Frost Leaf", "cat": "Natural", "note": "One curled skeletal leaf encrusted with delicate branching ice crystals"}, {"id": "cocoon", "name": "Woven Cocoon", "cat": "Natural", "note": "One hanging silkworm cocoon with layered silk filaments and an open curled edge"}, {"id": "pyrite", "name": "Pyrite Citadel", "cat": "Mineral", "note": "One natural pyrite specimen with sharply defined interlocking cubes and tiny terraces"}, {"id": "fluorite", "name": "Fluorite Steps", "cat": "Mineral", "note": "One fluorite cluster of large translucent interlocking cubes with crisp separated faces"}, {"id": "malachite", "name": "Malachite Wave", "cat": "Mineral", "note": "One botryoidal malachite specimen with concentric banded cut face and rounded lobes, monochrome"}, {"id": "obsidian", "name": "Obsidian Blade", "cat": "Mineral", "note": "One obsidian shard with conchoidal fracture curves and sharp edge, broad bright reflections"}, {"id": "selenite", "name": "Selenite Wings", "cat": "Mineral", "note": "One selenite crystal spray of broad translucent blade-like fans, airy separated crystals"}, {"id": "opal", "name": "Opal Nodule", "cat": "Mineral", "note": "One partly polished opal nodule with flowing internal cloudy patterns and rough outer rind"}, {"id": "veil", "name": "Gauze Whirl", "cat": "Sculpture", "note": "One delicate translucent gauze veil curling in a suspended spiral, woven fibers and graceful broad folds"}, {"id": "glassknot", "name": "Glass Knot", "cat": "Sculpture", "note": "A single clear glass torus knot sculpture with thick smooth tubular loops and luminous refraction"}, {"id": "chain", "name": "Chain Cascade", "cat": "Sculpture", "note": "One cascading loop of chunky silver chain links, flowing S shape and visibly interlinked"}, {"id": "helix", "name": "Helix Tower", "cat": "Sculpture", "note": "One double helix sculpture made of smooth pale stone ribbons with connecting struts"}];

const me={
 name:'Anton Ilin',first:'Anton',last:'Ilin',initials:'A·I',
 role:'AI and software engineering student',
 place:'Toronto',school:'Centennial College',
 line:'I build things for the browser and test them until they hold.',
 intro:'A student of AI and software engineering at Centennial College in Toronto. I work in React, Java and C#, and lately in WebGL.',
 belief:'I want to help bring back the tradition of free software, built with care and open to everyone.',
 about:'I care about clean architecture, thoughtful interfaces, and code that holds up under real use. Most of what I make starts as a question about how something works and ends as a tool I would use myself.',
 email:'antonilin107@gmail.com',
 status:'Open to co-op and internship roles',
 facts:[['Based in','Toronto, Canada'],['Studying','AI and software engineering, advanced diploma, Centennial College, 2024 to now'],['Works with','React, JavaScript, Java, C#, WebGL2 and GLSL, Node'],['Tests with','Vitest, Cypress, and a lot of negative cases'],['Cares about','Free software, clean architecture, interfaces that explain themselves']],
 stack:[['Front end',['React','JavaScript','HTML and CSS','Vite']],['Graphics',['WebGL2','GLSL','Canvas']],['Back end',['Java','C#','Node','MongoDB']],['Testing',['Vitest','Cypress','API and security cases']]]
};

const projects=[
 {id:'cabinet',el:'dahlia',title:'Dither Cabinet',kind:'Graphics',
  one:'Fifty-eight sculptural elements rendered as living fields of dots.',
  long:'An interactive dither playground that runs entirely in the browser, offline, on the GPU. Each element is drawn as a lit surface, then turned into marks in screen space, so a stretched area always refills with fresh dots.',
  facts:[['Renderer','WebGL2 in two passes, with a Canvas fallback'],['Physics','Cloth solved with small-step XPBD, plus rigid bodies you can throw'],['Photo lab','Local AI models cut out a photo and give it depth, on your own computer'],['Dependencies','None. No build tools either']],
  tags:['WebGL2','GLSL','Physics','Local AI']},
 {id:'rss',el:'coral',title:'RSS Aggregator',kind:'Web app',
  one:'Many feeds in, one searchable reading list out.',
  long:'A feed aggregator that parses multiple RSS sources, normalizes their entries into one shape, and renders a searchable interface in React.',
  facts:[['Front end','React'],['The hard part','Feeds disagree about almost everything, so every entry is normalized first'],['Search','Filters by title and by source as you type']],
  tags:['React','Parsing','Search']},
 {id:'tour',el:'gyroscope',title:'TourConnect',kind:'Full stack',
  one:'A prototype that connects local tour guides with travelers.',
  long:'A full-stack prototype for finding a local guide. The front end is React, backed by a small Node API mock so the whole flow can be exercised end to end.',
  facts:[['Front end','React'],['Back end','Node API mock'],['Scope','A prototype, built to test the booking flow']],
  tags:['React','Node','Prototype']},
 {id:'qa',el:'beetle',title:'QA Automation Examples',kind:'Testing',
  one:'Test suites that go looking for the bugs on purpose.',
  long:'Boundary and negative test cases for a user API and for account sign-in. Each scenario has steps you can reproduce, the expected and actual results, and assertions that cover success, error and security edge cases.',
  facts:[['User API','CRUD validation, pagination, error handling, rate limiting'],['Sign-in','Password hashing and salting, JWT and refresh tokens, session expiry'],['Security','Lockout after repeated failures']],
  tags:['API testing','Auth','Security']}
];

const inks={
 ivory:{name:'Ivory',bg:'#090909',a:'#ede9df',fg:'#eeeae0',accent:'#ff754a'},
 orange:{name:'Orange',bg:'#0b0908',a:'#ff7743',fg:'#f1e9df',accent:'#ff7743'},
 violet:{name:'Violet',bg:'#0a0910',a:'#b9a6e7',fg:'#ebe7f5',accent:'#b9a6e7'},
 ice:{name:'Ice',bg:'#070b0d',a:'#a7dae2',fg:'#e6f1f2',accent:'#a7dae2'},
 phosphor:{name:'Phosphor',bg:'#050a07',a:'#86ffa6',fg:'#dff5e4',accent:'#86ffa6',bloom:.15},
 dusk:{name:'Dusk, two-tone',bg:'#0a090d',a:'#b9a6e7',b:'#ff8454',fg:'#eee8ee',accent:'#ff8454'},
 paper:{name:'Paper negative',bg:'#ded8cb',a:'#2d2c29',fg:'#1f1e1c',accent:'#b3401d',positive:true},
 moss:{name:'Moss',bg:'#0b110e',a:'#c9d8b6',fg:'#e7ecdf',accent:'#e0b86a'},
 blueprint:{name:'Blueprint',bg:'#081428',a:'#a9c8ff',fg:'#e9f0ff',accent:'#ffd27a'},
 riso:{name:'Riso, two-tone',bg:'#efe9dc',a:'#ff4f7a',b:'#2436c9',fg:'#1b2270',accent:'#ff4f7a',positive:true},
 custom:{name:'Your own',bg:'#0a0a0a',a:'#3255ff',fg:'#f0f0f0',accent:'#3255ff'}
};

const types={
 cabinet:{name:'Cabinet',hint:'Georgia italic, DM Sans, Space Mono',display:"Georgia,'Times New Roman',serif",body:"'DM Sans',Arial,sans-serif",mono:"'Space Mono',ui-monospace,monospace",style:'italic',weight:400,track:'-.045em',lh:.94,scale:1,up:'none'},
 editorial:{name:'Editorial',hint:'Instrument Serif and Instrument Sans',display:"'Instrument Serif',Georgia,serif",body:"'Instrument Sans',Arial,sans-serif",mono:"'DM Mono',ui-monospace,monospace",style:'normal',weight:400,track:'-.025em',lh:.95,scale:1.08,up:'none'},
 poster:{name:'Poster',hint:'Anton capitals with Archivo',display:"'Anton',Impact,sans-serif",body:"'Archivo',Arial,sans-serif",mono:"'Space Mono',ui-monospace,monospace",style:'normal',weight:400,track:'.005em',lh:.9,scale:1.05,up:'uppercase'},
 grotesk:{name:'Grotesk',hint:'Bricolage Grotesque, tight and heavy',display:"'Bricolage Grotesque',Arial,sans-serif",body:"'Bricolage Grotesque',Arial,sans-serif",mono:"'DM Mono',ui-monospace,monospace",style:'normal',weight:800,track:'-.05em',lh:.9,scale:.96,up:'none'},
 matrix:{name:'Dot matrix',hint:'Doto, a face made of dots',display:"'Doto','Space Mono',monospace",body:"'DM Sans',Arial,sans-serif",mono:"'IBM Plex Mono',ui-monospace,monospace",style:'normal',weight:900,track:'-.04em',lh:.92,scale:.92,up:'none'},
 bitmap:{name:'Bitmap',hint:'Jersey 10 pixel face',display:"'Jersey 10','Space Mono',monospace",body:"'DM Sans',Arial,sans-serif",mono:"'DM Mono',ui-monospace,monospace",style:'normal',weight:400,track:'0',lh:.82,scale:1.22,up:'none'}
};

// wireframe thumbnails: r x,y,w,h,opacity | c cx,cy,r,opacity | o x,y,w,h (outline)
const slots=[
 {id:'nav',code:'NAV',name:'Navigation',group:'parts',removable:true,variants:[
  {id:'bar',name:'Top bar',hint:'Monogram left, links right, as in the cabinet',wf:'r3,3,7,3,1;r36,3.5,5,2,.7;r43,3.5,5,2,.7;r50,3.5,5,2,.7;r3,9,54,.4,.3'},
  {id:'corners',name:'Four corners',hint:'One link pinned in each corner of the screen',wf:'r3,3,8,2.4,1;r49,3,8,2.4,1;r3,34.6,8,2.4,1;r49,34.6,8,2.4,1'},
  {id:'dock',name:'Dock',hint:'A floating pill at the bottom with the current section marked',wf:'o18,30,24,6;r20.5,32,5,2,1;r27.5,32,5,2,.5;r34.5,32,5,2,.5'},
  {id:'rail',name:'Side rail',hint:'A vertical strip on the left with turned labels',wf:'o2,2,7,36;r4.5,5,2,6,1;r4.5,14,2,5,.5;r4.5,22,2,5,.5;r4.5,30,2,5,.5'},
  {id:'index',name:'Index button',hint:'One button that opens a full-screen list',wf:'o47,3,10,5;r8,13,30,4,1;r8,20,22,4,.6;r8,27,34,4,.6'}]},
 {id:'hero',code:'HER',name:'Landing',group:'parts',removable:false,variants:[
  {id:'cabinet',name:'Cabinet',hint:'Serif headline on the left, the element floating right',wf:'r5,11,17,5,1;r5,18,12,5,1;r5,26,15,1.3,.5;r5,29,11,1.3,.5;c41,20,13,.55'},
  {id:'monolith',name:'Monolith',hint:'The element fills the screen and your name runs across it',wf:'c30,20,16,.45;r3,15,54,10,1'},
  {id:'plate',name:'Museum plate',hint:'A framed specimen with a caption, text beside it',wf:'o5,4,23,31;c16.5,18,8,.55;r7,31,12,1.2,.5;r33,9,22,4,1;r33,15,17,4,1;r33,24,20,1.3,.5;r33,27,16,1.3,.5'},
  {id:'dots',name:'Name in dots',hint:'Your name itself is the dithered image',wf:'d4,8,52,17;r4,30,14,1.3,.5;r23,30,14,1.3,.5;r42,30,14,1.3,.5'},
  {id:'catalogue',name:'Catalogue',hint:'The landing is the work: four specimens, one per project',wf:'r4,4,26,3,1;o4,12,11.5,22;o17.5,12,11.5,22;o31,12,11.5,22;o44.5,12,11.5,22;c9.7,21,4,.55;c23.2,21,4,.55;c36.7,21,4,.55;c50.2,21,4,.55'},
  {id:'scrub',name:'Resolve on scroll',hint:'Coarse dots sharpen into the element as you scroll',wf:'c26,20,13,.55;r46,8,9,1.3,.5;r46,19,9,1.3,1;r46,30,9,1.3,.5;r57,4,.5,32,.4'},
  {id:'split',name:'Split negative',hint:'Half the screen inverted, type on one side, element on the other',wf:'r0,0,30,40,.92;c45,20,11,.55'}]},
 {id:'work',code:'WRK',name:'Work',group:'parts',removable:true,variants:[
  {id:'plates',name:'Specimen plates',hint:'A grid, each project paired with an element',wf:'o5,3,24,16;o31,3,24,16;o5,21,24,16;o31,21,24,16;c17,11,5,.55;c43,11,5,.55;c17,29,5,.55;c43,29,5,.55'},
  {id:'ledger',name:'Ledger',hint:'Large rows; the specimen follows your cursor',wf:'r4,7,26,3.4,1;r4,15,20,3.4,.6;r4,23,30,3.4,.6;r4,31,17,3.4,.6;o38,10,15,15;c45.5,17.5,5,.55'},
  {id:'filmstrip',name:'Filmstrip',hint:'Tall frames you drag sideways, like the cabinet strip',wf:'o-5,7,17,26;o14,7,17,26;o33,7,17,26;o52,7,17,26;c22.5,18,5,.55;c41.5,18,5,.55'},
  {id:'panels',name:'Stacked panels',hint:'Full-width bands that pile up as you scroll',wf:'o0,2,60,11;o0,14.5,60,11;o0,27,60,11;c49,7.5,3.6,.55;c11,20,3.6,.55;c49,32.5,3.6,.55;r5,6,20,3,1;r32,18.5,20,3,1;r5,31,20,3,1'},
  {id:'drawers',name:'Drawers',hint:'Rows that open in place to show the project',wf:'o4,3,52,5;o4,10,52,18;o4,30,52,5;c44,19,6,.55;r8,14,18,3,1;r8,19,14,1.3,.5;r8,22,16,1.3,.5'}]},
 {id:'project',code:'PRJ',name:'Project view',group:'parts',removable:false,variants:[
  {id:'sheet',name:'Sheet',hint:'Opens over the page, like the cabinet collection',wf:'r0,0,60,40,.12;o10,5,40,30;c40,18,7,.55;r14,10,14,3,1;r14,16,12,1.3,.5;r14,19,14,1.3,.5'},
  {id:'page',name:'Full page',hint:'Takes the whole screen, with a way back',wf:'o1,1,58,38;c42,20,12,.55;r5,8,18,4,1;r5,16,16,1.3,.5;r5,19,18,1.3,.5;r5,31,8,2,.7'},
  {id:'drawer',name:'Side drawer',hint:'Slides in from the right, the page stays behind',wf:'r0,0,32,40,.12;o32,0,28,40;c46,12,7,.55;r36,23,16,3,1;r36,29,18,1.3,.5;r36,32,14,1.3,.5'}]},
 {id:'about',code:'ABT',name:'About',group:'parts',removable:true,variants:[
  {id:'statement',name:'Statement',hint:'One large paragraph, the facts set small beside it',wf:'r4,6,40,4,1;r4,12,44,4,1;r4,18,30,4,1;r4,28,16,1.3,.5;r4,31,12,1.3,.5;r30,28,16,1.3,.5'},
  {id:'spec',name:'Specimen sheet',hint:'You, described the way the cabinet describes an element',wf:'c14,20,9,.55;r30,7,24,.4,.4;r30,10,8,1.3,.5;r41,10,13,1.3,1;r30,15,24,.4,.4;r30,18,8,1.3,.5;r41,18,11,1.3,1;r30,23,24,.4,.4;r30,26,8,1.3,.5;r41,26,13,1.3,1;r30,31,24,.4,.4'},
  {id:'colophon',name:'Colophon',hint:'Two quiet columns and a note on how the site is made',wf:'r4,6,14,3,1;r4,13,22,1.3,.5;r4,16,20,1.3,.5;r4,19,22,1.3,.5;r4,22,16,1.3,.5;r32,13,22,1.3,.5;r32,16,18,1.3,.5;r32,19,22,1.3,.5;r4,32,52,.4,.4'}]},
 {id:'stack',code:'STK',name:'Stack',group:'parts',removable:true,variants:[
  {id:'marquee',name:'Marquee',hint:'One moving line of tools',wf:'r-4,16,18,7,1;r17,16,12,7,.6;r32,16,20,7,1;r55,16,10,7,.6'},
  {id:'groups',name:'Groups',hint:'Four short lists by kind of work',wf:'r4,8,10,2,1;r18,8,10,2,1;r32,8,10,2,1;r46,8,10,2,1;r4,14,8,1.3,.5;r4,17,9,1.3,.5;r4,20,6,1.3,.5;r18,14,9,1.3,.5;r18,17,6,1.3,.5;r32,14,7,1.3,.5;r32,17,9,1.3,.5;r32,20,8,1.3,.5;r46,14,9,1.3,.5;r46,17,7,1.3,.5'},
  {id:'dotted',name:'In dots',hint:'The tool names rendered through the dither',wf:'d4,9,52,22'}]},
 {id:'contact',code:'CON',name:'Contact',group:'parts',removable:true,variants:[
  {id:'email',name:'Big address',hint:'The email set huge, a reaching hand beside it',wf:'r4,9,12,1.3,.5;r4,15,40,6,1;r4,27,18,1.3,.5;c49,25,8,.55'},
  {id:'slip',name:'Message slip',hint:'A short form set like a printed slip',wf:'o14,4,32,32;r18,9,14,2,1;r18,15,24,.4,.5;r18,20,24,.4,.5;r18,25,24,.4,.5;r18,29,10,3,1'},
  {id:'strip',name:'Strip',hint:'One compact band with a copy button',wf:'o0,13,60,14;r4,18.5,22,3,1;r34,18.5,14,3,.6;o50,17.5,6,5'}]},
 {id:'footer',code:'FOT',name:'Footer',group:'parts',removable:true,variants:[
  {id:'line',name:'One line',hint:'Name, year, three links',wf:'r4,19,14,1.6,1;r38,19,5,1.6,.6;r45,19,5,1.6,.6;r52,19,5,1.6,.6;r4,14,52,.4,.4'},
  {id:'colophon',name:'Filmstrip colophon',hint:'A strip of elements you can click to change the specimen',wf:'o4,8,7,9;o12,8,7,9;o20,8,7,9;o28,8,7,9;o36,8,7,9;o44,8,7,9;r4,24,24,1.3,.5;r4,27,18,1.3,.5;r4,33,10,1.3,1'}]},
 {id:'flow',code:'FLW',name:'Flow',group:'parts',removable:false,variants:[
  {id:'scroll',name:'One long page',hint:'Every section in a single scroll',wf:'o22,1,16,38;r24,4,12,7,.5;r24,13,12,7,.5;r24,22,12,7,.5;r24,31,12,6,.5'},
  {id:'screens',name:'Separate screens',hint:'Each section is its own screen, with a transition between',wf:'o3,9,15,22;o22.5,9,15,22;o42,9,15,22;r19,19.5,2.5,1,.8;r38.5,19.5,2.5,1,.8'}]},

 {id:'specimen',code:'SPC',name:'Specimen',group:'look',removable:false,variants:elements.map(e=>({id:e.id,name:e.name,hint:e.note,cat:e.cat}))},
 {id:'surface',code:'SUR',name:'Surface',group:'look',removable:false,variants:[
  {id:'dither',name:'Dither',hint:'Ordered dots on a Bayer grid'},{id:'pixel',name:'Pixel',hint:'Square dots with a gap between them'},
  {id:'stipple',name:'Stipple',hint:'Round dots placed with blue noise'},{id:'halftone',name:'Halftone',hint:'A turned screen of dots that swell with light'},
  {id:'engrave',name:'Engrave',hint:'Lines that thicken where the surface is bright'},{id:'hatch',name:'Crosshatch',hint:'Layers of crossing strokes'},
  {id:'contour',name:'Contour',hint:'Lines of equal brightness, like a map'},{id:'glyph',name:'Glyphs',hint:'Characters chosen by tone'}]},
 {id:'ink',code:'INK',name:'Ink',group:'look',removable:false,variants:Object.keys(inks).map(k=>({id:k,name:inks[k].name,hint:inks[k].positive?'Dark ink on light paper':'Light ink on a dark ground'}))},
 {id:'pointer',code:'PTR',name:'Pointer',group:'look',removable:false,variants:[
  {id:'lens',name:'Lens',hint:'A circle of negative follows the cursor'},{id:'lamp',name:'Lamp',hint:'The cursor is a light raking across the relief'},
  {id:'pull',name:'Pull',hint:'The surface bulges toward the cursor'},{id:'disperse',name:'Disperse',hint:'Dots scatter away from the cursor'},{id:'still',name:'Still',hint:'No reaction'}]},
 {id:'air',code:'AIR',name:'Motion',group:'look',removable:false,variants:[
  {id:'calm',name:'Calm',hint:'Nothing moves until you do'},{id:'wind',name:'Wind',hint:'The top of the element sways'},{id:'drift',name:'Drift',hint:'The whole element floats slowly'}]},
 {id:'backdrop',code:'BKD',name:'Backdrop',group:'look',removable:false,variants:[
  {id:'none',name:'Plain',hint:'A flat ground'},{id:'field',name:'Drifting field',hint:'A slow cloud of dots behind everything'},{id:'horizon',name:'Horizon',hint:'Dots gather toward the bottom of the screen'},{id:'clip',name:'Signature clip',hint:'Your 3D name being signed, dithered faintly behind everything'}]},
 {id:'type',code:'TYP',name:'Type',group:'look',removable:false,variants:Object.keys(types).map(k=>({id:k,name:types[k].name,hint:types[k].hint}))},
 {id:'cursor',code:'CUR',name:'Cursor',group:'look',removable:false,variants:[
  {id:'cross',name:'Cross',hint:'A small plus sign'},{id:'ring',name:'Ring',hint:'A circle that grows over links'},{id:'system',name:'System',hint:'The ordinary arrow'}]},
 {id:'transition',code:'TRN',name:'Transition',group:'look',removable:false,variants:[
  {id:'wipe',name:'Dither wipe',hint:'The next screen develops through a dot pattern'},{id:'scan',name:'Scan',hint:'A band of lines sweeps down'},{id:'fade',name:'Fade',hint:'A short cross-fade'},{id:'cut',name:'Cut',hint:'Instant'},{id:'slash',name:'Slash',hint:'The slash from your mark sweeps across the screen'}]},
 {id:'intro',code:'INT',name:'Opening',group:'look',removable:false,variants:[
  {id:'develop',name:'Develop',hint:'The page appears dot by dot'},{id:'count',name:'Counter',hint:'Counts through the cabinet before opening'},{id:'none',name:'None',hint:'The page is simply there'},{id:'signature',name:'Signature',hint:'Your mark unfolds into your name and signs it, then the page opens'}]},
 {id:'element',code:'ELM',name:'Landing element',group:'sig',removable:false,variants:[
  {id:'specimen',name:'Cabinet element',hint:'The chosen specimen is the centrepiece',wf:'c30,20,14,.55'},
  {id:'clip',name:'Signature clip',hint:'Your 3D name being signed is the centrepiece',wf:'r7,10,46,7,.45;r15,20,30,7,.45;s9,13,40'}]},
 {id:'clip',code:'CLP',name:'Recording',group:'sig',removable:false,variants:[
  {id:'a',name:'Take one',hint:'The camera pushes in to the A at the end'},{id:'b',name:'Take two',hint:'The camera tilts and the signature lands in two strokes'}]},
 {id:'brand',code:'BRD',name:'Top-left mark',group:'sig',removable:false,variants:[
  {id:'serif',name:'Serif initials',hint:'A·I set in Georgia italic'},{id:'mark',name:'3D mark',hint:'Your AI mark with its slash, as a still'},
  {id:'live',name:'Live mark',hint:'The whole clip playing small, in dots'},{id:'signature',name:'Signature',hint:'Your handwritten signature as the logo'}]},
 {id:'signoff',code:'SGN',name:'Sign-off',group:'sig',removable:false,variants:[
  {id:'none',name:'None',hint:'No signature at the end of sections',wf:'r4,12,40,3,.5;r4,18,30,3,.5'},
  {id:'about',name:'Under the statement',hint:'The signature writes itself beneath the About text',wf:'r4,7,44,3,1;r4,12,36,3,1;s6,22,26'},
  {id:'footer',name:'In the footer',hint:'The page ends with your signature',wf:'r4,12,52,.4,.4;r4,22,22,1.3,.5;r4,25,16,1.3,.5;s34,20,22'},
  {id:'both',name:'Both',hint:'Under the statement and in the footer',wf:'r4,5,44,3,1;s6,12,22;r4,24,52,.4,.4;s34,29,22'}]}
];

const extras=[
 {id:'caption',name:'Caption line',hint:'The small readout under the element'},
 {id:'progress',name:'Progress track',hint:'A hairline that fills as you scroll'},
 {id:'edition',name:'Edition stamp',hint:'A two-line note beside the monogram'},
 {id:'grain',name:'Paper grain',hint:'A faint film grain over everything'}];

const base={element:'specimen',clip:'a',brand:'serif',signoff:'none',text:{on:false,head:'#eeeae0',body:'#eeeae0',muted:'#8f8c84',accent:'#ff754a'},specimen:'dahlia',surface:'dither',ink:'ivory',grain:3,pointer:'lens',air:'calm',backdrop:'none',type:'cabinet',cursor:'cross',transition:'wipe',intro:'develop',
 nav:'bar',hero:'cabinet',work:'filmstrip',project:'sheet',about:'statement',stack:'marquee',contact:'email',footer:'colophon',flow:'scroll',
 extras:{caption:true,progress:true,edition:true,grain:true},off:{},custom:{a:'#3255ff',b:'#ff8454',bg:'#0a0a0a',duo:false}};
const P=(name,blurb,o)=>({name,blurb,cfg:Object.assign(JSON.parse(JSON.stringify(base)),o)});
const presets=[
 P('Your build','The build you chose: Monolith, filmstrip, editorial type, your own red on charcoal, now with your mark and signature.',{nav:'bar',hero:'monolith',work:'filmstrip',project:'sheet',about:'statement',stack:'marquee',contact:'email',footer:'colophon',flow:'screens',specimen:'orchid',surface:'dither',ink:'custom',pointer:'disperse',air:'drift',backdrop:'horizon',type:'editorial',cursor:'cross',transition:'wipe',intro:'none',grain:3,custom:{a:'#ba081a',b:'#e3c4c4',bg:'#262121',duo:false},extras:{caption:false,progress:true,edition:false,grain:true},brand:'mark',signoff:'footer'}),
 P('The Cabinet','Your own playground, turned into a portfolio. Serif italic, ivory dots, the lens.',{}),
 P('Plate Book','Engraved plates on paper, set like a museum catalogue.',{specimen:'bust',surface:'engrave',ink:'paper',pointer:'lamp',type:'editorial',nav:'corners',hero:'plate',work:'plates',project:'page',about:'colophon',stack:'groups',contact:'slip',footer:'line',flow:'screens',transition:'scan',intro:'none',cursor:'ring',extras:{caption:true,progress:false,edition:false,grain:true}}),
 P('Monolith','One enormous halftone and your name in poster capitals.',{specimen:'octopus',surface:'halftone',ink:'orange',grain:4,pointer:'pull',air:'drift',type:'poster',nav:'dock',hero:'monolith',work:'panels',project:'page',about:'statement',stack:'marquee',contact:'email',footer:'line',cursor:'ring',extras:{caption:false,progress:true,edition:false,grain:true}}),
 P('Name in Dots','Your name is the image. Silk in two inks, scattering under the cursor.',{specimen:'cloth',surface:'stipple',ink:'dusk',pointer:'disperse',air:'wind',type:'grotesk',nav:'corners',hero:'dots',work:'ledger',project:'drawer',about:'spec',stack:'dotted',contact:'strip',footer:'colophon',extras:{caption:false,progress:true,edition:false,grain:true}}),
 P('Catalogue','The landing is the work. Contour lines, four specimens, separate screens.',{specimen:'nautilus',surface:'contour',ink:'ice',type:'editorial',nav:'index',hero:'catalogue',work:'drawers',project:'sheet',about:'spec',stack:'groups',contact:'email',footer:'line',flow:'screens',intro:'count',extras:{caption:false,progress:false,edition:false,grain:true}}),
 P('Resolve','Coarse squares sharpen into the element as you scroll. Dot-matrix type.',{specimen:'jellyfish',surface:'pixel',ink:'violet',grain:3,pointer:'lamp',air:'drift',type:'matrix',nav:'rail',hero:'scrub',work:'plates',project:'drawer',about:'statement',contact:'strip',footer:'line',off:{stack:true},extras:{caption:true,progress:true,edition:false,grain:true}}),
 P('Negative','A split screen in two riso inks on paper.',{specimen:'hand',surface:'hatch',ink:'riso',pointer:'pull',type:'grotesk',nav:'bar',hero:'split',work:'ledger',project:'page',about:'colophon',stack:'groups',contact:'slip',footer:'line',intro:'none',cursor:'system',extras:{caption:false,progress:true,edition:true,grain:true}}),
 P('Signal','Everything is characters. Phosphor glyphs over a drifting field.',{specimen:'gyroscope',surface:'glyph',ink:'phosphor',grain:4,type:'bitmap',nav:'dock',hero:'cabinet',work:'drawers',project:'sheet',about:'spec',stack:'dotted',contact:'strip',footer:'colophon',backdrop:'field',extras:{caption:true,progress:false,edition:true,grain:false}}),
 P('Herbarium','A pressed fern in fine stipple, moss ink, wind in the leaves.',{specimen:'fern',surface:'stipple',ink:'moss',grain:2,pointer:'lamp',air:'wind',type:'editorial',nav:'corners',hero:'plate',work:'filmstrip',project:'drawer',about:'statement',stack:'groups',contact:'email',footer:'colophon',backdrop:'horizon',cursor:'ring',extras:{caption:true,progress:true,edition:false,grain:true}}),
 P('Deep Water','A manta in fine blue dither, drifting. Dots part where you point.',{specimen:'stingray',surface:'dither',ink:'blueprint',grain:2,pointer:'disperse',air:'drift',type:'grotesk',nav:'index',hero:'monolith',work:'panels',project:'page',about:'colophon',stack:'marquee',contact:'email',footer:'line',backdrop:'field',intro:'count',extras:{caption:false,progress:true,edition:false,grain:true}})
];

slots.forEach(s=>s.variants.forEach((v,i)=>{v.code=s.code+'-'+(i+1)}));
const slotById=Object.fromEntries(slots.map(s=>[s.id,s]));
const variant=(slot,id)=>slotById[slot].variants.find(v=>v.id===id)||slotById[slot].variants[0];
const element=id=>elements.find(e=>e.id===id)||elements[0];
const clip=id=>({mp4:'assets/sig/sig-'+id+'.mp4',webm:'assets/sig/sig-'+id+'.webm',poster:'assets/sig/sig-'+id+'.webp',still:id==='b'?8.8:8.1});
window.CAT={clip,elements,me,projects,inks,types,slots,slotById,variant,element,extras,presets,base,img:id=>'assets/'+id+'.webp',thumb:id=>'assets/'+id+'-thumb.webp'};
})();
