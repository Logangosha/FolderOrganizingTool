class GetDirectoryFromPathStrategy {
    constructor() {
        this.directoryObject = null;
        this.directoryJSONObject = null;
    }
    getDirectoryFromPath(){
        throw new Error("This method must be implemented");
    }

    getResponse() {
        return {directoryObject: this.directoryObject, directoryJSONObject: this.directoryJSONObject};
    }
}

module.exports = {
    GetDirectoryFromPathStrategy,
};