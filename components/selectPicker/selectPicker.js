import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, Picker, Platform, ActionSheetIOS, TouchableHighlight } from 'react-native';

export default class SelectPicker extends React.Component {

  static propTypes = {
    placeholder: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    })).isRequired,
    name: PropTypes.string.isRequired,
    defaultValue: PropTypes.number,
    onChange: PropTypes.func.isRequired,
  }

  static defaultProps = {
    placeholder: '',
    defaultValue: -1,
  };

  constructor() {
    super();
    this.state = {
      open: false,
      selected: 0
    };
  }

  onSelect = (id) => {
    this.props.onChange(this.props.name, id);
    this.setState({selected: id});
  }

  getDefaultValue = () => {
    const { defaultValue, options } = this.props;
    if (defaultValue === -1) return false;
    return options.find(option => option.id === defaultValue).name;
  }

  showActionSheet = () => {
    ActionSheetIOS.showActionSheetWithOptions({
      options: this.props.options.map(option => option.name),
    },
    (buttonIndex) => {
      this.onSelect(this.props.options[buttonIndex].id);
    });
  };

  render() {
    const { placeholder } = this.props;
    const defaultValue = this.getDefaultValue();
    if (Platform.OS === 'ios') {
      return (
        <TouchableHighlight style={styles.container} onPress={this.showActionSheet}>
          <View style={styles.content}>
            <Text style={styles.selected}>
              { defaultValue || placeholder}
            </Text>
          </View>
        </TouchableHighlight>
      );
    }
    return (
      <View style={styles.container}>
        <Picker mode="dialog" onValueChange={this.onSelect} selectedValue={this.state.selected}>
          {this.props.options.map(option => <Picker.Item key={option.id} label={option.name} value={option.id}/>)}
        </Picker>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: Platform.select({
    ios: {
      backgroundColor: '#a0a0a0',
      padding: 15,
      height: 45,
    },
    android: {
      backgroundColor: '#a0a0a0',
      height: 45,
    }
  }),
  content: {
    // flex: 1,
  },
  selected: {
    color: '#000',
    height: 15,
    //flex: 1,
  },
});
