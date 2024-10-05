import { useState } from 'react'

function AllForms(){
    const [name, setName] = useState('');

    return(
        <div>
            <h1>Form</h1>
            <div>

                <form>
                    <div className='box'>
                        <label>Name:</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className = 'input-form'
                            required />
                    </div>
                </form>
            </div>
        </div>
    )
}

export default AllForms;
