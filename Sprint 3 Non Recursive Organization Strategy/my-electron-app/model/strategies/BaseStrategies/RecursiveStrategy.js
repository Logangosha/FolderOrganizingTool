const { NativeFileSystemExplorer } = require("../../strategies/DirectorySelectionStrategies/NativeFileSystemExplorer.js");
const { GeminiAPIRecursiveOrganizaitonAlgorithm } = require("../../strategies/OrganizationAlgorithmStrategies/GeminiAPIRecursiveOrganizaitonAlgorithm.js")
const { GetDirectoryRecursivelyFromPath }  = require("../../strategies/DirectoryFromPathStrategies/GetDirectoryRecursivlyFromPath.js");
const { RecursiveDirectoryManipulation } = require("../../strategies/DirectoryManipulationStrategies/RecursiveDirectoryManipulation.js");
const { RecursiveToJSON } = require("../ToJSONStrategies/RecursiveToJSON.js");
const { BaseStrategy } = require("./BaseStrategy.js");

class RecursiveStrategy extends BaseStrategy {
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