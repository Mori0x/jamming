import './App.css';
import SearchBar from './components/SearchBar/SearchBar';
import SearchResults from './components/SearchResults/SearchResults';
import Playlist from './components/Playlist/Playlist';
import Spotify from './utils/Spotify';
import React, {useState} from 'react';
import PlaylistList from './components/PlaylistList/PlaylistList';


function App() {
  const [searchedTracks, setSearchedTracks] = useState([]);
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [playlistNames, setplaylistNames] = useState([]);
  const [playlistName, setplaylistName] = useState(null);
  const [tracksToDelete, setTracksToDelete] = useState([]);
  const [loading, setLoading] = useState(false);


  async function SearchSpotify(name) {
    try {
      setLoading(true);
      const results = await Spotify.search(name);
      const names = await Spotify.getPlaylists();
      setplaylistNames(names);
      setSearchedTracks(results);

    }
    finally {
      setLoading(false);
    }
    
  }

  async function createSpotifyPlaylist(name, trackIds) {
    try {
      setLoading(true);

      let trackDiff = playlistTracks.filter(x => !tracksToDelete.includes(x))
                    .concat(tracksToDelete.filter(x => !playlistTracks.includes(x)));
    
    console.log(trackDiff, tracksToDelete);
    let check = await Spotify.getPlaylists();
    check = check.map((item) => item.name)
    console.log(check);
    if (trackDiff.length > 0  && tracksToDelete.length > 0 && check.includes(name)) {
      trackDiff.map(track => {
        if (tracksToDelete.includes(track)) {
          console.log('removing...')
          Spotify.removeTracks([track], name);

        } else {
          console.log('appending to existing playlist...')
          Spotify.savePlaylist(name, [track]);
        }
      })
    } else {
      console.log(trackIds)
      await Spotify.savePlaylist(name, trackIds);
    }
        
    
    const names = await Spotify.getPlaylists();
    setplaylistNames(names);
    setPlaylistTracks([]);

    } finally {
      setLoading(false);
    }
    
  }

  function addTrack(track) {
    setPlaylistTracks(prevTracks => {
      if (prevTracks.includes(track)) {
        return prevTracks;
      }
      else {
        return [...prevTracks, track];
      }
    })
  }

  function removeTrack(track) {
    setPlaylistTracks(prevTracks => prevTracks.filter((t => track !== t)));
    
  }

  async function selectPlaylist(playlist) {
    try {
      setLoading(true);


      console.log(playlist)
      const info = await Spotify.getPlaylist(playlist);
      console.log(info)
      const id_info = {name: info.name, id: info.id};
      setTracksToDelete([]);

      setplaylistName(id_info)
      
      
      const tracks = info.tracks.items.map(track => ({
        id: track.track.id,
        name: track.track.name,
        artist: track.track.artists[0].name,
        album: track.track.album.name
      }))
      console.log(tracks);
      setTracksToDelete(tracks);
      setPlaylistTracks(tracks);
    } finally {
      setLoading(false);
    }
    

  }


  
  


  return (
    <div className="App">
      <header className='header'>
          <h1 className='logo_text'>Ja<span className='special_sym'>mmm</span>ing</h1>
      </header>
      <SearchBar SearchSpotify={SearchSpotify}></SearchBar>
      {loading && <div className="loader-overlay"></div>}
      {loading && <span className="loader"></span>}
      <div className='main'>
        <PlaylistList playlistNames={playlistNames} action={selectPlaylist}></PlaylistList>
        <SearchResults playlistTracks={playlistTracks} tracks={searchedTracks} action={addTrack}></SearchResults>
        <Playlist trackInfo={playlistName} tracks={playlistTracks} action={removeTrack} createPlaylist={createSpotifyPlaylist}></Playlist>
      </div>
      
    </div>
  );
}

export default App;
