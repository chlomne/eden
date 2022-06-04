#!/usr/bin/python3
import requests
import json
import utils
import os

utils.load_env()

SUPABASE_TOKEN = os.getenv("SUPABASE_TOKEN")
ROOT = "https://yhnhyvjuksphwndbgwtq.supabase.co/storage/v1/object/list/-"

data = {
  'prefix': '',
  'limit': 100, 
  'offset': 0, 
  'sortBy': {
    'column': 'name',
    'order': 'asc'
  }, 
}

response = requests.post(f'{ROOT}', json=data, headers={'Content-Type': 'application/json', 'Authorization': f'Bearer {SUPABASE_TOKEN}'})

print(json.dumps(response.json(), indent=4))
