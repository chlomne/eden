#!/usr/bin/python3
import random
import requests
import mimetypes
import string
import sys
import json
import utils
import os

utils.load_env()

SUPABASE_TOKEN = os.getenv("SUPABASE_TOKEN")
ROOT = "https://yhnhyvjuksphwndbgwtq.supabase.co/storage/v1/object/-/"

file_path = sys.argv[1]

def generate_id(length: int):
  return ''.join(random.choices(string.ascii_lowercase + string.digits, k=length))

mimetype, encoding = mimetypes.guess_type(file_path)

if mimetype is None:
  mimetype = 'application/octet-stream'

extension = mimetypes.guess_extension(mimetype)

with open(file_path, 'rb') as file:
  file_content = file.read()
  response = requests.post(f'{ROOT}/{generate_id(6)}{extension}', data=file_content, headers={'Content-Type': mimetype, 'Cache-Control': 'max-age=86400', 'Authorization': f'Bearer {SUPABASE_TOKEN}'})
  
  print(json.dumps(response.json(), indent=4))