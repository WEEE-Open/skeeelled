from json import JSONEncoder as BaseJSONEncoder


class JSONEncoder(BaseJSONEncoder):
    def default(self, o):
        if isinstance(o, (ObjectId, DBRef)):
            return str(o)
        return json.JSONEncoder.default(self, o)
