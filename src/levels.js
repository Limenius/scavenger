const levels = [
  {
    map: `
**********************
*******..........*****
*******..........*****
*******..........*****
*******..........*****
*******..........*****
*******..........*****
*******..........*****
*******..........*****
*******..........*****
*******..........*****
**********************
**********************
**********************
**********************
**********************
**********************
**********************
**********************
**********************
**********************
**********************
**********************
**********************
**********************
**********************
**********************
`,
    text: `Level 0.
When exploring pyramids, it is important to
learn how to exit them.

Collect the treasure and exit the pyramid.

1 tresure chest.
Total gold in it: 1.

Click when you are ready to start`,
    player: { x: 9, y: 2 },
    monsters: [],
    exit: [
      { x: 15, y: 9, sprite: null }
    ],
    gold: [
      { x: 9 , y: 4, value: 1 },
    ],
    spells: []
  },
  {
    map: `
**********************
*******..........*****
*******..........*****
*******..........*****
*******..........*****
*******..........*****
*******..........*****
*******..........*****
*******..........*****
*******..........*****
*******..........*****
**********************
**********************
**********************
**********************
**********************
**********************
**********************
**********************
**********************
**********************
**********************
**********************
**********************
**********************
**********************
**********************
`,
    text: `Level 1.
As everybody knows, pyramids have mummies
protecting their treasures.

Mummies are blind and dumb, but they have a
good nose for people carrying gold.

Avoid them noticing you.

1 tresure chest.
Total gold in it: 1.

Click when you are ready to start`,
    player: { x: 9, y: 2 },
    monsters: [{ x: 11, y: 7 }, { x: 14, y: 4 }],
    exit: [
      { x: 13, y: 7, sprite: null }
    ],
    gold: [
      { x: 10 , y: 3, value: 1 },
    ],
    spells: []
  },
  {
    map: `
**********************
******...........*****
******...........*****
******...........*****
******...........*****
******...........*****
******...........*****
******...........*****
******...........*****
******...........*****
******...........*****
**********************
**********************
**********************
**********************
**********************
**********************
**********************
**********************
**********************
**********************
**********************
**********************
**********************
**********************
**********************
**********************
`,
    text: `Level 2.
Some treasures have more gold than others.
Carrying very precious treasures is risky.

Collect the treasure and exit carefully.

1 tresure chest.
Total gold in it: 3.

Click when you are ready to start`,
    player: { x: 9, y: 2 },
    monsters: [{ x: 11, y: 7 }, ],
    exit: [
      { x: 7, y: 7, sprite: null }
    ],
    gold: [
      { x: 15, y: 4, value: 3 },
    ],
    spells: []
  },
  {
    map: `
**********************
******...........*****
********.*************
******...........*****
******...........*****
******...........*****
******...........*****
******...........*****
******...........*****
******...........*****
******...........*****
**********************
**********************
**********************
**********************
**********************
**********************
**********************
**********************
**********************
**********************
**********************
**********************
**********************
**********************
**********************
**********************
`,
    text: `Level 3.
Monsters can smell you through walls.
Do not trust walls.

1 tresure chests.
Total gold in it: 3.

Click when you are ready to start`,
    player: { x: 15, y: 3 },
    monsters: [{ x: 12, y: 1 }],
    exit: [
      { x: 7, y: 7, sprite: null }
    ],
    gold: [
      { x: 12, y: 3, value: 3 },
    ],
    spells: []
  },
  {
    map: `
**********************
******...........*****
******...........*****
******...........*****
******...........*****
******...........*****
******...........*****
******...........*****
******...........*****
******...........*****
******...........*****
**********************
**********************
**********************
**********************
**********************
**********************
**********************
**********************
**********************
**********************
**********************
**********************
**********************
**********************
**********************
**********************
`,
    text: `Level 4.
You love finding treasures in scary pyramids.
You would never scape a pyramid before
finding every treasure in it first.

Collect all treasures and exit the pyramid.

2 tresure chests.
Total gold in them: 3.

Click when you are ready to start`,
    player: { x: 9, y: 2 },
    monsters: [{ x: 11, y: 7 }],
    exit: [
      { x: 7, y: 2, sprite: null }
    ],
    gold: [
      { x: 8, y: 4, value: 2 },
      { x: 13, y: 9, value: 1 }
    ],
    spells: []
  },
  {
    map: `
**********************
***..................*
***..................*
***..................*
***..*...............*
***..................*
***..................*
***..................*
***..................*
***..................*
***..................*
***..................*
***..................*
***..................*
***..................*
***............*....**
***..................*
***..................*
***..................*
***..................*
**********************
**********************
**********************
**********************
**********************
**********************
**********************
`,
    text: `Level 5.
Real pyramids are big and full
of monsters. Sometimes they have
more that one exit.

2 tresure chests.
Total gold in them: 3.
Click when you are ready to start`,
    player: { x: 7, y: 3 },
    monsters: [{ x: 4, y: 3 }, { x: 16, y: 5 }, { x: 11, y: 14 }, { x: 16, y: 7 }],
    exit: [
       { x: 5, y: 1, sprite: null },
       { x: 12, y: 10, sprite: null },
    ],
    gold: [
      { x: 11, y: 11, value: 1 },
      { x: 9, y: 11, value: 2 }
    ],
    spells: []
  },
  {
    map: `
**********************
*....................*
*....................*
*....................*
*....................*
*....................*
*....................*
*....................*
*....................*
*....................*
*....................*
*....................*
*....................*
*....................*
*....................*
*....................*
*....................*
*....................*
*....................*
*....................*
*....................*
*....................*
*....................*
*....................*
*....................*
*....................*
*....................*
**********************
`,
    text: `Level 6.
Along your way, you can find spells
and that can help you.
Purple spells will remove your smell.

3 tresure chests.
Total gold in them: 4.
Click when you are ready to start`,
    player: { x: 13, y: 13 },
    monsters: [{ x: 4, y: 5 }, { x: 6, y: 1 }],
    exit: [
      { x: 4, y: 3, sprite: null }
    ],
    gold: [
      { x: 11, y: 4, value: 1 },
      { x: 15, y: 5, value: 2 },
      { x: 12, y: 12, value: 1 }
    ],
    spells: [
      { x: 13, y: 8, type: 1 },
    ]
  },
  {
    map: `
**********************
*.........*..........*
*.........*..........*
*.........*..........*
*....................*
*.........*..........*
*.........*..........*
*.........*..........*
***********..........*
**********************
**********************
**********************
**********************
**********************
**********************
**********************
**********************
**********************
**********************
**********************
**********************
**********************
**********************
**********************
**********************
**********************
**********************
**********************
`,
    text: `Level 7.
Green spells will attract monsters in a
wide radius. Use them wisely.

3 tresure chests.
Total gold in them: 4.
Click when you are ready to start`,
    player: { x: 13, y: 4 },
    monsters: [{ x: 5, y: 5 }, { x: 6, y: 6 }],
    exit: [
      { x: 3, y: 6, sprite: null }
    ],
    gold: [
      { x: 2, y: 4, value: 1 },
      { x: 5, y: 5, value: 2 },
      { x: 3, y: 1, value: 1 }
    ],
    spells: [
      { x: 14, y: 6, type: 1 },
      { x: 11, y: 6, type: 2 },
    ]
  },
  {
    map: `
**********************
*****............*****
*....................*
*....................*
*..**............**..*
*..**............**..*
*..*******..*******..*
*..*******..*******..*
*..*******..*******..*
*..*******..*******..*
*..*******..*******..*
*..*******..*******..*
*..*******..*******..*
*..*******..*******..*
*..*******..*******..*
*..*******..*******..*
*..*******..*******..*
*..*******..*******..*
*..*******..*******..*
*..*******..*******..*
*..*******..*******..*
*..**............**..*
*..**............**..*
*....................*
*....................*
*****............*****
*****............*****
**********************
**********************
`,
    text: `Level 8.
Pyramids can be disorienting.
Be wise and explore them before
making any bold decisions.

2 tresure chests.
Total gold in them: 3.
Click when you are ready to start`,
    player: { x: 10, y: 4 },
    monsters: [{ x: 3, y: 5 }, { x: 21, y: 9 }],
    exit: [
      { x: 1, y: 2, sprite: null },
      { x: 19, y: 16, sprite: null }
    ],
    gold: [
      { x: 6, y: 4, value: 2 },
      { x: 5, y: 22, value: 1 },
    ],
    spells: [
      { x: 20, y: 3, type: 1 },
      { x: 2, y: 25, type: 2 },
    ]
  },
  {
    map: `
**********************
*.................*..*
*.................*..*
*.................*..*
*.................*..*
*.................*..*
*.................*..*
*.................*..*
*.................*..*
*.................*..*
*.................*..*
*.................*..*
*.................*..*
*.................*..*
*.................*..*
*.................*..*
*.................*..*
*.................*..*
*.................*..*
*.................*..*
*.................*..*
*.................*..*
*.................*..*
***********.*.....*..*
***********.*.....*..*
***********.*******..*
***********..........*
**********************
**********************
`,
    text: `Level 9.
You are now an experienced adventurer.
Let's go for a real quest.

4 tresure chests.
Total gold in them: 9.
Click when you are ready to start`,
    player: { x: 20, y: 2 },
    monsters: [{ x: 21, y: 10 }, { x: 10, y: 9 }, { x: 5, y: 6 }, { x: 10, y: 15 }],
    exit: [
      { x: 1, y: 19, sprite: null },
    ],
    gold: [
      { x: 20, y: 3, value: 2 },
      { x: 1, y: 21, value: 5 },
      { x: 10, y: 4, value: 1 },
      { x: 19, y: 22, value: 1 },
    ],
    spells: [
      { x: 19, y: 4, type: 1 },
      { x: 20, y: 4, type: 2 },
    ]
  },
];

export default levels;
