// PERFROM ORGANIZATION STATE BACKEND MODULE

class DirectoryManipulationPerformer {
    constructor() {
        this.directoryManipulationStrategy = null;
    }

    async performDirectoryManipulation(organizationAlgorithmResponse, directoryManipulationStrategy) {
       this.directoryManipulationStrategy = directoryManipulationStrategy;
       console.log("OrganizationPerformer: Performing organization");
       let response = await this.directoryManipulationStrategy.organize(organizationAlgorithmResponse);
       if(response) {
           return "Organization performed successfully";
       } else {
           return "Organization failed";
       }
    }
}

module.exports = {
    DirectoryManipulationPerformer,
};
