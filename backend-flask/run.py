import json
from flask import Flask, g, request, abort, Response
from flask_cors import CORS, cross_origin
from mockAPI import string2id, id2string, explore

app = Flask(__name__)


app.config.update({
        'SECRET_KEY': 'TESTING-ANURAG',
        'TESTING': True,
        'DEBUG': True,
    })

cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route('/')
def index():
    return "Hello World!"

# cross origin REST APIs

# return a node's info given a string
@app.route('/api/add_node_by_name', methods=['post'])
@cross_origin()
def add_node_by_name():
    name = request.json.get('name')
    entity_id = string2id(name)
    if entity_id == None:
        res = Response('错误: 实体未在知识库中找到')
        abort(res)
    else:
        main_name = id2string(entity_id)
        return json.dumps({
            'data': {
                'nodes': [
                    {
                        'id': str(entity_id),
                        'label': main_name,
                        'data': {},
                    }
                ]
            }
        })

# return the nodes and edges info connected to the given node
@app.route('/api/expand_node_by_id', methods=['post'])
@cross_origin()
def expand_node_by_id():
    try:
        entity_id = int(request.json.get('id'))
        edges_list = explore(entity_id)
        nodes = []
        edges = []
        for edge in edges_list:
            target_id = edge[0]
            main_name = id2string(target_id)
            nodes.append(
                {
                    'id': str(target_id),
                    'label': main_name,
                    'data': {}
                }
            )
            weight = edge[1]
            edges.append(
                {
                    'source': str(entity_id),
                    'target': str(target_id),
                    'label': str(weight),
                    'spring': weight,
                    'data': {}
                }
            )
        return json.dumps({
            'data': {
                'nodes': nodes,
                'edges': edges
            }
        })
    except:
        res = Response('错误: 节点扩散失败')
        abort(res)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, threaded=True, debug=True)