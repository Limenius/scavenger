const levels = [
  {
    map: `
************************
************************
************************
************************
************************
***..................***
***..................***
***..................***
***..*...............***
***..................***
***..................***
***..................***
***..................***
***..................***
***..................***
***..................***
***..................***
***..................***
***..................***
***............*....****
***..................***
***..................***
***..................***
***..................***
************************
************************
************************
************************
************************
************************
`,
    text: `Level 3.
Real pyramids have more than one monster.
Sometimes more that one exit too.

2 tresure chests.
Total gold in them: 3.
Click when you are ready to start`,
    player: { x: 11, y: 13 },
    monsters: [{ x: 11, y: 17 }, { x: 16, y: 11 }],
    exit: [
          { x: 13, y: 14, sprite: null },
          { x: 12, y: 15, sprite: null },
    ],
    gold: [
      { x: 11, y: 15, value: 1 },
      { x: 9, y: 15, value: 2 }
    ],
    spells: []
  },
  {
    map: `
************************
*******..........*******
*******..........*******
*******..........*******
*******..........*******
*******..........*******
*******..........*******
*******..........*******
*******..........*******
*******..........*******
*******..........*******
************************
************************
************************
************************
************************
************************
************************
************************
************************
************************
************************
************************
************************
************************
************************
************************
************************
************************
************************
`,
    text: `Level 0.
Collect the treasure and exit the pyramid.

1 tresure chest.
Total gold in it: 1.

Click when you are ready to start`,
    player: { x: 9, y: 2 },
    monsters: [{ x: 11, y: 7 }],
    exit: { x: 13, y: 7, sprite: null },
    gold: [
      { x: 9, y: 3, value: 1 },
    ],
    spells: []
  },
  {
    map: `
************************
*******..........*******
*******..........*******
*******..........*******
*******..........*******
*******..........*******
*******..........*******
*******..........*******
*******..........*******
*******..........*******
*******..........*******
************************
************************
************************
************************
************************
************************
************************
************************
************************
************************
************************
************************
************************
************************
************************
************************
************************
************************
************************
`,
    text: `Level 1.
Monsters are dumb and blind, but they have
a very good nose for adventures carrying gold.
Avoid them getting near you.

1 tresure chest.
Total gold in it: 1.

Click when you are ready to start`,
    player: { x: 9, y: 2 },
    monsters: [{ x: 11, y: 7 }],
    exit: { x: 13, y: 7, sprite: null },
    gold: [
      { x: 9, y: 4, value: 1 }
    ],
    spells: []
  },
  {
    map: `
************************
******...........*******
******...........*******
******...........*******
******...........*******
******...........*******
******...........*******
******...........*******
******...........*******
******...........*******
******...........*******
************************
************************
************************
************************
************************
************************
************************
************************
************************
************************
************************
************************
************************
************************
************************
************************
************************
************************
************************
`,
    text: `Level 2.
Some treasures have more gold than others.
Carrying very precious treasures is risky.

1 tresure chests.
Total gold in them: 3.

Click when you are ready to start`,
    player: { x: 9, y: 2 },
    monsters: [{ x: 11, y: 7 }],
    exit: { x: 7, y: 2, sprite: null },
    gold: [
      { x: 8, y: 4, value: 2 },
    ],
    spells: []
  },
  {
    map: `
************************
******...........*******
********.***************
******...........*******
******...........*******
******...........*******
******...........*******
******...........*******
******...........*******
******...........*******
******...........*******
************************
************************
************************
************************
************************
************************
************************
************************
************************
************************
************************
************************
************************
************************
************************
************************
************************
************************
************************
`,
    text: `Level 4.
Monsters can smell you through walls.
Do not trust walls.

1 tresure chests.
Total gold in them: 3.

Click when you are ready to start`,
    player: { x: 15, y: 3 },
    monsters: [{ x: 12, y: 1 }],
    exit: { x: 7, y: 3, sprite: null },
    gold: [
      { x: 12, y: 3, value: 2 },
    ],
    spells: []
  },
  {
    map: `
************************
******...........*******
**********.*************
******...........*******
******...........*******
******...........*******
******...........*******
******...........*******
******...........*******
******...........*******
******...........*******
************************
************************
************************
************************
************************
************************
************************
************************
************************
************************
************************
************************
************************
************************
************************
************************
************************
************************
************************
`,
    text: `Level 5.
You were born to seek treasures in scary pyramids.
You would never scape a pyramid before finding
all every treasure in it first.

Collect all treasures and exit the pyramid.

2 tresure chests.
Total gold in them: 3.

Click when you are ready to start`,
    player: { x: 9, y: 2 },
    monsters: [{ x: 11, y: 7 }],
    exit: { x: 7, y: 2, sprite: null },
    gold: [
      { x: 8, y: 4, value: 2 },
      { x: 13, y: 10, value: 1 }
    ],
    spells: []
  },
  {
    map: `
************************
*......................*
*......................*
*........*.............*
*..*.....*.............*
*......................*
*........*.............*
*........*.............*
*......................*
*........*.............*
*........*.............*
*......................*
*........*.............*
*........*.............*
*......................*
*........*.............*
*........*.............*
*........*.............*
*........*.............*
*......................*
*......................*
*........*.............*
*........*.............*
*........*............**
*........*.............*
*......................*
*......................*
*........*.............*
*........*.............*
*........*............**
************************
`,
    text: `Level 4.
Along your way, you can find spells
and items that can help you.
Use them wisely.

3 tresure chests.
Total gold in them: 4.
Click when you are ready to start`,
    player: { x: 3, y: 3 },
    monsters: [{ x: 4, y: 5 }, { x: 6, y: 1 }],
    exit: { x: 6, y: 6, sprite: null },
    gold: [
      { x: 1, y: 4, value: 1 },
      { x: 8, y: 5, value: 2 },
      { x: 12, y: 12, value: 1 }
    ],
    spells: [
      { x: 13, y: 3, type: 1 },
      { x: 14, y: 3, type: 2 },
    ]
  }
];

export default levels;
