import React from "react";
import './SearchResults.css'
import Track from "../Track/Track";


const SearchResults = (props) => {
    const filteredTracks = props.tracks.filter(track => (
        !props.playlistTracks.some(playlistTrack => playlistTrack.id === track.id)
      ));


    return (
        <div className="results_area">
            <h2>Results:</h2>
            <div className="tracklist">
                {
                    filteredTracks.map((track) => {
                        return (
                            <Track key={track.id} track={track} actionIcon={<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-lg" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"/>
                          </svg>} handleAction={props.action}>
                            </Track>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default SearchResults;