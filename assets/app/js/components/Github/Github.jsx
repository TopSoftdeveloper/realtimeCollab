import React, { Component, PropTypes } from 'react'
import {Table} from 'react-bootstrap'
import vagueTime from 'vague-time'
import Steps from 'rc-steps'
import RaisedButton from 'material-ui/lib/raised-button'
import {GITHUB_CLIENT_ID} from '../../AppConstants'
import {getGithubAuthCode} from '../../utils/general'
import {APP_ROOT_URL, PATH} from '../../AppConstants'
import {githubOAuth} from '../../utils/apiUtil'
import RepoList from './RepoList.jsx'
import EventList from './EventList.jsx'
require('rc-steps/assets/index.css')
require('rc-steps/assets/iconfont.css')
import $ from 'jquery'

class Github extends Component {
    constructor(props, context) {
        super(props, context)
    }

    componentDidMount() {
        // We check whether this is a redirect from github OAuth by checking
        // if there is a "code" query param
        let code = getGithubAuthCode()
        if (code) {
            githubOAuth(code).done(res => {
                if (!res.error) {
                    localStorage.setItem('github_token', res.access_token)
                    this.props.actions.updateAppStatus({github_token: res.access_token})
                }
            }).fail(e => console.log(e))
        }
        let repoName = this.props.project.github_repo_name
        let repoOwner = this.props.project.github_repo_owner
        let repoSet = repoName && repoOwner

        // Default repository not set
        if (this.props.app.github_token &&
            this.props.repos && this.props.repos.length === 0 &&
            !repoSet) {
            this.props.actions.initGithubRepos()
        }
    }

    authorize() {
        let redirectURI = APP_ROOT_URL + '/project/' + this.props.project.id + '/' + PATH.github
        window.location.assign('https://github.com/login/oauth/authorize?client_id=' + GITHUB_CLIENT_ID +
        '&scope=repo,notifications,user&redirect_uri=' + redirectURI)
    }

    render() {
        let repoName = this.props.project.github_repo_name
        let repoOwner = this.props.project.github_repo_owner
        let repoSet = repoName && repoOwner
        if (this.props.app.github_token && repoSet) {
            // Case 1: Authorized and Repository set
            return (
                <div>
                    <h4>{repoOwner}/{repoName} events</h4>
                    <EventList events={this.props.events} />
                </div>
            )
        }

        let steps = [{title: 'Authorize Github'}, {title: 'Select project repository'}]
        let content = null
        let currentStep = 0

        if (!this.props.app.github_token && !repoSet) {
            // Case 2: Not authorized and repository not set
            content = (
                <RaisedButton
                    label="Authorize"
                    onTouchTap={this.authorize.bind(this)}
                    primary={true}
                />
            )
        } else if (!repoSet) {
            // Case 3: Authorized but repository not set
            currentStep = 1
            content = (
                <RepoList
                    repos={this.props.repos}
                    setDefaultGithubRepo={this.props.actions.setDefaultGithubRepo}
                    projectId={this.props.project.id}
                />
            )
        } else {
            // Case 4: Repo set but not authorized
            return (
                <div className='my-step-container'>
                    <RaisedButton
                        label="Authorize"
                        onTouchTap={this.authorize.bind(this)}
                        primary={true}
                    />
                </div>
            )
        }

        return (
            <div className='my-step-container'>
                <Steps current={currentStep}>
                    {steps.map(function(s, i) {
                        return <Steps.Step
                            key={i}
                            title={s.title}
                        ></Steps.Step>
                        })}
                </Steps>
                {content}
            </div>
        )
    }
}

export default Github