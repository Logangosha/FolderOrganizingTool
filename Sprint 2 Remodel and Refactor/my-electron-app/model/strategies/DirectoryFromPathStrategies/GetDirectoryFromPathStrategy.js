class GetDirectoryFromPathStrategy {
    // CONSTRUCTOR
    constructor() {
        this.directoryObject = null;
        this.directoryJSONObject = null;
    }
    // GET DIRECTORY FROM PATH
    getDirectoryFromPath(){
        throw new Error("This method must be implemented");
    }
    // GET RESPONSE
    getResponse() {
        // RETURN DIRECTORY OBJECT AND DIRECTORY JSON OBJECT
        return {directoryObject: this.directoryObject, directoryJSONObject: this.directoryJSONObject};
    }
}

module.exports = {
    GetDirectoryFromPathStrategy,
};