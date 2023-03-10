from datetime import datetime
from json import JSONEncoder as BaseJSONEncoder

from bson import DBRef, ObjectId


class JSONEncoder(BaseJSONEncoder):
    def default(self, o):
        if isinstance(o, (ObjectId, DBRef, datetime)):
            return str(o)
        return BaseJSONEncoder.default(self, o)
