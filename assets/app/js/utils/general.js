import React, { Component } from 'react'
import {Tooltip, OverlayTrigger} from 'react-bootstrap'
import vagueTime from 'vague-time'
import UserColours from '../UserColours';

export const getFileIcon = type => {
	const IMG_ROOT = '../../../images/'
  if (type.includes('image/')) {
    return IMG_ROOT + 'icon_11_image_list.png'
  } else if (type.includes('spreadsheet')) {
    return IMG_ROOT + 'icon_11_spreadsheet_list.png'
  } else if (type.includes('presentation')) {
    return IMG_ROOT + 'icon_11_presentation_list.png'
  } else if (type.includes('pdf')) {
    return IMG_ROOT + 'icon_12_pdf_list.png'
  } else if (type.includes('zip') || type.includes('compressed')) {
    return IMG_ROOT + 'icon_9_archive_list.png'
  } else if (type.includes('word')) {
    return IMG_ROOT + 'icon_11_document_list.png'
  } else if (type.includes('text/')) {
    return IMG_ROOT + 'icon_10_text_list.png'
  } else {
    return IMG_ROOT + 'generic_app_icon_16.png'
  }
};

export function toFuzzyTime(time) {
	// Display exact date if older than 1 day
	let eventTime = new Date(time)
	let MS_IN_A_DAY = 24*60*60*1000
	if (new Date().getTime() -  eventTime.getTime() > MS_IN_A_DAY) {
		let options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
		return eventTime.toLocaleDateString('en-US', options)
	}
	return vagueTime.get({
		to: eventTime.getTime()/1000, // convert ISO UTC to seconds from epoch
		units: 's'
	})
}

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

function getCurrentTab() {
	// Returns the current tab (milestones, files, newsfeed or settings) that the user is currently on
	var re = /\/project\/[a-z0-9_-]+\/([^\/]+)/i
	var extracted = extractRegexGroup(re)
	if (extracted === 'files' || extracted === 'newsfeed' || extracted === 'settings') {
		return extracted
	} else {
		return 'milestones' // default
	}
}

export function getCurrentProject() {
	var re = /\/project\/([^\/]+)/i
	return extractRegexGroup(re)
}

export function getCurrentTab() {
	//Gets the current tab user is on (Milestone, Files, Github, Settings etc.) based on url
	var re = /\/project\/[^\/]+\/([a-z]+)/i
	return extractRegexGroup(re)
}

export function getGithubAuthCode() {
	var re = /\?code=([^\/&]+)/i
	return extractRegexGroup(re)
}

function extractRegexGroup(re) {
	var regexResultArray = re.exec(window.location.toString())
	if (regexResultArray) return regexResultArray[1]
	return ''
}

export function getProjectRoot() {
		return '/app/project/' + getCurrentProject()
}

export function isItemPresent(arr, id) {
	return arr.indexOf(id) >= 0;
}

export function isObjectPresent(arr, id) {
	for (var i = 0; i < arr.length; i++) {
		if (arr[i].id === id) return true
	}
	return false
}

export function filterUnique(arr) {
	let uniqueArr = []
	arr.forEach(item => {
		if (!isObjectPresent(uniqueArr, item.id)) {
			uniqueArr.push(item)
		}
	})
	return uniqueArr
}

// dump a list to string with separators.
export function dumpList(list, separator = ',') {

		var output = '';
		while(list.length>0) {
			output += list.shift()
			if(list.length>0) {
				output+=separator
			}
		}
		return output
}

// Returns a random integer between min (inclusive) and max (inclusive)
export const getRandomInt = (min, max) => (
  Math.floor(Math.random() * (max - min + 1)) + min
);

export const getNewColour = (usedColours) => {
  // Returns an unused colour from the predefined colour palette.
  // If all colours are used, returns a random colour
  const coloursLeft = UserColours.filter(colour => usedColours.indexOf(colour) <= -1);
  if (coloursLeft.length > 0) {
    return coloursLeft[getRandomInt(0, coloursLeft.length - 1)];
  }
  return UserColours[getRandomInt(0, UserColours.length - 1)];
};
