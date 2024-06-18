const { NativeFileSystemExplorer } = require("../../strategies/DirectorySelectionStrategies/NativeFileSystemExplorer.js");
const { GeminiAPINonRecursiveOrganizaitonAlgorithm } = require("../../strategies/OrganizationAlgorithmStrategies/GeminiAPINonRecursiveOrganizaitonAlgorithm.js")
const { GetDirectoryNonRecursivelyFromPath }  = require("../../strategies/DirectoryFromPathStrategies/GetDirectoryNonRecursivlyFromPath.js");
const { NonRecursiveDirectoryManipulation } = require("../../strategies/DirectoryManipulationStrategies/NonRecursiveDirectoryManipulation.js");
const { NonRecursiveToJSON} = require("../ToJSONStrategies/NonRecursiveToJSON.js");
const { BaseStrategy } = require("./BaseStrategy.js");

class NonRecursiveStrategy extends BaseStrategy {
  constructor() {
    // SET STRATEGIES
    super();
    this.organizationAlgorithmStrategy = new GeminiAPINonRecursiveOrganizaitonAlgorithm();  
    this.getDirectoryFromPathStrategy = new GetDirectoryNonRecursivelyFromPath();
    this.getDirectoryPathStrategy = new NativeFileSystemExplorer();
    this.directoryManipulationStrategy = new NonRecursiveDirectoryManipulation();
    this.toJSONStrategy = new NonRecursiveToJSON();
  }
}

module.exports = {
    NonRecursiveStrategy,   
};