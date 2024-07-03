const { NativeFileSystemExplorer } = require("../DirectorySelectionStrategies/NativeFileSystemExplorer.js");
const { GeminiAPIRecursiveOrganizaitonAlgorithm } = require("../OrganizationAlgorithmStrategies/GeminiAPIRecursiveOrganizaitonAlgorithm.js")
const { GetDirectoryRecursivelyFromPath }  = require("../DirectoryFromPathStrategies/GetDirectoryRecursivlyFromPath.js");
const { RecursiveDirectoryManipulation } = require("../DirectoryManipulationStrategies/RecursiveDirectoryManipulation.js");
const { RecursiveToJSON } = require("../ToJSONStrategies/RecursiveToJSON.js");
const { OrganizationStrategy } = require("./OrganizationStrategy.js");

class RecursiveStrategy extends OrganizationStrategy {
  constructor() {
    // SET STRATEGIES
    super();
    this.organizationAlgorithmStrategy = new GeminiAPIRecursiveOrganizaitonAlgorithm();  
    this.getDirectoryFromPathStrategy = new GetDirectoryRecursivelyFromPath();
    this.getDirectoryPathStrategy = new NativeFileSystemExplorer();
    this.directoryManipulationStrategy = new RecursiveDirectoryManipulation();
    this.toJSONStrategy = new RecursiveToJSON();
  }
}

module.exports = {
    RecursiveStrategy,   
};