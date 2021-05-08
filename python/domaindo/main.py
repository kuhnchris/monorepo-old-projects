from flask import Flask
from flask import render_template
import docker
client = docker.APIClient(base_url='unix://var/run/docker.sock')
app = Flask(__name__)

@app.route('/')
def index():
    docker_ctx = client.version()
    docker_ctx_cnt = client.containers()
    ctx = {"docker": docker_ctx, "containers": docker_ctx_cnt}
    print(ctx)
    return render_template('index.html', context=ctx)

@app.route('/hello_world')
def hello_world():
    return 'Hello, World!'