import React, { Component, PropTypes } from 'react'
import {Table} from 'react-bootstrap'
import vagueTime from 'vague-time'
import Steps from 'rc-steps'
import RaisedButton from 'material-ui/lib/raised-button'
import {GITHUB_CLIENT_ID} from '../../AppConstants'
import {getGithubAuthCode} from '../../utils/general'
import {APP_ROOT_URL, PATH} from '../../AppConstants'
import {githubOAuth} from '../../utils/apiUtil'
import RepoList from './../Github/RepoList.jsx'
import LoadingIndicator from '../LoadingIndicator.jsx'
require('rc-steps/assets/index.css')
require('rc-steps/assets/iconfont.css')
import $ from 'jquery'
import FontIcon from 'material-ui/lib/font-icon';

class Github extends Component {
    constructor(props, context) {
        super(props, context)
        this.state = {
            step: 0
        }
    }

    setLoadingTrue() {
        this.props.actions.updateAppStatus({
            github: {
                loading: true
            }
        })
    }

    stepForward() {
        this.setState({
            step: this.state.step + 1
        })
    }

    setLoadingFalse() {
        this.props.actions.updateAppStatus({
            github: {
                loading: false
            }
        })
    }

    syncWithGithub(projectId, repoName, repoOwner) {
        this.setLoadingTrue()
        this.props.actions.syncWithGithub(projectId, repoName, repoOwner)
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
                    this.props.actions.updateGithubLogin(res.access_token)
                }
            }).fail(e => console.log(e))
        }
    }

    authorize() {
        let redirectURI = APP_ROOT_URL + '/project/' + this.props.project.id + '/' + PATH.settings
        window.location.assign('https://github.com/login/oauth/authorize?client_id=' + GITHUB_CLIENT_ID +
        '&scope=repo,notifications,user&redirect_uri=' + redirectURI)
    }

    render() {
        let app = this.props.app
        let loading = null
        if (app.github && app.github.loading) {
            loading = <LoadingIndicator/>
        }

        let repoName = this.props.project.github_repo_name
        let repoOwner = this.props.project.github_repo_owner
        let repoSet = repoName && repoOwner
        let steps = [{title: 'Welcome'}, {title: 'Authorize Github'}, {title: 'Select project repository'}]
        let content = null
        let currentStep = this.state.step

        if (!app.github_token && !repoSet) {
            content = (
            <div>
                <h4>Welcome to Collab!</h4>
                <br/>
                <p>Collab helps you keep all your project files, todo lists and team updates in one place. </p>
                <p>Your todo lists are synced seamlessly with Github issues, and project files in Google Docs can be
                    accessed right from the Files panel.</p>
                <br/>
                <RaisedButton
                    className="animated infinite pulse"
                    label="Lets get started!"
                    onTouchTap={this.stepForward.bind(this)}
                    primary={true}
                />
            </div>
            )
        }

        if (currentStep == 1) {
            // Case 2: Not authorized and repository not set
            content = (
                <div>
                    <br/>
                    <p>First, we need to authorize your Github account so Collab can sync your todo list
                    with Github issues.</p>

                    <RaisedButton
                    label="Authorize Github"
                    onTouchTap={this.authorize.bind(this)}
                    secondary={true}
                    icon={<FontIcon className="fa fa-github"/>}
                    />
                </div>
            )
        }

        if (app.github_token && !repoSet) {
            // Case 3: Authorized but repository not set
            currentStep = 2
            content = (
                <div>
                    <br/>
                    <p>Select a default repository and you're all set!</p>
                    {loading}
                    <br/>
                    <RepoList
                        repos={this.props.repos}
                        syncWithGithub={this.syncWithGithub.bind(this)}
                        projectId={this.props.project.id}
                    />
                </div>
            )
        }

        if (!app.github_token && repoSet) {
            // Case 4: Repo set but not authorized
            return (
                <div className='my-step-container'>
                    <h4>Please re-authorize Github</h4>
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