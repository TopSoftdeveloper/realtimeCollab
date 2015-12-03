function hasTrailingSlash(urlString) {
	return urlString[urlString.length-1] === '/';
}

function trimUrlString(urlString) {
	if (hasTrailingSlash(urlString)) {
		return urlString.substring(0, urlString.length-1);
	} 
	return urlString
}

export function matchesUrl(a, b) {
	// Checks whether url a matches url b
	return trimUrlString(a) === trimUrlString(b);
}