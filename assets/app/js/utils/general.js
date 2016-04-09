import Avatar from 'material-ui/lib/avatar';
import React, { Component } from 'react'
import {Tooltip, OverlayTrigger} from 'react-bootstrap'
import vagueTime from 'vague-time'

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

export function getUserAvatar(imgSrc, displayName, enableTooltip, isSquare, memberColour) {
	let image = null
	let className = ""
	if (isSquare) className = "square-avatar"
	let styles = {}

	if (memberColour) {
		styles = {
			borderBottomStyle: 'solid',
			borderBottomColor: memberColour,
			borderBottomWidth: '7px'
		}
	}

	if (imgSrc && imgSrc !== 'undefined') {
		image = <Avatar size={36} src={imgSrc} className={className} style={styles}/>
	} else {
		image = <Avatar size={36} style={styles}>{displayName[0]}</Avatar>
	}

	if (enableTooltip) {
		const tooltip = (
				<Tooltip id={displayName}>{displayName}</Tooltip>
		);
		image = (
				<OverlayTrigger placement="bottom" overlay={tooltip}>
					{image}
				</OverlayTrigger>
				)
	}
	return image
}