'use strict';
import {createElement, Component} from 'rax';
import {View, Text,Modal,Button,Env,Input} from 'nuke';
// import Input from 'nuke-input';
const {isWeb} = Env;

class AddItem extends Component {
    constructor(props) {
      super(props);

      this.state = {
          text:''
      };
    }
    changeInput = (e) =>{
        this.setState({
            text:e.value || e.target.value,
        })
        
    }
    /**
     * hack onReturn event for web
     * @param  {[type]} e [description]
     * @return {[type]}   [description]
     */
    keyUp = (e) =>{
        
        if(isWeb && e.keyCode === 13){
            this.addItem();
        }
    }
    clearInput(){
        // this.setState({
        //     input:''
        // })
    }
    addItem (){

        this.setState({
            input:this.state.text,
            
        })
        if(this.state.text.length == 0){
            Modal.toast('哎~空的看不到吗');
        }else{
           
            this.props.addItem({
                content:this.state.text,
            });
            this.setState({
                text:'',
                input:''
            })

            
        }
    }
    render() {
        return (
          <View style={styles.container}>
            <Input autoFocus style={styles.input} value={this.state.input} returnKeyType="next" onKeyUp={this.keyUp.bind(this)} placeholder="添加一个任务" onFocus={this.clearInput.bind(this)} onReturn={this.addItem.bind(this)} onInput={this.changeInput} placeholderColor="#eeeeee" />
          </View>
        );
    }
}

const styles = {
    container: {
        height:90,
        width:750,
        justifyContent:'center',
        flexDirection:'row'
    },
    input:{
        width:710,
        height:80,
        fontSize:28,
        backgroundColor: 'rgba(0,0,0,0.4)',
        borderColor:'transparent',
        color:'#ffffff',
        borderRadius:10
    },
    button:{
        width:100,
        height:80,
        marginLeft:10
    }
};

export default AddItem;
