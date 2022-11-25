from typing import List


def responses(*codes: int):
    return {c: {} for c in codes}


def get_by_path(__obj: List, path: str, default=None, sep: str = "."):
    if not path:
        return __obj
    if not hasattr(__obj, "__getitem__"):
        return default
    path = path.split(sep)
    k = path.pop(0)
    try:
        k = int(k)
    except ValueError:
        pass
    return get_by_path(__obj.__getitem__(k), ".".join(path))
