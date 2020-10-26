# Wiki Knowledge Graph with Probabilistic Links Visualization Demo

This is a Visualization Demo of Chinese Poems Wiki Knowledge Graph, which consists of a Flask backend, a React frontend and the APIs from the KG.

## Backend - Flask 

* A simple Python backend server which runs the API python scripts provided by the KG.
* There are three main functions of the API:
    ``` python
    # give a name, return its main-name's id if the entity is in our KB
    def string2id(name):
        return 'the id of the given name'
    # the reverse function of the previous one
    def id2string(entity_id):
        return 'the main-name of the given entity id'
    # give the id of a entity, all linked entites from this entity id
    def explore(entity_id):
        return '[(linked_entity_id, probability) of all the linked entities from this id]
    ```
* We created a MockAPI of 3 entities and 6 edges for basic testing:
    ``` python
    def string2id(name):
        if name2id_dict.get(name) == None:
            print("This name is not found in KB")
            return None
        else:
            return name2id_dict.get(name)

    def id2string(entity_id):
        if id2name_dict.get(entity_id) == None:
            print("This ID is not found in KB")
            return None
        else:
            return id2name_dict.get(entity_id)

    def explore(entity_id):
        if entity_id == 1:
            return [
                (2, 0.9),
                (3, 0.9)
            ]
        elif entity_id == 2:
            return [
                (1, 0.9),
                (3, 0.8)
            ]
        elif entity_id == 3:
            return [
                (1, 0.9),
                (2, 0.8)
            ]
    ```

## Frontend - React

* Create the React APP with the 'create-react-app' tool.
* This Demo is based on [Antv-Graphin](https://github.com/antvis/Graphin).

## How to run

* Install Flask for your Python env (e.g. `pip install flask`)
* Run Python backend dev server: `python run.py`
* Install NodeJs
* Use `npm install` or `yarn install` to install dependencies
* Use `npm start` or `yarn start` to run frontend dev server
* Use `CHOKIDAR_USEPOLLING=1 npm start` to avoid the watchers limit issue
