import { useState, useEffect } from 'react';

function formatDate(dateString) {
  const date = new Date(dateString);
  const options = {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  };
  return date.toLocaleDateString('en-US', options);
}

function Entry({ title, created, link, authors }) {
  const formattedDate = formatDate(created);

  return (
    <a href={link} target="_blank" className="block py-3 px-6 hover:bg-gray-50">
      <div className="flex justify-between items-start gap-6">
        <div className="flex-1">
          <strong className="font-normal text-lg hover:underline leading-snug">{title}</strong>
          {authors && <p className="text-sm text-gray-600 mt-1.5">{authors}</p>}
        </div>
        <span className="text-sm text-gray-600 whitespace-nowrap font-mono">{formattedDate}</span>
      </div>
    </a>
  );
}

export function Entries({ database, supabase }) {
  const [entries, setEntries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  async function fetchPosts() {
    const cachedEntries = sessionStorage.getItem(database);
    if (cachedEntries) {
      setEntries(JSON.parse(cachedEntries));
      return;
    }

    const { data } = await supabase
      .from(database)
      .select('*')
      .order('created_at', { ascending: false });

    setEntries(data || []);
    sessionStorage.setItem(database, JSON.stringify(data));
  }

  useEffect(() => {
    fetchPosts();
  }, [database]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const handleShuffleClick = () => {
    if (filteredEntries.length > 0) {
      const randomEntry = filteredEntries[Math.floor(Math.random() * filteredEntries.length)];
      const modifiedUrl = randomEntry.url.replace(/pdf(?=.)/, "abs").replace(/v\d+$/, "");
      window.open(modifiedUrl, '_blank').focus();
    }
  };

  const filteredEntries = entries.filter(entry => {
    const normalizedTitle = entry.title?.replace(/\s+/g, '').toLowerCase();
    const normalizedLink = entry.url?.replace(/\s+/g, '').toLowerCase();
    const normalizedAuthors = entry.authors?.replace(/\s+/g, '').toLowerCase();
    const normalizedSearchTerm = searchTerm.replace(/\s+/g, '').toLowerCase();
    return normalizedTitle?.includes(normalizedSearchTerm) ||
           normalizedLink?.includes(normalizedSearchTerm) ||
           normalizedAuthors?.includes(normalizedSearchTerm);
  });

  return (
    <div className="p-6">
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search"
          onChange={handleSearchChange}
          className="flex-1 p-2 border border-black bg-white"
        />
        <button
          onClick={handleShuffleClick}
          className="px-4 py-2 border border-black hover:bg-gray-50 flex items-center gap-2"
        >
          Shuffle
          <svg width="18" height="18" viewBox="0 0 92 92">
            <path d="M68.2 30C64 30 53.5 40.4 45.8 47.9 34.2 59.1 23.2 70 14.4 70H9c-2.2 0-4-1.8-4-4s1.8-4 4-4h5.4c5.6 0 16.8-11.2 25.8-19.9 11-10.6 20.5-20.1 28-20.1h5.2l-5.5-5.3c-1.6-1.6-1.6-3.9 0-5.5s4.1-1.6 5.7 0l12.3 12.3c.8.8 1.2 1.8 1.2 2.8 0 1.1-.4 2.1-1.2 2.8L73.5 41.4c-.8.8-1.8 1.1-2.8 1.1-1 0-2-.4-2.8-1.2-1.6-1.6-1.6-4.2 0-5.7l5.5-5.6h-5.2zm5.3 20.6c-1.6-1.6-4.1-1.6-5.7 0-1.6 1.6-1.6 4.2 0 5.8l5.5 5.6h-5.2c-3.3 0-8.8-4.9-14.2-9.9-1.6-1.5-4.1-1.5-5.7.1-1.5 1.6-1.4 4.3.2 5.8 8.4 7.7 14 12 19.8 12h5.2l-5.5 5.3c-1.6 1.6-1.6 4 0 5.6.8.8 1.8 1.1 2.8 1.1 1 0 2-.4 2.8-1.2l12.3-12.3c.8-.8 1.2-1.8 1.2-2.8 0-1.1-.4-2.1-1.2-2.8L73.5 50.6zM9 30h5.4c4.2 0 10.5 5.4 15.5 9.9.8.7 1.7 1.1 2.7 1.1 1.1 0 2.2-.4 3-1.3 1.5-1.6 1.4-4.3-.3-5.8-7.8-7.1-14.4-12-20.9-12H9c-2.2 0-4 1.8-4 4S6.8 30 9 30z"></path>
          </svg>
        </button>
      </div>
      <div className="divide-y divide-gray-200">
        {filteredEntries.map((entry, index) => (
          <Entry
            key={index}
            title={entry.title}
            created={entry.created_at}
            link={entry.url.replace(/pdf(?=.)/, "abs").replace(/v\d+$/, "")}
            authors={entry.authors}
          />
        ))}
      </div>
    </div>
  );
}