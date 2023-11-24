import React, {useState, useEffect} from "react";
import './Playlist.css'
import Track from "../Track/Track";


const Playlist = (props) => {
    const [playlistName, setPlaylistName] = useState('');

    
    useEffect(() => {
        try {
            setPlaylistName(props.trackInfo.name || '');
        } catch (error) {
            console.warn(error);
        }
    }, [props.trackInfo]);
    
    

    function handleChange(e) {
        setPlaylistName(e.target.value);
    }

    function handleSubmit() {
        if (playlistName.length > 0) {
            
            const trackIds = props.tracks
            props.createPlaylist(playlistName, trackIds)
            setPlaylistName('');
        }
    }
    return (
        <div className="playlist">
            <input placeholder="Playlist name" value={playlistName} onChange={handleChange} className="playlist_name" type="text" />
            <div className="tracklist-playlist">
            {
                    props.tracks.map((track) => {
                        return (
                            <Track key={track.id} track={track} actionIcon={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dash-lg" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M2 8a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11A.5.5 0 0 1 2 8Z"/>
                          </svg>} handleAction={props.action}>
                            </Track>
                        )
                    })
                }
            </div>
            <button onClick={handleSubmit} type="submit" className="bn632-hover bn18">Save to Spotify</button>
        </div>
    )
}

export default Playlist;