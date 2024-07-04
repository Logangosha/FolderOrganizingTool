// DEPENDENCIES
const { GoogleGenerativeAI } = require("@google/generative-ai");
// API KEY
const API_KEY = "AIzaSyBye3Lkp0V3G0ncsJetdSU_sw6-I_S4PiI";
const genAI = new GoogleGenerativeAI(API_KEY);
const {
  OrganizationAlgorithmStrategy,
} = require("./OrganizationAlrorithmStrategy");

class GeminiAPINonRecursiveOrganizaitonAlgorithm extends OrganizationAlgorithmStrategy {
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
    organizedDirectory = this.removeExtraText(organizedDirectory);

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
      "7. Return only the Json object, without any additional text such as ```json!\n" +
      "Example Input: \n" +
      "{\n" +
      '    "Desktop": {\n' +
      '        "Minecraft.exe": {),\n' +
      '        "MicrosoftWord.exe": {),\n' +
      '        "MicrosoftExcel.exe": {),\n' +
      '        "Chrome.exe": {),\n' +
      '        "Firefox.exe": {),\n' +
      '        "Edge.exe": {),\n' +
      '        "AdobeReader.exe": {),\n' +
      '        "Paint.exe": {),\n' +
      '        "Calculator.exe": {),\n' +
      '        "Notepad.exe": {),\n' +
      '        "Discord.exe": {),\n' +
      '        "Steam.exe": {),\n' +
      "    }\n" +
      "}\n" +
      "Example Output: \n" +
      "{\n" +
      '    "Desktop": {\n' +
      '        "Applications": {\n' +
      '            "MicrosoftWord.exe": {},\n' +
      '            "MicrosoftExcel.exe": {},\n' +
      '            "AdobeReader.exe": {},\n' +
      '            "Paint.exe": {},\n' +
      '            "Calculator.exe": {},\n' +
      '            "Notepad.exe": {},\n' +
      '            "Discord.exe": {},\n' +
      "        }\n" +
      '        "Browsers": {\n' +
      '            "Chrome.exe": {},\n' +
      '            "Firefox.exe": {},\n' +
      '            "Edge.exe": {}\n' +
      "        }\n" +
      '        "Games": {\n' +
      '            "Minecraft.exe": {},\n' +
      '            "Steam.exe": {}\n' +
      "        }\n" +
      "    }\n" +
      "}\n\n" +
      "Please Organize This Directory:\n";

    // CREATE JSON STRING
    var directoryToJSON = JSON.stringify(originalDirectoryJSON, null, 2);

    // ADD JSON STRING TO PROMPT
    prompt += directoryToJSON;

    // RETURN PROMPT
    return prompt;
  }
}

module.exports = {
  GeminiAPINonRecursiveOrganizaitonAlgorithm,
};
