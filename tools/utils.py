import os
import pathlib

def load_env():
  dotenv_path = pathlib.Path(pathlib.Path(__file__).parent.absolute(), '..', '.env')
  with open(dotenv_path, 'r') as file:
    data = file.read()
    env_vars = dict(line.split('=') for line in data.splitlines())
    os.environ.update(env_vars)
