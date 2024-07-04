// DEPENDENCIES
const { GoogleGenerativeAI } = require("@google/generative-ai");
// API KEY
const API_KEY = "AIzaSyBye3Lkp0V3G0ncsJetdSU_sw6-I_S4PiI";
const genAI = new GoogleGenerativeAI(API_KEY);
const {
  OrganizationAlgorithmStrategy,
} = require("./OrganizationAlrorithmStrategy");

class GeminiAPIRecursiveOrganizaitonAlgorithm extends OrganizationAlgorithmStrategy {
  // ORGANIZE DIRECTORY
  async organize(originalDirectoryJSON) {
    console.log("Gemini API Organization Algorithm is being executed...");
    this.organizedDirectoryJSON = await this.getOrganizedDirectoryFromGeminiAPI(
      originalDirectoryJSON
    );
    return this.getResponse();
  }

  // GET ORGANIZED DIRECTORY FROM GEMINI API
  async getOrganizedDirectoryFromGeminiAPI(originalDirectoryJSON) {
    // GENERATE PROMPT FROM DIRECTORY
    var prompt = await this.generatePromptFromDirectory(originalDirectoryJSON);
    let organizedDirectory = null;

    // SENT PROMPT TO GEMINI API
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    organizedDirectory = response.text();

    // REMOVE EXTRA TEXT
    organizedDirectory = await this.removeExtraText(organizedDirectory);

    // PRINT ORGANIZED DIRECTORY
    console.log("Organized Directory: " + organizedDirectory);

    // RETURN ORGANIZED DIRECTORY
    return organizedDirectory;
  }

  // REMOVE EXTRA TEXT
  async removeExtraText(organizedDirectory) {
    let firstIndex = organizedDirectory.indexOf("{");
    let lastIndex = organizedDirectory.lastIndexOf("}");
    organizedDirectory = organizedDirectory.slice(firstIndex, lastIndex + 1);
    return organizedDirectory;
  }

  // GENERATE PROMPT FROM DIRECTORY
  async generatePromptFromDirectory(originalDirectoryJSON) {
    var prompt =
      "Please act as an expert organizer and organize this directory JSON object according to the following guidelines:\n\n" +
      "1. You may create new folders to categorize the items as necessary. \n" +
      "2, Ensure each file is included only once; do not create or duplicate files!!! \n" +
      "3. The root directory is the first key in the JSON object. Do not rename the root directory. \n" +
      "4. Do not create folders outside of the root directory. All new folders must be subdirectories of the root directory.\n" +
      "5. If the input is already organized, please return the input as is. \n" +
      "6. If the input consist of only folders, categorize them if possible. \n" +
      "7. Return only the JSON object, without any additional text.\n" +
      "Example Input: \n" +
      "{\n" +
      '    "Desktop": {\n' +
      '        "Minecraft.exe": {},\n' +
      '        "MicrosoftWord.exe": {},\n' +
      '        "MicrosoftExcel.exe": {},\n' +
      '        "Firefox.exe": {},\n' +
      '        "Edge.exe": {},\n' +
      '        "AdobeReader.exe": {},\n' +
      '        "Paint.exe": {},\n' +
      '        "Calculator.exe": {},\n' +
      '        "Notepad.exe": {},\n' +
      '        "Discord.exe": {},\n' +
      '        "Steam.exe": {},\n' +
      '        "Apps": {\n' +
      '            "Arduino.lnk": {},\n' +
      '            "Audacity.lnk": {},\n' +
      '            "Code Compare.lnk": {},\n' +
      '            "Docker Desktop.lnk": {},\n' +
      '            "draw.io.lnk": {},\n' +
      '            "Browsers": {\n' +
      '                "Google Chrome.lnk": {},\n' +
      "            }\n" +
      "        }\n" +
      "    }\n" +
      "}\n" +
      "Example Output: \n" +
      "{\n" +
      '    "Desktop": {\n' +
      '        "Productivity": {\n' +
      '             "AdobeReader.exe": {},\n' +
      '             "Calculator.exe": {},\n' +
      '             "Notepad.exe": {},\n' +
      '             "Development": {\n' +
      '                 "Code Compare.lnk": {},\n' +
      '                 "Docker Desktop.lnk": {},\n' +
      '                 "Arduino.lnk": {},\n' +
      "             }\n" +
      '             "MicrosoftOffice": {\n' +
      '                 "MicrosoftWord.exe": {},\n' +
      '                 "MicrosoftExcel.exe": {},\n' +
      "             }\n" +
      '             "Browsers": {\n' +
      '                "Google Chrome.lnk": {},\n' +
      '                "Firefox.exe": {},\n' +
      '                "Edge.exe": {},\n' +
      "             }\n" +
      "        } \n" +
      '        "Entertainment": {\n' +
      '           "Creativity": {\n' +
      '                 "Graphic Design": {\n' +
      '                      "Paint.exe": {},\n' +
      '                      "draw.io.lnk": {},\n' +
      "                 } \n" +
      '                  "Audacity.lnk": {},\n' +
      "           } \n" +
      '           "Games": {\n' +
      '                "Minecraft.exe": {},\n' +
      '                "Steam.exe": {},\n' +
      "           } \n" +
      '           "Discord.exe": {},\n' +
      "        }\n" +
      "    }\n" +
      "}\n" +
      "Organize This Directory:\n";

    // CREATE JSON STRING
    var directoryToJSON = JSON.stringify(originalDirectoryJSON, null, 2);

    // PRINT JSON STRING
    console.log("Unorganized Directory: " + directoryToJSON);

    // ADD JSON STRING TO PROMPT
    prompt += directoryToJSON;

    // RETURN PROMPT
    return prompt;
  }

  //   async verifyResponse(originalRootChildren, organizedRootChildren) {
  //     // FUNCTION TO DETERMINE IF AN ITEM IS A FILE OR DIRECTORY
  //     async function getItemType(item) {
  //       return item.includes(".") ? "file" : "directory";
  //     }

  //     // FUNCTION TO SEARCH A DIRECTORY AND RETURN IF KEY EXISTS INSIDE OF IT
  //     async function searchDirectory(key, organizedRootChildren) {
  //       for (const organizedKey of organizedRootChildren) {
  //         // CHECK ITEM TYPE
  //         // IF ITS A FILE AND THE KEY MATCHES, RETURN TRUE
  //         if (getItemType(organizedKey) === "file" && key === organizedKey) {
  //           return true;
  //           // IF ITS A DIRECTORY, RECURSIVELY SEARCH THE DIRECTORY
  //         } else if (getItemType(organizedKey) === "directory") {
  //           searchDirectory(key, organizedRootChildren[organizedKey]);
  //         }
  //       }
  //       // IF THE KEY IS NOT FOUND RETURN FALSE
  //       return false;
  //     }

  //     // LOOP THOUGH EACH KEY IN THE ORIGINAL ROOT CHILDREN
  //     let found = false;
  //     for (let key of originalRootChildren) {
  //       // CHECK TYPE OF KEY
  //       if ((await getItemType(key)) === "file") {
  //         // IF FILE THEN SEARCH DIRECTORY FOR KEY
  //         // SEARCH DIRECTORY FOR KEY
  //         found = searchDirectory(key, organizedRootChildren);
  //         // IF THE KEY IS NOT FOUND, RETURN FALSE
  //         if (!found) {
  //           return false;
  //         }
  //       } else {
  //         // IF THE KEY IS A DIRECTORY THEN RECURSIVELY CALL THIS FUNCTION ON THE VALUE
  //         if (
  //           this.verifyResponse(
  //             originalRootChildren[key],
  //             organizedRootChildren
  //           ) === false
  //         ) {
  //           return false;
  //         }
  //       }
  //     }
  //     // IF ALL KEYS ARE FOUND, RETURN TRUE
  //     return true;
  //   }
}

module.exports = {
  GeminiAPIRecursiveOrganizaitonAlgorithm,
};
