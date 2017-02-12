import React, { Component, PropTypes } from 'react'
import {Table} from 'react-bootstrap'
import vagueTime from 'vague-time'
require('rc-steps/assets/index.css')
require('rc-steps/assets/iconfont.css')
import Steps from 'rc-steps'
import $ from 'jquery'
import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton';

import RepoList from './RepoList.jsx'
import LoadingIndicator from '../Common/LoadingIndicator.jsx'

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

    render() {
        let app = this.props.app
        let loading = null
        if (app.github && app.github.loading) {
            loading = <LoadingIndicator className="loading-indicator-left"/>
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
                <p>Collab helps you aggregate all your project files, todo lists and code in one place. </p>
                <p>By enabling GitHub integration, you can</p>
                    <ul>
                        <li>Sync your Collab todo list with GitHub issues</li>
                        <li>Receive updates about your project repository</li>
                        <li>Search through your project source code</li>
                    </ul>
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
                    <p>First, we need to authorize your Github account. Collab will not store any of your source code
                    on our servers.</p>

                    <RaisedButton
                    label="Authorize Github"
                    onTouchTap={this.props.authorize}
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
                        reposFetched={app.github.repo_fetched}
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
