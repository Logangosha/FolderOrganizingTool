

const { GoogleGenerativeAI } = require("@google/generative-ai");
const API_KEY = "AIzaSyBhrHB3uJygVJcbXXhPaZKI5xlFM6TTkWE";
const genAI = new GoogleGenerativeAI(API_KEY);
const {OrganizationAlgorithmStrategy} = require('./OrganizationAlrorithmStrategy');

class GeminiAPIOrganizaitonAlgorithm  extends OrganizationAlgorithmStrategy {
    async organize(originalDirectoryJSON) {
        console.log("Gemini API Organization Algorithm is being executed...");
        this.organizedDirectoryJSON = await this.getOrganizedDirectoryFromGeminiAPI(originalDirectoryJSON);
        return this.getResponse(); 
    }
    async getOrganizedDirectoryFromGeminiAPI(originalDirectoryJSON) {
        // generate prompt from directory
        var prompt = await this.generatePromptFromDirectory(originalDirectoryJSON);
        // sent prompt to Gemini API
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const organizedDirectory = response.text();
        // TEST RESPONSE
            // const organizedDirectory = `{"Desktop": {
            //         "Applications": {
            //             "Arduino.lnk": {},
            //             "Audacity.lnk": {},
            //             "Battle.net.lnk": {},
            //             "Code Compare.lnk": {},
            //             "Docker Desktop.lnk": {},
            //             "draw.io.lnk": {},
            //             "CurseForge.lnk": {},
            //             "Electron Fiddle.lnk": {},
            //             "Firefox.lnk": {},
            //             "GitHub Desktop.lnk": {},
            //             "GNU Octave (CLI).lnk": {},
            //             "Google Chrome.lnk": {},
            //             "IBM SPSS Statistics.lnk": {},
            //             "LockDown Browser.lnk": {},
            //             "Microsoft Edge.lnk": {},
            //             "Microsoft SQL Server Management Studio 18.lnk": {},
            //             "Notepad++.lnk": {},
            //             "OBS Studio.lnk": {},
            //             "paint.net.lnk": {},
            //             "Power BI Desktop.lnk": {},
            //             "StarUML.lnk": {},
            //             "Steam.lnk": {},
            //             "TI-Nspire CX CAS Student Software.lnk": {},
            //             "Visual Studio 2022.lnk": {},
            //             "Visual Studio Code.lnk": {},
            //             "Vortex.lnk": {},
            //             "Word.lnk": {},
            //             "World of Warcraft.lnk": {}
            //         },
            //         "Games": {
            //             "minecraft.exe": {},
            //             "SkyrimTogether.exe - Shortcut.lnk": {},
            //             "Terraria.url": {},
            //             "The Elder Scrolls V Skyrim Special Edition.url": {},
            //             "mGBA.lnk": {},
            //             "Pokemon - Fire Red Version (U) (V1.1).gba - Shortcut.lnk": {}
            //         },
            //         "Scripts": {
            //             "ChessAppOnlineStatusCleanUp.bat": {},
            //             "ChessAppOnlineStatusCleanUp.exe": {},
            //             "CleanUp.php": {},
            //             "CleanUpOnlineStatus.php": {}
            //         },
            //         "Other": {
            //             "Excel.lnk": {},
            //             "Outlook.lnk": {},
            //             "New folder": {
            //                 "newfile.txt": {}
            //             }
            //         }
            //     }
            // }`;  
        return organizedDirectory;
    }
    async generatePromptFromDirectory(originalDirectoryJSON) {
        var prompt = "Please organize this directory JSON object. \n" +
        "You may create new folders as necessary. \n" +
        "Ensure each file is included only once; do not create or duplicate files. \n" +
        "Do not rename the root directory. \n"+
        "Do not return any other text, only return a JSON object!!!\n" +
        "Organize This Directory:\n";    
        // create json string
        var directoryToJSON = JSON.stringify(originalDirectoryJSON, null, 2);
        // add json string to prompt
        prompt += directoryToJSON;
        return prompt;
    }    
}

module.exports = {
    GeminiAPIOrganizaitonAlgorithm
};