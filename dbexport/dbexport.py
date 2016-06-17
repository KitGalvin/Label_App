#!/usr/bin/python3

from pymongo import MongoClient
import json
import sys

def main():
    try:
        client = MongoClient()
        db = client.labels
        labels = db.labels
    except:
        print('Error: Unable to access database. Is Mongo running?', file=sys.stderr)
        return 1
        
    export = list()

    '''
    http://stackoverflow.com/questions/24079660/find-documents-where-value-is-not-null
    http://stackoverflow.com/questions/12345387/removing-id-element-from-pymongo-results
    '''
    for pesticide in labels.find({'product': {"$ne" : ''}}, {'_id': False}):
        export.append(pesticide)

    print(json.dumps(export, sort_keys=True))

if __name__ == "__main__":
    main()
