interface Choice {
    label: string;
    nextPage: number;
    effect: { morale: number };
    kerukaBondEffect?: number;
    kehindeBondEffect?: number;
    branch?: number[];
    postBranch?: number;
}

interface ComicPage {
    id: number;
    type: 'image' | 'choice';
    content: any;
    choices?: Choice[];
    postBranch?: number;
    branch?: number[];
}

// Define the pages and choices in your story
export const comicPages: ComicPage[] = [
    // Linear Image Pages
    { id: 0, type: "image", content: require("../../assets/comics/page0.jpg"), postBranch: 1 },
    { id: 1, type: "image", content: require("../../assets/comics/page1.jpg"), postBranch: 2 },
    { id: 2, type: "image", content: require("../../assets/comics/page2.jpg"), postBranch: 3 },

    // Choice Page
    {
        id: 3,
        type: "choice",
        content: require("../../assets/comics/page3.jpg"),
        choices: [
            { label: "Fight", nextPage: 4, effect: { morale: 3 }, branch: [4, 7, 8, 9], postBranch: 10 },
            { label: "Run", nextPage: 5, effect: { morale: -3 }, branch: [5], postBranch: 10 },
            { label: "Scare wolves away", nextPage: 6, effect: { morale: -2 }, branch: [6], postBranch: 4 },
        ],
    },

    // Fight Path (Sequential Branching)
    { id: 4, type: "image", content: require("../../assets/comics/fight.jpg"), postBranch: 7 },
    { id: 7, type: "image", content: require("../../assets/comics/fight1.jpg"), postBranch: 8 },
    { id: 8, type: "image", content: require("../../assets/comics/fight2.jpg"), postBranch: 9 },
    {
        id: 9,
        type: "choice",
        content: require("../../assets/comics/fight3.jpg"),
        choices: [
            { label: "Kill Wolf", nextPage: 12, effect: { morale: 1 }, postBranch: 15 },
            { label: "Spare Wolf", nextPage: 13, effect: { morale: 1 }, postBranch: 15 }
        ]
    },

    // Run Path
    {
        id: 5,
        type: "choice",
        content: require("../../assets/comics/run.jpg"),
        choices: [
            { label: "Climb Tree", nextPage: 10, effect: { morale: -3 }, postBranch: 10 },
            { label: "Hide in Tree Hollow", nextPage: 11, effect: { morale: -5 }, postBranch: 11 }
        ],
    },

    { id: 6, type: "image", content: require("../../assets/comics/scare.jpg"), postBranch: 4 },

    // Escape Paths
    { id: 10, type: "image", content: require("../../assets/comics/ClimbTree.jpg"), postBranch: 15 },
    { id: 11, type: "image", content: require("../../assets/comics/HideinTreeHollow.jpg"), postBranch: 14 },

    // Kill/Sparing the Wolf
    { id: 12, type: "image", content: require("../../assets/comics/killwolf.jpg"), postBranch: 15 },
    { id: 13, type: "image", content: require("../../assets/comics/sparewolf.jpg"), postBranch: 15 },

    // Game Over & Main Path Continuation
    { id: 14, type: "image", content: require("../../assets/comics/Gameover.jpg") },
    { id: 15, type: "image", content: require("../../assets/comics/strangetracks.jpg") },
];
