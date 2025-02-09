interface Choice {
    label: string;
    nextPage: number;
    effect: { morale: number };
    kerukaBondEffect?: number;  // Optional property for Keruka's bond effect
    kehindeBondEffect?: number; // Optional property for Kehinde's bond effect
    branch?: number[];          // Array of possible branches (pages to navigate)
    postBranch?: number;        // Page to return to after the branch
  }
  
  interface ComicPage {
    id: number;                 // Unique page identifier
    type: 'image' | 'choice';   // Type of the page: either an image or a choice page
    content: any;               // The content of the page (usually an image)
    choices?: Choice[];         // Only present for 'choice' pages
    postBranch?: number;        // The page to return to after branching (optional)
  }
  
  // Define the pages and choices in your story
  export const comicPages: ComicPage[] = [
    // Image pages (linear progression)
    { id: 0, type: "image", content: require("../../assets/comics/page0.jpg"),postBranch: 1 },
    { id: 1, type: "image", content: require("../../assets/comics/page1.jpg"), postBranch: 2 },
    { id: 2, type: "image", content: require("../../assets/comics/page2.jpg"), postBranch: 3 },
  
    // Choice page
    {
      id: 3,
      type: "choice", // This is a choice page
      content: require("../../assets/comics/page3.jpg"), // Display image for this choice page
      choices: [
        { label: "Fight", nextPage: 4, effect: { morale: 3 }, branch: [4, 7, 8], postBranch: 10, kerukaBondEffect: 0, kehindeBondEffect: 0 },
        { label: "Run", nextPage: 5, effect: { morale: -3 }, branch: [5], postBranch: 10, kerukaBondEffect: 0, kehindeBondEffect: 0 },
        { label: "Scare wolves away", nextPage: 6, effect: { morale: -2 }, branch: [6], postBranch: 4, kerukaBondEffect: 0, kehindeBondEffect: 0 },
      ],
    },
  
    // Image outcomes
    { id: 4, type: "image", content: require("../../assets/comics/fight.jpg") }, // Fight outcome
    
    {
      id: 5,
      type: "choice",  // This is a choice page
      content: require("../../assets/comics/run.jpg"),  // Display an image for this choice page
      choices: [
        { label: "Climb Tree", nextPage: 10, effect: { morale: -3 }, postBranch: 10 },
        { label: "Hide in Tree Hollow", nextPage: 11, effect: { morale: -5 }, postBranch: 11 }
      ]
    },   // Run outcome
    
    { id: 6, type: "image", content: require("../../assets/comics/scare.jpg") }, // Scare wolves away
  
    // Branching within the fight choice
    { id: 7, type: "image", content: require("../../assets/comics/fight1.jpg") },
    { id: 8, type: "image", content: require("../../assets/comics/fight2.jpg") },
  
    { 
      id: 9, 
      type: "image", 
      content: require("../../assets/comics/fight3.jpg"),
      choices: [
          { label: "Kill Wolf", nextPage: 12, effect: { morale: 1 }, postBranch: 15 },
          { label: "Spare Wolf", nextPage: 13, effect: { morale: 1 }, postBranch: 15 }
      ]
    },
  
    // Branching within the Escape paths
    { id: 10, type: "image", content: require("../../assets/comics/ClimbTree.jpg"), postBranch: 15 },
    { id: 11, type: "image", content: require("../../assets/comics/HideinTreeHollow.jpg"), postBranch: 14 },
  
    // Branching within the Fight paths
    { id: 12, type: "image", content: require("../../assets/comics/killwolf.jpg"), postBranch: 15 },
    { id: 13, type: "image", content: require("../../assets/comics/sparewolf.jpg"), postBranch: 15 },
  
    // Game Over
    { id: 14, type: "image", content: require("../../assets/comics/Gameover.jpg") },
  
    // After branching, return to main path
    { id: 15, type: "image", content: require("../../assets/comics/strangetracks.jpg") },
  ];
  