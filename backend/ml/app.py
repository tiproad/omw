import logging
import os

from dotenv import load_dotenv
from flask import Flask, jsonify, request

load_dotenv()

from functions import calc_idx, con_gps

app = Flask(__name__)
app.config.update({"RESULTS_FOLDERS": "results", "DATA_FOLDERS": "data"})


@app.route("/", methods=["GET"])
def health_check():
    logging.info("Health check ping received")
    return jsonify({"status": "healthy"}), 200


@app.route("/api/saferoutes", methods=["POST"])
def safe_routes():
    data = request.get_json()
    orig = data["origin"]
    dest = data["dest"]
    lat1, lng1 = con_gps(orig)
    lat2, lng2 = con_gps(dest)
    idx, loc = calc_idx(lat1, lng1, lat2, lng2)
    res = [[lat1, lng1]] + [[loc[i, 0], loc[i, 1]] for i in idx] + [[lat2, lng2]]
    return jsonify(dict(res=res)), 200


if __name__ == "__main__":
    logging.info("Starting server...")
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)), debug=True)
