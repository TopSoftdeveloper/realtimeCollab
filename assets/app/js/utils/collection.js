/**
* Provides utilities for redux state tree collections
**/

export function isProjectPresent(projectState, projectId) {
    let currentProjectMatches = projectState.filter(
		proj => proj.id === projectId);
    let matchingIds = currentProjectMatches.length;
    if (matchingIds > 1) {  
    	throw new Error("Project state has > 1 projects with the same id " + projectId);
    }   
    return matchingIds === 1 ? true : false;
}