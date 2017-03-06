import React, { PropTypes, Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import { FormControl, FormGroup } from 'react-bootstrap';

const propTypes = {
  milestoneId: PropTypes.string,
  projectId: PropTypes.string.isRequired,
  authorId: PropTypes.string.isRequired,
  onPostNewMessage: PropTypes.func.isRequired,
};
const styles = {
  textarea: {
  },
  textField: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderRadius: 2,
    borderColor: 'black',
    padding: 5,
  },
  postButton: {
    marginTop: 5,
  },
};
class PostMessageInput extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      inputText: '',
    };
    this.onSubmitButtonClick = this.onSubmitButtonClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  onSubmitButtonClick() {
    if (this.state.inputText.trim()) {
      const message = {
        pinned: false,
        content: this.state.inputText,
        author_id: this.props.authorId,
        project_id: this.props.projectId,
        milestone_id: this.props.milestoneId,
      };
      this.props.onPostNewMessage(message);
      this.setState({ inputText: '' });
    }
  }
  handleChange(event) {
    this.setState({ inputText: event.target.value });
  }
  render() {
    return (
      <div>
        <FormGroup controlId="formControlsTextarea">
          <FormControl
            value={this.state.inputText}
            onChange={this.handleChange}
            componentClass="textarea"
            placeholder="Post your comment here"
          />
          <RaisedButton
            disabled={!this.state.inputText.trim()}
            primary
            label="Post" onTouchTap={this.onSubmitButtonClick}
            buttonStyle={styles.postButton}
          />
        </FormGroup>
      </div>
    );
  }
}

PostMessageInput.propTypes = propTypes;
export default PostMessageInput;
