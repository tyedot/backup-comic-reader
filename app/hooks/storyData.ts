import { Image } from "react-native";

const page0 = Image.resolveAssetSource(require("../../assets/comics/page0.jpg"));
const page1 = Image.resolveAssetSource(require("../../assets/comics/page1.jpg"));
const page2 = Image.resolveAssetSource(require("../../assets/comics/page2.jpg"));
const page3 = Image.resolveAssetSource(require("../../assets/comics/page3.jpg"));
const fight = Image.resolveAssetSource(require("../../assets/comics/fight.jpg"));
const fight1 = Image.resolveAssetSource(require("../../assets/comics/fight1.jpg"));
const fight2 = Image.resolveAssetSource(require("../../assets/comics/fight2.jpg"));
const fight3 = Image.resolveAssetSource(require("../../assets/comics/fight3.jpg"));
const run = Image.resolveAssetSource(require("../../assets/comics/run.jpg"));
const scare = Image.resolveAssetSource(require("../../assets/comics/scare.jpg"));
const climbTree = Image.resolveAssetSource(require("../../assets/comics/ClimbTree.jpg"));
const hideInTreeHollow = Image.resolveAssetSource(require("../../assets/comics/HideinTreeHollow.jpg"));
const killwolf = Image.resolveAssetSource(require("../../assets/comics/killwolf.jpg"));
const sparewolf = Image.resolveAssetSource(require("../../assets/comics/sparewolf.jpg"));
const gameover = Image.resolveAssetSource(require("../../assets/comics/Gameover.jpg"));
const strangeTracks = Image.resolveAssetSource(require("../../assets/comics/strangetracks.jpg"));

console.log("🖼️ Debugging require():", page0, "Type:", typeof page0);
console.log("🖼️ Debugging require():", page1, "Type:", typeof page0);
console.log("🖼️ Debugging require():", page2, "Type:", typeof page0);
console.log("🖼️ Debugging require():", page3, "Type:", typeof page0);

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

export const comicPages: ComicPage[] = [
    { id: 0, type: "image", content: page0, postBranch: 1 },
    { id: 1, type: "image", content: page1, postBranch: 2 },
    { id: 2, type: "image", content: page2, postBranch: 3 },

    {
        id: 3,
        type: "choice",
        content: page3,
        choices: [
            { label: "Fight", nextPage: 4, effect: { morale: 3 }, branch: [4, 7, 8, 9], postBranch: 10 },
            { label: "Run", nextPage: 5, effect: { morale: -3 }, branch: [5], postBranch: 10 },
            { label: "Scare wolves away", nextPage: 6, effect: { morale: -2 }, branch: [6], postBranch: 4 },
        ],
    },

    { id: 4, type: "image", content: fight, postBranch: 7 },
    { id: 7, type: "image", content: fight1, postBranch: 8 },
    { id: 8, type: "image", content: fight2, postBranch: 9 },
    {
        id: 9,
        type: "choice",
        content: fight3,
        choices: [
            { label: "Kill Wolf", nextPage: 12, effect: { morale: 1 }, postBranch: 15 },
            { label: "Spare Wolf", nextPage: 13, effect: { morale: 1 }, postBranch: 15 }
        ]
    },

    {
        id: 5,
        type: "choice",
        content: run,
        choices: [
            { label: "Climb Tree", nextPage: 10, effect: { morale: -3 }, postBranch: 10 },
            { label: "Hide in Tree Hollow", nextPage: 11, effect: { morale: -5 }, postBranch: 11 }
        ],
    },

    { id: 6, type: "image", content: scare, postBranch: 4 },

    { id: 10, type: "image", content: climbTree, postBranch: 15 },
    { id: 11, type: "image", content: hideInTreeHollow, postBranch: 14 },

    { id: 12, type: "image", content: killwolf, postBranch: 15 },
    { id: 13, type: "image", content: sparewolf, postBranch: 15 },

    { id: 14, type: "image", content: gameover },
    { id: 15, type: "image", content: strangeTracks },
];

export default comicPages;
