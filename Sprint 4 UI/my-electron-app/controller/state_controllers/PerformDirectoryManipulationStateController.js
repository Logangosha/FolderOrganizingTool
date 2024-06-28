// PERFROM ORGANIZATION STATE BACKEND MODULE

class DirectoryManipulationPerformer {
    // CONSTRUCTOR
    constructor() {
        this.directoryManipulationStrategy = null;
    }

    // PERFORM DIRECTORY MANIPULATION
    async performDirectoryManipulation(organizationAlgorithmResponse, directoryManipulationStrategy) {
       this.directoryManipulationStrategy = directoryManipulationStrategy;
       console.log("OrganizationPerformer: Performing organization");
       console.log("Organization Algorithm Response: "+ JSON.stringify(organizationAlgorithmResponse, null, 2)
         );
       console.log("Directory Manipulation Strategy: "+ directoryManipulationStrategy);
       // PERFORM DIRECTORY MANIPULATION AND RETURN RESPONSE
       let response = await this.directoryManipulationStrategy.organize(organizationAlgorithmResponse);
       // IF SUCCESSFUL RETURN SUCCESS MESSAGE
       if(response) {
           return "Organization performed successfully";
       }
        // ELSE RETURN FAILURE MESSAGE 
       else {
           return "Organization failed";
       }
    }
}

module.exports = {
    DirectoryManipulationPerformer,
};
