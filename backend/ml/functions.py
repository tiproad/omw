import ast
import os
import uuid
from datetime import datetime
from pathlib import Path

import googlemaps
import numpy as np

gmap = googlemaps.Client(key=os.environ["GOOGLE_API_KEY"])


def generate_new_results():
    """
    The default function for generating a new unique version string when saving a new
    bento or a new model
    """
    date_string = datetime.now().strftime("%Y%m%d")
    random_hash = uuid.uuid4().hex[:6].upper()

    # Example output: '20210910_D246ED'
    return f"{date_string}_{random_hash}"


def get_weights(directory="./models"):
    weights = []
    for f in Path(directory).iterdir():
        with f.open("r") as _f:
            v1, v2, v3 = _f.read().split("\n", maxsplit=2)
            v2 = [float(x) for x in v2.strip("][").split(",")]
            v3 = v3.replace("\n", "").strip(" ").replace(" ", ",").replace(",,", ",")
            weights.append({"w": float(v1), "m": v2, "s": ast.literal_eval(v3)})
    return weights


def mvg(w, m, s, x):
    # https://en.wikipedia.org/wiki/Matrix_normal_distribution
    a = 1.0 / (np.sqrt(((2 * np.pi) ** 2) * np.linalg.det(s)))
    b = x - m
    c = np.dot(np.dot(b.T, np.linalg.inv(s)), b)
    return w * a * np.exp(-0.5 * c)


def haversine_dist(lat1, lng1, lat2, lng2, r=6371):
    lat1, lng1, lat2, lng2 = map(np.radians, [lat1, lng1, lat2, lng2])
    dlng = lng2 - lng1
    dlat = lat2 - lat1
    a = np.sin(dlat / 2) ** 2 + np.cos(lat1) * np.cos(lat2) * np.sin(dlng / 2) ** 2
    return 2 * r * np.arcsin(np.sqrt(a))


def con_gps(addr: str):
    res = gmap.geocode(addr)[0]
    lat, lng = res["geometry"]["location"].values()
    return float(lat), float(lng)


def check_path(path_list, dist_list):
    l = np.argsort(dist_list)[0]
    if len(dist_list) == 1 and dist_list[0] in path_list:
        return path_list
    else:
        if l in dist_list:
            return check_path(path_list, np.argsort(dist_list)[1:])
        else:
            path_list.append(l)
            return path_list


def calc_midpoints(lat1, lng1, lat2, lng2):
    return (lat1 + lat2) / 2, (lng1 + lng2) / 2


def calc_idx(lat1, lng1, lat2, lng2, *, maps: "googlemaps.Client" = gmap):
    # setup location matrix
    idx = []
    rep = 3

    weights = get_weights()
    mid_lat, mid_lng = calc_midpoints(lat1, lng1, lat2, lng2)
    res = [
        (i["geometry"]["location"]["lat"], i["geometry"]["location"]["lng"])
        for i in maps.reverse_geocode((mid_lat, mid_lng))
    ]
    loc = np.zeros((len(res) + 2, 2))
    loc[0, 0], loc[0, 1] = lat1, lng1
    loc[1:-1, :] = res[:]
    loc[-1, 0], loc[-1, 1] = lat2, lng2

    num = np.shape(loc)[0]
    g = np.zeros(num)
    d = np.zeros((num, num))

    for i, l in enumerate(loc):
        s = 0
        for c in weights:
            globals()[f"g{i}"] = mvg(x=l, **c)
            s += globals()[f"g{i}"]
        g[i] = s
        for j in range(0, np.shape(loc)[0]):
            d[i, j] = haversine_dist(l[0], l[1], loc[j, 0], loc[j, 1])
            if d[i, j] == 0:
                d[i, j] = np.nan

    d_sort = np.argsort(d, axis=1)
    g3 = np.zeros((num, rep))
    for j in range(0, num):
        g3[j, :] = g[d_sort[j, 0:rep]]

    path = []
    for M in g3:
        path = check_path(path, M)
    for m in path:
        for n in range(0, num):
            if g3[m][m] == g[n]:
                idx.append(n)
                break
    return set(idx), loc
