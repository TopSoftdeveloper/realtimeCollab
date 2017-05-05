import React, { Component, PropTypes } from 'react';
import { browserHistory } from 'react-router';
import _ from 'lodash';
import Divider from 'material-ui/Divider';
import { List, ListItem } from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Paper from 'material-ui/Paper';
import { Row, Col } from 'react-bootstrap';

import { darkBlack } from '../../UserColours.js';
import * as Actions from '../../actions/ReduxTaskActions';
import Code from '../../icons/Code.jsx';
import CodeFragment from './CodeFragment.jsx';
import { toFuzzyTime } from '../../utils/general';
import LoadingIndicator from '../Common/LoadingIndicator.jsx';
import myTheme from '../../myTheme.js';

const styles = {
  highlight: {
    color: myTheme.palette.primary1Color,
  },
  container: {
    marginTop: 10,
    display: 'flex',
    flexFlow: 'column',
  },
  titleContainer: {
    flex: '0 1 auto',
  },
  contentContainer: {
    flex: '1 1 auto',
    overflowY: 'auto',
  },
};

const propTypes = {
  search: PropTypes.array.isRequired,
  app: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
};
/* global window */
class SearchResults extends Component {
  constructor(props, context) {
    super(props, context);
    this.handleChange = this.handleChange.bind(this);
  }

  goToResult(link, e) {
    e.preventDefault();
    window.open(link, '_newtab');
  }

  goToTask(result, e) {
    e.preventDefault();
    browserHistory.push(`/app/project/${result.project_id}/milestones?highlight=${result.id}`);
  }

  handleChange(event, index, value) {
    this.props.dispatch(Actions.updateAppStatus({
      searchFilter: value,
    }));
  }
  renderDriveList(driveResults) {
    const driveListItems = driveResults.map(result => (
      <div key={result.id}>
        <ListItem
          leftAvatar={<Avatar src={result.thumbnail} />}
          onTouchTap={this.goToResult.bind(this, result.link)}
          primaryText={result.primaryText}
          secondaryText={
            <p>
              <span
                style={{ color: darkBlack }}
              >
                Last modified by {result.secondaryText}
              </span>
              &nbsp;&nbsp;&nbsp;{toFuzzyTime(result.modifiedTime)}
            </p>
          }
          secondaryTextLines={1}
        />
        <Divider inset />
      </div>
    ));
    return (driveResults.length > 0 && (this.props.app.searchFilter === 'files'
    || this.props.app.searchFilter === 'all') &&
      <List>
        <Subheader>Files</Subheader>
        {driveListItems}
      </List>
    );
  }
  renderTaskList(taskResults) {
    const taskListItems = taskResults.map(result => (
      <div key={result.id}>
        <ListItem
          leftAvatar={<Avatar src={result.thumbnail} />}
          onTouchTap={this.goToTask.bind(this, result)}
          primaryText={result.primaryText}
          secondaryText={
            <p>
              <span style={{ color: darkBlack }}>
                Assigned to {result.secondaryText}
              </span>
              &nbsp;&nbsp;&nbsp;{result.project_content}
            </p>
          }
          secondaryTextLines={1}
        />
        <Divider inset />
      </div>
    ));
    return (taskResults.length > 0 && (this.props.app.searchFilter === 'tasks'
    || this.props.app.searchFilter === 'all') &&
    <List>
      <Subheader>Tasks</Subheader>
      {taskListItems}
    </List>
    );
  }
  renderGithubList(githubResults) {
    const githubListItems = githubResults.map(result => {
      const codePreview = result.text_matches.map(match =>
        <CodeFragment fragment={match.fragment} matches={match.matches} key={_.uniqueId('code')} />
      );
      return (
        <div key={result.id}>
          <ListItem
            leftAvatar={<Avatar icon={<Code />} />}
            onTouchTap={this.goToResult.bind(this, result.link)}
            primaryText={result.primaryText}
            secondaryText={
              <p>
                {result.repo}
              </p>
            }
            secondaryTextLines={1}
          />
          {codePreview}
          <Divider inset />
        </div>
      );
    });
    return (githubResults.length > 0 && (this.props.app.searchFilter === 'code'
    || this.props.app.searchFilter === 'all') &&
    <List>
      <Subheader>Code</Subheader>
      {githubListItems}
    </List>
    );
  }
  render() {
    const { search } = this.props;
    let content = <LoadingIndicator className="loading-indicator" />;
    let filterMenu = null;
    if (!this.props.app.queriesInProgress) {
      const driveResults = search.filter(result => result.type === 'drive');
      const taskResults = search.filter(result => result.type === 'task');
      const githubResults = search.filter(result => result.type === 'github');
      const filterByList = [];
      if (taskResults.length > 0) {
        filterByList.push(<MenuItem value={'tasks'} primaryText="Assigned Tasks" key="tasks" />);
      }
      if (githubResults.length > 0) {
        filterByList.push(<MenuItem value={'code'} primaryText="Code" key="code" />);
      }

      if (driveResults.length > 0) {
        filterByList.push(<MenuItem value={'files'} primaryText="Files" key="files" />);
      }

      if (filterByList.length > 1) {
        filterByList.unshift(<MenuItem value={'all'} primaryText="All" key="ta" />);
        filterMenu = (
          <SelectField
            className="pull-right"
            floatingLabelText="Filter"
            value={this.props.app.searchFilter}
            onChange={this.handleChange}
          >
            {filterByList}
          </SelectField>
        );
      }
      content = [
        this.renderTaskList(taskResults),
        this.renderGithubList(githubResults),
        this.renderDriveList(driveResults),
      ];
    }
    return (
      <div className="main-content" style={styles.container}>
        <Row style={styles.titleContainer}>
          <Col xs={10}>
            <h2>
              Results for&nbsp;
              <span style={styles.highlight}>{this.props.app.queryString}</span>
              {!this.props.app.queriesInProgress &&
                <Subheader style={{ display: 'inline-block', width: 'auto' }}>
                  &nbsp;
                  <span style={{ color: myTheme.palette.primary1Color }}>
                    {search.length}
                  </span> result{search.length > 1 ? 's' : ''} found
                </Subheader>
              }
            </h2>
          </Col>
          <Col xs={2}>
            {filterMenu}
          </Col>
        </Row>
        {search.length > 0 && !this.props.app.queriesInProgress &&
          <Paper style={styles.contentContainer}>
            {content}
          </Paper>
        }
      </div>
    );
  }
}

SearchResults.propTypes = propTypes;
export default SearchResults;
