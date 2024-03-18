import os
from datetime import datetime
from tqdm import tqdm
from dotenv import load_dotenv
from pyzotero.zotero import Zotero
from supabase import create_client

load_dotenv()
supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")
zotero_key = os.getenv("ZOTERO_KEY")
zotero_id = os.getenv("ZOTERO_ID")
papers_database_id = os.getenv("PAPERS_DATABASE_ID")
links_database_id = os.getenv("LINKS_DATABASE_ID")

supabase = create_client(supabase_url, supabase_key)
zotero = Zotero(library_id = zotero_id, library_type = 'user', api_key = zotero_key)

def insert_data(batch: list[dict], table_id: str):
    for data in tqdm(batch):
        response = supabase.table(table_id).insert(data).execute()
        print(response)

if __name__ == '__main__':
    links, papers = [], []

    items = zotero.top()
    for item in tqdm(items):
        if item['data']['itemType'] in {'preprint', 'conferencePaper', 'journalArticle', 'report'}:
            papers.append({
                'url': item['data']['url'],
                'title': item['data']['title'],
                'authors': ', '.join(['%s %s' % (author['firstName'], author['lastName']) for author in item['data']['creators']]).strip().strip(','),
                'abstract': item['data']['abstractNote'],
                'created_at': datetime.fromisoformat(item['data']['dateAdded'].split('T')[0]).strftime('%Y-%m-%d')
            })
        elif item['data']['itemType'] == 'webpage':
            links.append({
                'url': item['data']['url'],
                'title': item['data']['title'],
                'created_at': datetime.fromisoformat(item['data']['dateAdded'].split('T')[0]).strftime('%Y-%m-%d')
            })

    insert_data(links, links_database_id)
    insert_data(papers, papers_database_id)