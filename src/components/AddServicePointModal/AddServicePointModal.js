import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {
  MultiColumnList,
  Checkbox,
  Layout,
  Modal,
  ModalFooter,
} from '@folio/stripes/components';

class AddServicePointModal extends React.Component {
  static propTypes = {
    onSave: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    servicePoints: PropTypes.arrayOf(PropTypes.object),
  }

  state = {
    selection: {},
  }

  static getDerivedStateFromProps(props, state) {
    if (props.servicePoints.length !== Object.values(state.selection).length) {
      const selection = {};

      props.servicePoints.forEach((sp) => { selection[sp.id] = false; });

      return { selection };
    }

    return null;
  }

  onSaveAndClose = () => {
    const servicePoints = this.props.servicePoints.filter(sp => this.state.selection[sp.id]);

    this.props.onSave(servicePoints);
    this.props.onClose();
  }

  onCancel = () => {
    this.props.onClose();
  }

  onToggleBulkSelection = () => {
    const select = Object.values(this.state.selection).includes(false);
    const selection = {};

    this.props.servicePoints.forEach((sp) => { selection[sp.id] = select; });

    this.setState({ selection });
  }

  onToggleSelection = (sp) => {
    this.setState(({ selection }) => ({
      selection: {
        ...selection,
        [sp.id]: !(selection[sp.id])
      }
    }));
  }

  renderModalFooter() {
    return (
      <ModalFooter
        primaryButton={{
          id: 'save-service-point-btn',
          label: <FormattedMessage id="ui-users.saveAndClose" />,
          onClick: this.onSaveAndClose,
        }}
        secondaryButton={{
          label: <FormattedMessage id="stripes-core.button.cancel" />,
          onClick: this.onCancel,
        }}
      />
    );
  }

  render() {
    return (
      <Modal
        footer={this.renderModalFooter()}
        open={this.props.open}
        onClose={this.props.onClose}
        dismissible
        label={<FormattedMessage id="ui-users.sp.addServicePoints" />}
      >
        <Layout className="textCentered">
          <FormattedMessage
            id="ui-users.sp.servicePointsFound"
            values={{ count: this.props.servicePoints.length }}
          />
        </Layout>
        <MultiColumnList
          interactive={false}
          contentData={this.props.servicePoints}
          visibleColumns={['selected', 'name']}
          columnMapping={{
            selected: (
              <Checkbox
                name="selected-all"
                checked={Object.values(this.state.selection).includes(false) !== true}
                onChange={this.onToggleBulkSelection}
              />
            ),
            name: <FormattedMessage id="ui-users.sp.column.name" />,
          }}
          columnWidths={{ selected: 35 }}
          formatter={{
            selected: sp => <Checkbox
              name={`selected-${sp.id}`}
              checked={!!(this.state.selection[sp.id])}
              onChange={() => this.onToggleSelection(sp)}
            />
          }}
        />
      </Modal>
    );
  }
}

export default AddServicePointModal;
