/* eslint-disable no-undef */
import React, {useState, useEffect, createRef} from 'react';
// import ReactDOM from 'react-dom';
import Graphin from '@antv/graphin';
import { Toolbar, ContextMenu } from '@antv/graphin-components';
import LayoutSelector from './LayoutSelector';
import { message, Input } from 'antd';
import { DeleteOutlined, DeploymentUnitOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';
import '@antv/graphin/dist/index.css'; // 引入Graphin CSS
import '@antv/graphin-components/dist/index.css'; // 引入Graphin CSS
import axios from 'axios';

const initData = {
    nodes: [],
    edges: []
}

function CanvasMain() {

    // customize the details of nodes and edges
    const transform = (data) => {
        const nodes = (nodes) => {
            return nodes.map(node => {
                return {
                    id: node.id,
                    label: node.label,
                    shape: 'CircleNode',
                    style: {
                        nodeSize: 50,
                        primaryColor: '#1890FF',
                        icon: 'file-text',
                    },
                    data: node,
                };
            });
        };
        const edges = (edges) => {
            return edges;
        };
        return {
            nodes: nodes(data.nodes),
            edges: edges(data.edges),
        };
    };

    const [state, setState] = useState({
        selected: [],
        data: initData,
    });

    const { data, selected } = state;
    const graphRef = createRef(null);
    useEffect(() => {
        const { graph } = graphRef.current;
        const onNodeClick = e => {
            console.log('node:click', e);
            setState({
                ...state,
                selected: [e.item.get('model')],
            });
        };
        graph.on('node:click', onNodeClick);
        return () => {
            graph.off('node:click', onNodeClick);
        };
    // eslint-disable-next-line
    }, [state]);

    // remove duplicates
    function uniqueList(arr) {
        let unique = {};
        arr.forEach(function(item) {
            // keys won't duplicate
            unique[JSON.stringify(item)] = item;
        })
        arr = Object.keys(unique).map(function(u) { 
            // Object.keys()返回对象的所有键值组成的数组，map方法返回遍历结果组成的数组.将unique对象的键名还原成对象数组
            return JSON.parse(u);
        })
        return arr;
      }

    // expand the selected node
    const onExpand = () => {
        if (selected.length === 0) {
            message.info('请先选中/圈选节点');
            return;
        }
        const selected_id = selected[0]['id']
        let data = {'id': selected_id}
        axios.post('http://166.111.5.187:5000/api/expand_node_by_id', data)
        .then((res) => {
            // console.log('fetch data successfully:' + JSON.stringify(res))
            const expandNodes = res.data.data.nodes;
            const expandEdges = res.data.data.edges;

            setState({
                ...state,
                data: {
                    nodes: uniqueList([...state.data.nodes, ...expandNodes]),
                    edges: uniqueList([...state.data.edges, ...expandEdges]),
                },
            });
         })
        .catch((error)=>{
            console.log('fetch data failed: ' + error)
            message.error('节点扩散失败')
        })
    };
    
    // fold the seleced node
    const onFold = () => {
        if (selected.length === 0) {
            message.info('请先选中/圈选节点');
            return;
        }

        const selected_id = selected[0]['id'];
        const filtered_edges = state.data.edges.filter(item => item.source === selected_id);
        // eslint-disable-next-line
        const rest_edges = state.data.edges.filter(item => item.source != selected_id);
        var removed_nodes = [];
        filtered_edges.forEach(
            function(edge) {
                if (rest_edges.filter(item => item.source === edge.target || item.target === edge.target).length === 0) {
                    removed_nodes.push(edge.target);
                } 
            }
        );

        setState({
            ...state,
            data: {
                // eslint-disable-next-line
                nodes: state.data.nodes.filter(item => !removed_nodes.includes(item.id)),
                edges: rest_edges,
            },
        });
        
    };

    // remove the selected ndoe
    const onDelete = () => {
        if (selected.length === 0) {
            message.info('请先选中/圈选节点');
            return;
        }
        const removeId = selected[0]['id'];

        setState({
            ...state,
            data: {
                // eslint-disable-next-line
                nodes: state.data.nodes.filter(item => item.id != removeId),
                // eslint-disable-next-line
                edges: state.data.edges.filter(item => item.source != removeId && item.target != removeId),
            },
        });
    };

    // remove all nodes
    const onDeleteAll = () => {
        setState({
            ...state,
            data: {
                nodes: [],
                edges: []
            }
        })
    };

    const [layout, changeLayout] = useState({ name: "force", options: {} });

    const { Search } = Input;
    const [searchVaule, setSearchVaule] = useState('');
    const getValue = e => {
        setSearchVaule(e.target.value);
    };

    // add new node
    const onSearch = value => {
        let dataName = {'name': value};
        setSearchVaule('');
        axios.post('http://166.111.5.187:5000/api/add_node_by_name', dataName)
        .then((res) => {
            const newNodes = res.data.data.nodes;

            let dataID = {'id': newNodes[0].id}
            axios.post('http://166.111.5.187:5000/api/expand_node_by_id', dataID)
            .then((res) => {
                const expandNodes = res.data.data.nodes;
                const expandEdges = res.data.data.edges;

                setState({
                    ...state,
                    data: {
                        // 还需要对Node和Edge去重，这里暂不考虑
                        nodes: uniqueList([...state.data.nodes, ...newNodes, ...expandNodes]),
                        edges: uniqueList([...state.data.edges, ...expandEdges]),
                    },
                });
            })
            .catch((error)=>{
                console.log('fetch data failed: ' + error)
                message.error('节点扩散失败')

                setState({
                    ...state,
                    data: {
                        // 还需要对Node和Edge去重，这里暂不考虑
                        nodes: uniqueList([...state.data.nodes, ...newNodes]),
                        edges: state.data.edges,
                    },
                });
            })
         })
        .catch((error)=>{
            console.log('fetch data failed: ' + error)
            message.error('无法添加此实体，可能名称有误')
        });
    }

    // context menu items when right click
    const options = [
        {
            key: 'expandNode',
            title: '展开节点',
            visible: true,
            iconType: <DeploymentUnitOutlined />,
            onClick: onExpand
        },
        {
            key: 'foldNode',
            title: '折叠节点',
            visible: true,
            iconType: <DeploymentUnitOutlined />,
            onClick: onFold
        },
        {
            key: 'deleteNode',
            title: '删除节点',
            visible: true,
            iconType: <DeleteOutlined />,
            onClick: onDelete
        },
        {
            key: 'clearCanvas',
            title: '清空画布',
            visible: true,
            iconType: <DeleteOutlined />,
            onClick: onDeleteAll
        }
    ]

    return (
        <div className="Graphin-Canvas">
            <h1>
                诗歌维基知识图谱可视化展示
            </h1>
            <h4>
                （先单击选中目标节点，再右键点击选中节点展开菜单）
            </h4>
            <Graphin
                data={transform(data)}
                options={{autoPolyEdge: true}}
                layout={layout}
                ref={graphRef}
            >
                <Search 
                    placeholder="请输入要添加实体名称" 
                    enterButton="添加实体" size="large" 
                    value={searchVaule}
                    onChange={getValue}
                    onSearch={onSearch} 
                    style={{ width: 400 }}
                />
                <LayoutSelector
                    value={layout.name}
                    onChange={value => {
                        changeLayout({
                            ...layout,
                            name: value
                        });
                    }}
                />
                <Toolbar />
                <ContextMenu options={options} />
            </Graphin>
        </div>
    );
};

export default CanvasMain;