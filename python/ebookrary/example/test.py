import json
from ebooklib import epub
import urllib.request
import mobi

try:
    book = epub.read_epub('book1.epub')
    f=book.get_metadata('OPF','cover')[0][1]['content']
    g=book.get_item_with_id(f)
    filecnt=g.get_content()
    title=book.get_metadata('DC','title')[0][0]
    auth=book.get_metadata('DC','creator')[0][0]
    date=book.get_metadata('DC','date')[1][0]
    isbn=book.get_metadata('DC','identifier')[0][0]
    with urllib.request.urlopen(f"https://www.googleapis.com/books/v1/volumes?q=isbn:{isbn}") as resp:
        googleMeta=resp
        googleJson=json.load(googleMeta)
        print(googleJson["items"][0])
except Exception as e:
    print(f"exception occoured. :-( {e}")

mobiObj = mobi.Mobi('book6.mobi')
mobiObj.parse()
import pprint
pprint.pprint(mobiObj.config)

print(f'Records: {len(mobiObj.records)}')
with open("out.png", "wb") as f:
    f.write(mobiObj.readRecord((mobiObj.config['mobi']['First Image index']+2)*2,disable_compression=True))
    f.close()

#print(mobiObj.readImageRecord(0))