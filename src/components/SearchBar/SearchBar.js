import React, {useState} from 'react';
import './SearchBar.css'

const SearchBar = (props) => {
    const [name, setName] = useState('')

    

    function handleChange(e) {
        setName(e.target.value);
        
        
    }

    async function handleSubmit() {
        if (name.length > 0) {
            try {
                await props.SearchSpotify(name);
                setName('');
                
            } catch (error) {
                console.warn(error)
            }
        }
        
    }

    async function handleKey(e) {
        if (e.key === 'Enter') {
            await handleSubmit()
        }

    }

    return (
        <div className='search_bar'>
            <input onKeyDown={handleKey} placeholder='Song name' typeof='text' className='search_input' type='text' onChange={handleChange} value={name} />
            <button className='bn29' onClick={handleSubmit}>Search</button>
        </div>
    )
}

export default SearchBar;