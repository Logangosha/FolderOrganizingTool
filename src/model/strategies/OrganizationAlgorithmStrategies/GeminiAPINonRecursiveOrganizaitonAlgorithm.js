
// DEPENDENCIES
const { GoogleGenerativeAI } = require("@google/generative-ai");
// API KEY
const API_KEY = "AIzaSyBhrHB3uJygVJcbXXhPaZKI5xlFM6TTkWE";
const genAI = new GoogleGenerativeAI(API_KEY);
const {OrganizationAlgorithmStrategy} = require('./OrganizationAlrorithmStrategy');

class GeminiAPINonRecursiveOrganizaitonAlgorithm  extends OrganizationAlgorithmStrategy {
    // CONSTRUCTOR
    async organize(originalDirectoryJSON) {
        console.log("Gemini API Organization Algorithm is being executed...");
        this.organizedDirectoryJSON = await this.getOrganizedDirectoryFromGeminiAPI(originalDirectoryJSON);
        return this.getResponse(); 
    }
    // GET RESPONSE
    async getOrganizedDirectoryFromGeminiAPI(originalDirectoryJSON) {
        // GENERATE PROMPT FROM DIRECTORY
        var prompt = await this.generatePromptFromDirectory(originalDirectoryJSON);
        // SENT PROMPT TO GEMINI API
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

    // GENERATE PROMPT FROM DIRECTORY
    async generatePromptFromDirectory(originalDirectoryJSON) {
        var prompt = "Please organize this directory JSON object. \n" +
        "You may create new folders to categorize the items as necessary. \n" +
        "Ensure each file is included only once; do not create or duplicate files!!! \n" +
        "The root directory is the first key in the JSON object. \n" +
        "Do not rename the root directory. \n"+
        "Do not create folders outside of the root directory.\n" + 
        "All new folders must be subdirectories of the root directory.\n" +
        "If the input is already organized, please return the input as is. \n" +
        "If the input consist of only folders, carefully determine if the folders can be categorized. \n" +        
        "Do not return any other text, only return a JSON object!!!\n" +

        "Example JSON Object: \n" +
        "{\n" +
        "    \"Desktop\": {\n" +
        "        \"Minecraft.exe\": {),\n" +
        "        \"MicrosoftWord.exe\": {),\n" +
        "        \"MicrosoftExcel.exe\": {),\n" +
        "        \"Chrome.exe\": {),\n" +
        "        \"Firefox.exe\": {),\n" +
        "        \"Edge.exe\": {),\n" +
        "        \"AdobeReader.exe\": {),\n" +
        "        \"Paint.exe\": {),\n" +
        "        \"Calculator.exe\": {),\n" +
        "        \"Notepad.exe\": {),\n" +
        "        \"Discord.exe\": {),\n" +
        "        \"Steam.exe\": {),\n" +
        "    }\n" +
        "}\n" +

        "Example Output: \n" +
        "{\n" +
        "    \"Desktop\": {\n" +
        "        \"Applications\": {\n" +
        "            \"MicrosoftWord.exe\": {},\n" +
        "            \"MicrosoftExcel.exe\": {},\n" +
        "            \"AdobeReader.exe\": {},\n" +
        "            \"Paint.exe\": {},\n" +
        "            \"Calculator.exe\": {},\n" +
        "            \"Notepad.exe\": {},\n" +
        "            \"Discord.exe\": {},\n" +
        "        }\n" +
        "        \"Browsers\": {\n" +
        "            \"Chrome.exe\": {},\n" +
        "            \"Firefox.exe\": {},\n" +
        "            \"Edge.exe\": {}\n" +
        "        }\n" +
        "        \"Games\": {\n" +
        "            \"Minecraft.exe\": {},\n" +
        "            \"Steam.exe\": {}\n" +
        "        }\n" +
        "    }\n" +
        "}\n" +


        "Please Organize This Directory:\n"; 
        // CREATE JSON STRING 
        var directoryToJSON = JSON.stringify(originalDirectoryJSON, null, 2);
        // ADD JSON STRING TO PROMPT
        prompt += directoryToJSON;
        return prompt;
    }    
}

module.exports = {
    GeminiAPINonRecursiveOrganizaitonAlgorithm,
};