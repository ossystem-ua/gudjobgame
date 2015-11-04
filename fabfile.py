import os
from fabric.api import task, run, local
from fabric.context_managers import cd
from fabric.state import env

production_dir = '/var/www/businessshark'
server_dir = production_dir + '/server'

client_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'client')
print(client_dir)

host = 's.troinin@192.168.10.40'

env.hosts = [host]
env.password = '1'


@task
def copy_key():
    local('ssh-copy-id ' + host)


@task
def build_client():
    local("cd client && NODE_ENV=production gulp web")


@task
def build_admin():
    local("cd admin && NODE_ENV=production gulp web")


@task
def start_server():
    with cd(server_dir):
        run('pm2 start app.js --name "api"')


@task
def deploy():
    build_client()
    local('hg add')
    local('hg commit -m "Deploy"')
    local('hg push')
    with cd(production_dir):
        run('sudo npm i')
    with cd(server_dir):
        run('pm2 restart api')


@task
def prepare_client_app():
    build_client()
    local('cp -R %s/* %s' % (os.path.join(client_dir, 'web'),
                             os.path.join(*[client_dir, 'app', 'www'])))
    with cd(os.path.join(client_dir, 'app')):
        local(
            'cd %s && cordova prepare android' % os.path.join(client_dir,
                                                              'app'))
        # local('cd %s && ./cordova/build --release' % os.path.join(
        #     *[client_dir, 'app', 'platforms', 'android']))
