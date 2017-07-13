'use strict';
import {createElement, Component} from 'rax';
import {View, Text,Touchable,Cell} from 'nuke';
import AddItem from '../component/additem';
import List from '../component/list';
import {connect} from 'rax-redux';
import {modifyItem,addItem} from '../redux/actions/todo'

class Todo extends Component {
    constructor(props) {
      super(props);
      this.state = {};
    }
    modifyItem = (item) =>{
        this.props.dispatch(modifyItem(item))
    }
    addItem =(obj) =>{
        this.props.dispatch(addItem(obj));
    }
    render() {
        return (
          <View style={styles.container}>
            <AddItem addItem={this.addItem}></AddItem>
            <List dataSource={this.props.todoMVC} modifyItem={this.modifyItem} style={styles.list}/>
            
          </View>
        );
    }
}

const styles = {
    container: {
        flex:1,
        width:750,
        paddingTop:20,
        // justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#EADEAD',
    },
    list:{
        marginTop:20,
        flex:1,
        justifyContent: 'flex-start',
    }
};


function mapStateToProps(state){
  return {
    todoMVC:state.todoReducer
  }
};
export default connect(mapStateToProps)(Todo);
