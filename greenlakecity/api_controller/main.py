import os
import json
import flask
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "*"}})

DATA_DIRECTORY = '/app/data'

@app.errorhandler(404)
def url_not_found(e):
    return json.dumps({'code': '404', 'desc': 'Url not found'}), 404

@app.route('/list')
def get_list():
    try:
        datasets = {}
        for filename in os.listdir(DATA_DIRECTORY):
            with open(f"{DATA_DIRECTORY}/{filename}", 'r') as f:
                data = json.load(f)
            datasets[os.path.splitext(filename)[0]] = data
        items = []
        for dataset in datasets:
            for key in datasets[dataset]:
                items.append(key)
        return json.dumps(items)
    except:
        return json.dumps({'code': '666', 'desc': 'Found unexpected error'}), 666

@app.route('/item/<code>')
def get_item(code):
    try:
        datasets = {}
        for filename in os.listdir(DATA_DIRECTORY):
            with open(f"{DATA_DIRECTORY}/{filename}", 'r') as f:
                data = json.load(f)
            datasets[os.path.splitext(filename)[0]] = data
        for dataset in datasets:
            for key in datasets[dataset]:
                if (key == code):
                    return json.dumps({key: datasets[dataset][key]})
        return json.dumps({'code': '001', 'desc': 'Not found data'}), 1
    except:
        return json.dumps({'code': '666', 'desc': 'Found unexpected error'}), 666

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8081)
