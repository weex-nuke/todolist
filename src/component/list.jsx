'use strict';
import { createElement, Component,findDOMNode,render } from 'rax';
import { View, Text, Modal,Touchable,ListView, Checkbox ,Transition,Cell} from 'nuke';

class List extends Component {
    constructor(props) {
        super(props);
        let doneCount = 0;
        this.state = {
            doneCount: doneCount
        };
        this.changeItemStatus = this.changeItemStatus.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        
    }
    changeItemStatus(item){
        let styles = { opacity: '0.5'};
        const box = findDOMNode('cell_'+item.id);
        Transition(box, styles, {
            timingFunction: 'ease-in',
            delay: 0,
            duration: 200
        }, ()=>{

            this.props.modifyItem(item);

        });
    }
    showDone = () =>{
        this.setState({
            showDone:!this.state.showDone
        })
    }
    render() {
        let {style,dataSource} = this.props;
        return (
            <ListView _autoWrapCell={false} style={[styles.listContainer,style]}>
                {
                    dataSource.toDoList.map((item,index)=>{
                        return (
                            <Cell key={`cell_${item.id}`} id={`cell_${item.id}`}>
                                <View id={`cell_item_${item.id}`} style={styles.cellItem} className="nuke-border-fix-1">
                                    <Checkbox key={`cell_checkbox_${item.id}`} checked={false} size="small" style={styles.checkbox} onChange={this.changeItemStatus.bind(this, item)} />

                                    <Text style={styles.content}>{item.content}</Text>
                                </View>
                            </Cell>
                        )
                    })
                }
                {
                    dataSource.doneList.length ?
                    <Cell>
                        <View style={styles.viewDone}>
                            <Touchable  style={styles.viewDoneBtn} onPress={this.showDone}>
                                <Text style={styles.viewDoneText}>查看 {dataSource.doneList.length} 个已完成任务</Text>
                            </Touchable>
                        </View>
                    </Cell>
                    :null
                }
                {
                    this.state.showDone && dataSource.doneList.map((item,index)=>{
                        return (
                            <Cell key={`cell_${item.id}`} id={`cell_${item.id}`}>
                                <Touchable id={`cell_item_${item.id}`} style={[styles.cellItem,styles.done]} className="nuke-border-fix-1">
                                    <Checkbox key={`cell_checkbox_${item.id}`} checked={true} size="small" style={styles.checkbox} checkedStyle={styles.checkbox_checked} />

                                    <Text style={[styles.content,styles.doneText]}>{item.content}</Text>
                                </Touchable>
                            </Cell>
                        )
                    })
                }
            </ListView>
        );
    }
}

const styles = {
    listContainer: {
        flex: 1,
        width: 710,
        alignItems:'center',
    },
    cellItem: {
        width: 710,
        minHeight: 70,
        backgroundColor: '#ffffff',
        justifyContent:'center',
        alignItems:'center',
        flexDirection: 'row',
        borderRadius:12,
        marginBottom:4,
    },
    content: {
        flex:1,
        fontSize: 28,
        lines:1,
        textOverflow:'ellipsis',
        [`-webkit-line-clamp`]: '1',
        whiteSpace:'nowrap',
        overflow: 'hidden'
    },
    
    checkbox:{
        borderRadius:6,
        backgroundColor:'#f8f8f8'

    },
    checkbox_checked:{
        color:'#666666'
    },
    done:{
        backgroundColor: 'rgba(255,255,255,0.4)',
    },
    doneText:{
        textDecoration:'line-through',
        color:'#666666',
    },
    statusText: {
        color: '#8A8A8A',
        fontSize: 24
    },
    shortCell:{
        flexDirection:'row',
        justifyContent:'center',
    },
    viewDone:{
        justifyContent:'center',
        alignItems:'center',
        width:710,
        margin:10,
        
        
    },
    viewDoneBtn:{
        width:300,
        height: 60,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:12,
        backgroundColor: 'rgba(0,0,0,0.4)',
        
        
    },
    viewDoneText:{
        color: '#eeeeee',
        fontSize: 24,
        
    }
};

export default List;
