import React from "react";
import './Track.css';





const Track = (props) => {
    
    
    return (
        <div className="track">
            <img src={props.track.image} />
            <div className="track_info">
                <div className="line"></div>
                <h3>{props.track.name}</h3>
                <p>{props.track.artist} | {props.track.album}</p>


                {props.track.previewUrl && (
                    <audio  controls>
                      <source src={props.track.previewUrl} type="audio/mp3" />
                      Your browser does not support the audio element.
                    </audio>
                    
                    

                       
                    
                    
                    
                    
                )}
            </div>
            <button onClick={() => props.handleAction(props.track)}>
                {props.actionIcon}
            </button>
            
        </div>
    )
}

export default Track;