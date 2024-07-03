const { NativeFileSystemExplorer } = require("../DirectorySelectionStrategies/NativeFileSystemExplorer.js");
const { GeminiAPINonRecursiveOrganizaitonAlgorithm } = require("../OrganizationAlgorithmStrategies/GeminiAPINonRecursiveOrganizaitonAlgorithm.js")
const { GetDirectoryNonRecursivelyFromPath }  = require("../DirectoryFromPathStrategies/GetDirectoryNonRecursivlyFromPath.js");
const { NonRecursiveDirectoryManipulation } = require("../DirectoryManipulationStrategies/NonRecursiveDirectoryManipulation.js");
const { NonRecursiveToJSON} = require("../ToJSONStrategies/NonRecursiveToJSON.js");
const { OrganizationStrategy } = require("./OrganizationStrategy.js");

class NonRecursiveStrategy extends OrganizationStrategy {
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