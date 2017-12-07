import React, { Component } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Platform, 
  TouchableNativeFeedback, 
  TouchableOpacity, 
  Picker, 
  Button, 
  TextInput, 
  Switch, 
  FlatList, 
  Dimensions, 
  StatusBar, 
  ScrollView 
} from 'react-native';
import { connect } from 'react-redux';
import { fetchRequest, fetchSuccess, fetchFailure } from '../actions/fetchActions';
import { Actions } from 'react-native-router-flux';
import { logout } from '../actions/loginActions';
import SelectPicker from '../components/selectPicker/selectPicker';
import NavigationBar from 'react-native-navbar';
import Modal from 'react-native-modal';
import { StockLine } from 'react-native-pathjs-charts';
import moment from 'moment';
import TimerMixin from 'react-timer-mixin';

class HomeScreen extends Component {
  constructor() {
    super();

    const { width, height } = Dimensions.get("window");
    this.handler = dims => {
      console.log('---------------------rotated------------------------',dims);
      this.setState({width: dims.window.width, height: dims.window.height});
    }

    this.titleConfig = {
      title: 'Home',
      tintColor: 'white',
    };

    this.logoutButtonConfig = {
      title: 'Logout',
      handler: () =>  {
        this.props.logout();
        Actions.pop();
      }
    };

    this.rateButtonConfig = {
      title: 'Rate',
      handler: () =>  {
        this.setModalVisible(true)
      }
    };

    this.state = {
      width: width,
      height: height,
      feedName: 0, 
      modalVisible: false, 
      rate: '10',
      packetSize: 100, 
      errorSwitch: false,
      lastData: '',
    };

    this.feedOptions = [
      { id: 0, name: 'flow' },
      { id: 1, name: 'fstdev' },
      { id: 2, name: 'temperature' },
      { id: 3, name: 'humidity' },
    ];

    this.packetButtonConfig = [
      {
        packetSize: 10
      },
      {
        packetSize: 50
      },
      {
        packetSize: 100
      },
      {
        packetSize: 250
      },
      {
        packetSize: 500
      },
      {
        packetSize: 1000
      },
    ];
  }

  mixins: [TimerMixin];

  resetTimer() {
    console.log('--------------resetTimer()-------------');
    if(this.timer)
      clearInterval(this.timer);
    this.startTimer();
  }

  startTimer() {
    const { feedName, packetSize, rate } = this.state;
    this.props.fetchRequest(this.props.user.user, this.props.user.token, feedName, packetSize);
    let period = 10000;
    if(rate!='')
      period = parseInt(rate, 10) * 1000;

    this.timer = setInterval(
      () => { 
        console.log('-------timer-sending request-------(', feedName, packetSize, rate, ')');
        this.props.fetchRequest(this.props.user.user, this.props.user.token, feedName, packetSize);
      },
      period
    );
  }

  componentWillMount() {
    console.log('-----------componentWillMount()-------------');
    Dimensions.addEventListener("change", this.handler);
  }

  componentDidMount() {
    console.log("componentDidMount: ", this.props.user);
    this.startTimer();
  }

  componentWillUnmount() {
    clearInterval(this.timer);
    Dimensions.removeEventListener("change", this.handler);
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  onSelect = (name, value) => {
    this.setState({ feedName: value }, ()=>this.resetTimer());
  }

  onSwitchChange = (value) => {
    this.setState({errorSwitch:value});
    console.log('---------switch-------',value);
    let data = {
      value: 0
    };
    if(value) {
      data = {
        value: 1
      }
    }
    console.log(data);
    fetch('https://io.adafruit.com/api/v2/weaVaer/feeds/log/data', {  
      method: 'POST',
      headers: {
        'x-aio-key': this.props.user.token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(function(response) {
        if(response.status == 200) return response.json();
        else throw new Error('Something went wrong on api server!');
    })
    .then(function(response) {
        console.log(response);
    })
    .catch(function(error) {
        console.error(error);
    });
  }

  packetBtnList() {
    const Touchable = Platform.OS === 'android' ? TouchableNativeFeedback : TouchableOpacity;
    return this.packetButtonConfig.map((data, index) => {
      return (
        <Touchable
          key={index}
          onPress={() => {
            console.log(data.packetSize);
            this.setState({ packetSize: data.packetSize }, ()=>this.resetTimer());
          }}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>{data.packetSize.toString()}</Text>
          </View>
        </Touchable>
      )
    })
  }

  extractChartData(data) {
    let result = [];
    data.map((item, index) => {
      result.push({
        'key': item.created_at,
        'x': index,
        'y': parseFloat(item.value)
      });
    });
    return [result];
  }

  configureListData(data) {
    let result = [];
    data.map((item, index) => {
      result.push({
        'key': index,
        'data': item.value + ' at ' + item.created_at
      });
    });
    return result;
  }

  _keyExtractor = (item, index) => item.key;

  render() {
    const { fetch } = this.props;

    let error, data = [[]], lastData = '', listData = [];
    if (fetch.failure) {
      error = <Text style={{backgroundColor: 'red'}}>{fetch.errorMessage}</Text>;
    } else if(fetch.data.length > 0) {
      data = this.extractChartData(fetch.data);
      listData = this.configureListData(fetch.data);
      let lastObject = fetch.data[0];
      let dateStr = lastObject.created_at.split('T');
      lastData = lastObject.value + '  at  ' + dateStr[0] + ' ' + dateStr[1].substring(0, dateStr[1].length-1);
    }
    let data_exist = false, listdata_exist = false;
    if(data[0].length > 0)
      data_exist = true;
    if(listData.length > 0)
      listdata_exist = true;
    
    let options = {
      width: this.state.width-50,
      height: this.state.height/2-this.state.height/10,
      color: '#2980B9',
      margin: {
        top: 10,
        left: 35,
        bottom: 30,
        right: 10
      },
      animate: {
        type: 'delayed',
        duration: 200
      },
      axisX: {
        showAxis: true,
        showLines: true,
        showLabels: true,
        showTicks: true,
        zeroAxis: false,
        orient: 'bottom',
        tickValues: [],
        labelFunction: ((v) => {
          //console.log(v);
          let dateStr = '', label = '';
          if(data[0][v]) {
            dateStr = data[0][v].key.split('T');
            //label = `${dateStr[0]}&#13;&#10;${dateStr[1].substring(0, dateStr[1].length-1)}`;
            label = dateStr[1].substring(0, dateStr[1].length-1);
          }
          return label;
        }),
        label: {
          fontFamily: 'Arial',
          fontSize: 8,
          fontWeight: true
        }
      },
      axisY: {
        showAxis: true,
        showLines: true,
        showLabels: true,
        showTicks: true,
        zeroAxis: false,
        orient: 'left',
        tickValues: [],
        label: {
          fontFamily: 'Arial',
          fontSize: 8,
          fontWeight: true
        }
      }
    }

    return (
      <View style={styles.container}>
        <StatusBar hidden={true} />
        <NavigationBar
          title={this.titleConfig}
          tintColor="#7d3e7f"
          leftButton={this.logoutButtonConfig}
          rightButton={this.rateButtonConfig}
        />
        
        <Modal isVisible={this.state.modalVisible}>
          <View style={styles.modalContent}> 
            <TextInput
              style={styles.rateText}
              defaultValue={this.state.rate}
              onChangeText={(text) => {
                this.setState({rate:text}, ()=>this.resetTimer());
                console.log('---------------rate----------', this.state.rate);
                //this.resetTimer();
              }}
              onEndEditing={() => {
                this.setModalVisible(false);
                this.resetTimer();
              }} 
            />
            <Button
              onPress={() => {
                this.setModalVisible(false);
                this.resetTimer();
              }}
              title="Set"
              color="#841584"
            />
          </View>
        </Modal>
        <ScrollView>
          <View style={{height:90}}>
            <View style={styles.row1}>
              <View style={{flex: 0.3, backgroundColor: '#e8c188', justifyContent: 'center'}}>
                <Text style={styles.label1}>
                  Feed
                </Text>
              </View>
              <View style={styles.rightColumn}>
                <SelectPicker name="feedName" defaultValue={this.state.feedName} onChange={this.onSelect} placeholder="Select Feed" options={this.feedOptions} />
              </View>            
            </View>

            <View style={{flexDirection: 'row', backgroundColor: '#e8c188', alignItems: 'center', justifyContent: 'center', paddingTop:5, paddingBottom:5}}>
              {this.packetBtnList()}
            </View>
          </View>

          <View style={{flex: 0.5, backgroundColor: '#deebef', marginTop: 10, marginBottom: 10}}>
            {error}
            {
              data_exist &&
              <StockLine data={data} options={options} xKey='x' yKey='y' />
            }
          </View>

          <View style={{height: 200}}>
            <View style={styles.row1}>
              <View style={{flex: 0.3, backgroundColor: '#e8c188'}}>
                <Text style={styles.label1}>
                  Last
                </Text>
              </View>
              <View style={styles.rightColumn}>
                <Text style={{textAlign: 'center'}}>
                  {lastData}
                </Text>
              </View>            
            </View>

            <View style={{flexDirection: 'row', flex: 1}}>
              <View style={{justifyContent: 'space-between', flexDirection: 'column', flex: 0.3, backgroundColor: '#e8c188'}}>
                <View style={{alignItems:'center'}}>
                  <Text style={{width: 100, textAlign: 'center', marginLeft: 5, marginRight: 5}}>
                    {data[0].length} data points retrieved
                  </Text>
                </View>              
                <View style={{alignItems: 'center', backgroundColor: '#76c1a3', padding: 5}}>
                  <Text style={{textAlign:'center'}}>
                    OFF / ON
                  </Text>
                  <Switch value={this.state.errorSwitch} onValueChange={this.onSwitchChange} onTintColor={'#7d3e7f'}/>
                </View>
              </View>
              <View style={{flex:0.7, backgroundColor: '#8f959b'}}>
                {
                  listdata_exist &&
                  <FlatList
                    data={listData}
                    keyExtractor={this._keyExtractor}
                    renderItem={({item, index}) => <Text key={index} style={{fontSize:12, marginLeft:10, marginTop:5}}>{item.data}</Text>}
                  />
                }              
              </View>

            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  modalContent: {
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 22,
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },

  button: Platform.select({
    ios: {
      backgroundColor: '#7d3e7f',
      width: 55,
      marginRight:5,
    },
    android: {
      elevation: 4,
      backgroundColor: '#7d3e7f',
      borderRadius: 2,
      marginRight: 5,
    },
  }),

  buttonText: Platform.select({
    ios: {
      color: 'white',
      textAlign: 'center',
      padding: 8,
      fontSize: 15,
    },
    android: {
      color: 'white',
      textAlign: 'center',
      padding: 8,
      fontWeight: '500',
    },
  }),

  rateText: {
    height: 30,
    borderColor: 'gray',
    borderWidth: 1,
    margin:20
  },

  rightColumn: {
    flex:0.7,
    backgroundColor: '#8f959b'
  },

  row1: {
    flexDirection: 'row',
    marginBottom: 5
  },

  label1: {
    textAlign: 'right',
    marginRight:5
  }
});

function mapStateToProps(state) {
  const { fetch, user } = state;

  return {
    fetch,
    user,
  }
}

// function mapDispatchToProps(dispatch) {
//   return {
//     actions: bindActionCreators(fetchActions, dispatch),
//   }
// }

const actions = {
  fetchRequest,
  logout
}

export default connect(mapStateToProps, actions)(HomeScreen);