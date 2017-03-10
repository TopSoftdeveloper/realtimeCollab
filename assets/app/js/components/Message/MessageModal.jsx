import React, { PropTypes, Component } from 'react';
import assign from 'object-assign';
import FlatButton from 'material-ui/FlatButton';
import { FormControl, FormGroup, Tabs, Tab, Button } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';

const propTypes = {
  contentValue: PropTypes.string,
  onSubmitMethod: PropTypes.func.isRequired,
  onCloseMethod: PropTypes.func,
  inputStyle: PropTypes.object,
};
const styles = {
  actionButton: {
  },
  input: {
    height: 150,
    maxHeight: 150,
  },
  formGroup: {
    marginBottom: 0,
  },
};
class MessageModal extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      inputText: props.contentValue || '',
    };
    this.onSubmitButtonClick = this.onSubmitButtonClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  componentDidMount() {
    this.input.focus();
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      inputText: nextProps.contentValue || '',
    });
  }
  onSubmitButtonClick() {
    if (this.state.inputText.trim()) {
      this.props.onSubmitMethod(this.state.inputText);
      this.setState({ inputText: '' });
      if (this.props.onCloseMethod) {
        this.props.onCloseMethod();
      }
    }
  }
  handleChange(event) {
    this.setState({ inputText: event.target.value });
  }
  render() {
    const { inputStyle, onCloseMethod } = this.props;
    return (
      <div>
        <FormGroup controlId="formControlsTextarea" style={styles.formGroup}>
          <Tabs defaultActiveKey={1} animation={false} id="noanim-tab-example">
            <Tab eventKey={1} title="Write">
              <FormControl
                autofocus
                value={this.state.inputText}
                onChange={this.handleChange}
                componentClass="textarea"
                style={assign({}, styles.input, inputStyle)}
                placeholder=""
                inputRef={inputRef => { this.input = inputRef; }}
              />
            </Tab>
            <Tab eventKey={2} title="Preview">
              <ReactMarkdown
                escapeHtml
                source={this.state.inputText}
                className="messageModalInput"
              />
            </Tab>
          </Tabs>
          <span className="pull-left">
            <Button
              onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                window.open('http://commonmark.org/help/', '_newtab'); /* global window */
              }}
              bsStyle="link"
            >Markdown support</Button>

          </span>
          <span className="pull-right">
            {onCloseMethod &&
              <FlatButton
                secondary
                label="Cancel" onClick={onCloseMethod}
                style={styles.actionButton}
              />
            }
            <FlatButton
              disabled={!this.state.inputText.trim()}
              primary
              label="Submit" onTouchTap={this.onSubmitButtonClick}
              style={styles.actionButton}
            />
          </span>

        </FormGroup>
      </div>
    );
  }
}

MessageModal.propTypes = propTypes;
export default MessageModal;
