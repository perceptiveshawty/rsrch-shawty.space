import os
from datetime import datetime, date
from tqdm import tqdm
from dotenv import load_dotenv, set_key
from pyzotero.zotero import Zotero
from supabase import create_client

load_dotenv()
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")
zotero_key = os.getenv("ZOTERO_KEY")
zotero_id = os.getenv("ZOTERO_ID")
papers_database_id = os.getenv("PAPERS_DATABASE_ID")
links_database_id = os.getenv("LINKS_DATABASE_ID")
last_update_date = datetime.fromisoformat(os.getenv("LAST_UPDATE_DATE"))

supabase = create_client(supabase_url, supabase_key)
zotero = Zotero(library_id = zotero_id, library_type = 'user', api_key = zotero_key)

def insert_data(batch: list[dict], table_id: str):
    for data in tqdm(batch):
        response = supabase.table(table_id).insert(data).execute()
        print(response)

if __name__ == '__main__':
    links, papers = [], []

    items = zotero.top(limit=50)
    for item in tqdm(items):

        item_timestamp = datetime.fromisoformat(item['data']['dateAdded'].split('T')[0])
        if item_timestamp < last_update_date:
            continue

        if item['data']['itemType'] in {'preprint', 'conferencePaper', 'journalArticle', 'report'}:
            papers.append({
                'url': item['data']['url'],
                'title': item['data']['title'],
                'authors': ', '.join(['%s %s' % (author['firstName'], author['lastName']) for author in item['data']['creators']]).strip().strip(','),
                'abstract': item['data']['abstractNote'],
                'created_at': item_timestamp.strftime('%Y-%m-%d')
            })

        elif item['data']['itemType'] in {'webpage', 'blogPost'}:
            links.append({
                'url': item['data']['url'],
                'title': item['data']['title'],
                'created_at': item_timestamp.strftime('%Y-%m-%d')
            })

    insert_data(links, links_database_id)
    insert_data(papers, papers_database_id)

    set_key('.env', 'LAST_UPDATE_DATE', date.today().strftime('%Y-%m-%d'))

