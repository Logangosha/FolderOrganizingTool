// PERFROM ORGANIZATION STATE BACKEND MODULE

class DirectoryManipulationPerformer {
    // CONSTRUCTOR
    constructor() {
        this.directoryManipulationStrategy = null;
    }

    // PERFORM DIRECTORY MANIPULATION
    async performDirectoryManipulation(organizationAlgorithmResponse, directoryManipulationStrategy) {
        console.log("Performing directory manipulation");
       this.directoryManipulationStrategy = directoryManipulationStrategy;
       // PERFORM DIRECTORY MANIPULATION AND RETURN RESPONSE
       let response = await this.directoryManipulationStrategy.organize(organizationAlgorithmResponse);
       // IF SUCCESSFUL RETURN SUCCESS MESSAGE
       if(response) {
           return "Organization Performed Successfully";
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
