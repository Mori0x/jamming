const clientId = process.env.REACT_APP_CLIENT_ID; 
const redirectUri = 'https://joyful-lollipop-e097f2.netlify.app/'; // Have to add this to your accepted Spotify redirect URIs on the Spotify API.
let accessToken;
const localStorageKey = 'spotifyAccessToken';
let expirationTime;

class Spotify {
  static getAccessToken() {
    const storedToken = localStorage.getItem(localStorageKey);
    if (storedToken) {
      accessToken = storedToken;
      expirationTime = localStorage.getItem('spotifyExpirationTime');
      if (!this.isTokenExpired()) {
        return accessToken;
      }
    }

    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);

    if (accessTokenMatch && expiresInMatch) {
      accessToken = accessTokenMatch[1];
      const expiresIn = Number(expiresInMatch[1]);
      expirationTime = Date.now() + 5 * 60 * 1000;

      // Store the access token and expiration time in localStorage
      localStorage.setItem(localStorageKey, accessToken);
      localStorage.setItem('spotifyExpirationTime', expirationTime);

      window.history.pushState('Access Token', null, '/');
      return accessToken;
    } else {
      const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
      window.location = accessUrl;
    }
  }

  static isTokenExpired() {
    console.log(Date.now(), expirationTime)
    return Date.now() >= expirationTime;
  }

    static async search(name) {
        const accessToken = this.getAccessToken();
        return await fetch(`https://api.spotify.com/v1/search?type=track&q=${name}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }).then(response => {
          
          return response.json();
        }).then(jsonResponse => {
          console.log(jsonResponse);
          if (!jsonResponse.tracks) {
            return [];
          }
          return jsonResponse.tracks.items.map(track => ({
            id: track.id,
            name: track.name,
            artist: track.artists[0].name,
            album: track.album.name,
            uri: track.uri,
            previewUrl: track.preview_url || null,
            image: track.album.images[0].url
          }));
        });
        
      }

    
    static async newPlaylist(name, trackIds, playListId=false) {
        console.log('Going to newPlaylist()', playListId, trackIds)
        
        if (playListId) {
            console.log('Appendind tracks...')
            const replacePlaylistTracksUrl = `https://api.spotify.com/v1/playlists/${playListId}/tracks`;
            await fetch(replacePlaylistTracksUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`
                },
                body : JSON.stringify({uris: trackIds.map(id => "spotify:track:".concat(id.id))}),
                'position': 0
            });
        }
            
        else {
            console.log('Creating new playlist...')
            const createPlaylistUrl = `https://api.spotify.com/v1/me/playlists`
            const response = await fetch(createPlaylistUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`
                },
                body : JSON.stringify({
                    name: name
                    
                  })
            });
            const jsonResponse = await response.json();
            const playlistId = jsonResponse.id;
            if (playlistId) {
                const replacePlaylistTracksUrl = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
                await fetch(replacePlaylistTracksUrl, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${accessToken}`
                    },
                    body : JSON.stringify({uris: trackIds.map(id => "spotify:track:".concat(id.id))})
                });
            }
        }

    }

    static async getPlaylists() {
      const getPlaylists = `https://api.spotify.com/v1/me/playlists`
        const response = await fetch(getPlaylists, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`
            }
        });
        const jsonResponse = await response.json();
        const names = jsonResponse.items.map(item => ({
          name: item.name,
          id: item.id
          
        }));
        console.log(names);
        return names;



    }


    static async getPlaylist(playListId) {
      const getPlaylists = `https://api.spotify.com/v1/playlists/${playListId}`
        const response = await fetch(getPlaylists, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`
            }
        });
        
        const jsonResponse = await response.json();
        console.log(jsonResponse);
        return jsonResponse;

    }

    static async removeTracks(trackIds, name) {
      console.log(trackIds, name)
      const id = []
      const getPlaylists = `https://api.spotify.com/v1/me/playlists`
        const response = await fetch(getPlaylists, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`
            }
        });
        console.log('Getting playlist info...')
        const jsonResponse = await response.json();

        if (jsonResponse.items.length > 0) {
          console.log('Some playlists found!')
          const names = jsonResponse.items.map(item => item.name);
          if (names.includes(name)) {
              console.log('There is playlist with same name')
              
              jsonResponse.items.map((playlist) => {
                  if (playlist.name === name) {
                      id.push(playlist.id) 
                  }
                  
              
              })
              



          }}


          console.log(id[0])
          const endpoint = `https://api.spotify.com/v1/playlists/${id[0]}/tracks`;
  
          const response_rem = await fetch(endpoint, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`
            },
            body: JSON.stringify({
              tracks: trackIds.map(id => ({ uri: `spotify:track:${id.id}` }))
            })
          });
        
          if (response_rem.ok) {
            console.log('Tracks removed successfully.');
          } else {
            console.error('Error removing tracks:', response_rem.statusText);
          }


    }


    static async savePlaylist(name, trackIds) {
        const getPlaylists = `https://api.spotify.com/v1/me/playlists`
        const response = await fetch(getPlaylists, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`
            }
        });
        console.log('Getting playlist info...')
        const jsonResponse = await response.json();
        if (jsonResponse.items.length > 0) {
            console.log('Some playlists found!')
            const names = jsonResponse.items.map(item => item.name);
            if (names.includes(name)) {
                console.log('There is playlist with same name')
                const id = []
                jsonResponse.items.map((playlist) => {
                    if (playlist.name === name) {
                        id.push(playlist.id) 
                    }
                    
                
                })
                console.log(id);
                this.newPlaylist(name, trackIds, id[0])



            } else {
                console.log('There is no playlists with same name')
                this.newPlaylist(name, trackIds)
            }



        } else {
            console.log('0 Playlist found...')
            this.newPlaylist(name, trackIds)

        }






        
}}

export default Spotify;