name2id_dict = {
    "刘备" : 1,
    "关羽" : 2,
    "张飞" : 3
}

id2name_dict = {
    1 : "刘备",
    2 : "关羽",
    3 : "张飞"
}

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