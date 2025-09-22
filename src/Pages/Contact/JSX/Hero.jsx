// import React from 'react'
// import "../CSS/Contact.css"

// const Hero = () => {
//     return (
//         <div className='contact-main'>
//             <h3>Get in Touch</h3>
//             <h5>We'd love to hear from you</h5>
//             <form>
//                 <input type="text" placeholder='Name' required />
//                 <input type='email' placeholder='Email' required />
//                 <input type='textarea' placeholder='Type your Message..' />
//                 <input type='submit'/>
//             </form>
//             <div className='right'>
//                 <h3>Contact Details</h3>
//                 <p><strong>Phone:</strong> +91 XXXXXXXXXX</p>
//                 <p><strong>Email:</strong> abc@gmail.yes</p>

//                 <p><strong>Address:</strong> Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dignissimos perspiciatis voluptatibus maiores praesentium accusamus illo corporis dicta, quibusdam possimus velit?</p>

//                 <p><strong>Mon - Sat:</strong> 8:00 - 18:00, Sunday Closed</p>


//             </div>

//         </div>
//     )
// }

// export default Hero

import React from 'react'
import "../CSS/Contact.css"

const Hero = () => {
    return (
        <div className='contact-main'>
            <div className='left-section'>
                <h3>Get in Touch</h3>
                <h5>We'd love to hear from you</h5>
                <div className='form-container'>
                    <form>
                        <input type="text" placeholder='Name' required />
                        <input type='email' placeholder='Email' required />
                        <textarea placeholder='Type your Message..' />
                        <input type='submit' value='Submit' />
                    </form>
                </div>
            </div>
            <div className='right-section'>
                <h3>Contact Details</h3>
                <p><strong>Phone:</strong> +91 XXXXXXXXXX</p>
                <p><strong>Email:</strong> abc@gmail.yes</p>
                <p><strong>Address:</strong> Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dignissimos perspiciatis voluptatibus maiores praesentium accusamus illo corporis dicta, quibusdam possimus velit?</p>
                <p><strong>Mon - Sat:</strong> 8:00 - 18:00, Sunday Closed</p>
            </div>
        </div>
    )
}

export default Hero